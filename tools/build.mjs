// Gera index.html (PT), en/index.html (EN), 404.html, sitemap.xml e
// site.webmanifest a partir de src/index.html + tools/i18n.mjs + tools/figures.mjs.
// Uso: node tools/build.mjs   (sem dependências; os arquivos gerados são commitados)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as F from "./figures.mjs";
import { pt, en } from "./i18n.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Endereço público. Trocar aqui se o site ganhar domínio próprio.
const SITE = "https://thiago-fv-diniz.github.io/dev/";
const URLS = { pt: SITE, en: SITE + "en/" };
const UPDATED = "2026-09-25";
const MAIL = "thiagof.vdiniz@gmail.com";

/* ---------- ícones (traço único, 1.25) ---------- */
const ico = (d, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
const icons = {
  "icon.down": ico("M8 2.5v8 M4.5 7.2 8 10.7l3.5-3.5 M2.5 13.5h11"),
  "icon.arrow": ico("M2.5 8h10.5 M9.2 4.3 13 8l-3.8 3.7"),
  "icon.mail": ico("M2 4h12v8.5H2z M2.3 4.3 8 9l5.7-4.7"),
  "icon.copy": ico("M5.5 5.5h7.5v8H5.5z M3 10.5V2.5h7.5"),
  "icon.pause": ico("M5.5 3.5v9 M10.5 3.5v9", "i-pause"),
  "icon.play": ico("M5 3.2v9.6L12.5 8z", "i-play"),
};

/* ---------- linha do tempo (histórico) ---------- */
function timeline(d) {
  // meses desde jan/2023 até set/2026 = 44
  const X = (m) => 40 + (m / 44) * 920;
  const marks = [
    { m: 0, r: "A" },
    { m: 10, r: "B" },
    { m: 20, r: "C" },
  ];
  let s = `<svg class="timeline" viewBox="0 0 1000 96" aria-hidden="true" focusable="false">`;
  s += `<line class="tl-base" x1="40" y1="52" x2="960" y2="52" pathLength="1"/>`;
  for (let m = 0; m <= 44; m++) {
    const big = m % 12 === 0;
    s += `<line class="t" x1="${X(m)}" y1="52" x2="${X(m)}" y2="${big ? 62 : 57}"/>`;
    if (big) s += `<text class="tk" x="${X(m)}" y="82" text-anchor="middle">${2023 + m / 12}</text>`;
  }
  for (const k of marks) {
    s += `<g class="tl-rev" style="--d:${k.m / 44}"><circle class="o" cx="${X(k.m)}" cy="52" r="11"/><text class="tl-r" x="${X(k.m)}" y="57" text-anchor="middle">${k.r}</text></g>`;
  }
  s += `<g class="tl-now"><line class="now-l" x1="${X(44)}" y1="30" x2="${X(44)}" y2="62"/><text class="tk now-t" x="${X(44)}" y="22" text-anchor="middle">${d["hist.now"]}</text></g>`;
  return s + `</svg>`;
}

/* ---------- head ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function jsonld(key, d) {
  const url = URLS[key];
  const person = {
    "@type": "Person",
    "@id": SITE + "#person",
    name: "Thiago Felipe Viana Diniz",
    alternateName: "Thiago Diniz",
    givenName: "Thiago",
    familyName: "Diniz",
    jobTitle: key === "pt" ? "Desenvolvedor Full Stack" : "Full Stack Developer",
    description: d["meta.desc"],
    url: SITE,
    email: "mailto:" + MAIL,
    address: { "@type": "PostalAddress", addressLocality: "João Pessoa", addressRegion: "PB", addressCountry: "BR" },
    worksFor: { "@type": "Organization", name: "Lifters" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidade Estadual da Paraíba", alternateName: "UEPB" },
    knowsAbout: ["React", "TypeScript", "Next.js", "Angular", "Java", "Spring Boot", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Amazon Web Services"],
    sameAs: ["https://www.linkedin.com/in/thiago-diniz-dev", "https://github.com/thiago-fv-diniz"],
  };
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": url + "#page",
        url,
        name: d["meta.title"],
        description: d["meta.desc"],
        inLanguage: d.lang,
        dateModified: UPDATED,
        isPartOf: { "@id": SITE + "#site" },
        mainEntity: { "@id": SITE + "#person" },
        primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}assets/img/og-${key}.png`, width: 1200, height: 630 },
      },
      { "@type": "WebSite", "@id": SITE + "#site", url: SITE, name: "Thiago Diniz", inLanguage: ["pt-BR", "en"] },
      person,
    ],
  };
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

function head(key, d, base) {
  const url = URLS[key];
  const other = key === "pt" ? "en" : "pt";
  const img = `${SITE}assets/img/og-${key}.png`;
  return [
    `<title>${esc(d["meta.title"])}</title>`,
    `<meta name="description" content="${esc(d["meta.desc"])}">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="pt-BR" href="${URLS.pt}">`,
    `<link rel="alternate" hreflang="en" href="${URLS.en}">`,
    `<link rel="alternate" hreflang="x-default" href="${URLS.pt}">`,
    `<meta name="author" content="Thiago Felipe Viana Diniz">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<meta name="theme-color" content="#FBFBF8">`,
    `<meta name="color-scheme" content="light">`,
    `<meta property="og:type" content="profile">`,
    `<meta property="profile:first_name" content="Thiago">`,
    `<meta property="profile:last_name" content="Diniz">`,
    `<meta property="og:site_name" content="Thiago Diniz">`,
    `<meta property="og:title" content="${esc(d["meta.title"])}">`,
    `<meta property="og:description" content="${esc(d["meta.ogdesc"])}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="${d.locale}">`,
    `<meta property="og:locale:alternate" content="${key === "pt" ? en.locale : pt.locale}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:type" content="image/png">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(d["meta.ogalt"])}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(d["meta.title"])}">`,
    `<meta name="twitter:description" content="${esc(d["meta.ogdesc"])}">`,
    `<meta name="twitter:image" content="${img}">`,
    `<meta name="twitter:image:alt" content="${esc(d["meta.ogalt"])}">`,
    `<link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml">`,
    `<link rel="icon" href="${base}assets/img/favicon-48.png" sizes="48x48" type="image/png">`,
    `<link rel="apple-touch-icon" href="${base}assets/img/apple-touch-icon.png">`,
    `<link rel="manifest" href="${base}site.webmanifest">`,
    `<script type="application/ld+json">${jsonld(key, d)}</script>`,
  ].join("\n");
}

/* ---------- montagem ---------- */
function render(tpl, key, d, base) {
  const vars = {
    ...d,
    ...icons,
    base,
    head: head(key, d, base),
    defs: F.defs(),
    mono: F.monogram(),
    fig1: F.apparatus({ fig: "1", exploded: false, idPrefix: "f1" }),
    fig2: F.apparatus({ fig: "2", exploded: true, idPrefix: "f2" }),
    fig3: F.figOrion(),
    fig4: F.figInjection(),
    fig5: F.figShadow(),
    fig6: F.figCurve().replace("DADOS FICTÍCIOS", key === "pt" ? "DADOS FICTÍCIOS" : "FICTITIOUS DATA"),
    fig7: F.figGrid(),
    fig8: F.figTemplate(),
    timeline: timeline(d),
    seal: F.seal(d["seal.words"]),
    seal2: F.seal(d["seal.words"], "td-seal-arc2"),
  };
  const out = tpl.replace(/\{\{\{?\s*([\w.]+)\s*\}?\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`[${key}] chave ausente: ${k}`);
    return vars[k];
  });
  return out;
}

function notFound(d) {
  const base = "/dev/";
  return `<!doctype html>
<html lang="${d.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d["nf.title"])}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${base}assets/css/site.css">
</head>
<body class="nf">
<div class="frame" aria-hidden="true"></div>
<main class="sheet nf-sheet">
  ${F.monogram()}
  <h1>${esc(d["nf.h"])}</h1>
  <p>${esc(d["nf.p"])}</p>
  <p class="actions"><a class="btn btn-ink" href="${base}">${icons["icon.arrow"]}<span>${esc(d["nf.back"])}</span></a></p>
  <p class="sheet-mark">404</p>
</main>
</body>
</html>
`;
}

function sitemap() {
  const alt = `<xhtml:link rel="alternate" hreflang="pt-BR" href="${URLS.pt}"/><xhtml:link rel="alternate" hreflang="en" href="${URLS.en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${URLS.pt}"/>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${URLS.pt}</loc><lastmod>${UPDATED}</lastmod>${alt}</url>
  <url><loc>${URLS.en}</loc><lastmod>${UPDATED}</lastmod>${alt}</url>
</urlset>
`;
}

function manifest() {
  return (
    JSON.stringify(
      {
        name: "Thiago Diniz — Desenvolvedor Full Stack",
        short_name: "T. Diniz",
        start_url: "./",
        scope: "./",
        display: "browser",
        background_color: "#FBFBF8",
        theme_color: "#FBFBF8",
        icons: [
          { src: "assets/img/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "assets/img/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      null,
      2
    ) + "\n"
  );
}

const tpl = fs.readFileSync(path.join(ROOT, "src/index.html"), "utf8");
fs.writeFileSync(path.join(ROOT, "index.html"), render(tpl, "pt", pt, ""));
fs.mkdirSync(path.join(ROOT, "en"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "en/index.html"), render(tpl, "en", en, "../"));
fs.writeFileSync(path.join(ROOT, "404.html"), notFound(pt));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap());
fs.writeFileSync(path.join(ROOT, "site.webmanifest"), manifest());
console.log("ok: index.html, en/index.html, 404.html, sitemap.xml, site.webmanifest");
