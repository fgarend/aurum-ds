# BudgetBar

Spending against a limit, with automatic tone: `primary` under `warnAt`, `warning` from `warnAt` (default 80%), `expense` with an alert icon when over.

**Props** — `label` · `icon` · `spent` · `limit` · `warnAt` (0–1) · `currency` / `locale` · `ofLabel` / `leftLabel` / `overLabel` (copy for localisation; defaults “of”, “left”, “over”).

**Use** — Budgets page and dashboard card, one per category, sorted by % used. The percentage always shows as text.
