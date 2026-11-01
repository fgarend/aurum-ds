# 0007. Container runtime and images

- Status: Accepted; partly superseded by 0008: npm from the image
- Date: 2026-11-01

## Context

Building, testing and running happen only inside containers, and the
development machine is a Mac. Images must be built the same way every time,
and what enters them must be trusted: a base image that changes silently is a
supply chain risk.

## Decision

- **Runtime on macOS: OrbStack.** Images follow the open container standard,
  so the runtime can be replaced without changing the repository.
- **One `Dockerfile`, in `infra/`**, with stages added by the roadmap items
  that need them. The folder is named by its role, not by its tool. The build
  context is the repository root, and what it leaves out is listed in
  `infra/Dockerfile.dockerignore`, next to the `Dockerfile`.
- **Base image: the official Node image**, on the active LTS line, in its
  Debian slim variant.
- **Pinned by exact tag and digest**, as in
  `node:<exact version>-trixie-slim@sha256:<digest>`. The tag keeps it
  readable, the digest makes it immutable.
- **npm comes from the image.**

## Alternatives considered

- **Docker Desktop.** Heavier on macOS.
- **Colima.** Command line only, and more work to run.
- **The `Dockerfile` at the root.** The most common place, but the root would
  collect infrastructure next to the package's own files.
- **A `docker/` folder.** Named after the tool, so it would be wrong if the
  tool changed.
- **The image by its major line** (`26-trixie-slim`). Security fixes would
  arrive on their own, but the image could change between two builds with no
  change in the repository.
- **The image by exact tag only.** A tag can be pushed again with different
  content.
- **Alpine.** Smaller, but the browsers of the visual tests do not support it.

## Consequences

- Updating the base image is a deliberate change: a new exact tag and its
  digest, in a commit.
- Security fixes to the base image do not arrive on their own. Checking for
  them is a recurring task, deferred in the roadmap.
