# 0030. Base styles

- Status: Accepted
- Date: 2026-11-01

## Context

Components rely on a few global styles: the page's font, background and text
color, `border-box` sizing, a focus ring, a way to hide text from the screen
but not from screen readers, and figures of one width for amounts. The
artifact puts them at the top of its components' CSS and styles `body`
directly. The app moves to Aurum one screen at a time, so for a long while
screens that use Aurum and screens that do not share a page.

## Decision

- **Page-wide styles apply only inside `.au-root`**: the sans font, the
  `canvas` background, the `ink` color and font smoothing. The app puts the
  class on each migrated part, and at the top once all of it is.
- **`border-box` applies to every element with an `au-` class**, and its
  `::before` and `::after`, wherever it is.
- **One focus ring by default** on every element with an `au-` class that
  takes focus, which a component with a focus of its own overrides.
- **Two utility classes**: `.au-sr`, hidden from the screen but read by screen
  readers, with the full current recipe, and `.au-num`, for figures of one
  width.
- **They live in `src/styles/base.css`.**
- **A test checks that every `var(--au-…)` the sources' CSS uses is defined in
  `tokens.css`.**

## Alternatives considered

- **Styles on `body`, as the artifact does.** No class to add, but every old
  screen would change at once.
- **`border-box` for everything inside `.au-root`.** One simpler selector,
  but an Aurum component placed on an old screen would be sized wrong, and
  other elements inside the root would change.
- **The focus ring written by each component, as the artifact does.** Each
  component in control, but a new one could forget it.
- **The artifact's `.bs-sr` as it is.** The same rule, but text with padding
  would show, and it relies on the obsolete `clip`.

## Consequences

- The app adds `.au-root` where Aurum begins.
- A token renamed or misspelled in any CSS of the sources fails `make test`.
- How the base styles look is checked in a browser, with the visual tests.
