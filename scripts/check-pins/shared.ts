// What the reports of check-pins share (decision 0044): versions, answers from the sources, and pnpm's release age.

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

interface Candidate {
  version: string;
  releasedAt: Date;
}

const msPerMinute = 60_000;
const httpNotFound: number = 404;
// pnpm's setting, in minutes (decision 0009), the one source of the release age.
const releaseAgeSetting = /^minimumReleaseAge:\s*(?<minutes>\d+)\s*$/mu;
const stableVersion: RegExp = /^\d+\.\d+\.\d+$/u;
const leadingV: RegExp = /^v/u;

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

// The release age pnpm-workspace.yaml sets, in minutes.
function readReleaseAge(workspace: string): number {
  const minutes = workspace.match(releaseAgeSetting)?.groups?.["minutes"];
  if (minutes === undefined) {
    throw new Error("pnpm-workspace.yaml sets no minimumReleaseAge");
  }
  return Number(minutes);
}

// The candidates past the release age and newer than the pinned version, newest first.
function newerPastAge(
  candidates: Candidate[],
  pinned: string,
  releaseAgeMinutes: number,
  now: Date,
): Candidate[] {
  const releaseAgeMs = releaseAgeMinutes * msPerMinute;
  return candidates
    .filter(({ version, releasedAt }) => {
      const oldEnough = now.getTime() - releasedAt.getTime() >= releaseAgeMs;
      return oldEnough && compareVersions(version, pinned) > 0;
    })
    .toSorted((a, b) => compareVersions(b.version, a.version));
}

export {
  type Candidate,
  compareVersions,
  type Fetch,
  getJson,
  httpNotFound,
  isRecord,
  leadingV,
  newerPastAge,
  readReleaseAge,
  stableVersion,
  unexpected,
};
