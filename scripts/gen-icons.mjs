// Regenerate all PWA raster icons + favicon from public/icons/icon.svg
// Usage: node scripts/gen-icons.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "public", "icons");

const displaySvg = readFileSync(join(iconsDir, "icon.svg"), "utf8");
// Full-bleed variant for maskable + apple-touch (OS applies its own mask):
// square the tile corners AND drop the decorative inner border.
const fullBleedSvg = displaySvg
  .replaceAll('rx="112"', 'rx="0"')
  .replace(/<rect[^>]*data-edge[^>]*\/>/g, "");

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size, { fit: "contain" }).png().toBuffer();

function pngToIco(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, pngBuf]);
}

const out = (name, buf) => {
  writeFileSync(join(iconsDir, name), buf);
  console.log("  ✓", name, `(${buf.length} bytes)`);
};

const run = async () => {
  console.log("Generating icons from icon.svg …");
  out("icon-192.png", await png(displaySvg, 192));
  out("icon-512.png", await png(displaySvg, 512));
  out("icon-192-maskable.png", await png(fullBleedSvg, 192));
  out("icon-512-maskable.png", await png(fullBleedSvg, 512));
  out("apple-touch-icon.png", await png(fullBleedSvg, 180));

  // favicon.ico (App Router auto-serves app/favicon.ico)
  const fav = await png(displaySvg, 48);
  writeFileSync(join(root, "app", "favicon.ico"), pngToIco(fav, 48));
  console.log("  ✓ app/favicon.ico");
  console.log("Done.");
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
