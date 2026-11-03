# 0037. Delivery

- Status: Accepted; partly superseded by 0064: `files`, now `dist/`, where the exports point
- Date: 2026-11-02

## Context

The app installs the package with pnpm, and the repository is public on
GitHub. pnpm's documentation does not say whether a git dependency is packed
or kept whole, so it was tried: installed from a git repository, the package
came whole, with every folder of the repository, 19 MB; with a `files` field,
only the files listed, plus `package.json` and `README.md`. pnpm installed it
under a seven-day minimum release age, and `"private": true` did not stop
it. The app's pnpm blocks a dependency's install scripts until each is
approved.

## Decision

- **The app installs the package from GitHub at a release's tag**, as
  `github:fgarend/aurum-ds#v0.1.0`. The tag is the release; moving to a new
  release is changing the tag.
- **`files` lists exactly the files the exports point to**, so the app
  receives what it can import and nothing else.
- **The package has no install scripts** (`prepare`, `preinstall`,
  `install`, `postinstall`): installing it runs no code in the app, which
  approves nothing.
- **A test checks both**: `files` matches the exports' targets, and no
  install script is declared.

## Alternatives considered

- **GitHub Packages.** Versions by number, but every install needs a token,
  even for a public package, and each release a publishing step.
- **The public npm registry.** No token, but open to anyone, against the
  package being private and unlicensed (decisions 0002 and 0010).
- **Whole folders in `files`.** Shorter, but the compiler, tests and
  screenshots that live in them would reach the app.
- **Building on install, with `prepare`.** No built files in the tag, but
  code run in the app, which must approve it.

## Consequences

- The app's `pnpm outdated` does not see new releases: the app moves to one
  by its tag.
- The app's minimum release age does not apply to the package: its releases
  are chosen by tagging them here.
- When components need a build, the built files go in the release's tag.
