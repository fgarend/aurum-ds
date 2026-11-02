import { describe, expect, it } from "vitest";
import { checkActions } from "./actions.ts";
import type { Fetch } from "./shared.ts";

// Fictitious actions, releases, dates and commits: no real release is described here.
// Eight days after the newest release below that should be reported.
const now = new Date("2030-06-30T12:00:00Z");
// Seven days, in minutes, as pnpm counts it.
const releaseAge = 10_080;

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200 });
}

function notFound(): Response {
  return new Response("", { status: 404 });
}

// A fictitious action, pinned as the workflows pin it: a commit, and the release tag beside it.
const commitLength = 40;
const oldCommit = "1".repeat(commitLength);
const newCommit = "2".repeat(commitLength);
const tagObject = "3".repeat(commitLength);
const workflow = `jobs:
  check:
    steps:
      - uses: fictional/fetch@${oldCommit} # v3.1.0
        with:
          depth: 1
      - run: make check
`;

interface Release {
  version: string;
  date: string;
  prerelease: boolean;
}

interface ActionSources {
  releases: Release[];
  // Each tag's object, a commit, or an annotated tag pointing to one.
  tags: Record<string, { type: "commit" | "tag"; sha: string }>;
  tagObjects: Record<string, string>;
}

const currentAction: ActionSources = {
  releases: [
    { version: "3.1.0", date: "2030-05-01T00:00:00Z", prerelease: false },
  ],
  tags: { "v3.1.0": { type: "commit", sha: oldCommit } },
  tagObjects: {},
};

const releasesUrl =
  "https://api.github.com/repos/fictional/fetch/releases?per_page=100";
const tagUrl =
  /^https:\/\/api\.github\.com\/repos\/fictional\/fetch\/git\/ref\/tags\/(?<tag>.+)$/u;
const tagObjectUrl =
  /^https:\/\/api\.github\.com\/repos\/fictional\/fetch\/git\/tags\/(?<sha>.+)$/u;

// A release as GitHub's API writes it.
function asGitHub({
  version,
  date,
  prerelease,
}: Release): Record<string, unknown> {
  return { ["tag_name"]: `v${version}`, ["published_at"]: date, prerelease };
}

// Answers like GitHub's API, from the fictitious data.
function actionFetch(action: ActionSources): Fetch {
  return (url) => {
    const tag = url.match(tagUrl)?.groups?.["tag"];
    const object = url.match(tagObjectUrl)?.groups?.["sha"];
    if (url === releasesUrl) {
      return Promise.resolve(json(action.releases.map(asGitHub)));
    }
    if (tag !== undefined) {
      const found = action.tags[tag];
      return Promise.resolve(
        found === undefined ? notFound() : json({ object: found }),
      );
    }
    if (object !== undefined) {
      const commit = action.tagObjects[object];
      return Promise.resolve(
        commit === undefined
          ? notFound()
          : json({ object: { type: "commit", sha: commit } }),
      );
    }
    return Promise.reject(new Error(`unexpected request: ${url}`));
  };
}

describe("checkActions", () => {
  it("reports nothing when every action is current", async () => {
    expect(
      await checkActions(
        [workflow],
        releaseAge,
        actionFetch(currentAction),
        now,
      ),
    ).toEqual([]);
  });

  it("reports a newer release past the release age, with its commit", async () => {
    const action: ActionSources = {
      ...currentAction,
      releases: [
        { version: "4.0.0", date: "2030-06-01T00:00:00Z", prerelease: false },
        {
          version: "4.1.0-beta",
          date: "2030-06-02T00:00:00Z",
          prerelease: true,
        },
        { version: "3.2.0", date: "2030-06-27T00:00:00Z", prerelease: false },
        ...currentAction.releases,
      ],
      tags: {
        ...currentAction.tags,
        "v4.0.0": { type: "commit", sha: newCommit },
      },
    };

    expect(
      await checkActions([workflow], releaseAge, actionFetch(action), now),
    ).toEqual([
      `fictional/fetch  3.1.0 → 4.0.0  uses: fictional/fetch@${newCommit} # v4.0.0`,
    ]);
  });

  it("follows an annotated tag to its commit", async () => {
    const action: ActionSources = {
      ...currentAction,
      releases: [
        { version: "3.2.0", date: "2030-06-01T00:00:00Z", prerelease: false },
        ...currentAction.releases,
      ],
      tags: {
        ...currentAction.tags,
        "v3.2.0": { type: "tag", sha: tagObject },
      },
      tagObjects: { [tagObject]: newCommit },
    };

    expect(
      await checkActions([workflow], releaseAge, actionFetch(action), now),
    ).toEqual([
      `fictional/fetch  3.1.0 → 3.2.0  uses: fictional/fetch@${newCommit} # v3.2.0`,
    ]);
  });

  it("reports a release tag moved to another commit", async () => {
    const action: ActionSources = {
      ...currentAction,
      tags: { "v3.1.0": { type: "commit", sha: newCommit } },
    };

    expect(
      await checkActions([workflow], releaseAge, actionFetch(action), now),
    ).toEqual([
      `fictional/fetch  3.1.0 moved  uses: fictional/fetch@${newCommit} # v3.1.0`,
    ]);
  });

  it("checks an action used twice only once", async () => {
    expect(
      await checkActions(
        [workflow, workflow],
        releaseAge,
        actionFetch(currentAction),
        now,
      ),
    ).toEqual([]);
  });

  it("fails on an action not pinned by commit and release", async () => {
    const loose = "    steps:\n      - uses: fictional/fetch@v3\n";

    await expect(
      checkActions([loose], releaseAge, actionFetch(currentAction), now),
    ).rejects.toThrow("fictional/fetch@v3");
  });
});
