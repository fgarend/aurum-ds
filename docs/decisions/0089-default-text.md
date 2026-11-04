# 0089. The default text

- Status: Accepted
- Date: 2026-11-04

## Context

`AurumRoot` set the font and the colour, but not the size, so text with no class came out
at the browser's 16px beside components at 14px, though the guidelines call `text-body` the
default.

## Decision

- **`AurumRoot` carries `au-text-body`**, so what is inside it inherits 14px on 20px. A class
  on the text, or the app's own CSS, wins over it (decision 0088).

## Alternatives considered

- **Leaving it to the app.** Nothing changes for it, but every app has to remember.
- **A rule in `.au-root`.** The same effect, with the type's values written twice.

## Consequences

- The app's text with no size of its own, inside the root, goes from 16px to 14px, which is
  smaller than a browser's default. Browser zoom still applies.
- `.au-root` alone, on an element of the app's, does not bring it.
