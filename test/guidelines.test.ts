import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const quotedWord = /`(?<word>[a-z][a-z0-9-]*)`/gu;
// Placeholders the guidelines use for any one of a numbered set, such as "cat-n".
const placeholders = new Set(["cat-n", "cat-n-soft"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function names(list: unknown): string[] {
  return Array.isArray(list)
    ? list.filter(isRecord).map((item) => String(item["name"]))
    : [];
}

// Every token name in tokens.json: the families' tokens, the text styles and the font families.
async function tokenNames(): Promise<Set<string>> {
  const tokens: unknown = JSON.parse(
    await readFile(new URL("src/tokens/tokens.json", root), "utf8"),
  );
  const all = new Set<string>();
  if (!isRecord(tokens)) {
    return all;
  }
  for (const family of Object.values(tokens)) {
    for (const name of names(isRecord(family) ? family["tokens"] : undefined)) {
      all.add(name);
    }
  }
  const type = isRecord(tokens["type"]) ? tokens["type"] : {};
  const groups = Array.isArray(type["groups"])
    ? type["groups"].filter(isRecord)
    : [];
  for (const name of groups.flatMap((group) => names(group["styles"]))) {
    all.add(name);
  }
  for (const key of Object.keys(
    isRecord(type["families"]) ? type["families"] : {},
  )) {
    all.add(`font-${key}`);
  }
  return all;
}

// The guidelines are the living copy of the brand book (decision 0031): a token they name must still exist.
it("names only tokens that exist", async () => {
  const guidelines = await readFile(
    new URL("docs/guidelines.md", root),
    "utf8",
  );
  const tokens = await tokenNames();
  const stems = new Set([...tokens].map((name) => name.split("-")[0]));
  const missing = [...guidelines.matchAll(quotedWord)]
    .map((match) => match.groups?.["word"] ?? "")
    .filter(
      (word) =>
        stems.has(word.split("-")[0]) &&
        !tokens.has(word) &&
        !placeholders.has(word),
    );

  expect(missing).toEqual([]);
});
