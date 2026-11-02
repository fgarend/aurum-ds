import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const checkTarget = /^check:.*\n\t.*-k (?<targets>.+)$/mu;
const makeStep = /^\s+(?:- )?run: make (?<target>\S+)$/gmu;

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
