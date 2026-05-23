"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as FrGame from "@/lib/games/build-the-trade";
import * as EsGame from "@/lib/games/build-the-trade-es";
import {
  evaluateTrade,
  ROUNDS_PER_SESSION,
  type BuildTradeChart,
  type BuildTradeInstance,
  type BuildTradeResult,
  type Difficulty,
  type EntryType,
  type StopType,
  type TpType,
} from "@/lib/games/build-the-trade";
import { MiniChart } from "@/app/components/games/MiniChart";
import { logGameEvent } from "@/lib/trader-profile";

const BIAS_LABEL_FR  = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const BIAS_LABEL_ES  = { bullish: "Alcista", bearish: "Bajista", range: "Range" } as const;
const MACRO_LABEL_FR = { normal: "Normal", dangereux: "Dangereux" } as const;
const MACRO_LABEL_ES = { normal: "Normal", dangereux: "Peligroso" } as const;
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

const ENTRY_TYPES: EntryType[] = ["aggressive", "confirmation", "deep_pullback"];
const STOP_TYPES:  StopType[]  = ["tight", "logical", "wide"];
const TP_TYPES:    TpType[]    = ["fast", "balanced", "ambitious"];

// ─── Page ────────────────────────────────────────────────────────────────────

interface SessionStats {
  perfectSetups: number;
  tpHits:        number;
  slHits:        number;
}
const EMPTY_STATS: SessionStats = { perfectSetups: 0, tpHits: 0, slHits: 0 };

export default function BuildTheTradePage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale;
  const G = locale === "es" ? EsGame : FrGame;
  const isEs = locale === "es";
  const BIAS_LABEL = isEs ? BIAS_LABEL_ES : BIAS_LABEL_FR;
  const MACRO_LABEL = isEs ? MACRO_LABEL_ES : MACRO_LABEL_FR;
  const T = isEs
    ? {
        games:            "Juegos",
        round:            "Ronda",
        score:            "Puntuación",
        consecutivePerfect: "setups perfectos consecutivos",
        loading:          "Cargando…",
        htf:              "HTF",
        macro:            "Macro",
        volatility:       "Volatilidad",
        entry:            "ENTRADA",
        stopLoss:         "STOP LOSS",
        takeProfit:       "TAKE PROFIT",
        validateTrade:    "Validar el trade",
        risk:             "Riesgo",
        reward:           "Reward",
        rr:               "R/R",
        revelation:       "Revelación",
        revealText:       "Veamos cómo se comporta el mercado con tu plan…",
        outcome:          "Outcome",
        tpHit:            "TP alcanzado ✓",
        slHit:            "SL tocado ✗",
        noFill:           "Sin entrada",
        tradeOpen:        "Trade abierto",
        rrRealized:       "R/R realizado",
        drawdown:         "Drawdown",
        optimalPlan:      "Plan óptimo",
        entryLabel:       "Entrada",
        stopLabel:        "Stop",
        tpLabel:          "Take Prof",
        optimalSetup:     "Setup óptimo",
        lesson:           "Lección",
        viewSummary:      "Ver el resumen",
        nextScenario:     "Siguiente escenario",
        skills:           "Habilidades",
        perfectSetups:    "Setups perfectos",
        tpHits:           "TP alcanzados",
        slHits:           "SL tocados",
        buildTitle:       "Build the Trade",
        buildHeading:     "Construye el setup",
        buildIntro:       "escenarios. Para cada uno, eliges la entrada, el stop loss y el take profit. El mercado revela después lo que pasó — RR, drawdown, veredicto.",
        summary:          "Resumen",
        setupsBuilt:      "setups construidos",
        replayIn:         "Volver a jugar en",
        changeLevel:      "Cambiar de nivel",
        vol:              "Vol.",
        spread:           "Spread",
        spreadLow:        "bajo",
        spreadHigh:       "alto",
        volLow:           "baja",
        volNormal:        "normal",
        volHigh:          "alta",
      }
    : {
        games:            "Jeux",
        round:            "Round",
        score:            "Score",
        consecutivePerfect: "setups parfaits consécutifs",
        loading:          "Chargement…",
        htf:              "HTF",
        macro:            "Macro",
        volatility:       "Volatilité",
        entry:            "ENTRÉE",
        stopLoss:         "STOP LOSS",
        takeProfit:       "TAKE PROFIT",
        validateTrade:    "Valider le trade",
        risk:             "Risque",
        reward:           "Reward",
        rr:               "R/R",
        revelation:       "Révélation",
        revealText:       "On regarde comment le marché se comporte avec ton plan…",
        outcome:          "Outcome",
        tpHit:            "TP atteint ✓",
        slHit:            "SL touché ✗",
        noFill:           "Pas d'entrée",
        tradeOpen:        "Trade ouvert",
        rrRealized:       "R/R réalisé",
        drawdown:         "Drawdown",
        optimalPlan:      "Plan optimal",
        entryLabel:       "Entrée",
        stopLabel:        "Stop",
        tpLabel:          "Take Prof",
        optimalSetup:     "Setup optimal",
        lesson:           "Leçon",
        viewSummary:      "Voir le bilan",
        nextScenario:     "Scénario suivant",
        skills:           "Compétences",
        perfectSetups:    "Setups parfaits",
        tpHits:           "TP atteints",
        slHits:           "SL touchés",
        buildTitle:       "Build the Trade",
        buildHeading:     "Construis le setup",
        buildIntro:       "scénarios. Pour chacun, tu choisis l'entrée, le stop loss et le take profit. Le marché révèle ensuite ce qui s'est passé — RR, drawdown, verdict.",
        summary:          "Bilan",
        setupsBuilt:      "setups construits",
        replayIn:         "Rejouer en",
        changeLevel:      "Changer de niveau",
        vol:              "Vol.",
        spread:           "Spread",
        spreadLow:        "faible",
        spreadHigh:       "élevé",
        volLow:           "faible",
        volNormal:        "normale",
        volHigh:          "élevée",
      };
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<BuildTradeInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const [entry, setEntry] = useState<EntryType | null>(null);
  const [stop, setStop] = useState<StopType | null>(null);
  const [tp, setTp] = useState<TpType | null>(null);
  const [phase, setPhase] = useState<"build" | "reveal" | "feedback">("build");
  const [revealed, setRevealed] = useState(0);
  const [result, setResult] = useState<BuildTradeResult | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS);
  const [showSummary, setShowSummary] = useState(false);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  const current = scenarios[idx];
  const chart: BuildTradeChart | null = useMemo(
    () => (current ? G.buildBuildTradeChart(current, current.seed, current.volatility) : null),
    [current, G],
  );

  // Reset state au scenario suivant
  useEffect(() => {
    setEntry(null);
    setStop(null);
    setTp(null);
    setPhase("build");
    setRevealed(0);
    setResult(null);
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
  }, [idx]);

  // Animation reveal
  useEffect(() => {
    if (phase !== "reveal" || !chart) return;
    if (revealed >= chart.future.length) {
      animRef.current = setTimeout(() => setPhase("feedback"), 350);
    } else {
      animRef.current = setTimeout(() => setRevealed((c) => c + 1), 200);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [phase, revealed, chart]);

  if (!difficulty || !seed) {
    return <DifficultyPicker isEs={isEs} difficultyMeta={G.DIFFICULTY_META} onPick={(d) => {
      const s = Math.floor(Math.random() * 1e9) >>> 0;
      setDifficulty(d);
      setSeed(s);
      setScenarios(G.generateBuildTradeScenarios(s, d));
    }} />;
  }

  if (showSummary) {
    return (
      <Summary
        T={T}
        difficulty={difficulty}
        difficultyMeta={G.DIFFICULTY_META}
        sessionVerdictFn={G.sessionVerdict}
        score={score}
        maxStreak={maxStreak}
        stats={stats}
        onReplay={() => {
          const s = Math.floor(Math.random() * 1e9) >>> 0;
          setSeed(s);
          setScenarios(G.generateBuildTradeScenarios(s, difficulty));
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
        <p className="text-sm text-zinc-500">{T.loading}</p>
      </main>
    );
  }

  const canValidate = entry !== null && stop !== null && tp !== null;
  const isBuild = phase === "build";
  const isReveal = phase === "reveal";
  const isFeedback = phase === "feedback";

  const handleValidate = () => {
    if (!canValidate || !chart) return;
    const picks = { entry: entry!, stop: stop!, tp: tp! };
    const r = evaluateTrade(picks, chart, current.optimal, streak);

    // Tracking profil trader : on log plusieurs events selon le résultat
    // pour alimenter différentes compétences.
    // 1. Quality match → structure + lecture marché
    if (r.qualityMatch === 3) {
      logGameEvent({ game: "build-the-trade", difficulty, skill: "structure",      outcome: "win" });
      logGameEvent({ game: "build-the-trade", difficulty, skill: "lecture_marche", outcome: "win" });
    } else if (r.qualityMatch === 0) {
      logGameEvent({ game: "build-the-trade", difficulty, skill: "lecture_marche", outcome: "loss" });
    }
    // 2. Outcome → RR + patience
    if (r.outcome === "tp_hit") {
      logGameEvent({ game: "build-the-trade", difficulty, skill: "rr_management", outcome: "win" });
      logGameEvent({ game: "build-the-trade", difficulty, skill: "patience",      outcome: "win" });
    } else if (r.outcome === "sl_hit") {
      logGameEvent({ game: "build-the-trade", difficulty, skill: "rr_management", outcome: "loss" });
    }
    // 3. Choix d'entrée → patience / discipline
    if (picks.entry === "deep_pullback" || picks.entry === "confirmation") {
      logGameEvent({ game: "build-the-trade", difficulty, skill: "patience", outcome: "win" });
    } else if (picks.entry === "aggressive" && current.optimal.entry !== "aggressive") {
      logGameEvent({ game: "build-the-trade", difficulty, skill: "patience", outcome: "loss" });
    }
    // 4. Choix de stop → gestion risque
    if (picks.stop === "logical") {
      logGameEvent({ game: "build-the-trade", difficulty, skill: "gestion_risque", outcome: "win" });
    } else if (picks.stop === "tight") {
      logGameEvent({ game: "build-the-trade", difficulty, skill: "gestion_risque", outcome: "loss" });
    }

    setResult(r);
    setScore((s) => s + r.points);
    if (r.qualityMatch === 3 && r.outcome === "tp_hit") {
      const ns = streak + 1;
      setStreak(ns);
      setMaxStreak((m) => Math.max(m, ns));
    } else {
      setStreak(0);
    }
    setStats((s) => ({
      perfectSetups: s.perfectSetups + (r.qualityMatch === 3 ? 1 : 0),
      tpHits:        s.tpHits + (r.outcome === "tp_hit" ? 1 : 0),
      slHits:        s.slHits + (r.outcome === "sl_hit" ? 1 : 0),
    }));
    setPhase("reveal");
    setRevealed(1);
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
            {T.games}
          </Link>
          <div className="flex items-center gap-3 text-[11px]">
            <DifficultyChip difficulty={difficulty} difficultyMeta={G.DIFFICULTY_META} />
            <div className="w-px h-3 bg-zinc-800" />
            <span className="text-zinc-600 uppercase tracking-wide">{T.round}</span>
            <span className="font-bold text-white tabular-nums">{idx + 1}/{ROUNDS_PER_SESSION}</span>
            <div className="w-px h-3 bg-zinc-800" />
            <span className="text-zinc-600 uppercase tracking-wide">{T.score}</span>
            <span className={`font-bold tabular-nums ${score < 0 ? "text-red-400" : "text-emerald-400"}`}>
              {score >= 0 ? "+" : ""}{score}
            </span>
          </div>
        </div>

        {streak > 0 && (
          <div className="mb-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold">
            <span className="text-amber-400">🔥</span>
            <span className="text-amber-400 tabular-nums">{streak}</span>
            <span className="text-zinc-500">{T.consecutivePerfect}</span>
          </div>
        )}

        {/* Scenario card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden mb-5">
          <div className="px-4 pt-3 pb-2.5 border-b border-zinc-800/60 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tabular-nums">{current.asset}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-[11px] text-zinc-400">{current.session}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${
                current.direction === "BUY" ? "text-emerald-400" : "text-red-400"
              }`}>{current.direction}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <VolBadge volatility={current.volatility} T={T} isEs={isEs} />
              <SpreadBadge spread={current.spread} T={T} isEs={isEs} />
            </div>
          </div>

          {/* Chart with overlays — entry/stop/tp lines as user picks.
              Pendant la phase build : on affiche les 3 candidats de l'étape
              active (entry candidates → stop candidates → tp candidates) avec
              mini-labels prix, pour que le joueur voit où se situe chaque
              option avant de cliquer son bouton. */}
          <div className="p-3 sm:p-4">
            <MiniChart
              data={{
                candles: [...chart.past, ...chart.future],
                zones:   chart.zones,
                domain:  chart.domain,
              }}
              overlay={{
                separatorIndex:     chart.past.length,
                visibleFutureCount: isBuild ? 0 : revealed,
                entry: entry ? { price: chart.entries[entry], direction: chart.direction } : undefined,
                tp:    tp    ? { price: chart.tps[tp] } : undefined,
                stop:  stop  ? { price: chart.stops[stop], hit: isFeedback ? (result?.slHit ?? false) : false } : undefined,
                candidateLines: !isBuild ? undefined :
                  entry === null ? [
                    { price: chart.entries.aggressive,    color: "#3b82f6", label: chart.entries.aggressive.toFixed(2)    },
                    { price: chart.entries.confirmation,  color: "#3b82f6", label: chart.entries.confirmation.toFixed(2)  },
                    { price: chart.entries.deep_pullback, color: "#3b82f6", label: chart.entries.deep_pullback.toFixed(2) },
                  ]
                  : stop === null ? [
                    { price: chart.stops.tight,   color: "#ef4444", label: chart.stops.tight.toFixed(2)   },
                    { price: chart.stops.logical, color: "#ef4444", label: chart.stops.logical.toFixed(2) },
                    { price: chart.stops.wide,    color: "#ef4444", label: chart.stops.wide.toFixed(2)    },
                  ]
                  : tp === null ? [
                    { price: chart.tps.fast,      color: "#10b981", label: chart.tps.fast.toFixed(2)      },
                    { price: chart.tps.balanced,  color: "#10b981", label: chart.tps.balanced.toFixed(2)  },
                    { price: chart.tps.ambitious, color: "#10b981", label: chart.tps.ambitious.toFixed(2) },
                  ]
                  : undefined,
              }}
              height={185}
            />
            {chart.zones.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {chart.zones.map((z, i) => (
                  <ZoneLegendChip key={i} zone={z} />
                ))}
              </div>
            )}
          </div>

          {/* Context tiles */}
          <div className={`px-4 pb-3 grid gap-2 ${difficulty === "advanced" ? "grid-cols-2" : "grid-cols-3"}`}>
            <InfoTile label={T.htf}        value={BIAS_LABEL[current.htfBias]}        colorClass={biasClass(current.htfBias)} />
            <InfoTile label={T.macro}      value={MACRO_LABEL[current.macroContext]}  colorClass={current.macroContext === "dangereux" ? "text-red-400" : "text-zinc-300"} />
            {difficulty !== "advanced" && (
              <InfoTile label={T.volatility} value={cap(translateVolatility(current.volatility, isEs))} colorClass="text-zinc-300" />
            )}
          </div>

          {/* Context text */}
          <div className="px-4 pb-4">
            <p className="text-[13px] text-zinc-300 leading-relaxed">{current.context}</p>
          </div>
        </div>

        {/* Build / Reveal / Feedback */}
        {isBuild && (
          <BuildPanel
            T={T}
            chart={chart}
            entry={entry} stop={stop} tp={tp}
            onEntry={setEntry} onStop={setStop} onTp={setTp}
            onValidate={handleValidate}
            canValidate={canValidate}
            entryLabels={G.ENTRY_LABELS}
            stopLabels={G.STOP_LABELS}
            tpLabels={G.TP_LABELS}
          />
        )}

        {isReveal && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-5 text-center">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              {T.revelation}
            </p>
            <p className="text-sm text-zinc-300">
              {T.revealText}
            </p>
          </div>
        )}

        {isFeedback && result && (
          <Feedback
            T={T}
            result={result}
            chart={chart}
            picks={{ entry: entry!, stop: stop!, tp: tp! }}
            optimal={current.optimal}
            title={current.title}
            optimalExplain={current.optimalExplain}
            lesson={current.lessons[difficulty]}
            difficulty={difficulty}
            difficultyMeta={G.DIFFICULTY_META}
            entryLabels={G.ENTRY_LABELS}
            stopLabels={G.STOP_LABELS}
            tpLabels={G.TP_LABELS}
            setupVerdictFn={G.setupVerdict}
            onNext={handleNext}
            isLast={idx + 1 >= ROUNDS_PER_SESSION}
          />
        )}

        {/* Stats */}
        <div className="mt-6 pt-5 border-t border-zinc-800/60 grid grid-cols-3 gap-2.5">
          <StatTile label={T.perfectSetups} value={`${stats.perfectSetups}`} />
          <StatTile label={T.tpHits}        value={`${stats.tpHits}`} />
          <StatTile label={T.slHits}        value={`${stats.slHits}`} />
        </div>
      </div>
    </main>
  );
}

// ─── Difficulty picker ────────────────────────────────────────────────────────

function DifficultyPicker({ onPick, difficultyMeta, isEs }: { onPick: (d: Difficulty) => void; difficultyMeta: typeof FrGame.DIFFICULTY_META; isEs: boolean }) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link href="/jeux" className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white mb-8">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isEs ? "Juegos" : "Jeux"}
        </Link>

        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          Build the Trade
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{isEs ? "Construye el setup" : "Construis le setup"}</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {isEs
            ? `${ROUNDS_PER_SESSION} escenarios. Para cada uno, eliges la entrada, el stop loss y el take profit. El mercado revela después lo que pasó — RR, drawdown, veredicto.`
            : `${ROUNDS_PER_SESSION} scénarios. Pour chacun, tu choisis l'entrée, le stop loss et le take profit. Le marché révèle ensuite ce qui s'est passé — RR, drawdown, verdict.`}
        </p>

        <div className="flex flex-col gap-3">
          {DIFFICULTIES.map((d) => {
            const meta = difficultyMeta[d];
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

// ─── Build panel (3-step picker) ─────────────────────────────────────────────

function BuildPanel({
  T, chart, entry, stop, tp, onEntry, onStop, onTp, onValidate, canValidate,
  entryLabels, stopLabels, tpLabels,
}: {
  T:           { [k: string]: string };
  chart:       BuildTradeChart;
  entry:       EntryType | null;
  stop:        StopType  | null;
  tp:          TpType    | null;
  onEntry:     (t: EntryType) => void;
  onStop:      (t: StopType)  => void;
  onTp:        (t: TpType)    => void;
  onValidate:  () => void;
  canValidate: boolean;
  entryLabels: typeof FrGame.ENTRY_LABELS;
  stopLabels:  typeof FrGame.STOP_LABELS;
  tpLabels:    typeof FrGame.TP_LABELS;
}) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Étape 1 : Entry */}
      <Section
        step={1}
        label={T.entry}
        active={entry === null}
        done={entry !== null}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {ENTRY_TYPES.map((t) => (
            <PickButton
              key={t}
              selected={entry === t}
              label={entryLabels[t]}
              price={chart.entries[t]}
              onClick={() => onEntry(t)}
              color="blue"
            />
          ))}
        </div>
      </Section>

      {/* Étape 2 : Stop */}
      <Section
        step={2}
        label={T.stopLoss}
        active={entry !== null && stop === null}
        done={stop !== null}
        locked={entry === null}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {STOP_TYPES.map((t) => (
            <PickButton
              key={t}
              selected={stop === t}
              disabled={entry === null}
              label={stopLabels[t]}
              price={chart.stops[t]}
              onClick={() => onStop(t)}
              color="red"
            />
          ))}
        </div>
      </Section>

      {/* Étape 3 : TP */}
      <Section
        step={3}
        label={T.takeProfit}
        active={stop !== null && tp === null}
        done={tp !== null}
        locked={stop === null}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {TP_TYPES.map((t) => (
            <PickButton
              key={t}
              selected={tp === t}
              disabled={stop === null}
              label={tpLabels[t]}
              price={chart.tps[t]}
              onClick={() => onTp(t)}
              color="emerald"
            />
          ))}
        </div>
      </Section>

      {/* RR Preview + Validate */}
      <div className="px-4 py-4 border-t border-zinc-800/60">
        {canValidate && entry && stop && tp && (
          <RrPreview T={T} chart={chart} entry={entry} stop={stop} tp={tp} />
        )}
        <button
          onClick={onValidate}
          disabled={!canValidate}
          className={`w-full flex items-center justify-center gap-2 font-bold text-base px-5 py-3.5 rounded-xl transition-all ${
            canValidate
              ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-[0.98] shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]"
              : "bg-zinc-800/60 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {T.validateTrade}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Section({ step, label, active, done, locked, children }: {
  step: number; label: string; active: boolean; done: boolean; locked?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`px-4 py-3 border-b border-zinc-800/60 ${locked ? "opacity-40" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
          done ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
        : active ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
        : "bg-zinc-800 text-zinc-500 border border-zinc-700"
        }`}>{step}</span>
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
      </div>
      {children}
    </div>
  );
}

function PickButton({ selected, disabled, label, price, onClick, color }: {
  selected: boolean; disabled?: boolean; label: string; price: number; onClick: () => void;
  color: "blue" | "red" | "emerald";
}) {
  const ringClass =
    selected
      ? color === "blue"    ? "bg-blue-500/15 border-blue-500/60 text-blue-400"
      : color === "red"     ? "bg-red-500/15 border-red-500/60 text-red-400"
      :                       "bg-emerald-500/15 border-emerald-500/60 text-emerald-400"
      : "bg-zinc-800/40 border-zinc-700 text-zinc-300 hover:bg-zinc-800/60";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`text-left rounded-xl px-2.5 py-2.5 border transition-all active:scale-[0.97] ${ringClass} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide truncate">{label}</p>
      <p className="text-sm font-black tabular-nums">{price.toFixed(2)}</p>
    </button>
  );
}

function RrPreview({ T, chart, entry, stop, tp }: { T: { [k: string]: string }; chart: BuildTradeChart; entry: EntryType; stop: StopType; tp: TpType }) {
  const e = chart.entries[entry];
  const s = chart.stops[stop];
  const t = chart.tps[tp];
  const risk = Math.abs(e - s);
  const reward = Math.abs(t - e);
  const rr = risk > 0.001 ? reward / risk : 0;
  const rrColor = rr >= 2 ? "text-emerald-400" : rr >= 1 ? "text-amber-400" : "text-red-400";
  return (
    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
      <RrTile label={T.risk} value={risk.toFixed(2)} colorClass="text-zinc-300" />
      <RrTile label={T.reward} value={reward.toFixed(2)} colorClass="text-zinc-300" />
      <RrTile label={T.rr} value={rr > 0 ? `1:${rr.toFixed(1)}` : "—"} colorClass={rrColor} />
    </div>
  );
}

function RrTile({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg px-2 py-1.5">
      <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-black tabular-nums ${colorClass}`}>{value}</p>
    </div>
  );
}

// ─── Feedback ────────────────────────────────────────────────────────────────

function Feedback({
  T, result, chart, picks, optimal, title, optimalExplain, lesson, difficulty, difficultyMeta,
  entryLabels, stopLabels, tpLabels, setupVerdictFn, onNext, isLast,
}: {
  T:              { [k: string]: string };
  result:         BuildTradeResult;
  chart:          BuildTradeChart;
  picks:          { entry: EntryType; stop: StopType; tp: TpType };
  optimal:        { entry: EntryType; stop: StopType; tp: TpType };
  title:          string;
  optimalExplain: string;
  lesson:         string;
  difficulty:     Difficulty;
  difficultyMeta: typeof FrGame.DIFFICULTY_META;
  entryLabels:    typeof FrGame.ENTRY_LABELS;
  stopLabels:     typeof FrGame.STOP_LABELS;
  tpLabels:       typeof FrGame.TP_LABELS;
  setupVerdictFn: typeof FrGame.setupVerdict;
  onNext:         () => void;
  isLast:         boolean;
}) {
  const verdict = setupVerdictFn(result);
  const border =
    verdict.color === "emerald" ? "border-emerald-500/30 bg-emerald-500/8"
  : verdict.color === "amber"   ? "border-amber-500/30 bg-amber-500/8"
  :                               "border-red-500/30 bg-red-500/8";
  const txt =
    verdict.color === "emerald" ? "text-emerald-400"
  : verdict.color === "amber"   ? "text-amber-400"
  :                               "text-red-400";

  return (
    <div className={`bg-zinc-900/50 border rounded-2xl overflow-hidden ${border.split(" ")[0]}`}>
      <div className={`px-4 py-3 ${border.split(" ")[1]} flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <p className={`text-sm font-bold ${txt} truncate`}>{verdict.label}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-base font-black tabular-nums ${result.points >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {result.points >= 0 ? "+" : ""}{result.points}
          </p>
          {result.streakBonus > 0 && (
            <p className="text-[9px] text-amber-400 uppercase tracking-wide font-bold">+{result.streakBonus} streak</p>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">{title}</p>

        {/* Outcome panel */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <OutcomeTile
            label={T.outcome}
            value={
              result.outcome === "tp_hit"   ? T.tpHit
            : result.outcome === "sl_hit"   ? T.slHit
            : result.outcome === "no_fill"  ? T.noFill
            :                                  T.tradeOpen
            }
            colorClass={
              result.outcome === "tp_hit"  ? "text-emerald-400"
            : result.outcome === "sl_hit"  ? "text-red-400"
            :                                 "text-amber-400"
            }
          />
          <OutcomeTile
            label={T.rrRealized}
            value={result.rr > 0 ? `1:${result.rr.toFixed(1)}` : "—"}
            colorClass={result.rr >= 2 ? "text-emerald-400" : result.rr >= 1 ? "text-amber-400" : "text-zinc-400"}
          />
        </div>
        {result.entryFilled && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <OutcomeTile label={T.drawdown} value={result.maxDrawdown.toFixed(2)} colorClass="text-zinc-300" />
            <OutcomeTile
              label={T.optimalPlan}
              value={`${result.qualityMatch}/3`}
              colorClass={result.qualityMatch === 3 ? "text-emerald-400" : result.qualityMatch >= 2 ? "text-amber-400" : "text-red-400"}
            />
          </div>
        )}

        {/* Choix : tien choix vs optimal */}
        <div className="space-y-1.5 mb-3">
          <ChoiceRow label={T.entryLabel} user={entryLabels[picks.entry]}   best={entryLabels[optimal.entry]}  match={picks.entry === optimal.entry} />
          <ChoiceRow label={T.stopLabel}  user={stopLabels[picks.stop]}     best={stopLabels[optimal.stop]}    match={picks.stop  === optimal.stop} />
          <ChoiceRow label={T.tpLabel}    user={tpLabels[picks.tp]}         best={tpLabels[optimal.tp]}        match={picks.tp    === optimal.tp} />
        </div>

        <div className="bg-blue-500/8 border border-blue-500/25 rounded-lg px-3 py-2.5 mb-3">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-1">{T.optimalSetup}</p>
          <p className="text-[13px] text-zinc-200 leading-relaxed">{optimalExplain}</p>
        </div>

        <div className="bg-amber-500/8 border border-amber-500/25 rounded-lg px-3 py-2.5 mb-3">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide mb-1">{T.lesson} · {difficultyMeta[difficulty].label}</p>
          <p className="text-[13px] text-zinc-200 leading-relaxed">{lesson}</p>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-zinc-800/60">
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2 transition-colors"
          >
            {isLast ? T.viewSummary : T.nextScenario}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <span className="sr-only">{chart.direction}</span>
    </div>
  );
}

function ChoiceRow({ label, user, best, match }: { label: string; user: string; best: string; match: boolean }) {
  return (
    <div className={`border rounded-lg px-3 py-2 flex items-center justify-between gap-2 ${
      match ? "bg-emerald-500/8 border-emerald-500/30" : "bg-zinc-950/40 border-zinc-800"
    }`}>
      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`text-[11px] font-semibold ${match ? "text-emerald-400" : "text-zinc-300"}`}>{user}</span>
        {!match && (
          <>
            <span className="text-[10px] text-zinc-600">vs</span>
            <span className="text-[11px] font-semibold text-emerald-400">{best}</span>
          </>
        )}
      </div>
    </div>
  );
}

function OutcomeTile({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg px-3 py-2">
      <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

// ─── Sub-helpers ─────────────────────────────────────────────────────────────

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

function VolBadge({ volatility, T, isEs }: { volatility: "faible" | "normale" | "élevée"; T: { [k: string]: string }; isEs: boolean }) {
  const cls =
    volatility === "élevée"  ? "text-amber-400 border-amber-400/30"
  : volatility === "faible"  ? "text-zinc-500 border-zinc-700"
  :                            "text-zinc-400 border-zinc-700";
  const label = isEs
    ? (volatility === "élevée" ? T.volHigh : volatility === "faible" ? T.volLow : T.volNormal)
    : volatility;
  return <span className={`border rounded-full px-2 py-0.5 font-semibold ${cls}`}>{T.vol} {label}</span>;
}

function SpreadBadge({ spread, T, isEs }: { spread: "faible" | "élevé"; T: { [k: string]: string }; isEs: boolean }) {
  const cls = spread === "élevé"
    ? "text-amber-400 border-amber-400/30"
    : "text-zinc-500 border-zinc-700";
  const label = isEs
    ? (spread === "élevé" ? T.spreadHigh : T.spreadLow)
    : spread;
  return <span className={`border rounded-full px-2 py-0.5 font-semibold ${cls}`}>{T.spread} {label}</span>;
}

function translateVolatility(v: "faible" | "normale" | "élevée", isEs: boolean): string {
  if (!isEs) return v;
  return v === "élevée" ? "alta" : v === "faible" ? "baja" : "normal";
}

function DifficultyChip({ difficulty, difficultyMeta }: { difficulty: Difficulty; difficultyMeta: typeof FrGame.DIFFICULTY_META }) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wide ${meta.textClass}`}>{meta.label}</span>
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
  T, difficulty, difficultyMeta, sessionVerdictFn, score, maxStreak, stats, onReplay, onChangeDifficulty,
}: {
  T: { [k: string]: string };
  difficulty:       Difficulty;
  difficultyMeta:   typeof FrGame.DIFFICULTY_META;
  sessionVerdictFn: typeof FrGame.sessionVerdict;
  score: number;
  maxStreak: number;
  stats: SessionStats;
  onReplay: () => void;
  onChangeDifficulty: () => void;
}) {
  const total = ROUNDS_PER_SESSION;
  const verdict = sessionVerdictFn(score, stats.perfectSetups, total);
  const verdictColor =
    score >= 500 ? "text-emerald-400"
  : score >= 0   ? "text-amber-400"
  :                "text-red-400";
  const meta = difficultyMeta[difficulty];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/jeux" className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white mb-6">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {T.games}
        </Link>

        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          {T.summary} · <span className={meta.textClass}>{meta.label}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{ROUNDS_PER_SESSION} {T.setupsBuilt}</h1>
        <p className={`text-sm font-semibold ${verdictColor} mb-7`}>{verdict}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <BigStat label={T.score}          value={`${score >= 0 ? "+" : ""}${score}`}    valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
          <BigStat label={T.perfectSetups}  value={`${stats.perfectSetups}/${total}`}     valueClass="text-emerald-400" />
          <BigStat label={T.tpHits}         value={`${stats.tpHits}`}                     valueClass="text-emerald-400" />
          <BigStat label={T.slHits}         value={`${stats.slHits}`}                     valueClass={stats.slHits > 0 ? "text-red-400" : "text-zinc-300"} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onReplay} className="flex-1 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-colors">
            {T.replayIn} {meta.label.toLowerCase()}
          </button>
          <button onClick={onChangeDifficulty} className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 transition-colors">
            {T.changeLevel}
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
