# Amount

Renders a money value with the right sign, currency, tabular figures and semantic colour. Use it for every amount in the UI.

**Props** — `value` (number; negative = money out) · `currency` (ISO code, default `BRL`) · `locale` (default `pt-BR`) · `decimals` (default 2) · `size`: `sm` | `md` | `lg` | `kpi` (28px, for StatCard/StatStrip) | `xl` · `tone`: `auto` (default: >0 `income`, <0 `expense`) | `neutral` | `income` | `expense` | `invest` | `muted` · `sign`: `auto` | `always` | `never` · `hidden` (masks as dots, keeps a screen-reader label from `hiddenLabel`).

**Use** — Balances and totals are `tone="neutral"` (a balance is not income). Transaction amounts use `auto`. The minus is a true minus (−), never a hyphen. At `xl` the currency and cents step down to `ink-muted`. `Aurum.formatMoney(value, {locale, currency, signed})` gives the same string for plain text.
