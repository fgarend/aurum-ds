# TextField

A labelled single-line input with optional icon, prefix/suffix, hint and error.

**Props** — `label` · `hint` · `error` (string; turns the border and message `expense` and sets `aria-invalid`) · `icon` (leading Icon name) · `prefix` / `suffix` (short text such as “R$” or “%”) · `trailing` (a node, e.g. an IconButton) · `pill` (fully rounded — use for search) · all native `<input>` attributes.

**Use** — Always give a visible `label` except for search, where the placeholder and `search` icon suffice. Hints are one short sentence in `ink-subtle`. Errors say what to do: “Enter a date in this month”.
