import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const sources = new URL("../src/", import.meta.url);
const hintPattern = /istanbul ignore[^*]*\*\//gu;
// The end of a range needs none: its start says why.
const explained =
  /^istanbul ignore (?:(?:if|else|next|start) -- @preserve: \S.*|stop -- @preserve )\*\/$/u;

// A line no test can reach is left out of the coverage only with the reason beside it, in a comment esbuild keeps
// (decision 0061).
it("says why each line left out of the coverage needs no test", async () => {
  // A folder of screenshots is named after its test, so only files count.
  const files = (
    await readdir(sources, { recursive: true, withFileTypes: true })
  )
    .filter(
      (entry) =>
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")),
    )
    .map((entry) =>
      relative(fileURLToPath(sources), join(entry.parentPath, entry.name)),
    );
  const unexplained: string[] = [];
  for (const path of files) {
    // biome-ignore lint/performance/noAwaitInLoops: a few small files, read in order.
    const code = await readFile(new URL(path, sources), "utf8");
    for (const [hint] of code.matchAll(hintPattern)) {
      if (!explained.test(hint)) {
        unexplained.push(`${path}: ${hint}`);
      }
    }
  }

  expect(unexplained).toEqual([]);
});
