// Every story in forced colours, as Windows's contrast themes set (decision 0081), in the browsers whose emulation
// forces them: Chromium and Firefox, since WebKit's only answers the media query. Fills disappear there, so what marks a
// state has to be something else, and a component gets this check from having a story.
import { composeStories } from "@storybook/react-vite";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

const modules = import.meta.glob<Parameters<typeof composeStories>[0]>(
  "../src/**/*.stories.tsx",
  { eager: true },
);
const stories = Object.values(modules).flatMap((module) =>
  Object.values(composeStories(module)),
);

const none = "rgba(0, 0, 0, 0)";

function hasOutline(element: Element): boolean {
  const { outlineColor, outlineStyle } = getComputedStyle(element);
  return outlineStyle !== "none" && outlineColor !== none;
}

// What only a fill told apart, with the fill gone: the current page, and a tooltip's edge.
function withoutEdge(root: Element): string[] {
  return [
    ...root.querySelectorAll('[aria-current="page"], .au-tooltip:popover-open'),
  ]
    .filter((element) => !hasOutline(element))
    .map((element) => element.className.toString());
}

// A navigation's mark, drawn as a border so it stays (decision 0084).
function withoutMark(root: Element): string[] {
  return [...root.querySelectorAll('.au-nav-item[aria-current="page"]')]
    .filter((item) => {
      const { borderLeftColor, borderLeftStyle } = getComputedStyle(
        item,
        "::before",
      );
      return borderLeftStyle !== "solid" || borderLeftColor === none;
    })
    .map((item) => item.textContent ?? "");
}

// A colour set on the svg itself stays as it is in forced colours, whatever is behind it now.
function offColourIcons(root: Element): string[] {
  return [...root.querySelectorAll("a .au-icon, button .au-icon")]
    .filter((icon) => {
      const parent = icon.closest("a, button") as Element;
      return getComputedStyle(icon).color !== getComputedStyle(parent).color;
    })
    .map((icon) => icon.closest("a, button")?.textContent ?? "");
}

it("runs in forced colours", () => {
  expect(matchMedia("(forced-colors: active)").matches).toBe(true);
});

it.each(stories.map((story) => [story.id, story] as const))(
  "keeps %s legible in forced colours",
  async (_id, Story) => {
    const screen = await render(<Story />);
    await document.fonts.ready;
    // A story that opens its tooltip does so as it draws.
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    expect(withoutEdge(screen.container)).toEqual([]);
    expect(withoutMark(screen.container)).toEqual([]);
    expect(offColourIcons(screen.container)).toEqual([]);

    await screen.unmount();
  },
);
