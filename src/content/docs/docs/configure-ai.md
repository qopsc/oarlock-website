---
title: Configure AI
description: Connect Oarlock to a cloud provider with your own key, or to a local model.
---

1. Open **Settings → AI**.
2. Pick a provider and paste your API key. For local inference, point Oarlock at your LM Studio, MLX, or Ollama endpoint.

## Supported providers

- **Bring your own key:** OpenAI, Anthropic, Google (Gemini), Groq, xAI (Grok), Cerebras, OpenRouter, DeepSeek, Mistral, and any OpenAI-compatible endpoint.
- **Local / offline:** LM Studio, MLX, Ollama.

## Where keys are stored

Keys go to the OS keychain: the macOS Keychain or the Windows Credential Manager. On Linux they go to a file in the app's data folder that only your user can read. They never go to localStorage or the logs.

## What the agent can do

- Plans, sub-agents, and custom agents with their own system prompt and tool subset.
- File read, write, edit, multi-edit, grep, and glob; bash with approval gating; background processes.
- A project's `AGENTS.md`, skills (`.claude/skills`, `.oarlock/skills`) and `.mcp.json` servers are used once you allow them, and you're asked again when they change.
- Local and remote MCP servers; each tool call is approved unless you trust the server.
- Spawn Claude Code in a terminal, inspect its output, and send follow-up work through approval-gated tools.
- In the composer, `#handle` inserts prompt snippets and `@path` attaches files. Voice input is built in.
- Plan mode generates a multi-step plan and confirms it before doing anything.
