# 0078. Tooltip

- Status: Accepted
- Date: 2026-11-03

## Context

The collapsed Sidebar and an IconButton show a name beside a control with no
text. The reference draws the first with `::after`, for which it drops its
scrolling, and the second with `title`, which shows on neither focus nor touch.

W3C's tooltip pattern is still without consensus. Primer calls a tooltip a last
resort, and reserves it for an IconButton's label. Base UI says nobody should
miss critical information by never seeing one, and that it does not work well
with touch. WCAG 1.4.13 asks that it can be dismissed, hovered over and stays
while wanted. Radix and Base UI hold it in a portal, opening after 700ms and
600ms; Primer opens after 50ms. In the three browsers, the native `popover` here
was neither cut by an area that scrolls nor covered by a sticky bar's z-index.

## Decision

- **It shows only the name of a control**, in text, with nothing to click. A
  description is left out, and can come later as a prop.
- **It wraps the control** in a `span` with `display: contents`, which draws no
  box, and listens to what rises from it. No props are injected, so any control
  works, with no `cloneElement`.
- **The name stays the control's own.** The text has `aria-hidden`, with no
  `role="tooltip"` or `aria-describedby`, so it is not read twice. A control that
  has no name of its own is caught by axe, not by the Tooltip.
- **It opens in the native `popover`**, at the top layer, placed by a small
  calculation. It needs no portal, `z-index` scale or dependency. This is an
  exception to Baseline's widely available, since `popover` is newly available
  from January 2025: in a browser without it, no tooltip opens, and the control
  still has its name.
- **Opening:** 150ms on hover, the guidelines' duration, and at once on keyboard
  focus. It closes 100ms after the pointer leaves, time to cross onto it, and at
  once on Escape, click, blur, scroll or resize. A touch does not open it.
- **`side`**, `top` by default, goes to the opposite side when it does not fit,
  and slides along the other axis until it does. A long name breaks into lines.
- **One look**, `primary` and `on-primary`, with no variants or animation. The
  reference's values off the tokens take the nearest: `space-1` and `space-2`
  inside, and `space-2` from the control.

## Alternatives considered

- **`position: fixed`.** Widely available, but under a sticky bar's `z-index`.
- **A portal in the `body`.** What Radix and Base UI do, but Aurum's first portal,
  and a `z-index` scale to hold.
- **Injecting props, or a hook.** What `asChild` and `render` do, but a merge of
  props and refs that decision 0054 avoids, and a child that must pass them on.
- **A `Provider` opening neighbours at once.** Barely noticed at 150ms, and one
  more thing for the app to set.
- **A variant for dark surfaces.** Comes with the IconButton if it needs one.

## Consequences

- A disabled control may not report hover, so its tooltip is not guaranteed.
- Tested in three browsers by simulated events: real screen readers, real touch
  and real pointers were not tried.
- The collapsed Sidebar's tooltip must clear the rail: 8px from an item starts on
  the graphite (item 7.40).
