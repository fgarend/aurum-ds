# Releasing

How a version is released (decisions 0004, 0040, 0048, 0049 and 0051). The
app installs the package on the release's page, or from GitHub at its tag
(decisions 0037 and 0051), so the tag is the release. It is created by the
`release` workflow, never by hand: GitHub then refuses to move or delete it.

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
   and push.
4. **Continuous integration passes** on that commit.
5. **Test it in the app:** the app installs the commit,
   `github:fgarend/aurum-ds#<commit>`, and its tests pass. If they fail, fix
   it here in new commits and go back to step 2.
6. **Release:** run the `release` workflow on GitHub, by hand, with the
   version and the full commit. It runs every check again on that commit,
   runs `make check-release`, checks the commit is on `main`, creates the
   annotated tag `vX.Y.Z` on it, and publishes the release page with the
   version's notes from the changelog (decision 0049) and the packed package,
   `fgarend-aurum-ds-X.Y.Z.tgz` (decision 0051). The release is immutable once
   published: its tag and its package never change.
7. **The app moves to the release**, by the package on its page,
   `https://github.com/fgarend/aurum-ds/releases/download/vX.Y.Z/fgarend-aurum-ds-X.Y.Z.tgz`,
   in its own repository (decision 0051).

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
