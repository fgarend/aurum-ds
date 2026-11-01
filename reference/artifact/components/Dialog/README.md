# Dialog

A modal for focused tasks and confirmations.

**Props** — `open` · `onClose` (Esc, scrim click and the close button call it) · `title` · `description` · `children` (form fields) · `actions` (buttons, right-aligned; primary last) · `inline` (renders without the scrim — for docs and previews) · `closeLabel`.

**Use** — Quick add/edit forms and destructive confirmations. Keep to one column, at most ~5 fields; longer flows get a page. The consumer manages focus return.
