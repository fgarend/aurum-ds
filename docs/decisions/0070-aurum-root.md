# 0070. AurumRoot

- Status: Accepted; partly superseded by 0074: the three exports, gone
- Date: 2026-11-03

## Context

The app imported three style sheets, in an order to remember (fonts, tokens,
base styles), and put the class `au-root` where Aurum begins (decisions 0030
and 0036). The app suggested a root component instead. Of nine libraries read
in their code, Radix Themes, Primer, Fluent and React Spectrum have a root
that renders a `div`, and Mantine, Chakra and Polaris one that renders none
and works on `<html>`; Primer and Mantine keep their base styles beside it,
and every one keeps its tokens apart. A provider is for state in React, which
Aurum has none of yet; the root is where it will live, once there is a theme
to switch or portals to hold, with no change to the app.

## Decision

- **`AurumRoot` is where Aurum begins**, once, above any layout. It imports
  the fonts, the tokens and the base styles, and renders a `div` with the
  class `au-root`, taking a `div`'s props (decision 0054).
- **It draws no box** (`display: contents`): its children lay out as its
  parent's, and still inherit its font and colour, so the app's layout stays
  as it is. No library read does this; it keeps the root from touching the
  app's flex or grid. Baseline does not list `display: contents` as widely
  available yet, over elements with a role losing it for screen readers; a
  `div` has none, so its line is a stated exception. The canvas is painted by
  what holds the page, such as the shell.
- **The class alone keeps its box and paints the canvas**, for an element of
  the app's.
- **The base styles are the root's**, `src/components/AurumRoot/AurumRoot.css`,
  with `color-scheme: light` so the browser's controls and scroll bars follow
  the theme; the fonts sit beside them, `fonts.css`, which only the root
  imports. The tokens stay in `src/tokens/`, beside the `tokens.json` they are
  built from, which other tools read too.
- **The exports `fonts.css`, `tokens.css` and `base.css` keep their names,
  deprecated**: they leave in the next version that may break, once the app
  wraps itself in `AurumRoot`. Without a bundler, the components cannot be used
  anyway, and the tokens' variables reach the app's own CSS through the root.
- **The stories run inside `AurumRoot`**, on a canvas the decorator paints, as
  the app's shell would; the visual test photographs that canvas.
- **No provider, theme or context yet.** The root takes them when a theme to
  switch or portals to hold arrive.

This replaces, in decision 0030, the app's import of the base styles and its
class, and in decision 0036, the app's three imports in order.

## Alternatives considered

- **The three imports and the class, as before.** Nothing new, but two things
  for the app to remember, and a provider to add later.
- **One `styles.css` imported once, and the class.** One import, but still two
  steps, and no place for the theme and the portals.
- **The shell painting the page.** A real box, but every layout would repeat
  it.
- **A `div` that draws a box.** What libraries do, but a box between the app's
  layout and its children.
- **A provider rendering no element, working on `<html>`.** No box, but the
  whole page would take Aurum's font and colours, while the app's current
  screens live beside the new ones.
- **The tokens beside the root.** Every runtime import of `tokens.css` is the
  root's, but it is built from `tokens.json`, which the Storybook theme, the
  visual tests and the checks of `test/` read too.

## Consequences

- The app writes `<AurumRoot>` and nothing else to set Aurum up.
- Each component imports only its own CSS.
- A page that holds Aurum paints its own canvas.
