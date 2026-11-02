// Reports what is pinned by hand and has something to look at (decisions 0018, 0043, 0044 and 0046): the images of
// infra/settings.env and the actions of the workflows, against pnpm's release age. Run by make outdated-pins.
import { readdir, readFile } from "node:fs/promises";
import { checkActions } from "./actions.ts";
import { checkImages } from "./images.ts";
import { readReleaseAge } from "./shared.ts";

async function main(): Promise<void> {
  const settings = await readFile(
    new URL("../../infra/settings.env", import.meta.url),
    "utf8",
  );
  const workspace = await readFile(
    new URL("../../pnpm-workspace.yaml", import.meta.url),
    "utf8",
  );
  const workflowsFolder = new URL("../../.github/workflows/", import.meta.url);
  const workflows = await Promise.all(
    (await readdir(workflowsFolder))
      .filter((name) => name.endsWith(".yml"))
      .map((name) => readFile(new URL(name, workflowsFolder), "utf8")),
  );
  const releaseAge = readReleaseAge(workspace);
  const now = new Date();
  const lines = [
    ...(await checkImages(settings, releaseAge, fetch, now)),
    ...(await checkActions(workflows, releaseAge, fetch, now)),
  ];
  for (const line of lines) {
    console.log(line);
  }
  process.exitCode = lines.length > 0 ? 1 : 0;
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
