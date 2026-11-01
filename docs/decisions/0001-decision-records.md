# 0001. Decision records

- Status: Accepted
- Date: 2026-10-31

## Context

The design system is built in small steps, and each step settles choices
about structure, tools and design. Those choices must survive the
conversations where they were made, with their reasons and the options that
were turned down, so that a later change starts from what was known.

## Decision

- **One file per decision** in `docs/decisions/`, with the rules and the
  template in `docs/decisions/README.md`.
- **Each decision lands in the commit that first depends on it**, so the
  history shows the decision next to the change it explains.

## Alternatives considered

- **A single table in `docs/decisions.md`.** Compact, but with no room for the
  reasons or the alternatives, and a decision changes by rewriting its line.
- **Decisions only in commit messages.** Kept next to the change, but hard to
  find and impossible to mark as superseded.

## Consequences

- Every choice that shapes the repository has a file to point to.
- Changing a decision means writing a new one that supersedes it.
