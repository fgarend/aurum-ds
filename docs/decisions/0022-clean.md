# 0022. Clean

- Status: Accepted
- Date: 2026-11-01

## Context

Each target builds the project's images, which take space and are rebuilt on
demand. Two caches save downloads: pnpm's store volume, used by
`make install`, and the build cache, which is shared by every project on the
machine and cannot be cleared for one project alone.

## Decision

- **Every image of the project carries the OCI source label**
  (`org.opencontainers.image.source`), set in the `Dockerfile`.
- **`make clean` removes every image with that label**, tagged or not, and no
  other.
- **It keeps the host's `node_modules`**, which the editor and `make format`
  use, and both caches, so the next build downloads nothing again.
- **The caches are cleared by hand when needed:**
  `docker volume rm aurum-ds-pnpm-store` for pnpm's store, and
  `docker builder prune` for the build cache, which clears it for the whole
  machine.

## Alternatives considered

- **Removing the `aurum-ds:*` tags only.** No label, but an image left without
  a tag would stay behind.
- **Removing `node_modules` too.** A full reset, but the editor loses its
  types and `make format` fails until `make install`.
- **A target that clears the caches.** One command, but the build cache can
  only be cleared for the whole machine, and the store alone saves little.

## Consequences

- The label's value is written in the `Dockerfile` and in the `Makefile`, and
  both change together.
- After `make clean`, the next target rebuilds its image from the caches.
