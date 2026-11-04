# 0077. A router's links

- Status: Accepted; `SidebarItem` is now `NavItem` (decision 0086)
- Date: 2026-11-03

## Context

A plain anchor reloads the page, so an app with a router needs its components
that are links to navigate through it. Decision 0054 leaves `as` and `asChild` to
each component that needs another element. shadcn/ui's `asChild` and Base UI's
`render` take the link per element, and React Aria's `RouterProvider` and Polaris's
`linkComponent` take it once at the root. TanStack Router's `createLink` wraps any
component that passes its props and `ref` to an anchor, and keeps the routes
checked by the compiler. Tried with its real router, on a component shaped like
`SidebarItem`, in a throwaway project, the click navigates without reloading, the
`aria-current` is set, and a wrong route or missing `params` fail to compile.

## Decision

- **A component that is a link has no link API.** It draws an anchor, passes the
  rest and the `ref` to it (decision 0054), and the router wraps it:
  `const NavItem = createLink(SidebarItem)`. This holds for every such component.
- **`aria-current="page"` is the mark of the current page.**

## Alternatives considered

- **A `render` prop.** Works with any router, but one more prop on each link, for
  what `createLink` already does, and the app repeats `{...props}` on every item.
  It can come later without breaking anything.
- **`as` or `asChild`.** Rejected by decision 0054, for their types and their
  merging of props and refs.
- **A link set once on `AurumRoot`.** One place, but `href` as text, losing the
  checked routes and the router's own mark of the current page.

## Consequences

- Aurum knows no router, and has no router among its dependencies.
- React Router's `useHref` and `useLinkClickHandler` should fit the same shape,
  but that was not tried.
- That a real router works is proved in the app, not in Aurum's tests.
