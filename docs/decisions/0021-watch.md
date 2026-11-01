# 0021. Watch

- Status: Accepted
- Date: 2026-11-01

## Context

Work is test first: write a test, see it fail, make it pass. That loop needs
the tests to run again on every change, in a container like everything else,
with the edits made on the host.

## Decision

- **`make watch` runs only Vitest in watch mode**, which reruns the tests each
  change affects. Lint and types are left to the editor and to `make test`,
  which stays the full check before a commit.
- **The repository is mounted**, so edits reach the container as they are
  made.
- **`node_modules` comes from the test image**, through an anonymous volume
  that the image fills, so the tests run on what the lockfile lists, as in
  `make test`. The volume is removed on exit.
- **The container is attached to the terminal** (`-it`), so Vitest's keys
  work and Ctrl+C stops it.

## Alternatives considered

- **Vitest with `tsc --watch`.** Type errors in the terminal too, but two
  outputs mixed together.
- **All of `make test` on every change.** Every check, but seconds per change.
- **The host's `node_modules`.** No extra volume, but it may not match the
  lockfile, and needs `make install` first.
- **No terminal attached.** It could run from a script, but with no keys and
  no easy stop.

## Consequences

- A change to `package.json` needs the watch restarted, to rebuild the image.
- `make watch` needs an interactive terminal.
