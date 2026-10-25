// Confluence : trois raisons indépendantes au même prix. Schéma en ligne
// (clôtures H4, lib/lessons/line-data.ts), niveaux calculés sur les prix
// (lib/lessons/models.ts) :
// - "structure" (Trading Intermédiaire 5) : support historique respecté 2×,
//   dernier Higher Low, Fibonacci 61.8% du dernier mouvement impulsif ;
// - "chiffre-rond" (Support-résistance 2) : support historique, Fibonacci
//   61.8%, chiffre rond 1.1800.
// La zone de confluence couvre les trois niveaux, là où leurs lignes se rejoignent.

import { LessonChart, type LCLevel, type LCMarker, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import type { ConfluenceVariant } from "@/lib/lessons/line-data";
import { confluenceModel } from "@/lib/lessons/models";

export function ConfluenceDiagram({ className = "", variant = "structure" }: { className?: string; locale?: "fr" | "es" | "en"; variant?: ConfluenceVariant }) {
  const m = confluenceModel(variant);
  const levels: LCLevel[] = [
    { key: "support", price: m.support, from: m.L1.index - 2, label: "Support historique", short: "Support", tone: "bull", dashed: true },
    variant === "structure"
      ? { key: "hl", price: m.L2.price, from: m.L2.index, label: "Dernier HL", tone: "sky" }
      : { key: "round", price: m.round, from: 0, label: `Chiffre rond ${fmtPrice(m.round, 4)}`, short: "Chiffre rond", tone: "zone", dashed: true, faint: true },
    { key: "fib", price: m.fib, from: m.A.index, label: "Fibonacci 61.8%", short: "Fibo 61.8%", tone: "fib", dashed: true },
  ];
  // repères du tracé Fibonacci : 100 % sur le départ A, 0 % sur le sommet B
  const fibEnds: LCMarker[] = [{ key: "f100", i: m.A.index, price: m.A.price, label: "100 %", tone: "fib", side: "below", dot: true }];
  const markers: LCMarker[] = variant === "structure"
    ? [...fibEnds, ...m.piv.filter((q) => q.name && q.index > m.A.index).map((q) => ({
      key: `p${q.index}`, i: q.index, price: q.price, label: q.index === m.B.index ? `${q.name} · 0 %` : q.name!, pivot: q.name, tone: q.side === "h" ? "neutral" as const : "sky" as const,
      side: q.side === "h" ? "above" as const : "below" as const, dot: q.side === "l",
    }))]
    : [...fibEnds, { key: "f0", i: m.B.index, price: m.B.price, label: "0 %", tone: "fib", side: "above", dot: true },
      ...[m.L1, m.L2].map((q, k) => ({ key: `r${k}`, i: q.index, price: q.price, label: `Rebond ${k + 1}`, tone: "bull" as const, side: "below" as const, dot: true }))];

  const panel: LCPanel = {
    key: variant,
    subtitle: `EUR/USD H4 — Fibonacci tracé de ${fmtPrice(m.A.price, 4)} à ${fmtPrice(m.B.price, 4)}`,
    decimals: 4, height: 300,
    line: m.line,
    zones: [{ key: "confluence", ...m.zone, from: m.L2.index, label: "Zone de confluence", short: "Confluence", tone: "bull", kind: "confluence", role: "confluence", ref: variant === "structure" ? "support,hl,fib" : "support,round,fib" }],
    levels,
    segments: [{ key: "fib-trace", i1: m.A.index, p1: m.A.price, i2: m.B.index, p2: m.B.price, tone: "fib", dashed: true }],
    markers,
  };
  return (
    <div className={className}>
      <LessonChart id="ConfluenceDiagram" title="3 confluences au même endroit" panels={[panel]} />
    </div>
  );
}
