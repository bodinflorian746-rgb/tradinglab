"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPlaceStopChart,
  computeHits,
  generatePlaceStopScenarios,
  scoreStopChoice,
  ROUNDS_PER_SESSION,
  DIFFICULTY_META,
  STOP_TYPE_META,
  sessionVerdict,
  type Difficulty,
  type PlaceStopChart,
  type PlaceStopInstance,
  type ScoreResult,
  type StopId,
  type StopOption,
  type StopType,
  type TradeDirection,
} from "@/lib/games/place-stop";
import { MiniChart } from "@/app/components/games/MiniChart";

// ─── Constantes UI ────────────────────────────────────────────────────────────

const BIAS_LABEL  = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const MACRO_LABEL = { normal: "Normal", dangereux: "Dangereux" } as const;
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

// Couleurs distinctes pour les 3 stops (rouge / amber / violet)
const STOP_COLORS: Record<StopId, { hex: string; bg: string; border: string; text: string; dot: string }> = {
  A: { hex: "#ef4444", bg: "bg-red-500/10",    border: "border-red-500/40",    text: "text-red-400",    dot: "bg-red-500"    },
  B: { hex: "#f59e0b", bg: "bg-amber-500/10",  border: "border-amber-500/40",  text: "text-amber-400",  dot: "bg-amber-500"  },
  C: { hex: "#a78bfa", bg: "bg-violet-500/10", border: "border-violet-500/40", text: "text-violet-400", dot: "bg-violet-500" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

interface SessionStats {
  logical:   number;
  wide:      number;
  tight:     number;
  liquidity: number;
}

const EMPTY_STATS: SessionStats = { logical: 0, wide: 0, tight: 0, liquidity: 0 };

export default function PlaceStopPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<PlaceStopInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<StopId | null>(null);
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
    () => (current && difficulty ? buildPlaceStopChart(current.id, current.seed, current.volatility, difficulty) : null),
    [current, difficulty],
  );

  // Reset state au scenario suivant
  useEffect(() => {
    if (!chart) return;
    setPhase("placing");
    setRevealed(0);
    setChosen(null);
    setResult(null);
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
  }, [chart]);

  // Animation reveal
  useEffect(() => {
    if (phase !== "revealing" || !chart) return;
    if (revealed >= chart.future.length) {
      animRef.current = setTimeout(() => setPhase("feedback"), 350);
    } else {
      animRef.current = setTimeout(() => setRevealed((c) => c + 1), 200);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [phase, revealed, chart]);

  // Détection live des hits pendant la reveal animation.
  // ⚠ DOIT être déclaré AVANT les early returns (rules of hooks).
  const hitMapLive = useMemo(() => {
    const map: Record<StopId, number | null> = { A: null, B: null, C: null };
    if (!chart) return map;
    const visibleFuture = chart.future.slice(0, revealed);
    for (const s of chart.stops) {
      for (let i = 0; i < visibleFuture.length; i++) {
        const k = visibleFuture[i];
        const hit = chart.direction === "BUY" ? k.l <= s.price : k.h >= s.price;
        if (hit) { map[s.id] = i; break; }
      }
    }
    return map;
  }, [chart, revealed]);

  // ─── Écran 1 : sélection difficulté ─────────────────────────────────────────
  if (!difficulty || !seed) {
    return <DifficultyPicker onPick={(d) => {
      const s = Math.floor(Math.random() * 1e9) >>> 0;
      setDifficulty(d);
      setSeed(s);
      setScenarios(generatePlaceStopScenarios(s, d));
    }} />;
  }

  // ─── Écran 3 : bilan ────────────────────────────────────────────────────────
  if (showSummary) {
    return (
      <Summary
        difficulty={difficulty}
        score={score}
        maxStreak={maxStreak}
        stats={stats}
        onReplay={() => {
          const s = Math.floor(Math.random() * 1e9) >>> 0;
          setSeed(s);
          setScenarios(generatePlaceStopScenarios(s, difficulty));
          setIdx(0);
          setScore(0);
          setStreak(0);
          setMaxStreak(0);
          setStats(EMPTY_STATS);
          setShowSummary(false);
        }}
        onChangeDifficulty={() => {
          setDifficulty(null);
          setSeed(null);
          setIdx(0);
          setScore(0);
          setStreak(0);
          setMaxStreak(0);
          setStats(EMPTY_STATS);
          setShowSummary(false);
        }}
      />
    );
  }

  if (!chart || !current) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">Chargement…</p>
      </main>
    );
  }

  const handleChoose = (id: StopId) => {
    if (phase !== "placing") return;
    const r = scoreStopChoice(id, chart, streak);
    setChosen(id);
    setResult(r);
    setScore((s) => s + r.points);
    setStats((s) => ({ ...s, [r.type]: s[r.type] + 1 }));
    if (r.correct) {
      const ns = streak + 1;
      setStreak(ns);
      setMaxStreak((m) => Math.max(m, ns));
    } else {
      setStreak(0);
    }
    setPhase("revealing");
    setRevealed(1);
  };

  const handleNext = () => {
    if (idx + 1 >= ROUNDS_PER_SESSION) {
      setShowSummary(true);
    } else {
      setIdx(idx + 1);
    }
  };

  const isPlacing = phase === "placing";
  const isRevealing = phase === "revealing";
  const isFeedback = phase === "feedback";

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
            <DifficultyChip difficulty={difficulty} />
            <div className="w-px h-3 bg-zinc-800" />
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

          {/* Meta */}
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

          {/* Chart with overlays : entry + tp + 3 stops + reveal */}
          <div className="p-3 sm:p-4">
            <MiniChart
              data={{
                candles: [...chart.past, ...chart.future],
                zones:   chart.zones,
                domain:  chart.domain,
              }}
              overlay={{
                entry: { price: chart.entry, direction: chart.direction },
                tp:    chart.tp !== null ? { price: chart.tp } : undefined,
                stops: chart.stops.map((s) => ({
                  price:    s.price,
                  color:    STOP_COLORS[s.id].hex,
                  dashed:   true,
                  hit:      (isFeedback || isRevealing) && hitMapLive[s.id] !== null,
                  selected: chosen === s.id,
                })),
                separatorIndex:     chart.past.length,
                visibleFutureCount: isPlacing ? 0 : revealed,
              }}
              height={185}
            />
            {/* Légende lignes */}
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
              <LegendDot color="blue"    label={`Entrée ${chart.direction} ${fmt(chart.entry)}`} />
              {chart.tp !== null && (
                <LegendDot color="emerald" label={`TP ${fmt(chart.tp)}`} />
              )}
              {chart.stops.map((s) => (
                <LegendDot
                  key={s.id}
                  customDot={STOP_COLORS[s.id].dot}
                  customText={STOP_COLORS[s.id].text}
                  label={`Stop ${s.id} ${fmt(s.price)}`}
                />
              ))}
            </div>
          </div>

          {/* Context infos — en avancé on cache la volatilité chip */}
          <div className={`px-4 pb-3 grid gap-2 ${difficulty === "advanced" ? "grid-cols-2" : "grid-cols-3"}`}>
            <InfoTile label="HTF"        value={BIAS_LABEL[current.htfBias]}        colorClass={biasClass(current.htfBias)} />
            <InfoTile label="Macro"      value={MACRO_LABEL[current.macroContext]}  colorClass={current.macroContext === "dangereux" ? "text-red-400" : "text-zinc-300"} />
            {difficulty !== "advanced" && (
              <InfoTile label="Volatilité" value={cap(current.volatility)} colorClass="text-zinc-300" />
            )}
          </div>

          {/* Context text — court en intermédiaire/avancé */}
          <div className="px-4 pb-4">
            <p className="text-[13px] text-zinc-300 leading-relaxed">
              {difficulty === "beginner" ? current.context : (current.shortContext ?? firstSentence(current.context))}
            </p>
          </div>
        </div>

        {/* Question + 3 cards de choix */}
        {isPlacing && (
          <ChoiceCards
            stops={chart.stops}
            entry={chart.entry}
            tp={chart.tp}
            direction={chart.direction}
            onChoose={handleChoose}
          />
        )}

        {isRevealing && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-5 text-center">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Révélation
            </p>
            <p className="text-sm text-zinc-300">
              On regarde quels stops survivent aux {chart.future.length} prochaines bougies…
            </p>
          </div>
        )}

        {isFeedback && result && chosen && (
          <Feedback
            result={result}
            chosen={chosen}
            chart={chart}
            title={current.title}
            lesson={current.lessons[difficulty]}
            tag={current.tag}
            difficulty={difficulty}
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
            <StatTile label="Discipline"  value={derivedDiscipline(stats)} />
            <StatTile label="Protection"  value={derivedProtection(stats)} />
            <StatTile label="Précision"   value={derivedPrecision(stats)}  />
            <StatTile label="Agressivité" value={derivedAggression(stats)} />
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Difficulty picker ────────────────────────────────────────────────────────

function DifficultyPicker({ onPick }: { onPick: (d: Difficulty) => void }) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          href="/jeux"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white mb-8"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Jeux
        </Link>

        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          Place ton Stop
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Quel stop va survivre ?</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {ROUNDS_PER_SESSION} scénarios. Pour chacun, 3 stops loss proposés (A / B / C).
          Tu choisis le plus logique — structure, liquidité, volatilité, RR. Le marché révèle ensuite la suite.
        </p>

        <div className="flex flex-col gap-3">
          {DIFFICULTIES.map((d) => {
            const meta = DIFFICULTY_META[d];
            return (
              <button
                key={d}
                onClick={() => onPick(d)}
                className="group text-left bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded-2xl px-5 py-4 transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                    <span className={`text-base font-bold ${meta.textClass}`}>{meta.label}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-600 group-hover:text-white transition-colors">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[12px] text-zinc-400 leading-relaxed">{meta.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// ─── Choice cards (3 stops A/B/C) ─────────────────────────────────────────────

function ChoiceCards({
  stops, entry, tp, direction, onChoose,
}: {
  stops: StopOption[];
  entry: number;
  tp: number | null;
  direction: TradeDirection;
  onChoose: (id: StopId) => void;
}) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-4 pt-3.5 pb-2 border-b border-zinc-800/60">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          Quel stop choisis-tu ?
        </p>
      </div>
      <div className="p-3 sm:p-4 grid grid-cols-1 gap-2.5">
        {stops.map((s) => {
          const dist = Math.abs(s.price - entry);
          const rr = tp !== null ? Math.abs((tp - entry) / (entry - s.price)) : null;
          const colors = STOP_COLORS[s.id];
          return (
            <button
              key={s.id}
              onClick={() => onChoose(s.id)}
              aria-label={`Stop ${s.id}`}
              className={`text-left flex items-center gap-3 sm:gap-4 ${colors.bg} ${colors.border} border-2 hover:brightness-110 active:scale-[0.99] rounded-xl px-4 py-3 sm:py-3.5 transition-all`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg} border ${colors.border}`}>
                <span className={`text-base font-black ${colors.text}`}>{s.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className={`text-base font-black tabular-nums ${colors.text}`}>{fmt(s.price)}</p>
                  <p className="text-[11px] text-zinc-500">
                    {direction === "BUY" ? "−" : "+"}{dist.toFixed(2)}
                  </p>
                  {rr !== null && rr > 0 && (
                    <p className={`text-[11px] tabular-nums font-semibold ${rr >= 2 ? "text-emerald-400" : rr >= 1 ? "text-amber-400" : "text-red-400"}`}>
                      RR 1:{rr.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-600">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Feedback panel ──────────────────────────────────────────────────────────

function Feedback({
  result, chosen, chart, title, lesson, tag, difficulty, onNext, isLast,
}: {
  result:      ScoreResult;
  chosen:      StopId;
  chart:       PlaceStopChart;
  title:       string;
  lesson:      string;
  tag:         string;
  difficulty:  Difficulty;
  onNext:      () => void;
  isLast:      boolean;
}) {
  const meta = STOP_TYPE_META[result.type];
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
          {result.correct ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="8" stroke="#10b981" strokeWidth="1.5" />
              <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="8" stroke={meta.color === "amber" ? "#f59e0b" : "#ef4444"} strokeWidth="1.5" />
              <path d="M6 6l6 6M12 6l-6 6" stroke={meta.color === "amber" ? "#f59e0b" : "#ef4444"} strokeWidth="1.8" strokeLinecap="round" />
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
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">
          {title}
        </p>

        {/* Les 3 stops avec leur verdict (le choisi est highlighté) */}
        <div className="space-y-2 mb-4">
          {chart.stops.map((s) => (
            <StopVerdictRow
              key={s.id}
              stop={s}
              isChosen={chosen === s.id}
              hitIndex={result.hitMap[s.id]}
              futureLength={chart.future.length}
            />
          ))}
        </div>

        {/* Leçon adaptée au niveau */}
        <div className="bg-blue-500/8 border border-blue-500/25 rounded-lg px-3 py-2.5 mb-3">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-1">
            Leçon · {DIFFICULTY_META[difficulty].label}
          </p>
          <p className="text-[13px] text-zinc-200 leading-relaxed">{lesson}</p>
        </div>

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

function StopVerdictRow({
  stop, isChosen, hitIndex, futureLength,
}: {
  stop: StopOption;
  isChosen: boolean;
  hitIndex: number | null;
  futureLength: number;
}) {
  const colors = STOP_COLORS[stop.id];
  const meta = STOP_TYPE_META[stop.type];
  const border =
    isChosen ? colors.border
  : meta.color === "emerald" ? "border-emerald-500/30"
  : "border-zinc-800";
  const survived = hitIndex === null;
  return (
    <div className={`border rounded-lg px-3 py-2.5 bg-zinc-950/40 ${border}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-6 h-6 rounded-md flex items-center justify-center ${colors.bg} border ${colors.border}`}>
          <span className={`text-[11px] font-black ${colors.text}`}>{stop.id}</span>
        </span>
        <p className={`text-[11px] font-bold uppercase tracking-widest ${
          meta.color === "emerald" ? "text-emerald-400"
        : meta.color === "amber"   ? "text-amber-400"
        :                            "text-red-400"
        }`}>
          {meta.label}
        </p>
        <span className="text-[10px] text-zinc-600 tabular-nums">{fmt(stop.price)}</span>
        {isChosen && (
          <span className="ml-auto text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Ton choix</span>
        )}
        {!isChosen && stop.type === "logical" && (
          <span className="ml-auto text-[10px] text-emerald-400 font-bold uppercase tracking-wide">Le bon</span>
        )}
      </div>
      <p className="text-[12px] text-zinc-300 leading-relaxed">{stop.rationale}</p>
      <div className="mt-1.5 text-[10px] flex items-center gap-1.5">
        {survived ? (
          <>
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-emerald-400">A survécu aux {futureLength} bougies</span>
          </>
        ) : (
          <>
            <span className="w-1 h-1 rounded-full bg-red-500" />
            <span className="text-red-400">Touché bougie {hitIndex + 1}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Compétences dérivées ─────────────────────────────────────────────────────

function totalRounds(s: SessionStats): number {
  return s.logical + s.wide + s.tight + s.liquidity;
}
function pct(n: number, d: number): string {
  if (d === 0) return "—";
  return Math.round((n / d) * 100) + "%";
}
function derivedDiscipline(s: SessionStats): string {
  const t = totalRounds(s);
  if (t === 0) return "—";
  return pct(t - s.liquidity, t);
}
function derivedProtection(s: SessionStats): string {
  const t = totalRounds(s);
  if (t === 0) return "—";
  return pct(s.logical + s.wide, t);
}
function derivedPrecision(s: SessionStats): string {
  const t = totalRounds(s);
  if (t === 0) return "—";
  return pct(s.logical, t);
}
function derivedAggression(s: SessionStats): string {
  const t = totalRounds(s);
  if (t === 0) return "—";
  return pct(s.logical + s.tight, t);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
  return <span className={`border rounded-full px-2 py-0.5 font-semibold ${cls}`}>Vol. {volatility}</span>;
}

function SpreadBadge({ spread }: { spread: "faible" | "élevé" }) {
  const cls = spread === "élevé"
    ? "text-amber-400 border-amber-400/30"
    : "text-zinc-500 border-zinc-700";
  return <span className={`border rounded-full px-2 py-0.5 font-semibold ${cls}`}>Spread {spread}</span>;
}

function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
  const meta = DIFFICULTY_META[difficulty];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wide ${meta.textClass}`}>
        {meta.label}
      </span>
    </div>
  );
}

function LegendDot({ color, customDot, customText, label }: { color?: "blue" | "emerald" | "amber" | "red"; customDot?: string; customText?: string; label: string }) {
  const dot = customDot ?? (
    color === "blue"    ? "bg-blue-500"
  : color === "emerald" ? "bg-emerald-500"
  : color === "amber"   ? "bg-amber-400"
  : color === "red"     ? "bg-red-500"
  :                       "bg-zinc-500"
  );
  const txt = customText ?? (
    color === "blue"    ? "text-blue-400"
  : color === "emerald" ? "text-emerald-400"
  : color === "amber"   ? "text-amber-400"
  : color === "red"     ? "text-red-400"
  :                       "text-zinc-400"
  );
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-1 rounded-sm ${dot}`} />
      <span className={`text-[11px] font-medium ${txt}`}>{label}</span>
    </div>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function Summary({
  difficulty, score, maxStreak, stats, onReplay, onChangeDifficulty,
}: {
  difficulty: Difficulty;
  score: number;
  maxStreak: number;
  stats: SessionStats;
  onReplay: () => void;
  onChangeDifficulty: () => void;
}) {
  const total = totalRounds(stats);
  const verdict = sessionVerdict(score, stats.logical, total);
  const verdictColor =
    score >= 700 ? "text-emerald-400"
  : score >= 0   ? "text-amber-400"
  :                "text-red-400";
  const meta = DIFFICULTY_META[difficulty];

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
          Bilan · <span className={meta.textClass}>{meta.label}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{ROUNDS_PER_SESSION} stops choisis</h1>
        <p className={`text-sm font-semibold ${verdictColor} mb-7`}>{verdict}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <BigStat label="Score"            value={`${score >= 0 ? "+" : ""}${score}`}    valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
          <BigStat label="Stops logiques"   value={`${stats.logical}/${total}`}            valueClass="text-emerald-400" />
          <BigStat label="Stops serrés"     value={`${stats.tight}`}                       valueClass={stats.tight > 0 ? "text-red-400" : "text-zinc-300"} />
          <BigStat label="Meilleure série"  value={`${maxStreak}`}                         valueClass="text-amber-400" />
        </div>

        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Compétences
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <SkillCard label="Discipline"  value={derivedDiscipline(stats)} />
          <SkillCard label="Protection"  value={derivedProtection(stats)} />
          <SkillCard label="Précision"   value={derivedPrecision(stats)}  />
          <SkillCard label="Agressivité" value={derivedAggression(stats)} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReplay}
            className="flex-1 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-colors"
          >
            Rejouer en {meta.label.toLowerCase()}
          </button>
          <button
            onClick={onChangeDifficulty}
            className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 transition-colors"
          >
            Changer de niveau
          </button>
        </div>
      </div>
    </main>
  );
}

function BigStat({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-3">
      <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-xl font-black tabular-nums ${valueClass}`}>{value}</p>
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function biasClass(b: "bullish" | "bearish" | "range"): string {
  return b === "bullish" ? "text-emerald-400"
       : b === "bearish" ? "text-red-400"
       :                   "text-zinc-400";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmt(p: number): string {
  return p.toFixed(2);
}

function firstSentence(text: string): string {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
}
