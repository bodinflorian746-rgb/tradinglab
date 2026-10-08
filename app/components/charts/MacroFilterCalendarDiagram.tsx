// Macro-trading 4 bloc 1 — le calendrier est le premier filtre (XAU/USD M5), exemple du
// texte : à 13h25 UTC, setup short parfait sous la résistance, mais le CPI tombe à 13h30.
// La bougie du CPI emporte le stop d'un short (au-dessus de la résistance) avant que le
// scénario baissier ne s'exprime : 100 $ d'amplitude. Filtre rouge : pas de trade.
// Mouvements calculés. Bougies : scenarios.ts (« macro-filter-news »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Checklist } from "@/app/components/lessons/LessonSchema";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const RES = 4665, SL = 4672;
const SETUP = 6, CPI = 7; // 13h25 et 13h30 UTC (12h55 = bougie 0)

export function MacroFilterCalendarDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["macro-filter-news"];
  const peak = cs[CPI].h, low = Math.min(...cs.slice(CPI).map((k) => k.l));
  return (
    <LessonChart
      id="MacroFilterCalendarDiagram"
      title="CPI dans 5 minutes : filtre rouge"
      caption="On attend que la publication soit digérée (30 à 60 minutes) avant de réévaluer."
      panels={[{
        key: "m5", title: "XAU/USD M5, de 12h55 à 13h55 UTC", decimals: 0, height: 260, candles: cs,
        levels: [
          { key: "res", price: RES, to: CPI, label: `Résistance ${usd(RES)}`, short: "Résistance", tone: "zone" },
          { key: "sl", price: SL, from: SETUP, label: `SL du short ${usd(SL)}`, short: "SL du short", tone: "bear", dashed: true },
        ],
        markers: [
          { key: "setup", i: SETUP, price: cs[SETUP].l, label: "13h25 : setup short", short: "Setup", tone: "entry", side: "below" },
          { key: "cpi", i: CPI, price: peak, label: `13h30 CPI : ${usd(peak)}`, short: "CPI", tone: "bear", side: "above" },
        ],
        chips: [{ label: `${usd(peak - low)} d'amplitude : SL emporté avant la baisse`, tone: "bear" }],
      }]}
    >
      <div style={{ marginTop: 16 }}>
        <Checklist items={[
          { ok: true, title: "Setup technique", text: "Prix sous résistance, structure baissière nette." },
          { ok: false, title: "Calendrier", text: "CPI américain à 13h30 UTC : volatilité de 50 à 100 $ probable. Filtre rouge, pas de trade." },
        ]} />
      </div>
    </LessonChart>
  );
}
