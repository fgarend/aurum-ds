# 0008. Package manager

- Status: Accepted
- Date: 2026-11-01

## Context

The package needs a package manager to install its dependencies and keep a
lockfile. The main risks are a malicious version published to the registry,
usually through an install script, and a library that imports a package it
does not declare, which works here and breaks in the app. The app that uses
this package may change its own package manager, so the choice is not bound
to it.

## Decision

- **pnpm.** Its defaults are the safe ones: dependencies cannot run install
  scripts until each is allowed, and its `node_modules` is strict, so an
  undeclared import fails at once.
- **It enters the image copied from pnpm's official image**, pinned by tag and
  digest, as the Node image is (decision 0007).
- **`package.json` pins the same version** in `packageManager`. Both pins
  change together.
- **Project settings live in `pnpm-workspace.yaml`**, and only those that
  differ from pnpm's defaults.
- **`make install` installs in a container**, with the repository mounted, so
  the lockfile and `node_modules` stay on the host for the editor. pnpm's
  package store is kept in a named volume, so nothing is downloaded twice.

## Alternatives considered

- **npm, from the Node image.** Nothing to install, but install scripts run
  and new versions are accepted by default, and its flat `node_modules` hides
  undeclared imports. Its protections would all have to be turned on by hand.
- **Yarn.** Must be installed too, and its default Plug'n'Play mode often
  clashes with other tools.
- **Bun.** A whole runtime, not only a package manager: it would replace the
  Node image.
- **pnpm through `npm install -g`, Corepack or the install script.** They
  download pnpm while building, with no digest; Corepack is no longer part of
  the Node image.
- **No store volume.** Every install would download everything again.

## Consequences

- Updating pnpm changes the image pin and `packageManager` in one commit.
- A dependency that needs an install script must be allowed explicitly.
- This decision replaces the point of decision 0007 that npm comes from the
  image: the image's npm is not used.
