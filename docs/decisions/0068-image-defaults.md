# 0068. The images' defaults in the Dockerfile

- Status: Accepted
- Date: 2026-11-03

## Context

The images the environment starts from are pinned in `infra/settings.env`
(decision 0043), where they are read and changed, and Compose passes them to
the Dockerfile's arguments, stopping when one is missing. The arguments had
no default, so Docker's build check `InvalidDefaultArgInFrom` warned on every
build, in every step of continuous integration: an argument used in a `FROM`
with no default may leave the base image empty. Tried: with a default in the
Dockerfile, Compose still passes the pinned image from the settings, a value
given on the command line still wins for that run, and a missing one still
stops the build.

## Decision

- **Each argument defaults to its image's family, with no version**:
  `mcr.microsoft.com/playwright` and `ghcr.io/pnpm/pnpm`. The default is never
  used; it is there so the check finds a base image.
- **The images in use stay pinned in `infra/settings.env` only**, by tag and
  digest. A check in `test/` refuses a version in the Dockerfile's defaults,
  which would be a second pin.

## Alternatives considered

- **Skipping the check** (`# check=skip=InvalidDefaultArgInFrom`). One line,
  but a check turned off.
- **The pinned images as the defaults, out of the settings.** One place, but
  the settings no longer where the image in use is read and changed.
- **The pinned images in both.** The check passes, but each image pinned
  twice.
- **A major version as the default.** Closer to the image in use, but
  Playwright publishes no such tag, and pnpm's `12` is already a newer 12.

## Consequences

- A build warns only when another check finds something.
- A `docker build` run by hand, without Compose, takes each image's latest
  version, which the `playwright` package and `packageManager` do not match:
  the commands of the repository always go through Compose.
