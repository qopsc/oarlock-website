# Build context is the repo root:
#   docker build -f deploy/Dockerfile -t oarlock-website .
# Images are pinned tag@digest (Renovate keeps both current; digests resolved 2026-10-27).

# Astro's CLI runs on Node; bun only installs dependencies and runs scripts.
# `bun run build` = astro check, astro build, scripts/csp.mjs (final CSP hashes). The roadmap page fetches
# ROADMAP.md from qopsc/oarlock@main and falls back to the committed snapshot; the build log says which.
FROM node:24.21.0-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build
COPY --from=oven/bun:1.4.4-alpine@sha256:4cf82f5686b196504fe119db3fcd9185b191f82ece82c40680e597228ec6070a /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Served behind NGINX Gateway Fabric in qopsc/stacks, which terminates TLS.
FROM nginxinc/nginx-unprivileged:1.30.5-alpine@sha256:56b8272e43a0525f67aed68d1e0794a712d10e3e45a563e118e9a77c817e6f86
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY deploy/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
