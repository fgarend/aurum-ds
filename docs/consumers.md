# Consumers

What the app that uses Aurum needs from it, what the prototype's screens are
made of, and the order in which components are built. The app is a personal
finance web app. It moves to Aurum one screen at a time: the shell first, then
People, then the others (roadmap milestone 6). This document changes as each
screen is planned.

## What the app has

Read from the app's repository on 2026-11-01.

- **Build:** Vite 8, which already imports CSS from packages, with `url()` to
  font files: the app loads a Fontsource font the same way Aurum does
  (decision 0027).
- **React 19**, TypeScript 7, React Aria, Lucide (1.61) and Tailwind 4 with
  shadcn.
- **Browsers:** none stated, and its visual tests run in Chromium only.
  Aurum tests in Chromium only until the app says otherwise (decision 0032).
- **Layout:** the side navigation turns into a strip at the top below the
  `md` breakpoint.

## What the app must do

- **Install** the package from a release's page, with no `git` needed:
  `"@fgarend/aurum-ds": "https://github.com/fgarend/aurum-ds/releases/download/vX.Y.Z/fgarend-aurum-ds-X.Y.Z.tgz"`,
  or from GitHub at the release's tag, which needs `git`:
  `"@fgarend/aurum-ds": "github:fgarend/aurum-ds#vX.Y.Z"`. Move to a new
  release by changing the version, one from `CHANGELOG.md` (decisions 0037
  and 0051). Not the tag's tarball from `codeload.github.com`: it holds the
  whole repository, not only the package's files.
- **Wrap where Aurum begins in `AurumRoot`**, once, above any layout: it
  brings the fonts, the tokens and the base styles, and draws no box of its
  own (decision 0070). It replaces the imports of `fonts.css`, `tokens.css`
  and `base.css`, deprecated, which leave in the next version that may break.
- **Import each component by its own path**, `@fgarend/aurum-ds/Icon`; the
  package's entry, `@fgarend/aurum-ds`, exports them all too (decision 0064).
- **Hand the package to Vite in its Vitest settings**,
  `test: { server: { deps: { inline: ["@fgarend/aurum-ds"] } } }`: each
  component imports its own CSS, on which Node alone fails, `Unknown file
  extension ".css"` (decision 0069).
- **Carry the fonts' license notice** in its own build, as it ships Geist and
  Geist Mono (decision 0027).
- **Accept React 19 only** as the peer (decision 0019), and provide
  `lucide-react` 1, the Icon's drawings (decision 0056).

## The shell and People today

- **Shell:** a side navigation in groups, with the brand and an environment
  badge; a top bar with a breadcrumb and a slot for a page's filters; a side
  panel that any page can open; the content up to a maximum width.
- **People:** a section with a count over a table of people, each with an
  avatar of initials, a link to the person, a tag for the default holder, and
  an alert when loading fails.

## Inventory of the prototype

The prototype's 29 Web Desktop screens (decision 0035), counted on
2026-11-01. Each part is a component the design system already has, a new
component, or the layout of a screen. The counts are the number of screens a
part appears in.

### Design system components

Sidebar (29), Button (28), IconButton, SegmentedControl and Icon (16),
TextField (15), Amount and Badge (11), Select (10), TransactionRow (7),
StatStrip, BudgetBar and Switch (6), AllocationBar and ProgressBar (5),
Checkbox (4), Delta (3), Alert (2), AmountInput and Avatar (1).

### New components

| Part                | Screens  | What it is                                                                |
| ------------------- | -------- | ------------------------------------------------------------------------- |
| AppShell            | 29       | The page's frame: the side navigation and the content                     |
| PageHeader          | 29       | The line above the title, the title and the page's actions                |
| ScopeChip           | 29       | Whose data the page shows: the household or one person                    |
| Table               | 15 to 21 | A table of data, with figures aligned                                     |
| AvatarGroup         | 18       | Several people, stacked, such as a joint account's owners                 |
| IconTile            | 13       | An icon in a square of a category's color                                 |
| Toolbar, Chip, Tabs | 4 to 5   | Filters over lists, and tabs; built with the first screen that needs them |

### Screen layout

Grids and spacing (`grid2`, `grid3`, `formgrid`, `stack`, `pad`) are each
screen's own. Muted text, tabular figures and code already exist as the
`ink-subtle` color, the `au-num` class and the `text-code` style.

### To decide when they come

- **The link to a record** (21 screens): a component, or a class in the base
  styles.
- **The joint account marker** (6 screens): a component, or a variant of
  Badge.
- **The person's color picker** (People only).

## Component order

By importance, use and simplicity, each component after those it uses. Each
is one item of roadmap milestone 7 and ends in a release.

1. Icon
2. Badge
3. Avatar
4. AvatarGroup, which uses Avatar
5. ScopeChip, which uses AvatarGroup
6. Button and IconButton, which use Icon
7. PageHeader, which uses ScopeChip and Button
8. Sidebar, which uses Icon, Badge and Avatar
9. AppShell, which uses Sidebar: the shell is complete
10. Table, right after the shell: People, the app's first screen after it,
    needs it
11. Section and Card
12. TextField, Select, SegmentedControl and Switch: People, as the prototype
    draws it, is complete
13. Alert, which uses Icon
