import { readdir, readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const sources = new URL("../src/", import.meta.url);
const definedPattern = /^\s*(?<name>--au-[^:]+):/gmu;
const usedPattern = /var\((?<name>--au-[^,)\s]+)/gu;
// A declaration, its property and its value, one per line or after a brace or semicolon.
const declaration =
  /(?:^|[{;])\s*(?<property>[a-z-]+)\s*:\s*(?<value>[^;{}]+)/gmu;
const handColor =
  /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(/iu;
const handLength = /(?<![\w.-])-?\d*\.?\d+(?:px|rem|em)\b/u;
// The properties whose lengths must come from the tokens: spacing, radius, shadow and font size.
const tokenLength =
  /^(?:margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left|border-radius|box-shadow|font-size)(?:-[a-z-]+)?$/u;
const allowedBorder =
  /^border(?:-[a-z]+)*-width$|^border(?:-(?:top|right|bottom|left))?$/u;
const exception = /\/\* tokens-exception: .+ \*\//u;
const layerOrder =
  "@layer theme, base, au.base, au.components, components, utilities;";

// The CSS of the sources may only use tokens that tokens.css defines (decision 0030): a wrong name fails here, not
// silently in the browser.
it("uses only tokens that tokens.css defines", async () => {
  const tokens = await readFile(new URL("tokens/tokens.css", sources), "utf8");
  const defined = new Set(
    [...tokens.matchAll(definedPattern)].map((match) => match.groups?.["name"]),
  );
  const files = (await readdir(sources, { recursive: true })).filter(
    (path) => path.endsWith(".css") && path !== "tokens/tokens.css",
  );
  const missing: string[] = [];
  for (const path of files) {
    // biome-ignore lint/performance/noAwaitInLoops: a few small files, read in order.
    const css = await readFile(new URL(path, sources), "utf8");
    for (const match of css.matchAll(usedPattern)) {
      const name = match.groups?.["name"] ?? "";
      if (!defined.has(name)) {
        missing.push(`${path}: ${name}`);
      }
    }
  }

  expect(missing).toEqual([]);
});

// What in a component's CSS is written by hand instead of coming from the tokens: colours anywhere, and lengths in
// spacing, radius, shadow and font size. 0 and a 1px border are allowed, and so is a line that says why it is an
// exception.
function handWritten(css: string): string[] {
  const found: string[] = [];
  for (const line of css.split("\n")) {
    if (exception.test(line)) {
      continue;
    }
    for (const match of line.matchAll(declaration)) {
      const property = match.groups?.["property"] ?? "";
      const value = (match.groups?.["value"] ?? "").replace(
        /var\([^)]*\)/gu,
        "",
      );
      if (property.startsWith("--")) {
        continue;
      }
      const lengthHere = tokenLength.test(property) && handLength.test(value);
      const border =
        allowedBorder.test(property) && value.trim().startsWith("1px");
      if (handColor.test(value) || (lengthHere && !border)) {
        found.push(`${property}: ${value.trim()}`);
      }
    }
  }
  return found;
}

describe("handWritten", () => {
  it("finds colours and lengths that bypass the tokens", () => {
    const css = `.au-x {
  color: #1a1a1a;
  background: rgb(0 0 0);
  padding: 12px var(--au-space-2);
  border-radius: 4px;
  font-size: 0.875rem;
}`;

    expect(handWritten(css)).toEqual([
      "color: #1a1a1a",
      "background: rgb(0 0 0)",
      "padding: 12px",
      "border-radius: 4px",
      "font-size: 0.875rem",
    ]);
  });

  it("accepts tokens, 0, a 1px border and a stated exception", () => {
    const css = `.au-x {
  color: var(--au-ink);
  padding: 0 var(--au-space-2);
  border: 1px solid var(--au-hairline);
  margin: -1px; /* tokens-exception: hides the element visually */
  width: 100%;
}`;

    expect(handWritten(css)).toEqual([]);
  });
});

// A component's CSS takes every colour, spacing, radius, shadow and font size from the tokens (decision 0053).
it("writes no colour or length by hand in a component's CSS", async () => {
  const components = new URL("components/", sources);
  const files = (
    await readdir(components, { recursive: true }).catch(() => [])
  ).filter((path) => path.endsWith(".css"));
  const found: string[] = [];
  for (const path of files) {
    // biome-ignore lint/performance/noAwaitInLoops: a few small files, read in order.
    const css = await readFile(new URL(path, components), "utf8");
    found.push(...handWritten(css).map((problem) => `${path}: ${problem}`));
  }

  expect(found).toEqual([]);
});

// Whichever file loads first fixes the layers' order: Tailwind's reset below Aurum, and its utilities above (decision 0072).
it("states the whole order of the layers in every style sheet that uses them", async () => {
  const files = (await readdir(sources, { recursive: true })).filter((path) =>
    path.endsWith(".css"),
  );
  const missing: string[] = [];
  for (const path of files) {
    // biome-ignore lint/performance/noAwaitInLoops: a few small files, read in order.
    const css = await readFile(new URL(path, sources), "utf8");
    if (css.includes("@layer") && !css.includes(layerOrder)) {
      missing.push(path);
    }
  }

  expect(missing).toEqual([]);
});
