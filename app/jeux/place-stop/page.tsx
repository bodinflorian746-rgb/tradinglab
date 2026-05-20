"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPlaceStopChart,
  generatePlaceStopScenarios,
  scoreStopPlacement,
  ROUNDS_PER_SESSION,
  VERDICT_META,
  sessionVerdict,
  type PlaceStopChart,
  type PlaceStopInstance,
  type ScoreResult,
  type StopVerdict,
  type TradeDirection,
} from "@/lib/games/place-stop";
import { MiniChart } from "@/app/components/games/MiniChart";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BIAS_LABEL = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const MACRO_LABEL = { normal: "Normal", dangereux: "Dangereux" } as const;

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function biasClass(b: "bullish" | "bearish" | "range"): string {
  return b === "bullish" ? "text-emerald-400"
       : b === "bearish" ? "text-red-400"
       :                   "text-zinc-400";
}

function fmtPrice(p: number): string {
  return p.toFixed(2);
}

function fmtDistance(stop: number, entry: number): { pts: string; pct: string } {
  const delta = stop - entry;
  const pct = entry !== 0 ? (delta / entry) * 100 : 0;
  return { pts: (delta >= 0 ? "+" : "") + delta.toFixed(2), pct: (pct >= 0 ? "+" : "") + pct.toFixed(2) + "%" };
}

function fmtRR(stop: number, entry: number, tp: number | null, direction: TradeDirection): string {
  if (tp === null) return "—";
  const risk = Math.abs(entry - stop);
  if (risk < 0.001) return "—";
  const reward = direction === "BUY" ? tp - entry : entry - tp;
  if (reward <= 0) return "—";
  return "1:" + (reward / risk).toFixed(1);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface SessionStats {
  perfect:   number;
  good:      number;
  wide:      number;
  tight:     number;
  liquidity: number;
}

const EMPTY_STATS: SessionStats = { perfect: 0, good: 0, wide: 0, tight: 0, liquidity: 0 };

export default function PlaceStopPage() {
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<PlaceStopInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const [stop, setStop] = useState<number>(0);
  const [phase, setPhase] = useState<"placing" | "revealing" | "feedback">("placing");
  const [revealed, setRevealed] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS);
  const [showSummary, setShowSummary] = useState(false);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  const current = scenarios[idx];
  const chart: PlaceStopChart | null = useMemo(
    () => (current ? buildPlaceStopChart(current.id, current.seed, current.volatility) : null),
    [current],
  );

  // Init seed côté client
  useEffect(() => {
    const s = Math.floor(Math.random() * 1e9) >>> 0;
    setSeed(s);
    setScenarios(generatePlaceStopScenarios(s));
  }, []);

  // Reset state au scenario suivant
  useEffect(() => {
    if (!chart) return;
    setStop(chart.stopMeta.defaultStop);
    setPhase("placing");
    setRevealed(0);
    setResult(null);
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
  }, [chart]);

  // Animation reveal
  useEffect(() => {
    if (phase !== "revealing" || !chart) return;
    if (revealed >= chart.futureCandles.length) {
      animRef.current = setTimeout(() => {
        const r = scoreStopPlacement(stop, chart, streak);
        setResult(r);
        setScore((s) => s + r.points);
        if (r.points > 0) {
          const ns = streak + 1;
          setStreak(ns);
          setMaxStreak((m) => Math.max(m, ns));
        } else {
          setStreak(0);
        }
        setStats((s) => ({ ...s, [r.verdict]: s[r.verdict] + 1 }));
        setPhase("feedback");
      }, 350);
    } else {
      animRef.current = setTimeout(() => setRevealed((c) => c + 1), 190);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [phase, revealed, chart, stop, streak]);

  if (!chart || !current || seed === null) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">Chargement…</p>
      </main>
    );
  }

  const stopStepFine   = (chart.domain.max - chart.domain.min) / 70;
  const stopStepCoarse = stopStepFine * 5;

  const adjust = (delta: number) => {
    if (phase !== "placing") return;
    setStop((s) => {
      const next = s + delta;
      return Math.max(chart.stopMeta.bounds.min, Math.min(chart.stopMeta.bounds.max, next));
    });
  };

  const handleValidate = () => {
    if (phase !== "placing") return;
    setPhase("revealing");
    setRevealed(1);
  };

  const handleNext = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= scenarios.length || nextIdx >= ROUNDS_PER_SESSION) {
      setShowSummary(true);
    } else {
      setIdx(nextIdx);
    }
  };

  const handleReset = () => {
    const s = Math.floor(Math.random() * 1e9) >>> 0;
    setSeed(s);
    setScenarios(generatePlaceStopScenarios(s));
    setIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setStats(EMPTY_STATS);
    setShowSummary(false);
  };

  if (showSummary) {
    return <Summary score={score} maxStreak={maxStreak} stats={stats} onReset={handleReset} />;
  }

  const distance = fmtDistance(stop, chart.entry);
  const rr = fmtRR(stop, chart.entry, chart.tp, chart.direction);
  const isPlacing = phase === "placing";
  const isRevealing = phase === "revealing";
  const isFeedback = phase === "feedback";

  // Détection live du hit pendant l'animation (pour flash visuel)
  const liveHit =
    isRevealing &&
    chart.futureCandles.slice(0, revealed).some((k) =>
      chart.direction === "BUY" ? k.l <= stop : k.h >= stop,
    );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/jeux"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Jeux
          </Link>
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 uppercase tracking-wide">Round</span>
              <span className="font-bold text-white tabular-nums">{idx + 1}/{ROUNDS_PER_SESSION}</span>
            </div>
            <div className="w-px h-3 bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 uppercase tracking-wide">Score</span>
              <span className={`font-bold tabular-nums ${score < 0 ? "text-red-400" : "text-emerald-400"}`}>
                {score >= 0 ? "+" : ""}{score}
              </span>
            </div>
          </div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="mb-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold">
            <span className="text-amber-400">🔥</span>
            <span className="text-amber-400 tabular-nums">{streak}</span>
            <span className="text-zinc-500">de série</span>
            {streak >= 3 && <span className="text-amber-400">· bonus actif</span>}
          </div>
        )}

        {/* Scenario card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden mb-5">

          {/* Meta header */}
          <div className="px-4 pt-3 pb-2.5 border-b border-zinc-800/60 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tabular-nums">{current.asset}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-[11px] text-zinc-400">{current.session}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <VolBadge volatility={current.volatility} />
              <SpreadBadge spread={current.spread} />
            </div>
          </div>

          {/* News warning */}
          {current.macroContext === "dangereux" && (
            <div className="px-4 py-2.5 border-b border-zinc-800/60 bg-red-500/5 flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                <path d="M7 1L13 12H1L7 1z" stroke="#ef4444" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7 5.5v3M7 10v0.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <p className="text-[11px] text-red-400 font-semibold leading-snug">
                News macro imminente — volatilité hors normes attendue.
              </p>
            </div>
          )}

          {/* Mini chart with overlays */}
          <div className="p-3 sm:p-4">
            <MiniChart
              data={{
                candles: [...chart.pastCandles, ...chart.futureCandles],
                zones:   chart.zones,
                domain:  chart.domain,
              }}
              overlay={{
                entry:              { price: chart.entry, direction: chart.direction },
                tp:                 chart.tp !== null ? { price: chart.tp } : undefined,
                stop:               { price: stop, hit: isFeedback ? (result?.wasHit ?? false) : liveHit },
                separatorIndex:     chart.pastCandles.length,
                visibleFutureCount: revealed,
              }}
              height={185}
            />

            {/* Légende des lignes (HTML pour lisibilité mobile) */}
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px]">
              <LegendDot color="blue"    label={`Entrée ${chart.direction} ${fmtPrice(chart.entry)}`} />
              {chart.tp !== null && (
                <LegendDot color="emerald" label={`TP ${fmtPrice(chart.tp)}`} />
              )}
              <LegendDot color="red" label={`Stop ${fmtPrice(stop)}`} dashed />
              {chart.zones.map((z, i) => (
                <LegendDot
                  key={i}
                  color={
                    z.kind === "support" ? "emerald"
                  : z.kind === "resistance" ? "red"
                  : "amber"
                  }
                  label={z.label}
                  dashed
                />
              ))}
            </div>
          </div>

          {/* Context infos */}
          <div className="px-4 pb-3 grid grid-cols-3 gap-2">
            <InfoTile label="HTF" value={BIAS_LABEL[current.htfBias]} colorClass={biasClass(current.htfBias)} />
            <InfoTile label="Macro" value={MACRO_LABEL[current.macroContext]} colorClass={current.macroContext === "dangereux" ? "text-red-400" : "text-zinc-300"} />
            <InfoTile label="Volatilité" value={cap(current.volatility)} colorClass="text-zinc-300" />
          </div>

          {/* Context text */}
          <div className="px-4 pb-4">
            <p className="text-[13px] text-zinc-300 leading-relaxed">{current.context}</p>
          </div>
        </div>

        {/* Phase : placing → controls. Revealing → message. Feedback → panel */}
        {isPlacing && (
          <PlacingControls
            stop={stop}
            entry={chart.entry}
            tp={chart.tp}
            direction={chart.direction}
            distance={distance}
            rr={rr}
            onAdjust={adjust}
            onValidate={handleValidate}
            stepFine={stopStepFine}
            stepCoarse={stopStepCoarse}
          />
        )}

        {isRevealing && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-5 text-center">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Le marché bouge…
            </p>
            <p className="text-sm text-zinc-300">
              On regarde si ton stop survit aux {chart.futureCandles.length} prochaines bougies.
            </p>
          </div>
        )}

        {isFeedback && result && (
          <Feedback
            result={result}
            title={current.title}
            explanation={current.explanation}
            tag={current.tag}
            stop={stop}
            entry={chart.entry}
            direction={chart.direction}
            onNext={handleNext}
            isLast={idx + 1 >= ROUNDS_PER_SESSION}
          />
        )}

        {/* Stats footer */}
        <div className="mt-6 pt-5 border-t border-zinc-800/60">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
            Compétences
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatTile label="Discipline" value={derivedDiscipline(stats)} />
            <StatTile label="Protection" value={derivedProtection(stats)} />
            <StatTile label="Précision"  value={derivedPrecision(stats)} />
            <StatTile label="Agressivité" value={derivedAggression(stats)} />
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Compétences dérivées des verdicts ────────────────────────────────────────

function totalRounds(s: SessionStats): number {
  return s.perfect + s.good + s.wide + s.tight + s.liquidity;
}

function pct(n: number, d: number): string {
  if (d === 0) return "—";
  return Math.round((n / d) * 100) + "%";
}

function derivedDiscipline(s: SessionStats): string {
  const d = totalRounds(s);
  if (d === 0) return "—";
  return pct(d - s.liquidity, d);
}
function derivedProtection(s: SessionStats): string {
  const d = totalRounds(s);
  if (d === 0) return "—";
  return pct(s.perfect + s.good + s.wide, d);
}
function derivedPrecision(s: SessionStats): string {
  const d = totalRounds(s);
  if (d === 0) return "—";
  return pct(s.perfect, d);
}
function derivedAggression(s: SessionStats): string {
  const d = totalRounds(s);
  if (d === 0) return "—";
  return pct(s.perfect + s.good, d);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PlacingControlsProps {
  stop:        number;
  entry:       number;
  tp:          number | null;
  direction:   TradeDirection;
  distance:    { pts: string; pct: string };
  rr:          string;
  onAdjust:    (delta: number) => void;
  onValidate:  () => void;
  stepFine:    number;
  stepCoarse:  number;
}

function PlacingControls({
  stop, entry, tp, direction, distance, rr, onAdjust, onValidate, stepFine, stepCoarse,
}: PlacingControlsProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">

      {/* Infos prix */}
      <div className="px-4 pt-4 pb-3 border-b border-zinc-800/60 grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Entrée</p>
          <p className="text-sm font-bold text-blue-400 tabular-nums">{direction} {fmtPrice(entry)}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Stop actuel</p>
          <p className="text-base font-black text-red-400 tabular-nums">{fmtPrice(stop)}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Distance</p>
          <p className="text-sm font-semibold text-zinc-300 tabular-nums">{distance.pts} ({distance.pct})</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wide">RR estimé</p>
          <p className={`text-sm font-semibold tabular-nums ${rr === "—" ? "text-zinc-500" : "text-emerald-400"}`}>{rr}</p>
        </div>
      </div>

      {/* Boutons d'ajustement */}
      <div className="px-3 sm:px-4 py-4 grid grid-cols-4 gap-2">
        <AdjustButton onClick={() => onAdjust(-stepCoarse)} label="Plus bas (vite)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 6l5 5 5-5M5 12l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AdjustButton>
        <AdjustButton onClick={() => onAdjust(-stepFine)} label="Plus bas">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AdjustButton>
        <AdjustButton onClick={() => onAdjust(stepFine)} label="Plus haut">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 12l5-5 5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AdjustButton>
        <AdjustButton onClick={() => onAdjust(stepCoarse)} label="Plus haut (vite)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 8l5-5 5 5M5 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AdjustButton>
      </div>

      {/* Valider */}
      <div className="px-4 pb-4">
        <button
          onClick={onValidate}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 font-bold text-base px-5 py-3.5 rounded-xl hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]"
        >
          Valider le stop
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AdjustButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 active:scale-[0.96] rounded-xl py-3.5 transition-all"
    >
      {children}
    </button>
  );
}

interface FeedbackProps {
  result:      ScoreResult;
  title:       string;
  explanation: string;
  tag:         string;
  stop:        number;
  entry:       number;
  direction:   TradeDirection;
  onNext:      () => void;
  isLast:      boolean;
}

function Feedback({ result, title, explanation, tag, stop, entry, direction, onNext, isLast }: FeedbackProps) {
  const meta = VERDICT_META[result.verdict];
  const isPositive = result.basePoints > 0;
  const borderClass =
    meta.color === "emerald" ? "border-emerald-500/30"
  : meta.color === "amber"   ? "border-amber-500/30"
  :                            "border-red-500/30";
  const bgClass =
    meta.color === "emerald" ? "bg-emerald-500/8"
  : meta.color === "amber"   ? "bg-amber-500/8"
  :                            "bg-red-500/8";
  const textClass =
    meta.color === "emerald" ? "text-emerald-400"
  : meta.color === "amber"   ? "text-amber-400"
  :                            "text-red-400";

  return (
    <div className={`bg-zinc-900/50 border rounded-2xl overflow-hidden ${borderClass}`}>
      <div className={`px-4 py-3 ${bgClass} flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {isPositive ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" className={textClass} />
              <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={textClass} />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" className={textClass} />
              <path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={textClass} />
            </svg>
          )}
          <p className={`text-sm font-bold ${textClass} truncate`}>
            {meta.label}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-base font-black tabular-nums ${result.points >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {result.points >= 0 ? "+" : ""}{result.points}
          </p>
          {result.streakBonus > 0 && (
            <p className="text-[9px] text-amber-400 uppercase tracking-wide font-bold">
              +{result.streakBonus} streak
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
          {title}
        </p>
        <p className="text-[13px] text-zinc-300 leading-relaxed mb-3">{explanation}</p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg px-3 py-2">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Ton stop</p>
            <p className="text-sm font-bold text-red-400 tabular-nums">{fmtPrice(stop)}</p>
          </div>
          <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg px-3 py-2">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Distance entrée</p>
            <p className="text-sm font-bold text-zinc-300 tabular-nums">
              {direction === "BUY"
                ? (entry - stop).toFixed(2)
                : (stop - entry).toFixed(2)}
            </p>
          </div>
        </div>

        {result.wasHit && (
          <div className="text-[11px] text-red-400 mb-3 flex items-center gap-1.5 bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2">
            <span className="font-bold">⚠ Stop touché</span>
            <span className="text-zinc-400">— bougie {result.hitIndex! + 1} du futur</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">{tag}</span>
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2 transition-colors"
          >
            {isLast ? "Voir le bilan" : "Scénario suivant"}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg px-2.5 py-1.5">
      <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{label}</p>
      <p className={`text-[12px] font-semibold ${colorClass} truncate`}>{value}</p>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg px-3 py-2.5">
      <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className="text-sm font-bold text-white tabular-nums">{value}</p>
    </div>
  );
}

function VolBadge({ volatility }: { volatility: "faible" | "normale" | "élevée" }) {
  const cls =
    volatility === "élevée"  ? "text-amber-400 border-amber-400/30"
  : volatility === "faible"  ? "text-zinc-500 border-zinc-700"
  :                            "text-zinc-400 border-zinc-700";
  return (
    <span className={`border rounded-full px-2 py-0.5 font-semibold ${cls}`}>
      Vol. {volatility}
    </span>
  );
}

function SpreadBadge({ spread }: { spread: "faible" | "élevé" }) {
  const cls = spread === "élevé"
    ? "text-amber-400 border-amber-400/30"
    : "text-zinc-500 border-zinc-700";
  return (
    <span className={`border rounded-full px-2 py-0.5 font-semibold ${cls}`}>
      Spread {spread}
    </span>
  );
}

function LegendDot({ color, label, dashed }: { color: "blue" | "red" | "emerald" | "amber"; label: string; dashed?: boolean }) {
  const cls =
    color === "blue"    ? "bg-blue-500"
  : color === "emerald" ? "bg-emerald-500"
  : color === "amber"   ? "bg-amber-400"
  :                       "bg-red-500";
  const txt =
    color === "blue"    ? "text-blue-400"
  : color === "emerald" ? "text-emerald-400"
  : color === "amber"   ? "text-amber-400"
  :                       "text-red-400";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-1 rounded-sm ${cls}`} style={dashed ? { boxShadow: "inset 0 0 0 0 transparent" } : {}} />
      <span className={`text-[11px] font-medium ${txt}`}>{label}</span>
    </div>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function Summary({
  score, maxStreak, stats, onReset,
}: {
  score: number;
  maxStreak: number;
  stats: SessionStats;
  onReset: () => void;
}) {
  const total = totalRounds(stats);
  const verdict = sessionVerdict(score, stats.perfect, total);
  const verdictColor =
    score >= 700 ? "text-emerald-400"
  : score >= 0   ? "text-amber-400"
  :                "text-red-400";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/jeux"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white mb-6"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Jeux
        </Link>

        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          Bilan de session
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{ROUNDS_PER_SESSION} stops placés</h1>
        <p className={`text-sm font-semibold ${verdictColor} mb-7`}>{verdict}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <BigStat label="Score" value={`${score >= 0 ? "+" : ""}${score}`} colorClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
          <BigStat label="Stops parfaits" value={`${stats.perfect}/${total}`} colorClass="text-white" />
          <BigStat label="Liquidités" value={`${stats.liquidity}`} colorClass={stats.liquidity > 0 ? "text-red-400" : "text-zinc-300"} />
          <BigStat label="Meilleure série" value={`${maxStreak}`} colorClass="text-amber-400" />
        </div>

        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Compétences
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <SkillCard label="Discipline" value={derivedDiscipline(stats)} />
          <SkillCard label="Protection" value={derivedProtection(stats)} />
          <SkillCard label="Précision"  value={derivedPrecision(stats)} />
          <SkillCard label="Agressivité" value={derivedAggression(stats)} />
        </div>

        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Répartition des verdicts
        </p>
        <div className="grid grid-cols-5 gap-2 mb-8">
          <VerdictPill label="Parfaits"   value={stats.perfect}   color="emerald" />
          <VerdictPill label="Corrects"   value={stats.good}      color="emerald" />
          <VerdictPill label="Larges"     value={stats.wide}      color="amber"   />
          <VerdictPill label="Serrés"     value={stats.tight}     color="red"     />
          <VerdictPill label="Liquidité"  value={stats.liquidity} color="red"     />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-colors"
          >
            Rejouer 10 scénarios
          </button>
          <Link
            href="/jeux"
            className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 text-center transition-colors"
          >
            Retour aux jeux
          </Link>
        </div>
      </div>
    </main>
  );
}

function BigStat({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-3">
      <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-xl font-black tabular-nums ${colorClass}`}>{value}</p>
    </div>
  );
}

function SkillCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl px-3 py-3">
      <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className="text-lg font-black tabular-nums text-white">{value}</p>
    </div>
  );
}

function VerdictPill({ label, value, color }: { label: string; value: number; color: "emerald" | "amber" | "red" }) {
  const cls =
    color === "emerald" ? "border-emerald-500/30 text-emerald-400"
  : color === "amber"   ? "border-amber-500/30 text-amber-400"
  :                       "border-red-500/30 text-red-400";
  return (
    <div className={`border rounded-lg px-2 py-2 text-center ${cls}`}>
      <p className="text-base font-black tabular-nums">{value}</p>
      <p className="text-[9px] uppercase tracking-wide font-semibold opacity-80">{label}</p>
    </div>
  );
}
