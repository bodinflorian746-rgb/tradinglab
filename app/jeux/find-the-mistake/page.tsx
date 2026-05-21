"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildScenarioChart,
  generateMistakeScenarios,
  scoreMistakeChoice,
  ROUNDS_PER_SESSION,
  DIFFICULTY_META,
  CATEGORY_META,
  MISTAKE_LABELS,
  sessionVerdict,
  type Difficulty,
  type MistakeId,
  type MistakeInstance,
  type MistakeScoreResult,
  type ScenarioChart,
} from "@/lib/games/find-the-mistake";
import { MiniChart } from "@/app/components/games/MiniChart";

const BIAS_LABEL  = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const MACRO_LABEL = { normal: "Normal", dangereux: "Dangereux" } as const;
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

// ─── Page ────────────────────────────────────────────────────────────────────

interface SessionStats {
  correct:   number;
  incorrect: number;
}
const EMPTY_STATS: SessionStats = { correct: 0, incorrect: 0 };

export default function FindTheMistakePage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<MistakeInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<MistakeId | null>(null);
  const [result, setResult] = useState<MistakeScoreResult | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS);
  const [showSummary, setShowSummary] = useState(false);

  const current = scenarios[idx];
  const chart: ScenarioChart | null = useMemo(
    () => (current ? buildScenarioChart(current, current.seed, current.volatility) : null),
    [current],
  );

  // Reset state au scenario suivant
  useEffect(() => {
    setChosen(null);
    setResult(null);
  }, [idx]);

  // ─── Écran picker ──────────────────────────────────────────────────────────
  if (!difficulty || !seed) {
    return <DifficultyPicker onPick={(d) => {
      const s = Math.floor(Math.random() * 1e9) >>> 0;
      setDifficulty(d);
      setSeed(s);
      setScenarios(generateMistakeScenarios(s, d));
    }} />;
  }

  // ─── Écran bilan ───────────────────────────────────────────────────────────
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
          setScenarios(generateMistakeScenarios(s, difficulty));
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

  if (!current || !chart) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">Chargement…</p>
      </main>
    );
  }

  const isFeedback = chosen !== null && result !== null;

  const handlePick = (id: MistakeId) => {
    if (isFeedback) return;
    const r = scoreMistakeChoice(id, current.correctMistake, streak);
    setChosen(id);
    setResult(r);
    setScore((s) => s + r.points);
    setStats((s) => ({
      ...s,
      [r.correct ? "correct" : "incorrect"]: s[r.correct ? "correct" : "incorrect"] + 1,
    }));
    if (r.correct) {
      const ns = streak + 1;
      setStreak(ns);
      setMaxStreak((m) => Math.max(m, ns));
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (idx + 1 >= ROUNDS_PER_SESSION) {
      setShowSummary(true);
    } else {
      setIdx(idx + 1);
    }
  };

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
              {current.direction && (
                <>
                  <span className="text-zinc-700 text-xs">·</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${
                    current.direction === "BUY" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {current.direction}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              {current.extraInfo && (
                <span className="border border-amber-500/40 text-amber-400 rounded-full px-2 py-0.5 font-bold">
                  {current.extraInfo}
                </span>
              )}
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
                News macro majeure dans &lt; 30 min.
              </p>
            </div>
          )}

          {/* Chart with optional lines */}
          <div className="p-3 sm:p-4">
            <MiniChart
              data={{
                candles: [...chart.past, ...chart.future],
                zones:   chart.zones,
                domain:  chart.domain,
              }}
              overlay={{
                entry: chart.entry !== undefined ? { price: chart.entry, direction: current.direction === "SELL" ? "SELL" : "BUY" } : undefined,
                tp:    chart.tp    !== undefined ? { price: chart.tp } : undefined,
                stop:  chart.stop  !== undefined ? { price: chart.stop } : undefined,
              }}
              height={170}
            />
            {chart.zones.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {chart.zones.map((z, i) => (
                  <ZoneLegendChip key={i} zone={z} />
                ))}
              </div>
            )}
          </div>

          {/* Context infos */}
          <div className="px-4 pb-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <InfoTile label="HTF"        value={BIAS_LABEL[current.htfBias]}        colorClass={biasClass(current.htfBias)} />
            <InfoTile label="Macro"      value={MACRO_LABEL[current.macroContext]}  colorClass={current.macroContext === "dangereux" ? "text-red-400" : "text-zinc-300"} />
            <InfoTile label="Volatilité" value={cap(current.volatility)}            colorClass="text-zinc-300" />
          </div>

          {/* Context text */}
          <div className="px-4 pb-4">
            <p className="text-[13px] text-zinc-300 leading-relaxed">{current.context}</p>
          </div>
        </div>

        {/* Question + 4 choix */}
        {!isFeedback && (
          <ChoicesPanel
            choices={current.shuffledChoices}
            onPick={handlePick}
          />
        )}

        {/* Feedback */}
        {isFeedback && result && chosen && (
          <Feedback
            result={result}
            chosen={chosen}
            correctMistake={current.correctMistake}
            choices={current.shuffledChoices}
            title={current.title}
            explanation={current.explanation}
            lesson={current.lessons[difficulty]}
            category={current.category}
            difficulty={difficulty}
            onNext={handleNext}
            isLast={idx + 1 >= ROUNDS_PER_SESSION}
          />
        )}

        {/* Stats */}
        <div className="mt-6 pt-5 border-t border-zinc-800/60 grid grid-cols-2 gap-2.5">
          <StatTile label="Correctes" value={`${stats.correct}/${stats.correct + stats.incorrect}`} />
          <StatTile label="Score" value={`${score >= 0 ? "+" : ""}${score}`} />
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
          Trouve l'erreur
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Quelle est l'erreur principale ?</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {ROUNDS_PER_SESSION} scénarios. Pour chacun, tu vois un setup ou un trade,
          et tu identifies l'erreur principale parmi 4 choix. Le but : développer ton œil
          pour les erreurs retail classiques.
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

// ─── Choices panel ───────────────────────────────────────────────────────────

function ChoicesPanel({ choices, onPick }: { choices: MistakeId[]; onPick: (id: MistakeId) => void }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-4 pt-3.5 pb-2 border-b border-zinc-800/60">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          Quelle est l'erreur principale ?
        </p>
      </div>
      <div className="p-3 sm:p-4 flex flex-col gap-2.5">
        {choices.map((id) => (
          <button
            key={id}
            onClick={() => onPick(id)}
            className="text-left bg-zinc-800/60 border-2 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 active:scale-[0.99] rounded-xl px-4 py-3.5 transition-all flex items-center justify-between gap-3"
          >
            <span className="text-sm font-bold text-white">{MISTAKE_LABELS[id]}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-600 shrink-0">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Feedback panel ──────────────────────────────────────────────────────────

interface FeedbackProps {
  result:         MistakeScoreResult;
  chosen:         MistakeId;
  correctMistake: MistakeId;
  choices:        MistakeId[];
  title:          string;
  explanation:    string;
  lesson:         string;
  category:       keyof typeof CATEGORY_META;
  difficulty:     Difficulty;
  onNext:         () => void;
  isLast:         boolean;
}

function Feedback({
  result, chosen, correctMistake, choices, title, explanation, lesson, category, difficulty, onNext, isLast,
}: FeedbackProps) {
  const catMeta = CATEGORY_META[category];
  return (
    <div className={`bg-zinc-900/50 border rounded-2xl overflow-hidden ${
      result.correct ? "border-emerald-500/30" : "border-red-500/30"
    }`}>
      <div className={`px-4 py-3 ${result.correct ? "bg-emerald-500/8" : "bg-red-500/8"} flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {result.correct ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="8" stroke="#10b981" strokeWidth="1.5" />
              <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="8" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M6 6l6 6M12 6l-6 6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          <p className={`text-sm font-bold ${result.correct ? "text-emerald-400" : "text-red-400"} truncate`}>
            {result.correct ? "Bien vu" : "Pas la bonne erreur"}
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
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">{title}</p>

        {/* Choix avec leur statut */}
        <div className="space-y-1.5 mb-4">
          {choices.map((id) => {
            const isCorrect = id === correctMistake;
            const isChosen = id === chosen;
            const bg =
              isCorrect ? "bg-emerald-500/10 border-emerald-500/40"
            : isChosen  ? "bg-red-500/10 border-red-500/40"
            :             "bg-zinc-950/40 border-zinc-800";
            const txt =
              isCorrect ? "text-emerald-400"
            : isChosen  ? "text-red-400"
            :             "text-zinc-500";
            return (
              <div key={id} className={`border rounded-lg px-3 py-2 flex items-center justify-between gap-2 ${bg}`}>
                <span className={`text-[12px] font-bold ${txt}`}>{MISTAKE_LABELS[id]}</span>
                {isCorrect && <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-400">✓ Bonne réponse</span>}
                {isChosen && !isCorrect && <span className="text-[9px] uppercase tracking-widest font-bold text-red-400">Ton choix</span>}
              </div>
            );
          })}
        </div>

        {/* Explication */}
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-3 mb-3">
          <p className="text-[13px] text-zinc-200 leading-relaxed">{explanation}</p>
        </div>

        {/* Leçon */}
        <div className="bg-blue-500/8 border border-blue-500/25 rounded-lg px-3 py-2.5 mb-3">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-1">
            Leçon · {DIFFICULTY_META[difficulty].label}
          </p>
          <p className="text-[13px] text-zinc-200 leading-relaxed">{lesson}</p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${catMeta.dotClass}`} />
            <span className={`text-[10px] font-medium ${catMeta.textClass}`}>{catMeta.label}</span>
          </div>
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2 transition-colors"
          >
            {isLast ? "Voir le bilan" : "Suivant"}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function ZoneLegendChip({ zone }: { zone: { kind: string; label: string } }) {
  const cls =
    zone.kind === "support"        ? "bg-emerald-500"
  : zone.kind === "resistance"     ? "bg-red-500"
  : zone.kind === "fvg"            ? "bg-amber-400"
  :                                  "bg-amber-400";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-sm ${cls}`} />
      <span className="text-[10px] text-zinc-400 font-medium">{zone.label}</span>
    </div>
  );
}

function biasClass(b: "bullish" | "bearish" | "range"): string {
  return b === "bullish" ? "text-emerald-400"
       : b === "bearish" ? "text-red-400"
       :                   "text-zinc-400";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Summary ─────────────────────────────────────────────────────────────────

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
  const total = stats.correct + stats.incorrect;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
  const verdict = sessionVerdict(score, stats.correct, total);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{ROUNDS_PER_SESSION} scénarios joués</h1>
        <p className={`text-sm font-semibold ${verdictColor} mb-7`}>{verdict}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <BigStat label="Score"            value={`${score >= 0 ? "+" : ""}${score}`}    valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
          <BigStat label="Précision"        value={`${accuracy}%`}                          valueClass="text-white" />
          <BigStat label="Bonnes réponses"  value={`${stats.correct}/${ROUNDS_PER_SESSION}`} valueClass="text-emerald-400" />
          <BigStat label="Meilleure série"  value={`${maxStreak}`}                          valueClass="text-amber-400" />
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
