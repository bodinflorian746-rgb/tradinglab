// Chiffres du texte des leçons redonnés par les données des schémas (lots 2 et
// suivants). Appelé par data.ts.
import CANDLES from "@/lib/lessons/generated/candles.json";
import { fibLevel, pivots, type Candle } from "@/lib/lessons/chart-analysis";

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
}

export { CS, near, rrOf, isPin, engulfs };
