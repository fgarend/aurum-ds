# 0026. Token output

- Status: Accepted; partly superseded by 0039: where the compiler lives, and by 0044: loading through Vite
- Date: 2026-11-01

## Context

Components use the tokens through CSS custom properties and text style
classes, compiled from `src/tokens/tokens.json` (decision 0025). The artifact
compiles the same file with its own compiler, which writes a fixed format and
leaves out, without a word, any token it cannot read. The artifact does not
serve its compiled CSS, but its compiler can be read in the artifact type's
app. Later items need the CSS as a file: the base styles, the visual tests,
and the app before a build exists.

## Decision

- **The output is the artifact compiler's, exactly, with the `au-` prefix**:
  the same blocks, order, layout, escaping and defaults, without usage
  comments. `reference/ARTIFACT-FORMAT.md` describes it.
- **Equality was proven once**: the artifact's own compiler, taken from its
  app into a scratch file outside the repository, compiled the same
  `tokens.json`, and its output matched ours byte for byte without the
  prefix. Tests with fictitious tokens then hold each rule in place.
- **`src/tokens/tokens.css` is kept in the repository.** `make tokens` writes
  it, it is never edited by hand, and `make test` fails when it no longer
  matches `tokens.json`. Biome leaves it alone, since a tool writes it.
- **An invalid token fails**, naming its family and name, under the rules of
  the artifact type's grammar for the families in use. Font files and further
  themes fail until their roadmap items add them.
- **The compiler is a pure function in `src/tokens/`**, split into the
  shared checks, the type family, the reader and the writer, each tested.
  `infra/build-tokens.ts` reads and writes the files.
- **The script loads the compiler through Vite's `runnerImport`**, since Node
  alone does not resolve the sources' `.js` imports.

## Alternatives considered

- **A format of our own, with usage comments.** Easier to read, but no direct
  comparison with the artifact, its previews or a future mirror.
- **Running the artifact's compiler in the tests.** A lasting comparison, but
  third-party, minified code in the repository, which decision 0005 kept out.
- **Generating the CSS only in the build.** No generated file in the
  repository, but no CSS until the build, and token changes reviewed without
  their effect.
- **Leaving out what is invalid, as the artifact does.** Less code, but a typo
  would become a missing token, seen only as a component without a color.
- **A Node resolve hook, or `.ts` imports.** No experimental API, but code of
  our own to keep, or a change to decisions 0013 and 0016.

## Consequences

- The comparison with the artifact's compiler is not repeated: a change to it
  goes unnoticed until the mirror is built.
- `runnerImport` is marked experimental in Vite. If it changes, `make tokens`
  fails visibly, and a Node resolve hook can take its place.
- A token change shows in review as both the JSON and the CSS it produces.
