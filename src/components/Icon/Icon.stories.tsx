import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Info,
  PiggyBank,
  Plus,
  Wallet,
} from "lucide-react";
import { createRef, type ReactNode, useId } from "react";
import { expect } from "storybook/test";
import { Icon, type IconProps } from "./Icon.js";

// The Icon's examples (decision 0057), each checking what it shows: a Lucide drawing in a 1.5 stroke, a size in
// pixels, hidden from screen readers unless it has a name, in the colour of the text (decision 0056).
const meta = {
  title: "Components/Icon",
  component: Icon,
  args: { icon: Wallet },
} satisfies Meta<typeof Icon>;

type Story = StoryObj<typeof meta>;

const drawings = [Wallet, PiggyBank, ArrowDownLeft, Plus, Info];
const smallControl = 16;
const input = 18;
const bottomNavigation = 22;
const sizes = [smallControl, input, undefined, bottomNavigation];
const defaultSize = 20;

// The only drawing in the story.
function drawing(canvasElement: HTMLElement): SVGSVGElement {
  const svg = canvasElement.querySelector("svg");
  if (svg === null) {
    throw new Error("the story draws no icon");
  }
  return svg;
}

// Beside a text, hidden from screen readers. The app's class and ref change nothing on screen, so they are checked
// here too.
const Default: Story = {
  play: async ({ args, canvasElement, mount }) => {
    const ref = createRef<SVGSVGElement>();
    await mount(<Icon {...args} className="from-app" ref={ref} />);
    const svg = drawing(canvasElement);

    await expect(svg.getAttribute("stroke-width")).toBe("1.5");
    await expect([
      svg.getAttribute("width"),
      svg.getAttribute("height"),
    ]).toEqual(["20", "20"]);
    await expect(svg.getAttribute("aria-hidden")).toBe("true");
    await expect(svg.getAttribute("role")).toBeNull();
    // Lucide's own classes come first.
    await expect([...svg.classList].slice(-2)).toEqual(["au-icon", "from-app"]);
    await expect(ref.current).toBe(svg);
  },
};

// Alone, carrying its meaning.
const Labelled: Story = {
  args: { icon: Info, "aria-label": "Information" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("img", { name: "Information" }),
    ).toBeInTheDocument();
  },
};

// Every size the design uses, for a few drawings, compared with its approved screenshot.
const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div data-testid="icons">
      {sizes.map((size) => (
        <div
          data-size={size ?? defaultSize}
          key={size ?? "default"}
          style={{
            display: "flex",
            gap: "var(--au-space-3)",
            padding: "var(--au-space-2)",
          }}
        >
          {drawings.map((each) => (
            <Icon
              icon={each}
              key={each.displayName}
              {...(size === undefined ? {} : { size })}
            />
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = [...canvasElement.querySelectorAll("[data-size]")];

    await expect(
      rows.map((row) =>
        [...row.querySelectorAll("svg")].map((svg) =>
          svg.getAttribute("width"),
        ),
      ),
    ).toEqual(
      rows.map((row) => drawings.map(() => row.getAttribute("data-size"))),
    );
  },
};

// In the colour of the text around it: money in, money out.
const Colour: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--au-space-2)" }}>
      <p data-testid="income" style={{ color: "var(--au-income)" }}>
        <Icon icon={ArrowDownLeft} /> Received
      </p>
      <p data-testid="expense" style={{ color: "var(--au-expense)" }}>
        <Icon icon={ArrowUpRight} /> Spent
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const line of [
      canvas.getByTestId("income"),
      canvas.getByTestId("expense"),
    ]) {
      const svg = drawing(line);

      await expect(getComputedStyle(svg).stroke).toBe(
        getComputedStyle(line).color,
      );
    }
  },
};

function NamedByAnother(props: IconProps): ReactNode {
  const id = useId();
  return (
    <>
      <span id={id}>Saved</span>
      <Icon {...props} aria-labelledby={id} />
    </>
  );
}

// Named by another element, it is shown to screen readers too.
const LabelledByAnother: Story = {
  tags: ["!dev"],
  render: (args) => <NamedByAnother {...args} />,
  play: async ({ canvas: screen }) => {
    await expect(
      screen.getByRole("img", { name: "Saved" }),
    ).toBeInTheDocument();
  },
};

export default meta;
export { Colour, Default, Labelled, LabelledByAnother, Sizes };
