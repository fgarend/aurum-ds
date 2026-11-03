import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  importEveryExport,
  importTestSource,
  specifiers,
  testSettingsSource,
  typeCheckSource,
} from "./check-package.ts";

// A fictitious package, installed by hand in a throwaway app: no network, no pnpm.
const manifest = {
  name: "@fictional/kit",
  exports: {
    ".": "./dist/index.js",
    "./colors.css": "./dist/colors.css",
    "./*": "./dist/components/*/*.js",
    "./package.json": "./package.json",
  },
};
const components = ["Button"];

function appWith(files: Record<string, string>): string {
  const app = mkdtempSync(join(tmpdir(), "app-"));
  const installed = join(app, "node_modules", "@fictional", "kit");
  writeFileSync(join(app, "package.json"), "{}");
  for (const [path, content] of Object.entries({
    "package.json": JSON.stringify(manifest),
    ...files,
  })) {
    mkdirSync(join(installed, path, ".."), { recursive: true });
    writeFileSync(join(installed, path), content);
  }
  return app;
}

describe("specifiers", () => {
  it("lists what the app imports, one name per export and per component", () => {
    expect(specifiers(manifest, components)).toEqual([
      "@fictional/kit",
      "@fictional/kit/colors.css",
      "@fictional/kit/Button",
      "@fictional/kit/package.json",
    ]);
  });
});

describe("importEveryExport", () => {
  it("resolves every export in the app", () => {
    const app = appWith({
      "dist/index.js": "",
      "dist/colors.css": ":root {}",
      "dist/components/Button/Button.js": "",
    });

    expect(importEveryExport(manifest, components, app)).toEqual([
      "@fictional/kit → @fictional/kit/dist/index.js",
      "@fictional/kit/colors.css → @fictional/kit/dist/colors.css",
      "@fictional/kit/Button → @fictional/kit/dist/components/Button/Button.js",
      "@fictional/kit/package.json → @fictional/kit/package.json",
    ]);
  });

  it("fails on an export whose file the app did not receive", () => {
    const app = appWith({});

    expect(() => importEveryExport(manifest, components, app)).toThrow(
      "@fictional/kit",
    );
  });
});

describe("typeCheckSource", () => {
  it("imports the entry and every component by its path, for TypeScript to check", () => {
    expect(typeCheckSource(manifest.name, components)).toBe(
      [
        'export * as entry from "@fictional/kit";',
        'export { Button } from "@fictional/kit/Button";',
        "",
      ].join("\n"),
    );
  });
});

describe("testSettingsSource", () => {
  it("is the line the guides give the app's Vitest, for the package's CSS", () => {
    expect(testSettingsSource(manifest.name)).toBe(
      'export default { test: { server: { deps: { inline: ["@fictional/kit"] } } } };\n',
    );
  });
});

describe("importTestSource", () => {
  it("imports the entry and every component by its path, in a test of the app", () => {
    expect(importTestSource(manifest.name, components)).toBe(
      [
        'import { expect, it } from "vitest";',
        'import * as entry from "@fictional/kit";',
        'import { Button } from "@fictional/kit/Button";',
        "",
        'it("imports the package in the app\'s tests", () => {',
        "  expect([entry, Button]).not.toContain(undefined);",
        "});",
        "",
      ].join("\n"),
    );
  });
});
