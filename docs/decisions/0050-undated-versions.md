# 0050. Undated versions

- Status: Accepted
- Date: 2026-11-02

## Context

pnpm enforces the minimum release age (decision 0009) by the publish time the
registry gives for each version. When the registry's metadata has no publish
time, which some private registries and mirrors omit, pnpm cannot count the
age. Its `minimumReleaseAgeIgnoreMissingTime` setting is true by default, and
then it skips the check and installs that version. The app sets it to false,
and asked for the same here.

## Decision

- **A version with no publish time is refused**:
  `minimumReleaseAgeIgnoreMissingTime: false` in `pnpm-workspace.yaml`, so
  pnpm fails the install instead of taking a version whose age it cannot
  count.
- **A test checks the setting**, so it cannot go back to pnpm's default
  unnoticed.

This adds to decision 0009, which it does not replace.

## Alternatives considered

- **pnpm's default.** Nothing to set, but a version the registry does not date
  gets past the release age, the gap decision 0009 closes.

## Consequences

- An install from a registry that gives no publish times fails. The public npm
  registry, which this repository uses, gives them.
