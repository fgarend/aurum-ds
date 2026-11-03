# Aurum Design System

A quiet design system for money interfaces: design tokens, guidelines and a
React component library in TypeScript.

It is the design system of a personal finance app, and starts as
a conversion of the Aurum design system made in Claude Design. From then on,
this repository is the source.

## Status

Version 0.1.0 is the base: tokens, fonts and base styles, with no component
yet. Components arrive one per release, in the order of `docs/ROADMAP.md`.
What changes in each version is in `CHANGELOG.md`.

## Install

From the package on a release's page, with no `git` needed:

```json
"@fgarend/aurum-ds": "https://github.com/fgarend/aurum-ds/releases/download/vX.Y.Z/fgarend-aurum-ds-X.Y.Z.tgz"
```

Or from GitHub at the release's tag, which needs `git`:

```json
"@fgarend/aurum-ds": "github:fgarend/aurum-ds#vX.Y.Z"
```

`X.Y.Z` is a version from `CHANGELOG.md`.

React 19 and `lucide-react` 1 are peer dependencies.

## Use

Import the fonts, the tokens and the base styles, in that order, and put the
`au-root` class where Aurum begins:

```css
@import "@fgarend/aurum-ds/fonts.css";
@import "@fgarend/aurum-ds/tokens.css";
@import "@fgarend/aurum-ds/base.css";
```

Import each component by its own path, so the app loads only what it uses;
the package's entry exports them all too:

```ts
import { Icon } from "@fgarend/aurum-ds/Icon";
```

Each component imports its own CSS, which Vite takes and Node alone does not.
If the app's tests run with Vitest, hand the package to Vite there, in the
test settings:

```ts
test: {
  server: {
    deps: {
      inline: ["@fgarend/aurum-ds"];
    }
  }
}
```

How to use the tokens, text styles and components is in
`docs/guidelines.md`.

## The repository

Each folder at the root belongs to one of four parts (decision 0039):

- **The product, `src/`:** the package's source; `make build` writes from it
  `dist/`, what the app installs and imports.
- **The tooling:** `infra/`, the containers (the image, Compose and their
  settings); `scripts/`, the programs `make` runs; `test/`, the checks of the
  repository as a whole; `.github/`, continuous integration.
- **The knowledge:** `docs/`, with the roadmap, the guides and the decisions
  in `docs/decisions/`.
- **The origin, `reference/`:** the design this started from, frozen.

Everything runs in containers, through `make`: Docker and `make` are the only
tools to install. `make help` lists the commands, and `make check` runs every
check, as continuous integration does on each push. Releases follow
`docs/releasing.md`.

## License

Copyright © 2026 Felipe Gabriel Arend. All rights reserved; a license may be
chosen later.
