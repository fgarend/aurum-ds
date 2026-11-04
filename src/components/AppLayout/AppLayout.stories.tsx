import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type CSSProperties,
  createRef,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { expect, userEvent } from "storybook/test";
import { AppLayout, type AppLayoutProps } from "./AppLayout.js";

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
const controlMd = 40;
const narrowWidth = 320;

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
const skipLabel = "Skip to the content";
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
  args: { navigation, skipLabel, topBar, children: sections },
  play: async ({ args, canvas: screen, canvasElement, mount }) => {
    const ref = createRef<HTMLDivElement>();
    await mount(<AppLayout {...args} className="from-app" ref={ref} />);
    const root = canvasElement.querySelector<HTMLElement>(".au-app-layout");
    const bar = screen.getByTestId("top-bar");
    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");
    const main = screen.getByRole("main");

    await expect(ref.current).toBe(root);
    await expect(root?.className).toBe("au-app-layout from-app");
    await expect(root && getComputedStyle(root).backgroundColor).toBe(canvas);
    await expect(
      screen.getByRole("navigation", { name: "Main" }).offsetWidth,
    ).toBe(navigationWidth);

    // The landmarks (decision 0085): the navigation's area, and the page with its path and filters, which is no banner.
    await expect(screen.getByRole("complementary")).toContainElement(
      screen.getByRole("navigation", { name: "Main" }),
    );
    await expect(main).toContainElement(bar);
    await expect(main).toContainElement(first);
    await expect(bar.closest("header")?.closest("main")).toBe(main);

    await expect(getComputedStyle(first.parentElement as Element).rowGap).toBe(
      sectionGap,
    );
    await expect(first.getBoundingClientRect().bottom + 40).toBe(
      second.getBoundingClientRect().top,
    );
  },
};

// Without a top bar, as the design's screens: no bar is drawn.
const WithoutTopBar: Story = {
  args: { navigation, skipLabel, children: sections },
  play: async ({ canvas: screen }) => {
    await expect(screen.queryByTestId("top-bar")).toBeNull();
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

    await expect(screen.queryByRole("link")).toBeNull();
    await expect(first.width).toBe(contentMax);
    await expect(first.left).toBe(bar.left);
    await expect(first.right).toBe(bar.right);
  },
};

function Skipping(props: AppLayoutProps): ReactNode {
  const link = useRef<HTMLDivElement>(null);
  useEffect(() => link.current?.querySelector("a")?.focus(), []);
  return (
    <div ref={link}>
      <AppLayout {...props} />
    </div>
  );
}

// The link that skips the navigation, the first thing a keyboard reaches: hidden until it has focus, and taking focus to
// the content (WCAG 2.4.1 and 2.4.3). Shown with its focus.
const SkipLink: Story = {
  tags: ["visual"],
  args: {
    navigation: (
      <nav aria-label="Main" style={{ width: navigationWidth }}>
        <a href="#page">A page</a>
      </nav>
    ),
    skipLabel,
    topBar: <button type="button">In the top bar</button>,
    children: <button type="button">In the content</button>,
  },
  render: (args) => <Skipping {...args} />,
  play: async ({ canvas: screen }) => {
    const link = screen.getByRole("link", { name: skipLabel });
    (document.activeElement as HTMLElement | null)?.blur();
    await expect(link.offsetWidth).toBeLessThanOrEqual(1);
    await expect(getComputedStyle(link).clipPath).not.toBe("none");

    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link.offsetWidth).toBeGreaterThan(1);
    await expect(link.offsetHeight).toBeGreaterThanOrEqual(controlMd);
    const box = link.getBoundingClientRect();
    await expect(box.top).toBeGreaterThanOrEqual(0);
    await expect(box.left).toBeGreaterThanOrEqual(0);
    await expect(document.elementFromPoint(box.left + 4, box.top + 4)).toBe(
      link,
    );

    await userEvent.keyboard("{Enter}");
    await expect(screen.getByRole("main")).toHaveFocus();

    // Into the page from its top, so its filters come first.
    await userEvent.tab();
    await expect(
      screen.getByRole("button", { name: "In the top bar" }),
    ).toHaveFocus();
    await userEvent.tab();
    await expect(
      screen.getByRole("button", { name: "In the content" }),
    ).toHaveFocus();
  },
};

// The top bar scrolls away with the page, so it covers nothing a keyboard reaches (WCAG 2.4.11, decision 0082), and takes
// no height from a person at a high zoom. Only a test: it shows nothing the other examples do not.
const TopBarScrollsAway: Story = {
  tags: ["!dev"],
  args: {
    navigation,
    skipLabel,
    topBar,
    children: (
      <>
        <div style={{ height: 1000 }} />
        <button type="button">Reached by keyboard</button>
        <div style={{ height: 3000 }} />
      </>
    ),
  },
  play: async ({ canvas: screen }) => {
    const button = screen.getByRole("button", {
      name: "Reached by keyboard",
    });
    const bar = screen.getByTestId("top-bar");

    window.scrollTo({ top: 1000, behavior: "instant" });
    button.focus();

    await expect(button).toHaveFocus();
    await expect(bar.getBoundingClientRect().bottom).toBeLessThanOrEqual(0);
    await expect(button.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  },
};

const pages = Array.from({ length: 80 }, (_, index) => `page-${index + 1}`);
const manyLinks = pages.map((page) => (
  <div key={page} style={{ whiteSpace: "nowrap" }}>
    <a href={`#${page}`} style={{ display: "inline-block", minHeight: 24 }}>
      {page}
    </a>
  </div>
));

// A navigation taller than the screen: its area scrolls, and the page does not move with it (decision 0085).
const TallNavigation: Story = {
  tags: ["!dev"],
  args: {
    navigation: (
      <nav aria-label="Main" style={{ width: navigationWidth }}>
        {manyLinks}
      </nav>
    ),
    skipLabel,
    children: sections,
  },
  play: async ({ canvas: screen }) => {
    const area = screen.getByRole("complementary");

    await expect(area.offsetHeight).toBe(window.innerHeight);
    await expect(area.scrollHeight).toBeGreaterThan(area.clientHeight);
    await expect(getComputedStyle(area).overflowY).toBe("auto");
    await expect(document.documentElement.scrollHeight).toBe(
      document.documentElement.clientHeight,
    );
  },
};

// Below breakpoint-md the navigation is over the rest, and scrolls sideways by itself, with the page still.
const NarrowScreen: Story = {
  parameters: {
    viewport: {
      options: {
        narrow: {
          name: "Narrow",
          styles: { width: `${narrowWidth}px`, height: "600px" },
          type: "mobile",
        },
      },
    },
  },
  globals: { viewport: { value: "narrow" } },
  args: {
    navigation: (
      <nav
        aria-label="Main"
        style={{ display: "flex", gap: 16, width: "max-content" }}
      >
        {manyLinks.slice(0, 10)}
      </nav>
    ),
    skipLabel,
    topBar,
    children: sections,
  },
  play: async ({ canvas: screen }) => {
    const area = screen.getByRole("complementary");
    const main = screen.getByRole("main");

    await expect(window.innerWidth).toBe(narrowWidth);
    await expect(area.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      main.getBoundingClientRect().top,
    );
    await expect(area.scrollWidth).toBeGreaterThan(area.clientWidth);
    await expect(document.documentElement.scrollWidth).toBe(narrowWidth);
  },
};

export default meta;
export {
  Default,
  NarrowScreen,
  SkipLink,
  TallNavigation,
  TopBarScrollsAway,
  WideScreen,
  WithoutTopBar,
};
