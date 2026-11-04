# Design definitions: a four-way audit

Aurum, the app, the prototypes and shadcn with Tailwind 4, compared token by token, under the line that shadcn is the base.

Written 2026-11-04. Read-only on both repositories. Everything here is a proposal; nothing is adopted.

**Marks.** [M] measured here, by a script, a Tailwind compile or a browser. [V] read in a source, named. [R] reasoning, which can be wrong. In the token tables, every value in the first four columns is [V], pulled by a script from the files named in section 1, and every proposal is [R].

**dE** is the distance between two painted colours in OKLab, times 100. Around 2 is where a difference starts to show side by side [R: common rule of thumb, not measured with people].

**Where the numbers come from.** Translucent classes are composited as the browser does. I checked seven of them on a canvas in a real browser, and they matched my formula to within one step per channel [M].

## 1. Scope and counts

| Source     | What I read                                                                                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Aurum      | `src/tokens/tokens.json`, `tokens.css`, `dist/tokens/tokens.css` (commit `4d5b60d`, v0.3.0), `src/components/AurumRoot/AurumRoot.css`, `docs/guidelines.md`, decisions 0025, 0026, 0027, 0053, 0076, 0080, 0081, 0087, 0088, 0089, 0090                                  |
| App        | `apps/web/src/index.css`, `index.css.test.ts`, `components.json`, `src/lib/utils.ts`, `src/components/ui/`, decisions 0094, 0171, 0185, 0204, 0208                                                                                                                       |
| Prototypes | `reference/prototype/assets/tokens.css`, `aurum.css`, the 30 HTML files, `reference/artifact/tokens.json`                                                                                                                                                                |
| shadcn     | All 61 `registry:ui` files of `aria-nova`, downloaded from `ui.shadcn.com/r/styles/aria-nova/` today; `style.json`; `colors/neutral.json`; `shadcn/dist/tailwind.css` 4.23.0; the theming and Vite dark mode docs; the trial; the earlier report `direction/2-shadcn.md` |
| Tailwind   | `tailwindcss/theme.css` 4.3.3, as installed in the trial, and compiles with its API                                                                                                                                                                                      |

**Counts, corrected.** [M]

- **96 custom properties and 12 text styles.** The earlier 94 left out the 2 font families.
- Colour 69, space 10, radius 5, shadow 4, control heights 3, layout 3, font 2.
- **Motion has no tokens at all.** It exists only as a sentence in the guidelines.
- Components read only 41 of the 96 through `var()` so far.
- Beyond the 96, `[data-au-surface="inverse"]` reassigns 18 of them at run time.

**Proposal totals for the 96** [M, by count of the tables]: 27 shadcn name fits, 14 Tailwind already gives it, 29 new names, 12 drop, 14 open.

**Two corrections to the brief.**

- The app has **no `[data-ui="v2"]` values** in `index.css`. It only excludes v2 from the dark tokens (decision 0204) [V].
- The trial's `src/index.css` is **not** what `shadcn init` wrote. It is a hand-written bridge, without `@custom-variant dark` or `--radius` [M]. So what `init` produces is taken from `style.json`, `colors/neutral.json`, the docs and the app's own file [V]. I did not run `init`.

## 2. Main findings

1. **Tailwind's defaults already are most of Aurum's scale.** All 10 spaces, all 3 control heights and the 768 breakpoint match by number. Tailwind's default radius scale is 4, 6, 8, 12: Aurum's exactly [V].
2. **Five of the 12 text styles are Tailwind steps,** with the same size and line: body and body-strong are `text-sm`, caption is `text-xs`, title-lg is `text-2xl`, and amount-xl is `text-4xl` [V]. Those 14/20 and 12/16 are what nova's components already write.
3. **The real work is not in the names. It is in the classes that nova hard-codes.** Default control height 32 against Aurum's 40. Radius one step up per role. Hover on `muted`, not `accent`. Overlay `bg-black/10` with blur. Tokens cannot reach these.
4. **`accent` is the wrong home for gold.** In `aria-nova` it paints only the focused row of a menu [M].
5. **`--sidebar-*` fits the graphite rail very well,** including `sidebar-primary` for the gold brand mark. But it reaches only the sidebar's own pieces, so the rail still needs Aurum's surface rule, under shadcn's names (T9).
6. **One failure comes with nova:** `text-foreground/60` on the inactive tab, 3.91:1 on Aurum's `muted` [M]. It passes on the app's greys at 4.54 and fails on the warm one.
7. **Where the app is better:** its red (#b42318) holds up on nova's tinted destructive states, where Aurum's does not. Its dark palette is a usable start, and its colours work on the rail. **Where it is worse:** `subtle-foreground` at 3.28:1, used 27 times in the app [M].
8. **`cn` is a real trap.** With default `cn`, `cn("text-muted-foreground", "text-label")` silently returns `text-label`, losing the colour [M]. And 58 of the 61 registry files import `cn` directly, which bypasses any local configuration [M].

## 3. Every token

The proposal column uses five words only. **shadcn name fits**: an existing shadcn or Tailwind name takes the value, overriding the default where needed. **Tailwind scale already gives it**: nothing to define. **new name in shadcn's pattern**: declared in `:root` and exposed through `@theme inline`, as the docs' `warning` example does. **drop**: replaced as the row says. **open**: needs the owner, and the question is in section 10.

Default shadcn values are `neutral`, from `colors/neutral.json`, with the hex computed by me.

Motion has no row because it has no token (7.4). Text sizes are not among the 96 either: the 12 styles are in 6.2.

### Colour: grounds and lines (9)

| Aurum, value                     | App, light / dark                   | Prototype | shadcn or Tailwind, default                                         | Proposal                         | Evidence                                                                                                                                                                                    |
| -------------------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canvas` `#faf9f6`               | `background` #ffffff / dark #141519 | same      | --background = oklch(1 0 0) ≈ #ffffff                               | **shadcn name fits**             | Warm paper. Trap T1: `bg-background` also paints outline buttons, the selected tab and the switch thumb. Q1.                                                                                |
| `surface` `#ffffff`              | `card` #ffffff / dark #141519       | same      | --card, --popover = oklch(1 0 0) ≈ #ffffff                          | **shadcn name fits**             | One Aurum token fills two shadcn names. 467 uses in the screens. Both stay white.                                                                                                           |
| `surface-hover` `#f3f2ee`        | `accent` #efeff2 / dark #23242a     | same      | --accent = oklch(0.97 0 0) ≈ #f5f5f5                                | **shadcn name fits**             | Docs say accent is for hover generally; aria-nova uses it only in menus (T3). To keep the prototype's hover, change `hover:bg-muted` to `hover:bg-accent` in the ghost and outline buttons. |
| `surface-sunken` `#eeede8`       | `muted` #f7f7f8 / dark #1a1b20      | same      | --muted, --secondary = oklch(0.97 0 0) ≈ #f5f5f5                    | **shadcn name fits**             | Tracks, tiles, tab list, skeleton. Also `secondary`: the Badge's default fill. dE 1.54 from surface-hover, so a hover left on `muted` is barely stronger [M].                               |
| `line` `#e7e5df`                 | `border` #e8e8ec / dark #2a2c33     | same      | --border = oklch(0.922 0 0) ≈ #e5e5e5                               | **shadcn name fits**             | Cards in nova use `ring-1 ring-foreground/10`, not a border: over paper dE 0.63 from `line`, over white dE 1.59 [M]. Either stays close.                                                    |
| `line-strong` `#d8d5ce`          | none                                | same      | --border (no strong step) = oklch(0.922 0 0) ≈ #e5e5e5              | **drop**                         | dE 1.58 from control-border [M]. Use `border-input`. 2 rules in aurum.css, 2 uses in the screens [M].                                                                                       |
| `control-border` `#d3d0c8`       | `input` #d5d5db / dark #3a3c44      | same      | --input = oklch(0.922 0 0) ≈ #e5e5e5                                | **shadcn name fits**             | 1.54:1 on white, below 3:1; decision 0080 already excuses it until 7.16. App 1.46, neutral 1.26, so no source passes [M].                                                                   |
| `control-border-hover` `#aba79f` | none                                | same      | none: nova inputs have no hover edge [M]                            | **new name in shadcn's pattern** | `--input-hover`, `hover:border-input-hover`. 61 uses across prototype CSS and screens [M]. The prototype's checkbox rests on this colour, nova's on `border-input` (T6).                    |
| `switch-off` `#c9c6be`           | none                                | same      | --input (`not-data-selected:bg-input`) = oklch(0.922 0 0) ≈ #e5e5e5 | **drop**                         | dE 3.10 from control-border, a just visible change; both fail 3:1 (1.71 and 1.54) [M]. 1 use in the prototype.                                                                              |

### Colour: text (4)

| Aurum, value             | App, light / dark                          | Prototype | shadcn or Tailwind, default                                                                                                     | Proposal                                                                | Evidence                                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ink` `#23262b`          | `foreground` #17181c / dark #ededf0        | same      | --foreground, --card-foreground, --popover-foreground, --secondary-foreground, --accent-foreground = oklch(0.145 0 0) ≈ #0a0a0a | **shadcn name fits**                                                    | 14.42:1 on paper [M]. App's #17181c is darker; no contrast reason to change.                                                                                                                                       |
| `ink-muted` `#4b4f55`    | `muted-foreground` #5b5e66 / dark #a6a9b1  | same      | --muted-foreground = oklch(0.556 0 0) ≈ #737373                                                                                 | **open: Q2, which level takes shadcn's one name**                       | Recommended here. The prototype's `.bs-card__sub`, `.bs-dialog__desc`, `.bs-seg__opt` and `.bs-badge` use it, the same roles as nova's CardDescription, DialogDescription and tabs [M]. 7.03:1 on `muted`.         |
| `ink-subtle` `#5f636a`   | `subtle-foreground` #8b8e96 / dark #7c7f88 | same      | --muted-foreground (nearest) = oklch(0.556 0 0) ≈ #737373                                                                       | **new name in shadcn's pattern**                                        | `--subtle-foreground`, the app's own name (0094), one step fainter than muted. The app's value fails (3.28:1 on white), Aurum's passes (6.04, 5.15 on `muted`) [M]. Prototype uses: hints, placeholders, metadata. |
| `ink-disabled` `#abadb0` | none                                       | same      | none: `disabled:opacity-50`                                                                                                     | **open: Q10, conflicts with the guideline 'no opacity tricks on text'** | Recommended drop. 30 `opacity-50` uses in nova [M]. Disabled text is exempt from 1.4.3. Painted result 2.98:1 against the prototype's 1.92:1 [M].                                                                  |

### Colour: primary (5)

| Aurum, value                | App, light / dark                           | Prototype | shadcn or Tailwind, default                       | Proposal             | Evidence                                                                                                                                                                                                   |
| --------------------------- | ------------------------------------------- | --------- | ------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `primary` `#2b2e33`         | `primary` #1c62b9 / dark #6ea8f5            | same      | --primary = oklch(0.205 0 0) ≈ #171717            | **shadcn name fits** | Graphite. 13.62:1 with white [M]. App's blue stays in v1 only (see section 8).                                                                                                                             |
| `primary-hover` `#3a3e44`   | none                                        | same      | none: `hover:bg-primary/80`                       | **drop**             | nova's /80 paints #54575a, dE 9.2 to 9.7, visibly lighter. `/90` paints #404246, dE 1.74 to 1.95 [M]. One class edit in button.tsx. White on it 10.04:1.                                                   |
| `primary-pressed` `#1e2124` | none                                        | same      | none: `active:translate-y-px`                     | **drop**             | nova moves the button 1 px instead of darkening it. 1 rule in aurum.css. A small change of feel [R].                                                                                                       |
| `on-primary` `#ffffff`      | `primary-foreground` #ffffff / dark #0e1a2b | same      | --primary-foreground = oklch(0.985 0 0) ≈ #fafafa | **shadcn name fits** |                                                                                                                                                                                                            |
| `primary-soft` `#ecebe6`    | `primary-soft` #e3ecf8 / dark #1d2a3b       | same      | none                                              | **drop**             | dE 0.60 from `surface-sunken` [M], so `bg-muted` paints the same. The app's token of the same name is its soft blue, 6 uses in the app [M], which go with v1. If a theme ever needs it apart, add it then. |

### Colour: gold (5)

| Aurum, value           | App, light / dark | Prototype | shadcn or Tailwind, default                                                  | Proposal                         | Evidence                                                                                                                          |
| ---------------------- | ----------------- | --------- | ---------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `gold` `#f0bd2a`       | none              | same      | none; **not** --accent, --primary or --ring (T2) = oklch(0.97 0 0) ≈ #f5f5f5 | **new name in shadcn's pattern** | `--gold`, name in Q4. Also the value of `--sidebar-primary`. 1.75:1 on white, so only on graphite or with its own foreground [M]. |
| `gold-hover` `#e4af17` | none              | same      | none                                                                         | **new name in shadcn's pattern** | `--gold-hover`.`bg-gold/90` over white paints #f2c43f, dE 5.68, and lightens where the prototype darkens [M].                     |
| `gold-soft` `#fbf1d0`  | none              | same      | none                                                                         | **new name in shadcn's pattern** | `--gold-soft`. Same value as cat-1-soft [V].                                                                                      |
| `gold-ink` `#8a6400`   | none              | same      | none                                                                         | **new name in shadcn's pattern** | `--gold-ink`, gold as text. 5.11:1 on paper, 4.59 on `muted` [M]. Same value as cat-1 [V].                                        |
| `on-gold` `#23262b`    | none              | same      | none                                                                         | **new name in shadcn's pattern** | `--gold-foreground`, the pattern's pair. 8.69:1 [M]. 1 screen use, 7 in aurum.css [M].                                            |

### Colour: inverse surface (9)

| Aurum, value                                 | App, light / dark                                  | Prototype | shadcn or Tailwind, default                                              | Proposal                   | Evidence                                                                                                                                                                                   |
| -------------------------------------------- | -------------------------------------------------- | --------- | ------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `inverse` `#303338`                          | `sidebar` #f7f7f8 / dark #1a1b20                   | same      | --sidebar = oklch(0.985 0 0) ≈ #fafafa                                   | **shadcn name fits**       | The rail. App's `--sidebar` is its light grey; 0208 already overrides it with this surface.                                                                                                |
| `inverse-top` `#2b2e33`                      | none                                               | same      | none                                                                     | **open: Q7, the gradient** | `bg-sidebar` is a colour, so a gradient needs its own classes. dE 1.99 from inverse [M]. Same value as primary [V].                                                                        |
| `inverse-bottom` `#34373d`                   | none                                               | same      | none                                                                     | **open: Q7, the gradient** | dE 1.62 from inverse [M]. If the gradient goes, this and inverse-top go.                                                                                                                   |
| `inverse-hover` `rgba(255, 255, 255, 0.06)`  | none                                               | same      | --sidebar-accent at /60 = oklch(0.97 0 0) ≈ #f5f5f5                      | **drop**                   | nova paints hover and current with one token (T5). `hover:bg-sidebar-accent/60` is exactly 6% white, dE 0.00 computed; #3d3f44 painted, one step from #3c3f44 [M]. Edits in sidebar.tsx.   |
| `inverse-active` `rgba(255, 255, 255, 0.10)` | `sidebar-accent` #e3ecf8 / dark #1d2a3b            | same      | --sidebar-accent = oklch(0.97 0 0) ≈ #f5f5f5                             | **shadcn name fits**       | Translucent value works: Tailwind mixes it [M]. Prototype CSS paints .11, the token says .10.                                                                                              |
| `inverse-line` `rgba(255, 255, 255, 0.10)`   | `sidebar-border` #e8e8ec / dark #2a2c33            | same      | --sidebar-border = oklch(0.922 0 0) ≈ #e5e5e5                            | **shadcn name fits**       | Decorative, 1.37:1 [M].                                                                                                                                                                    |
| `on-inverse` `#f4f4f2`                       | `sidebar-accent-foreground` #164f96 / dark #8dbbf8 | same      | --sidebar-accent-foreground, --sidebar-ring = oklch(0.205 0 0) ≈ #171717 | **shadcn name fits**       | 11.51:1 on inverse, 8.41 on current fill [M].                                                                                                                                              |
| `on-inverse-muted` `#cfd1d4`                 | `sidebar-foreground` #5b5e66 / dark #a6a9b1        | same      | --sidebar-foreground = oklch(0.145 0 0) ≈ #0a0a0a                        | **shadcn name fits**       | 8.29:1 on inverse, worst stop 7.80 [M].                                                                                                                                                    |
| `on-inverse-subtle` `#b6b9bd`                | none                                               | same      | `text-sidebar-foreground/70`                                             | **drop**                   | nova's group label at /70 paints #9fa2a5, dE 1.49 from what the prototype's section label paints (rgba white .55), and 4.71 to 5.20:1 [M]. Keeps a role in the surface rule (section 3.4). |

### Colour: decorative (1)

| Aurum, value     | App, light / dark | Prototype | shadcn or Tailwind, default | Proposal | Evidence                                          |
| ---------------- | ----------------- | --------- | --------------------------- | -------- | ------------------------------------------------- |
| `sand` `#d8ccb8` | none              | same      | none                        | **drop** | No use in the prototypes or `src/components` [M]. |

### Colour: finance and states (10)

| Aurum, value                 | App, light / dark                                     | Prototype        | shadcn or Tailwind, default                                               | Proposal                         | Evidence                                                                                                                 |
| ---------------------------- | ----------------------------------------------------- | ---------------- | ------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `income` `#0f7a3d`           | `in-effect` #1e7a43 / dark #6fcf97 (close)            | same             | none                                                                      | **new name in shadcn's pattern** | `--income`. Text like `text-destructive`. App's #1e7a43 is dE 1.08 away and no better (5.36 against 5.42 on white) [M].  |
| `income-soft` `#e3f2e8`      | `in-effect-background` #eaf6ee / dark #15291d (close) | same             | none                                                                      | **open: Q6, solid or /N**        | Recommended keep, `--income-soft`.`bg-income/10` is dE 0.76, but fails on paper (4.49) and `muted` (4.06) [M].           |
| `expense` `#c4281c`          | `destructive` #b42318 / dark #f59a92 (close)          | same             | none (not --destructive by default) = oklch(0.577 0.245 27.325) ≈ #e7000b | **new name in shadcn's pattern** | `--expense`, money out. Apart from `--destructive`: spending is not an error (app 0094). dE 3.53 from the app's red [M]. |
| `expense-soft` `#fbe6e2`     | `problem-background` #fdedec / dark #3a1a18 (close)   | same             | none                                                                      | **open: Q6, solid or /N**        | Recommended keep, `--expense-soft`. /10 fails on `muted` (4.20) [M].                                                     |
| `invest` `#6b4c70`           | none                                                  | same             | none                                                                      | **new name in shadcn's pattern** | `--invest`. Same value as cat-4 [V]. Only in aurum.css, no direct use in the screens [M].                                |
| `invest-soft` `#efe5ef`      | none                                                  | same             | none                                                                      | **open: Q6, solid or /N**        | Recommended keep. /15 passes everywhere (5.00 or better), dE 1.17 [M].                                                   |
| `warning` `#8f5200`          | `pending` #a15c00 / dark #f2bd5c (close)              | same             | docs' example of adding a token                                           | **new name in shadcn's pattern** | `--warning`. Better than the app's #a15c00: 6.22 against 5.19 on white, 5.23 against 4.79 on its tint [M].               |
| `warning-soft` `#f7ead2`     | `pending-background` #fef5e2 / dark #33270f (close)   | same             | none                                                                      | **open: Q6, solid or /N**        | Recommended keep. /12 passes, at exactly 4.50 on `muted`, dE 1.95 [M].                                                   |
| `success` `var(--au-income)` | `in-effect` #1e7a43 / dark #6fcf97 (close)            | `var(--income)`  | none                                                                      | **drop**                         | Alias of income, no use in the prototypes [M]. Use `--income`.                                                           |
| `danger` `var(--au-expense)` | `destructive` #b42318 / dark #f59a92                  | `var(--expense)` | --destructive = oklch(0.577 0.245 27.325) ≈ #e7000b                       | **open: Q5, which red**          | The name fits. Recommended value is the app's #b42318, because nova paints text on `destructive/10` and `/20` (T7).      |

### Colour: categories (16)

| Aurum, value           | App, light / dark | Prototype | shadcn or Tailwind, default | Proposal                         | Evidence                                                                                            |
| ---------------------- | ----------------- | --------- | --------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `cat-1` `#8a6400`      | none              | same      | none                        | **new name in shadcn's pattern** | `--category-1`, ochre. Same value as gold-ink [V].                                                  |
| `cat-1-soft` `#fbf1d0` | none              | same      | none                        | **new name in shadcn's pattern** | `--category-1-soft`.`/15` is dE 3.58 off, so a solid tint is kept [M]. Same value as gold-soft [V]. |
| `cat-2` `#1f6b66`      | none              | same      | none                        | **new name in shadcn's pattern** | `--category-2`, teal.                                                                               |
| `cat-2-soft` `#dcefec` | none              | same      | none                        | **new name in shadcn's pattern** | `--category-2-soft`.                                                                                |
| `cat-3` `#8a5a2b`      | none              | same      | none                        | **new name in shadcn's pattern** | `--category-3`, caramel.                                                                            |
| `cat-3-soft` `#f4e8dc` | none              | same      | none                        | **new name in shadcn's pattern** | `--category-3-soft`.                                                                                |
| `cat-4` `#6b4c70`      | none              | same      | none                        | **new name in shadcn's pattern** | `--category-4`, plum. Same value as invest [V].                                                     |
| `cat-4-soft` `#efe5ef` | none              | same      | none                        | **new name in shadcn's pattern** | `--category-4-soft`. Same value as invest-soft [V].                                                 |
| `cat-5` `#3f5f7a`      | none              | same      | none                        | **new name in shadcn's pattern** | `--category-5`, slate.                                                                              |
| `cat-5-soft` `#e3ebf2` | none              | same      | none                        | **new name in shadcn's pattern** | `--category-5-soft`.                                                                                |
| `cat-6` `#4f6b3a`      | none              | same      | none                        | **new name in shadcn's pattern** | `--category-6`, sage.                                                                               |
| `cat-6-soft` `#e8efe0` | none              | same      | none                        | **new name in shadcn's pattern** | `--category-6-soft`.                                                                                |
| `cat-7` `#9b3f5c`      | none              | same      | none                        | **new name in shadcn's pattern** | `--category-7`, rose.                                                                               |
| `cat-7-soft` `#f7e3ea` | none              | same      | none                        | **new name in shadcn's pattern** | `--category-7-soft`.                                                                                |
| `cat-8` `#4b4f55`      | none              | same      | none                        | **new name in shadcn's pattern** | `--category-8`, graphite. Same value as ink-muted [V].                                              |
| `cat-8-soft` `#eeede8` | none              | same      | none                        | **new name in shadcn's pattern** | `--category-8-soft`. Same value as surface-sunken [V].                                              |

### Colour: focus and overlay (4)

| Aurum, value                            | App, light / dark             | Prototype | shadcn or Tailwind, default         | Proposal                                | Evidence                                                                                                                                                                                                        |
| --------------------------------------- | ----------------------------- | --------- | ----------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `focus-ring` `#2b2e33`                  | `ring` #1c62b9 / dark #6ea8f5 | same      | --ring = oklch(0.708 0 0) ≈ #a1a1a1 | **shadcn name fits**                    | 12.94:1 on paper [M]. nova uses it twice: `border-ring` solid and `ring-ring/50` halo (T4).                                                                                                                     |
| `focus-halo` `rgba(240, 189, 42, 0.35)` | none                          | same      | `ring-ring/50`                      | **open: Q3, keep the gold halo or not** | Recommended drop. Graphite /50 is 2.90:1 on paper against gold's 1.20:1 [M], and the solid edge carries the focus in both. Keeping gold means editing every control.                                            |
| `danger-halo` `rgba(196, 40, 28, 0.14)` | none                          | same      | `ring-destructive/20`               | **drop**                                | dE 3.32 painted over white [M]; a small change on a focused error only.                                                                                                                                         |
| `scrim` `rgba(30, 33, 36, 0.40)`        | none                          | same      | `bg-black/10` in 4 files            | **drop**                                | nova's overlay is far lighter: dE 19.35 [M].`bg-black/35` is dE 0.30 [M]. Edit 4 classes, and drop its `backdrop-blur-xs`: guidelines say no glass. Not `bg-foreground/35`, which turns light in dark mode [R]. |

### Colour: charts (6)

| Aurum, value        | App, light / dark                | Prototype | shadcn or Tailwind, default            | Proposal                         | Evidence                                                                                                   |
| ------------------- | -------------------------------- | --------- | -------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `chart-1` `#2b2e33` | `chart-1` #1c62b9 / dark #6ea8f5 | same      | --chart-1 = oklch(0.87 0 0) ≈ #d4d4d4  | **shadcn name fits**             | 13.62:1 on white [M]. App's is its blue.                                                                   |
| `chart-2` `#e2b02a` | `chart-2` #7fa7dc / dark #3f6fae | same      | --chart-2 = oklch(0.556 0 0) ≈ #737373 | **shadcn name fits**             | 2.00:1, below 3:1 [M]. Excused in 0080 until the first chart.                                              |
| `chart-3` `#9f9f9e` | `chart-3` #c3d5ee / dark #2a4466 | same      | --chart-3 = oklch(0.439 0 0) ≈ #525252 | **shadcn name fits**             | 2.65:1 [M]. Same excuse.                                                                                   |
| `chart-4` `#2f8077` | `chart-4` #9a9da5 / dark #6b6e76 | same      | --chart-4 = oklch(0.371 0 0) ≈ #404040 | **shadcn name fits**             | 4.69:1 [M].                                                                                                |
| `chart-5` `#cfcabf` | `chart-5` #5b5e66 / dark #a6a9b1 | same      | --chart-5 = oklch(0.269 0 0) ≈ #262626 | **shadcn name fits**             | 1.63:1 [M]. Same excuse.                                                                                   |
| `chart-6` `#8c6e8f` | none                             | same      | none: shadcn stops at 5                | **new name in shadcn's pattern** | `--chart-6`, same pattern. 4.43:1 [M].`chart.tsx` reads no `--chart-*` itself; the caller passes them [M]. |

### Shadow (4)

| Aurum, value                                     | App, light / dark                          | Prototype | shadcn or Tailwind, default                                                        | Proposal             | Evidence                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------ | --------- | ---------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `shadow-xs` `0 1px 2px rgba(16, 24, 40, 0.05)`   | none                                       | same      | `shadow-xs` = `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                      | **shadcn name fits** | Set Aurum's value on Tailwind's name. Tailwind's is the same shape in pure black. nova never uses it, so fields need the class added [M]. |
| `shadow-sm` `0 1px 2px rgba(16, 24, 40, 0.04)`   | `shadow-sm` 0 1px 2px rgb(16 24 40 / 0.04) | same      | `shadow-sm` = `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`      | **shadcn name fits** | The app already carries Aurum's value [V]. Tailwind's default is much stronger.                                                           |
| `shadow-md` `0 4px 16px rgba(20, 38, 54, 0.08)`  | none                                       | same      | `shadow-md` = `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`   | **shadcn name fits** | Setting it restyles all of nova's popups, 6 uses [M].                                                                                     |
| `shadow-lg` `0 16px 48px rgba(20, 38, 54, 0.16)` | none                                       | same      | `shadow-lg` = `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | **shadcn name fits** | nova's dialog has no shadow [M]; add `shadow-lg`, as the prototype does.                                                                  |

### Space (10)

| Aurum, value      | App, light / dark | Prototype | shadcn or Tailwind, default     | Proposal                            | Evidence                                               |
| ----------------- | ----------------- | --------- | ------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `space-1` `4px`   | none              | same      | `p-1`, `gap-1` = 1 x 0.25rem    | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-2` `8px`   | none              | same      | `p-2`, `gap-2` = 2 x 0.25rem    | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-3` `12px`  | none              | same      | `p-3`, `gap-3` = 3 x 0.25rem    | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-4` `16px`  | none              | same      | `p-4`, `gap-4` = 4 x 0.25rem    | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-5` `20px`  | none              | same      | `p-5`, `gap-5` = 5 x 0.25rem    | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-6` `24px`  | none              | same      | `p-6`, `gap-6` = 6 x 0.25rem    | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-8` `32px`  | none              | same      | `p-8`, `gap-8` = 8 x 0.25rem    | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-10` `40px` | none              | same      | `p-10`, `gap-10` = 10 x 0.25rem | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-12` `48px` | none              | same      | `p-12`, `gap-12` = 12 x 0.25rem | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |
| `space-16` `64px` | none              | same      | `p-16`, `gap-16` = 16 x 0.25rem | **Tailwind scale already gives it** | Same number, same pixels at the default root size [M]. |

### Radius (5)

| Aurum, value          | App, light / dark | Prototype | shadcn or Tailwind, default                            | Proposal     | Evidence                                                                                                                                |
| --------------------- | ----------------- | --------- | ------------------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `radius-sm` `4px`     | `radius-sm` 6px   | same      | --radius-sm = --radius x 0.6; Tailwind alone: 0.25rem  | **open: Q8** | Checkbox: nova hard-codes `rounded-[4px]`, which is this value [M].                                                                     |
| `radius-md` `6px`     | `radius-md` 8px   | same      | --radius-md = --radius x 0.8; Tailwind alone: 0.375rem | **open: Q8** | Prototype: buttons, inputs, nav. nova puts those on `rounded-lg` (T8).                                                                  |
| `radius-lg` `8px`     | `radius-lg` 12px  | same      | --radius-lg = --radius; Tailwind alone: 0.5rem         | **open: Q8** | Prototype: cards, tables. nova's cards are `rounded-xl` (T8).                                                                           |
| `radius-xl` `12px`    | `radius-xl` 16px  | same      | --radius-xl = --radius x 1.4; Tailwind alone: 0.75rem  | **open: Q8** | Prototype: dialogs.                                                                                                                     |
| `radius-pill` `999px` | none              | same      | `rounded-full`                                         | **drop**     | `cn` does not know `rounded-pill` and keeps both classes [M]. nova's badge uses `rounded-4xl`, a pill at its height under every option. |

### Control heights (3)

| Aurum, value        | App, light / dark | Prototype | shadcn or Tailwind, default | Proposal                            | Evidence                                             |
| ------------------- | ----------------- | --------- | --------------------------- | ----------------------------------- | ---------------------------------------------------- |
| `control-sm` `32px` | none              | same      | `h-8`                       | **Tailwind scale already gives it** | 32 px. It is nova's **default**, not its small (Q9). |
| `control-md` `40px` | none              | same      | `h-10`                      | **Tailwind scale already gives it** | 40 px. nova has no such button or input size.        |
| `control-lg` `48px` | none              | same      | `h-12`                      | **Tailwind scale already gives it** | 48 px.                                               |

### Layout (3)

| Aurum, value               | App, light / dark | Prototype | shadcn or Tailwind, default          | Proposal                            | Evidence                                                                                                                              |
| -------------------------- | ----------------- | --------- | ------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `navigation-width` `248px` | none              | same      | --sidebar-width, default 16rem       | **shadcn name fits**                | `15.5rem` through `SidebarProvider`'s `style`, which is spread after the defaults [M]. The prototype already called it sidebar-width. |
| `content-max` `1360px`     | none              | `1200px`  | `max-w-7xl` is 1280 px; none at 1360 | **new name in shadcn's pattern**    | `--container-content: 85rem`, `max-w-content`.`cn` needs it in `theme.container` [M]. Raised from 1200 on purpose in 0073.            |
| `breakpoint-md` `768px`    | none              | same      | `md:` = 48rem                        | **Tailwind scale already gives it** | nova's `useIsMobile` also uses 768 [M]. The prototype's CSS breaks at 720 [M].                                                        |

### Font (2)

| Aurum, value                                                                          | App, light / dark                                                            | Prototype                                               | shadcn or Tailwind, default | Proposal             | Evidence                                                                                                      |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `font-sans` `"Geist Variable", Geist, "Helvetica Neue", Arial, system-ui, sans-serif` | `font-sans` "Instrument Sans Variable", ui-sans-serif, system-ui, sans-serif | `Geist, "Helvetica Neue", Arial, system-ui, sans-serif` | --font-sans                 | **shadcn name fits** | `registry:font` `font-geist` names the same Fontsource package and family [V]. App uses Instrument Sans. Q11. |
| `font-mono` `"Geist Mono Variable", "Geist Mono", ui-monospace, Menlo, monospace`     | none                                                                         | `"Geist Mono", ui-monospace, Menlo, monospace`          | --font-mono                 | **shadcn name fits** | `font-geist-mono` likewise [V]. The app defines none [V].                                                     |
## 4. shadcn semantics: what the components really do

### 4.1 How `aria-nova` uses each variable

Counted over the 61 `registry:ui` files, by a regex on class names [M]. A count is occurrences of a class form, including variants like `hover:`. `form` has no file in this registry.

| Variable                            | Uses   | What it really paints                                                                                                                                            |
| ----------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background`                        | 22     | Page, but also the outline button, selected tab, switch thumb, sidebar input, calendar, chart tooltip. Also `text-background` in the tooltip                     |
| `foreground`                        | 69     | Text; `bg-foreground` for the tooltip; **`ring-foreground/10` as the edge of cards, dialogs and menus**, 10 uses                                                 |
| `card`, `card-foreground`           | 5, 3   | Only card, alert, attachment and bubble                                                                                                                          |
| `popover`, `popover-foreground`     | 13, 13 | All floating things, **and dialogs**                                                                                                                             |
| `primary`, `primary-foreground`     | 51, 18 | Filled button and badge, checked controls, progress, links, also `bg-primary/5` and `border-primary/30` on a chosen field                                        |
| `secondary`, `secondary-foreground` | 5, 4   | **Only** the secondary Button and Badge, and the bubble                                                                                                          |
| `muted`                             | 61     | **Hover of ghost and outline buttons and toggles**, tracks, tab list, skeleton, avatar fallback, table hover and selected rows, card and dialog footers at `/50` |
| `muted-foreground`                  | 69     | Descriptions, placeholders, helper text; 51 plain `text-muted-foreground`                                                                                        |
| `accent`, `accent-foreground`       | 14, 24 | **Only the focused or open row** in `dropdown-menu`, `context-menu`, `select` and `combobox`                                                                     |
| `destructive`                       | 117    | Invalid edge and ring, 70 of the 117; text; **tint at `/10` and `/20` with the same red as text**. There is no `destructive-foreground`                          |
| `border`                            | 22     | Separators as `bg-border`, few real borders, plus the base rule `* { @apply border-border }`                                                                     |
| `input`                             | 55     | Field edge, **switch's off track**, **disabled field fill at `/50`**, button group divider, dark mode fills                                                      |
| `ring`                              | 61     | Solid `border-ring` and halo `ring-ring/50` together, plus the base rule `outline-ring/50`                                                                       |
| `sidebar`, `sidebar-foreground`     | 5, 9   | Rail, in `sidebar.tsx` only                                                                                                                                      |
| `sidebar-accent`, `-foreground`     | 15, 21 | **Hover and current item alike**                                                                                                                                 |
| `sidebar-border`, `sidebar-ring`    | 4, 6   | Rail edge, and focus without opacity                                                                                                                             |
| `sidebar-primary`, `-foreground`    | **0**  | Not read by `sidebar.tsx`. Used in blocks, as the logo square: `bg-sidebar-primary text-sidebar-primary-foreground` in `sidebar-01`, `-03`, `-07`                |
| `chart-1` to `chart-5`              | **0**  | `chart.tsx` never reads them; the caller passes `var(--chart-1)`                                                                                                 |

**Disagreements inside shadcn's own sources.** The docs call `accent` the colour of "hover, focus, and active states", and aria-nova's buttons do not use it [V, M]. The docs' default charts are coloured, while `colors/neutral.json` gives a grey ramp [V; the docs reading came through a page summariser, the JSON directly].

### 4.2 Where the Aurum colours go

| Aurum colour           | Goes to                                                            | Must not go to, and why                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Warm paper**, canvas | `--background`                                                     | Not `--card`.`bg-card` is cards only. T1                                                                                                                                                                        |
| **White**, surface     | `--card`, `--popover`                                              |                                                                                                                                                                                                                 |
| **Graphite**, primary  | `--primary`, and `--ring`, `--chart-1` by their own values         | Not `--foreground`, though close: dE 3.26. Ink stays apart as in the prototype [M]                                                                                                                              |
| **Gold**               | `--gold`, `--gold-foreground`, and `--sidebar-primary` on the rail | Not `--accent`, `--primary` or `--ring`. T2                                                                                                                                                                     |
| **Income**             | `--income` + `--income-soft`, new                                  | Not `--primary` or a `success` in shadcn: none exists [V]                                                                                                                                                       |
| **Expense**            | `--expense` + `--expense-soft`, new                                | **Not the same token as `--destructive`.** `destructive` also paints every invalid field and destructive menu row, and a spending amount is not an error. They may share a value, but Q5 recommends they do not |
| **Categories**         | `--category-N` + `--category-N-soft`, new                          | Not `--chart-N`. Guidelines keep series and categories apart [V]                                                                                                                                                |
| **Inverse rail**       | `--sidebar-*`, plus the surface rule of 4.4                        | Not `.dark` alone for now: see section 8                                                                                                                                                                        |

### 4.3 Traps

- **T1. `bg-background` is not only the page.** With `--background` as paper, these paint cream where the prototype is white: the outline button on a white card, the selected tab, the switch thumb [M: list above]. The difference is small: paper against white is 1.05:1, dE 1.84 [M]. Three class edits to `bg-card` remove it. The other way, `--background: white` plus a new `--canvas`, needs no edit there, but gives `background` a meaning shadcn does not give it. Q1.
- **T2. Gold in `accent` turns every focused menu row gold** [M, usage above]. Gold in `ring` makes `border-ring` 1.75:1 on white, failing 3:1 [M]. Gold in `primary` makes every default Button and checked control gold. Also a clash of words: Aurum's Button `variant="accent"` is gold, and shadcn's `accent` is a menu highlight [V]. The new variant should be called `gold`.
- **T3. A hover on `muted` is one step stronger than the prototype's.** Ghost and outline buttons use `hover:bg-muted` [V]. With `--muted` as sunken, that paints #eeede8 where the prototype paints #f3f2ee: dE 1.54 [M]. Near the limit of showing. Table rows use `muted/50`, which is dE 1.22 from it, so they are fine [M]. Two class edits to `hover:bg-accent` would make buttons exact.
- **T4. `ring` is two things.** `border-ring` is solid, `ring-ring/50` is a 3 px halo, always the same colour [V]. So a gold halo around a graphite edge, the prototype's field focus, cannot be expressed by the variable. Also, the prototype's button focus is a 2 px outline with a 2 px offset; nova has no offset. On a graphite button the edge merges with the fill, and the halo does the work at 4.46:1 against the fill and 2.90:1 against the page [M].
- **T5. The rail has one fill for hover and current.** Aurum has two, 6% and 10%. `hover:bg-sidebar-accent/60` gives 6% exactly [M], at the price of edits in `sidebar.tsx`. Current item text is `sidebar-accent-foreground`, and its icon inherits that: the gold icon needs a class of ours. Its contrast passes: 5.00 at worst [M].
- **T6. Aurum's secondary is nova's `outline`, not nova's `secondary`.** The prototype's `.bs-btn--secondary` is white with `control-border` and `shadow-xs`. nova's `outline` is `border-border bg-background`, so its edge is `line`, lighter than the prototype's, with no shadow [V]. Nova's `secondary` is a filled grey the prototype's Button does not have. Fields have no `shadow-xs` and no hover edge either [M]. The prototype's checkbox rests on `control-border-hover`, nova's on `border-input`: 2.40 against 1.54 on white [M]. The prototype's danger Button is white with a red edge; nova's is a soft red fill [V].
- **T7. `destructive` is both text and tint.** The same red on its own 10% and 20% is the design. So its value must pass on itself, and Aurum's does not always (section 5). Q5.
- **T8. Radius roles sit one step up in nova.** See section 7.2.
- **T9. `--sidebar-*` reaches only the sidebar's pieces.** A Button, Input, Badge or Separator of ours inside the rail reads the global `--primary`, `--muted`, `--input`, `--ring` [V]. Unremapped, the light `--ring` on the rail is 1.07:1 and `muted-foreground` 1.54 [M]. Aurum's decision 0087 solved this with a rule. It still works under the new names (4.4). `sidebar.tsx`'s own input also uses `bg-background` [V].
- **T10. `input` carries three jobs.** Field edge, switch track, disabled fill [M]. All sources fail 3:1 on the edge: Aurum 1.54, app 1.46, neutral 1.26 [M]. Darkening `--input` to pass would also darken switches and disabled fields. When item 7.16 decides this, it needs separate values or a class edit [R].
- **T11. `disabled:opacity-50` is everywhere** and the guidelines say "no opacity tricks on text" [V]. Q10.
- **T12. `bg-popover` also paints dialogs,** and the card and dialog edge is `ring-foreground/10`, not `border`. So `border-border` will not reach them. Over paper this ring is dE 0.63 from `line`, over white dE 1.59 [M].
- **T13. `dark:` classes are in 24 of the 61 files,** 100 occurrences [M]. Without shadcn's variant they follow the operating system. See section 8.

### 4.4 The surface rule, under shadcn's names

Same mechanism as 0087 [R], with the values from `AurumRoot.css` [V]. Contrast is in section 5, under "Surface rule".

| Name, inside the rail                                 | Value                                                                                                                               | From Aurum's rule    |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `--background`, `--card`, `--popover`                 | `#303338`                                                                                                                           | canvas, surface      |
| `--foreground` and its pairs                          | `#f4f4f2`                                                                                                                           | ink                  |
| `--muted-foreground`                                  | `#cfd1d4`                                                                                                                           | ink-muted            |
| `--subtle-foreground`                                 | `#b6b9bd`                                                                                                                           | ink-subtle           |
| `--muted`, `--secondary`                              | `#2b2e33`                                                                                                                           | surface-sunken       |
| `--accent`                                            | white at .06                                                                                                                        | surface-hover        |
| `--border`                                            | white at .10                                                                                                                        | line                 |
| `--input`                                             | `#b6b9bd`                                                                                                                           | control-border       |
| `--primary`, `--ring`                                 | `#f4f4f2`                                                                                                                           | primary, focus-ring  |
| `--primary-foreground`                                | `#303338`                                                                                                                           | on-primary           |
| `--destructive`, `--income`, `--expense`, `--warning` | **none yet.** Light values give 1.74 to 2.33. The app's dark values give 5.99 (red), 6.67 (green), 7.37 (amber) on the mid stop [M] | 0087 left these open |

Note that the app's dark red drops to 4.37 on the current item's fill [M]. That only matters if a red label sits on the current item.

## 5. Contrast

Computed by WCAG's formula on the painted colours, under the recommended values [M]. Text is held to 4.5:1 everywhere, as decision 0080 does, even where large text could take 3:1. Non-text to 3:1. Lines marked "Prototype", "App" and "Aurum red" are comparisons, not part of the proposal.

**What fails under the proposal, and what to do.**

- **Fix it:** `text-foreground/60` on the inactive tab. One class: `text-muted-foreground`, 7.03, the prototype's own colour.
- **Fix it with a value:** the red on nova's tints, by Q5.
- **Inherited, and excused by 0080 until its items:** `input` edge and track, `chart-2`, `-3`, `-5`.
- **Already decided or exempt:** disabled states are exempt from 1.4.3. `gold` is not for text.
- **On the rail:** finance colours need values before they appear there.
- **Only if adopted:** `muted-foreground/70`, in `trace.tsx`, a piece we have no need for.

The prototype itself has two below the line: its placeholder at 3.85, and its section label on the gradient's bottom stop, just under 4.5. Under the proposal both go away.

#### Below the minimum (39)

| Pair                                                   | Minimum    | Painted            | Ratio | Note                                                                                                                                                                                                                                     |
| ------------------------------------------------------ | ---------- | ------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `muted-foreground/70` on `card`                        | text 4.5   | #818488 on #ffffff | 3.76  | Trace timing.                                                                                                                                                                                                                            |
| Prototype placeholder: ink-subtle at .8 on `card`      | text 4.5   | #7f8288 on #ffffff | 3.85  | The prototype's own `.bs-input input::placeholder`.                                                                                                                                                                                      |
| `text-foreground/60` on `muted`                        | text 4.5   | #747677 on #eeede8 | 3.91  | nova's inactive tab, with our `muted`. Painted colour #747677 confirmed in a browser. The earlier trial's axe gave 4.08; I cannot explain the gap, and both fail. Fix: `text-muted-foreground`, which is also what the prototype paints. |
| Disabled primary button, `opacity-50`, on `background` | text 4.5   | #fcfcfa on #929494 | 2.98  | Exempt by 1.4.3.                                                                                                                                                                                                                         |
| Disabled text, `opacity-50`, on `card`                 | text 4.5   | #919295 on #ffffff | 3.10  | Exempt by 1.4.3.                                                                                                                                                                                                                         |
| Prototype disabled: ink-disabled on sunken             | text 4.5   | #abadb0 on #eeede8 | 1.92  | Exempt by 1.4.3.                                                                                                                                                                                                                         |
| Aurum red on `destructive/10` over `muted`             | text 4.5   | #c4281c on #ead9d4 | 4.20  |                                                                                                                                                                                                                                          |
| Aurum red on `destructive/20` over `card`              | text 4.5   | #c4281c on #f3d4d2 | 4.13  | Its hover.                                                                                                                                                                                                                               |
| Aurum red on `destructive/20` over `background`        | text 4.5   | #c4281c on #efcfca | 3.95  |                                                                                                                                                                                                                                          |
| Aurum red on `destructive/20` over `muted`             | text 4.5   | #c4281c on #e6c6bf | 3.58  |                                                                                                                                                                                                                                          |
| Aurum red at /90 on `destructive/10` over `card`       | text 4.5   | #c93b30 on #f9eae8 | 4.30  | Alert description.                                                                                                                                                                                                                       |
| App red on `destructive/20` over `background`          | text 4.5   | #b42318 on #ecceca | 4.47  | 0.03 short.                                                                                                                                                                                                                              |
| App red on `destructive/20` over `muted`               | text 4.5   | #b42318 on #e2c5be | 4.05  |                                                                                                                                                                                                                                          |
| `income` on `income/10` over `background`              | text 4.5   | #0f7a3d on #e2ece4 | 4.49  | Why the soft tokens stay.                                                                                                                                                                                                                |
| `income` on `income/10` over `muted`                   | text 4.5   | #0f7a3d on #d8e2d7 | 4.06  |                                                                                                                                                                                                                                          |
| `expense` on `expense/10` over `muted`                 | text 4.5   | #c4281c on #ead9d4 | 4.20  |                                                                                                                                                                                                                                          |
| `gold` as text on `card`                               | text 4.5   | #f0bd2a on #ffffff | 1.75  | Never as text; the guidelines already say so.                                                                                                                                                                                            |
| Prototype section label, white .55 on bottom stop      | text 4.5   | #9e9fa1 on #34373d | 4.50  | Rounds to 4.50 but is below it.                                                                                                                                                                                                          |
| `income`, light value, on `sidebar` mid                | text 4.5   | #0f7a3d on #303338 | 2.34  | No value for the surface yet, as 0087 says.                                                                                                                                                                                              |
| `expense`, light value, on `sidebar` mid               | text 4.5   | #c4281c on #303338 | 2.21  | No value for the surface yet, as 0087 says.                                                                                                                                                                                              |
| `warning`, light value, on `sidebar` mid               | text 4.5   | #8f5200 on #303338 | 2.04  | No value for the surface yet, as 0087 says.                                                                                                                                                                                              |
| `invest`, light value, on `sidebar` mid                | text 4.5   | #6b4c70 on #303338 | 1.75  | No value for the surface yet, as 0087 says.                                                                                                                                                                                              |
| App's dark red on the current fill, mid                | text 4.5   | #f59a92 on #45474c | 4.38  |                                                                                                                                                                                                                                          |
| `ring-ring/50` on `background`                         | non-text 3 | #929494 on #faf9f6 | 2.90  | The halo; the solid edge above carries the state.                                                                                                                                                                                        |
| `ring-ring/50` on `card`                               | non-text 3 | #959699 on #ffffff | 2.94  |                                                                                                                                                                                                                                          |
| Prototype gold halo on `card`                          | non-text 3 | #fae8b4 on #ffffff | 1.22  | Weaker than the proposal.                                                                                                                                                                                                                |
| App`ring/50` on white                                  | non-text 3 | #8eb0dc on #ffffff | 2.23  | Weaker than the proposal.                                                                                                                                                                                                                |
| `input` edge on `card`                                 | non-text 3 | #d3d0c8 on #ffffff | 1.54  | Excused by 0080 until 7.16.                                                                                                                                                                                                              |
| `input` edge on `background`                           | non-text 3 | #d3d0c8 on #faf9f6 | 1.46  |                                                                                                                                                                                                                                          |
| `input-hover` edge on `card`                           | non-text 3 | #aba79f on #ffffff | 2.40  |                                                                                                                                                                                                                                          |
| Switch off: `bg-input` on `card`                       | non-text 3 | #d3d0c8 on #ffffff | 1.54  | The track itself has to show the control.                                                                                                                                                                                                |
| Switch off, prototype switch-off on `card`             | non-text 3 | #c9c6be on #ffffff | 1.71  |                                                                                                                                                                                                                                          |
| Switch thumb `bg-background` on `input`                | non-text 3 | #faf9f6 on #d3d0c8 | 1.46  |                                                                                                                                                                                                                                          |
| Checkbox rest: `border-input` on `card`                | non-text 3 | #d3d0c8 on #ffffff | 1.54  | Prototype's checkbox rests on control-border-hover: 2.40.                                                                                                                                                                                |
| `gold` on `card`, as icon or edge                      | non-text 3 | #f0bd2a on #ffffff | 1.75  | Prototype's outline highlighted tile; its icon uses gold-ink.                                                                                                                                                                            |
| Light `--ring` on `sidebar`, not remapped              | non-text 3 | #2b2e33 on #303338 | 1.07  | Why the surface rule is needed (T9).                                                                                                                                                                                                     |
| `chart-2` on `card`                                    | non-text 3 | #e2b02a on #ffffff | 2.00  | Excused by 0080 until the first chart.                                                                                                                                                                                                   |
| `chart-3` on `card`                                    | non-text 3 | #9f9f9e on #ffffff | 2.65  | Excused by 0080 until the first chart.                                                                                                                                                                                                   |
| `chart-5` on `card`                                    | non-text 3 | #cfcabf on #ffffff | 1.63  | Excused by 0080 until the first chart.                                                                                                                                                                                                   |

#### At or above the minimum (87)

| Pair                                                         | Minimum    | Painted            | Ratio | Note                                         |
| ------------------------------------------------------------ | ---------- | ------------------ | ----- | -------------------------------------------- |
| `foreground` on `background`                                 | text 4.5   | #23262b on #faf9f6 | 14.42 |                                              |
| `foreground` on `card`                                       | text 4.5   | #23262b on #ffffff | 15.18 |                                              |
| `foreground` on `muted`                                      | text 4.5   | #23262b on #eeede8 | 12.95 |                                              |
| `foreground` on `accent`                                     | text 4.5   | #23262b on #f3f2ee | 13.55 |                                              |
| `muted-foreground` (ink-muted) on `background`               | text 4.5   | #4b4f55 on #faf9f6 | 7.83  |                                              |
| `muted-foreground` on `card`                                 | text 4.5   | #4b4f55 on #ffffff | 8.24  |                                              |
| `muted-foreground` on `muted`                                | text 4.5   | #4b4f55 on #eeede8 | 7.03  | Tab list, tiles.                             |
| `muted-foreground` on `muted/50` over `card`                 | text 4.5   | #4b4f55 on #f6f6f4 | 7.62  | Card and dialog footer, table hover.         |
| `subtle-foreground` (ink-subtle) on `background`             | text 4.5   | #5f636a on #faf9f6 | 5.73  |                                              |
| `subtle-foreground` on `card`                                | text 4.5   | #5f636a on #ffffff | 6.04  |                                              |
| `subtle-foreground` on `muted`                               | text 4.5   | #5f636a on #eeede8 | 5.15  |                                              |
| `text-foreground/80` on `background`                         | text 4.5   | #4e5054 on #faf9f6 | 7.66  | If ink-muted were replaced by opacity.       |
| `primary-foreground` on `primary`                            | text 4.5   | #ffffff on #2b2e33 | 13.62 |                                              |
| `primary-foreground` on `primary/80` over `card`             | text 4.5   | #ffffff on #55585c | 7.16  | nova's hover.                                |
| `primary-foreground` on `primary/90` over `card`             | text 4.5   | #ffffff on #404347 | 9.94  | Proposed hover.                              |
| `primary` link on `card`                                     | text 4.5   | #2b2e33 on #ffffff | 13.62 |                                              |
| `background` on `foreground`                                 | text 4.5   | #faf9f6 on #23262b | 14.42 | Tooltip.                                     |
| Aurum red `text-destructive` on `card`                       | text 4.5   | #c4281c on #ffffff | 5.73  |                                              |
| Aurum red on `muted`                                         | text 4.5   | #c4281c on #eeede8 | 4.88  |                                              |
| Aurum red on `destructive/10` over `card`                    | text 4.5   | #c4281c on #f9eae8 | 4.88  | nova's destructive button and badge at rest. |
| Aurum red on `destructive/10` over `background`              | text 4.5   | #c4281c on #f5e4e0 | 4.65  |                                              |
| App red `text-destructive` on `card`                         | text 4.5   | #b42318 on #ffffff | 6.57  |                                              |
| App red on `muted`                                           | text 4.5   | #b42318 on #eeede8 | 5.61  |                                              |
| App red on `destructive/10` over `card`                      | text 4.5   | #b42318 on #f8e9e8 | 5.57  |                                              |
| App red on `destructive/10` over `background`                | text 4.5   | #b42318 on #f3e4e0 | 5.30  |                                              |
| App red on `destructive/10` over `muted`                     | text 4.5   | #b42318 on #e8d9d3 | 4.79  |                                              |
| App red on `destructive/20` over `card`                      | text 4.5   | #b42318 on #f0d3d1 | 4.68  |                                              |
| App red at /90 on `destructive/10` over `card`               | text 4.5   | #bb372d on #f8e9e8 | 4.83  |                                              |
| `income` on `background`                                     | text 4.5   | #0f7a3d on #faf9f6 | 5.15  |                                              |
| `income` on `card`                                           | text 4.5   | #0f7a3d on #ffffff | 5.42  |                                              |
| `income` on `muted`                                          | text 4.5   | #0f7a3d on #eeede8 | 4.63  |                                              |
| `income` on `income-soft`                                    | text 4.5   | #0f7a3d on #e3f2e8 | 4.68  |                                              |
| `expense` on `background`                                    | text 4.5   | #c4281c on #faf9f6 | 5.44  |                                              |
| `expense` on `card`                                          | text 4.5   | #c4281c on #ffffff | 5.73  |                                              |
| `expense` on `muted`                                         | text 4.5   | #c4281c on #eeede8 | 4.88  |                                              |
| `expense` on `expense-soft`                                  | text 4.5   | #c4281c on #fbe6e2 | 4.78  |                                              |
| `invest` on `background`                                     | text 4.5   | #6b4c70 on #faf9f6 | 6.89  |                                              |
| `invest` on `card`                                           | text 4.5   | #6b4c70 on #ffffff | 7.26  |                                              |
| `invest` on `muted`                                          | text 4.5   | #6b4c70 on #eeede8 | 6.19  |                                              |
| `invest` on `invest-soft`                                    | text 4.5   | #6b4c70 on #efe5ef | 5.92  |                                              |
| `warning` on `background`                                    | text 4.5   | #8f5200 on #faf9f6 | 5.91  |                                              |
| `warning` on `card`                                          | text 4.5   | #8f5200 on #ffffff | 6.22  |                                              |
| `warning` on `muted`                                         | text 4.5   | #8f5200 on #eeede8 | 5.31  |                                              |
| `warning` on `warning-soft`                                  | text 4.5   | #8f5200 on #f7ead2 | 5.23  |                                              |
| `gold-foreground` on `gold`                                  | text 4.5   | #23262b on #f0bd2a | 8.69  |                                              |
| `gold-foreground` on `gold-hover`                            | text 4.5   | #23262b on #e4af17 | 7.55  |                                              |
| `gold-ink` on `background`                                   | text 4.5   | #8a6400 on #faf9f6 | 5.11  |                                              |
| `gold-ink` on `muted`                                        | text 4.5   | #8a6400 on #eeede8 | 4.59  |                                              |
| `gold-ink` on `gold-soft`                                    | text 4.5   | #8a6400 on #fbf1d0 | 4.76  |                                              |
| `category-1` on `category-1-soft`                            | text 4.5   | #8a6400 on #fbf1d0 | 4.76  |                                              |
| `category-2` on `category-2-soft`                            | text 4.5   | #1f6b66 on #dcefec | 5.25  |                                              |
| `category-3` on `category-3-soft`                            | text 4.5   | #8a5a2b on #f4e8dc | 4.87  |                                              |
| `category-4` on `category-4-soft`                            | text 4.5   | #6b4c70 on #efe5ef | 5.92  |                                              |
| `category-5` on `category-5-soft`                            | text 4.5   | #3f5f7a on #e3ebf2 | 5.57  |                                              |
| `category-6` on `category-6-soft`                            | text 4.5   | #4f6b3a on #e8efe0 | 5.11  |                                              |
| `category-7` on `category-7-soft`                            | text 4.5   | #9b3f5c on #f7e3ea | 5.26  |                                              |
| `category-8` on `category-8-soft`                            | text 4.5   | #4b4f55 on #eeede8 | 7.03  |                                              |
| `sidebar-foreground` on `sidebar`, top stop                  | text 4.5   | #cfd1d4 on #2b2e33 | 8.90  |                                              |
| `sidebar-foreground/70` on `sidebar`, top stop               | text 4.5   | #9ea0a4 on #2b2e33 | 5.20  | Group label.                                 |
| `sidebar-accent-foreground` on `sidebar-accent`, top stop    | text 4.5   | #f4f4f2 on #404347 | 9.03  | Current item.                                |
| `sidebar-foreground` on hover fill, top stop                 | text 4.5   | #cfd1d4 on #383b3f | 7.40  |                                              |
| `sidebar-foreground` on `sidebar`, mid                       | text 4.5   | #cfd1d4 on #303338 | 8.29  |                                              |
| `sidebar-foreground/70` on `sidebar`, mid                    | text 4.5   | #9fa2a5 on #303338 | 4.93  | Group label.                                 |
| `sidebar-accent-foreground` on `sidebar-accent`, mid         | text 4.5   | #f4f4f2 on #45474c | 8.41  | Current item.                                |
| `sidebar-foreground` on hover fill, mid                      | text 4.5   | #cfd1d4 on #3c3f44 | 6.88  |                                              |
| `sidebar-foreground` on `sidebar`, bottom stop               | text 4.5   | #cfd1d4 on #34373d | 7.80  |                                              |
| `sidebar-foreground/70` on `sidebar`, bottom stop            | text 4.5   | #a0a3a7 on #34373d | 4.71  | Group label.                                 |
| `sidebar-accent-foreground` on `sidebar-accent`, bottom stop | text 4.5   | #f4f4f2 on #484b50 | 7.94  | Current item.                                |
| `sidebar-foreground` on hover fill, bottom stop              | text 4.5   | #cfd1d4 on #404349 | 6.48  |                                              |
| `gold-foreground` on `sidebar-primary`                       | text 4.5   | #23262b on #f0bd2a | 8.69  | Brand mark.                                  |
| Surface rule: `muted-foreground` on `muted`                  | text 4.5   | #cfd1d4 on #2b2e33 | 8.90  |                                              |
| Surface rule: `text-foreground/60` on `muted`                | text 4.5   | #a4a5a6 on #2b2e33 | 5.51  | Passes here, fails on the light ground.      |
| Surface rule: `subtle-foreground` on `background`            | text 4.5   | #b6b9bd on #303338 | 6.44  |                                              |
| Surface rule: `primary-foreground` on `primary`              | text 4.5   | #303338 on #f4f4f2 | 11.51 |                                              |
| App's dark red #f59a92 on `sidebar` mid                      | text 4.5   | #f59a92 on #303338 | 5.99  | Candidate for the surface.                   |
| App's dark green #6fcf97 on `sidebar` mid                    | text 4.5   | #6fcf97 on #303338 | 6.67  | Candidate.                                   |
| App's dark amber #f2bd5c on `sidebar` mid                    | text 4.5   | #f2bd5c on #303338 | 7.37  | Candidate.                                   |
| `border-ring` on `background`                                | non-text 3 | #2b2e33 on #faf9f6 | 12.94 |                                              |
| `gold` icon on `sidebar`, top                                | non-text 3 | #f0bd2a on #2b2e33 | 7.80  |                                              |
| `gold` icon on `sidebar`, bottom                             | non-text 3 | #f0bd2a on #34373d | 6.83  |                                              |
| `gold` icon on current fill, bottom                          | non-text 3 | #f0bd2a on #484b50 | 5.00  | Worst case.                                  |
| `sidebar-ring` on `sidebar`, bottom                          | non-text 3 | #f4f4f2 on #34373d | 10.84 |                                              |
| Surface rule: `input` edge on `background`                   | non-text 3 | #b6b9bd on #303338 | 6.44  |                                              |
| Surface rule: `ring-ring/50` on `background`                 | non-text 3 | #929495 on #303338 | 4.14  |                                              |
| `chart-1` on `card`                                          | non-text 3 | #2b2e33 on #ffffff | 13.62 |                                              |
| `chart-4` on `card`                                          | non-text 3 | #2f8077 on #ffffff | 4.69  |                                              |
| `chart-6` on `card`                                          | non-text 3 | #8c6e8f on #ffffff | 4.43  |                                              |

## 6. Text styles

### 6.1 How each side does it

- **Tailwind 4** [V theme.css; M compile]. `--text-NAME` with `--text-NAME--line-height`, `--letter-spacing` and `--font-weight`. It compiles to `line-height: var(--tw-leading, …)`, and likewise for tracking and weight, so `leading-*`, `tracking-*` and `font-*` still win. **`--text-NAME--font-variant-numeric`, `--text-transform` and `--font-family` are ignored** [M]. So tabular figures, uppercase and mono need a class or `@utility`. `text-NAME/7` keeps size and line only, and loses weight and tracking [M].
- **`@utility`** works for a text style, both as a hand-written block and as `@apply text-overline uppercase` [M].
- **shadcn.** No type tokens beyond `--font-sans`, `--font-mono`, `--font-heading`. Components write `text-sm` (87 uses), `text-xs` (31), `text-base` (10), `font-medium` (43) [M]. Also two off-scale sizes: `text-[0.8rem]`, 12.8 px, on the small Button, and `text-[0.625rem]`.
- **`cn-font-heading`** is a marker in the registry files, 7 uses [M]. The CLI removes it when no heading font is set: the trial's installed files have none [M].
- **The app (0171)** [V]. Six names in `@theme inline`, size only, in px: overline, caption, label, body, heading, title. `cn` is taught them. Uses in the app today [M]: `text-label` 71, `text-xs` 71, `text-caption` 14, `text-overline` 10, `text-sm` 10, `text-heading` 7, `text-title` 1, `text-body` 0.
- **Aurum** [V]. 12 classes in `au.base` (0088), px, with weight and tracking, read through `.au-text-*`. Components use only body, label, overline and body-strong so far [M].

### 6.2 The 12 styles

The prototype's values are the same as Aurum's [M: `tokens.json` diff, only `tabular` and `textTransform` were added]. The prototype's CSS writes them by hand, with some other sizes: 9, 10, 16, 17, 19 and 28 px [M].

| Aurum style                               | App (0171)                | Nearest Tailwind                                           | Proposal                                                                                                       |
| ----------------------------------------- | ------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `amount-xl` 36/40, 600, -0.025em, tabular | none                      | `text-4xl` 36/40; `tracking-tight` -0.025em                | **Tailwind gives it, all five values exact:** `text-4xl font-semibold tracking-tight tabular-nums`             |
| `display` 32/40, 600, -0.02em             | none                      | `text-3xl` 30/36                                           | **New:** `--text-display`                                                                                      |
| `amount-lg` 22/28, 600, -0.01em, tabular  | none                      | `text-xl` 20/28, `text-2xl` 24/32                          | **New:** `--text-amount-lg`, with `tabular-nums`                                                               |
| `title-lg` 24/32, 600, -0.015em           | none                      | `text-2xl` 24/32; `tracking-tight` -0.025em                | **Tailwind gives it,** with tracking 0.24 px per letter tighter: `text-2xl font-semibold tracking-tight`       |
| `title` 18/24, 600                        | `text-title` 18px         | `text-lg` 18/**28**                                        | **New, the app's name:** `--text-title`. Line differs by 4 px, so Tailwind's will not do                       |
| `heading` 15/22, 600                      | `text-heading` 15px       | none; nova's titles are `text-base font-medium`, 16/24 500 | **New, the app's name:** `--text-heading`. Card and dialog titles need a class edit to match the prototype     |
| `body` 14/20, 400                         | `text-body` 14px, no uses | `text-sm` 14/20                                            | **Tailwind gives it, exact.** Drop the app's unused `--text-body`                                              |
| `body-strong` 14/20, 500                  | none                      | `text-sm font-medium`                                      | **Tailwind gives it, exact**                                                                                   |
| `label` 13/18, 500                        | `text-label` 13px         | none; nova's small Button is 12.8 px                       | **New, the app's name:** `--text-label`                                                                        |
| `caption` 12/16, 400                      | `text-caption` 12px       | `text-xs` 12/16                                            | **Tailwind gives it, exact.** 14 uses in the app to rename                                                     |
| `overline` 11/16, 500, +0.08em, uppercase | `text-overline` 11px      | none; `tracking-widest` is 0.1em                           | **New, the app's name:** `--text-overline`, plus `uppercase`, by an `@utility` if it must travel with the name |
| `code` 13/20, 400, mono                   | none                      | none                                                       | **New:** `--text-code`, with `font-mono`                                                                       |

**So:** 5 by Tailwind's classes and 7 new `--text-*` names. Tabular figures, uppercase and mono stay classes beside them. Q12.

**A trap in reusing the app's names** [M; R]. The app's `text-overline` and `text-label` are size only today, and v1 uses them that way, including in its Button. Adding line height, weight and tracking under the same name changes v1 where no `font-*` or `leading-*` class is set. Decision 0171 foresaw the line heights [V], not necessarily tracking.

### 6.3 The 14 px body

- `text-sm` is 14/20, the same as `body` [V]. Do **not** shrink the root to 87.5%: every `rem` of Tailwind's scale would shrink with it [R].
- shadcn's base sets colour only, not size: `body { @apply bg-background text-foreground }` [V `style.json`]. Add `text-sm`, and `antialiased`, which Aurum has and shadcn lacks. Decision 0089 is the same idea on `body`.
- **`Input` and `Textarea` are `text-base md:text-sm`** [V]: 16 px below 768, 14 above. The reason is probably to stop iOS zooming on focus [R, not verified]. Worth keeping; it differs from the prototype only on small screens.
- **Use `rem` for the new sizes.** Tailwind's are `rem` and Aurum's are `px`. In `px`, a person's browser text size scales `text-sm` and not `text-label` [R]. Decision 0076 deferred this, and the move resolves it for free.

### 6.4 What `cn` needs

Tested with `cn` 0.5.2 from the trial [M]. The app has 0.5.0 [V].

| Call                                      | Default `cn`                      | With configuration                                    |
| ----------------------------------------- | --------------------------------- | ----------------------------------------------------- |
| `text-muted-foreground`, `text-label`     | **`text-label`: colour lost**     | both kept                                             |
| `text-sm`, `text-label`                   | both kept, CSS order decides      | `text-label`                                          |
| `text-muted-foreground`, `text-amount-xl` | **`text-amount-xl`: colour lost** | both kept                                             |
| `text-income`, `text-expense`             | `text-expense`, correct           | same                                                  |
| `bg-gold`, `bg-primary`                   | `bg-primary`, correct             | same                                                  |
| `max-w-7xl`, `max-w-content`              | both kept                         | `max-w-content`, with `theme.container`               |
| `shadow-sm`, `shadow-raised`              | both kept                         | `shadow-raised`                                       |
| `rounded-lg`, `rounded-pill`              | both kept                         | not configured in my test; drop the name, as proposed |
- **New colours need nothing.** New sizes do.
- **Two forms work:** the app's `extend.classGroups["font-size"]`, and `extend.theme.text`, which also covers the rest [M]. I would use `theme`.
- **`cn` takes a look-alike as a size:** `text-2xs`, `text-3xs` and `text-md` need no configuration, while `text-body`, `text-label` and `text-tiny` do [M]. A way out if we ever want no configuration, at the price of the names.
- **The trap is the import.** 58 of the 61 registry files write `import { cn } from "cn"`, and none write `@/lib/utils` [M]. The app's 15 files use `@/lib/utils`, none `"cn"` [M]; I do not know how they got that way. So on each `shadcn add`, the import has to change to Aurum's configured `cn`, and a check should hold it. Otherwise the colour is lost silently.

### 6.5 Fonts

- `--font-sans` and `--font-mono` are the right names. shadcn's `font-geist` items name `@fontsource-variable/geist` and `'Geist Variable'`, what decision 0027 chose [V]. The stack's middle fallbacks can stay.
- `.au-num` becomes `tabular-nums` [V]. Its `font-feature-settings` is redundant [R].
- The app is on Instrument Sans (0094). A shared `--font-sans` means v2 needs its own value during the migration [R]. Q11.
- `--font-heading`: not needed. The app sets it to the same as `--font-sans` [V], and I recommend leaving it out.

## 7. Spacing, sizes, radius, shadows, motion

### 7.1 Spacing and control heights

- **Spacing: all 10 steps are identical.** `--au-space-N` is `--spacing` times N: `p-5` is 20 px, as `space-5` [V].
- **Off-scale steps in nova** [M]. Of 403 non-zero padding, margin and gap classes, 138 (34%) are not on Aurum's 10 steps: `0.5`, `1.5`, `2.5`, `3.5`, `7`, `18`. Most sit inside controls.
- **The prototype breaks its scale too** [M]. In `aurum.css`, 85 spacing declarations use tokens, 19 pixel literals are on the scale, 53 are off it, mostly 2, 6 and 10 px. So the guideline's "4px base" was never fully true on screen.
- **Proposal.** Use Tailwind's scale and delete `--au-space-*`. Keep the guideline for layout: pages and sections use the 10 steps. Half steps are for inside controls. The check of decision 0053 ends, since a class is a token reference.
- **Small density edits are cheap.** `Card` uses `--card-spacing` set to `--spacing(4)`, so `--spacing(5)` gives the prototype's 20 px with one edit [V]. `Dialog` is `p-4`, against the prototype's `space-6`.
- **Control heights.** `h-8`, `h-10`, `h-12` are the three tokens exactly [V]. The issue is defaults: nova's Button is `h-8`, `lg` `h-9`, `sm` `h-7`, `xs` `h-6`, and 14 `h-8` in total [M]. `aria-vega`'s default is `h-9` [M]. The app's `aria-mira` Button is `h-7` [V]. **No shadcn style has a default of 40 px** among those I read: nova, vega, mira. I did not read the other five. The trial changed 3 size lines with `h-10`, `h-8`, `h-12` [V trial]; its icon sizes stayed nova's. Q9.
- **Size names.** Decision 0076 says `sm`, `md`, `lg`, with `md` the default; shadcn says `default`, `sm`, `lg`, `xs`. shadcn's names should win, by the line [R].

### 7.2 Radius

Tailwind's defaults equal Aurum's. shadcn replaces them: `--radius-lg` is `--radius`, with `sm` .6, `md` .8, `xl` 1.4, `2xl` 1.8 [V docs]. And nova's classes sit a step above Aurum's roles [M].

| Part                          | nova's class    | Prototype   | A: Tailwind's scale, no edits | B: the trial's remap | **C: `--radius: .375rem`**      |
| ----------------------------- | --------------- | ----------- | ----------------------------- | -------------------- | ------------------------------- |
| Button, input, select trigger | `rounded-lg`    | 6           | 8                             | 6                    | **6**                           |
| Tab list                      | `rounded-lg`    | 6           | 8                             | 6                    | **6**                           |
| Card                          | `rounded-xl`    | 8           | 12                            | 8                    | **8.4**                         |
| Dialog                        | `rounded-xl`    | 12          | 12                            | 8                    | 8.4, needs `rounded-3xl` (13.2) |
| Menu, popover                 | `rounded-lg`    | 8           | 8                             | 6                    | 6, needs `rounded-xl` (8.4)     |
| Nav item                      | `rounded-md`    | 6           | 6                             | 6                    | 4.8, needs `rounded-lg` (6)     |
| Tooltip                       | `rounded-md`    | 6 (Aurum's) | 6                             | 6                    | 4.8                             |
| Tab                           | `rounded-md`    | 3           | 6                             | 6                    | 4.8                             |
| Checkbox                      | `rounded-[4px]` | 4           | 4                             | 4                    | 4                               |
| Badge                         | `rounded-4xl`   | pill        | pill                          | pill                 | 15.6, a pill at `h-5`           |
- **C is shadcn's own mechanism.** One value, and the most visible parts land right with no edit. A few class edits fix the rest; tooltip and tab stay about 1 to 2 px off. It is also the only option that varies at run time: `.rounded-lg` compiles to `var(--radius)` [M], while the app's literal `--radius-*` cannot differ between v1 and v2 [V, R].
- **D, a fourth way:** keep Tailwind's scale, which is Aurum's, and edit the classes to the prototype's roles. Exact, but more edits on every adopted file.
- **The app's scale** is 6, 8, 12, 16, with `--radius: 0.75rem` [V]. It is larger than the prototype's, and 0171 already says a change waits for phase 4. Nothing to weigh by evidence: this is a matter of look, and the owner's line says the prototype. Q8.

### 7.3 Shadows

Same names, different values [V]. Set Aurum's four on Tailwind's names, so nova's `shadow-md` and `shadow-lg` become the prototype's without edits [R]. The app already overrides `shadow-sm` with Aurum's value [V]; `shadow-raised` stays the app's. The prototype's extra hand-written shadows, for the switch thumb and the selected segment, are not tokens today and stay classes [V].

### 7.4 Motion

No tokens in any source [M]. The guidelines say 150 ms ease for colour and toggles, 300 ms for progress [V]. Tailwind's default is 150 ms with `cubic-bezier(0.4, 0, 0.2, 1)`, not `ease` [V]. nova mostly uses that default, then `duration-100` (13) and `duration-200` (7) [M]. **Proposal: none needed.** One gap: only `trace.tsx` has `motion-reduce` [M], and the guideline asks to respect the setting. I did not check whether `tw-animate-css` does.

## 8. Dark mode

|                 | shadcn                                                                                                                | Aurum                                                                                                                  | App                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Switch          | `.dark` class on `<html>`, `@custom-variant dark (&:is(.dark *))` [V docs]                                            | None. `tokens.json` has one theme; `.au-root` sets `color-scheme: light` [V]. The nearest is the inverse surface, 0087 | `prefers-color-scheme`, no toggle (0048), v2 excluded by `:root:not([data-ui="v2"])` (0204) [V] |
| Tokens          | `.dark { … }` beside `:root` [V]                                                                                      | None                                                                                                                   | Full set, no `--radius` difference [V]                                                          |
| Choice of theme | Own `ThemeProvider`, `localStorage` key `vite-ui-theme`, "system" resolved once, no listener [V docs, via summariser] | None                                                                                                                   | Only the system                                                                                 |
| `dark:` classes | 100 in 24 files [M]                                                                                                   | None                                                                                                                   | Yes, with its own variant                                                                       |

Note: **decision 0081 is not about dark mode.** It covers text spacing and forced colours [V].

Findings:

- **Without the custom variant, `dark:` means the operating system** [M: compile]. The trial has no such line [M]. So on a dark system its `dark:` classes fire over light tokens [R]. I could not check how its screenshots were affected.
- **`&:is(.dark *)` does not match the `.dark` element itself** [M: compiled selector; R on matching]. A rail with `class="dark"` needs its own background from tokens, not a `dark:` class on that element.
- **One build has one `dark` variant.** With two definitions, the last wins [M]. So if Aurum ships classes compiled by the app's Tailwind, the app's definition rules them, and its `:where(:root:not([data-ui="v2"]) *)` keeps v2 light [R].
- **`.dark` could later replace the surface rule.** Once a dark theme exists, `class="dark"` on the rail would do the job of 4.4, and `dark:` classes would work there too [R]. Not yet: without dark values for it there is nothing to point at. Today's surface rule stays, because it needs no theme.
- **The app's dark palette as a start** [M]. Its text and state pairs pass: foreground 15.61, `muted-foreground` 7.76, destructive 8.62, pending 8.49, in-effect 8.08. Its fails: `subtle-foreground` on `muted`, 4.30. `input` 1.66 and `border` 1.31 are non-text. Its primary is blue, so it needs graphite's opposite and gold.

**Proposal.** Keep Aurum light-only, as the app's 0204 assumes. Write the file in shadcn's shape, `:root` then `@theme inline`, so a `.dark` block can be added later. Add `@custom-variant dark (&:is(.dark *))` now in Aurum's own builds. Q13.

**A larger consequence of dropping the prefix** [R; V 0025, 0185]. `--au-` is what let Aurum's tokens sit beside v1's. Decision 0185 rejected copying them under `:root[data-ui="v2"]` because the prefix made that needless. With shadcn's names, `--background`, `--primary` and the others collide with v1's during the migration, so that copy comes back. The `@theme inline` literals for radius and text cannot be scoped at all unless they point to a run-time variable [M].

## 9. Where the app's definition may be better

| Definition            | App                                                | Aurum or prototype                     | Verdict, with evidence [M]                                                                                                                                                                                                                                                                                                             |
| --------------------- | -------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Destructive red       | #b42318                                            | #c4281c                                | **App is better.** On nova's states over white and `muted` it passes where Aurum's fails: `/10` over `muted` 4.79 against 4.20; `/20` hover over card 4.68 against 4.13; alert text 4.83 against 4.30. dE 3.53, slightly darker. At `/20` even the app's misses: 4.47 over paper, 4.05 over `muted`, where Aurum's gives 3.95 and 3.58 |
| Colours on the rail   | its dark red, green, amber                         | none                                   | **App gives candidates.** 5.99 to 7.37 on the mid stop                                                                                                                                                                                                                                                                                 |
| Dark palette          | full                                               | none                                   | **App is the only source.** Structure yes, blue no                                                                                                                                                                                                                                                                                     |
| Structure of the file | `:root`, `@theme inline`, `@layer base`            | compiled from JSON                     | **App already has shadcn's shape** [V]. Start there                                                                                                                                                                                                                                                                                    |
| `shadow-sm`           | Aurum's value                                      | same                                   | Same [V]                                                                                                                                                                                                                                                                                                                               |
| `muted-foreground`    | #5b5e66                                            | ink-subtle #5f636a                     | dE 1.67, 6.49 against 6.04 on white. No reason to change; and Q2 gives it ink-muted anyway                                                                                                                                                                                                                                             |
| Green                 | #1e7a43                                            | #0f7a3d                                | dE 1.08; 5.36 against 5.42. No reason to change                                                                                                                                                                                                                                                                                        |
| Amber                 | #a15c00                                            | #8f5200                                | **Aurum is better:** 6.22 against 5.19, 5.23 against 4.79 on the tint                                                                                                                                                                                                                                                                  |
| `subtle-foreground`   | #8b8e96, 27 uses                                   | #5f636a                                | **Aurum is better:** 6.04 against **3.28 on white, a failure.** On `muted` 3.06. The app's value is below 4.5 and in use                                                                                                                                                                                                               |
| `input`               | #d5d5db, 1.46                                      | #d3d0c8, 1.54                          | Both fail; Aurum slightly better                                                                                                                                                                                                                                                                                                       |
| Focus                 | blue, `/50` 2.23                                   | graphite, `/50` 2.94                   | Aurum is better; neither halo reaches 3:1, both solid edges do                                                                                                                                                                                                                                                                         |
| Primary               | blue, 6.01                                         | graphite, 13.62                        | Both pass. A matter of look; the prototype's, by the line                                                                                                                                                                                                                                                                              |
| Text sizes            | px, size only                                      | px, full                               | Aurum has more; both should move to `rem`                                                                                                                                                                                                                                                                                              |
| State marks           | `pending-mark` 2.36, `ignored-mark` 1.48, on white | none                                   | App's two fail 3:1 as non-text. Its rows carry text too (0094), so colour is not alone [V, R]. Guidelines forbid coloured left edges except the nav's mark (0084); **the app's marks conflict with this**                                                                                                                              |
| Money colour          | "Profit and loss have no color" (0094)             | income and expense colour every amount | **Direct conflict of rule, not of value.** Expense has 187 uses in the screens [M]. By the line, the prototype's. It decides whether `--income` and `--expense` matter to v1 screens                                                                                                                                                   |

## 10. Open questions

Each is one point, with a recommendation.

1. **Is warm paper `--background`?** Recommend yes, and edit the outline button, selected tab and switch thumb to `bg-card`. The other way makes `--background` white and adds `--canvas`.
2. **Which text level takes `--muted-foreground`?** Recommend `ink-muted`, with `ink-subtle` as the app's `--subtle-foreground`. The prototype paints ink-muted in the same roles, and both pass. The earlier trial chose ink-subtle.
3. **Keep the gold focus halo on fields?** Recommend no: graphite `/50` is stronger (2.90 against 1.20), and keeping gold means editing the 31 `ring-ring/50` uses in 25 files, or a new token in each.
4. **Gold's name: `--gold` or a role name?** Recommend `--gold`. Every other shadcn name is a role, but `accent` and `primary` are taken, and this project already says gold.
5. **Which red is `--destructive`?** Recommend the app's #b42318, with `--expense` staying #c4281c. It passes on nova's tints, and an error is not spending.
6. **Soft fills: solid tokens or `bg-income/10`?** Recommend solid `-soft` tokens. `/10` follows shadcn and removes 4 tokens, and dE stays under 2.5, but income fails on paper and `muted`. Solid values hold contrast on any ground.
7. **Is the rail a gradient or flat?** Recommend flat `--sidebar`, dropping `inverse-top` and `inverse-bottom`. 0087 already removed it from Aurum, and each stop is dE about 2 from the middle. The prototype has it, so this is a call by eye.
8. **Which radius mechanism?** Recommend C: `--radius: .375rem`, with a few class edits. It is shadcn's own and varies at run time.
9. **Is the default control 40 px, as the prototype, or 32, as nova?** Recommend 40, editing size lines in each adopted file. It is the largest visual difference in the controls. The cost is per file, and a form's density changes with it.
10. **Follow `disabled:opacity-50` over the guideline?** Recommend yes, and change the guideline. Painted contrast rises from 1.92 to 2.98, and it asks for no edits.
11. **Is the font Geist or Instrument Sans?** Recommend Geist, per the prototype. The app chose Instrument Sans in 0094, before Aurum, so v2 and v1 differ until the migration ends.
12. **Text styles: all 12 as names, or Tailwind's where exact?** Recommend Tailwind's where exact: 5 by class, 7 named. nova already writes `text-sm` and `text-xs`, and two names for one value would drift. The cost is that a screen reads `text-sm` rather than `text-body`.
13. **How do v1 and v2 live together once the names lose `au-`?** Recommend Aurum ships plain `:root`, and the app wraps the values in `:root[data-ui="v2"]` for the migration, the copy 0185 had avoided. The other way is to keep a prefix for the migration's length, which would need component edits.

## 11. What I could not check

- **Unmodified `shadcn init` output.** The trial's file is edited and I did not run it. Inferred from the registry JSON and docs.
- **The other five shadcn styles** (Maia, Lyra, Luma, Rhea, Sera). Only `aria-nova` in full, with parts of `aria-vega` and the app's `aria-mira`.
- **The docs' pages themselves.** They came through a page summariser; quotes may be slightly reworded. Registry and installed files were read directly.
- **The earlier axe figure of 4.08 for the inactive tab.** I get 3.91, and the browser's painted colour agrees with mine. I cannot explain the gap; both fail.
- **Looks.** Nothing here was seen on screen as a whole. dE is a number, not a judgement of beauty. The earlier trial found that colours alone do not give the look [V `docs/direction.md`].
- **The blend of `hover:bg-[color-mix(in_oklch,…)]`** on nova's secondary Button. One reading on a canvas gave a slightly pink #e6e0e1 from warm grey, which I would want to see in a real button [M, one reading].
- **`tw-animate-css` and reduced motion.**
- **Why the app's `ui/` imports `@/lib/utils`** while the registry now writes `"cn"`.
- **Whether `shadcn add` can be told to rewrite that import.** Not found in what I read.

## Appendix: the shape of the file

A sketch, not a build file. It is the sum of the rows above under the recommendations, shortened.

```css
@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.375rem;
  --background: #faf9f6;  --foreground: #23262b;
  --card: #ffffff;        --card-foreground: #23262b;
  --popover: #ffffff;     --popover-foreground: #23262b;
  --primary: #2b2e33;     --primary-foreground: #ffffff;
  --secondary: #eeede8;   --secondary-foreground: #23262b;
  --muted: #eeede8;       --muted-foreground: #4b4f55;
  --subtle-foreground: #5f636a;
  --accent: #f3f2ee;      --accent-foreground: #23262b;
  --destructive: #b42318;
  --border: #e7e5df;      --input: #d3d0c8;   --input-hover: #aba79f;
  --ring: #2b2e33;
  --gold: #f0bd2a;        --gold-foreground: #23262b;
  --gold-hover: #e4af17;  --gold-soft: #fbf1d0;  --gold-ink: #8a6400;
  --income: #0f7a3d;      --income-soft: #e3f2e8;
  --expense: #c4281c;     --expense-soft: #fbe6e2;
  --invest: #6b4c70;      --invest-soft: #efe5ef;
  --warning: #8f5200;     --warning-soft: #f7ead2;
  --category-1: #8a6400;  --category-1-soft: #fbf1d0;  /* … to 8 */
  --chart-1: #2b2e33;     /* … to 6 */
  --sidebar: #303338;
  --sidebar-foreground: #cfd1d4;
  --sidebar-primary: #f0bd2a;         --sidebar-primary-foreground: #23262b;
  --sidebar-accent: rgb(255 255 255 / 0.10);
  --sidebar-accent-foreground: #f4f4f2;
  --sidebar-border: rgb(255 255 255 / 0.10);
  --sidebar-ring: #f4f4f2;
}

@theme inline {
  --font-sans: "Geist Variable", Geist, "Helvetica Neue", Arial, system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", "Geist Mono", ui-monospace, Menlo, monospace;

  --color-background: var(--background);  /* … every colour above, as shadcn does */

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);  /* … 2xl to 4xl */

  --text-display: 2rem;  --text-display--line-height: 2.5rem;
  --text-display--font-weight: 600;  --text-display--letter-spacing: -0.02em;
  /* amount-lg, title, heading, label, overline, code in the same way */

  --shadow-xs: 0 1px 2px rgb(16 24 40 / 0.05);
  --shadow-sm: 0 1px 2px rgb(16 24 40 / 0.04);
  --shadow-md: 0 4px 16px rgb(20 38 54 / 0.08);
  --shadow-lg: 0 16px 48px rgb(20 38 54 / 0.16);

  --container-content: 85rem;
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground text-sm antialiased; }
}
```
