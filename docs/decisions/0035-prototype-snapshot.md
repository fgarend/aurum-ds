# 0035. Prototype snapshot

- Status: Accepted
- Date: 2026-11-01

## Context

Besides the design system, Claude Design holds a prototype of the app drawn
with Aurum: a canvas, "Aurum — Finance app prototype", whose Web Desktop page
has 29 screens. They use Aurum's components and draw by hand what the design
system lacks, such as page headers, tables and the people list. The canvas
files need the Design type's runtime to render, but Claude Design exported
the page as standalone HTML screens: the same markup, the design system's
own files, React 18, and a short script that mounts the components.

## Decision

- **The export is kept in `reference/prototype/`**, exactly as Claude Design
  wrote it, frozen like `reference/artifact/`, with its checksums in
  `reference/SHA256SUMS`.
- **`make reference` renders each screen** into
  `reference/screenshots/prototype/<Screen>.png`, at the size the screen
  declares (1440 px wide), grown to fit, on the files the export ships,
  React 18 included. Only Google Fonts' import gives way to Geist from
  Fontsource, so nothing is fetched.
- **`make test` checks there is one screenshot per screen**, and no other.
- **The screens are the visual target** for the parts the design system
  lacks and for each screen of the app, and the list of components to build
  comes from what they repeat.

## Alternatives considered

- **The canvas files with the Design type's runtime.** The source as the
  canvas holds it, but third-party code in the repository, or a render that
  depends on the network and a login.
- **A PDF of all the screens.** One file from Claude Design itself, but no
  markup to read, and pages to cut into images.
- **Rendering the screens with the package's React 19,** as the previews
  are. One React for every render, but the export ships its own, and these
  screens are kept as exported.
- **`docs/prototype/`.** Where the export landed, but `docs/` holds living
  documents of this repository, not frozen design.

## Consequences

- React 18's minified files are in the repository, as part of the export,
  under their MIT license notice.
- The screenshots show the artifact's own icons and data, which are
  fictitious.
