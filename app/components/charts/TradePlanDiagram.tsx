// Deux usages, un même schéma de calcul (pas de lecture de prix) : tout est décidé avant
// l'entrée, risque et gains mesurés depuis l'entrée, R/R calculés.
// - Intermédiaire 8 (par défaut) — le plan « avec plan » du texte : zone d'achat 1.0850 décidée
//   le matin, SL 1.0835, TP 1.0950.
// - Price action 4 (variant « pa4 ») — le plan multi-unités de temps : entrée 1.1778, SL 1.1745,
//   TP 1.1840 puis 1.1900 (R/R 1,88 et 3,70).

import { Bars, LessonSchema, Sig } from "@/app/components/lessons/LessonSchema";
import { fmtPrice, fmtRR, pips, tradeMath } from "@/lib/lessons/chart-analysis";

const p = (x: number) => fmtPrice(x, 4);
const PLANS = {
  l8: { entry: 1.085, entryName: "Zone d'achat", sl: 1.0835, tps: [1.095] },
  pa4: { entry: 1.1778, entryName: "Entrée long", sl: 1.1745, tps: [1.184, 1.19] },
};

export function TradePlanDiagram({ variant = "l8" }: { variant?: "l8" | "pa4"; className?: string; locale?: "fr" | "es" | "en" }) {
  const plan = PLANS[variant];
  const risk = pips(plan.entry, plan.sl, 0.0001);
  const gains = plan.tps.map((tp) => ({ tp, pips: pips(tp, plan.entry, 0.0001), rr: tradeMath(plan.entry, plan.sl, tp).rr }));
  const sig = [`${plan.entryName} ${p(plan.entry)}`, `SL ${p(plan.sl)}`, ...gains.map((g, i) => `TP${gains.length > 1 ? ` ${i + 1}` : ""} ${p(g.tp)}`)].join(" · ");
  return (
    <LessonSchema id="TradePlanDiagram" title="Le plan, décidé avant d'entrer" caption="Tout est fixé avant l'entrée : risque connu, objectif clair, rien n'est modifié sous l'émotion.">
      <Sig s={sig} />
      <Bars max={Math.max(risk, ...gains.map((g) => g.pips))} items={[
        { label: "Risque", value: risk, display: `${risk} pips`, tone: "bear" },
        ...gains.map((g, i) => ({ label: `Gain${gains.length > 1 ? ` TP ${i + 1}` : ""}`, value: g.pips, display: `${g.pips} pips`, tone: "bull" as const, note: `R/R ${fmtRR(g.rr)}` })),
      ]} />
    </LessonSchema>
  );
}
