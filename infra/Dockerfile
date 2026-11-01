# The repository's image (decision 0007): Node and pnpm, each pinned by tag and digest (decision 0008).
# Further stages are added by the roadmap items that need them.

# pnpm's official image, only as the source of its standalone binary.
FROM ghcr.io/pnpm/pnpm:12.15.0@sha256:d6148daf3ad2af8fa4ecd1aa06db73da32b2e37f63088987eea2fb375ee7f320 AS pnpm

# Node and pnpm: every other stage starts here.
FROM node:26.12.1-trixie-slim@sha256:94816674c62774da0d099a947bf4613b9e1972a2733abd0d0cd80e795f8411d0 AS base
# Marks every image of the project, so make clean finds them all, tagged or not (decision 0022).
LABEL org.opencontainers.image.source="https://github.com/fgarend/aurum-ds"
COPY --from=pnpm /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
WORKDIR /app

# The dependencies, exactly as the lockfile lists them (decision 0014).
# pnpm's store is a build cache, so a change to the lockfile downloads only what is new.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=aurum-ds-pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store

# The repository, checked by make test.
FROM deps AS test
COPY . .

# The browsers for the browser tests (decision 0032): Playwright's official image, pinned by tag and digest, whose
# version moves with the playwright package. The dependencies are installed again, for its system.
FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:2f05f8a734509a7b3f26a912639488ee08f58a7b292d14d62271bcff9038768f AS browser
LABEL org.opencontainers.image.source="https://github.com/fgarend/aurum-ds"
COPY --from=pnpm /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=aurum-ds-pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store
COPY . .
