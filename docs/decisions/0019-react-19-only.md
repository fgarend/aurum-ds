# 0019. React 19 only

- Status: Accepted
- Date: 2026-11-01

## Context

Decision 0010 accepted React 18.3 and 19 as peers, keeping 18 while the
artifact mirror might need it: Claude Design's previews load React 18.3.1. The
mirror is a deferred roadmap item with no method chosen. The app that uses
this package is on React 19, and the work aims at the latest React. Keeping 18
would mean a second test run against it and no React 19 APIs, such as `ref`
as a prop, `use`, or form actions.

## Decision

- **React and ReactDOM are peers in `^19.0.0`.** This replaces the React range
  of decision 0010, and its reason for keeping 18.
- **No check against React 18 is run.**

## Alternatives considered

- **Keeping 18.3 and 19, with a test stage on 18.3.** The mirror could use the
  components as they are, but every component would avoid React 19's APIs for
  a deferred, uncertain need.

## Consequences

- Components may use React 19's APIs.
- An app on React 18 cannot install the package without a peer warning or
  error.
- The artifact mirror, when it comes, has to deal with previews on React 18.
