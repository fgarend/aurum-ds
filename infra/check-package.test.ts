import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { importEveryExport, specifiers } from "./check-package.js";

// A fictitious package, installed by hand in a throwaway app: no network, no pnpm.
const manifest = {
  name: "@fictional/kit",
  exports: {
    "./colors.css": "./src/colors.css",
    "./package.json": "./package.json",
  },
};

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

describe("check-package", () => {
  it("lists what the app imports, one name per export", () => {
    expect(specifiers(manifest)).toEqual([
      "@fictional/kit/colors.css",
      "@fictional/kit/package.json",
    ]);
  });

  it("resolves every export in the app", () => {
    const app = appWith({ "src/colors.css": ":root {}" });

    expect(importEveryExport(manifest, app)).toEqual([
      "@fictional/kit/colors.css → @fictional/kit/src/colors.css",
      "@fictional/kit/package.json → @fictional/kit/package.json",
    ]);
  });

  it("fails on an export whose file the app did not receive", () => {
    const app = appWith({});

    expect(() => importEveryExport(manifest, app)).toThrow(
      "@fictional/kit/colors.css",
    );
  });
});
