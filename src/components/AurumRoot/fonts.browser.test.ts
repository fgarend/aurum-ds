import { expect, it } from "vitest";
import "./fonts.css";

// Browsers write a family name with or without quotes: Firefox keeps them, Chromium and WebKit drop them.
const quotes = /"/gu;

// In a real browser, the fonts load from the package (decisions 0027 and 0032).
it.each(["Geist Variable", "Geist Mono Variable"])(
  "loads %s from the package",
  async (family) => {
    const loaded = await document.fonts.load(`16px "${family}"`, "Aurum");

    expect(loaded.map((face) => face.family.replace(quotes, ""))).toContain(
      family,
    );
    expect(document.fonts.check(`16px "${family}"`, "Aurum")).toBe(true);
  },
);
