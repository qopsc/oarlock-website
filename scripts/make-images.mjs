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
  <rect width="1200" height="630" fill="#0d1615"/>
  <rect x="0" y="622" width="1200" height="8" fill="#4fd1b0"/>
  <svg x="80" y="72" width="96" height="96" viewBox="0 0 1024 1024">${inner}</svg>
  <text x="194" y="136" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="44" font-weight="700" letter-spacing="-1.5" fill="#e6efeb">oarlock</text>
  <g font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="-3.5" fill="#e6efeb">
    <text x="80" y="330">Your terminal.</text>
    <text x="160" y="426">Your machines.</text>
    <text x="240" y="522">Your agents.</text>
  </g>
  <text x="1120" y="572" text-anchor="end" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="28" fill="#8ea59d">oarlock.sh</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile("public/og.png");
console.log("wrote public/apple-touch-icon.png, public/oarlock-256.png, public/og.png");
