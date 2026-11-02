# 0049. Release pages

- Status: Accepted
- Date: 2026-11-02

## Context

Decision 0040 left out GitHub's release pages: written by hand, they would
repeat the changelog and could drift from it. Since then, a workflow creates
each tag (decision 0048), and it can write the page itself. With no page, the
repository on GitHub showed no release, though `v0.1.0` existed.

## Decision

- **The `release` workflow publishes a release page for each tag**, titled
  `vX.Y.Z`, after it creates the tag.
- **Its notes are the version's section of `CHANGELOG.md`**, without the
  heading, taken by `scripts/extract-release-notes.ts`, which fails when the
  section is missing or empty. The page is never written by hand, so it never
  differs from the changelog.
- **`make release-notes VERSION=X.Y.Z` prints those notes and nothing else**
  on standard output, so the workflow can keep them in a file.
- **`v0.1.0`, released before this decision, gets its page once**, from the
  same notes.

This replaces decision 0040's choice of no release pages.

## Alternatives considered

- **No release page**, as decision 0040 had it. Nothing to add, but the
  repository's page shows no version.
- **Pages written by hand.** Free to word them for the page, but a second
  copy of the changelog to keep alike.
- **GitHub's generated notes**, from the pull requests and commits. No
  script, but notes written for developers, not for the app (decision 0004).

## Consequences

- Each version shows on the repository's page, with its notes.
- A release fails before its tag when its changelog section is empty.
