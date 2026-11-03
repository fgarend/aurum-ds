# 0063. The build, into dist/

- Status: Accepted
- Date: 2026-11-03

## Context

The package delivered only CSS, which needs no build. The Icon is TypeScript
and JSX, which the app cannot import as they are. The package runs no script
when installed (decision 0037), so what it delivers must be built before:
the app installs a release's packed package (decision 0051), and, to test a
commit before a release, the commit itself from GitHub. The build must work
with TypeScript 7 (decision 0024). Libraries publish their code unminified,
as Lucide does here: the app's bundler minifies its own result.

## Decision

- **`make build` writes `dist/`**: TypeScript emits each module as a
  JavaScript file and its declarations (`tsconfig.build.json`), with no
  bundler, and `scripts/build-package.ts` copies every style sheet of `src/`
  beside them. `dist/` is never edited by hand.
- **`dist/` holds everything the app receives**: the components' code and
  their CSS, and the three style sheets it imports first (`tokens.css`,
  `fonts.css`, `base.css`). Tests and stories stay out.
- **`dist/` is kept in the repository**, so any commit installs from GitHub
  as it is. A check in `test/` builds into a folder of its own and fails
  when `dist/` differs, as the one for `tokens.css` does. GitHub folds
  `dist/` in diffs (`linguist-generated`), and Biome leaves it out.
- **Nothing more than TypeScript does:** no minifying, no CommonJS, no
  source maps.

## Alternatives considered

- **`dist/` only in the packed package.** No generated files in the
  repository, but no commit to test in the app before a release, and no
  install from a tag (decision 0037).
- **A bundler.** One file, but the app could no longer take only the
  components it uses; and few bundlers work with TypeScript 7 yet.
- **Minifying.** Smaller files, which the app's bundler shrinks anyway, and
  unreadable code in the app's errors.
- **CommonJS beside ES modules.** For older tools, which the app does not
  use.
- **The base style sheets left in `src/`.** Three files fewer to copy, but
  the package served from two folders.

## Consequences

- A change to `src/` needs `make build`, or `make check` fails and says so.
- Each change to a component shows twice in a commit, the second folded.
- The exports still point to `src/` until they move to `dist/`, in the next
  step of item 7.19.
