# 0062. The gallery on GitHub Pages

- Status: Accepted; partly superseded by 0067: the gallery built in the job that checks
- Date: 2026-11-03

## Context

The gallery of components, Storybook (decision 0057), was served only on the
machine, by `make storybook`. The app's developers and anyone comparing a
screen with the design need it without cloning the repository. Storybook
builds the gallery as a static site, and GitHub Pages serves one per
repository, published by GitHub's own actions. The repository is public, and
on GitHub's free plan Pages is public too.

## Decision

- **`make storybook-build` builds the gallery into `storybook-static/`**,
  not versioned, the one more folder the tools' container may write. It
  empties it first, since the container cannot.
- **Each release publishes its gallery on GitHub Pages**, replacing the
  previous one, so Pages shows the latest version only.
- **The gallery is built before the tag**, in a job of the `release`
  workflow after the checks, and the tag waits for it: no release is made
  without its gallery. A last job publishes it, after the tag.
- **Only that last job may write to Pages** (`pages: write`, `id-token:
  write`), in the `github-pages` environment, as `deploy-pages` asks.
- **GitHub's actions `upload-pages-artifact` and `deploy-pages`**, pinned by
  commit as every action (decision 0046). `configure-pages` is left out: the
  gallery's paths are relative, so it needs no base path.
- **Pages takes its site from GitHub Actions**, a setting of the repository
  turned on once with `gh` (`docs/releasing.md`); a workflow's token cannot.

## Alternatives considered

- **Publishing after the tag only, as first planned.** One job fewer, but a
  release left without its gallery when the build fails.
- **Building the gallery in `make check`.** A broken build seen on every
  push, but every check slower for what only a release publishes.
- **A gallery per version.** Every release browsable, but a folder per
  version to keep, for one app that moves to the latest.
- **Pages from a branch.** No environment, but built files committed to the
  repository.

## Consequences

- The gallery is public at `https://fgarend.github.io/aurum-ds/` from the
  first release after Pages is turned on.
- A build that breaks shows only when releasing, and stops the release
  before its tag.
- Rolldown warns, building, that Lucide's `"use client"` directives are not
  kept; they mean nothing outside React Server Components.
