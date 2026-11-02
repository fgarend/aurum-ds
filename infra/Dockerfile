# The repository's environment (decision 0043): one image in layers, the same on every machine. The images it starts
# from are pinned by tag and digest in infra/settings.env, which Compose passes in. The code is never copied in: each
# command mounts it.
ARG NODE_IMAGE
ARG PNPM_IMAGE

# pnpm's official image, only as the source of its standalone binary.
FROM ${PNPM_IMAGE} AS pnpm

# Node and pnpm: every other layer starts here.
FROM ${NODE_IMAGE} AS base
COPY --from=pnpm /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
WORKDIR /app

# The dependencies, exactly as the lockfile lists them (decision 0014).
# pnpm's store is a build cache, so a change to the lockfile downloads only what is new.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=aurum-ds-pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store

# The browser for the browser tests (decision 0032), at the version of the playwright package. The system packages it
# needs come from Debian as it was on the date the Node image was built, which the image notes beside each source, so
# building again gives the same packages.
FROM deps AS browser
RUN sources=/etc/apt/sources.list.d/debian.sources \
    && grep -q '^# http://snapshot.debian.org/' "$sources" \
        || { echo "The Node image no longer notes its Debian snapshot in $sources" >&2; exit 1; } \
    && sed -i -e '/^URIs:/d' -e 's|^# \(http://snapshot.debian.org/.*\)|URIs: \1|' "$sources" \
    && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/snapshot \
    && pnpm exec playwright install --with-deps --only-shell chromium \
    && rm -rf /var/lib/apt/lists/*
