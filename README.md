# oarlock.sh

Website for [Oarlock](https://github.com/qopsc/oarlock), the terminal-first AI workspace, plus the `curl | bash` installer served at <https://oarlock.sh/install>.

A static [Astro](https://astro.build) site with [Starlight](https://starlight.astro.build) docs at `/docs`. No client framework, no analytics, no third-party requests. Dark and light themes share one preference across the landing page and the docs.

## Develop

```sh
bun install
bun run dev          # http://localhost:4321
bun run build        # astro check + static build into dist/ + CSP finalize
bun run preview      # serve dist/ locally (runs as a daemon; stop with `bunx astro preview stop`)
bun run check:csp    # verify every inline script/style in dist/ is covered by its CSP
bun run test:install # installer tests (fake release over file://, throwaway $HOME)
bun run lint:install # shellcheck the installer
```

## Where things live

| What | Where |
| --- | --- |
| Name, URLs, nav, install commands | `src/data/site.ts` |
| Feature grid, showcase, pillars | `src/data/features.ts` (screenshots in `src/assets/screens/`) |
| Providers, workbench (coming soon), security points, FAQ | `src/data/*.ts` |
| Download links (stable asset names) | `src/data/downloads.ts` |
| Colors, type scale, shared styles | `src/styles/global.css`; Starlight mapping in `src/styles/starlight.css` |
| Docs pages | `src/content/docs/docs/*.md` |
| Roadmap | fetched from `qopsc/oarlock@main` at build (`src/lib/roadmap.ts`), falling back to `src/content/roadmap-snapshot.md` |
| Installer | `public/install`, tests in `tests/install.test.sh` |
| Brand assets (logo, mark, favicons, app icons, colors) | `brand-assets/`; favicons are copied into `public/`, and `node scripts/make-images.mjs` rebuilds `public/og.png` from the lockup |

## Content Security Policy

Astro writes a hashed CSP `<meta>` into every page (`security.csp` in `astro.config.mjs`). It doesn't hash `is:inline` scripts (ours and Starlight's) or inline `style=""` attributes (Starlight and Expressive Code), and it places the tag after the first inline scripts. `scripts/csp.mjs` runs after `astro build` to add the missing hashes and move the tag to the top of `<head>`. Loading anything from another origin means adding that origin to the directives in `astro.config.mjs`.

## Deploy

The build output is plain files; serve `dist/` from any static host. [`deploy/HEADERS.md`](deploy/HEADERS.md) lists the response headers and per-path rules the server needs (notably `text/plain` for `/install`), with Caddy and nginx examples.

Production is a container: `deploy/Dockerfile` builds the site and serves it with nginx on port 8080 (TLS and the `www` redirect live at the cluster gateway). `tests/image.sh` smoke-tests the image. On every push to `main`, CI builds the candidate, tests that exact image, and publishes it to `ghcr.io/qopsc/oarlock-website` by digest with a `release` record. A registry push does not deploy anything: the private `qopsc/stacks` repository verifies the record, pins the digest, and promotes it. Renovate (`renovate.json`) proposes dependency updates as pull requests.

[`deploy/RELEASE-INTEGRATION.md`](deploy/RELEASE-INTEGRATION.md) describes the changes the Oarlock release workflow needs (stable asset names, `SHA256SUMS`, Homebrew tap bump) for the installer and download links to work.

## License

The website code is MIT licensed (see [LICENSE](LICENSE)). Oarlock itself is Apache-2.0. Product screenshots are from the Oarlock repository.
