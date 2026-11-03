# 0057. Storybook

- Status: Accepted; partly superseded by 0059: the checks of a component, in its stories; and by 0060: the visual test, one for every story
- Date: 2026-11-02

## Context

Each component has examples, every variant and state, needed in three
places: the browser test, the visual test and a gallery to browse and
compare with the design. Written three times, they drift. Five of the nine
design systems surveyed use Storybook (item 5.19). Its Vitest addon runs each
story as a test in Vitest's browser mode, and its accessibility addon runs
axe on each story; running axe inside Vitest's browser mode has no official
way otherwise.

## Decision

- **Storybook, with React and Vite**, its accessibility addon and its Vitest
  addon. Its settings sit in `.storybook/`, at the root, where it looks for
  them.
- **A component's examples live only in its stories**, `Button.stories.tsx`,
  with no assertions. Its browser test and its visual test import them
  (`composeStories`), so an example is written once.
- **Every story is a test in the three browsers**, in Vitest's `storybook`
  project, part of `make test-browser`, and **axe fails it on any
  violation** (`a11y.test: "error"`).
- **Interactive components get keyboard and focus tests** in their browser
  test, following the W3C's ARIA Authoring Practices for their kind of
  control.
- **`make storybook` serves the gallery** at `http://localhost:6006`, in a
  Compose service of its own, on `STORYBOOK_PORT` of `infra/settings.env`;
  `.claude/launch.json` starts it.
- **No usage data leaves for Storybook** (`disableTelemetry`), **and no notice
  of its new versions shows** (`disableWhatsNewNotifications`): the update
  routine updates it (decision 0023).
- **Storybook's interface takes the light side of Aurum**, as the content of
  its screens has it, with every value read from `tokens.json` in
  `.storybook/manager.ts`: white panels on the canvas, thin `line` borders,
  Aurum's radii, Geist and Geist Mono, the gold accent, and the brand mark of
  the Sidebar, an A on a gold square, beside the name Aurum DS. Storybook
  writes white on the selected story, so its background is Aurum's dark
  grey, `ink-muted`, where white reads. The fonts come from the package's
  dependencies (`staticDirs`), declared in `.storybook/manager-head.html`, so
  nothing is fetched from elsewhere. The dark side of the Sidebar stays out:
  Storybook's theme has no way to darken only its menu.
- **esbuild's install script is refused**, said out loud in
  `pnpm-workspace.yaml` (`allowBuilds`): its binary arrives as a package of
  its own.
- **Storybook's own declaration files do not pass TypeScript 7 yet**, so the
  settings that see them, those of the tests and stories
  (`tsconfig.browser.json`) and of what runs on Node (`tsconfig.node.json`),
  skip checking third-party declarations (`skipLibCheck`); our use of them is
  still checked. The package's code keeps every check. This goes when
  Storybook supports TypeScript 7.
- **Stories and tests may infer the types of what they export**
  (`isolatedDeclarations` off in `tsconfig.browser.json`): they emit no
  declarations.

## Alternatives considered

- **No Storybook.** Fewer dependencies, but examples repeated across tests,
  no gallery, and an axe helper of our own.
- **Assertions in stories (`play`).** Tests beside the examples, but a
  gallery mixed with checks.
- **Allowing esbuild's script.** Its own check of the binary, but code of a
  dependency run on every install.
- **Waiting for Storybook's TypeScript 7 support.** Every check everywhere,
  but no gallery and no axe until then.

## Consequences

- About 140 packages more among the development dependencies.
- Each component has three test files and one of stories.
- `skipLibCheck` is a check made by hand at each update, until it goes.
