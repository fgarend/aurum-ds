# 0082. The top bar scrolls away

- Status: Accepted
- Date: 2026-11-03

## Context

`AppLayout`'s top bar was sticky (decision 0073). Tabbing back with a real keyboard
to a control behind it, in the three browsers, left the control entirely hidden:
it counts as in view, so the browser does not scroll to it, which is WCAG's failure
F110 of 2.4.11. `scroll-padding` fixes it in all three, as W3C's technique C43, but
the bar's height varies, so it would have to be measured in JavaScript. And a sticky
bar of 73px takes 9% of the height at 100% and 37% at a zoom of 400%, a cost to the
people who zoom that `scroll-padding` does not remove.

## Decision

- **The top bar scrolls away with the page**, with no `position: sticky` or
  `z-index`. It covers nothing, with no code. The navigation stays sticky, as it
  sits beside the content and covers nothing either.
- **For now.** A bar that stays in view can come back as an option, in an item of
  its own, measuring its height.

## Alternatives considered

- **Sticky, with its height measured**, by a `ResizeObserver` setting
  `scroll-padding-top` on `html`. What the app has today, but JavaScript and a change
  outside the component's box, and 37% of the height at high zoom.
- **Sticky, with a fixed `scroll-padding`.** No JavaScript, but it fails on a bar that
  grows, as one with filters does when they wrap.
- **Only the content scrolling**, beneath the bar. It covers nothing, but the page
  loses its normal scrolling, on phones and for anchors.

## Consequences

- The app's path and filters leave the screen as the page scrolls, which differs
  from the app's own bar: on a long table, changing a filter means going back up.
