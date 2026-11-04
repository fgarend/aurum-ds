import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowLeftRight,
  CreditCard,
  FileText,
  House,
  Landmark,
  TrendingUp,
} from "lucide-react";
import { createRef } from "react";
import { expect, userEvent, within } from "storybook/test";
import { AppLayout } from "../AppLayout/AppLayout.js";
import { NavItem, NavList, NavSection } from "./NavList.js";

// The pieces of a navigation (decision 0086), which an app puts where it wants: their directions, what is left out when
// empty, long text, and on a dark surface. What is checked of WCAG 2.2: 1.3.1 and 4.1.2, a list of lists with their names
// and the current page; 1.4.1 and 1.4.11, a mark that tells the current page by its shape; 2.1.1 and 2.4.7, keyboard and
// its ring; 2.5.8, by axe. Contrast by axe, and on the dark surface by test/contrast.test.ts. Not here: a screen reader,
// in docs/accessibility-script.md.
const meta = {
  title: "Components/NavList",
  component: NavList,
  args: { "aria-label": "Main" },
} satisfies Meta<typeof NavList>;

type Story = StoryObj<typeof meta>;

// The tokens' values, as the browser computes them.
const controlMd = 40;
const iconSize = 20;
const inkMuted = "rgb(75, 79, 85)";
const primary = "rgb(43, 46, 51)";
const primarySoft = "rgb(236, 235, 230)";
const gold = "rgb(240, 189, 42)";
const onInverse = "rgb(244, 244, 242)";
const onInverseMuted = "rgb(207, 209, 212)";
const inverseActive = "rgba(255, 255, 255, 0.1)";
const focusOffset = "-2px";
const markWidth = "4px";
const narrowWidth = 320;
const narrowViewport = {
  viewport: {
    options: {
      narrow: {
        name: "Narrow",
        styles: { width: `${narrowWidth}px`, height: "600px" },
        type: "mobile",
      },
    },
  },
};

const longName = /^A name long/u;
const wordName = /^Avery/u;

const items = (
  <>
    <NavItem href="#overview" icon={House}>
      Overview
    </NavItem>
    <NavItem href="#transactions" icon={ArrowLeftRight}>
      Transactions
    </NavItem>
    <NavSection label="Investments">
      <NavItem aria-current="page" href="#portfolio" icon={TrendingUp}>
        Portfolio
      </NavItem>
      <NavItem href="#notes" icon={FileText}>
        Notes
      </NavItem>
    </NavSection>
    <NavSection label="Accounts">
      <NavItem href="#checking" icon={Landmark}>
        Checking
      </NavItem>
      <NavItem href="#card" icon={CreditCard}>
        Card
      </NavItem>
    </NavSection>
  </>
);

// The mark beside the current page, which tells it apart by its shape.
function mark(item: Element): CSSStyleDeclaration {
  return getComputedStyle(item, "::before");
}

// In a column, by default: what an app puts in a rail of its own.
const Default: Story = {
  tags: ["visual"],
  args: { children: items },
  play: async ({ args, canvas: screen, mount }) => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLAnchorElement>();
    const sectionRef = createRef<HTMLLIElement>();
    await mount(
      <NavList {...args} className="from-app" data-from-app="" ref={navRef}>
        {items}
        <NavSection className="from-app" label="More" ref={sectionRef}>
          <NavItem
            className="from-app"
            data-from-app=""
            end="7"
            href="#more"
            icon={FileText}
            ref={itemRef}
          >
            More
          </NavItem>
        </NavSection>
      </NavList>,
    );
    const nav = screen.getByRole("navigation", { name: "Main" });
    const current = screen.getByRole("link", { name: "Portfolio" });
    const other = screen.getByRole("link", { name: "Notes" });

    // What the app passes reaches the elements, without taking what is Aurum's.
    await expect(navRef.current).toBe(nav);
    await expect(nav).toHaveClass("au-nav-list", "from-app");
    await expect(nav).toHaveAttribute("data-from-app");
    await expect(nav).toHaveAttribute("data-orientation", "vertical");
    await expect(sectionRef.current).toHaveClass("au-nav-section", "from-app");
    await expect(itemRef.current).toBe(
      screen.getByRole("link", { name: "More 7" }),
    );
    await expect(itemRef.current).toHaveClass("au-nav-item", "from-app");
    await expect(itemRef.current).toHaveAttribute("data-from-app");
    await expect(itemRef.current).toHaveAttribute("href", "#more");

    // A list of lists, each section named, so a screen reader counts and names them.
    const investments = screen.getByRole("list", { name: "Investments" });
    await expect(within(investments).getAllByRole("link")).toHaveLength(2);
    await expect(screen.getByText("Investments")).toBeVisible();

    // An item: control-md tall, its icon hidden from screen readers, as long as its name is there.
    await expect(other.offsetHeight).toBe(controlMd);
    await expect(getComputedStyle(other).color).toBe(inkMuted);
    const icon = other.querySelector("svg");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveAttribute("width", String(iconSize));

    // The current page: a fill, a heavier name, a mark, and an outline that shows where forced colours remove the fill.
    await expect(getComputedStyle(current).backgroundColor).toBe(primarySoft);
    await expect(getComputedStyle(current).color).toBe(primary);
    await expect(getComputedStyle(current).fontWeight).toBe("500");
    await expect(getComputedStyle(current).outlineStyle).toBe("solid");
    await expect(mark(current).borderLeftWidth).toBe(markWidth);
    await expect(mark(current).borderLeftColor).toBe(primary);
    await expect(getComputedStyle(other).fontWeight).toBe("400");
    await expect(mark(other).content).toBe("none");

    // By keyboard, in order, with a ring inside the item, which an area that scrolls would cut outside it.
    await userEvent.tab();
    const first = screen.getByRole("link", { name: "Overview" });
    await expect(first).toHaveFocus();
    await expect(getComputedStyle(first).outlineOffset).toBe(focusOffset);
    await userEvent.tab();
    await expect(
      screen.getByRole("link", { name: "Transactions" }),
    ).toHaveFocus();
  },
};

// With no icons, as a line of text links often has, and a name that is more than text. The current page keeps its mark.
const WithoutIcons: Story = {
  tags: ["visual"],
  args: {
    orientation: "horizontal",
    children: (
      <>
        <NavItem aria-current="page" href="#overview">
          Overview
        </NavItem>
        <NavItem href="#notes">
          Notes <small>new</small>
        </NavItem>
      </>
    ),
  },
  play: async ({ canvas: screen }) => {
    const current = screen.getByRole("link", { name: "Overview" });
    const other = screen.getByRole("link", { name: "Notes new" });

    await expect(current.querySelector("svg")).toBeNull();
    await expect(current.offsetHeight).toBe(controlMd);
    await expect(mark(current).borderLeftWidth).toBe(markWidth);
    await expect(other.querySelector("small")).toBeInTheDocument();
  },
};

// Something at the end of an item, here plain text, keeping its width beside any name.
const WithEnd: Story = {
  tags: ["visual"],
  render: (args) => (
    <div style={{ width: 248 }}>
      <NavList {...args}>
        <NavItem end="142" href="#short" icon={ArrowLeftRight}>
          Short
        </NavItem>
        <NavItem end="142" href="#long" icon={ArrowLeftRight}>
          A name long enough to take more than one line
        </NavItem>
      </NavList>
    </div>
  ),
  play: async ({ canvas: screen }) => {
    const [short, long] = screen.getAllByText("142");

    await expect((short as HTMLElement).offsetWidth).toBeGreaterThan(0);
    await expect(long?.offsetWidth).toBe(short?.offsetWidth);
    await expect(short?.getBoundingClientRect().right).toBe(
      long?.getBoundingClientRect().right,
    );
  },
};

// With nothing in it, no empty list is drawn. A section with no items draws nothing, not even its title; items need no
// section; and no page has to be current.
const Empty: Story = {
  args: {
    children: (
      <>
        <NavSection label="Nothing here" />
        <NavItem href="#alone" icon={House}>
          Alone
        </NavItem>
        <NavSection label="Something here">
          <NavItem href="#inside" icon={FileText}>
            Inside
          </NavItem>
        </NavSection>
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

const EmptyList: Story = {
  tags: ["!dev"],
  play: async ({ canvas: screen }) => {
    await expect(screen.getByRole("navigation")).toBeInTheDocument();
    await expect(screen.queryByRole("list")).toBeNull();
  },
};

// Long text in a narrow room: a name breaks into lines and its item grows, a word with no spaces breaks too, and nothing is
// cut.
const LongText: Story = {
  tags: ["visual"],
  render: (args) => (
    <div style={{ width: 248 }}>
      <NavList {...args}>
        <NavItem href="#long" icon={FileText}>
          A name long enough to take more than one line
        </NavItem>
        <NavItem href="#word" icon={FileText}>
          Averyveryveryveryveryveryveryverylongword
        </NavItem>
        <NavSection label="A section title long enough to take more than one line">
          <NavItem href="#inside" icon={House}>
            Inside
          </NavItem>
        </NavSection>
      </NavList>
    </div>
  ),
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
  },
};

// In one line: each name whole, and the titles only for screen readers.
const Horizontal: Story = {
  tags: ["visual"],
  args: { orientation: "horizontal", children: items },
  play: async ({ canvas: screen }) => {
    const nav = screen.getByRole("navigation", { name: "Main" });
    const first = screen.getByRole("link", { name: "Overview" });
    const last = screen.getByRole("link", { name: "Card" });

    await expect(nav).toHaveAttribute("data-orientation", "horizontal");
    await expect(last.getBoundingClientRect().top).toBe(
      first.getBoundingClientRect().top,
    );
    await expect(last.getBoundingClientRect().left).toBeGreaterThan(
      first.getBoundingClientRect().right,
    );
    await expect(
      screen.getByText("Investments").offsetWidth,
    ).toBeLessThanOrEqual(1);
    await expect(
      screen.getByRole("list", { name: "Investments" }),
    ).toBeVisible();
  },
};

// In a column, from breakpoint-md up, with nothing to measure.
const ResponsiveWide: Story = {
  args: { orientation: "responsive", children: items },
  play: async ({ canvas: screen }) => {
    const first = screen.getByRole("link", { name: "Overview" });
    const second = screen.getByRole("link", { name: "Transactions" });

    await expect(second.getBoundingClientRect().top).toBeGreaterThan(
      first.getBoundingClientRect().top,
    );
    await expect(screen.getByText("Investments").offsetWidth).toBeGreaterThan(
      1,
    );
  },
};

// And in one line below it, where AppLayout puts the navigation at the top and scrolls it sideways, with the page still.
const ResponsiveNarrow: Story = {
  parameters: narrowViewport,
  globals: { viewport: { value: "narrow" } },
  render: (args) => (
    <AppLayout
      navigation={<NavList {...args} orientation="responsive" />}
      skipLabel="Skip to the content"
    >
      The page
    </AppLayout>
  ),
  args: { children: items },
  play: async ({ canvas: screen }) => {
    const first = screen.getByRole("link", { name: "Overview" });
    const last = screen.getByRole("link", { name: "Card" });
    const area = screen.getByRole("complementary");

    await expect(window.innerWidth).toBe(narrowWidth);
    await expect(last.getBoundingClientRect().top).toBe(
      first.getBoundingClientRect().top,
    );
    await expect(first.offsetHeight).toBe(controlMd);
    await expect(area.scrollWidth).toBeGreaterThan(area.clientWidth);
    await expect(document.documentElement.scrollWidth).toBe(narrowWidth);
  },
};

// On a dark surface the app marks (decision 0087), the same pieces follow with no prop, and the current page's accent is
// gold.
const OnADarkSurface: Story = {
  tags: ["visual"],
  render: (args) => (
    <div data-au-surface="inverse" style={{ width: 248 }}>
      <NavList {...args} />
    </div>
  ),
  args: { children: items },
  play: async ({ canvas: screen }) => {
    const current = screen.getByRole("link", { name: "Portfolio" });
    const other = screen.getByRole("link", { name: "Notes" });

    await expect(getComputedStyle(other).color).toBe(onInverseMuted);
    await expect(getComputedStyle(current).backgroundColor).toBe(inverseActive);
    await expect(getComputedStyle(current).color).toBe(onInverse);
    await expect(
      getComputedStyle(current.querySelector("svg") as Element).color,
    ).toBe(gold);
    await expect(mark(current).borderLeftColor).toBe(gold);

    await userEvent.tab();
    const first = screen.getByRole("link", { name: "Overview" });
    await expect(getComputedStyle(first).outlineColor).toBe(onInverse);
  },
};

export default meta;
export {
  Default,
  Empty,
  EmptyList,
  Horizontal,
  LongText,
  OnADarkSurface,
  ResponsiveNarrow,
  ResponsiveWide,
  WithEnd,
  WithoutIcons,
};
