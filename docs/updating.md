# Updating

How dependencies and pinned images are kept up to date (decision 0023). This
guide changes as the checks below come and go.

## When

At the start of every roadmap item, before any of its work:

```sh
make outdated
make audit
```

Both fail when there is something to look at. Whatever they report is
updated first, in commits of its own, so the item starts from a current base.

## What a commit holds

- **One tool per commit**, with the packages that move with it: `react`,
  `react-dom`, `@types/react` and `@types/react-dom` together; pnpm's image
  with `packageManager` (decision 0008); the Node image alone.
- **Only versions past the release age** (decision 0009). `pnpm add` refuses a
  younger one, and `make outdated` lists only those old enough.
- **`make check` passes.** A small fix the update needs goes in the same commit.
  An update that needs more waits: its package goes into `update.ignoreDeps`
  in `pnpm-workspace.yaml`, with the reason, and the move becomes a deferred
  roadmap item.
- **A new major version is not a routine update.** It is raised as a step of
  its own, since it may change decisions.

The message is `build(deps): update <tool> to <version>`, with a body only
for what the diff does not show, such as a security exception to the release
age, with its advisory.

## How

- **A dependency:** `pnpm add -D <package>@<version>` in a container, as
  `make install` runs pnpm, then `make check`. A runtime dependency keeps its
  range: `pnpm add <package>@^<version>` (decision 0028).
- **A pinned action:** copy the line `make outdated` prints over the action's
  `uses:` line, in every workflow that uses it (decision 0046).
- **A pinned image:** copy the line `make outdated` prints into
  `infra/settings.env` (decision 0043), and move its package with it:
  - **pnpm:** `packageManager` in `package.json` to the same version, then
    `make install`.
  - **Playwright:** the `playwright` package to the same version (decision
    0047), then `make reference` and `make screenshots`, and review any
    screenshot that changes (decisions 0033 and 0034). The image brings Node
    too, so its line is checked by hand, below.

  A check fails while an image and its package differ. Then `make check`.

## Checks made by hand

`make outdated` cannot see these. Each says when it goes away.

- **Vitest on its 4 line**, with `@vitest/browser-playwright`. Left out of the
  report until the move to Vitest 5, its own step now that `jest-dom` is gone
  (decision 0052): `docker run --rm aurum-ds:base pnpm view vitest@4 version`.
  Goes away with that move.
- **`@types/node` on the image's Node line.** The report suggests newer lines
  as they appear, but the types must match the Node in the image. Stays.
- **The year of `target` and `lib` in `tsconfig.json`.** Moved up one year
  once all of that year's features are widely available in Baseline. For
  ES2024, two are still missing:
  `docker run --rm aurum-ds:base node -e 'const r = await fetch("https://cdn.jsdelivr.net/npm/web-features/data.json"); const { features } = await r.json(); for (const id of ["resizable-buffers", "atomics-wait-async"]) console.log(id, features[id].status.baseline)'`.
  Each prints `high` once it is widely available. Stays, a year at a time.
