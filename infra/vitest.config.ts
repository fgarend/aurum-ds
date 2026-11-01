// Test settings (decision 0020). It lives here because Vite's types bring Node's along (decision 0018).
import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
  test: {
    // A test with JSX runs in a DOM, any other test runs in Node.
    projects: [
      {
        test: { name: "node", include: ["**/*.test.ts"], environment: "node" },
      },
      {
        test: {
          name: "dom",
          include: ["**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["src/test-setup.ts"],
        },
      },
    ],
  },
});

export default config;
