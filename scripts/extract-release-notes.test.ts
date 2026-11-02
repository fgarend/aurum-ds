import { describe, expect, it } from "vitest";
import { extractReleaseNotes } from "./extract-release-notes.ts";

// A fictitious changelog, in Keep a Changelog's format.
const changelog = `# Changelog

## [Unreleased]

## [2.1.0] - 2030-06-01

A fictional summary.

### Added

- A fictional thing.

## [2.0.0] - 2030-05-01

### Changed

- **Breaking:** another fictional thing.

[Unreleased]: https://example.com/compare/v2.1.0...HEAD
[2.1.0]: https://example.com/tree/v2.1.0
[2.0.0]: https://example.com/tree/v2.0.0
`;

describe("extractReleaseNotes", () => {
  it("returns a version's section, without its heading", () => {
    expect(extractReleaseNotes(changelog, "2.1.0")).toBe(
      "A fictional summary.\n\n### Added\n\n- A fictional thing.\n",
    );
  });

  it("stops before the links at the end", () => {
    expect(extractReleaseNotes(changelog, "2.0.0")).toBe(
      "### Changed\n\n- **Breaking:** another fictional thing.\n",
    );
  });

  it("fails on a version with no section", () => {
    expect(() => extractReleaseNotes(changelog, "3.0.0")).toThrow(
      "CHANGELOG.md has no section for 3.0.0",
    );
  });

  it("fails on a section with nothing in it", () => {
    const empty = changelog.replace(
      "A fictional summary.\n\n### Added\n\n- A fictional thing.\n\n",
      "",
    );

    expect(() => extractReleaseNotes(empty, "2.1.0")).toThrow(
      "CHANGELOG.md has nothing under 2.1.0",
    );
  });
});
