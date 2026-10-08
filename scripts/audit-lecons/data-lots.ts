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

export function checkLot15(check: Check) {
  {
    // ICT 1 (ict-eqh) : 2 sommets à 1.1780 (equal highs), sweep à 1.1792, chute à 1.1720
    const cs = CS["ict-eqh"];
    const tops = pivots(cs, 2).filter((q) => q.side === "h" && Math.abs(q.price - 1.178) < 0.0001);
    check(tops.length >= 2, "ICT EQH : moins de 2 sommets à 1.1780");
    check(cs.some((k) => k.h > 1.1790 && k.h <= 1.1795), "ICT EQH : le sweep ne dépasse pas 1.1790-1.1795");
    check(Math.min(...cs.map((k) => k.l)) <= 1.1722, "ICT EQH : la chute n'atteint pas 1.1720");
  }
  {
    // ICT 1 (false-breakout-xau) : résistance 4680, breakout à 4695, réintégration, chute à 4650
    const cs = CS["false-breakout-xau"];
    check(cs.some((k) => k.h === 4680), "FalseBreakout : pas de test à 4680");
    check(cs.some((k) => k.h >= 4693 && k.h <= 4697), "FalseBreakout : breakout hors 4693-4697");
    check(Math.min(...cs.map((k) => k.l)) <= 4652, "FalseBreakout : pas de chute vers 4650");
  }
  {
    // ICT 1 (ict-sweep-m15) : equal highs 1.1780, sweep > 1.1790, bougie impulsive ~35 pts
    const cs = CS["ict-sweep-m15"];
    const sweep = cs.findIndex((k) => k.h > 1.178);
    check(sweep >= 0, "ICT sweep M15 : pas de sweep");
    check(sweep + 1 < cs.length && Math.abs(cs[sweep + 1].o - cs[sweep + 1].c) / 0.0001 >= 25, "ICT sweep M15 : bougie impulsive trop petite");
  }
  {
    // ICT 2 (fvg-mitigation-xau) : depuis 4 690, FVG 4 655-4 665, creux 4 620, retour à 4 660 (dans le FVG), rejet baissier, 4 610
    const cs = CS["fvg-mitigation-xau"];
    const fvg = largestFvg(cs, "bear");
    check(!!fvg && fvg.y1 === 4655 && fvg.y2 === 4665 && cs[0].o === 4690, `FVG mitigation XAU : FVG ≠ 4 655-4 665 (${fvg ? `${fvg.y1}-${fvg.y2}` : "null"})`);
    const low = !!fvg && Math.min(...cs.slice(fvg.i + 1, fvg.i + 4).map((k) => k.l));
    const back = !!fvg ? cs.findIndex((k, i) => i > fvg.i + 2 && k.h === 4660) : -1;
    check(low === 4620 && back > 0 && Math.max(...cs.slice(fvg ? fvg.i + 2 : 0).map((k) => k.h)) === 4660, "FVG mitigation XAU : creux 4 620 / retour à 4 660");
    check(back > 0 && cs[back + 1].c < cs[back + 1].o && cs[back + 1].o - cs[back + 1].c >= 15 && Math.min(...cs.slice(back).map((k) => k.l)) === 4610, "FVG mitigation XAU : rejet impulsif puis 4 610");
  }
  {
    // ICT 2 (fvg-case-a) : FVG bull 1.0840-1.0860, rebond ≥ 1.0918 ; (b) mèche ≤ 1.0843 ; (c) clôture ≤ 1.0826
    const a = CS["fvg-case-a"], b = CS["fvg-case-b"], c = CS["fvg-case-c"];
    check(largestFvg(a, "bull") !== null, "FVG case A : pas de FVG bull");
    check(Math.max(...a.map((k) => k.h)) >= 1.0918, "FVG case A : rebond < 1.0918");
    check(Math.min(...b.slice(13).map((k) => k.l)) <= 1.0843, "FVG case B : mèche > 1.0843");
    check(c.some((k, i) => i > 12 && k.c <= 1.0826), "FVG case C : pas de clôture sous 1.0826");
  }
}

export function checkLot16(check: Check) {
  {
    // killzones-kz : Asia range tight (7 first candles), sweep below 1.1710, expansion
    const cs = CS["killzones-kz"];
    const asia = cs.slice(0, 7);
    const range = Math.max(...asia.map(k => k.h)) - Math.min(...asia.map(k => k.l));
    check(range / 0.0001 <= 20, `KZ timeline : Asia range ${(range / 0.0001).toFixed(0)} pips > 20`);
    check(Math.min(...cs.map(k => k.l)) <= 1.1702, "KZ timeline : sweep ne descend pas sous 1.1710");
    check(Math.max(...cs.map(k => k.h)) >= 1.1745, "KZ timeline : expansion < 1.1745");
  }
  {
    // asia-range-sweep : range 1.1710-1.1725, sweep 1.1702, expansion 1.1750
    const cs = CS["asia-range-sweep"];
    check(Math.min(...cs.slice(7, 9).map(k => k.l)) <= 1.1703, "AsiaRangeSweep : sweep > 1.1703");
    check(Math.max(...cs.slice(9).map(k => k.h)) >= 1.1748, "AsiaRangeSweep : expansion < 1.1748");
  }
  {
    // ICT 3 — NY Open (XAU/USD) : bougie explosive de 28 $ jusqu'à 4 668, 4 610 en 4 bougies, 58 $ d'amplitude
    const cs = CS["ny-expansion"], e = cs[5];
    check(e.h - e.o === 28 && e.h === 4668 && Math.max(...cs.map((k) => k.h)) === 4668, "NY Open (ICT 3) : bougie explosive ≠ +28 $ jusqu'à 4 668");
    check(Math.min(...cs.slice(5, 9).map((k) => k.l)) === 4610 && Math.min(...cs.map((k) => k.l)) === 4610, "NY Open (ICT 3) : 4 610 non atteint dans la 1re heure");
    const calm = Math.max(...cs.slice(0, 5).map((k) => k.h)) - Math.min(...cs.slice(0, 5).map((k) => k.l));
    check(calm <= 10, `NY Open (ICT 3) : consolidation trop large (${calm} $)`);
  }
  {
    // ICT 3 — même résistance 1.1780 : Asia = mèche de rejet de 4 pips sans cassure ; London = sweep 1.1792, 35 pips en 4 bougies
    const a = CS["timing-asia"], l = CS["timing-london"];
    const t = a.findIndex((k) => k.h === 1.178);
    check(t >= 0 && near(a[t].h - Math.max(a[t].o, a[t].c), 0.0004, 1e-9) && a.every((k) => k.h <= 1.178), "Timing (ICT 3) : rejet Asia ≠ mèche de 4 pips");
    const s = l.findIndex((k) => k.h === 1.1792);
    check(s >= 0 && l[s].c < 1.178 && near(1.1792 - Math.min(...l.slice(s + 1, s + 5).map((k) => k.l)), 0.0035, 1e-9), "Timing (ICT 3) : cascade London ≠ 35 pips en 4 bougies");
  }
}

export function checkLot17(check: Check) {
  {
    // ICT 4 / ICT 5 — sweep 1.1792 refermé sous 1.1780, 4 bougies baissières jusqu'à 1.1748, FVG 1.1768-1.1777,
    // retour dans le FVG, entrée 1.1774 sous le bas du rejet, SL 1.1798, TP 1.1695 (R/R 3,29)
    const cs = CS["disp-eur"], S = 5;
    check(cs[S].h === 1.1792 && cs[S].c < 1.178 && Math.max(...cs.map((k) => k.h)) === 1.1792, "Displacement (ICT 4) : sweep");
    check(cs.slice(S + 1, S + 5).every((k) => k.c < k.o && k.h - k.o <= 0.00031) && cs[S + 4].l === 1.1748 && Math.min(...cs.slice(0, S + 5).map((k) => k.l)) === 1.1748, "Displacement (ICT 4) : 4 bougies baissières jusqu'à 1.1748");
    const g = fvgAt(cs, S + 1, "bear"), g2 = fvgAt(cs, S + 2, "bear");
    check(!!g && near(g.y1, 1.1768, 1e-9) && near(g.y2, 1.1777, 1e-9) && !!g2, "Displacement (ICT 4) : FVG 1.1768-1.1777 et second FVG");
    const back = cs.findIndex((k, i) => i > S + 4 && k.c >= 1.1768);
    check(back > 0 && cs.slice(back, back + 5).some((k, i, a) => i > 0 && k.l <= 1.1774 && a[i - 1].l >= 1.1774), "Displacement (ICT 4) : pas d'entrée 1.1774 après le rejet");
    check(near(rrOf(1.1774, 1.1798, 1.1695), 3.29, 0.005), "Displacement (ICT 5) : R/R 3,3");
  }
  {
    // ICT 4 bloc 2 — équilibre 3 h autour de 4 650, sweep 4 668, 5 bougies baissières jusqu'à 4 608
    const cs = CS["disp-control-xau"], calm = cs.slice(0, 12);
    check(Math.max(...calm.map((k) => k.h)) - Math.min(...calm.map((k) => k.l)) <= 15 && cs[12].h === 4668, "Displacement (ICT 4 bloc 2) : équilibre / sweep");
    check(cs.slice(13).length === 5 && cs.slice(13).every((k) => k.c < k.o) && Math.min(...cs.map((k) => k.l)) === 4608, "Displacement (ICT 4 bloc 2) : 5 bougies jusqu'à 4 608");
  }
  {
    // ICT 4 bloc 4 — bougie isolée de +18 pips refermée par la suivante ; 4 bougies de 10-12 pips qui cassent le creux local
    const v = CS["vol-spike"], i = v.reduce((b, k, j) => (k.c - k.o > v[b].c - v[b].o ? j : b), 0);
    check(near(v[i].c - v[i].o, 0.0018, 1e-9) && v[i + 1].c <= v[i].o, "Volatilité (ICT 4) : +18 pips refermés");
    const d = CS["disp-seq"], low = Math.min(...d.slice(0, 6).map((k) => k.l));
    const bodies = d.slice(6).map((k) => (k.o - k.c) / 0.0001);
    check(bodies.length === 4 && bodies.every((b) => b >= 9.95 && b <= 12.05) && d[6].c < low, "Displacement (ICT 4) : 4 bougies de 10-12 pips qui cassent le creux");
  }
  {
    // ICT 5 bloc 4 — range Asia 4 642-4 655, sweep au-dessus de 4 655, displacement de 38 $, FVG
    const cs = CS["ict-timing-bear"], asia = cs.slice(0, 6);
    check(Math.min(...asia.map((k) => k.l)) === 4642 && Math.max(...asia.map((k) => k.h)) === 4655 && cs[6].h > 4655 && cs[6].c < 4655, "Timing (ICT 5) : range Asia / sweep");
    check(cs[6].c - cs[cs.length - 1].c === 38 && !!largestFvg(cs, "bear"), "Timing (ICT 5) : displacement de 38 $ avec FVG");
  }
}

export function checkLot18(check: Check) {
  {
    // Macro-trading 1 : 4 660 → 4 590 (70 $) en une bougie, stabilisation ~4 595, retour à 4 638 une heure (4 bougies) après ;
    // fade : entrée 4 600 sur la reprise, SL 4 578 sous l'extrémité, objectif 4 638 (R/R 1,73)
    const cs = CS["fomc-excess"], I = 5, k = cs[I];
    check(k.o === 4660 && k.l === 4590 && Math.min(...cs.map((x) => x.l)) === 4590, "FOMC (MT 1) : impulsion 4 660 → 4 590");
    check(Math.max(...cs.slice(I + 1).map((x) => x.h)) === 4638 && cs[I + 4].h === 4638, "FOMC (MT 1) : retour à 4 638 une heure après");
    check(cs.slice(I + 1, I + 3).every((x) => Math.abs((x.o + x.c) / 2 - 4595) <= 3) && cs[I + 3].c > 4600 && cs[I + 3].l < 4600, "FOMC (MT 1) : stabilisation ~4 595 puis reprise à travers 4 600");
    check(near(rrOf(4600, 4578, 4638), 1.73, 0.005), "FOMC (MT 1) : R/R");
  }
  {
    // Macro-trading 2 : 4 640 → 4 575 (casse 4 600), 4 bougies de stabilisation (mèches 6-8 $, clôtures 4 580-4 585),
    // puis A 4 625 / B 4 630 en 4 bougies, C breakout > 4 620 et 4 665
    for (const [key, top] of [["nfp-headline", 4625], ["nfp-stab", 4630], ["nfp-reversal", 4665]] as const) {
      const cs = CS[key], I = 5;
      check(cs[I].o === 4640 && cs[I].l === 4575 && Math.min(...cs.map((x) => x.l)) === 4575, `NFP (MT 2) ${key} : impulsion 4 640 → 4 575`);
      const st = cs.slice(I + 1, I + 5);
      check(st.every((x) => { const w = Math.min(x.o, x.c) - x.l; return w >= 6 && w <= 8 && x.c >= 4580 && x.c <= 4585; }), `NFP (MT 2) ${key} : stabilisation`);
      check(Math.max(...cs.slice(I + 1).map((x) => x.h)) === top && cs[cs.length - 1].h === top, `NFP (MT 2) ${key} : sommet ${top}`);
    }
    const r = CS["nfp-reversal"];
    check(r.slice(10).some((x) => x.o < 4620 && x.c > 4620), "NFP (MT 2) : breakout de 4 620");
  }
}

export function checkLot19(check: Check) {
  {
    // Macro-trading 3 bloc 1 : XAU/USD de 4 585 à 4 705 en structure HH / HL
    const cs = CS["riskoff-daily"], p = pivots(cs, 2);
    check(Math.min(...cs.map((k) => k.l)) === 4585 && cs[0].l === 4585 && Math.max(...cs.map((k) => k.h)) === 4705 && cs[cs.length - 1].h === 4705, "Risk-off (MT 3) : 4 585 → 4 705");
    check(p.filter((q) => q.name).every((q) => q.name === "HH" || q.name === "HL") && p.some((q) => q.name === "HL"), "Risk-off (MT 3) : structure HH / HL");
  }
  {
    // Macro-trading 3 bloc 2 : 4 610 → 4 690 (HH), pullback 4 655 sur l'ancien sommet 4 655 (HL), long 4 660 / SL 4 640 / TP 4 730
    const cs = CS["riskoff-trend-h4"], p = pivots(cs, 2);
    const hh = p.find((q) => q.name === "HH"), hl = p.find((q) => q.name === "HL" && hh && q.index > hh.index);
    check(hh?.price === 4690 && hl?.price === 4655 && p.some((q) => q.side === "h" && q.price === 4655), "Risk-off (MT 3) : HH 4 690, HL 4 655 = ancien sommet");
    check(!!hl && cs.some((k, i) => i > hl.index && k.c === 4660) && Math.max(...cs.map((k) => k.h)) === 4730 && near(rrOf(4660, 4640, 4730), 3.5, 0.005), "Risk-off (MT 3) : entrée 4 660, TP 4 730");
  }
  {
    // Macro-trading 3 bloc 3 : sommets 4 735 / 4 720 / 4 705, corrections 25 / 40 / 65
    const cs = CS["riskoff-exhaust-h4"], p = pivots(cs, 2);
    const tops = p.slice(p.findIndex((q) => q.name === "HH")).filter((q) => q.side === "h");
    check(tops.map((t) => t.price).join() === "4735,4720,4705", "Essoufflement (MT 3) : sommets 4 735 / 4 720 / 4 705");
    const depth = tops.map((t, n) => t.price - Math.min(...cs.slice(t.index, n + 1 < tops.length ? tops[n + 1].index : cs.length).map((k) => k.l)));
    check(depth.join() === "25,40,65", `Essoufflement (MT 3) : corrections ${depth.join(", ")} ≠ 25, 40, 65`);
  }
  {
    // Macro-trading 4 bloc 1 : sous la résistance 4 665 jusqu'à 13h25, bougie CPI au-dessus du SL 4 672, 50-100 $ d'amplitude
    const cs = CS["macro-filter-news"];
    check(cs.slice(0, 7).every((k) => k.h <= 4665) && cs[7].h > 4672, "Calendrier (MT 4) : résistance / SL emporté par le CPI");
    const amp = cs[7].h - Math.min(...cs.slice(7).map((k) => k.l));
    check(amp >= 50 && amp <= 100, `Calendrier (MT 4) : amplitude ${amp} $ hors 50-100`);
  }
}


export function checkLot20(check: Check) {
  const lhll = (k: string) => pivots(CS[k], 2).filter((q) => q.name).every((q) => q.name === "LH" || q.name === "LL");
  {
    // Multi-UT 1 : Daily LH/LL sous 1.1820 ; M15 breakout de 1.1760 (deux touches), sommet 1.1775, rechute à 1.1700
    const d = CS["stf-daily"], m = CS["stf-m15"], b = m.findIndex((k) => k.c > 1.176);
    check(lhll("stf-daily") && pivots(d, 2).filter((q) => q.name === "LH").at(-1)?.price === 1.182, "Piège (MUT 1) : Daily LH/LL, résistance 1.1820");
    check(m.slice(0, b).filter((k) => k.h === 1.176).length === 2 && m.slice(0, b).every((k) => k.h <= 1.176), "Piège (MUT 1) : niveau 1.1760 touché deux fois");
    check(Math.max(...m.map((k) => k.h)) === 1.1775 && Math.min(...m.slice(b).map((k) => k.l)) === 1.17, "Piège (MUT 1) : 1.1775 puis 1.1700");
  }
  {
    // Multi-UT 1 : H4 LH/LL, dernier LH sur 1.1780, prix 1.1725 ; H1 zone 1.1765-1.1780 (ancien support, rejet, retour)
    const h4 = CS["htf-bear-h4"], h1 = CS["inter-zone-h1"];
    check(lhll("htf-bear-h4") && pivots(h4, 2).filter((q) => q.name === "LH").at(-1)?.price === 1.178 && h4[h4.length - 1].c === 1.1725, "Biais (MUT 1) : H4 LH/LL, 1.1780, 1.1725");
    const brk = h1.findIndex((k) => k.c < 1.1765);
    check(brk > 0 && h1.slice(0, brk).every((k) => k.l >= 1.1765) && h1.some((k, i) => i > brk && k.h >= 1.1765 && k.h <= 1.178 && k.c < k.o), "Zone (MUT 1) : support 1.1765-1.1780 cassé puis rejet");
    check(h1[h1.length - 1].h >= 1.1765 && h1[h1.length - 1].h <= 1.178, "Zone (MUT 1) : retour dans la zone");
  }
  {
    // Multi-UT 1 : M5 sweep 1.1778 dans la zone, puis clôture sous le dernier creux (CHoCH)
    const m = CS["ltf-exec-m5"], s = m.reduce((b, k, i) => (k.h > m[b].h ? i : b), 0);
    const low = Math.min(...m.slice(s - 3, s).map((k) => k.l));
    check(m[s].h === 1.1778 && m.some((k, i) => i > s && k.c < low && k.o - k.c >= 0.0008), "Exécution (MUT 1) : sweep 1.1778 puis CHoCH par displacement");
  }
  {
    // Multi-UT 2 : Daily LH/LL, dernier LH 1.1760, prix 1.1715 ; M15 breakout de 1.1740, sommet 1.1752, rejet 1.1685
    const d = CS["ct-daily"], m = CS["ct-m15"], b = m.findIndex((k) => k.c > 1.174);
    check(lhll("ct-daily") && pivots(d, 2).filter((q) => q.name === "LH").at(-1)?.price === 1.176 && d[d.length - 1].c === 1.1715, "Contre-tendance (MUT 2) : Daily 1.1760 / 1.1715");
    check(m.slice(0, b).every((k) => k.h <= 1.174) && Math.max(...m.map((k) => k.h)) === 1.1752 && Math.min(...m.slice(b).map((k) => k.l)) === 1.1685, "Contre-tendance (MUT 2) : 1.1740 → 1.1752 → 1.1685");
  }
}

export function checkLot21(check: Check) {
  {
    // Multi-UT 2 : chutes de 35-40 $ en 2 bougies, corrections en 4 bougies, tout sous 4 680
    const cs = CS["dir-dom-xau"];
    const drops = [[0, 2], [6, 8], [12, 14]].map(([a, b]) => cs[a].c - cs[b].c);
    check(drops.every((d) => d >= 35 && d <= 40) && cs.every((k) => k.h < 4680), `Direction dominante (MUT 2) : chutes ${drops.join(", ")} $`);
    // H4 : zone 1.1750-1.1760 rejetée au moins deux fois, rien au-dessus de 1.1760 après le passage dessous, prix 1.1715
    const h = CS["htf-filter-h4"], f = h.findIndex((k) => k.c < 1.175);
    check(h.slice(f + 1).every((k) => k.h <= 1.176) && h.filter((k, i) => i > f && k.h >= 1.175 && k.c < k.o).length >= 2 && h[h.length - 1].c === 1.1715, "Filtre (MUT 2) : rejets sous 1.1760, prix 1.1715");
  }
  {
    // Multi-UT 3 : depuis 4 680, FVG 4 648-4 660, mèche partiellement dans le FVG puis rejet
    const cs = CS["retour-deseq-xau"], g = largestFvg(cs, "bear");
    check(!!g && g.y1 === 4648 && g.y2 === 4660 && Math.max(...cs.map((k) => k.h)) === 4680, "Retour (MUT 3) : FVG 4 648-4 660 depuis 4 680");
    const t = cs.findIndex((k, i) => !!g && i > g.i + 2 && k.h >= 4648);
    check(t > 0 && cs[t + 1].h > 4648 && cs[t + 1].h < 4660 && cs[t + 1].o - cs[t + 1].c >= 12, "Retour (MUT 3) : mèche partielle puis rejet fort");
    // H1 : support 1.1760 cassé, FVG 1.1750-1.1760, remontée aux corps haussiers décroissants
    const z = CS["zone-prep-h1"], zg = largestFvg(z, "bear");
    check(!!zg && near(zg.y1, 1.175, 1e-9) && near(zg.y2, 1.176, 1e-9) && z.slice(0, zg.i).every((k) => k.l >= 1.176), "Zone (MUT 3/5) : support 1.1760 et FVG 1.1750-1.1760");
    const low = z.reduce((b, k, i) => (k.l < z[b].l ? i : b), 0);
    const ups = z.map((k, i) => (i > low && k.c > k.o ? k.c - k.o : -1)).filter((b) => b >= 0);
    check(ups.every((b, i) => i === 0 || b <= ups[i - 1] + 1e-9) && z[z.length - 1].h < 1.176, "Zone (MUT 3/5) : corps décroissants, pas encore de réaction");
  }
  {
    // Multi-UT 4/5 : 3 mèches > 1.1760 (≤ 1.1770) sans clôture au-dessus, creux 1.1748 cassé, retour à 1.1758, SL 1.1772, TP 1.1695 (R/R 4,5)
    const cs = CS["ltf-confirm"], w = cs.filter((k) => k.h > 1.176);
    check(w.length === 3 && w.every((k) => k.c <= 1.176 && k.h <= 1.177) && Math.max(...w.map((k) => k.h)) === 1.177, "Confirmation (MUT 4/5) : 3 mèches de rejet");
    const lowAt = cs.findIndex((k) => k.l === 1.1748), b = cs.findIndex((k, i) => i > lowAt && k.c < 1.1748);
    check(lowAt > 0 && b > 0 && cs.slice(b - 2, b + 2).filter((k) => k.c < k.o).length >= 3 && cs.some((k, i) => i > b && k.h >= 1.1758 && k.h < 1.1772), "Confirmation (MUT 4/5) : breakout de 1.1748 puis retour à 1.1758");
    check(near(rrOf(1.1758, 1.1772, 1.1695), 4.5, 0.005), "Confirmation (MUT 5) : R/R 4,5");
  }
}
