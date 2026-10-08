"use client";

// Trading Avancé 6 — « Le support vient d'être percé par une longue mèche : que fais-tu ? »
// EUR/USD H1, support 1.0800 touché deux fois. Un seul futur pour les trois choix : la
// bougie clôture au-dessus du support (chasse aux stops), puis le prix monte. Pendant la
// question, la bougie est en cours (prix sous le support). Bougies : scenarios.ts (« stop-hunt »).

import { useState } from "react";
import { LessonChart, type LCLevel, type LCMarker } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import { STOPHUNT_WICK } from "@/lib/lessons/scenarios-meta";
import CANDLES from "@/lib/lessons/generated/candles.json";

type Choice = null | "sell" | "wait" | "buy";
const SUPPORT = 1.0800;
const p = (x: number) => fmtPrice(x, 4);

const RESULTS = {
  sell: { tone: "bear", title: "Chasse aux stops : tu t'es fait piéger", text: "La mèche était une chasse de liquidité : les institutions cherchaient les stops des acheteurs sous le support pour entrer à l'achat. La bougie clôture au-dessus du support et le prix remonte, ton SL est touché." },
  wait: { tone: "bull", title: "Patience : bonne décision", text: "Tu as attendu la clôture : la bougie clôture au-dessus du support, la mèche était une chasse aux stops. Tu peux maintenant chercher une entrée à l'achat avec un signal de confirmation, SL sous la mèche." },
  buy: { tone: "zone", title: "Gagné, mais par chance", text: "Le prix est remonté, mais au moment de ton achat, rien ne distinguait ce piège d'un vrai breakout : ni clôture, ni signal de retournement. Sans confirmation, la même décision perd dès que le support cède vraiment." },
} as const;

export function StopHuntInteractive(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const [choice, setChoice] = useState<Choice>(null);
  const all = CANDLES["stop-hunt"];
  const wick = all[STOPHUNT_WICK];
  // bougie en cours pendant la question : même ouverture, mêmes extrêmes jusqu'ici, prix actuel sous le support
  const live = { o: wick.o, h: Math.max(wick.o, all[STOPHUNT_WICK - 1].c) + 0.0002, l: wick.l, c: wick.l + 0.0004 };
  const shown = choice ? all : [...all.slice(0, STOPHUNT_WICK), live];
  const levels: LCLevel[] = [{ key: "sup", price: SUPPORT, label: `Support ${p(SUPPORT)}`, short: "Support", tone: "bull", dashed: true, role: "support", to: STOPHUNT_WICK - 1 }];
  const markers: LCMarker[] = [];
  if (!choice) markers.push({ key: "now", i: STOPHUNT_WICK, price: live.l, label: "Mèche en cours", short: "Mèche", tone: "zone", side: "below" });
  else {
    markers.push({ key: "close", i: STOPHUNT_WICK, price: wick.c, label: `Clôture ${p(wick.c)} au-dessus`, short: "Clôture au-dessus", tone: "bull", side: "below", role: "close" });
    if (choice === "sell") {
      const entry = live.c, sl = SUPPORT + 0.0015;
      const hit = all.findIndex((k, i) => i > STOPHUNT_WICK && k.h >= sl);
      levels.push({ key: "sl", price: sl, from: STOPHUNT_WICK, label: `SL de la vente ${p(sl)}`, short: "SL", tone: "bear", dashed: true }, { key: "entry", price: entry, from: STOPHUNT_WICK, to: STOPHUNT_WICK, label: `Vente ${p(entry)}`, short: "Vente", tone: "entry" });
      if (hit > 0) markers.push({ key: "hit", i: hit, price: sl, label: "SL touché", tone: "bear", side: "above", dot: true });
    }
    if (choice === "buy") levels.push({ key: "entry", price: live.c, from: STOPHUNT_WICK, label: `Achat ${p(live.c)}`, short: "Achat", tone: "entry" });
  }
  const r = choice ? RESULTS[choice] : null;
  return (
    <LessonChart
      id="StopHuntInteractive"
      title={choice ? "Ce qui s'est passé" : "Le support vient d'être percé par une longue mèche : que fais-tu ?"}
      panels={[{ key: "h1", subtitle: "EUR/USD H1 — support 1.0800 touché deux fois", decimals: 5, height: 260, candles: shown, slots: all.length, levels, markers }]}
    >
      {!r ? (
        <div className="lc-choices">
          <button type="button" className="lc-choice" onClick={() => setChoice("sell")}>Vendre le breakout</button>
          <button type="button" className="lc-choice" onClick={() => setChoice("wait")}>Attendre la clôture</button>
          <button type="button" className="lc-choice" onClick={() => setChoice("buy")}>Acheter tout de suite</button>
        </div>
      ) : (
        <div className="lc-result">
          <div className={`ls-card ls-tone--${r.tone}`}>
            <div className="ls-card-title">{r.title}</div>
            <div className="ls-card-text">{r.text}</div>
          </div>
          <button type="button" className="lc-choice" onClick={() => setChoice(null)}>Rejouer</button>
        </div>
      )}
    </LessonChart>
  );
}
