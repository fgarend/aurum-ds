# 0091. The move to Moneta

- Status: Accepted
- Date: 2026-11-04

## Context

Four days of work gave 90 decisions and 446 lines of components, while the app
already runs shadcn on React Aria. The owner's line: shadcn is the base of the
library, which evolves on top of it. For each thing, start from how shadcn does
it, ask whether to adapt, and only if not, add our own. The research, the trials
and the reasons are in `docs/direction-v2.md`, with its reports in
`docs/direction/v2/`.

## Decision

- **The library restarts as `fgarend/moneta`,** a new public repository, carrying
  what makes sense from this one. The package is `@fgarend/moneta`, delivered as
  this one is, by a release's tarball.
- **This repository stops taking components.** Its roadmap is paused. It stays
  intact while the app depends on it, and is archived once the app has moved.
- **The 90 earlier decisions stay here.** Moneta keeps its decisions in files by
  topic, edited in place.
- **Questions 1 to 7 of `docs/direction-v2.md`** hold the owner's other answers.
  The rest are asked when their steps arrive.

## Alternatives considered

- **Rename this repository and rewrite it in place.** One history, but old tags
  and changelog under a new name, and a sweep of the old names.
- **Keep the name and change only the base.** Drops the name the owner wants.
- **Keep building here on plain CSS.** The first review's proposal kept part of
  this, and started from Aurum instead of shadcn: `docs/direction.md`.

## Consequences

- No new releases of `@fgarend/aurum-ds`, unless the app needs a fix before it
  moves.
- The app's plan, `.work/MIGRACAO-FRONTEND.md`, gains these names when the move
  reaches it.
