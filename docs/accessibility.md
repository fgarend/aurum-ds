# Accessibility

Aurum's target is **WCAG 2.2, level AA** (decision 0079). A component meets it
when used as documented. A library cannot make a product conform by itself: the
app answers for its names, titles, language and content.

**Every component's proposal and report go through this page**: which criteria
apply, which have a check and which do not. Saying so is the point: axe finds
about half of the issues, in 16 of the 50 criteria of WCAG 2.1 AA, by Deque's own
count. It finds none of 1.4.11 or 2.4.7.

## How each criterion is checked

Every check here runs in `make check` and in continuous integration, so a failure
stops a release. A check added for this page stays within them. The script cannot:
it is run by hand.

- **axe:** in every story, in the three browsers; a violation fails it. What it
  reports as incomplete, such as text on a gradient, does not fail.
- **story:** a check in a story's `play` function.
- **tokens:** `test/contrast.test.ts`, on the palette's pairs (decision 0080).
- **every story:** text spacing and forced colours, on all stories (decision 0081).
- **script:** by hand, in `docs/accessibility-script.md`, whose last section says
  which runs there have been.
- **coming:** a check planned, with its item.
- **app:** the app's to meet, as it depends on its words or its content.
- **none yet:** no component does this yet; whichever first does brings the check.

| Criterion                                       | How           | Notes                                                                                           |
| ----------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------- |
| 1.1.1 Non-text Content                          | axe, story    | `Icon` is hidden without a `label`, named with one                                              |
| 1.2.1 Audio-only and Video-only                 | app           |                                                                                                 |
| 1.2.2 Captions (Prerecorded)                    | app           |                                                                                                 |
| 1.2.3 Audio Description or Media Alternative    | app           |                                                                                                 |
| 1.2.4 Captions (Live)                           | app           |                                                                                                 |
| 1.2.5 Audio Description                         | app           |                                                                                                 |
| 1.3.1 Info and Relationships                    | axe, story    | Tests find elements by role and name                                                            |
| 1.3.2 Meaningful Sequence                       | story, script | Keyboard order in a story; reading order by hand                                                |
| 1.3.3 Sensory Characteristics                   | app           |                                                                                                 |
| 1.3.4 Orientation                               | script        | Nothing in Aurum locks it                                                                       |
| 1.3.5 Identify Input Purpose                    | none yet      | With the form controls (7.16)                                                                   |
| 1.4.1 Use of Color                              | story         | The Sidebar's current item has a mark, a shape (decision 0084)                                  |
| 1.4.2 Audio Control                             | app           |                                                                                                 |
| 1.4.3 Contrast (Minimum)                        | axe, tokens   | axe on flat colours; the tokens also on the graphite gradient                                   |
| 1.4.4 Resize Text                               | script        | By browser zoom; the tokens are in `px` (decision 0076)                                         |
| 1.4.5 Images of Text                            | app           |                                                                                                 |
| 1.4.10 Reflow                                   | story, script | The Sidebar and `AppLayout` at 320px                                                            |
| 1.4.11 Non-text Contrast                        | tokens        | Focus rings, and the Sidebar's current icon and mark; `control-border` (7.16); charts (roadmap) |
| 1.4.12 Text Spacing                             | every story   | All three browsers                                                                              |
| 1.4.13 Content on Hover or Focus                | story         | `Tooltip`                                                                                       |
| 2.1.1 Keyboard                                  | story         | Each interactive component                                                                      |
| 2.1.2 No Keyboard Trap                          | story, script | Moving on by Tab in a story                                                                     |
| 2.1.4 Character Key Shortcuts                   | none yet      |                                                                                                 |
| 2.2.1 Timing Adjustable                         | none yet      |                                                                                                 |
| 2.2.2 Pause, Stop, Hide                         | none yet      |                                                                                                 |
| 2.3.1 Three Flashes or Below Threshold          | none yet      |                                                                                                 |
| 2.4.1 Bypass Blocks                             | story         | `AppLayout`'s link and landmarks (decision 0083)                                                |
| 2.4.2 Page Titled                               | app           |                                                                                                 |
| 2.4.3 Focus Order                               | story         |                                                                                                 |
| 2.4.4 Link Purpose (In Context)                 | axe, app      | axe finds a link with no name; its words are the app's                                          |
| 2.4.5 Multiple Ways                             | app           |                                                                                                 |
| 2.4.6 Headings and Labels                       | app           |                                                                                                 |
| 2.4.7 Focus Visible                             | story, tokens | The ring, computed, and its contrast                                                            |
| 2.4.11 Focus Not Obscured (Minimum)             | story         | Nothing in Aurum stays over the content: the top bar scrolls away (decision 0082)               |
| 2.5.1 Pointer Gestures                          | none yet      |                                                                                                 |
| 2.5.2 Pointer Cancellation                      | none yet      | Links and buttons act natively                                                                  |
| 2.5.3 Label in Name                             | app           | The visible name and the accessible one                                                         |
| 2.5.4 Motion Actuation                          | none yet      |                                                                                                 |
| 2.5.7 Dragging Movements                        | none yet      |                                                                                                 |
| 2.5.8 Target Size (Minimum)                     | axe           |                                                                                                 |
| 3.1.1 Language of Page                          | app           |                                                                                                 |
| 3.1.2 Language of Parts                         | app           |                                                                                                 |
| 3.2.1 On Focus                                  | story         | A tooltip opens on focus, and focus stays put                                                   |
| 3.2.2 On Input                                  | none yet      | With the form controls (7.16)                                                                   |
| 3.2.3 Consistent Navigation                     | app           |                                                                                                 |
| 3.2.4 Consistent Identification                 | app           |                                                                                                 |
| 3.2.6 Consistent Help                           | app           |                                                                                                 |
| 3.3.1 Error Identification                      | none yet      | With the form controls (7.16)                                                                   |
| 3.3.2 Labels or Instructions                    | none yet      | With the form controls (7.16)                                                                   |
| 3.3.3 Error Suggestion                          | app           |                                                                                                 |
| 3.3.4 Error Prevention (Legal, Financial, Data) | app           | Heavy in a finance app: review and confirm                                                      |
| 3.3.7 Redundant Entry                           | app           |                                                                                                 |
| 3.3.8 Accessible Authentication (Minimum)       | app           |                                                                                                 |
| 4.1.2 Name, Role, Value                         | axe, story    |                                                                                                 |
| 4.1.3 Status Messages                           | none yet      | With Alert (7.17)                                                                               |

## Corner cases

A component's stories show what it does in each of these that applies:

- **Empty:** no content, each optional part left out, nothing selected.
- **Too much:** more items than the room, in height and in width.
- **Long text:** a long name, a word with no spaces, another language.
- **Narrow and short screens:** 320px wide, and very short, as at a high zoom.
- **Input:** keyboard alone, touch alone, a pointer crossing it.
- **Preferences:** forced colours and text spacing, checked on every story; reduced
  motion, once a component animates; larger text.
