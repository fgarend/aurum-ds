# 0016. Lint and format

- Status: Accepted
- Date: 2026-11-01

## Context

The code needs one style, applied by a tool rather than by review, and a lint
that catches mistakes the type check does not. The tools must work with
TypeScript 7 when the move comes (decision 0013), and they will check React
components and their accessibility.

## Decision

- **Biome, for both lint and format.** It does not depend on TypeScript, and
  its rules cover React hooks and accessibility.
- **Every stable rule is on** (`preset: "all"`). A rule turned off or adjusted
  carries a comment with the reason, in `biome.jsonc`.
- **Biome's default style**, with the indentation read from `.editorconfig`,
  so the editor and the formatter share one source.
- **The whole repository is checked**: code, configuration and Markdown.
  `reference/` is left out because it is never edited, and `pnpm-lock.yaml`
  because pnpm writes it. Files listed in `.gitignore` are left out too.
- **`make format` writes in place** with `biome check --write`: format,
  import order and the fixes Biome marks as safe. Unsafe fixes are left to be
  made by hand.
- **`make test` runs `biome ci` before the type check, and warnings fail it
  too.** Most lint and format failures are fixed by `make format`, so they
  come first. A warning that does not fail is soon ignored.

## Alternatives considered

- **ESLint with `typescript-eslint` and Prettier.** The most complete rules,
  including the ones that read types, and React's own plugins, but
  `typescript-eslint` does not work with TypeScript 7, and it means several
  packages and configuration files.
- **oxlint and oxfmt.** Fast, and they work with TypeScript 7, but the
  formatter is not stable yet.
- **The recommended rules only.** Fewer adjustments, but style and
  consistency rules would pass unchecked.
- **Tabs, Biome's default indentation.** `.editorconfig` would change, and so
  would the files already written.
- **Formatting only, in `make format`.** Fewer changes, but imports and safe
  fixes would still need hand work before `make test` passes.
- **Checking only `src/`.** Configuration and documents would go unchecked.

## Consequences

- Fewer rules read types than with `typescript-eslint`.
- Unused code is caught twice, by Biome and by TypeScript, which checks with
  the full types. Biome runs first, so its message is the one seen.
- `make format` uses the `node_modules` that `make install` leaves on the
  host.
- Rules for React, tests and components show up as code arrives, and each
  adjustment is made in that commit.
