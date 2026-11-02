# 0018. Image report

- Status: Accepted; partly superseded by 0039: where the script lives, and by 0043: where the pins are read
- Date: 2026-11-01

## Context

`make outdated` lists dependencies past the release age (decision 0011), but
not the images pinned by hand in the `Dockerfile`: Node and pnpm. Updating one
means finding a version old enough, an image tag that exists for it, and that
tag's digest. An official image can also be rebuilt under the same version,
usually with system fixes.

## Decision

- **A script reports the pinned images**, and `make outdated` runs it after
  pnpm's report. Both always run, and the target fails if either finds
  something or errs.
- **What counts as newer:**
  - **Node:** the pinned line, or a newer line once it is LTS (decision 0007),
    dated by `nodejs.org`.
  - **pnpm:** any line, stable versions only, dated by the npm registry.
  - Either way, only versions past the release age (decision 0009).
- **A version is reported only when its image tag exists**, with the tag's
  digest, so the line can be copied into the `Dockerfile`. Tags come from
  Docker Hub for Node and from GHCR, with an anonymous token, for pnpm.
- **The same version with a new digest is reported as rebuilt.**
- **The script is TypeScript, run by Node as it is**, in `infra/`, next to the
  `Dockerfile` it reads. It has its own `tsconfig.json`, which adds Node's
  types, so they never reach the library code.
- **It is tested without the network:** `fetch` and the current date are
  passed in, and the tests answer with fictitious data in each source's
  shape.
- **An image the script does not know fails it**, so a new pin cannot go
  unchecked.

## Alternatives considered

- **Versions only, digests by hand.** A simpler script, but the update still
  needs a manual lookup.
- **A shell script with `curl`.** Nothing to install, but no real tests.
- **A `scripts/` folder.** A common name, but apart from the `Dockerfile` the
  script reads.
- **Node's types in the main `tsconfig.json`.** One file less, but Node's
  globals would reach the browser code (decision 0013).
- **Stopping at the first failing report.** A simpler recipe, but the images
  would only show once the dependencies are up to date.

## Consequences

- `@types/node` follows the Node line of the image.
- A change in a source's answer fails `make outdated` with an error, since
  the tests cannot see it.
- `make test` checks the scripts' types with their own `tsconfig.json`.
