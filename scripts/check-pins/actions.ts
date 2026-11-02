// The actions the workflows use (decision 0046): a newer release past pnpm's release age, or the release tag moved to
// another commit, with the line to copy.
import {
  type Candidate,
  type Fetch,
  getJson,
  httpNotFound,
  isRecord,
  leadingV,
  newerPastAge,
  stableVersion,
  unexpected,
} from "./shared.ts";

// Every action a workflow uses, which must be pinned by commit with its release tag beside it.
const usesLine = /^\s*-?\s*uses:\s*(?<value>\S+)(?<comment>.*)$/gmu;
const pinnedAction =
  /^(?<repository>[\w.-]+\/[\w.-]+)@(?<commit>[0-9a-f]{40})$/u;
const releaseComment = /^\s+#\s+v(?<version>\d+\.\d+\.\d+)\s*$/u;

interface Action {
  repository: string;
  commit: string;
  version: string;
}

// The actions the workflows use, each once.
function readActions(workflows: string[]): Action[] {
  const actions = new Map<string, Action>();
  for (const workflow of workflows) {
    for (const match of workflow.matchAll(usesLine)) {
      const { value = "", comment = "" } = match.groups ?? {};
      const pin = value.match(pinnedAction)?.groups;
      const version = comment.match(releaseComment)?.groups?.["version"];
      if (pin === undefined || version === undefined) {
        throw new Error(`${value}: not pinned by commit, with its release`);
      }
      const { repository = "", commit = "" } = pin;
      actions.set(`${repository}@${commit}`, { repository, commit, version });
    }
  }
  return [...actions.values()];
}

// An action's stable releases, from GitHub's API.
async function actionReleases(
  fetchFn: Fetch,
  repository: string,
): Promise<Candidate[]> {
  const url = `https://api.github.com/repos/${repository}/releases?per_page=100`;
  const releases = await getJson(fetchFn, url);
  if (!Array.isArray(releases)) {
    throw unexpected(url);
  }
  return releases.flatMap((release: unknown) => {
    if (
      !(
        isRecord(release) &&
        typeof release["tag_name"] === "string" &&
        typeof release["published_at"] === "string"
      )
    ) {
      throw unexpected(url);
    }
    const version = release["tag_name"].replace(leadingV, "");
    return release["prerelease"] === true || !stableVersion.test(version)
      ? []
      : [{ version, releasedAt: new Date(release["published_at"]) }];
  });
}

// The commit a release tag points to, following an annotated tag, or undefined when the tag does not exist.
async function tagCommit(
  fetchFn: Fetch,
  repository: string,
  tag: string,
): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${repository}/git/ref/tags/${tag}`;
  const response = await fetchFn(url);
  if (response.status === httpNotFound) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }
  const ref: unknown = await response.json();
  const object = isRecord(ref) ? ref["object"] : undefined;
  if (!(isRecord(object) && typeof object["sha"] === "string")) {
    throw unexpected(url);
  }
  if (object["type"] !== "tag") {
    return object["sha"];
  }
  const tagUrl = `https://api.github.com/repos/${repository}/git/tags/${object["sha"]}`;
  const annotated = await getJson(fetchFn, tagUrl);
  const target = isRecord(annotated) ? annotated["object"] : undefined;
  if (!(isRecord(target) && typeof target["sha"] === "string")) {
    throw unexpected(tagUrl);
  }
  return target["sha"];
}

async function checkAction(
  fetchFn: Fetch,
  action: Action,
  releaseAgeMinutes: number,
  now: Date,
): Promise<string | undefined> {
  const { repository, version: pinned } = action;
  const newer = newerPastAge(
    await actionReleases(fetchFn, repository),
    pinned,
    releaseAgeMinutes,
    now,
  );
  for (const { version } of newer) {
    // biome-ignore lint/performance/noAwaitInLoops: each request depends on the previous one finding no tag.
    const commit = await tagCommit(fetchFn, repository, `v${version}`);
    if (commit !== undefined) {
      return `${repository}  ${pinned} → ${version}  uses: ${repository}@${commit} # v${version}`;
    }
  }
  const commit = await tagCommit(fetchFn, repository, `v${pinned}`);
  if (commit !== undefined && commit !== action.commit) {
    return `${repository}  ${pinned} moved  uses: ${repository}@${commit} # v${pinned}`;
  }
  return undefined;
}

async function checkActions(
  workflows: string[],
  releaseAgeMinutes: number,
  fetchFn: Fetch,
  now: Date,
): Promise<string[]> {
  const lines = await Promise.all(
    readActions(workflows).map((action) =>
      checkAction(fetchFn, action, releaseAgeMinutes, now),
    ),
  );
  return lines.filter((line) => line !== undefined);
}

export { checkActions };
