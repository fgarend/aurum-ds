# 0039. Repository layout

- Status: Accepted
- Date: 2026-11-02

## Context

Each folder at the root was made by the item that first needed it, with no
rule for the root as a whole, and two outgrew their names. `infra/` held the
container, the scripts `make` runs, the checks of the repository and the test
settings: the checks lived there only because they need Node's types. `src/`
held the package's source and the token compiler, which does not reach the
app. Mature design system and library repositories (MUI, Ant Design, React
Spectrum, Chakra, Vite, Primer) keep the tooling's programs in `scripts/`,
checks of the repository in `test/`, and their tools' settings at the root.

## Decision

- **The root holds four parts, each in its own folders:**
  - **The product, `src/`:** the package's source, what becomes what the app
    installs and imports, with each piece's tests next to it. It knows no
    other folder.
  - **The tooling:** `infra/`, the container; `scripts/`, the programs the
    `make` targets other than `test` run, each with its tests next to it;
    `test/`, the checks `make test` makes of the repository as a whole, which
    only read.
  - **The knowledge:** `docs/`, `README.md` and `CLAUDE.md`.
  - **The origin, `reference/`:** where the design came from, frozen, with
    the screenshots rendered from it and a README on the folder. Notes this
    repository writes about the origin, such as how the artifact works, are
    knowledge, in `docs/`.
- **Loose at the root only what tools look for there**: the manifest and the
  lockfile, the tools' settings (`biome.jsonc`, `tsconfig*.json`,
  `vitest.config.ts`), the git and editor files, and the entries: `README.md`,
  `CLAUDE.md`, `Makefile`.
- **`tsconfig.node.json` checks what runs on Node**: `scripts/`, `test/` and
  `vitest.config.ts`, so Node's types still never reach `src/` (decision
  0013).
- **A script is named by what it does**, verb first (`build-tokens`,
  `check-package`, `check-images`, `render-reference`); **a check of the repository by what it
  checks** (`package`, `tokens`, `fonts`); **a suite Vitest runs to write
  files, not to fail on them, ends in `.render.ts`**, with what it shares
  beside it, in `scripts/render-reference/`.
- **A program of one file is a file in `scripts/`; a program of several is a
  folder named after it**, whose entry is `main.ts`. What is inside the folder
  stays inside: code elsewhere that needs it imports one public function.
- **The token compiler is tooling**, in `scripts/build-tokens/`: it does not
  reach the app. Its public function, `compileTokens` in `compile.ts`, is also
  imported by the check that `tokens.css` is up to date and by the render of
  the artifact's previews. `tokens.json`, its source, stays in `src/tokens/`.
- **The setup of the component tests is tooling too**, in `test/dom-setup.ts`,
  with its own test. Both are checked with the library's `tsconfig.json`, so
  the component tests in `src/` see the matchers it registers, and left out of
  `tsconfig.node.json`, where those matchers would clash with the browser
  mode's.

This replaces where decision 0018 put the image report, where decision 0020
put Vitest's settings and the tests' setup, and where decisions 0025 and 0026
put the token compiler.

## Alternatives considered

- **Folders by role inside `infra/`.** Fewer moves, but a name that promises
  the container and holds the rest, unlike any repository surveyed.
- **The checks next to what they check, in `src/`.** Closer to their subject,
  but another type program with Node's types inside the product.
- **The token compiler kept in `src/`, as an exception.** Nothing moved, but
  the product's rule broken from the start.
- **Scripts named after the `make` target.** A direct match, but the name
  would say when a script runs, not what it does.

## Consequences

- A new file belongs first to one of the four parts, then, in the tooling, to
  a role.
- Vitest finds its settings at the root, with no option to point at them.
- A small helper, such as the check that a value is an object, is repeated
  in the files that need it rather than shared: only a program's public
  function crosses folders.
- Decisions written before this one name the old places.
