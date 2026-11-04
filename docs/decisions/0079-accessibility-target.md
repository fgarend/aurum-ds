# 0079. The accessibility target

- Status: Accepted
- Date: 2026-11-03

## Context

Axe has run in every story since decision 0057, but no decision stated what
Aurum aims for, and the component reports never said what was left unchecked.
WCAG 2.2 is the W3C's current Recommendation, and WCAG 3 an incomplete draft. By
Deque's count, axe finds 57% of issues, in 16 of the 50 criteria of WCAG 2.1 AA,
and none of 1.4.11 or 2.4.7. Storybook's addon runs WCAG 2.0 and 2.1 by default,
and two tiny controls side by side passed it: axe 4.14's only rule tagged
`wcag22aa`, `target-size`, did not run. What axe reports as incomplete does not
fail: the Sidebar's 12 on the graphite gradient pass.

## Decision

- **The target is WCAG 2.2, level AA**, for a component used as documented. The
  app answers for its names, titles, language and content.
- **Axe runs by that target**, with `wcag22aa` in the addon's `runOnly`, beside
  the addon's default rules.
- **`docs/accessibility.md` says how each criterion is checked**, and a test holds
  it to every one of the 55, so none goes unanswered. It also holds the corner
  cases a component's stories go through.
- **Every component's proposal and report go through it**, saying what applies,
  what has a check and what does not.

## Alternatives considered

- **WCAG 2.1 AA.** The addon's default, but not the current Recommendation.
- **Level AAA.** More, but the W3C does not recommend it as a target for a whole
  site, since some of its criteria cannot be met by all content.
- **Trusting axe alone.** No list to keep, but most criteria are never looked at.
- **No stated level**, as React Aria. A division of duties that holds, but nothing
  to check a component against.

## Consequences

- The list shows gaps, marked as coming, which item 7.45 closes.
- The list says "none yet" where no component does something, and it has to change
  when one does.
- This is a target, not a claim of conformance: no screen reader has been tried yet.
