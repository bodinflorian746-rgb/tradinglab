// Chiffres du texte des leçons redonnés par les données des schémas (lots 2 et
// suivants). Appelé par data.ts.
import CANDLES from "@/lib/lessons/generated/candles.json";
import { fibLevel, fvgAt, largestFvg, pivots, rsi, type Candle } from "@/lib/lessons/chart-analysis";

type Check = (ok: boolean, what: string) => void;
const CS = CANDLES as Record<string, Candle[]>;
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const rrOf = (e: number, sl: number, tp: number) => Math.abs(tp - e) / Math.abs(e - sl);
const isPin = (k: Candle, bull: boolean) => (bull
  ? Math.min(k.o, k.c) - k.l >= 2 * Math.abs(k.c - k.o) && (k.c - k.l) / (k.h - k.l) >= 2 / 3
  : k.h - Math.max(k.o, k.c) >= 2 * Math.abs(k.c - k.o) && (k.h - k.c) / (k.h - k.l) >= 2 / 3);
const engulfs = (x: Candle, y: Candle, bull: boolean) => (bull
  ? x.c < x.o && y.c > y.o && y.o <= x.c && y.c >= x.o
  : x.c > x.o && y.c < y.o && y.o >= x.c && y.c <= x.o);

export function checkLots(check: Check) {
  // ─── Lot 2 ─────────────────────────────────────────────────────────────────
  {
    // Price action 2 : pin bar sur 4 500, entrée 4 520, SL 4 470 sous la mèche, TP 4 650, R/R 2,6
    const cs = CS["pinbar-setup"], k = cs[cs.length - 1];
    check(k.c === 4520 && k.l > 4470 && k.l < 4500 && k.c > 4500, "Pin bar (PA 2) : clôture 4 520, mèche sous 4 500 et au-dessus du SL");
    check(isPin(k, true), "Pin bar (PA 2) : mèche basse ≥ 2 corps, clôture dans le tiers haut");
    check(near(Math.max(...cs.map((x) => x.h)), 4650, 1e-9) && near(rrOf(4520, 4470, 4650), 2.6, 1e-9), "Pin bar (PA 2) : résistance 4 650 / R/R 2,6");
    const lows = pivots(cs).filter((q) => q.side === "l");
    check(lows.every((q, i) => i === 0 || q.price > lows[i - 1].price), "Pin bar (PA 2) : creux non croissants, la tendance H4 n'est pas haussière");
  }
  {
    // Price action 3 : engulfing dans la zone Fibonacci 0.5-0.618 ; entrée 4 630, SL 4 590, TP 4 720, R/R 2,25
    const cs = CS["engulfing-setup"], [a, b] = cs.slice(-2);
    check(engulfs(a, b, true), "Engulfing (PA 3) : la 2e bougie n'englobe pas le corps de la 1re");
    const A = Math.min(...cs.map((x) => x.l)), B = Math.max(...cs.map((x) => x.h));
    check(A === 4500 && B === 4720 && b.l >= fibLevel(A, B, 0.618) && b.l <= fibLevel(A, B, 0.5), "Engulfing (PA 3) : hors zone Fibonacci 0.5-0.618");
    check(b.h === 4630 && b.l - 5 === 4590 && near(rrOf(4630, 4590, 4720), 2.25, 1e-9), "Engulfing (PA 3) : entrée / SL / R/R ≠ texte");
    for (const [k, bull] of [["engulfing-bull", true], ["engulfing-bear", false]] as const) {
      const [x, y] = CS[k].slice(-2);
      check(engulfs(x, y, bull), `${k} : pas un engulfing`);
    }
  }
  {
    // Reversal 2 : ETE 4 620 / 4 660 / 4 625, ligne de cou ≈ 4 578, clôture 4 570 ; SL tactique R/R 1,5, classique < 1
    const cs = CS["hs-execution"];
    const ph = pivots(cs).filter((q) => q.side === "h").map((q) => q.price);
    check([4620, 4660, 4625].every((p) => ph.includes(p)), "ETE (Reversal 2) : épaules / tête ≠ 4 620 / 4 660 / 4 625");
    check(cs[cs.length - 1].c === 4570 && cs.slice(-7, -1).every((k) => k.c > 4578), "ETE (Reversal 2) : la clôture 4 570 n'est pas la 1re sous la ligne de cou");
    check(near(rrOf(4570, 4630, 4480), 1.5, 1e-9) && rrOf(4570, 4670, 4480) < 1, "ETE (Reversal 2) : R/R tactique 1,5 / classique < 1");
  }
  // ─── Lot 3 ─────────────────────────────────────────────────────────────────
  {
    // Reversal 3 : prix HH + RSI plus bas, creux structurel jamais cassé ensuite
    const cs = CS["divergence-no-break"], r = rsi(cs.map((k) => k.c), 14);
    const hh = pivots(cs).filter((q) => q.side === "h" && q.name === "HH");
    const [t1, t2] = hh;
    const trough = Math.min(...cs.slice(t1.index, t2.index).map((k) => k.l));
    check(hh.length >= 2 && (r[t2.index] ?? 100) < (r[t1.index] ?? 0), "Divergence (Reversal 3) : le RSI ne fait pas un sommet plus bas");
    check(cs.slice(t2.index).every((k) => k.c > trough) && cs[cs.length - 1].h > t2.price, "Divergence (Reversal 3) : creux cassé ou pas de nouveau HH");
  }
  {
    // Support-résistance 3 : 3 touches de 1.1850, breakout clôturé 1.1878, 4 bougies sans réintégration, pin bar 1.1842 / 1.1858
    const cs = CS["flip-pin"], b = cs.findIndex((k) => k.c === 1.1878);
    check(cs.slice(0, b).filter((k) => k.h >= 1.1849).length >= 3 && cs.slice(0, b).every((k) => k.c < 1.1850), "Flip (S/R 3) : 3 touches de 1.1850 avant le breakout");
    check(cs.slice(b + 1, b + 5).every((k) => k.c > 1.1850), "Flip (S/R 3) : réintégration après le breakout");
    const pin = cs[cs.length - 1];
    check(pin.l === 1.1842 && pin.c === 1.1858 && isPin(pin, true), "Flip (S/R 3) : pin bar ≠ texte");
    const [x, y] = CS["flip-engulfing"].slice(-2);
    check(engulfs(x, y, true) && y.l >= 1.1840, "Flip (S/R 3) : engulfing invalide ou trop profond");
    const re = CS["flip-reaction"].slice(-2);
    check(re[0].l >= 1.1850 && re[0].c > re[0].o && re[1].c > re[0].c, "Flip (S/R 3) : réaction immédiate absente");
  }
  {
    // Support-résistance 4 : vrai = clôture 4 680 + follow-through ; faux = mèche 4 685, clôture 4 620, retournement
    const real = CS["breakout-real"], fake = CS["breakout-fake"];
    const b = real.findIndex((k) => k.c === 4680);
    check(b > 0 && real.slice(b).every((k) => k.c > 4650) && real.length - b >= 4, "Breakout (S/R 4) : vrai breakout sans follow-through");
    const f = fake.findIndex((k) => k.h === 4685);
    check(f > 0 && fake[f].c === 4620 && fake.slice(f).every((k) => k.c < 4650), "Breakout (S/R 4) : faux breakout ≠ texte");
  }
  {
    // Trend-following 3 : HL 4 480, HH 4 660, repli à 4 550 (≈ 0.618), pin bar clôturée 4 565
    const cs = CS["tf3-pullback"], k = cs[cs.length - 1];
    check(Math.min(...cs.map((x) => x.l)) === 4480 && Math.max(...cs.map((x) => x.h)) === 4660, "Pullback (TF 3) : HL / HH ≠ 4 480 / 4 660");
    check(k.l === 4550 && k.c === 4565 && isPin(k, true) && near(fibLevel(4480, 4660, 0.618), 4549, 0.5), "Pullback (TF 3) : pin bar ou Fibonacci ≠ texte");
  }
  {
    // Multi-timeframe 4 : 3 mèches hautes > 1.1755, creux 1.1748 cassé, retour à 1.1758 ; SL 1.1790 (32 pips) / 1.1772 (14 pips)
    const cs = CS["risk-affine-m5"];
    const wicks = cs.filter((k) => k.h > 1.1755 && k.h >= 1.1764);
    check(wicks.length === 3 && Math.max(...cs.map((k) => k.h)) === 1.1770, "Risque (MTF 4) : 3 mèches hautes, sommet 1.1770");
    const lowI = cs.findIndex((k) => k.l === 1.1748);
    check(lowI > 0 && cs.slice(lowI + 1).some((k) => k.c < 1.1748) && cs[cs.length - 1].h === 1.1758, "Risque (MTF 4) : cassure de 1.1748 puis retour à 1.1758");
    check(near((1.1790 - 1.1758) / 0.0001, 32, 1e-6) && near((1.1772 - 1.1758) / 0.0001, 14, 1e-6), "Risque (MTF 4) : 32 / 14 pips");
  }
  // ─── Lot 4 ─────────────────────────────────────────────────────────────────
  {
    // SMC 2 / 5 : LH / LL, CHoCH = clôture au-dessus du dernier LH, puis HL, puis BOS au-dessus du sommet du CHoCH
    const cs = CS["choch-sequence"], piv = pivots(cs);
    const lhs = piv.filter((q) => q.name === "LH"), lastLH = lhs[lhs.length - 1];
    const ch = cs.findIndex((k, i) => i > lastLH.index && k.c > lastLH.price);
    const hh = piv.find((q) => q.side === "h" && q.index > ch), hl = hh && piv.find((q) => q.side === "l" && q.index > hh.index);
    check(lhs.length >= 2 && piv.filter((q) => q.name === "LL").length >= 2, "CHoCH (SMC 2) : pas de tendance baissière LH / LL");
    check(ch > 0 && !!hh && !!hl && hl.name === "HL" && cs.slice(ch, hh.index + 1).every((k) => k.h <= hh.price), "CHoCH (SMC 2) : pas de HL après le CHoCH");
    check(!!hh && !!hl && cs.findIndex((k, i) => i > hl.index && k.c > hh.price) > 0 && cs.slice(hh.index + 1, hl.index + 1).every((k) => k.c <= hh.price), "CHoCH (SMC 2) : pas de BOS au-dessus du sommet du CHoCH");
  }
  {
    // Débutant 9 : ancrage achat 100, SL prévu 99, sortie 95 = −5R ; FOMO : achat au plus haut puis baisse
    const a = CS["bias-anchor"];
    check(a[0].c === 100 && a[a.length - 1].c === 95 && Math.min(...a.map((k) => k.l)) <= 99, "Biais (Débutant 9) : ancrage ≠ −5R");
    const f = CS["bias-fomo"], top = f.reduce((b, k, i) => (k.h > f[b].h ? i : b), 0);
    check(top > 3 && top < f.length - 2 && f[f.length - 1].c < f[top].c, "Biais (Débutant 9) : FOMO sans retournement");
  }
  {
    // Intermédiaire 4 : repli vers la zone du HL sans l'atteindre au point de décision, puis pin bar sur la zone, nouveau HH
    const cs = CS["retracement"], d = 13, now = cs[d];
    const pinI = cs.findIndex((k, i) => i > d && k.l <= 1.0862 && k.c > k.o);
    check(cs.slice(0, d + 1).slice(-3).every((k) => k.l > 1.0862), "Repli (Int. 4) : le prix a déjà atteint le HL au point de décision");
    check(pinI > d && isPin(cs[pinI], true) && Math.max(...cs.slice(pinI).map((k) => k.h)) > Math.max(...cs.slice(0, d + 1).map((k) => k.h)), "Repli (Int. 4) : pas de pin bar sur le HL ni de nouveau HH");
    check(cs.slice(d + 1).some((k) => k.l <= now.l - 0.0002), "Repli (Int. 4) : le stop de l'entrée FOMO n'est pas touché");
  }
  // ─── Lot 5 ─────────────────────────────────────────────────────────────────
  {
    // ICT 2 : equal highs sous 1.1780, sweep 1.1792, FVG bearish 1.1758-1.1770 (1er FVG du graphique)
    const cs = CS["pd-qualified"], lg = largestFvg(cs, "bear"), i = lg?.i ?? -1, g = lg;
    check(!!g && g.y1 === 1.1758 && g.y2 === 1.1770, "PD array (ICT 2) : FVG ≠ 1.1758-1.1770");
    check(cs.filter((k) => k.h >= 1.1779 && k.h <= 1.1780).length >= 2 && cs[i - 1].h === 1.1792, "PD array (ICT 2) : equal highs / sweep 1.1792 avant le FVG");
    const rg = largestFvg(CS["pd-range"], "bear");
    check(!!rg && CS["pd-range"].slice(rg.i + 2).some((k) => k.h >= rg.y2), "PD array (ICT 2) : le FVG hors contexte n'est pas retraversé");
    const c2 = CS["pd-confluence"], g2 = largestFvg(c2, "bear"), bo = g2?.i ?? 0;
    check(!!g2 && g2.y1 <= 1.1780 && g2.y2 >= 1.1780 && c2.slice(0, bo).filter((k) => k.l <= 1.1781 && k.l >= 1.1780).length >= 2, "Confluence (ICT 2) : support 1.1780 / FVG qui le contient");
    check(Math.max(...c2.slice(bo + 2).map((k) => k.h)) > g2!.y2 && c2[c2.length - 1].c < 1.1780, "Confluence (ICT 2) : sweep au-dessus puis rejet");
  }
  {
    // Macro-trading 1 : impulsion 4 640 → 4 705, 3 mèches de 6 à 8$ sans clôture au-dessus de 4 705, correction vers 4 670
    const cs = CS["fomc-exhaustion"];
    const w = cs.filter((k) => k.h > 4705 && k.h - Math.max(k.o, k.c) >= 6 && k.h - Math.max(k.o, k.c) <= 8);
    check(w.length === 3 && cs.every((k) => k.c <= 4705) && Math.max(...cs.map((k) => k.h)) === 4710, "FOMC (MT 1) : 3 mèches de 6 à 8$ sans clôture au-dessus de 4 705");
    check(cs[cs.length - 1].c === 4670 && cs.some((k) => k.o === 4640), "FOMC (MT 1) : 4 640 → 4 705 → 4 670");
  }
  // ─── Lot 6 ─────────────────────────────────────────────────────────────────
  {
    // Price action 1 : la même bougie (corps, mèches) dans les 3 contextes
    const shape = (k: Candle) => [k.c - k.o, k.h - Math.max(k.o, k.c), Math.min(k.o, k.c) - k.l].map((x) => x.toFixed(2)).join("/");
    const s = [CS["ctx-top"][9], CS["ctx-drop"][5], CS["ctx-range"][6]].map(shape);
    check(s[0] === s[1] && s[1] === s[2] && CS["ctx-top"][9].c > CS["ctx-top"][9].o, "Contexte (PA 1) : la « même bougie » diffère d'un panneau à l'autre");
    const top = CS["ctx-top"];
    check(top.slice(4, 9).every((k) => k.c > k.o), "Contexte (PA 1) : pas d'impulsion (5 vertes) avant la bougie du sommet");
  }
  {
    // Price action 2 : range 4 500-4 650 jamais dépassé ; pin baissière au plus haut, haussière au plus bas, pin au milieu suivie d'une baisse
    const cs = CS["pin-location"];
    check(Math.max(...cs.map((k) => k.h)) === 4650 && Math.min(...cs.map((k) => k.l)) === 4500, "Pin bar (PA 2) : le prix sort du range");
    const t = cs.find((k) => k.h === 4650)!, b = cs.find((k) => k.l === 4500)!, mi = cs.findIndex((k) => k.l === 4562);
    check(isPin(t, false) && isPin(b, true) && isPin(cs[mi], true) && cs[mi + 3].c < cs[mi].l, "Pin bar (PA 2) : pin bars ≠ texte (haut, milieu ignoré, bas)");
  }
  {
    // MTF 3 : ancien support 1.1760 cassé, FVG bearish 1.1750-1.1760, remontée vers la zone sans l'atteindre
    const cs = CS["zone-histoire"], g = largestFvg(cs, "bear");
    check(!!g && g.y1 === 1.1750 && g.y2 === 1.1760 && cs.slice(0, g.i).filter((k) => k.l <= 1.1761).length >= 2, "Zone (MTF 3) : support 1.1760 / FVG 1.1750-1.1760");
    check(cs[cs.length - 1].h < 1.1750 && cs[cs.length - 1].c > cs[cs.length - 4].c, "Zone (MTF 3) : la remontée n'approche pas la zone");
  }
  {
    // Macro-trading 4 : H4 en HH / HL ; M15 : breakout du creux 4 683 (signal bearish) puis reprise ; bougie H4 = agrégat des 16 M15
    const h4 = CS["regime-h4"], m = CS["regime-m15"];
    const names = pivots([...h4, { o: m[0].o, c: m[m.length - 1].c, h: Math.max(...m.map((k) => k.h)), l: Math.min(...m.map((k) => k.l)) }]).map((q) => q.name).filter(Boolean);
    check(names.includes("HH") && names.includes("HL") && !names.includes("LL"), "Régime (MT 4) : H4 pas en HH / HL");
    const lo = m.findIndex((k) => k.l === 4683), sig = m.findIndex((k, i) => i > lo && k.c < 4683);
    check(lo > 0 && sig > lo && m[m.length - 1].c > m[lo].l && m.length === 16 && m[0].o === h4[h4.length - 1].c, "Régime (MT 4) : signal M15 puis reprise, raccord H4");
  }
  // ─── Lot 7 ─────────────────────────────────────────────────────────────────
  {
    // Price action 2 : après la pin bar (entrée 4 520), clôture sous 4 500 puis SL 4 470 touché
    const cs = CS["pinbar-failure"], pin = cs.findIndex((k) => k.c === 4520 && k.l < 4500);
    check(pin > 0 && cs.slice(pin + 1).some((k) => k.c < 4500) && cs.slice(pin + 1).some((k) => k.l <= 4470), "Échec pin bar (PA 2) : pas de breakout du support ni de SL touché");
  }
  {
    // Price action 4 : Daily HH 1.1840 / HL 1.1720 ; H4 3 touches de 1.1750-1.1770 ; pin M15 1.1762 / 1.1778 ; R/R 1,88 / 3,70
    const piv = pivots(CS["mtf-daily"]);
    check(piv.some((q) => q.name === "HH" && q.price === 1.1840) && piv.some((q) => q.name === "HL" && q.price === 1.1720), "MTF (PA 4) : Daily HH 1.1840 / HL 1.1720");
    const h4 = CS["mtf-h4"], t = pivots(h4).filter((q) => q.side === "l" && q.price <= 1.1770).length + (h4[h4.length - 1].l <= 1.1770 ? 1 : 0);
    check(t === 3 && h4.every((k) => k.l >= 1.1750), `MTF (PA 4) : ${t} touches de la zone H4 (3 attendues) ou zone cassée`);
    const pinK = CS["mtf-m15"][CS["mtf-m15"].length - 1];
    check(pinK.l === 1.1762 && pinK.c === 1.1778 && isPin(pinK, true), "MTF (PA 4) : pin bar M15 ≠ texte");
    check(near(rrOf(1.1778, 1.1745, 1.1840), 1.88, 0.005) && near(rrOf(1.1778, 1.1745, 1.1900), 3.70, 0.005), "MTF (PA 4) : R/R 1,88 / 3,70");
  }
  {
    // SMC 1 / Int. 1 : HH / HL et LH / LL alternés, rien d'autre
    const bull = pivots(CS["structure-bull"]).filter((q) => q.name).map((q) => q.name);
    const bear = pivots(CS["structure-bear"]).filter((q) => q.name).map((q) => q.name);
    check(bull.length >= 5 && bull.every((x) => x === "HH" || x === "HL"), `Structure (SMC 1) : haussière ≠ HH / HL (${bull.join(" ")})`);
    check(bear.length >= 5 && bear.every((x) => x === "LH" || x === "LL"), `Structure (SMC 1) : baissière ≠ LH / LL (${bear.join(" ")})`);
    const ext = pivots(CS["external-daily"]).filter((q) => q.name).map((q) => q.name), int = pivots(CS["internal-h1"]).filter((q) => q.name).map((q) => q.name);
    check(ext.every((x) => x === "LH" || x === "LL") && int.every((x) => x === "HH" || x === "HL"), "Structure (SMC 1) : externe LH / LL, interne HH / HL");
    const lastLH = pivots(CS["external-daily"]).filter((q) => q.name === "LH").at(-1)!;
    check(Math.max(...CS["internal-h1"].map((k) => k.h)) < lastLH.price, "Structure (SMC 1) : le pullback interne dépasse le dernier LH externe");
  }
  {
    // SMC 1 : range 1.1760-1.1800, sweep SOUS le range, retour dedans, expansion haussière au-dessus
    const cs = CS["smc-phases"], sw = cs.reduce((b, k, i) => (k.l < cs[b].l ? i : b), 0);
    check(cs[sw].l < 1.1760 && cs[sw].c > 1.1760 && cs.slice(0, sw).filter((k) => k.h >= 1.1799).length >= 2, "Phases (SMC 1) : sweep du bas du range");
    const after = pivots(cs).filter((q) => q.index > sw && q.name).map((q) => q.name);
    check(cs.slice(sw).some((k) => k.c > 1.1800) && after.includes("HH") && after.includes("HL") && cs[cs.length - 1].h > 1.1840, "Phases (SMC 1) : pas d'expansion haussière HH / HL");
  }
  // ─── Lot 8 ─────────────────────────────────────────────────────────────────
  {
    // SMC 2 / TF 4 : même préfixe ; BOS = clôture au-dessus du HH 1.1820, CHoCH = clôture sous le HL 1.1750
    const b = CS["bos-case"], ch = CS["choch-case"], n = Math.min(b.length, ch.length) - 4;
    check(b.slice(0, n).every((k, i) => k.c === ch[i].c), "BOS / CHoCH (SMC 2) : préfixes différents");
    const hh = b.findIndex((k) => k.h === 1.1820);
    check(b.slice(hh + 1).some((k) => k.c > 1.1820) && !b.slice(hh + 1).some((k) => k.c < 1.1750), "BOS / CHoCH (SMC 2) : pas de BOS au-dessus de 1.1820");
    check(ch.slice(hh + 1).some((k) => k.c < 1.1750) && !ch.slice(hh + 1).some((k) => k.c > 1.1820), "BOS / CHoCH (SMC 2) : pas de CHoCH sous 1.1750");
  }
  {
    // SMC 3 : OB = dernière rouge avant l'impulsion (corps 1.1745-1.1752), BOS > 1.1780, retest de l'OB, R/R ≥ 2
    const cs = CS["smc-ob"], obI = cs.findIndex((k) => k.o === 1.1752 && k.c === 1.1745);
    check(obI > 0 && cs[obI + 1].c > cs[obI + 1].o && cs.slice(obI + 1).some((k) => k.c > 1.1780), "OB (SMC 3) : OB / impulsion / BOS");
    const hhI = cs.reduce((b, k, i) => (i > obI && k.h > cs[b].h ? i : b), obI), re = cs.findIndex((k, i) => i > hhI && k.l <= 1.1752);
    check(re > hhI && cs[re].l > cs[obI].l && rrOf(1.1752, cs[obI].l - 0.0007, cs[hhI].h) >= 2, "OB (SMC 3) : retest dans l'OB sans le casser, R/R ≥ 2");
  }
  {
    // SMC 3 / 5 : HL 1.1720 / HH 1.1780, CHoCH sous 1.1720, creux 1.1690 (LL), retest de 1.1720 par en dessous, baisse
    const cs = CS["mitigation"], piv = pivots(cs);
    check(piv.some((q) => q.name === "HL" && q.price === 1.1720) && piv.some((q) => q.name === "HH" && q.price === 1.1780) && piv.some((q) => q.name === "LL" && q.price === 1.1690), "Mitigation (SMC 3) : HL / HH / LL ≠ texte");
    const ll = piv.find((q) => q.name === "LL")!.index, re = cs.findIndex((k, i) => i > ll && k.h >= 1.1720 && k.c < 1.1720);
    check(re > 0 && cs[re].c === 1.1718 && cs[cs.length - 1].c < 1.1690, "Mitigation (SMC 3) : retest à 1.1718 puis baisse");
  }
  {
    // Trend-following 1 : HL 1.1680, HH 1.1760, HL 1.1720, HH 1.1820 ; amplitude 140 pips
    const names = pivots(CS["trend-steps"]).filter((q) => q.name).map((q) => `${q.name}${q.price}`);
    check(names.join(" ") === "HL1.168 HH1.176 HL1.172 HH1.182", `Tendance (TF 1) : pivots ${names.join(" ")}`);
  }
}

export { CS, near, rrOf, isPin, engulfs };

// ─── Lot 9 ───────────────────────────────────────────────────────────────────
export function checkLot9(check: Check) {
  {
    // Trend-following 2 : 3 HL alignés (± 1 pip) dans la fenêtre affichée ; la MM20 suit le prix (jamais au-dessus de tout le prix)
    const all = CS["tf-trend"], cs = all.slice(36);
    const hls = pivots(cs).filter((q) => q.name === "HL").slice(-3);
    const [a, m, b] = hls;
    const onLine = a && m && b && Math.abs(m.price - (a.price + ((b.price - a.price) * (m.index - a.index)) / (b.index - a.index))) <= 0.0001;
    check(hls.length === 3 && !!onLine, "Trendline (TF 2) : les 3 HL ne sont pas alignés");
    const closes = all.map((k) => k.c), m20 = closes.map((_, i) => (i < 19 ? null : closes.slice(i - 19, i + 1).reduce((x, y) => x + y, 0) / 20));
    check(cs.some((k, i) => (m20[i + 36] ?? 0) < k.h && (m20[i + 36] ?? 0) > k.l), "Trendline (TF 2) : la MM20 ne traverse jamais le prix");
  }
  {
    // Trend-following 2 : ordre des MM à la dernière bougie
    const ord = (k: string) => { const c = CS[k].map((x) => x.c); const v = [20, 50, 200].map((n) => c.slice(-n).reduce((x, y) => x + y, 0) / n); return v; };
    const b = ord("ma-bull"), r = ord("ma-bear");
    check(b[0] > b[1] && b[1] > b[2] && r[0] < r[1] && r[1] < r[2], "MM (TF 2) : alignements haussier / baissier faux");
  }
  {
    // Trend-following 3 / Avancé 5 : BOS > 4 600, A 4 480, B 4 660, rejet dans l'OTE 0.618-0.786
    const cs = CS["ote"], k = cs[cs.length - 1];
    const f618 = fibLevel(4480, 4660, 0.618), f786 = fibLevel(4480, 4660, 0.786);
    check(Math.min(...cs.slice(8).map((x) => x.l)) === 4480 && Math.max(...cs.map((x) => x.h)) === 4660 && cs.some((x) => x.c > 4600), "OTE : A / B / BOS");
    check(k.l >= f786 && k.l <= f618 && k.c > k.o && isPin(k, true), "OTE : la bougie de rejet n'est pas dans l'OTE");
  }
  {
    // Trend-following 3 : extensions 1.272 / 1.618 du repli 4 660 → 4 550 = 4 690 / 4 728, atteintes ; R/R 1,73 / 2,96
    const cs = CS["fib-tp"];
    check(near(4550 + 1.618 * 110, 4728, 0.5) && near(4550 + 1.272 * 110, 4690, 0.5) && Math.max(...cs.map((x) => x.h)) >= 4728, "Projection (TF 3) : extension 1.618 non atteinte");
    check(near(rrOf(4565, 4510, 4660), 1.73, 0.005) && near(rrOf(4565, 4510, 4728), 2.96, 0.005), "Projection (TF 3) : R/R 1,73 / 2,96");
  }
}

export function checkLot14(check: Check) {
  {
    // Macro Avancé 1 : impulsion de 20h00 dans « +100 à +150 pips », baisse 20h30 → 21h30 dans « 200 à 400 pips »,
    // calme avant 20h00, le sommet de la décision n'est jamais dépassé après Powell
    const cs = CS["fomc-timeline"];
    const imp = (cs[3].h - cs[3].o) / 0.0001, drop = (cs[9].o - Math.min(...cs.slice(9, 22).map((k) => k.l))) / 0.0001;
    check(imp >= 100 && imp <= 150, `FOMC (Macro Av. 1) : impulsion de 20h00 ${imp.toFixed(0)} pips hors 100-150`);
    check(drop >= 200 && drop <= 400, `FOMC (Macro Av. 1) : baisse 20h30 → 21h30 ${drop.toFixed(0)} pips hors 200-400`);
    check(cs.slice(0, 3).every((k) => (k.h - k.l) / 0.0001 <= 15), "FOMC (Macro Av. 1) : bougies d'avant 20h00 pas calmes");
    check(Math.max(...cs.slice(9).map((k) => k.h)) < Math.max(...cs.slice(3, 9).map((k) => k.h)), "FOMC (Macro Av. 1) : le prix repasse au-dessus du sommet de la décision");
  }
}
