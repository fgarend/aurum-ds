# StatStrip

Several KPIs in one card, side by side, separated by hairlines — the compact alternative to a grid of StatCards.

**Props** — `items`: `[{label, value, icon?, highlight?, delta?, deltaLabel?, invertDelta?, breakdown?}]` — `breakdown: [{label, value, initials, tone}]` adds a compact per-person line under the delta (household view) (2–5 items; columns follow the count) · `layout` (`default` | `side`) · `iconVariant` (`soft` default | `solid` | `outline`) · `iconShape` (`square` default | `circle`) · `currency` / `locale` · `hidden`.

**Layouts**
- `default` — a 32px icon tile beside the label, the value below (`Amount` size `kpi`), then the `Delta`.
- `side` — a 48px icon tile on the left with label and value (24px) beside it, and the `Delta` under both. The look of the Aurum dashboard: `layout="side" iconVariant="solid" iconShape="circle"` with `highlight: true` on the balance (gold tile, graphite for the rest).

**Icon tiles** — same rules as StatCard: `soft` light grey, `solid` graphite (gold when `highlight`), `outline` hairline only; square or circle. One combination per strip, at most one highlighted item.

**Use** — The top of a dashboard or report, under a `Section` heading whose footer carries “Updated …” or the period result. Below 720px the strip wraps to two columns. Use StatCard when each metric needs its own footer line.
