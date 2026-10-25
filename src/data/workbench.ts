/** The self-hosted agent workbench being folded into Oarlock. Everything here is unreleased. */

/** The illustrative `oarlock sandboxes` listing, grouped by host. */
export const workbenchHosts = [
  {
    host: "mac-studio",
    sandboxes: [
      { agent: "Claude Code", project: "oarlock-web", status: "running" },
      { agent: "Codex", project: "api", status: "running" },
    ],
  },
  {
    host: "homelab",
    sandboxes: [
      { agent: "OpenCode", project: "infra", status: "idle" },
      { agent: "pi", project: "docs", status: "running" },
    ],
  },
  {
    host: "vm-01",
    sandboxes: [{ agent: "oh-my-pi", project: "scratch", status: "running" }],
  },
] as const;

export const workbenchPoints = [
  {
    title: "Sandboxed agents",
    text: "Run coding agents in isolated sandboxes so a runaway command stays in its box.",
  },
  {
    title: "On machines you own",
    text: "A workstation, a home server, a cloud VM: point Oarlock at it and it becomes an agent host.",
  },
  {
    title: "Clients everywhere",
    text: "Check in and steer from native macOS, Linux, iOS, and Android apps, or the CLI.",
  },
];
