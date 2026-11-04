# 0081. A person's settings on every story

- Status: Accepted
- Date: 2026-11-03

## Context

WCAG 1.4.12 asks that nothing is lost with wider text spacing, and forced colours,
as Windows's contrast themes set, remove fills that mark a state. Storybook has
nothing for either. Playwright has a `forcedColors` option, and Vitest takes it per
project. Run against the gallery, its emulation forces colours in Chromium and
Firefox, while WebKit's only answers the media query. It found two faults: in
Chromium the current item's gold icon stayed gold on white, since a colour set on
an `svg` is kept, and the Tooltip lost its edge with its fill.

## Decision

- **Two tests go through every story**, as the screenshots do (decision 0060), so
  a component gets them from having a story: `.storybook/text-spacing.test.tsx`
  and `.storybook/forced-colors.test.tsx`, in `make test-browser`, so in continuous
  integration.
- **Text spacing, in the three browsers**: with the criterion's exact values, no
  element may be cut or spill out, unless it scrolls or is hidden on purpose.
- **Forced colours, in Chromium and Firefox**: the current page and an open tooltip
  have a visible outline, and an icon in a link or button has its text's colour.
- **The two faults are fixed**: the icon inherits in forced colours, and the Tooltip
  has a transparent outline, which only that mode shows.

## Alternatives considered

- **Checks in each component's stories.** Closer to the component, but each one has
  to remember, and most would repeat the same lines.
- **WebKit in forced colours too.** It would pass without forcing anything.
- **Screenshots in forced colours.** They show more, but each is one more image to
  approve, for what a few checks state.

## Consequences

- Stories run twice more, so `make test-browser` takes longer.
- A new way of marking a state needs a line in the forced colours test.
- This proves the CSS under emulation: Windows's own themes are for the manual script.
- Reduced motion has no check: no component animates yet.
