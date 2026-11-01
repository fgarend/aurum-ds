# Delta

A change versus a previous period as text: a coloured arrow and percentage, then a muted label.

**Props** — `value` (percent, signed) · `invert` (a negative change is good, e.g. expenses) · `label` (“vs September”) · `locale`.

**Use** — Inside StatCard and StatStrip, beside totals in tables and section footers. Good changes are `income`, bad are `expense`, zero is `ink-muted`; the arrow and a screen-reader “Up/Down” keep it readable without colour. Prefer it over the old pill chip (`.bs-delta`), which stays only for very compact spots.
