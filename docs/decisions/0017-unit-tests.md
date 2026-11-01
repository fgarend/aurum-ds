# 0017. Unit tests

- Status: Accepted
- Date: 2026-11-01

## Context

Work is test first, so the repository needs a test runner from the start.
Later items add component tests in a DOM and visual tests in a browser, and
the runner should serve them too. The package has no code yet, but its public
API is already a promise: by decision 0004, changing it decides the next
version.

## Decision

- **Vitest.** One runner for unit, component and browser tests, with the same
  API. It strips types instead of reading them, so it does not depend on the
  TypeScript version. Vite, its peer dependency, is declared in
  `devDependencies` (decision 0010).
- **Tests sit next to the code they test**, named `*.test.ts`, or `*.test.tsx`
  with JSX.
- **`test`, `expect` and the rest are imported from `vitest`**, not global, so
  `types` stays empty (decision 0013) and library code cannot see them.
- **No Vitest configuration** while its defaults fit.
- **The first test checks the public API**: the names the package exports,
  exactly. Adding or removing one fails it until the list is updated, which
  shows in the diff.
- **`make test` runs the tests after the type check.**
- **Coverage is decided later**, in its own roadmap item, before the first
  component.

## Alternatives considered

- **Node's own test runner.** No dependency at all, and Node strips types by
  itself, but a DOM and browser tests would need other tools.
- **Jest.** Widely used, but it needs a transform for TypeScript, its ES
  module support is still awkward, and it has no browser mode.
- **A `tests/` folder.** Tests stay out of the package by themselves, but each
  file's test is in a mirrored tree, to be kept in step by hand.
- **Global test functions.** One import less per file, but their types would
  reach the library code too.
- **No test yet** (`passWithNoTests`). Nothing to write, but nothing would
  prove that tests run.

## Consequences

- Vitest brings Vite and a large dependency tree, kept in check by the release
  age (decision 0009) and `make audit`.
- The build must leave test files out of the package.
- Each new export updates the public API test in the same commit.
