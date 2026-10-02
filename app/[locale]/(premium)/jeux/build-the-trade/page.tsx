"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as FrGame from "@/lib/games/build-the-trade";
import * as EsGame from "@/lib/games/build-the-trade-es";
import * as EnGame from "@/lib/games/build-the-trade-en";
import {
  evaluateTrade,
  MAX_TRADE_POINTS,
  ROUNDS_PER_SESSION,
  type BuildTradeChart,
  type BuildTradeInstance,
  type BuildTradeResult,
  type Difficulty,
  type EntryType,
  type StopType,
  type TpType,
} from "@/lib/games/build-the-trade";
import { GameChartV2, V2_REVEAL_DELAY_MS } from "@/app/components/games/v2/GameChartV2";
import { StepBadge, VerdictOverlay, GeneralCasesNote, JargonHints, useJargon, type VerdictState } from "@/app/components/games/v2/ui";

// Couleur du verdict de setup → état du verdict superposé (icône, titre et points)
const VERDICT_STATE: Record<"emerald" | "amber" | "red", VerdictState> = { emerald: "good", amber: "partial", red: "bad" };
import { logGameEvent } from "@/lib/trader-profile";
import { formatPrice } from "@/lib/games/price-scale";
import { sessionLabel, type Asset } from "@/lib/games/shared";

const BIAS_LABEL_FR  = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const BIAS_LABEL_ES  = { bullish: "Alcista", bearish: "Bajista", range: "Range" } as const;
const BIAS_LABEL_EN  = { bullish: "Bullish", bearish: "Bearish", range: "Range" } as const;
const MACRO_LABEL_FR = { normal: "Normal", dangereux: "Dangereux" } as const;
const MACRO_LABEL_ES = { normal: "Normal", dangereux: "Peligroso" } as const;
const MACRO_LABEL_EN = { normal: "Normal", dangereux: "Dangerous" } as const;
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

const ENTRY_TYPES: EntryType[] = ["aggressive", "confirmation", "deep_pullback"];
const STOP_TYPES:  StopType[]  = ["tight", "logical", "wide"];
const TP_TYPES:    TpType[]    = ["fast", "balanced", "ambitious"];

type BuildStep = "entry" | "stop" | "tp";
const STEP_COLOR: Record<BuildStep, string> = { entry: "#3b82f6", stop: "#ef4444", tp: "#10b981" };
const REVEAL_STEP_MS = 420;
/** Durée max de la révélation bougie par bougie (suites longues : pas raccourci) */
const REVEAL_MAX_MS = 5600;


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
  const G = locale === "es" ? EsGame : locale === "en" ? EnGame : FrGame;
  const BIAS_LABEL = locale === "es" ? BIAS_LABEL_ES : locale === "en" ? BIAS_LABEL_EN : BIAS_LABEL_FR;
  const MACRO_LABEL = locale === "es" ? MACRO_LABEL_ES : locale === "en" ? MACRO_LABEL_EN : MACRO_LABEL_FR;
  const T = locale === "es"
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
        buildIntro:       "escenarios. Para cada uno, eliges la entrada, el stop loss y el take profit. El mercado revela después lo que pasó. R/R, drawdown, veredicto.",
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
        stepBuild:        "Construcción",
        stepVerdict:      "Veredicto",
        stepTab:          "Paso",
        lineTp:           "TP",
      }
    : locale === "en"
    ? {
        games:            "Games",
        round:            "Round",
        score:            "Score",
        consecutivePerfect: "perfect setups in a row",
        loading:          "Loading…",
        htf:              "HTF",
        macro:            "Macro",
        volatility:       "Volatility",
        entry:            "ENTRY",
        stopLoss:         "STOP LOSS",
        takeProfit:       "TAKE PROFIT",
        validateTrade:    "Validate the trade",
        risk:             "Risk",
        reward:           "Reward",
        rr:               "R/R",
        revelation:       "Reveal",
        revealText:       "Let's see how the market behaves with your plan…",
        outcome:          "Outcome",
        tpHit:            "TP hit ✓",
        slHit:            "SL hit ✗",
        noFill:           "No entry",
        tradeOpen:        "Trade open",
        rrRealized:       "R/R realized",
        drawdown:         "Drawdown",
        optimalPlan:      "Optimal plan",
        entryLabel:       "Entry",
        stopLabel:        "Stop",
        tpLabel:          "Take Prof",
        optimalSetup:     "Optimal setup",
        lesson:           "Lesson",
        viewSummary:      "View the summary",
        nextScenario:     "Next scenario",
        skills:           "Skills",
        perfectSetups:    "Perfect setups",
        tpHits:           "TP hits",
        slHits:           "SL hits",
        buildTitle:       "Build the Trade",
        buildHeading:     "Build the setup",
        buildIntro:       "scenarios. For each one, you choose the entry, the stop loss and the take profit. The market then reveals what happened. RR, drawdown, verdict.",
        summary:          "Summary",
        setupsBuilt:      "setups built",
        replayIn:         "Replay in",
        changeLevel:      "Change level",
        vol:              "Vol.",
        spread:           "Spread",
        spreadLow:        "low",
        spreadHigh:       "high",
        volLow:           "low",
        volNormal:        "normal",
        volHigh:          "high",
        stepBuild:        "Build",
        stepVerdict:      "Verdict",
        stepTab:          "Step",
        lineTp:           "TP",
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
        buildIntro:       "scénarios. Pour chacun, tu choisis l'entrée, le stop loss et le take profit. Le marché révèle ensuite ce qui s'est passé. R/R, drawdown, verdict.",
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
        stepBuild:        "Construction",
        stepVerdict:      "Verdict",
        stepTab:          "Étape",
        lineTp:           "TP",
      };
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<BuildTradeInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const jargon = useJargon(locale, difficulty, seed);
  const [entry, setEntry] = useState<EntryType | null>(null);
  const [stop, setStop] = useState<StopType | null>(null);
  const [tp, setTp] = useState<TpType | null>(null);
  // Étape rouverte par le joueur (onglet) ; sinon la 1re étape non remplie
  const [editing, setEditing] = useState<BuildStep | null>(null);
  // Candidat survolé ou touché (sa ligne s'éclaire), et choix tenu un instant
  // sur son étape avant de passer à la suivante (le joueur voit sa ligne)
  const [hover, setHover] = useState<string | null>(null);
  const [hold, setHold] = useState<{ step: BuildStep; value: string } | null>(null);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    () => (current ? G.withAssetPrices(G.buildBuildTradeChart(current, current.seed, current.volatility, { asset: current.asset, session: current.session }), current) : null),
    [current, G],
  );

  // Suite révélée : jusqu'au 1er TP / stop touché par le plan du joueur, sinon
  // toute la suite (FUTURE_LENGTH bougies au maximum)
  const revealCount = useMemo(() => {
    if (!chart) return 0;
    const hits = [result?.tpIdx, result?.slIdx].filter((i): i is number => i !== null && i !== undefined);
    return hits.length ? Math.min(...hits) + 1 : chart.future.length;
  }, [chart, result]);

  // Reset state au scenario suivant
  useEffect(() => {
    setEntry(null);
    setStop(null);
    setTp(null);
    setEditing(null);
    setHover(null);
    setHold(null);
    if (holdRef.current) { clearTimeout(holdRef.current); holdRef.current = null; }
    setPhase("build");
    setRevealed(0);
    setResult(null);
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
  }, [idx]);

  // Révélation : la 1re bougie future arrive après le glissement du graphique
  // (V2_REVEAL_DELAY_MS), puis une bougie toutes les 420ms (moins si la suite
  // est longue : la révélation ne dépasse pas REVEAL_MAX_MS).
  useEffect(() => {
    if (phase !== "reveal" || !chart) return;
    if (revealed >= revealCount) {
      animRef.current = setTimeout(() => setPhase("feedback"), 350);
    } else {
      const glide = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : V2_REVEAL_DELAY_MS;
      const step = Math.min(REVEAL_STEP_MS, Math.round(REVEAL_MAX_MS / revealCount));
      animRef.current = setTimeout(() => setRevealed((c) => c + 1), revealed === 0 ? glide : step);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [phase, revealed, chart, revealCount]);

  if (!difficulty || !seed) {
    return <DifficultyPicker locale={locale} difficultyMeta={G.DIFFICULTY_META} onPick={(d) => {
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
      <main className="v2-page flex min-h-[60vh] items-center justify-center">
        <p className="text-[14px] text-[color:var(--v2-text-3)]">{T.loading}</p>
      </main>
    );
  }

  const canValidate = entry !== null && stop !== null && tp !== null;
  const isBuild = phase === "build";
  const isReveal = phase === "reveal";
  const isFeedback = phase === "feedback";
  const active: BuildStep | null = !isBuild ? null
    : hold?.step ?? editing ?? (entry === null ? "entry" : stop === null ? "stop" : tp === null ? "tp" : null);

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
    if (r.qualityMatch === 3) {
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
    setEditing(null);
    setPhase("reveal");
    setRevealed(0); // la 1re bougie future arrive après le glissement du graphique
  };

  const handleNext = () => {
    if (idx + 1 >= ROUNDS_PER_SESSION) {
      setShowSummary(true);
    } else {
      setIdx(idx + 1);
    }
  };

  const pick = (s: BuildStep, value: string) => {
    if (s === "entry") setEntry(value as EntryType);
    if (s === "stop")  setStop(value as StopType);
    if (s === "tp")    setTp(value as TpType);
    setEditing(null);
    // La ligne choisie reste éclairée un instant avant l'étape suivante
    setHold({ step: s, value });
    if (holdRef.current) clearTimeout(holdRef.current);
    holdRef.current = setTimeout(() => { setHold(null); setHover(null); holdRef.current = null; }, 600);
  };

  const step = isBuild ? 1 : isReveal ? 2 : 3;
  const stepLabel = isBuild ? T.stepBuild : isReveal ? T.revelation : T.stepVerdict;
  const fmt = (p: number) => formatPrice(current.asset, p);
  const levels: Record<BuildStep, Record<string, number>> = { entry: chart.entries, stop: chart.stops, tp: chart.tps };
  const types: Record<BuildStep, string[]> = { entry: ENTRY_TYPES, stop: STOP_TYPES, tp: TP_TYPES };
  const stepNames: Record<BuildStep, string> = { entry: T.entryLabel, stop: T.stopLabel, tp: T.lineTp };
  const optionLabels: Record<BuildStep, Record<string, string>> = { entry: G.ENTRY_LABELS, stop: G.STOP_LABELS, tp: G.TP_LABELS };
  const picked: Record<BuildStep, string | null> = { entry, stop, tp };

  // Impact en direct pendant la révélation : stop touché / TP atteint
  const slLive = !!result?.slHit && result.slIdx !== null && result.slIdx < revealed;
  const tpLive = !!result?.tpHit && result.tpIdx !== null && result.tpIdx < revealed;

  // Lignes du graphique. Construction : les 3 candidats de l'étape active,
  // nommés comme leurs boutons (« Serré », « Logique »…), et l'entrée choisie ;
  // les autres niveaux déjà choisis restent des traits discrets, sans
  // étiquette (4 étiquettes au plus). Révélation / verdict : Entrée, Stop, TP.
  const chosenLines = (["entry", "stop", "tp"] as BuildStep[]).flatMap((s) => {
    const v = picked[s];
    if (v === null || s === active) return [];
    return [{
      price:    levels[s][v],
      color:    STEP_COLOR[s],
      dashed:   false,
      label:    !isBuild || s === "entry" ? stepNames[s] : undefined,
      hit:      s === "stop" && !isBuild && slLive,
      selected: s === "tp" && !isBuild && tpLive,
    }];
  });
  const candidateLines = active
    ? types[active].map((t) => ({ price: levels[active][t], color: STEP_COLOR[active], label: optionLabels[active][t] }))
    : undefined;
  // Candidat mis en avant : touché / survolé, tenu après le choix, ou déjà choisi
  const emphasisValue = active ? (hold?.value ?? hover ?? picked[active]) : null;
  const emphasis = active && emphasisValue ? `cand${types[active].indexOf(emphasisValue)}` : null;
  // Zones nommées sur le graphique : la zone principale à l'étape Entrée et au
  // verdict ; aux étapes Stop et TP, la place va aux 3 candidats et à l'entrée
  const labeledZones = isBuild && active !== "entry" ? [] : [0];
  const legendZones = chart.zones.filter((_, i) => !labeledZones.includes(i));

  return (
    <main className="v2-page mx-auto flex w-full max-w-[880px] flex-col">
      <div className="flex flex-col gap-3">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <Link href="/jeux" className="v2-link-back">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {T.games}
          </Link>
          <div className="ml-auto flex items-center gap-3 text-[12px]">
            <DifficultyChip difficulty={difficulty} difficultyMeta={G.DIFFICULTY_META} />
            <span className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-wide text-[color:var(--v2-text-3)]">{T.round}</span>
              <span className="v2-mono font-bold text-[color:var(--v2-text)]">{idx + 1}/{ROUNDS_PER_SESSION}</span>
            </div>
            <span className="h-3 w-px bg-white/15" />
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-wide text-[color:var(--v2-text-3)]">{T.score}</span>
              <span className={`v2-mono font-bold ${score < 0 ? "text-red-400" : "text-emerald-400"}`}>
                {score >= 0 ? "+" : ""}{score}
              </span>
            </div>
          </div>
        </div>

        {/* Série — emplacement toujours réservé : son apparition au clic ne
            doit pas décaler le jeu */}
        <div
          className={`flex h-[18px] items-center justify-center gap-1.5 text-[12px] font-semibold ${streak > 0 ? "" : "invisible"}`}
          aria-hidden={streak === 0}
        >
          <span className="text-amber-300">🔥</span>
          <span className="v2-mono text-amber-300">{streak}</span>
          <span className="text-[color:var(--v2-text-3)]">{T.consecutivePerfect}</span>
        </div>

        {/* Scénario */}
        <section className="v2-card v2-pad v2-gap flex flex-col" aria-labelledby="btt-title">
          <h2 id="btt-title" className="v2-display v2-h2 mx-auto w-full max-w-3xl font-bold">{T.buildTitle}</h2>

          <div className="v2-gap-s mx-auto flex w-full max-w-3xl flex-col">
            <StepBadge n={step} label={stepLabel} />

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="v2-display v2-asset mr-1 font-bold">{current.asset}</span>
              <span className={`v2-chip ${current.direction === "BUY" ? "v2-chip--emerald" : "v2-chip--red"}`}>{current.direction}</span>
              <span className="v2-chip">{sessionLabel(current.session, locale)}</span>
              <VolBadge volatility={current.volatility} T={T} />
              <SpreadBadge spread={current.spread} T={T} />
            </div>

            {/* Le contexte au-dessus du graphique : contexte, graphique et
                choix tiennent dans le même écran */}
            <p className="v2-lead text-[color:var(--v2-text)]">{current.context}</p>

            <GameChartV2
              data={{ candles: [...chart.past, ...chart.future.slice(0, revealCount)], zones: chart.zones, domain: chart.domain }}
              overlay={{
                separatorIndex:     chart.past.length,
                visibleFutureCount: isBuild ? 0 : revealed,
                stops:              chosenLines,
                candidateLines,
              }}
              mode={isBuild ? "question" : isReveal ? "reveal" : "verdict"}
              // Étiquettes posées sur leur ligne ; échelle calée sur les bougies et
              // les niveaux de l'étape en cours, avec un glissement d'une étape à l'autre
              inlineLabels
              labeledZones={labeledZones}
              emphasis={emphasis}
              glideScale
            >
              {isFeedback && result && (
                <VerdictOverlay
                  state={VERDICT_STATE[G.setupVerdict(result).color]}
                  headline={G.setupVerdict(result).label}
                  points={result.points}
                  max={MAX_TRADE_POINTS}
                />
              )}
            </GameChartV2>

            {/* Légende : uniquement les zones non nommées sur le graphique à cette étape */}
            {legendZones.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {legendZones.map((z, i) => <ZoneLegendChip key={i} zone={z} />)}
              </div>
            )}

            {/* Plan : 3 étapes en onglets (Entrée / Stop / TP) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(["entry", "stop", "tp"] as BuildStep[]).map((s, i) => {
                const v = picked[s];
                const locked = !isBuild || (s === "stop" && entry === null) || (s === "tp" && (entry === null || stop === null));
                return (
                  <button
                    key={s}
                    type="button"
                    aria-label={`${T.stepTab} ${i + 1} · ${stepNames[s]}`}
                    aria-pressed={active === s}
                    disabled={locked}
                    onClick={() => setEditing(s)}
                    data-active={active === s ? "" : undefined}
                    className="v2-build-tab"
                    style={{ ["--tab-color" as string]: STEP_COLOR[s] }}
                  >
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[color:var(--v2-text-3)]">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STEP_COLOR[s] }} />
                      <span className="hidden sm:inline">{i + 1} · </span>{stepNames[s]}
                    </span>
                    <span className={`v2-mono text-[16px] font-bold ${v ? "text-[color:var(--v2-text)]" : "text-[color:var(--v2-text-3)]"}`}>
                      {v ? fmt(levels[s][v]) : "—"}
                    </span>
                    <span className="text-[12px] leading-tight text-[color:var(--v2-text-2)]">{v ? optionLabels[s][v] : " "}</span>
                  </button>
                );
              })}
            </div>

            {/* Choix de l'étape active, puis le R/R du plan : même emplacement,
                même hauteur (aucun saut de mise en page) */}
            <div className="min-h-[64px]">
              {active ? (
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {types[active].map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-label={optionLabels[active][t]}
                      data-pick={`${active}:${t}`}
                      data-selected={picked[active] === t ? "" : undefined}
                      onClick={() => pick(active, t)}
                      onPointerEnter={() => setHover(t)}
                      onPointerDown={() => setHover(t)}
                      onPointerLeave={() => setHover((h) => (h === t ? null : h))}
                      onFocus={() => setHover(t)}
                      onBlur={() => setHover((h) => (h === t ? null : h))}
                      className="v2-build-choice"
                      style={{ ["--tab-color" as string]: STEP_COLOR[active] }}
                    >
                      <span className="text-[13px] font-bold leading-tight">{optionLabels[active][t]}</span>
                      <span className="v2-mono text-[16px] font-bold">{fmt(levels[active][t])}</span>
                    </button>
                  ))}
                </div>
              ) : canValidate ? (
                <RrPreview T={T} chart={chart} entry={entry!} stop={stop!} tp={tp!} asset={current.asset} />
              ) : null}
            </div>

            {/* Valider → message de révélation → feedback */}
            {isBuild && (
              <button
                type="button"
                onClick={handleValidate}
                disabled={!canValidate}
                className={`v2-btn w-full ${canValidate ? "v2-btn--light" : "cursor-not-allowed opacity-40"}`}
              >
                {T.validateTrade}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Lexique : jargon expliqué à sa première apparition (débutant, intermédiaire) */}
            <JargonHints locale={locale} entries={jargon(`${idx}:q`, [T.spread, current.context, ...chart.zones.map((z) => z.label), ...(["entry", "stop", "tp"] as const).flatMap((st) => Object.values(optionLabels[st])), T.htf, MACRO_LABEL[current.macroContext]])} />

            {isReveal && (
              <div className="v2-well flex min-h-[46px] items-center justify-center px-4 py-2 text-center">
                <p className="v2-body text-[color:var(--v2-text-2)]">{T.revealText}</p>
              </div>
            )}

            {isFeedback && result && (
              <Feedback
                T={T}
                result={result}
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
                jargon={<JargonHints locale={locale} entries={jargon(`${idx}:f`, [current.title, T.rrRealized, T.drawdown, current.optimalExplain, current.lessons[difficulty]])} />}
                asset={current.asset}
              />
            )}

            {/* Contexte */}
            <div className={`grid gap-2 sm:gap-3 ${difficulty === "advanced" ? "grid-cols-2" : "grid-cols-3"}`}>
              <InfoTile label={T.htf}   value={BIAS_LABEL[current.htfBias]}       valueClass={biasClass(current.htfBias)} />
              <InfoTile label={T.macro} value={MACRO_LABEL[current.macroContext]} valueClass={current.macroContext === "dangereux" ? "text-red-300" : ""} />
              {difficulty !== "advanced" && (
                <InfoTile label={T.volatility} value={cap(translateVolatility(current.volatility, locale))} valueClass="" />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Stats */}
      <section className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-2 sm:gap-3">
        <StatTile label={T.perfectSetups} value={`${stats.perfectSetups}`} />
        <StatTile label={T.tpHits}        value={`${stats.tpHits}`} />
        <StatTile label={T.slHits}        value={`${stats.slHits}`} />
      </section>
    </main>
  );
}

// ─── Difficulty picker ────────────────────────────────────────────────────────

function DifficultyPicker({ onPick, difficultyMeta, locale }: { onPick: (d: Difficulty) => void; difficultyMeta: typeof FrGame.DIFFICULTY_META; locale: string | undefined }) {
  return (
    <main className="v2-page mx-auto flex w-full max-w-xl flex-col">
      <Link href="/jeux" className="v2-link-back">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {locale === "es" ? "Juegos" : locale === "en" ? "Games" : "Jeux"}
      </Link>

      <div className="v2-gap-s flex flex-col">
        <p className="v2-eyebrow">Build the Trade</p>
        <h1 className="v2-display v2-h2 font-bold">{locale === "es" ? "Construye el setup" : locale === "en" ? "Build the setup" : "Construis le setup"}</h1>
        <p className="v2-lead text-[color:var(--v2-text-2)]">
          {locale === "es"
            ? `${ROUNDS_PER_SESSION} escenarios. Para cada uno, eliges la entrada, el stop loss y el take profit. El mercado revela después lo que pasó. R/R, drawdown, veredicto.`
            : locale === "en"
            ? `${ROUNDS_PER_SESSION} scenarios. For each one, you choose the entry, the stop loss and the take profit. The market then reveals what happened. RR, drawdown, verdict.`
            : `${ROUNDS_PER_SESSION} scénarios. Pour chacun, tu choisis l'entrée, le stop loss et le take profit. Le marché révèle ensuite ce qui s'est passé. R/R, drawdown, verdict.`}
        </p>
        <GeneralCasesNote />
      </div>

      <div className="flex flex-col gap-3">
        {DIFFICULTIES.map((d) => {
          const meta = difficultyMeta[d];
          return (
            <button
              key={d}
              onClick={() => onPick(d)}
              className="v2-card group px-5 py-4 text-left transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                  <span className={`v2-display text-[18px] font-bold ${meta.textClass}`}>{meta.label}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-[color:var(--v2-text-3)] transition-colors group-hover:text-[color:var(--v2-text)]">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="v2-body text-[color:var(--v2-text-2)]">{meta.description}</p>
            </button>
          );
        })}
      </div>
    </main>
  );
}

// ─── R/R du plan ─────────────────────────────────────────────────────────────

function RrPreview({ T, chart, entry, stop, tp, asset }: { T: { [k: string]: string }; chart: BuildTradeChart; entry: EntryType; stop: StopType; tp: TpType; asset: Asset }) {
  const e = chart.entries[entry];
  const s = chart.stops[stop];
  const t = chart.tps[tp];
  const risk = Math.abs(e - s);
  const reward = Math.abs(t - e);
  const rr = risk > 0.001 ? reward / risk : 0;
  const rrColor = rr >= 2 ? "text-emerald-400" : rr >= 1 ? "text-amber-300" : "text-red-400";
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <OutcomeTile label={T.risk}   value={formatPrice(asset, risk)}   valueClass="" />
      <OutcomeTile label={T.reward} value={formatPrice(asset, reward)} valueClass="" />
      <OutcomeTile label={T.rr}     value={rr > 0 ? `1:${rr.toFixed(1)}` : ""} valueClass={rrColor} />
    </div>
  );
}

// ─── Feedback ────────────────────────────────────────────────────────────────
// Le verdict est affiché sur le graphique ; la carte détaille l'issue du
// trade, le plan optimal, la leçon et l'accès au scénario suivant.

function Feedback({
  T, result, picks, optimal, title, optimalExplain, lesson, difficulty, difficultyMeta,
  entryLabels, stopLabels, tpLabels, setupVerdictFn, onNext, isLast, asset, jargon,
}: {
  T:              { [k: string]: string };
  result:         BuildTradeResult;
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
  jargon?:        ReactNode;
  asset:          Asset;
}) {
  const verdict = setupVerdictFn(result);
  const tint = verdict.color === "emerald" ? "#34d399" : verdict.color === "amber" ? "#fcd34d" : "#f87171";

  return (
    <div className="v2-well v2-gap-s flex flex-col p-4 sm:p-5">
      <p className="v2-eyebrow" style={{ color: tint }}>{title}</p>

      {/* Issue du trade */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <OutcomeTile
          label={T.outcome}
          value={
            result.outcome === "tp_hit"  ? T.tpHit
          : result.outcome === "sl_hit"  ? T.slHit
          : result.outcome === "no_fill" ? T.noFill
          :                                T.tradeOpen
          }
          valueClass={
            result.outcome === "tp_hit" ? "text-emerald-300"
          : result.outcome === "sl_hit" ? "text-red-300"
          :                               "text-amber-300"
          }
        />
        <OutcomeTile
          label={T.rrRealized}
          value={result.rr > 0 ? `1:${result.rr.toFixed(1)}` : "—"}
          valueClass={result.rr >= 2 ? "text-emerald-300" : result.rr >= 1 ? "text-amber-300" : "text-[color:var(--v2-text-2)]"}
        />
        {result.entryFilled && (
          <>
            <OutcomeTile label={T.drawdown} value={formatPrice(asset, result.maxDrawdown)} valueClass="" />
            <OutcomeTile
              label={T.optimalPlan}
              value={`${result.qualityMatch}/3`}
              valueClass={result.qualityMatch === 3 ? "text-emerald-300" : result.qualityMatch >= 1 ? "text-amber-300" : "text-red-300"}
            />
          </>
        )}
      </div>

      {/* Ton plan vs le plan optimal */}
      <div className="flex flex-col gap-1.5">
        <PlanRow label={T.entryLabel} user={entryLabels[picks.entry]} best={entryLabels[optimal.entry]} match={picks.entry === optimal.entry} />
        <PlanRow label={T.stopLabel}  user={stopLabels[picks.stop]}   best={stopLabels[optimal.stop]}   match={picks.stop  === optimal.stop} />
        <PlanRow label={T.lineTp}     user={tpLabels[picks.tp]}       best={tpLabels[optimal.tp]}       match={picks.tp    === optimal.tp} />
      </div>

      <div className="rounded-[14px] px-4 py-3" style={{ background: "rgba(59,130,246,0.1)", boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.35)" }}>
        <p className="text-[12px] font-bold uppercase tracking-wider text-blue-300">{T.optimalSetup}</p>
        <p className="v2-body mt-1 text-[color:var(--v2-text)]">{optimalExplain}</p>
      </div>

      <div className="v2-well--amber rounded-[14px] px-4 py-3">
        <p className="text-[12px] font-bold uppercase tracking-wider text-amber-300">
          {T.lesson} · {difficultyMeta[difficulty].label}
        </p>
        <p className="v2-body mt-1 text-[color:var(--v2-text)]">{lesson}</p>
      </div>

      {jargon}

      <GeneralCasesNote />

      <div className="flex items-center justify-end pt-1">
        <button onClick={onNext} className="v2-btn">
          {isLast ? T.viewSummary : T.nextScenario}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PlanRow({ label, user, best, match }: { label: string; user: string; best: string; match: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-[12px] px-3.5 py-2"
      style={{ background: match ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", boxShadow: `inset 0 0 0 1px ${match ? "rgba(16,185,129,0.35)" : "var(--v2-edge)"}` }}
    >
      <span className="text-[12px] font-bold uppercase tracking-wider text-[color:var(--v2-text-3)]">{label}</span>
      <div className="flex items-center gap-1.5 text-[14px]">
        <span className={`font-semibold ${match ? "text-emerald-300" : "text-[color:var(--v2-text)]"}`}>{user}</span>
        {!match && (
          <>
            <span className="text-[12px] text-[color:var(--v2-text-3)]">vs</span>
            <span className="font-semibold text-emerald-300">{best}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sub-helpers ─────────────────────────────────────────────────────────────

function OutcomeTile({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="v2-well flex min-h-[64px] flex-col justify-center gap-0.5 px-3 py-2 sm:px-4">
      <span className="leading-tight text-[12px] font-semibold uppercase tracking-wider text-[color:var(--v2-text-3)] [overflow-wrap:anywhere]">{label}</span>
      <span className={`v2-mono text-[clamp(13px,3.6vw,16px)] font-bold leading-tight ${valueClass || "text-[color:var(--v2-text)]"}`}>{value}</span>
    </div>
  );
}

function InfoTile({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="v2-well flex flex-col gap-0.5 px-3 py-2.5 sm:px-4">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-[color:var(--v2-text-3)]">{label}</span>
      <span className={`v2-display v2-tile-value truncate font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="v2-well px-3 py-2.5">
      <p className="mb-1 min-h-[2lh] leading-tight [overflow-wrap:anywhere] sm:min-h-0 text-[12px] font-semibold uppercase tracking-wide text-[color:var(--v2-text-3)]">{label}</p>
      <p className="v2-mono text-[16px] font-bold text-[color:var(--v2-text)]">{value}</p>
    </div>
  );
}

function VolBadge({ volatility, T }: { volatility: "faible" | "normale" | "élevée"; T: { [k: string]: string } }) {
  const label = volatility === "élevée" ? T.volHigh : volatility === "faible" ? T.volLow : T.volNormal;
  return <span className={`v2-chip ${volatility === "élevée" ? "v2-chip--amber" : ""}`}>{T.vol} {label}</span>;
}

function SpreadBadge({ spread, T }: { spread: "faible" | "élevé"; T: { [k: string]: string } }) {
  const label = spread === "élevé" ? T.spreadHigh : T.spreadLow;
  return <span className={`v2-chip ${spread === "élevé" ? "v2-chip--amber" : ""}`}>{T.spread} {label}</span>;
}

function translateVolatility(v: "faible" | "normale" | "élevée", locale: string | undefined): string {
  if (locale === "es") return v === "élevée" ? "alta" : v === "faible" ? "baja" : "normal";
  if (locale === "en") return v === "élevée" ? "high" : v === "faible" ? "low" : "normal";
  return v;
}

function DifficultyChip({ difficulty, difficultyMeta }: { difficulty: Difficulty; difficultyMeta: typeof FrGame.DIFFICULTY_META }) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      <span className={`text-[12px] font-bold uppercase tracking-wide ${meta.textClass}`}>{meta.label}</span>
    </div>
  );
}

function ZoneLegendChip({ zone }: { zone: { kind: string; label: string } }) {
  const color =
    zone.kind === "support"    ? "#10b981"
  : zone.kind === "resistance" ? "#ef4444"
  :                              "#f59e0b";
  return (
    <div className="flex items-center gap-1.5" data-legend={zone.label}>
      <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: color }} />
      <span className="text-[12px] font-medium text-[color:var(--v2-text-2)]">{zone.label}</span>
    </div>
  );
}

function biasClass(b: "bullish" | "bearish" | "range"): string {
  return b === "bullish" ? "text-emerald-300"
       : b === "bearish" ? "text-red-300"
       :                   "";
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
    score >= 180 ? "text-emerald-300"
  : score >= 60  ? "text-amber-300"
  :                "text-red-300";
  const meta = difficultyMeta[difficulty];

  return (
    <main className="v2-page mx-auto flex w-full max-w-3xl flex-col">
      <Link href="/jeux" className="v2-link-back">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {T.games}
      </Link>

      <div className="v2-gap-s flex flex-col">
        <p className="v2-eyebrow">
          {T.summary} · <span className={meta.textClass}>{meta.label}</span>
        </p>
        <h1 className="v2-display v2-h2 font-bold">{ROUNDS_PER_SESSION} {T.setupsBuilt}</h1>
        <p className={`v2-display text-[18px] font-bold ${verdictColor}`}>{verdict}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <BigStat label={T.score}         value={`${score >= 0 ? "+" : ""}${score}`} valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
        <BigStat label={T.perfectSetups} value={`${stats.perfectSetups}/${total}`}  valueClass="text-emerald-400" />
        <BigStat label={T.tpHits}        value={`${stats.tpHits}`}                  valueClass="text-emerald-400" />
        <BigStat label={T.slHits}        value={`${stats.slHits}`}                  valueClass={stats.slHits > 0 ? "text-red-400" : "text-[color:var(--v2-text)]"} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={onReplay} className="v2-btn v2-btn--light flex-1">
          {T.replayIn} {meta.label.toLowerCase()}
        </button>
        <button onClick={onChangeDifficulty} className="v2-btn flex-1">
          {T.changeLevel}
        </button>
      </div>
    </main>
  );
}

function BigStat({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="v2-well px-4 py-3">
      <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--v2-text-3)]">{label}</p>
      <p className={`v2-mono v2-num-l font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
