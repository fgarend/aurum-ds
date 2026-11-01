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
- **`make test` passes.** A small fix the update needs goes in the same commit.
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
  `make install` runs pnpm, then `make test`.
- **A pinned image:** copy the line `make outdated` prints into
  `infra/Dockerfile`. For pnpm, change `packageManager` in `package.json` to
  the same version and run `make install`. Then `make test`.

## Checks made by hand

`make outdated` cannot see these. Each says when it goes away.

- **TypeScript on its 6 line.** Left out of the report until the move to 7
  (decision 0013), so even its fixes do not show:
  `docker run --rm aurum-ds:base pnpm view typescript@6 version`.
  Goes away with the move to TypeScript 7.
- **Does `make test` pass on TypeScript 7?** Try the newest 7 old enough, then
  restore `package.json` and `pnpm-lock.yaml` if it fails. When it passes, the
  move is made as its own step. Goes away with the move.
- **Vitest on its 4 line.** Left out of the report until `jest-dom` accepts
  Vitest 5 (decision 0020):
  `docker run --rm aurum-ds:base pnpm view vitest@4 version`.
  Goes away with the move to Vitest 5.
- **Does `jest-dom` accept Vitest 5?** When `@testing-library/jest-dom` has a
  new version, try it with Vitest 5: the type check is the proof. Goes away
  with the move to Vitest 5.
- **`@types/node` on the image's Node line.** The report suggests newer lines
  as they appear, but the types must match the Node in the image. Stays.
- **The year of `target` and `lib` in `tsconfig.json`.** Moved up one year
  once all of that year's features are widely available in Baseline. For
  ES2024, two are still missing:
  `docker run --rm aurum-ds:base node -e 'const r = await fetch("https://cdn.jsdelivr.net/npm/web-features/data.json"); const { features } = await r.json(); for (const id of ["resizable-buffers", "atomics-wait-async"]) console.log(id, features[id].status.baseline)'`.
  Each prints `high` once it is widely available. Stays, a year at a time.
