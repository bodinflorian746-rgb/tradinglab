// Trading Avancé 8 — un journal en R et sa révision hebdomadaire : 8 trades, puis
// winrate, R moyen, drawdown maximum et pattern d'erreur, tous calculés sur la liste.

import { Cards, LessonSchema, Matrix, SchemaHeading } from "@/app/components/lessons/LessonSchema";
import { fmtNum } from "@/lib/lessons/chart-analysis";

const TRADES = [
  { date: "14/04", setup: "Sweep + CHoCH", rr: "1:2", r: 2, plan: true },
  { date: "14/04", setup: "Breakout de range", rr: "1:1,5", r: -1, plan: true },
  { date: "15/04", setup: "OB haussier", rr: "1:2,5", r: 2.5, plan: true },
  { date: "15/04", setup: "Breakout de range", rr: "1:1", r: -2, plan: false },
  { date: "16/04", setup: "FVG", rr: "1:2", r: 2, plan: true },
  { date: "16/04", setup: "Breakout de range", rr: "1:1,5", r: -1, plan: true },
  { date: "17/04", setup: "OB haussier", rr: "1:2", r: -1, plan: true },
  { date: "17/04", setup: "Sweep + CHoCH", rr: "1:3", r: 3, plan: true },
];
const R = (x: number) => `${x > 0 ? "+" : x < 0 ? "−" : ""}${fmtNum(Math.abs(x), 2)}R`;

export function TradingJournalDiagram(_props: { className?: string; locale?: string }) {
  const wins = TRADES.filter((t) => t.r > 0).length;
  const total = TRADES.reduce((a, t) => a + t.r, 0);
  let eq = 0, peak = 0, dd = 0;
  for (const t of TRADES) { eq += t.r; peak = Math.max(peak, eq); dd = Math.max(dd, peak - eq); }
  const setups = [...new Set(TRADES.map((t) => t.setup))].map((s) => ({ s, ts: TRADES.filter((t) => t.setup === s) }));
  const worst = setups.reduce((a, b) => (b.ts.reduce((x, t) => x + t.r, 0) < a.ts.reduce((x, t) => x + t.r, 0) ? b : a));
  const offPlan = TRADES.filter((t) => !t.plan);
  return (
    <LessonSchema id="TradingJournalDiagram" title="Un journal en R et sa révision de la semaine" caption="Plan : ✓ respecté, ✗ non respecté (SL déplacé).">
      <Matrix
        head={["Setup", "R/R prévu", "Résultat", "Plan"]}
        rows={TRADES.map((t) => ({
          label: t.date,
          cells: [
            { text: t.setup },
            { text: t.rr },
            { text: R(t.r), tone: t.r > 0 ? "bull" : "bear" },
            { text: t.plan ? "✓" : "✗", tone: t.plan ? undefined : "bear" },
          ],
        }))}
      />
      <SchemaHeading sub="Calculée sur les 8 trades">Révision hebdomadaire</SchemaHeading>
      <Cards cols={4} mobileCols={2} items={[
        { title: "Winrate", value: `${Math.round((wins / TRADES.length) * 100)} %`, text: `${wins} / ${TRADES.length} trades` },
        { title: "R moyen", value: R(total / TRADES.length), text: `Total ${R(total)}`, tone: total > 0 ? "bull" : "bear" },
        { title: "Drawdown max", value: R(-dd), text: "Du plus haut au plus bas", tone: "bear" },
        { title: "Pattern d'erreur", value: worst.s, text: `${worst.ts.filter((t) => t.r > 0).length} gain sur ${worst.ts.length} trades ; ${offPlan.length} trade hors plan`, tone: "zone" },
      ]} />
    </LessonSchema>
  );
}
