import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowLeftRight,
  CreditCard,
  FileText,
  House,
  Landmark,
  TrendingUp,
} from "lucide-react";
import { type CSSProperties, createRef, type ReactNode, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AppLayout } from "../AppLayout/AppLayout.js";
import { Sidebar, SidebarItem, SidebarSection } from "./Sidebar.js";

// The navigation's examples (decision 0075), each checking what it shows: the three variants, what is left out when
// empty, and what gives way when there is too much, in height, in width or in text.
const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  args: { "aria-label": "Main" },
  decorators: [
    // The height of the screen, which the Sidebar fills.
    (Story, { parameters }) => (
      <div style={{ height: parameters["height"] ?? 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

type Story = StoryObj<typeof meta>;

// The tokens' values, as the browser computes them.
const sidebarWidth = 248;
const controlMd = 40;
const iconSize = 20;
const ink = "rgb(35, 38, 43)";
const inkMuted = "rgb(75, 79, 85)";
const line = "rgb(231, 229, 223)";
const surface = "rgb(255, 255, 255)";
const primary = "rgb(43, 46, 51)";
const primarySoft = "rgb(236, 235, 230)";
const gold = "rgb(240, 189, 42)";
const onInverse = "rgb(244, 244, 242)";
const onInverseMuted = "rgb(207, 209, 212)";
const inverseActive = "rgba(255, 255, 255, 0.1)";
const none = "rgba(0, 0, 0, 0)";
const focusOffset = "-2px";
const narrowWidth = 320;

// Each item's accessible name, as far as tells it apart.
const shortName = /^Short/u;
const longName = /^A name long/u;
const wordName = /^Avery/u;

// What the app puts in the areas: its own brand, drawn by hand, and a coloured block with its name in the middle.
const brandMark: CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: 28,
  height: 28,
  borderRadius: "var(--au-radius-md)",
  background: "var(--au-gold)",
  color: "var(--au-on-gold)",
};
const header = (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span aria-hidden="true" style={brandMark}>
      A
    </span>
    <span>Aurum</span>
  </div>
);
const footer = (
  <div
    style={{
      display: "grid",
      placeItems: "center",
      minHeight: 48,
      background: "var(--au-cat-1-soft)",
      color: "var(--au-ink)",
    }}
  >
    Footer
  </div>
);

const items = (
  <>
    <SidebarItem href="#overview" icon={House}>
      Overview
    </SidebarItem>
    <SidebarItem href="#transactions" icon={ArrowLeftRight}>
      Transactions
    </SidebarItem>
    <SidebarSection label="Investments">
      <SidebarItem aria-current="page" href="#portfolio" icon={TrendingUp}>
        Portfolio
      </SidebarItem>
      <SidebarItem href="#notes" icon={FileText}>
        Notes
      </SidebarItem>
    </SidebarSection>
    <SidebarSection label="Accounts">
      <SidebarItem href="#checking" icon={Landmark}>
        Checking
      </SidebarItem>
      <SidebarItem href="#card" icon={CreditCard}>
        Card
      </SidebarItem>
    </SidebarSection>
  </>
);

function many(current: string | undefined): ReactNode {
  return Array.from({ length: 30 }, (_, index) => {
    const name = `Page ${index + 1}`;
    return (
      <SidebarItem
        aria-current={name === current ? "page" : undefined}
        href={`#page-${index + 1}`}
        icon={FileText}
        key={name}
      >
        {name}
      </SidebarItem>
    );
  });
}

function scrollArea(nav: Element): HTMLElement {
  const area = nav.querySelector<HTMLElement>(".au-sidebar-items");
  if (area === null) {
    throw new Error("the Sidebar has no area of items");
  }
  return area;
}

// Within a pixel, since browsers round a scroll differently.
function isInside(inner: DOMRect, outer: DOMRect): boolean {
  return (
    inner.top >= outer.top - 1 &&
    inner.bottom <= outer.bottom + 1 &&
    inner.left >= outer.left - 1 &&
    inner.right <= outer.right + 1
  );
}

// The graphite rail, the default: the app's areas, its items in sections, and the current page.
const Inverse: Story = {
  tags: ["visual"],
  args: { header, footer, children: items },
  play: async ({ args, canvas: screen, mount }) => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLAnchorElement>();
    const sectionRef = createRef<HTMLLIElement>();
    await mount(
      <Sidebar {...args} className="from-app" data-from-app="" ref={navRef}>
        {items}
        <SidebarSection className="from-app" label="More" ref={sectionRef}>
          <SidebarItem
            className="from-app"
            data-from-app=""
            end="7"
            href="#more"
            icon={FileText}
            ref={itemRef}
          >
            More
          </SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    const nav = screen.getByRole("navigation", { name: "Main" });
    const current = screen.getByRole("link", { name: "Portfolio" });
    const other = screen.getByRole("link", { name: "Notes" });

    // What the app passes reaches the elements, without taking what is Aurum's.
    await expect(navRef.current).toBe(nav);
    await expect(nav).toHaveClass("au-sidebar", "from-app");
    await expect(nav).toHaveAttribute("data-from-app");
    await expect(nav).toHaveAttribute("data-variant", "inverse");
    await expect(sectionRef.current).toHaveClass(
      "au-sidebar-section",
      "from-app",
    );
    await expect(itemRef.current).toBe(
      screen.getByRole("link", { name: "More 7" }),
    );
    await expect(itemRef.current).toHaveClass("au-sidebar-item", "from-app");
    await expect(itemRef.current).toHaveAttribute("data-from-app");
    await expect(itemRef.current).toHaveAttribute("href", "#more");

    // The rail: its width, graphite, and scroll bars that belong on it.
    await expect(nav.offsetWidth).toBe(sidebarWidth);
    await expect(getComputedStyle(nav).backgroundImage).toContain("gradient");
    await expect(getComputedStyle(nav).colorScheme).toBe("dark");
    await expect(getComputedStyle(nav).color).toBe(onInverse);
    await expect(nav).toContainElement(screen.getByText("Aurum"));
    await expect(nav).toContainElement(screen.getByText("Footer"));

    // A list of lists, each section named, so a screen reader counts and names them.
    const investments = screen.getByRole("list", { name: "Investments" });
    await expect(within(investments).getAllByRole("link")).toHaveLength(2);
    await expect(screen.getByText("Investments")).toBeVisible();

    // An item: control-md tall, its icon hidden from screen readers, as long as its name is there.
    await expect(other.offsetHeight).toBe(controlMd);
    await expect(getComputedStyle(other).color).toBe(onInverseMuted);
    const icon = other.querySelector("svg");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveAttribute("width", String(iconSize));

    // The current page: a fill, a gold icon, and an outline that shows where forced colours remove the fill.
    await expect(getComputedStyle(current).backgroundColor).toBe(inverseActive);
    await expect(getComputedStyle(current).color).toBe(onInverse);
    await expect(getComputedStyle(current).fontWeight).toBe("500");
    await expect(getComputedStyle(current).outlineStyle).toBe("solid");
    await expect(
      getComputedStyle(current.querySelector("svg") as Element).color,
    ).toBe(gold);
    await expect(getComputedStyle(other).fontWeight).toBe("400");

    // By keyboard, in order, with a ring inside the item, which the area's scrolling would cut outside it.
    await userEvent.tab();
    await expect(screen.getByRole("link", { name: "Overview" })).toHaveFocus();
    await expect(
      getComputedStyle(screen.getByRole("link", { name: "Overview" }))
        .outlineOffset,
    ).toBe(focusOffset);
    await userEvent.tab();
    await expect(
      screen.getByRole("link", { name: "Transactions" }),
    ).toHaveFocus();
  },
};

// The white rail, with a border.
const Surface: Story = {
  tags: ["visual"],
  args: { variant: "surface", header, footer, children: items },
  play: async ({ canvas: screen }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });
    const current = screen.getByRole("link", { name: "Portfolio" });
    const other = screen.getByRole("link", { name: "Notes" });

    await expect(nav).toHaveAttribute("data-variant", "surface");
    await expect(getComputedStyle(nav).backgroundColor).toBe(surface);
    await expect(getComputedStyle(nav).borderRightColor).toBe(line);
    await expect(getComputedStyle(nav).colorScheme).toBe("light");
    await expect(getComputedStyle(other).color).toBe(inkMuted);
    await expect(getComputedStyle(current).backgroundColor).toBe(primarySoft);
    await expect(getComputedStyle(current).color).toBe(primary);
    await expect(getComputedStyle(current).outlineStyle).toBe("solid");
  },
};

// No panel: the rail on the page's ground, the current page a white chip.
const Canvas: Story = {
  tags: ["visual"],
  args: { variant: "canvas", header, footer, children: items },
  play: async ({ canvas: screen }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });
    const current = screen.getByRole("link", { name: "Portfolio" });

    await expect(nav).toHaveAttribute("data-variant", "canvas");
    await expect(getComputedStyle(nav).backgroundColor).toBe(none);
    await expect(getComputedStyle(nav).borderRightWidth).toBe("0px");
    await expect(getComputedStyle(current).backgroundColor).toBe(surface);
    await expect(getComputedStyle(current).color).toBe(ink);
    await expect(getComputedStyle(current).outlineColor).toBe(line);
  },
};

// Something at the end of an item, here plain text, keeping its width beside any name.
const WithEnd: Story = {
  tags: ["visual"],
  args: {
    children: (
      <>
        <SidebarItem end="142" href="#short" icon={ArrowLeftRight}>
          Short
        </SidebarItem>
        <SidebarItem end="142" href="#long" icon={ArrowLeftRight}>
          A name long enough to take more than one line
        </SidebarItem>
      </>
    ),
  },
  play: async ({ canvas: screen }) => {
    const [short, long] = screen.getAllByText("142");
    const item = screen.getByRole("link", { name: shortName });

    await expect(item).toContainElement(short as HTMLElement);
    await expect(short?.offsetWidth).toBeGreaterThan(0);
    await expect(long?.offsetWidth).toBe(short?.offsetWidth);
    await expect(short?.getBoundingClientRect().right).toBe(
      long?.getBoundingClientRect().right,
    );
  },
};

// With nothing but its name: the rail stands, and no empty area, line or list is drawn.
const Empty: Story = {
  tags: ["visual"],
  play: async ({ canvas: screen, canvasElement }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });

    await expect(nav.offsetWidth).toBe(sidebarWidth);
    await expect(nav.offsetHeight).toBe(560);
    await expect(canvasElement.querySelector(".au-sidebar-header")).toBeNull();
    await expect(canvasElement.querySelector(".au-sidebar-footer")).toBeNull();
    await expect(screen.queryByRole("list")).toBeNull();
  },
};

// A section with no items draws nothing, not even its title; items need no section; and no page has to be current.
const EmptySection: Story = {
  args: {
    children: (
      <>
        <SidebarSection label="Nothing here" />
        <SidebarItem href="#alone" icon={House}>
          Alone
        </SidebarItem>
        <SidebarSection label="Something here">
          <SidebarItem href="#inside" icon={FileText}>
            Inside
          </SidebarItem>
        </SidebarSection>
      </>
    ),
  },
  play: async ({ canvas: screen, canvasElement }) => {
    await expect(screen.getByText("Nothing here")).not.toBeVisible();
    await expect(
      screen.queryByRole("list", { name: "Nothing here" }),
    ).toBeNull();
    await expect(screen.getByRole("link", { name: "Alone" })).toBeVisible();
    await expect(screen.getByText("Something here")).toBeVisible();
    await expect(canvasElement.querySelector("[aria-current]")).toBeNull();
  },
};

// More items than the height: only the middle scrolls, and the current page, the last, comes into view by itself,
// moving nothing but the area.
const ManyItems: Story = {
  tags: ["visual"],
  parameters: { height: 400 },
  args: { header, footer, children: many("Page 30") },
  play: async ({ canvas: screen }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });
    const area = scrollArea(nav);
    const current = screen.getByRole("link", { name: "Page 30" });

    await expect(nav.offsetHeight).toBe(400);
    await expect(nav.scrollHeight).toBe(nav.clientHeight);
    await expect(area.scrollHeight).toBeGreaterThan(area.clientHeight);
    await waitFor(() =>
      expect(
        isInside(current.getBoundingClientRect(), area.getBoundingClientRect()),
      ).toBe(true),
    );
    await expect(screen.getByText("Aurum")).toBeVisible();
    await expect(
      isInside(
        screen.getByText("Footer").getBoundingClientRect(),
        nav.getBoundingClientRect(),
      ),
    ).toBe(true);
    await expect(window.scrollY).toBe(0);
  },
};

function Moving(): ReactNode {
  const [current, setCurrent] = useState("Page 30");
  return (
    <Sidebar
      aria-label="Main"
      variant="surface"
      footer={
        <>
          <button onClick={() => setCurrent("Page 1")} type="button">
            To the first
          </button>
          <button onClick={() => setCurrent("Page 2")} type="button">
            To the second
          </button>
        </>
      }
    >
      {many(current)}
    </Sidebar>
  );
}

// The current page changing, as a link inside the page can do: the area moves only when it has to. Only a test: its
// buttons are no example.
const CurrentMoves: Story = {
  tags: ["!dev"],
  parameters: { height: 400 },
  render: () => <Moving />,
  play: async ({ canvas: screen }) => {
    const area = scrollArea(screen.getByRole("navigation"));

    await waitFor(() => expect(area.scrollTop).toBeGreaterThan(0));
    await userEvent.click(screen.getByRole("button", { name: "To the first" }));
    await waitFor(() => expect(area.scrollTop).toBe(0));
    await userEvent.click(
      screen.getByRole("button", { name: "To the second" }),
    );
    await expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(area.scrollTop).toBe(0);
  },
};

// A screen too short for the areas, as at a high zoom: the whole rail scrolls, so nothing is out of reach.
const ShortScreen: Story = {
  parameters: { height: 200 },
  args: { header, footer, children: many(undefined) },
  play: async ({ canvas: screen }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });
    const area = scrollArea(nav);

    await expect(nav.offsetHeight).toBe(200);
    await expect(nav.scrollHeight).toBeGreaterThan(nav.clientHeight);
    await expect(area.offsetHeight).toBeGreaterThanOrEqual(controlMd * 2);
    nav.scrollTop = nav.scrollHeight;
    await expect(
      isInside(
        screen.getByText("Footer").getBoundingClientRect(),
        nav.getBoundingClientRect(),
      ),
    ).toBe(true);
  },
};

// Long text: a name breaks into lines and its item grows, a word with no spaces breaks too, and nothing is cut.
const LongText: Story = {
  tags: ["visual"],
  args: {
    header: <span>A very long name for the brand of an application</span>,
    children: (
      <>
        <SidebarItem href="#long" icon={FileText}>
          A name long enough to take more than one line
        </SidebarItem>
        <SidebarItem href="#word" icon={FileText}>
          Averyveryveryveryveryveryveryverylongword
        </SidebarItem>
        <SidebarSection label="A section title long enough to take more than one line">
          <SidebarItem href="#inside" icon={House}>
            Inside
          </SidebarItem>
        </SidebarSection>
      </>
    ),
  },
  play: async ({ canvas: screen }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });
    const long = screen.getByRole("link", { name: longName });
    const word = screen.getByRole("link", { name: wordName });

    await expect(long.offsetHeight).toBeGreaterThan(controlMd);
    await expect(word.offsetHeight).toBeGreaterThan(controlMd);
    await expect(
      screen.getByRole("link", { name: "Inside" }).offsetHeight,
    ).toBe(controlMd);
    await expect(word.scrollWidth).toBe(word.clientWidth);
    await expect(nav.scrollWidth).toBe(nav.clientWidth);
    await expect(nav.offsetWidth).toBe(sidebarWidth);
  },
};

// Below breakpoint-md, a strip across the top: the items in one line that scrolls, each name whole, the titles only
// for screen readers, and the current page in view.
const NarrowScreen: Story = {
  parameters: {
    height: "auto",
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
    header,
    footer,
    children: (
      <>
        <SidebarItem href="#overview" icon={House}>
          Overview
        </SidebarItem>
        <SidebarSection label="Investments">
          <SidebarItem href="#portfolio" icon={TrendingUp}>
            Portfolio
          </SidebarItem>
          <SidebarItem href="#notes" icon={FileText}>
            Notes
          </SidebarItem>
        </SidebarSection>
        <SidebarSection label="Accounts">
          <SidebarItem href="#checking" icon={Landmark}>
            Checking
          </SidebarItem>
          <SidebarItem aria-current="page" href="#last" icon={CreditCard}>
            The last of them
          </SidebarItem>
        </SidebarSection>
      </>
    ),
  },
  play: async ({ canvas: screen }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });
    const first = screen.getByRole("link", { name: "Overview" });
    const last = screen.getByRole("link", { name: "The last of them" });
    const title = screen.getByText("Investments");

    await expect(window.innerWidth).toBe(narrowWidth);
    await expect(nav.offsetWidth).toBe(narrowWidth);
    await expect(first.offsetHeight).toBe(controlMd);
    await expect(last.offsetHeight).toBe(controlMd);
    await expect(last.getBoundingClientRect().top).toBe(
      first.getBoundingClientRect().top,
    );
    await expect(nav.scrollWidth).toBeGreaterThan(nav.clientWidth);
    await expect(document.documentElement.scrollWidth).toBe(narrowWidth);
    await expect(title.offsetWidth).toBeLessThanOrEqual(1);
    await expect(
      screen.getByRole("list", { name: "Investments" }),
    ).toBeVisible();
    await waitFor(() =>
      expect(
        isInside(last.getBoundingClientRect(), nav.getBoundingClientRect()),
      ).toBe(true),
    );
  },
};

// In the frame of the app's pages, where it is meant to live: as tall as the screen, beside the content.
const InAppLayout: Story = {
  tags: ["visual"],
  parameters: { height: "auto", layout: "fullscreen" },
  render: () => (
    <AppLayout
      skipLabel="Skip to the content"
      navigation={
        <Sidebar aria-label="Main" footer={footer} header={header}>
          {items}
        </Sidebar>
      }
    >
      <div
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: 160,
          background: "var(--au-cat-3-soft)",
        }}
      >
        The page
      </div>
    </AppLayout>
  ),
  play: async ({ canvas: screen }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });

    await expect(nav.offsetHeight).toBe(window.innerHeight);
    await expect(nav.offsetWidth).toBe(sidebarWidth);
    await expect(nav.getBoundingClientRect().right).toBe(
      screen.getByRole("main").getBoundingClientRect().left,
    );
  },
};

export default meta;
export {
  Canvas,
  CurrentMoves,
  Empty,
  EmptySection,
  InAppLayout,
  Inverse,
  LongText,
  ManyItems,
  NarrowScreen,
  ShortScreen,
  Surface,
  WithEnd,
};
