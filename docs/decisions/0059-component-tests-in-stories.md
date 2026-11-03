# 0059. Component tests in their stories

- Status: Accepted
- Date: 2026-11-03

## Context

Each component had a file of stories, its examples, and a browser test that
imported them (`composeStories`), drew each again and checked its behaviour,
so a story was drawn twice in each browser, by two ways of writing a
component test. Storybook's documentation recommends the checks inside the
stories, in a `play` function its Vitest addon runs after drawing the story,
with stories and tests together in one file. Of fourteen design systems
surveyed, none does this yet; they predate the addon, and most still test in
jsdom. Tried on the Icon, the checks of its stroke, computed colour and ref
ran in the three browsers, and a wrong check failed in all three.

## Decision

- **A component's checks live in the `play` function of its stories**, from
  `storybook/test`, run by Vitest's `storybook` project in the three
  browsers. Its browser test, `Button.browser.test.tsx`, goes.
- **Each check sits on the story that shows it.** What changes nothing on
  screen, such as the app's class or a ref, is checked on the story it
  belongs with, drawn once by `mount` with it. A story only for tests,
  hidden from the gallery with the `!dev` tag, comes only for a case no
  example shows.
- **Interactive components get keyboard and focus checks in their stories**,
  following the W3C's ARIA Authoring Practices for their kind of control.
- **What is not a component keeps its browser test**, such as the base
  styles and the fonts, drawn with `vitest-browser-react`.

This replaces, in decision 0057, the stories with no assertions, the browser
test that imports them, and the keyboard and focus tests in the browser test;
and, in decision 0052, the browser test of a component's behaviour.

## Alternatives considered

- **Stories with no assertions, and a browser test importing them.** What
  React Spectrum does, but each story drawn twice, and two ways of writing a
  component test.
- **Every check in stories only for tests (`!dev`).** A gallery with only
  examples, but checks away from what they check, and uses of the component
  that never reach the gallery.

## Consequences

- A component has one file for its examples and its checks, and its checks'
  results show in the gallery, in the interactions panel.
- The ref and the computed styles are checked through `mount` and the
  browser's own functions, which Storybook does not document.
- The visual tests still import stories (`composeStories`), with their setup
  in `.storybook/vitest.setup.ts`.
