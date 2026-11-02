# 0048. Releases through continuous integration

- Status: Accepted
- Date: 2026-11-02

## Context

Decision 0040 had the maintainer create and push each tag by hand, after
`make check` and `make pack` passed on the machine and the app tested the
commit. A published tag is never moved (decision 0004), so a tag made on a
commit that had not passed every check would stay. Continuous integration now
runs the checks on GitHub (decision 0046), and GitHub can protect branches and
tags with rulesets, available for public repositories on the free plan.

## Decision

- **Continuous integration creates the tag**, in the `release` workflow, run
  by hand with the version and the commit the app tested. It:
  - runs the `check` workflow again on that commit, reused as it is;
  - runs `make check-release` with the version;
  - checks the commit is on `main`;
  - creates the annotated tag `vX.Y.Z` on it and pushes it.
- **Only its last job writes** (`contents: write`). The inputs reach the
  shell through the environment, never written into a command.
- **`scripts/check-release.ts` checks a release is ready:** `package.json`
  holds a version X.Y.Z, equal to the one asked for when given; the changelog
  has its dated section and link; and nothing is left under `Unreleased`. It
  runs on the machine too, before the release commit is pushed.
- **The steps live in `docs/releasing.md`.** The maintainer still writes the
  changelog and the version, compares the files with the previous tag, and
  has the app test the commit before the release.
- **GitHub protects the repository:** `main` cannot be deleted or rewritten,
  and the tags `v*` cannot be deleted, moved or rewritten, by anyone. Their
  creation is not restricted: in a repository of a personal account, GitHub
  refuses GitHub Actions as a ruleset's bypass actor, so the rule that a tag
  is created by the `release` workflow lives in `docs/releasing.md`. Secret
  scanning, push protection, private vulnerability reporting and Dependabot
  alerts are on.
- **No approval gate**, since one maintainer would approve their own release.
- **A local workflow is not a pin:** the image report leaves out what the
  workflows use by a path of the repository.

This replaces decision 0040's tag created and pushed by hand, and its
`make pack` as a step of its own, now inside `make check`.

## Alternatives considered

- **Tagging by hand, with continuous integration checking after.** No write
  access, but the checks run once the tag exists, and a tag is never moved.
- **A release tool** (release-please, changesets, semantic-release). Versions
  and tags automated, but a changelog generated from commits, or files and a
  pull request flow of their own (decision 0004).
- **Reading the earlier run's result** instead of checking again. Faster, but
  more permissions, and a run that may have been cancelled or made by an
  older workflow.
- **The last commit of `main`** instead of a commit given. One input, but a
  commit pushed after the app's test would be tagged untested.
- **An environment with a required reviewer.** A pause before tagging, but
  the one maintainer would approve their own run.
- **Tags created only by continuous integration, forced by a ruleset.** No tag
  by mistake, but GitHub accepts GitHub Actions as a bypass actor only in an
  organization's repository, and a deploy key or an app of our own would be a
  secret to keep.

## Consequences

- A release takes a run on GitHub, and every check runs twice: on the push and
  on the release.
- The tag's author is GitHub Actions, and the tag is not signed.
- A tag can be removed or moved by no one; creating one outside the workflow
  is possible, and would show as a tag with no release run.
