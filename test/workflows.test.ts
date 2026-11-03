import { access, readFile } from "node:fs/promises";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const checkTarget = /^check:.*\n\t.*-k (?<targets>.+)$/mu;
const makeStep = /^\s+(?:- )?run: make (?<target>\S+)$/gmu;
const packLine = /^\s+make release-package > "(?<path>[^"]+)"$/mu;
const releaseCreate = /^\s+run: gh release create (?<args>.+)$/mu;
const scopeSlash = /^@(?<scope>[^/]+)\//u;
const jobHeading = /^ {2}(?<name>[\w-]+):$/gmu;
const needsLine = /^ {4}needs: (?:\[(?<list>[^\]]+)\]|(?<one>[\w-]+))$/mu;
const pagesPermissions = /^ +(?:pages|id-token): write$/mu;
const ciTrigger =
  /^on:\n {2}push:\n {4}branches: \[main\]\n {2}pull_request:\n {2}workflow_dispatch:$/mu;
const cancelsInProgress = /^ +cancel-in-progress: true$/mu;
const projectCode =
  /^\s+(?:- )?run: (?:make|pnpm|node)\b|^\s+(?:make|pnpm|node) /mu;

// Each job of a workflow, by name, with its lines.
function jobs(workflow: string): Map<string, string> {
  const start = workflow.indexOf("\njobs:\n");
  const headings = [...workflow.slice(start).matchAll(jobHeading)];
  return new Map(
    headings.map((heading, index) => [
      heading.groups?.["name"] ?? "",
      workflow.slice(
        start + (heading.index ?? 0),
        start + (headings[index + 1]?.index ?? workflow.length),
      ),
    ]),
  );
}

// The jobs a job waits for.
function needs(job: string): string[] {
  const { list, one } = job.match(needsLine)?.groups ?? {};
  return (list ?? one ?? "").split(",").map((name) => name.trim());
}

function readCi(): Promise<string> {
  return readFile(new URL(".github/workflows/ci.yml", root), "utf8");
}

// The checks and the release are one pipeline, ci, run on every push to main and every pull request (decision 0067).
it("runs one pipeline, on pushes to main and pull requests", async () => {
  expect(await readCi()).toMatch(ciTrigger);
  for (const gone of ["check.yml", "release.yml"]) {
    // biome-ignore lint/performance/noAwaitInLoops: two files, checked in order.
    await expect(
      access(new URL(`.github/workflows/${gone}`, root)),
    ).rejects.toThrow();
  }
});

// Continuous integration runs the checks of make check, each in a step of its own (decision 0046): the two lists
// are written twice, and this keeps them alike.
it("runs exactly the checks of make check, in its order", async () => {
  const makefile = await readFile(new URL("Makefile", root), "utf8");
  const checks = makefile.match(checkTarget)?.groups?.["targets"]?.split(" ");
  const steps = [
    ...(jobs(await readCi()).get("check") ?? "").matchAll(makeStep),
  ]
    .map((match) => match.groups?.["target"])
    .filter((target) => target !== "images");

  expect(checks).toBeDefined();
  expect(steps).toEqual(checks);
});

// Only a push to main may release, never a pull request; the job that checks asks, and prepares a release once:
// the audit, the gallery, the notes and the package.
it("prepares a release only on a push to main, in the job that checks", async () => {
  const check = jobs(await readCi()).get("check") ?? "";

  expect(check).toContain("github.event_name == 'push'");
  expect(check).toContain("github.ref == 'refs/heads/main'");
  expect(check).toContain("make check-release");
  for (const step of [
    "make audit",
    "make storybook-build",
    "make release-package",
  ]) {
    expect(check).toContain(step);
  }
  expect(check).toContain("uses: actions/upload-pages-artifact@");
});

// A newer push cancels the checks still running, never a release halfway.
it("cancels only the checks", async () => {
  const workflow = await readCi();
  const all = jobs(workflow);

  expect(workflow.slice(0, workflow.indexOf("\njobs:\n"))).not.toMatch(
    cancelsInProgress,
  );
  expect(
    [...all]
      .filter(([, job]) => cancelsInProgress.test(job))
      .map(([name]) => name),
  ).toEqual(["check"]);
});

// The tag waits for the checks, and the gallery is published after it.
it("tags after the checks and publishes the gallery after the tag", async () => {
  const all = jobs(await readCi());

  expect(needs(all.get("tag") ?? "")).toEqual(["check"]);
  expect(needs(all.get("pages") ?? "")).toEqual(["tag"]);
  expect(all.get("pages")).toContain("uses: actions/deploy-pages@");
});

// The jobs that write run none of the project's code: they publish what the checks prepared.
it("runs no project code where it writes", async () => {
  const all = jobs(await readCi());

  for (const name of ["tag", "pages"]) {
    expect(all.get(name)).not.toMatch(projectCode);
  }
});

// Writing to Pages is the publishing job's alone.
it("lets only the publishing job write to Pages", async () => {
  const writers = [...jobs(await readCi())]
    .filter(([, job]) => pagesPermissions.test(job))
    .map(([name]) => name);

  expect(writers).toEqual(["pages"]);
});

// The release page carries the packed package, named as pnpm pack names it, so the app installs it by URL without git
// (decision 0051).
it("attaches the packed package to the release page", async () => {
  const all = jobs(await readCi());
  const { name } = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  );
  const path = all.get("check")?.match(packLine)?.groups?.["path"] ?? "";
  const file = path.slice(path.lastIndexOf("/") + 1);

  expect(file).toBe(
    `${String(name).replace(scopeSlash, "$<scope>-")}-$VERSION.tgz`,
  );
  expect(all.get("tag")?.match(releaseCreate)?.groups?.["args"]).toContain(
    file,
  );
});
