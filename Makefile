# Commands for the repository. They only call the real tools, and hold no build logic (decision 0006).
# Must work with GNU Make 3.81, the version that ships with macOS.

IMAGE := aurum-ds
# pnpm's package store, kept in a volume so an install downloads nothing twice.
STORE := aurum-ds-pnpm-store

.PHONY: help install
.DEFAULT_GOAL := help

##@ Development

help: ## List the targets
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5); next} \
		/^[a-z-]+:.*## / {printf "  %-14s %s\n", $$1, $$2}' $(firstword $(MAKEFILE_LIST))

install: ## After changing package.json: install in a container, updating pnpm-lock.yaml and node_modules
	docker build -f infra/Dockerfile --target base -t $(IMAGE):base .
	docker run --rm -v "$(CURDIR)":/app -v $(STORE):/pnpm-store $(IMAGE):base \
		pnpm install --store-dir /pnpm-store
