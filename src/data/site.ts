export const site = {
  name: "Oarlock",
  url: "https://oarlock.sh",
  title: "Oarlock: your terminal, your machines, your agents",
  description:
    "A terminal-first AI workspace where you run Claude Code, Codex, OpenCode and more, locally or in sandboxes on your own hardware, with your keys or local models.",
  publisher: { name: "Quantum Ops Consulting, LLC", url: "https://quantumops.consulting" },
  repo: "https://github.com/qopsc/oarlock",
  siteRepo: "https://github.com/qopsc/oarlock-website",
  install: {
    unix: "curl -fsSL https://oarlock.sh/install | bash",
    brew: "brew install qopsc/tap/oarlock",
    nix: "nix profile install github:qopsc/oarlock",
  },
  nav: [
    { label: "Features", href: "/#features" },
    { label: "Download", href: "/#download" },
    { label: "Docs", href: "/docs/" },
    { label: "Roadmap", href: "/roadmap/" },
  ],
} as const;

export const links = {
  releases: `${site.repo}/releases`,
  latestDownload: `${site.repo}/releases/latest/download`,
  security: `${site.repo}/blob/main/SECURITY.md`,
  license: `${site.repo}/blob/main/LICENSE`,
  terax: "https://github.com/crynta/terax-ai",
  issues: `${site.repo}/issues`,
} as const;
