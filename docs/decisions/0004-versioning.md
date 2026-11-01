# 0004. Versioning

- Status: Accepted
- Date: 2026-11-01

## Context

The app pins this package to an exact git tag. Each new version must tell it
whether updating breaks anything, and what to do when it does. Semantic
Versioning requires a declared public API, and says nothing about how to
number the `0.y.z` phase or how to treat visual changes, which matter most in
a design system.

## Decision

- **Semantic Versioning.**
- **The public API** is what the app may depend on and is documented: the
  package's exports (components, their props and types, helpers), the token
  names, the CSS classes the documentation tells the app to use, the files
  shipped (CSS, fonts, icons) and the React versions accepted. Internal
  classes, the markup inside components and files outside the exports are
  not public, and may change in any version.
- **Major:** removing or renaming anything public, changing a prop's type or
  meaning, dropping a React version.
- **Minor:** adding anything public, deprecating it, or a deliberate visual
  change.
- **Patch:** a bug fix, a visual fix that brings a component back to its
  specification, or an internal change.
- **During `0.y.z`, every rule shifts one place right:** a breaking change
  raises the minor, anything else the patch. The first version is `0.1.0`.
- **`1.0.0` is released when every screen of the app uses Aurum** and the old
  interface is gone.
- **Tags are annotated, named `vX.Y.Z`**, on the release commit, which
  updates the version and the changelog. A published tag is never moved or
  deleted: a mistake is fixed by a new version.
- **`CHANGELOG.md` is written by hand** in the Keep a Changelog format, for
  the app, not for developers. It is updated under `Unreleased` in the same
  commit that changes the public API or the appearance. Breaking changes are
  marked **Breaking:** with the steps to upgrade. It starts with `0.1.0`.

## Alternatives considered

- **Everything public, including internal classes and markup.** Any internal
  change would be breaking.
- **Only what TypeScript exports is public.** Leaves out tokens and CSS, half
  of a design system's contract.
- **A deliberate visual change is major.** Almost every version would be
  major, and the number would stop telling which ones break code.
- **Raising the minor on every `0.y.z` release.** Simpler, but the number
  would no longer separate breaking versions from the others.
- **`1.0.0` with the first version the app uses.** Each new screen would
  likely break something and spend a major version.
- **`1.0.0` at a number of components.** Objective, but says nothing about
  the API being stable.
- **Tags without the `v`.** The bare version, but not what the app expects.
- **Signed tags.** Prove who made the tag, but need a signing key, with a
  single consumer who is also the author.
- **A changelog generated from commits** (git-cliff, release-please). Copies
  messages written for developers, and release-please needs CI.
- **Changesets.** Built for monorepos and packages published to npm.
- **No changelog.** The upgrade steps would have no place.

## Consequences

- The version number alone tells the app whether an update can break it.
- Every commit that changes the public API or the appearance also updates the
  changelog, once it exists.
- A visual change reaches the app as a minor version, and its screenshot
  tests show it for review.
