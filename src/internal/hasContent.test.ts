import { expect, it } from "vitest";
import { hasContent } from "./hasContent.js";

// What React draws nothing for, as `shown && <Filters />` gives when not shown.
it.each([undefined, null, false, true, ""])("sees nothing in %j", (node) => {
  expect(hasContent(node)).toBe(false);
});

// A zero is a value to show, unlike what React leaves out.
it.each([0, "text", ["list"]])("sees something in %j", (node) => {
  expect(hasContent(node)).toBe(true);
});
