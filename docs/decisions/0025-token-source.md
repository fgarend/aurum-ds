# 0025. Token source

- Status: Accepted; partly superseded by 0039: where the compiler lives
- Date: 2026-11-01

## Context

The design tokens are the named visual choices that every component uses:
colors, text styles, spacing, radii, shadows, control heights and layout
sizes. They were designed in Claude Design, whose artifact keeps them in
`tokens.json`, in the artifact type's own list format, each with a note on its
use. From now on this repository is their source. Their names carry no
prefix, and the compiled CSS defines them globally on the app's page.

## Decision

- **The source keeps the artifact's format**: lists of `{name, value, usage}`
  per family, as `reference/ARTIFACT-FORMAT.md` describes.
- **It lives in `src/tokens/tokens.json`**, next to the code that will compile
  it and its tests.
- **The names stay as the artifact has them.** The compiler adds the `au-`
  prefix to what it writes: custom properties such as `--au-ink`, and text
  style classes such as `.au-text-amount-xl`.
- **The file starts as a copy of the snapshot's**, with the same data. It is
  not tested against the snapshot afterwards: the tokens may now change on
  purpose, and `reference/` keeps where they came from.

## Alternatives considered

- **The DTCG format (2025.10).** The industry's stable standard, with the
  widest tool support, but every token would be translated to and from Claude
  Design, the design tool in use. A converter can be written if a tool that
  needs it comes in.
- **A TypeScript object.** Typed, but no design tool reads it.
- **`tokens/` at the root.** More visible, but apart from its compiler and
  tests.
- **The prefix in the source.** Simpler to compile, but the source would no
  longer match the artifact's.
- **No prefix.** The artifact's names as they are, but they could clash with
  the app's own custom properties or another library's.
- **A test against the snapshot.** Proof that nothing drifted, but it would
  fail on every intended change.

## Consequences

- A token's name in the source and in the CSS differ by the prefix, by one
  fixed rule.
- The class prefix of the components is decided separately (roadmap item 5.3).
