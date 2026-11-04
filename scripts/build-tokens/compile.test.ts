import { describe, expect, it } from "vitest";
import { compileTokens } from "./compile.ts";

// Fictitious tokens, a few per rule. The rules follow the artifact type's own compiler (decision 0026).
const minimal = {
  name: "Fictional",
  version: 1,
  color: {
    themes: [{ id: "day", name: "Day" }],
    tokens: [{ name: "paper", value: "#fafafa", usage: "" }],
  },
  type: { fonts: [], families: {}, groups: [] },
  spacing: { tokens: [] },
  radius: { tokens: [] },
};

function compile(changes: Record<string, unknown>): string {
  return compileTokens({ ...minimal, ...changes });
}

describe("compileTokens", () => {
  it("writes colors, then shadows, in the first theme's block, with the au- prefix", () => {
    const css = compile({
      color: {
        themes: [{ id: "day", name: "Day" }],
        tokens: [
          { name: "paper", value: "#fafafa", usage: "Fictional." },
          { name: "ink", value: "rgba(10, 20, 30, 0.5)", usage: "" },
        ],
      },
      shadow: {
        tokens: [
          { name: "lift", value: "0 1px 2px rgba(0, 0, 0, 0.1)", usage: "" },
        ],
      },
    });

    expect(css).toBe(
      [
        ':root, [data-theme="day"] {',
        "  --au-paper: #fafafa;",
        "  --au-ink: rgba(10, 20, 30, 0.5);",
        "  --au-lift: 0 1px 2px rgba(0, 0, 0, 0.1);",
        "}",
        "",
      ].join("\n"),
    );
  });

  it("turns a color alias into a reference to the prefixed token", () => {
    const css = compile({
      color: {
        themes: [{ id: "day", name: "Day" }],
        tokens: [
          { name: "paper", value: "#fafafa", usage: "" },
          { name: "page", value: "{paper}", usage: "" },
        ],
      },
    });

    expect(css).toContain("  --au-page: var(--au-paper);\n");
  });

  it("writes spacing, radius, other families in file order, then font families, in one root block", () => {
    const css = compile({
      spacing: { tokens: [{ name: "gap", value: "4px", usage: "" }] },
      radius: { tokens: [{ name: "round", value: "6px", usage: "" }] },
      height: {
        note: "Fictional.",
        tokens: [{ name: "row", value: "40px", usage: "" }],
      },
      width: { tokens: [{ name: "rail", value: "200px", usage: "" }] },
      type: {
        fonts: [],
        families: { body: "Fictional Sans, sans-serif" },
        groups: [],
      },
    });

    expect(css).toContain(
      [
        ":root {",
        "  --au-gap: 4px;",
        "  --au-round: 6px;",
        "  --au-row: 40px;",
        "  --au-rail: 200px;",
        "  --au-font-body: Fictional Sans, sans-serif;",
        "}",
        "",
      ].join("\n"),
    );
  });

  it("writes a class per text style, with its group's family and the defaults", () => {
    const css = compile({
      type: {
        fonts: [],
        families: {
          body: "Fictional Sans, sans-serif",
          code: "Fictional Mono, monospace",
        },
        groups: [
          {
            name: "Fictional",
            family: "body",
            styles: [
              {
                name: "text-big",
                fontSize: "30px",
                lineHeight: "36px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              },
              { name: "text-plain", fontSize: "14px" },
              {
                name: "text-code",
                family: "code",
                fontSize: "13px",
                fontStyle: "italic",
                opticalSize: 14,
              },
            ],
          },
        ],
      },
    });

    expect(css).toContain(
      [
        "@layer au.base {",
        "  .au-text-big {",
        "    font-family: var(--au-font-body);",
        "    font-size: 30px;",
        "    line-height: 36px;",
        "    font-weight: 600;",
        "    letter-spacing: -0.02em;",
        "  }",
        "  .au-text-plain {",
        "    font-family: var(--au-font-body);",
        "    font-size: 14px;",
        "    line-height: 1.4;",
        "    font-weight: 400;",
        "    letter-spacing: 0;",
        "  }",
        "  .au-text-code {",
        "    font-family: var(--au-font-code);",
        "    font-size: 13px;",
        "    line-height: 1.4;",
        "    font-weight: 400;",
        "    letter-spacing: 0;",
        "    font-style: italic;",
        "    font-variation-settings: 'opsz' 14;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );
  });

  it("escapes a dot, and a leading digit, as the artifact does", () => {
    const css = compile({
      spacing: { tokens: [{ name: "space-1.5", value: "6px", usage: "" }] },
    });
    const leadingDigit = compile({
      spacing: { tokens: [{ name: "2x", value: "8px", usage: "" }] },
    });

    expect(css).toContain("  --au-space-1\\.5: 6px;\n");
    expect(leadingDigit).toContain("  --au-\\32 x: 8px;\n");
  });

  it("normalizes values as the artifact does", () => {
    const css = compile({
      color: {
        themes: [{ id: "day", name: "Day" }],
        tokens: [{ name: "paper", value: "#FAFAFA", usage: "" }],
      },
      spacing: { tokens: [{ name: "gap", value: 4, usage: "" }] },
      type: {
        fonts: [],
        families: { body: "Fictional Sans" },
        groups: [
          {
            name: "Fictional",
            family: "body",
            styles: [{ name: "strong", fontSize: 16, fontWeight: "bold" }],
          },
        ],
      },
    });

    expect(css).toContain("  --au-paper: #fafafa;\n");
    expect(css).toContain("  --au-gap: 4px;\n");
    expect(css).toContain(
      "    font-size: 16px;\n    line-height: 1.4;\n    font-weight: 700;\n",
    );
  });

  it("writes without a prefix when asked, as the artifact does", () => {
    const css = compileTokens(
      {
        ...minimal,
        spacing: { tokens: [{ name: "gap", value: "4px", usage: "" }] },
        type: {
          fonts: [],
          families: { body: "Fictional Sans" },
          groups: [
            {
              name: "Fictional",
              family: "body",
              styles: [{ name: "text-plain", fontSize: "14px" }],
            },
          ],
        },
      },
      "",
    );

    expect(css).toContain("  --paper: #fafafa;\n");
    expect(css).toContain("  --gap: 4px;\n  --font-body: Fictional Sans;\n");
    expect(css).toContain(".text-plain {\n  font-family: var(--font-body);\n");
  });

  it("states the layers' order first, as every style sheet that uses them", () => {
    const css = compile({
      type: {
        fonts: [],
        families: { body: "Fictional Sans" },
        groups: [
          {
            name: "Fictional",
            family: "body",
            styles: [{ name: "text-plain", fontSize: "14px" }],
          },
        ],
      },
    });

    expect(
      css.startsWith(
        "@layer theme, base, au.base, au.components, components, utilities;\n",
      ),
    ).toBe(true);
  });

  it("leaves out a block with nothing in it", () => {
    expect(
      compile({ color: { themes: [{ id: "day", name: "Day" }], tokens: [] } }),
    ).toBe("");
  });
});
