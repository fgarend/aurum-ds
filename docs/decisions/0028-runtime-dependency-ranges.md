# 0028. Runtime dependency ranges

- Status: Accepted
- Date: 2026-11-01

## Context

Decision 0015 writes development dependencies with their exact version. The
package now has dependencies the app installs with it. An exact version there
would make the app keep a second copy of a package it already has at another
compatible version, and fixes would reach the app only through a release of
this package.

## Decision

- **Runtime dependencies are written as a caret range** (`^5.3.0`), as is the
  practice for libraries. Development dependencies stay exact (decision 0015).
- **They are added with the range written out**
  (`pnpm add <package>@^<version>`), since `saveExact` would save them exact.
- **The lockfile still pins the version tested here.**

## Alternatives considered

- **Exact versions, as for development dependencies.** The app would get
  exactly what was tested, but could hold duplicate copies, and would wait for
  a release here for every fix.

## Consequences

- The app may resolve a newer version within the same major than the one
  tested here.
