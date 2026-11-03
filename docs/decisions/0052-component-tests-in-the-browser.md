# 0052. Component tests in the browser

- Status: Accepted; partly superseded by 0059: a component's browser test, now its stories
- Date: 2026-11-02

## Context

Components could be tested in two places: in jsdom, a DOM simulated in Node,
with Testing Library and jest-dom (decision 0020), and in real browsers
(decisions 0032 and 0045). jsdom draws nothing, so it cannot test CSS, a
visible focus, contrast or layout, and each test would have to choose where
to live, the same behaviour tested twice. The types of jest-dom also held the
repository on Vitest 4. No component exists yet; only the setup of the jsdom
tests and its own test used it.

## Decision

- **Components are tested in the real browser only:** a browser test of
  behaviour, keyboard and focus in the three browsers, and a visual test in
  Chromium.
- **jsdom, Testing Library (`react`, `dom`, `user-event`), jest-dom,
  `test/dom-setup.ts` and Vitest's `dom` project leave.** Tests of logic, in
  `scripts/` and later in `src/internal/`, stay in Node.
- **`vitest-browser-react` draws components in the browser tests**: the
  package Vitest's documentation points to for React in browser mode, whose
  queries wait for the element and which cleans the page between tests.
- **`make test` runs the tests of logic, in Node**, and `make test-browser`
  the tests in the browser.
- **`make watch` runs the tests of logic and the browser tests in Chromium**,
  so it still answers while a component is being made; Firefox, WebKit and
  the visual tests are left to `make check`.
- **Nothing holds back Vitest 5 anymore**; the move is a step of its own.

This replaces decision 0020's jsdom, Testing Library, jest-dom and their
setup, and decision 0021's projects for `make watch`.

## Alternatives considered

- **Both jsdom and the browser.** Faster tests in jsdom, but two places to
  choose from, CSS and focus untested there, and Vitest held at 4.
- **Rendering by hand with React's `createRoot`.** No dependency, but a helper
  of our own to draw, wait and clean the page.

## Consequences

- A component test needs the browser image, and runs a little slower than in
  jsdom.
- The browser tests read elements through Vitest's locators, as
  `vitest-browser-react` returns them.
