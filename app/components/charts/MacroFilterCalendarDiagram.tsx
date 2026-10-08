// Macro-trading 4 bloc 1 — filtre calendrier (XAU/USD M15) : calme pré-news, puis
// publication CPI → volatilité extrême (4 710 $ puis chute 4 610 $). Un setup court
// techniquement solide aurait été invalidé par la volatilité. Checklist filtre en dessous.
// Bougies : scenarios.ts (« macro-filter-news »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Checklist } from "@/app/components/lessons/LessonSchema";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const NEWS_I = 4;

export function MacroFilterCalendarDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["macro-filter-news"];
  const peak = Math.max(...cs.map((k) => k.h));
  const peakAt = cs.findIndex((k) => k.h === peak);
  const low = Math.min(...cs.map((k) => k.l));
  const lowAt = cs.findIndex((k) => k.l === low);
  const amplitude = Math.round(peak - low);
  return (
    <LessonChart
      id="MacroFilterCalendarDiagram"
      title="Un filtre rouge calendrier : pas de trade"
      caption="News majeure dans les 30 minutes = filtre rouge. Aucun setup technique ne justifie de trader sur une publication majeure."
      panels={[{
        key: "m15", title: "XAU/USD M15 — CPI à 13h30 UTC", decimals: 0, height: 260, candles: cs,
        markers: [
          { key: "news", i: NEWS_I, price: cs[NEWS_I].h, label: "CPI 13h30 UTC", short: "CPI", tone: "zone", side: "above" },
          { key: "peak", i: peakAt, price: peak, label: usd(peak), tone: "bull", side: "above" },
          { key: "low", i: lowAt, price: low, label: usd(low), tone: "bear", side: "below" },
        ],
        chips: [
          { label: `Amplitude ${usd(amplitude)} en quelques bougies`, tone: "zone" },
          { label: "SL emporté avant que le scénario s'exprime", tone: "bear" },
        ],
      }]}
    >
      <div style={{ marginTop: 16 }}>
        <Checklist items={[
          { ok: true, title: "Setup court XAU/USD techniquement solide", text: "Prix sous résistance, structure baissière nette." },
          { ok: false, title: "News majeure dans 25 minutes (CPI)", text: "Volatilité de 50-100 $ probable : SL emporté." },
          { ok: false, title: "Filtre rouge → pas de trade", text: "On attend la digestion de la news (30-60 min) avant de réévaluer." },
        ]} />
      </div>
    </LessonChart>
  );
}
