import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText } from "lucide-react";
import {
  type CSSProperties,
  createRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { expect, fireEvent, userEvent, waitFor } from "storybook/test";
import { Icon } from "../Icon/Icon.js";
import { Tooltip, type TooltipProps } from "./Tooltip.js";

// The name of a control with no text of its own, on the screen (decision 0078). What each example checks, of WCAG 2.2:
// 1.4.13, content on hover or focus: it can be dismissed with Escape, hovered over and stays while wanted. 2.1.1,
// keyboard: it opens on focus. 4.1.2, name: the control keeps its own, and screen readers are not told it twice.
// 1.4.3, contrast, is measured by axe on these flat colours; not checked here: real screen readers and real touch.
const control = (
  <button aria-label="Notes" type="button">
    <Icon icon={FileText} />
  </button>
);

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: { text: "Notes", children: control },
} satisfies Meta<typeof Tooltip>;

type Story = StoryObj<typeof meta>;

// The tokens' values, as the browser computes them.
const primary = "rgb(43, 46, 51)";
const onPrimary = "rgb(255, 255, 255)";
const radiusMd = "6px";
const gap = 8;
const hoverDelay = 150;
const longest = 288;

const centred: CSSProperties = {
  display: "grid",
  placeItems: "center",
  minHeight: 240,
};

function isOpen(popup: Element | null): boolean {
  return popup?.matches(":popover-open") ?? false;
}

function pause(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

// A control focused as the page opens, so an example shows the tooltip open, and its screenshot too.
function Opened(props: TooltipProps): ReactNode {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => button.current?.focus(), []);
  return (
    <div style={centred}>
      <Tooltip {...props}>
        <button aria-label={props.text} ref={button} type="button">
          <Icon icon={FileText} />
        </button>
      </Tooltip>
    </div>
  );
}

// Above the control by default, open on keyboard focus at once, and closed by Escape or by focus leaving.
const Default: Story = {
  tags: ["visual"],
  render: (args) => <Opened {...args} />,
  play: async ({ args, canvas: screen, mount }) => {
    const ref = createRef<HTMLSpanElement>();
    await mount(
      <div style={centred}>
        <Tooltip {...args} className="from-app" data-from-app="" ref={ref}>
          {control}
        </Tooltip>
      </div>,
    );
    const button = screen.getByRole("button", { name: "Notes" });
    const popup = ref.current as HTMLElement;

    await expect(popup).toHaveClass("au-tooltip", "from-app");
    await expect(popup).toHaveAttribute("data-from-app");
    await expect(isOpen(popup)).toBe(false);
    await expect(popup).not.toBeVisible();

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(isOpen(popup)).toBe(true));
    await expect(popup).toBeVisible();
    await expect(popup).toHaveTextContent("Notes");
    // Only on the screen: the control has its name, and focus stays on it.
    await expect(popup).toHaveAttribute("aria-hidden", "true");
    await expect(button).toHaveAccessibleName("Notes");
    await expect(button).toHaveFocus();

    const style = getComputedStyle(popup);
    await expect(style.backgroundColor).toBe(primary);
    await expect(style.color).toBe(onPrimary);
    await expect(style.borderTopLeftRadius).toBe(radiusMd);
    const box = popup.getBoundingClientRect();
    const target = button.getBoundingClientRect();
    await expect(target.top - box.bottom).toBeCloseTo(gap, 0);
    await expect(box.left + box.width / 2).toBeCloseTo(
      target.left + target.width / 2,
      0,
    );

    // 1.4.13: dismissed without moving focus.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(isOpen(popup)).toBe(false));
    await expect(button).toHaveFocus();

    await userEvent.tab({ shift: true });
    await userEvent.tab();
    await waitFor(() => expect(isOpen(popup)).toBe(true));
    await userEvent.tab();
    await waitFor(() => expect(isOpen(popup)).toBe(false));
  },
};

// With a pointer: after a moment, staying while the pointer crosses onto it, and closing once it leaves. A click closes.
const Hover: Story = {
  render: (args) => (
    <div style={centred}>
      <Tooltip {...args}>{control}</Tooltip>
    </div>
  ),
  play: async ({ canvas: screen, canvasElement }) => {
    const button = screen.getByRole("button", { name: "Notes" });
    const popup = canvasElement.querySelector(".au-tooltip");

    await userEvent.hover(button);
    await expect(isOpen(popup)).toBe(false);
    await waitFor(() => expect(isOpen(popup)).toBe(true));

    // 1.4.13: over the tooltip, it stays.
    await userEvent.unhover(button);
    await userEvent.hover(popup as Element);
    await pause(hoverDelay * 2);
    await expect(isOpen(popup)).toBe(true);

    // Not at once, so the pointer can cross the gap: read with nothing awaited, for no clock to run out.
    fireEvent.pointerOut(popup as Element, { relatedTarget: document.body });
    const openAsItLeaves = isOpen(popup);
    await expect(openAsItLeaves).toBe(true);
    await waitFor(() => expect(isOpen(popup)).toBe(false));

    await userEvent.hover(button);
    await waitFor(() => expect(isOpen(popup)).toBe(true));
    await userEvent.click(button);
    await waitFor(() => expect(isOpen(popup)).toBe(false));
    await userEvent.unhover(button);

    // 1.4.13: while it has keyboard focus, the pointer leaving does not close it.
    (button as HTMLElement).blur();
    await userEvent.tab();
    await waitFor(() => expect(isOpen(popup)).toBe(true));
    await userEvent.hover(button);
    await userEvent.unhover(button);
    await pause(hoverDelay * 2);
    await expect(isOpen(popup)).toBe(true);
  },
};

// A touch does not open it, nor does focus that is not the keyboard's, which is what a tap leaves: a control never
// depends on it for its name. Only a test: it looks like any closed one.
const Touch: Story = {
  tags: ["!dev"],
  render: (args) => (
    <div style={centred}>
      <Tooltip {...args}>{control}</Tooltip>
    </div>
  ),
  play: async ({ canvas: screen, canvasElement }) => {
    const button = screen.getByRole("button", { name: "Notes" });

    fireEvent.pointerOver(button, { pointerType: "touch" });
    fireEvent.focusIn(button);
    await pause(hoverDelay * 2);
    await expect(isOpen(canvasElement.querySelector(".au-tooltip"))).toBe(
      false,
    );
  },
};

const sides = {
  right: (box: DOMRect, target: DOMRect) => box.left - target.right,
  bottom: (box: DOMRect, target: DOMRect) => box.top - target.bottom,
  left: (box: DOMRect, target: DOMRect) => target.left - box.right,
};

function onSide(side: keyof typeof sides): Story {
  return {
    tags: ["visual"],
    args: { side },
    render: (args) => <Opened {...args} />,
    play: async ({ canvas: screen, canvasElement }) => {
      const button = screen.getByRole("button", { name: "Notes" });
      const popup = canvasElement.querySelector(".au-tooltip") as HTMLElement;

      await waitFor(() => expect(isOpen(popup)).toBe(true));
      await expect(popup).toHaveAttribute("data-side", side);
      await expect(
        sides[side](
          popup.getBoundingClientRect(),
          button.getBoundingClientRect(),
        ),
      ).toBeCloseTo(gap, 0);
    },
  };
}

// The other sides, as the collapsed Sidebar's name uses the right.
const Right = onSide("right");
const Bottom = onSide("bottom");
const Left = onSide("left");

// At the screen's edges: to the opposite side when it does not fit, and sliding along the other axis until it does.
const AtTheEdges: Story = {
  args: { side: "left", text: "A name long enough to need room" },
  render: (args) => (
    <div style={{ position: "fixed", top: 0, left: 0 }}>
      <Tooltip {...args}>
        <button aria-label={args.text} type="button">
          <Icon icon={FileText} />
        </button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const popup = canvasElement.querySelector(".au-tooltip") as HTMLElement;

    await userEvent.tab();
    await waitFor(() => expect(isOpen(popup)).toBe(true));
    const box = popup.getBoundingClientRect();
    await expect(popup).toHaveAttribute("data-side", "right");
    await expect(box.top).toBeGreaterThanOrEqual(0);
    await expect(box.left).toBeGreaterThanOrEqual(0);
    await expect(box.right).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  },
};

// A long name breaks into lines, within a width, and a word with no spaces breaks too.
const LongText: Story = {
  tags: ["visual"],
  args: {
    text: "A name long enough to take more than one line, with Averyveryveryveryveryveryveryveryveryveryveryveryveryverylongword",
  },
  render: (args) => <Opened {...args} />,
  play: async ({ canvasElement }) => {
    const popup = canvasElement.querySelector(".au-tooltip") as HTMLElement;

    await waitFor(() => expect(isOpen(popup)).toBe(true));
    await expect(popup.offsetWidth).toBeLessThanOrEqual(longest);
    await expect(popup.scrollWidth).toBe(popup.clientWidth);
  },
};

function Toggling(): ReactNode {
  const [named, setNamed] = useState(true);
  return (
    <Tooltip text={named ? "Notes" : ""}>
      <button aria-label="Notes" onClick={() => setNamed(!named)} type="button">
        <Icon icon={FileText} />
      </button>
    </Tooltip>
  );
}

// Its text coming and going, as on a rail that collapses, leaves the control where it is, with its focus and its state.
const TextComesAndGoes: Story = {
  tags: ["!dev"],
  render: () => <Toggling />,
  play: async ({ canvas: screen }) => {
    const button = screen.getByRole("button", { name: "Notes" });

    await userEvent.click(button);
    await expect(screen.getByRole("button", { name: "Notes" })).toBe(button);
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await expect(screen.getByRole("button", { name: "Notes" })).toBe(button);
    await expect(button).toHaveFocus();
  },
};

// With no text there is nothing to show: it never opens, and the control works as ever.
const EmptyText: Story = {
  args: { text: "" },
  render: (args) => (
    <div style={centred}>
      <Tooltip {...args}>{control}</Tooltip>
    </div>
  ),
  play: async ({ canvas: screen, canvasElement }) => {
    await userEvent.tab();
    await expect(screen.getByRole("button", { name: "Notes" })).toHaveFocus();
    await pause(hoverDelay);
    await expect(isOpen(canvasElement.querySelector(".au-tooltip"))).toBe(
      false,
    );
  },
};

function ScrollingArea(props: TooltipProps): ReactNode {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => button.current?.focus(), []);
  return (
    <div style={{ padding: 64 }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: 48,
          background: "var(--au-cat-1-soft)",
        }}
      >
        Sticky bar
      </div>
      <div
        data-testid="area"
        style={{
          height: 48,
          overflow: "auto",
          background: "var(--au-cat-3-soft)",
        }}
      >
        <Tooltip {...props}>
          <button aria-label="Notes" ref={button} type="button">
            <Icon icon={FileText} />
          </button>
        </Tooltip>
        <div style={{ height: 400 }} />
      </div>
    </div>
  );
}

// Inside an area that scrolls and cuts, beneath a sticky bar with a high z-index: it is cut by neither and stays above
// both, which is what the native popover is here for. And it closes when anything scrolls, not to float apart.
const InAScrollingArea: Story = {
  tags: ["visual"],
  render: (args) => <ScrollingArea {...args} />,
  play: async ({ canvas: screen, canvasElement }) => {
    const popup = canvasElement.querySelector(".au-tooltip") as HTMLElement;
    const area = screen.getByTestId("area");

    await waitFor(() => expect(isOpen(popup)).toBe(true));
    const box = popup.getBoundingClientRect();
    await expect(box.bottom).toBeLessThanOrEqual(
      area.getBoundingClientRect().top + gap,
    );
    await expect(
      document.elementFromPoint(
        box.left + box.width / 2,
        box.top + box.height / 2,
      ),
    ).toBe(popup);

    area.scrollTop = 40;
    await waitFor(() => expect(isOpen(popup)).toBe(false));
  },
};

// On a dark surface it turns light by itself, so it never melts into what is around it (decision 0087).
const OnADarkSurface: Story = {
  tags: ["visual"],
  render: (args) => (
    <div data-au-surface="inverse">
      <Opened {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const popup = canvasElement.querySelector(".au-tooltip") as HTMLElement;

    await waitFor(() => expect(isOpen(popup)).toBe(true));
    await expect(getComputedStyle(popup).backgroundColor).toBe(
      "rgb(244, 244, 242)",
    );
    await expect(getComputedStyle(popup).color).toBe("rgb(48, 51, 56)");
  },
};

// It draws no box around the control, so the control lays out as if it were not there.
const LeavesTheLayout: Story = {
  args: { text: "Wide" },
  render: (args) => (
    <div style={{ display: "flex", width: 320 }}>
      <Tooltip {...args}>
        <button style={{ flex: 1 }} type="button">
          Wide
        </button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas: screen }) => {
    await expect(screen.getByRole("button", { name: "Wide" }).offsetWidth).toBe(
      320,
    );
  },
};

export default meta;
export {
  AtTheEdges,
  Bottom,
  Default,
  EmptyText,
  Hover,
  InAScrollingArea,
  LeavesTheLayout,
  Left,
  LongText,
  OnADarkSurface,
  Right,
  TextComesAndGoes,
  Touch,
};
