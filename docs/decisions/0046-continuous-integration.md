# 0046. Continuous integration

- Status: Accepted
- Date: 2026-11-02

## Context

The checks ran only on the maintainer's machine. The repository is about to
be pushed to GitHub, where it is public, and every design system surveyed
runs its checks there on each change (item 5.19). The approved screenshots
are taken in ARM containers, and Playwright and Vitest advise comparing them
in the environment they were taken in. GitHub runs workflows only from
`.github/workflows/`, at the root.

## Decision

- **GitHub Actions runs the checks**, in `.github/workflows/check.yml`, on
  every push to `main`, every pull request, and by hand. A newer run cancels
  one still running for the same branch.
- **On GitHub's ARM runner** (`ubuntu-24.04-arm`), the architecture the
  screenshots are taken on, free and unlimited for public repositories.
- **It runs the same `make` targets as the machine:** one step builds the
  images (`make images`), then one step per check of `make check`, each with
  its own status, every one running even when one before it failed. A check
  in `test/` keeps the steps exactly the targets of `make check`, in order.
- **A failing visual test's images are attached to the run**, from
  `.vitest-attachments/`.
- **`.github/workflows/audit.yml` runs `make audit` every week**, and by
  hand. `make outdated` stays in the update routine (decision 0023): it finds
  something almost every week.
- **The workflows are locked down:** every action pinned by the full commit
  of a release, with the release beside it; read-only permissions; no
  `pull_request_target`; no secrets; nothing sensitive printed, since logs are
  public to anyone signed in to GitHub.
- **`make outdated-pins` also reports the actions:** a newer release past the
  release age, or a release tag moved to another commit, with the line to
  copy. `scripts/check-pins/` becomes a folder: `images.ts`, `actions.ts`,
  what they share, and `main.ts`.
- **No cache at first.** The time of the first runs decides whether one is
  worth its parts.
- **`.github/` sits at the root**, the one place GitHub reads workflows from,
  completing decision 0039's list of what stays loose there.

## Alternatives considered

- **One step, `make check`.** The list in one place, but one status for
  every check.
- **One job per check, in parallel.** Faster, but each job builds the images
  again, and branch protection would need each job named.
- **The job inside the project's image.** Steps with no `make`, but GitHub
  needs the image published before the job starts, which takes write access.
- **The x64 runner.** The default, but screenshots taken on ARM.
- **Dependabot for the actions.** No code of ours, but a second way of
  updating, with pull requests outside the routine.
- **A weekly `make outdated`.** A reminder, but a warning that fires every
  week is soon ignored.

## Consequences

- The list of checks is written twice, in the `Makefile` and the workflow,
  and a check fails if they differ.
- The repository's state is visible on GitHub after every push.
- Scheduled runs stop after 60 days without activity in the repository.
