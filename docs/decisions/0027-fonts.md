# 0027. Fonts

- Status: Accepted; partly superseded by 0070: fonts.css, beside AurumRoot
- Date: 2026-11-01

## Context

The tokens name Geist for text and Geist Mono for code. The artifact loads
both from Google Fonts, which tells Google of every visit, with the visitor's
address. For a money app that is a privacy cost, and a third party the app
depends on to draw its text. Both fonts are under the SIL Open Font License
1.1. Fontsource publishes them as npm packages, built from the same files
Google Fonts serves.

## Decision

- **The package serves the fonts**, with no request to a third party.
- **Fontsource's packages are dependencies** of the package:
  `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`. The
  app's bundler takes the font files from them.
- **The variable fonts, in their normal style only.** One file per family
  covers every weight, and no text style uses italics.
- **Every character set is included.** Each set is a file of its own, and
  the browser downloads only the sets a page uses: Portuguese needs only the
  Latin one.
- **`src/fonts/fonts.css` imports them**, and the app loads it with
  `tokens.css`.
- **The token font stacks name the variable families first**:
  `"Geist Variable"` and `"Geist Mono Variable"`, as Fontsource registers
  them, before `Geist` and `"Geist Mono"`. This is the first change to the
  tokens since they came from the artifact (decision 0025).
- **A test checks that each family the tokens name first is the one a
  dependency loads.**
- **The license comes inside each Fontsource package.** The package itself
  ships no font file.

## Alternatives considered

- **Google Fonts, as the artifact does.** Nothing to ship, but every visit
  reaches Google, and nothing works without it.
- **Leaving the fonts to the app.** Nothing to ship, but the design system
  would not deliver its own type.
- **Font files copied into the repository**, declared in `tokens.json` for
  the compiler's `@font-face`. A self-contained package in the artifact's own
  grammar, but binary files in git, updated by hand.
- **Static weights.** Three files for Geist, larger together than the single
  variable one.
- **An `@font-face` of our own named `Geist`.** The tokens would stay as the
  artifact has them, but it depends on the app's bundler resolving package
  paths in `url()`, unverified, and repeats Fontsource's character ranges.

## Consequences

- The app needs a bundler that handles `@import` and `url()` in CSS.
- When the app publishes a build with the fonts, it carries their license
  notice.
- The tokens' font stacks differ from the artifact's.
- How the fonts actually render is checked in a browser, with the visual
  tests.
