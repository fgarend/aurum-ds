import { describe, expect, it } from "vitest";
import { readReleaseAge } from "./shared.ts";

// Seven days, in minutes, as pnpm counts it.
const releaseAge = 10_080;

describe("readReleaseAge", () => {
  it("reads pnpm's minimum release age, in minutes", () => {
    const workspace =
      "# A comment\nminimumReleaseAge: 10080\nsaveExact: true\n";

    expect(readReleaseAge(workspace)).toBe(releaseAge);
  });

  it("fails when pnpm's settings do not set it", () => {
    expect(() => readReleaseAge("saveExact: true\n")).toThrow(
      "minimumReleaseAge",
    );
  });
});
