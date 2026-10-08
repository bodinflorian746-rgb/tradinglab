// Deux usages :
// - Intermédiaire 6 (par défaut) — les deux pièges du texte (EUR/USD H1) : mèche jusqu'à 1.0965
//   au-dessus de la résistance 1.0950 et clôture dessous (acheteurs piégés) ; mèche jusqu'à 1.0840
//   sous le support 1.0850 et clôture au-dessus (vendeurs piégés).
// - Support / résistance 4 (variant « sr4 ») — le plan XAU/USD H1 : résistance 4 650 touchée 3 fois,
//   bougie 1 mèche 4 680 / clôture 4 655, bougie 2 clôture 4 640 ; short 4 640, SL 4 685, TP 4 540.
// Mèches, clôtures et R/R calculés. Bougies : scenarios.ts (« fake-up-eur », « fake-down-eur », « fake-sr4 »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { tradeSetup, usd } from "@/app/components/lessons/trade";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

function trap(key: "fake-up-eur" | "fake-down-eur", level: number, up: boolean, title: string): LCPanel {
  const cs = CANDLES[key] as Candle[];
  const k = cs.findIndex((x) => (up ? x.h > level : x.l < level));
  return {
    key, title, decimals: 5, height: 220, candles: cs,
    subtitle: up ? `Mèche ${p(cs[k].h)}, clôture ${p(cs[k].c)}` : `Mèche ${p(cs[k].l)}, clôture ${p(cs[k].c)}`,
    levels: [{ key: "lvl", price: level, label: `${up ? "Résistance" : "Support"} ${p(level)}`, short: up ? "Résistance" : "Support", tone: "zone" }],
    markers: [{ key: "k", i: k, price: up ? cs[k].h : cs[k].l, label: up ? "Acheteurs piégés" : "Vendeurs piégés", short: "Piège", tone: up ? "bear" : "bull", side: up ? "above" : "below" }],
  };
}

export function GraphFakeBreakout({ variant = "int6" }: { variant?: "int6" | "sr4"; className?: string; locale?: "fr" | "es" | "en" }) {
  if (variant === "sr4") {
    const cs = CANDLES["fake-sr4"];
    const b1 = cs.reduce((b, k, i) => (k.h > cs[b].h ? i : b), 0), b2 = b1 + 1;
    const t = tradeSetup({ entry: cs[b2].c, sl: 4685, tp: 4540, unit: "$", from: b2, tpOffscale: true, expect: ">2.2", names: { entry: "Entrée short" } });
    return (
      <LessonChart
        id="GraphFakeBreakout"
        title="Fake breakout : double confirmation, puis short"
        caption="Bougie 1 : mèche au-dessus, clôture à la limite. Bougie 2 : réintégration franche. Le trade se prend dans le sens opposé."
        panels={[{
          key: "h1", title: "XAU/USD H1, résistance 4 650 $", decimals: 0, height: 280, candles: cs,
          levels: [{ key: "lvl", price: 4650, label: `Résistance ${usd(4650)} (3 touches)`, short: "Résistance", tone: "zone" }, ...t.levels],
          offscale: t.offscale,
          markers: [
            { key: "b1", i: b1, price: cs[b1].h, label: `Bougie 1 : mèche ${usd(cs[b1].h)}`, short: "Bougie 1", tone: "bear", side: "above" },
            { key: "b2", i: b2, price: cs[b2].l, label: `Bougie 2 : clôture ${usd(cs[b2].c)}`, short: "Bougie 2", tone: "bear", side: "below" },
          ],
          chips: t.chips,
        }]}
      />
    );
  }
  return (
    <LessonChart
      id="GraphFakeBreakout"
      title="À quoi ressemble un fake breakout"
      caption="Longue mèche au-delà du niveau, clôture de l'autre côté : ceux qui ont suivi le breakout sont piégés."
      panels={[trap("fake-up-eur", 1.095, true, "Fake breakout haussier"), trap("fake-down-eur", 1.085, false, "Fake breakout baissier")]}
      rows={[2]}
    />
  );
}
