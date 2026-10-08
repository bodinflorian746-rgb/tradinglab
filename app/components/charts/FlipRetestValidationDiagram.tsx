// Support-résistance 3 — valider le retest d'un flip. EUR/USD H4 : résistance
// 1.1850 touchée 3 fois, breakout clôturé à 1.1878, 4 bougies sans réintégration,
// retour sur la zone devenue support. Trois signaux de rejet acceptables : pin bar
// (mèche basse 1.1842, clôture 1.1858, plan de la leçon), engulfing haussier,
// réaction immédiate. Bougies : scenarios.ts (« flip-pin / -engulfing / -reaction »).

import { LessonChart, type LCMarker, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ZONE = { y1: 1.1840, y2: 1.1850 };
const zone = (named: boolean) => ({ key: "zone", ...ZONE, ...(named ? { label: "Ancienne résistance 1.1840-1.1850", short: "Zone" } : {}), tone: "zone" as const, kind: "flip" });

export default function FlipRetestValidationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const pin = CANDLES["flip-pin"];
  const breakoutI = pin.findIndex((k) => k.c === 1.1878);
  const ctx: LCPanel = {
    key: "contexte", title: "Le flip", subtitle: "EUR/USD H4 — résistance 1.1850 touchée 3 fois, breakout à 1.1878, retour sur la zone",
    decimals: 5, height: 260, candles: pin.slice(0, -1),
    zones: [zone(true)],
    markers: [{ key: "bo", i: breakoutI, price: pin[breakoutI].c, label: `Breakout : clôture ${fmtPrice(pin[breakoutI].c, 4)}`, short: "Breakout", tone: "bull", side: "above", role: "close" }],
  };
  const zoom = (key: "flip-pin" | "flip-engulfing" | "flip-reaction", title: string, sub: string, n: number, mark: string, sem: Pick<LCMarker, "role" | "dir"> = {}, at = 0): LCPanel => {
    const cs = CANDLES[key].slice(-(n + 7));
    const s = cs.length - n;
    return {
      key, title, subtitle: sub, decimals: 5, height: 220, candles: cs,
      zones: [zone(false)],
      markers: [{ key: "sig", i: s + at, price: Math.max(...cs.slice(s).map((k) => k.h)), label: mark, tone: "bull", side: "above", ...sem }],
    };
  };
  return (
    <LessonChart
      id="FlipRetestValidationDiagram"
      title="Valider le retest : 3 signaux de rejet"
      panels={[
        ctx,
        zoom("flip-pin", "Pin bar de rejet", "Mèche basse dans la zone (1.1842), clôture 1.1858", 1, "Pin bar", { role: "pinbar", dir: "bull" }),
        zoom("flip-engulfing", "Engulfing haussier", "La verte englobe le corps de la rouge", 2, "Engulfing", { role: "engulfing" }, 1),
        zoom("flip-reaction", "Réaction immédiate", "Rebond net en 1-2 bougies, sans pénétration profonde", 2, "Rebond"),
      ]}
      rows={[1, 3]}
      caption="Sans signal de rejet au contact de la zone inversée, le flip n'est pas validé."
    />
  );
}
