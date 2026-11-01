# 0023. Update routine

- Status: Accepted
- Date: 2026-11-01

## Context

`make outdated` and `make audit` say what can be updated and what is
vulnerable (decisions 0011, 0012 and 0018), but not when to look or how to
update. Some checks cannot be automated yet, such as the lines left out of the
report. Without a routine, updates pile up and arrive together, where a break
is hard to trace.

## Decision

- **Updates are checked at the start of every roadmap item**, with
  `make outdated` and `make audit`, and made before the item's work, in
  commits of their own.
- **One tool per commit**, with the packages that move with it, and
  `make test` passing. An update that needs more than a small fix waits, on
  record in `update.ignoreDeps` and in the roadmap.
- **A new major version is a step of its own**, raised with the user.
- **Messages read `build(deps): update <tool> to <version>`.**
- **The procedure and the checks made by hand live in `docs/updating.md`**, a
  guide that changes as checks come and go. This decision holds the policy.

## Alternatives considered

- **A fixed day each week.** Predictable, but easy to forget, and it may fall
  in the middle of an item.
- **All updates in one commit.** Faster, but a break is hard to trace and
  cannot be reverted alone.
- **`chore(deps)` as the message type.** Common, but `build` is the type used
  for every tool so far.
- **The procedure inside this decision.** One file less, but each change to
  the procedure would need a new decision.

## Consequences

- If work stops for a while, nothing checks until the next item starts.
  Continuous checks wait for continuous integration, a deferred roadmap item.
- `CLAUDE.md` points to the guide, so a new session follows it.
