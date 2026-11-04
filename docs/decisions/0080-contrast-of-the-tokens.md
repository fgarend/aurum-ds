# 0080. The contrast of the tokens

- Status: Accepted
- Date: 2026-11-03

## Context

Axe measures contrast on a story's flat colours, but reports text on a gradient
as incomplete, which does not fail (decision 0079): 12 elements on the graphite
Sidebar were never measured. And it sees only what a story draws, so a pair of the
palette that no component uses yet is not checked at all. The WCAG's formula is
short, and the tokens hold every colour.

## Decision

- **A test computes the contrast of every pair the palette means to be used**,
  whether or not a component uses it yet: `test/contrast.test.ts`, in the checks
  of the repository, so in continuous integration. Text needs 4.5:1, and focus
  rings and the current icon 3:1.
- **It paints what the browser paints**: the translucent fills over each stop of
  the graphite, and the Sidebar's gold glow at its strongest.
- **An exception is listed with its reason, and must stay below the minimum**, so
  one that no longer needs excusing has to go: `ink-disabled`, which WCAG exempts;
  `line` and `line-strong`, which identify no control; `control-border`, decided in
  item 7.16; and `chart-2`, `chart-3` and `chart-5`, decided with the first chart.
- **No dependency**: the formula is a few lines.

## Alternatives considered

- **Only the pairs components use.** A shorter list, but no promise for the rest
  of the palette, which an app can use today.
- **A rule in axe for gradients.** Axe has none, and it would see only what a story
  draws.
- **A library of colours.** The same formula, with one more dependency.

## Consequences

- A new token's pairs are added by hand to the list: the test does not guess what
  is meant to be read together.
- The glow's strength is repeated here from `Sidebar.css`.
- It proves the colours, not that a component uses the right ones: axe and the
  stories do that.
