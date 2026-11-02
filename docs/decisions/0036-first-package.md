# 0036. The first package

- Status: Accepted
- Date: 2026-11-02

## Context

The first release, `v0.1.0`, carries no component: the tokens, the fonts and
the base styles, three CSS files the app's bundler reads as they are.
`tokens.css` is already generated and kept in the repository (decision
0026). There is no TypeScript or JSX to compile yet.

## Decision

- **No build step for `v0.1.0`.** The bundler is chosen with the components'
  build, before the first component.
- **The package exports three CSS files by short names**, from where they
  live in `src/`: `@fgarend/aurum-ds/fonts.css`, `@fgarend/aurum-ds/tokens.css`
  and `@fgarend/aurum-ds/base.css`, and its `package.json`. Nothing else can
  be imported.
- **The app imports them in that order**: fonts, tokens, base styles.
- **A test resolves each name through the exports**, as the app would, and
  checks the list of exports is exactly the public one.

## Alternatives considered

- **Choosing the bundler now.** One step decided early, but with nothing to
  compile, it would be chosen blind.
- **One file importing the three.** A single import for the app, but no way
  to take only the tokens; it can be added later without breaking anything.
- **Paths into `src/`, with no exports.** Nothing to write, but every file of
  the repository could be imported, and moving one would break the app.

## Consequences

- The names of the exported files are public API (decision 0004): renaming
  one is a breaking change.
- The exports gain the components' entry when the components are built.
