# 0011. Dependency report

- Status: Accepted
- Date: 2026-11-01

## Context

Updates are only taken past the release age (decision 0009), so a report must
show what can be updated now, for the dependencies and for the images pinned
by hand. pnpm's own report already applies the release age to dependencies,
but it does not look at the `Dockerfile`.

## Decision

- **`make outdated` runs `pnpm outdated` in a container.** It lists only
  versions past the release age.
- **It fails when there is something to look at:** a newer version, or an
  error. pnpm gives both the same exit code, and its output says which.
- **The images pinned by hand are added to the same command later** (roadmap
  item 2.14), by a script with tests, once tests exist.

## Alternatives considered

- **Renovate, run locally.** One tool for everything, but its local mode is
  experimental and only writes logs; it ages images from their last push, not
  from the release of their version, and cannot age images on GHCR, where
  pnpm's is.
- **A script for the images right away.** Code with no tests, or a test
  runner chosen before its own roadmap item.
- **Always exiting with 0.** No error on screen when there are updates, but a
  real failure would go unnoticed.

## Consequences

- Until item 2.14, the images are checked by hand when they are updated.
- An automatic check can later run `make outdated` and treat a failure as
  "needs attention".
