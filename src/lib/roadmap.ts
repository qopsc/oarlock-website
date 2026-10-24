import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import snapshot from "../content/roadmap-snapshot.md?raw";

const RAW_URL = "https://raw.githubusercontent.com/qopsc/oarlock/main/ROADMAP.md";
const BLOB_BASE = "https://github.com/qopsc/oarlock/blob/main/";

export interface Roadmap {
  html: string;
  /** "live" when fetched from GitHub at build time, "snapshot" when the bundled copy was used. */
  source: "live" | "snapshot";
}

/** ROADMAP.md from qopsc/oarlock@main, falling back to the bundled snapshot so builds never depend on the network. */
export async function loadRoadmap(): Promise<Roadmap> {
  let markdown = snapshot;
  let source: Roadmap["source"] = "snapshot";
  try {
    const res = await fetch(RAW_URL, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    markdown = await res.text();
    source = "live";
  } catch (error) {
    console.warn(`[roadmap] using bundled snapshot: could not fetch ${RAW_URL} (${error})`);
  }

  // The page supplies its own title; relative links point into the oarlock repo.
  const body = markdown
    .replace(/^# .*\n+/, "")
    .replace(/\]\((?!https?:|#|mailto:)([^)]+)\)/g, (_, path: string) => `](${BLOB_BASE}${path.replace(/^\.\//, "")})`);

  const processor = await createMarkdownProcessor({ gfm: true });
  const { code } = await processor.render(body);
  return { html: code, source };
}
