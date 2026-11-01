# Commands for the repository. They only call the real tools, and hold no build logic (decision 0006).
# Must work with GNU Make 3.81, the version that ships with macOS.

IMAGE := aurum-ds
# pnpm's package store, kept in a volume so an install downloads nothing twice.
STORE := aurum-ds-pnpm-store

.PHONY: help install format test outdated audit
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

test: ## Run every check, from the lockfile and the repository: lint and format, types, then tests
	docker build -f infra/Dockerfile --target test -t $(IMAGE):test .
	docker run --rm $(IMAGE):test pnpm exec biome ci --error-on-warnings
	docker run --rm $(IMAGE):test pnpm exec tsc
	docker run --rm $(IMAGE):test pnpm exec tsc -p infra
	docker run --rm $(IMAGE):test pnpm exec vitest run

##@ Dependencies

outdated: ## List the dependencies and pinned images with a newer version past the release age. Fails when there is one, or on an error
	docker build -f infra/Dockerfile --target base -t $(IMAGE):base .
	status=0; \
	docker run --rm -v "$(CURDIR)":/app $(IMAGE):base pnpm outdated || status=1; \
	docker run --rm -v "$(CURDIR)":/app $(IMAGE):base node infra/outdated-images.ts || status=1; \
	exit $$status

audit: ## List the known vulnerabilities in the dependencies, of any severity. Fails when there is one, or on an error
	docker build -f infra/Dockerfile --target base -t $(IMAGE):base .
	docker run --rm -v "$(CURDIR)":/app $(IMAGE):base pnpm audit
