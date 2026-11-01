# Reference snapshot

`artifact/` is an exact copy of the Aurum design system as it was made in
Claude Design, taken on 2026-11-01 from artifact version `1793490792-e9aa`.

It is the specification for porting: each component is rewritten in this
repository and must look and behave like its original here, unless a decision
says otherwise. The repository is the source; the artifact is not.

## Rules

- **Never edit anything under `artifact/`.** It is frozen history.
- **Check it with** `shasum -a 256 -c SHA256SUMS`, run in this folder.
- **It stays** while any of it is still useful as a specification. Removing it
  is a decision of its own.

## What is here

| Path | What |
| --- | --- |
| `artifact/README.md` | The brand book |
| `artifact/tokens.json` | The design tokens, in the artifact's list format |
| `artifact/design-system.json` | The artifact's metadata: icon group, libraries, last change |
| `artifact/components/bundle.js` | The original components, one classic script for React 18 (`window.Aurum`) |
| `artifact/components/bundle.css` | The original component styles |
| `artifact/components/index.d.ts` | The original prop types |
| `artifact/components/<Name>/README.md` | Each component's guidelines |
| `artifact/components/<Name>/preview.html` | Each component's live preview |
| `artifact/assets/Icons/` | The 41 icons as SVG files, and their README |
| `SHA256SUMS` | The checksum of every file under `artifact/` |

## How it was taken

- **The files of `project/`** were read from the artifact as published.
- **The icons** were read from the artifact's asset store, one by one, each
  matching the SHA-256 the store reports, and named as
  `design-system.json` names them. The sizes recorded in
  `design-system.json` differ from the stored files; the stored files are the
  ones the artifact serves.
- **Not copied:** the files of the Design System artifact type itself
  (`artifact-type/`, `SKILL.md`, `index.html`), which belong to the type and
  not to Aurum.
- **Not stored by the artifact:** `tokens.css`, which it compiles from
  `tokens.json` when it renders.
