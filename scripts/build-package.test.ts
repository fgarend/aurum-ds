import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { copyStyles } from "./build-package.ts";

// A fictitious source tree: two style sheets, in folders, beside code and data.
function sourceTree(): string {
  const root = mkdtempSync(join(tmpdir(), "src-"));
  for (const [path, content] of Object.entries({
    "styles/base.css": "base",
    "components/Button/Button.css": "button",
    "components/Button/Button.tsx": "code",
    "tokens/tokens.json": "{}",
  })) {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

it("copies every style sheet to its place, and nothing else", () => {
  const from = sourceTree();
  const to = mkdtempSync(join(tmpdir(), "dist-"));

  copyStyles(from, to);

  expect(readFileSync(join(to, "styles/base.css"), "utf8")).toBe("base");
  expect(readFileSync(join(to, "components/Button/Button.css"), "utf8")).toBe(
    "button",
  );
  expect(existsSync(join(to, "components/Button/Button.tsx"))).toBe(false);
  expect(existsSync(join(to, "tokens/tokens.json"))).toBe(false);
});
