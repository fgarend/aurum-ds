# 0012. Security audit

- Status: Accepted; partly superseded by 0058: the name of the list
- Date: 2026-11-01

## Context

A dependency can have a known vulnerability, published after the version was
installed. The project needs a command that lists them, and a way to record
the ones that are reviewed and accepted.

## Decision

- **`make audit` runs `pnpm audit` in a container**, against the GitHub
  security advisories.
- **It fails on a vulnerability of any severity, or on an error.** pnpm gives
  both the same exit code, and its output says which.
- **An accepted vulnerability is listed by its advisory** in `auditConfig`
  `ignoreGhsas` in `pnpm-workspace.yaml`, with a comment giving the reason.
  The list appears with its first entry.

## Alternatives considered

- **OSV-Scanner.** A broader database, and it can scan images too, but one
  more image to pin and keep, for the same result on npm dependencies.
- **Failing only on high or critical.** Less noise, but moderate advisories
  would pass unread.
- **Ignoring what has no fix yet.** Hides the cases that most need a decision.

## Consequences

- Every advisory is either fixed or accepted on record.
- The system packages inside the images are not covered; scanning them is a
  separate, deferred item.
