# 0064. Component exports

- Status: Accepted; partly superseded by 0074: the three style sheets among the exports
- Date: 2026-11-03

## Context

The package exported three style sheets from `src/` (decision 0036), and
`files` listed exactly them (decision 0037). The Icon is now built into
`dist/` (decision 0063), and the app must import it. Of eight design systems
surveyed, all offer a single entry, and five also a path per component,
three of them through one wildcard export. The app builds with Vite, which
drops the code it does not use when the package says which files do
something by being imported.

## Decision

- **The package's entry, `@fgarend/aurum-ds`, exports every component**,
  from `dist/index.js`, built from `src/index.ts`.
- **Each component also has its own path**, `@fgarend/aurum-ds/Icon`,
  through one wildcard export, `./*` to `dist/components/*/*.js`, so a new
  component adds no export. The guides recommend it to the app: it loads only
  the component it imports, in its tests too.
- **The three style sheets keep their names**, now pointing into `dist/`.
- **`files` is `dist/`**, where every export points.
- **`sideEffects` names only the style sheets**: the app's bundler may drop
  any code it does not use, and keeps the CSS each component imports.
- **No `types` condition:** each declaration file sits beside its
  JavaScript, where TypeScript finds it.
- **`make pack` installs the package's peers**, React and Lucide, and
  imports the entry, every style sheet and every component by its path.

This replaces, in decision 0036, the exports, and, in decision 0037, the
list in `files`.

## Alternatives considered

- **The single entry only.** One way to import, but the app's tests load
  every component.
- **A path per component only.** No entry that only re-exports, but one
  import per component, and the public API spread over folders.
- **An export written for each component.** Explicit, but one more line at
  each component, which the wildcard makes needless.

## Consequences

- Two ways to import a component; the guides name the path per component.
- `@fgarend/aurum-ds/<anything>` resolves to a file that may not exist,
  which the app sees as a missing module.
