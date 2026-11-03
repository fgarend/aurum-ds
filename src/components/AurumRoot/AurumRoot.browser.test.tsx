import { expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import "../../tokens/tokens.css";
import "./AurumRoot.css";

// The tokens' values, as the browser computes them: canvas #faf9f6, ink #23262b, focus-ring #2b2e33.
const canvas = "rgb(250, 249, 246)";
const ink = "rgb(35, 38, 43)";
const focusRing = "rgb(43, 46, 51)";
// WebKit writes the family names without quotes, Chromium and Firefox with them.
const geistFirst = /^"?Geist Variable"?,/u;

// In a real browser, the base styles apply as decision 0030 describes (decision 0032).
it("styles the root, rings the focus from the keyboard and hides screen reader text", async () => {
  const screen = await render(
    <div className="au-root" data-testid="root">
      <button className="au-probe" type="button">
        Save
      </button>
      <span className="au-sr">Only for screen readers</span>
    </div>,
  );
  const root = getComputedStyle(screen.getByTestId("root").element());
  const button = screen.getByRole("button", { name: "Save" });
  const hidden = screen
    .getByText("Only for screen readers")
    .element()
    .getBoundingClientRect();

  expect([root.backgroundColor, root.color]).toEqual([canvas, ink]);
  expect(root.fontFamily).toMatch(geistFirst);
  expect([hidden.width, hidden.height]).toEqual([1, 1]);

  await userEvent.tab();
  const ring = getComputedStyle(button.element());

  await expect.element(button).toHaveFocus();
  expect([
    ring.outlineStyle,
    ring.outlineWidth,
    ring.outlineColor,
    ring.outlineOffset,
  ]).toEqual(["solid", "2px", focusRing, "2px"]);
});

// The base styles sit in the layer au.base (decision 0053): the app's own CSS, outside any layer, wins over them
// however plain its selector.
it("gives way to the app's own CSS", async () => {
  const appStyle = document.createElement("style");
  appStyle.textContent = "div { color: rgb(1, 2, 3); }";
  document.head.append(appStyle);
  const screen = await render(
    <div className="au-root" data-testid="root">
      Text
    </div>,
  );

  expect(getComputedStyle(screen.getByTestId("root").element()).color).toBe(
    "rgb(1, 2, 3)",
  );
  appStyle.remove();
});
