---
title: Install
description: Install Oarlock on macOS or Linux with one command.
---

```sh
curl -fsSL https://oarlock.sh/install | bash
```

The script:

1. Detects your OS (macOS or Linux) and CPU (arm64 or x64).
2. Downloads the matching build from the [latest GitHub release](https://github.com/qopsc/oarlock/releases/latest) along with its `SHA256SUMS`, and refuses to install if the checksum doesn't match.
3. Installs it:
   - **macOS**: copies `Oarlock.app` from the `.dmg` into `/Applications`, or `~/Applications` if `/Applications` isn't writable.
   - **Linux with apt** (Debian, Ubuntu, Mint, Pop!_OS): installs the `.deb` with `sudo apt-get`.
   - **Linux with dnf or zypper** (Fedora, RHEL, openSUSE): installs the `.rpm`.
   - **Any other Linux**: installs the AppImage into `~/.local/share/oarlock` and adds a desktop entry. No root needed.
4. Links the `oarlock` CLI into `~/.local/bin`, so `oarlock <file>` opens files in a running Oarlock window from any terminal.

Want to read it first? It's at [oarlock.sh/install](https://oarlock.sh/install).

## Options

Pass options after `bash -s --`:

```sh
curl -fsSL https://oarlock.sh/install | bash -s -- --version v0.1.0
```

| Option | What it does |
| --- | --- |
| `--version vX.Y.Z` | Install a specific release instead of the latest. |
| `--format deb\|rpm\|appimage` | Linux: override the detected package format. |
| `--no-cli` | Don't link the `oarlock` CLI into `~/.local/bin`. |
| `--uninstall` | Remove Oarlock and the CLI link. See [Uninstall](/docs/uninstall/). |
| `--dry-run` | Print what would happen without downloading or changing anything. |
| `-y`, `--yes` | Don't ask before using `sudo`. |

The environment variable `OARLOCK_INSTALL_DIR` overrides the macOS install folder.

## Updating

Run the same command again. It installs the latest release over the current one; your settings and keys are untouched.

## Windows

Windows builds are coming soon. Until then, [build from source](/docs/build-from-source/). WSL distros already work as workspace environments.
