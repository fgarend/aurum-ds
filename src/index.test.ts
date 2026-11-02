import { expect, it } from "vitest";

// The public API (decision 0004): adding or removing a name changes the next version.
// A module's export names are listed in alphabetical order.
it("exports exactly the public API", async () => {
  const entry = await import("./index.js");

  expect(Object.keys(entry)).toEqual(["Icon"]);
});
