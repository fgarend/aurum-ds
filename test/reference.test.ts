import { readdir } from "node:fs/promises";
import { expect, it } from "vitest";

const reference = new URL("../reference/", import.meta.url);
const pngSuffix = /\.png$/u;
const htmlSuffix = /\.html$/u;
const byName = (a: string, b: string): number => a.localeCompare(b);

async function screenshotsIn(folder: string): Promise<string[]> {
  const files = await readdir(new URL(folder, reference)).catch(() => []);
  return files
    .filter((file) => pngSuffix.test(file))
    .map((file) => file.replace(pngSuffix, ""))
    .toSorted(byName);
}

// make reference renders each of the artifact's previews once (decision 0033): one screenshot per preview, no more.
it("holds one reference screenshot per preview of the artifact", async () => {
  const components = await readdir(new URL("artifact/components/", reference), {
    withFileTypes: true,
  });
  const previews: string[] = [];
  for (const entry of components.filter((item) => item.isDirectory())) {
    // biome-ignore lint/performance/noAwaitInLoops: a few small folders, read in order.
    const files = await readdir(
      new URL(`artifact/components/${entry.name}/`, reference),
    );
    if (files.includes("preview.html")) {
      previews.push(entry.name);
    }
  }
  expect(await screenshotsIn("screenshots/")).toEqual(
    previews.toSorted(byName),
  );
});

// And each screen of the prototype (decision 0035).
it("holds one reference screenshot per screen of the prototype", async () => {
  const screens = (await readdir(new URL("prototype/", reference)))
    .filter((file) => htmlSuffix.test(file) && file !== "index.html")
    .map((file) => file.replace(htmlSuffix, ""))
    .toSorted(byName);

  expect(await screenshotsIn("screenshots/prototype/")).toEqual(screens);
});
