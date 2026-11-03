// Packs the package and installs it in a throwaway app, as the app would, then imports every export and checks the
// types of the entry and of each component's path (decisions 0038 and 0065).
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

// A throwaway app with the same pnpm settings, the package's peers, React 19 and Lucide, and TypeScript with React's
// types, at the versions used here.
function install(manifest: Manifest, tarball: string, store: string): string {
  const app = mkdtempSync(join(tmpdir(), "app-"));
  const react = manifest.devDependencies["react"] ?? "";
  const lucide = manifest.devDependencies["lucide-react"] ?? "";
  const typescript = manifest.devDependencies["typescript"] ?? "";
  const reactTypes = manifest.devDependencies["@types/react"] ?? "";
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
      `lucide-react@${lucide}`,
      `typescript@${typescript}`,
      `@types/react@${reactTypes}`,
      "--store-dir",
      store,
    ],
    app,
  );
  return app;
}

// The name the app imports for each export, such as @fgarend/aurum-ds/tokens.css: the entry by the package's name,
// and the path per component (./*) once for each component.
function specifiers(
  { name, exports }: Exported,
  components: string[],
): string[] {
  return Object.keys(exports).flatMap((entry) => {
    if (entry === ".") {
      return [name];
    }
    const subpath = entry.replace(leadingDotSlash, "");
    return subpath === "*"
      ? components.map((component) => `${name}/${component}`)
      : [`${name}/${subpath}`];
  });
}

// Resolves every export from the app's folder, as the app would; a file the app did not receive throws.
function importEveryExport(
  manifest: Exported,
  components: string[],
  app: string,
): string[] {
  const { resolve } = createRequire(join(app, "package.json"));
  return specifiers(manifest, components).map((specifier) => {
    try {
      return `${specifier} → ${resolve(specifier).replace(upToPackage, "")}`;
    } catch (error) {
      throw new Error(`${specifier}: the app cannot import it`, {
        cause: error,
      });
    }
  });
}

// A module that imports the entry and every component by its path, for TypeScript to check what the app would see.
function typeCheckSource(name: string, components: string[]): string {
  return [
    `export * as entry from "${name}";`,
    ...components.map(
      (component) => `export { ${component} } from "${name}/${component}";`,
    ),
    "",
  ].join("\n");
}

// Checks the package's types in the app, with settings like the app's, a Vite app's, and its declarations checked too
// (skipLibCheck off), the strictest an app may choose.
function checkTypes(name: string, components: string[], app: string): void {
  writeFileSync(join(app, "check.ts"), typeCheckSource(name, components));
  writeFileSync(
    join(app, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "es2023",
        lib: ["es2023", "dom"],
        module: "esnext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        strict: true,
        noUncheckedIndexedAccess: true,
        exactOptionalPropertyTypes: true,
        verbatimModuleSyntax: true,
        skipLibCheck: false,
        noEmit: true,
        types: [],
      },
      include: ["check.ts"],
    }),
  );
  run(join(app, "node_modules/.bin/tsc"), ["-p", "."], app);
}

function main(): void {
  const [store] = process.argv.slice(2);
  if (store === undefined) {
    throw new Error("Usage: node scripts/check-package.ts <pnpm store folder>");
  }
  const manifest = readManifest();
  const components = readdirSync(join(root, "dist/components"));
  const app = install(manifest, pack(), store);
  console.log("What the app imports:");
  for (const line of importEveryExport(manifest, components, app)) {
    console.log(`  ${line}`);
  }
  checkTypes(manifest.name, components, app);
  console.log("The app's TypeScript accepts the package's types.");
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

export { importEveryExport, specifiers, typeCheckSource };
