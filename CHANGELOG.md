# Changelog

What changes for the app in each version. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and versions
follow decision 0004.

## [Unreleased]

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

[Unreleased]: https://github.com/fgarend/aurum-ds/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/fgarend/aurum-ds/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/fgarend/aurum-ds/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/fgarend/aurum-ds/tree/v0.1.0
