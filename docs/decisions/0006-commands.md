# 0006. Commands

- Status: Accepted
- Date: 2026-11-01

## Context

Everything is built, tested and run in containers. The development machine is
a Mac, and nothing beyond the container runtime and a command runner is
installed on it. Every command must be found in one place and read the same
way, whatever tool it calls.

## Decision

- **Make is the command runner**, in the version that ships with macOS (GNU
  Make 3.81). The `Makefile` uses no feature from later versions.
- **The `Makefile` only calls the real tools**, and holds no build logic.
- **`help` is the default target**, so `make` alone lists the targets,
  grouped in sections marked `##@`.
- **Every target has a `## ` comment**, which `help` reads to list it.
- **Each target arrives with the tool it calls**, in the roadmap item that
  introduces that tool.

## Alternatives considered

- **just or Task.** A more modern syntax, but one more tool to install on the
  machine.
- **npm scripts.** They need Node on the machine.
- **Loose shell scripts.** No single entry point and no uniform list.
- **A `help` written by hand.** No `awk` needed, but the list and the targets
  could drift apart.

## Consequences

- `make` shows what can be done at any point.
- Makefiles are indented with tabs, which `.editorconfig` sets for them.
