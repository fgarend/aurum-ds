# 0086. The navigation in pieces

- Status: Accepted
- Date: 2026-11-03

## Context

The Sidebar (decision 0075), reviewed before its first release, held much the app can
hold better: a rail's width and height, areas, scrolling, bringing the current item
into view, a strip, and, on the way, collapsing, a drawer and sections that open. The
app asked for none of the last three. Aurum provides pieces an app puts together; a
module of composed components can come later, built from them. Primer's `NavList` is
made of parts in this way. Material separates a navigation bar from a rail, as things
that differ in structure, while Radix's navigation menu takes an `orientation`, as things
that differ in layout.

## Decision

- **Three pieces**: `NavList`, a `nav` with a required `aria-label` around a list;
  `NavSection`, a title naming a list; `NavItem`, an anchor with an optional Lucide `icon`,
  its name, and an optional `end`. All three come from `NavList.tsx`, since the
  path `@fgarend/aurum-ds/NavList` reaches only it.
- **`Sidebar`, its `header`, `footer`, `variant` and the rest are gone**, unreleased. Its
  rail goes to the app, or to the module, later.
- **`orientation` on `NavList`, as one component**, since only the layout differs:
  `vertical`, the default; `horizontal`; and `responsive`, one line below `breakpoint-md`
  and a column from there up, in CSS, with nothing to measure. BottomNav stays another
  component, as its structure differs.
- **No JavaScript in the pieces.** What scrolls is around them, so bringing the current
  item into view is not theirs: the `ref` of a `NavItem` is there for the app.
- **What stays from decision 0075**: an empty section or list draws nothing, a long name
  breaks into lines, `end` keeps its width, and the ring sits inside the item. And
  from decisions 0077 and 0084: no link API, and the current item's mark.

## Alternatives considered

- **Keeping the Sidebar.** Ready to use, with its corner cases solved and tested, but
  much of it for what no app asks, and its logic the app's to decide.
- **The two together**, pieces in Aurum and the rail in a module now. No work set aside,
  but a module with no second user to shape it.
- **Two components by direction.** Clear names, but the same parts twice.
- **Only CSS, with no prop.** Less to pass, but a list in a drawer on a small screen could
  not stay a column.

## Consequences

- The app writes the rail: its room, what goes around the list, and any collapsing, with
  `Tooltip` for the names.
- On opening a page whose item is out of view, it stays there until scrolled, unless the
  app brings it in, more likely on a small screen.
- A `Tooltip` around a `NavItem` puts a `span` between the list and its item, which axe
  fails: a `NavItem` draws its `li`. So an app cannot yet name its items in a collapsed
  rail that way (roadmap).
- The Sidebar stays in the history, in commit `9f6058b`, for the module.
