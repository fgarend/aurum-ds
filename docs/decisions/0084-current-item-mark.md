# 0084. The mark of the Sidebar's current item

- Status: Accepted
- Date: 2026-11-03

## Context

The Sidebar's current item was told apart by a fill of 1.19:1 in `surface`, 1.20:1
in `canvas` and 1.36:1 on the graphite, beside a weight going from 400 to 500, and a
gold icon on the graphite. WCAG 1.4.11 asks 3:1 of what identifies a selected state.
The reference has only the fill. Both options were tried on the stories, in the three
variants.

## Decision

- **A mark of 4px on the item's left edge**, `space-1` wide, in `primary`, and in
  `gold` on the graphite: 11.41:1 on its fill in `surface`, and 5.32:1 on the
  graphite's. It tells the item apart by a shape, so also in greys and with colour
  blindness (1.4.1).
- **Only CSS**, a `::before` on `aria-current="page"`, so it changes no layout and
  takes no prop. It is drawn as a border, which forced colours keep.

## Alternatives considered

- **A strong fill**, `primary` on the light variants and `on-inverse` on the graphite.
  Clearer still, but the heaviest thing on the rail, and a light block on the graphite.
- **Keeping the fill and the weight.** The reference's look, but short of 1.4.11, and
  a matter of colour and a small change of weight.

## Consequences

- The look differs from the frozen reference, and the Sidebar's screenshots with it.
