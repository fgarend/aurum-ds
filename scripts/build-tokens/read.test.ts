import { describe, expect, it } from "vitest";
import { readTokens } from "./read.ts";

// Fictitious tokens, each breaking one rule of the artifact type's grammar (decision 0026).
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

function read(changes: Record<string, unknown>): void {
  readTokens({ ...minimal, ...changes });
}

describe("readTokens", () => {
  describe("fails on an invalid token instead of leaving it out", () => {
    const day = [{ id: "day", name: "Day" }];
    const cases: [string, Record<string, unknown>, string][] = [
      [
        "a bad name",
        { spacing: { tokens: [{ name: "-gap", value: "4px" }] } },
        'spacing "-gap": bad name',
      ],
      [
        "a name used twice",
        { radius: { tokens: [{ name: "paper", value: "4px" }] } },
        'radius "paper": name already used',
      ],
      [
        "a bad color",
        { color: { themes: day, tokens: [{ name: "paper", value: "white" }] } },
        'color "paper": bad value',
      ],
      [
        "an alias to no token",
        {
          color: { themes: day, tokens: [{ name: "page", value: "{paper}" }] },
        },
        'color "page": alias {paper} names no color',
      ],
      [
        "an alias cycle",
        {
          color: {
            themes: day,
            tokens: [
              { name: "a", value: "{b}" },
              { name: "b", value: "{a}" },
            ],
          },
        },
        'color "a": alias cycle',
      ],
      [
        "a bad length",
        { spacing: { tokens: [{ name: "gap", value: "4 px" }] } },
        'spacing "gap": bad value',
      ],
      [
        "a weight out of range",
        {
          type: {
            fonts: [],
            families: { body: "Fictional Sans" },
            groups: [
              {
                name: "Fictional",
                family: "body",
                styles: [{ name: "x", fontSize: "1px", fontWeight: 1001 }],
              },
            ],
          },
        },
        'text style "x": bad fontWeight',
      ],
      [
        "a case other than capitals",
        {
          type: {
            fonts: [],
            families: { body: "Fictional Sans" },
            groups: [
              {
                name: "Fictional",
                family: "body",
                styles: [
                  { name: "x", fontSize: "1px", textTransform: "lower" },
                ],
              },
            ],
          },
        },
        'text style "x": bad textTransform',
      ],
      [
        "tabular that is not a yes or no",
        {
          type: {
            fonts: [],
            families: { body: "Fictional Sans" },
            groups: [
              {
                name: "Fictional",
                family: "body",
                styles: [{ name: "x", fontSize: "1px", tabular: "yes" }],
              },
            ],
          },
        },
        'text style "x": bad tabular',
      ],
      [
        "a group with an unknown family",
        {
          type: {
            fonts: [],
            families: {},
            groups: [{ name: "Fictional", family: "body", styles: [] }],
          },
        },
        'type group "Fictional": no family "body"',
      ],
      [
        "more than one theme",
        {
          color: {
            themes: [...day, { id: "night", name: "Night" }],
            tokens: [],
          },
        },
        "color: only one theme is supported",
      ],
      [
        "a font file",
        {
          type: {
            fonts: [{ family: "Fictional", file: "fictional.woff2" }],
            families: {},
            groups: [],
          },
        },
        "type: font files are not supported yet",
      ],
    ];

    it.each(cases)("%s", (_, changes, message) => {
      expect(() => read(changes)).toThrow(message);
    });
  });
});
