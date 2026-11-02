# 0034. Screenshot approval

- Status: Accepted; partly superseded by 0044: the width and the removal of screenshots
- Date: 2026-11-01

## Context

The browser tests run in an image pinned by digest, so the same code draws
the same pixels every time (decision 0032). That makes it possible to keep an
approved screenshot of what a test draws and fail on any change, as long as
an intended change can be approved easily. Vitest's `toMatchScreenshot`
compares with a stored reference, writes a missing one and fails, and updates
references with `--update`; it does not remove those of renamed or deleted
tests.

## Decision

- **Approved screenshots live in `__screenshots__/` next to each browser
  test**, as Vitest names them, and are kept in the repository.
- **`make screenshots` writes them all again**, with the repository mounted:
  it removes every `__screenshots__` folder under `src/`, so none is left
  from a renamed test, and runs the browser tests with `--update`. A screen
  that did not change is written byte for byte the same.
- **Approving is reviewing the changed images in the commit's diff.**
- **`make test` fails on a missing or different screenshot**, and writes
  nothing to the repository. A change is seen by running
  `make screenshots` and reading the diff, and undone with `git restore`.
- **Vitest's default comparison**: a small color tolerance per pixel, and no
  pixel allowed to differ beyond it.
- **Every browser test draws on the same canvas**, 1200 by 800 px, the
  tokens' `content-max` wide. A failing test saves no screenshot, so none
  mixes with the approved ones.
- **The first visual test draws every text style** with the package's fonts,
  each with its sample from `tokens.json`, or its name.

## Alternatives considered

- **One folder for all screenshots.** Tidier, but apart from the tests that
  draw them.
- **`--update` alone.** Simpler, but screenshots of renamed tests would stay.
- **Keeping Vitest's actual and diff images from `make test`.** The red diff
  on hand, but another folder to mount and ignore, for what the image diff of
  git already shows.
- **A tolerance, such as 1% of the pixels.** Fewer failures when the browser
  image changes, but real small changes would pass.

## Consequences

- A change to a token or a font fails the text styles test until it is
  approved.
- A new browser image may change every screenshot at once: they are written
  again and reviewed.
- The build leaves the `__screenshots__` folders out of the package.
