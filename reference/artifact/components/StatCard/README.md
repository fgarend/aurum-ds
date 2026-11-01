# StatCard

A single KPI in its own card: label, icon, the value, the change versus the previous period and an optional context footer.

**Props** — `label` · `value` · `currency` / `locale` · `icon` · `layout` · `iconVariant` · `iconShape` · `highlight` · `delta` (percent change, e.g. `4.2` or `-3.1`) · `deltaLabel` (“vs last month”) · `invertDelta` (for spending: a drop is good) · `breakdown` (`[{label, value, initials, tone}]`: compact per-person values, for the household view) · `footer` (one line of context: “Salary and 1 freelance job”) · `sparkline` (optional numbers, drawn right of the delta) · `tone` (sparkline colour only) · `hidden` · `plain` (no box).

**Layouts**
- `default` — label top-left with a 32px icon top-right, the value (`Amount` size `kpi`, 28px), the delta, and the footer under a hairline. `iconVariant` defaults to `outline`.
- `side` — a 48px icon on the left with the label and value (22px) beside it; the delta and the footer sit together under a hairline below everything. Use it when the icon should carry the card.

**Icon tiles** — `iconVariant`: `soft` (light: `surface-sunken` with `ink-muted` icon), `solid` (coloured: graphite `primary` with a white icon), `outline` (1px `line` edge, no fill). `iconShape`: `square` (`radius-md`, default) or `circle`. `highlight` marks the one headline metric (usually the balance): gold in `solid`, `gold-soft` with `gold-ink` in `soft`, a gold edge in `outline`. Highlight at most one card per row.

**Recommended sets** — side · solid · circle with the balance highlighted (the dashboard default) · side · solid · square · side · outline · circle (the quietest). Keep one combination per screen.

**Use** — Four in a grid with `space-4` gaps under a `Section` heading, when each metric deserves its own context line. For a compact overview use `StatStrip`. Colour that means something (green/red) lives only in the delta; the icon tile is identity, not status — never tint it with `income`/`expense`. In narrow cards (under ~200px of content) the side layout shrinks the tile to 40px and the value to 19px so long amounts never clip.
