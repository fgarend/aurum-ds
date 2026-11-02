# 0038. Package check

- Status: Accepted; partly superseded by 0044: when it runs
- Date: 2026-11-02

## Context

`make test` checks the package's shape on every run: the exports, the files
and the absence of install scripts (decisions 0036 and 0037). It does not
install the package, so a file that fails to reach the app, or a dependency
that fails to install, would only show in the app. Before a tag, what the app
will receive should be seen, and proven to import.

## Decision

- **`make pack` packs the package and installs it in a throwaway app**, in a
  container, with the repository mounted read-only. The app has React 19 and
  the same pnpm settings as this repository. It then imports every export, as
  the app would.
- **It prints what the app receives and what each export resolves to**, and
  fails when a file is missing, an export does not resolve, or a dependency
  does not install.
- **It runs on request, and before every release.** It is not part of
  `make test`, which already checks the package's shape.
- **The steps live in `infra/check-package.ts`**, and the `Makefile` only
  calls it. What needs no network is tested on its own: the names the app
  imports, and resolving them in an app's folder, with a fictitious package.

## Alternatives considered

- **Listing the contents only.** Quicker, but it proves nothing about
  installing or importing.
- **In every `make test`.** The strongest check on every commit, but slower,
  and dependent on installing packages each time.

## Consequences

- A release is tagged only after `make pack` passes.
- Nothing is written outside the container.
