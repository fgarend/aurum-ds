# Releasing

How a version is released (decisions 0004 and 0040). The app installs it from
GitHub at its tag (decision 0037), so the tag is the release.

## Steps

1. **Choose the number** by the rules of decision 0004, from what
   `Unreleased` in `CHANGELOG.md` lists.
2. **Write the release into the changelog:** move the entries under
   `Unreleased` to a new `## [X.Y.Z] - YYYY-MM-DD` section, and check that
   each breaking change is marked **Breaking:** with its upgrade steps.
3. **Change `version` in `package.json`** to the same number.
4. **Check the package:**
   - `make check` passes, `make pack` included: the app can import every
     export (decisions 0038 and 0044).
   - The files the app receives, those `files` lists in `package.json`, are
     compared with the previous tag, and the changelog tells every change:
     `git diff vA.B.C -- <each file in files>`. The first release has no
     previous tag.
5. **Commit** the changelog and the version alone: `chore: release vX.Y.Z`.
6. **Push the commit**, without a tag yet.
7. **Test it in the app:** the app installs the commit,
   `github:fgarend/aurum-ds#<commit>`, and its tests pass. If they fail, fix
   it here in new commits and go back to step 4.
8. **Tag the release commit:** `git tag -a vX.Y.Z -m vX.Y.Z`, check with
   `git show vX.Y.Z` that it points at that commit, and push the tag:
   `git push origin vX.Y.Z`.
9. **The app moves to the tag**, `github:fgarend/aurum-ds#vX.Y.Z`, in its own
   repository.

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
  broken tag is never moved or deleted.
- **The broken version is marked `[YANKED]`** in its changelog heading, so the
  app skips it.
- **A change that was wanted** comes back later, in a version that may break,
  with its upgrade steps.
