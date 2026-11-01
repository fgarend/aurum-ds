# AmountInput

The large money-entry field used when creating a transaction, budget or goal.

**Props** — `label` · `kind`: `neutral` (default) | `income` | `expense` (colours the figure and prefixes + or −) · `currencySymbol` (default “R$”) · `hint` · `error` · native input attributes (`value`, `onChange`, `placeholder` default “0,00”). The consumer parses the string; the field only sets `inputMode="decimal"` and tabular figures.

**Use** — One per form, at the top. 64px tall, 28px figures, the currency set off by a hairline divider; same edge, hover and focus treatment as TextField. Pair with a SegmentedControl (Expense / Income / Transfer) that sets `kind`.
