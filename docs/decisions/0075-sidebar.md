# 0075. Sidebar

- Status: Accepted
- Date: 2026-11-03

## Context

The original Sidebar takes its whole content as data, a list of `items` and
`scopes`, with props for its brand, counts, sizes and collapsing. Aurum is a
general library, so the reference is a guide to criticize. Items whose links
are a router's cannot be data, a Sidebar should not know what a person is, and
what it does when it is empty, or with too much to hold, has to be stated.

Primer's `NavList` and shadcn/ui's `Sidebar` are made of parts. For long labels,
Gestalt breaks them into lines and Maersk advises against cutting them in
navigation. VuePress and GitLab scroll to the current item, moving only what is
needed. Below a breakpoint, Carbon and shadcn/ui hide the navigation in a drawer.

## Decision

- **Three parts**: `Sidebar`, a `nav` with a required `aria-label`, `header`,
  `footer` and its items; `SidebarSection`, a title naming a list; and
  `SidebarItem`, an anchor with a required Lucide `icon` and an optional `end`.
  All three come from one file, `Sidebar.tsx`, since the path
  `@fgarend/aurum-ds/Sidebar` reaches only it.
- **Three variants**, `inverse`, the default, `surface` and `canvas`, made only
  of tokens, so a theme to come changes them with the tokens. A theme stays apart.
- **The areas take anything.** `header` replaces the brand and its mark, which
  the app draws, and `end` replaces the count and its tone, which the Badge will
  fill. No area is drawn without its content.
- **The current page is `aria-current="page"`**, set by the app or its router,
  with an outline, transparent, that shows where forced colours remove the fill.
- **When empty**, no empty area, line, list or section title is drawn: an empty
  section is hidden in CSS, however its items came to be missing.
- **With too much**: only the items' area scrolls, and on a screen too short for
  that the whole rail does. A long name breaks into lines and its item grows, and
  `end` keeps its width. The current item scrolls into view by itself, moving
  only the Sidebar and only if it is out of view.
- **Below `breakpoint-md`, a strip** across the top, which scrolls, with each
  name whole and the titles for screen readers only, as `AppLayout` stacks it. It
  takes only CSS and serves a wide screen at high zoom too.
- **The reference's values off the tokens take the nearest token**: 4px between
  items, not 2px, `inverse-active`, `on-inverse-subtle`, and the gold glow as
  `gold` at 7% with `color-mix`.

## Alternatives considered

- **A list of data.** Shorter, and what the reference does, but plain anchors
  that reload the page, or more options for each case.
- **`brand` and `brandMark`.** The gold tile kept in one place, but a Sidebar
  knowing how a brand is drawn.
- **`count` and `countTone`.** Ready to use, but good only for counts, and a
  second pill apart from the Badge.
- **Cutting a long name with an ellipsis.** Even rows, but text lost, and shown
  whole only on hover, which touch and keyboard lack.
- **A drawer below the breakpoint.** The common pattern, but hidden navigation,
  and it needs the Dialog's focus and layer: item 7.41.
- **The switch of people as a prop.** What the reference does, but a matter of
  finance in a general navigation: item 7.39, a component of its own.
- **Collapsing, and sections that open, now.** Larger on their own: items 7.40
  and 7.42.

## Consequences

- The app writes more than a list, and wraps `SidebarItem` once (decision 0077).
- The look differs a little from the frozen reference: rows slightly apart, and
  section titles slightly lighter.
- Hover has no check: the stories' `userEvent` does not trigger `:hover`.
- The strip has checks but no screenshot: the screenshots run at one width.
