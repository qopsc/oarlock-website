/**
 * What Oarlock can talk to. Built-in providers match qopsc/oarlock's
 * src/modules/ai/config.ts; everything else reaches Oarlock through its
 * OpenAI-compatible provider or runs in its terminal.
 */
export interface ProviderGroup {
  label: string;
  note: string;
  items: string[];
}

export const providerGroups: ProviderGroup[] = [
  {
    label: "Bring your own key",
    note: "Paste a key from any of these, or any OpenAI-compatible API.",
    items: ["OpenAI", "Anthropic", "Google Gemini", "xAI", "DeepSeek", "Mistral", "Cerebras", "Groq", "OpenRouter"],
  },
  {
    label: "Run it locally",
    note: "Ollama, LM Studio, and MLX are built in. The rest connect as an OpenAI-compatible endpoint.",
    items: ["Ollama", "LM Studio", "MLX", "llama.cpp", "vLLM", "Unsloth Studio", "Jan"],
  },
  {
    label: "Agents in your terminal",
    note: "Oarlock's own agent can start and steer Claude Code. Every other agent CLI runs in its terminal like any program.",
    items: [
      "Claude Code",
      "Codex",
      "OpenCode",
      "Antigravity CLI",
      "GitHub Copilot CLI",
      "Cursor CLI",
      "Amp",
      "Aider",
      "Goose",
      "Cline",
      "pi",
    ],
  },
];
