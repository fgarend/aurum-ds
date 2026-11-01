# 0031. Guidelines

- Status: Accepted
- Date: 2026-11-01

## Context

The artifact's brand book, its `README.md`, holds the design's principles,
content rules, visual foundations, icon rules and component catalogue. It
names about eighty tokens. Some of it no longer holds here: the fonts, the
utility class's prefix and the icons have changed by decision, and its
sections on components and on using Aurum describe the artifact's own
bundle, which this package does not have.

## Decision

- **`docs/guidelines.md` is the living copy of the brand book**, copied from
  the snapshot.
- **It changes only where a decision changed the design**, and each change
  names its decision. Everything else stays as the artifact wrote it.
- **What does not exist yet is not promised**: the catalogue stays, as the
  design's intent, but the text says the package builds it one component at
  a time; using Aurum describes what exists today.
- **Tokens are named as `tokens.json` names them**, and the guidelines say
  once how they appear in CSS, with the `au-` prefix. Utility classes are
  named with it.
- **A test checks that every token the guidelines name exists**, with an
  explicit list of placeholders such as `cat-n`.

## Alternatives considered

- **Rewriting the brand book in our own words.** One voice for the repository,
  but design content invented without a decision behind it.
- **Keeping the sections on the artifact's bundle.** Nothing changed, but they
  would describe a package that does not exist.
- **Tokens named with the prefix throughout.** Ready to paste into CSS, but
  about a hundred changes, and the text would no longer match the source.
- **No test.** Simpler, but the text would age without notice when a token is
  renamed or removed.

## Consequences

- A renamed or removed token fails `make test` until the guidelines follow.
- The sections on components and on using Aurum change again when components
  and delivery come.
