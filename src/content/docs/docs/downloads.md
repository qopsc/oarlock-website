---
title: Homebrew, packages, and downloads
description: Other ways to install Oarlock.
---

## Homebrew (macOS)

```sh
brew install qopsc/tap/oarlock
```

Upgrade with `brew upgrade oarlock`. The cask also links the `oarlock` CLI.

## Direct downloads

Each link always points at the latest release:

| Platform | Download |
| --- | --- |
| macOS, Apple silicon | [oarlock-macos-arm64.dmg](https://github.com/qopsc/oarlock/releases/latest/download/oarlock-macos-arm64.dmg) |
| macOS, Intel | [oarlock-macos-x64.dmg](https://github.com/qopsc/oarlock/releases/latest/download/oarlock-macos-x64.dmg) |
| Linux x64 | [.deb](https://github.com/qopsc/oarlock/releases/latest/download/oarlock-linux-x64.deb) · [.rpm](https://github.com/qopsc/oarlock/releases/latest/download/oarlock-linux-x64.rpm) · [AppImage](https://github.com/qopsc/oarlock/releases/latest/download/oarlock-linux-x64.AppImage) |
| Linux arm64 | [.deb](https://github.com/qopsc/oarlock/releases/latest/download/oarlock-linux-arm64.deb) · [.rpm](https://github.com/qopsc/oarlock/releases/latest/download/oarlock-linux-arm64.rpm) · [AppImage](https://github.com/qopsc/oarlock/releases/latest/download/oarlock-linux-arm64.AppImage) |

Verify a download against the release's [SHA256SUMS](https://github.com/qopsc/oarlock/releases/latest/download/SHA256SUMS):

```sh
shasum -a 256 -c SHA256SUMS --ignore-missing   # macOS
sha256sum -c SHA256SUMS --ignore-missing       # Linux
```

Older versions are on [GitHub Releases](https://github.com/qopsc/oarlock/releases).

## Nix

```sh
nix profile install github:qopsc/oarlock
```

On NixOS, import the flake and add `inputs.oarlock.packages.${pkgs.system}.oarlock` to `environment.systemPackages`, or use the `nixosModules.oarlock` output.

## Arch Linux (AUR)

Coming soon. Until then the install script installs the AppImage on Arch.

## Windows

Coming soon. [Build from source](/docs/build-from-source/) in the meantime.
