import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const checkTarget = /^check:.*\n\t.*-k (?<targets>.+)$/mu;
const makeStep = /^\s+(?:- )?run: make (?<target>\S+)$/gmu;
const packStep = /^\s+run: make release-package > "(?<path>[^"]+)"$/mu;
const releaseCreate = /^\s+run: gh release create (?<args>.+)$/mu;
const scopeSlash = /^@(?<scope>[^/]+)\//u;

// Continuous integration runs the checks of make check, each in a step of its own (decision 0046): the two lists
// are written twice, and this keeps them alike.
it("runs exactly the checks of make check, in its order", async () => {
  const makefile = await readFile(new URL("Makefile", root), "utf8");
  const workflow = await readFile(
    new URL(".github/workflows/check.yml", root),
    "utf8",
  );
  const checks = makefile.match(checkTarget)?.groups?.["targets"]?.split(" ");
  const steps = [...workflow.matchAll(makeStep)]
    .map((match) => match.groups?.["target"])
    .filter((target) => target !== "images");

  expect(checks).toBeDefined();
  expect(steps).toEqual(checks);
});

// The release page carries the packed package, named as pnpm pack names it, so the app installs it by URL without git
// (decision 0051).
it("attaches the packed package to the release page", async () => {
  const workflow = await readFile(
    new URL(".github/workflows/release.yml", root),
    "utf8",
  );
  const { name } = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  );
  const path = workflow.match(packStep)?.groups?.["path"];

  expect(path).toBe(
    `$RUNNER_TEMP/${String(name).replace(scopeSlash, "$<scope>-")}-$VERSION.tgz`,
  );
  expect(workflow.match(releaseCreate)?.groups?.["args"]).toContain(
    `"${path}"`,
  );
});
