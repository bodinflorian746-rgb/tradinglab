"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildChart,
  generateScenarios,
  scoreChoice,
  type GameChoice,
  type Metric,
  type ScenarioInstance,
} from "@/lib/games/buy-sell-no-trade";
import { MiniChart } from "@/app/components/games/MiniChart";

// ─── Constantes ───────────────────────────────────────────────────────────────

const ROUNDS_PER_SESSION = 12;

const METRIC_LABELS: Record<Metric, string> = {
  discipline: "Discipline",
  lecture:    "Lecture marché",
  piege:      "Détection piège",
};

const METRIC_DOT: Record<Metric, string> = {
  discipline: "bg-blue-400",
  lecture:    "bg-emerald-400",
  piege:      "bg-amber-400",
};

const BIAS_LABEL = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const MACRO_LABEL = { normal: "Normal", dangereux: "Dangereux" } as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuySellNoTradePage() {
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [stats, setStats] = useState<Record<Metric, { ok: number; total: number }>>({
    discipline: { ok: 0, total: 0 },
    lecture:    { ok: 0, total: 0 },
    piege:      { ok: 0, total: 0 },
  });
  const [chosen, setChosen] = useState<GameChoice | null>(null);
  const [lastPoints, setLastPoints] = useState(0);
  const [lastStreakBonus, setLastStreakBonus] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Initial seed côté client (évite mismatch SSR)
  useEffect(() => {
    const s = Math.floor(Math.random() * 1e9) >>> 0;
    setSeed(s);
    setScenarios(generateScenarios(s));
  }, []);

  const current = scenarios[idx];
  const chart = useMemo(
    () => (current ? buildChart(current.id, current.seed, current.volatility) : null),
    [current],
  );

  if (!current || !chart || seed === null) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">Chargement…</p>
      </main>
    );
  }

  const handleChoice = (c: GameChoice) => {
    if (chosen) return;
    const result = scoreChoice(c, current.correctAnswer, streak);
    setChosen(c);
    setLastPoints(result.points);
    setLastStreakBonus(result.streakBonus);
    setScore((s) => s + result.points);
    setStats((s) => ({
      ...s,
      [current.metric]: {
        ok:    s[current.metric].ok + (result.correct ? 1 : 0),
        total: s[current.metric].total + 1,
      },
    }));
    if (result.correct) {
      const ns = streak + 1;
      setStreak(ns);
      setMaxStreak((m) => Math.max(m, ns));
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setChosen(null);
    setLastPoints(0);
    setLastStreakBonus(0);
    const next = idx + 1;
    if (next >= ROUNDS_PER_SESSION) {
      setShowSummary(true);
    } else {
      setIdx(next);
    }
  };

  const handleReset = () => {
    const s = Math.floor(Math.random() * 1e9) >>> 0;
    setSeed(s);
    setScenarios(generateScenarios(s));
    setIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setStats({
      discipline: { ok: 0, total: 0 },
      lecture:    { ok: 0, total: 0 },
      piege:      { ok: 0, total: 0 },
    });
    setChosen(null);
    setLastPoints(0);
    setLastStreakBonus(0);
    setShowSummary(false);
  };

  if (showSummary) {
    return <Summary score={score} maxStreak={maxStreak} correctCount={correctCount} stats={stats} onReset={handleReset} />;
  }

  const correct = chosen ? chosen === current.correctAnswer : null;

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

        {/* Streak indicator */}
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
                News macro majeure dans &lt; 30 min — volatilité et spread imprévisibles.
              </p>
            </div>
          )}

          {/* Mini chart */}
          <div className="p-3 sm:p-4">
            <MiniChart data={chart} />
          </div>

          {/* Context infos */}
          <div className="px-4 pb-3 grid grid-cols-3 gap-2">
            <InfoTile label="HTF" value={BIAS_LABEL[current.htfBias]} biasClass={biasClass(current.htfBias)} />
            <InfoTile label="Macro" value={MACRO_LABEL[current.macroContext]} biasClass={current.macroContext === "dangereux" ? "text-red-400" : "text-zinc-300"} />
            <InfoTile label="Volatilité" value={cap(current.volatility)} biasClass="text-zinc-300" />
          </div>

          {/* Context text */}
          <div className="px-4 pb-4">
            <p className="text-[13px] text-zinc-300 leading-relaxed">{current.context}</p>
          </div>
        </div>

        {/* Decision area */}
        {!chosen ? (
          <DecisionButtons onChoose={handleChoice} />
        ) : (
          <Feedback
            correct={correct!}
            choice={chosen}
            correctAnswer={current.correctAnswer}
            points={lastPoints}
            streakBonus={lastStreakBonus}
            title={current.title}
            explanation={current.explanation}
            metric={current.metric}
            onNext={handleNext}
            isLast={idx + 1 >= ROUNDS_PER_SESSION}
          />
        )}

        {/* Stats footer */}
        <div className="mt-6 pt-5 border-t border-zinc-800/60">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
            Compétences
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {(["discipline", "lecture", "piege"] as Metric[]).map((m) => (
              <StatTile key={m} metric={m} ok={stats[m].ok} total={stats[m].total} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DecisionButtons({ onChoose }: { onChoose: (c: GameChoice) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <button
        onClick={() => onChoose("BUY")}
        className="py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 hover:border-emerald-500/50 active:scale-[0.98] transition-all"
      >
        BUY
      </button>
      <button
        onClick={() => onChoose("SELL")}
        className="py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/20 hover:border-red-500/50 active:scale-[0.98] transition-all"
      >
        SELL
      </button>
      <button
        onClick={() => onChoose("NO_TRADE")}
        className="py-3.5 rounded-xl bg-zinc-800/60 border border-zinc-700 text-zinc-300 font-bold text-xs sm:text-sm hover:bg-zinc-800 hover:border-zinc-600 active:scale-[0.98] transition-all"
      >
        NO TRADE
      </button>
    </div>
  );
}

interface FeedbackProps {
  correct:       boolean;
  choice:        GameChoice;
  correctAnswer: GameChoice;
  points:        number;
  streakBonus:   number;
  title:         string;
  explanation:   string;
  metric:        Metric;
  onNext:        () => void;
  isLast:        boolean;
}

function Feedback({ correct, choice, correctAnswer, points, streakBonus, title, explanation, metric, onNext, isLast }: FeedbackProps) {
  const headline = correct
    ? correctAnswer === "NO_TRADE" ? "Discipline parfaite" : "Bonne lecture"
    : correctAnswer === "NO_TRADE" ? "Piège évité ? Non." : "Pas la bonne lecture";

  const color = correct ? "emerald" : "red";

  return (
    <div className={`bg-zinc-900/50 border rounded-2xl overflow-hidden ${
      correct ? "border-emerald-500/30" : "border-red-500/30"
    }`}>
      <div className={`px-4 py-3 ${correct ? "bg-emerald-500/8" : "bg-red-500/8"} flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {correct ? (
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
          <p className={`text-sm font-bold ${correct ? "text-emerald-400" : "text-red-400"} truncate`}>
            {headline}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-base font-black tabular-nums ${
            points >= 0 ? "text-emerald-400" : "text-red-400"
          }`}>
            {points >= 0 ? "+" : ""}{points}
          </p>
          {streakBonus > 0 && (
            <p className="text-[9px] text-amber-400 uppercase tracking-wide font-bold">
              +{streakBonus} streak
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
          {title}
        </p>
        <p className="text-[13px] text-zinc-300 leading-relaxed mb-3">{explanation}</p>

        {!correct && (
          <div className="text-[11px] text-zinc-500 mb-3 flex items-center gap-1.5">
            <span>Ton choix :</span>
            <span className={`font-bold ${color === "red" ? "text-red-400" : "text-emerald-400"}`}>
              {humanChoice(choice)}
            </span>
            <span>· Bonne réponse :</span>
            <span className="font-bold text-emerald-400">{humanChoice(correctAnswer)}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${METRIC_DOT[metric]}`} />
            <span className="text-[10px] text-zinc-500 font-medium">{METRIC_LABELS[metric]}</span>
          </div>
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

function InfoTile({ label, value, biasClass }: { label: string; value: string; biasClass: string }) {
  return (
    <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg px-2.5 py-1.5">
      <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{label}</p>
      <p className={`text-[12px] font-semibold ${biasClass} truncate`}>{value}</p>
    </div>
  );
}

function StatTile({ metric, ok, total }: { metric: Metric; ok: number; total: number }) {
  const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${METRIC_DOT[metric]}`} />
        <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold truncate">
          {METRIC_LABELS[metric]}
        </p>
      </div>
      <p className="text-sm font-bold text-white tabular-nums">
        {ok}<span className="text-zinc-600">/{total}</span>
      </p>
      {total > 0 && (
        <p className="text-[10px] text-zinc-600 tabular-nums">{pct}%</p>
      )}
    </div>
  );
}

function VolBadge({ volatility }: { volatility: "faible" | "normale" | "élevée" }) {
  const cls =
    volatility === "élevée"  ? "text-amber-400 border-amber-400/30" :
    volatility === "faible"  ? "text-zinc-500 border-zinc-700"       :
                                "text-zinc-400 border-zinc-700";
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

function Summary({
  score, maxStreak, correctCount, stats, onReset,
}: {
  score: number;
  maxStreak: number;
  correctCount: number;
  stats: Record<Metric, { ok: number; total: number }>;
  onReset: () => void;
}) {
  const accuracy = Math.round((correctCount / ROUNDS_PER_SESSION) * 100);
  const verdict =
    score >= 1000 ? { label: "Trader discipliné", color: "text-emerald-400" } :
    score >= 600  ? { label: "Bon œil",            color: "text-emerald-400" } :
    score >= 200  ? { label: "À polir",            color: "text-amber-400"   } :
                    { label: "Manque de patience", color: "text-red-400"     };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{ROUNDS_PER_SESSION} scénarios joués</h1>
        <p className={`text-sm font-semibold ${verdict.color} mb-7`}>{verdict.label}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <BigStat label="Score" value={`${score >= 0 ? "+" : ""}${score}`} valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
          <BigStat label="Précision" value={`${accuracy}%`} valueClass="text-white" />
          <BigStat label="Bonnes réponses" value={`${correctCount}/${ROUNDS_PER_SESSION}`} valueClass="text-white" />
          <BigStat label="Meilleure série" value={`${maxStreak}`} valueClass="text-amber-400" />
        </div>

        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Compétences
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {(["discipline", "lecture", "piege"] as Metric[]).map((m) => (
            <SummarySkill key={m} metric={m} ok={stats[m].ok} total={stats[m].total} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-colors"
          >
            Rejouer 12 scénarios
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

function BigStat({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-3">
      <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-xl font-black tabular-nums ${valueClass}`}>{value}</p>
    </div>
  );
}

function SummarySkill({ metric, ok, total }: { metric: Metric; ok: number; total: number }) {
  const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${METRIC_DOT[metric]}`} />
        <p className="text-xs font-bold text-white">{METRIC_LABELS[metric]}</p>
      </div>
      <p className="text-lg font-black tabular-nums text-white">
        {ok}<span className="text-zinc-700">/{total}</span>
      </p>
      <p className="text-[10px] text-zinc-500 tabular-nums">{total > 0 ? `${pct}%` : "—"}</p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function biasClass(bias: "bullish" | "bearish" | "range"): string {
  return bias === "bullish" ? "text-emerald-400"
       : bias === "bearish" ? "text-red-400"
       :                       "text-zinc-400";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanChoice(c: GameChoice): string {
  return c === "NO_TRADE" ? "NO TRADE" : c;
}
