---
title: Uninstall
description: Remove Oarlock.
---

If you used the install script:

```sh
curl -fsSL https://oarlock.sh/install | bash -s -- --uninstall
```

That removes the app (or the `.deb`/`.rpm` package), the AppImage and its desktop entry if present, and the `~/.local/bin/oarlock` link.

If you used Homebrew:

```sh
brew uninstall --cask oarlock
```

Settings, themes, and chat history stay in Oarlock's data folder so a reinstall picks them up. API keys stay in your OS keychain; remove them in **Settings → AI** before uninstalling if you want them gone.
