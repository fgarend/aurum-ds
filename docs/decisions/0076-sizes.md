# 0076. Sizes across components

- Status: Accepted
- Date: 2026-11-03

## Context

The original Sidebar has a `size` of `lg` "for people who prefer larger type",
which only that component offers. Its 46px is not `control-lg`, its 272px has no
token, and its 14px is off the spacing scale. Radix Themes separates a `scaling`
on its root from each component's `size`, and Primer's `NavList` documents no
size. All of Aurum's tokens are in `px`, so the browser's text size has no effect
on it, while its zoom does, which meets WCAG 1.4.4.

## Decision

- **A component has a `size` only if it appears in different sizes on one
  screen**, as a Button or an Avatar. Its names are `sm`, `md` and `lg`, with `md`
  as the default, and control heights come from the `control-*` tokens.
- **A preference for larger text belongs to the whole system**, a deferred item
  of the roadmap, not to a component's `size`.
- **Every value comes from a token**, so that item changes the tokens alone.

## Alternatives considered

- **`size` on every component.** Uniform, but sizes that no screen mixes.
- **The reference's `lg`.** A preference served in one component only.
- **`rem` tokens now.** The browser's text size would work, but it is a change to
  every token, with no component waiting for it.

## Consequences

- The Sidebar has no `size`: an item is `control-md` and the rail `sidebar-width`.
- Each new component answers this question before it takes a `size`.
