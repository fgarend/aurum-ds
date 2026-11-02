# 0040. Release process

- Status: Accepted; partly superseded by 0048: the tag made by hand, and by 0049: no release pages
- Date: 2026-11-02

## Context

Decision 0004 sets the numbers, the tags and the changelog, but not the steps
of a release, nor how something public is retired, nor what to do when a
release breaks the app by mistake. Mature design systems were surveyed from
their own repositories (GOV.UK Frontend, Primer, Carbon, MUI, Polaris, Radix,
React Spectrum, Atlassian, USWDS). Most keep a written release checklist,
check the package before publishing, deprecate before removing, and fix a
broken release with a new one. This package has one consumer, installs from a
git tag (decision 0037) and has no CI.

## Decision

- **The steps live in `docs/releasing.md`**, in the order they are made,
  like the update routine.
- **The package is checked before the tag:** `make test` and `make pack`
  pass (decision 0038), and the files the app receives are compared with the
  previous tag, so the changelog tells every change.
- **The app tests the release before the tag exists:** the release commit is
  pushed, the app installs it by its commit and runs its tests, and only then
  is the tag made and pushed. A published tag is never moved (decision 0004),
  so it only goes on a commit the app has proven.
- **Something public is deprecated before it is removed:** marked
  `@deprecated` in the code and listed under `Deprecated` in the changelog,
  then removed in the next version that may break. There is no fixed wait.
- **A release that breaks by mistake is undone by a new version**, released
  at once, and marked `[YANKED]` in the changelog, as Keep a Changelog
  describes. A wanted change comes back later in a version that may break.
- **No GitHub Releases and no release candidates.**

## Alternatives considered

- **A `make release` that does every step.** One command, but testing in the
  app and reviewing the changelog cannot be automated.
- **The steps in the README.** One file less, but the README is for those who
  use the package, not those who release it.
- **`make pack` alone, without comparing with the previous tag.** Proves the
  app can import every export, but not that the changelog tells every change.
- **Testing in the app after the tag.** One step fewer, but a broken tag
  would stay published.
- **A fixed deprecation period.** Predictable for many consumers, but with
  one, the app shows when the thing is no longer used.
- **GitHub Releases.** Most of the systems surveyed publish them, but they
  would repeat the changelog, which the app receives inside the tag.
- **Release candidates (`-rc.N`).** Give many consumers a window to test,
  which testing by commit already gives the one app.

## Consequences

- A release takes a step in the app's repository before its tag.
- The release commit reaches GitHub before its tag, as a plain commit.
- Every removal waits for a version that may break, after a version that
  deprecated it.
