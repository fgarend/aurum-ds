# 0014. Test command

- Status: Accepted; partly superseded by 0043: the test stage, and by 0044: the list of checks and the first failure
- Date: 2026-11-01

## Context

`make test` must prove that the code works with the dependencies the lockfile
describes, not with whatever is in the local `node_modules`. It gains a check
with each tool that arrives: types, lint, format, unit and component tests.

## Decision

- **The checks run in the project's own image.** A `deps` stage installs from
  the lockfile with `--frozen-lockfile`, and a `test` stage adds the sources.
  `make test` builds it and runs the checks in a container, so they run every
  time, even when the build comes from the cache.
- **An out-of-date lockfile fails the build.**
- **pnpm's store is a build cache** (`RUN --mount=type=cache`): a change to the
  lockfile downloads only what is new, and the cache does not enter the image.
- **The checks are listed in the `Makefile`**, one line each, calling the real
  tool (decision 0006). The first failure stops the run.

## Alternatives considered

- **The repository mounted, as `make outdated` does.** No extra stage, but it
  uses the local `node_modules`, which may not match the lockfile, and needs
  `make install` first.
- **A `test` script in `package.json`.** One command for all checks, but one
  more layer, and the commands would live in two places.
- **No build cache.** Simpler, but every change to the lockfile downloads
  everything again.

## Consequences

- `make test` needs nothing on the host but the container runtime, as a CI
  would.
- The build cache is separate from the volume that `make install` uses, so a
  package may be downloaded once for each. `docker builder prune` clears it.
