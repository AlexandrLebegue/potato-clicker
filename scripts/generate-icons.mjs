// Génère toutes les icônes à partir de assets/icon/*.svg (SVG source dans le dépôt).
//   Android : adaptative (foreground 108dp × 5 densités) + legacy carré/ronde (48→192)
//   Web     : favicon.ico, icon.svg, apple-touch-icon, manifest (192/512/maskable)
// Usage : node scripts/generate-icons.mjs   (dépendance : sharp, déjà dans node_modules)

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ICONS = path.join(ROOT, "assets", "icon");
const RES = path.join(ROOT, "android", "app", "src", "main", "res");
const P = (p) => path.join(ROOT, p);

const svg = (name) => readFileSync(path.join(ICONS, name));

const ADAPTIVE = [
  ["mdpi", 108],
  ["hdpi", 162],
  ["xhdpi", 216],
  ["xxhdpi", 324],
  ["xxxhdpi", 432],
];
const LEGACY = [
  ["mdpi", 48],
  ["hdpi", 72],
  ["xhdpi", 96],
  ["xxhdpi", 144],
  ["xxxhdpi", 192],
];

const raster = (buf) => sharp(buf, { density: 144 }); // ~768 px de source

// Assemble un .ico multi-tailles à partir de buffers PNG.
async function writeIco(file, sizes, pngs) {
  const count = sizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type icône
  header.writeUInt16LE(count, 4);
  let offset = 6 + count * 16;
  const entries = [];
  pngs.forEach((png, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1);
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(e);
  });
  writeFileSync(file, Buffer.concat([header, ...entries, ...pngs]));
}

const circleMask = (size) =>
  sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
    )
  ).png();

async function main() {
  mkdirSync(P("public/icons"), { recursive: true });
  const foreground = svg("potato-icon-foreground.svg");
  const full = svg("potato-icon.svg");

  // --- Android : icône adaptative (foreground transparent, 108dp par densité) ---
  for (const [dpi, size] of ADAPTIVE) {
    await raster(foreground)
      .resize(size, size)
      .png()
      .toFile(path.join(RES, `mipmap-${dpi}`, "ic_launcher_foreground.png"));
  }

  // --- Android : icônes legacy (carré + ronde) pour Android < 8 ---
  for (const [dpi, size] of LEGACY) {
    await raster(full)
      .resize(size, size)
      .png()
      .toFile(path.join(RES, `mipmap-${dpi}`, "ic_launcher.png"));
    const square = await raster(full).resize(size, size).png().toBuffer();
    const circle = await circleMask(size).toBuffer();
    await sharp(square)
      .composite([{ input: circle, blend: "dest-in" }])
      .png()
      .toFile(path.join(RES, `mipmap-${dpi}`, "ic_launcher_round.png"));
  }

  // --- Web ---
  // favicon.ico : le format ICO empaquette des PNG (Vista+) ; sharp ne sort
  // pas d'ICO, on assemble le conteneur à la main.
  const icoSizes = [16, 32, 48, 64];
  const pngs = await Promise.all(
    icoSizes.map((s) => raster(full).resize(s, s).png().toBuffer())
  );
  await writeIco(P("app/favicon.ico"), icoSizes, pngs);
  copyFileSync(path.join(ICONS, "potato-icon.svg"), P("app/icon.svg"));
  await raster(full).resize(180, 180).png().toFile(P("app/apple-icon.png"));
  await raster(full).resize(192, 192).png().toFile(P("public/icons/icon-192.png"));
  await raster(full).resize(512, 512).png().toFile(P("public/icons/icon-512.png"));
  await raster(full).resize(512, 512).png().toFile(P("public/icons/icon-maskable-512.png"));

  console.log("Icônes générées :");
  console.log("  Android : mipmap-*/ic_launcher{,_round,_foreground}.png, drawable/ic_launcher_background.xml (dégradé)");
  console.log("  Web     : app/favicon.ico, app/icon.svg, app/apple-icon.png, public/icons/*.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
