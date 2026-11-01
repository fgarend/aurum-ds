# 0009. Minimum release age

- Status: Accepted
- Date: 2026-11-01

## Context

A malicious version published to a registry is usually found and removed
within hours or days. Taking a version as soon as it is published leaves no
time for that. The same risk applies to the dependencies and to the tools and
images pinned by hand.

## Decision

- **No version younger than 7 days is used**, counted from the release of
  that version.
- **For dependencies**, pnpm enforces it with `minimumReleaseAge` in
  `pnpm-workspace.yaml`. Setting it makes pnpm strict: an install with no
  version old enough fails instead of taking a newer one.
- **For tools and images pinned by hand** (Node, pnpm), the rule is applied
  when choosing the version. A rebuild of an official image with the same
  version does not restart the count.
- **A security fix may enter earlier**, as a recorded exception: in
  `minimumReleaseAgeExclude` for a dependency, or in the commit that pins a
  tool, with the reason.

## Alternatives considered

- **pnpm's default of one day.** Only catches what is found very quickly.
- **Three days.** A middle ground, with less margin for the same cost.
- **Only for dependencies.** The images run everything, so they carry the same
  risk.
- **Counting from an image's rebuild.** Official images are rebuilt often, so
  the system inside would always lag.

## Consequences

- New versions, and their fixes, arrive at least a week late, unless they are
  security fixes taken as exceptions.
- Choosing a version to pin starts by checking its release date.
