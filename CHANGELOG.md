# Changelog

What changes for the app in each version. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and versions
follow decision 0004.

## [Unreleased]

### Added

- `AppLayout`: the frame of the app's pages. It paints the canvas, holds the
  `navigation` at the side, as wide as it draws itself, and at the top below
  768px; an optional `topBar`, which stays in view; and the content, up to
  `content-max`, centred, with 40px between its sections.

### Changed

- The token `content-max` goes from 1200px to 1360px, so tables have more room
  on a wide screen.

## [0.1.4] - 2026-11-03

### Fixed

- With Tailwind, its reset no longer wins over a component's padding and margin,
  and its utilities win over a component's rules: Aurum's style sheets state
  their layers among Tailwind's. If the app's CSS loads before Aurum's, it
  states the same line first: see the README.

## [0.1.3] - 2026-11-03

### Added

- `AurumRoot`: wraps where Aurum begins, once, above any layout. It brings the
  fonts, the tokens and the base styles, sets `color-scheme: light`, and draws
  no box of its own (`display: contents`), so the app's layout stays as it is;
  its children take Aurum's font and colour. It replaces the three style
  sheets below.
- The line the app's Vitest needs to import the components, which import
  their own CSS: `test: { server: { deps: { inline: ["@fgarend/aurum-ds"] } } }`,
  in the README. Without it, a test that imports a component fails with
  `Unknown file extension ".css"`.

### Changed

- `.au-root` sets `color-scheme: light`, so the browser's controls and scroll
  bars inside it follow Aurum's theme.

### Deprecated

- `@fgarend/aurum-ds/fonts.css`, `@fgarend/aurum-ds/tokens.css` and
  `@fgarend/aurum-ds/base.css`: wrap the app in `AurumRoot` instead, and drop
  the three imports. They leave in the next version that may break.

## [0.1.2] - 2026-11-03

### Added

- `Icon`: a Lucide drawing in Aurum's 1.5 stroke, at a size in pixels (20 by
  default), in the colour of the text around it, and hidden from screen
  readers unless it has a `label`. `lucide-react` `^1.61.0` is a peer
  dependency.
- Components import from their own path, `@fgarend/aurum-ds/Icon`, or from
  the package's entry, `@fgarend/aurum-ds`.

### Changed

- `@fgarend/aurum-ds/base.css` sits in the CSS layer `au.base`, so the app's
  own CSS, outside any layer, wins over it however plain its selector.

## [0.1.1] - 2026-11-02

### Added

- The release page carries the packed package, `fgarend-aurum-ds-X.Y.Z.tgz`,
  which installs by its URL with no `git`.

## [0.1.0] - 2026-11-02

The base, with no component yet.

### Added

- `@fgarend/aurum-ds/tokens.css`: the design tokens as CSS custom properties
  prefixed `--au-` (colors, spacing, radii, shadows, control heights, layout
  sizes and font stacks), and the text styles as `.au-text-*` classes.
- `@fgarend/aurum-ds/fonts.css`: Geist and Geist Mono, served by the package.
- `@fgarend/aurum-ds/base.css`: the base styles under `.au-root`, the default
  focus ring, `.au-sr` for text only screen readers read, and `.au-num` for
  numbers that line up.
- Install from GitHub at the tag:
  `"@fgarend/aurum-ds": "github:fgarend/aurum-ds#v0.1.0"`. React 19 is a peer
  dependency.

[Unreleased]: https://github.com/fgarend/aurum-ds/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/fgarend/aurum-ds/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/fgarend/aurum-ds/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/fgarend/aurum-ds/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/fgarend/aurum-ds/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/fgarend/aurum-ds/tree/v0.1.0
