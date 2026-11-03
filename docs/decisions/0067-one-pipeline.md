# 0067. One pipeline, ci

- Status: Accepted
- Date: 2026-11-03

## Context

Releases started by themselves after the checks (decision 0066), in a
workflow of their own, `release`, triggered when `check` completed. Every
push then made two runs, the second nearly always stopping at its first
job; the release ran the default branch's workflow file, needed the checked
commit named in every job, and had to refuse runs from pull requests. Each
job also ran on a fresh machine, so each built the Docker images again:
about 30 seconds in the check, the gallery and the tag of v0.1.2, with the
package packed twice. `check` cancelled itself on a newer push, which would
have cut a release halfway, the reason it stayed apart. GitHub lets a job
hold its own concurrency rule, so only the checks need be cancellable, and
it never hides a job: one that does not run shows as skipped.

## Decision

- **One workflow, `ci`, checks every commit and releases a release
  commit.** It runs on every push to `main`, every pull request and by hand.
  `check.yml` and `release.yml` go.
- **The job `check` asks whether the commit is a release**, as its last
  question: only on a push to `main` whose checks all passed, its version
  without a tag and `make check-release` passing (decision 0066). Pull
  requests never release.
- **It then prepares the release once, on the machine that checked it:**
  `make audit`, so no release leaves with a vulnerability not yet reviewed
  (decision 0058); the gallery; the notes; and the packed package, kept as
  artifacts of the run. The job only reads.
- **The jobs `tag` and `pages` publish what it prepared**, with `git`, `gh`
  and `deploy-pages`, running none of the project's code; they are the only
  ones that write, each with only its own permission.
- **Only the job `check` is cancelled by a newer push**; the jobs that
  publish are never cut halfway.
- **`audit` stays a workflow of its own**, weekly and by hand: it watches
  the dependencies as time passes, where `ci` watches the commits.

This replaces, in decision 0066, the workflow apart triggered by
`workflow_run`; in decision 0062, the gallery's job of its own; and where
decisions 0048, 0051 and 0062 name the workflows `check` and `release`, the
pipeline is `ci`.

## Alternatives considered

- **The release apart, as decision 0066 had it.** Two files of one purpose
  each, but two runs on every push, three image builds per release, and the
  care `workflow_run` asks for.
- **The audit inside `ci`, on a weekly schedule.** One file, but three
  triggers, jobs that run or not by what started them, and weekly runs mixed
  with the commits' history.
- **The audit only weekly.** Nothing more to run at a release, but a release
  could leave up to a week after an advisory nobody reviewed.
- **The release prepared in jobs of its own.** Each job one task, but the
  images built in each, and code of the project run where it writes.

## Consequences

- One run per push; on a commit that is not a release, `tag` and `pages`
  show as skipped, with the reason on the run's page.
- A release commit's check runs about 15 seconds longer, preparing the
  release; other commits' checks do not change.
- A newer push runs beside a release still publishing, never cancelling it;
  two releases never tag at once, as the job `tag` waits for any other.
