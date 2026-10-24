// Finishes the per-page CSP <meta> that Astro generates (security.csp in astro.config.mjs).
//
// Astro hashes the scripts and styles it bundles, but not `is:inline` scripts (ours and
// Starlight's) or inline style="" attributes (Starlight, Expressive Code), and it places the
// <meta> after the first inline scripts, where it doesn't govern them. For every page in dist/:
//   - add any missing inline <script>/<style> hashes to script-src/style-src
//   - add style="" attribute hashes to style-src-attr with 'unsafe-hashes'
//   - move the <meta> to the top of <head>, just after <meta charset>
//
// Usage: node scripts/csp.mjs [dist]          rewrite pages
//        node scripts/csp.mjs --check [dist]  only verify; exit 1 on any gap
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const check = args.includes("--check");
const root = args.find((a) => !a.startsWith("--")) ?? "dist";

const META_RE = /<meta http-equiv="content-security-policy" content="([^"]*)"\s*\/?>/i;
const sha256 = (text) => `'sha256-${createHash("sha256").update(text).digest("base64")}'`;
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

function inlineHashes(html) {
  const script = new Set();
  const style = new Set();
  const attr = new Set();
  for (const [, attrs = "", body] of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    // External scripts are covered by 'self'; JSON-LD is data, never executed.
    if (/\ssrc=/.test(attrs) || /type="application\/ld\+json"/.test(attrs) || body === "") continue;
    script.add(sha256(body));
  }
  for (const [, body] of html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/g)) {
    if (body !== "") style.add(sha256(body));
  }
  // Attributes outside <script>/<style> bodies only.
  const markup = html.replace(/<(script|style)(\s[^>]*)?>[\s\S]*?<\/\1>/g, "");
  for (const [, , value] of markup.matchAll(/\sstyle=(["'])([\s\S]*?)\1/g)) {
    attr.add(sha256(decode(value)));
  }
  return { script, style, attr };
}

function parsePolicy(policy) {
  const directives = new Map();
  for (const part of policy.split(";")) {
    const [name, ...values] = part.trim().split(/\s+/);
    if (name) directives.set(name, values);
  }
  return directives;
}

const serialize = (directives) => [...directives].map(([name, values]) => [name, ...values].join(" ")).join("; ");

const pages = readdirSync(root, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith(".html"));
let problems = 0;

for (const file of pages) {
  const path = join(root, file);
  let html = readFileSync(path, "utf8");
  const match = html.match(META_RE);
  if (!match) {
    console.error(`${file}: no CSP <meta>`);
    problems++;
    continue;
  }

  const directives = parsePolicy(match[1]);
  const { script, style, attr } = inlineHashes(html);
  const missing = [];
  const merge = (name, hashes, base) => {
    const values = directives.get(name) ?? [...base];
    for (const hash of hashes) {
      if (!values.includes(hash)) {
        values.push(hash);
        missing.push(`${name} ${hash}`);
      }
    }
    if (values.length) directives.set(name, values);
  };
  merge("script-src", script, ["'self'"]);
  merge("style-src", style, ["'self'"]);
  if (attr.size) merge("style-src-attr", attr, ["'unsafe-hashes'"]);

  const metaFirst = html.search(META_RE) < html.search(/<(script|style)[\s>]/);

  if (check) {
    for (const m of missing) console.error(`${file}: missing ${m}`);
    if (!metaFirst) console.error(`${file}: CSP <meta> comes after inline content`);
    problems += missing.length + (metaFirst ? 0 : 1);
    continue;
  }

  const meta = `<meta http-equiv="content-security-policy" content="${serialize(directives)}">`;
  // Right after <meta charset>, which must stay within the first 1024 bytes.
  html = html.replace(META_RE, "");
  html = /<meta charset=[^>]*>/i.test(html)
    ? html.replace(/<meta charset=[^>]*>/i, (charset) => `${charset}${meta}`)
    : html.replace(/<head>/i, `<head>${meta}`);
  writeFileSync(path, html);
}

console.log(`csp: ${check ? "checked" : "finalized"} ${pages.length} pages${check ? `, ${problems} problem(s)` : ""}`);
process.exit(problems ? 1 : 0);
