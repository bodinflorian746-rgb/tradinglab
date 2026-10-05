// Mini-juego "BUILD THE TRADE" — V2 (traducción ES LATAM).
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
  type EntryType,
  type StopType,
  type TpType,
  type ChartShape,
  type DifficultyLessons,
  type BuildTradeTemplate,
  type BuildTradeInstance,
  type BuildTradeChart,
  type ChoiceSet,
  type Outcome,
  type BuildTradeResult,
  ROUNDS_PER_SESSION,
  BUILD_TRADE_TEMPLATES as FR_TEMPLATES,
  generateBuildTradeScenarios as generateBuildTradeScenariosFr,
  buildBuildTradeChart as buildBuildTradeChartFr,
  evaluateTrade,
} from "./build-the-trade";
import type { MarketCtx } from "./candle-realism";
export { withAssetPrices } from "./build-the-trade";

// ─── Reexports tipos / utilidades ────────────────────────────────────────────

export type {
  Asset, Session, Volatility, Spread, HtfBias, MacroContext,
  Candle, ChartZone,
  Difficulty,
  TradeDirection,
  EntryType,
  StopType,
  TpType,
  ChartShape,
  DifficultyLessons,
  BuildTradeTemplate,
  BuildTradeInstance,
  BuildTradeChart,
  ChoiceSet,
  Outcome,
  BuildTradeResult,
};

export { ROUNDS_PER_SESSION, evaluateTrade };

// ─── Tabla de traducción para etiquetas de zonas ─────────────────────────────

const ZONE_LABEL_ES: Record<string, string> = {
  "Swing low":          "Swing low",
  "Swing high":         "Swing high",
  "Résistance":         "Resistencia",
  "Support":            "Soporte",
  "Résistance HTF":     "Resistencia HTF",
  "Support HTF":        "Soporte HTF",
  "Résistance cassée":  "Resistencia rota",
  "Support cassé":      "Soporte roto",
  "Haut du range":      "Techo del rango",
  "Bas du range":     "Piso del rango",
  "Mèche du fakeout":       "Mecha del fakeout",
  "Dernier creux":      "Último mínimo",
  "Dernier sommet":     "Último máximo",
  "Liquidité balayée":  "Liquidity barrida",
  "FVG haussier":       "FVG alcista",
  "Niveau secondaire":  "Nivel secundario",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_ES[z.label] ?? z.label }));
}

// Wrapper de buildBuildTradeChart que traduce las etiquetas de zonas.
export function buildBuildTradeChart(template: BuildTradeTemplate, seed: number, vol: Volatility, ctx: MarketCtx = {}): BuildTradeChart {
  const chart = buildBuildTradeChartFr(template, seed, vol, ctx);
  return { ...chart, zones: translateZones(chart.zones) };
}

// ─── Etiquetas ES ─────────────────────────────────────────────────────────────

export const ENTRY_LABELS: Record<EntryType, string> = {
  aggressive:    "Agresiva",
  confirmation:  "Confirmación",
  deep_pullback: "Pullback profundo",
};
export const STOP_LABELS: Record<StopType, string> = {
  tight:   "Ajustado",
  logical: "Lógico",
  wide:    "Amplio",
};
export const TP_LABELS: Record<TpType, string> = {
  fast:      "Rápido",
  balanced:  "Equilibrado",
  ambitious: "Ambicioso",
};

// ─── Templates ES ─────────────────────────────────────────────────────────────

export const BUILD_TRADE_TEMPLATES_ES: BuildTradeTemplate[] = [
  {
    id: "trend_continuation_bull",
    title: "Continuación de tendencia alcista",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tendencia alcista nítida. El precio acaba de terminar un pullback.",
    optimal: { entry: "deep_pullback", stop: "logical", tp: "ambitious" },
    optimalExplain: "Aquí, la tendencia HTF es clara: buscar el mejor precio (pullback profundo) tiene sentido, con un stop detrás de la estructura y un objetivo amplio en el sentido del momentum.",
    lessons: {
      beginner:     "En un setup en el sentido del HTF, buscar el mejor precio y apuntar amplio es una opción lógica. Aquí, la paciencia puede dar frutos.",
      intermediate: "El pullback profundo suele mejorar el R/R. Combinado con un stop detrás de la estructura, ofrece aquí la mejor ventaja.",
      advanced:     "Una continuación de tendencia alineada con el HTF puede ofrecer un setup de alta probabilidad, con un R/R de 1:3 o más. El tamaño se decide según tu plan de risk management; un TP ambicioso se justifica aquí por el momentum probable.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "trend_continuation_bear",
    title: "Continuación de tendencia bajista",
    chartShape: "downtrend_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tendencia bajista nítida. El precio acaba de terminar un rebote.",
    optimal: { entry: "deep_pullback", stop: "logical", tp: "ambitious" },
    optimalExplain: "Aquí, con un HTF bajista y un rebote que se agota, una entrada al mejor precio tiene sentido, con un stop sobre el swing high y un TP ambicioso en el sentido del momentum.",
    lessons: {
      beginner:     "Tendencia bajista y rebote que se agota: un SELL sigue siendo coherente con el escenario, si encaja con tu plan, al mejor precio posible con un TP amplio.",
      intermediate: "Aquí, el rebote profundo suele dar el mejor R/R. Un stop sobre la estructura permite absorber el ruido.",
      advanced:     "Es el simétrico de la continuación alcista. Un R/R de 1:3 o más sigue siendo aquí un objetivo lógico.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "breakout_bull_clean",
    title: "Breakout alcista limpio",
    chartShape: "breakout_up",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio acaba de romper una resistencia HTF con una vela impulsiva.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "Aquí, el breakout alineado con el HTF puede señalar un momentum inmediato. Esperar un pullback profundo puede hacerte perder el movimiento. Una entrada agresiva, un stop bajo el nivel roto y un TP ambicioso forman una opción lógica.",
    lessons: {
      beginner:     "En un breakout alineado con el HTF, la ventana de entrada suele ser corta: el mercado no espera al rezagado. Depende de ti juzgar, según tu plan, si entras.",
      intermediate: "En un breakout fuerte, esperar un pullback profundo puede hacerte perder el movimiento. En este caso, una entrada agresiva tiene sentido.",
      advanced:     "Un breakout HTF con una vela impulsiva aporta una confirmación fuerte. El pullback puede ser leve, o no llegar: a evaluar según tu plan.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "breakout_bear_clean",
    title: "Breakout bajista limpio",
    chartShape: "breakout_down",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "El precio acaba de romper un soporte HTF con una vela impulsiva.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "Aquí, la ruptura alineada con el HTF puede señalar un momentum vendedor. Una entrada rápida con un stop sobre el soporte roto es una opción lógica.",
    lessons: {
      beginner:     "Ruptura del soporte con HTF bajista: un SELL sigue siendo coherente con el escenario, si encaja con tu plan de trading.",
      intermediate: "Un stop justo sobre el nivel roto (convertido en resistencia) es una opción lógica. Aquí, el momentum puede justificar una entrada agresiva.",
      advanced:     "Es el espejo del breakout alcista. Un stop técnico sobre el soporte roto, con margen, tiene sentido.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "bounce_support_clean",
    title: "Rebote en soporte mayor",
    chartShape: "bounce_support",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio acaba de rebotar en un soporte HTF con una mecha clara.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "En un soporte testeado, esperar la confirmación del rebote antes de entrar tiene sentido. Un stop bajo el soporte y un TP equilibrado son aquí lógicos, porque la siguiente resistencia limita el recorrido.",
    lessons: {
      beginner:     "En un soporte, esperar la vela verde de confirmación suele ser más seguro que entrar a ciegas.",
      intermediate: "La confirmación puede validar la zona. Aquí, el TP equilibrado tiene en cuenta la siguiente resistencia.",
      advanced:     "En un soporte HTF testeado 2 o 3 veces, la confirmación ayuda a preservar la ventaja. Un R/R de 1:2 a 1:2,5 es habitual en este caso.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "rejection_resistance_clean",
    title: "Rechazo en resistencia mayor",
    chartShape: "rejection_resistance",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "El precio acaba de rechazar una resistencia HTF con una mecha.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "En una resistencia testeada, esperar la confirmación del rechazo antes de entrar tiene sentido. Un stop sobre el high y un TP equilibrado (el siguiente soporte) son aquí lógicos.",
    lessons: {
      beginner:     "En una resistencia, esperar la vela roja de confirmación es una opción prudente. El rechazo convence más cuando se impone.",
      intermediate: "Aquí, la confirmación toma la forma de una vela de rechazo visible. Sin ella, el retest puede prolongarse.",
      advanced:     "Es el espejo del rebote en soporte. Un stop sobre el high, con un margen a la medida de la volatilidad del día (ATR, la amplitud media de una jornada), es una opción lógica.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "range_top_short",
    title: "SELL en el techo del range",
    chartShape: "range_oscillation",
    direction: "SELL",
    htfBias: "range",
    macroContext: "normal",
    context: "El precio llega al techo de un range cerrado. Buscas el SELL.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "En un range, la ventaja sigue siendo limitada: una confirmación ayuda a validar la entrada, y un TP rápido tiene sentido, porque el suelo del range limita el recorrido.",
    lessons: {
      intermediate: "Un range suele ofrecer un R/R limitado. Aquí, un TP ambicioso tiene poco sentido; apuntar al suelo del range es más lógico.",
      advanced:     "Un range se presta más bien al contramovimiento. Una confirmación y un TP rápido suelen aumentar la tasa de acierto, con un R/R que se queda por debajo de 2.",
      beginner:     "En el techo de un range, un objetivo modesto suele ser más realista: el precio se mueve dentro de una caja.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "range_bottom_long",
    title: "BUY en el piso del range",
    chartShape: "range_oscillation",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "El precio llega al piso de un range cerrado. Buscas el BUY.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Aquí, el range se juega entre suelo y techo. Una confirmación y un TP rápido tienen sentido, porque el recorrido es limitado.",
    lessons: {
      intermediate: "Un BUY en el suelo apunta más bien al techo, no más allá. Aquí, el TP rápido se sitúa cerca del techo.",
      advanced:     "Mismos principios que el SELL en el techo: una confirmación y un TP ajustado suelen ayudar a aumentar la tasa de acierto.",
      beginner:     "En un range, apuntar al otro borde suele bastar. Aquí, un objetivo modesto tiene sentido.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fake_breakout_short",
    title: "Fakeout : SELL después de la trampa",
    chartShape: "fakeout_above",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "El precio pinchó sobre la resistencia y luego cerró debajo. Trampa clásica.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Después de un fakeout, esperar la confirmación (una vela que valide el regreso bajo la resistencia) tiene sentido. Un stop sobre el pico del fakeout y un TP equilibrado hasta el siguiente soporte son aquí lógicos.",
    lessons: {
      intermediate: "Un fakeout puede ofrecer una señal de entrada, preferiblemente con confirmación. Sin ella, el retest puede provocar un 2º sweep.",
      advanced:     "Un stop sobre la mecha del fakeout corresponde aquí a la verdadera invalidación, más que uno dentro de la zona de la trampa.",
      beginner:     "Tras una trampa visible, esperar la continuación suele ser más sensato que actuar por FOMO.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "sweep_reversal_bull",
    title: "Sweep de liquidity + reversión",
    chartShape: "sweep_low_reversal",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio acaba de barrer la liquidity bajo el último mínimo y cerró por encima.",
    optimal: { entry: "aggressive", stop: "logical", tp: "balanced" },
    optimalExplain: "Aquí, el sweep puede señalar una reversión. En este caso concreto, una entrada agresiva tiene sentido, porque el sweep ya sirve como primera confirmación. Un stop bajo el low del sweep es una opción lógica.",
    lessons: {
      intermediate: "Pattern ICT clásico: aquí, el sweep es un argumento fuerte a favor de una entrada, a confirmar según tu plan. Un stop bajo el sweep es una opción lógica.",
      advanced:     "Aquí, una entrada agresiva se justifica por el pattern, no por la impaciencia. Un stop bajo el low del sweep (la nueva invalidación) es una opción lógica.",
      beginner:     "Una mecha grande que barre un low y luego sube puede aportar una confirmación fuerte para un BUY.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fvg_continuation_bull",
    title: "Reacción en FVG alcista",
    chartShape: "fvg_continuation",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio vuelve a testear un FVG alcista. La reacción está en curso.",
    optimal: { entry: "confirmation", stop: "logical", tp: "ambitious" },
    optimalExplain: "Aquí, el FVG puede servir de zona de demand, y la confirmación valida la reacción. Un stop bajo el bajo del FVG y un TP ambicioso tienen sentido, porque el HTF está alineado y la zona sigue intacta.",
    lessons: {
      intermediate: "El FVG suele actuar como zona de demand en el retest. Aquí, la confirmación preserva la ventaja sin perder el movimiento.",
      advanced:     "FVG alcista, HTF alineado y primer retest: un setup de primera calidad. Un R/R de 1:3 o más es aquí lógico.",
      beginner:     "El FVG suele atraer al precio. Aquí, la confirmación toma la forma de una vela verde que defiende la zona.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "weak_breakout_setup",
    title: "Ruptura débil : edge reducido",
    chartShape: "weak_breakout",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "El precio acaba de romper sobre la resistencia, pero la vela es pequeña y dudosa.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Aquí, a la ruptura le falta fuerza y la ventaja se reduce. Esperar una confirmación antes de entrar tiene sentido, con un TP rápido porque la continuación sigue siendo incierta.",
    lessons: {
      intermediate: "Una ruptura débil degrada el trade. Una confirmación y un TP ajustado permiten aquí adaptarse a una señal débil.",
      advanced:     "Una ruptura débil continúa bastante menos a menudo que una ruptura franca. En este caso, un TP ambicioso tiene pocas probabilidades de alcanzarse.",
      beginner:     "Si a la ruptura le falta cuerpo, apuntar pequeño y esperar una confirmación es una opción lógica.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "deep_pullback_risky",
    title: "Pullback muy profundo : riesgo de breakdown",
    chartShape: "deep_pullback_risky",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El pullback se volvió muy profundo. Más del 60% del impulso previo está retrazado.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Aquí, el pullback profundo puede anunciar una ruptura de estructura. La confirmación preserva la ventaja: una entrada agresiva supondría perseguir el precio, y un pullback profundo apostar por un nivel secundario.",
    lessons: {
      advanced:     "Un pullback de más del 60 % del impulso puede señalar un pattern agotado. Aquí, una confirmación y un TP moderado son una opción lógica.",
      intermediate: "Cuanto más profundo es el pullback, más cuenta la confirmación. Aquí, una entrada agresiva sería muy arriesgada.",
      beginner:     "Un pullback demasiado profundo puede romper la tendencia. Esperar a que la estructura se reconfirme es aquí una opción lógica.",
    },
    difficulties: ["advanced"],
  },
  {
    id: "high_vol_setup",
    title: "Setup en volatilidad elevada",
    chartShape: "high_vol_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Volatilidad elevada. Las velas son anchas, los wicks profundos.",
    optimal: { entry: "confirmation", stop: "wide", tp: "balanced" },
    optimalExplain: "En volatilidad alta, el ruido se amplifica y un stop estándar corre el riesgo de ser barrido. Aquí, el 'stop amplio' pasa a ser el stop LÓGICO. Un TP equilibrado tiene sentido, porque el movimiento potencial también es mayor.",
    lessons: {
      advanced:     "Un stop ajustado a la volatilidad del día (ATR, la amplitud media de una jornada) es una opción lógica. En volatilidad alta, el 'stop amplio' no es excesivo: simplemente está adaptado.",
      intermediate: "El stop funciona mejor si se adapta a la volatilidad del momento en lugar de a una distancia fija.",
      beginner:     "Cuando el mercado se mueve fuerte, el stop necesita espacio. Si no, puede saltar para nada.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "counter_trend_local",
    title: "Setup local contra HTF : defensivo",
    chartShape: "counter_trend_local",
    direction: "BUY",
    htfBias: "bearish",
    macroContext: "normal",
    context: "HTF bajista. Un setup BUY aparece localmente (LTF), arriesgado pero tradeable.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Contra el HTF, la probabilidad suele ser desfavorable. Aquí, una confirmación y un TP rápido permiten asegurar lo que se pueda; apuntar lejos contra la tendencia mayor es difícil de defender.",
    lessons: {
      advanced:     "Operar contra el HTF suele suponer aceptar una probabilidad desfavorable. Aquí, el TP rápido captura la ventaja antes de una posible reversión.",
      intermediate: "Un setup contra la tendencia pide más bien un enfoque defensivo. Una confirmación y una salida rápida limitan aquí la exposición.",
      beginner:     "Si operas contra la tendencia, apuntar pequeño y salir rápido suele ser la opción más prudente.",
    },
    difficulties: ["advanced"],
  },
];

// Alias canónico para que la página pueda importar BUILD_TRADE_TEMPLATES igual que en FR.
export const BUILD_TRADE_TEMPLATES = BUILD_TRADE_TEMPLATES_ES;

// ─── generateBuildTradeScenarios ES ──────────────────────────────────────────
// Re-uso de la lógica FR pero remapeando los campos de texto al template ES por id.

export function generateBuildTradeScenarios(seed: number, difficulty: Difficulty): BuildTradeInstance[] {
  const frInstances = generateBuildTradeScenariosFr(seed, difficulty);
  return frInstances.map((inst) => {
    const esTpl = BUILD_TRADE_TEMPLATES_ES.find((t) => t.id === inst.id);
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

export function setupVerdict(result: BuildTradeResult): { label: string; color: "emerald" | "amber" | "red" } {
  // Barème simple : le verdict ne dépend que des 3 décisions (entrée, stop, TP)
  const q = result.qualityMatch;
  return { label: `${q}/3 decisiones acertadas`, color: q === 3 ? "emerald" : q >= 1 ? "amber" : "red" };
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Principiante",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Estructura clara, decisiones relativamente obvias, entiende invalidación y R/R.",
  },
  intermediate: {
    label:       "Intermedio",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Varias decisiones plausibles: seguridad vs rendimiento, confirmación vs R/R.",
  },
  advanced: {
    label:       "Avanzado",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Contexto ambiguo, ningún setup perfecto. Elección del menos malo de los escenarios.",
  },
};

export function sessionVerdict(score: number, perfectCount: number, total: number): string {
  if (perfectCount >= total - 1) return "Trader arquitecto";
  if (score >= 180)              return "Construcción sólida";
  if (score >= 120)              return "Plan correcto";
  if (score >= 60)               return "Aún por estructurar";
  return "Plan desordenado";
}

// Re-export FR para comparar si fuese necesario.
export { FR_TEMPLATES as BUILD_TRADE_TEMPLATES_FR };
