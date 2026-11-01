# Button

Triggers an action. One `primary` button per view region; everything else is `secondary` or `ghost`.

**Props** — `variant`: `primary` (graphite) | `accent` (gold, `on-gold` text) | `secondary` | `ghost` | `danger` (default `primary`) · `size`: `sm` | `md` | `lg` (32/40/48px, the `control-*` tokens) · `icon` / `iconRight`: an Icon name · `block`: full width · `loading`: spinner + disabled · `href`: renders an `<a>` with the same look, for navigation · all native `<button>` attributes. Children: a short verb label.

**Use**
- Labels are verbs in sentence case: “Add transaction”, “Save budget”. No trailing punctuation, no emoji.
- `primary` fills with `primary` and `on-primary` text; `secondary` is `surface` with a `control-border` outline.
- `accent` (gold) only for the one action you want to pull the eye to on a screen — usually “New transaction” in the page header. At most one per screen; never next to a primary button.
- `danger` (outlined in `expense`) only for destructive confirmations such as deleting an account.
- Put the leading `icon` only when it adds meaning (`plus` for add, `download` for export).

**Don't** — stack two primary buttons side by side; use `danger` for ordinary expenses.
