# 0065. The package's types, checked in make pack

- Status: Accepted
- Date: 2026-11-03

## Context

`make pack` installs the packed package in a throwaway app and resolves every
export (decision 0038), but nothing checked that the app's TypeScript accepts
the package's declarations. Primer and MUI check their packages with publint,
`@arethetypeswrong/cli` and a size budget (size-limit): three tools more. The
throwaway app can check the types with the TypeScript already here. Tried
so, TypeScript refused the built `Icon.d.ts`: it keeps the component's
`import "./Icon.css"`, which an app resolves only through a declaration for
CSS files, such as Vite's, or by not checking the package's declarations
(`skipLibCheck`), as the app does today.

## Decision

- **`make pack`'s throwaway app checks the package's types**: it installs
  TypeScript and React's types at the versions used here, and checks a module
  that imports the entry and every component by its path, with settings like
  a Vite app's and `skipLibCheck` off, the strictest an app may choose.
- **`make build` drops the style sheet imports from the declarations**: a
  declaration describes types, and a style sheet has none. The JavaScript
  keeps them, so the app still receives each component's CSS.
- **No publint, `@arethetypeswrong/cli` or size-limit.** The exports and
  `files` are checked in `test/`, and resolved and type-checked by
  `make pack`; a size budget comes when size becomes a problem.

## Alternatives considered

- **The three tools.** What Primer and MUI do, but three dependencies more
  for what the throwaway app already checks.
- **Leaving the style sheet imports in the declarations.** Nothing to strip,
  but an app checking the package's declarations would fail.
- **Shipping a declaration for CSS files.** The imports would resolve, but
  the package would declare every `.css` import of the app.

## Consequences

- `make check`, and so continuous integration, checks the package's types as
  an app's TypeScript sees them.
- A new component is type-checked by its path with no change to the check.
