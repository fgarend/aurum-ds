# The repository's image (decision 0007): Node and pnpm, each pinned by tag and digest (decision 0008).
# Further stages are added by the roadmap items that need them.

# pnpm's official image, only as the source of its standalone binary.
FROM ghcr.io/pnpm/pnpm:12.15.0@sha256:d6148daf3ad2af8fa4ecd1aa06db73da32b2e37f63088987eea2fb375ee7f320 AS pnpm

# Node and pnpm: every other stage starts here.
FROM node:26.12.1-trixie-slim@sha256:94816674c62774da0d099a947bf4613b9e1972a2733abd0d0cd80e795f8411d0 AS base
COPY --from=pnpm /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
WORKDIR /app
