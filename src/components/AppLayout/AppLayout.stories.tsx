import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, createRef } from "react";
import { expect } from "storybook/test";
import { AppLayout } from "./AppLayout.js";

// The frame's examples (decision 0073), each checking what it shows: the page's canvas, the app's navigation beside the
// content, an optional top bar, and the content up to the tokens' content-max, centred.
const meta = {
  title: "Components/AppLayout",
  component: AppLayout,
  // The frame takes the whole screen, with none of the gallery's padding around it.
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppLayout>;

type Story = StoryObj<typeof meta>;

// The tokens' values, as the browser computes them: canvas #faf9f6, content-max, space-10, and sidebar-width, which the
// navigation here takes for itself.
const canvas = "rgb(250, 249, 246)";
const contentMax = 1360;
const sectionGap = "40px";
const navigationWidth = 248;

// What the app puts in each area, here a coloured block with its name in the middle, so the areas show at a glance.
function block(color: string, minHeight: number | string): CSSProperties {
  return {
    display: "grid",
    placeItems: "center",
    minHeight,
    background: `var(--au-${color})`,
  };
}

const navigation = (
  <nav
    aria-label="Main"
    style={{ ...block("cat-1-soft", "100%"), width: navigationWidth }}
  >
    Navigation
  </nav>
);
const topBar = (
  <div data-testid="top-bar" style={block("cat-2-soft", 48)}>
    Path and filters
  </div>
);
const sections = [
  <section data-testid="first" key="first" style={block("cat-3-soft", 160)}>
    First section
  </section>,
  <section data-testid="second" key="second" style={block("cat-4-soft", 160)}>
    Second section
  </section>,
];

// The navigation, the top bar and the page, as the app has them.
const Default: Story = {
  tags: ["visual"],
  args: { navigation, topBar, children: sections },
  play: async ({ args, canvas: screen, canvasElement, mount }) => {
    const ref = createRef<HTMLDivElement>();
    await mount(<AppLayout {...args} className="from-app" ref={ref} />);
    const root = canvasElement.querySelector<HTMLElement>(".au-app-layout");
    const bar = screen.getByTestId("top-bar");
    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");

    await expect(ref.current).toBe(root);
    await expect(root?.className).toBe("au-app-layout from-app");
    await expect(root && getComputedStyle(root).backgroundColor).toBe(canvas);
    await expect(
      screen.getByRole("navigation", { name: "Main" }).offsetWidth,
    ).toBe(navigationWidth);
    await expect(screen.getByRole("main")).toContainElement(first);
    await expect(screen.getByRole("banner")).toContainElement(bar);
    await expect(getComputedStyle(screen.getByRole("banner")).position).toBe(
      "sticky",
    );
    await expect(getComputedStyle(screen.getByRole("main")).rowGap).toBe(
      sectionGap,
    );
    await expect(first.getBoundingClientRect().bottom + 40).toBe(
      second.getBoundingClientRect().top,
    );
  },
};

// Without a top bar, as the design's screens: no bar is drawn.
const WithoutTopBar: Story = {
  args: { navigation, children: sections },
  play: async ({ canvas: screen }) => {
    await expect(screen.queryByRole("banner")).toBeNull();
    await expect(screen.getByRole("main")).toBeInTheDocument();
  },
};

// On a screen wider than the content, which stops at content-max, centred, with the top bar on the same edges. Only
// a test: the gallery's canvas is not this wide.
const WideScreen: Story = {
  tags: ["!dev"],
  args: { topBar, children: sections },
  render: (args) => (
    <div style={{ width: 2000 }}>
      <AppLayout {...args} />
    </div>
  ),
  play: async ({ canvas: screen }) => {
    const bar = screen.getByTestId("top-bar").getBoundingClientRect();
    const first = screen.getByTestId("first").getBoundingClientRect();

    await expect(first.width).toBe(contentMax);
    await expect(first.left).toBe(bar.left);
    await expect(first.right).toBe(bar.right);
  },
};

export default meta;
export { Default, WideScreen, WithoutTopBar };
