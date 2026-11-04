import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRef } from "react";
import { expect, userEvent } from "storybook/test";
import tokens from "../../tokens/tokens.json" with { type: "json" };
import { AurumRoot } from "./AurumRoot.js";

// The root's examples (decision 0070), each checking what it shows: where Aurum begins, with its fonts, tokens and base
// styles, drawing no box of its own.
const meta = {
  title: "Components/AurumRoot",
  component: AurumRoot,
} satisfies Meta<typeof AurumRoot>;

type Story = StoryObj<typeof meta>;

// The tokens' values, as the browser computes them: canvas #faf9f6, ink #23262b, focus-ring #2b2e33.
const canvas = "rgb(250, 249, 246)";
const ink = "rgb(35, 38, 43)";
const focusRing = "rgb(43, 46, 51)";
const inverse = "rgb(48, 51, 56)";
const onInverse = "rgb(244, 244, 242)";
const onInverseSubtle = "rgb(182, 185, 189)";
// Browsers write a family name with or without quotes: Firefox keeps them, Chromium and WebKit drop them.
const quotes = /"/gu;
const textStyles = tokens.type.groups.flatMap((group) => group.styles);
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

// One focus ring for every Aurum element, from the keyboard.
const Focus: Story = {
  render: () => (
    <button className="au-probe" type="button">
      Save
    </button>
  ),
  play: async ({ canvas: screen }) => {
    const button = screen.getByRole("button", { name: "Save" });
    await userEvent.tab();
    const ring = getComputedStyle(button);

    await expect(button).toHaveFocus();
    await expect([
      ring.outlineStyle,
      ring.outlineWidth,
      ring.outlineColor,
      ring.outlineOffset,
    ]).toEqual(["solid", "2px", focusRing, "2px"]);
  },
};

// Text only screen readers read, which takes no room on screen.
const ScreenReaderText: Story = {
  render: () => <span className="au-sr">Only for screen readers</span>,
  play: async ({ canvas: screen }) => {
    const hidden = screen
      .getByText("Only for screen readers")
      .getBoundingClientRect();

    await expect([hidden.width, hidden.height]).toEqual([1, 1]);
  },
};

// The fonts the root brings, loaded from the package.
const Fonts: Story = {
  render: () => (
    <p>
      Geist <code className="au-num">and Geist Mono</code>
    </p>
  ),
  play: async () => {
    for (const family of ["Geist Variable", "Geist Mono Variable"]) {
      // biome-ignore lint/performance/noAwaitInLoops: two fonts, loaded in order.
      const loaded = await document.fonts.load(`16px "${family}"`, "Aurum");

      await expect(
        loaded.map((face) => face.family.replace(quotes, "")),
      ).toContain(family);
      await expect(document.fonts.check(`16px "${family}"`, "Aurum")).toBe(
        true,
      );
    }
  },
};

// Every text style of the tokens, with its sample, or its name, compared with its approved screenshot.
const TextStyles: Story = {
  tags: ["visual"],
  render: () => (
    <div>
      {textStyles.map((style) => (
        <div className={`au-${style.name}`} key={style.name}>
          {"sample" in style ? style.sample : style.name}
        </div>
      ))}
    </div>
  ),
};

// The class alone, on an element of the app's: it keeps its box and paints the canvas.
const ClassAlone: Story = {
  render: () => (
    <div className="au-root" data-testid="class-alone">
      Text
    </div>
  ),
  play: async ({ canvas: screen }) => {
    const style = getComputedStyle(screen.getByTestId("class-alone"));

    await expect(style.display).toBe("block");
    await expect([style.backgroundColor, style.color]).toEqual([canvas, ink]);
    await expect(style.fontFamily).toMatch(geistFirst);
  },
};

// The base styles sit in the layer au.base (decision 0053): the app's own CSS, outside any layer, wins over them
// however plain its selector.
const AppCss: Story = {
  play: async ({ canvasElement, mount }) => {
    const appStyle = document.createElement("style");
    appStyle.textContent = "div { color: rgb(1, 2, 3); }";
    document.head.append(appStyle);
    await mount(<div className="au-root">Text</div>);
    const color = getComputedStyle(root(canvasElement)).color;
    appStyle.remove();

    await expect(color).toBe("rgb(1, 2, 3)");
  },
};

// An app with Tailwind (decision 0072), whose CSS comes after Aurum's: its reset stays below a component's rule, and its
// utilities above it.
const WithTailwind: Story = {
  play: async ({ canvas: screen, mount }) => {
    const tailwind = document.createElement("style");
    tailwind.textContent = `
      @layer theme, base, components, utilities;
      @layer base { * { padding: 0; } }
      @layer utilities { .from-tailwind { color: rgb(1, 2, 3); font-size: 30px; } }
      @layer au.components { .au-probe { padding: 8px; color: rgb(4, 5, 6); } }
    `;
    document.head.append(tailwind);
    await mount(
      <div className="au-probe au-text-body from-tailwind" data-testid="probe">
        Text
      </div>,
    );
    const { paddingTop, color, fontSize } = getComputedStyle(
      screen.getByTestId("probe"),
    );
    tailwind.remove();

    await expect([paddingTop, color, fontSize]).toEqual([
      "8px",
      "rgb(1, 2, 3)",
      "30px",
    ]);
  },
};

// An area on the dark surface: it paints itself graphite, and inside it the same tokens take the values for it, so whatever
// is inside follows with no prop of its own (decision 0087).
const DarkSurface: Story = {
  tags: ["visual"],
  render: () => (
    <div
      data-au-surface="inverse"
      data-testid="area"
      style={{ padding: "var(--au-space-6)" }}
    >
      <p style={{ color: "var(--au-ink)" }}>On the dark surface</p>
      <p style={{ color: "var(--au-ink-muted)" }}>Secondary text</p>
      <p style={{ color: "var(--au-ink-subtle)" }}>Metadata</p>
      <div
        data-testid="card"
        style={{
          padding: "var(--au-space-4)",
          border: "1px solid var(--au-line)",
          background: "var(--au-surface)",
          color: "var(--au-ink)",
        }}
      >
        In a card
      </div>
    </div>
  ),
  play: async ({ canvas: screen }) => {
    const area = screen.getByTestId("area");
    const style = getComputedStyle(area);

    await expect(style.backgroundColor).toBe(inverse);
    await expect(style.color).toBe(onInverse);
    await expect(style.colorScheme).toBe("dark");
    await expect(style.getPropertyValue("--au-ink").trim()).toBe("#f4f4f2");
    await expect(style.getPropertyValue("--au-primary").trim()).toBe("#f4f4f2");
    await expect(style.getPropertyValue("--au-on-primary").trim()).toBe(
      "#303338",
    );
    await expect(getComputedStyle(screen.getByText("Metadata")).color).toBe(
      onInverseSubtle,
    );
    // Something that paints its own ground stays dark, under text that stays light.
    await expect(
      getComputedStyle(screen.getByTestId("card")).backgroundColor,
    ).toBe(inverse);
  },
};

export default meta;
export {
  AppCss,
  ClassAlone,
  DarkSurface,
  Default,
  Focus,
  Fonts,
  ScreenReaderText,
  TextStyles,
  WithTailwind,
};
