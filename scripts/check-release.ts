// Checks that the repository is ready to release its version (decisions 0004 and 0048): package.json holds a version
// X.Y.Z, the changelog has its dated section and link, and nothing is left under Unreleased. Run by make
// check-release, before pushing a release commit, and by the release workflow, which passes the version it was asked
// for as the argument.
import { readFile } from "node:fs/promises";

const version = /^\d+\.\d+\.\d+$/u;
const unreleasedHeading = "## [Unreleased]";
const nextHeading = /^## \[/mu;
const changeLine = /^(?:###|-)/mu;

function escaped(text: string): string {
  return text.replaceAll(".", "\\.");
}

// What keeps the package's version from being released, if anything.
function checkRelease(
  current: string,
  changelog: string,
  asked: string | undefined,
): string[] {
  if (!version.test(current)) {
    return [`${current} is not a version X.Y.Z`];
  }
  const problems: string[] = [];
  if (asked !== undefined && asked !== current) {
    problems.push(`package.json is at ${current}, not ${asked}`);
  }
  const section = new RegExp(
    `^## \\[${escaped(current)}\\] - \\d{4}-\\d{2}-\\d{2}$`,
    "mu",
  );
  const link = new RegExp(`^\\[${escaped(current)}\\]: \\S+$`, "mu");
  const sectionAt = changelog.search(section);
  const unreleasedAt = changelog.indexOf(unreleasedHeading);
  if (sectionAt === -1) {
    problems.push(`CHANGELOG.md has no section ## [${current}] - YYYY-MM-DD`);
  }
  if (!link.test(changelog)) {
    problems.push(`CHANGELOG.md has no link [${current}]: …`);
  }
  if (unreleasedAt === -1 || (sectionAt !== -1 && unreleasedAt > sectionAt)) {
    problems.push(
      `CHANGELOG.md has no ${unreleasedHeading} above ## [${current}]`,
    );
  } else {
    const after = changelog.slice(unreleasedAt + unreleasedHeading.length);
    const next = after.search(nextHeading);
    const pending = next === -1 ? after : after.slice(0, next);
    if (changeLine.test(pending)) {
      problems.push(
        `CHANGELOG.md still lists changes under ${unreleasedHeading}`,
      );
    }
  }
  return problems;
}

async function main(): Promise<void> {
  const manifest: unknown = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const current =
    typeof manifest === "object" &&
    manifest !== null &&
    "version" in manifest &&
    typeof manifest.version === "string"
      ? manifest.version
      : "";
  const changelog = await readFile(
    new URL("../CHANGELOG.md", import.meta.url),
    "utf8",
  );
  const [asked] = process.argv.slice(2);
  const problems = checkRelease(current, changelog, asked);
  for (const problem of problems) {
    console.error(problem);
  }
  process.exitCode = problems.length > 0 ? 1 : 0;
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

export { checkRelease };
