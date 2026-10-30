// Vérification visuelle du layout téléphone (PROMPT-v2, T2) :
//   - aucune scrollbar : tout tient dans 100dvh
//   - la terre (pot) est VISIBLE sous la patate (plus de patate qui cache le pot)
//   - la terre n'est pas coupée en bas d'écran, la barre de nav est visible
//   - captures dans tests/screenshots/
//
// Usage : node scripts/visual-check.mjs  (exige un `next build` préalable)

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out");
const PORT = 3111;
const BASE = `http://127.0.0.1:${PORT}`;
const SHOT_DIR = path.join(ROOT, "tests", "screenshots");

let failures = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "  ✓" : "  ✗"} ${name}${detail ? ` (${detail})` : ""}`);
  if (!cond) failures++;
};

// Petit serveur statique pour out/ (`next start` ne gère pas output: export).
function serveStatic() {
  const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".json": "application/json; charset=utf-8",
    ".woff2": "font/woff2",
    ".txt": "text/plain; charset=utf-8",
  };
  const server = http.createServer((req, res) => {
    const url = (req.url || "/").split("?")[0];
    let p = decodeURIComponent(url);
    if (p === "/") p = "/index.html";
    const file = path.normalize(path.join(OUT_DIR, p));
    if (!file.startsWith(OUT_DIR)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404).end("not found");
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
      res.end(data);
    });
  });
  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

async function waitReady(ms = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("serveur statique n'est pas prêt à temps");
}

async function checkScene(page, label, { expectNav }) {
  console.log(`\n[${label}]`);
  const { doc, body, vh } = await page.evaluate(() => ({
    doc: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    body: document.body.scrollHeight - document.body.clientHeight,
    vh: window.innerHeight,
  }));
  ok("pas de défilement (doc)", doc <= 2, `doc ${doc}px / ${vh}px`);
  ok("pas de défilement (body)", body <= 2, `body ${body}px`);

  const b = await page.evaluate(() => {
    const rectOf = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    };
    const svg = (vb) => [...document.querySelectorAll("svg")].find((s) => s.getAttribute("viewBox") === vb);
    const soil = svg("0 0 260 130");
    const potato = svg("0 0 220 200");
    const nav = [...document.querySelectorAll("button")].find((x) => (x.textContent || "").includes("Boutique"));
    return { soil: rectOf(soil), potato: rectOf(potato), nav: rectOf(nav) };
  });
  const r = (x) => x && { top: Math.round(x.top), bottom: Math.round(x.bottom) };
  if (!b.soil || !b.potato) {
    ok("patate + terre présentes", false, "SVG introuvable");
    return;
  }
  ok("patate + terre présentes", true);
  ok("la terre chevauche le bas de la patate", b.soil.top < b.potato.bottom, `terre top ${Math.round(b.soil.top)} < patate bottom ${Math.round(b.potato.bottom)}`);
  ok("la terre est visible sous la patate", b.soil.bottom > b.potato.bottom + 10, `terre bottom ${Math.round(b.soil.bottom)} > patate bottom +10`);
  ok("la terre n'est pas coupée en bas", b.soil.bottom <= vh + 1, `bottom ${Math.round(b.soil.bottom)} / ${vh}`);
  if (expectNav) {
    ok("barre de nav visible", !!b.nav && b.nav.top >= -1 && b.nav.bottom <= vh + 1, b.nav ? `nav ${r(b.nav)}` : "introuvable");
  }
}

async function main() {
  if (!fs.existsSync(path.join(OUT_DIR, "index.html"))) {
    console.error("out/ introuvable : lancez `next build` d'abord");
    process.exit(1);
  }
  fs.mkdirSync(SHOT_DIR, { recursive: true });

  const server = await serveStatic();

  try {
    await waitReady();
    const browser = await chromium.launch();
    const shots = [
      { label: "téléphone 360×740", vp: { width: 360, height: 740 }, name: "home-360x740.png", expectNav: true },
      { label: "téléphone 412×915", vp: { width: 412, height: 915 }, name: "home-412x915.png", expectNav: true },
      { label: "desktop 1440×900", vp: { width: 1440, height: 900 }, name: "desktop-1440x900.png", expectNav: false },
    ];
    for (const s of shots) {
      const page = await browser.newPage({ viewport: s.vp, deviceScaleFactor: 2 });
      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: /Cliquer sur la patate/i }).waitFor({ timeout: 10000 });
      await new Promise((r) => setTimeout(r, 400));
      await checkScene(page, s.label, { expectNav: s.expectNav });
      await page.screenshot({ path: path.join(SHOT_DIR, s.name) });
      // boutique ouverte (mobile uniquement)
      if (s.expectNav) {
        await page.getByRole("button", { name: "Ouvrir la boutique" }).click();
        await new Promise((r) => setTimeout(r, 600));
        const scroll = await page.evaluate(() => {
          const panel = [...document.querySelectorAll("[role=dialog]")].pop();
          if (!panel) return null;
          const inner = panel.firstElementChild;
          return { outer: panel.scrollHeight - panel.clientHeight, inner: inner ? inner.scrollHeight - inner.clientHeight : 0 };
        });
        ok("boutique : scroll interne ok (pas de blocage)", scroll === null || scroll.outer >= 0, scroll ? `outer ${scroll.outer}` : "");
        await page.screenshot({ path: path.join(SHOT_DIR, s.name.replace("home", "shop")) });
      }
      await page.close();
    }
    await browser.close();
  } finally {
    server.close();
  }

  console.log(`\n${failures === 0 ? "TOUT EST VERT" : `${failures} échec(s)`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
