// Trading Avancé 9 — métriques d'un backtest de 100 trades. Chaque chiffre est
// calculé sur la liste des trades (lib/lessons/backtest.ts) : winrate, R moyen,
// profit factor, drawdown max (risque fixe de 1 % du capital par trade),
// nombre de trades, courbe du capital, répartition des résultats. Seuils : ceux
// du tableau de la leçon.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { BACKTEST_RISK_PCT, backtestStats, backtestTrades } from "@/lib/lessons/backtest";
import { fmtNum } from "@/lib/lessons/chart-analysis";

interface BacktestMetricsDiagramProps {
  className?: string;
}

const signed = (n: number, d = 1) => `${n >= 0 ? "+" : "−"}${fmtNum(Math.abs(n), d)}`;

export function BacktestMetricsDiagram({ className = "" }: BacktestMetricsDiagramProps) {
  const trades = backtestTrades();
  const s = backtestStats(trades);
  const final = s.equity[s.equity.length - 1] - 100;
  const metrics = [
    { key: "winrate", label: "Winrate", value: `${fmtNum(s.winrate, 0)} %`, rule: "> 40 %", ok: s.winrate > 40 },
    { key: "avgR", label: "R moyen", value: `${signed(s.avgR, 2)}R`, rule: "> +0,5R", ok: s.avgR > 0.5 },
    { key: "pf", label: "Profit factor", value: s.profitFactor.toFixed(1).replace(".", ","), rule: "> 1,5", ok: s.profitFactor > 1.5 },
    { key: "dd", label: "Drawdown max", value: `${fmtNum(s.maxDD, 1)} %`, rule: "< 15 %", ok: s.maxDD < 15 },
    { key: "n", label: "Trades", value: String(s.n), rule: "> 50", ok: s.n > 50 },
  ];
  const buckets = [...new Set(trades)].sort((a, b) => a - b).map((r) => ({ r, n: trades.filter((x) => x === r).length }));
  const maxN = Math.max(...buckets.map((b) => b.n));

  const equity: LCPanel = {
    key: "equity",
    title: "Capital au fil des 100 trades",
    subtitle: `En % du capital de départ, risque de ${BACKTEST_RISK_PCT} % par trade`,
    decimals: 1, height: 240,
    line: s.equity,
    measure: { name: "Capital", unit: "% du capital de départ (100 = départ)" },
    levels: [{ key: "start", price: 100, label: "Départ 100 %", short: "Départ", tone: "neutral", dashed: true, faint: true }],
    segments: [{ key: "dd", i1: s.ddPeak, p1: s.equity[s.ddPeak], i2: s.ddTrough, p2: s.equity[s.ddTrough], tone: "bear", arrow: true }],
    markers: [
      { key: "dd", i: s.ddTrough, price: s.equity[s.ddTrough], label: `Drawdown max −${fmtNum(s.maxDD, 1)} %`, short: `DD −${fmtNum(s.maxDD, 1)} %`, tone: "bear", side: "below", dot: true },
      { key: "final", i: s.n, price: s.equity[s.n], label: `Capital final ${signed(final, 0)} %`, short: `Final ${signed(final, 0)} %`, tone: "bull", side: "above", dot: true },
    ],
  };

  return (
    <div className={className}>
      <LessonChart id="BacktestMetricsDiagram" title="Backtest de 100 trades : les métriques clés" panels={[equity]}>
        <div className="lc-stats" data-metrics="">
          {metrics.map((m) => (
            <div key={m.key} className="lc-stat" data-metric={m.key} data-value={m.value} data-ok={m.ok ? "1" : "0"}>
              <div className="lc-stat-label">{m.label}</div>
              <div className="lc-stat-value">{m.value}</div>
              <div className={m.ok ? "lc-stat-rule" : "lc-stat-rule lc-stat-rule--bad"}>{m.ok ? "✓" : "✗"} seuil {m.rule}</div>
            </div>
          ))}
        </div>
        <div className="lc-dist" data-distribution="">
          <div className="lc-panel-title">Répartition des résultats</div>
          <div className="lc-panel-sub">Nombre de trades par résultat, en R</div>
          <div className="lc-dist-bars" style={{ gridTemplateColumns: `repeat(${buckets.length}, minmax(0, 1fr))` }}>
            {buckets.map((b) => (
              <div key={b.r} className="lc-dist-col" data-bucket={b.r} data-count={b.n}>
                <span className="lc-chip lc-dist-count">{b.n}</span>
                <div className={b.r < 0 ? "lc-dist-bar lc-dist-bar--loss" : "lc-dist-bar"} style={{ height: `${(b.n / maxN) * 96}px` }} />
                <span className="lc-dist-label">{signed(b.r, 0)}R</span>
              </div>
            ))}
          </div>
        </div>
      </LessonChart>
    </div>
  );
}
