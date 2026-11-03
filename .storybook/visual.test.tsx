// Every story tagged visual, compared with its approved screenshot in Chromium (decisions 0034 and 0060), so a
// component gets its screenshot from a tag on its story, with no test file of its own.
import { composeStories } from "@storybook/react-vite";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

const modules = import.meta.glob<Parameters<typeof composeStories>[0]>(
  "../src/**/*.stories.tsx",
  { eager: true },
);
const stories = Object.values(modules)
  .flatMap((module) => Object.values(composeStories(module)))
  .filter((story) => story.tags.includes("visual"));

it.each(stories.map((story) => [story.id, story] as const))(
  "draws %s as approved",
  async (id, Story) => {
    const screen = await render(<Story />);
    await document.fonts.ready;
    // The story on the canvas every story runs on (.storybook/preview.tsx).
    const canvas = screen.container.querySelector("[data-story-canvas]");
    if (canvas === null) {
      throw new Error(`${id} is not on the stories' canvas`);
    }

    await expect.element(page.elementLocator(canvas)).toMatchScreenshot(id);
  },
);
