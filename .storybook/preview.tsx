// What every story runs in (decision 0057): the package's fonts, tokens and base styles, inside the root Aurum
// starts at, as the app has them.
import type { Preview } from "@storybook/react-vite";
import "../src/fonts/fonts.css";
import "../src/tokens/tokens.css";
import "../src/styles/base.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="au-root">
        <Story />
      </div>
    ),
  ],
  parameters: {
    // Any violation axe finds fails the story's test (decision 0057).
    a11y: { test: "error" },
  },
};

export default preview;
