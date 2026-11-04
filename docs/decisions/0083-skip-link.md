# 0083. A link to skip the navigation

- Status: Accepted
- Date: 2026-11-03

## Context

Someone who moves by keyboard goes through every item of the navigation on every
page. WCAG 2.4.1 accepts a skip link (G1) or landmarks (ARIA11), but "landmarks are
not exposed by browsers directly to users", and WebAIM strongly recommends a skip
link on pages with repeated navigation. Aurum has no default texts (decision 0054),
so the app gives the link's text.

## Decision

- **`AppLayout` draws the link, with a navigation**: the first thing a keyboard
  reaches, hidden until it has focus, over the navigation when it does.
- **`skipLabel` is required with `navigation`**, by the types, so no app goes without
  it by forgetting, as the Sidebar's `aria-label`. This makes `AppLayoutProps` a
  union rather than the plain interface decision 0054 describes.
- **It moves focus to `main`**, with `tabindex="-1"`, which takes no ring since no key
  acts on it. The click moves focus itself, so the address and the history are left
  alone, and the app's router sees nothing. The `href` keeps it a link.

## Alternatives considered

- **`skipLabel` optional.** Nothing breaks for the app, but forgetting leaves a page
  without the link, with no warning.
- **A `SkipLink` the app places.** Any target, but one more thing to remember, and it
  has to come first.
- **A native jump to `#id`.** No JavaScript, but a hash in the address and an entry in
  the history, which a router can take as a navigation.
- **Landmarks alone.** No code, and `AppLayout` has them, but of use only with a screen
  reader.

## Consequences

- **Breaking:** an app using `navigation` adds `skipLabel`, so the next release goes up
  a minor version.
- That the address is left alone has no check: the page that runs the stories does not
  follow a link, with or without the code. Tried by hand with a real keyboard in the
  three browsers, against the gallery: without the code the address takes a hash, and
  with it, it does not.
- The link also skips the top bar, whose path and filters are reached by Tab from the
  top if the link is not used.
