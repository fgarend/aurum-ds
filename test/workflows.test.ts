import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const checkTarget = /^check:.*\n\t.*-k (?<targets>.+)$/mu;
const makeStep = /^\s+(?:- )?run: make (?<target>\S+)$/gmu;
const packStep = /^\s+run: make release-package > "(?<path>[^"]+)"$/mu;
const releaseCreate = /^\s+run: gh release create (?<args>.+)$/mu;
const scopeSlash = /^@(?<scope>[^/]+)\//u;
const jobHeading = /^ {2}(?<name>[\w-]+):$/gmu;
const needsLine = /^ {4}needs: (?:\[(?<list>[^\]]+)\]|(?<one>[\w-]+))$/mu;
const pagesPermissions = /^ +(?:pages|id-token): write$/mu;
// The commit the checks ran on, as a workflow writes it.
// biome-ignore lint/suspicious/noTemplateCurlyInString: an expression of GitHub's, not a template of JavaScript's.
const checkedOutCommit = "ref: ${{ github.event.workflow_run.head_sha }}";
const releaseTrigger =
  /^on:\n {2}workflow_run:\n {4}workflows: \[check\]\n {4}types: \[completed\]\n {4}branches: \[main\]$/mu;

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

// The jobs whose lines hold text.
function jobsWith(all: Map<string, string>, text: string): string[] {
  return [...all].filter(([, job]) => job.includes(text)).map(([name]) => name);
}

async function readRelease(): Promise<Map<string, string>> {
  return jobs(
    await readFile(new URL(".github/workflows/release.yml", root), "utf8"),
  );
}

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

// A release starts by itself when the checks pass on a push to main of this repository, never from a pull request,
// and takes the commit those checks ran on (decision 0066).
it("releases from the checks that passed on a push to main", async () => {
  const workflow = await readFile(
    new URL(".github/workflows/release.yml", root),
    "utf8",
  );
  const release = jobs(workflow);
  const first = [...release].find(([, job]) => !needsLine.test(job))?.[1] ?? "";

  expect(workflow).toMatch(releaseTrigger);
  expect(workflow).not.toContain("workflow_dispatch");
  expect(first).toContain("github.event.workflow_run.conclusion == 'success'");
  expect(first).toContain("github.event.workflow_run.event == 'push'");
  expect(first).toContain(
    "github.event.workflow_run.head_repository.full_name == github.repository",
  );
  for (const [, job] of release) {
    expect(job.includes("uses: actions/checkout@")).toBe(
      job.includes(checkedOutCommit),
    );
  }
});

// The checks run once, on the push; the release does not run them again, so the check workflow is not reused.
it("does not run the checks again for a release", async () => {
  const check = await readFile(
    new URL(".github/workflows/check.yml", root),
    "utf8",
  );

  expect(check).not.toContain("workflow_call");
});

// A release publishes the gallery of components on GitHub Pages (decision 0062): it is built before the tag, so no
// release is made without it, and published after.
it("builds the gallery before the tag", async () => {
  const release = await readRelease();
  const galleries = jobsWith(release, "run: make storybook-build");
  const gallery = galleries[0] ?? "";

  expect(galleries).toHaveLength(1);
  expect(release.get(gallery)).toContain(
    "uses: actions/upload-pages-artifact@",
  );
  expect(needs(release.get("tag") ?? "")).toContain(gallery);
});

it("publishes the gallery after the tag", async () => {
  const release = await readRelease();
  const publishers = jobsWith(release, "uses: actions/deploy-pages@");
  const pages = publishers[0] ?? "";

  expect(publishers).toHaveLength(1);
  expect(needs(release.get(pages) ?? "")).toContain("tag");
});

// Writing to Pages is the publishing job's alone.
it("lets only the publishing job write to Pages", async () => {
  const release = await readRelease();
  const writers = [...release]
    .filter(([, job]) => pagesPermissions.test(job))
    .map(([name]) => name);

  expect(writers).toEqual(jobsWith(release, "uses: actions/deploy-pages@"));
});
