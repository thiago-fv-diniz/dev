/* Thiago Diniz — prancha de patente. Vanilla, sem dependências. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = matchMedia("(pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var LANG = doc.lang || "pt-BR";
  var TD = (window.TD = { paused: doc.classList.contains("paused"), rm: RM });

  function onceVisible(el, fn, threshold) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) return fn();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: threshold || 0.35 });
    io.observe(el);
  }

  /* ---------- pausa das animações contínuas (WCAG 2.2.2) ---------- */
  var pauseBtn = $(".strip-pause");
  function applyPause(p) {
    TD.paused = p;
    doc.classList.toggle("paused", p);
    $$("svg.apparatus[data-fig='1']").forEach(function (s) { try { p ? s.pauseAnimations() : s.unpauseAnimations(); } catch (e) {} });
    if (pauseBtn) {
      var label = p ? pauseBtn.getAttribute("data-on") : pauseBtn.getAttribute("data-off");
      pauseBtn.setAttribute("aria-pressed", p ? "true" : "false");
      pauseBtn.title = label;
      $(".vh", pauseBtn).textContent = label;
    }
    document.dispatchEvent(new CustomEvent("td:pause", { detail: p }));
  }
  if (pauseBtn) pauseBtn.addEventListener("click", function () {
    var p = !TD.paused;
    applyPause(p);
    try { localStorage.setItem("td-paused", p ? "1" : "0"); } catch (e) {}
  });
  if (RM) $$("svg.apparatus[data-fig='1']").forEach(function (s) { try { s.pauseAnimations(); s.setCurrentTime(0); } catch (e) {} });
  else if (TD.paused) applyPause(true);

  /* ---------- nome: scramble com glifos de desenho técnico ---------- */
  var GLYPHS = "0123456789±§¶°×#";
  var ltrs = [];
  $$("#name .row").forEach(function (row) {
    var w = row.textContent;
    row.textContent = "";
    for (var i = 0; i < w.length; i++) {
      var s = document.createElement("span");
      s.className = "ltr";
      s.textContent = w[i];
      s.dataset.ch = w[i];
      row.appendChild(s);
      ltrs.push(s);
    }
  });
  function scramble() {
    if (RM) return;
    ltrs.forEach(function (el, i) {
      var frames = 8 + ((i * 7) % 6), n = 0;
      el.classList.add("scr");
      el.textContent = GLYPHS[(i * 5) % GLYPHS.length];
      setTimeout(function cycle() {
        if (n++ < frames) { el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; setTimeout(cycle, 32); }
        else { el.textContent = el.dataset.ch; el.classList.remove("scr"); }
      }, 120 + i * 48);
    });
  }

  /* ---------- boot: o plotter desenha a moldura ---------- */
  var boot = $("#boot"), bootDone = false;
  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    try { sessionStorage.setItem("td-booted", "1"); } catch (e) {}
    if (boot) {
      boot.classList.add("done");
      setTimeout(function () { boot.style.display = "none"; }, 700);
    }
    setTimeout(scramble, 180);
    document.dispatchEvent(new Event("td:ready"));
  }
  var skipBoot = RM || doc.classList.contains("booted") || !boot;
  if (skipBoot) { bootDone = true; if (boot) boot.style.display = "none"; setTimeout(scramble, 60); document.dispatchEvent(new Event("td:ready")); }
  else {
    var lines = $$(".boot-log span", boot), pct = $(".boot-pct", boot), t0 = performance.now();
    [0, 240, 480, 780].forEach(function (d, i) { setTimeout(function () { if (lines[i]) lines[i].classList.add("on"); }, d); });
    (function tick() {
      if (bootDone) return;
      var p = Math.min(1, (performance.now() - t0) / 1150);
      pct.textContent = Math.floor(p * 100);
      if (p < 1) requestAnimationFrame(tick); else setTimeout(finishBoot, 160);
    })();
    boot.addEventListener("click", finishBoot);
    addEventListener("keydown", finishBoot, { once: true });
  }

  /* ---------- carimbo: folha atual + progresso ---------- */
  var strip = $(".strip"), sheetN = $(".sheet-n"), navLinks = $$(".strip-nav a");
  var sheets = $$("[data-sheet]");
  if ("IntersectionObserver" in window && sheetN) {
    var ioS = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target.getAttribute("data-sheet");
        sheetN.textContent = n;
        var id = e.target.closest("#cases") ? "cases" : e.target.id;
        navLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sheets.forEach(function (s) { ioS.observe(s); });
  }
  var ticking = false;
  function onScrollStrip() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = doc.scrollHeight - innerHeight;
      strip.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0);
      ticking = false;
    });
  }
  if (strip) { addEventListener("scroll", onScrollStrip, { passive: true }); onScrollStrip(); }

  /* ---------- numerais de referência ↔ peças ---------- */
  var GROUP = { "10": ["10", "12"], "20": ["20", "22", "24"], "30": ["30", "32", "34"], "40": ["40", "42"], "50": ["50"], "1": ["1"], "2": ["2"] };
  function scopeOf(el) {
    var sec = el.closest("section, article");
    return sec || document;
  }
  function mark(scope, ref, on) {
    $$('[data-ref="' + ref + '"], [data-part="' + ref + '"]', scope).forEach(function (n) { n.classList.toggle("exam", on); });
  }
  function hoverBind(el) {
    var ref = el.getAttribute("data-ref"), scope = scopeOf(el);
    el.addEventListener("pointerenter", function () { mark(scope, ref, true); });
    el.addEventListener("pointerleave", function () { mark(scope, ref, false); });
  }
  $$(".ref[data-ref], .reflist li[data-ref]").forEach(hoverBind);
  $$("svg text.n[data-ref]").forEach(hoverBind);

  /* ---------- Fig. 2: vista explodida guiada pelo scroll ---------- */
  (function () {
    var sec = $("#fig-2"), svg = sec && $("svg.apparatus[data-exploded='1']", sec);
    if (!svg) return;
    var parts = $$(".parts > .part", svg), paras = $$(".para", sec);
    var GAP = 62, N = parts.length, SPAN = (N - 1) * GAP;
    var trav = $(".traveler", svg), travN = $(".traveler-n", svg), seal2 = $(".fig2-seal", sec), stamped = false;
    var ret = $(".ret.draw", svg), live = null;
    if (ret) {
      live = ret.cloneNode(false);
      live.setAttribute("class", "ret-live");
      live.removeAttribute("data-ref");
      ret.parentNode.insertBefore(live, ret.nextSibling);
    }
    var retLen = ret ? ret.getTotalLength() : 0;
    var byId = {};
    parts.forEach(function (p) { byId[p.getAttribute("data-part")] = p; });
    var cur = { e: 1, x: 300, y: -44 }, tgt = { e: 1, x: 300, y: -44 }, step = -1, raf = null, retF = 0, retT = 0;
    if (RM) return; // sem JS de movimento: a vista estática já sai explodida
    cur.e = tgt.e = 0;
    function offset(i, e) { return i * GAP * e + (SPAN * (1 - e)) / 2; }
    function centerY(id, e) {
      var p = byId[id];
      if (!p) return -44;
      return +p.getAttribute("data-cy") + offset(+p.getAttribute("data-i"), e);
    }
    function applyParts(e) {
      parts.forEach(function (p) { p.setAttribute("transform", "translate(0 " + offset(+p.getAttribute("data-i"), e).toFixed(2) + ")"); });
      // montado, os numerais das peças internas se sobrepõem: eles surgem com a separação
      svg.style.setProperty("--nv", clamp((e - 0.55) / 0.4, 0, 1).toFixed(3));
    }
    function setStep(s) {
      if (s === step) return;
      step = s;
      paras.forEach(function (p, i) { p.classList.toggle("on", i === s); });
      $$(".exam", svg).forEach(function (n) { n.classList.remove("exam"); });
      var para = paras[s], id = para && para.getAttribute("data-part");
      (GROUP[id] || []).forEach(function (r) { mark(svg, r, true); });
    }
    var stage = $(".fig2-stage", sec);
    function measure() {
      var vh = innerHeight, mid = vh * 0.5;
      var sr = stage.getBoundingClientRect(), stacked = sr.width > sec.getBoundingClientRect().width * 0.9;
      // no mobile a figura fica fixa no topo: o "meio" é o da área de leitura abaixo dela
      if (stacked && sr.bottom > 0) mid = sr.bottom + (vh - sr.bottom) * 0.45;
      var r = sec.getBoundingClientRect();
      var p0 = paras[0].getBoundingClientRect();
      // explode enquanto o primeiro parágrafo sobe até o meio da tela
      tgt.e = clamp((vh * 0.9 - p0.top) / (vh * 0.55), 0, 1);
      var s = 0;
      for (var i = 0; i < paras.length; i++) if (paras[i].getBoundingClientRect().top < mid) s = i;
      setStep(s);
      var id = paras[s].getAttribute("data-part");
      if (s === paras.length - 1) {
        var pr = paras[s].getBoundingClientRect();
        retT = clamp((mid - pr.top) / (stacked ? (vh - sr.bottom) * 0.34 : vh * 0.38), 0, 1);
      } else retT = 0;
      if (s === 0 || !id) { tgt.x = 300; tgt.y = -44; }
      else if (id !== "2") { tgt.x = 300; tgt.y = centerY(id, 1); }
      if (r.bottom < 0 || r.top > vh) return false;
      return true;
    }
    function frame() {
      var k = 0.14;
      cur.e = lerp(cur.e, tgt.e, k);
      retF = lerp(retF, retT, k);
      applyParts(cur.e);
      var tx = tgt.x, ty = tgt.y;
      if (retF > 0.002 && ret) {
        var pt = ret.getPointAtLength(retF * retLen);
        tx = pt.x; ty = pt.y;
      } else if (step > 0 && paras[step].getAttribute("data-part") !== "2") {
        ty = centerY(paras[step].getAttribute("data-part"), cur.e);
      }
      cur.x = lerp(cur.x, tx, 0.18);
      cur.y = lerp(cur.y, ty, 0.18);
      trav.setAttribute("transform", "translate(" + (cur.x - 300).toFixed(2) + " " + (cur.y + 44).toFixed(2) + ")");
      if (travN) travN.setAttribute("transform", "translate(" + (cur.x - 300).toFixed(2) + " " + (cur.y + 44).toFixed(2) + ")");
      if (live) live.style.strokeDashoffset = (1 - retF).toFixed(4);
      // o pedido volta com 200: o selo DEFERIDO é carimbado na própria folha 2
      if (seal2 && !stamped && retF > 0.9) { stamped = true; seal2.classList.add("stamped"); }
      else if (seal2 && stamped && retF < 0.35) { stamped = false; seal2.classList.remove("stamped"); }
      var settled = Math.abs(cur.e - tgt.e) < 0.001 && Math.abs(cur.y - ty) < 0.2 && Math.abs(cur.x - tx) < 0.2 && Math.abs(retF - retT) < 0.001;
      raf = settled ? null : requestAnimationFrame(frame);
    }
    function kick() { if (measure() && !raf) raf = requestAnimationFrame(frame); }
    applyParts(0);
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    document.addEventListener("td:ready", kick);
    kick();
  })();

  /* ---------- helpers de animação por tempo ---------- */
  function tween(ms, fn, done, ease) {
    var t0 = performance.now();
    ease = ease || function (t) { return 1 - Math.pow(1 - t, 3); };
    (function f(now) {
      var t = clamp((now - t0) / ms, 0, 1);
      fn(ease(t));
      if (t < 1) requestAnimationFrame(f); else if (done) done();
    })(t0);
  }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  /* ---------- Fig. 3: a folha entre mobile e desktop ---------- */
  (function () {
    var fig = $('[data-demo="orion"]'); if (!fig) return;
    var svg = $("svg", fig), sheet = $(".sheet-inner", svg), btn = $('[data-act="orion"]', fig);
    var D = [378, 108, 262, 190], M = [62, 192, 112, 118], state = "d", busy = false;
    function place(r) { sheet.setAttribute("transform", "translate(" + r[0] + " " + r[1] + ") scale(" + (r[2] / 262).toFixed(4) + " " + (r[3] / 190).toFixed(4) + ")"); }
    function go(to) {
      if (busy || to === state) return Promise.resolve();
      busy = true;
      var a = state === "d" ? D : M, b = to === "d" ? D : M;
      mark(svg, "31", true); mark(svg, to === "d" ? "33" : "32", true);
      return new Promise(function (res) {
        tween(RM ? 1 : 820, function (t) { place([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)]); }, function () {
          state = to; busy = false;
          btn.textContent = state === "d" ? btn.getAttribute("data-a") : btn.getAttribute("data-b");
          setTimeout(function () { mark(svg, "31", false); mark(svg, "32", false); mark(svg, "33", false); }, 700);
          res();
        }, function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; });
      });
    }
    btn.addEventListener("click", function () { go(state === "d" ? "m" : "d"); });
    if (!RM) onceVisible(fig, function () { if (TD.paused) return; sleep(500).then(function () { return go("m"); }).then(function () { return sleep(1200); }).then(function () { return go("d"); }); }, 0.55);
  })();

  /* ---------- Fig. 4: caminho da injeção ---------- */
  (function () {
    var fig = $('[data-demo="inject"]'); if (!fig) return;
    var svg = $("svg", fig), trav = $(".traveler", svg), btn = $('[data-act="inject"]', fig);
    var st = $$(".st", svg), clock = $('[data-part="46"]', svg), hand = $(".hand", svg);
    var x0 = +st[0].getAttribute("data-x"), busy = false;
    function at(x) { trav.setAttribute("transform", "translate(" + (x - x0).toFixed(1) + " 0)"); }
    function run() {
      if (busy) return; busy = true;
      svg.classList.add("run");
      var chain = Promise.resolve();
      st.forEach(function (s, i) {
        chain = chain.then(function () {
          var from = i ? +st[i - 1].getAttribute("data-x") : x0, to = +s.getAttribute("data-x");
          return new Promise(function (res) { tween(i ? 520 : 1, function (t) { at(lerp(from, to, t)); }, res, function (t) { return t * t * (3 - 2 * t); }); });
        }).then(function () {
          s.classList.add("exam");
          if (s.getAttribute("data-part") === "45") {
            clock.classList.add("exam");
            var cx = +hand.getAttribute("x1"), cy = +hand.getAttribute("y1");
            return new Promise(function (res) { tween(900, function (t) { hand.setAttribute("transform", "rotate(" + (t * 300).toFixed(1) + " " + cx + " " + cy + ")"); }, res, function (t) { return t; }); });
          }
          return sleep(160);
        });
      });
      chain.then(function () { return sleep(1400); }).then(function () {
        st.forEach(function (s) { s.classList.remove("exam"); }); clock.classList.remove("exam");
        hand.removeAttribute("transform"); svg.classList.remove("run"); at(x0); busy = false;
      });
    }
    btn.addEventListener("click", run);
    if (!RM) onceVisible(fig, function () { if (!TD.paused) setTimeout(run, 400); }, 0.55);
  })();

  /* ---------- Fig. 5: estilo atravessa o shadow root ---------- */
  (function () {
    var fig = $('[data-demo="shadow"]'); if (!fig) return;
    var svg = $("svg", fig), btn = $('[data-act="shadow"]', fig);
    function set(on) {
      svg.classList.toggle("styled", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? btn.getAttribute("data-b") : btn.getAttribute("data-a");
    }
    btn.addEventListener("click", function () { set(!svg.classList.contains("styled")); });
    if (!RM) onceVisible(fig, function () { if (!TD.paused) setTimeout(function () { set(true); }, 450); }, 0.55);
  })();

  /* ---------- Fig. 6: curva acumulada + tema escuro ---------- */
  (function () {
    var fig = $('[data-demo="curve"]'); if (!fig) return;
    var svg = $("svg", fig), dataEl = $(".curve-data", svg), D = JSON.parse(dataEl.textContent);
    var btn = $('[data-act="theme"]', fig), out = $(".readout", fig), cross = $(".cross", svg);
    var cl = $(".cx-l", svg), cp = $(".cx-p", svg), hit = $(".hit", svg), real = $(".real", svg);
    var x0 = 72, x1 = 650, y0 = 330, y1 = 44, max = 110;
    var X = function (d) { return x0 + ((d - 1) / (D.days - 1)) * (x1 - x0); };
    var Y = function (v) { return y0 - (v / max) * (y0 - y1); };
    var nf = new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    var L = fig.dataset, base = out.textContent;
    btn.addEventListener("click", function () {
      var on = !fig.classList.contains("dark");
      fig.classList.toggle("dark", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? btn.getAttribute("data-b") : btn.getAttribute("data-a");
    });
    function pt(e) {
      var m = svg.getScreenCTM(); if (!m) return null;
      var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      return p.matrixTransform(m.inverse());
    }
    function show(e) {
      var p = pt(e); if (!p) return;
      var d = clamp(Math.round(((p.x - x0) / (x1 - x0)) * (D.days - 1)) + 1, 1, D.days);
      var isReal = d <= D.today, v = isReal ? D.real[d - 1] : D.proj[d - D.today];
      cl.setAttribute("x1", X(d)); cl.setAttribute("x2", X(d));
      cp.setAttribute("cx", X(d)); cp.setAttribute("cy", Y(v));
      cross.classList.add("on");
      out.textContent = L.lDay + " " + d + " — " + (isReal ? L.lReal : L.lProj) + " " + nf.format(v) + " " + L.lUnit + " · " + L.lPrev + " " + nf.format(D.prev[d - 1]) + " " + L.lUnit;
    }
    hit.addEventListener("pointermove", show);
    hit.addEventListener("pointerdown", show);
    hit.addEventListener("pointerleave", function () { cross.classList.remove("on"); out.textContent = base; });
    if (!RM && real.getTotalLength) {
      var len = real.getTotalLength();
      fig.style.setProperty("--len", len.toFixed(1));
      fig.classList.add("pre");
      onceVisible(fig, function () { requestAnimationFrame(function () { fig.classList.add("drawn"); fig.classList.remove("pre"); }); }, 0.4);
    }
  })();

  /* ---------- Fig. 7: grade do Sentinela (arrastar e soltar) ---------- */
  (function () {
    var fig = $('[data-demo="grid"]'); if (!fig) return;
    var svg = $("svg", fig), panels = $$(".panel", svg), out = $(".readout", fig), hint = out.textContent;
    var G = { x: 40, y: 50, cols: 12, rows: 6, cw: 51, rh: 48 };
    var KEY = "td-sentinela";
    var def = panels.map(function (p) { return { id: p.dataset.id, c: +p.dataset.c, r: +p.dataset.r }; });
    function box(p) { return { c: +p.dataset.c, r: +p.dataset.r, w: +p.dataset.w, h: +p.dataset.h }; }
    function place(p, c, r) { p.setAttribute("transform", "translate(" + (G.x + c * G.cw) + " " + (G.y + r * G.rh) + ")"); }
    function fits(p, c, r) {
      var b = box(p);
      if (c < 0 || r < 0 || c + b.w > G.cols || r + b.h > G.rows) return false;
      return panels.every(function (o) {
        if (o === p) return true;
        var q = box(o);
        return c + b.w <= q.c || q.c + q.w <= c || r + b.h <= q.r || q.r + q.h <= r;
      });
    }
    function commit(p, c, r) { p.dataset.c = c; p.dataset.r = r; place(p, c, r); save(); }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(panels.map(function (p) { return { id: p.dataset.id, c: +p.dataset.c, r: +p.dataset.r }; }))); } catch (e) {} }
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) saved.forEach(function (s) { var p = panels.filter(function (x) { return x.dataset.id === s.id; })[0]; if (p) { p.dataset.c = s.c; p.dataset.r = s.r; place(p, s.c, s.r); } });
    } catch (e) {}
    function toSvg(e) { var m = svg.getScreenCTM(); var q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()); }
    panels.forEach(function (p, i) {
      p.setAttribute("tabindex", "0");
      p.setAttribute("role", "button");
      p.setAttribute("aria-roledescription", "painel");
      p.setAttribute("aria-label", "Painel " + (i + 1));
      var drag = null;
      p.addEventListener("pointerdown", function (e) {
        var s = toSvg(e), b = box(p);
        drag = { dx: s.x - (G.x + b.c * G.cw), dy: s.y - (G.y + b.r * G.rh), c: b.c, r: b.r };
        p.setPointerCapture(e.pointerId);
        p.classList.add("drag");
        p.parentNode.appendChild(p);
      });
      p.addEventListener("pointermove", function (e) {
        if (!drag) return;
        var s = toSvg(e), x = s.x - drag.dx, y = s.y - drag.dy;
        p.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")");
        var c = Math.round((x - G.x) / G.cw), r = Math.round((y - G.y) / G.rh);
        p.classList.toggle("bad", !fits(p, c, r));
      });
      function end(e) {
        if (!drag) return;
        var s = toSvg(e), x = s.x - drag.dx, y = s.y - drag.dy;
        var c = Math.round((x - G.x) / G.cw), r = Math.round((y - G.y) / G.rh);
        if (fits(p, c, r)) commit(p, c, r); else place(p, drag.c, drag.r);
        p.classList.remove("drag", "bad");
        drag = null;
      }
      p.addEventListener("pointerup", end);
      p.addEventListener("pointercancel", end);
      p.addEventListener("keydown", function (e) {
        var b = box(p), d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (!d) return;
        e.preventDefault();
        if (fits(p, b.c + d[0], b.r + d[1])) commit(p, b.c + d[0], b.r + d[1]);
      });
    });
    $('[data-act="grid-reset"]', fig).addEventListener("click", function () {
      def.forEach(function (s) { var p = panels.filter(function (x) { return x.dataset.id === s.id; })[0]; p.dataset.c = s.c; p.dataset.r = s.r; place(p, s.c, s.r); });
      try { localStorage.removeItem(KEY); } catch (e) {}
    });
    // monitor de anomalia: desvio fictício → estado
    var STATES = (fig.dataset.states || "normal|atenção|crítico").split("|"), DEV = [12, 34, 71, 8, 27, 63];
    var lamps = $$(".lamp", svg), label = $(".anom-t", svg), di = -1;
    $('[data-act="grid-next"]', fig).addEventListener("click", function () {
      di = (di + 1) % DEV.length;
      var v = DEV[di], k = v < 25 ? 0 : v <= 60 ? 1 : 2;
      lamps.forEach(function (l, i) { l.classList.toggle("on", i === k); });
      label.textContent = STATES[k];
      out.textContent = (fig.dataset.lDev || "desvio") + " " + v + "% → " + STATES[k];
    });
  })();

  /* ---------- Fig. 8: marca em exame ---------- */
  (function () {
    var fig = $('[data-demo="template"]'); if (!fig) return;
    var svg = $("svg", fig), stack = $(".jr-stack", svg), btn = $('[data-act="template"]', fig);
    var POS = [[130, 90], [230, 60], [330, 30]];
    function layout() {
      var s = $$(".jr-sheet", stack);
      // o último filho fica na frente; posições de trás para a frente
      s.forEach(function (el, i) {
        var pos = POS[s.length - 1 - i];
        el.setAttribute("transform", "translate(" + pos[0] + " " + pos[1] + ")");
        el.classList.toggle("front", i === s.length - 1);
      });
    }
    function cycle() { var s = $$(".jr-sheet", stack); stack.insertBefore(s[s.length - 1], s[0]); layout(); }
    stack.addEventListener("click", cycle);
    btn.addEventListener("click", cycle);
    layout();
  })();

  /* ---------- histórico e selo ---------- */
  onceVisible($(".timeline"), function () { $(".timeline").classList.add("drawn"); }, 0.5);
  onceVisible($(".seal"), function () { $(".seal").classList.add("stamped"); }, 0.6);

  /* ---------- copiar e-mail ---------- */
  var toast = $(".toast"), toastT;
  $$(".copy[data-mail]").forEach(function (b) {
    b.addEventListener("click", function () {
      var mail = b.getAttribute("data-mail");
      function done() { toast.textContent = toast.getAttribute("data-msg"); toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("on"); }, 1800); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(mail).then(done, function () { location.href = "mailto:" + mail; });
      else location.href = "mailto:" + mail;
    });
  });

  /* ---------- lembrar a escolha de idioma ---------- */
  var langLink = $(".strip-lang");
  if (langLink) langLink.addEventListener("click", function () { try { localStorage.setItem("td-lang", langLink.getAttribute("hreflang")); } catch (e) {} });
})();
