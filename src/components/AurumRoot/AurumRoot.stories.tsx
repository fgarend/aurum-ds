import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRef } from "react";
import { expect } from "storybook/test";
import { AurumRoot } from "./AurumRoot.js";

// The root's examples (decision 0070), each checking what it shows: where Aurum begins, with its fonts, tokens and base
// styles, drawing no box of its own.
const meta = {
  title: "Components/AurumRoot",
  component: AurumRoot,
} satisfies Meta<typeof AurumRoot>;

type Story = StoryObj<typeof meta>;

// The tokens' values, as the browser computes them: ink #23262b.
const ink = "rgb(35, 38, 43)";
// WebKit writes the family names without quotes, Chromium and Firefox with them.
const geistFirst = /^"?Geist Variable"?,/u;

// The root of the story, the innermost one: every story already runs inside a root (.storybook/preview.tsx).
function root(canvasElement: HTMLElement): HTMLElement {
  const roots = canvasElement.querySelectorAll<HTMLElement>("div.au-root");
  const last = roots[roots.length - 1];
  if (last === undefined) {
    throw new Error("the story draws no root");
  }
  return last;
}

// Around the app's own content, which takes Aurum's font and colour, laid out as if the root were not there.
const Default: Story = {
  play: async ({ canvasElement, mount }) => {
    const ref = createRef<HTMLDivElement>();
    await mount(
      <AurumRoot className="from-app" ref={ref}>
        <p>Balance</p>
      </AurumRoot>,
    );
    const element = root(canvasElement);
    const text = element.querySelector("p");
    if (text === null) {
      throw new Error("the root draws no children");
    }

    await expect(getComputedStyle(element).display).toBe("contents");
    await expect([...element.classList]).toEqual(["au-root", "from-app"]);
    await expect(ref.current).toBe(element);
    await expect(getComputedStyle(text).fontFamily).toMatch(geistFirst);
    await expect(getComputedStyle(text).color).toBe(ink);
  },
};

export default meta;
export { Default };
