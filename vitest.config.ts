// Test settings (decisions 0020, 0032, 0039, 0044, 0045 and 0052). Its types are checked with Node's, in tsconfig.node.json, since
// Vite's types bring them along.
import { readFileSync } from "node:fs";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, type ViteUserConfig } from "vitest/config";

// A browser test, named *.browser.test.ts or .tsx, checks behaviour in every browser. A visual test, named
// *.visual.test.ts or .tsx, compares screenshots in Chromium only. The other projects leave both out.
const browserTests = "**/*.browser.test.{ts,tsx}";
const visualTests = "**/*.visual.test.{ts,tsx}";
// The checks of the repository as a whole live in test/ (decision 0039), in a project of their own.
const repositoryChecks = "test/**/*.test.ts";
// One visual test compares every story tagged visual with its screenshot (decision 0060). It imports the stories,
// so it gets what every story runs in.
const storyScreenshots = ".storybook/visual.test.tsx";
const storySetup = ".storybook/vitest.setup.ts";
const notBrowserTests = ["**/node_modules/**", browserTests, visualTests];
const pixels = /^(?<number>\d+)px$/u;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// The tokens' content-max, in pixels, the width of every visual test (decision 0034).
function contentMax(): number {
  const tokens: unknown = JSON.parse(
    readFileSync(new URL("src/tokens/tokens.json", import.meta.url), "utf8"),
  );
  const layout = isRecord(tokens) ? tokens["layout"] : undefined;
  const list = isRecord(layout) ? layout["tokens"] : undefined;
  const token = Array.isArray(list)
    ? list.find((entry) => isRecord(entry) && entry["name"] === "content-max")
    : undefined;
  const value = isRecord(token) ? token["value"] : undefined;
  const width = typeof value === "string" ? value.match(pixels) : null;
  if (width?.groups === undefined) {
    throw new Error("src/tokens/tokens.json has no content-max in pixels");
  }
  return Number(width.groups["number"]);
}

const inBrowser = {
  enabled: true,
  provider: playwright(),
  headless: true,
  // One canvas for every browser test: the tokens' content-max wide (decision 0034).
  viewport: { width: contentMax(), height: 800 },
  // A failing test's screenshot would land among the approved ones.
  screenshotFailures: false,
};
// A function, so each project gets objects of its own: Vitest 5 writes each project's name into its instances, and
// projects that shared one instance took each other's tests.
const chromium = (): typeof inBrowser & {
  instances: { browser: "chromium" }[];
} => ({
  ...inBrowser,
  instances: [{ browser: "chromium" }],
});
// Playwright's own browsers: Chromium, and Firefox and WebKit, Safari's engine (decision 0045). A function too.
const everyBrowser = (): typeof inBrowser & {
  instances: { browser: "chromium" | "firefox" | "webkit" }[];
} => ({
  ...inBrowser,
  instances: [
    { browser: "chromium" },
    { browser: "firefox" },
    { browser: "webkit" },
  ],
});

const config: ViteUserConfig = defineConfig({
  test: {
    // What make coverage measures (decision 0061): every line of the package's code, which its tests must all run.
    // The table lists only files below 100%, in the terminal and in coverage/coverage.txt for the run's page in
    // continuous integration, and coverage/index.html colours each line.
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.stories.tsx", "**/*.d.ts"],
      reporter: [
        ["text", { skipFull: true }],
        ["text", { skipFull: true, file: "coverage.txt" }],
        "html",
      ],
      thresholds: { 100: true },
      // coverage/ is mounted into the container, which cannot remove it: make coverage empties it first.
      clean: false,
    },
    // A test of logic runs in Node, a browser test in every browser, and a visual test in Chromium. Components are
    // tested in the browser only (decision 0052), in their stories (decision 0059).
    projects: [
      {
        test: {
          name: "node",
          include: ["**/*.test.ts"],
          exclude: [...notBrowserTests, repositoryChecks],
          environment: "node",
        },
      },
      {
        test: {
          name: "repository",
          include: [repositoryChecks],
          environment: "node",
        },
      },
      {
        test: {
          name: "browser",
          include: [browserTests],
          browser: everyBrowser(),
        },
      },
      // Every story, rendered in the three browsers, with axe checking it (decision 0057) and its play function
      // checking what it shows (decision 0059).
      {
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: { name: "storybook", browser: everyBrowser() },
      },
      {
        test: {
          name: "visual",
          include: [visualTests, storyScreenshots],
          browser: chromium(),
          setupFiles: [storySetup],
        },
      },
      // Only make reference runs it, to render the artifact's previews and the prototype's screens (decisions 0033 and
      // 0035).
      {
        test: {
          name: "reference",
          include: ["scripts/render-reference/*.render.ts"],
          browser: {
            ...chromium(),
            provider: playwright({
              // A page large enough that no preview is scaled down to fit.
              contextOptions: { viewport: { width: 3000, height: 3000 } },
              // One raster thread, redrawing the whole page, so two runs draw every pixel alike (decision 0041).
              launchOptions: {
                args: ["--num-raster-threads=1", "--disable-partial-raster"],
              },
            }),
          },
        },
      },
    ],
  },
});

export default config;
