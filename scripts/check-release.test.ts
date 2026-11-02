import { describe, expect, it } from "vitest";
import { checkRelease } from "./check-release.ts";

// A fictitious changelog, in Keep a Changelog's format.
const changelog = `# Changelog

## [Unreleased]

## [2.1.0] - 2030-06-01

### Added

- A fictional thing.

## [2.0.0] - 2030-05-01

### Changed

- **Breaking:** another fictional thing.

[Unreleased]: https://example.com/compare/v2.1.0...HEAD
[2.1.0]: https://example.com/tree/v2.1.0
[2.0.0]: https://example.com/tree/v2.0.0
`;

describe("checkRelease", () => {
  it("passes a version whose changelog section is dated and linked", () => {
    expect(checkRelease("2.1.0", changelog, undefined)).toEqual([]);
  });

  it("passes when the version asked for is the package's", () => {
    expect(checkRelease("2.1.0", changelog, "2.1.0")).toEqual([]);
  });

  it("fails when the version asked for is not the package's", () => {
    expect(checkRelease("2.1.0", changelog, "2.2.0")).toEqual([
      "package.json is at 2.1.0, not 2.2.0",
    ]);
  });

  it("fails on a version that is not X.Y.Z", () => {
    expect(checkRelease("2.1", changelog, undefined)).toEqual([
      "2.1 is not a version X.Y.Z",
    ]);
  });

  it("fails when the changelog has no section for the version", () => {
    expect(checkRelease("2.2.0", changelog, undefined)).toEqual([
      "CHANGELOG.md has no section ## [2.2.0] - YYYY-MM-DD",
      "CHANGELOG.md has no link [2.2.0]: …",
    ]);
  });

  it("fails on a section with no date", () => {
    const undated = changelog.replace("## [2.1.0] - 2030-06-01", "## [2.1.0]");

    expect(checkRelease("2.1.0", undated, undefined)).toEqual([
      "CHANGELOG.md has no section ## [2.1.0] - YYYY-MM-DD",
    ]);
  });

  it("fails when Unreleased is missing above the release", () => {
    const noUnreleased = changelog.replace("## [Unreleased]\n\n", "");

    expect(checkRelease("2.1.0", noUnreleased, undefined)).toEqual([
      "CHANGELOG.md has no ## [Unreleased] above ## [2.1.0]",
    ]);
  });

  it("fails while Unreleased still lists changes", () => {
    const pending = changelog.replace(
      "## [Unreleased]\n",
      "## [Unreleased]\n\n### Fixed\n\n- A fictional fix.\n",
    );

    expect(checkRelease("2.1.0", pending, undefined)).toEqual([
      "CHANGELOG.md still lists changes under ## [Unreleased]",
    ]);
  });
});
