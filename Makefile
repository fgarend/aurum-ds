# Commands for the repository. They only call the real tools, and hold no build logic (decision 0006).
# Must work with GNU Make 3.81, the version that ships with macOS.

.PHONY: help
.DEFAULT_GOAL := help

##@ Development

help: ## List the targets
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5); next} \
		/^[a-z-]+:.*## / {printf "  %-14s %s\n", $$1, $$2}' $(firstword $(MAKEFILE_LIST))
