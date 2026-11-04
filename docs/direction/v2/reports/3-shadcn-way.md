# The shadcn way: building a design system on it

Researched 2026-11-04, against `shadcn@4.23.0`, Tailwind 4.3.4, `cn` 0.5.2, Storybook 10.6.5, Vitest 5.1.0.

**Tags.** **[V]** read in the linked source, from raw files or registry JSON, not a summariser, unless stated. **[V-run]** I ran it, in `scratchpad/direction-v2/exp/` (absolute path at the end). **[R]** my reasoning. Commands and names are exact; prose from sources is paraphrased.

**Main findings**

1. shadcn has written its own recipe for a design system, as an agent skill, and the earlier report missed it. It says edit the theme CSS and the `cva` variants in the copied files, and it pins down how type styles must be done. https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/design-system.md
2. A separate package is **neither documented nor forbidden**. Real libraries do it, some publishing a package and a registry from one repository.
3. Three traps were confirmed by running them: `cn` deletes custom `text-*` classes, `-y` does not skip the overwrite prompt, and ring-only focus disappears in forced colours.
4. Aurum's `tsconfig.json` sets `exactOptionalPropertyTypes`, and an open issue says generated components do not compile with it. https://github.com/shadcn-ui/ui/issues/12493 (title read)

**Earlier report, re-checked.** Version, stars, three bases, `diff` deprecation, the `registry:*` types and "`--diff` has no base" all hold. Corrections:

- The Astryx payload, then unreadable, is now read (section 2).
- The "`apply` loses edits" worry has an official way out: `--only theme,font`.
- "No doc for a from-scratch system" is answered by the skill above.

---

## 1. The documented way

Sources:

- https://ui.shadcn.com/docs/theming
- https://ui.shadcn.com/docs/registry/examples
- https://ui.shadcn.com/docs/registry/faq
- https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/customization.md
- the design-system skill above

The skills are in shadcn's repository and installed with `npx skills add shadcn/ui`. They are aimed at agents, but they are the most explicit statement of intent.

| Task                      | Documented way, exact                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Brand theme**           | Edit `:root` and `.dark` in the file named by `tailwind.css`. Or a `registry:theme` item with `cssVars.light`, `cssVars.dark`, installed by `npx shadcn@latest add <url>`. Or a preset from shadcn/create: `npx shadcn@latest init --preset <code>`, `npx shadcn@latest apply --preset <code> --only theme`. Base colour only: `npx shadcn@latest migrate base-color --to zinc --yes`                    |
| **Role mapping**          | The skill maps roles to names: canvas `--background`, secondary text `--muted-foreground`, hover wash `--accent`, error `--destructive`, focus `--ring`, illustration `--chart-1` to `--chart-5` plus named tokens                                                                                                                                                                                       |
| **Add a colour**          | `--warning` and `--warning-foreground` in `:root` and `.dark`, then `--color-warning: var(--warning)` in `@theme inline`. In a registry, `cssVars.light` and `cssVars.dark`. **[V-run]** The CLI writes the `@theme inline` line by itself                                                                                                                                                               |
| **Add a variant**         | Edit the `cva` block in `components/ui/button.tsx`. The skill's order: built-in variants, then `className`, then a new `cva` variant, then wrappers. Keep existing variant names, and add one only for a distinct recipe                                                                                                                                                                                 |
| **Sizes, spacing, shape** | The **style** (`vega`, `nova`, `maia`, `lyra`, `mira`, `luma`, `rhea`, `sera`) sets the geometry variables cannot reach. `--spacing` via `cssVars.theme`. Pin each `--radius-*` in `@theme inline`. Shadows go in `@theme`, not `@theme inline`. Control heights are **edited by hand across 11 listed files** (`h-8` in `button.tsx`, `input.tsx`, `select.tsx` and so on), and they must move together |
| **Fonts**                 | `registry:font` with `font.{family,provider,import,variable,subsets,dependency}`, via `npx shadcn@latest add font-inter`. `provider` is **only `google`**. Or Fontsource plus `--font-sans`, `--font-mono`, `--font-heading` in `@theme inline`, per the skill. `--font-heading` styles the small titles such as `CardTitle`                                                                             |
| **Type styles**           | shadcn ships none (https://ui.shadcn.com/docs/components/aria/typography). The skill says to make each token a `@utility type-*`, and **not** to use `--text-*` keys, because `cn` reads unknown `text-*` as colours. Prose: `typeset.css` (https://ui.shadcn.com/docs/typeset)                                                                                                                          |
| **Composed components**   | Wrappers in your own file, per the skill. As a registry item: `registry:component` or `registry:block` with `registryDependencies`. Target placeholders `@ui/`, `@components/`, `@lib/`, `@hooks/` (from 4.7.0)                                                                                                                                                                                          |
| **Whole system**          | `registry:base` with a `config` block, or `extends: "none"` from scratch; `registry:style`. https://ui.shadcn.com/docs/registry/examples                                                                                                                                                                                                                                                                 |
| **Across repositories**   | Registry only. By namespace in `components.json`, `"registries": {"@acme": "https://…/{name}.json"}`. By GitHub, `npx shadcn@latest add owner/repo/item#v1.2.0`, private through `gh` or `GH_TOKEN`. https://ui.shadcn.com/docs/registry/github lists design system packages (tokens, `theme.css`, `components/*`) as a use case                                                                         |
| **Focus treatment**       | An unlayered `:is(button, a[href], [role="button"], …):focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; --tw-ring-shadow: 0 0 #0000 }`, per the skill. It beats `outline-none`, and matters for section 6                                                                                                                                                                            |

Also from the skill:

- The review page shows colour pairs with measured contrast, and pins states with a `data-preview` attribute. https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/design-system-page.md
- `components.json` `style`, `baseColor` and `cssVariables` cannot change after init. https://ui.shadcn.com/docs/components-json

**[R]** The official model is edit-in-place. Wrappers come last in its order, and heights, focus and states are all file edits. Theme-only customisation is real but stops at colour, radius, fonts and shadows.

---

## 2. Package, monorepo, registry

**What the docs say [V].**

- The introduction contrasts shadcn with installing a library from npm. https://ui.shadcn.com/docs
- The monorepo page uses a `packages/ui` marked `private`, imported as `@workspace/ui/components/button` with `workspace:*`, and the same `style`, `iconLibrary`, `baseColor` in each `components.json`. https://ui.shadcn.com/docs/monorepo
- I grepped every root and registry page for publishing, `node_modules` and peer dependencies: **nothing describes an external package, for or against.**
- Tailwind documents the mechanism for it: `@source "../node_modules/@acmecorp/ui-lib"`. https://tailwindcss.com/docs/detecting-classes-in-source-files

**Trade-off for one external repository [R].**

|                          | Package                                            | Registry into the app                   | Both                                          |
| ------------------------ | -------------------------------------------------- | --------------------------------------- | --------------------------------------------- |
| Who owns the code        | The library                                        | The app, from then on                   | Package for pieces, app for examples or theme |
| A fix reaches the app    | Version bump                                       | Hand merge per file                     | Bump, stubs never change                      |
| Tests                    | Run once, in the library                           | The copy can drift from what was tested | Run once                                      |
| App can edit a component | No, unless the library changes                     | Yes                                     | Only copied parts                             |
| Coupling                 | `@source`, the app's Tailwind compiles the classes | Same, plus the app's `cn`               | Same                                          |

With one owner and one consumer, "edit it where you use it" loses most of its value, and "one tested copy" keeps all of it.

**Both from one repository: yes, and it is done [V].**

| Who                                     | How                                                                                                                                                     | Source                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **moduix**                              | Same package has `package.json` and `registry.json`. `pnpm dlx shadcn@latest add @moduix-react-tailwind/accordion`, or install `@moduix/react-tailwind` | https://github.com/Blinks44/moduix/tree/HEAD/packages/react-tailwind |
| **Astryx** (Meta, StyleX, not shadcn)   | The item's file content is only `export * from '@astryxdesign/core/AlertDialog';`, with `dependencies` pinned and `css` imports                         | https://astryx.atmeta.com/shadcn/component-alert-dialog.json         |
| **PlopUI**                              | `dependencies: ["@plop-ui/react", …]`, plus editable example files                                                                                      | https://plopui.com/r/button.json                                     |
| **AI Elements and Streamdown** (Vercel) | Registry item `message` depends on the npm package `streamdown` and on `button`, `tooltip`                                                              | https://registry.ai-sdk.dev/message.json                             |

**The app's CLI [V-run].** On a local copy of an `aria-nova` project:

- A theme item applied cleanly, and it added the `dark` custom variant.
- A re-export item planned the stub, the npm dependency and the CSS.
- `css` keys can write `@import "@acme/ui/preset.css";` and `@source "../node_modules/@acme/ui/dist";` into the app's stylesheet.

Bare `registryDependencies` such as `button` mean shadcn's own item, in the app's base. Refs are not inherited by dependencies. https://ui.shadcn.com/docs/registry/registry-item-json

**`--diff`, updates, customised files [V-run].**

| Action                                                  | Result                                                                                                                                                         |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add button --diff`, file unchanged                     | "No changes"                                                                                                                                                   |
| Same, after adding a `gain` variant                     | Shows my line as a **removal**. Local and upstream are not told apart. The code compares local with the registry, with no base (`dry-run.ts`, `isContentSame`) |
| `add button -y`, file edited                            | **Still prompts to overwrite**, default no. `-y` does not cover it (`update-files.ts`). It blocks in a non-interactive shell                                   |
| `add button --overwrite -y`                             | Replaces the file, and my variant is gone                                                                                                                      |
| `add <theme item> -y` after a local edit to `--primary` | **Overwrites** my value, with no prompt                                                                                                                        |
- I found no lockfile or record of the copied version in the docs or the source tree. The official merge is the procedure in https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md, section "Updating Components": `--dry-run`, then `--diff <file>`, then merge by judgement, never `--overwrite` without approval.
- `apply` reinstalls components unless given `--only theme,font`. https://ui.shadcn.com/docs/changelog/2026-04-partial-preset-apply
- The maintainer's stance is still "take the code and run". https://github.com/shadcn-ui/ui/issues/2619
- **[R]** A re-export stub has nothing to merge, so package plus stub avoids all of this.

---

## 3. Real libraries

Read from each repository's tree and files on 2026-11-04. "None seen" means no story, test or axe file in the path searched.

| Library, repository                                                                                          | Structure, delivery                                                                                                                                                          | Tokens                                                                                                                  | Own pieces                                                                                                                                                                                               | Tests                                                                                                                                               | Status                                                 |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Kibo UI**, https://github.com/shadcnblocks/kibo (moved from `haydenbleasel`)                               | `packages/<component>`, `packages/shadcn-ui`, docs app serving `/r/[component]`. Registry, plus a tiny `kibo-ui` CLI that spawns `shadcn add`                                | shadcn names                                                                                                            | Compound exports over shadcn (`Announcement`, `AnnouncementTag` over `Badge`). `bump-ui` runs `add --all --overwrite`, so **primitives stay pristine**                                                   | None seen                                                                                                                                           | Last commit 2026-05-04                                 |
| **coss ui**, https://github.com/cosscom/coss                                                                 | App monorepo (public since 2026-10-10, AGPL). Private `@coss/ui` exporting raw `.tsx`. Public registry `@coss`; its registry source is not in this repo                      | shadcn names plus `info`, `code`, `destructive-foreground`                                                              | Rewrites primitives on Base UI, same names, bigger variants (`xs` to `xl`, `icon-*`). The app restyles by `data-slot` in unlayered CSS so vendored files stay as shipped                                 | None in `packages/ui`                                                                                                                               | Active                                                 |
| **ReUI**, https://github.com/keenthemes/reui                                                                 | Next app, `registry/` and `registry-reui/bases/{base,radix}/{components,reui,hooks}`, output `public/r/styles/<base-style>`. Registry with `{style}`. README: no npm package | shadcn names; adds `info`, `success`, `warning`, `focus`, `invert`                                                      | Own primitives in `reui/`, examples in `components/`, custom lint config                                                                                                                                 | None seen                                                                                                                                           | 2026-10-16                                             |
| **Basecoat**, https://github.com/hunvreus/basecoat                                                           | Not React. npm `basecoat-css`: Tailwind source CSS, generated `.cdn.css`, vanilla JS, one bundle per shadcn style                                                            | Compatible with shadcn themes                                                                                           | Semantic HTML classes                                                                                                                                                                                    | `scripts/check.js` only: exports exist, JS parses                                                                                                   | 2026-10-23                                             |
| **Adobe**, https://react-aria.adobe.com/registry/registry.json, repo https://github.com/adobe/react-spectrum | 159 items: 155 `registry:ui`, 3 `registry:style`, 1 `registry:lib`. Tailwind and vanilla CSS. Uses `tailwind-variants` and plugin `tailwindcss-react-aria-components`        | **Not shadcn names**: `bg-blue-600`, `neutral-*`                                                                        | PascalCase files, `focusRing` shared via `extend`                                                                                                                                                        | Chromatic plus a forced-colours run, `yarn chromatic:forced-colors`. https://github.com/adobe/react-spectrum/blob/main/docs/contributing/testing.md | Active                                                 |
| **Polar**, https://github.com/polarsource/polar/tree/main/clients/packages/ui                                | Monorepo, **published** `@polar-sh/ui` 0.1.2, built with `tsdown`. Declares no Tailwind peer. README calls it private to Polar                                               | shadcn slate, app adds theme                                                                                            | **`src/components/ui` is raw shadcn, `atoms/` and `molecules/` are theirs.** Atoms wrap `ui/` with `rounded-2xl!`. Has `MoneyInput`, `FormattedDateTime`. New private system `@polar-sh/orbit` beside it | None seen                                                                                                                                           | Active                                                 |
| **Unkey**, https://github.com/unkeyed/unkey/tree/main/web/internal/ui                                        | Workspace `@unkey/ui`, not on npm. `style: base-nova`, `iconLibrary: @unkey/icons`. Exports `theme.css`                                                                      | **Diverges**: `bg-raised`, `text-gray-12`, `rounded-control`, `--text-*: initial`. Commented usage table in `theme.css` | Grouped folders (`buttons/`, `data-table/`)                                                                                                                                                              | Vitest on jsdom, some files. Docs app, no Storybook                                                                                                 | Active                                                 |
| **Streamdown**, https://github.com/vercel/streamdown                                                         | Vercel, npm `streamdown` 2.7.1, React peer only                                                                                                                              | shadcn names                                                                                                            | Single component                                                                                                                                                                                         | Not read                                                                                                                                            | Active                                                 |
| **moduix**, https://github.com/Blinks44/moduix                                                               | Ark UI, not shadcn primitives. `@moduix/react-tailwind` 3.2.1, peer `tailwindcss ^4`, **plus** registry                                                                      | **Prefixed copies**: `--moduix-background`, `--moduix-primary`                                                          | `internal/cn.ts`                                                                                                                                                                                         | `*.browser.test.tsx` per component, with rstest                                                                                                     | Active, 30 stars                                       |
| **Medusa UI**, https://github.com/medusajs/medusa/tree/develop/packages/design-system/ui                     | **Not shadcn** (Radix, react-aria), the best Tailwind package to learn from. `@medusajs/ui` 4.2.9 plus `@medusajs/ui-preset` with peer `tailwindcss ^3.4.3 \|\| ^4.0.0`      | Own: `bg-ui-bg-base`, `txt-compact-small-plus`                                                                          | `clx` for merging                                                                                                                                                                                        | `button.spec.tsx` and `button.stories.tsx` per component; `css: false` so no computed styles; `tailwind-compat.spec.ts`                             | Active                                                 |
| **Tremor Raw**, https://github.com/tremorlabs/tremor                                                         | Related only: copy-paste on Radix, no CLI registry seen                                                                                                                      | Raw `blue-500`                                                                                                          | `tv`, `focusRing`                                                                                                                                                                                        | Storybook 8 with `addon-a11y`, Playwright in 3 browsers, 42 story files                                                                             | Last push 2025-10-10. `tremor-npm` last pushed 2025-01 |

Not a repository, but first-hand: Thrive Learning moved to shadcn with about 70 primitives and 100 product components, edited in place, Storybook as review, WCAG 2.2 AA audits, strangler-fig rollout. It does not say whether the code is in a package. Read through a summariser. https://www.thrivelearning.com/blog-news/from-three-design-systems-to-one-our-migration-to-shadcn-ui

**[R] Patterns.**

- Most keep shadcn names. Those that diverge add a bridge (see Fumadocs below) or drop third-party compatibility.
- Testing is the weak point: only Adobe, Medusa, moduix and Tremor show real component tests. Nothing shadcn-based here tests forced colours.
- Polar is the closest to Aurum's case: shadcn in a package, published, with money pieces.

---

## 4. Tailwind in a published package

**Tailwind's rule [V].** It skips `node_modules` and `.gitignore`d files; `@source` paths are relative to the stylesheet; `source(none)`, `@source not` and `@source inline()` also exist. https://tailwindcss.com/docs/detecting-classes-in-source-files. A theme can be shared by publishing CSS to npm. https://tailwindcss.com/docs/theme

| Technique                                   | Who                                                                                                                                                              | Note                                                                                                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App writes `@source` to `dist`              | Streamdown (`@source "../node_modules/streamdown/dist/*.js"`), Medusa, moduix                                                                                    | Path breaks when hoisting differs. Streamdown documents a monorepo variant                                                                                                |
| **Package's CSS carries its own `@source`** | Fumadocs: preset includes its own source. https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/ui/theme.mdx                                     | **[V-run]** `@import "@acme/ui/preset.css"` with `@source "./dist"` inside generated the package's classes; without it they were absent. No path for the app to get wrong |
| Workspace `src`                             | Polar, Unkey                                                                                                                                                     | Monorepo only                                                                                                                                                             |
| Prebuilt CSS                                | Basecoat `.cdn.css`, PlopUI `styles.css`                                                                                                                         | **[R]** With Tailwind in the app, a prebuilt set duplicates `theme` and `utilities`, and order becomes a problem                                                          |
| Bridge to shadcn's names                    | `fumadocs-ui/css/shadcn.css` maps `--color-fd-primary: var(--primary)` and so on. https://github.com/fuma-nama/fumadocs/blob/dev/packages/base-ui/css/shadcn.css | Own namespace, same theme                                                                                                                                                 |
- **Peers [V].** coss `tailwindcss >=4.3.0 <5`, moduix `^4`, Medusa's preset `^3.4.3 || ^4`. Polar and Streamdown declare none.
- **Compile risk [V].** Medusa warns that its classes must compile alike in the consumer's Tailwind, and guards it with a spec. https://github.com/medusajs/medusa/blob/develop/packages/design-system/ui/AGENTS.md
- **Collisions [V].** `@import "tailwindcss" prefix(tw)` makes classes `tw:flex` and variables `--tw-*`. https://tailwindcss.com/docs/upgrade-guide. Also `tailwind.prefix`, and `createCn({ prefix: "tw" })`. **[R]** A prefix defeats sharing with the app's shadcn, so skip it. Same names compile to the same utilities in one stylesheet, which is the point.

**`cn` and custom type styles [V-run]** (`cn` 0.5.2 and `tailwind-merge` 3.7.0 behave alike):

| Input                                   | Default `cn`                                 | With `createCn({extend:{theme:{text:["body-sm","amount-lg"]}}})` |
| --------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| `text-body-sm`, `text-muted-foreground` | **`text-muted-foreground`, type style lost** | Both kept                                                        |
| `text-sm`, `text-amount-lg`             | Both kept                                    | `text-amount-lg`                                                 |
| `type-amount`, `text-muted-foreground`  | Both kept                                    | Not run                                                          |
| `type-amount`, `type-body`              | Both kept, no merge                          | Not run                                                          |
- **Registry components import `{ cn } from "cn"` directly**, not from `lib/utils` (read in `aria-nova/button.json`, and https://ui.shadcn.com/docs/changelog/2026-09-cn). **[R]** So a configured `createCn` in `lib/utils.ts` does not reach copied components unless each import is edited or the module is aliased.
- `cn/config` costs about 15 KB at run time. `cn build` reads `@theme` scales and bakes them, but its docs say to always skip it in published component libraries and leave that to the app. https://github.com/shadcn-ui/cn/blob/main/docs/build-setup.md
- T-shirt names such as `text-2xs` merge correctly; Unkey relies on that. https://github.com/shadcn-ui/cn
- **`type-*` has its own trap [V-run].** Tailwind emitted `.type-amount` _before_ `.text-sm`, `.leading-none`, `.font-medium`. So `className="type-amount"` on a component whose base has `text-sm` **loses** the font size. The base's `text-*` must be removed from the file.
- `tailwind-variants` v3 bundles its own merge code, unaffected by aliasing. https://github.com/shadcn-ui/cn/blob/main/docs/aliasing.md

---

## 5. Extending without pain

**Evidence [V].**

| Practice                                                | Who                                                                                                                                               | Cost seen                                                                                                                                                                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edit in place                                           | shadcn's own advice, Thrive                                                                                                                       | Merge by hand on every upstream change                                                                                                                                                                                          |
| Pristine `ui/`, wrappers beside it                      | Polar (`ui/`, `atoms/`), Kibo (`bump-ui`)                                                                                                         | Polar needs `!` to win. Vercel's lesson (updated 2025-10-17, still shows the deprecated `diff`) says proxying eases updates but doubles the system. https://vercel.com/academy/shadcn-ui/updating-and-maintaining-components.md |
| Pristine `ui/`, restyle by `data-slot` in unlayered CSS | coss's dashboard `globals.css`                                                                                                                    | **[R]** Removes the conflict with `cn`, but moves styling away from the component                                                                                                                                               |
| Own primitives under the same names                     | coss, ReUI, Unkey                                                                                                                                 | Upstream fixes stop arriving at all                                                                                                                                                                                             |
| Pristine upstream branch, `git merge-file`              | A tutorial, not a postmortem. https://dev.to/wingo-ui/how-to-update-shadcn-components-without-losing-edits-o1b (seen in search results, not read) | **[R]** Gives the missing merge base                                                                                                                                                                                            |

**What goes wrong [V, issues read unless noted].**

- No upstream version to compare with; users told to merge by hand. https://github.com/shadcn-ui/ui/discussions/7170
- Manifests omit npm dependencies their files import. https://github.com/shadcn-ui/ui/issues/12244
- Generated code fails `exactOptionalPropertyTypes` (title only). https://github.com/shadcn-ui/ui/issues/12493
- Primitive swaps are done by agent, not codemod, because of customised files. https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default
- Fix at upstream and wait: PR #12543 for #12516 is still open.

**I found no real postmortem** of a shadcn-based system run for years. Thrive's is a migration story, and the rest are tutorials.

**[R] A layout for Aurum,** drawn from Polar and the monorepo page:

```txt
src/components/ui/   copied by the CLI, edited only where the theme cannot reach
src/components/      Aurum's own, named by meaning, composed from ui/
src/styles/          theme.css, preset.css with @source
docs/shadcn-edits.md every edit to ui/, with its reason
```

Keep an unmodified copy of `ui/` at the installed version (a branch or a folder) so `git merge-file` has a base. The skill's report step already asks for a list of edited component files with reasons.

---

## 6. Accessibility

**No audit of the React Aria base found.** Railing's index (generated 2026-09-15) lists `@base-ui/react` and `radix-ui` for shadcn's results, not `react-aria-components`. https://railing.dev/api/index.json

**Aria-specific [V].**

- Focus rings use CSS `:focus-visible`, so mouse users see a ring on the trigger after every menu closes. A comment suggests Adobe's plugin as a fix. https://github.com/shadcn-ui/ui/issues/11258
- Tooltip demo (title only). https://github.com/shadcn-ui/ui/issues/12119
- `Checkbox` uses a component marked deprecated in `react-aria-components`. https://github.com/shadcn-ui/ui/discussions/11437

**Shared by the styles, so they can reach the app's `aria-mira` [V].**

- Accordion trigger has no visible keyboard focus in **luma, maia, mira, rhea**, all bases. https://github.com/shadcn-ui/ui/issues/11320
- `outline-none` versus `outline-hidden` left half migrated. https://github.com/shadcn-ui/ui/issues/10101
- Outline Button: no visible focus in forced colours, dark. https://github.com/shadcn-ui/ui/issues/12516
- By title, base not checked: Spinner announces nothing (#11531), ItemGroup empty list (#11532), SidebarContent no landmark (#11533), calendar week number (#11602), SelectItem highlight 1.09:1 (#12520).

Base or Radix only, so not the app's concern unless proven otherwise: invalid controls lose focus (#12344), Slider (#12345), Combobox (#11554, #11589), Progress (#11904).

**My scan and measurement [V-run].**

| Check                                                                   | Result                                                                                                                                                                                              |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 61 `aria-nova` items, `forced-colors:`                                  | **0 items.** `aria-mira` sample of 6: also 0                                                                                                                                                        |
| 57 Adobe `tailwind-*` items                                             | **39 items** use it. Their `focusRing` is a real `outline` with `forced-colors:outline-[Highlight]`                                                                                                 |
| `aria-nova` class counts                                                | `outline-none` 35, `outline-hidden` 24; `focus-visible:` 79, `data-focus-visible:` 9                                                                                                                |
| Chrome, forced colours, ring only (`outline-none focus-visible:ring-3`) | Rest and focus screenshots **byte-identical**; outline none, box-shadow none                                                                                                                        |
| Same, with `focus-visible:border-ring` (the real default Button)        | Differs, so the border is the only cue left                                                                                                                                                         |
| Same, with unconditional `outline-hidden`                               | Byte-identical. My reading: the outline shows at rest too, so it does not signal focus. Use it under a `focus:` variant, as Tailwind's own example does. https://tailwindcss.com/docs/outline-style |

**How others test.**

- Adobe: a separate Chromatic forced-colours run.
- Playwright: a `forcedColors` context option (source docs read). Vitest passes `contextOptions` to Playwright. https://vitest.dev/config/browser/playwright
- Tailwind: `forced-colors:` and `forced-color-adjust-none`. https://tailwindcss.com/docs/forced-color-adjust
- Storybook's axe addon defaults to WCAG 2.0 and 2.1 A and AA plus best practices, with `runOnly` for 2.2. https://storybook.js.org/docs/writing-tests/accessibility-testing
- **Text spacing:** I found nobody testing it. A shadcn issue search returned nothing relevant.
- shadcn's tree has **no Storybook, Playwright or axe** files. Aurum's `docs/accessibility.md` already runs forced colours and text spacing on every story (decision 0081), which is ahead of all of these.

---

## 7. Storybook and Vitest

- **No shadcn guide.** Storybook's Tailwind recipe still speaks of `tailwind.config.js`; its one lasting step is to import your CSS in `.storybook/preview`. https://storybook.js.org/recipes/tailwindcss
- Real setups [V]: Medusa imports `../src/main.css` and uses `withThemeByDataAttribute`. Adobe's starter is the same with `@tailwindcss/postcss` and `@storybook/addon-themes`, on Storybook 9. https://github.com/adobe/react-spectrum/tree/main/starters/tailwind
- `addon-themes` applies its class to `parentSelector`, default `html`. https://github.com/storybookjs/storybook/blob/next/code/addons/themes/docs/api.md
- **[R] Gotcha:** shadcn's `@custom-variant dark (&:is(.dark *))` needs a dark _ancestor_, and overlays portal to `body`. Set the class on `html`, not on a per-story wrapper, or portaled content renders light.
- **[R] Gotcha:** Tailwind's scan starts from the working directory, so a package's Storybook and its build can see different files. Set `@import "tailwindcss" source("../src")`.
- **Vitest [V].** `@storybook/addon-vitest` 10.6.5 peers on Vitest `^4 || ^5` and defaults to browser mode on Chromium. https://storybook.js.org/docs/writing-tests/integrations/vitest-addon. The `css` option does not apply to browser tests. https://vitest.dev/config/css. **[R]** So Tailwind must be in the Vite config Vitest uses, and computed-style tests work. Medusa's jsdom with `css: false` cannot do that.
- Aurum already has Storybook 10.6.5 and Vitest 5.0.5 browser mode. **[R]** Adding `@tailwindcss/vite` should be the only change. Not tested here.

---

## Not reached or not verified

- **Not run:** Storybook with Tailwind in this stack; a real package build; `shadcn add` from an actual GitHub address; pnpm or hoisted `@source` paths; a duplicate `react-aria-components` between package and app.
- **Forced colours are measured on a static page** with classes copied from the registry, not rendered React Aria components, and by Chrome emulation, not Windows.
- **Title only:** #12119, #12493, #11531, #11532, #11533, #11602, #12520.
- **Through a page summariser or search only:** Thrive, Vercel Academy; the dev.to tutorial was not opened.
- **Could not establish:** whether any shadcn-based npm package has external users at scale. Polar's README discourages outside use. `coss`'s repository looks like a fresh public snapshot (created 2026-10-10), so its history is not visible. `@polar-sh/orbit`'s relation to shadcn was not read in depth.
- **Not found:** a maintainer statement on packaging, or any real postmortem.

---

## What this means for Aurum

1. **Flag: a separate-repo package is off the documented path**, not against any rule. The CLI cannot update what the app imports from it, and shadcn's update story stops at Aurum's repository. Polar and Medusa show it working.
2. **Fits the owner's line [R]:** Aurum's repository becomes a shadcn project, `style: aria-mira` to match the app, with `ui/` from the CLI and Aurum's pieces beside it. It reverses decisions 0055 and 0072.
3. **Flag: `exactOptionalPropertyTypes`.** Aurum sets it and generated code reportedly fails it. Decide first: relax it, or patch every copied file, which adds to the edit list.
4. **Keep shadcn's token names, in `theme.css`;** add money tokens as surface and `-foreground` pairs. Then the app's own shadcn components share the theme.
5. **Type styles must be `@utility type-*`,** not `--text-*`, and `text-*` must come out of any base class they replace. This matches shadcn's skill and my test.
6. **Ship `preset.css` with its own `@source`,** so the app only imports it, with `tailwindcss` as a peer. No prebuilt CSS, no prefix.
7. **Flag: two copies of Button.** The app keeps its `ui/` and gets Aurum's, compiled by the app's Tailwind. Same tokens, but a shared version of `react-aria-components` must be a peer. Needs a real test.
8. **A registry is optional on top.** If wanted, re-export stubs as Astryx does, or theme items, which overwrite local values on re-add. It buys discovery and agent access, not updates.
9. **Editing is unavoidable for heights, focus and states,** so record each edit and keep an unmodified base for three-way merges. `--diff` alone cannot separate them.
10. **Accessibility stays Aurum's own work.** Aria-base items have zero forced-colours classes, so Aurum needs its own focus treatment and keeps decision 0081's checks. Check `aria-mira` accordions first.

Experiment files: `/private/tmp/claude-501/-Users-arend-Projects-aurum-ds/7b0e54f3-bda4-4f23-9bde-3351d7db44fe/scratchpad/direction-v2/exp/`
