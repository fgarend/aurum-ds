# Roadmap

**Now:** 7.13.

Everything planned, in order. Each item is one small delivery, usually one
commit, and leaves the repository working. Every tool or standard is decided
in its own item.

## How items are numbered

- An item's ID is `milestone.item`. It is fixed, not a position: the order is
  the position in the list.
- A new milestone takes the next free milestone number. A new item takes the
  next free number in its milestone, wherever it is placed.
- A finished item moves to its milestone's `Done:` line, so no number is used
  twice. A dropped item moves to its milestone's `Dropped:` line, with the
  reason, so it is not raised again.
- An item moved to another milestone takes a new ID there and keeps the old
  one in parentheses: `3.7 (was 2.4)`.

## 0. Base

Done: 0.1, 0.2, 0.3.

## 1. Reference

Done: 1.1, 1.2.

## 2. Skeleton

Done: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14.

## 3. Tokens and assets

Done: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6.

## 4. Visual test

Done: 4.1, 4.2, 4.3.

## 5. v0.1.0: the base delivered to the app

The first release carries no component: the tokens, the fonts and the base
styles, which the app can adopt on its own. It proves the way from this
repository to the app with little at stake.

Done: 5.1, 5.7, 5.8, 5.9, 5.10, 5.12, 5.13, 5.14, 5.15, 5.16, 5.17, 5.19, 5.20.

Dropped: 5.18, the renders rewritten as a plain program run by Playwright.
Rendering through a browser test runner is a common pattern that decision
0039 already names (`.render.ts`), the renders are deterministic (decision
0041), and the rewrite would have traded the previews' React 19 for the
snapshot's React 18 with nothing gained.

## 7. One component per release

Each component is one item and ends in a release the app can use, a patch
version while in `0.y.z` (decision 0004). The decisions every component
relies on come first. The components follow the order in
`docs/consumers.md`, each the same way: stories that check it, the
component, a story tagged for its screenshot (decisions 0059 and 0060), a
comparison with its reference screenshot (decisions 0033 and 0035), the
guidelines' Components section (decision 0031), the changelog, and a
release.

Done: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.19, 7.20, 7.21, 7.22, 7.23, 7.24, 7.25, 7.26, 7.27, 7.28, 7.29, 7.31, 7.32, 7.33, 7.34, 7.35, 7.36.

Dropped: 7.30, the gallery's title in the browser's tab. Storybook writes
"⋅ Storybook" after each story's name in its own code, with no setting, and
the first title comes from a setting it does not document; changing it would
mean a script fighting Storybook at every navigation, for a tab's text, while
the gallery already shows Aurum's brand mark. 7.14, the Sidebar in the shell:
it is the Sidebar's own item, in the `navigation` of `AppLayout`.

- **7.13 · Sidebar.** First, since the app's shell waits for it, in the
  `navigation` of `AppLayout`. Without the switch of people (7.39): the app's
  top bar chooses the person.
- **7.7 · Badge.** The shell's environment and People's default holder.
- **7.15 · Section and Card.** People.
- **7.18 · Table.** People, as the app asked before that screen.
- **7.8 · Avatar.** People.
- **7.17 · Alert.** People is complete.
- **7.11 · Button and IconButton.**
- **7.12 · PageHeader.**
- **7.16 · TextField, Select, SegmentedControl and Switch.**
- **7.9 · AvatarGroup.** When a screen asks for it.
- **7.10 · ScopeChip.** When a screen asks for it.
- **7.39 · The Sidebar's switch of people.** With Avatar and AvatarGroup, when
  the app asks for it.
- **7.37 · The side panel.** The app's opens over the page, in a portal, so it
  is a component of its own, not an area of `AppLayout` (decision 0073). When a
  screen asks for it.
- **7.38 · BottomNav.** The guidelines' navigation below `breakpoint-md`, in
  `AppLayout` as an optional prop, where the navigation sits at the top until
  then (decision 0073). When a screen asks for it.

## 6. One version per screen

- **6.1 · Position, Notes, Note, then the others by area.** Each screen is
  planned in items when its turn comes, with its prototype screen as the
  visual target (decision 0035).
- **6.2 · Release 1.0.0.** When every screen of the app uses Aurum and the old
  interface is gone.

## Deferred

No order between them; each becomes items when its time comes.

- **Artifact mirror.** Keeping the Claude Design artifact in sync with this
  repository. Its previews load React 18.3.1, and the package supports only
  React 19 (decision 0019). Its icons must follow Lucide (decision 0029).
- **License.** See decision 0002.
- **Dark theme.** When the app's first screen needs it. The token compiler
  fails on a second theme until then (decision 0026). Storybook's interface
  then follows the system's light or dark mode, with a theme for each, from
  the tokens (decision 0057).
- **Image vulnerability scan.** The system packages inside the images (the
  Debian of the Node image), which `make audit` does not cover.
- **Update bot.** Renovate or Dependabot opening pull requests, with the CI;
  check first that it respects the release age and updates image digests.
- **Storybook's accepted advisories.** Two advisories of `glob` and
  `minimatch`, through Storybook's docgen plugin, sit in `audit.ignore`
  (decision 0058). They go when the plugin depends on `glob` 14.0.2 or later.
- **Storybook's deprecated loader.** Every test run warns `DEP0205`:
  Storybook loads its settings with Node's `module.register()`, which Node
  deprecates for `module.registerHooks()`. It goes when Storybook moves.
- **pnpm's update notice.** Every run says a newer pnpm exists, though the
  version is chosen by the release-age rule; `updateNotifier` turns it off.
