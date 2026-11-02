import { ArrowDownLeft, Info, PiggyBank, Plus, Wallet } from "lucide-react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import "../../fonts/fonts.css";
import "../../styles/base.css";
import "../../tokens/tokens.css";
import { Icon } from "./Icon.js";

const drawings = [Wallet, PiggyBank, ArrowDownLeft, Plus, Info];
// The sizes the design uses: inside small controls and badges, in inputs and buttons, by default, in the bottom
// navigation.
const sizes = [16, 18, 20, 22];

// Every size the design uses, in the ink colour, compared with the approved screenshot (decision 0034).
it("draws the icons as approved", async () => {
  await render(
    <div className="au-root" data-testid="icons">
      {sizes.map((size) => (
        <div
          key={size}
          style={{
            display: "flex",
            gap: "var(--au-space-3)",
            padding: "var(--au-space-2)",
          }}
        >
          {drawings.map((drawing) => (
            <Icon icon={drawing} key={drawing.displayName} size={size} />
          ))}
        </div>
      ))}
    </div>,
  );

  await expect.element(page.getByTestId("icons")).toMatchScreenshot("icons");
});
