#!/usr/bin/env bash
# Smoke-tests the production image against deploy/HEADERS.md. Usage: tests/image.sh [image]
# (default: builds oarlock-website:test). Exit code = number of failing checks.
set -euo pipefail
cd "$(dirname "$0")/.."
image=${1:-}
if [[ -z $image ]]; then
  image=oarlock-website:test
  docker build -q -f deploy/Dockerfile -t "$image" . >/dev/null
fi
name=oarlock-image-test base=http://127.0.0.1:18082
docker rm -f "$name" >/dev/null 2>&1 || true
docker run -d --name "$name" -p 18082:8080 "$image" >/dev/null
trap 'docker rm -f "$name" >/dev/null' EXIT
for _ in $(seq 40); do curl -s -o /dev/null "$base/" && break; sleep 0.5; done

fails=0
status() { curl -s -o /dev/null -w '%{http_code}' "$base$1"; }
header() { curl -s -D - -o /dev/null "$base$1" | tr -d '\r' | grep -i "^$2:" | cut -d' ' -f2-; }
expect() { if [[ $2 == "$3" ]]; then echo "ok   $1"; else echo "FAIL $1: got '$2' want '$3'"; fails=$((fails + 1)); fi; }
headers_on() { # headers_on PATH: the six headers from deploy/HEADERS.md
  expect "$1 HSTS" "$(header "$1" strict-transport-security)" "max-age=31536000; includeSubDomains"
  expect "$1 CSP" "$(header "$1" content-security-policy)" "frame-ancestors 'none'"
  expect "$1 nosniff" "$(header "$1" x-content-type-options)" nosniff
  expect "$1 referrer" "$(header "$1" referrer-policy)" strict-origin-when-cross-origin
  expect "$1 permissions" "$(header "$1" permissions-policy)" "camera=(), microphone=(), geolocation=()"
  expect "$1 COOP" "$(header "$1" cross-origin-opener-policy)" same-origin
}

asset=/$(docker exec "$name" sh -c 'cd /usr/share/nginx/html && find _astro -type f | head -1' 2>/dev/null || true)
expect "/ status" "$(status /)" 200
headers_on /
expect "/ cache" "$(header / cache-control)" no-cache
expect "/docs/ status" "$(status /docs/)" 200
expect "/docs/ cache" "$(header /docs/ cache-control)" no-cache
expect "/docs redirect" "$(status /docs) $(header /docs location)" "301 /docs/"
expect "asset status" "$(status "$asset")" 200
expect "asset cache" "$(header "$asset" cache-control)" "public, max-age=31536000, immutable"
expect "asset HSTS kept" "$(header "$asset" strict-transport-security)" "max-age=31536000; includeSubDomains"
expect "/install status" "$(status /install)" 200
expect "/install type" "$(header /install content-type)" "text/plain; charset=utf-8"
expect "/install cache" "$(header /install cache-control)" no-cache
expect "/install no redirect" "$(curl -s -o /dev/null -w '%{redirect_url}' "$base/install")" ""
expect "/install body" "$(curl -s "$base/install" | shasum)" "$(shasum < public/install)"
headers_on /install
expect "/missing status" "$(status /missing)" 404
expect "/missing body" "$(curl -s "$base/missing" | shasum)" "$(curl -s "$base/404.html" | shasum)"
# Cluster pods are dual-stack; the stacks Service reaches them over IPv6 too.
expect "IPv6 listener" "$(docker exec "$name" wget -q -O /dev/null 'http://[::1]:8080/' >/dev/null 2>&1 && echo up || echo down)" up
exit "$fails"
