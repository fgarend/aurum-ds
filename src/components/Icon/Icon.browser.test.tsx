import { composeStories } from "@storybook/react-vite";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import * as stories from "./Icon.stories.js";

const { Default, Labelled } = composeStories(stories);

// The Icon draws a Lucide drawing the app gives it, as decision 0056 sets: 1.5 stroke, a size in pixels, hidden
// from screen readers unless it has a label. The examples are its stories (decision 0057).
describe("Icon", () => {
  it("draws the drawing with a 1.5 stroke, 20 px by default", async () => {
    const screen = await render(<Default data-testid="icon" />);
    const svg = screen.getByTestId("icon").element();

    expect(svg.tagName).toBe("svg");
    expect(svg.getAttribute("stroke-width")).toBe("1.5");
    expect([svg.getAttribute("width"), svg.getAttribute("height")]).toEqual([
      "20",
      "20",
    ]);
  });

  it("takes a size in pixels", async () => {
    const screen = await render(<Default data-testid="icon" size={16} />);

    expect(screen.getByTestId("icon").element().getAttribute("width")).toBe(
      "16",
    );
  });

  it("is hidden from screen readers by default", async () => {
    const screen = await render(<Default data-testid="icon" />);
    const svg = screen.getByTestId("icon").element();

    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("role")).toBeNull();
  });

  it("becomes an image with a name when it has a label", async () => {
    const screen = await render(<Labelled />);

    await expect
      .element(screen.getByRole("img", { name: "Information" }))
      .toBeInTheDocument();
  });

  it("joins the app's class after its own", async () => {
    const screen = await render(
      <Default className="from-app" data-testid="icon" />,
    );
    const classes = screen.getByTestId("icon").element().classList;

    expect(classes.contains("au-icon")).toBe(true);
    expect(classes.contains("from-app")).toBe(true);
  });

  it("passes its ref to the drawing", async () => {
    const ref = createRef<SVGSVGElement>();
    await render(<Default ref={ref} />);

    expect(ref.current?.tagName).toBe("svg");
  });

  it("draws in the colour of the text", async () => {
    const screen = await render(
      <Default data-testid="icon" style={{ color: "rgb(1, 2, 3)" }} />,
    );

    expect(getComputedStyle(screen.getByTestId("icon").element()).stroke).toBe(
      "rgb(1, 2, 3)",
    );
  });
});
