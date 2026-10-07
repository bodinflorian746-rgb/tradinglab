// Chiffres du texte des leçons redonnés par les données des schémas (lots 2 et
// suivants). Appelé par data.ts.
import CANDLES from "@/lib/lessons/generated/candles.json";
import { fibLevel, pivots, rsi, type Candle } from "@/lib/lessons/chart-analysis";

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
}

export { CS, near, rrOf, isPin, engulfs };
