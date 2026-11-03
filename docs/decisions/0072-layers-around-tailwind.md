# 0072. Aurum's layers among Tailwind's

- Status: Accepted
- Date: 2026-11-03

## Context

Aurum's CSS sits in layers (decision 0053), counting on the app's CSS being
outside any. Tailwind 4, which the app uses, puts its own in layers too:
`theme`, `base`, with its reset, `components` and `utilities`. The first
statement of a layer fixes its place, and a later layer wins whatever the
specificity. Tried in a browser, with a component's rule, Tailwind's reset and a
utility:

- Tailwind first: a utility in a component's `className` loses.
- Aurum first, as with `AurumRoot` when the app imports its `App` before its
  `index.css`: the reset wins over every component's padding and margin.
- A statement of the whole order, first: both are right.
- The same statement after Aurum's: too late, the reset still wins.

## Decision

- **Every style sheet of Aurum that uses layers starts by stating the whole
  order**: `@layer theme, base, au.base, au.components, components, utilities;`.
  Tailwind's reset stays below Aurum, its utilities above. In an app without
  Tailwind, its names are empty layers, with no effect.
- **A check in `test/` refuses a style sheet that uses layers without it**, and
  a story of `AurumRoot` holds both results with rules shaped like Tailwind's.
- **An app whose CSS loads before Aurum's states the same line first.**

This replaces, in decision 0053, the statement of Aurum's two layers alone.

## Alternatives considered

- **A line the app must add, first of all its CSS.** Aurum names nothing of
  Tailwind, but two places to change in the app, and a silent failure when
  forgotten.
- **Aurum's CSS outside layers.** Nothing to order, but every app's CSS would
  have to beat its specificity.

## Consequences

- With Aurum loaded first, the app configures nothing.
- With the app's CSS loaded first and no line, a utility loses to a component's
  rule, and nothing breaks.
- Aurum names Tailwind's four layers, which change only with a new major
  version of Tailwind.
