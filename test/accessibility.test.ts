import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const criterionRow = /^\| (?<id>\d\.\d+\.\d+) /gmu;

// The success criteria of WCAG 2.2 at levels A and AA, from the W3C's Recommendation of 12 December 2024.
const criteria = [
  "1.1.1",
  "1.2.1",
  "1.2.2",
  "1.2.3",
  "1.2.4",
  "1.2.5",
  "1.3.1",
  "1.3.2",
  "1.3.3",
  "1.3.4",
  "1.3.5",
  "1.4.1",
  "1.4.2",
  "1.4.3",
  "1.4.4",
  "1.4.5",
  "1.4.10",
  "1.4.11",
  "1.4.12",
  "1.4.13",
  "2.1.1",
  "2.1.2",
  "2.1.4",
  "2.2.1",
  "2.2.2",
  "2.3.1",
  "2.4.1",
  "2.4.2",
  "2.4.3",
  "2.4.4",
  "2.4.5",
  "2.4.6",
  "2.4.7",
  "2.4.11",
  "2.5.1",
  "2.5.2",
  "2.5.3",
  "2.5.4",
  "2.5.7",
  "2.5.8",
  "3.1.1",
  "3.1.2",
  "3.2.1",
  "3.2.2",
  "3.2.3",
  "3.2.4",
  "3.2.6",
  "3.3.1",
  "3.3.2",
  "3.3.3",
  "3.3.4",
  "3.3.7",
  "3.3.8",
  "4.1.2",
  "4.1.3",
];

// The target (decision 0079): what no check can miss by the list leaving a criterion out.
it("says how each criterion of the target is checked", async () => {
  const list = await readFile(new URL("docs/accessibility.md", root), "utf8");
  const listed = [...list.matchAll(criterionRow)].map(
    (row) => row.groups?.["id"],
  );

  expect(listed).toEqual(criteria);
});

// Without it, axe stops at WCAG 2.1 and says nothing of target size.
it("runs axe by the rules of the target", async () => {
  const preview = await readFile(
    new URL(".storybook/preview.tsx", root),
    "utf8",
  );

  expect(preview).toContain('"wcag22aa"');
});
