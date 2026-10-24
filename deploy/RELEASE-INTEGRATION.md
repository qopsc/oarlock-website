# Release integration for qopsc/oarlock

The website, the install script, and the Homebrew cask all depend on each Oarlock release publishing:

- **Stable, version-less asset names**, so `https://github.com/qopsc/oarlock/releases/latest/download/<name>` always resolves to the newest build.
- **`SHA256SUMS`**, which the install script checks before installing anything.

| Stable name | Built by Tauri as |
| --- | --- |
| `oarlock-macos-arm64.dmg` | `Oarlock_<ver>_aarch64.dmg` |
| `oarlock-macos-x64.dmg` | `Oarlock_<ver>_x64.dmg` |
| `oarlock-linux-x64.deb` | `Oarlock_<ver>_amd64.deb` |
| `oarlock-linux-arm64.deb` | `Oarlock_<ver>_arm64.deb` |
| `oarlock-linux-x64.rpm` | `Oarlock-<ver>-1.x86_64.rpm` |
| `oarlock-linux-arm64.rpm` | `Oarlock-<ver>-1.aarch64.rpm` |
| `oarlock-linux-x64.AppImage` | `Oarlock_<ver>_amd64.AppImage` |
| `oarlock-linux-arm64.AppImage` | `Oarlock_<ver>_aarch64.AppImage` |
| `SHA256SUMS` | (generated) covers the versioned and stable files |

These changes go in the **oarlock** repo. They are not applied automatically.

## 1. Add a job to `.github/workflows/release.yml`

Append after `patch-updater-manifest`. It runs while the release is still a draft, so the aliases and checksums are in place before you publish.

```yaml
  # Version-less copies of each installer plus SHA256SUMS, for oarlock.sh/install,
  # the website's download links, and the Homebrew cask (see qopsc/oarlock-website,
  # deploy/RELEASE-INTEGRATION.md). Runs after the AppImages are re-signed so the
  # checksums cover the final files.
  release-assets:
    needs: [publish-tauri, patch-updater-manifest]
    if: startsWith(github.ref, 'refs/tags/')
    runs-on: namespace-profile-oarlock-linux-amd64
    permissions:
      contents: write
    steps:
      - name: Upload stable asset names and SHA256SUMS
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          set -euo pipefail
          shopt -s nullglob
          TAG="${GITHUB_REF_NAME}"
          mkdir assets && cd assets
          gh release download "$TAG" --repo "$GITHUB_REPOSITORY" \
            --pattern '*.dmg' --pattern '*.deb' --pattern '*.rpm' --pattern '*.AppImage'

          # stable <glob> <stable-name>: exactly one built asset must match.
          stable() {
            local matches=($1)
            if [ "${#matches[@]}" -ne 1 ]; then
              echo "::error::expected one asset matching '$1', found ${#matches[@]}: ${matches[*]:-none}"
              exit 1
            fi
            cp -- "${matches[0]}" "$2"
          }
          stable '*_aarch64.dmg'        oarlock-macos-arm64.dmg
          stable '*_x64.dmg'            oarlock-macos-x64.dmg
          stable '*_amd64.deb'          oarlock-linux-x64.deb
          stable '*_arm64.deb'          oarlock-linux-arm64.deb
          stable '*.x86_64.rpm'         oarlock-linux-x64.rpm
          stable '*.aarch64.rpm'        oarlock-linux-arm64.rpm
          stable '*_amd64.AppImage'     oarlock-linux-x64.AppImage
          stable '*_aarch64.AppImage'   oarlock-linux-arm64.AppImage

          sha256sum -- * > SHA256SUMS
          cat SHA256SUMS
          gh release upload "$TAG" oarlock-* SHA256SUMS --clobber --repo "$GITHUB_REPOSITORY"
```

## 2. Add `.github/workflows/homebrew.yml`

Bumps `qopsc/homebrew-tap` when a release is **published** (not while it's a draft, so `brew install` never points at unreleased files).

Create a fine-grained personal access token with **Contents: read and write** on `qopsc/homebrew-tap` only, and save it in the oarlock repo as the secret `HOMEBREW_TAP_TOKEN`.

```yaml
name: Homebrew

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      tag:
        description: Release tag to publish to the tap (e.g. v0.1.0)
        required: true

permissions:
  contents: read

jobs:
  bump-cask:
    runs-on: ubuntu-latest
    steps:
      - name: Update Casks/oarlock.rb in qopsc/homebrew-tap
        env:
          GH_TOKEN: ${{ secrets.HOMEBREW_TAP_TOKEN }}
          TAG: ${{ github.event.release.tag_name || inputs.tag }}
        run: |
          set -euo pipefail
          VERSION="${TAG#v}"
          gh release download "$TAG" --repo qopsc/oarlock --pattern SHA256SUMS
          sum() { awk -v f="$1" '$2 == f {print $1}' SHA256SUMS; }
          ARM="$(sum oarlock-macos-arm64.dmg)"
          INTEL="$(sum oarlock-macos-x64.dmg)"
          [ -n "$ARM" ] && [ -n "$INTEL" ] || { echo "::error::macOS checksums missing from SHA256SUMS"; exit 1; }

          gh repo clone qopsc/homebrew-tap tap -- --depth 1
          cd tap
          sed -i -E \
            -e "s/^  version \"[^\"]*\"/  version \"${VERSION}\"/" \
            -e "s/arm:   \"[0-9a-f]{64}\"/arm:   \"${ARM}\"/" \
            -e "s/intel: \"[0-9a-f]{64}\"/intel: \"${INTEL}\"/" \
            Casks/oarlock.rb
          git diff --stat
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git commit -am "oarlock ${VERSION}"
          git push "https://x-access-token:${GH_TOKEN}@github.com/qopsc/homebrew-tap.git" HEAD:main
```

A release published by another workflow using `GITHUB_TOKEN` won't trigger this (GitHub suppresses that); publishing from the GitHub UI or with your own token does. Use the manual `workflow_dispatch` run if needed.

## 3. Release checklist

1. Push the tag `vX.Y.Z`. `publish-tauri`, `patch-updater-manifest`, then `release-assets` run; the release is a draft with versioned files, stable copies, and `SHA256SUMS`.
2. Smoke-test from the draft if you like: `gh release download vX.Y.Z -p SHA256SUMS -p oarlock-macos-arm64.dmg` and check the sum.
3. Publish the release. `/releases/latest/download/*` now resolves, so `curl -fsSL https://oarlock.sh/install | bash` and the website's download buttons serve it. `homebrew.yml` bumps the cask.
4. Verify: `curl -fsSL https://oarlock.sh/install | bash` on macOS and a Linux box, and `brew install qopsc/tap/oarlock`.

## Later: Windows

When a Windows leg is added to the release matrix, also alias its installer (e.g. `alias '*_x64-setup.exe' oarlock-windows-x64.exe` or the `.msi`), then on the website flip the Windows entry in `src/data/downloads.ts` to `available`, add an `install.ps1`, and replace the "coming soon" tab in `src/components/Hero.astro`.
