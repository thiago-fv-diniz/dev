// Figuras da prancha de patente, geradas com geometria exata.
// Cada função devolve o markup SVG inline. Numerais são o único texto das
// figuras (a especificação explica cada um), então PT e EN compartilham o
// desenho; só os rótulos de controle vêm do dicionário.

const K = 0.34; // razão da elipse: inclinação da vista
const r2 = (n) => Math.round(n * 100) / 100;
const deg = (d) => (d * Math.PI) / 180;

/* ---------------- primitivas ---------------- */

function ellipse(cx, cy, rx, cls = "o") {
  return `<ellipse class="${cls}" cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(rx * K)}"/>`;
}

// Faixa frontal (meia elipse inferior) na altura y.
function frontArc(cx, y, rx, cls = "t") {
  return `<path class="${cls}" d="M${r2(cx - rx)} ${r2(y)} A${r2(rx)} ${r2(rx * K)} 0 0 0 ${r2(cx + rx)} ${r2(y)}"/>`;
}

// Linhas de sombreamento verticais, mais densas junto à borda direita
// (luz vinda de cima à esquerda, como nos desenhos de patente).
function shadeCyl(cx, y, rx, h, n = 9, from = 30, to = 86) {
  const ry = rx * K;
  let s = "";
  for (let i = 0; i < n; i++) {
    const th = deg(from + (i * (to - from)) / (n - 1));
    const dx = rx * Math.sin(th);
    const e = ry * Math.sqrt(Math.max(0, 1 - (dx / rx) ** 2));
    s += `<line class="s" x1="${r2(cx + dx)}" y1="${r2(y + e + 1.4)}" x2="${r2(cx + dx)}" y2="${r2(y + h + e - 1.4)}"/>`;
  }
  return s;
}

// Cilindro vertical: lateral (preenchida) primeiro, face de cima por último.
function cyl({ cx, y, rx, h, shade = 9, bands = [], bore = 0, rings = [], topExtra = "" }) {
  const ry = rx * K;
  let s = `<path class="o" d="M${r2(cx - rx)} ${r2(y)} V${r2(y + h)} A${r2(rx)} ${r2(ry)} 0 0 0 ${r2(cx + rx)} ${r2(y + h)} V${r2(y)} Z"/>`;
  for (const b of bands) s += frontArc(cx, y + b, rx);
  if (shade) s += shadeCyl(cx, y, rx, h, shade);
  s += ellipse(cx, y, rx);
  for (const rr of rings) s += ellipse(cx, y, rr, "t");
  s += topExtra;
  if (bore) {
    s += ellipse(cx, y, bore);
    // parede interna do furo (metade de trás, rebaixada)
    const d = Math.min(bore * K * 1.6, h);
    s += `<path class="t" d="M${r2(cx - bore)} ${r2(y)} A${r2(bore)} ${r2(bore * K)} 0 0 1 ${r2(cx + bore)} ${r2(y)}" transform="translate(0 ${r2(d)})" clip-path="none"/>`;
  }
  return s;
}

// Arruela / anel: cilindro baixo com furo grande.
function ring({ cx, y, rx, h, hole }) {
  return cyl({ cx, y, rx, h, shade: 5, bore: hole });
}

// Tronco de cone (bico de saída).
function frustum({ cx, y, rx1, rx2, h, shade = 6 }) {
  const ry1 = rx1 * K,
    ry2 = rx2 * K;
  let s = `<path class="o" d="M${r2(cx - rx1)} ${r2(y)} L${r2(cx - rx2)} ${r2(y + h)} A${r2(rx2)} ${r2(ry2)} 0 0 0 ${r2(cx + rx2)} ${r2(y + h)} L${r2(cx + rx1)} ${r2(y)} Z"/>`;
  for (let i = 0; i < shade; i++) {
    const th = deg(32 + (i * 52) / Math.max(1, shade - 1));
    const a = Math.sin(th);
    const x1 = cx + rx1 * a,
      x2 = cx + rx2 * a;
    const e1 = ry1 * Math.cos(th),
      e2 = ry2 * Math.cos(th);
    s += `<line class="s" x1="${r2(x1)}" y1="${r2(y + e1 + 1.2)}" x2="${r2(x2)}" y2="${r2(y + h + e2 - 1)}"/>`;
  }
  s += ellipse(cx, y, rx1);
  return s;
}

// Cilindro horizontal (porta lateral). dir = 1 para a direita, -1 para a esquerda.
function hcyl({ x0, cy, len, r, dir = 1 }) {
  const x1 = x0 + dir * len;
  const erx = r * K;
  let s = `<path class="o" d="M${r2(x0)} ${r2(cy - r)} H${r2(x1)} A${r2(erx)} ${r2(r)} 0 0 ${dir > 0 ? 1 : 0} ${r2(x1)} ${r2(cy + r)} H${r2(x0)} Z"/>`;
  for (let i = 0; i < 5; i++) {
    const th = deg(30 + i * 13);
    const yy = cy + r * Math.sin(th);
    s += `<line class="s" x1="${r2(x0)}" y1="${r2(yy)}" x2="${r2(x1)}" y2="${r2(yy)}"/>`;
  }
  s += `<ellipse class="o" cx="${r2(x1)}" cy="${r2(cy)}" rx="${r2(erx)}" ry="${r2(r)}"/>`;
  return s;
}

// Esfera com sombreamento em arcos concêntricos no quadrante de sombra.
function sphere(cx, cy, r, extra = "") {
  let s = `<g class="sphere"${extra}><circle class="o" cx="${r2(cx)}" cy="${r2(cy)}" r="${r}"/>`;
  for (let i = 1; i <= 3; i++) {
    const rr = r - i * (r / 4.2);
    const ox = cx - i * (r / 9),
      oy = cy - i * (r / 9);
    const a0 = deg(-10),
      a1 = deg(100);
    s += `<path class="s" d="M${r2(ox + rr * Math.cos(a0))} ${r2(oy + rr * Math.sin(a0))} A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(ox + rr * Math.cos(a1))} ${r2(oy + rr * Math.sin(a1))}"/>`;
  }
  return s + "</g>";
}

// Linha de chamada curva (em S, como nos desenhos de patente) do numeral até a peça.
function leader(ref, nx, ny, tx, ty, side) {
  const dx = tx - nx;
  const s = parseInt(ref, 10) % 2 ? 1 : -1;
  const bend = Math.max(7, Math.min(16, Math.abs(dx) * 0.1));
  const path = `M${r2(nx)} ${r2(ny)} C${r2(nx + dx * 0.38)} ${r2(ny + s * bend)} ${r2(nx + dx * 0.64)} ${r2(ty - s * bend)} ${r2(tx)} ${r2(ty)}`;
  return `<path class="ld" data-ref="${ref}" d="${path}"/><circle class="ld-end" data-ref="${ref}" cx="${r2(tx)}" cy="${r2(ty)}" r="2.4"/>`;
}

function numeral(ref, x, y, side) {
  const anchor = side === "l" ? "end" : "start";
  return `<text class="n" data-ref="${ref}" x="${r2(x)}" y="${r2(y + 5)}" text-anchor="${anchor}">${ref}</text>`;
}

// Numeral + chamada. side 'l' = numeral à esquerda do desenho (ancorado no fim, em nx);
// side 'L' = numeral à esquerda ancorado no início (em nx), a chamada sai depois dele.
function callout(ref, side, nx, ny, tx, ty) {
  const gap = 9;
  if (side === "L") {
    const w = String(ref).length * 10.2;
    return numeral(ref, nx, ny, "r") + leader(ref, nx + w + gap, ny, tx, ty, "l");
  }
  const lx = side === "l" ? nx + gap : nx - gap;
  return numeral(ref, nx, ny, side) + leader(ref, lx, ny, tx, ty, side);
}

function figLabel(txt, x, y, anchor = "middle") {
  return `<text class="fig" x="${x}" y="${y}" text-anchor="${anchor}">${txt}</text>`;
}

function rect(x, y, w, h, cls = "o", rx = 0, extra = "") {
  return `<rect class="${cls}" x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}"${rx ? ` rx="${rx}"` : ""}${extra}/>`;
}
function line(x1, y1, x2, y2, cls = "t", extra = "") {
  return `<line class="${cls}" x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}"${extra}/>`;
}
function arrow(x1, y1, x2, y2, cls = "t", extra = "") {
  return `<line class="${cls}" x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" marker-end="url(#td-arrow)"${extra}/>`;
}

/* ---------------- defs globais (hachuras, seta) ---------------- */

export function defs() {
  return `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
<pattern id="td-h45" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" class="hl"/></pattern>
<pattern id="td-h0" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" class="hl"/></pattern>
<pattern id="td-hx" width="2.8" height="2.8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="2.8" class="hl"/></pattern>
<marker id="td-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 1.2 L9.5 5 L0 8.8 Z" class="ah"/></marker>
</defs></svg>`;
}

/* ---------------- Fig. 1 / Fig. 2: o aparelho ---------------- */

// Grupos do aparelho, de cima para baixo. y = topo na montagem.
const CX = 300;
const G = [
  { id: "10", y: 0, h: 26 },
  { id: "12", y: 26, h: 10 },
  { id: "20", y: 36, h: 120 },
  { id: "22", y: 156, h: 8 },
  { id: "30", y: 164, h: 110 },
  { id: "34", y: 274, h: 12 },
  { id: "40", y: 286, h: 74 },
  { id: "50", y: 360, h: 110 },
];
export const APPARATUS = { gap: 62, groups: G.map((g, i) => ({ ...g, i })) };

function pixelGrid(cx, y, rx) {
  // grade de pixels na face de cima do disco, recortada pela elipse
  const ry = rx * K;
  const step = 14;
  let s = `<g class="grid">`;
  for (let x = cx - rx + step; x < cx + rx; x += step) {
    const dx = x - cx;
    const e = ry * Math.sqrt(Math.max(0, 1 - (dx / rx) ** 2));
    s += line(x, y - e, x, y + e, "g");
  }
  for (let yy = y - ry + step * K; yy < y + ry; yy += step * K) {
    const dy = (yy - y) / ry;
    const e = rx * Math.sqrt(Math.max(0, 1 - dy * dy));
    s += line(cx - e, yy, cx + e, yy, "g");
  }
  return s + "</g>";
}

function screws(cx, y, R, n = 4) {
  let s = "";
  const angs = [205, 250, 290, 335].slice(0, n);
  for (const a of angs) {
    const x = cx + R * Math.cos(deg(a));
    const yy = y - R * K * Math.sin(deg(a)) * -1; // metade frontal
    s += cyl({ cx: x, y: yy - 6, rx: 9, h: 6, shade: 3 });
    s += line(x - 5.5, yy - 6 - 0.4, x + 5.5, yy - 6 + 0.4, "t");
  }
  return s;
}

function queueTube(x, y, h, i) {
  // tubo de vidro da fila com mensagens (esferas pequenas) subindo
  const rx = 20;
  let s = `<g class="queue">`;
  s += hcyl({ x0: CX + 115, cy: y + 58, len: x - rx - (CX + 115) + 2, r: 9, dir: 1 });
  s += `<path class="o" d="M${x - rx} ${y} V${y + h} A${rx} ${rx * K} 0 0 0 ${x + rx} ${y + h} V${y} Z"/>`;
  s += `<clipPath id="td-q${i}"><rect x="${x - rx + 2}" y="${y + 2}" width="${rx * 2 - 4}" height="${h + 2}"/></clipPath>`;
  s += `<g clip-path="url(#td-q${i})"><g class="msgs">`;
  for (let k = 0; k < 9; k++) s += `<circle class="o" cx="${x}" cy="${y + h - k * 22}" r="7"/>`;
  s += `</g></g>`;
  s += ellipse(x, y, rx);
  s += `</g>`;
  return s;
}

function groupBody(g, qi) {
  const y = g.y;
  switch (g.id) {
    case "10":
      return cyl({ cx: CX, y, rx: 170, h: 26, shade: 11, topExtra: `<ellipse class="h0" cx="${CX}" cy="${y}" rx="150" ry="${r2(150 * K)}"/>` + ellipse(CX, y, 150, "t") + ellipse(CX, y, 158, "t") }) + ellipse(CX, y, 18);
    case "12":
      return ring({ cx: CX, y, rx: 120, h: 10, hole: 94 });
    case "20":
      return (
        hcyl({ x0: CX - 128, cy: y + 64, len: 40, r: 13, dir: -1 }) +
        cyl({ cx: CX, y, rx: 130, h: 120, shade: 12, bands: [28, 92], bore: 18, rings: [104] }) +
        hcyl({ x0: CX + 128, cy: y + 64, len: 40, r: 13, dir: 1 })
      );
    case "22":
      return ring({ cx: CX, y, rx: 112, h: 8, hole: 40 });
    case "30":
      return cyl({ cx: CX, y, rx: 115, h: 110, shade: 11, bands: [36, 72], bore: 18 }) + queueTube(CX + 205, y - 14, 150, qi);
    case "34":
      return ring({ cx: CX, y, rx: 92, h: 12, hole: 30 });
    case "40": {
      // placa de base + saia com aletas (dissipador)
      let s = cyl({ cx: CX, y: y + 34, rx: 176, h: 40, shade: 0 });
      // aletas: fendas verticais na saia frontal
      for (let k = -7; k <= 7; k++) {
        const a = deg(90 + k * 10);
        const x = CX + 176 * Math.cos(a) * -1;
        const e = 176 * K * Math.sin(a);
        s += line(x, y + 34 + e + 5, x, y + 74 + e - 5, "t");
      }
      s += cyl({ cx: CX, y, rx: 190, h: 34, shade: 12, bore: 18, rings: [150] });
      s += screws(CX, y, 170);
      return s;
    }
    case "50":
      return cyl({ cx: CX, y, rx: 34, h: 70, shade: 6 }) + frustum({ cx: CX, y: y + 70, rx1: 34, rx2: 15, h: 40 });
  }
  return "";
}

// Âncoras das chamadas (numeral, lado, alvo) em coordenadas do grupo.
function groupCallouts(g, exploded) {
  const y = g.y;
  if (!exploded && (g.id === "12" || g.id === "22" || g.id === "34")) return "";
  const L = 34,
    R = 566;
  switch (g.id) {
    case "10":
      return callout("10", "l", L, y - 30, CX - 150, y - 12);
    case "12":
      return callout("12", "r", R, y + 4, CX + 112, y + 8);
    case "20":
      return callout("20", "l", L, y + 110, CX - 124, y + 112) + callout("24", "r", R, y + 64, CX + 171, y + 64);
    case "22":
      return callout("22", "l", L, y + 2, CX - 104, y + 6);
    case "30":
      return callout("30", "l", L, y + 100, CX - 108, y + 96) + (exploded ? callout("32", "r", R, y + 110, CX + 222, y + 100) : callout("32", "r", R, y + 36, CX + 224, y + 30));
    case "34":
      return callout("34", "r", R, y + 18, CX + 86, y + 10);
    case "40":
      return callout("40", "l", L, y + 24, CX - 184, y + 20) + (exploded ? callout("42", "r", R, y - 4, CX + 150, y + 10) : callout("42", "r", R, y + 16, CX + 166, y - 26));
    case "50":
      return callout("50", "r", R, y + 92, CX + 26, y + 88);
  }
  return "";
}

// Caminho de retorno (resposta), à esquerda do conjunto.
export function returnPath(top, bottom) {
  const x = 70;
  return `M${CX} ${bottom} C${CX} ${bottom + 40} ${x} ${bottom + 40} ${x} ${bottom - 24} L${x} ${top + 64} C${x} ${top + 4} ${CX - 70} ${top} ${CX} ${top}`;
}

export function apparatus({ fig = "1", exploded = false, idPrefix = "a", label = true } = {}) {
  const gap = APPARATUS.gap;
  const n = G.length;
  const span = (n - 1) * gap;
  const top = exploded ? -92 : -70,
    baseH = 476;
  const H = exploded ? baseH + span + 222 : baseH + 170;
  const vb = `0 ${top} 600 ${H}`;
  let parts = "";
  // ordem de pintura: de baixo para cima (peças de cima ficam na frente)
  for (let i = n - 1; i >= 0; i--) {
    const g = { ...G[i], i };
    const off = exploded ? i * gap : 0;
    parts += `<g class="part" data-part="${g.id}" data-i="${i}" data-cy="${g.y + g.h / 2}"${off ? ` transform="translate(0 ${off})"` : ""}>${groupBody(g, idPrefix + i)}${groupCallouts(g, exploded)}</g>`;
  }
  const axisTop = top + 6,
    axisBot = exploded ? baseH + span + 30 : baseH + 24;
  const axis = `<line class="axis" x1="${CX}" y1="${axisTop}" x2="${CX}" y2="${axisBot}"/>`;
  const sph = sphere(CX, -44, 11, ` data-part="1"`);
  let s = `<svg class="apparatus" data-fig="${fig}" data-exploded="${exploded ? 1 : 0}" viewBox="${vb}" role="img" aria-labelledby="${idPrefix}-t" focusable="false">`;
  s += `<title id="${idPrefix}-t">${fig === "1" ? "FIG. 1" : "FIG. 2"}</title>`;
  s += axis;
  if (!exploded) {
    // Fig. 1: a requisição circula sem parar pelo conjunto e volta pelo retorno
    const rp = returnPath(-58, 490);
    s += `<path class="ret" id="${idPrefix}-loop" d="M${CX} -58 L${CX} 490 ${rp.replace(/^M[^C]+/, "")}"/>`;
    s += `<g class="traveler">${sphere(0, 0, 10)}<animateMotion dur="7.5s" repeatCount="indefinite" rotate="0" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#${idPrefix}-loop"/></animateMotion></g>`;
    s += `<g class="parts">${parts}</g>`;
    s += callout("1", "r", 566, -44, CX + 12, -44);
    s += callout("2", "l", 34, 230, 70, 230);
  } else {
    s += `<g class="parts">${parts}</g>`;
    const rb = baseH + span + 16;
    s += `<path class="ret draw" data-ref="2" d="${returnPath(-58, rb)}" pathLength="1"/>`;
    s += `<g class="ret-n">${numeral("2", 52, 470, "l")}</g>`;
    s += `<g class="traveler">${sph}</g>`;
    s += `<g class="traveler-n">${numeral("1", 334, -44, "r")}</g>`;
  }
  if (label) s += figLabel(`FIG. ${fig}`, CX, exploded ? baseH + span + 104 : baseH + 94);
  s += `</svg>`;
  return s;
}

/* ---------------- Fig. 3 — Orion: mesma folha, duas superfícies ---------------- */

export function figOrion() {
  let s = `<svg class="fig-svg" data-fig="3" viewBox="0 0 700 440" role="img" aria-labelledby="f3-t" focusable="false"><title id="f3-t">FIG. 3</title>`;
  // telefone
  s += `<g class="part" data-part="32">`;
  s += rect(40, 34, 156, 318, "o", 22);
  s += rect(50, 62, 136, 266, "t", 6);
  s += line(96, 48, 140, 48, "t");
  s += `</g>`;
  // gaveta (bottom sheet) com pílula
  s += `<g class="part" data-part="33m">`;
  s += `<path class="o" d="M50 178 Q50 168 60 168 H176 Q186 168 186 178 V328 H50 Z"/>`;
  s += rect(104, 175, 28, 4, "t", 2);
  s += `</g>`;
  // folha no mobile (posição A)
  s += `<g class="sheet-ghost" data-pos="m">${rect(62, 192, 112, 118, "gh")}</g>`;
  // monitor
  s += `<g class="part" data-part="33">`;
  s += rect(250, 56, 410, 270, "o", 8);
  s += rect(262, 68, 386, 22, "t");
  s += `<path class="o" d="M425 326 L416 364 H494 L485 326 Z"/>`;
  s += line(380, 366, 530, 366, "o");
  s += `</g>`;
  // registro de seções (barra lateral)
  s += `<g class="part" data-part="34">`;
  s += rect(262, 98, 100, 216, "t");
  for (let k = 0; k < 7; k++) s += rect(272, 110 + k * 28, k === 2 ? 80 : 64, 10, k === 2 ? "hx" : "t");
  s += `</g>`;
  s += `<g class="sheet-ghost" data-pos="d">${rect(378, 108, 262, 190, "gh")}</g>`;
  // projeções tracejadas
  s += `<g class="proj">${line(174, 192, 640, 108, "pj")}${line(174, 310, 640, 298, "pj")}${line(62, 192, 378, 108, "pj")}</g>`;
  // a folha (peça 31), que viaja entre as duas superfícies
  s += `<g class="part sheet" data-part="31" data-m="62,192,112,118" data-d="378,108,262,190"><g class="sheet-inner" transform="translate(378 108)">`;
  s += `<rect class="o" x="0" y="0" width="262" height="190" data-w/>`;
  s += `<rect class="h45" x="0" y="0" width="262" height="30"/>`;
  s += `<rect class="t" x="16" y="48" width="140" height="10"/><rect class="t" x="16" y="70" width="220" height="8"/><rect class="t" x="16" y="88" width="200" height="8"/><rect class="t" x="16" y="106" width="160" height="8"/>`;
  s += `<rect class="t" x="16" y="136" width="96" height="32"/><rect class="t" x="126" y="136" width="96" height="32"/>`;
  s += `<path class="o flag" d="M232 -12 V14 L248 7 L232 0"/>`;
  s += `</g></g>`;
  s += callout("31", "r", 684, 150, 641, 170);
  s += callout("32", "l", 24, 256, 62, 262);
  s += callout("33", "r", 684, 44, 620, 58);
  s += callout("34", "l", 234, 400, 300, 314);
  s += callout("35", "r", 684, 100, 624, 96);
  s += figLabel("FIG. 3", 350, 424);
  return s + `</svg>`;
}

/* ---------------- Fig. 4 — Smartico: caminho da injeção ---------------- */

export function figInjection() {
  const Y = 150,
    W = 88,
    gap = 26,
    x0 = 20;
  const xs = [0, 1, 2, 3, 4, 5].map((i) => x0 + i * (W + gap));
  let s = `<svg class="fig-svg" data-fig="4" viewBox="0 0 700 330" role="img" aria-labelledby="f4-t" focusable="false"><title id="f4-t">FIG. 4</title>`;
  // conectores
  let path = `M${xs[0] + W} ${Y}`;
  for (let i = 1; i < 6; i++) {
    s += arrow(xs[i - 1] + W + 2, Y, xs[i] - 4, Y, "t");
    path += ` L${xs[i]} ${Y} M${xs[i] + W} ${Y}`;
  }
  s += `<path id="f4-path" class="none" d="M${xs[0] + W / 2} ${Y} H${xs[5] + W / 2}"/>`;
  // 41 CMS
  let x = xs[0];
  s += `<g class="part st" data-part="41" data-x="${x + W / 2}">${rect(x, Y - 60, W, 120, "o")}${rect(x + 8, Y - 50, W - 16, 12, "h45")}${rect(x + 8, Y - 30, W - 16, 6, "t")}${rect(x + 8, Y - 18, W - 30, 6, "t")}${rect(x + 8, Y - 2, W - 16, 44, "db")}</g>`;
  // 42 fragmento HTML
  x = xs[1];
  s += `<g class="part st" data-part="42" data-x="${x + W / 2}">${`<path class="o" d="M${x} ${Y - 60} H${x + W - 18} L${x + W} ${Y - 42} V${Y + 60} H${x} Z"/><path class="t" d="M${x + W - 18} ${Y - 60} V${Y - 42} H${x + W}"/>`}<path class="o" d="M${x + 26} ${Y - 12} L${x + 14} ${Y} L${x + 26} ${Y + 12} M${x + 50} ${Y - 16} L${x + 38} ${Y + 16} M${x + 62} ${Y - 12} L${x + 74} ${Y} L${x + 62} ${Y + 12}"/></g>`;
  // 43 <img onerror>: moldura com canto quebrado
  x = xs[2];
  s += `<g class="part st" data-part="43" data-x="${x + W / 2}"><path class="o" d="M${x} ${Y - 44} H${x + W} V${Y + 10} L${x + W - 12} ${Y + 18} L${x + W - 4} ${Y + 28} L${x + W - 16} ${Y + 44} H${x} Z"/><path class="t" d="M${x + 10} ${Y + 30} L${x + 30} ${Y + 4} L${x + 44} ${Y + 20} L${x + 54} ${Y + 10} L${x + 70} ${Y + 30}"/><circle class="t" cx="${x + 64}" cy="${Y - 20}" r="8"/></g>`;
  // 44 IIFE: ( )( )
  x = xs[3];
  const pp = (cx, o) => `<path class="o" d="M${cx} ${Y - 24} Q${cx - 13 * o} ${Y} ${cx} ${Y + 24}"/>`;
  s += `<g class="part st" data-part="44" data-x="${x + W / 2}">${rect(x, Y - 44, W, 88, "o")}${pp(x + 22, 1)}${pp(x + 34, -1)}${pp(x + 54, 1)}${pp(x + 66, -1)}</g>`;
  // 45 SDK (tomada) + 46 relógio de timeout
  x = xs[4];
  s += `<g class="part st" data-part="45" data-x="${x + W / 2}">${rect(x + 14, Y - 30, W - 28, 60, "o", 6)}${rect(x + 30, Y - 42, 8, 12, "o")}${rect(x + W - 38, Y - 42, 8, 12, "o")}${rect(x + 24, Y - 14, W - 48, 30, "h45")}</g>`;
  s += `<g class="part clock" data-part="46"><circle class="o" cx="${x + W / 2}" cy="${Y - 94}" r="20"/><line class="o hand" x1="${x + W / 2}" y1="${Y - 94}" x2="${x + W / 2}" y2="${Y - 108}"/><line class="t" x1="${x + W / 2}" y1="${Y - 94}" x2="${x + W / 2 + 9}" y2="${Y - 94}"/>${line(x + W / 2, Y - 74, x + W / 2, Y - 46, "pj")}</g>`;
  // 47 render: cartões
  x = xs[5];
  s += `<g class="part st" data-part="47" data-x="${x + W / 2}">${rect(x, Y - 60, W, 120, "o")}${rect(x + 8, Y - 50, 34, 44, "t")}${rect(x + 46, Y - 50, 34, 44, "t")}${rect(x + 8, Y + 0, 34, 44, "t")}${rect(x + 46, Y + 0, 34, 44, "hx")}</g>`;
  // esqueleto (skeleton) sob o render: linhas pontilhadas
  s += `<g class="traveler">${sphere(xs[0] + W / 2, Y, 9)}</g>`;
  const nY = 262;
  ["41", "42", "43", "44", "45", "47"].forEach((ref, i) => {
    const cx = xs[i] + W / 2;
    s += numeral(ref, cx, nY + 18, "r").replace('text-anchor="start"', 'text-anchor="middle"');
    s += `<path class="ld" data-ref="${ref}" d="M${cx} ${nY} C${cx} ${nY - 20} ${cx + 8} ${Y + 76} ${cx + 8} ${Y + 62}"/>`;
  });
  s += callout("46", "l", xs[4] - 12, Y - 110, xs[4] + W / 2 - 20, Y - 100);
  s += figLabel("FIG. 4", 350, 318);
  return s + `</svg>`;
}

/* ---------------- Fig. 5 — shadow DOM ---------------- */

export function figShadow() {
  let s = `<svg class="fig-svg" data-fig="5" viewBox="0 0 700 420" role="img" aria-labelledby="f5-t" focusable="false"><title id="f5-t">FIG. 5</title>`;
  s += `<g class="part" data-part="51">${rect(24, 24, 652, 360, "o")}${rect(24, 24, 652, 30, "t")}`;
  for (let k = 0; k < 5; k++) s += rect(44, 78 + k * 22, 150 - k * 14, 8, "t");
  s += `</g>`;
  s += `<g class="part" data-part="52">${rect(300, 76, 350, 286, "o")}</g>`;
  s += `<g class="part" data-part="53"><rect class="shadow-b" x="316" y="108" width="318" height="238" rx="10"/><rect class="shadow-b" x="321" y="113" width="308" height="228" rx="7"/></g>`;
  // árvore interna
  s += `<g class="part" data-part="54">`;
  const root = [475, 140];
  const kids = [
    [390, 196],
    [475, 196],
    [560, 196],
  ];
  s += rect(root[0] - 34, root[1] - 12, 68, 24, "o");
  kids.forEach(([x, y]) => {
    s += line(root[0], root[1] + 12, x, y - 12, "t") + rect(x - 30, y - 12, 60, 24, "o");
  });
  s += `</g>`;
  // odds (botões) — 55 é a selecionada
  s += `<g class="odds">`;
  [0, 1, 2].forEach((k) => {
    const x = 356 + k * 90;
    s += line(475, 208, x + 34, 268, "t");
    s += `<g class="odd${k === 1 ? " sel" : ""}" data-part="${k === 1 ? "55" : ""}">${rect(x, 268, 68, 40, "o")}<rect class="odd-fill" x="${x + 4}" y="${272}" width="60" height="32"/></g>`;
  });
  s += `</g>`;
  // folha de estilo (56) que atravessa a fronteira
  s += rect(70, 214, 150, 118, "gh");
  s += `<g class="part plate" data-part="56"><g class="plate-inner">${rect(70, 214, 150, 118, "o")}${rect(70, 214, 150, 118, "h45")}${rect(84, 228, 122, 12, "o")}${rect(84, 250, 90, 8, "o")}${rect(84, 266, 106, 8, "o")}</g></g>`;
  s += `<path class="ret draw" data-ref="57" d="M222 272 C270 272 280 230 318 230" pathLength="1" marker-end="url(#td-arrow)"/>`;
  s += callout("51", "L", 52, 10, 112, 40);
  s += callout("52", "r", 690, 70, 650, 90);
  s += callout("53", "r", 690, 150, 634, 170);
  s += callout("54", "r", 690, 196, 590, 196);
  s += callout("55", "r", 690, 300, 514, 300);
  s += callout("56", "L", 40, 360, 96, 332);
  s += callout("57", "l", 250, 190, 270, 246);
  s += figLabel("FIG. 5", 350, 410);
  return s + `</svg>`;
}

/* ---------------- Fig. 6 — curva acumulada (dados fictícios) ---------------- */

// Série fictícia determinística (gerador com semente).
function seeded(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
export function curveData() {
  const days = 30,
    today = 18;
  const rnd = seeded(2026);
  const prev = [],
    real = [];
  let a = 0,
    b = 0;
  for (let d = 1; d <= days; d++) {
    const wk = d % 7 === 6 || d % 7 === 0 ? 1.35 : 1;
    a += (2.4 + rnd() * 1.4) * wk;
    prev.push(+a.toFixed(1));
    if (d <= today) {
      b += (2.6 + rnd() * 1.6) * wk;
      real.push(+b.toFixed(1));
    }
  }
  const rate = real[today - 1] / today;
  const proj = [];
  for (let d = today; d <= days; d++) proj.push(+(rate * d).toFixed(1));
  const target = 100;
  const need = +((target - real[today - 1]) / (days - today)).toFixed(2);
  return { days, today, prev, real, proj, target, need };
}

export function figCurve() {
  const D = curveData();
  const x0 = 72,
    x1 = 650,
    y0 = 330,
    y1 = 44;
  const max = 110;
  const X = (d) => x0 + ((d - 1) / (D.days - 1)) * (x1 - x0);
  const Y = (v) => y0 - (v / max) * (y0 - y1);
  let s = `<svg class="fig-svg curve" data-fig="6" viewBox="0 0 700 400" role="img" aria-labelledby="f6-t" focusable="false"><title id="f6-t">FIG. 6</title>`;
  s += `<rect class="bg" x="0" y="0" width="700" height="400"/>`;
  // eixos e marcas
  s += line(x0, y0, x1 + 10, y0, "o") + line(x0, y0, x0, y1 - 10, "o");
  for (let d = 1; d <= D.days; d++) {
    const big = d === 1 || d % 5 === 0;
    s += line(X(d), y0, X(d), y0 + (big ? 8 : 4), "t");
    if (big) s += `<text class="tk" x="${r2(X(d))}" y="${y0 + 24}" text-anchor="middle">${d}</text>`;
  }
  for (let v = 0; v <= 100; v += 25) {
    s += line(x0 - 6, Y(v), x0, Y(v), "t");
    s += `<text class="tk" x="${x0 - 12}" y="${r2(Y(v) + 4)}" text-anchor="end">${v}</text>`;
    if (v) s += line(x0, Y(v), x1, Y(v), "gr");
  }
  // meta (65)
  s += `<line class="target" x1="${x0}" y1="${r2(Y(D.target))}" x2="${x1}" y2="${r2(Y(D.target))}"/>`;
  // mês anterior (63)
  s += `<polyline class="prev" data-ref="63" points="${D.prev.map((v, i) => `${r2(X(i + 1))},${r2(Y(v))}`).join(" ")}"/>`;
  // área realizada hachurada + linha (61)
  const rp = D.real.map((v, i) => `${r2(X(i + 1))},${r2(Y(v))}`).join(" ");
  s += `<polygon class="area" points="${r2(X(1))},${y0} ${rp} ${r2(X(D.today))},${y0}"/>`;
  s += `<polyline class="real" data-ref="61" points="${rp}"/>`;
  // projeção (62)
  s += `<polyline class="proj-l" data-ref="62" points="${D.proj.map((v, i) => `${r2(X(D.today + i))},${r2(Y(v))}`).join(" ")}"/>`;
  // triângulo de inclinação: necessário por dia (64)
  const tx = X(D.today),
    ty = Y(D.real[D.today - 1]);
  const run = X(D.today + 4) - tx,
    rise = (D.need * 4 * (y0 - y1)) / max;
  s += `<path class="slope" data-ref="64" d="M${r2(tx)} ${r2(ty)} L${r2(tx + run)} ${r2(ty - rise)} M${r2(tx)} ${r2(ty)} H${r2(tx + run)} V${r2(ty - rise)}"/>`;
  s += `<circle class="today" cx="${r2(tx)}" cy="${r2(ty)}" r="4"/>`;
  // leitura (preenchida via JS)
  s += `<g class="cross" aria-hidden="true"><line class="cx-l" x1="0" y1="${y1 - 6}" x2="0" y2="${y0}"/><circle class="cx-p" r="4" cx="0" cy="0"/></g>`;
  s += `<rect class="hit" x="${x0}" y="${y1 - 10}" width="${x1 - x0}" height="${y0 - y1 + 10}"/>`;
  s += callout("61", "L", 118, 150, r2(X(9)), r2(Y(D.real[8])));
  s += callout("62", "r", 662, 96, r2(X(27)), r2(Y(D.proj[9])) + 1);
  s += callout("63", "r", 662, 176, r2(X(24)), r2(Y(D.prev[23])));
  s += callout("64", "r", 662, 236, r2(tx + run - 4), r2(ty - rise / 2));
  s += callout("65", "r", 662, 52, r2(x1 - 12), r2(Y(D.target)));
  s += `<text class="stamp" x="${x0 + 12}" y="${y1 + 8}">DADOS FICTÍCIOS</text>`;
  s += figLabel("FIG. 6", 350, 390);
  s += `<script type="application/json" class="curve-data">${JSON.stringify(D)}</script>`;
  return s + `</svg>`;
}

/* ---------------- Fig. 7 — Sentinela: grade de painéis ---------------- */

export const GRID = { x: 40, y: 50, cols: 12, rows: 6, cw: 51, rh: 48 };
export const PANELS = [
  { id: "a", c: 0, r: 0, w: 6, h: 3, kind: "line" },
  { id: "b", c: 6, r: 0, w: 6, h: 2, kind: "bars" },
  { id: "c", c: 6, r: 2, w: 3, h: 2, kind: "pie" },
  { id: "d", c: 9, r: 2, w: 3, h: 2, kind: "anom" },
  { id: "e", c: 0, r: 3, w: 6, h: 3, kind: "curve" },
  { id: "f", c: 6, r: 4, w: 6, h: 2, kind: "bars2" },
];

function panelGlyph(kind, w, h) {
  const m = 12;
  switch (kind) {
    case "line": {
      const pts = [0.1, 0.35, 0.28, 0.55, 0.48, 0.7, 0.62, 0.8].map((v, i, a) => `${r2(m + (i / (a.length - 1)) * (w - 2 * m))},${r2(h - m - v * (h - 2 * m - 14))}`);
      return `<polyline class="t" points="${pts.join(" ")}"/>`;
    }
    case "bars":
    case "bars2": {
      let s = "";
      const n = 9,
        bw = (w - 2 * m) / n;
      const hs = kind === "bars" ? [0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.55, 0.65, 0.75] : [0.7, 0.5, 0.65, 0.4, 0.8, 0.6, 0.45, 0.7, 0.5];
      hs.forEach((v, i) => {
        const bh = v * (h - 2 * m - 14);
        s += `<rect class="${i === 5 ? "hx" : "t"}" x="${r2(m + i * bw + 2)}" y="${r2(h - m - bh)}" width="${r2(bw - 4)}" height="${r2(bh)}"/>`;
      });
      return s;
    }
    case "pie": {
      const cx = w / 2,
        cy = h / 2 + 4,
        r = Math.min(w, h) / 2 - 16;
      const a = (t) => [cx + r * Math.cos(deg(t)), cy + r * Math.sin(deg(t))];
      const [ax, ay] = a(-90),
        [bx, by] = a(40),
        [cx2, cy2] = a(160);
      return `<circle class="t" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}"/><path class="h45" d="M${r2(cx)} ${r2(cy)} L${r2(ax)} ${r2(ay)} A${r2(r)} ${r2(r)} 0 0 1 ${r2(bx)} ${r2(by)} Z"/>${line(cx, cy, cx2, cy2, "t")}`;
    }
    case "anom":
      return `<g class="anom">${[0, 1, 2].map((k) => `<circle class="t lamp" data-k="${k}" cx="${r2(w / 2 - 34 + k * 34)}" cy="${r2(h / 2 - 2)}" r="11"/>`).join("")}<text class="tk anom-t" x="${r2(w / 2)}" y="${r2(h - 12)}" text-anchor="middle">—</text></g>`;
    case "curve": {
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        pts.push(`${r2(m + t * (w - 2 * m))},${r2(h - m - (0.15 + 0.7 * Math.pow(t, 1.6)) * (h - 2 * m - 14))}`);
      }
      return `<polyline class="t" points="${pts.join(" ")}"/>`;
    }
  }
  return "";
}

export function figGrid() {
  const { x, y, cols, rows, cw, rh } = GRID;
  let s = `<svg class="fig-svg grid-fig" data-fig="7" viewBox="0 0 700 400" role="img" aria-labelledby="f7-t" focusable="false"><title id="f7-t">FIG. 7</title>`;
  s += `<g class="part" data-part="72">${rect(x, y, cols * cw, rows * rh, "o")}`;
  for (let c = 1; c < cols; c++) s += line(x + c * cw, y, x + c * cw, y + rows * rh, "gr");
  for (let r = 1; r < rows; r++) s += line(x, y + r * rh, x + cols * cw, y + r * rh, "gr");
  for (let c = 0; c < cols; c++) s += `<text class="tk" x="${x + c * cw + cw / 2}" y="${y - 10}" text-anchor="middle">${c + 1}</text>`;
  s += `</g><g class="panels">`;
  for (const p of PANELS) {
    const w = p.w * cw,
      h = p.h * rh;
    s += `<g class="panel${p.kind === "anom" ? " part" : ""}" data-id="${p.id}" data-c="${p.c}" data-r="${p.r}" data-w="${p.w}" data-h="${p.h}"${p.kind === "anom" ? ' data-part="74"' : ""} transform="translate(${x + p.c * cw} ${y + p.r * rh})">`;
    s += `<rect class="o pbox" x="3" y="3" width="${w - 6}" height="${h - 6}"/>`;
    s += `<rect class="t" x="3" y="3" width="${w - 6}" height="12"/>`;
    s += panelGlyph(p.kind, w, h);
    s += `<path class="h45 handle" d="M${w - 4} ${h - 16} L${w - 4} ${h - 4} L${w - 16} ${h - 4} Z"/>`;
    s += `</g>`;
  }
  s += `</g>`;
  s += callout("71", "L", 4, 380, 58, 330);
  s += callout("72", "r", 690, 40, x + cols * cw - 10, y + 6);
  s += callout("73", "r", 690, 200, x + 6 * cw - 8, y + 3 * rh - 8);
  s += callout("74", "r", 690, 260, x + 12 * cw - 20, y + 3.2 * rh);
  s += figLabel("FIG. 7", 350, 392);
  return s + `</svg>`;
}

/* ---------------- Fig. 8 — Jogo Responsável: um gabarito, três marcas ---------------- */

function jrSheet(i, x, y) {
  const W = 250,
    H = 300;
  const hatch = ["h45", "h0", "hx"][i];
  let s = `<g class="jr-sheet" data-i="${i}" transform="translate(${x} ${y})">`;
  s += rect(0, 0, W, H, "o");
  s += `<rect class="${hatch} brand" x="0" y="0" width="${W}" height="34"/>`;
  s += rect(16, 48, 150, 12, "t");
  s += rect(16, 68, 210, 7, "t");
  s += `<g class="acc">`;
  for (let k = 0; k < 4; k++) {
    const yy = 92 + k * 30;
    s += rect(16, yy, W - 32, 22, "t") + `<path class="t" d="M${W - 36} ${yy + 8} L${W - 30} ${yy + 14} L${W - 24} ${yy + 8}"/>`;
  }
  s += `</g>`;
  s += `<g class="help">${rect(16, 222, 104, 60, "o")}${rect(130, 222, 104, 60, "o")}<text class="big" x="68" y="262" text-anchor="middle">192</text><text class="big" x="182" y="262" text-anchor="middle">188</text></g>`;
  s += `</g>`;
  return s;
}

export function figTemplate() {
  let s = `<svg class="fig-svg" data-fig="8" viewBox="0 0 700 420" role="img" aria-labelledby="f8-t" focusable="false"><title id="f8-t">FIG. 8</title>`;
  s += `<g class="jr-stack">`;
  s += jrSheet(2, 330, 30) + jrSheet(1, 230, 60) + jrSheet(0, 130, 90);
  s += `</g>`;
  s += callout("81", "L", 30, 110, 132, 120);
  s += callout("82", "r", 690, 44, 578, 46);
  s += callout("83", "L", 30, 250, 150, 230);
  s += callout("84", "L", 30, 350, 170, 352);
  s += figLabel("FIG. 8", 350, 412);
  return s + `</svg>`;
}

/* ---------------- selo DEFERIDO / 200 ---------------- */

export function seal(words, id = "td-seal-arc") {
  const r = 78;
  return `<svg class="seal-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
<defs><path id="${id}" d="M100 100 m-${r} 0 a${r} ${r} 0 1 1 ${r * 2} 0 a${r} ${r} 0 1 1 -${r * 2} 0"/></defs>
<circle class="sl" cx="100" cy="100" r="94"/><circle class="sl thin" cx="100" cy="100" r="88"/><circle class="sl thin" cx="100" cy="100" r="58"/>
<text class="seal-t"><textPath href="#${id}" startOffset="0" textLength="${Math.round(2 * Math.PI * r - 6)}" lengthAdjust="spacingAndGlyphs">${words}</textPath></text>
<text class="seal-n" x="100" y="112" text-anchor="middle">200</text>
<text class="seal-w" x="100" y="136" text-anchor="middle">${words.split(" ")[0]}</text>
</svg>`;
}

// Monograma TD desenhado (favicon e carimbo).
export function monogram(cls = "mono") {
  return `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect class="o" x="1.5" y="1.5" width="37" height="37"/><rect class="t" x="4.5" y="4.5" width="31" height="31"/><path class="o" d="M9 12 H21 M15 12 V29 M22 12 H26 Q32 12 32 20.5 Q32 29 26 29 H22 Z"/></svg>`;
}
