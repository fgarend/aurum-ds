# 0088. The text styles in a layer

- Status: Accepted
- Date: 2026-11-04

## Context

`tokens.css` was the one style sheet of Aurum outside any layer. An unlayered rule beats
every layer, so `.au-text-body` beat Tailwind's utilities: on a `NavItem`, `font-bold` and
`text-3xl` did nothing, while a utility's colour, against a rule in a layer, won as decision
0072 promises. It also forced a component to change class to change its weight.

## Decision

- **The text styles sit in `au.base`**, compiled so in `tokens.css`, which now states the
  layers' order first. A component's rule and a utility win over them.
- **The custom properties stay outside any layer**, on `:root`, where nothing competes
  with them but what the app sets there.
- **The reference's render keeps them unlayered**, as the artifact has them.
- **`NavItem` sets the current page's weight in CSS**, with no change of class.

## Alternatives considered

- **The whole of `tokens.css` in a layer.** One rule for all, but an app's own `:root` in a
  layer would lose nothing and gain nothing, and the dark surface relies on none of it.
- **A class per weight, chosen in JavaScript.** What there was: logic for what CSS does.

## Consequences

- An app's CSS or a utility can now change a text style's size and weight, as with any
  other of Aurum's rules.
