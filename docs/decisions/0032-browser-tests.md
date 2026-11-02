# 0032. Browser tests

- Status: Accepted; partly superseded by 0043: Playwright's image
- Date: 2026-11-01

## Context

Some things only a real browser can show: that a font loads, the styles a
browser computes, a focus ring drawn for the keyboard, and, later, how a
component looks. jsdom can show none of them. The visual tests to come need
the same browser to draw the same pixels every time, so the system libraries
that draw text must not change between runs.

## Decision

- **Vitest's browser mode**, the runner the other tests use, with the same
  API.
- **Playwright as its provider**, which runs headless in a container and
  drives real keyboard and pointer events.
- **Chromium only for now.** Other browsers wait for the browsers the app
  must support.
- **Playwright's official image, pinned by tag and digest**, holds the
  browsers, in a `browser` stage of the `Dockerfile`. Its version moves with
  the `playwright` package, as pnpm's image moves with `packageManager`.
- **A browser test is named `*.browser.test.ts` or `.tsx`**, runs in a
  `browser` project of Vitest, and is left out of the other two.
- **The browser tests have their own TypeScript settings**,
  `tsconfig.browser.json`, since the browser mode declares DOM matchers of its
  own, which clash with jest-dom's in the other tests. Its types also name a
  Node type, so that program has Node's types, as only these tests see it.
- **`make test` runs them last**, in the browser image. `make watch` keeps to
  the other two projects.
- **The image report knows Playwright's image**: versions of the
  `playwright` package by release date, and digests from Microsoft's
  registry, with the same rules as the other images (decision 0018).

## Alternatives considered

- **Playwright Test.** Its screenshot comparison is older, but it is a second
  runner, with its own API, and mounts components only experimentally.
- **WebdriverIO, or the preview provider.** WebdriverIO needs a driver per
  browser; the preview provider cannot run headless.
- **Chromium, Firefox and WebKit now.** Bugs of one engine found early, but
  three sets of reference screenshots, before knowing which browsers matter.
- **Installing Chromium in our own image.** One system and a smaller image,
  but the browser and the system packages would come from the network at each
  build, with no digest, and could change how text is drawn.
- **Every `.tsx` test in the browser.** Closer to real use, but slower, and
  every component test would depend on the browser image.
- **Not importing `vitest/browser`.** No separate settings, but only
  synthetic events, which a browser does not treat as the keyboard.
- **A separate target for the browser tests.** A faster `make test`, but
  tests that nobody runs grow old.

## Consequences

- The first `make test` downloads Playwright's image, close to a gigabyte.
- `make watch` does not run the browser tests: `make test` does.
- Playwright's image is rebuilt under the same tag, and the report shows it.
- `infra/tsconfig.json` adds the DOM library, since Vitest's configuration
  types name DOM types once the browser provider is installed.
