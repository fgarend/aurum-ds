# 0051. The package on the release page

- Status: Accepted
- Date: 2026-11-02

## Context

The app installs the package from GitHub at a release's tag (decision 0037),
as `github:fgarend/aurum-ds#vX.Y.Z`. pnpm resolves that tag with
`git ls-remote`, and the app's web image has no `git`. Tried with pnpm without
`git` on its path:

- **`github:` at a tag** fails: `git` is not found.
- **`github:` at a commit** installs, with only the files `files` lists.
- **The tag's tarball from `codeload.github.com`** installs, but it is the
  whole repository, 9.7 MB: pnpm applies `files` only when it packs a git
  dependency itself, not to a tarball it is given.

Release immutability is on for the repository: once a release is published,
GitHub refuses to add, replace or delete its assets, or to move its tag.

## Decision

- **Each release page carries the packed package**,
  `fgarend-aurum-ds-X.Y.Z.tgz`, the name `pnpm pack` gives. The app installs
  it by URL, without `git`:
  `https://github.com/fgarend/aurum-ds/releases/download/vX.Y.Z/fgarend-aurum-ds-X.Y.Z.tgz`.
- **The `release` workflow packs the commit it checked and tagged**, with
  `make release-package`, which writes the tarball on standard output and
  nothing else, as `make release-notes` does, so the code stays mounted
  read-only. `gh release create` attaches it when it publishes the page
  (decision 0049).
- **A test checks the workflow** packs the package, under the name pnpm gives
  it, and attaches it to the page.
- **`v0.1.0`, released before this decision, keeps no package**, since its
  release is immutable. Until the next release, the app installs it by its
  commit.

This adds to decisions 0037 and 0049, which it does not replace: the
`github:` form at a tag still works where `git` exists.

## Alternatives considered

- **The tag's tarball from `codeload.github.com`.** No step to add, but the
  app receives the whole repository, against decision 0037's `files`.
- **`github:` at a commit.** No `git` and only the files listed, but the app
  names a hash instead of a version.
- **A compose service with a folder it may write**, for `pnpm pack` to write
  the tarball into. A file instead of a stream, but a second place a checking
  container writes.

## Consequences

- The app installs a release with no `git`, and receives only what `files`
  lists.
- A package attached to a release can never change, as its tag can never
  move.
- The first release with a package is published before the app can install it
  by its URL: if that install fails, the fix is a new version.
