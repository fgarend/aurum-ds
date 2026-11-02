import { Info, Wallet } from "lucide-react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Icon } from "./Icon.js";

// The Icon draws a Lucide drawing the app gives it, as decision 0054 sets: 1.5 stroke, a size in pixels, hidden
// from screen readers unless it has a label.
describe("Icon", () => {
  it("draws the drawing with a 1.5 stroke, 20 px by default", async () => {
    const screen = await render(<Icon data-testid="icon" icon={Wallet} />);
    const svg = screen.getByTestId("icon").element();

    expect(svg.tagName).toBe("svg");
    expect(svg.getAttribute("stroke-width")).toBe("1.5");
    expect([svg.getAttribute("width"), svg.getAttribute("height")]).toEqual([
      "20",
      "20",
    ]);
  });

  it("takes a size in pixels", async () => {
    const screen = await render(
      <Icon data-testid="icon" icon={Wallet} size={16} />,
    );

    expect(screen.getByTestId("icon").element().getAttribute("width")).toBe(
      "16",
    );
  });

  it("is hidden from screen readers by default", async () => {
    const screen = await render(<Icon data-testid="icon" icon={Wallet} />);
    const svg = screen.getByTestId("icon").element();

    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("role")).toBeNull();
  });

  it("becomes an image with a name when it has a label", async () => {
    const screen = await render(<Icon icon={Info} label="Information" />);

    await expect
      .element(screen.getByRole("img", { name: "Information" }))
      .toBeInTheDocument();
  });

  it("joins the app's class after its own", async () => {
    const screen = await render(
      <Icon className="from-app" data-testid="icon" icon={Wallet} />,
    );
    const classes = screen.getByTestId("icon").element().classList;

    expect(classes.contains("au-icon")).toBe(true);
    expect(classes.contains("from-app")).toBe(true);
  });

  it("passes its ref to the drawing", async () => {
    const ref = createRef<SVGSVGElement>();
    await render(<Icon icon={Wallet} ref={ref} />);

    expect(ref.current?.tagName).toBe("svg");
  });

  it("takes the colour of the text around it", async () => {
    const screen = await render(
      <span style={{ color: "rgb(1, 2, 3)" }}>
        <Icon data-testid="icon" icon={Wallet} />
      </span>,
    );

    expect(getComputedStyle(screen.getByTestId("icon").element()).stroke).toBe(
      "rgb(1, 2, 3)",
    );
  });
});
