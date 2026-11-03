# 0074. The three style sheets leave the exports

- Status: Accepted
- Date: 2026-11-03

## Context

`AurumRoot` brings the fonts, the tokens and the base styles (decision 0070),
and the exports `fonts.css`, `tokens.css` and `base.css` were deprecated for the
next version that may break. The app has moved: it wraps its new shell in
`AurumRoot`, and imports none of the three. Without a bundler, the components
cannot be used anyway, since their JavaScript imports CSS.

## Decision

- **The package exports only its entry, a path per component and its
  `package.json`.** The three style sheets stay in `dist/`, where the root
  imports them, and cannot be imported by name.
- **This is 0.2.0**, the version that may break during `0.y.z` (decision 0004).

This replaces, in decision 0070, the three exports kept and deprecated, and in
decision 0064, their names among the exports.

## Alternatives considered

- **Keeping them.** No break, but a second way to set Aurum up, with an order to
  remember, that nothing uses.

## Consequences

- One way to set Aurum up: `AurumRoot`.
- An app on an older version keeps working until it moves, by the steps in the
  changelog.
