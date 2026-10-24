import type { ImageMetadata } from "astro";
import terminal from "../assets/screens/terminal.png";
import aiWorkflow from "../assets/screens/ai-workflow.png";
import editor from "../assets/screens/editor.png";
import sourceControl from "../assets/screens/source-control.png";
import webPreview from "../assets/screens/web-preview.png";
import themes from "../assets/screens/themes.png";

export interface Feature {
  id: string;
  title: string;
  summary: string;
  points: string[];
  screen: ImageMetadata;
  alt: string;
}

export const features: Feature[] = [
  {
    id: "terminal",
    title: "Terminal",
    summary: "A GPU-drawn terminal on libghostty-vt, built around blocks and an editor-grade input.",
    points: [
      "WebGPU renderer with WebGL fallback, multi-tab with background streaming",
      "Native PTY: zsh, bash, fish, pwsh, cmd, and WSL as a first-class environment",
      "Splits, inline search, true color, Kitty graphics and keyboard protocols",
      "Spaces restore tabs, folders, and split layouts across launches",
    ],
    screen: terminal,
    alt: "Oarlock's block-based terminal with a file explorer and command input",
  },
  {
    id: "ai",
    title: "AI agents",
    summary: "An agent that plans, reads, edits, and runs commands, and asks before anything risky.",
    points: [
      "Sub-agents, plan mode, custom agents with their own prompts and tools",
      "File read, write, edit, grep, glob, and bash, each gated by approval",
      "MCP servers, project AGENTS.md and skills, used once you allow them",
      "Spawn and steer Claude Code in a terminal through approval-gated tools",
    ],
    screen: aiWorkflow,
    alt: "An AI agent proposing an edit, shown as a diff awaiting approval",
  },
  {
    id: "editor",
    title: "Editor",
    summary: "CodeMirror 6 with AI autocomplete, language servers, and hunk-by-hunk AI diffs.",
    points: [
      "Inline AI completion, including from local models",
      "Opt-in LSP: diagnostics, navigation, completion, formatting",
      "Markdown, images, video, audio, and PDF viewing",
      "Vim mode and a dozen editor themes",
    ],
    screen: editor,
    alt: "The Oarlock code editor with syntax highlighting",
  },
  {
    id: "git",
    title: "Source control",
    summary: "Stage hunks, commit, and push without leaving the terminal, with a real commit graph.",
    points: [
      "Stage and unstage by hunk, commit with Cmd/Ctrl+Enter",
      "Push with upstream awareness, detached HEAD shown honestly",
      "History with lane-rendered merges and branches",
      "Search commits and jump to them on your remote",
    ],
    screen: sourceControl,
    alt: "Source control panel next to a git history graph",
  },
  {
    id: "preview",
    title: "Web preview",
    summary: "Your dev server, one tab over. Oarlock spots local servers and opens them.",
    points: [
      "Auto-detects local dev servers",
      "External URLs in a native child webview",
      "Lives in a tab next to your terminals and files",
    ],
    screen: webPreview,
    alt: "A local web app previewed inside an Oarlock tab",
  },
  {
    id: "themes",
    title: "Themes",
    summary: "Build a theme in the app, import the one you already use, and share it as a file.",
    points: [
      "Import Ghostty, iTerm2, Alacritty, and Windows Terminal schemes",
      "Share .oarlock-theme files",
      "Background images with opacity and blur",
      "Editor theme independent from the app theme",
    ],
    screen: themes,
    alt: "The theme editor with presets and a background image",
  },
];

export const pillars = [
  { title: "Terminal-first", text: "The terminal is the product, not a panel. PTY fidelity and TUI compatibility come first." },
  { title: "Your keys or local models", text: "Bring any provider's key, or run fully offline with Ollama, LM Studio, or MLX." },
  { title: "No telemetry. No account.", text: "Nothing phones home. Keys live in your OS keychain." },
  { title: "Lightweight", text: "Tauri and Rust, heavy code loaded lazily, size budgets enforced in CI." },
  { title: "Cross-platform", text: "macOS and Linux today, with WSL as a first-class workspace. Windows builds are coming." },
];
