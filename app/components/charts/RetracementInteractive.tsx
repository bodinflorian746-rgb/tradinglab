"use client";

// Trading Intermédiaire 4 — « Quand entres-tu ? ». EUR/USD H1 en tendance haussière,
// le prix retrace vers le Higher Low (zone de l'ancien sommet 1.0860) sans l'avoir
// atteint. Trois choix, un seul futur du marché : repli jusqu'à la zone, pin bar,
// nouveau HH. Le choix ne change que l'entrée et le stop du joueur.
// Bougies : scenarios.ts (« retracement », RETRACE_DECISION).

import { useState } from "react";
import { LessonChart, type LCLevel, type LCMarker } from "@/app/components/lessons/LessonChart";
import { fmtPrice, fmtRR, tradeMath } from "@/lib/lessons/chart-analysis";
import { RETRACE_DECISION } from "@/lib/lessons/scenarios-meta";
import CANDLES from "@/lib/lessons/generated/candles.json";

type Choice = null | "fomo" | "patience" | "reverse";
const p = (x: number) => fmtPrice(x, 4);
const ZONE = { y1: 1.0855, y2: 1.0862 };

export function RetracementInteractive(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const [choice, setChoice] = useState<Choice>(null);
  const all = CANDLES["retracement"];
  const now = all[RETRACE_DECISION];
  const pinI = all.findIndex((k, i) => i > RETRACE_DECISION && k.l <= ZONE.y2 && k.c > k.o);
  const pin = all[pinI];
  const lastHigh = Math.max(...all.slice(0, RETRACE_DECISION + 1).map((k) => k.h));
  const trades = {
    fomo: { entry: now.c, sl: now.l - 0.0002, side: "long" as const },
    patience: { entry: pin.c, sl: pin.l - 0.0004, side: "long" as const },
    reverse: { entry: now.c, sl: lastHigh + 0.0004, side: "short" as const },
  };
  const t = choice ? trades[choice] : null;
  const shown = choice ? all : all.slice(0, RETRACE_DECISION + 1);
  const hitI = t ? all.findIndex((k, i) => i > (choice === "patience" ? pinI : RETRACE_DECISION) && (t.side === "long" ? k.l <= t.sl : k.h >= t.sl)) : -1;
  const tp = Math.max(...all.map((k) => k.h));
  const levels: LCLevel[] = t ? [
    { key: "entry", price: t.entry, from: choice === "patience" ? pinI : RETRACE_DECISION, label: `${t.side === "long" ? "Achat" : "Vente"} ${p(t.entry)}`, short: t.side === "long" ? "Achat" : "Vente", tone: "entry" },
    { key: "sl", price: t.sl, from: choice === "patience" ? pinI : RETRACE_DECISION, label: `SL ${p(t.sl)}`, short: "SL", tone: "bear", dashed: true },
  ] : [];
  const markers: LCMarker[] = [];
  if (t && hitI > 0) markers.push({ key: "hit", i: hitI, price: t.sl, label: "SL touché", tone: "bear", side: t.side === "long" ? "below" : "above", dot: true });
  if (choice === "patience") markers.push({ key: "pin", i: pinI, price: pin.l, label: "Pin bar sur le HL", short: "Pin bar", tone: "bull", side: "below" });
  if (!choice) markers.push({ key: "now", i: RETRACE_DECISION, price: now.l, label: "Maintenant", tone: "zone", side: "below" });
  const result = !choice ? null : choice === "patience"
    ? { tone: "bull", title: "Patience : entrée au HL", text: `Le repli s'arrête sur la zone du HL, pin bar haussière, entrée à ${p(pin.c)}. Le prix repart dans le sens de la tendance jusqu'à ${p(tp)} : trade gagnant (R/R ${fmtRR(tradeMath(pin.c, trades.patience.sl, tp).rr)} sur ce sommet).` }
    : choice === "fomo"
      ? { tone: "bear", title: "FOMO : entrée trop tôt", text: "Tu es entré pendant le repli, pas au HL. Le prix continue sa correction et touche ton stop avant de repartir sans toi. Attends la zone de structure." }
      : { tone: "bear", title: "Contre-tendance : vente dans une hausse", text: "Le repli était une correction normale, pas un retournement. Le prix reprend sa montée et touche ton stop. Pas de vente sans cassure de structure." };
  return (
    <LessonChart
      id="RetracementInteractive"
      title={choice ? "Ce qui s'est passé" : "Le prix retrace vers le HL : que fais-tu ?"}
      panels={[{
        key: "h1", subtitle: "EUR/USD H1 — tendance haussière (HL puis HH)",
        decimals: 5, height: 280, candles: shown, slots: all.length,
        zones: [{ key: "hl", ...ZONE, label: "Zone du HL", tone: "sky", kind: "zone" }],
        levels, markers,
      }]}
    >
      {!choice ? (
        <div className="lc-choices">
          <button type="button" className="lc-choice" onClick={() => setChoice("fomo")}>Acheter maintenant</button>
          <button type="button" className="lc-choice lc-choice--good" onClick={() => setChoice("patience")}>Attendre le HL</button>
          <button type="button" className="lc-choice" onClick={() => setChoice("reverse")}>Vendre</button>
        </div>
      ) : (
        <div className="lc-result">
          <div className={`ls-card ls-tone--${result!.tone}`}>
            <div className="ls-card-title">{result!.title}</div>
            <div className="ls-card-text">{result!.text}</div>
          </div>
          <button type="button" className="lc-choice" onClick={() => setChoice(null)}>Rejouer</button>
        </div>
      )}
    </LessonChart>
  );
}
