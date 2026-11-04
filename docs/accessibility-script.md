# The manual accessibility script

What no test here can do: a screen reader, a real keyboard, real zoom and real themes
(`docs/accessibility.md`, decision 0079). Run it before a release that changes what
a component shows or how it is reached, and write down each run at the end.

Whatever fails goes into `docs/ROADMAP.md` as a fault to fix.

## Before starting

- `make storybook` serves the gallery. Open each story below on a page of its own,
  `<http://localhost:6006/iframe.html?viewMode=story&id=components-sidebar--inverse>`,
  with its name after `id=components-`, so Tab stays in the story.
- A story's own checks run as it opens, and may leave focus anywhere: click an empty
  part of the page once, to start from the top of it.
- **Safari:** in its settings, Advanced, turn on "Press Tab to highlight each item on
  a webpage". Without it, Tab skips links.
- **macOS:** in System Settings, Keyboard, turn on "Keyboard navigation".

## 1. Keyboard alone, in Safari and Chrome

After that first click, leave the mouse alone.

| Story                    | Do                                          | Expect                                                           |
| ------------------------ | ------------------------------------------- | ---------------------------------------------------------------- |
| `sidebar--in-app-layout` | Tab once                                    | "Skip to the content" appears, whole, above the navigation       |
|                          | Enter, then Tab                             | Focus goes past the navigation, into the content                 |
|                          | Reload, Tab through the items               | Every item in order, each with a ring you can see whole          |
| `sidebar--many-items`    | Tab through all of it, then Shift-Tab back  | The focused item is always in view, and never hidden by anything |
|                          | Reload                                      | "Page 30", the current one, is in view without scrolling         |
| `applayout--default`     | Scroll down, then Shift-Tab back to the top | Nothing covers what has focus                                    |
| `tooltip--default`       | Tab to the control                          | The name opens at once, and focus stays on the control           |
|                          | Escape                                      | It closes, and focus is still on the control                     |
|                          | Tab onward                                  | Focus leaves: nothing traps it                                   |

## 2. VoiceOver, in Safari

Command-F5 turns it on and off. VO is Control-Option. VO-Right Arrow moves on to the
next item, VO-Space bar acts on it, and VO-U opens the rotor, whose lists change with
the Left and Right Arrows.

| Story                                             | Do                                  | Expect to hear                                                     |
| ------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| `sidebar--inverse`                                | VO-Right Arrow through the rail     | Its name, "Main", and each section's name with its list            |
|                                                   | Reach "Portfolio"                   | Its name, that it is a link, and that it is the current page       |
|                                                   | Reach any item                      | The icon says nothing, and the name is said once                   |
|                                                   | VO-U, find the links                | Every item, under its name                                         |
| `sidebar--in-app-layout`                          | From the top, VO-Right Arrow        | The link to skip comes first; VO-Space bar moves on to the content |
|                                                   | VO-U, find the landmarks, if listed | The navigation, by its name, and the main content                  |
| `sidebar--narrow-screen`, window at its narrowest | VO-Right Arrow                      | The section titles are read, though not shown                      |
| `tooltip--default`                                | Tab to the control                  | Its name once, not twice                                           |
| `icon--labelled`                                  | Move to the icon                    | It is read by its `label`                                          |
| `icon--default`                                   | Move across it                      | It says nothing                                                    |

## 3. Zoom, in Safari and Chrome

With a window of 1280 by 800, Command-Plus to 200%, and then to 400%.

| Story                    | Expect                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `sidebar--in-app-layout` | The strip across the top, no sideways scrolling of the page, and the content reachable |
| `sidebar--many-items`    | Every item can be reached                                                              |
| `sidebar--long-text`     | Nothing cut                                                                            |
| `tooltip--default`       | The whole name on the screen                                                           |

Then, in Safari, hold Option and choose View, Make Text Bigger, a few times: `sidebar--long-text`
loses nothing.

Turn a phone or an emulated window to both orientations: every story works in both
(WCAG 1.3.4).

## 4. Forced colours

In Chrome's DevTools, Rendering, "Emulate CSS media feature `forced-colors`", choose
`forced-colors:active`. On Windows, a contrast theme, in Edge and Firefox, is better:
the tests here emulate it already, and only this is the real thing.

| Story                                          | Expect                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `sidebar--inverse`, `--surface` and `--canvas` | The current item has its mark and its outline, its icon the colour of its text |
| `tooltip--default`                             | The name has an edge around it                                                 |
| `sidebar--in-app-layout`, Tab                  | The link to skip and the focus ring can be seen                                |

## 5. Touch, on a phone, if the gallery can be reached from one

| Story                    | Do                                      | Expect                                   |
| ------------------------ | --------------------------------------- | ---------------------------------------- |
| `sidebar--narrow-screen` | Swipe along the strip, then tap an item | It scrolls, and the tap reaches the item |
| `tooltip--default`       | Tap the control                         | No tooltip, and the control acts as ever |

## The runs

| Date | Who | System and browsers | Parts | Result      |
| ---- | --- | ------------------- | ----- | ----------- |
|      |     |                     |       | Not run yet |
