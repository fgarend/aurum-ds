# Commands for the repository. They only call the real tools, and hold no build logic (decision 0006).
# Must work with GNU Make 3.81, the version that ships with macOS.

IMAGE := aurum-ds
# The label every project image carries (decision 0022).
SOURCE := https://github.com/fgarend/aurum-ds
# pnpm's package store, kept in a volume so an install downloads nothing twice.
STORE := aurum-ds-pnpm-store

.PHONY: help install format tokens test watch screenshots reference prototype pack clean outdated audit
.DEFAULT_GOAL := help

##@ Development

help: ## List the targets
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5); next} \
		/^[a-z-]+:.*## / {printf "  %-14s %s\n", $$1, $$2}' $(firstword $(MAKEFILE_LIST))

install: ## After changing package.json: install in a container, updating pnpm-lock.yaml and node_modules
	docker build -f infra/Dockerfile --target base -t $(IMAGE):base .
	docker run --rm -v "$(CURDIR)":/app -v $(STORE):/pnpm-store $(IMAGE):base \
		pnpm install --store-dir /pnpm-store

format: ## Format the files and apply the safe lint fixes, in place
	docker build -f infra/Dockerfile --target base -t $(IMAGE):base .
	docker run --rm -v "$(CURDIR)":/app $(IMAGE):base pnpm exec biome check --write

tokens: ## After changing src/tokens/tokens.json: write src/tokens/tokens.css, which is never edited by hand
	docker build -f infra/Dockerfile --target test -t $(IMAGE):test .
	docker run --rm -v "$(CURDIR)":/app -v /app/node_modules $(IMAGE):test node scripts/build-tokens/main.ts

test: ## Run every check, from the lockfile and the repository: lint and format, types, tests, then browser tests
	docker build -f infra/Dockerfile --target test -t $(IMAGE):test .
	docker run --rm $(IMAGE):test pnpm exec biome ci --error-on-warnings
	docker run --rm $(IMAGE):test pnpm exec tsc
	docker run --rm $(IMAGE):test pnpm exec tsc -p tsconfig.node.json
	docker run --rm $(IMAGE):test pnpm exec tsc -p tsconfig.browser.json
	docker run --rm $(IMAGE):test pnpm exec vitest run --project node --project dom
	docker build -f infra/Dockerfile --target browser -t $(IMAGE):browser .
	docker run --rm $(IMAGE):browser pnpm exec vitest run --project browser

watch: ## Run the tests again on every change, until stopped with q or Ctrl+C. Browser tests run in make test
	docker build -f infra/Dockerfile --target test -t $(IMAGE):test .
	docker run --rm -it -v "$(CURDIR)":/app -v /app/node_modules $(IMAGE):test \
		pnpm exec vitest --project node --project dom

screenshots: ## Write the browser tests' screenshots again, to review and approve a visual change in the diff
	docker build -f infra/Dockerfile --target browser -t $(IMAGE):browser .
	docker run --rm -v "$(CURDIR)":/app -v /app/node_modules $(IMAGE):browser sh -c \
		'find src -type d -name __screenshots__ -prune -exec rm -rf {} + && \
		pnpm exec vitest run --project browser --update'

reference: ## Render the artifact's previews and the prototype's screens into reference/screenshots, to review
	docker build -f infra/Dockerfile --target browser -t $(IMAGE):browser .
	docker run --rm -v "$(CURDIR)":/app -v /app/node_modules $(IMAGE):browser \
		pnpm exec vitest run --project reference

prototype: ## Serve the prototype's screens at http://localhost:5173, until stopped with Ctrl+C
	docker build -f infra/Dockerfile --target test -t $(IMAGE):test .
	docker run --rm --init -p 5173:5173 -v "$(CURDIR)":/app:ro -v /app/node_modules $(IMAGE):test \
		pnpm exec vite reference/prototype --host 0.0.0.0 --port 5173 --strictPort

pack: ## Before a release: pack the package, install it in a throwaway app and import every export
	docker build -f infra/Dockerfile --target base -t $(IMAGE):base .
	docker run --rm -v "$(CURDIR)":/app:ro -v $(STORE):/pnpm-store $(IMAGE):base node scripts/check-package.ts /pnpm-store

clean: ## Remove the project's images, tagged or not. Keeps node_modules and the caches
	docker image prune --all --force --filter label=org.opencontainers.image.source=$(SOURCE)

##@ Dependencies

outdated: ## List the dependencies and pinned images with a newer version past the release age. Fails when there is one, or on an error
	docker build -f infra/Dockerfile --target base -t $(IMAGE):base .
	status=0; \
	docker run --rm -v "$(CURDIR)":/app $(IMAGE):base pnpm outdated || status=1; \
	docker run --rm -v "$(CURDIR)":/app $(IMAGE):base node scripts/check-images.ts || status=1; \
	exit $$status

audit: ## List the known vulnerabilities in the dependencies, of any severity. Fails when there is one, or on an error
	docker build -f infra/Dockerfile --target base -t $(IMAGE):base .
	docker run --rm -v "$(CURDIR)":/app $(IMAGE):base pnpm audit
