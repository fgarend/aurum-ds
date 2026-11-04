# Changelog

What changes for the app in each version. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and versions
follow decision 0004.

## [Unreleased]

### Added

- `NavList`, `NavSection` and `NavItem`: the pieces of a navigation, which the app
  puts where it wants, as its rail in `AppLayout`'s `navigation`. Items have a name, an optional
  icon and an optional `end`, and the current page, marked by
  `aria-current="page"`, has a mark on its edge. `orientation` is `vertical`,
  `horizontal` or `responsive`. Wrap `NavItem` once with the router's link, as
  `createLink(NavItem)` in TanStack Router.
- `data-au-surface="inverse"`: on any element inside `AurumRoot`, it paints a dark
  surface, where the same tokens take its values, so components follow with no prop.
- `Tooltip`: the name of a control with no text of its own, on the screen, on
  hover and on keyboard focus. It wraps the control, which keeps its own name:
  `<Tooltip text="Notes"><button aria-label="Notes">…</button></Tooltip>`. It
  closes on Escape, and does not open on touch. It needs the browser's native
  `popover`; without it, no tooltip opens.

### Changed

- **Breaking:** `AppLayout` requires `skipLabel` with `navigation`: the text of a
  link that lets the keyboard skip the navigation, the first thing it reaches. To
  upgrade: pass it, in the app's language, as `skipLabel="Skip to the content"`.
- **Breaking:** the token `sidebar-width` is now `navigation-width`.
- `AppLayout`'s `navigation` and `topBar`, and `NavItem`'s `end`, draw nothing when given
  what React draws nothing for, as `shown && <Filters />` when not shown.
- `AppLayout`'s navigation is in an `aside`, and scrolls by itself when it does not fit.
  Its `topBar` is a `header` inside `main`, so no longer the page's banner landmark.
  Its heights use `100dvh`.
- `AppLayout`'s `topBar` scrolls away with the page instead of staying in view: it
  hid a control reached by keyboard (WCAG 2.4.11) and took 37% of the height at a
  zoom of 400%. The app's path and filters leave the screen as the page scrolls.

## [0.2.0] - 2026-11-03

### Removed

- **Breaking:** the exports `@fgarend/aurum-ds/fonts.css`,
  `@fgarend/aurum-ds/tokens.css` and `@fgarend/aurum-ds/base.css`, deprecated
  in 0.1.3. To upgrade: wrap where Aurum begins in `AurumRoot`, which brings all
  three, and drop their imports. The tokens' variables and classes still reach
  the app's own CSS through the root.

## [0.1.5] - 2026-11-03

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

[Unreleased]: https://github.com/fgarend/aurum-ds/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/fgarend/aurum-ds/compare/v0.1.5...v0.2.0
[0.1.5]: https://github.com/fgarend/aurum-ds/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/fgarend/aurum-ds/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/fgarend/aurum-ds/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/fgarend/aurum-ds/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/fgarend/aurum-ds/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/fgarend/aurum-ds/tree/v0.1.0
