# 0033. Reference screenshots

- Status: Accepted
- Date: 2026-11-01

## Context

Each component in the artifact has a live preview, drawn in a frame that has
already loaded the artifact's tokens, its components' CSS and script, and
React 18 from a CDN, with Geist from Google Fonts. The components built here
will not be copies of them: their icons are Lucide's, their classes have the
`au-` prefix, and the tokens may change on purpose. The previews still are
the design's visual target, and they live only in Claude Design.

## Decision

- **The references are a visual target for review**, compared by eye with
  each component as it is built. How our own components' screenshots catch
  regressions is decided with screenshot approval.
- **`make reference` renders every preview into
  `reference/screenshots/<Name>.png`**, in Chromium, in the browser image, and
  is run on request: the snapshot is frozen, so the screenshots rarely
  change. Approving them is reviewing them in the commit.
- **Nothing is fetched**: React is the package's React 19, exposed as the
  globals the artifact's bundle reads (it only calls functions React 19
  keeps), and Google Fonts' import gives way to Geist and Geist Mono from
  Fontsource, the same files.
- **The tokens are the snapshot's own**, compiled without the prefix, which
  matches the artifact's compiler (decision 0026).
- **The window is the tokens' `content-max` wide, 1200 px**, and as tall as
  each preview's card, both grown to fit the content, at one pixel per
  pixel.
- **`make test` checks there is one screenshot per preview**, and no other.

## Alternatives considered

- **Comparing our components with the references automatically.** Hands-off,
  but only with a tolerance wide enough to let the small differences that
  matter through.
- **Fetching React 18 and the fonts as the artifact does.** Closer to the
  letter, but each render would depend on a CDN and on Google.
- **React 18 as an aliased development dependency.** The artifact's own
  React, but a second React to keep for no visible difference.
- **Our own tokens.** Already changed on purpose, and prefixed: the target
  would no longer be the original design.
- **A window 800 px wide.** Smaller images, but layouts drawn for the content
  width wrapped as the design never drew them.
- **Rendering the references in every `make test`.** Always fresh, but slow,
  for a snapshot that does not change.

## Consequences

- The screenshots show the artifact's icons, not Lucide's.
- A new Playwright image may draw a pixel differently: `make reference` runs
  again, and the changed screenshots are reviewed.
- The token compiler takes the prefix as an option, `au-` by default.
