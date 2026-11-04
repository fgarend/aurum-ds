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
    // Any violation axe finds fails the story's test (decision 0057), by the rules of Aurum's target, WCAG 2.2 AA
    // (decision 0079), which the addon's default stops short of, and of axe's best practices.
    a11y: {
      test: "error",
      options: {
        runOnly: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ],
      },
    },
  },
};

export default preview;
