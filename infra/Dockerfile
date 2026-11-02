# The repository's environment (decisions 0043 and 0047): one image in layers, the same on every machine. It starts
# from Playwright's image, which brings Node and the browsers, frozen by its digest, so nothing is installed from the
# system's sources at build time. The images are pinned by tag and digest in infra/settings.env, which Compose passes
# in. The code is never copied in: each command mounts it.
ARG PLAYWRIGHT_IMAGE
ARG PNPM_IMAGE

# pnpm's official image, only as the source of its standalone binary.
FROM ${PNPM_IMAGE} AS pnpm

# Node, the browsers and pnpm: every other layer starts here.
FROM ${PLAYWRIGHT_IMAGE} AS base
COPY --from=pnpm /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
WORKDIR /app

# The dependencies, exactly as the lockfile lists them (decision 0014).
# pnpm's store is a build cache, so a change to the lockfile downloads only what is new.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=aurum-ds-pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store
