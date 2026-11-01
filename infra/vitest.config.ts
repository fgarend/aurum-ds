// Test settings (decisions 0020 and 0032). It lives here because Vite's types bring Node's along (decision 0018).
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, type ViteUserConfig } from "vitest/config";

// A browser test is named *.browser.test.ts or .tsx, and the other projects leave it out.
const browserTests = "**/*.browser.test.{ts,tsx}";
const notBrowserTests = ["**/node_modules/**", browserTests];
const chromium = {
  enabled: true,
  provider: playwright(),
  headless: true,
  instances: [{ browser: "chromium" as const }],
  // One canvas for every visual test: the tokens' content-max wide (decision 0034).
  viewport: { width: 1200, height: 800 },
  // A failing test's screenshot would land among the approved ones.
  screenshotFailures: false,
};

const config: ViteUserConfig = defineConfig({
  test: {
    // A test with JSX runs in a DOM, any other test runs in Node, and a browser test runs in Chromium.
    projects: [
      {
        test: {
          name: "node",
          include: ["**/*.test.ts"],
          exclude: notBrowserTests,
          environment: "node",
        },
      },
      {
        test: {
          name: "dom",
          include: ["**/*.test.tsx"],
          exclude: notBrowserTests,
          environment: "jsdom",
          setupFiles: ["src/test-setup.ts"],
        },
      },
      {
        test: { name: "browser", include: [browserTests], browser: chromium },
      },
      // Only make reference runs it, to render the artifact's previews (decision 0033).
      {
        test: {
          name: "reference",
          include: ["infra/reference.render.ts"],
          // A page large enough that no preview is scaled down to fit.
          browser: {
            ...chromium,
            provider: playwright({
              contextOptions: { viewport: { width: 3000, height: 3000 } },
            }),
          },
        },
      },
    ],
  },
});

export default config;
