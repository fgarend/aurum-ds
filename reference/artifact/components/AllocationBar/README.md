# AllocationBar

A single stacked bar with a legend: portfolio allocation, spending by category, income sources.

**Props** — `items`: `[{label, value, color?}]` (colours default to `chart-1` … `chart-6` in order) · `showAmounts` · `legend` (default true) · `currency` / `locale`.

**Use** — Sort items largest first; at most six — group the rest as “Other” with `color: 'var(--line-strong)'`. Percentages are always in the legend, so the bar never relies on colour alone.
