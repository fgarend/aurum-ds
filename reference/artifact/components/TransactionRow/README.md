# TransactionRow

One line of the transaction list: category tile, title, meta, amount and date/status.

**Props** — `title` · `meta` (category · account) · `amount` (signed number) · `category` (1–8: the `cat-*` colour of the tile) · `categoryColor` / `categorySoft` (custom CSS colours for user-defined categories) · `icon` (category icon; default per kind) · `kind`: `income` | `expense` | `transfer` | `investment` (only picks the default icon; default from the sign) · `date` · `pending` (shows a warning Badge instead of the date) · `pendingLabel` · `recurring` · `owner` / `ownerTone` / `ownerLabel` (initials in a small person-coloured marker on the tile — use only in the household view, where rows from several people mix) · `tag` (short neutral label after the title, e.g. “internal” for transfers between people of the same household) · `onClick` (row becomes a button) · `currency` / `locale` · `hidden`.

**Colour rules** — The amount is always green (`income`) when money comes in and red (`expense`) when it goes out, always with a + or − sign — whatever the category, including investments and transfers. Colour that describes *what* the money was spent on lives only in the tile: each category gets one `cat-*` colour (icon in `cat-n` on `cat-n-soft`). No category → neutral tile.

**Use** — Inside a `Card` with `flush`, grouped by day under a `Section` heading. Keep the same category → colour mapping everywhere in a product.
