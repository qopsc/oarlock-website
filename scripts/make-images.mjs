// Regenerates the Open Graph image (public/og.png) from the brand lockup in brand-assets/.
// Favicons and app icons come ready-made from brand-assets/favicon/ and are copied into public/.
// Run after changing the lockup or headline: node scripts/make-images.mjs
import { readFileSync } from "node:fs";
import sharp from "sharp";

const lockup = readFileSync("brand-assets/lockup/oarlock-lockup-on-dark.svg", "utf8");
const viewBox = lockup.match(/viewBox="([^"]+)"/)[1];
const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
const paths = lockup.replace(/<\?xml[^>]*>/, "").replace(/<svg[^>]*>/, "").replace("</svg>", "");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A1415"/>
  <rect x="0" y="622" width="1200" height="8" fill="#51D0AE"/>
  <svg x="64" y="56" width="${Math.round((104 * vbWidth) / vbHeight)}" height="104" viewBox="${viewBox}">${paths}</svg>
  <g font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="-3.5" fill="#E6EFEB">
    <text x="80" y="330">Your terminal.</text>
    <text x="160" y="426">Your machines.</text>
    <text x="240" y="522">Your agents.</text>
  </g>
  <text x="1120" y="572" text-anchor="end" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="28" fill="#8EA59D">oarlock.sh</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile("public/og.png");
console.log("wrote public/og.png");
