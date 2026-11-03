# 0066. Releases that start from the checks

- Status: Accepted
- Date: 2026-11-03

## Context

A release was run by hand (decision 0048), with the version and the commit
typed in, after the commit's checks had passed on its push and the app had
tested it. The workflow then ran every check again on that commit, as a
nested workflow, before building the gallery and tagging. The checks ran
twice on the same code, with the same pinned versions, and two values typed
by hand could be wrong. `make pack` already installs the packed package in a
throwaway app, imports every export and checks its types, on every push.
GitHub can start a workflow when another completes (`workflow_run`), with the
conclusion and the commit of that run; it runs the workflow file of the
default branch, with the default branch's last commit as `GITHUB_SHA`, and
warns that code from a pull request must never reach the write access it
gives. Only the owner can push to `main`.

## Decision

- **The release starts by itself when the checks pass on a push to `main`**
  of this repository (`workflow_run` of `check`): never from a pull request,
  a run made by hand, or a run that did not succeed.
- **A commit is a release when its version has no tag yet and
  `make check-release` passes.** Any other commit stops at the first job,
  with the reason on the run's page. A fix pushed after a release commit is a
  release again while the version has no tag.
- **Every job takes the commit the checks ran on**
  (`github.event.workflow_run.head_sha`), not the default branch's last one.
- **The checks are not run again.** `check` is no longer a reusable workflow,
  and the release has no inputs and no button.
- **The app does not test the commit before the release.** `make pack` is
  the package's test as an app; the app runs its own tests when it moves to a
  release, and a release that breaks it is undone by a new one.
- **A failed run is re-run on GitHub**, the checks of a cancelled push or the
  release's failed jobs, as `docs/releasing.md` says.

This replaces, in decision 0048, the release run by hand with its version and
commit, the checks run again, and the app's test before the release.

## Alternatives considered

- **The release by hand, as it was.** A chosen moment, but the checks twice,
  two values typed, and a step kept in memory.
- **A pause for approval before the tag** (an environment with a required
  reviewer). A moment to test in the app, which `make pack` now stands for,
  and a run waiting up to 30 days when a newer commit arrives.
- **A release pull request** (release-please, changesets). A version and a
  changelog prepared by a bot, but a changelog from commits and a flow of
  pull requests the repository does not use (decision 0004).
- **The release in the same workflow as the checks.** One file, but a
  workflow with two jobs of different trust, and a release cancelled by the
  next push's checks.

## Consequences

- Pushing `chore: release vX.Y.Z` releases it; no other step is taken by
  hand.
- The release workflow is the one on `main` when it starts, which may be
  newer than the commit it releases.
- A release commit whose `make check-release` fails is not released, and the
  run's page says so; the check runs on the machine before the push too.
