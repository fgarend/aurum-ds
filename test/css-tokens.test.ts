import { readdir, readFile } from "node:fs/promises";
import { expect, it } from "vitest";

const sources = new URL("../src/", import.meta.url);
const definedPattern = /^\s*(?<name>--au-[^:]+):/gmu;
const usedPattern = /var\((?<name>--au-[^,)\s]+)/gu;

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
