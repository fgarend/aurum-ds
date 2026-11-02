# Commands for the repository. They only call the real tools, and hold no build logic (decision 0006).
# Each runs in a container that infra/compose.yaml describes, with the values of infra/settings.env (decision 0043).
# Must work with GNU Make 3.81, the version that ships with macOS.

COMPOSE := docker compose --env-file infra/settings.env -f infra/compose.yaml
RUN := $(COMPOSE) run --rm
# The project's name, as infra/compose.yaml gives it. Compose marks every image it builds with it (decision 0043).
PROJECT := $(shell sed -n 's/^name: //p' infra/compose.yaml)

.PHONY: help install format tokens test watch screenshots reference prototype pack clean outdated audit
.DEFAULT_GOAL := help

##@ Development

help: ## List the targets
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5); next} \
		/^[a-z-]+:.*## / {printf "  %-14s %s\n", $$1, $$2}' $(firstword $(MAKEFILE_LIST))

install: ## After changing package.json: install in a container, updating pnpm-lock.yaml and node_modules
	$(COMPOSE) build install
	$(RUN) install pnpm install --store-dir /pnpm-store

format: ## Format the files and apply the safe lint fixes, in place
	$(COMPOSE) build tools-write
	$(RUN) tools-write pnpm exec biome check --write

tokens: ## After changing src/tokens/tokens.json: write src/tokens/tokens.css, which is never edited by hand
	$(COMPOSE) build tools-write
	$(RUN) tools-write node scripts/build-tokens/main.ts

test: ## Run every check, from the lockfile and the repository: lint and format, types, tests, then browser tests
	$(COMPOSE) build tools browser
	$(RUN) tools pnpm exec biome ci --error-on-warnings
	$(RUN) tools pnpm exec tsc
	$(RUN) tools pnpm exec tsc -p tsconfig.node.json
	$(RUN) tools pnpm exec tsc -p tsconfig.browser.json
	$(RUN) tools pnpm exec vitest run --project node --project dom
	$(RUN) browser pnpm exec vitest run --project browser

watch: ## Run the tests again on every change, until stopped with q or Ctrl+C. Browser tests run in make test
	$(COMPOSE) build tools
	$(RUN) tools pnpm exec vitest --project node --project dom

screenshots: ## Write the browser tests' screenshots again, to review and approve a visual change in the diff
	$(COMPOSE) build browser-write
	$(RUN) browser-write sh -c \
		'find src -type d -name __screenshots__ -prune -exec rm -rf {} + && \
		pnpm exec vitest run --project browser --update'

reference: ## Render the artifact's previews and the prototype's screens into reference/screenshots, to review
	$(COMPOSE) build browser-write
	$(RUN) browser-write pnpm exec vitest run --project reference

prototype: ## Serve the prototype's screens at http://localhost:5173 (PROTOTYPE_PORT), until stopped with Ctrl+C
	$(COMPOSE) build prototype
	$(RUN) --service-ports prototype sh -c \
		'pnpm exec vite reference/prototype --host 0.0.0.0 --port "$$PROTOTYPE_PORT" --strictPort'

pack: ## Before a release: pack the package, install it in a throwaway app and import every export
	$(COMPOSE) build tools
	$(RUN) tools node scripts/check-package.ts /pnpm-store

clean: ## Remove the project's images, tagged or not. Keeps node_modules and the caches
	docker image prune --all --force --filter label=com.docker.compose.project=$(PROJECT)

##@ Dependencies

outdated: ## List the dependencies and pinned images with a newer version past the release age. Fails when there is one, or on an error
	$(COMPOSE) build tools
	status=0; \
	$(RUN) tools pnpm outdated || status=1; \
	$(RUN) tools node scripts/check-images.ts || status=1; \
	exit $$status

audit: ## List the known vulnerabilities in the dependencies, of any severity. Fails when there is one, or on an error
	$(COMPOSE) build tools
	$(RUN) tools pnpm audit
