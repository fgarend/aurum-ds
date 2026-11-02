# 0020. Component tests

- Status: Accepted; partly superseded by 0039: where Vitest's settings live, and by 0052: jsdom, Testing Library and jest-dom
- Date: 2026-11-01

## Context

Components are tested as their users meet them: by role, by accessible name,
and by keyboard. The tests run fast, in Node, with a simulated DOM; real
browsers come with the visual tests. React itself is now a development
dependency, on the version the package supports (decision 0019).

## Decision

- **jsdom is the DOM.** It follows the specifications most closely, which
  accessible names and roles depend on.
- **Testing Library renders and queries** (`@testing-library/react`, with its
  peer `@testing-library/dom`), by role, text and accessible name rather than
  by markup.
- **`user-event` drives interactions**, with the full sequence of events a
  person causes, focus and keyboard included.
- **`jest-dom` adds DOM matchers** such as `toHaveAccessibleName` and
  `toHaveFocus`.
- **Vitest stays on its line 4** while `jest-dom`'s types do not accept
  Vitest 5, and is left out of `make outdated` until then.
- **JSX uses React's automatic runtime** (`jsx: react-jsx`).
- **The file extension chooses the environment**: a `*.test.tsx` runs in
  jsdom, any other test in Node, as two Vitest projects.
- **Vitest's configuration lives in `infra/`**, since Vite's types bring
  Node's along (decision 0018). The setup that registers the matchers and
  cleans up after each test is `src/test-setup.ts`, kept out of the package.
- **A test of the setup itself** renders a fictitious component, reaches it
  with the keyboard and clicks it, so an update that breaks one of these tools
  fails there first.
- **React, ReactDOM and their types are declared in `devDependencies`** on the
  latest React 19.

## Alternatives considered

- **happy-dom.** Faster and lighter, but less faithful in the APIs that
  accessible names rely on.
- **`react-dom/client` with `act` and `querySelector`.** No dependency, but
  tests tied to markup and blind to accessibility.
- **`fireEvent`.** Already included, but it fires only the event asked for,
  with no focus or keyboard.
- **Plain `expect` on DOM properties.** No dependency, but no direct check of
  accessible names.
- **Vitest 5 with hand-written matcher types.** The latest line, but a patch
  over `jest-dom`'s types, which also declare CommonJS for ES module code.
- **A comment choosing the environment in each file, or jsdom for all.** The
  comment can be forgotten, and Node scripts would run in a browser
  environment.
- **The configuration at the root.** Where Vitest looks by default, but it
  would bring Node's types into the library or go unchecked.

## Consequences

- Component tests use the `.test.tsx` extension, and other tests `.test.ts`.
- Each Biome rule that fires on the first components is settled in its own
  commit, with the reason in `biome.jsonc`.
