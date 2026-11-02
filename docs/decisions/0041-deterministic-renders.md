# 0041. Deterministic renders

- Status: Accepted
- Date: 2026-11-02

## Context

`make reference` renders the artifact's previews and the prototype's screens
(decisions 0033 and 0035), and its screenshots are reviewed in the commit. In
four runs, six of the 57 files changed from run to run, so a review could not
tell a real change from noise. Two causes were measured. The design moves: a
spinner turns, and borders change color over 0.15 s, so a capture could catch
either midway. Chromium also rasterizes the page in tiles on several threads,
and drew a few antialiased border pixels one or two color levels apart from
one run to the next.

## Decision

- **Motion stops for the capture**: the screenshot is taken with Playwright's
  `animations: "disabled"`, as `toMatchScreenshot` already does. Transitions
  jump to their end and infinite animations, such as the spinner, to their
  start.
- **The Chromium of the renders draws on one raster thread and redraws the
  whole page** (`--num-raster-threads=1` and `--disable-partial-raster`). The
  visual tests keep the default, since they compare with a tolerance
  (decision 0034).
- **Proven by runs**: eight runs in a row wrote the same 57 files, byte for
  byte. With one raster thread alone, a screen still changed.

## Alternatives considered

- **Comparing with the approved file and keeping it when the difference is
  small.** Hides the noise, but needs a comparison in the render, and a small
  real change would be kept out too.
- **Stopping motion with injected CSS.** Works, but repeats what Playwright
  already does.
- **Living with the noise and restoring files by hand.** Nothing to change,
  but every review would start by telling noise from changes.

## Consequences

- A screenshot that changes after `make reference` is a real change, to
  review.
- The spinner shows at its first position.
- A new Playwright image may still draw differently (decision 0033): the
  changed files are reviewed once, and are stable again from then on.
