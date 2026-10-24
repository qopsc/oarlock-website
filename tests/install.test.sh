#!/usr/bin/env bash
# Tests for public/install. Runs against a fake release served from file:// in a
# throwaway $HOME, so nothing on the machine is touched. Works on macOS and Linux;
# the .dmg test runs only on macOS.
#
#   bash tests/install.test.sh
set -uo pipefail

script="$(cd "$(dirname "$0")/.." && pwd)/public/install"
work="$(mktemp -d "${TMPDIR:-/tmp}/oarlock-install-test.XXXXXX")"
trap 'rm -rf "$work"' EXIT
pass=0
fail=0

ok() {
  pass=$((pass + 1))
  printf '  ok    %s\n' "$1"
}
not_ok() {
  fail=$((fail + 1))
  printf '  FAIL  %s\n' "$1"
  [ -n "${2:-}" ] && printf '%s\n' "$2" | sed 's/^/        /'
}

# expect <name> <expected-exit> <pattern> -- <env/command...>
expect() {
  local name="$1" code="$2" pattern="$3"
  shift 4
  local out status
  out="$(env "$@" 2>&1)"
  status=$?
  if [ "$status" != "$code" ]; then
    not_ok "$name (exit $status, wanted $code)" "$out"
  elif ! printf '%s' "$out" | tr '\n' ' ' | grep -Eq -- "$pattern"; then
    not_ok "$name (output didn't match /$pattern/)" "$out"
  else
    ok "$name"
  fi
}

sha() { if command -v sha256sum >/dev/null; then sha256sum "$1"; else shasum -a 256 "$1"; fi | awk '{print $1}'; }

# A fake release directory with SHA256SUMS.
release="$work/release"
mkdir -p "$release"
printf '#!/bin/sh\necho fake oarlock\n' >"$release/oarlock-linux-x64.AppImage"
printf 'not really a deb' >"$release/oarlock-linux-arm64.deb"
(cd "$release" && for f in oarlock-*; do printf '%s  %s\n' "$(sha "$f")" "$f"; done >SHA256SUMS)

fresh_home() {
  local h="$work/home-$1"
  rm -rf "$h"
  mkdir -p "$h"
  echo "$h"
}

base=(PATH="$PATH" TMPDIR="$work")

echo "argument handling"
expect "--help prints usage" 0 "Usage: curl" -- "${base[@]}" HOME="$work" bash "$script" --help
expect "unknown option is rejected" 1 "unknown option: --nope" -- "${base[@]}" HOME="$work" bash "$script" --nope
expect "bad --format is rejected" 1 "--format must be deb, rpm, or appimage" -- "${base[@]}" HOME="$work" bash "$script" --format snap
expect "bad --version is rejected" 1 "--version must look like v1.2.3" -- "${base[@]}" HOME="$work" bash "$script" --version latest
expect "--version without value" 1 "--version needs a value" -- "${base[@]}" HOME="$work" bash "$script" --version

echo "detection (dry run)"
expect "macOS arm64 picks the arm64 dmg" 0 "asset=oarlock-macos-arm64.dmg" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Darwin OARLOCK_ARCH=arm64 bash "$script" --dry-run
expect "macOS x86_64 picks the x64 dmg" 0 "asset=oarlock-macos-x64.dmg" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Darwin OARLOCK_ARCH=x86_64 bash "$script" --dry-run
expect "Linux aarch64 deb" 0 "asset=oarlock-linux-arm64.deb" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Linux OARLOCK_ARCH=aarch64 bash "$script" --dry-run --format deb
expect "Linux amd64 rpm" 0 "asset=oarlock-linux-x64.rpm" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Linux OARLOCK_ARCH=amd64 bash "$script" --dry-run --format rpm
expect "Linux AppImage" 0 "asset=oarlock-linux-x64.AppImage" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Linux OARLOCK_ARCH=x86_64 bash "$script" --dry-run --format appimage
expect "pinned version uses its release URL" 0 "releases/download/v1.2.3/oarlock-macos-arm64.dmg" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Darwin OARLOCK_ARCH=arm64 bash "$script" --dry-run --version 1.2.3
expect "latest uses the latest URL" 0 "releases/latest/download/oarlock-macos-arm64.dmg" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Darwin OARLOCK_ARCH=arm64 bash "$script" --dry-run
expect "Windows says coming soon" 1 "Windows builds are coming soon" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=MINGW64_NT bash "$script" --dry-run
expect "unknown OS is rejected" 1 "unsupported OS: Plan9" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Plan9 bash "$script" --dry-run
expect "unknown arch is rejected" 1 "unsupported CPU architecture: riscv64" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Linux OARLOCK_ARCH=riscv64 bash "$script" --dry-run
expect "deb dry run uses apt-get" 0 "apt-get install -y" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Linux OARLOCK_ARCH=arm64 bash "$script" --dry-run --format deb
expect "--no-cli skips the link" 0 "Dry run complete" -- \
  "${base[@]}" HOME="$work" OARLOCK_OS=Darwin OARLOCK_ARCH=arm64 bash "$script" --dry-run --no-cli

echo "download and verify"
h="$(fresh_home appimage)"
expect "AppImage installs from a verified download" 0 "checksum verified.*Oarlock is installed" -- \
  "${base[@]}" HOME="$h" XDG_DATA_HOME="$h/.local/share" OARLOCK_OS=Linux OARLOCK_ARCH=x86_64 \
  OARLOCK_DOWNLOAD_BASE="file://$release" bash "$script" --format appimage
if [ -x "$h/.local/share/oarlock/Oarlock.AppImage" ] && grep -q "Exec=\"$h/.local/share/oarlock/Oarlock.AppImage\"" "$h/.local/share/applications/oarlock.desktop"; then
  ok "AppImage and desktop entry are in place"
else
  not_ok "AppImage and desktop entry are in place" "$(find "$h" -type f)"
fi
expect "re-running updates in place" 0 "Oarlock is installed" -- \
  "${base[@]}" HOME="$h" XDG_DATA_HOME="$h/.local/share" OARLOCK_OS=Linux OARLOCK_ARCH=x86_64 \
  OARLOCK_DOWNLOAD_BASE="file://$release" bash "$script" --format appimage
expect "uninstall removes the AppImage" 0 "Oarlock is uninstalled" -- \
  "${base[@]}" HOME="$h" XDG_DATA_HOME="$h/.local/share" OARLOCK_OS=Linux bash "$script" --uninstall
if [ ! -e "$h/.local/share/oarlock/Oarlock.AppImage" ] && [ ! -e "$h/.local/share/applications/oarlock.desktop" ]; then
  ok "AppImage files are gone"
else
  not_ok "AppImage files are gone" "$(find "$h" -type f)"
fi
expect "uninstall with nothing installed" 0 "Nothing to remove" -- \
  "${base[@]}" HOME="$h" XDG_DATA_HOME="$h/.local/share" OARLOCK_OS=Linux bash "$script" --uninstall

bad="$work/bad-release"
mkdir -p "$bad"
cp "$release"/* "$bad/"
printf 'tampered' >>"$bad/oarlock-linux-x64.AppImage"
h="$(fresh_home tampered)"
expect "checksum mismatch refuses to install" 1 "checksum mismatch" -- \
  "${base[@]}" HOME="$h" XDG_DATA_HOME="$h/.local/share" OARLOCK_OS=Linux OARLOCK_ARCH=x86_64 \
  OARLOCK_DOWNLOAD_BASE="file://$bad" bash "$script" --format appimage
if [ ! -e "$h/.local/share/oarlock/Oarlock.AppImage" ]; then
  ok "nothing installed after a mismatch"
else
  not_ok "nothing installed after a mismatch"
fi

unlisted="$work/unlisted-release"
mkdir -p "$unlisted"
cp "$release/oarlock-linux-x64.AppImage" "$unlisted/"
: >"$unlisted/SHA256SUMS"
expect "asset missing from SHA256SUMS is refused" 1 "isn't listed in SHA256SUMS" -- \
  "${base[@]}" HOME="$(fresh_home unlisted)" OARLOCK_OS=Linux OARLOCK_ARCH=x86_64 \
  OARLOCK_DOWNLOAD_BASE="file://$unlisted" bash "$script" --format appimage
expect "no release gives a clear error" 1 "Is there a published release" -- \
  "${base[@]}" HOME="$(fresh_home norelease)" OARLOCK_OS=Linux OARLOCK_ARCH=x86_64 \
  OARLOCK_DOWNLOAD_BASE="file://$work/does-not-exist" bash "$script" --format appimage

if [ "$(uname -s)" = Darwin ]; then
  echo "macOS .dmg install"
  app="$work/dmgsrc/Oarlock.app/Contents/MacOS"
  mkdir -p "$app"
  printf '#!/bin/sh\necho oarlock-cli\n' >"$app/oarlock-cli"
  chmod +x "$app/oarlock-cli"
  mac="$work/mac-release"
  mkdir -p "$mac"
  hdiutil create -quiet -fs HFS+ -volname Oarlock -srcfolder "$work/dmgsrc" -ov -format UDZO "$mac/oarlock-macos-arm64.dmg"
  (cd "$mac" && printf '%s  %s\n' "$(sha oarlock-macos-arm64.dmg)" oarlock-macos-arm64.dmg >SHA256SUMS)
  h="$(fresh_home mac)"
  expect "dmg installs into OARLOCK_INSTALL_DIR" 0 "Oarlock is installed" -- \
    "${base[@]}" HOME="$h" OARLOCK_INSTALL_DIR="$h/Applications" OARLOCK_OS=Darwin OARLOCK_ARCH=arm64 \
    OARLOCK_DOWNLOAD_BASE="file://$mac" bash "$script"
  if [ "$("$h/.local/bin/oarlock")" = oarlock-cli ]; then
    ok "oarlock CLI link runs the bundled CLI"
  else
    not_ok "oarlock CLI link runs the bundled CLI" "$(ls -la "$h/.local/bin" 2>&1)"
  fi
  expect "uninstall removes the app and link" 0 "Oarlock is uninstalled" -- \
    "${base[@]}" HOME="$h" OARLOCK_INSTALL_DIR="$h/Applications" OARLOCK_OS=Darwin bash "$script" --uninstall
  if [ ! -e "$h/Applications/Oarlock.app" ] && [ ! -L "$h/.local/bin/oarlock" ]; then
    ok "app and link are gone"
  else
    not_ok "app and link are gone"
  fi
fi

echo
echo "$pass passed, $fail failed"
[ "$fail" = 0 ]
