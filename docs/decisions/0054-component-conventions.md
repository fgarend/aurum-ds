# 0054. Component conventions

- Status: Accepted; partly superseded by 0059 and 0060: a component's test files, now its stories
- Date: 2026-11-02

## Context

The first component arrives. Nine design systems were surveyed from their own
repositories (Primer, Radix Themes, Base UI, Chakra, React Spectrum, GOV.UK,
Ant Design, Ark UI, shadcn/ui): most give each component a folder, extend the
native element's props, and differ on refs, polymorphism and default texts.
Aurum supports React 19 only (decision 0019) and checks types with
`isolatedDeclarations` (decision 0013).

## Decision

- **A folder per component, in `src/components/`, named in PascalCase**:
  `src/components/Button/`. Its files start with that name: `Button.tsx`,
  `Button.css`, `Button.browser.test.tsx`, `Button.visual.test.tsx`. Parts of
  a component are files named after it: `Table.tsx`, `TableRow.tsx`.
- **No `index.ts` in the folders.** `src/index.ts`, the public entry, exports
  each component from its own file.
- **Code that two components share goes in `src/internal/`**, never exported
  and free to change in any version; until a second component needs it, it
  stays in the folder of the one that does.
- **Props:** an exported interface named after the component,
  `ButtonProps`, that extends the props of the element it draws
  (`ComponentProps<"button">`) and passes the rest to it.
- **The `ref` is an ordinary prop**, with no `forwardRef`.
- **`className` and `style` are accepted**, after the component's own.
- **No `as` or `asChild` by default**; a component that needs another element
  decides it in its own item.
- **A component that holds a value** uses the native names when it wraps a
  native element (`value`, `defaultValue`, `onChange`); otherwise `value`,
  `defaultValue` and `onValueChange(value)`; a switch, `checked`,
  `defaultChecked` and `onCheckedChange(checked)`.
- **No `memo`, `useMemo` or `useCallback` written by hand.** The React
  Compiler is decided apart, when a measured need appears.
- **A component is a named function with its return type written**, exported
  by name.
- **Accessibility is hand-made on native elements**; a library is decided in
  the item of a component whose behaviour no native element gives.
- **A component carries no text of its own.** Every text comes from the app
  through props, required when the component needs it; Biome's
  `noJsxLiterals` keeps it so. Numbers and money arrive formatted by the app.

## Alternatives considered

- **Flat files, as Radix Themes and Chakra keep them.** Fewer folders, but a
  component's files apart.
- **An `index.ts` per folder.** Shorter imports, but a file that only repeats.
- **`forwardRef`.** What most systems keep, for React 18, which Aurum does
  not support.
- **`as` or `asChild` everywhere.** Flexible, but types that
  `isolatedDeclarations` strains and a merge of props and refs to keep.
- **Default texts in English, or translation files with a provider.** Less to
  pass, but a language inside the design system, or a structure for one app.

## Consequences

- The app replaces nothing: it passes every text a component shows.
- A component looks to the app like the element it draws, plus what Aurum
  adds.
- Biome's `useComponentExportOnlyModules`, which guards Fast Refresh, is off in
  `src/components/`: a component's file exports its props type, which
  TypeScript erases.
