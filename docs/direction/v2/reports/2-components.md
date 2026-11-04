# From everything we imagined to shadcn's way: a piece-by-piece map

Read-only research, 2026-11-04. Aurum at `4d5b60d`, the app at `f489bb0`. Nothing in either repository was touched.

**Marks.** **[M]** measured here by a script or a calculation. **[V]** verified by reading the named source. **[R]** reasoning, which can be wrong.

**Sources read.** Copies and scripts are under `/private/tmp/claude-501/-Users-arend-Projects-aurum-ds/7b0e54f3-bda4-4f23-9bde-3351d7db44fe/scratchpad`, shown below as `.../`.

| Source                                                                                 | How                                                                                                                                           | Where the copies are               |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| shadcn `aria-nova`, 42 files                                                           | Registry JSON from `ui.shadcn.com/r/styles/aria-nova/<name>.json`, fetched today, extracted                                                   | `.../direction-v2/reg/src/`        |
| shadcn `aria-mira`, 14 files                                                           | Same, to diff with the app, whose `components.json` says `aria-mira`                                                                          | `.../direction-v2/reg/mira/`       |
| Blocks `sidebar-01`, `03`, `07`, `08`, `16`, `dashboard-01`, `login-01` in `aria-nova` | Same                                                                                                                                          | `.../direction-v2/reg/blocks/`     |
| Prototypes                                                                             | 29 screens, parsed with my own stdlib script. It reproduced every class count of the earlier inventory I compared (`7-prototypes.md`)         | `.../direction-v2/proto_count.py`  |
| App                                                                                    | `apps/web/src`, usage recounted with the earlier `count.py`, `ui/` diffed against upstream with whitespace, import order and icons normalised | `.../direction-v2/semdiff.py`      |
| React Aria, Lucide, Tailwind                                                           | Source in the trial's `node_modules`: RAC 1.22.1, Lucide 1.62.0, Tailwind 4                                                                   | `.../direction/trial/node_modules` |

---

## The short version

1. **Most of what we imagined is shadcn's, edited or composed.** Of 139 rows mapped, 120 are as is, edited or composed, and 14 are own code, of which 5 stay in the app [M, verdicts R]. shadcn's code covers the behaviour of nearly every control. It lacks Aurum's sizes, the gold, the tones and a handful of accessibility repairs.
2. **Five small pieces carry most of the patterns:** `Item`, `Badge`, `IconTile`, `Stat` and `Field`. Three of those are shadcn's. Evidence in section 3.
3. **Own code is small and has no CSS file of its own.** About nine pieces counting `formatMoney`, all Tailwind plus the theme [R]. Section 4.
4. **Three of our five families should die as components:** `NavList`, `Tooltip`, `Icon`. `AppLayout` and `AurumRoot` shrink to thin compositions. Section 2.
5. **Adopting shadcn does not bring accessibility for free.** The repairs needed are few, known and cheap, but they must be made before screens depend on the pieces:
   - `outline-none` in 19 of the 42 files fetched [M], with focus drawn only by a box-shadow ring and a border. In forced colours the shadow goes and the border colour is forced, so focus probably vanishes [R]. A change to `outline-hidden` fixes this, as `sidebar.tsx` already does [V: Tailwind's source].
   - `forced-colors` appears in 0 of 42 files, and `motion-reduce` in 0 of 42 [M].
   - **`Field` does not link its description or error to the control** [V]. No `id`, no `aria-describedby`.
   - **`ItemGroup` is `role="list"`, and `Item` has no `listitem` role** [V]. The official example has 0 `listitem` in 7 `ItemGroup`s [M].
   - **`SidebarMenu` is a `div` on the Aria base,** while the Base UI version is a `ul` [V]. Neither `sidebar.tsx` nor the six sidebar and dashboard blocks read has a `<nav>` [M].
   - **`SidebarTrigger` has no `aria-expanded`** [V: here in `aria-nova`, and issue #11591, still open today].
   - **`Checkbox` draws a check for the indeterminate state too** [V], where the prototype draws a minus [V: WebTransactions screenshot].
   - **At least 16 hard-coded English strings** in the 42 files [M]. The app already fixed "Close" through `texts` [V].

---

## 1. The map

**How to read the columns.** _Screens (instances)_ is of 29 screens, from my parser [M]; a dagger † means the figure comes from the earlier inventory's search on inline styles, which I did not recount. _App today_ is what `components/design`, `components/ui` and screens hold, with `files / JSX` as counted today [M]. _Nearest shadcn_ is read from the `aria-nova` code [V]. _Verdict_ and _Name_ are my proposals [R].

**Verdicts.** **As is:** theme only. **Edited:** shadcn's file with a variant or value changed. **Composed:** made of shadcn pieces. **Own:** our code, with why. "(app)" means the piece stays in the app (section 5). Exactly which step a size lands on depends on the base style still to be chosen; heights below are the prototype's.

### 1.1 Controls

| Piece                           | Screens (inst.)                       | App today                                                            | Nearest shadcn, and does its code cover it                                                                                                                                                       | Verdict                                                                                                                                                 | Name                                                                                                                                  |
| ------------------------------- | ------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Button                          | 28 (95)                               | `design/Button` 15/42, wrapping `ui/button` by a map of names        | `Button`, `LinkButton`. Behaviour yes. No gold. Default 32 high, the prototype's default is 40. Disabled by opacity                                                                              | **Edited:** `default` to 40 and `sm` to 32; add `accent`; `destructive` outlined as drawn; disabled by tokens; `lg` dropped, 0 uses                     | `Button`, `LinkButton`. Aurum's variants die: `primary` → `default`, `secondary` → `outline`, `danger` → `destructive`. New: `accent` |
| IconButton                      | 16 (55)                               | `design/IconButton` 3/3                                              | `Button size="icon"`, `"icon-sm"`. Yes. No dot                                                                                                                                                   | **Edited:** icon sizes to 40 and 32; radius per question 6.10. The bell's dot is a small span in the screen                                             | **Name dies:** `Button size="icon-sm" aria-label`                                                                                     |
| Text field                      | 15 (31), labelled 21                  | `design/TextField` 4/5, straight on RAC                              | `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `Input`. Look yes. **Wiring no:** plain `<p>` and `<div>`, no ids [V]                                                                   | **Edited:** `FieldDescription` becomes RAC `Text slot="description"`, `FieldError` RAC's; root is RAC `TextField` with `Field`'s classes; `Input` to 40 | `Field*` and `Input`. **`TextField` survives only as the wiring root**, with parts, not `label hint error` props; see 6.21            |
| Search field                    | 10 †                                  | `SearchField` 1/1                                                    | `InputGroup`. `select.tsx`'s `SelectInput` already builds it on RAC `SearchField`                                                                                                                | **Composed:** RAC `SearchField` + `InputGroup` + `InputGroupAddon` + `InputGroupInput`                                                                  | `SearchField`                                                                                                                         |
| Prefix, suffix, icon in a field | 8 uses †                              | None                                                                 | `InputGroup`, `InputGroupText`. Yes                                                                                                                                                              | **As is**                                                                                                                                               | `InputGroup`                                                                                                                          |
| Textarea                        | 0                                     | `TextArea` 2/2 over `ui/textarea`, identical to upstream [M]         | `Textarea`. Yes                                                                                                                                                                                  | **As is**                                                                                                                                               | `Textarea`                                                                                                                            |
| Select                          | 10 (29)                               | `design/Select` 6/6 over `ui/select`                                 | `Select` parts. Yes, on RAC. The prototype draws a native one                                                                                                                                    | **Edited:** `SelectTrigger` to 40                                                                                                                       | `Select*`. App's prop wrapper per 6.21                                                                                                |
| Checkbox                        | 4 (33)                                | `design/Checkbox` 3/3 on RAC + `Mark`; `ui/checkbox` has no importer | `Checkbox`. **Indeterminate draws a check** [V]. 16 against 18                                                                                                                                   | **Edited:** minus for indeterminate; size                                                                                                               | `Checkbox`. `Mark` dies                                                                                                               |
| Switch                          | 6 (18)                                | None in `design` or `ui`                                             | `Switch`. Behaviour yes. Trial: thumb lost in forced colours [V: `docs/direction.md`]                                                                                                            | **Edited:** 40 by 22; forced-colours state                                                                                                              | `Switch`                                                                                                                              |
| Radio group                     | 0                                     | `design/RadioGroup` 5/7 on RAC + `Mark`                              | `RadioGroup`, `RadioGroupItem`. Yes                                                                                                                                                              | **As is**                                                                                                                                               | `RadioGroup`                                                                                                                          |
| SegmentedControl                | 16 (18). Period 7, Type 3, Show 2 [M] | Hand-made with `aria-pressed` in 4 files                             | `ToggleGroup selectionMode="single"`. RAC gives `radiogroup` and `radio` [V]. Arrow moves without selecting [V: trial]. `TabsList`'s default looks the same but is the wrong role without panels | **Edited:** add `variant="segmented"` to `ToggleGroup` and `toggleVariants`: track, white chip. Forced-colours mark. Also set `disallowEmptySelection`  | **Name dies:** `ToggleGroup variant="segmented"`                                                                                      |
| Date field, typed               | 4, as a TextField with an icon †      | `ui/date-field` 47 lines, 2/2                                        | **None:** `date-field` returns 404 [V]. Date Picker is a guide, Popover + Calendar [V]                                                                                                           | **Own:** keep the app's. React Aria's `DateField` in shadcn's look; a typed `dd/mm/aaaa` is what the app does (0048)                                    | `DateField`                                                                                                                           |
| Date picker                     | 0                                     | None                                                                 | `Popover` + `Calendar`, RAC-based, with `@internationalized/date` [V]                                                                                                                            | **Composed,** when a screen asks                                                                                                                        | `DatePicker`                                                                                                                          |
| File picker                     | 1, a Dropzone's button †              | `design/FilePicker` 3/4                                              | No piece. RAC `FileTrigger` + `Button`                                                                                                                                                           | **Composed** (app)                                                                                                                                      | `FilePicker`                                                                                                                          |
| Row or more menu                | 25 `more` buttons †, none opens       | `design/Menu` 3/3 over `ui/dropdown-menu`                            | `DropdownMenu*`. Yes                                                                                                                                                                             | **As is**                                                                                                                                               | `DropdownMenu*`. `Menu`'s `items` prop stays in the app if wanted                                                                     |
| Combobox                        | 0                                     | None                                                                 | `combobox`, `command`. Exists                                                                                                                                                                    | **As is,** when asked                                                                                                                                   | `Combobox`                                                                                                                            |

### 1.2 Display and feedback

| Piece                    | Screens (inst.)                                                                    | App today                                                     | Nearest shadcn, and does its code cover it                                                                                                                        | Verdict                                                                                                                          | Name                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Card                     | 29 (87). 79 of 87 carry inline styles; padding 20, 24, 16/20, 28/32 and others [M] | `ui/card` no importer                                         | `Card*`. Header grid, action and footer yes. `--card-spacing` is one variable. `CardTitle` is a `div`, not a heading [V]. `ring-foreground/10` rather than a line | **Edited:** spacing to 20; `ring` to `line` and `shadow-sm`; `variant="sunken"`; flush content; `CardTitle` may render a heading | `Card*`. `TopCard` dies                                                                            |
| Section                  | 23 (68); subtitle 56, actions 16, footer 35 [M]                                    | `design/Section` 30/45, moved from no shadcn base             | No piece. `CardHeader` has the same grid for title, description and action [V]                                                                                    | **Composed:** the grammar of Card's parts without a box, plus `<section aria-labelledby>`; about 35 lines. See sketch 3.4        | `Section`, `SectionHeader`, `SectionTitle`, `SectionDescription`, `SectionAction`, `SectionFooter` |
| Count beside a title     | 0 in prototypes                                                                    | `Count` in `Section.tsx`                                      | `Badge`                                                                                                                                                           | **As is**                                                                                                                        | `Badge variant="secondary"`. `Count` dies                                                          |
| Badge                    | 11 (53). Tones income 18, warning 11, outline 6 [M]                                | `design/Badge` 4/5                                            | `Badge`, with `render`. No money or category tones, no dot                                                                                                        | **Edited:** `tone` axis, `shape` axis, 22 high                                                                                   | `Badge`; see section 3                                                                             |
| Avatar                   | 29 (102), `xs` 95 [M]                                                              | None                                                          | `Avatar`, `AvatarFallback`, `AvatarImage`. Sizes 24, 32, 40. No tones                                                                                             | **Edited:** `xs` 20, `sm` 28, `default` 36, `lg` 48; tones                                                                       | `Avatar*`                                                                                          |
| Icon                     | 16 (147) direct                                                                    | `design/Icon` 11/20, a concept map                            | **No component.** Lucide directly, sized by each piece                                                                                                            | **As is:** Lucide directly, with `LucideProvider`; section 2                                                                     | **Name dies** in Aurum                                                                             |
| Alert                    | 2 (2)                                                                              | `design/Alert` 20/25                                          | `Alert*`. Variants `default`, `destructive`. `role="alert"` always [V]                                                                                            | **Edited:** soft fills, `warning`, `success`, `info`; role only for what arrives after load                                      | `Alert*`                                                                                           |
| ProgressBar              | 5 (12)                                                                             | None                                                          | `Progress`, `ProgressTrack`, `ProgressIndicator`, `ProgressLabel`, `ProgressValue`, on RAC `ProgressBar`. Yes. Track 4                                            | **Edited:** `size` 4 and 8; `tone` on the indicator                                                                              | `Progress*`                                                                                        |
| EmptyState               | 0                                                                                  | 44 `.length === 0` lines by hand [V: `1-wealth-app.md`]       | `Empty*`. Yes. Icon 32                                                                                                                                            | **As is,** `EmptyMedia` holding `IconTile`                                                                                       | `Empty*`. `EmptyState` dies                                                                        |
| Dialog                   | 3 (3) drawn inline                                                                 | `design/Dialog` 2/3 over `ui/dialog`                          | `Dialog*` on RAC. Hard-codes "Close" twice [M]                                                                                                                    | **Edited:** text by prop or `texts`; widths per 6.11                                                                             | `Dialog*`                                                                                          |
| Side panel over the page | 0 drawn                                                                            | `design/SidePanel` 4/8 over a hand-written `ui/sheet`         | **`Sheet` now exists upstream,** 197 lines with four sides [M]; the app's comment "the registry has none" is out of date [V]                                      | **Edited:** close text; `aria-label` required. App's header and foot as a composition                                            | `Sheet*`. `SidePanel` dies or stays a thin app piece                                               |
| Tooltip                  | Only `title` attributes and the collapsed rail's `data-tip` †                      | `role="tooltip"` by hand, 3                                   | `Tooltip`, `TooltipTrigger` on RAC. Covers it                                                                                                                     | **Edited:** three values; section 2                                                                                              | `Tooltip`. Ours dies                                                                               |
| Skeleton, Spinner        | 0                                                                                  | `texts.loading`, 36 uses in plain text [V: `1-wealth-app.md`] | `Skeleton`, `Spinner`. Spinner hard-codes `aria-label="Loading"`                                                                                                  | **As is,** Spinner's label by prop                                                                                               | Same                                                                                               |
| Toast                    | 0                                                                                  | None                                                          | `sonner`; aria `toast` is deprecated [V: `2-shadcn.md`]                                                                                                           | **As is,** when asked. Pulls `next-themes` [V: same]                                                                             | `Toaster`                                                                                          |

### 1.3 Frame and page head

| Piece                           | Screens (inst.)              | App today                                             | Nearest shadcn, and does its code cover it                                                                       | Verdict                                                                       | Name                                                                      |
| ------------------------------- | ---------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Sidebar: rail                   | 29 (29), always inverse      | Aurum's `NavList` under v2, own under v1              | `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`. Width by CSS variable, as `dashboard-01` does [V] | **Edited:** see section 2 for the eight edits                                 | `Sidebar*`, and the app's `AppSidebar`                                    |
| Rail's paint, gradient and glow | 29                           | Flat `inverse` by 0087                                | `--sidebar` is a colour                                                                                          | **Own,** a utility in the theme CSS, not a component                          | `.rail` or similar; 6.14                                                  |
| Brand mark                      | 29                           | `Brand` in `layout/Navigation`                        | `SidebarMenuButton size="lg"` in `SidebarHeader`, as in `team-switcher` [V]                                      | **Composed** (app): + `IconTile` gold                                         | `Brand`                                                                   |
| Nav item                        | 29                           | `NavItem` via `createLink`                            | `SidebarMenuButton` with `href` or RAC `Link`. `isActive` sets `data-active` only [V]                            | **Edited:** `aria-current`, heights, forced-colours mark                      | **`NavItem` dies**                                                        |
| Nav section title               | 29                           | `NavSection`                                          | `SidebarGroup`, `SidebarGroupLabel`. Not linked to its list [V]                                                  | **Edited:** `role="group"` and `aria-labelledby`                              | **`NavSection` dies**                                                     |
| Count in nav item               | 29, 2 items                  | `end` slot                                            | `SidebarMenuBadge`. Yes, absolute                                                                                | **Edited:** pill; gold `attention` tone                                       | `SidebarMenuBadge`                                                        |
| Collapsible nav group           | 29; open 8, closed 21 †      | None                                                  | `Collapsible` around a group, as `nav-main` around items [V]. RAC `Disclosure` gives `aria-expanded`             | **Composed**                                                                  | `SidebarGroup` + `Collapsible`                                            |
| Collapse toggle                 | 29                           | None; 7.40 dropped                                    | `SidebarTrigger`. **No `aria-expanded`** [V], label fixed in English, icon only                                  | **Edited:** `aria-expanded`, label prop, visible text                         | `SidebarTrigger`                                                          |
| Icon rail                       | 1 (NavCollapsed)             | None                                                  | `collapsible="icon"`, `tooltip` prop. Yes; 48 against 72                                                         | **As is,** width by variable                                                  | `Sidebar collapsible="icon"`                                              |
| Scope switch in the rail        | 29                           | `accounts/Scope`, `Select` and own segmented, 8/8     | `ToggleGroup` + `Avatar`. Block `team-switcher` is a dropdown instead                                            | **Composed** (app): knows people. See 6.8                                     | `PersonSwitch`; replaces 7.39                                             |
| BottomNav                       | 0                            | None                                                  | None. `Sidebar` becomes a `Sheet` below 768 [V]                                                                  | **Do not build,** per 6.13                                                    | Dies                                                                      |
| App frame                       | 29 (29)                      | Aurum's `AppLayout` under v2                          | `SidebarProvider` + `Sidebar` + `SidebarInset`. No skip link [M], no content width                               | **Composed:** section 2                                                       | `AppLayout`                                                               |
| Page head                       | 29 (29)                      | `<h2>` by hand, 23 in 22 files [V: `1-wealth-app.md`] | No piece. `site-header` in `dashboard-01` is a bar, not this                                                     | **Composed:** `h1`, flex row, `Breadcrumb` or text, `Button`s, about 25 lines | `PageHeader`, `PageHeaderContext`, `PageHeaderTitle`, `PageHeaderActions` |
| Scope chip                      | 29 (29), 18 with two avatars | None                                                  | `Badge variant="outline"` + `AvatarGroup`                                                                        | **Composed** (app); see 6.8                                                   | `ScopeChip` in the app                                                    |
| Stacked avatars                 | 18 (19)                      | None                                                  | `AvatarGroup`, `AvatarGroupCount`. Yes                                                                           | **Edited:** overlap value                                                     | `AvatarGroup`                                                             |
| Eyebrow                         | 29 (29), four uses           | `Path`                                                | A slot                                                                                                           | **Composed** in `PageHeader`                                                  | `PageHeaderContext`                                                       |
| Breadcrumb                      | 7 (7) †                      | `layout/Path` 92 lines, every page                    | `Breadcrumb*`. Chevron separator; "breadcrumb" and "More" fixed [M]                                              | **Edited:** `/` separator; text                                               | `Breadcrumb*`. `Path` shrinks                                             |
| Header action set               | 28 †                         | None                                                  | None                                                                                                             | **Composed:** `PageHeaderActions`, not a block                                | None                                                                      |

### 1.4 Regions and layout

| Piece                    | Screens (inst.)                            | App today                               | Nearest shadcn                                                                | Verdict                                                                                      | Name                                                                             |
| ------------------------ | ------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Footnote row             | 16 (35) `bs-section__foot` [M]             | `footnote` prop, with an icon           | `CardFooter` is the analogue                                                  | **Composed**                                                                                 | `SectionFooter`                                                                  |
| Footnote or arrow link   | 21 (70) [M]; "→" typed 71 times in all [M] | `reference`, a class, in 18 files, blue | `Button variant="link"`: underline on hover, in `primary`, sized as a control | **Edited:** `size="inline"` on `buttonVariants`, `h-auto p-0`; Lucide arrow, not a typed one | **`TextLink` is not built:** `LinkButton variant="link" size="inline"`. See 6.17 |
| Fixed side column + main | 12 (12)                                    | Utilities                               | None                                                                          | **As is:** Tailwind; widths vary 200 to 560 with no rule †                                   | No piece; a rule in 6.19                                                         |
| Dashboard 2:1            | 5 †                                        | None                                    | `@container` grid in `dashboard-01` [V]                                       | **As is:** Tailwind                                                                          | No piece                                                                         |
| Equal grids              | 6 (7)                                      | `TopCards` grid                         | Same                                                                          | **As is:** Tailwind                                                                          | No piece                                                                         |
| Column stack             | 2 (3)                                      | Utilities                               | Same                                                                          | **As is:** Tailwind                                                                          | No piece                                                                         |
| Negative-margin glue     | 4 †                                        | None                                    | None                                                                          | **Do not build.** A signal: `PageHeader` and `AppLayout` need a tight grouping               | None                                                                             |

### 1.5 Tables and rows

| Piece                                 | Screens (inst.) | App today                                                                          | Nearest shadcn, and does its code cover it                                                                                                                                       | Verdict                                                                                                                                          | Name                 |
| ------------------------------------- | --------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| Data table                            | 15 (20)         | `design/Table` 32 files, 55 tables, 291 cells, a re-export of an edited `ui/table` | `Table*` on RAC, `role="grid"`, `colSpan`, `allowsSorting`, `isRowHeader`, `Row href`, selection [V: RAC types]. Data Table is a TanStack guide [V], which the app does not need | **Edited:** the app's edits worth keeping, minus the `max-w-` filter; add `align="end"` on cells to retire 138 `num` uses [V: `1-wealth-app.md`] | `Table*`             |
| Group row                             | 5 (17)          | `colSpan` 6 uses in 4 files [V: `1-wealth-app.md`]                                 | `TableRow` + `TableCell colSpan`. No look                                                                                                                                        | **Edited:** `TableGroupRow`, 6 lines                                                                                                             | `TableGroupRow`      |
| Tree rows                             | 1 (1)           | None                                                                               | RAC `Tree`, no shadcn                                                                                                                                                            | **Composed** (app): group rows and indent; 6 rows do not need `Tree`                                                                             | None                 |
| Selected row                          | 5 (5)           | None                                                                               | `data-selected:bg-muted`. Yes, by RAC                                                                                                                                            | **Edited:** to `primary-soft`, plus a mark for forced colours                                                                                    | Prop `selectionMode` |
| Bulk checkbox column                  | 2 (28) †        | None                                                                               | RAC selection + `Checkbox slot="selection"` [R: RAC's documented pattern, not read here]                                                                                         | **Composed.** Bulk action undefined; 6.20                                                                                                        | None                 |
| Row actions                           | 5 (36) †        | `Menu` 3/3                                                                         | `DropdownMenu` + `Button icon-sm`                                                                                                                                                | **Composed**                                                                                                                                     | None                 |
| Entity cell                           | 13 (153) [M]    | By hand in cells                                                                   | `Item`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`. Yes, but padded and with a border                                                                            | **Edited:** `size="flush"`, no padding, gap 12; see section 3                                                                                    | `Item*`              |
| Person cell                           | 6 †             | By hand                                                                            | `Item size="flush"` + `Avatar`                                                                                                                                                   | **Composed**                                                                                                                                     | None                 |
| Hand-built transaction row in a table | 2 (26) †        | None                                                                               | `Item` in `TableCell` + `IconTile`                                                                                                                                               | **Composed**                                                                                                                                     | None                 |
| Day header without a table            | 1 (3) †         | None                                                                               | `ItemHeader` or `TableGroupRow`'s look                                                                                                                                           | **Composed** (app)                                                                                                                               | None                 |
| Pager                                 | 3 (3)           | None; no pagination in the app [V: `1-wealth-app.md`]                              | `Pagination*`. Yes. At least four English strings [M]; centred; links only, `isActive` outlined                                                                                  | **Edited:** labels by prop; active filled; alignment. Left text is the screen's                                                                  | `Pagination*`        |
| Attachment row                        | 1 (1)           | None                                                                               | `Attachment*` exists, 217 lines [M]; `Item variant="outline"` is smaller. I did not read Attachment's semantics                                                                  | **Composed** (app): `Item` + `IconTile`                                                                                                          | None                 |

### 1.6 Filters and in-page navigation

| Piece                          | Screens (inst.) | App today                                                                  | Nearest shadcn                                                                                                                    | Verdict                                                                     | Name                                                                   |
| ------------------------------ | --------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Filter toolbar                 | 5 (5)           | `Lens`, by portal, 13/13                                                   | None. RAC `Toolbar` takes the arrows, wrong around text fields [R]                                                                | **Composed:** flex wrap of `SearchField`, `Select`, `ToggleGroup`, `Button` | Not a piece at first. `Toolbar` only if 3 screens repeat it in the app |
| Active filter chips            | 2 (2)           | One tag in `Scope`                                                         | RAC `TagGroup`, no shadcn. `Badge` + `Button icon-xs`                                                                             | **Composed** (app): really one screen †                                     | `FilterChip` in the app                                                |
| Result summary line            | 2 (2) †         | None                                                                       | None                                                                                                                              | **Composed** in the screen; class misused in the prototype                  | None                                                                   |
| Tabs                           | 4 (16)          | `design/Tabs` 1/1 on RAC; Notes draws links by hand; `ui/tabs` no importer | `Tabs*`, `variant="line"`. RAC `Tab` takes `href` [V]. **Inactive `text-foreground/60` is 4.14:1 on white, 3.91:1 on sunken** [M] | **Edited:** inactive to a token; 14/20                                      | `Tabs*`                                                                |
| Facet list                     | 2 (2)           | None                                                                       | `SidebarMenu*` throw outside a provider [V]. `ToggleGroup orientation="vertical"`                                                 | **Composed** (app)                                                          | None                                                                   |
| Settings vertical nav `p-vnav` | 0               | None                                                                       |                                                                                                                                   | **Do not build**                                                            | Dies                                                                   |
| Month switcher                 | 1 (1)           | None                                                                       | `ButtonGroup` + `Button icon` + `ButtonGroupText`. Exactly this [V]                                                               | **Composed** (app), per 6.2                                                 | `PeriodStepper` if it spreads                                          |
| Record switcher                | 1 (3)           | None                                                                       | `Item variant="outline" href` + `aria-current`                                                                                    | **Composed** (app)                                                          | None                                                                   |

### 1.7 Figures and summaries

| Piece                     | Screens (inst.)            | App today                        | Nearest shadcn                                                                                                                                  | Verdict                                                                           | Name                                       |
| ------------------------- | -------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------ |
| StatStrip                 | 6 (6)                      | `TopCards` 11/11                 | `section-cards` in `dashboard-01`: `Card`, `CardDescription`, `CardTitle`, `CardAction`, `CardFooter` [V]. One card per figure, not one divided | **Composed:** `Stat` in `StatGroup`; 6.5                                          | `Stat*`, `StatGroup`. **`StatStrip` dies** |
| KPI strip, plain `p-kpis` | 4 (4)                      | Same                             | Same                                                                                                                                            | **Composed:** same, no media. Value by `Amount`, typed text today                 | Same; **`p-kpis` merges**                  |
| StatCard                  | 0                          | **`TopCard` 14/40** is the app's | `Card` + `Stat`                                                                                                                                 | **Composed:** `Card` + `Stat`. Keep `opens`: the whole card as a stretched button | **`StatCard` and `TopCard` die**           |
| Hero figure               | 4 (8), by a borrowed class | `ValueCard` 6/6                  | Same                                                                                                                                            | **Composed:** `Stat size="hero"`                                                  | `Stat`                                     |
| Multi-zone summary card   | 4 †                        | `InvestmentsSummary` 3/3         | `Card` + `Separator orientation="vertical"`                                                                                                     | **Composed** in the screen; each differs †                                        | None                                       |
| Metric list `p-metric`    | 5 (33)                     | `Field`, defined twice           | **None:** `Item` loses term and value semantics [R]                                                                                             | **Own:** `DescriptionList` on `dl`, about 30 lines, because shadcn has no `dl`    | `DescriptionList*`                         |
| Key-value list `p-kv`     | 3 (3)                      | Same                             | Same                                                                                                                                            | **Own:** same, `variant="plain"`                                                  | Same                                       |
| Facts grid `p-facts`      | 1 (1)                      | Same                             | Same                                                                                                                                            | **Own:** same, `layout="grid"`, if NoteDetail moves                               | Same                                       |
| Insight card              | 2 (6)                      | None                             | `Card` + `Item` + `IconTile`                                                                                                                    | **Composed**                                                                      | None                                       |
| Callout row in a card     | 3 †                        | None                             | `Item variant="outline"`, `ItemActions`                                                                                                         | **Composed**                                                                      | None                                       |

### 1.8 Settings and forms

| Piece                       | Screens (inst.)                                              | App today                | Nearest shadcn, and does its code cover it                                                                                                                                                                                | Verdict                                                                                                                                        | Name                          |
| --------------------------- | ------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Setting row                 | 6 (28)                                                       | None                     | `Field orientation="horizontal"`, `FieldContent`, `FieldTitle`, `FieldDescription` [V: `HorizontalFields`]. `Item` for a row with a Button or link                                                                        | **Composed**                                                                                                                                   | **`SettingRow` is not built** |
| Form grid                   | 6 (10)                                                       | Utilities                | `FieldGroup` with grid classes                                                                                                                                                                                            | **As is:** Tailwind                                                                                                                            | `FieldGroup`                  |
| Sunken options panel        | 3 †                                                          | None                     | `FieldSet` in `Card variant="sunken"`                                                                                                                                                                                     | **Composed**                                                                                                                                   | None                          |
| Choice cards                | 5 (24). `p-type` 15, `p-person` 3, `p-inv` 3, `p-acct` 3 [M] | `design/ChoiceCards` 2/3 | `FieldLabel htmlFor` > `Field` + `RadioGroupItem id` [V: `RadioGroupWithDescriptions`]. RAC's `Radio` is itself a label [R: from memory of RAC, not read]; a click on the card needs a test. Selected look is `primary/5` | **Edited:** selected to the ink ring, forced-colours. **Keep the app's way if the test fails:** the card is the `Radio`, with content under it | `ChoiceCard`; 4 classes merge |
| Colour swatches             | 2 (16)                                                       | None                     | None. RAC `ColorSwatchPicker` exists [V]                                                                                                                                                                                  | **Composed** (app) on RAC, shadcn's classes                                                                                                    | None                          |
| Icon picker                 | 1 (1)                                                        | None                     | `RadioGroup` of `IconTile`s                                                                                                                                                                                               | **Composed** (app)                                                                                                                             | None                          |
| Field label outside a field | 4 (5)                                                        | None                     | `FieldSet` + `FieldLegend variant="label"`. Exactly this [V]                                                                                                                                                              | **As is**                                                                                                                                      | `FieldLegend`                 |

### 1.9 Panels, dialogs and flows

| Piece                        | Screens (inst.) | App today           | Nearest shadcn                 | Verdict                                                      | Name |
| ---------------------------- | --------------- | ------------------- | ------------------------------ | ------------------------------------------------------------ | ---- |
| Detail panel beside the page | 1 (1)           | Opens over the page | `Card` sticky, or `Sheet`. 6.3 | **Composed**                                                 | None |
| Edit panel                   | 1 (1) †         | Same                | Same                           | **Composed** (app)                                           | None |
| Confirm panel                | 1 (1) †         | Same                | Same                           | **Composed** (app)                                           | None |
| Right column, no panel look  | 3 †             | Utilities           | None                           | **As is:** Tailwind                                          | None |
| Modal form                   | 3 (3)           | `Dialog`            | `Dialog` + `FieldGroup`        | **Composed**                                                 | None |
| Stepper                      | 1 (1)           | None                | None                           | **Own** (app): one screen, three of its four steps undrawn † | None |
| Resolution rows              | 1 (4)           | `notes/Translation` | `Item` + `Field`               | **Composed** (app)                                           | None |
| Ticker mini-rows             | 2 (7) †         | None                | `Item` + `Badge`               | **Composed** (app)                                           | None |
| Gold-edged block             | 1 (1)           | None                | `Card` tone                    | **Do not build;** 6.14                                       | None |
| PDF viewer                   | 1 (1)           | None                | None                           | **Own** (app): domain                                        | None |
| Mapping list                 | 1 (1)           | `notes/Translation` | None                           | **Own** (app): domain                                        | None |
| Dropzone                     | 1 (1)           | `FilePicker`        | RAC `DropZone` [V] + `Empty`   | **Composed** (app)                                           | None |
| Note text                    | 1 (1)           | None                | `Card variant="sunken"`        | **Composed**                                                 | None |

### 1.10 Small marks

| Piece                    | Screens (inst.)                        | App today                        | Nearest shadcn                                                                           | Verdict                                                | Name                                                 |
| ------------------------ | -------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Tile `p-tile`, `p-c1..8` | 13 (124); with TransactionRow's 19 [M] | Inline in `TopCard`, `SidePanel` | `ItemMedia variant="icon"`, `EmptyMedia`, `AvatarFallback`. None has size, tone or badge | **Own:** a cva span, about 25 lines. Section 4         | `IconTile`                                           |
| Category chip            | 5 (63)                                 | None                             | `Badge`                                                                                  | **Edited:** `tone="cat-n"` with dot                    | `Badge`                                              |
| Tag                      | 3 (10)                                 | None                             | `Badge variant="outline"`                                                                | **Edited:** `shape="tag"`                              | `Badge`                                              |
| "Nova" flag              | 6 (9)                                  | None                             | `Badge`                                                                                  | **Edited:** gold tone, `shape="tag"`                   | `Badge`                                              |
| Joint marker             | 6 (8)                                  | None                             | `Badge` + `AvatarGroup`                                                                  | **Composed**                                           | None                                                 |
| Owner marker on a tile   | 2 (26), 3 via TransactionRow †         | None                             | `AvatarBadge` is the same idea                                                           | **Composed:** `IconTile` holds an absolute `Avatar xs` | None                                                 |
| TickerChip               | 7 (61)                                 | Mono spans                       | `Kbd` is wrong by element. `Badge` with `render` for links [V]                           | **Edited:** `shape="code"`, mono                       | `Badge shape="code"`. **Name dies**                  |
| PDF chip                 | 4 (13)                                 | None                             | `Badge`                                                                                  | **Edited:** same axes; 6.15                            | `Badge`                                              |
| Buy and sell mark        | 2 (8)                                  | None                             | `Badge`                                                                                  | **Edited** (app): square                               | None                                                 |
| Group or bank mark       | 4 (7) †                                | None                             | `IconTile` with letters                                                                  | **Composed**                                           | None                                                 |
| Text helpers             | 20 (512)                               | `tabular-nums`, 41 uses [M]      | Tailwind                                                                                 | **As is**                                              | `tabular-nums`, `text-muted-foreground`, `font-mono` |
| Transformation arrow     | 4 (27)                                 | None                             | Lucide                                                                                   | **As is**                                              | `ArrowRight`                                         |

### 1.11 Money pieces and charts

| Piece                 | Screens (inst.)                                                                   | App today                                                           | Nearest shadcn                                                           | Verdict                                                               | Name                    |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------------------- |
| Amount, `formatMoney` | 11 (74) direct; 16 with what draws it; **22 counting typed `R$`** (176 typed) [M] | `format.ts`, 121 calls                                              | None. `tabular-nums` only                                                | **Own:** domain. Section 4                                            | `Amount`, `formatMoney` |
| Delta                 | 3 (13)                                                                            | None                                                                | `Badge` as in `section-cards`, but the prototype is plain text           | **Own:** thin, about 20 lines                                         | `Delta`                 |
| AmountInput           | 1 (1)                                                                             | `TextField inputMode`                                               | `InputGroup`                                                             | **Composed** (app until a second screen)                              | `AmountInput`           |
| TransactionRow        | 7 (47)                                                                            | None                                                                | `Item`                                                                   | **Composed:** sketch 3.2. Named in the app, it knows transactions     | **Dies in Aurum**       |
| BudgetBar             | 6 (23)                                                                            | None                                                                | `Progress*`                                                              | **Composed:** `Progress` + tones + a foot line                        | `BudgetBar` (app)       |
| AllocationBar         | 5 (5)                                                                             | `position/Concentration`                                            | None. `BarChart` stacked is overkill [R]                                 | **Own:** thin, about 30 lines. Section 4                              | `AllocationBar`         |
| Sparkline             | 0                                                                                 | None                                                                | `LineChart`                                                              | **Do not build**                                                      | Dies                    |
| Area or line chart    | 2 (2)                                                                             | `EvolutionChart` 224, `PriceChart` 235 lines, by hand, table beside | `Chart` on Recharts 3.8.0, `AreaChart`, `LineChart` [V: `chart-example`] | **Composed:** `ChartContainer` + Recharts; see 6.23                   | `Chart*`                |
| Grouped bars          | 1 (1)                                                                             | None                                                                | `BarChart`                                                               | **Composed**                                                          | `Chart*`                |
| Donut                 | 1 (1)                                                                             | None                                                                | `PieChart`                                                               | **Composed**                                                          | `Chart*`                |
| Progress ring         | 1 (1)                                                                             | None                                                                | `RadialBarChart`, or two circles                                         | **Own** (app): plain SVG, far lighter than a chart for one number [R] | None                    |
| Legend                | 3 (3)                                                                             | None                                                                | `ChartLegendContent`                                                     | **As is** in charts; `DescriptionList` otherwise                      | `ChartLegend`           |
| Ranking bars          | 1 (5)                                                                             | None                                                                | `Item` + `Progress`                                                      | **Composed** (app)                                                    | None                    |
| Target track          | 1 (6) †                                                                           | None                                                                | `Progress` + a tick                                                      | **Composed** (app)                                                    | None                    |

### 1.12 Domain blocks

All stay in the app, composed from the above [R].

| Piece              | Screens (inst.) | Composition                                         |
| ------------------ | --------------- | --------------------------------------------------- |
| Goal card          | 1 (4)           | `Card` + `Item` + `Progress` + `Amount`             |
| Budget card        | 1 (8)           | `Card` + `Item` + `BudgetBar`                       |
| Dashed "add" card  | 1 (1)           | `Card` with a dashed class + `IconTile`             |
| Upcoming list      | 1 (4)           | `Item` + date stamp + `Amount`                      |
| Installment row    | 1 (3) †         | `Item` + `Progress`                                 |
| Credit card visual | 1 (1)           | Own, by hand. Outside the rules on purpose          |
| Relation chain     | 1 (1)           | `Badge`s and arrows                                 |
| Danger zone        | 1 (1)           | `Section` + `Item` + `Button variant="destructive"` |

### Tally of verdicts

Rows in the tables above, by my verdicts [M: counted by a script over this file; the verdicts themselves are R]. Of **139** rows: **as is 21**, **edited 36**, **composed 63**, **own 14**, **do not build 5**. Of the composed and own, 27 and 5 stay in the app. So own code in Aurum is 9 rows, several being one piece: `DescriptionList` takes three rows.

### Reading of the roadmap's milestone 7

| Item                                             | Today      | Under the new line [R]                                                                                          |
| ------------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------- |
| 7.7 Badge                                        | Waiting    | `Badge` edited with `tone` and `shape`. Absorbs `p-chip`, `p-tag`, `p-new`, `p-ticker`, `p-pdf`, `p-cv`         |
| 7.15 Section and Card                            | Planned    | Both, as above                                                                                                  |
| 7.18 Table                                       | Planned    | `Table` edited, from the app's copy                                                                             |
| 7.8, 7.9 Avatar, AvatarGroup                     | Planned    | One item, `avatar.tsx` holds both                                                                               |
| 7.17 Alert                                       | Planned    | `Alert` edited                                                                                                  |
| 7.11 Button and IconButton                       | Planned    | One piece                                                                                                       |
| 7.12 PageHeader                                  | Planned    | Composed                                                                                                        |
| 7.16 TextField, Select, SegmentedControl, Switch | Planned    | `Field`, `Input`, `Select`, `ToggleGroup`, `Switch`. The 1.54:1 `control-border` question stays [M: recomputed] |
| 7.10 ScopeChip, 7.39 the switch                  | Planned    | Both in the app, composed                                                                                       |
| 7.37 Side panel                                  | Planned    | `Sheet`                                                                                                         |
| 7.38 BottomNav                                   | Planned    | Dropped, per 6.13                                                                                               |
| 7.40 to 7.42, dropped                            | Collapsing | Come back free with `Sidebar`                                                                                   |

---

## 2. Our five existing families

Lines are code + CSS, stories apart [M]. **The 1,623 lines of stories are the most valuable part to keep:** they state what must hold, and can run against the replacements [R].

### NavList, NavSection, NavItem (119 + 160 lines, 426 of stories)

**shadcn offers** `Sidebar` and its parts, 714 lines with Provider, Sheet on mobile, icon rail, group label, group action, menu badge, menu action, sub-menus and a skeleton [V]. Blocks give the team switcher and user menu.

**What we gain** [V]:

- The rail's whole behaviour, which we dropped at 7.40 to 7.42 for lack of time: collapse, tooltips when collapsed, a real mobile drawer with focus management, counts, sub-menus, and sections that open through RAC's `Disclosure`.
- The `dashboard-01` and sidebar blocks to start from, a `useSidebar` hook, and the same vocabulary as any example or agent.

**What we lose, read from the code:**

| Today in `NavList`                                                                  | In `aria-nova` `sidebar.tsx`                                                                                        | Repair                                                                                       |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `<nav aria-label>`, required by the type                                            | No `<nav>` in the file or the six blocks [M]                                                                        | Wrap `SidebarContent`'s body in `<nav>` in `AppSidebar`                                      |
| `<ul>`, `<li>`, group `aria-labelledby`                                             | `SidebarMenu`, `SidebarMenuItem` are `div`s; the **Base UI version is `ul`** [V]. `SidebarGroupLabel` is not linked | Edit to `ul`, `li`, and `role="group"`, `aria-labelledby`                                    |
| `aria-current="page"`, by the router                                                | `isActive` sets only `data-active` [V]                                                                              | One line: `aria-current` when `href`                                                         |
| Mark by shape (0084, 11.41:1 and 5.32:1) and transparent outline for forced colours | Fill only                                                                                                           | Keep the `::before` as classes; WCAG 1.4.11 reasoning unchanged                              |
| `min-height`, names wrap (`overflow-wrap: anywhere`)                                | Fixed `h-8`, `overflow-hidden`, `truncate` [V]                                                                      | Heights to 40; decide on truncation. Long names and text spacing (1.4.12) need the sweep [R] |
| `orientation="responsive"`, a strip at the top below `md`                           | Drawer below 768, by JS (`useIsMobile`)[V]. Nothing shows without a trigger                                         | 6.13                                                                                         |
| Any anchor, so `createLink(NavItem)` works with TanStack Router                     | `href` selects RAC `Link`; `render` absent; `sidebarMenuButtonVariants` not exported [V]                            | **Untested.** Try RAC's `RouterProvider`, or export the variants                             |
| No state, no shortcut                                                               | Writes a cookie it never reads, on a client-only app: nothing restores it [V]. Ctrl or Cmd+B always bound [V]       | Read from the app's storage; shortcut as a prop                                              |

Also fixed in English: "Toggle Sidebar" ×3, "Sidebar", "Displays the mobile sidebar." [V].

**Issue #11591** is open today and true on the Aria base [V]. The prototype's own toggle had `aria-expanded` [V: `aurum.js`]. The issue warns a fix must read `openMobile` on mobile and `open` on desktop [V]. `SidebarRail` has `tabIndex={-1}` [V], so it is mouse only: keep only with a keyboard route elsewhere.

**Verdict.** `NavList` dies; `Sidebar` is edited, with eight edits [R]: nav and lists, group label, `aria-current`, forced-colours mark, `SidebarTrigger`, strings by prop, state read, heights. 0086 and 0087 are reversed in form, not intent: pieces are still pieces, and the surface still goes by tokens.

### AppLayout (80 + 109 lines, 330 of stories)

**shadcn offers** `SidebarProvider` (flex, `min-h-svh`), a fixed `Sidebar` with a gap spacer, and `SidebarInset` as `<main>` [V].

**Lost if dropped:** the skip link (2.4.1, 0083), since no file or block read has one [M]; a focus target on main; the `topBar` slot; `content-max` and the page's spaces (0090); the sticky rail's own scroll, though `SidebarContent` does scroll [V].

**Gained:** one provider for collapse and mobile, and `peer` classes that let the main area follow the rail.

**Verdict.** Composed, about 30 lines [R]: `SidebarProvider` + skip link + `navigation` + `SidebarInset` + `topBar` + the content box. **Name stays,** as shadcn has none; its blocks spell this out in a `page.tsx`. A consumer without a sidebar is not an actual case today [R]. `AppLayout.css` goes, including its `max()` padding, which needs an arbitrary value or a utility in the theme.

### Tooltip (182 + 36 lines, 427 of stories)

**shadcn offers** RAC's `Tooltip` in 80 lines [M], positioned and flipped by RAC.

**Read from RAC's source** [V]:

| WCAG 1.4.13 | Ours                    | RAC                                                              |
| ----------- | ----------------------- | ---------------------------------------------------------------- |
| Dismissible | Escape, by hand         | Escape, global listener while open                               |
| Hoverable   | 100 ms to cross the gap | `onHoverStart` on the tooltip keeps it; `closeDelay` default 500 |
| Persistent  | Yes                     | Yes while hovered or focused                                     |

| Other                   | Ours                                         | shadcn's                                                                  |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| Delay                   | 150 ms, guidelines                           | `delay = 0` in shadcn's wrapper, a prop [V]                               |
| Keyboard                | Opens at once on `:focus-visible`            | Same[V]                                                                   |
| Name                    | `aria-hidden`; control keeps its name (0078) | `aria-describedby` while open [V], so a name spoken twice is possible [R] |
| Scroll, resize          | Closes                                       | **Not read**                                                              |
| Forced colours          | Transparent outline as an edge               | None; `bg-foreground` goes [R]                                            |
| Long words              | `overflow-wrap: anywhere`                    | `max-w-xs` only                                                           |
| Arrow                   | None                                         | `OverlayArrow`, removed if we want the prototype's look                   |
| Moving between controls | Starts over                                  | Warmup and 500 ms cooldown, opens at once [V]                             |
| Top layer               | `popover="manual"`                           | RAC portal, `z-50`                                                        |

**Verdict.** **As is with three edits:** `delay`, an outline for forced colours, wrap. Run the 427 lines of stories against it first: what fails tells which to keep. Whether the double reading is real is for the screen-reader script (7.46); RAC cannot be told apart by reading.

### Icon (40 + 9 lines, 160 of stories)

**shadcn has none:** it imports Lucide directly, sized from the parent by `[&_svg:not([class*='size-'])]:size-4` [V]. Registry files hold `IconPlaceholder`, which the CLI resolves by `iconLibrary` [V: trial's installed files hold Lucide].

**What `Icon` does, and where it goes:**

| Job                        | Instead                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stroke 1.5 (0056)          | **`LucideProvider strokeWidth={1.5}`** at the root. It exists in Lucide 1.62, with `size`, `color` and `className` [V: `Icon.mjs`, `lucide-react.d.ts`] |
| `aria-hidden` when unnamed | Lucide does it already, when no a11y prop is given [V: `buildLucideIconNode.mjs`]                                                                       |
| `role="img"` when named    | Lost. `aria-label` alone on an svg is weaker [R]. Prototype's `label` prop was never used; a named icon can be one line                                 |
| Size 20                    | `LucideProvider size`, overridden by the piece                                                                                                          |
| No shrink                  | Pieces already set `shrink-0` [V]                                                                                                                       |

**Lost:** a named Aurum import, and a check that goes through it. **Gained:** copied examples work untouched, and one thing fewer.

**Verdict.** Dies [R]. The app's `design/Icon` stays, as its 41 concepts are the app's. Its 1.75 stroke in `TopCard` and `SidePanel` [V] disagrees with 1.5, and the provider settles it.

### AurumRoot (25 + 88 + 4 lines, 280 of stories)

**shadcn offers** no component: `index.css` holds `:root`, `@theme inline`, `@layer base`, with `@custom-variant dark` [V: `2-shadcn.md`, trial's `index.css`].

| Job                                                                 | Instead                                                                                                                                                                                                        |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fonts, tokens, base                                                 | A `theme.css` the app imports, Tailwind's preflight, shadcn's base layer. Another report handles tokens                                                                                                        |
| One focus ring `[class^="au-"]`                                     | Per piece, in shadcn; the 19 `outline-none` matter here. `ring/50` of graphite on white is 2.94:1 [M], so the solid `border-ring` beside it carries the 3:1                                                    |
| `.au-sr`, `.au-num`                                                 | Tailwind's `sr-only`, `tabular-nums`                                                                                                                                                                           |
| `display: contents` and scoping, so v1 is untouched                 | **Lost by default**: `:root` tokens reach v1. The app separates v2 by `data-ui`, today for its dark values only [V: `index.css`]                                                                               |
| `data-au-surface="inverse"`, one token set with other values (0087) | **The same idea exists:** a subtree class redefines the variables, and `dark:` is `&:is(.dark *)`, so nested works. `--sidebar-*` alone covers only Sidebar's parts, not a `Badge` or `Select` in the rail [R] |
| Providers                                                           | New: `LucideProvider`, RAC's `I18nProvider`, which is the app's `LanguageProvider` of 10 lines, perhaps `RouterProvider`                                                                                       |

**Verdict.** The component shrinks to a provider without a DOM node [R]: `AurumProvider`, or the name stays. The CSS becomes `theme.css`. The inverse surface should stay **as a scope class, not `--sidebar-*`,** with `dark:` classes checked: if a scope class named `inverse` does not trigger `dark:`, pieces with `dark:bg-input/30` will not follow. Worth one test [R].

---

## 3. Composition

### The tree

```text
React Aria, Lucide, Tailwind, cva, cn
│
├── shadcn, as is or edited (one file each, in src/components/)
│   Button  Input  InputGroup  Textarea  Label  Field*  Select  Checkbox
│   RadioGroup  Switch  Toggle  ToggleGroup  ButtonGroup
│   Card*  Badge  Avatar*  Item*  Table*  Tabs*  Separator  Progress*
│   Alert*  Empty*  Skeleton  Spinner  Dialog*  Sheet*  Popover
│   DropdownMenu*  Tooltip  Breadcrumb*  Pagination*  Collapsible
│   Calendar  Chart*  Sidebar*
│
├── Own, Tailwind only (about 9 pieces)
│   formatMoney  Amount  Delta  IconTile  Stat*  DescriptionList*
│   AllocationBar  DateField  Section*  (composed, no box)
│
├── Composed in Aurum (thin, names kept)
│   PageHeader* = Breadcrumb or text + h1 + Button
│   SearchField = RAC SearchField + InputGroup
│   StatGroup   = Card + Stat + dividers
│   ChoiceCard  = RadioGroupItem + Field parts
│   AppLayout   = SidebarProvider + skip link + SidebarInset + content
│
└── Page-level, in the app
    AppSidebar (Sidebar + Brand + nav + PersonSwitch + SidebarTrigger)
    TransactionRow  BudgetBar  ScopeChip  FilterChip  GoalCard ...
```

### Where one small piece removes many patterns [M, instances from my parser]

| Piece                                  | Removes                                                                                                                                                           | Instances                                                                                                                                                               | Screens of 29                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **`Item`** (shadcn, two values edited) | `p-cell`, `TransactionRow`, `p-set` (action rows), `p-due`, `p-insight`, `p-acct`, `p-person`, `p-type`, `p-inv`, `p-file`, `p-res`: **11 classes or components** | **267** containers; nesting not excluded. **243** without the four classes that also count as choice cards. `p-set` also counts under `Field` when its end is a control | **26**; 29 counting `p-cell__t`, `__m` and `p-set__t` used bare |
| **`Badge`** (shadcn, 2 axes)           | `bs-badge`, `p-chip`, `p-tag`, `p-new`, `p-joint`, `p-ticker`, `p-pdf`, `p-cv`, `p-fchip`, `p-scopechip`: **10**                                                  | **256**                                                                                                                                                                 | **29**                                                          |
| **`IconTile`** (own, 25 lines)         | `p-tile`, `p-c1..8`, `bs-txn__tile`, `bs-sicon`, `bs-stat__tile`, `p-groupmark`, `p-bankmark`, `bs-empty__icon`                                                   | **195:** 124 + 47 in TransactionRow + 24 in strips, at 4 each †                                                                                                         | **20**                                                          |
| **`Stat`** (own, 35 lines)             | `StatStrip`, `p-kpis`, `StatCard`, hero figure; in the app `TopCard`, `ValueCard`                                                                                 | 18 uses in prototypes; **40** `TopCard`s in the app                                                                                                                     | **14**                                                          |
| **`Field`** (shadcn, 2 parts edited)   | `TextField`, `Select` labels, AmountInput's label, `bs-field__label`, `p-formgrid`, `p-set` with a control                                                        | **76**                                                                                                                                                                  | **17**                                                          |
| **`DescriptionList`** (own, 30 lines)  | `p-metric`, `p-kv`, `p-facts`, and the app's two `Field`s                                                                                                         | 37                                                                                                                                                                      | 8                                                               |
| **`Card`** with spacing edited         | 79 inline styles on 87 cards                                                                                                                                      | 79                                                                                                                                                                      | 29                                                              |

**Together, these seven plus `Button`, `Section`, `Table` and `Amount` account for almost everything drawn on most screens.** I did not measure a precise figure, since nesting makes it ambiguous.

**Reuse inside the tree** [R]: `Button` is reached by `Dialog`, `Sheet`, `Pagination`, `InputGroup`, `Sidebar`; `Item` by the app's rows; `IconTile` by `Item`, `Stat`, `Empty`, `Brand`; `Amount` by `Stat`, `DescriptionList`, `BudgetBar`, `TableCell`, rows.

### 3.1 Item needs two values

```tsx
// item.tsx: add to size variants. The rest of Item is unchanged.
flush: "gap-3 border-0 p-0 rounded-none",
row: "gap-3 rounded-none px-5 py-3 min-h-16",
// And give it a role when inside ItemGroup, so role="list" is valid.
```

### 3.2 TransactionRow is a recipe, not a component

```tsx
<ItemGroup className="divide-y gap-0">
  <Item size="row" role="listitem">
    <ItemMedia>
      <IconTile icon={Utensils} tone="cat-1" size="lg">
        <Avatar
          size="xs"
          tone={5}
          className="absolute -right-1 -bottom-1 ring-2 ring-card"
        >
          <AvatarFallback>F</AvatarFallback>
        </Avatar>
      </IconTile>
    </ItemMedia>
    <ItemContent>
      <ItemTitle>
        Restaurante Lume <Repeat className="size-3.5 text-muted-foreground" />
      </ItemTitle>
      <ItemDescription>Alimentação · Felipe</ItemDescription>
    </ItemContent>
    <ItemActions className="flex-col items-end gap-0.5">
      <Amount value="-148.00" />
      <span className="text-caption text-muted-foreground">Ontem, 20:41</span>
    </ItemActions>
  </Item>
</ItemGroup>;
```

In a table cell the same parts go with `size="flush"`, so the ledger's "hand-built row" and the dashboard's row stop being two things [R]. The app can name it `TransactionRow`, since it knows what a transaction is.

### 3.3 One `Stat`, three looks

```tsx
// Dashboard: one box with dividers, tiles, breakdown below.
<StatGroup>
  <Stat>
    <StatMedia><IconTile icon={Wallet} tone="gold" shape="circle" size="xl" /></StatMedia>
    <StatLabel>Saldo total</StatLabel>
    <StatValue><Amount value="69596.30" size="kpi" tone="neutral" sign="never" /></StatValue>
    <StatNote><Delta value="3.9" label="vs. setembro" /></StatNote>
  </Stat>
  {/* three more */}
</StatGroup>

// Accounts: same, no media (was p-kpis).
// Budgets: a hero figure, no box.
<Stat size="hero">
  <StatLabel>Gasto em outubro</StatLabel>
  <StatValue><Amount value="5204.75" size="xl" tone="neutral" /></StatValue>
  <StatNote><Delta value="-8.1" invert label="vs. ritmo de setembro" /></StatNote>
</Stat>

// The app's TopCard: its own Card, opening a panel.
<Card size="sm"><Stat onOpen={open}>...</Stat></Card>
```

### 3.4 A page, top to bottom

```tsx
<PageHeader>
  <PageHeaderContext><ScopeChip people={family} /> Outubro de 2026</PageHeaderContext>
  <PageHeaderTitle>Transações</PageHeaderTitle>
  <PageHeaderActions>
    <Button variant="outline"><Download data-icon="inline-start" /> Exportar</Button>
    <Button variant="accent"><Plus data-icon="inline-start" /> Nova transação</Button>
  </PageHeaderActions>
</PageHeader>

<Section>
  <SectionHeader>
    <SectionTitle level={2}>Preferências</SectionTitle>
    <SectionDescription>Valem para todos</SectionDescription>
  </SectionHeader>
  <Card>
    <FieldGroup className="divide-y gap-0">
      {/* SettingRow, which is not a component */}
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle id={id}>Esconder valores</FieldTitle>
          <FieldDescription>Ao abrir o app</FieldDescription>
        </FieldContent>
        <Switch aria-labelledby={id} />
      </Field>
    </FieldGroup>
  </Card>
  <SectionFooter>
    Vale para este aparelho
    <LinkButton variant="link" size="inline" href="/dados">Ver dados <ArrowRight data-icon="inline-end" /></LinkButton>
  </SectionFooter>
</Section>
```

These sketches were not compiled [R]. `aria-labelledby` stands in for `htmlFor` on purpose: whether RAC's `Switch` and `Radio` accept shadcn's `id` and `htmlFor` on their label was not tested.

---

## 4. Money and identity

**Can each be thin, over shadcn's pieces? Does any need its own CSS?** All lines are my estimates [R]. Nothing below needs its own CSS file [R]. Three things need the theme's CSS, listed after the table.

| Piece               | Thin?                              | Over what                                                                                | Needs own CSS?                                                                               | What makes it ours                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`formatMoney`**   | Moved, 20 lines                    | Nothing; app's `format.ts`                                                               | No                                                                                           | Decimal strings, never a float. `Intl.NumberFormat.formatToParts("12345678901234.56")` in pt-BR returned exact parts [M: Node 24]; browsers were checked for `format` only [V: `docs/direction.md`]                                                                                                                                                      |
| **`Amount`**        | About 50 lines, on `formatToParts` | Nothing from shadcn. A cva and spans                                                     | No: `size`, `tone`, `sign` as cva; currency and cents with `text-[.55em]`, or a text style   | The first principle: tabular, real minus `−`, thin gaps, stepped-down `R$` and cents, sign rule, full text for screen readers, parts `aria-hidden`, as in `aurum.js`. Sizes from tokens. `hidden` is never used on screens † but real for a finance app                                                                                                  |
| **`Delta`**         | About 20 lines                     | Lucide arrow, `Amount`'s percent                                                         | No                                                                                           | Plain text, not `section-cards`' Badge. The chip in `aurum.css` is dead: `Delta` never renders it [V]. Sign in text, so colour is not alone [V: prototype has "Up", "Down" in `bs-sr`]                                                                                                                                                                   |
| **`AmountInput`**   | About 25 lines                     | `InputGroup`, `InputGroupAddon`, `InputGroupInput`; one value edit for 64 high and 28/36 | No                                                                                           | **Not** RAC's `NumberField`: it works in numbers [R: types read, not behaviour]; decimal strings stay exact. `inputMode="decimal"`. One screen, so it stays in the app                                                                                                                                                                                   |
| **`AllocationBar`** | About 30 lines                     | `DescriptionList` for the legend; own bar                                                | No: `forced-color-adjust-none` exists [V: Tailwind's source], so segments keep their colours | `role="img"` with a text label, as in `aurum.js`. **Gap:** against white, `chart-2` is 2.0:1, `chart-3` 2.65:1 and `chart-5` 1.63:1, under the 3:1 of 1.4.11 [M]; the legend's text carries the values, which may be enough [R]                                                                                                                          |
| **`BudgetBar`**     | About 25 lines; **in the app**     | `Progress`, `ProgressLabel`, `ProgressValue`, `ProgressTrack`, `ProgressIndicator`       | No                                                                                           | Warning at 80%, over at 100%, 138% as its value text. RAC's `Meter` is the more exact role for spent of a limit [R]; shadcn has no piece. Keep `Progress`, raise it once as 6.22                                                                                                                                                                         |
| **`IconTile`**      | About 25 lines; own                | A cva `span`. `ItemMedia` holds it                                                       | No: tones map to `bg-cat-n-soft text-cat-n` utilities                                        | Sizes 32, 36, 40, 48; square or round; 8 categories + neutral + primary + gold + solid; a child for the owner marker. **Merges 3 tile systems**                                                                                                                                                                                                          |
| **`TickerChip`**    | 1 axis on `Badge`                  | `Badge shape="code"`                                                                     | No                                                                                           | Dies as a component. `render` carries a link [V]. `min-w-13` for columns                                                                                                                                                                                                                                                                                 |
| **`ScopeChip`**     | About 10 lines; **in the app**     | `Badge` + `AvatarGroup`                                                                  | No                                                                                           | Knows people                                                                                                                                                                                                                                                                                                                                             |
| **Chart pieces**    | Thin                               | `ChartContainer`, `ChartTooltip`, `ChartLegend`, Recharts                                | No                                                                                           | `--chart-1` to `-5` in shadcn; **the prototype has 6**: add one. `ChartConfig` takes any colour [V]. Axis ticks and months can come from the app's `chart.ts` (`roundTicks`, `axisMonth`, `useWidth`). Tooltip amounts through `formatMoney`. Recharts' `accessibilityLayer` [V: `2-shadcn.md`]. **Keep the app's table beside each chart** (0128, 0129) |

### What the theme's CSS must hold, and nothing per component [R]

1. **Text styles:** a `--text-*` with its line height, and tabular or case where tokens say. Note the merge problem: `cn("text-label text-income")` drops the size unless `cn` is configured [M: `docs/direction.md`].
2. **The scope class for the dark surface,** from 0087's list.
3. **The rail's paint,** a gradient and a glow. It reads better as one `@utility` than as one long arbitrary class.

**A rule for the look.** Long class strings are shadcn's way, so screens should still hold none of them: a `Section` or `Stat` holds the classes, screens only name pieces [R]. The sketches break this in places (`gap-0`, `divide-y`), which is a reason to give `ItemGroup` and `FieldGroup` a `variant="divided"`.

---

## 5. What not to build, and what stays in the app

### Do not build [R unless marked]

| What                                                                                                 | Why                                                                            |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `StatCard`, `StatStrip`, `TopCard`, as separate pieces                                               | One `Stat`                                                                     |
| `Sparkline`                                                                                          | 0 screens [M]                                                                  |
| `BottomNav`                                                                                          | 0 screens [M]; `Sidebar` already moves to a drawer; 6.13                       |
| `SegmentedControl`, `IconButton`, `TextLink`, `SettingRow`, `TickerChip`, `EmptyState`, `Card` zones | Each is a variant or a composition, section 1                                  |
| `TransactionRow` in Aurum                                                                            | A recipe; the app names it                                                     |
| `Icon`, custom `Tooltip`, `NavList`                                                                  | Section 2                                                                      |
| `p-vnav`, `p-stack`, the Delta chip, `lg` Button, Card's `eyebrow`, `divided`, `TextField pill`      | Never used [M, V]                                                              |
| A Data Table with TanStack                                                                           | No sort or pagination in the app today; RAC's Table has sort and selection [V] |
| Accordion, Carousel, Command, Menubar, Resizable, AI pieces (`attachment` aside)                     | No screen asks [M]                                                             |
| A layout helper per page shape                                                                       | Tailwind                                                                       |
| The prototype's fake PDF `p-paper`                                                                   | A drawing of a document                                                        |

### Stays in the app [R]

**Rule proposed: a piece moves to Aurum when it holds no domain word and has two screens or more.**

- **Knows people or accounts:** `PersonSwitch`, `ScopeChip`, `Scope`, joint marker, owner marker's data.
- **Knows finance objects:** `TransactionRow`, `BudgetBar`, goal, budget and invoice cards, upcoming list, installment row, credit card, buy and sell mark.
- **One screen:** month switcher, ranking, target track, stepper, resolution rows, mapping list, PDF viewer, dropzone, icon picker, tree rows, facet list, record switcher, progress ring.
- **Routing or data:** `AssetReference`, `Lens`, `Path`'s data, `AppSidebar`, `Brand`.
- **Vocabulary:** `design/Icon`'s 41 concepts, `reference` if blue stays, `texts`, `LanguageProvider`'s locale.

`Money` itself goes to Aurum (`Amount`, `formatMoney`, `Delta`), though it is domain, because it is what the library is for.

### What the app's edits teach, read from the diff against `aria-mira`

Normalised [M]. `cn-*` classes and `IconPlaceholder` are the CLI's install work, not the app's: the trial's installed files have 0 `cn-font-heading` [M].

| Edit                                                                                                                                       | Files                              | Lesson                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `"Close"` → `texts.close`                                                                                                                  | `dialog`, `sheet`                  | **Keep.** Language must be passable in all 16+ strings                                                        |
| `text-[0.625rem]` → `text-overline`, 10 to 11 px                                                                                           | `badge`, `button`, `dropdown-menu` | **Keep the principle.** Nothing under the type scale; a test refused `text-[0.8rem]` [V: `docs/direction.md`] |
| Table: container with border and `bg-card`; head `bg-muted`; no `border-b`; `px-3`, `h-9`, `h-10`, `first:pl-4`, `last:pr-4`; `text-label` | `table`                            | **Keep edge padding and the container.** Head and hairlines conflict with the prototype, 6.4                  |
| A filter removing `max-w-*` from `className`                                                                                               | `table` (0147)                     | **Drop.** Policing classes at run time is a sign callers should not pass them                                 |
| `                                                                                                                                          | undefined`, conditional spreads    | `select`, `dropdown-menu`                                                                                     | **Expect them:** the app's `exactOptionalPropertyTypes` caused 6 errors in the trial [V: `docs/direction.md`] |
| `SelectInput` removed                                                                                                                      | `select`                           | Unused; trimming is fine                                                                                      |
| `Sheet` written by hand, 53 lines                                                                                                          | `sheet`                            | **Now replaceable** by upstream's. Keep required `aria-label`                                                 |
| `DateField` written by hand                                                                                                                | `date-field`                       | **Keep,** no upstream                                                                                         |
| `checkbox`, `radio-group`, `tabs`, `card` unused; `design` goes to RAC                                                                     |                                    | Why was not recorded in what I read. The sizes of `mira` may be why [R]                                       |

Everything else in `ui/` is identical to upstream: `radio-group` and `textarea` ratio 1.000, `tabs` 0.995 [M].

---

## 6. Disagreements and open questions

Each is one point. Recommendations are [R]; facts carry their mark.

### Inside the prototypes, or between them and what exists

| #    | Point                                         | What is drawn                                                                                               | Recommendation                                                                                                                                                                             |
| ---- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 6.1  | How is a transfer shown?                      | Red "− R$ 1.000,00" on dashboards, muted without a sign on Transactions [V: seen in the screenshots]        | Muted, no sign, everywhere: it moves no wealth, and the footnote already says so                                                                                                           |
| 6.2  | How is a period chosen?                       | `SegmentedControl` 7, `Select` on Reports, text in the eyebrow, filter chip, month stepper [M, †]           | `ToggleGroup` for a range kind; stepper when moving through months. Drop the other two                                                                                                     |
| 6.3  | Side panel beside the page, or over it?       | Beside on 3 screens, sticky; app and 7.37 over it                                                           | Over it, with `Sheet`: keeps the table's width, works narrow, and the app's 8 uses already do so                                                                                           |
| 6.4  | Table head and row lines?                     | Prototype: white head, a hairline per row. App's 0097: grey head, no lines                                  | Prototype's: it is part of the look, and hairlines help reading wide rows. The app's container and edge padding stay                                                                       |
| 6.5  | KPI: one divided box or separate cards?       | Prototype one box, dashboards and `p-kpis`; app separate `TopCard`s                                         | One box when figures belong together: it is the recognisable shape. `Card` + `Stat` when one opens a panel                                                                                 |
| 6.6  | Tile size?                                    | 36 by class, 40 in rows, 32 and 48 elsewhere [V]                                                            | Three sizes, 32, 40, 48. 36 was drift                                                                                                                                                      |
| 6.7  | Does a tile's colour mean identity or status? | Book: identity, for KPI tiles. Reports' insights tint by good or bad, a done goal turns gold †              | Identity only. Status goes in text or `Badge`                                                                                                                                              |
| 6.8  | Is the scope shown twice?                     | Rail's switch on 29 screens, and a chip atop each page                                                      | Keep both for now, since the chip says a page's scope when it differs (`titular da nota`), but make the rail's a 3-way `ToggleGroup`, not the block's dropdown: one click, visible options |
| 6.9  | Current item's mark?                          | 0084's 4 px left mark; book says no coloured left borders                                                   | Keep the mark. 0084's reason is WCAG 1.4.11, and the book's is taste                                                                                                                       |
| 6.10 | IconButton round or square?                   | Round by default in code; book says pills are not for buttons; `--square` unused †                          | Square, `rounded-md`, as shadcn's: fewer shapes. The bell can stay round if the owner likes it                                                                                             |
| 6.11 | Long forms in a dialog?                       | Book: 5 fields, 440. Drawn: 10 and 11 controls, 520 and 640 †                                               | Widths 440 and 640, with the rule relaxed. A longer form is a page                                                                                                                         |
| 6.12 | Selected state: which look?                   | Ink ring, ink underline, white chip, primary fill, primary-soft †                                           | One per kind: choice = ring, segment = chip, tab = underline, row = soft, pager = fill. Add a token for the ring                                                                           |
| 6.13 | Small-screen navigation?                      | BottomNav in the book, 0 screens; strip in 0073 and the app; `Sidebar` drawer                               | The drawer, with a top bar holding `SidebarTrigger`. shadcn's way, and the rail's 15 items do not fit a bottom bar                                                                         |
| 6.14 | Gold's limits?                                | Gold-edged "new" block; "Nova" flag; gold KPI tile; attention count. Rail's glow gone by 0087               | Gold stays small: no gold panels. Bring back the glow, as a theme utility: it is cheap and identifying                                                                                     |
| 6.15 | PDF chip red?                                 | `expense` colour for a file type, at weight 700 †                                                           | Neutral. Red means money out or danger                                                                                                                                                     |
| 6.16 | Row shapes?                                   | `TransactionRow` 65 high, date at right, tile 40; ledger row 61, time as meta, tile 36 †                    | Same parts, two densities. Date position by context is fine                                                                                                                                |
| 6.17 | Link colour?                                  | Prototype ink, no underline; app's `reference` blue, underline on hover                                     | Ink, as drawn, with underline on hover; inside running text, always underlined (1.4.1)                                                                                                     |
| 6.18 | `R$` in a column?                             | Prototype types it in each cell, 41 times on Investments †; app's 0097 drops it where the header says reais | The app's, in dense tables; `Amount` gains `currency="never"` or similar                                                                                                                   |
| 6.19 | Column widths and gaps?                       | 200 to 560, gaps 24, 32, 40 with no rule †                                                                  | Two widths, 320 and 240, gap 24; dashboards 2:1 at 48                                                                                                                                      |
| 6.20 | Bulk actions?                                 | Checkboxes on 2 screens, no action bar drawn †                                                              | Not until an action is defined. Drop the column in the first version                                                                                                                       |

### Open questions, with a recommendation

| #    | Question                                                                                    | Recommendation                                                                                                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 6.21 | Parts or props? The app's 0172 wants `label hint error`, and shadcn gives parts             | **Parts in Aurum, as shadcn's.** The app's `design/` may keep a few prop wrappers of 15 lines, where a screen repeats the same thing: `Select`, `TextField`. Otherwise, each adoption has an API translation to maintain |
| 6.22 | Spent of a limit: `Progress` or a real `Meter`?                                             | `Progress` for now; raise with the screen-reader script. Not worth a new piece yet                                                                                                                                       |
| 6.23 | Recharts for the charts?                                                                    | Adopt `Chart` for new charts. Leave `EvolutionChart` and `PriceChart` until they need work, since they are tested and drawn in pt-BR. Measure the bundle on the first one: not measured here                             |
| 6.24 | Variant names? 0076 keeps `primary`, `md`                                                   | Take shadcn's names. An agent, a block or an example then works untouched; only `accent` is new                                                                                                                          |
| 6.25 | How far to diverge inside `sidebar.tsx`, 714 lines?                                         | Edit the file, record the upstream version in it, and expect not to re-fetch. Keep each edit small and listed: eight, in section 2                                                                                       |
| 6.26 | Do link pieces work with TanStack Router?                                                   | **Test first, it decides `Sidebar`'s shape.** `createLink(SidebarMenuButton)` or RAC `RouterProvider`. It also applies to `LinkButton`, `Item href`, `Tab href`, `Row href`, `Pagination`                                |
| 6.27 | Should the focus and forced-colours repairs be done in one sweep?                           | Yes, the first commit after adoption: `outline-none` → `outline-hidden` in 19 files, and marks for selected states. Widen the sweep check first, so it fails first                                                       |
| 6.28 | Does `ItemGroup`'s `role="list"` stay?                                                      | Set `role="listitem"` on `Item` when inside one, by context; report upstream if the owner agrees                                                                                                                         |
| 6.29 | Should the upstream reports be sent? Item's roles, Aria's `div` menu, indeterminate's check | Optional; the owner's call, as sending them is posting publicly                                                                                                                                                          |

---

## 7. What could not be checked

- **Nothing was rendered for this report.** No proposed edit was compiled, or run through axe or a screen reader. The sketches are illustrations. Gaps about forced colours are from reading the classes, plus the earlier trial's screenshot.
- **`sidebar.tsx` was not run with TanStack Router** (6.26). Nor was `FieldLabel htmlFor` to a RAC `Radio` or `Switch` `id` (1.8).
- **Not read:** whether RAC's tooltip closes on scroll or resize; Attachment's semantics; whether `Radio` is a `label` is from memory of RAC; the RAC bulk-selection pattern in full; blocks `sidebar-02`, `04` to `06`, `09` to `15`, `login-02` to `05`, `signup-*`; and the Base UI or Radix versions, apart from `SidebarMenu`.
- **Recharts:** its bundle cost, and its accessibility in practice, were not measured. Its chart examples other than `chart-example` were not read.
- **Prototype counts marked †** come from `7-prototypes.md`, by regular expressions on inline styles; I checked class-based counts, not those. Its counts of class use matched mine wherever compared. Screens were looked at through 3 screenshots of my own (Transactions, DesktopGold, Budgets) plus markup.
- **App counts** are for `f489bb0`. Another session may be moving that checkout, as the earlier report noted.
- **Line estimates in section 4 and own-code totals are guesses,** bounded only by the trial's 155 lines of own pieces, where `Amount`, `Delta` and `TickerChip` took 46 [V: `docs/direction.md`].
- **Contrast figures are computed** from the token values in `7-prototypes.md`, with alpha blended over the named ground; they were not read from a browser.
- **The base style is undecided.** Every height above is the prototype's; how many edits it takes depends on `nova` against `vega`, which `docs/direction.md` already leaves open.
