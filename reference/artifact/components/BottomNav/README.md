# BottomNav

Mobile navigation: 4 destinations plus an optional central add action.

**Props** — `items`: `[{id, label, icon, href?}]` (with `href` the item is a link), and one `{id, label, icon, primary: true}` for the floating add button · `active` + `onSelect(id)` or `defaultActive`.

**Use** — Below `breakpoint-md`. Labels one word. The primary item opens the add-transaction dialog; it never becomes “active”.
