# 0003. The roadmap

- Status: Accepted
- Date: 2026-11-01

## Context

The work is done in small deliveries, each decided with the user before it is
made. Every planned delivery must be visible in one place, in order, so that
nothing discussed is lost and a new session knows where to resume. Items are
cited in conversations, commits and decisions, so their identifiers must not
change when the plan changes.

## Decision

- **One file, `docs/ROADMAP.md`**, holds every planned item in order, grouped
  by milestone, each with a title and a short description. Deferred items
  follow, with no order.
- **Its first line says where the work is now.**
- **Items are identified as `milestone.item`**, a fixed ID, not a position:
  - a new milestone takes the next free milestone number, and a new item the
    next free number in its milestone, wherever it is placed;
  - a finished item moves to its milestone's `Done:` line, so no number is
    used twice;
  - an item moved to another milestone takes a new ID there and keeps the old
    one in parentheses.
- **The roadmap is updated in the commit of each item.**

## Alternatives considered

- **A detailed plan file per milestone.** Less to rewrite when early
  decisions change later ones, but the deliveries would be spread across files.
- **Numbering by position.** Inserting or moving an item would renumber the
  ones after it and break every citation.
- **A global counter (`R12`).** Stable, but says nothing about where the item
  belongs.
- **Slugs.** Stable and self-describing, but long to cite and tempting to
  rename with the title.
- **GitHub issues.** Stable numbers, but the plan would leave the repository.

## Consequences

- The whole plan is read in one file.
- Moving an item across milestones changes its ID, so it is rare and noted.
