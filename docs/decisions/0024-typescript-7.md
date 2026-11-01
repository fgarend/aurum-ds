# 0024. TypeScript 7

- Status: Accepted
- Date: 2026-11-01

## Context

Decision 0013 kept TypeScript on its 6 line, so that lint and build could
still choose tools that need TypeScript's stable programmatic API, and set the
move to 7 for when `make test` passes on it. The lint chosen, Biome, does not
depend on TypeScript, nor does Vitest, and the build is not chosen yet. The
update routine tried TypeScript 7 and `make test` passed, with no change to
the code or the settings.

## Decision

- **TypeScript moves to its 7 line**, the native compiler. This replaces the
  version point of decision 0013. Its settings stay as they are.
- **TypeScript is back in `make outdated`.**
- **The build must work with TypeScript 7**, which was only a preference.

## Alternatives considered

- **Waiting for the build to be chosen.** Any build tool would stay open, but
  TypeScript would stay on an older line, checked by hand until then.

## Consequences

- Type checks are faster.
- Build tools that need TypeScript's stable API, such as
  `@microsoft/api-extractor`, are ruled out.
- TypeScript 7's programmatic API is still unstable, which matters to any
  future tool that reads types.
