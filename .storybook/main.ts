// Storybook's settings (decision 0057): the stories of the components, with the accessibility and Vitest addons.
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  // Aurum's fonts, from its dependencies, for the interface's manager-head.html.
  staticDirs: [
    { from: "../node_modules/@fontsource-variable/geist/files", to: "/fonts" },
    {
      from: "../node_modules/@fontsource-variable/geist-mono/files",
      to: "/fonts",
    },
  ],
  // No usage data leaves for Storybook's servers, and no notice of its new versions shows: Storybook is updated by
  // the update routine (decision 0023).
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
};

export default config;
