import { describe, expect, it } from "vitest";
import { checkImages } from "./images.ts";
import type { Fetch } from "./shared.ts";

// Fictitious versions, dates and digests: no real release is described here.
const digestLength = 64;
const pnpmDigest = `sha256:${"a".repeat(digestLength)}`;
const playwrightDigest = `sha256:${"b".repeat(digestLength)}`;
const newDigest = `sha256:${"c".repeat(digestLength)}`;

const settings = `# A comment
PLAYWRIGHT_IMAGE=mcr.microsoft.com/playwright:v7.2.0-noble@${playwrightDigest}
PNPM_IMAGE=ghcr.io/pnpm/pnpm:5.1.0@${pnpmDigest}
PROTOTYPE_PORT=5173
`;

// Eight days after the newest release below that should be reported.
const now = new Date("2030-06-30T12:00:00Z");
// Seven days, in minutes, as pnpm counts it.
const releaseAge = 10_080;

interface Sources {
  // Each npm package's versions and release dates, and each image's tags and digests.
  playwright: Record<string, string>;
  playwrightTags: Record<string, string>;
  pnpm: Record<string, string>;
  pnpmTags: Record<string, string>;
}

const upToDate: Sources = {
  playwright: { "7.2.0": "2030-05-01T00:00:00Z" },
  playwrightTags: { "v7.2.0-noble": playwrightDigest },
  pnpm: { "5.1.0": "2030-05-01T00:00:00Z" },
  pnpmTags: { "5.1.0": pnpmDigest },
};

const playwrightTagUrl =
  /^https:\/\/mcr\.microsoft\.com\/v2\/playwright\/manifests\/(?<tag>.+)$/u;
const pnpmTagUrl =
  /^https:\/\/ghcr\.io\/v2\/pnpm\/pnpm\/manifests\/(?<tag>.+)$/u;

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200 });
}

function digestResponse(digest: string | undefined): Response {
  if (digest === undefined) {
    return new Response("", { status: 404 });
  }
  return new Response(null, {
    status: 200,
    headers: { "docker-content-digest": digest },
  });
}

// Answers like each official source, from the fictitious data.
function fakeFetch(sources: Sources): Fetch {
  const fixed: Record<string, unknown> = {
    "https://registry.npmjs.org/playwright": {
      time: { created: "2030-01-01T00:00:00Z", ...sources.playwright },
    },
    "https://registry.npmjs.org/pnpm": {
      time: { created: "2030-01-01T00:00:00Z", ...sources.pnpm },
    },
    "https://ghcr.io/token?scope=repository:pnpm/pnpm:pull": {
      token: "fictitious",
    },
  };
  return (url) => {
    const playwrightTag = url.match(playwrightTagUrl)?.groups?.["tag"];
    const pnpmTag = url.match(pnpmTagUrl)?.groups?.["tag"];
    if (url in fixed) {
      return Promise.resolve(json(fixed[url]));
    }
    if (playwrightTag !== undefined) {
      return Promise.resolve(
        digestResponse(sources.playwrightTags[playwrightTag]),
      );
    }
    if (pnpmTag !== undefined) {
      return Promise.resolve(digestResponse(sources.pnpmTags[pnpmTag]));
    }
    return Promise.reject(new Error(`unexpected request: ${url}`));
  };
}

function withPlaywright(
  versions: Record<string, string>,
  tags: Record<string, string>,
): Sources {
  return {
    ...upToDate,
    playwright: { ...upToDate.playwright, ...versions },
    playwrightTags: { ...upToDate.playwrightTags, ...tags },
  };
}

describe("checkImages", () => {
  it("reports nothing when every image is current", async () => {
    expect(
      await checkImages(settings, releaseAge, fakeFetch(upToDate), now),
    ).toEqual([]);
  });

  it("reports a newer Playwright image, whose tag starts with v, past the release age", async () => {
    const sources = withPlaywright(
      { "7.3.0": "2030-06-01T00:00:00Z" },
      { "v7.3.0-noble": newDigest },
    );

    expect(
      await checkImages(settings, releaseAge, fakeFetch(sources), now),
    ).toEqual([
      `playwright  7.2.0 → 7.3.0  PLAYWRIGHT_IMAGE=mcr.microsoft.com/playwright:v7.3.0-noble@${newDigest}`,
    ]);
  });

  it("leaves out a version younger than the release age", async () => {
    const sources = withPlaywright(
      { "7.3.0": "2030-06-25T00:00:00Z" },
      { "v7.3.0-noble": newDigest },
    );

    expect(
      await checkImages(settings, releaseAge, fakeFetch(sources), now),
    ).toEqual([]);
  });

  it("takes the release age it is given", async () => {
    const sources = withPlaywright(
      { "7.3.0": "2030-06-25T00:00:00Z" },
      { "v7.3.0-noble": newDigest },
    );
    const threeDays = 4320;

    expect(
      await checkImages(settings, threeDays, fakeFetch(sources), now),
    ).toEqual([
      `playwright  7.2.0 → 7.3.0  PLAYWRIGHT_IMAGE=mcr.microsoft.com/playwright:v7.3.0-noble@${newDigest}`,
    ]);
  });

  it("leaves out a version with no image yet, and reports the newest one that has it", async () => {
    const sources = withPlaywright(
      { "7.4.0": "2030-06-21T00:00:00Z", "7.3.0": "2030-06-20T00:00:00Z" },
      { "v7.3.0-noble": newDigest },
    );

    expect(
      await checkImages(settings, releaseAge, fakeFetch(sources), now),
    ).toEqual([
      `playwright  7.2.0 → 7.3.0  PLAYWRIGHT_IMAGE=mcr.microsoft.com/playwright:v7.3.0-noble@${newDigest}`,
    ]);
  });

  it("reports a newer pnpm on any line, leaving out prereleases", async () => {
    const sources: Sources = {
      ...upToDate,
      pnpm: {
        ...upToDate.pnpm,
        "6.0.0": "2030-06-01T00:00:00Z",
        "7.0.0-rc.1": "2030-06-02T00:00:00Z",
      },
      pnpmTags: {
        ...upToDate.pnpmTags,
        "6.0.0": newDigest,
        "7.0.0-rc.1": newDigest,
      },
    };

    expect(
      await checkImages(settings, releaseAge, fakeFetch(sources), now),
    ).toEqual([
      `pnpm  5.1.0 → 6.0.0  PNPM_IMAGE=ghcr.io/pnpm/pnpm:6.0.0@${newDigest}`,
    ]);
  });

  it("reports an image rebuilt under the same version", async () => {
    const sources: Sources = {
      ...upToDate,
      playwrightTags: { "v7.2.0-noble": newDigest },
    };

    expect(
      await checkImages(settings, releaseAge, fakeFetch(sources), now),
    ).toEqual([
      `playwright  7.2.0 rebuilt  PLAYWRIGHT_IMAGE=mcr.microsoft.com/playwright:v7.2.0-noble@${newDigest}`,
    ]);
  });

  it("fails on a source that does not answer", async () => {
    const failing: Fetch = (url) =>
      url === "https://registry.npmjs.org/playwright"
        ? Promise.resolve(new Response("", { status: 503 }))
        : fakeFetch(upToDate)(url);

    await expect(
      checkImages(settings, releaseAge, failing, now),
    ).rejects.toThrow("https://registry.npmjs.org/playwright: HTTP 503");
  });

  it("fails on an answer in an unexpected shape", async () => {
    const odd: Fetch = (url) =>
      url === "https://registry.npmjs.org/pnpm"
        ? Promise.resolve(json({ versions: [] }))
        : fakeFetch(upToDate)(url);

    await expect(checkImages(settings, releaseAge, odd, now)).rejects.toThrow(
      "https://registry.npmjs.org/pnpm",
    );
  });

  it("fails on an image it does not know how to check", async () => {
    const unknown = `OTHER_IMAGE=debian:13.0@${playwrightDigest}\n`;

    await expect(
      checkImages(unknown, releaseAge, fakeFetch(upToDate), now),
    ).rejects.toThrow("debian");
  });

  it("fails on an image not pinned by tag and digest", async () => {
    const unpinned =
      "PLAYWRIGHT_IMAGE=mcr.microsoft.com/playwright:v7.2.0-noble\n";

    await expect(
      checkImages(unpinned, releaseAge, fakeFetch(upToDate), now),
    ).rejects.toThrow("PLAYWRIGHT_IMAGE");
  });
});
