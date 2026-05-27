"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as FrGame from "@/lib/games/place-stop";
import * as EsGame from "@/lib/games/place-stop-es";
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
import { MiniChart } from "@/app/components/games/MiniChart";
import { logGameEvent, type SkillId } from "@/lib/trader-profile";

const STOP_TYPE_TO_SKILL: Record<StopType, { skill: SkillId; outcome: "win" | "loss" }> = {
  logical:   { skill: "structure",      outcome: "win"  },
  wide:      { skill: "rr_management",  outcome: "loss" },
  tight:     { skill: "gestion_risque", outcome: "loss" },
  liquidity: { skill: "liquidite",      outcome: "loss" },
};

// ─── Constantes UI ────────────────────────────────────────────────────────────

const BIAS_LABEL_FR  = { bullish: "Haussier", bearish: "Baissier", range: "Range" } as const;
const BIAS_LABEL_ES  = { bullish: "Alcista", bearish: "Bajista", range: "Range" } as const;
const MACRO_LABEL_FR = { normal: "Normal", dangereux: "Dangereux" } as const;
const MACRO_LABEL_ES = { normal: "Normal", dangereux: "Peligroso" } as const;
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

// Couleurs distinctes pour les 3 stops (rouge / amber / violet)
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
  if (stopType === "wide") return "amber";  // classique : survit mais RR cassé
  return "red";
}

// Label du verdict APRÈS choix : pédagogique sans révéler la mécanique interne
// (pas "Stop logique" / "Stop trop large" qui leakerait le type).
function feedbackLabel(stopType: StopType, hasLogical: boolean, isEs: boolean): string {
  if (isCorrectType(stopType, hasLogical)) {
    return isEs ? "Buena colocación" : "Bon placement";
  }
  switch (stopType) {
    case "wide":      return isEs ? "Demasiado lejos, RR roto" : "Trop loin, RR cassé";
    case "liquidity": return isEs ? "En zona de caza" : "Dans une zone de chasse";
    case "tight":     return isEs ? "Demasiado cerca (ruido)" : "Trop près (bruit)";
    case "logical":   return isEs ? "Colocación lógica" : "Placement logique";  // edge case
  }
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
  const G = locale === "es" ? EsGame : FrGame;
  const isEs = locale === "es";
  const BIAS_LABEL = isEs ? BIAS_LABEL_ES : BIAS_LABEL_FR;
  // MACRO_LABEL kept for potential future use
  const T = isEs
    ? {
        games:           "Juegos",
        round:           "Ronda",
        score:           "Puntuación",
        ofStreak:        "de racha",
        bonusActive:     "· bono activo",
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
        pickerIntro:     "escenarios. Para cada uno, 3 stops loss propuestos (Stop 1, 2, 3). Eliges el mejor según estructura, liquidez, volatilidad, RR. El mercado revela después la continuación.",
        summary:         "Resumen",
        stopsChosen:     "stops elegidos",
        logicalStops:    "Stops lógicos",
        tightStops:      "Stops ajustados",
        bestStreak:      "Mejor racha",
        replayIn:        "Volver a jugar en",
        changeLevel:     "Cambiar de nivel",
        macroLabel:      "Macro",
      }
    : {
        games:           "Jeux",
        round:           "Round",
        score:           "Score",
        ofStreak:        "de série",
        bonusActive:     "· bonus actif",
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
        pickerIntro:     "scénarios. Pour chacun, 3 stops loss proposés (Stop 1, 2, 3). Tu choisis le meilleur selon structure, liquidité, volatilité, RR. Le marché révèle ensuite la suite.",
        summary:         "Bilan",
        stopsChosen:     "stops choisis",
        logicalStops:    "Stops logiques",
        tightStops:      "Stops serrés",
        bestStreak:      "Meilleure série",
        replayIn:        "Rejouer en",
        changeLevel:     "Changer de niveau",
        macroLabel:      "Macro",
      };
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
    () => (current && difficulty ? G.buildPlaceStopChart(current.id, current.seed, current.volatility, difficulty) : null),
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
    return <DifficultyPicker isEs={isEs} difficultyMeta={G.DIFFICULTY_META} onPick={(d) => {
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
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">{T.loading}</p>
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
            {T.games}
          </Link>
          <div className="flex items-center gap-3 text-[11px]">
            <DifficultyChip difficulty={difficulty} difficultyMeta={G.DIFFICULTY_META} />
            <div className="w-px h-3 bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 uppercase tracking-wide">{T.round}</span>
              <span className="font-bold text-white tabular-nums">{idx + 1}/{ROUNDS_PER_SESSION}</span>
            </div>
            <div className="w-px h-3 bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 uppercase tracking-wide">{T.score}</span>
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
            <span className="text-zinc-500">{T.ofStreak}</span>
            {streak >= 3 && <span className="text-amber-400">{T.bonusActive}</span>}
          </div>
        )}

        {/* Scenario card — version minimaliste : focus sur les stops */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden mb-5">

          {/* Header ultra-simple : asset + direction */}
          <div className="px-4 pt-3 pb-2 border-b border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tabular-nums">{current.asset}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className={`text-[11px] font-bold uppercase tracking-wide ${
                current.direction === "BUY" ? "text-emerald-400" : "text-red-400"
              }`}>
                {current.direction}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">{current.session}</span>
          </div>

          {/* Chart minimaliste : bougies + 3 stops (avec tags A/B/C) + entry/TP discrets */}
          <div className="p-3 sm:p-4">
            <MiniChart
              data={{
                candles: [...chart.past, ...chart.future],
                zones:   [], // V3 minimaliste : zones HTF/support/liquidité retirées du chart
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
                  label:    spatialLabels[s.id],  // V4 : tag spatial "1"/"2"/"3" (top→bot)
                })),
                separatorIndex:     chart.past.length,
                visibleFutureCount: isPlacing ? 0 : revealed,
                dimEntryTp:         true,  // entry/TP discrets pour focus sur stops
              }}
              height={180}
            />
          </div>

          {/* Strip contexte ultra-compact : 3 infos essentielles */}
          <div className="px-4 pb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] border-t border-zinc-800/40 pt-2.5">
            <span className="text-zinc-500">
              {T.htf} <span className={`font-bold ml-1 ${biasClass(current.htfBias)}`}>{BIAS_LABEL[current.htfBias]}</span>
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500">
              {T.volatility} <span className="font-bold ml-1 text-zinc-300">{cap(translateVolatility(current.volatility, isEs))}</span>
            </span>
            {current.macroContext === "dangereux" && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L13 12H1L7 1z" stroke="#ef4444" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M7 5.5v3M7 10v0.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  {T.newsImminent}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Question + 3 cards de choix */}
        {isPlacing && (
          <ChoiceCards
            T={T}
            stops={chart.stops}
            entry={chart.entry}
            tp={chart.tp}
            direction={chart.direction}
            spatialLabels={spatialLabels}
            onChoose={handleChoose}
          />
        )}

        {isRevealing && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-5 text-center">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              {T.revelation}
            </p>
            <p className="text-sm text-zinc-300">
              {T.revealTextPre} {chart.future.length} {T.revealTextPost}
            </p>
          </div>
        )}

        {isFeedback && result && chosen && (
          <Feedback
            T={T}
            result={result}
            chosen={chosen}
            chart={chart}
            title={current.title}
            lesson={current.lessons[difficulty]}
            tag={current.tag}
            difficulty={difficulty}
            difficultyMeta={G.DIFFICULTY_META}
            spatialLabels={spatialLabels}
            hasLogical={hasLogicalInChart}
            isEs={isEs}
            onNext={handleNext}
            isLast={idx + 1 >= ROUNDS_PER_SESSION}
          />
        )}

        {/* Stats footer */}
        <div className="mt-6 pt-5 border-t border-zinc-800/60">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
            {T.skills}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatTile label={T.discipline}   value={derivedDiscipline(stats)} />
            <StatTile label={T.protection}   value={derivedProtection(stats)} />
            <StatTile label={T.precision}    value={derivedPrecision(stats)}  />
            <StatTile label={T.aggressivity} value={derivedAggression(stats)} />
          </div>
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
        <Link
          href="/jeux"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white mb-8"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6.5H2M5 3.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isEs ? "Juegos" : "Jeux"}
        </Link>

        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          {isEs ? "Coloca tu Stop" : "Place ton Stop"}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{isEs ? "¿Qué stop va a sobrevivir?" : "Quel stop va survivre ?"}</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {isEs
            ? `${ROUNDS_PER_SESSION} escenarios. Para cada uno, 3 stops loss propuestos (Stop 1, 2, 3). Eliges el mejor según estructura, liquidez, volatilidad, RR. El mercado revela después la continuación.`
            : `${ROUNDS_PER_SESSION} scénarios. Pour chacun, 3 stops loss proposés (Stop 1, 2, 3). Tu choisis le meilleur selon structure, liquidité, volatilité, RR. Le marché révèle ensuite la suite.`}
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

// ─── Choice cards (3 stops A/B/C) ─────────────────────────────────────────────

function ChoiceCards({
  T, stops, entry, tp, direction, spatialLabels, onChoose,
}: {
  T: { [k: string]: string };
  stops: StopOption[];
  entry: number;
  tp: number | null;
  direction: TradeDirection;
  spatialLabels: Record<StopId, string>;
  onChoose: (id: StopId) => void;
}) {
  // Ordre d'affichage = ordre spatial top→bot (cohérent avec le chart).
  const ordered = [...stops].sort((a, b) => b.price - a.price);
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-4 pt-3.5 pb-2 border-b border-zinc-800/60">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          {T.question}
        </p>
      </div>
      <div className="p-3 sm:p-4 grid grid-cols-1 gap-2.5">
        {ordered.map((s) => {
          const dist = Math.abs(s.price - entry);
          const rr = tp !== null ? Math.abs((tp - entry) / (entry - s.price)) : null;
          const colors = STOP_COLORS[s.id];
          const num = spatialLabels[s.id];
          return (
            <button
              key={s.id}
              onClick={() => onChoose(s.id)}
              aria-label={`Stop ${num}`}
              className={`text-left flex items-center gap-3 sm:gap-4 ${colors.bg} ${colors.border} border-2 hover:brightness-110 active:scale-[0.99] rounded-xl px-4 py-3 sm:py-3.5 transition-all`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg} border ${colors.border}`}>
                <span className={`text-base font-black ${colors.text}`}>{num}</span>
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
  T, result, chosen, chart, title, lesson, tag, difficulty, difficultyMeta, spatialLabels, hasLogical, isEs, onNext, isLast,
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
  isEs:           boolean;
  onNext:         () => void;
  isLast:         boolean;
}) {
  const headerColor = feedbackColor(result.type, hasLogical);
  const headerLabel = feedbackLabel(result.type, hasLogical, isEs);
  const borderClass =
    headerColor === "emerald" ? "border-emerald-500/30"
  : headerColor === "amber"   ? "border-amber-500/30"
  :                             "border-red-500/30";
  const bgClass =
    headerColor === "emerald" ? "bg-emerald-500/8"
  : headerColor === "amber"   ? "bg-amber-500/8"
  :                             "bg-red-500/8";
  const textClass =
    headerColor === "emerald" ? "text-emerald-400"
  : headerColor === "amber"   ? "text-amber-400"
  :                             "text-red-400";

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
              <circle cx="9" cy="9" r="8" stroke={headerColor === "amber" ? "#f59e0b" : "#ef4444"} strokeWidth="1.5" />
              <path d="M6 6l6 6M12 6l-6 6" stroke={headerColor === "amber" ? "#f59e0b" : "#ef4444"} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          <p className={`text-sm font-bold ${textClass} truncate`}>
            {headerLabel}
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

        {/* Les 3 stops avec leur verdict (le choisi est highlighté) — ordre spatial top→bot */}
        <div className="space-y-2 mb-4">
          {[...chart.stops].sort((a, b) => b.price - a.price).map((s) => (
            <StopVerdictRow
              key={s.id}
              T={T}
              stop={s}
              isChosen={chosen === s.id}
              hitIndex={result.hitMap[s.id]}
              futureLength={chart.future.length}
              spatialLabels={spatialLabels}
              hasLogical={hasLogical}
              isEs={isEs}
            />
          ))}
        </div>

        {/* Leçon adaptée au niveau */}
        <div className="bg-blue-500/8 border border-blue-500/25 rounded-lg px-3 py-2.5 mb-3">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-1">
            {T.lesson} · {difficultyMeta[difficulty].label}
          </p>
          <p className="text-[13px] text-zinc-200 leading-relaxed">{lesson}</p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">{tag}</span>
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
    </div>
  );
}

function StopVerdictRow({
  T, stop, isChosen, hitIndex, futureLength, spatialLabels, hasLogical, isEs,
}: {
  T: { [k: string]: string };
  stop: StopOption;
  isChosen: boolean;
  hitIndex: number | null;
  futureLength: number;
  spatialLabels: Record<StopId, string>;
  hasLogical: boolean;
  isEs: boolean;
}) {
  const colors = STOP_COLORS[stop.id];
  const rowColor = feedbackColor(stop.type, hasLogical);
  const rowLabel = feedbackLabel(stop.type, hasLogical, isEs);
  const isCorrectAnswer = isCorrectType(stop.type, hasLogical);
  const num = spatialLabels[stop.id];
  const border =
    isChosen ? colors.border
  : rowColor === "emerald" ? "border-emerald-500/30"
  : "border-zinc-800";
  const survived = hitIndex === null;
  return (
    <div className={`border rounded-lg px-3 py-2.5 bg-zinc-950/40 ${border}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-6 h-6 rounded-md flex items-center justify-center ${colors.bg} border ${colors.border}`}>
          <span className={`text-[11px] font-black ${colors.text}`}>{num}</span>
        </span>
        <p className={`text-[11px] font-bold uppercase tracking-widest ${
          rowColor === "emerald" ? "text-emerald-400"
        : rowColor === "amber"   ? "text-amber-400"
        :                          "text-red-400"
        }`}>
          {rowLabel}
        </p>
        <span className="text-[10px] text-zinc-600 tabular-nums">{fmt(stop.price)}</span>
        {isChosen && (
          <span className="ml-auto text-[10px] text-zinc-400 font-bold uppercase tracking-wide">{T.yourChoice}</span>
        )}
        {!isChosen && isCorrectAnswer && (
          <span className="ml-auto text-[10px] text-emerald-400 font-bold uppercase tracking-wide">{T.theRight}</span>
        )}
      </div>
      <p className="text-[12px] text-zinc-300 leading-relaxed">{stop.rationale}</p>
      <div className="mt-1.5 text-[10px] flex items-center gap-1.5">
        {survived ? (
          <>
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-emerald-400">{T.survived} {futureLength} {T.candles}</span>
          </>
        ) : (
          <>
            <span className="w-1 h-1 rounded-full bg-red-500" />
            <span className="text-red-400">{T.hitCandle} {hitIndex + 1}</span>
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

function DifficultyChip({ difficulty, difficultyMeta }: { difficulty: Difficulty; difficultyMeta: typeof FrGame.DIFFICULTY_META }) {
  const meta = difficultyMeta[difficulty];
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
    score >= 700 ? "text-emerald-400"
  : score >= 0   ? "text-amber-400"
  :                "text-red-400";
  const meta = difficultyMeta[difficulty];

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
          {T.games}
        </Link>

        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          {T.summary} · <span className={meta.textClass}>{meta.label}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{ROUNDS_PER_SESSION} {T.stopsChosen}</h1>
        <p className={`text-sm font-semibold ${verdictColor} mb-7`}>{verdict}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <BigStat label={T.score}        value={`${score >= 0 ? "+" : ""}${score}`}    valueClass={score < 0 ? "text-red-400" : "text-emerald-400"} />
          <BigStat label={T.logicalStops} value={`${stats.logical}/${total}`}            valueClass="text-emerald-400" />
          <BigStat label={T.tightStops}   value={`${stats.tight}`}                       valueClass={stats.tight > 0 ? "text-red-400" : "text-zinc-300"} />
          <BigStat label={T.bestStreak}   value={`${maxStreak}`}                         valueClass="text-amber-400" />
        </div>

        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          {T.skills}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <SkillCard label={T.discipline}   value={derivedDiscipline(stats)} />
          <SkillCard label={T.protection}   value={derivedProtection(stats)} />
          <SkillCard label={T.precision}    value={derivedPrecision(stats)}  />
          <SkillCard label={T.aggressivity} value={derivedAggression(stats)} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReplay}
            className="flex-1 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-colors"
          >
            {T.replayIn} {meta.label.toLowerCase()}
          </button>
          <button
            onClick={onChangeDifficulty}
            className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 transition-colors"
          >
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

function translateVolatility(v: "faible" | "normale" | "élevée", isEs: boolean): string {
  if (!isEs) return v;
  return v === "élevée" ? "alta" : v === "faible" ? "baja" : "normal";
}

function firstSentence(text: string): string {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
}
