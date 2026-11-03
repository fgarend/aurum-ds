# Roadmap

**Now:** 7.34.

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

Done: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.19, 7.20, 7.21, 7.22, 7.23, 7.24, 7.25, 7.26, 7.27, 7.28, 7.29, 7.35.

Dropped: 7.30, the gallery's title in the browser's tab. Storybook writes
"⋅ Storybook" after each story's name in its own code, with no setting, and
the first title comes from a setting it does not document; changing it would
mean a script fighting Storybook at every navigation, for a tab's text, while
the gallery already shows Aurum's brand mark.

- **7.34 · The components' CSS in the app's tests.** Each component imports
  its own CSS (decision 0055), and Vitest 5.0.5, the app's, hands a package's
  modules to Node, which fails on it: `Unknown file extension ".css"`, tried
  with the Icon of `dist/`. The app's tests of behaviour, in jsdom, need
  `server.deps.inline` for the package, or the `vmThreads` pool, both tried;
  `make pack` only resolves the exports, so it did not see it. Chosen with
  the user: the components keep importing their CSS, as Primer and
  Cloudscape do; the guides give the app the line for its tests
  (`server.deps.inline`), and `make pack` proves it, with a test in jsdom in
  its throwaway app. One test line, against one CSS line had the components
  stopped importing it, and a failure that shows at once instead of
  components with no style. Found while planning 7.32.
- **7.32 · The root.** A component around whatever uses Aurum, drawing only
  the page's font, background and colour: it imports the fonts, the tokens
  and the base styles, gives `.au-root`, and takes `className`; the three
  style sheets stay exported for whoever has no bundler. Chosen with the
  user, from the app's suggestion, so the app needs the dependency, the root
  and the line for its tests, and drops its three imports from `index.css`. Later, the place of
  the theme and of the portals' container (dialogs, menus), which otherwise
  land on `document.body`, outside `.au-root`. The stories take it in a
  decorator. Its name is `AurumRoot`, with the class `.au-root`, chosen with
  the user. `Root` names the place where Aurum begins, which stays true
  whatever it comes to carry, where `Provider` (context, which it is not
  only), `Theme` (none yet) or `BaseStyles` (only part of it) name a job. The
  prefix, as Mantine, Fluent and Chakra give their root alone, because it is
  the one component at the border, in the app's own code, where nothing else
  says it is Aurum's. The class follows decision 0055 written as: `au-` and
  the component's name without `Aurum`, which `au-` already says. While the
  app's two versions live together, it goes around the new shell, not the
  whole app, whose current screens would take Aurum's font and colours (the
  app's decision 0185).
- **7.33 · Aurum's layers after Tailwind's.** Decision 0053 counts on the
  app's CSS being outside layers. Tailwind 4 puts its utilities in a layer,
  declared before Aurum's in the app's `index.css`, so a component's rule
  wins over a utility in its `className`. Found while planning 7.32.
- **7.31 · The shell's frame.** Before the other components, as the app
  waits for it: the page's layout with slots for the side navigation (a strip
  at the top below `md`), the top bar, the side panel and the content up to a
  maximum width. The app puts its own navigation in the slot until the
  Sidebar comes. To decide: its name (`AppLayout` or `AppShell`); a top bar,
  which the app has (path and filters) and the prototype does not; below
  `md`, the app's strip at the top or the guidelines' `BottomNav`; and the
  wider content of the app's note page (1440px against 1240px; the prototype
  has 1200px on every screen).
- **7.7 · Badge.**
- **7.8 · Avatar.**
- **7.9 · AvatarGroup.**
- **7.10 · ScopeChip.**
- **7.11 · Button and IconButton.**
- **7.12 · PageHeader.**
- **7.13 · Sidebar.**
- **7.14 · The Sidebar in the shell.** The frame of 7.31 takes the Sidebar
  in its navigation slot: the shell is complete.
- **7.18 · Table.** Right after the shell, as the app asked: People is its
  first screen after the shell, and needs the table.
- **7.15 · Section and Card.**
- **7.16 · TextField, Select, SegmentedControl and Switch.** People, as the
  prototype draws it, is complete.
- **7.17 · Alert.**

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
