import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import "../components/AurumRoot/AurumRoot.css";
import "../components/AurumRoot/fonts.css";
import "./tokens.css";
import tokens from "./tokens.json" with { type: "json" };

const styles = tokens.type.groups.flatMap((group) => group.styles);

// Every text style, drawn with the fonts and compared with its approved screenshot (decision 0034). A style
// without a sample shows its own name.
it("draws every text style as approved", async () => {
  await render(
    <div className="au-root" data-testid="text-styles">
      {styles.map((style) => (
        <div className={`au-${style.name}`} key={style.name}>
          {"sample" in style ? style.sample : style.name}
        </div>
      ))}
    </div>,
  );
  await document.fonts.ready;

  await expect
    .element(page.getByTestId("text-styles"))
    .toMatchScreenshot("text-styles");
});
