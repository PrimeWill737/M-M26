import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { weddingConfig as c } from "../config/wedding";
import { dateStamp } from "../utils/calendar";
const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const branch = `<g fill="none" stroke="#7d8a6b" stroke-width="1.5"><path d="M120 600C240 390 90 250 200 15"/>${Array.from({ length: 9 }, (_, i) => `<path transform="translate(${155 + Math.sin(i) * 25} ${65 + i * 57}) rotate(${i % 2 ? 45 : -45})" d="M0 0C-65-15-75-60-55-90C-5-75 15-35 0 0ZM0 0L-55-85"/>`).join("")}</g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f5f2e9"/><rect x="28" y="28" width="1144" height="574" fill="none" stroke="#a9b29c"/><rect x="36" y="36" width="1128" height="558" fill="none" stroke="#d1d4c5"/><g opacity=".6">${branch}<g transform="translate(1200 0) scale(-1 1)">${branch}</g></g><g text-anchor="middle" fill="#294a3e"><text x="600" y="120" font-family="Georgia" font-size="32" font-style="italic">${escape(c.brand.monogram)}</text><text x="600" y="195" font-family="Arial" font-size="12" letter-spacing="5">TOGETHER WITH THEIR FAMILIES</text><text x="600" y="326" font-family="Georgia" font-size="91">${escape(c.brand.brideFirst)} <tspan fill="#89708a" font-style="italic">&amp;</tspan> ${escape(c.brand.groomFirst)}</text><text x="600" y="388" font-family="Georgia" font-size="25" font-style="italic">A celebration of love, family &amp; forever</text><path d="M510 434H690" stroke="#a9b29c"/><text x="600" y="481" font-family="Arial" font-size="16" letter-spacing="6">${escape(dateStamp(c.wedding))}</text><text x="600" y="528" font-family="Georgia" font-size="22">Jos, Plateau State</text></g></svg>`;
await mkdir("public/images", { recursive: true });
await sharp(Buffer.from(svg))
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile("public/images/mm26-social-card.jpg");
console.log("Created public/images/mm26-social-card.jpg (1200 × 630)");
