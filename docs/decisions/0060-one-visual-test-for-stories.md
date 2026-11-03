# 0060. One visual test for the stories

- Status: Accepted
- Date: 2026-11-03

## Context

Each component had a visual test of its own, `Icon.visual.test.tsx`, that
imported one story and compared it with its approved screenshot. Storybook
cannot compare screenshots inside a story: its `expect` has no
`toMatchScreenshot`. Primer, EUI and GitLab UI take their screenshots in one
loop over their stories, with no file per component. A story composed by
`composeStories` carries its tags, so the loop can pick the stories marked
for it.

## Decision

- **A story tagged `visual` is compared with its approved screenshot**, in
  Chromium, by one test, `.storybook/visual.test.tsx`, which finds every
  `*.stories.tsx` under `src/`. A component's own visual test goes.
- **The screenshot is named by the story's id**, as Storybook builds it from
  the title and the name, in `.storybook/__screenshots__/`.
- **The story is drawn inside `.au-root`**, as every story runs in, and the
  screenshot is of that root.
- **`make screenshots` also removes the screenshots under `.storybook/`**
  before writing them all again.
- **A visual test that is not of a story keeps its own file**, such as the
  text styles of the tokens.

This replaces, in decision 0057, the visual test that imports a component's
stories; and, in decision 0034, where `make screenshots` removes the approved
screenshots from: `src/` and `.storybook/`.

## Alternatives considered

- **A visual test per component.** What there was, but a file for each
  component that only imports a story and takes its screenshot.
- **Every story compared.** No tag to remember, but screenshots of stories
  that show nothing new, such as one icon alone, each to approve on any
  change.

## Consequences

- A component gets its screenshot from a tag on a story, with no test file.
- The approved screenshots of the components live together, away from the
  components they show.
- Renaming a story or its title renames its screenshot, which
  `make screenshots` writes again.
