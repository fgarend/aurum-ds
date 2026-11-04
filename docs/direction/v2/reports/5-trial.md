# Trial 5: shadcn as the base of the Aurum repo

Date 2026-11-04. Nothing outside the scratch folder was touched: `git status` of both real repos shows only what was already there, no commits, no pushes, no servers left, Docker containers and volumes removed. Fictitious data only, taken from the prototype.

Marks: **[M]** measured here, **[V]** verified in a source, **[R]** reasoning, which can be wrong.

Trial folder: `/private/tmp/claude-501/-Users-arend-Projects-aurum-ds/7b0e54f3-bda4-4f23-9bde-3351d7db44fe/scratchpad/direction-v2/trial/` (below: `$T`). `repo/` holds the result, `repo/variants/` the four copies of shadcn's files, `repo/screens/` the screens, `logs/` every raw output, `bin/` every script.

Tool versions: shadcn CLI 4.23.0, Tailwind 4.3.3, React Aria Components 1.22.1, `cn` 0.5.0, recharts 3.8.0, TypeScript 7.0.2, Biome 2.6.3, Vitest 5.0.5, Storybook 10.6.5, axe 4.14.0, pnpm 12.16.1 [M].

## Summary

| Question                                          | Answer                                                                                                                                                                                                                                       |     |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| Does the CLI work in a library?                   | `init` refuses it. `add` works with a hand-written `components.json`                                                                                                                                                                         | M   |
| Do the repo's checks accept the code?             | Not as generated: 112 type errors, 80 Biome errors and warnings, build fails. Types, build and lint pass after 5 settings and 12 edited lines, which reverses `isolatedDeclarations`. Coverage, visual, pack and 2 repository tests stay red | M   |
| Is a shadcn-native theme enough without a bridge? | Yes. 250 lines, of which 48 are invented dark values. No `--au-*` left in the new pieces                                                                                                                                                     | M   |
| How close with the least code?                    | Theme alone: structure and the dark rail, no identity. 33 edited lines: the rail looks real, gold, sizes. 990 lines of composed pieces: near the prototype by eye, with the gaps listed in C                                                 | M   |
| Is shadcn's Sidebar good enough?                  | Yes, after 6 behaviour lines and 6 forced-colours lines in `sidebar.tsx`. One real bug: Esc could not close the mobile sheet. Skip link, list semantics and persistence are not there                                                        | M   |
| Does it package?                                  | Yes, under npm and pnpm, one `@import`, classes and theme arrive, 0 type errors in the consumer                                                                                                                                              | M   |
| Do Aurum's sweeps see these pieces?               | The two existing ones passed all stories and caught nothing. Wider versions, 193 lines, caught real failures                                                                                                                                 | M   |
| Does the app survive the theme?                   | 0 type errors, 511 of 511 unit tests. Those tests do not compute styles, so this says little about the look                                                                                                                                  | M   |

**The surprise of the trial:** `cn` silently drops custom text sizes. `cn("text-label text-muted-foreground")` returns `text-muted-foreground`. The app solves it with a local `createCn`, but shadcn's files import `cn` directly from the package. Using Tailwind's own size names for Aurum's values avoids it (section B).

---

## A. shadcn inside Aurum's real toolchain

**Baseline, untouched copy [M]:** Biome 0 errors, 140 infos. Types 0. `test` 72 of 72. `test-repository` 173 of 173. Build passes. `test-browser` in Docker 388 of 388.

### What `init` does [M]

Each attempt in a copy (`$T/try0`), logs in `$T/logs/A-init-*`.

| Step                                                     | Result                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init -b aria`, no TTY                                   | Asks for a preset (Nova, Vega, Maia, Lyra, Mira, Luma, Sera, Rhea, Custom). Exit 0 on end of input, nothing written                                                                                                                                                                                       |
| `init -b aria -p nova`                                   | **"We could not detect a supported framework"**, exit 1. `shadcn info` calls it "Manual". Sends you to the manual install page                                                                                                                                                                            |
| Adding `vite.config.ts` (a stub), Tailwind, one CSS file | Passes framework and Tailwind. **"Could not find valid path aliases or package imports"**, exit 1                                                                                                                                                                                                         |
| Adding `"imports": {"#/*": "./src/*"}` to package.json   | Passes. Then asks 8 questions though a preset was given: TypeScript, style (New York or Default), base colour, global CSS (default `app/globals.css`), CSS variables, prefix, `tailwind.config.js` path (default given, though v4 has none), components alias (default `@/components`), RSC (default yes) |
| Same, answered by hand                                   | **Completes.** Writes `components.json` with `style: aria-nova` but `rsc: true` and `config: tailwind.config.js`, `src/lib/utils.ts` (one line, `export { cn } from "cn"`), 129 lines into the CSS. Adds `shadcn` and `tw-animate-css`                                                                    |
| Under a pseudo-terminal (`expect`, `script`)             | Hung at "Preflight checks" for over 90 s, both times. May be my harness; not investigated                                                                                                                                                                                                                 |
| Existing `components.json`                               | Asks to overwrite; "no" exits 1. `init` cannot adopt a config                                                                                                                                                                                                                                             |

So `init` needs a fake `vite.config.ts` to run at all, and its defaults are for Next. **`add` needs neither** [M]: a hand-written `components.json` and the dependencies suffice, and that was the route used in `repo/`.

### What `add` writes [M]

- `add button input field select switch checkbox card badge avatar table tabs sidebar tooltip`, nova: **20 files, 2,460 lines**, in 2 s. Pulled in `label`, `separator`, `textarea`, `skeleton`, `sheet`, `input-group`, `use-mobile`. Vega: 20 files, 2,457 lines.
- It left the theme file unchanged and asked nothing.
- `toggle-group progress chart`, then `collapsible`: 5 more files, 25 in all, **3,133 lines** plus a 19-line hook. It added `recharts@3.8.0` pinned exactly, because the repo's `saveExact` applied.
- Vega against nova: `avatar`, `badge`, `label`, `separator`, `skeleton`, `table`, `tooltip` are identical. Button differs in 10 lines, Field in 6.
- Second style: same command in `$T/repo-vega` with only `style` changed.

### Friction with the repo's rules [M]

- **`minimumReleaseAge` refuses `cn@0.5.2`,** published 2 days ago, and `0.5.1`. `0.5.0` installs, the same as the app. npm lists its versions from at least September 2026, so it is very young, and every piece imports it.
- **Aliases.** tsc does not rewrite aliases, so `@/` would ship broken imports. The docs' `package.json#imports` route works under `module: nodenext` with no extension issue, because the pattern holds the extension [V for the docs, M for the behaviour].
- **`shadcn add` needs all five aliases to resolve, or it stops.** It failed with "lib, utils" until `#lib/*` was declared, though no file there is used.
- Conditions make it work in dev and in the package:

  ```json
  "#components/*": { "aurum-source": "./src/components/*.tsx", "default": "./dist/components/*.js" }
  ```

  with `customConditions: ["aurum-source"]` in `tsconfig.json` and `resolve.conditions` in Vite. **The condition must not be called `source`:** `@internationalized/date` also publishes one, and TypeScript then type-checked its raw sources: **about 600 errors**, nearly all in `node_modules`.

### The repo's checks on the generated code, unedited [M]

| Check                          | Result                                                 | By kind                                                                                                                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc`                          | **112 errors**                                         | 92 TS9013, 7 TS9010, 5 TS9007, 1 TS9039 (all `isolatedDeclarations`: 105). 6 TS2375 (`exactOptionalPropertyTypes`). 6 TS2320, inside `react-aria-components`' own types. 1 TS6133                                                                                               |
| Biome `ci --error-on-warnings` | **40 errors, 40 warnings, 45 infos** in shadcn's files | Errors: 20 format, 15 organize imports, 2 `useSemanticElements`, 1 each `noDoubleEquals`, `noArrayIndexKey`, `useKeyWithClickEvents`. Warnings: 13 `noNamespaceImport`, 8 `useImportType`, 8 `noShadow`, 4 `noLeakedRender`, 3 `useGlobalThis`, 2 `noDeprecatedImports`, others |
| `build`                        | **Fails**                                              | The same TypeScript errors                                                                                                                                                                                                                                                      |
| `test` (Node)                  | 72 of 72                                               | Sees none of it                                                                                                                                                                                                                                                                 |
| `test-repository`              | 172 of 173                                             | Only `dist/` out of date. The rules on tokens and CSS do not read class strings                                                                                                                                                                                                 |
| `storybook-build`              | Passes                                                 | No story yet, so nothing was drawn                                                                                                                                                                                                                                              |

The full family, with `chart`, `progress`, `toggle`, `collapsible` and the edits, makes that 53 errors and 49 warnings, among them `noDangerouslySetInnerHtml` in `chart.tsx` [M].

### What it takes to go green, and what stays red [M]

| Change                                                                         | Effect                                        | Cost                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `isolatedDeclarations: false`                                                  | 105 errors gone                               | **Reverses decision 0013.** `cva` constants cannot carry a hand-written type sensibly, because `VariantProps<typeof x>` depends on inference [R]. Declarations come from a full `tsc` build, which the repo already runs, so the build still works [M] |
| `skipLibCheck: true`                                                           | 6 TS2320 gone                                 | Those errors are in React Aria's types under `exactOptionalPropertyTypes`. 0013 keeps it off in the main config                                                                                                                                        |
| 12 lines edited by hand                                                        | The other 8 TS2375 and TS6133 gone            | `input-group` 2, `select` 3, `sheet` 2, `sidebar` 2, `progress` 2, `label` 1. All conditional spreads or casts                                                                                                                                         |
| `biome check --write`                                                          | Safe fixes: errors 53 to 8, warnings 49 to 33 | **Rewrites 24 files: +594, −620.** Afterwards `shadcn add avatar --diff` shows import order and semicolons as changes: 49 lines of noise on an untouched file                                                                                          |
| An override, linter off for `src/components/ui/**` and `src/hooks/**`, 3 lines | All lint in those folders gone                | The alternative is about 15 rules off by name. Biome resolves `#components/*` through `default`, so lint needs `dist/` built first, or 5 `noUnresolvedImports` errors appear                                                                           |
| `css.parser.tailwindDirectives: true`                                          | 5 parse errors in the CSS gone                | 1 line                                                                                                                                                                                                                                                 |

**After all that:** `tsc` 0, `tsc -p tsconfig.browser.json` 0, build passes, `test` 72 of 72, `storybook-build` passes.

**Still red, each a real decision:**

| Check                                    | Result                                    | Why                                                                                                                                                                                                                                                              |
| ---------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test/css-tokens.test.ts`                | 1 failing                                 | `theme.css` does not state the order of the layers                                                                                                                                                                                                               |
| `test/package.test.ts`                   | 1 failing                                 | Exports are no longer "entry and a path per component"                                                                                                                                                                                                           |
| `scripts/check-package.ts` (`make pack`) | Fails                                     | "`ui/*`: the app cannot import it"; it only knows component folders                                                                                                                                                                                              |
| **`coverage`**                           | **61.13% lines against a 100% threshold** | 23 stories render most pieces but `chart`, `sheet`, `textarea`, `collapsible`, `skeleton` at 0%, `input-group` 18%, `avatar` 22%, `field` 37%. To reach 100% on adopted files needs stories of variants never used, or an exclusion [R]                          |
| **`visual`**                             | **10 of 18 existing screenshots differ**  | Tooltip by about 1%, `dark-surface` in size. Caused by Tailwind's preflight plus the base rule (`* {border-border}`, body): with both removed, **18 of 18 pass** [M]. So the existing `au-` components and shadcn pieces do not stay pixel-identical on one page |
| Biome, whole repo                        | 22 errors, 61 warnings, none in `ui/`     | 46 `useBaseline` and 3 duplicate selectors in the inlined `shadcn.css`, 12 `useUniqueElementIds` in my stories, 2 `noInvalidPositionAtImportRule` in `theme.css` (`@source` before `@import`), the rest in my prototype tests. Not cleaned up                    |

One type error remains in my own `tailwind-contrast.test.ts` (TS4111), not fixed.

---

## B. shadcn-native theme, no bridge

File: `$T/repo/src/theme/theme.css`. **250 lines [M]:** `:root` 62 variables, `.dark` 48, `@theme inline` 70, plain `@theme` 20, plus 4 imports and the base layer. Without dark, about 200. It holds values directly, no `--au-*` and no bridge.

- **Graphite rail in `--sidebar*`:** works [M]. `--sidebar-accent` translucent, `--sidebar-primary` gold.
- **Gradient:** `bg-sidebar` is a colour, so the gradient needs `--sidebar-gradient` and one edited line. Named as a `--background-image-*`, `cn` drops `bg-sidebar` beside it; `bg-(image:--sidebar-gradient)` keeps both [M].
- **`--radius: 0.375rem` gives Aurum's scale almost exactly:** `lg` 6 px (buttons, fields), `xl` 8.4 px (cards), against the prototype's 6 and 8. Not exact: `sm` 3.6 against 4, `md` 4.8 against 6 [M].
- **Fonts through `--font-*`:** works, with `@fontsource-variable` imported in the theme [M].
- **New names:** gold (4), income, expense, invest, warning (2 each), cat-1 to 8 with soft (16), sidebar-gradient, chart-6.

**Text sizes, the trap [M].** With invented names, `cn` reads them as colours:

```
cn("text-label text-muted-foreground")  =>  "text-muted-foreground"
cn("text-display font-semibold text-foreground")  =>  "font-semibold text-foreground"
cn("text-amount-xl text-income")  =>  "text-income"
```

Nothing warns. The app avoids this with `createCn` in `src/lib/utils.ts` (decision 0171), but today's shadcn files import `cn` from the package, so a repo using that fix must edit every piece's import (25 lines) [M for the imports]. What I did instead: **Tailwind's own size names with Aurum's values**, which `cn` knows:

| Name        | Value             | Aurum's                           |
| ----------- | ----------------- | --------------------------------- |
| `text-2xs`  | 11/16             | overline                          |
| `text-xs`   | 12/16, Tailwind's | caption                           |
| `text-md`   | 13/18             | label. **Odd: smaller than `sm`** |
| `text-sm`   | 14/20, Tailwind's | body                              |
| `text-base` | 15/22             | heading                           |
| `text-lg`   | 18/24             | title                             |
| `text-xl`   | 22/28             | amount lg                         |
| `text-2xl`  | 24/32, Tailwind's | title lg                          |
| `text-3xl`  | 32/40             | display                           |
| `text-4xl`  | 36/40, Tailwind's | amount xl                         |

A bonus: stage 1 screens using `text-3xl` and `text-lg` got right without edits. The cost: `text-md` reads wrongly, and shadcn's `text-base` in Card and Input changes to 15 px.

**What `accent`, `secondary`, `muted` really hold in `aria-nova` [M], counted in the 13 asked files plus their dependencies:**

| Token              | Used                                               | Means in practice                                                                                      |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `muted`            | **39 uses in 13 files**                            | Tab list track, ghost and outline hover, table hover, avatar fallback, skeleton, selected toggle       |
| `muted-foreground` | 20 in 11 files                                     | Secondary text                                                                                         |
| `secondary`        | 7, Button and Badge only                           | A filled quiet button                                                                                  |
| **`accent`**       | **5, all in Select**                               | Only the highlighted option. **Gold in `--accent` would show almost nowhere, and wrongly in a Select** |
| `primary`          | 34, Button, Switch, Checkbox, Field, Badge, Avatar | So primary stays graphite, or switches turn gold                                                       |
| `input`            | 27                                                 | Control borders and the Switch's off track                                                             |

So gold cannot live in any shadcn name. It needs its own (`--gold`) and a `gold` Button variant. And inactive Tab uses `text-foreground/60`, a mix no palette check can see.

**Dark.** Aurum has no dark value anywhere (`tokens.json` lists only a light theme) [M]. The 48 in `.dark` are my guesses, to see whether the pieces hold. They do, with no change to any piece [M]. Pairs pass the contrast test. That is not a dark design.

---

## C. How close with the least code?

Screens are in `$T/repo/screens/`. Rebuilt in order, shots at each stage.

### Counts [M]

| Stage                      | Edited in shadcn's files                                               | Own pieces                                       | Screen lines (className)                         |
| -------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **1. Theme only, nova**    | 0                                                                      | 0                                                | People 70 (25), Investments 67 (61), Rail 47 (5) |
| **1. Theme only, vega**    | 0                                                                      | 0                                                | The same files                                   |
| **2. Values edited, nova** | **33 lines** look, 6 behaviour                                         | 0                                                | The same, plus `variant="gold"` and `segmented`  |
| **2. Values edited, vega** | **30 lines** look, 6 behaviour                                         | 0                                                | The same                                         |
| **3. Composed, nova**      | Those, plus 10 forced colours and 12 for types, **61 in all of 3,133** | **8 files, 990 lines** after Biome, 76 className | **People 55 (11), Investments 80 (7)**           |

Edits at stage 2, nova: `sidebar` 11 look and 6 behaviour, `button` 4, `tabs` 3, `avatar` 2, `card` 2, `field` 2, `switch` 2, `table` 2, `input`, `label`, `select`, `toggle`, `toggle-group` 1 each. Applied by script, `$T/bin/stage2.py`, counted by `diff`.

Pieces, Tailwind classes only, no CSS file: `Amount` 63, `Delta` 24, `AppRail` 280 (with `ScopeSwitcher`), `EvolutionChart` 78, `chips` 159 (`PersonAvatar`, `PersonStack`, `ScopeChip`, `TickerChip`, `IconTile`, `LegendDot`), `controls` 110 (`Segmented`, `SwatchPicker`, `AllocationBar`), `layout` 203 (`Page`, `PageHeader`, `Section`, `Stat`, `KpiCard`, `SettingRow`, `PersonCard`, `TextLink`), `tables` 73.

The earlier trial's 155 lines covered far less: this one has the rail, chart and allocation table it left out.

**The 18 className strings left in stage 3 [M]:** page grid and column widths (People 4), `CardHeader` border and row (2), overriding `CardTitle` and `CardDescription` sizes (2), overriding Card's padding (`gap-0 py-0`), Select's width, Card footer, inline text sizes and tones in Investments. Most could go into pieces; some are genuine one-offs [R].

### By eye, against the prototypes

Stage 1 tells you most of it. Theme only, the dark rail is already there, the warm canvas, Geist, the graphite primary, and real tables. Page height: nova 1,137 and vega 1,270 at the first People shot, against the prototype's 1,092, so nova is denser and closer. **This goes further than the earlier trial's "colours alone do not give the look":** there colours were mapped onto the app; here the theme also drives shadcn's real Sidebar, so much more arrives. Still no gold, no tones, wrong proportions, and it reads as shadcn.

**Right at stage 3 [M, by eye]:**
- Rail: graphite gradient with gold glow, gold brand mark, 248 px, 40 px items, overline labels, active item with gold icon, pill counts, gold attention badge, person switcher with overlapping avatars, collapse row.
- Head: scope chip with avatars, display title, gold button, segmented period, outline button.
- People: person cards with selected ring, avatars in tones, field grid, colour swatches with selection, canvas footer, setting rows with Select, Segmented, Switch.
- Investments: hero amount with small currency and cents, deltas with arrows, area chart with end dot, side figures with progress, allocation table with coloured legend, bars and target marks, warning differences, tabs with counts, ticker chips, right-aligned tabular numbers.
- Icon tiles in 8 tones, light and dark (`nova-3-pieces-tiles*.png`). Neither screen uses them, so I drew them apart.

**Still different [M, by eye or source]:**
- **No gold focus halo.** One `--ring` holds one colour. The prototype has a graphite border and a gold halo on inputs, and a solid 2 px outline on buttons; shadcn has a 3 px 50% ring on all. **Not a value change.**
- Ghost and table hover use `muted` (`#eeede8`), a step darker than the prototype's `#f3f2ee`. Only ghost Button's could move to `accent`, by editing.
- Cards 8.4 px, not 8. Rail brand about 4 px higher.
- `Amount`'s currency sits on the baseline; in the prototype it rises to the top at the largest size.
- Swatches 36 px apart, not 32, by `ToggleGroup`'s `spacing`.
- Collapsed rail hides the attention count; the prototype keeps a gold dot.
- Scope switcher in the collapsed rail stacks avatars vertically; I did not compare with `DesktopNavCollapsed.html`.
- Shots are on macOS and the prototype's on Linux, so text weight differs a little. Not a difference of code.
- Hover, pressed and focus states were not compared by eye. Only rest states.

**Vega.** Taller: 36 px controls, 24 px card padding. Its small Card lays out avatar over text, wrong for the person cards, which I left unfixed. It needs 3 fewer edits, and is further away at stage 1. **Nova is the better start for these screens, but not by much** [R]. The rail in vega stage 2 keeps a serious contrast failure (see F), as stage 3 was only built for nova.

### Narrow and dark

- **People at 390 px:** clean [M]. Everything stacks, Select and segmented wrap under their text.
- **Investments at 390 px:** first failed, page 623 px wide, caused only by `TabsList` being `w-fit`. Fixed with `max-w-full overflow-x-auto` on it, then 390 [M]. At 900 px also passes, with the table scrolling inside. Page content needed `min-w-0` on `SidebarInset`, which the piece has.
- **Tables on a phone scroll sideways.** No card layout was built. By design of the trial, not solved.
- **`.dark`:** all pieces hold with no piece touched [M].

---

## D. The rail

Tested on `AppRail`, on `Sidebar`, in Chromium, Firefox and WebKit, with identical results (`$T/logs/D-rail-*.log`) [M].

| Item                                  | Result                                                                                                          |                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Width                                 | 248 px, collapsed 72 px, via two constants                                                                      | Pass                                              |
| Collapse                              | `Recolher menu`, labels hide, tooltips appear, focus stays on the button                                        | Pass                                              |
| Ctrl/Cmd+B                            | Toggles. **Also fires while typing in a field** by reading the handler [R, not run]                             | Pass, with a caveat                               |
| Persistence                           | Writes a cookie and **never reads it** on the client: back to expanded after reload                             | **Fail**, your own `defaultOpen` needed           |
| `aria-current`                        | **shadcn sets only `data-active`,** so must be passed by hand. `AppRail` does it                                | Pass after composing                              |
| Trigger's `aria-expanded`             | **Absent from `SidebarTrigger`**                                                                                | **Fail**, fixed with 2 lines                      |
| Mobile sheet                          | Opens as a dialog, focus inside, Esc, backdrop, focus returns                                                   | Pass                                              |
| **Esc from a rail link in the sheet** | **Nothing happens.** `tooltip` on `SidebarMenuButton` wraps it in a disabled `TooltipTrigger` that swallows Esc | **Fail, a real bug,** fixed with 1 line, retested |
| Closing the sheet on navigating       | Stays open                                                                                                      | **Fail**, fixed with 3 lines                      |
| Sheet's texts                         | **"Sidebar", "Displays the mobile sidebar.", "Toggle Sidebar", "Close": hard-coded English**                    | **Fail,** not fixed                               |
| Keyboard                              | Sensible order, one stop for the radio group, arrows move, Space selects                                        | Pass                                              |
| Skip link                             | **None.** `AppLayout` has one                                                                                   | **Missing**                                       |
| Nav landmark                          | **None.** I added `<nav>`. Sidebar's root sits outside any landmark: axe `region`, 1 on stage 3                 | Partial                                           |
| List semantics                        | **`SidebarMenu` is `div`s in the aria version, not `ul`/`li`.** No list announced, and no count of items        | **Worse than NavList**                            |
| Section labels                        | **A `div`, naming nothing.** `NavSection` names its `ul` with `aria-labelledby`                                 | **Worse than NavList**                            |
| Nav badges                            | **Outside the link,** so "142" is not part of its name. Hidden when collapsed                                   | **Worse**                                         |
| Forced colours                        | See below                                                                                                       | Fail, then fixed                                  |
| Person switcher slot                  | `SidebarFooter` holds any child. As `ToggleGroup` it is a real `radiogroup`                                     | Pass                                              |

**Forced colours[M], `nova-3-people-forced-colours.png`:**
- **As generated, every rail link draws a permanent outline.** `outline-hidden` with no `focus-visible:` prefix: Tailwind turns it into a visible outline there. 6 in `sidebar`, plus `select` 2, `chart` 1.
- Current page not distinguishable, Switch's state gone, segmented and scope selections gone, swatches and person card selection gone.
- 10 lines fix it: `sidebar` 6 (`focus-visible:outline-hidden` and the current page's mark), `switch` 2, `toggle` 1, `tabs` 1. `select` and `chart` keep theirs, unfixed. Current page gets a left bar, selections use `Highlight`. One more on `PersonCard`. **Re-shot and clearly fixed by eye.**

**Verdict [R].** Good enough to replace `AppLayout` and `NavList` in look and in behaviour, **with 23 lines edited in `sidebar.tsx` (11 look, 6 behaviour, 6 forced colours) and `AppRail`'s 280 lines around it.** The trade: `NavList`'s list semantics and `AppLayout`'s skip link get lost unless added back, and these are things Aurum had built on purpose. They would be further edits, not yet made or tested.

---

## E. Package

Built with Aurum's own `scripts/build-package.ts`, `tsc` with the build settings, packed with `pnpm pack`. Tarball **46 KB, 95 files** [M].

Consumer: its own Tailwind and Vite, stage 3 screens with imports changed to the package, and this CSS only:

```css
@import "tailwindcss";
@import "@fgarend/aurum-ds/theme.css";
```

|                                                                                  | npm                             | pnpm 12.16.1                                  |
| -------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------- |
| Install                                                                          | 98 packages                     | Passes under strict layout                    |
| `vite build`                                                                     | Pass, CSS 118 KB, **JS 963 KB** | Pass, CSS 114 KB, JS 963 KB                   |
| `tsc`, TypeScript 5.9.3, `skipLibCheck: false`                                   | **0 errors**                    | **0 errors**                                  |
| Classes and theme arrive (`bg-gold`, `text-md`, `bg-cat-5-soft`, `text-expense`) | Yes                             | Yes                                           |
| Screens                                                                          | `consumer-npm-investments.png`  | `consumer-pnpm-people.png`, no console errors |

`@source "../components"` **in the package's own theme file** is what makes one import enough, and it survives pnpm's symlinks [M]. Not measured this time: the theme without it, which the earlier trial showed fails.

**`shadcn/tailwind.css`.** `init`'s `@import` makes `shadcn` a runtime dependency: **226 packages, 70 MB** [M]. I copied the file into the theme (637 lines), by hand, as `shadcn eject` does [V from its help]. `eject` itself was not run. That file then needs updating by hand.

**Peers or dependencies [M for what the code imports, R for the choice]:**
- `tailwind-merge`: **not used at all.** `cn` replaced it. So `clsx` comes only through `cva`.
- `cn`, `class-variance-authority`: dependencies. Internal to the classes.
- `react-aria-components`: dependency works here with an exact pin. The app also has it directly, so two versions can load if they drift. **I would make it a peer, not tested.**
- `recharts`: only `chart` and `EvolutionChart` need it, and most of 963 KB is it and React Aria. Optional peer, or its own entry [R].
- `tw-animate-css`: must be a dependency, the theme imports it.
- Geist fonts: already dependencies.

**Scripts needing change:** `package.test.ts`, `check-package.ts`, `exports` (`./ui/*`, `./aurum/*`, `./hooks/*`, `./theme.css`).

**Not tried:** the local link for the daily loop, and a consumer on a different `react-aria-components`.

---

## F. Checks in Tailwind

All in the copy. Stories for every piece: `src/components/aurum/Pieces.stories.tsx`, 23 stories.

**The existing sweeps first [M]:** with those 23 stories added, `forced-colors.test.tsx` 140 of 140 and `text-spacing.test.tsx` 207 of 207 pass, **on pieces the wide sweeps prove broken.** They look only at `au-` classes. `.storybook/preview` axe: **69 of 69** (23 stories × 3 browsers) after I fixed 2 mistakes of my own, an `aria-label` hiding visible text and a nested `main`.

| Check                                                             | Lines  | Catches on the pieces                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wider forced colours** `.storybook/forced-colors-wide.test.tsx` | **68** | **First run 17 failures of 46**, in 2 browsers. States that look alike with fills gone (`switch`, `toggle`, `tabs`, person card, rail), stray outlines, thumbless switches, off-colour icons. After the fixes **5 failures in 3 stories**: icons in Rail, Select, Sidebar, whose colour differs from the link's. Those may be harmless; not checked by eye |
| **Wider text spacing** `.storybook/text-spacing-wide.test.tsx`    | **37** | **18 failures, 6 stories × 3 browsers.** `Badge` (`h-5 overflow-hidden`) cuts text, so also `ScopeChip`. `Tabs` trigger, from the list's fixed height. Sidebar group: not diagnosed, may be my story. **Not fixed.** First version had a false positive on React Aria's hidden select, filtered                                                            |
| **Contrast against opacity** `test/tailwind-contrast.test.ts`     | **56** | On pristine nova: **`text-foreground/60` in Tabs, 3.88:1 at worst on `muted`.** axe measures 4.08:1 on the canvas, so the rule sees further. `sidebar-foreground/70` passes on `#303338`. After edits, none. 29 token pairs in both modes pass                                                                                                             |
| **Class scan** `test/tailwind-classes.test.ts`                    | **32** | Below                                                                                                                                                                                                                                                                                                                                                      |

**Class scan [M]:**

| Rule                                       | Pristine nova  | Final, with own pieces |
| ------------------------------------------ | -------------- | ---------------------- |
| Length in brackets (`h-[18.4px]`)          | 46 in 13 files | 51 in 15               |
| Half steps off the 4 px scale (`gap-1.5`)  | 62 in 15 files | 77 in 20               |
| Colour in brackets (`color-mix` in Button) | 1              | 1                      |
| Palette colour (`bg-black/10` in Sheet)    | 1              | 1                      |
| Opacity on text                            | 2              | 0                      |

**So a hard rule on literals would refuse shadcn's own code** at every run. As a gate it only works on `aurum/`, or with a baseline count that may not grow [R]. It does not reach `cn`-merged or runtime classes.

**Limits of what I wrote:** forced colours compares a selected element with its unselected twin, so an element with no twin is not judged. Contrast assumes each class's possible surfaces instead of looking at where it sits. Both are prototypes, with no tests of their own.

### axe on the screens, 3 browsers [M]

axe 4.14, WCAG 2.0 to 2.2 A and AA plus best practice, Chromium, Firefox, WebKit, identical in all three (`$T/logs/F-axe.log`).

|                        | People 1440                                             | Investments 1440                                    | People 390 | Investments 390    |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------- | ---------- | ------------------ |
| **Stage 1 nova**       | `color-contrast` 1 (rail toggle **1.3:1**), `region` 21 | `color-contrast` 6 (+ **tabs 4.08:1**), `region` 14 | 0          | `color-contrast` 5 |
| **Stage 2 vega**       | `color-contrast` 1 (rail toggle 1.3:1), `region` 21     | same, `region` 14                                   | 0          | 0                  |
| **Stage 3 nova**       | `region` 1                                              | `region` 1                                          | **0**      | **0**              |
| **Stage 3 nova, dark** | `region` 1                                              | `region` 1                                          | not run    | not run            |

**Incomplete, for axe to give up on:** `color-contrast` 24 to 43 nodes on the rail's gradient, so **axe does not judge the rail** [M]. That is what `tailwind-contrast.test.ts` is for. `label-content-name-mismatch` 3 and `aria-prohibited-attr` 1 (`aria-label` on Sidebar's `div`), not looked at.

---

## G. The app

Fresh copy of `wealth/apps/web` at `f489bb0` (`$T/app`), its pinned install. The new theme went in under `:root[data-ui="v2"]`, 110 lines, with one extra `@theme inline` for the new names.

|                              | Baseline       | With the theme      |
| ---------------------------- | -------------- | ------------------- |
| `tsc --noEmit`               | 0              | **0**               |
| Unit tests (visual excluded) | **511 of 511** | **511 of 511**      |
| `vite build`                 | not run        | Pass                |
| `biome check src/index.css`  | not run        | Errors, not counted |

**The asked 509 has become 511** [M]. **Visual tests:** on the host, 12 fail at baseline, all screenshots (platform), so not comparable. Not run in Docker.

**How much this says:** little. `index.css.test.ts` reads the file's first blocks and the rest run in jsdom, which computes no Tailwind style. Passing means nothing was named wrongly [R].

**What I saw:** `app-v2-theme-people.png` shows graphite rail, gold, warm canvas. Its fonts stay Instrument Sans: `--font-sans` lives in the app's `@theme inline` and cannot vary under `[data-ui]`. Radii stay the app's: `--radius-*` are literal px there, so `--radius` under v2 does nothing there.

Not done: swapping in the edited pieces. A `/portfolio/position` shot came back as the fake API's JSON, so I removed it and did not judge a money screen.

---

## What I did not get to

- A screen reader on anything.
- Hover, pressed, focus states compared by eye. Only rest states.
- Vega at stage 3 (not asked), and the rail's contrast there.
- Fixing the text spacing failures, or the 5 remaining forced colours ones.
- 100% coverage; only measured the gap.
- `shadcn eject` run, RAC as a peer, the local link, a real upgrade with `add --overwrite` over edited files.
- Removing old `au-` components from the copy. Both live side by side.
- `DesktopNavCollapsed.html` compared with the collapsed rail.
- `.storybook/visual` approvals for the new pieces. None are tagged `visual`, so **nothing here guards their look**.
- Time: this trial says nothing about the pace of reviewed work.

## Screenshots

In `/private/tmp/claude-501/-Users-arend-Projects-aurum-ds/7b0e54f3-bda4-4f23-9bde-3351d7db44fe/scratchpad/direction-v2/trial/shots/`. All at 1440 wide unless named.

| File                                    | What                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| `nova-1-people-theme-only.png`          | Nova, theme only, untouched pieces, shadcn's Sidebar                                    |
| `nova-1-investments-theme-only.png`     | The same, Investments                                                                   |
| `vega-1-people-theme-only.png`          | Vega, theme only                                                                        |
| `vega-1-investments-theme-only.png`     | The same, Investments                                                                   |
| `nova-2-people-edited.png`              | Nova, 33 + 6 lines edited, no own pieces                                                |
| `nova-2-investments-edited.png`         | The same, Investments                                                                   |
| `vega-2-people-edited.png`              | Vega, 30 + 6 lines edited                                                               |
| `vega-2-investments-edited.png`         | The same, Investments                                                                   |
| `nova-3-people-composed.png`            | **Nova with composed pieces: compare with `WebPeople.png`**                             |
| `nova-3-investments-composed.png`       | **The same: compare with `WebInvestments.png`**                                         |
| `nova-3-pieces-tiles.png`               | Icon tiles in tones, amounts, deltas, chips                                             |
| `nova-3-pieces-tiles-dark.png`          | The same, `.dark`                                                                       |
| `nova-3-people-dark.png`                | People, `.dark`, guessed values                                                         |
| `nova-3-investments-dark.png`           | Investments, `.dark`                                                                    |
| `nova-3-people-narrow-390.png`          | People at 390 px                                                                        |
| `nova-3-investments-narrow-390.png`     | Investments at 390 px, after the tabs fix                                               |
| `nova-3-investments-tablet-900.png`     | Investments at 900 px, taken before the tabs fix; only the page's right edge may differ |
| `nova-3-people-forced-colours.png`      | People in forced colours, after the fixes                                               |
| `nova-3-investments-forced-colours.png` | Investments in forced colours, after the fixes                                          |
| `rail-collapsed.png`                    | Rail collapsed                                                                          |
| `rail-collapsed-tooltip.png`            | Rail collapsed, tooltip on hover                                                        |
| `rail-mobile-sheet.png`                 | Rail as a sheet at 390 px                                                               |
| `consumer-pnpm-people.png`              | People from the tarball, pnpm consumer                                                  |
| `consumer-npm-investments.png`          | Investments from the tarball, npm consumer                                              |
| `app-v2-theme-people.png`               | The real app's copy under v2, fake API, its random data                                 |

The forced-colours shot from before the fixes was overwritten by the later one, so "before" rests on the numbers above and `$T/logs/D-fc.log`.
