# Commands for the repository. They only call the real tools, and hold no build logic (decision 0006).
# Each target runs the package.json script of the same name in the service of infra/compose.yaml it picks, with the
# values of infra/settings.env (decisions 0043 and 0044). A target that joins others runs them all, and fails at the end
# if any failed. Must work with GNU Make 3.81, the version that ships with macOS.

COMPOSE := docker compose --env-file infra/settings.env -f infra/compose.yaml
RUN := $(COMPOSE) run --rm
# The project's name, as infra/compose.yaml gives it. Compose marks every image it builds with it (decision 0043).
PROJECT := $(shell sed -n 's/^name: //p' infra/compose.yaml)

.PHONY: help check lint types test test-repository test-browser pack install format tokens watch screenshots \
	reference prototype images clean outdated outdated-deps outdated-pins audit
.DEFAULT_GOAL := help

help: ## List the targets
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5); next} \
		/^[a-z-]+:.*## / {printf "  %-16s %s\n", $$1, $$2}' $(firstword $(MAKEFILE_LIST))

##@ Checks

check: ## Run every check below, before a commit: what continuous integration runs
	@$(MAKE) --no-print-directory -k lint types test test-repository test-browser pack

lint: ## Formatting and lint rules, with Biome
	$(COMPOSE) build tools
	$(RUN) tools pnpm run lint

types: ## The types, with TypeScript
	$(COMPOSE) build tools
	$(RUN) tools pnpm run types

test: ## The tests of the code, in Node and in a simulated DOM
	$(COMPOSE) build tools
	$(RUN) tools pnpm run test

test-repository: ## The checks of the repository as a whole, in test/
	$(COMPOSE) build tools
	$(RUN) tools pnpm run test-repository

test-browser: ## The tests in a real browser
	$(COMPOSE) build browser
	$(RUN) browser pnpm run test-browser

pack: ## Pack the package, install it in a throwaway app and import every export
	$(COMPOSE) build tools
	$(RUN) tools pnpm run pack

##@ Development

install: ## After changing package.json: install in a container, updating pnpm-lock.yaml and node_modules
	$(COMPOSE) build install
	$(RUN) install pnpm install --store-dir /pnpm-store

format: ## Format the files and apply the safe lint fixes, in place
	$(COMPOSE) build tools-write
	$(RUN) tools-write pnpm run format

tokens: ## After changing src/tokens/tokens.json: write src/tokens/tokens.css, which is never edited by hand
	$(COMPOSE) build tools-write
	$(RUN) tools-write pnpm run tokens

watch: ## Run the tests of the code again on every change, until stopped with q or Ctrl+C
	$(COMPOSE) build tools
	$(RUN) tools pnpm run watch

screenshots: ## Write the approved screenshots again, to review and approve a visual change in the diff
	$(COMPOSE) build browser-write
	$(RUN) browser-write pnpm run screenshots

reference: ## Render the artifact's previews and the prototype's screens into reference/screenshots, to review
	$(COMPOSE) build browser-write
	$(RUN) browser-write pnpm run reference

prototype: ## Serve the prototype's screens at http://localhost:5173 (PROTOTYPE_PORT), until stopped with Ctrl+C
	$(COMPOSE) build prototype
	$(RUN) --service-ports prototype pnpm run prototype

images: ## Build the images every command runs in
	$(COMPOSE) build

clean: ## Remove the project's images, tagged or not. Keeps node_modules and the caches
	docker image prune --all --force --filter label=com.docker.compose.project=$(PROJECT)

##@ Dependencies

outdated: ## Both reports below. Fails when either finds something, or on an error
	@$(MAKE) --no-print-directory -k outdated-deps outdated-pins

outdated-deps: ## The dependencies with a newer version past the release age
	$(COMPOSE) build tools
	$(RUN) tools pnpm run outdated-deps

outdated-pins: ## The images pinned in infra/settings.env with a newer version past the release age, or rebuilt
	$(COMPOSE) build tools
	$(RUN) tools pnpm run outdated-pins

audit: ## The known vulnerabilities in the dependencies, of any severity. Fails when there is one, or on an error
	$(COMPOSE) build tools
	$(RUN) tools pnpm run audit
