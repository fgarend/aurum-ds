# Releasing

How a version is released (decisions 0004, 0040, 0048, 0049, 0051, 0062 and
0067). The app installs the package on the release's page, or from GitHub at
its tag (decisions 0037 and 0051), so the tag is the release. It is created by
the `ci` pipeline, never by hand: GitHub then refuses to move or delete it.

## Steps

1. **Write the release:** choose the number by the rules of decision 0004,
   from what `Unreleased` lists in `CHANGELOG.md`; move those entries to a
   new `## [X.Y.Z] - YYYY-MM-DD` section, with its link at the end, and check
   that each breaking change is marked **Breaking:** with its upgrade steps;
   and change `version` in `package.json` to the same number.
2. **Compare with the previous release:** the files the app receives, those
   `files` lists in `package.json`, against the previous tag, so the
   changelog tells every change: `git diff vA.B.C -- <each file in files>`.
   The first release has no previous tag.
3. **Check and push:** `make check` and `make check-release` pass, then
   commit the changelog and the version alone, as `chore: release vX.Y.Z`,
   and push. The commit is the release: nothing else is run by hand.
4. **Continuous integration releases it** (decision 0067). On that push, the
   `ci` pipeline runs the checks and, when they all pass, finds the commit is
   a release: its version has no tag and `make check-release` passes. It then
   runs `make audit`, so no release leaves with a vulnerability not yet
   reviewed, and prepares, once, the gallery of components, the version's
   notes from the changelog (decision 0049) and the packed package,
   `fgarend-aurum-ds-X.Y.Z.tgz` (decision 0051). Its job `tag` creates the
   annotated tag `vX.Y.Z` on the commit and publishes the release page with
   the notes and the package; its job `pages` publishes the gallery on GitHub
   Pages, at `https://fgarend.github.io/aurum-ds/` (decision 0062). On any
   other commit, those two jobs are skipped, and the run's page says why. The
   release is immutable once published: its tag and its package never change.
5. **The app moves to the release**, by the package on its page,
   `https://github.com/fgarend/aurum-ds/releases/download/vX.Y.Z/fgarend-aurum-ds-X.Y.Z.tgz`,
   in its own repository, and runs its own tests there (decision 0051).

## When a release run fails

- **Before the tag** (the checks, the audit, the gallery): fix it in a new
  commit; it is a release again while its version has no tag.
- **A release commit whose checks were cancelled**, by a newer push: re-run
  its `ci` run on GitHub; it releases as the first run would have.
- **A step of GitHub's that failed** (the network, Pages): re-run the failed
  jobs of the `ci` run.

## Once: turning Pages on

Pages takes its site from GitHub Actions, a setting of the repository a
workflow cannot change. It was turned on once, by its owner:

```sh
gh api -X POST repos/fgarend/aurum-ds/pages -f build_type=workflow
```

## Deprecating

Something public goes away in two versions:

- **First it is deprecated:** marked `@deprecated` in the code, with what to
  use instead, and listed under `Deprecated` in the changelog. During `0.y.z`
  this is a patch.
- **Then it is removed,** in the next version that may break: during `0.y.z`,
  the next minor.

There is no fixed wait: with one app, it shows when the thing is no longer
used.

## A release that breaks by mistake

- **A new version undoes the break,** released as soon as possible. The
  broken tag is never moved or deleted, and GitHub refuses to.
- **The broken version is marked `[YANKED]`** in its changelog heading, so the
  app skips it.
- **A change that was wanted** comes back later, in a version that may break,
  with its upgrade steps.
