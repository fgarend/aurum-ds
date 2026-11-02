import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import "../tokens/tokens.css";
import "./base.css";

// The tokens' values, as the browser computes them: canvas #faf9f6, ink #23262b, focus-ring #2b2e33.
const canvas = "rgb(250, 249, 246)";
const ink = "rgb(35, 38, 43)";
const focusRing = "rgb(43, 46, 51)";
// WebKit writes the family names without quotes, Chromium and Firefox with them.
const geistFirst = /^"?Geist Variable"?,/u;

// In a real browser, the base styles apply as decision 0030 describes (decision 0032).
it("styles the root, rings the focus from the keyboard and hides screen reader text", async () => {
  render(
    <div className="au-root" data-testid="root">
      <button className="au-probe" type="button">
        Save
      </button>
      <span className="au-sr">Only for screen readers</span>
    </div>,
  );
  const root = getComputedStyle(screen.getByTestId("root"));
  const button = screen.getByRole("button", { name: "Save" });
  const hidden = screen
    .getByText("Only for screen readers")
    .getBoundingClientRect();

  expect([root.backgroundColor, root.color]).toEqual([canvas, ink]);
  expect(root.fontFamily).toMatch(geistFirst);
  expect([hidden.width, hidden.height]).toEqual([1, 1]);

  await userEvent.tab();
  const ring = getComputedStyle(button);

  expect(button).toHaveFocus();
  expect([
    ring.outlineStyle,
    ring.outlineWidth,
    ring.outlineColor,
    ring.outlineOffset,
  ]).toEqual(["solid", "2px", focusRing, "2px"]);
});
