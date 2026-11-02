// The images pinned in infra/settings.env (decisions 0018 and 0043): a newer version past pnpm's release age, or the same
// version rebuilt, with the line to copy.
import {
  type Candidate,
  type Fetch,
  getJson,
  httpNotFound,
  isRecord,
  newerPastAge,
  stableVersion,
  unexpected,
} from "./shared.ts";

interface Pin {
  variable: string;
  image: string;
  prefix: string;
  version: string;
  suffix: string;
  digest: string;
}

// Every variable that names an image, such as PNPM_IMAGE=ghcr.io/pnpm/pnpm:12.15.0@sha256:….
const imageVariable = /^(?<variable>[A-Z][A-Z0-9_]*_IMAGE)=(?<value>.*)$/gmu;
// An image pinned by tag and digest, whatever its tag looks like.
const pinned =
  /^(?<image>[^\s:@]+):(?<tag>[^\s@]+)@(?<digest>sha256:[0-9a-f]{64})$/u;
// A version tag, such as v1.64.1-noble for Playwright, or 12.15.0 for pnpm.
const versionTag = /^(?<prefix>v?)(?<version>\d+\.\d+\.\d+)(?<suffix>.*)$/u;

function readPins(settings: string): Pin[] {
  return [...settings.matchAll(imageVariable)].map((match) => {
    const { variable = "", value = "" } = match.groups ?? {};
    const pin = value.match(pinned)?.groups;
    if (pin === undefined) {
      throw new Error(`${variable}: not pinned by tag and digest`);
    }
    const { image = "", tag = "", digest = "" } = pin;
    const {
      prefix = "",
      version = "",
      suffix = "",
    } = tag.match(versionTag)?.groups ?? {};
    return { variable, image, prefix, version, suffix, digest };
  });
}

// Playwright and pnpm: any line of their npm package, stable versions only.
function npmCandidates(name: string): (fetchFn: Fetch) => Promise<Candidate[]> {
  return (fetchFn) => npmVersions(fetchFn, name);
}

async function npmVersions(fetchFn: Fetch, name: string): Promise<Candidate[]> {
  const url = `https://registry.npmjs.org/${name}`;
  const document = await getJson(fetchFn, url);
  if (!(isRecord(document) && isRecord(document["time"]))) {
    throw unexpected(url);
  }
  return Object.entries(document["time"]).flatMap(([version, date]) =>
    stableVersion.test(version) && typeof date === "string"
      ? [{ version, releasedAt: new Date(date) }]
      : [],
  );
}

// The digest of a pnpm image tag on GHCR, which asks for an anonymous token first.
async function pnpmDigest(
  fetchFn: Fetch,
  tag: string,
): Promise<string | undefined> {
  const tokenUrl = "https://ghcr.io/token?scope=repository:pnpm/pnpm:pull";
  const token = await getJson(fetchFn, tokenUrl);
  if (!(isRecord(token) && typeof token["token"] === "string")) {
    throw unexpected(tokenUrl);
  }
  return manifestDigest(
    fetchFn,
    `https://ghcr.io/v2/pnpm/pnpm/manifests/${tag}`,
    { authorization: `Bearer ${token["token"]}` },
  );
}

// The digest of a Playwright image tag on Microsoft's registry, which needs no token.
function playwrightDigest(
  fetchFn: Fetch,
  tag: string,
): Promise<string | undefined> {
  return manifestDigest(
    fetchFn,
    `https://mcr.microsoft.com/v2/playwright/manifests/${tag}`,
    {},
  );
}

// A registry's digest for a tag, read from the headers of its manifest, or undefined when the tag does not exist.
async function manifestDigest(
  fetchFn: Fetch,
  url: string,
  headers: Record<string, string>,
): Promise<string | undefined> {
  const response = await fetchFn(url, {
    method: "HEAD",
    headers: {
      ...headers,
      accept:
        "application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json",
    },
  });
  if (response.status === httpNotFound) {
    return undefined;
  }
  const digest = response.headers.get("docker-content-digest");
  if (!response.ok || digest === null) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }
  return digest;
}

interface Source {
  candidates: (fetchFn: Fetch, pin: Pin) => Promise<Candidate[]>;
  digest: (fetchFn: Fetch, tag: string) => Promise<string | undefined>;
  name: string;
}

const sources: Record<string, Source> = {
  "mcr.microsoft.com/playwright": {
    candidates: npmCandidates("playwright"),
    digest: playwrightDigest,
    name: "playwright",
  },
  "ghcr.io/pnpm/pnpm": {
    candidates: npmCandidates("pnpm"),
    digest: pnpmDigest,
    name: "pnpm",
  },
};

async function checkPin(
  fetchFn: Fetch,
  pin: Pin,
  releaseAgeMinutes: number,
  now: Date,
): Promise<string | undefined> {
  const source = sources[pin.image];
  if (source === undefined || pin.version === "") {
    throw new Error(`${pin.image}: no source to check this image against`);
  }
  const newer = newerPastAge(
    await source.candidates(fetchFn, pin),
    pin.version,
    releaseAgeMinutes,
    now,
  );
  // The newest version whose image exists. Requests stay in order, so the newest is asked first.
  for (const { version } of newer) {
    const tag = `${pin.prefix}${version}${pin.suffix}`;
    // biome-ignore lint/performance/noAwaitInLoops: each request depends on the previous one finding no image.
    const digest = await source.digest(fetchFn, tag);
    if (digest !== undefined) {
      return `${source.name}  ${pin.version} → ${version}  ${pin.variable}=${pin.image}:${tag}@${digest}`;
    }
  }
  const tag = `${pin.prefix}${pin.version}${pin.suffix}`;
  const digest = await source.digest(fetchFn, tag);
  if (digest !== undefined && digest !== pin.digest) {
    return `${source.name}  ${pin.version} rebuilt  ${pin.variable}=${pin.image}:${tag}@${digest}`;
  }
  return undefined;
}

async function checkImages(
  settings: string,
  releaseAgeMinutes: number,
  fetchFn: Fetch,
  now: Date,
): Promise<string[]> {
  const lines = await Promise.all(
    readPins(settings).map((pin) =>
      checkPin(fetchFn, pin, releaseAgeMinutes, now),
    ),
  );
  return lines.filter((line) => line !== undefined);
}

export { checkImages };
