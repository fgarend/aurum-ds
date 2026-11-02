// Writes the approved screenshots again, to review a visual change in the diff (decisions 0034 and 0044). Run by
// make screenshots. Vitest never removes the screenshot of a renamed or deleted test, so every folder of approved
// screenshots under src/ is removed first, and the visual tests write them all again.
import { spawnSync } from "node:child_process";
import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const screenshotsFolder = "__screenshots__";

// Removes every __screenshots__ folder under root.
function removeScreenshots(root: string): void {
  for (const entry of readdirSync(root, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (entry.isDirectory() && entry.name === screenshotsFolder) {
      rmSync(join(entry.parentPath, entry.name), {
        recursive: true,
        force: true,
      });
    }
  }
}

function main(): void {
  removeScreenshots(fileURLToPath(new URL("../src/", import.meta.url)));
  const { status } = spawnSync(
    "pnpm",
    ["exec", "vitest", "run", "--project", "browser", "--update"],
    { stdio: "inherit" },
  );
  process.exitCode = status ?? 1;
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

export { removeScreenshots };
