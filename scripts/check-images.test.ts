import { describe, expect, it } from "vitest";
import { checkImages, type Fetch } from "./check-images.js";

// Fictitious versions, dates and digests: no real release is described here.
const digestLength = 64;
const pnpmDigest = `sha256:${"a".repeat(digestLength)}`;
const nodeDigest = `sha256:${"b".repeat(digestLength)}`;
const playwrightDigest = `sha256:${"d".repeat(digestLength)}`;
const newDigest = `sha256:${"c".repeat(digestLength)}`;

const dockerfile = `# A comment
FROM ghcr.io/pnpm/pnpm:5.1.0@${pnpmDigest} AS pnpm
FROM node:40.2.0-trixie-slim@${nodeDigest} AS base
FROM mcr.microsoft.com/playwright:v7.2.0-noble@${playwrightDigest} AS browser
`;

// Eight days after the newest release below that should be reported.
const now = new Date("2030-06-30T12:00:00Z");

interface NodeRelease {
  version: string;
  date: string;
  lts: string | false;
}

interface Sources {
  node: NodeRelease[];
  nodeTags: Record<string, string>;
  pnpm: Record<string, string>;
  pnpmTags: Record<string, string>;
  playwright: Record<string, string>;
  playwrightTags: Record<string, string>;
}

const upToDate: Sources = {
  node: [{ version: "v40.2.0", date: "2030-05-01", lts: "Fictional" }],
  nodeTags: { "40.2.0-trixie-slim": nodeDigest },
  pnpm: { "5.1.0": "2030-05-01T00:00:00Z" },
  pnpmTags: { "5.1.0": pnpmDigest },
  playwright: { "7.2.0": "2030-05-01T00:00:00Z" },
  playwrightTags: { "v7.2.0-noble": playwrightDigest },
};

const nodeTagUrl =
  /^https:\/\/hub\.docker\.com\/v2\/repositories\/library\/node\/tags\/(?<tag>.+)$/u;
const pnpmTagUrl =
  /^https:\/\/ghcr\.io\/v2\/pnpm\/pnpm\/manifests\/(?<tag>.+)$/u;
const playwrightTagUrl =
  /^https:\/\/mcr\.microsoft\.com\/v2\/playwright\/manifests\/(?<tag>.+)$/u;

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200 });
}

function notFound(): Response {
  return new Response("", { status: 404 });
}

function digestResponse(
  digest: string | undefined,
  asHeader: boolean,
): Response {
  if (digest === undefined) {
    return notFound();
  }
  if (asHeader) {
    return new Response(null, {
      status: 200,
      headers: { "docker-content-digest": digest },
    });
  }
  return json({ digest });
}

// Answers like each official source, from the fictitious data.
function fakeFetch(sources: Sources): Fetch {
  const fixed: Record<string, unknown> = {
    "https://nodejs.org/dist/index.json": sources.node,
    "https://registry.npmjs.org/pnpm": {
      time: { created: "2030-01-01T00:00:00Z", ...sources.pnpm },
    },
    "https://ghcr.io/token?scope=repository:pnpm/pnpm:pull": {
      token: "fictitious",
    },
    "https://registry.npmjs.org/playwright": {
      time: { created: "2030-01-01T00:00:00Z", ...sources.playwright },
    },
  };
  return (url) => {
    const nodeTag = url.match(nodeTagUrl)?.groups?.["tag"];
    const pnpmTag = url.match(pnpmTagUrl)?.groups?.["tag"];
    const playwrightTag = url.match(playwrightTagUrl)?.groups?.["tag"];
    if (url in fixed) {
      return Promise.resolve(json(fixed[url]));
    }
    if (nodeTag !== undefined) {
      return Promise.resolve(digestResponse(sources.nodeTags[nodeTag], false));
    }
    if (pnpmTag !== undefined) {
      return Promise.resolve(digestResponse(sources.pnpmTags[pnpmTag], true));
    }
    if (playwrightTag !== undefined) {
      return Promise.resolve(
        digestResponse(sources.playwrightTags[playwrightTag], true),
      );
    }
    return Promise.reject(new Error(`unexpected request: ${url}`));
  };
}

describe("checkImages", () => {
  it("reports nothing when every image is current", async () => {
    expect(await checkImages(dockerfile, fakeFetch(upToDate), now)).toEqual([]);
  });

  it("reports a newer Node on the same line, past the release age, with its digest", async () => {
    const sources: Sources = {
      ...upToDate,
      node: [
        { version: "v40.3.0", date: "2030-06-22", lts: "Fictional" },
        ...upToDate.node,
      ],
      nodeTags: { ...upToDate.nodeTags, "40.3.0-trixie-slim": newDigest },
    };

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([
      `node  40.2.0 → 40.3.0  node:40.3.0-trixie-slim@${newDigest}`,
    ]);
  });

  it("leaves out a version younger than the release age", async () => {
    const sources: Sources = {
      ...upToDate,
      node: [
        { version: "v40.3.0", date: "2030-06-25", lts: "Fictional" },
        ...upToDate.node,
      ],
      nodeTags: { ...upToDate.nodeTags, "40.3.0-trixie-slim": newDigest },
    };

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([]);
  });

  it("leaves out a version with no image yet, and reports the newest one that has it", async () => {
    const sources: Sources = {
      ...upToDate,
      node: [
        { version: "v40.4.0", date: "2030-06-21", lts: "Fictional" },
        { version: "v40.3.0", date: "2030-06-20", lts: "Fictional" },
        ...upToDate.node,
      ],
      nodeTags: { ...upToDate.nodeTags, "40.3.0-trixie-slim": newDigest },
    };

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([
      `node  40.2.0 → 40.3.0  node:40.3.0-trixie-slim@${newDigest}`,
    ]);
  });

  it("leaves out a newer Node line that is not LTS", async () => {
    const sources: Sources = {
      ...upToDate,
      node: [
        { version: "v41.0.0", date: "2030-06-01", lts: false },
        ...upToDate.node,
      ],
      nodeTags: { ...upToDate.nodeTags, "41.0.0-trixie-slim": newDigest },
    };

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([]);
  });

  it("reports a newer Node line once it is LTS", async () => {
    const sources: Sources = {
      ...upToDate,
      node: [
        { version: "v42.0.0", date: "2030-06-01", lts: "Imaginary" },
        ...upToDate.node,
      ],
      nodeTags: { ...upToDate.nodeTags, "42.0.0-trixie-slim": newDigest },
    };

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([
      `node  40.2.0 → 42.0.0  node:42.0.0-trixie-slim@${newDigest}`,
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

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([
      `pnpm  5.1.0 → 6.0.0  ghcr.io/pnpm/pnpm:6.0.0@${newDigest}`,
    ]);
  });

  it("reports a newer Playwright image, whose tag starts with v, past the release age", async () => {
    const sources: Sources = {
      ...upToDate,
      playwright: { ...upToDate.playwright, "7.3.0": "2030-06-01T00:00:00Z" },
      playwrightTags: { ...upToDate.playwrightTags, "v7.3.0-noble": newDigest },
    };

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([
      `playwright  7.2.0 → 7.3.0  mcr.microsoft.com/playwright:v7.3.0-noble@${newDigest}`,
    ]);
  });

  it("reports a Playwright image rebuilt under the same version", async () => {
    const sources: Sources = {
      ...upToDate,
      playwrightTags: { "v7.2.0-noble": newDigest },
    };

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([
      `playwright  7.2.0 rebuilt  mcr.microsoft.com/playwright:v7.2.0-noble@${newDigest}`,
    ]);
  });

  it("reports an image rebuilt under the same version", async () => {
    const sources: Sources = {
      ...upToDate,
      nodeTags: { "40.2.0-trixie-slim": newDigest },
    };

    expect(await checkImages(dockerfile, fakeFetch(sources), now)).toEqual([
      `node  40.2.0 rebuilt  node:40.2.0-trixie-slim@${newDigest}`,
    ]);
  });

  it("fails on a source that does not answer", async () => {
    const failing: Fetch = (url) =>
      url === "https://nodejs.org/dist/index.json"
        ? Promise.resolve(new Response("", { status: 503 }))
        : fakeFetch(upToDate)(url);

    await expect(checkImages(dockerfile, failing, now)).rejects.toThrow(
      "https://nodejs.org/dist/index.json: HTTP 503",
    );
  });

  it("fails on an answer in an unexpected shape", async () => {
    const odd: Fetch = (url) =>
      url === "https://registry.npmjs.org/pnpm"
        ? Promise.resolve(json({ versions: [] }))
        : fakeFetch(upToDate)(url);

    await expect(checkImages(dockerfile, odd, now)).rejects.toThrow(
      "https://registry.npmjs.org/pnpm",
    );
  });

  it("fails on an image it does not know how to check", async () => {
    const unknown = `FROM debian:13.0@${nodeDigest}\n`;

    await expect(
      checkImages(unknown, fakeFetch(upToDate), now),
    ).rejects.toThrow("debian");
  });
});
