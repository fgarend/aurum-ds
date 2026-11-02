# 0043. The environment

- Status: Accepted
- Date: 2026-11-02

## Context

Every command runs in a container (decision 0007), and continuous
integration is about to run the same commands on GitHub's ARM runners. The
commands ran in two environments: Debian with the Node image pinned here, and
Ubuntu with the Node of Playwright's image for the browser tests. The
dependencies were installed twice, the code was copied into one image and
mounted into others, and each `Makefile` target repeated a long `docker`
command with its mounts and ports. Two values change from one run to another
or one machine to another: the images, to try a new one, and the port of the
prototype.

## Decision

- **One environment, in one `Dockerfile` of three layers:** `base` (Node and
  pnpm), `deps` (the dependencies, installed once from the lockfile) and
  `browser` (`deps` with the browser). Playwright's image is no longer used:
  Playwright installs its headless Chromium into `browser`.
- **The browser's system packages come from Debian as it was when the Node
  image was built**, at the snapshot date the image notes beside its apt
  sources, so building again gives the same packages. The build fails if the
  image stops noting it.
- **The code is never copied into an image.** Each command mounts it,
  read-only when it only checks, writable when it writes. The image's own
  `node_modules` hides the machine's.
- **The build receives only `package.json`, `pnpm-lock.yaml` and
  `pnpm-workspace.yaml`**: `infra/Dockerfile.dockerignore` lists what enters,
  not what stays out.
- **`infra/compose.yaml` says where and how each command runs**, in six
  services: `tools` (checks, with pnpm's store for `make pack`),
  `tools-write` (writes the code), `browser` (checks in the browser, writing
  only `.vitest-attachments/`), `browser-write` (writes screenshots),
  `install` (writes the machine's `node_modules` and the lockfile) and
  `prototype` (the only one with a port). Read-only is the default and has no
  suffix.
- **`infra/settings.env` holds the values that may change**: `NODE_IMAGE` and
  `PNPM_IMAGE`, pinned by tag and digest, and `PROTOTYPE_PORT`. It is
  versioned and never holds a secret. A value given on the command line wins
  for that run only, such as `NODE_IMAGE=… make test`; continuous integration
  uses the versioned values.
- **The `Makefile` passes the settings and the Compose file once**, and each
  target picks a service.
- **`make clean` removes the images Compose marks with the project's name**,
  from the `name:` of `infra/compose.yaml`, so the `Dockerfile` carries no
  label of its own.
- **The image report reads the pins from `infra/settings.env`** and prints a
  line to copy there.

This replaces where decision 0007 pins the images, decision 0014's `test`
stage, decision 0018's reading of the `Dockerfile` and Playwright's image,
decision 0022's label, and decision 0032's use of Playwright's image.

## Alternatives considered

- **Playwright's image for everything.** Frozen by its digest, but with the
  Node that Playwright chooses, and every browser for every command.
- **Two environments, as before.** No change, but the browser tests ran on
  another system and Node than the rest.
- **Browser packages from Debian at build time.** Simpler, but a rebuild
  weeks later could draw the screenshots differently.
- **Copying the code into the image.** A sealed check, but an image to
  rebuild on every change.
- **The images in the `Dockerfile`.** Where Dependabot looks, but trying
  another image meant editing it.
- **An `.env` file.** Read by Compose on its own, but the name `.gitignore`
  keeps for secrets.
- **Several `Dockerfile`s.** One per job, but the base repeated in each.

## Consequences

- The screenshots were approved again, drawn by Debian instead of Ubuntu.
- Mounting the dependencies over the code adds about half a second to each
  command.
- Images built before this decision carry the old label and are removed by
  hand once.
- The browser image is 1.75 GB instead of 4 GB.
