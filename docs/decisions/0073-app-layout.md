# 0073. AppLayout

- Status: Accepted; partly superseded by 0082: the top bar scrolls away
- Date: 2026-11-03

## Context

`AurumRoot` draws no box (decision 0070), so what holds the page paints the
canvas, and the app waits for a frame for its new shell. The app's frame has a
side navigation, a top bar with the path and filters, and content up to 1240px,
or 1440px on the page of a note, both counting 80px of inset, so 1160px and
1360px of content. The prototype has no top bar and 1200px of content on every
screen, with inset around it. The width the note gains shows only on screens
over about 1544px: at 1440px the note's main column has 794px today, so it does
not need more to fit. Of the libraries read, Polaris, Primer and Mantine keep
the width out of the frame, in a page or a container, and Cloudscape in its
`AppLayout`, by kind of content; their default limits vary from none to 1280px.

## Decision

- **`AppLayout` is the frame**, a component with areas as props: `navigation`,
  `topBar`, and the page as its children. What goes in each is the app's.
- **It paints the canvas** and takes the screen's height.
- **The navigation is as wide as it draws itself**, the Sidebar having several
  widths, and stays in view; below `breakpoint-md` it sits over the rest, as the
  app's strip does.
- **The top bar is optional**: when given, a `header` that stays at the top, on
  the canvas, with a `line` beneath; when not, nothing is drawn.
- **One width for every page: `content-max`, raised from 1200px to 1360px**, the
  most any screen of the app has today, so none loses room. The content is
  centred, and the top bar ends at the same edges.
- **The insets and gaps are the prototype's, from the tokens**: `space-12` at the
  sides (`space-4` below `breakpoint-md`), `space-10` above, `space-16` beneath,
  and `space-10` between the page's sections.
- **A check holds the width of a media query to `breakpoint-md`**, since a media
  query cannot read a custom property.

## Alternatives considered

- **`AppShell`.** The term of Mantine and the guidelines, but it says less than
  what it is, a layout.
- **Areas as subcomponents.** More to write and export, for a few fixed areas.
- **A `wide` prop with a token of its own.** What the app has today, but the
  layout must know the routes, for room that shows only on large screens.
- **A page component holding the width**, as Polaris's `Page`. A width per page,
  but each page wrapped, with no page needing a width of its own yet.
- **No limit.** All the room, but a table's name and value drift apart on a wide
  screen.
- **The side panel as an area.** The app's opens over the page, in a portal, and
  takes no room in the layout: it is a component of its own.
- **The `BottomNav` below `breakpoint-md` now.** What the guidelines say, but a
  component that does not exist yet.

## Consequences

- The value differs from the prototype's, kept frozen as a reference.
- The screenshots widen with the token, which sets their canvas (decision 0034).
- A screen that comes to need another width brings a page component with it.
