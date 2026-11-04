# 0090. The spaces of a page

- Status: Accepted
- Date: 2026-11-04

## Context

The guidelines ask for `space-12` between sections on a wide screen and `space-8` on a small
one, with `space-10` of inset on a wide screen. `AppLayout` had the prototype's 40px between
sections at every width and 48px of inset (decision 0073). The prototype has no small screen,
and is a guide, not the source.

## Decision

- **`AppLayout` follows the guidelines**: `space-12` between sections and `space-10` at the
  sides from `breakpoint-md` up; `space-8` and `space-4` below it. `space-10` above the content
  and `space-16` beneath it stay, as the guidelines say nothing of them.

## Alternatives considered

- **The guidelines following `AppLayout`.** Nothing to change on screen, but the spaces one
  drawing happened to have, over the rule written for the system.

## Consequences

- The look differs from the frozen prototype, and the screenshots with it.
- The frame still sets the space between any direct children: `Section` (7.15) settles how a
  page is put together.
