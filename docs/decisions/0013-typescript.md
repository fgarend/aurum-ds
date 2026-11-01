# 0013. TypeScript

- Status: Accepted; partly superseded by 0024: the TypeScript line
- Date: 2026-11-01

## Context

The components are written in TypeScript. Its current line, 7, is a native
compiler whose programmatic API is still unstable, and several tools that
read types through that API, such as `typescript-eslint`, only accept the
line before it, 6. Lint and build are chosen later, so the version must not
close their options. The code is a library that runs in the app's browser,
and its consumers can be bundlers or Node.

## Decision

- **TypeScript 6, the last line with the stable API.** Lint and build prefer
  tools that also work with 7, and the move to 7 is a deferred roadmap item.
  It happens when `make test` passes on 7: a tool's declared range is not
  proof that it works.
- **`tsconfig.json` only checks types** (`noEmit`). What is emitted, and where,
  is decided with the build.
- **Every check TypeScript offers is on**, beyond `strict`. `noUnusedLocals`
  and `noUnusedParameters` may move to the lint, if it does them better.
- **`isolatedDeclarations` is on**: every export states its type, so the
  public API is explicit and fast tools can write the declaration files.
- **Node's module rules** (`module: nodenext`), as TypeScript's guide advises
  for libraries: code that passes them also works in bundlers.
- **`target` and `lib` are written, not left to float**, to the newest
  ECMAScript year whose features are all widely available in Baseline, plus
  the DOM. Moving up a year is a deliberate change.
- **No global types** (`types: []`): Node's types cannot leak into browser
  code.
- **Sources live in `src/`**, with `src/index.ts` as the public entry.
- **TypeScript is left out of `make outdated`** (`update.ignoreDeps`) until
  the move to 7, so the report does not always fail on it. Meanwhile, its 6
  line is checked by hand in the update routine.

## Alternatives considered

- **TypeScript 7 now.** Much faster, but it rules out the tools that need the
  stable API, before lint and build are chosen.
- **Both lines installed.** 7 for the check and 6 for the tools: two
  versions to keep in step.
- **Only `strict`.** Fewer annotations, but errors the extra checks catch,
  such as reading a missing array item, would pass.
- **Bundler module rules.** Imports without extensions, but code that only
  works in a bundler could pass, and bundled declaration files would be
  required.
- **The floating `target`.** Nothing to write, but each TypeScript update
  could allow features some browsers lack, with no decision.
- **Letting `make outdated` fail on TypeScript 7.** Nothing hidden, but a
  report that always fails stops being read.

## Consequences

- Relative imports end in `.js`, and type-only imports say `import type`.
- Exported functions and components state their return types.
- Enums and namespaces are not used.
- The build revisits `tsconfig.json` to emit, and JSX is set when React
  arrives.
