# Decisions

Each file records one decision: what was chosen, and why. A decision is
recorded by the commit that first depends on it.

## Rules

- **One decision per file**, named `NNNN-short-title.md`, numbered in the order
  the decisions are adopted.
- **Accepted decisions are never edited.** When a decision changes, a new one
  replaces it. The old one only gets its status changed to
  `Superseded by NNNN`, and the new one says which decision it replaces.
- **A decision replaced in part keeps its status**, with what was replaced
  after it: `Accepted; partly superseded by NNNN: what`. The new one says
  which points it replaces.
- **Alternatives are part of the record.** Each option that was considered
  gets one line saying why it was not chosen.
- **No versions.** Exact versions belong to the build files, not to decisions.

## Template

```markdown
# NNNN. Title

- Status: Accepted | Accepted; partly superseded by NNNN: what | Superseded by NNNN
- Date: YYYY-MM-DD

## Context

The problem and the forces that shaped the decision.

## Decision

What was chosen.

## Alternatives considered

- **Option.** Why it was not chosen.

## Consequences

What becomes easier, what becomes harder, and what must now be done.
```
