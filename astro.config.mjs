// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://oarlock.sh",
  compressHTML: true,
  integrations: [
    starlight({
      title: "Oarlock Docs",
      description: "Install, configure, and use Oarlock, the terminal-first AI workspace.",
      logo: { src: "./src/assets/logo.svg", alt: "Oarlock" },
      favicon: "/favicon.svg",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/qopsc/oarlock" }],
      editLink: { baseUrl: "https://github.com/qopsc/oarlock-website/edit/main/" },
      customCss: ["./src/styles/starlight.css"],
      components: { Head: "./src/components/starlight/Head.astro" },
      // Our own 404 page covers the whole site.
      disable404Route: true,
      // Pagefind needs WebAssembly, which the strict CSP below doesn't allow; the docs are small.
      pagefind: false,
      sidebar: [
        {
          label: "Get started",
          items: [
            { label: "Overview", slug: "docs" },
            { label: "Install", slug: "docs/install" },
            { label: "Homebrew, packages, and downloads", slug: "docs/downloads" },
            { label: "Configure AI", slug: "docs/configure-ai" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Platform notes", slug: "docs/platform-notes" },
            { label: "Build from source", slug: "docs/build-from-source" },
            { label: "Uninstall", slug: "docs/uninstall" },
            { label: "Architecture docs", link: "https://github.com/qopsc/oarlock/blob/main/docs/README.md", attrs: { target: "_blank" } },
          ],
        },
      ],
    }),
    sitemap(),
  ],
  // Astro hashes its inline scripts and styles into a per-page <meta> CSP.
  // frame-ancestors can't be set from <meta>; the server sends it (deploy/HEADERS.md).
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
    },
  },
  fonts: [
    {
      name: "Bricolage Grotesque",
      cssVariable: "--font-bricolage",
      provider: fontProviders.fontsource(),
      weights: ["200 800"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      name: "Martian Mono",
      cssVariable: "--font-martian-mono",
      provider: fontProviders.fontsource(),
      weights: [400, 500],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
});
