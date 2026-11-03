# 0071. Everything drawn, a story

- Status: Accepted
- Date: 2026-11-03

## Context

A component's checks live in its stories (decision 0059) and its screenshot
comes from a tag on one (decision 0060), but what was not a component kept
test files of its own: the base styles, the fonts and the text styles, with a
Vitest project, `browser`, for the first two. `AurumRoot` now brings all three
(decision 0070), so they have a component to belong to.

## Decision

- **The checks of the base styles and the fonts are stories of `AurumRoot`**:
  the focus ring, screen reader text, the fonts loading, the class alone, and
  the app's own CSS winning.
- **The text styles' screenshot comes from a story of `AurumRoot` tagged
  `visual`**, in the one visual test; its image did not change by a byte.
- **The Vitest project `browser` and its files go.** Everything drawn in the
  browser is a story; `make test-browser` runs the projects `storybook` and
  `visual`, and `make coverage` and `make watch` follow.
- **The checks of the repository stay in `test/`**, in Node: they draw nothing.

This replaces, in decision 0052, the browser tests; in decision 0059, what is
not a component keeping its browser test; and in decision 0060, a visual test
that is not of a story keeping its own file.

## Alternatives considered

- **The test files, as they were.** Nothing to move, but a Vitest project and
  a second way of writing a browser test for three files.
- **Stories of foundations, apart from any component.** A gallery page each,
  but apart from the component that brings them.

## Consequences

- One way to write a test that draws: a story.
- Each defect tried in the base styles and fonts failed exactly one story.
