// Renderiza os rasters do site a partir de código (sem imagens geradas por IA):
// og-pt.png / og-en.png (1200×630), favicon.svg, favicon-48.png,
// apple-touch-icon.png (180), icon-192.png, icon-512.png.
// Uso: node tools/raster.mjs   (requer Google Chrome instalado)

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as F from "./figures.mjs";
import { pt, en } from "./i18n.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets/img");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "td-raster-"));
fs.mkdirSync(OUT, { recursive: true });

const fontsUrl = "file://" + path.join(ROOT, "assets/fonts/");
const css = fs.readFileSync(path.join(ROOT, "assets/css/site.css"), "utf8").replace(/url\("\.\.\/fonts\//g, `url("${fontsUrl}`);

function shot(name, html, w, h) {
  const file = path.join(TMP, name + ".html");
  fs.writeFileSync(file, html);
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`, `--screenshot=${path.join(OUT, name + ".png")}`, "file://" + file], { stdio: "ignore" });
  console.log("ok", name + ".png");
}

function og(d) {
  return `<!doctype html><meta charset="utf-8"><style>${css}
html,body{margin:0;padding:0;width:1200px;height:630px;overflow:hidden;background:var(--bond)}
.og{position:absolute;inset:18px;border:1.5px solid var(--ink);display:grid;grid-template-columns:1fr 430px;grid-template-rows:54px 1fr 46px}
.og::after{content:"";position:absolute;inset:3px;border:.75px solid var(--ink);pointer-events:none}
.og-top{grid-column:1/-1;display:flex;align-items:center;gap:16px;padding:0 18px;border-bottom:.75px solid var(--ink);font:400 13px var(--f-display);letter-spacing:.14em;text-transform:uppercase}
.og-top .mono{width:30px;height:30px}.og-top span:last-child{margin-left:auto;color:var(--ink-2)}
.og-main{padding:40px 40px 0 44px;display:flex;flex-direction:column;justify-content:center;gap:22px}
.og-name{font:400 104px/.9 var(--f-display);letter-spacing:.055em;text-transform:uppercase}
.og-tag{font:600 28px/1.3 var(--f-text)}
.og-stack{font:400 20px/1.5 var(--f-text);color:var(--ink-2)}
.og-fig{border-left:.75px solid var(--ink);display:grid;place-items:center;padding:14px 18px}
.og-fig svg{width:100%;height:100%}
.og-bot{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-top:.75px solid var(--ink);font:400 13px var(--f-display);letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2)}
</style>${F.defs()}<div class="og"><div class="og-top">${F.monogram()}<span>${d["strip.title"]}</span><span>${d["strip.sheet"]} 1 ${d["strip.of"]} 10</span></div>
<div class="og-main"><div class="og-name">Thiago<br>Diniz</div><div class="og-tag">${d.tag}</div><div class="og-stack">React · TypeScript · Java · Spring · AWS<br>${d["base.value"]}</div></div>
<div class="og-fig">${F.apparatus({ fig: "1", exploded: false, idPrefix: "og", label: false }).replace(/<g class="traveler">[\s\S]*?<\/animateMotion><\/g>/, "")}</div>
<div class="og-bot"><span>${d["inv.label"]}: Thiago Felipe Viana Diniz</span><span>thiago-fv-diniz.github.io/dev</span></div></div>`;
}

// monograma sobre o papel, com margem interna
const favSvg = (bg = true) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">${bg ? '<rect width="40" height="40" fill="#fbfbf8"/>' : ""}<g fill="none" stroke="#141414" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="1.5" width="37" height="37" stroke-width="1.8"/><rect x="4.5" y="4.5" width="31" height="31" stroke-width="0.9"/><path d="M9 12 H21 M15 12 V29 M22 12 H26 Q32 12 32 20.5 Q32 29 26 29 H22 Z" stroke-width="2"/></g></svg>`;

fs.writeFileSync(path.join(OUT, "favicon.svg"), favSvg(true) + "\n");
const iconPage = (px) => `<!doctype html><style>html,body{margin:0;background:#fbfbf8}svg{width:${px}px;height:${px}px;display:block}</style>${favSvg(true)}`;
shot("favicon-48", iconPage(48), 48, 48);
shot("apple-touch-icon", iconPage(180), 180, 180);
shot("icon-192", iconPage(192), 192, 192);
shot("icon-512", iconPage(512), 512, 512);
shot("og-pt", og(pt), 1200, 630);
shot("og-en", og(en), 1200, 630);
fs.rmSync(TMP, { recursive: true, force: true });
