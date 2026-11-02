// Prints a version's notes, its section of CHANGELOG.md without the heading, for the release page on GitHub (decision
// 0049). Run by make release-notes, which the release workflow calls with the version it releases.
import { readFile } from "node:fs/promises";

const nextHeading = /^## \[/mu;
const linkLine = /^\[[^\]]+\]: \S+$/mu;

function escaped(text: string): string {
  return text.replaceAll(".", "\\.");
}

// The section of the changelog for the version, without its heading, up to the next section or the links at the end.
function extractReleaseNotes(changelog: string, version: string): string {
  const heading = new RegExp(`^## \\[${escaped(version)}\\][^\\n]*\\n`, "mu");
  const start = changelog.match(heading);
  if (start?.index === undefined) {
    throw new Error(`CHANGELOG.md has no section for ${version}`);
  }
  const rest = changelog.slice(start.index + start[0].length);
  const ends = [rest.search(nextHeading), rest.search(linkLine)].filter(
    (at) => at !== -1,
  );
  const notes = rest.slice(0, Math.min(rest.length, ...ends)).trim();
  if (notes === "") {
    throw new Error(`CHANGELOG.md has nothing under ${version}`);
  }
  return `${notes}\n`;
}

async function main(): Promise<void> {
  const [version] = process.argv.slice(2);
  if (version === undefined) {
    throw new Error("Usage: node scripts/extract-release-notes.ts <version>");
  }
  const changelog = await readFile(
    new URL("../CHANGELOG.md", import.meta.url),
    "utf8",
  );
  process.stdout.write(extractReleaseNotes(changelog, version));
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

export { extractReleaseNotes };
