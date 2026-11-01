import { readdir } from "node:fs/promises";
import { expect, it } from "vitest";

const reference = new URL("../reference/", import.meta.url);
const pngSuffix = /\.png$/u;

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
  const screenshots = (
    await readdir(new URL("screenshots/", reference)).catch(() => [])
  )
    .filter((file) => pngSuffix.test(file))
    .map((file) => file.replace(pngSuffix, ""));

  const byName = (a: string, b: string): number => a.localeCompare(b);

  expect(screenshots.toSorted(byName)).toEqual(previews.toSorted(byName));
});
