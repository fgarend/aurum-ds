import { access, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const root = new URL("../", import.meta.url);
// The package resolves its own name through its exports, as the app would.
const { resolve } = createRequire(new URL("package.json", root));
const files = ["tokens.css", "fonts.css", "base.css"];
// The components, each importable by its own path as well as from the entry (decision 0064).
const components = ["Icon"];
const leadingDotSlash = /^\.\//u;
const pnpmImage = /^PNPM_IMAGE=ghcr\.io\/pnpm\/pnpm:(?<version>[^@\s]+)@/mu;
const playwrightImage =
  /^PLAYWRIGHT_IMAGE=mcr\.microsoft\.com\/playwright:v(?<version>\d+\.\d+\.\d+)-/mu;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readManifest(): Promise<Record<string, unknown>> {
  const manifest: unknown = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  );
  return isRecord(manifest) ? manifest : {};
}

async function readExports(): Promise<Record<string, unknown>> {
  const { exports } = await readManifest();
  return isRecord(exports) ? exports : {};
}

// What the package ships is public (decisions 0004 and 0036): adding or removing a name changes the next version.
describe("the package's exports", () => {
  it("are exactly the entry, the public files and a path per component", async () => {
    expect(Object.keys(await readExports())).toEqual([
      ".",
      ...files.map((file) => `./${file}`),
      "./*",
      "./package.json",
    ]);
  });

  // The app receives exactly dist/, which every export points into (decisions 0037 and 0063).
  it("ship dist/, where they all point", async () => {
    const targets = Object.entries(await readExports())
      .filter(([name]) => name !== "./package.json")
      .map(([, path]) => String(path).replace(leadingDotSlash, ""));

    expect((await readManifest())["files"]).toEqual(["dist"]);
    expect(targets.filter((path) => !path.startsWith("dist/"))).toEqual([]);
  });

  // Only style sheets do something by being imported: the app's bundler may drop any code it does not use, and must
  // keep the CSS a component imports.
  it("mark only style sheets as side effects", async () => {
    expect((await readManifest())["sideEffects"]).toEqual(["**/*.css"]);
  });

  // Installing the package runs no code in the app (decision 0037).
  it("run no script when installed", async () => {
    const { scripts } = await readManifest();

    for (const name of ["prepare", "preinstall", "install", "postinstall"]) {
      expect(isRecord(scripts) ? scripts : {}).not.toHaveProperty([name]);
    }
  });

  it.each([
    "@fgarend/aurum-ds",
    ...files.map((file) => `@fgarend/aurum-ds/${file}`),
    ...components.map((component) => `@fgarend/aurum-ds/${component}`),
  ])("resolve %s", async (specifier) => {
    await expect(access(resolve(specifier))).resolves.toBeUndefined();
  });
});

// pnpm's binary comes from its image (decision 0043), and pnpm itself checks it is the version packageManager names.
describe("the package manager", () => {
  it("comes from an image of the version packageManager names", async () => {
    const { packageManager } = await readManifest();
    const settings = await readFile(
      new URL("infra/settings.env", root),
      "utf8",
    );
    const image = settings.match(pnpmImage)?.groups?.["version"];

    expect(`pnpm@${image}`).toBe(packageManager);
  });
});

// The browsers come from Playwright's image (decision 0047), and the playwright package must drive the same version.
describe("the browsers", () => {
  it("come from the image of the version the playwright package names", async () => {
    const { devDependencies } = await readManifest();
    const settings = await readFile(
      new URL("infra/settings.env", root),
      "utf8",
    );
    const image = settings.match(playwrightImage)?.groups?.["version"];

    expect(isRecord(devDependencies) && devDependencies["playwright"]).toBe(
      image,
    );
  });
});
