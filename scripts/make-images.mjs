// Regenerates the raster icons and the Open Graph image in public/ from src/assets/logo.svg.
// Run after changing the logo or headline: node scripts/make-images.mjs
import { readFileSync } from "node:fs";
import sharp from "sharp";

const logo = readFileSync("src/assets/logo.svg");

await sharp(logo).resize(180, 180).png().toFile("public/apple-touch-icon.png");
await sharp(logo).resize(256, 256).png().toFile("public/oarlock-256.png");

const inner = logo
  .toString()
  .replace(/<\?xml[^>]*>/, "")
  .replace(/<title>.*?<\/title>/, "")
  .replace(/<svg[^>]*>/, "")
  .replace("</svg>", "");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#c9d6e2" stroke-opacity="0.06"/>
    </pattern>
    <radialGradient id="glow" cx="0.85" cy="0" r="0.8">
      <stop offset="0" stop-color="#d9a441" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#d9a441" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0b131b"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <svg x="80" y="80" width="112" height="112" viewBox="0 0 1024 1024">${inner}</svg>
  <text x="214" y="152" font-family="Menlo, 'DejaVu Sans Mono', monospace" font-size="44" font-weight="700" fill="#e9eef3">oarlock</text>
  <g font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="84" font-weight="700" letter-spacing="-3">
    <text x="80" y="340" fill="#e9eef3">Your terminal.</text>
    <text x="80" y="436" fill="#c9d6e2" fill-opacity="0.75">Your machines.</text>
    <text x="80" y="532" fill="#e0ac4f">Your agents.</text>
  </g>
  <text x="1120" y="560" text-anchor="end" font-family="Menlo, 'DejaVu Sans Mono', monospace" font-size="28" fill="#93a6b8">oarlock.sh</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile("public/og.png");
console.log("wrote public/apple-touch-icon.png, public/oarlock-256.png, public/og.png");
