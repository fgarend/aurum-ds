// What every story runs in (decision 0057): Aurum's root, as the app has it (decision 0070), which brings the fonts, the
// tokens and the base styles, around the canvas the app's shell paints, since the root draws no box.
import type { Preview } from "@storybook/react-vite";
import { AurumRoot } from "../src/components/AurumRoot/AurumRoot.js";

const preview: Preview = {
  decorators: [
    (Story) => (
      <AurumRoot>
        <div data-story-canvas="" style={{ background: "var(--au-canvas)" }}>
          <Story />
        </div>
      </AurumRoot>
    ),
  ],
  parameters: {
    // Any violation axe finds fails the story's test (decision 0057).
    a11y: { test: "error" },
  },
};

export default preview;
