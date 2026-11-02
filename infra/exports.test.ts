import { access, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const root = new URL("../", import.meta.url);
// The package resolves its own name through its exports, as the app would.
const { resolve } = createRequire(new URL("package.json", root));
const files = ["tokens.css", "fonts.css", "base.css"];

// What the package ships is public (decisions 0004 and 0036): adding or removing a name changes the next version.
describe("the package's exports", () => {
  it("are exactly the public files", async () => {
    const manifest: unknown = JSON.parse(
      await readFile(new URL("package.json", root), "utf8"),
    );
    const exports =
      typeof manifest === "object" && manifest !== null && "exports" in manifest
        ? manifest.exports
        : undefined;

    expect(Object.keys(exports ?? {})).toEqual([
      ...files.map((file) => `./${file}`),
      "./package.json",
    ]);
  });

  it.each(files)("resolve %s by the package's name", async (file) => {
    const path = resolve(`@fgarend/aurum-ds/${file}`);

    await expect(access(path)).resolves.toBeUndefined();
  });
});
