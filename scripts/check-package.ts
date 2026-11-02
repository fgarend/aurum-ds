// Packs the package and installs it in a throwaway app, as the app would, then imports every export (decision 0038).
// Run by make pack, in a container, with the repository mounted read-only and the folder of pnpm's store as its argument.
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

interface Exported {
  name: string;
  exports: Record<string, string>;
}

interface Manifest extends Exported {
  packageManager: string;
  devDependencies: Record<string, string>;
}

const root = fileURLToPath(new URL("../", import.meta.url));
const leadingDotSlash = /^\.\//u;
const upToPackage = /.*node_modules\//u;

function run(command: string, args: string[], cwd: string): void {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

function readManifest(): Manifest {
  return JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
}

function pack(): string {
  const folder = mkdtempSync(join(tmpdir(), "pack-"));
  console.log("What the app receives:");
  run("pnpm", ["pack", "--pack-destination", folder], root);
  const [tarball] = readdirSync(folder);
  if (tarball === undefined) {
    throw new Error("pnpm pack wrote no tarball");
  }
  return join(folder, tarball);
}

// A throwaway app with the same pnpm settings, and React 19, the package's peer, at the version used here.
function install(manifest: Manifest, tarball: string, store: string): string {
  const app = mkdtempSync(join(tmpdir(), "app-"));
  const react = manifest.devDependencies["react"] ?? "";
  writeFileSync(
    join(app, "package.json"),
    JSON.stringify({
      name: "app",
      private: true,
      type: "module",
      packageManager: manifest.packageManager,
    }),
  );
  copyFileSync(
    join(root, "pnpm-workspace.yaml"),
    join(app, "pnpm-workspace.yaml"),
  );
  run(
    "pnpm",
    [
      "add",
      tarball,
      `react@${react}`,
      `react-dom@${react}`,
      "--store-dir",
      store,
    ],
    app,
  );
  return app;
}

// The name the app imports for each export, such as @fgarend/aurum-ds/tokens.css.
function specifiers({ name, exports }: Exported): string[] {
  return Object.keys(exports).map(
    (entry) => `${name}/${entry.replace(leadingDotSlash, "")}`,
  );
}

// Resolves every export from the app's folder, as the app would; a file the app did not receive throws.
function importEveryExport(manifest: Exported, app: string): string[] {
  const { resolve } = createRequire(join(app, "package.json"));
  return specifiers(manifest).map((specifier) => {
    try {
      return `${specifier} → ${resolve(specifier).replace(upToPackage, "")}`;
    } catch (error) {
      throw new Error(`${specifier}: the app cannot import it`, {
        cause: error,
      });
    }
  });
}

function main(): void {
  const [store] = process.argv.slice(2);
  if (store === undefined) {
    throw new Error("Usage: node scripts/check-package.ts <pnpm store folder>");
  }
  const manifest = readManifest();
  const app = install(manifest, pack(), store);
  console.log("What the app imports:");
  for (const line of importEveryExport(manifest, app)) {
    console.log(`  ${line}`);
  }
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

export { importEveryExport, specifiers };
