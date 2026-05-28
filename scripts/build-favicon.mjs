// One-shot favicon builder. Renders public/favicon.svg into a multi-size
// favicon.ico (16, 32, 48). Uses @resvg/resvg-js (WASM, no native deps).
// Run: node scripts/build-favicon.mjs
import { Buffer } from "node:buffer";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const svg = readFileSync(resolve(root, "public/favicon.svg"));

const sizes = [16, 32, 48];

const pngs = sizes.map((size) => {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: size } });
  return resvg.render().asPng();
});

// ICO container: 6-byte header + 16-byte directory entry per image + PNG data.
const headerSize = 6;
const entrySize = 16;
const dataOffset = headerSize + entrySize * sizes.length;

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(sizes.length, 4); // image count

const entries = Buffer.alloc(entrySize * sizes.length);
let offset = dataOffset;
sizes.forEach((size, i) => {
  const png = pngs[i];
  const base = i * entrySize;
  entries.writeUInt8(size === 256 ? 0 : size, base + 0); // width
  entries.writeUInt8(size === 256 ? 0 : size, base + 1); // height
  entries.writeUInt8(0, base + 2); // palette
  entries.writeUInt8(0, base + 3); // reserved
  entries.writeUInt16LE(1, base + 4); // color planes
  entries.writeUInt16LE(32, base + 6); // bits per pixel
  entries.writeUInt32LE(png.length, base + 8); // image size
  entries.writeUInt32LE(offset, base + 12); // image offset
  offset += png.length;
});

const ico = Buffer.concat([header, entries, ...pngs]);
writeFileSync(resolve(root, "public/favicon.ico"), ico);
// eslint-disable-next-line no-console
console.warn(`Wrote public/favicon.ico (${ico.length} bytes, sizes: ${sizes.join(", ")})`);
