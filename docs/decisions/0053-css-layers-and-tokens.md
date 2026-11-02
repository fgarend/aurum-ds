# 0053. CSS layers and tokens only

- Status: Accepted
- Date: 2026-11-02

## Context

The components are about to bring CSS of their own, beside the base styles
(decision 0030). When the app's CSS and Aurum's meet on one element, the more
specific rule wins, and the app would need longer selectors or `!important`
to adjust a component. Each component's CSS should also take its colours,
spacing, radii, shadows and font sizes from the tokens, or a changed token
would leave it behind; only a review would notice.

## Decision

- **Aurum's CSS sits in two layers, in order:** `au.base`, for the base
  styles, then `au.components`, for the components. CSS outside any layer, as
  the app's usually is, wins over both, whatever its specificity, and a
  component wins over the base.
- **Every file that uses them starts by stating the order**,
  `@layer au.base, au.components;`, so it holds whichever file loads first.
- **`tokens.css` stays outside the layers**: it only defines custom
  properties and the text style classes, and its output matches the
  artifact's compiler byte for byte (decision 0026).
- **A check fails when a component's CSS writes a colour by hand** (`#…`,
  `rgb(…)`, `hsl(…)` and the like), **or a length in spacing, radius, shadow
  or font size.** `0`, a `1px` border and a line marked
  `/* tokens-exception: <why> */` are allowed. It lives in
  `test/css-tokens.test.ts`, beside the check that every token used exists.

This adds to decision 0030, which it does not replace: its base styles move
into the first layer.

## Alternatives considered

- **No layers.** Nothing to learn, but the app fights specificity to adjust a
  component.
- **One layer for everything.** Simpler, but the base and the components
  would compete by specificity.
- **Layers chosen by the app at import** (`@import … layer(…)`). Flexible,
  but each app has to know Aurum's order.
- **Relying on review for the tokens.** No check to keep, but a hand-written
  value passes unnoticed.

## Consequences

- The app adjusts a component with an ordinary rule.
- A component that needs a value no token gives says why, in the line itself.
- The check covers the components' CSS, not the base styles, whose few
  lengths (a 2px focus ring, a 1px hidden box) are part of the base's
  definition.
