# Guidelines

The living copy of the brand book in the Claude Design artifact (decision 0031). It changes where a decision changes the
design, and each change names its decision.

Aurum is a quiet, minimal design system for products that handle money — personal finance first (income, expenses, budgets, investments), but generic enough to reuse in any calm, data-dense app. A light sea-salt ground with white cards, graphite near-black for text and structure, one gold accent used sparingly, hairline borders over heavy shadows, and numbers that are always tabular, signed and legible.

## Principles

- **Calm over clever.** Graphite and warm neutrals carry the interface; `gold` is the single accent and appears in a few small places per screen. Colour is otherwise reserved for meaning.
- **Numbers first.** Amounts are the content. Give them size, tabular figures and the `Amount` component — never hand-format money.
- **Honest semantics.** Money in is `income`, money out is `expense`, invested money is `invest`. A balance is neutral `ink`, not green.
- **Never colour alone.** Every signed amount carries + or −; every delta carries an arrow; every status carries a word.

## Content fundamentals

- Sentence case everywhere: “Add transaction”, “Monthly overview”. Uppercase only for `text-overline` nav section labels.
- Address the user as “you”; the product never says “I” or “we”. Short, plain sentences. No exclamation marks, no emoji.
- Buttons are verbs (“Save budget”, “Export”); empty states say what's missing and the next step (“No transactions yet — add your first expense or import a statement.”).
- Money: locale-formatted through `Aurum.formatMoney` / `Amount` (default `pt-BR`, `BRL`). Use the true minus “−” (U+2212), a thin space after the sign, and always two decimals except in charts and compact KPIs.
- Percentages one decimal (“4,2%”); dates relative when recent (“Today”, “Yesterday”), otherwise short (“14 Oct”).
- Copy is passed in by the consumer — components ship English defaults (`ofLabel`, `pendingLabel`, `closeLabel`…) you override per locale.

## Visual foundations

Tokens are named here as `tokens.json` names them. In CSS, each token is a custom property with the `au-` prefix
(`canvas` → `--au-canvas`), and each text style is a class (`text-body` → `.au-text-body`) (decision 0025).

### Colour

- Ground: `canvas` for the page, `surface` for cards, sidebar, dialogs and inputs, `surface-sunken` for tracks, tiles and recessed panels, `surface-hover` for hover.
- Text: `ink` for content and headings, `ink-muted` for secondary text and labels, `ink-subtle` for metadata, dates and placeholders. All three pass 4.5:1 on `canvas`, `surface` and `surface-sunken`. `ink-disabled` is for disabled labels only.
- Brand: `primary` (graphite) for primary buttons, selected states, checked controls and links; text on it is `on-primary`. `primary-soft` is a warm neutral tint for selected and informational backgrounds.
- Accent: `gold` for the accent Button and IconButton (`variant="accent"`), the floating add button, the brand mark, the current icon in a navigation on the dark surface, the active BottomNav pip, the one highlighted KPI tile and chart series 2. Text on gold is `on-gold`; gold as text is `gold-ink`. Keep gold to small areas — never a page or card background. `sand` is decorative only.
- Lines: `line` for card borders and dividers, `line-strong` for stronger dividers, `control-border` for the resting edge of fields and secondary buttons, `control-border-hover` for hover and checkbox edges.
- `inverse` (graphite) is the one dark surface: an area with `data-au-surface="inverse"` paints it, and inside it the same tokens take the values for it, so components follow with no prop. An app may paint it as a quiet gradient (`inverse-top` → `inverse` → `inverse-bottom`, darkest at the top). Hover and active fills are translucent white so they follow it. Finance and chart colours have no values for it yet.
- Ground vs cards stay close (`canvas` → `surface` is ~1.05:1): separation comes from the `line` border, not from a contrasting background. Keep `canvas` light — no patterns or textures on it.
- Finance semantics, each with a `*-soft` tint for tiles, chips and alerts:
  - `income` — money in, positive change, success (`success` is an alias). A clear green. Green and red are told apart by hue, so every amount and delta also carries its + / − sign or arrow — never colour alone.
  - `expense` — money out, negative change, over budget, destructive (`danger` is an alias).
  - `invest` — investments and portfolio.
  - `warning` — near a limit, pending.
- Amounts in transaction lists are only ever `income` (green, +) or `expense` (red, −) by sign — never gold, invest or neutral. What the money was for is shown by the category tile: `cat-1` … `cat-8` (ochre, teal, caramel, plum, slate, sage, rose, graphite), each with a `cat-n-soft` tile background. Categories never colour amounts, and `income`/`expense` never colour categories.
- KPIs: StatCard and StatStrip icon tiles are identity, never status — `soft` (light grey), `solid` (graphite, with `gold` on the one highlighted headline metric) or `outline`, square or circle; one combination per screen. The dashboard default is the side layout with solid circular tiles. Meaningful colour appears only in the `Delta` text.
- Deltas: for a metric where up is good (balance, income, invested) a rise is `income`; for spending pass `invertDelta` so a drop is `income`.
- Charts: series in order `chart-1` … `chart-6` (graphite, gold, grey, teal, stone, mauve); group the rest as “Other” in `line-strong`. Don't use `income`/`expense` for categories — only for in/out.

### People and household

- An app can hold several people (e.g. a couple) plus a household view of everyone together. A switch of people (“Visão”), a component of its own in the navigation's area or the top bar, chooses whose data every screen shows; shared registries (institutions, issuers, assets, categories) ignore it.
- Each person gets one `tone` (1–8, from the category palette) used everywhere: Avatar, the owner marker on TransactionRow, StatStrip/StatCard `breakdown`. Never use `income`/`expense` or `gold` as a person colour.
- In the household view: show owner markers on mixed lists, a per-person `breakdown` under KPIs, and tag transfers between people as internal (they are left out of totals). In a single-person view hide owner markers.
- Joint accounts belong to several people with shares; individual views count the person's share, the household view counts the account once.
- Average cost and tax figures are per person (per CPF) — never merged across people.

### Type

- One family, Geist (`font-sans`), served by the package from its variable font (decision 0027); Geist Mono (`font-mono`) for IDs, tickers and account numbers (`text-code`).
- Scale: `text-amount-xl` 36/40 for hero balances, `text-display` 32/40 for the one page title, `text-amount-lg` 22/28 for secondary totals, `text-title-lg` 24/32, `text-title` 18/24, `text-heading` 15/22, `text-body` 14/20 (default), `text-body-strong` 14/20 500, `text-label` 13/18 500, `text-caption` 12/16, `text-overline` 11/16 uppercase.
- Weights: 400 for text, 500 for labels and row titles, 600 for headings and amounts. No bold (700).
- Every number that can line up uses tabular figures: `Amount` does it; elsewhere add the `au-num` class (decision 0030).

### Spacing & layout

- 4px base: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 · `space-8` 32 · `space-10` 40 · `space-12` 48 · `space-16` 64.
- Pages are built from `Section`s: a section's title, subtitle, actions and footer sit on `canvas`, outside the box; the content itself stays in `Card`s (KPI cards, row lists, budget bars, charts). The card holds only data — never its own heading. Sections are `space-12` apart on desktop (`space-8` on mobile).
- Card padding `space-5`; gap between cards `space-4` (mobile) / `space-6` (desktop); page padding `space-4` (mobile) / `space-10` (desktop).
- App shell: `AppLayout`, with the app's rail in its navigation area (`navigation-width`, 248px, usually on the dark surface) built with `NavList`, and a content column up to `content-max` (1360px), centred. Below `breakpoint-md` (768px) the navigation sits at the top, where a `NavList` with `orientation="responsive"` is one line that scrolls, and cards stack.
- Controls are `control-sm` 32, `control-md` 40 (default) or `control-lg` 48 tall — nothing in between.

### Shape, borders, elevation

- Radii are small and quiet: `radius-sm` 4 (checkboxes), `radius-md` 6 (buttons, inputs, nav items, tiles, alerts), `radius-lg` 8 (cards, tables), `radius-xl` 12 (dialogs, sheets). `radius-pill` only for badges, switches, progress tracks and avatars — not for buttons or fields.
- Borders do the work: cards have a 1px `line` border plus `shadow-sm`. `shadow-md` only for floating elements (menus, the add button), `shadow-lg` only for modal dialogs. No gradients, no glass, no coloured left-border accents.

### Forms

- Fields (`TextField`, `Select`, `AmountInput`) are white, 40px tall (`control-md`), `radius-md`, a 1px `control-border` edge and `shadow-xs`. Label above in `text-label`, hint or error below in `text-caption`, 6px apart.
- Hover darkens the edge to `control-border-hover`. Focus turns the edge `focus-ring` and adds a 3px `focus-halo`; an error keeps the `expense` edge and uses `danger-halo`.
- The resting edge is deliberately soft (≈1.5:1); the label, white fill and shadow identify the field, and the focus state is ≥4.8:1. Don't darken `control-border` to compensate for a tinted background — keep fields on `surface` or `canvas`.
- Placeholders are examples (“e.g. Groceries”), never a replacement for the label. Group optional settings (switches, checkboxes) in a `surface-sunken` panel below the main fields.

### States & motion

- Hover: `surface-hover` fill on neutral elements, `primary-hover` on primary fills; pressed `primary-pressed`.
- Focus: a solid 2px graphite `focus-ring` outline with 2px offset on buttons, nav items and toggles; fields use the graphite border + gold `focus-halo` treatment above. Never remove it.
- Disabled: `surface-sunken` fill and `ink-disabled` text; no opacity tricks on text.
- Motion: 150ms ease for colour and toggles, 300ms ease for progress fills. No bounces or parallax; respect `prefers-reduced-motion`.

## Iconography

- Line icons from Lucide (decision 0029), drawn by the `Icon` component with `currentColor`: 24px grid, round caps and joins, no fills. Drawn with a 1.5 stroke, at 16, 18, 20 (the default) or 22 px; the app passes the drawing: `<Icon icon={Wallet} />` (decision 0056).
- Sizes: 16 in small controls and badges, 18–20 in inputs, rows and buttons, 22 in BottomNav.
- Category icons sit in a 40px `radius-md` tile in their category colour (`cat-n` on `cat-n-soft`), or `surface-sunken` when uncategorised.
- No emoji, no filled or duotone icons, no mixing in another icon family. Missing an icon? Take it from Lucide.
- There is no logo: products built on Aurum set their name in `text-heading` Geist 600.

## Components

The catalogue below is the artifact's. This package builds it in React 19 (decision 0019), one component at a time, starting with what the app's shell and People screen need.

- **Actions** — `Button`, `IconButton`
- **Forms** — `TextField`, `AmountInput`, `Select`, `Checkbox`, `Switch`, `SegmentedControl`
- **Layout & display** — `AppLayout`, `Section`, `Card`, `Badge`, `Avatar`, `Icon`
- **Feedback** — `Alert`, `ProgressBar`, `EmptyState`, `Dialog`
- **Navigation** — `NavList`, `NavSection`, `NavItem`, `BottomNav`
- **Finance** — `Amount`, `StatCard`, `StatStrip`, `Delta`, `TransactionRow`, `BudgetBar`, `AllocationBar`, `Sparkline`
- Helpers — `Aurum.formatMoney(value, {locale, currency, signed})`, `Aurum.formatPercent(value, {locale, decimals})`.

Typical dashboard: a rail with `NavList` · page title · a `Section` (title, period switch, “updated” footer) over a `StatStrip` (`layout="side"`, solid circular icons, balance highlighted) or a grid of four `StatCard`s (when each needs a context footer) · a `Section` over a flush `Card` of `TransactionRow` with a “View all” footer · `Section`s over a `Card` of `BudgetBar`s and a `Card` with the `AllocationBar`.

## Using Aurum in a project

- Wrap where Aurum begins in `AurumRoot` (`@fgarend/aurum-ds/AurumRoot`), once, above any layout: it brings the fonts, the tokens and the base styles, and draws no box of its own (decision 0070). Install it from a release's page, with no `git` needed: `"@fgarend/aurum-ds": "https://github.com/fgarend/aurum-ds/releases/download/vX.Y.Z/fgarend-aurum-ds-X.Y.Z.tgz"`, or from GitHub at the release's tag, which needs `git`: `"@fgarend/aurum-ds": "github:fgarend/aurum-ds#vX.Y.Z"`, where `X.Y.Z` is a version from `CHANGELOG.md` (decisions 0037 and 0051).
- Without React, keep the tokens and type scale and reproduce components from their READMEs — the values all live in tokens.
- Theme it for another product by changing `primary*`, `on-primary`, `primary-soft` and the four accents; keep the semantic finance colours and the contrast notes intact.
