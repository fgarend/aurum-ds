# 0044. Commands

- Status: Accepted; partly superseded by 0046: the image report as one file
- Date: 2026-11-02

## Context

The `Makefile` held four jobs at once: the list of commands, what each one
runs, where it runs, and logic of its own (joining two reports, removing old
screenshots). `make test` ran lint, types, tests and browser tests, and
stopped at the first failure. A value lived in several places: the content
width of the visual tests in three, the release age in two, the version of
pnpm in two with nothing comparing them. The token compiler needed Vite to be
loaded, since Node does not resolve imports written with `.js`.

## Decision

- **Each job has one place:** the `package.json` scripts say what runs;
  `infra/compose.yaml` says where (decision 0043); `scripts/` holds the
  logic; the `Makefile` is the entry, each target running the script of the
  same name in the service it picks.
- **The exceptions to the same name:** targets that join others (`check`,
  `outdated`), targets that run nothing in a container (`help`, `clean`,
  `images`), and `install`, which runs pnpm's own command, since a script
  named `install` would run when the package is installed (decision 0037).
- **The checks are split by responsibility:** `lint` (Biome), `types` (the
  three TypeScript programs), `test` (the tests of the code, in Node and
  jsdom), `test-repository` (the checks of `test/`, in a Vitest project of
  their own), `test-browser` (the browser tests) and `pack` (decision 0038).
  `make check` runs all six, before a commit and in continuous integration.
- **A target that joins others runs them all** (`make -k`) and fails at the
  end if any failed, so every problem shows at once: `check`, and `outdated`,
  which joins `outdated-deps` (pnpm's report) and `outdated-pins` (the
  images).
- **`make pack` runs in every check**, not only before a release.
- **`make images` builds every image**, as the first step of continuous
  integration.
- **The scripts in `scripts/` and the checks in `test/` import each other by
  their `.ts` names**, so Node runs them as they are: `make tokens` no longer
  loads the compiler through Vite. The code of the package keeps `.js`.
- **`scripts/update-screenshots.ts` removes the approved screenshots and
  writes them again**, the logic `make screenshots` held.
- **Each value has one source:** the visual tests' width is the tokens'
  `content-max` (the renders read the artifact's own); the release age is
  pnpm's `minimumReleaseAge`, which the image report reads; and a check
  compares the version of pnpm's image with `packageManager`.
- **The image report is `scripts/check-pins.ts`**, since it covers what is
  pinned by hand.

This replaces decision 0014's list of checks in the `Makefile` and its stop
at the first failure, decision 0018's fixed release age, decision 0026's
loading through Vite, decision 0034's fixed width and the folders removed by
the `Makefile`, decision 0038's running only on request, decision 0039's name
for the image report, and decision 0013's `.js` imports, in the scripts and
the checks.

## Alternatives considered

- **Everything in the `Makefile`, as before.** One file to read, but four
  jobs in it, and the commands out of reach of other tools.
- **`check` as a `package.json` script.** One script, but a single container:
  the lint and the types would need the browser image.
- **Stopping at the first failure.** Faster to fail, but one problem shown
  per run.
- **`pack` only before a release.** A faster check, but a packaging problem
  seen weeks after the commit that caused it.
- **`.ts` imports everywhere.** One rule, but a change to how the package's
  code is written and built.

## Consequences

- A new command is a script and a line in the `Makefile`.
- `make check` takes longer than `make test` did, with `pack` in it.
- The scripts and the checks in `test/` follow a different import rule from
  the package's code, which Biome holds per folder.
