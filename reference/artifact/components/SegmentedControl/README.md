# SegmentedControl

Picks one of 2–4 mutually exclusive views or modes.

**Props** — `options`: `[{value, label, icon?}]` · `value` + `onChange(value)` (controlled) or `defaultValue` · `label` (aria label of the group) · `block` (stretch to full width).

**Use** — Period switches (Week / Month / Year), transaction kind (Expense / Income / Transfer), list/board views. More than four options → Select.
