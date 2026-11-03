// Builds what the app installs into dist/ (decision 0063): TypeScript emits the code, one JavaScript file and its
// declarations per module, and every style sheet is copied beside it, since a component imports its own. Run by
// make build. The check that dist/ is up to date builds into a folder of its own.
import { spawnSync } from "node:child_process";
import { cpSync, readdirSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sources = join(root, "src");
const tsc = join(root, "node_modules/.bin/tsc");

// Copies every .css file under from to the same place under to.
function copyStyles(from: string, to: string): void {
  for (const entry of readdirSync(from, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (entry.isFile() && entry.name.endsWith(".css")) {
      const path = relative(from, join(entry.parentPath, entry.name));
      cpSync(join(from, path), join(to, path));
    }
  }
}

// Writes the package's code and styles into outDir, emptied first.
function buildPackage(outDir: string): void {
  rmSync(outDir, { recursive: true, force: true });
  const { status } = spawnSync(
    tsc,
    ["-p", join(root, "tsconfig.build.json"), "--outDir", outDir],
    { stdio: "inherit" },
  );
  if (status !== 0) {
    throw new Error("TypeScript could not build the package");
  }
  copyStyles(sources, outDir);
}

if (import.meta.main) {
  try {
    buildPackage(join(root, "dist"));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

export { buildPackage, copyStyles };
