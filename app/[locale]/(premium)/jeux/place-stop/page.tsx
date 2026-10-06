"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as FrGame from "@/lib/games/place-stop";
import * as EsGame from "@/lib/games/place-stop-es";
import * as EnGame from "@/lib/games/place-stop-en";
import {
  computeHits,
  scoreStopChoice,
  ROUNDS_PER_SESSION,
  type Difficulty,
  type PlaceStopChart,
  type PlaceStopInstance,
  type ScoreResult,
  type StopId,
  type StopOption,
  type StopType,
  type TradeDirection,
} from "@/lib/games/place-stop";
import { GameChartV2, V2_REVEAL_DELAY_MS } from "@/app/components/games/v2/GameChartV2";
import { StepBadge, VerdictOverlay, GeneralCasesNote, JargonHints, useJargon, rrText, type VerdictState } from "@/app/components/games/v2/ui";
import { logGameEvent, type SkillId } from "@/lib/trader-profile";
import { formatPrice } from "@/lib/games/price-scale";
import { firstDefinitionOnly } from "@/lib/games/glossary";
import { sessionLabel, type Asset } from "@/lib/games/shared";

const STOP_TYPE_TO_SKILL: Record<StopType, { skill: SkillId; outcome: "win" | "loss" }> = {
  logical:   { skill: "structure",      outcome: "win"  },
  wide:      { skill: "rr_management",  outcome: "loss" },
  tight:     { skill: "gestion_risque", outcome: "loss" },
  liquidity: { skill: "liquidite",      outcome: "loss" },
};

// ─── Constantes UI ────────────────────────────────────────────────────────────

const BIAS_LABEL_FR  = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const BIAS_LABEL_ES  = { bullish: "Alcista", bearish: "Bajista", range: "Range" } as const;
const BIAS_LABEL_EN  = { bullish: "Bullish", bearish: "Bearish", range: "Range" } as const;
const MACRO_LABEL_FR = { normal: "Normal", dangereux: "Dangereux" } as const;
const MACRO_LABEL_ES = { normal: "Normal", dangereux: "Peligroso" } as const;
const MACRO_LABEL_EN = { normal: "Normal", dangereux: "Dangerous" } as const;
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

// Charte v2 : une bougie future révélée toutes les 420ms (rythme du design-lab)
const REVEAL_STEP_MS = 420;

// Couleurs distinctes pour les 3 stops (rouge / amber / violet)
/** Étiquette de la ligne d'entrée sur le graphique */
const ENTRY_LABEL: Record<string, string> = { fr: "Entrée", es: "Entrada", en: "Entry" };

const STOP_COLORS: Record<StopId, { hex: string; bg: string; border: string; text: string; dot: string }> = {
  A: { hex: "#ef4444", bg: "bg-red-500/10",    border: "border-red-500/40",    text: "text-red-400",    dot: "bg-red-500"    },
  B: { hex: "#f59e0b", bg: "bg-amber-500/10",  border: "border-amber-500/40",  text: "text-amber-400",  dot: "bg-amber-500"  },
  C: { hex: "#a78bfa", bg: "bg-violet-500/10", border: "border-violet-500/40", text: "text-violet-400", dot: "bg-violet-500" },
};

// ─── Helpers anti-spoil ──────────────────────────────────────────────────────
// Labels affichés au joueur = position spatiale (1=haut, 2=milieu, 3=bas)
// au lieu du type interne ou de la lettre A/B/C (qui peut indirectement leaker
// la couleur). Le type interne reste utilisé pour le scoring.

function buildSpatialLabels(stops: readonly StopOption[]): Record<StopId, string> {
  const sorted = [...stops].sort((a, b) => b.price - a.price);  // top→bot
  const result: Record<StopId, string> = { A: "", B: "", C: "" };
  sorted.forEach((s, i) => { result[s.id] = String(i + 1); });
  return result;
}

// Détecte le type correct selon le contexte du scénario : "logical" si présent
// dans le tableau, sinon "wide" (scénarios où le large stop est la bonne réponse).
function isCorrectType(stopType: StopType, hasLogical: boolean): boolean {
  if (hasLogical) return stopType === "logical";
  return stopType === "wide";
}

// Couleur du verdict APRÈS choix (feedback). Inversé pour wide quand c'est
// la bonne réponse.
function feedbackColor(stopType: StopType, hasLogical: boolean): "emerald" | "amber" | "red" {
  if (isCorrectType(stopType, hasLogical)) return "emerald";
  return "red";
}

// Label du verdict APRÈS choix : pédagogique sans révéler la mécanique interne
// (pas "Stop logique" / "Stop trop large" qui leakerait le type).
// `rr` : R/R affiché pour ce stop (arrondi à 0,1 comme sur le bouton) ; un stop trop
// large dont le R/R reste ≥ 1 dégrade le R/R sans le casser.
function feedbackLabel(stopType: StopType, hasLogical: boolean, locale: string | undefined, rr: number | null): string {
  const isEs = locale === "es";
  const isEn = locale === "en";
  if (isCorrectType(stopType, hasLogical)) {
    return isEs ? "Buena colocación" : isEn ? "Good placement" : "Bon placement";
  }
  switch (stopType) {
    case "wide":
      if (rr !== null && rr >= 1) return isEs ? "Demasiado lejos, R/R degradado" : isEn ? "Too far, R/R degraded" : "Trop loin, R/R dégradé";
      return isEs ? "Demasiado lejos, R/R roto" : isEn ? "Too far, R/R broken" : "Trop loin, R/R cassé";
    case "liquidity": return isEs ? "En zona de stop hunt" : isEn ? "In a hunt zone" : "Dans une zone de stop hunt";
    case "tight":     return isEs ? "Demasiado cerca (ruido)" : isEn ? "Too close (noise)" : "Trop près (bruit)";
    case "logical":   return isEs ? "Colocación lógica" : isEn ? "Logical placement" : "Placement logique";  // edge case
  }
}

/** R/R tel qu'affiché sur le bouton du stop (1 décimale), null sans TP. */
function displayedRR(entry: number, tp: number | null, stop: number): number | null {
  return tp !== null ? Number(Math.abs((tp - entry) / (entry - stop)).toFixed(1)) : null;
}

/** État du verdict (barème simple) : bon stop vert, tout autre stop rouge. */
function verdictState(stopType: StopType, hasLogical: boolean): VerdictState {
  return isCorrectType(stopType, hasLogical) ? "good" : "bad";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface SessionStats {
  logical:   number;
  wide:      number;
  tight:     number;
  liquidity: number;
}

const EMPTY_STATS: SessionStats = { logical: 0, wide: 0, tight: 0, liquidity: 0 };

export default function PlaceStopPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale;
  const G = locale === "es" ? EsGame : locale === "en" ? EnGame : FrGame;
  const BIAS_LABEL = locale === "es" ? BIAS_LABEL_ES : locale === "en" ? BIAS_LABEL_EN : BIAS_LABEL_FR;
  // MACRO_LABEL kept for potential future use
  const T = locale === "es"
    ? {
        games:           "Juegos",
        round:           "Ronda",
        score:           "Puntuación",
        ofStreak:        "de racha",
        loading:         "Cargando…",
        htf:             "HTF",
        volatility:      "Volatilidad",
        newsImminent:    "Noticia inminente",
        question:        "¿Qué stop eliges?",
        revelation:      "Revelación",
        revealTextPre:   "Veamos qué stops sobreviven a las",
        revealTextPost:  "próximas velas…",
        viewSummary:     "Ver el resumen",
        nextScenario:    "Siguiente escenario",
        lesson:          "Lección",
        skills:          "Habilidades",
        discipline:      "Disciplina",
        protection:      "Protección",
        precision:       "Precisión",
        aggressivity:    "Agresividad",
        yourChoice:      "Tu elección",
        theRight:        "El correcto",
        survived:        "Sobrevivió a las",
        candles:         "velas",
        hitCandle:       "Tocado en la vela",
        title:           "Coloca tu Stop",
        heading:         "¿Qué stop va a sobrevivir?",
        pickerIntro:     "escenarios. Para cada uno, 3 stop loss propuestos (Stop 1, 2, 3). Eliges el mejor según estructura, liquidity, volatilidad, R/R. El mercado revela después la continuación.",
        summary:         "Resumen",
        stopsChosen:     "stops elegidos",
        logicalStops:    "Stops lógicos",
        tightStops:      "Stops ajustados",
        bestStreak:      "Mejor racha",
        replayIn:        "Volver a jugar en",
        changeLevel:     "Cambiar de nivel",
        macroLabel:      "Macro",
        yourChoicePin:   "· tu elección",
        stepQuestion:    "Pregunta",
        stepChoice:      "Elección hecha",
        stepVerdict:     "Veredicto",
      }
    : locale === "en"
    ? {
        games:           "Games",
        round:           "Round",
        score:           "Score",
        ofStreak:        "streak",
        loading:         "Loading…",
        htf:             "HTF",
        volatility:      "Volatility",
        newsImminent:    "News imminent",
        question:        "Which stop do you choose?",
        revelation:      "Reveal",
        revealTextPre:   "Let's see which stops survive the next",
        revealTextPost:  "candles…",
        viewSummary:     "View summary",
        nextScenario:    "Next scenario",
        lesson:          "Lesson",
        skills:          "Skills",
        discipline:      "Discipline",
        protection:      "Protection",
        precision:       "Precision",
        aggressivity:    "Aggressiveness",
        yourChoice:      "Your choice",
        theRight:        "The right one",
        survived:        "Survived",
        candles:         "candles",
        hitCandle:       "Hit on candle",
        title:           "Place your Stop",
        heading:         "Which stop will survive?",
        pickerIntro:     "scenarios. For each one, 3 stop losses proposed (Stop 1, 2, 3). You pick the best based on structure, liquidity, volatility, R/R. The market then reveals the continuation.",
        summary:         "Summary",
        stopsChosen:     "stops chosen",
        logicalStops:    "Logical stops",
        tightStops:      "Tight stops",
        bestStreak:      "Best streak",
        replayIn:        "Replay in",
        changeLevel:     "Change level",
        macroLabel:      "Macro",
        yourChoicePin:   "· your choice",
        stepQuestion:    "Question",
        stepChoice:      "Choice made",
        stepVerdict:     "Verdict",
      }
    : {
        games:           "Jeux",
        round:           "Round",
        score:           "Score",
        ofStreak:        "de série",
        loading:         "Chargement…",
        htf:             "HTF",
        volatility:      "Volatilité",
        newsImminent:    "News imminente",
        question:        "Quel stop choisis-tu ?",
        revelation:      "Révélation",
        revealTextPre:   "On regarde quels stops survivent aux",
        revealTextPost:  "prochaines bougies…",
        viewSummary:     "Voir le bilan",
        nextScenario:    "Scénario suivant",
        lesson:          "Leçon",
        skills:          "Compétences",
        discipline:      "Discipline",
        protection:      "Protection",
        precision:       "Précision",
        aggressivity:    "Agressivité",
        yourChoice:      "Ton choix",
        theRight:        "Le bon",
        survived:        "A survécu aux",
        candles:         "bougies",
        hitCandle:       "Touché bougie",
        title:           "Place ton Stop",
        heading:         "Quel stop va survivre ?",
        pickerIntro:     "scénarios. Pour chacun, 3 stop loss proposés (Stop 1, 2, 3). Tu choisis le meilleur selon structure, liquidité, volatilité, R/R. Le marché révèle ensuite la suite.",
        summary:         "Bilan",
        stopsChosen:     "stops choisis",
        logicalStops:    "Stops logiques",
        tightStops:      "Stops serrés",
        bestStreak:      "Meilleure série",
        replayIn:        "Rejouer en",
        changeLevel:     "Changer de niveau",
        macroLabel:      "Macro",
        yourChoicePin:   "· ton choix",
        stepQuestion:    "Question",
        stepChoice:      "Choix fait",
        stepVerdict:     "Verdict",
      };
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<PlaceStopInstance[]>([]);
  const [idx, setIdx] = useState(0);
  const jargon = useJargon(locale, seed);
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
    () => (current && difficulty ? G.withAssetPrices(G.buildPlaceStopChart(current.id, current.seed, current.volatility, difficulty, { asset: current.asset, session: current.session }), current) : null),
    [current, difficulty, G],
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

  // Animation reveal : le graphique glisse d'abord vers son cadrage « passé +
  // futur » (V2_REVEAL_DELAY_MS), puis une bougie toutes les 420ms.
  useEffect(() => {
    if (phase !== "revealing" || !chart) return;
    if (revealed >= chart.future.length) {
      animRef.current = setTimeout(() => setPhase("feedback"), 350);
    } else {
      const glide = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : V2_REVEAL_DELAY_MS;
      animRef.current = setTimeout(() => setRevealed((c) => c + 1), revealed === 0 ? glide : REVEAL_STEP_MS);
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

  // Mapping StopId → label spatial "1"/"2"/"3" (top→bot par prix).
  // Décorrélé du shuffle A/B/C pour ne pas leaker le type via la lettre/couleur.
  const spatialLabels = useMemo(
    () => chart ? buildSpatialLabels(chart.stops) : ({ A: "", B: "", C: "" } as Record<StopId, string>),
    [chart],
  );
  const hasLogicalInChart = useMemo(
    () => chart ? chart.stops.some((s) => s.type === "logical") : false,
    [chart],
  );

  // ─── Écran 1 : sélection difficulté ─────────────────────────────────────────
  if (!difficulty || !seed) {
    return <DifficultyPicker locale={locale} difficultyMeta={G.DIFFICULTY_META} onPick={(d) => {
      const s = Math.floor(Math.random() * 1e9) >>> 0;
      setDifficulty(d);
      setSeed(s);
      setScenarios(G.generatePlaceStopScenarios(s, d));
    }} />;
  }

  // ─── Écran 3 : bilan ────────────────────────────────────────────────────────
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
          setScenarios(G.generatePlaceStopScenarios(s, difficulty));
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
      <main className="v2-page flex min-h-[60vh] items-center justify-center">
        <p className="text-[14px] text-[color:var(--v2-text-3)]">{T.loading}</p>
      </main>
    );
  }

  const handleChoose = (id: StopId) => {
    if (phase !== "placing") return;
    const r = scoreStopChoice(id, chart, streak);
    const mapping = STOP_TYPE_TO_SKILL[r.type];
    // outcome basé sur r.correct (qui gère les scénarios où "wide" est la
    // bonne réponse), pas sur le mapping statique du type.
    logGameEvent({
      game:       "place-stop",
      difficulty,
      skill:      mapping.skill,
      outcome:    r.correct ? "win" : "loss",
    });
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
    setRevealed(0); // la 1re bougie future arrive après le glissement du graphique
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
  const step = isPlacing ? 1 : isRevealing ? 2 : 3;
  const stepLabel = isPlacing ? T.stepQuestion : isRevealing ? T.stepChoice : T.stepVerdict;
  const chosenStop = chosen ? chart.stops.find((s) => s.id === chosen) ?? null : null;
  // Textes du round dans l'ordre d'affichage : contexte, justifications (stops du
  // plus haut au plus bas, comme le feedback), leçon. Une définition portée par
  // le texte (ATR) n'apparaît qu'une fois.
  const stopsByPrice = [...chart.stops].sort((a, b) => b.price - a.price);
  const [shownContext, ...shownAfter] = firstDefinitionOnly([
    difficulty === "beginner" ? current.context : (current.shortContext ?? firstSentence(current.context)),
    ...stopsByPrice.map((s) => s.rationale),
    current.lessons[difficulty],
  ], locale);
  const shownLesson = shownAfter[stopsByPrice.length];
  const shownChart = { ...chart, stops: chart.stops.map((s) => ({ ...s, rationale: shownAfter[stopsByPrice.indexOf(s)] })) };

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

        {/* Streak — emplacement toujours réservé : son apparition au clic ne
            doit pas décaler le jeu (c'est l'instant filmé) */}
        <div
          className={`flex h-[18px] items-center justify-center gap-1.5 text-[12px] font-semibold ${streak > 0 ? "" : "invisible"}`}
          aria-hidden={streak === 0}
        >
          <span className="text-amber-300">🔥</span>
          <span className="v2-mono text-amber-300">{streak}</span>
          <span className="text-[color:var(--v2-text-3)]">{T.ofStreak}</span>
        </div>

        {/* Scénario */}
        <section className="v2-card v2-pad v2-gap flex flex-col" aria-labelledby="ps-title">
          <h2 id="ps-title" className="v2-display v2-h2 mx-auto w-full max-w-3xl font-bold">{T.title}</h2>

          <div className="v2-gap-s mx-auto flex w-full max-w-3xl flex-col">
            <StepBadge n={step} label={stepLabel} />

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="v2-display v2-asset mr-1 font-bold">{current.asset}</span>
              <span className={`v2-chip ${current.direction === "BUY" ? "v2-chip--emerald" : "v2-chip--red"}`}>{current.direction}</span>
              <span className="v2-chip">{sessionLabel(current.session, locale)}</span>
              <span className={`v2-chip ${current.volatility === "élevée" ? "v2-chip--amber" : ""}`}>
                {T.volatility} {translateVolatility(current.volatility, locale)}
              </span>
            </div>

            {/* News warning (présent dès la question : aucun saut au clic) */}
            {current.macroContext === "dangereux" && (
              <div className="v2-well v2-well--danger flex items-center gap-2.5 px-3.5 py-2.5">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path d="M7 1L13 12H1L7 1z" stroke="#f87171" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M7 5.5v3M7 10v0.5" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <p className="text-[13px] font-semibold leading-snug text-red-300">{T.newsImminent}</p>
              </div>
            )}

            {/* Graphique : bougies, entrée et 3 stops, chacun étiqueté sur sa ligne
                (4 étiquettes au plus) ; le TP n'est pas tracé : le R/R de chaque
                stop est dans son bouton. Puis impact du stop touché. */}
            <GameChartV2
              data={{ candles: [...chart.past, ...chart.future], zones: [], domain: chart.domain }}
              inlineLabels
              overlay={{
                // Étiquette d'entrée avec son prix (le seul endroit où il apparaît)
                entry: { price: chart.entry, direction: chart.direction, label: `${ENTRY_LABEL[locale ?? "fr"] ?? ENTRY_LABEL.fr} ${fmt(chart.entry, current.asset)}` },
                stops: chart.stops.map((s) => ({
                  price:    s.price,
                  color:    STOP_COLORS[s.id].hex,
                  dashed:   true,
                  hit:      (isFeedback || isRevealing) && hitMapLive[s.id] !== null,
                  selected: chosen === s.id,
                  label:    `Stop ${spatialLabels[s.id]}`,
                })),
                separatorIndex:     chart.past.length,
                visibleFutureCount: isPlacing ? 0 : revealed,
              }}
              mode={isPlacing ? "question" : isRevealing ? "reveal" : "verdict"}
              pin={chosenStop ? { label: `Stop ${spatialLabels[chosenStop.id]}`, sub: T.yourChoicePin, color: STOP_COLORS[chosenStop.id].hex } : undefined}
            >
              {isFeedback && result && (
                <VerdictOverlay
                  state={verdictState(result.type, hasLogicalInChart)}
                  headline={feedbackLabel(result.type, hasLogicalInChart, locale, displayedRR(chart.entry, chart.tp, chart.stops.find((s) => s.id === chosen)!.price))}
                  points={result.points}
                  max={10}
                />
              )}
            </GameChartV2>

            {/* Contexte */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <InfoTile label={T.htf} value={BIAS_LABEL[current.htfBias]} valueClass={biasClass(current.htfBias)} />
              <InfoTile label={T.volatility} value={cap(translateVolatility(current.volatility, locale))} valueClass="" />
            </div>

            <p className="v2-lead text-[color:var(--v2-text-2)]">
              {shownContext}
            </p>

            {/* Question + 3 stops : interactifs, puis figés (le choix reste visible) */}
            <p className="v2-eyebrow">{T.question}</p>
            <StopChoices
              stops={chart.stops}
              entry={chart.entry}
              tp={chart.tp}
              direction={chart.direction}
              spatialLabels={spatialLabels}
              asset={current.asset}
              locale={locale}
              picked={chosen}
              onChoose={isPlacing ? handleChoose : undefined}
            />

            {/* Lexique : jargon expliqué à sa première apparition (débutant, intermédiaire) ;
                « R/R » est affiché dans chaque bouton de stop */}
            <JargonHints locale={locale} brief={difficulty === "advanced"} entries={jargon(`${idx}:q`, [T.htf, shownContext, "R/R"])} />

            {isRevealing && (
              <div className="v2-well px-4 py-3 text-center">
                <p className="v2-eyebrow">{T.revelation}</p>
                <p className="v2-lead mt-1 text-[color:var(--v2-text)]">
                  {T.revealTextPre} {chart.future.length} {T.revealTextPost}
                </p>
              </div>
            )}

            {isFeedback && result && chosen && (
              <Feedback
                T={T}
                result={result}
                chosen={chosen}
                chart={shownChart}
                title={current.title}
                lesson={shownLesson}
                tag={current.tag}
                difficulty={difficulty}
                difficultyMeta={G.DIFFICULTY_META}
                spatialLabels={spatialLabels}
                asset={current.asset}
                hasLogical={hasLogicalInChart}
                locale={locale}
                onNext={handleNext}
                isLast={idx + 1 >= ROUNDS_PER_SESSION}
                jargon={<JargonHints locale={locale} brief={difficulty === "advanced"} entries={jargon(`${idx}:f`, [current.title, ...shownAfter])} />}
              />
            )}
          </div>
        </section>
      </div>

      {/* Stats footer */}
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <p className="v2-eyebrow" style={{ color: "var(--v2-text-3)" }}>{T.skills}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <StatTile label={T.discipline}   value={derivedDiscipline(stats)} />
          <StatTile label={T.protection}   value={derivedProtection(stats)} />
          <StatTile label={T.precision}    value={derivedPrecision(stats)}  />
          <StatTile label={T.aggressivity} value={derivedAggression(stats)} />
        </div>
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
        <p className="v2-eyebrow">{locale === "es" ? "Coloca tu Stop" : locale === "en" ? "Place your Stop" : "Place ton Stop"}</p>
        <h1 className="v2-display v2-h2 font-bold">{locale === "es" ? "¿Qué stop va a sobrevivir?" : locale === "en" ? "Which stop will survive?" : "Quel stop va survivre ?"}</h1>
        <p className="v2-lead text-[color:var(--v2-text-2)]">
          {locale === "es"
            ? `${ROUNDS_PER_SESSION} escenarios. Para cada uno, 3 stop loss propuestos (Stop 1, 2, 3). Eliges el mejor según estructura, liquidity, volatilidad, R/R. El mercado revela después la continuación.`
            : locale === "en"
            ? `${ROUNDS_PER_SESSION} scenarios. For each one, 3 stop losses proposed (Stop 1, 2, 3). You pick the best based on structure, liquidity, volatility, R/R. The market then reveals the continuation.`
            : `${ROUNDS_PER_SESSION} scénarios. Pour chacun, 3 stop loss proposés (Stop 1, 2, 3). Tu choisis le meilleur selon structure, liquidité, volatilité, R/R. Le marché révèle ensuite la suite.`}
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

// ─── Choix des stops (ordre spatial haut → bas, cohérent avec le graphique) ──

function StopChoices({
  stops, entry, tp, spatialLabels, picked, onChoose, asset, locale,
}: {
  asset: Asset;
  locale: string | undefined;
  stops: StopOption[];
  entry: number;
  tp: number | null;
  direction: TradeDirection;
  spatialLabels: Record<StopId, string>;
  picked: StopId | null;
  onChoose?: (id: StopId) => void;
}) {
  const ordered = [...stops].sort((a, b) => b.price - a.price);
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
      {ordered.map((s) => {
        const dist = Math.abs(s.price - entry);
        const rr = tp !== null ? Math.abs((tp - entry) / (entry - s.price)) : null;
        const color = STOP_COLORS[s.id].hex;
        const num = spatialLabels[s.id];
        const state = picked ? (picked === s.id ? "picked" : "faded") : undefined;
        return (
          <button
            key={s.id}
            type="button"
            onClick={onChoose ? () => onChoose(s.id) : undefined}
            disabled={!onChoose}
            aria-label={`Stop ${num}`}
            aria-pressed={picked === s.id}
            data-state={state}
            className={`v2-stop-choice flex items-center gap-3 rounded-[16px] px-3.5 py-2.5 text-left ${onChoose ? "cursor-pointer" : "cursor-default"}`}
            style={{ boxShadow: `inset 0 0 0 2px ${color}`, background: `linear-gradient(180deg, ${color}22, ${color}0d)` }}
          >
            <span className="v2-display grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-[16px] font-bold" style={{ background: color, color: "#04060a" }}>
              {num}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="v2-mono text-[16px] font-bold" style={{ color }}>{fmt(s.price, asset)}</span>
              <span className="flex items-center gap-2 text-[12px]">
                <span className="text-[color:var(--v2-text-3)]">{locale === "es" ? `a ${fmt(dist, asset)} de la entrada` : locale === "en" ? `${fmt(dist, asset)} from entry` : `à ${fmt(dist, asset)} de l'entrée`}</span>
                {rr !== null && rr > 0 && (
                  <span className={`v2-mono font-semibold ${rr >= 2 ? "text-emerald-300" : rr >= 1 ? "text-amber-300" : "text-red-300"}`}>
                    R/R {rrText(rr, locale)}
                  </span>
                )}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Feedback panel ──────────────────────────────────────────────────────────
// Le verdict (titre + points) est affiché en grand sur le graphique ; la carte
// détaille les 3 stops, la leçon et l'accès au scénario suivant.

function Feedback({
  T, result, chosen, chart, title, lesson, tag, difficulty, difficultyMeta, spatialLabels, hasLogical, locale, onNext, isLast, asset, jargon,
}: {
  T:              { [k: string]: string };
  result:         ScoreResult;
  chosen:         StopId;
  chart:          PlaceStopChart;
  title:          string;
  lesson:         string;
  tag:            string;
  difficulty:     Difficulty;
  difficultyMeta: typeof FrGame.DIFFICULTY_META;
  spatialLabels:  Record<StopId, string>;
  hasLogical:     boolean;
  locale:         string | undefined;
  onNext:         () => void;
  isLast:         boolean;
  jargon?:        ReactNode;
  asset:          Asset;
}) {
  const headerColor = feedbackColor(result.type, hasLogical);
  return (
    <div className="v2-well v2-gap-s flex flex-col p-4 sm:p-5">
      <p className="v2-eyebrow" style={{ color: headerColor === "emerald" ? "#34d399" : headerColor === "amber" ? "#fcd34d" : "#f87171" }}>{title}</p>

      {/* Les 3 stops avec leur verdict (le choisi est highlighté) — ordre spatial top→bot */}
      <div className="flex flex-col gap-2">
        {[...chart.stops].sort((a, b) => b.price - a.price).map((s) => (
          <StopVerdictRow
            key={s.id}
            T={T}
            stop={s}
            asset={asset}
            isChosen={chosen === s.id}
            hitIndex={result.hitMap[s.id]}
            futureLength={chart.future.length}
            spatialLabels={spatialLabels}
            hasLogical={hasLogical}
            locale={locale}
            rr={displayedRR(chart.entry, chart.tp, s.price)}
          />
        ))}
      </div>

      {/* Leçon adaptée au niveau */}
      <div className="v2-well--amber rounded-[14px] px-4 py-3">
        <p className="text-[12px] font-bold uppercase tracking-wider text-amber-300">
          {T.lesson} · {difficultyMeta[difficulty].label}
        </p>
        <p className="v2-body mt-1 text-[color:var(--v2-text)]">{lesson}</p>
      </div>

      {jargon}

      <GeneralCasesNote />

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-[12px] font-medium uppercase tracking-wide text-[color:var(--v2-text-3)]">{tag}</span>
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

function StopVerdictRow({
  T, stop, isChosen, hitIndex, futureLength, spatialLabels, hasLogical, locale, asset, rr,
}: {
  asset: Asset;
  rr: number | null;
  T: { [k: string]: string };
  stop: StopOption;
  isChosen: boolean;
  hitIndex: number | null;
  futureLength: number;
  spatialLabels: Record<StopId, string>;
  hasLogical: boolean;
  locale: string | undefined;
}) {
  const color = STOP_COLORS[stop.id].hex;
  const rowColor = feedbackColor(stop.type, hasLogical);
  const rowLabel = feedbackLabel(stop.type, hasLogical, locale, rr);
  const isCorrectAnswer = isCorrectType(stop.type, hasLogical);
  const num = spatialLabels[stop.id];
  const frame = isCorrectAnswer ? "v2-well--good" : isChosen ? "v2-well--bad" : "";
  const survived = hitIndex === null;
  return (
    <div className={`v2-well ${frame} px-3.5 py-3`}>
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className="v2-display grid h-6 w-6 place-items-center rounded-md text-[12px] font-bold" style={{ background: color, color: "#04060a" }}>{num}</span>
        <p className={`v2-display text-[14px] font-bold ${
          rowColor === "emerald" ? "text-emerald-300"
        : rowColor === "amber"   ? "text-amber-300"
        :                          "text-red-300"
        }`}>
          {rowLabel}
        </p>
        <span className="v2-mono text-[12px] text-[color:var(--v2-text-3)]">{fmt(stop.price, asset)}</span>
        {isChosen && (
          <span className="ml-auto text-[12px] font-bold uppercase tracking-wide text-[color:var(--v2-text-2)]">{T.yourChoice}</span>
        )}
        {!isChosen && isCorrectAnswer && (
          <span className="ml-auto text-[12px] font-bold uppercase tracking-wide text-emerald-300">{T.theRight}</span>
        )}
      </div>
      <p className="v2-body text-[color:var(--v2-text)]">{stop.rationale}</p>
      <div className="mt-1.5 flex items-center gap-1.5 text-[12px]">
        {survived ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-300">{T.survived} {futureLength} {T.candles}</span>
          </>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span className="text-orange-300">{T.hitCandle} {hitIndex + 1}</span>
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
  if (d === 0) return "";
  return Math.round((n / d) * 100) + "%";
}
function derivedDiscipline(s: SessionStats): string {
  const t = totalRounds(s);
  if (t === 0) return "";
  return pct(t - s.liquidity, t);
}
function derivedProtection(s: SessionStats): string {
  const t = totalRounds(s);
  if (t === 0) return "";
  return pct(s.logical + s.wide, t);
}
function derivedPrecision(s: SessionStats): string {
  const t = totalRounds(s);
  if (t === 0) return "";
  return pct(s.logical, t);
}
function derivedAggression(s: SessionStats): string {
  const t = totalRounds(s);
  if (t === 0) return "";
  return pct(s.logical + s.tight, t);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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

function DifficultyChip({ difficulty, difficultyMeta }: { difficulty: Difficulty; difficultyMeta: typeof FrGame.DIFFICULTY_META }) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      <span className={`text-[12px] font-bold uppercase tracking-wide ${meta.textClass}`}>{meta.label}</span>
    </div>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

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
  const total = totalRounds(stats);
  const verdict = sessionVerdictFn(score, stats.logical, total);
  const verdictColor =
    score >= 70 ? "text-emerald-300"
  : score >= 30 ? "text-amber-300"
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
        <h1 className="v2-display v2-h2 font-bold">{ROUNDS_PER_SESSION} {T.stopsChosen}</h1>
        <p className={`v2-display text-[18px] font-bold ${verdictColor}`}>{verdict}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <BigStat label={T.score}        value={`${score >= 0 ? "+" : ""}${score}`} valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
        <BigStat label={T.logicalStops} value={`${stats.logical}/${total}`}         valueClass="text-emerald-400" />
        <BigStat label={T.tightStops}   value={`${stats.tight}`}                    valueClass={stats.tight > 0 ? "text-red-400" : "text-[color:var(--v2-text)]"} />
        <BigStat label={T.bestStreak}   value={`${maxStreak}`}                      valueClass="text-amber-300" />
      </div>

      <div className="flex flex-col gap-3">
        <p className="v2-eyebrow" style={{ color: "var(--v2-text-3)" }}>{T.skills}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <BigStat label={T.discipline}   value={derivedDiscipline(stats)} valueClass="text-[color:var(--v2-text)]" />
          <BigStat label={T.protection}   value={derivedProtection(stats)} valueClass="text-[color:var(--v2-text)]" />
          <BigStat label={T.precision}    value={derivedPrecision(stats)}  valueClass="text-[color:var(--v2-text)]" />
          <BigStat label={T.aggressivity} value={derivedAggression(stats)} valueClass="text-[color:var(--v2-text)]" />
        </div>
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function biasClass(b: "bullish" | "bearish" | "range"): string {
  return b === "bullish" ? "text-emerald-300"
       : b === "bearish" ? "text-red-300"
       :                   "";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmt(p: number, asset: Asset): string {
  return formatPrice(asset, p);
}

function translateVolatility(v: "faible" | "normale" | "élevée", locale: string | undefined): string {
  if (locale === "es") return v === "élevée" ? "alta" : v === "faible" ? "baja" : "normal";
  if (locale === "en") return v === "élevée" ? "high" : v === "faible" ? "low" : "normal";
  return v;
}

function firstSentence(text: string): string {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
}
