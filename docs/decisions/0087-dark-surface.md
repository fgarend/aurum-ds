# 0087. A dark surface

- Status: Accepted
- Date: 2026-11-03

## Context

The pieces of a navigation go on the app's graphite rail, and a Badge or a Button will too,
each needing colours for it. Eufemia doubles its tokens with `inverse` and `ondark`
variants that components choose among. Donnie D'Amato argues for one set of tokens that
only changes its values, with components unaware of the surface. A Tooltip on graphite
also melted into it, as decision 0078 left for later. `inverse` is the palette's one dark
surface, with tokens for what goes on it.

## Decision

- **The app marks an area with `data-au-surface="inverse"`.** The rule, in `AurumRoot.css`,
  paints it `inverse`, sets `color-scheme: dark`, and gives every token a component reads
  for its grounds, lines, text and controls the values for it, which a test holds to the
  list: so a card that paints `surface` inside it stays dark, under text that stays light.
- **No component gets a prop for it**, so a new one follows with nothing to do, and pieces
  inside each other inherit it.
- **Gold on the current `NavItem` is a rule of its own**, a matter of brand, not a value of
  the surface.
- **The app may paint over it**, as with a gradient.

This replaces the three variants of decision 0075, and the Sidebar's gradient.

## Alternatives considered

- **A prop on each component**, as `tone="inverse"`. Explicit, but one more prop and more
  CSS in every component, repeated on each piece.
- **Tokens doubled by surface.** Nothing changes values, but twice the names, and each
  component choosing among them.
- **A `Surface` component.** One place, but a wrapper element where any element of the app's
  will do.

## Consequences

- A token with no value for the surface stays wrong on it: `income`, `expense` and the chart
  colours have none yet, decided when a component needs them there.
- A dark theme, when it comes, has this mechanism to start from.
- `test/contrast.test.ts` reads the rule, and checks the same pairs as on the light ground.
- `ink-disabled` has no value of its own there: it is the same as `ink-subtle`, so a disabled
  control on the dark surface is told apart by something else, until a token for it.
- A surface inside the dark one has the same ground, told apart only by its `line`.
