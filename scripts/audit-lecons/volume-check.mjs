// Audit des graphiques de volumes (Volume Profile, VWAP, Order Flow) : tout est recalculé à partir des
// bougies du panneau (data-candles : volume `v`, delta `d`), indépendamment de lib/lessons/volume.ts, puis
// comparé au dessin. Fonction autonome : passée en texte au navigateur par dom.mjs (comme sr-proof.mjs).
//  - profil : volume de chaque barre, barre la plus longue = POC, barres à leur prix, largeurs
//    proportionnelles, POC / VAH / VAL / HVN / LVN nommés = recalculés, Value Area ≈ 70 % du volume ;
//  - VWAP : Σ(prix typique × volume) ÷ Σ volume depuis la bougie d'ancrage, ancre visible ;
//  - sous-panneaux : barres de volume et de delta = données des bougies ; CVD = somme des deltas ;
//    divergence nommée (sommet du prix plus haut, sommet du CVD plus bas).
export function checkVolumes(svg, E) {
  const cs = JSON.parse(svg.dataset.candles || "[]");
  if (!cs.length) return;
  const sc = JSON.parse(svg.dataset.scale);
  const toY = (v) => sc.top + ((sc.max - v) / (sc.max - sc.min)) * (sc.bottom - sc.top);
  const xOf = (i) => sc.x0 + sc.slot * (i + 0.5);
  const num = (el, a) => +el.getAttribute(a);
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const r9 = (x) => Number(x.toFixed(9));
  const label = (key) => svg.querySelector(`g[data-label-for="${CSS.escape(key)}"]`)?.textContent.trim() ?? key;

  // ─── Profil de volume ───
  for (const g of svg.querySelectorAll("g[data-profile]")) {
    const row = +g.dataset.row, from = +g.dataset.from, to = +g.dataset.to, key = g.dataset.profile;
    if (cs.slice(from, to + 1).some((k) => !(k.v > 0))) { E(`profil ${key} : bougie sans volume dans la plage ${from}-${to}`); continue; }
    const K = (p) => Math.round(p / row);
    const span = cs.slice(from, to + 1);
    const k0 = Math.min(...span.map((c) => K(c.l))), k1 = Math.max(...span.map((c) => K(c.h)));
    const vol = Array(k1 - k0 + 1).fill(0);
    for (const c of span) {
      const a = K(c.l), b = K(c.h);
      if (a === b || c.h === c.l) { vol[a - k0] += c.v; continue; }
      for (let j = a; j <= b; j++) { const lo = Math.max(c.l, (j - 0.5) * row), hi = Math.min(c.h, (j + 0.5) * row); if (hi > lo) vol[j - k0] += (c.v * (hi - lo)) / (c.h - c.l); }
    }
    const price = (i) => r9((i + k0) * row);
    const total = vol.reduce((s, x) => s + x, 0);
    const poc = vol.indexOf(Math.max(...vol));
    // barres : volume, prix, largeur proportionnelle, la plus longue au POC
    const bars = [...g.querySelectorAll("rect[data-row-p]")];
    if (bars.length !== vol.length) E(`profil ${key} : ${bars.length} barres dessinées pour ${vol.length} rangées`);
    const wMax = Math.max(...bars.map((b) => num(b, "width")));
    for (const b of bars) {
      const p = +b.dataset.rowP, i = Math.round(p / row) - k0, v = vol[i];
      if (v === undefined) { E(`profil ${key} : barre à ${p} hors de la plage des bougies`); continue; }
      if (!near(+b.dataset.v, v, 1e-6 * total)) E(`profil ${key} : barre ${p}, volume ${Math.round(+b.dataset.v)} ≠ recalculé ${Math.round(v)}`);
      if (!near(num(b, "width"), (v / vol[poc]) * wMax, 0.75) && num(b, "width") > 0.6) E(`profil ${key} : barre ${p}, largeur non proportionnelle à son volume`);
      const yc = num(b, "y") + num(b, "height") / 2;
      if (!near(yc, toY(p), 1.2)) E(`profil ${key} : barre ${p} hors de son prix sur l'échelle`);
    }
    const longest = bars.reduce((a, b) => (num(b, "width") > num(a, "width") ? b : a), bars[0]);
    if (longest && !near(+longest.dataset.rowP, price(poc), 1e-9)) E(`profil ${key} : la plus longue barre (${longest.dataset.rowP}) n'est pas le POC recalculé (${price(poc)})`);
    // Value Area : depuis le POC, la rangée voisine la plus chargée, jusqu'à 70 %
    let lo = poc, hi = poc, sum = vol[poc];
    while (sum < 0.7 * total - 1e-9 && (lo > 0 || hi < vol.length - 1)) {
      const up = hi < vol.length - 1 ? vol[hi + 1] : -1, dn = lo > 0 ? vol[lo - 1] : -1;
      if (up >= dn) { hi++; sum += up; } else { lo--; sum += dn; }
    }
    const lv = (role) => svg.querySelector(`line[data-level][data-role="${role}"][data-ref="${CSS.escape(key)}"]`);
    const want = { poc: price(poc), vah: price(hi), val: price(lo) };
    for (const role of ["poc", "vah", "val"]) {
      const l = lv(role);
      if (l && !near(+l.dataset.price, want[role], 1e-9)) E(`profil ${key} : « ${label(l.dataset.level)} » à ${l.dataset.price}, ${role.toUpperCase()} recalculé ${want[role]}`);
    }
    const vah = lv("vah"), val = lv("val");
    if (vah && val) {
      const share = vol.reduce((s, x, i) => (price(i) >= +val.dataset.price - 1e-9 && price(i) <= +vah.dataset.price + 1e-9 ? s + x : s), 0) / total;
      if (share < 0.68 || share > 0.76) E(`profil ${key} : la Value Area tracée (${val.dataset.price} – ${vah.dataset.price}) contient ${(share * 100).toFixed(1).replace(".", ",")} % du volume (environ 70 % attendu)`);
    }
    // HVN / LVN : sommets du profil (≥ 15 % du POC, séparés par un creux sous 80 % du plus petit) ;
    // HVN ≥ 40 % hors du nœud du POC ; LVN : rangées sous 35 % du POC entre deux nœuds
    const peaks = [];
    for (let i = 0; i < vol.length; i++) if (vol[i] >= 0.15 * vol[poc] && (i === 0 || vol[i] > vol[i - 1]) && (i === vol.length - 1 || vol[i] >= vol[i + 1])) peaks.push(i);
    const nodes = [];
    for (const i of peaks) { const pv = nodes[nodes.length - 1]; if (pv !== undefined && Math.min(...vol.slice(pv, i + 1)) > 0.8 * Math.min(vol[pv], vol[i])) { if (vol[i] > vol[pv]) nodes[nodes.length - 1] = i; continue; } nodes.push(i); }
    const pocNode = nodes.reduce((b, i) => (Math.abs(i - poc) < Math.abs(b - poc) ? i : b), nodes[0] ?? poc);
    const hvn = nodes.filter((i) => i !== pocNode && vol[i] >= 0.4 * vol[poc]).map(price);
    const lvn = [];
    for (let n = 1; n < nodes.length; n++) { const low = []; for (let i = nodes[n - 1] + 1; i < nodes[n]; i++) if (vol[i] < 0.35 * vol[poc]) low.push(i); if (low.length) lvn.push([price(Math.min(...low)), price(Math.max(...low))]); }
    for (const l of svg.querySelectorAll(`line[data-level][data-role="hvn"][data-ref="${CSS.escape(key)}"]`)) if (!hvn.some((h) => near(h, +l.dataset.price, 1e-9))) E(`profil ${key} : « ${label(l.dataset.level)} » n'est pas une HVN du profil recalculé (${hvn.join(", ") || "aucune"})`);
    for (const z of svg.querySelectorAll(`rect[data-zone][data-role="lvn"][data-ref="${CSS.escape(key)}"]`)) if (!lvn.some(([a, b]) => near(a, +z.dataset.y1, 1e-9) && near(b, +z.dataset.y2, 1e-9))) E(`profil ${key} : « ${label(z.dataset.zone)} » n'est pas une LVN du profil recalculé (${lvn.map((q) => q.join("-")).join(", ") || "aucune"})`);
  }

  // ─── VWAP ───
  for (const pl of svg.querySelectorAll("polyline[data-vwap-anchor]")) {
    const a = +pl.dataset.vwapAnchor, key = pl.dataset.ma;
    if (!(a >= 0 && a < cs.length)) { E(`VWAP ${key} : ancré hors du graphique (bougie ${a})`); continue; }
    const pts = pl.getAttribute("points").trim().split(/\s+/).map((p) => p.split(",").map(Number));
    let pv = 0, v = 0;
    const want = [];
    for (let i = a; i < cs.length; i++) { pv += ((cs[i].h + cs[i].l + cs[i].c) / 3) * cs[i].v; v += cs[i].v; want.push([xOf(i), toY(pv / v)]); }
    if (pts.length !== want.length) { E(`VWAP « ${label(key)} » : ${pts.length} points pour ${want.length} bougies depuis l'ancrage`); continue; }
    if (!near(pts[0][0], xOf(a), 0.5)) E(`VWAP « ${label(key)} » : ne part pas de sa bougie d'ancrage (${a})`);
    const bad = want.findIndex((w, i) => !near(pts[i][0], w[0], 0.5) || !near(pts[i][1], w[1], 0.6));
    if (bad >= 0) E(`VWAP « ${label(key)} » : point ${a + bad} ≠ VWAP recalculé (Σ prix typique × volume ÷ Σ volume)`);
  }

  // ─── Sous-panneaux : volume, delta, CVD ───
  for (const g of svg.querySelectorAll("g[data-sub]")) {
    const kind = g.dataset.sub;
    if (kind === "volume" || kind === "delta") {
      const vals = cs.map((k) => (kind === "volume" ? k.v : k.d ?? 0));
      const m = Math.max(...vals.map(Math.abs)), zero = +g.dataset.zero, spanH = +g.dataset.span;
      if (!near(+g.dataset.max, m, 1e-9)) E(`${kind} : échelle (${g.dataset.max}) ≠ plus grande valeur des bougies (${m})`);
      for (const r of g.querySelectorAll("rect[data-bar]")) {
        const i = +r.dataset.bar, v = vals[i];
        if (+r.dataset.value !== v) { E(`${kind} : barre ${i} = ${r.dataset.value}, la bougie dit ${v}`); continue; }
        const h = num(r, "height"), top = num(r, "y");
        if (!near(h, Math.max((Math.abs(v) / m) * spanH, 0.5), 0.6)) E(`${kind} : barre ${i}, hauteur non proportionnelle à ${v}`);
        if (v >= 0 ? !near(top + h, zero, 0.6) : !near(top, zero, 0.6)) E(`${kind} : barre ${i} du mauvais côté du zéro`);
        if (!near(num(r, "x") + num(r, "width") / 2, xOf(i), 0.6)) E(`${kind} : barre ${i} décalée de sa bougie`);
      }
    }
    if (kind === "cvd") {
      const cum = []; let s = 0; for (const k of cs) cum.push((s += k.d ?? 0));
      const q = JSON.parse(g.dataset.scale), lo = Math.min(...cum), hi = Math.max(...cum);
      if (!near(q.min, lo, 1e-9) || !near(q.max, hi, 1e-9)) E(`CVD : échelle ${q.min} – ${q.max} ≠ somme des deltas (${lo} – ${hi})`);
      const cy = (v) => q.top + ((q.max - v) / (q.max - q.min || 1)) * (q.bottom - q.top);
      const pl = g.querySelector("polyline[data-cvd]");
      if (pl) {
        const pts = pl.getAttribute("points").trim().split(/\s+/).map((p) => p.split(",").map(Number));
        const bad = cum.findIndex((v, i) => !pts[i] || !near(pts[i][1], cy(v), 0.6) || !near(pts[i][0], xOf(i), 0.6));
        if (bad >= 0) E(`CVD : point ${bad} ≠ somme des deltas (${cum[bad]})`);
      }
      const marks = [...g.querySelectorAll("[data-cvd-mark]")].map((m) => {
        const fill = m.querySelector("circle")?.getAttribute("fill") ?? "";
        return { i: +m.dataset.cvdMark, t: m.textContent.trim(), bear: /ef4444/i.test(fill), bull: /10b981/i.test(fill) };
      });
      // un repère du CVD se pose sur un extrême local : sommet (divergence baissière) ou creux (divergence haussière)
      const peak = (i) => cum[i] >= cum[i - 1] && cum[i] >= cum[i + 1], trough = (i) => cum[i] <= cum[i - 1] && cum[i] <= cum[i + 1];
      for (const m of marks) if (!(m.i >= 1 && m.i < cs.length - 1 && (peak(m.i) || trough(m.i)))) E(`CVD : repère « ${m.t} » (bougie ${m.i}) pas sur un sommet ni un creux du CVD`);
      if (marks.length === 2 && marks[1].bear) {
        const [a, b] = marks;
        if (!(cs[b.i].h > cs[a.i].h && cum[b.i] < cum[a.i])) E(`CVD : divergence nommée sans nouveau sommet du prix (${cs[a.i].h} → ${cs[b.i].h}) ni sommet plus bas du CVD (${cum[a.i]} → ${cum[b.i]})`);
      }
      if (marks.length === 2 && marks[1].bull) {
        const [a, b] = marks;
        if (!(trough(a.i) && trough(b.i) && cs[b.i].l < cs[a.i].l && cum[b.i] > cum[a.i])) E(`CVD : divergence haussière sans nouveau creux du prix (${cs[a.i].l} → ${cs[b.i].l}) ni creux plus haut du CVD (${cum[a.i]} → ${cum[b.i]})`);
      }
    }
  }
}
