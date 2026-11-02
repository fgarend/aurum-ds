# 0055. Component styles

- Status: Accepted
- Date: 2026-11-02

## Context

Each component brings CSS of its own. The design systems surveyed write it as
plain CSS with a prefix (Radix Themes, GOV.UK), CSS modules (Primer), CSS
generated at run time (Chakra, Ant Design) or Tailwind (shadcn/ui), and ship
it as one bundle or with each component. Aurum's tokens are custom properties
`--au-*`, its text styles classes `.au-text-*`, and its base styles act on
every element with an `au-` class (decision 0030).

## Decision

- **Plain CSS, with classes prefixed `au-`**, in a file beside the
  component: `Button.css` with `.au-button`. Its parts take the component's
  name: `.au-button-icon`.
- **Variants and states are `data-*` attributes**, `data-variant="primary"`,
  `data-size="small"`, and native states wherever they exist (`:disabled`,
  `[aria-pressed]`).
- **Each component imports its own CSS**, so the app receives the CSS of the
  components it uses and nothing else. Its CSS sits in the layer
  `au.components` and starts by stating the layers' order (decision 0053).

## Alternatives considered

- **CSS modules.** No clashes, but class names made at build time, unknown to
  the app.
- **CSS generated at run time.** Styles from props, but a cost at run time and
  dependencies.
- **Modifier classes** (`.au-button--primary`). Common, but a list of classes
  to build where one attribute says it.
- **One stylesheet with every component.** Simpler to import, but the CSS of
  components the app does not use.

## Consequences

- A component's class names are stable, and public only where the guidelines
  tell the app to use them (decision 0004).
- The app's bundler must handle a CSS import from a package, as Vite does.
