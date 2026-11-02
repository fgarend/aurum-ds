# 0045. Browsers

- Status: Accepted
- Date: 2026-11-02

## Context

The browser tests ran in Chromium only, waiting for the app to say which
browsers it supports (decision 0032). Safari matters to the app on the
iPhone, and Firefox is the other engine people use. A browser draws text and
borders a little differently from another, so screenshots taken in three
browsers would triple the approved images and their reviews. One file name,
`*.browser.test`, served both a test of behaviour and a test that compares
screenshots.

## Decision

- **The browser tests run in Playwright's three browsers:** Chromium,
  Firefox, and WebKit, the engine of Safari, built for Linux.
- **A test that compares screenshots is named `*.visual.test.ts` or `.tsx`**
  and runs in Chromium only, in a `visual` project of Vitest. A browser test
  of behaviour keeps `*.browser.test` and runs in all three.
- **`make test-browser` runs both projects**, and `make screenshots` writes
  the screenshots of the visual tests only.
- **The image installs Playwright's default browsers**, with Chromium's
  headless shell (decision 0043), so the one list of browsers to test is in
  `vitest.config.ts`.
- **The reference screenshots stay in Chromium** (decisions 0033 and 0041).

This replaces decision 0032's Chromium only and the name it gave every
browser test, and decision 0043's image with Chromium alone.

## Alternatives considered

- **Chromium only, until the app names its browsers.** A smaller image, but
  the first Safari problem would be found in the app.
- **Screenshots in every browser.** Each engine compared, but three times
  the images, and reviews for differences no one asked for.
- **A list of browsers in the `Dockerfile` too.** The image smaller by what
  is left out, but two lists to keep alike.

## Consequences

- WebKit on Linux catches most of Safari's differences, not all: the iPhone's
  Safari is not the same build.
- The browser image grows from 1.75 GB to 3.19 GB.
- The first run in three browsers found two tests that read a font's name
  with the quotes one browser writes and another drops; both now accept
  either.
