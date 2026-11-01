# 0005. The reference snapshot

- Status: Accepted
- Date: 2026-11-01

## Context

Aurum was made in Claude Design, as an artifact of the Design System type:
guidelines, tokens, icons and 27 components written by hand as one classic
script for React 18, with no sources and no tests. The artifact can be edited
at any time, and there is no official tool to turn it into code, so the
conversion is done once, by reading it.

## Decision

- **This repository is the source** from now on. The artifact stops being the
  reference and is later kept in sync with the repository.
- **A frozen copy of the artifact lives in `reference/artifact/`**, as the
  specification for porting. A ported component looks and behaves like its
  original there, unless a decision says otherwise.
- **The copy holds the artifact's own content:** the files of its `project/`
  folder and the 41 icons of its asset store. The files of the artifact type
  are left out.
- **The copy is never edited.** `reference/SHA256SUMS` checks every file, and
  `.gitattributes` keeps the bytes exactly as they came.
- **The copy stays** while any of it is useful as a specification. Removing it
  is a decision of its own.

## Alternatives considered

- **The artifact as the source until the port is complete.** Every component
  would wait for a full port before the repository could change it, while
  components are only built when the app needs them.
- **Regenerating the icons from `bundle.js`.** The result might not match the
  original files byte for byte.
- **Copying the artifact type's files too.** They belong to the type, not to
  Aurum.
- **Removing the copy when the port ends.** Components are built on demand, so
  the port may never be complete.
- **No copy, reading the artifact online.** It can change or disappear, and
  nothing would prove what was ported from.

## Consequences

- Porting a component starts from files that cannot change.
- Changing the design is done in this repository, never in the artifact.
- Keeping the artifact in sync with the repository is a later item.
