import { composeStories } from "@storybook/react-vite";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import * as stories from "./Icon.stories.js";

const { Sizes } = composeStories(stories);

// Every size the design uses, compared with the approved screenshot (decision 0034), from the Icon's stories.
it("draws the icons as approved", async () => {
  await render(<Sizes />);

  await expect.element(page.getByTestId("icons")).toMatchScreenshot("icons");
});
