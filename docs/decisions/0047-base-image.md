# 0047. The base image

- Status: Accepted
- Date: 2026-11-02

## Context

The environment started from the Node image, and its browser layer
installed the browsers' system packages from Debian as it was on the Node
image's date, through `snapshot.debian.org` (decisions 0043 and 0045). The
second run of continuous integration, with no cache and three browsers'
packages to fetch, failed after twelve minutes: the snapshot service answered
dozens of requests with "503 Too Many Requests, no healthy backends". It is a
community service with no promise of availability, and every build without a
cache depends on it.

## Decision

- **Every layer starts from Playwright's official image**, pinned by tag and
  digest as `PLAYWRIGHT_IMAGE` in `infra/settings.env`. It brings Node, the
  three browsers and their system packages, frozen by the digest, so a build
  installs nothing from the system's sources.
- **Two layers remain:** `base` (Playwright's image with pnpm) and `deps`
  (the dependencies).
- **Node is the one Playwright's image ships**, on the active LTS line, and
  no longer pinned on its own.
- **The image and the `playwright` package move together**, and a check in
  `test/` fails while their versions differ, as one does for pnpm's image and
  `packageManager`.
- **Four services remain in Compose:** `tools` (checking, with pnpm's store
  and `.vitest-attachments/` writable), `tools-write`, `install` and
  `prototype`. With one image, the browser services were the same as the
  tools'.
- **The image report checks Playwright's image instead of Node's.**

This replaces decision 0043's Node image, Debian snapshot and six services,
and decision 0045's browsers installed into the image.

## Alternatives considered

- **Keeping the snapshot, with retries and a cache.** Fewer failures, but
  the dependency returns each time the cache is lost.
- **Building the image once and publishing it to GitHub's registry.** The
  most robust, but a workflow with write access and more parts.
- **Browser packages from Debian at build time, unpinned.** Reliable to
  fetch, but a rebuild could draw the screenshots differently.

## Consequences

- The screenshots came back byte for byte the same as before decision 0043,
  drawn by the same image digest months later.
- Every command runs in an image of about 4 GB, pulled once per machine and
  per run of continuous integration.
- Node moves only when Playwright's image does.
