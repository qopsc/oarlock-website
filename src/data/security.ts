export const securityPoints = [
  {
    title: "Keys in the keychain",
    text: "API keys go to the macOS Keychain or Windows Credential Manager, and to a user-only file on Linux. Never to localStorage or logs.",
  },
  {
    title: "Approval before action",
    text: "File writes, shell commands, and MCP tool calls ask first, unless you've chosen to trust them.",
  },
  {
    title: "Secrets stay off-limits",
    text: "A deny-list blocks agents from .env files, SSH and cloud credentials, and shell startup files, with symlinks resolved before the check.",
  },
  {
    title: "Workspace boundaries",
    text: "File, git, PTY, and AI access is limited to folders you authorized.",
  },
  {
    title: "Network guards",
    text: "The AI proxy defends against SSRF and DNS rebinding, so a prompt can't aim requests at your LAN.",
  },
  {
    title: "No telemetry",
    text: "No analytics, no crash reporting, no account. This website doesn't track you either.",
  },
];
