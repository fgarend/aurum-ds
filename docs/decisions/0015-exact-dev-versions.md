# 0015. Exact development versions

- Status: Accepted
- Date: 2026-11-01

## Context

The lockfile already fixes what is installed, but `package.json` is where a
version is read and where an update shows in a diff. Updates are meant to be
deliberate, one per commit.

## Decision

- **Development dependencies are written with their exact version**, with no
  range. pnpm saves them this way (`saveExact` in `pnpm-workspace.yaml`).
- **Peer dependencies keep their ranges** (decision 0010), since they state
  what the app may use.

## Alternatives considered

- **Ranges, pnpm's default.** `pnpm update` could move a version within its
  range with no visible change to `package.json`.

## Consequences

- Every update changes `package.json` and shows in the diff.
- The app is not affected: it does not install development dependencies.
