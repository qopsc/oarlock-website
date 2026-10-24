---
title: Platform notes
description: macOS, Linux, Windows, and WSL specifics.
---

## macOS

Releases are signed and notarized. Apple silicon and Intel builds are separate downloads; the install script picks the right one.

## Linux

- **AppImage** needs FUSE. Without it, run `./oarlock-linux-x64.AppImage --appimage-extract-and-run`.
- On **Wayland** with rendering glitches, try `WEBKIT_DISABLE_DMABUF_RENDERER=1`.
- The `.deb` and `.rpm` packages link against the system GTK stack and tend to be smoother than the AppImage.

## Windows

Windows builds are coming soon. When building from source:

- Default shell detection: `pwsh.exe` (PowerShell 7+), then `powershell.exe` (Windows PowerShell 5.1), then `cmd.exe`.
- WSL is a first-class workspace environment, not a wrapped subprocess. Each tab can use Local or any installed WSL distro.
