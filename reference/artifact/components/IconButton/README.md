# IconButton

A square, icon-only action (round hit area) for toolbars, card headers and dismiss buttons.

**Props** — `icon` (required, an Icon name) · `label` (required: becomes `aria-label` and tooltip) · `variant`: `ghost` (default) | `secondary` | `primary` | `accent` (gold) · `size`: `sm` | `md` | `lg` · `dot`: shows an `expense` notification dot · `href`: renders a link with the same look · native button attributes.

**Use** — `ghost` in headers and rows; `secondary` when it floats on canvas; `primary` for a single floating add action. Always pass a `label`.
