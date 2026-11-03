# 0069. The components' CSS in the app's tests

- Status: Accepted
- Date: 2026-11-03

## Context

Each component imports its own CSS (decision 0055), which the app's bundler,
Vite, takes. Vitest, the app's test runner, hands a package's modules to Node
itself, and Node fails on the import of a style sheet: `Unknown file
extension ".css"`. Tried in a throwaway app with the packed package: a test
that only imports the Icon fails so, in Vitest's `node` environment as in
jsdom, and passes once Vitest's `server.deps.inline` names the package, which
hands it to Vite. `make pack` resolved the exports and checked the types, so
it did not see it. Primer and Cloudscape also ship components that import
their CSS.

## Decision

- **The components keep importing their own CSS.**
- **The guides give the app the line for its Vitest settings**:
  `test: { server: { deps: { inline: ["@fgarend/aurum-ds"] } } }`, in the
  README and `docs/consumers.md`.
- **`make pack` proves it**: its throwaway app installs Vitest and Vite at the
  versions used here, and runs, in Vitest's `node` environment, a test that
  imports the entry and every component by its path, with that line.

## Alternatives considered

- **Components that do not import their CSS**, a style sheet the app imports
  instead. Nothing for the app's tests, but a line for the app's styles, and
  a component with no style when it is forgotten, which no failure shows.
- **The test in jsdom, as the app's run.** The same failure, but jsdom to
  install at a version this repository does not use, which `make outdated`
  would not follow.
- **Vitest's `vmThreads` pool.** It passes too, but changes how all the app's
  tests run, for one package.

## Consequences

- The app adds one line to its test settings; a test that imports a
  component fails at once without it.
- `make pack` installs two packages more in its throwaway app.
