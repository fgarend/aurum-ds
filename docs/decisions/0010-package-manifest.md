# 0010. The package manifest

- Status: Accepted
- Date: 2026-11-01

## Context

The app installs this package from a git tag, and imports it by its name. The
package has no license (decision 0002) and is not published to a registry. It
is built for the current React, while the previews of the Claude Design
artifact, which the repository may later mirror, still run React 18.

## Decision

- **Name: `@fgarend/aurum-ds`**, the repository's address as a scoped name.
- **Private**, so it cannot be published by mistake.
- **Version `0.0.0`** until the release commit of `0.1.0` (decision 0004).
- **An ES module package** (`"type": "module"`).
- **The same description as the repository**, its https address, and
  `UNLICENSED`.
- **React and ReactDOM are peer dependencies, `^18.3.0 || ^19.0.0`.** Work is
  done on the latest React 19, and React 18.3 is checked for compatibility.
  The 18 range is kept while the artifact mirror may need it.
- **Peer dependencies are not installed on their own** (`autoInstallPeers:
  false`): the React versions used here are declared in `devDependencies`.

## Alternatives considered

- **`aurum-ds`, without a scope.** Shorter, but anyone may take that name on
  the registry, and it does not say whose it is.
- **No `private` field.** The same today, but the protection would depend on
  remembering it.
- **Starting at `0.1.0`.** A version before it has any content.
- **CommonJS.** Only for consumers that use `require`; the app is an ES
  module.
- **Only React 19.** Simpler, but the artifact's previews could not run the
  components.
- **Only React 18.3.** The app runs React 19 and could not install it.
- **Peer dependencies installed on their own.** pnpm would pick the React
  version from the peer range, which says what the app may use, not what is
  developed on.

## Consequences

- Dropping React 18 later is a breaking change, decided when the artifact
  mirror is.
- The component tests run on React 19 and check React 18.3.
