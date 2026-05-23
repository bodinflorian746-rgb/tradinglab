// Mini-juego "PLACE STOP" — V2 (traducción ES LATAM).
//
// Espejo del módulo FR con strings de cara al usuario traducidas.
// La lógica, los tipos, las semillas y los valores numéricos se reexportan
// del módulo original.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  type Difficulty,
  type TradeDirection,
  type PlaceStopSetupKey,
  type StopType,
  type StopId,
  type StopOption,
  type DifficultyLessons,
  type PlaceStopTemplate,
  type PlaceStopInstance,
  type PlaceStopChart,
  type ScoreResult,
  ROUNDS_PER_SESSION,
  PLACE_STOP_TEMPLATES as FR_TEMPLATES,
  generatePlaceStopScenarios as generatePlaceStopScenariosFr,
  buildPlaceStopChart as buildPlaceStopChartFr,
  computeHits,
  scoreStopChoice,
} from "./place-stop";

// ─── Reexports tipos / utilidades ────────────────────────────────────────────

export type {
  Asset, Session, Volatility, Spread, HtfBias, MacroContext,
  Candle, ChartZone,
  Difficulty,
  TradeDirection,
  PlaceStopSetupKey,
  StopType,
  StopId,
  StopOption,
  DifficultyLessons,
  PlaceStopTemplate,
  PlaceStopInstance,
  PlaceStopChart,
  ScoreResult,
};

export { ROUNDS_PER_SESSION, computeHits, scoreStopChoice };

// ─── Templates ES ─────────────────────────────────────────────────────────────

export const PLACE_STOP_TEMPLATES_ES: PlaceStopTemplate[] = [
  {
    id: "pullback_bull",
    title: "Pullback en tendencia alcista",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tendencia alcista, el precio corrige en la zona de demanda. Entraste al rebote.",
    shortContext: "Pullback BUY en un uptrend.",
    lessons: {
      beginner:     "El stop lógico se coloca DETRÁS del swing low con un margen — jamás dentro (ruido), jamás demasiado lejos (RR arruinado).",
      intermediate: "El ruido del pullback suele retestear el low antes de la continuación. El margen detrás del low protege contra ese sweep clásico.",
      advanced:     "El stop lógico respeta 3 restricciones: detrás del low, fuera del ruido ATR, y preserva un RR >= 2. Es el único que satisface las 3.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "estructura",
  },
  {
    id: "pullback_bear",
    title: "Pullback en tendencia bajista",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tendencia bajista, el precio rebota en una zona de oferta. Entraste en corto.",
    shortContext: "Pullback SELL en un downtrend.",
    lessons: {
      beginner:     "El stop lógico se coloca SOBRE el swing high con margen — jamás debajo, jamás demasiado lejos.",
      intermediate: "El rebote puede retestear su high antes de caer. Pegar el high = stop hunt asegurado.",
      advanced:     "Stop = cubre la mecha del high + margen ATR. Un stop pile en el nivel está atrapado, un stop demasiado lejos mata el RR.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "estructura",
  },
  {
    id: "bounce_support",
    title: "Rebote en soporte mayor",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio acaba de rebotar en un soporte mayor HTF.",
    shortContext: "BUY en soporte HTF.",
    lessons: {
      beginner:     "Stop bajo el soporte con margen realista. Pegado al soporte = recogida de liquidity institucional.",
      intermediate: "El soporte HTF suele atraer un test profundo antes de la reacción real. El margen protege contra ese stop hunt.",
      advanced:     "Distancia óptima = 1.0 a 1.5x ATR bajo el nivel. Más corto = noise, más lejos = capital muerto.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lectura",
  },
  {
    id: "rejection_resistance",
    title: "Rechazo en resistencia mayor",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "El precio acaba de rechazar una resistencia mayor HTF con mechas.",
    shortContext: "SELL en resistencia HTF.",
    lessons: {
      beginner:     "Stop sobre la mecha más alta, con margen. Pegar el nivel = stop hunt asegurado.",
      intermediate: "Los retests de resistencia HTF suelen ser tramposos. Margen detrás de la mecha = obligatorio.",
      advanced:     "La mecha del rechazo + 1 ATR = zona limpia. Pegar la mecha = expuesto al 2do test, demasiado lejos = RR roto.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lectura",
  },
  {
    id: "fakeout_above_resistance",
    title: "Falso breakout — short tras rechazo",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "El precio pinchó sobre la resistencia y luego cerró debajo. Vendes la trampa.",
    shortContext: "SELL tras fakeout.",
    lessons: {
      intermediate: "Stop SOBRE el PICO del fakeout (jamás dentro). El pico es la invalidación real de la trampa.",
      advanced:     "Stop POR ENCIMA del wick high + margen ATR. Pegar el high = retest del fakeout te saca. Dentro de la trampa = -100.",
      beginner:     "El stop debe cubrir la mecha del falso breakout. Cualquier stop colocado en la zona de la trampa = perdido.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "sweep_low_reversal",
    title: "Sweep de liquidity y luego reversión",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio acaba de barrer la liquidity bajo el low previo y luego dio media vuelta.",
    shortContext: "BUY tras sweep low.",
    lessons: {
      intermediate: "Stop bajo el LOW del sweep, jamás en la zona que acaba de ser tomada. El sweep es la nueva invalidación.",
      advanced:     "Stop = bajo la mecha del sweep + margen. Pegado al sweep low = retest probable, dentro de la zona de liquidity = trampa total.",
      beginner:     "El mercado acaba de pinchar una zona — tu stop debe estar BAJO esa zona, no dentro.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "fvg_continuation",
    title: "Reacción en FVG alcista",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Un FVG alcista quedó tras el impulso. El precio lo retestea y empieza a reaccionar.",
    shortContext: "BUY al retest del FVG.",
    lessons: {
      intermediate: "Stop bajo el BOTTOM del FVG. Dentro del FVG = expuesto a un re-test profundo, demasiado lejos = RR frágil.",
      advanced:     "El FVG es la zona de invalidación. Stop = bottom del FVG - 1 ATR. Más ajustado = noise, más lejos = capital muerto.",
      beginner:     "El FVG es tu zona de compra. El stop va BAJO la zona, no dentro.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "lectura",
  },
  {
    id: "high_vol_pullback",
    title: "Pullback en volatilidad elevada",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Pullback en un mercado de volatilidad elevada. Las velas son anchas, los wicks profundos.",
    shortContext: "BUY pullback, vol elevada.",
    lessons: {
      advanced:     "En vol elevada, el stop 'normal' se vuelve demasiado ajustado. El margen debe duplicarse — lo que parece un wide stop en realidad es el LÓGICO aquí.",
      intermediate: "La volatilidad amplía el ruido normal. Un stop 'estándar' probablemente está demasiado ajustado.",
      beginner:     "Cuanto más se mueve el mercado, más amplio debe ser tu stop para respirar.",
    },
    difficulties: ["advanced"],
    tag: "volatilidad",
  },
];

// Alias canónico para que la página pueda importar PLACE_STOP_TEMPLATES igual que en FR.
export const PLACE_STOP_TEMPLATES = PLACE_STOP_TEMPLATES_ES;

// ─── Tabla de traducción para etiquetas de zonas ─────────────────────────────

const ZONE_LABEL_ES: Record<string, string> = {
  "Résistance":           "Resistencia",
  "Support":              "Soporte",
  "Résistance HTF":       "Resistencia HTF",
  "Support HTF":          "Soporte HTF",
  "Swing high":           "Swing high",
  "Swing low":            "Swing low",
  "Précédent low":        "Low previo",
  "Précédent high":       "High previo",
  "Liquidité balayée":    "Liquidez barrida",
  "FVG haussier":         "FVG alcista",
  "Wick fakeout":         "Wick del fakeout",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_ES[z.label] ?? z.label }));
}

// ─── Tabla de traducción de rationales ───────────────────────────────────────
// Las rationales se incrustan en el chart (no en los templates). Las del módulo
// FR son strings fijos; las traducimos por mapping de exact-match.

const TIGHT_RATIONALE_FR = "✗ Trop serré — placé dans le bruit normal du marché. La 1re mèche de retest va le balayer avant que le trade aboutisse. C'est l'erreur retail classique.";
const LOGICAL_RATIONALE_FR = "✓ Placement logique — derrière la vraie invalidation, avec une marge anti-bruit. Survit aux retests, capture la cassure structurelle si elle arrive.";
const WIDE_RATIONALE_FR = "≈ Survit, mais détruit le RR. Distance trop grande = capital mal utilisé, ratio risque/rendement souvent < 1.";

const FAKEOUT_TIGHT_FR   = "✗ Stop dans la zone du piège — pile dans la zone que les institutionnels viennent d'utiliser pour ramasser la liquidité. Le 2e test va te balayer.";
const FAKEOUT_LOGICAL_FR = "✓ Au-dessus du pic du fakeout, avec marge. C'est la VRAIE invalidation du piège — si le prix repasse là, le scénario est cassé.";

const SWEEP_TIGHT_FR   = "✗ Stop DANS la zone du sweep — exactement là où les institutionnels viennent de ramasser la liquidité. Le retest va te chercher.";
const SWEEP_LOGICAL_FR = "✓ Sous la mèche du sweep, avec marge. Le low du sweep est la nouvelle invalidation — protégé contre un 2e ramassage.";

const FVG_TIGHT_FR   = "✗ Stop DANS le FVG — la zone est précisément celle où le marché peut retourner pour finir sa mitigation. Tu seras pris dans la profondeur de la zone.";
const FVG_LOGICAL_FR = "✓ Sous le bas du FVG avec marge. Le FVG entièrement traversé = invalidation propre. C'est le placement structurel correct.";

const HIGHVOL_TIGHT_FR   = "✗ Stop 'standard' — qui serait OK en vol normale, mais en vol élevée ce niveau est dans le bruit. La 1re bougie de retest, large à cause de la vol, va te balayer.";
const HIGHVOL_LOGICAL_FR = "✓ Stop élargi à la volatilité du marché. Ce qui ressemble à un 'wide stop' en vol normale est en fait le LOGIQUE ici — il survit au noise amplifié sans tuer le RR (TP également plus loin).";
const HIGHVOL_WIDE_FR    = "≈ Survie garantie, mais même avec un TP étendu en vol élevée, le RR descend sous 1.5. Capital mal utilisé.";

const RATIONALE_ES: Record<string, string> = {
  [TIGHT_RATIONALE_FR]:   "✗ Demasiado ajustado — colocado en el ruido normal del mercado. La 1ra mecha de retest lo va a barrer antes de que el trade prospere. Es el error retail clásico.",
  [LOGICAL_RATIONALE_FR]: "✓ Colocación lógica — detrás de la verdadera invalidación, con un margen anti-ruido. Sobrevive a los retests, captura la ruptura estructural si llega.",
  [WIDE_RATIONALE_FR]:    "≈ Sobrevive, pero destruye el RR. Distancia demasiado grande = capital mal utilizado, ratio riesgo/recompensa a menudo < 1.",
  [FAKEOUT_TIGHT_FR]:     "✗ Stop en la zona de la trampa — pile en la zona que los institucionales acaban de usar para recoger la liquidity. El 2do test te va a barrer.",
  [FAKEOUT_LOGICAL_FR]:   "✓ Sobre el pico del fakeout, con margen. Es la VERDADERA invalidación de la trampa — si el precio vuelve a pasar por ahí, el escenario está roto.",
  [SWEEP_TIGHT_FR]:       "✗ Stop DENTRO de la zona del sweep — exactamente donde los institucionales acaban de recoger la liquidity. El retest te va a buscar.",
  [SWEEP_LOGICAL_FR]:     "✓ Bajo la mecha del sweep, con margen. El low del sweep es la nueva invalidación — protegido contra una 2da recogida.",
  [FVG_TIGHT_FR]:         "✗ Stop DENTRO del FVG — la zona es precisamente la que el mercado puede regresar para terminar su mitigation. Quedarás atrapado en la profundidad de la zona.",
  [FVG_LOGICAL_FR]:       "✓ Bajo el bottom del FVG con margen. El FVG totalmente atravesado = invalidación limpia. Es la colocación estructural correcta.",
  [HIGHVOL_TIGHT_FR]:     "✗ Stop 'estándar' — que estaría OK en vol normal, pero en vol elevada este nivel está dentro del ruido. La 1ra vela de retest, amplia por la vol, te va a barrer.",
  [HIGHVOL_LOGICAL_FR]:   "✓ Stop ampliado a la volatilidad del mercado. Lo que parece un 'wide stop' en vol normal en realidad es el LÓGICO aquí — sobrevive al noise amplificado sin matar el RR (TP también más lejos).",
  [HIGHVOL_WIDE_FR]:      "≈ Supervivencia garantizada, pero incluso con un TP extendido en vol elevada, el RR baja debajo de 1.5. Capital mal utilizado.",
};

function translateRationale(fr: string): string {
  return RATIONALE_ES[fr] ?? fr;
}

function translateStops(stops: StopOption[]): StopOption[] {
  return stops.map((s) => ({ ...s, rationale: translateRationale(s.rationale) }));
}

// Wrapper de buildPlaceStopChart que traduce las etiquetas de zonas y rationales.
export function buildPlaceStopChart(
  setup: PlaceStopSetupKey,
  seed: number,
  volatility: Volatility,
  difficulty: Difficulty,
): PlaceStopChart {
  const chart = buildPlaceStopChartFr(setup, seed, volatility, difficulty);
  return {
    ...chart,
    zones: translateZones(chart.zones),
    stops: translateStops(chart.stops),
  };
}

// ─── generatePlaceStopScenarios ES ───────────────────────────────────────────
// Re-uso de la lógica FR pero remapeando los campos de texto al template ES por id.

export function generatePlaceStopScenarios(seed: number, difficulty: Difficulty = "intermediate"): PlaceStopInstance[] {
  const frInstances = generatePlaceStopScenariosFr(seed, difficulty);
  return frInstances.map((inst) => {
    const esTpl = PLACE_STOP_TEMPLATES_ES.find((t) => t.id === inst.id);
    if (!esTpl) return inst;
    return {
      ...esTpl,
      asset:      inst.asset,
      session:    inst.session,
      volatility: inst.volatility,
      spread:     inst.spread,
      seed:       inst.seed,
      difficulty: inst.difficulty,
    };
  });
}

// ─── Verdicts ES ─────────────────────────────────────────────────────────────

export const STOP_TYPE_META: Record<StopType, { label: string; color: "emerald" | "amber" | "red" }> = {
  logical:   { label: "Stop lógico",            color: "emerald" },
  wide:      { label: "Stop demasiado amplio",  color: "amber"   },
  tight:     { label: "Stop demasiado ajustado", color: "red"    },
  liquidity: { label: "Stop en liquidity",      color: "red"     },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Principiante",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Estructura clara, stop lógico evidente, sweep muy visible.",
  },
  intermediate: {
    label:       "Intermedio",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Volatilidad más sucia, varios stops plausibles, tight stop tentador.",
  },
  advanced: {
    label:       "Avanzado",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Mercado ambiguo, sweep parcial, arbitraje supervivencia / invalidación / RR.",
  },
};

export function sessionVerdict(score: number, logicalCount: number, total: number): string {
  if (logicalCount >= total - 1) return "Stop sniper";
  if (score >= 700)              return "Buena protección";
  if (score >= 300)              return "Lectura sólida";
  if (score >= 0)                return "Por pulir";
  if (score >= -200)             return "Demasiado emocional";
  return "Le das tu SL al mercado";
}

// Re-export FR para comparar si fuese necesario.
export { FR_TEMPLATES as PLACE_STOP_TEMPLATES_FR };
