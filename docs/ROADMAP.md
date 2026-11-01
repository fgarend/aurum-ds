# Roadmap

**Now:** 5.1.

Everything planned, in order. Each item is one small delivery, usually one
commit, and leaves the repository working. Every tool or standard is decided
in its own item.

## How items are numbered

- An item's ID is `milestone.item`. It is fixed, not a position: the order is
  the position in the list.
- A new milestone takes the next free milestone number. A new item takes the
  next free number in its milestone, wherever it is placed.
- A finished item moves to its milestone's `Done:` line, so no number is used
  twice.
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

Done: 5.12.

- **5.1 · Consumer requirements, inventory and component order.**
  `docs/consumers.md`: what the app's shell and People screen need; an
  inventory of what the prototype's screens repeat (decision 0035), each
  part a design system component, a new component or a screen layout; and
  the components in order of importance, use and simplicity, a component
  after those it depends on. The list becomes the component items of
  milestone 7. The app's bundler must
  handle `@import` and `url()` in CSS, and its build must carry the fonts'
  license notice (decision 0027). It puts `.au-root` where Aurum begins
  (decision 0030).
- **5.7 · Build.** The bundler and what `dist/` contains: at first
  `tokens.css`, `fonts.css` and `base.css`. Only tools that work with
  TypeScript 7 (decision 0024). `tsconfig.json` then emits: `noEmit`,
  `rootDir` and `outDir`. Test files, `src/test-setup.ts` and the
  `__screenshots__` folders stay out of the package. Consider the React
  Compiler, which memoizes by itself. Whether the token compiler in
  `src/tokens/` ships, or only `tokens.css`.
- **5.8 · Delivery.** How the app gets the built code from the git dependency.
  Update the guidelines' section on using Aurum (decision 0031).
- **5.9 · Package check.** `make pack`: what the app will receive.
- **5.10 · Release v0.1.0.** The changelog and the first tag. The app then
  installs it and adopts it, in its own repository.

## 7. One component per release

Each component is one item and ends in a release the app can use, a patch
version while in `0.y.z` (decision 0004). The decisions every component
relies on come first.

- **7.1 (was 5.2) · Component conventions.** Folder layout, naming, props and
  exports. Revisit the lint exception that lets `src/index.ts` only
  re-export. When to use `memo` and `useCallback`, context values included.
- **7.2 (was 5.3) · Styling approach.** How component CSS is written and
  shipped, and the class prefix. The user prefers prefixes tied to the
  repository, such as `au-`, over the artifact's undocumented `bs-`.
- **7.3 (was 5.4) · Accessibility approach.** Hand-made or a library, and the
  locale.
- **7.4 (was 5.5) · Copy and language.** Default texts and how the app
  replaces them. Settle Biome's `noJsxLiterals`, which forbids text written
  in JSX.
- **7.5 (was 5.11) · Coverage.** The tool, and whether `make test` requires a
  minimum.
- **7.6 (was 5.6) · Components.** One item per component, in the order of
  5.1, each the same way: tests, the component, its visual test (decision
  0034), a comparison with its reference screenshot in
  `reference/screenshots/` (decision 0033), the guidelines' Components
  section (decision 0031), the changelog, and a release. The `Icon` component
  decides how the package depends on Lucide (peer or dependency; the app is
  on 1.59.0), the stroke width (Aurum's 1.5 or Lucide's 2), names by concept
  as the app's `Icon` has them, and the three artifact names Lucide spells
  differently: `arrows-swap` (`arrow-left-right`), `more` (`ellipsis`) and
  `piggy` (`piggy-bank`).

## 6. One version per screen

- **6.1 · Position, Notes, Note, then the others by area.** Each screen is
  planned in items when its turn comes, with its prototype screen as the
  visual target (decision 0035).
- **6.2 · Release 1.0.0.** When every screen of the app uses Aurum and the old
  interface is gone.

## Deferred

No order between them; each becomes items when its time comes.

- **Storybook.** A component gallery, which would also serve `make run`.
- **Artifact mirror.** Keeping the Claude Design artifact in sync with this
  repository. Its previews load React 18.3.1, and the package supports only
  React 19 (decision 0019). Its icons must follow Lucide (decision 0029).
- **Continuous integration.** Running `make test` on GitHub.
- **License.** See decision 0002.
- **Dark theme.** When the app's first screen needs it. The token compiler
  fails on a second theme until then (decision 0026).
- **Image vulnerability scan.** The system packages inside the images (the
  Debian of the Node image), which `make audit` does not cover.
- **Vitest 5.** Move when `jest-dom`'s types accept it, with the type check
  passing, and drop Vitest and `@vitest/browser-playwright` from
  `update.ignoreDeps` in the same commit.
- **Other browsers.** WebKit, for Safari and the iPhone, and Firefox, once
  item 5.1 says which browsers the app supports (decision 0032).
- **Update bot.** Renovate or Dependabot opening pull requests, with the CI;
  check first that it respects the release age and updates image digests.
- **pnpm's update notice.** Every run says a newer pnpm exists, though the
  version is chosen by the release-age rule; `updateNotifier` turns it off.
