// Données des leçons Débutant 11 (types d'ordres), Intermédiaire 10 à 12 (figures chartistes, ATR,
// volatilité), Avancé 13 à 15 (Wyckoff, ICT/SMC) et des stratégies Opening Range Breakout et Wyckoff
// appliqué : chaque chiffre du texte redonné par les bougies (lib/lessons/scenarios-nouvelles.ts), chaque
// plan au R/R annoncé (au moins 1:2, sauf trade refusé), chaque objectif avant le niveau suivant, chaque
// taille de position recalculée au lot près. Lancé par data.ts.
import CANDLES from "@/lib/lessons/generated/candles.json";
import { atr, tradeMath, type Candle } from "@/lib/lessons/chart-analysis";
import { srTouches } from "./sr-proof.mjs";

type Check = (ok: boolean, what: string) => void;
const near = (a: number, b: number, t = 1e-9) => Math.abs(a - b) <= t;
const pivH = (cs: Candle[], i: number) => i >= 2 && i <= cs.length - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].h < cs[i].h);
const pivL = (cs: Candle[], i: number) => i >= 2 && i <= cs.length - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].l > cs[i].l);
const proved = (cs: Candle[], lo: number, hi: number, to = cs.length - 1) => { const t = srTouches(cs, lo, hi, 0, to); return t.touches >= 2 || t.retest; };
const rr = (e: number, sl: number, tp: number) => tradeMath(e, sl, tp).rr;
const firstClose = (cs: Candle[], from: number, ok: (c: number) => boolean) => cs.findIndex((k, i) => i > from && ok(k.c));
const atrAt = (cs: Candle[], i: number) => atr(cs)[i] ?? NaN;

/** Valeurs des contrats (conventions du site) : EUR/USD 1 lot ≈ 9,20 € par pip ; or 0,01 lot = 1 once, 1 $ ≈ 0,92 € ;
 *  NASDAQ 1 lot ≈ 1 $ par point ≈ 0,92 €, pas de 0,1 lot */
const EUR_PIP_LOT = 9.2, USD_EUR = 0.92;
/** Plus grande taille (au pas près) qui respecte le budget de risque */
const maxLot = (budget: number, perUnitPerLot: number, dist: number, step: number) => Math.floor(budget / (perUnitPerLot * dist) / step + 1e-9) * step;

export function checkNouvelles(check: Check, C: Record<string, Candle[]> = CANDLES as unknown as Record<string, Candle[]>) {
  // ─── Débutant 11 ──────────────────────────────────────────────────────────
  {
    const D = "Débutant 11";
    const bl = C["ord-buy-limit"], sl = C["ord-sell-limit"], bs = C["ord-buy-stop"], ss = C["ord-sell-stop"];
    check(proved(bl, 3900, 3900, 10) && near(bl[11].c, 3920) && near(bl[14].l, 3900) && bl.slice(11, 14).every((k) => k.l > 3900), `${D} : Buy Limit (support 3 900 $ prouvé, prix 3 920 $, exécution au retour)`);
    check(proved(sl, 27200, 27200, 11) && near(sl[12].c, 27100) && near(sl[16].h, 27200) && sl.slice(12, 16).every((k) => k.h < 27200), `${D} : Sell Limit (résistance 27 200, prix 27 100, exécution au retour)`);
    check(proved(bs, 27180, 27180, 9) && near(bs[10].c, 27100) && bs.slice(10, 14).every((k) => k.h < 27185) && bs[14].h >= 27185, `${D} : Buy Stop (résistance 27 180, déclenchement à 27 185)`);
    check(proved(ss, 1.082, 1.082, 9) && near(ss[9].c, 1.085) && ss.slice(9, 12).every((k) => k.l > 1.0818) && ss[12].l <= 1.0818, `${D} : Sell Stop (support 1.0820, déclenchement à 1.0818)`);
    const st = C["ord-sltp"];
    check(proved(st, 1.0833, 1.0838) && proved(st, 1.0895, 1.0895) && pivL(st, 13) && near(st[13].l, 1.0833) && near(st[15].c, 1.085), `${D} : exemple SL / TP (support, creux 1.0833, résistance 1.0895, entrée 1.0850)`);
    check(1.083 < st[13].l && 1.089 < 1.0895 && near(rr(1.085, 1.083, 1.089), 2), `${D} : SL 1.0830 sous le creux, TP 1.0890 avant la résistance, R/R 1:2`);
    const a = C["ord-bl-a"], b = C["ord-bl-b"];
    check(proved(a, 1.085, 1.085, 25) && proved(a, 1.0905, 1.0905) && pivL(a, 18) && near(a[18].l, 1.083) && near(a[25].c, 1.087), `${D} : Buy Limit complet (support 1.0850, résistance 1.0905, creux 1.0830, prix 1.0870)`);
    check(near(a[27].l, 1.085) && a.slice(26).every((k) => k.l > 1.0825) && a[31].h >= 1.09 && b.slice(26).every((k) => k.l > 1.085), `${D} : issue A (exécuté, TP atteint) et B (jamais exécuté)`);
    check(1.0825 < 1.083 && 1.09 < 1.0905 && near(rr(1.085, 1.0825, 1.09), 2), `${D} : Buy Limit 1.0850 / 1.0825 / 1.0900, R/R 1:2`);
    check(near(maxLot(6, EUR_PIP_LOT, 25, 0.01), 0.02) && near(Math.round(0.01 * EUR_PIP_LOT * 25 * 10) / 10, 2.3), `${D} : 0,02 lot pour 6 €, 2,30 € au lot minimum`);
  }
  // ─── Intermédiaire 10 : figures chartistes ────────────────────────────────
  {
    const I = "Intermédiaire 10";
    const f = C["fig-flag"];
    check(near(f[1].c, 27000) && near(f[8].h, 27200) && near(f[11].h, 27180) && near(f[14].h, 27170) && [10, 13, 16].every((i, k) => near(f[i].l, [27140, 27130, 27120][k])), `${I} : drapeau (mât 27 000 → 27 200, canal 27 180 – 27 120)`);
    check(f.slice(10, 17).every((k) => k.l >= 27120) && f.slice(9, 17).every((k) => k.h <= 27200) && f[18].c > 27170 - (27180 - 27170) / 3 * 4, `${I} : le drapeau reste dans son canal, la bougie 18 clôture au-dessus`);
    const t = C["fig-tri-asc"];
    check(proved(t, 1.09, 1.09, 15) && [5, 10, 14].every((i, k) => pivL(t, i) && near(t[i].l, [1.084, 1.086, 1.088][k])) && firstClose(t, 0, (c) => c > 1.09) === 16, `${I} : triangle ascendant (1.0900, creux 1.0840, 1.0860, 1.0880, clôture au-dessus)`);
    const dt = C["fig-dt"], rt = C["fig-dt-retest"];
    const neck = Math.min(...dt.slice(10, 17).map((k) => k.l));
    check(pivH(dt, 10) && pivH(dt, 16) && near(dt[10].h, 3950) && near(dt[16].h, 3948) && near(neck, 3920), `${I} : double sommet (3 950 $, 3 948 $, ligne de cou 3 920 $)`);
    check(pivH(dt, 21) && near(dt[21].h, 3930) && firstClose(dt, 16, (c) => c < 3920) === 23 && near(dt[23].c, 3918), `${I} : sommet local 3 930 $, première clôture sous la ligne de cou à 3 918 $`);
    check(near(neck - (3950 - neck), 3890) && proved(dt, 3888, 3889) && 3888 < 3890, `${I} : objectif 3 890 $ (hauteur 30 $), avant le support 3 888 $`);
    check(rt[26].h >= 3920 && rt[26].c < 3920 && rt.slice(24, 26).every((k) => k.h < 3920) && near(rt[26].h, 3923), `${I} : retest jusqu'à 3 923 $ et clôture sous la ligne de cou`);
    check(near(Math.round(rr(3918, 3933, 3890) * 100) / 100, 1.87) && near(Math.round(rr(3920, 3933, 3890) * 100) / 100, 2.31) && 3933 > 3930, `${I} : R/R 1:1,87 au marché, 1:2,31 au retest, stop au-dessus de 3 930 $`);
    check(near(Math.round(13 * USD_EUR), 12) && 13 * USD_EUR / 0.02 <= 600 && maxLot(20, 100 * USD_EUR, 13, 0.01) >= 0.01 && maxLot(20, 100 * USD_EUR, 13, 0.01) < 0.02, `${I} : 0,01 lot (12 €) sur 1 000 € à 2 %, 600 € minimum`);
  }
  // ─── Intermédiaire 11 : ATR ───────────────────────────────────────────────
  {
    const I = "Intermédiaire 11";
    const r = C["atr-reading"], a = atr(r);
    check(Math.round(a[25] ?? 0) === 35 && a.some((v) => v !== null && Math.round(v) === 55), `${I} : l'ATR passe de 35 à 55 points`);
    const s = C["atr-stop"];
    check(pivL(s, 25) && near(s[25].l, 27090) && near(s[28].c, 27150) && Math.round(atrAt(s, 28)) === 35 && 27150 - 27085 === 65 && 65 / atrAt(s, 28) < 2, `${I} : stop 27 085 sous le creux 27 090, 65 points, moins de 2 ATR de 35`);
    const g = C["atr-gold"];
    check(proved(g, 3948, 3948) && proved(g, 3900, 3901) && near(g[24].c, 3912) && Math.round(atrAt(g, 24)) === 8, `${I} : or (résistance 3 948 $, support 3 900 $, entrée 3 912 $, ATR 8 $)`);
    check(3896 < 3900 && 3944 < 3948 && near(rr(3912, 3896, 3944), 2) && near((3912 - 3896) / 8, 2), `${I} : plan 3 912 / 3 896 / 3 944, R/R 1:2, stop = 2 ATR`);
    check(near(Math.round(16 * USD_EUR * 10) / 10, 14.7) && near(Math.round(16 * USD_EUR / 0.02 / 10) * 10, 740) && maxLot(20, 100 * USD_EUR, 16, 0.01) < 0.02, `${I} : 14,70 € au lot minimum, environ 740 € de capital, 0,02 lot trop grand pour 20 €`);
    const d = C["atr-daily"], T = d.length - 1;
    check(Math.round((atrAt(d, T - 1)) * 1e4) === 70 && near(d[T].l, 1.083) && near(d[T].c, 1.0895) && Math.round((d[T].c - d[T].l) * 1e4) === 65, `${I} : ATR journalier 70 pips, 65 pips parcourus (1.0830 → 1.0895)`);
    check(near(maxLot(20, EUR_PIP_LOT, 20, 0.01), 0.1) && near(maxLot(20, EUR_PIP_LOT, 40, 0.01), 0.05), `${I} : 0,10 lot pour 20 pips, 0,05 lot pour 40 pips`);
  }
  // ─── Intermédiaire 12 : volatilité ────────────────────────────────────────
  {
    const I = "Intermédiaire 12";
    const k = C["vol-contraction"];
    check(k.slice(0, 17).every((q) => q.h <= 27140 && q.l >= 27100) && proved(k, 27140, 27140, 16) && proved(k, 27100, 27101, 16) && k[17].c > 27140, `${I} : range 27 100 – 27 140, puis clôture au-dessus`);
    const ak = atr(k);
    check((ak[k.length - 1] ?? 0) > 1.5 * (ak[16] ?? Infinity), `${I} : l'ATR augmente nettement après le breakout`);
    const n = C["vol-news"];
    const hi = Math.max(...n.map((q) => q.h)), lo = Math.min(...n.map((q) => q.l));
    check(near(hi, 1.088) && near(lo, 1.083) && Math.round((hi - lo) * 1e4) === 50 && Math.round((hi - 1.085 + hi - lo) * 1e4) === 80, `${I} : news 1.0850 → 1.0880 → 1.0830 (50 pips d'écart, 80 parcourus)`);
    check(n.slice(0, 8).every((q) => q.h < 1.0856 && q.l > 1.0844) && n.slice(8, 10).some((q) => q.l <= 1.084), `${I} : calme avant la news, stop de 10 pips touché au premier aller-retour`);
    const A = C["vol-day-a"], B = C["vol-day-b"];
    check(Math.round(atrAt(A, A.length - 1)) === 5 && Math.round(atrAt(B, B.length - 1)) === 15, `${I} : ATR M15 de 5 $ (A) et 15 $ (B)`);
    check([A, B].every((q) => proved(q, 3900, 3900) && proved(q, 3940, 3940) && near(q[q.length - 1].c, 3910)), `${I} : même support 3 900 $, même résistance 3 940 $, même entrée 3 910 $`);
    check(pivL(A, 26) && near(A[26].l, 3904) && pivL(B, 17) && near(B[17].l, 3885) && 3898 < 3900 && 3880 < B[17].l && 3935 < 3940 && near(Math.round(rr(3910, 3898, 3935) * 100) / 100, 2.08) && near(Math.round(rr(3910, 3880, 3935) * 100) / 100, 0.83), `${I} : creux 3 904 $ / 3 885 $, stops 3 898 $ (sous le support) / 3 880 $, R/R 1:2,08 et 1:0,83`);
  }
  // ─── Avancé 13 : Wyckoff ──────────────────────────────────────────────────
  {
    const A = "Avancé 13";
    const w = C["wy-nq"];
    check(near(w[0].c, 27300) && pivL(w, 8) && near(w[8].l, 26980) && pivH(w, 12) && near(w[12].h, 27180) && pivL(w, 16) && near(w[16].l, 27020), `${A} : NASDAQ 27 300 → creux 26 980, rebond 27 180, retour 27 020`);
    check(near(w[25].l, 26960) && w[25].c > 27000 && pivH(w, 28) && near(w[28].h, 27100) && firstClose(w, 28, (c) => c > 27100) === 32, `${A} : Spring 26 960 réintégré, sommet local 27 100 dépassé`);
    check(pivL(w, 35) && near(w[35].l, 27070) && w.slice(27).every((q) => q.l > 27020), `${A} : LPS 27 070 sans revenir dans le bas du range`);
    const acc = C["wy-acc"];
    check(acc[23].l < 1.08 && acc[23].c > 1.08 && acc[26].c > acc[10].h && pivL(acc, 29) && acc[29].l > acc[23].l, `${A} : accumulation type (Spring, SOS au-dessus de l'AR, LPS plus haut)`);
  }
  // ─── Avancé 14 : zones ICT/SMC ────────────────────────────────────────────
  {
    const A = "Avancé 14";
    const br = C["ict-breaker"];
    check(near(br[8].o, 1.086) && near(br[8].c, 1.085) && pivH(br, 4) && near(br[4].h, 1.088) && br[11].c > 1.088 && br[12].h > br[11].h, `${A} : OB 1.0850 – 1.0860, impulsion au-dessus de 1.0880, liquidité prise`);
    check(firstClose(br, 12, (c) => c < br[8].l) === 16 && br[19].h >= 1.085 && br[19].c < br[19].o, `${A} : cassure de structure puis rejet du Breaker`);
    const mb = C["ict-mitigation"];
    check(pivH(mb, 8) && mb[8].h < mb[2].h && firstClose(mb, 8, (c) => c < mb[5].l) === 11 && mb[15].h >= mb[8].o, `${A} : lower high sans prise de liquidité, cassure du creux, retour dans le Mitigation Block`);
    const iv = C["ict-ifvg"];
    check(near(iv[2].h, 1.085) && near(iv[4].l, 1.086) && firstClose(iv, 4, (c) => c < 1.085) === 10 && iv[15].h >= 1.085 && iv[15].c < 1.085, `${A} : FVG 1.0850 – 1.0860 traversé puis résistance (IFVG)`);
    const ce = C["ict-ce"];
    check(near(ce[2].h, 1.084) && near(ce[4].l, 1.086) && near((1.084 + 1.086) / 2, 1.085) && near(ce[9].l, 1.085), `${A} : FVG 1.0840 – 1.0860, CE 1.0850`);
    const bp = C["ict-bpr"];
    check(near(bp[2].h, 1.084) && near(bp[4].l, 1.086) && near(bp[9].h, 1.085) && near(bp[7].l, 1.087), `${A} : FVG haussier 1.0840 – 1.0860 et baissier 1.0850 – 1.0870 (BPR 1.0850 – 1.0860)`);
    const pr = C["ict-premium"];
    check(proved(pr, 1.09, 1.09) && proved(pr, 1.08, 1.08) && pr[pr.length - 1].c > 1.085, `${A} : range 1.0800 – 1.0900 prouvé, prix en zone Premium`);
  }
  // ─── Avancé 15 : liquidité et timing ──────────────────────────────────────
  {
    const A = "Avancé 15";
    const ind = C["ict-inducement"];
    check(proved(ind, 3910, 3910, 21) && proved(ind, 3890, 3900) && ind[22].c < 3910 && ind[23].l >= 3890 && ind[23].l <= 3900 && ind[ind.length - 1].c > 3910, `${A} : inducement 3 910 $ cassé, réaction sur 3 890 – 3 900 $`);
    const eu = C["ict-smt-eu"], gu = C["ict-smt-gu"];
    check(pivH(eu, 3) && pivH(eu, 10) && eu[10].h > eu[3].h && pivH(gu, 3) && pivH(gu, 10) && gu[10].h < gu[3].h, `${A} : divergence SMT (higher high EUR/USD, lower high GBP/USD)`);
    const j = C["ict-judas"];
    check(proved(j, 1.3345, 1.3345, 12) && proved(j, 1.332, 1.332, 12) && j[13].h > 1.3345 && j[13].c < 1.3345 && j[j.length - 1].c < 1.332, `${A} : Judas swing (sweep du sommet asiatique puis baisse)`);
    const ts = C["ict-turtle"];
    check(pivH(ts, 3) && near(ts[3].h, 1.09) && near(ts[10].h, 1.091) && near(ts[10].c, 1.0895), `${A} : turtle soup 1.0900 / 1.0910 / 1.0895`);
    const gp = C["ict-gap"];
    check(near(gp[6].c, 27000) && near(gp[7].o, 27050) && near((27000 + 27050) / 2, 27025), `${A} : gap 27 000 – 27 050, milieu 27 025`);
    const cb = C["ict-combined"];
    check(proved(cb, 1.09, 1.09) && proved(cb, 1.08, 1.0802) && near(cb[24].h, 1.091) && cb[24].c < 1.09 && near(cb[25].l, 1.089) && near(cb[27].h, 1.088), `${A} : range, sweep à 1.0910, FVG 1.0880 – 1.0890`);
    check(near(cb[30].c, 1.0883) && 1.0913 > 1.091 && 1.0823 > 1.08 && near(rr(1.0883, 1.0913, 1.0823), 2) && near(maxLot(6, EUR_PIP_LOT, 30, 0.01), 0.02), `${A} : vente 1.0883 / 1.0913 / 1.0823, R/R 1:2, 0,02 lot pour 6 €`);
  }
  // ─── Stratégie Opening Range Breakout ─────────────────────────────────────
  {
    const S = "Stratégie ORB";
    const m = C["orb-main"];
    check(near(Math.max(...m.slice(0, 3).map((k) => k.h)), 27150) && near(Math.min(...m.slice(0, 3).map((k) => k.l)), 27080), `${S} : Opening Range 27 080 – 27 150 (70 points)`);
    check(near(m[4].h, 27155) && m[4].c < 27150 && firstClose(m, 2, (c) => c > 27150) === 7 && near(m[7].c, 27165), `${S} : mèche 27 155 sans clôture, puis clôture 27 165`);
    check(pivL(m, 9) && near(m[9].l, 27145) && pivH(m, 7) && near(m[7].h, 27170) && near(m[11].c, 27172) && m.slice(8, 11).every((k) => k.c <= 27170), `${S} : retest 27 145, sommet 27 170 cassé, entrée 27 172`);
    check(27140 < 27145 && 27236 < 27250 && near(rr(27172, 27140, 27236), 2), `${S} : plan 27 172 / 27 140 / 27 236 avant 27 250, R/R 1:2`);
    check(near(maxLot(20, USD_EUR, 32, 0.1), 0.6) && 0.1 * USD_EUR * 32 <= 3, `${S} : 0,6 lot pour 20 €, lot minimum sous 3 €`);
    check(proved(C["orb-h1"], 27250, 27250), `${S} : résistance H1 27 250 prouvée`);
    check(near(C["orb-bear"][5].c, 27065), `${S} : clôture 27 065 sous le range`);
    const nr = C["orb-no-retest"];
    check(nr.slice(5).every((k) => k.l > 27150) && near(Math.max(...nr.map((k) => k.h)), 27260), `${S} : breakout jusqu'à 27 260 sans retest`);
    check(near(C["orb-fake"][4].c, 27160) && near(C["orb-fake"][6].c, 27120), `${S} : faux breakout 27 160 puis 27 120`);
  }
  // ─── Stratégie Wyckoff appliqué ───────────────────────────────────────────
  {
    const S = "Stratégie Wyckoff appliqué";
    const g = C["wa-gold"];
    check(near(g[6].l, 3880) && near(g[10].h, 3960) && near(g[14].l, 3890) && near(g[17].h, 3940) && proved(g, 3880, 3900, 19) && proved(g, 3940, 3960), `${S} : range de l'or 3 880 – 3 960 $ (supports et résistances prouvés)`);
    check(near(g[21].l, 3865) && g[21].c > 3880 && pivH(g, 24) && near(g[24].h, 3925) && firstClose(g, 24, (c) => c > 3925) === 28 && pivL(g, 31) && near(g[31].l, 3905), `${S} : Spring 3 865 $, SOS au-dessus de 3 925 $, LPS 3 905 $`);
    const m = C["wa-m15"];
    check(pivL(m, 4) && near(m[4].l, 3905) && pivH(m, 6) && near(m[6].h, 3912) && near(m[9].c, 3914) && pivH(m, 11) && near(m[11].h, 3920) && near(m[14].c, 3922), `${S} : M15 (LPS 3 905 $, sommet 3 912 $, entrée 3 914 $, sommet 3 920 $, entrée tardive 3 922 $)`);
    check(3902 < 3905 && 3938 < 3940 && near(rr(3914, 3902, 3938), 2) && near(rr(3922, 3902, 3938), 0.8), `${S} : plan 3 914 / 3 902 / 3 938 (1:2), entrée tardive 1:0,8`);
    check(near(maxLot(30, 100 * USD_EUR, 12, 0.01), 0.02) && near(Math.round(12 * USD_EUR / 0.02 / 10) * 10, 550), `${S} : 0,02 lot pour 30 €, 550 € de capital minimum`);
    const n = C["wa-nq"];
    check(near(n[6].h, 27300) && near(n[10].l, 27100) && proved(n, 27100, 27104) && proved(n, 27296, 27300) && near(n[26].h, 27340) && n[26].c < 27300, `${S} : distribution 27 100 – 27 300, UTAD 27 340`);
    check(pivL(n, 22) && near(n[22].l, 27180) && firstClose(n, 22, (c) => c < 27180) === 29 && pivH(n, 33) && near(n[33].h, 27230) && near(n[34].c, 27205), `${S} : SOW sous 27 180, LPSY 27 230, entrée 27 205`);
    check(27245 > 27230 && 27125 > 27100 && near(rr(27205, 27245, 27125), 2) && near(maxLot(30, USD_EUR, 40, 0.1), 0.8), `${S} : plan 27 205 / 27 245 / 27 125 (1:2), 0,8 lot pour 30 €`);
    const f = C["wa-failed"];
    check(f.slice(0, 22).every((k) => k.l >= 3880) && f[22].c < 3880 && f.slice(22).every((k) => k.c < 3880), `${S} : Spring raté (clôture 3 870 $, pas de réintégration)`);
  }
}
