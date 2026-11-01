# Roadmap

**Now:** 3.4.

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

Done: 3.1, 3.2, 3.3.

- **3.4 · Icons.** The 41 SVGs as package assets.
- **3.5 · Base styles.** The global CSS every component relies on.
- **3.6 · Brand book.** `docs/guidelines.md`, the living copy of the
  artifact's guidelines.

## 4. Visual test

- **4.1 · Browser tests.** The browser test mode, its provider, and the image
  with the browsers. Turn Biome's domain back on if its tool comes in (such as
  `playwright`), and teach the image report any new pinned image. Check that
  Geist and Geist Mono render from the package (decision 0027).
- **4.2 · Reference screenshots.** The artifact's previews rendered and
  approved, with `make reference`.
- **4.3 · Screenshot approval.** `make screenshots` and how a visual change is
  reviewed.

## 5. v0.1.0: the shell and People

- **5.1 · Consumer requirements.** `docs/consumers.md`: what the app's shell
  and People screen need. The app's bundler must handle `@import` and `url()`
  in CSS, and its build must carry the fonts' license notice (decision 0027).
- **5.2 · Component conventions.** Folder layout, naming, props and exports.
  Revisit the lint exception that lets `src/index.ts` only re-export. When to
  use `memo` and `useCallback`, context values included.
- **5.3 · Styling approach.** How component CSS is written and shipped, and
  the class prefix. The user prefers prefixes tied to the repository, such as
  `au-`, over the artifact's undocumented `bs-`.
- **5.4 · Accessibility approach.** Hand-made or a library, and the locale.
- **5.5 · Copy and language.** Default texts and how the app replaces them.
  Settle Biome's `noJsxLiterals`, which forbids text written in JSX.
- **5.11 · Coverage.** The tool, and whether `make test` requires a minimum.
- **5.6 · Components.** One item per component the shell and People need,
  listed from 5.1.
- **5.7 · Build.** The bundler and what `dist/` contains. Only tools that work
  with TypeScript 7 (decision 0024). `tsconfig.json` then emits: `noEmit`,
  `rootDir` and `outDir`. Test files and `src/test-setup.ts` stay out of the
  package. Consider the React Compiler, which memoizes by itself. Whether the
  token compiler in `src/tokens/` ships, or only `tokens.css`.
- **5.8 · Delivery.** How the app gets the built code from the git dependency.
- **5.9 · Package check.** `make pack`: what the app will receive.
- **5.10 · Release v0.1.0.** The changelog and the first tag.

## 6. One version per screen

- **6.1 · Position, Notes, Note, then the others by area.** Each screen is
  planned in items when its turn comes.
- **6.2 · Release 1.0.0.** When every screen of the app uses Aurum and the old
  interface is gone.

## Deferred

No order between them; each becomes items when its time comes.

- **Storybook.** A component gallery, which would also serve `make run`.
- **Artifact mirror.** Keeping the Claude Design artifact in sync with this
  repository. Its previews load React 18.3.1, and the package supports only
  React 19 (decision 0019).
- **Continuous integration.** Running `make test` on GitHub.
- **License.** See decision 0002.
- **Dark theme.** When the app's first screen needs it. The token compiler
  fails on a second theme until then (decision 0026).
- **Image vulnerability scan.** The system packages inside the images (the
  Debian of the Node image), which `make audit` does not cover.
- **Vitest 5.** Move when `jest-dom`'s types accept it, with the type check
  passing, and drop Vitest from `update.ignoreDeps` in the same commit.
- **Update bot.** Renovate or Dependabot opening pull requests, with the CI;
  check first that it respects the release age and updates image digests.
- **pnpm's update notice.** Every run says a newer pnpm exists, though the
  version is chosen by the release-age rule; `updateNotifier` turns it off.
