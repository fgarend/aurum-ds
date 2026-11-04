# 0085. The regions of AppLayout

- Status: Accepted
- Date: 2026-11-03

## Context

Reviewing `AppLayout` against its HTML: its navigation's area was a `div`, leaving
whatever else an app puts there, as its brand or profile, out of any landmark. Its top
bar was a `header` beside `main`, so a `banner`, which the W3C keeps for site-oriented
content, while it holds the page's path and filters; and the link to skip passed over
those filters too. `100vh` counts a phone's screen as if its address bar were gone.
The navigation's height and overflow were left to what it draws.

## Decision

- **The navigation's area is an `aside`**, which the HTML standard allows for groups
  of `nav`, so all of it is in one landmark.
- **The top bar is a `header` inside `main`**, where it has no landmark role, so the link
  to skip reaches the page's filters first.
- **`100dvh`** for the page's height and the navigation's, widely available in
  Baseline since June 2025.
- **The frame scrolls the navigation**: its area, by itself, when it is taller than the
  screen, and sideways when it sits at the top on a small screen, with the page still.

This replaces, in decision 0083, that the link passes over the top bar.

## Alternatives considered

- **A `div` for the area.** One landmark fewer to announce, as the W3C keeps
  `complementary` for what supports the main content, but the rest of the area in no
  landmark.
- **The top bar beside `main`, as a `div`.** No banner either, but filters out of the
  page's landmark, and still passed over by the link.
- **`100vh`.** Steadier as the address bar comes and goes, but the rail's foot hidden
  behind it.

## Consequences

- A screen reader announces the `aside` and then the `nav`.
- A page with a second `aside` needs names to tell them apart: a prop for it comes then.
- The page has no `banner`, unless the app marks one.
- `dvh` and `vh` are alike on a desktop browser, so the tests do not show the difference.
