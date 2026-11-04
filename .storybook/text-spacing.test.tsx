// Every story with WCAG 1.4.12's text spacing, in every browser (decision 0081): nothing may be cut or spill out, so a
// component gets this check from having a story, with no test of its own.
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

// The criterion's values, set on everything, and nothing else changed.
const spacing = `
  * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  p {
    margin-bottom: 2em !important;
  }
`;
// Hidden from the screen on purpose, for screen readers.
const hidden = ".au-sr, .au-sidebar-section-label";
// An area that scrolls lets everything be reached; any other has lost what does not fit.
const reachable = ["auto", "scroll"];

function cutElements(root: Element): string[] {
  return [...root.querySelectorAll('[class^="au-"], [class*=" au-"]')]
    .filter((element) => !element.matches(hidden))
    .filter((element) => {
      const { overflowX, overflowY } = getComputedStyle(element);
      return (
        (!reachable.includes(overflowX) &&
          element.scrollWidth > element.clientWidth + 1) ||
        (!reachable.includes(overflowY) &&
          element.scrollHeight > element.clientHeight + 1)
      );
    })
    .filter((element) => element.clientWidth > 0)
    .map((element) => element.className.toString());
}

it.each(stories.map((story) => [story.id, story] as const))(
  "keeps %s whole with WCAG's text spacing",
  async (_id, Story) => {
    const style = document.createElement("style");
    style.textContent = spacing;
    document.head.append(style);
    const screen = await render(<Story />);
    await document.fonts.ready;

    expect(cutElements(screen.container)).toEqual([]);

    await screen.unmount();
    style.remove();
  },
);
