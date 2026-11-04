import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

// The contrast of the palette's pairs, by WCAG's own formula (decision 0080), which also reaches what axe reports as
// incomplete and lets pass: text on the graphite gradient and on translucent fills.
type Colour = readonly [
  red: number,
  green: number,
  blue: number,
  alpha: number,
];

const tokens = await readFile(
  new URL("../src/tokens/tokens.css", import.meta.url),
  "utf8",
);
const hexLong =
  /^#(?<red>[0-9a-f]{2})(?<green>[0-9a-f]{2})(?<blue>[0-9a-f]{2})$/iu;
const rgba =
  /^rgba\((?<red>\d+), (?<green>\d+), (?<blue>\d+), (?<alpha>[\d.]+)\)$/u;

function colour(name: string): Colour {
  const value = new RegExp(`--au-${name}: ([^;]+);`, "u").exec(tokens)?.[1];
  const hex = value?.match(hexLong)?.groups;
  if (hex !== undefined) {
    return [
      Number.parseInt(hex["red"] as string, 16),
      Number.parseInt(hex["green"] as string, 16),
      Number.parseInt(hex["blue"] as string, 16),
      1,
    ];
  }
  const translucent = value?.match(rgba)?.groups;
  if (translucent === undefined) {
    throw new Error(`no colour for the token ${name}: ${value}`);
  }
  return [
    Number(translucent["red"]),
    Number(translucent["green"]),
    Number(translucent["blue"]),
    Number(translucent["alpha"]),
  ];
}

// A colour over an opaque one, as the browser paints it.
function over(top: Colour, under: Colour): Colour {
  const [red, green, blue, alpha] = top;
  return [
    red * alpha + under[0] * (1 - alpha),
    green * alpha + under[1] * (1 - alpha),
    blue * alpha + under[2] * (1 - alpha),
    1,
  ];
}

// WCAG's relative luminance and contrast ratio.
function luminance([red, green, blue]: Colour): number {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(one: Colour, other: Colour): number {
  const [light, dark] = [luminance(one), luminance(other)].sort(
    (a, b) => b - a,
  ) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

// WCAG 1.4.3 for text, and 1.4.11 for what identifies a control or its state.
const text = 4.5;
const nonText = 3;

const white: Colour = [255, 255, 255, 1];
const black: Colour = [0, 0, 0, 1];

function pairs(
  foregrounds: readonly string[],
  backgrounds: readonly string[],
): [string, string][] {
  return foregrounds.flatMap((foreground) =>
    backgrounds.map((background): [string, string] => [foreground, background]),
  );
}

const soft = ["income", "expense", "invest", "warning"];
const categories = ["1", "2", "3", "4", "5", "6", "7", "8"].map(
  (number) => `cat-${number}`,
);
const grounds = ["canvas", "surface", "surface-hover", "surface-sunken"];

// What the palette means to be read together, whether or not a component uses it yet.
const textPairs: [string, string][] = [
  ...pairs(
    ["ink", "ink-muted", "ink-subtle", "primary", "gold-ink", ...soft],
    grounds,
  ),
  ...pairs(categories, ["canvas", "surface"]),
  ...soft.map((name): [string, string] => [name, `${name}-soft`]),
  ...categories.map((name): [string, string] => [name, `${name}-soft`]),
  ["primary", "primary-soft"],
  ["gold-ink", "gold-soft"],
  ...pairs(["on-primary"], ["primary", "primary-hover", "primary-pressed"]),
  ...pairs(["on-gold"], ["gold", "gold-hover"]),
];

const focusPairs = pairs(["focus-ring"], grounds);
// The mark beside a navigation's current item, on its fill and on the surface (decision 0084).
const markPairs: [string, string][] = pairs(
  ["primary"],
  ["primary-soft", "surface"],
);

// The dark surface (decision 0087), which an app may paint as any of the graphite's three stops, and the translucent fills
// over each.
const graphite = ["inverse-top", "inverse", "inverse-bottom"].map(colour);
const rail = graphite;
const railActive = graphite.map((stop) => over(colour("inverse-active"), stop));
const railHover = graphite.map((stop) => over(colour("inverse-hover"), stop));

// Below the minimum on purpose, each with why. Each must stay below it, so one that no longer needs excusing goes.
const excused: {
  foreground: string;
  background: string;
  minimum: number;
  why: string;
}[] = [
  ...grounds.map((background) => ({
    foreground: "ink-disabled",
    background,
    minimum: text,
    why: "WCAG 1.4.3 exempts a disabled control",
  })),
  ...["line", "line-strong"].map((foreground) => ({
    foreground,
    background: "surface",
    minimum: nonText,
    why: "a divider, which identifies no control",
  })),
  {
    foreground: "control-border",
    background: "surface",
    minimum: nonText,
    why: "decided with the form controls (7.16)",
  },
  ...["chart-2", "chart-3", "chart-5"].map((foreground) => ({
    foreground,
    background: "surface",
    minimum: nonText,
    why: "decided with the first chart",
  })),
];

describe("the formula", () => {
  it("gives WCAG's extremes", () => {
    expect(contrast(black, white)).toBeCloseTo(21, 5);
    expect(contrast(white, white)).toBe(1);
  });

  it("paints a translucent colour over what is under it", () => {
    expect(over([255, 255, 255, 0.5], black)).toEqual([127.5, 127.5, 127.5, 1]);
  });
});

describe("the palette", () => {
  it.each(textPairs)("%s is readable on %s", (foreground, background) => {
    expect(
      contrast(colour(foreground), colour(background)),
    ).toBeGreaterThanOrEqual(text);
  });

  it.each([...focusPairs, ...markPairs])(
    "%s shows on %s",
    (foreground, background) => {
      expect(
        contrast(colour(foreground), colour(background)),
      ).toBeGreaterThanOrEqual(nonText);
    },
  );
});

describe("the graphite", () => {
  it.each(["on-inverse", "on-inverse-muted", "on-inverse-subtle"])(
    "%s is readable on the rail",
    (name) => {
      for (const ground of rail) {
        expect(contrast(colour(name), ground)).toBeGreaterThanOrEqual(text);
      }
    },
  );

  it("keeps the current and the hovered item readable", () => {
    for (const ground of [...railActive, ...railHover]) {
      expect(contrast(colour("on-inverse"), ground)).toBeGreaterThanOrEqual(
        text,
      );
    }
  });

  it("shows the current item's gold icon and mark", () => {
    for (const ground of railActive) {
      expect(contrast(colour("gold"), ground)).toBeGreaterThanOrEqual(nonText);
    }
  });

  it("shows the focus ring on the rail", () => {
    for (const ground of [...rail, ...railActive]) {
      expect(contrast(colour("on-inverse"), ground)).toBeGreaterThanOrEqual(
        nonText,
      );
    }
  });
});

describe("the excused pairs", () => {
  it.each(excused)(
    "$foreground on $background: $why",
    ({ foreground, background, minimum }) => {
      expect(contrast(colour(foreground), colour(background))).toBeLessThan(
        minimum,
      );
    },
  );
});
