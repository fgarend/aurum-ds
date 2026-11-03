# 0061. Coverage

- Status: Accepted
- Date: 2026-11-03

## Context

The package's code had no measure of which of its lines the tests run. A
coverage is one count over every test of the code, but those tests run in
two commands, `make test` in Node and `make test-browser` in the browsers,
and Vitest takes its coverage settings only once, for the whole run. Since
decision 0059, a component's checks live in its stories, run by the
`storybook` project. Of the design systems surveyed, few enforce a minimum.

## Decision

- **`make coverage` runs the tests of the code again**, those of the `node`,
  `browser`, `storybook` and `visual` projects, in one run that measures
  them, and **fails below 100%** of the lines, statements, branches and
  functions of `src/`. Tests, stories and type declarations are not counted.
  `make check`, and so continuous integration, runs it.
- **Istanbul measures**, `@vitest/coverage-istanbul`, the one that works in
  the three browsers; V8's works only in Chromium.
- **The report:** the terminal lists only the files below 100%, with their
  untested lines, and `coverage/index.html` colours each line. `coverage/`
  is not versioned, and is the one folder of the code `make coverage` may
  write besides `.vitest-attachments`; it empties it first, since the
  container cannot.
- **Continuous integration shows the table on the run's page**, from
  `coverage/coverage.txt`, in a step of its own, with no tool added.
- **A line no test can reach is left out only with its reason**, in
  Istanbul's comment, kept by `-- @preserve` since esbuild drops comments:
  `/* istanbul ignore next -- @preserve: why */`. A check in `test/`
  refuses one without a reason; the end of a range, `stop`, needs none.

## Alternatives considered

- **Measuring inside `make test` and `make test-browser`, with the partial
  reports joined at the end.** Nothing run twice, but a folder of partial
  reports, and a merge Vitest's code does without its documentation saying
  so.
- **Only the projects with checks, without `visual`.** Shorter, but a
  screenshot checks the code too.
- **Codecov or Coveralls.** Each line coloured on a site and on a pull
  request's diff, but an outside service, an account and a token, for a
  repository whose commits go straight to `main`.
- **A comment on each pull request** (`vitest-coverage-report-action`). The
  same, through an action, for pull requests the repository does not use.
- **The HTML kept by continuous integration.** The coloured lines at hand,
  but a file to download for what the log already lists.
- **Exceptions without a reason.** Less to write, but no way to tell later
  why a line has no test.

## Consequences

- `make check` runs the tests of the code twice, a few seconds more, growing
  with the components; joining partial reports becomes an item when it
  weighs.
- Every new line of `src/` needs a test, or a reason beside it.
- The `@preserve` comments may reach the built package, which its bundler
  will decide (item 7.19).
