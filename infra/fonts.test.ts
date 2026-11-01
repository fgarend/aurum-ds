import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const { resolve } = createRequire(new URL("package.json", root));
const importPattern =
  /@import "(?<specifier>(?<name>@[^/"]+\/[^/"]+)\/[^"]+)";/gu;
const familyPattern = /font-family: '(?<family>[^']+)'/u;
const firstFamilyPattern =
  /^\s*(?:"(?<quoted>[^"]+)"|(?<bare>[^,]+?))\s*(?:,|$)/u;

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(new URL(path, root), "utf8"));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// The first family of each font stack in tokens.json, in file order.
async function firstFamilies(): Promise<string[]> {
  const tokens = await readJson("src/tokens/tokens.json");
  const type = isRecord(tokens) ? tokens["type"] : undefined;
  const families = isRecord(type) ? type["families"] : undefined;
  return Object.values(isRecord(families) ? families : {}).map((stack) => {
    const { quoted, bare } =
      String(stack).match(firstFamilyPattern)?.groups ?? {};
    return quoted ?? bare ?? "";
  });
}

// The fonts are served by the package (decision 0027): a family the tokens name first must be the one loaded.
it("loads, from a dependency, the family each font token names first", async () => {
  const fonts = await readFile(new URL("src/fonts/fonts.css", root), "utf8");
  const manifest = await readJson("package.json");
  const dependencies = isRecord(manifest)
    ? manifest["dependencies"]
    : undefined;
  const loaded: string[] = [];
  for (const match of fonts.matchAll(importPattern)) {
    const { specifier = "", name = "" } = match.groups ?? {};
    expect(dependencies, `${name} is not a dependency`).toHaveProperty([name]);
    // biome-ignore lint/performance/noAwaitInLoops: one small file per import, read in order.
    const css = await readFile(resolve(specifier), "utf8");
    loaded.push(css.match(familyPattern)?.groups?.["family"] ?? "");
  }

  expect(loaded).toEqual(await firstFamilies());
});
