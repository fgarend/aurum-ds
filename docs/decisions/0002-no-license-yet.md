# 0002. No license yet

- Status: Accepted
- Date: 2026-10-31

## Context

The repository is public, so anyone can read it. Its only consumer is its
owner's own app, so nothing needs a license today. A license can be added at
any time, but the rights it grants for a version already published cannot be
taken back.

## Decision

- **No license for now.** All rights are reserved by Felipe Gabriel Arend.
- **The README says so**, with a copyright line and a note that a license may
  be chosen later. There is no `LICENSE` file.
- **The package manifest, when it exists, declares `UNLICENSED`.**

## Alternatives considered

- **MIT now.** Simple and common, but irreversible for every version published
  under it, with no reason today to open the code for reuse.
- **Apache-2.0 now.** The same objection, with a longer text that only matters
  when patents do.

## Consequences

- Others may read the code but have no permission to reuse it.
- Choosing a license later is a new decision that supersedes this one.
