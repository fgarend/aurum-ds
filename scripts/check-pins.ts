// Reports the images pinned by hand in infra/settings.env that have something to look at (decisions 0018, 0043 and
// 0044): a newer version past pnpm's release age, or the same version rebuilt. Run by make outdated-pins.
import { readFile } from "node:fs/promises";

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

interface Pin {
  variable: string;
  image: string;
  prefix: string;
  version: string;
  suffix: string;
  digest: string;
}

interface Candidate {
  version: string;
  releasedAt: Date;
}

const msPerMinute = 60_000;
// pnpm's setting, in minutes (decision 0009), the one source of the release age.
const releaseAgeSetting = /^minimumReleaseAge:\s*(?<minutes>\d+)\s*$/mu;
const httpNotFound = 404;

// Every variable that names an image, such as NODE_IMAGE=node:26.12.1-trixie-slim@sha256:….
const imageVariable = /^(?<variable>[A-Z][A-Z0-9_]*_IMAGE)=(?<value>.*)$/gmu;
// An image pinned by tag and digest, whatever its tag looks like.
const pinned =
  /^(?<image>[^\s:@]+):(?<tag>[^\s@]+)@(?<digest>sha256:[0-9a-f]{64})$/u;
// A version tag, such as 26.12.1-trixie-slim, or 12.15.0 for pnpm.
const versionTag = /^(?<prefix>v?)(?<version>\d+\.\d+\.\d+)(?<suffix>.*)$/u;
const stableVersion = /^\d+\.\d+\.\d+$/u;
const leadingV = /^v/u;

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

function parts(version: string): number[] {
  return version.split(".").map(Number);
}

function compareVersions(a: string, b: string): number {
  const [left, right] = [parts(a), parts(b)];
  for (const [index, value] of left.entries()) {
    const difference = value - (right[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}

async function getJson(
  fetchFn: Fetch,
  url: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetchFn(url, init);
  if (!response.ok) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }
  return response.json();
}

function unexpected(url: string): Error {
  return new Error(`${url}: unexpected answer`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Node: the pinned line, or a newer line once it is LTS (decision 0007).
async function nodeCandidates(fetchFn: Fetch, pin: Pin): Promise<Candidate[]> {
  const url = "https://nodejs.org/dist/index.json";
  const releases = await getJson(fetchFn, url);
  if (!Array.isArray(releases)) {
    throw unexpected(url);
  }
  const [major] = parts(pin.version);
  return releases.flatMap((release: unknown) => {
    if (
      !(
        isRecord(release) &&
        typeof release["version"] === "string" &&
        typeof release["date"] === "string"
      )
    ) {
      throw unexpected(url);
    }
    const version = release["version"].replace(leadingV, "");
    const [releaseMajor] = parts(version);
    const sameLine = releaseMajor === major;
    const newerLts =
      (releaseMajor ?? 0) > (major ?? 0) && release["lts"] !== false;
    if (!(stableVersion.test(version) && (sameLine || newerLts))) {
      return [];
    }
    return [{ version, releasedAt: new Date(`${release["date"]}T00:00:00Z`) }];
  });
}

// pnpm: any line of its npm package, stable versions only.
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

// The digest of a Node image tag on Docker Hub, or undefined when the tag does not exist.
async function nodeDigest(
  fetchFn: Fetch,
  tag: string,
): Promise<string | undefined> {
  const url = `https://hub.docker.com/v2/repositories/library/node/tags/${tag}`;
  const response = await fetchFn(url);
  if (response.status === httpNotFound) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }
  const document: unknown = await response.json();
  if (!(isRecord(document) && typeof document["digest"] === "string")) {
    throw unexpected(url);
  }
  return document["digest"];
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
  node: { candidates: nodeCandidates, digest: nodeDigest, name: "node" },
  "ghcr.io/pnpm/pnpm": {
    candidates: npmCandidates("pnpm"),
    digest: pnpmDigest,
    name: "pnpm",
  },
};

// The release age pnpm-workspace.yaml sets, in minutes.
function readReleaseAge(workspace: string): number {
  const minutes = workspace.match(releaseAgeSetting)?.groups?.["minutes"];
  if (minutes === undefined) {
    throw new Error("pnpm-workspace.yaml sets no minimumReleaseAge");
  }
  return Number(minutes);
}

async function checkPin(
  fetchFn: Fetch,
  pin: Pin,
  releaseAgeMs: number,
  now: Date,
): Promise<string | undefined> {
  const source = sources[pin.image];
  if (source === undefined || pin.version === "") {
    throw new Error(`${pin.image}: no source to check this image against`);
  }
  const newer = (await source.candidates(fetchFn, pin))
    .filter(({ version, releasedAt }) => {
      const oldEnough = now.getTime() - releasedAt.getTime() >= releaseAgeMs;
      return oldEnough && compareVersions(version, pin.version) > 0;
    })
    .toSorted((a, b) => compareVersions(b.version, a.version));
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

async function checkPins(
  settings: string,
  releaseAgeMinutes: number,
  fetchFn: Fetch,
  now: Date,
): Promise<string[]> {
  const releaseAgeMs = releaseAgeMinutes * msPerMinute;
  const lines = await Promise.all(
    readPins(settings).map((pin) => checkPin(fetchFn, pin, releaseAgeMs, now)),
  );
  return lines.filter((line) => line !== undefined);
}

async function main(): Promise<void> {
  const settings = await readFile(
    new URL("../infra/settings.env", import.meta.url),
    "utf8",
  );
  const workspace = await readFile(
    new URL("../pnpm-workspace.yaml", import.meta.url),
    "utf8",
  );
  const lines = await checkPins(
    settings,
    readReleaseAge(workspace),
    fetch,
    new Date(),
  );
  for (const line of lines) {
    console.log(line);
  }
  process.exitCode = lines.length > 0 ? 1 : 0;
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

export { checkPins, type Fetch, readReleaseAge };
