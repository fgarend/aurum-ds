# 0042. Prototype server

- Status: Accepted
- Date: 2026-11-02

## Context

The prototype's screens in `reference/prototype/` (decision 0035) are
browsed while components are built. They were served by a long `docker`
command in `.claude/launch.json`, with the path of the repository on one
machine, so the file stayed out of the repository.

## Decision

- **`make prototype` serves the screens at `http://localhost:5173`**, with
  Vite, already a development dependency, in the test image. It runs until
  stopped with Ctrl+C.
- **The repository is mounted read-only**, since the prototype is frozen.
- **`.claude/launch.json` calls `make prototype`**, with no path of one
  machine, and is kept in the repository. Nothing else in `.claude/` is.

## Alternatives considered

- **Another static server.** Simpler to describe, but a new dependency for
  something Vite already does.
- **Opening the files from disk.** Nothing to run, but a `file://` address
  holds the path of one machine again, and the launch configuration has
  nothing to start.

## Consequences

- Port 5173 must be free while it runs.
- Any other tool can browse the prototype the same way, through `make`.
