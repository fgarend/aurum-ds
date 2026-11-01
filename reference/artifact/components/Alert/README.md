# Alert

An inline message about the current screen — not a toast.

**Props** — `tone`: `info` (default) | `success` | `warning` | `danger` · `title` · `children` (one or two sentences) · `icon` (override) · `onClose` (shows a dismiss button) · `closeLabel`.

**Use** — Budget warnings, sync status, confirmations after import. Title states the fact (“Food budget at 92%”), body says what it means or what to do. `danger` uses `role="alert"`; the others `role="status"`.
