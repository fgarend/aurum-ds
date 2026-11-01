# Section

A page region whose heading and footer sit outside the box: title, subtitle and actions above, an optional footer line below — on `canvas` — with the content in Cards between them.

**Props** — `title` · `subtitle` · `eyebrow` (small uppercase label above the title) · `actions` (nodes on the right: ghost Buttons, SegmentedControl) · `footer` (a line of `text-caption` below the content: totals, “Updated 5 min ago”, a “View all” link) · `divided` (hairline rule above — only for long single-column pages) · `children` (usually one or more `Card`s or `StatCard`s).

**Use** — Take the heading out of the card, keep the content in it: the card then holds only data, and the page reads as titled regions instead of a grid of boxes. Gap between sections `space-12` on desktop, `space-8` on mobile; heading to content `space-4`.

**Don't** — put a Card around a Section, or repeat the section title inside the card. `StatCard` `plain` (no box) exists for dense KPI strips inside an existing card; it is not the default.
