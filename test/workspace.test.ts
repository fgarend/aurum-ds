import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const ignoreMissingTime =
  /^minimumReleaseAgeIgnoreMissingTime:\s*(?<value>\S+)\s*$/mu;

// pnpm lets a version past the release age when its registry gives no publish time, unless told not to (decision
// 0050).
it("refuses a version whose publish time is missing", async () => {
  const workspace = await readFile(
    new URL("pnpm-workspace.yaml", root),
    "utf8",
  );

  expect(workspace.match(ignoreMissingTime)?.groups?.["value"]).toBe("false");
});
