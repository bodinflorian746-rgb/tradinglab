// SMC 1 — structure externe vs interne, XAU/USD. Externe (Daily) : LH / LL, biais
// baissier. Interne (H1, zoom sur le dernier pullback 4 540$ → 4 640$) : HL / HH à
// l'intérieur du LL / LH externe, sous le dernier LH externe. Pivots calculés.
// Bougies : scenarios.ts (« external-daily », « internal-h1 »).

import { LessonChart, type LCMarker } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function InternalVsExternalStructureZoomDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const ext = CANDLES["external-daily"], int = CANDLES["internal-h1"];
  const named = (cs: typeof ext): LCMarker[] => pivots(cs, 2).filter((q) => q.name).map((q) => ({
    key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name, tone: "neutral", side: q.side === "h" ? "above" : "below",
  }));
  const lastLH = pivots(ext, 2).filter((q) => q.name === "LH").at(-1)!;
  const lastLL = pivots(ext, 2).filter((q) => q.name === "LL").at(-1)!;
  return (
    <LessonChart
      id="InternalVsExternalStructureZoomDiagram"
      title="Structure externe vs structure interne"
      panels={[
        {
          key: "externe", title: "Externe · Daily", subtitle: "LH / LL : biais baissier sur plusieurs semaines",
          decimals: 1, height: 250, candles: ext, markers: named(ext),
          zones: [{ key: "zoom", y1: lastLL.price, y2: Math.max(...ext.slice(lastLL.index).map((k) => k.h)), from: lastLL.index, label: "Zoom H1", tone: "zone", kind: "zone" }],
        },
        {
          key: "interne", title: "Interne · H1", subtitle: "HL / HH dans le pullback, sous le dernier LH externe",
          decimals: 1, height: 250, candles: int, markers: named(int),
          levels: [{ key: "lh", price: lastLH.price, label: `LH externe ${usd(lastLH.price)}`, short: "LH externe", tone: "bear", dashed: true }],
        },
      ]}
      rows={[2]}
      caption="Une mini-structure haussière dans une grande tendance baissière : trader dans le sens externe = alignement institutionnel."
    />
  );
}
