# 0058. Audit ignore list

- Status: Accepted
- Date: 2026-11-02

## Context

Decision 0012 lists accepted advisories in `auditConfig` `ignoreGhsas` in
`pnpm-workspace.yaml`. pnpm 12 now calls that name deprecated: it still reads
it, but its current name is `audit.ignore`, and the list's first entries
arrive now, with two advisories of Storybook's docgen plugin that no update
fixes.

## Decision

- **Accepted advisories are listed in `audit.ignore`**, in
  `pnpm-workspace.yaml`, each with a comment giving its reason and when it
  goes. The rest of decision 0012 stands.

## Alternatives considered

- **The deprecated `auditConfig.ignoreGhsas`.** What decision 0012 says, but a
  name a later pnpm may stop reading.

## Consequences

- `pnpm audit --ignore` adds to this list, since it already exists.
