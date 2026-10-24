---
title: Build from source
description: Build and run Oarlock from its repository.
---

## Prerequisites

- Rust (stable): [rustup.rs](https://rustup.rs)
- [Bun](https://bun.sh) 1.4.3 or newer
- Tauri prerequisites for your platform: [tauri.app/start/prerequisites](https://tauri.app/start/prerequisites/)

## Run

```sh
git clone https://github.com/qopsc/oarlock.git
cd oarlock
bun install
bun run tauri dev       # development
bun run tauri build     # production bundle
```

## Checks

```sh
bun run lint
bun run check-types
bun run test
cd src-tauri && cargo clippy --all-targets --locked -- -D warnings
cd src-tauri && cargo nextest run --locked   # or: cargo test --locked
```

See [CONTRIBUTING.md](https://github.com/qopsc/oarlock/blob/main/CONTRIBUTING.md) before opening a pull request.
