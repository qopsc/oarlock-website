export const faq = [
  {
    q: "Is Oarlock free?",
    a: "Yes. Oarlock is open source under the Apache 2.0 license. You pay your AI provider directly for any cloud models you use, or nothing at all with local models.",
  },
  {
    q: "Which platforms does it run on?",
    a: "macOS (Apple silicon and Intel) and Linux (x64 and arm64, as .deb, .rpm, or AppImage). Windows builds are coming; until then Windows users can build from source, and WSL distros work as workspace environments.",
  },
  {
    q: "Where do my API keys go?",
    a: "Into your operating system's keychain: the macOS Keychain or the Windows Credential Manager. On Linux they go to a file only your user can read. They are never written to localStorage or logs, and Oarlock has no servers of its own to send them to.",
  },
  {
    q: "Can I use it without any cloud AI?",
    a: "Yes. Point it at Ollama, LM Studio, or MLX and everything, including autocomplete, runs on your machine. Or turn AI off and use it as a terminal, editor, and git client.",
  },
  {
    q: "How is it different from Warp or Cursor?",
    a: "Oarlock is terminal-first like Warp, but open source, account-free, and bring-your-own-model. It has an editor and git like Cursor, but stays a lightweight native app built on Tauri and Rust rather than an IDE fork.",
  },
  {
    q: "What's Terax?",
    a: "Oarlock is based on Terax by Crynta, also Apache 2.0. Quantum Ops Consulting has modified and extended it; the git history records every change.",
  },
  {
    q: "When is the sandboxed agent workbench coming?",
    a: "It's being folded in from an earlier Oarlock project. Follow the roadmap and GitHub releases; it will be announced there when it lands.",
  },
];
