# Card

The basic container: a `surface` panel with a `line` border, `radius-lg` and `shadow-sm`.

**Props** — `title` · `subtitle` · `action` (a node on the right of the header, e.g. a ghost Button “View all”) · `variant`: `raised` (default) | `flat` (no shadow) | `sunken` (`surface-sunken`, no border) · `flush`: body without horizontal padding, for lists of TransactionRow · `children`.

**Use** — Group one idea per card. Gap between cards is `space-4` on mobile and `space-6` on desktop. Don't nest raised cards; use `sunken` for an inner panel.
