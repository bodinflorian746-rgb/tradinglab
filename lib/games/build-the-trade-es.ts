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
  "Plafond range":      "Techo del rango",
  "Plancher range":     "Piso del rango",
  "Wick fakeout":       "Wick del fakeout",
  "Précédent low":      "Low previo",
  "Précédent high":     "High previo",
  "Liquidité balayée":  "Liquidez barrida",
  "FVG haussier":       "FVG alcista",
  "Zone douteuse":      "Zona dudosa",
  "Niveau secondaire":  "Nivel secundario",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_ES[z.label] ?? z.label }));
}

// Wrapper de buildBuildTradeChart que traduce las etiquetas de zonas.
export function buildBuildTradeChart(template: BuildTradeTemplate, seed: number, vol: Volatility): BuildTradeChart {
  const chart = buildBuildTradeChartFr(template, seed, vol);
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
    optimalExplain: "Tendencia HTF clara = tomar el mejor precio posible (pullback profundo), stop detrás de la estructura, apuntar amplio en el sentido del momentum.",
    lessons: {
      beginner:     "Un setup en el sentido del HTF, se toma el mejor precio posible y se apunta amplio. El mercado paga a los pacientes.",
      intermediate: "El pullback profundo optimiza el R/R. Combinado con un stop detrás de la estructura, es el edge máximo.",
      advanced:     "Trend continuation alineada HTF = setup full size, R/R 3:1+. Ambicioso justificado porque hay momentum probable.",
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
    optimalExplain: "HTF bajista + rebote muerto = entrada al mejor precio, stop sobre el swing high, TP ambicioso en el sentido del momentum.",
    lessons: {
      beginner:     "Tendencia bajista + rebote muerto = SELL al precio más alto posible, TP amplio.",
      intermediate: "El rebote profundo da el R/R óptimo. Stop sobre la estructura para absorber el ruido.",
      advanced:     "Setup simétrico del trend continuation bull. R/R 3:1+ apuntado.",
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
    context: "El precio acaba de romper una resistencia HTF con una vela de fuerza.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "Breakout HTF alineado = momentum inmediato. No hay tiempo para esperar un pullback profundo (que puede nunca llegar). Entry agresiva, stop bajo el nivel roto, TP ambicioso.",
    lessons: {
      beginner:     "En un breakout alineado HTF, no se demora. El mercado sube sin esperar al rezagado.",
      intermediate: "Esperar un pullback profundo en un breakout fuerte = perderse el movimiento. Aggressive justificada.",
      advanced:     "Breakout HTF + vela de fuerza = señal inmediata. El pullback puede ser superficial o inexistente.",
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
    context: "El precio acaba de romper un soporte HTF con una vela de fuerza.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "Breakdown HTF alineado = momentum del lado vendedor. Entrada inmediata, stop sobre el soporte roto.",
    lessons: {
      beginner:     "Ruptura del soporte + HTF bajista = SELL ahora, sin esperar.",
      intermediate: "Stop justo sobre el nivel roto (vuelto resistencia). Aggressive justificada por el momentum.",
      advanced:     "Setup espejo del breakout bull. Stop técnico = top del soporte roto + margen.",
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
    optimalExplain: "Soporte testeado = se espera la confirmación del rebote antes de entrar. Stop bajo el soporte, TP equilibrado porque la próxima resistencia limita el recorrido.",
    lessons: {
      beginner:     "En un soporte, se espera la vela verde de confirmación. No se entra a ciegas.",
      intermediate: "La confirmación valida la zona. El TP equilibrado refleja la próxima resistencia.",
      advanced:     "Rebote en soporte HTF testeado 2-3 veces → la confirmación preserva el edge. R/R 2-2.5:1 típico.",
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
    optimalExplain: "Resistencia testeada = confirmación del rechazo antes de la entry. Stop sobre el high, TP equilibrado (el próximo soporte).",
    lessons: {
      beginner:     "En resistencia, se espera la vela roja de confirmación. El rechazo debe imponerse.",
      intermediate: "Confirmación = vela de rechazo visible. Sin ella, el retest puede continuar.",
      advanced:     "Pattern espejo del bounce support. Stop = high + margen ATR.",
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
    optimalExplain: "En un range, el edge es pequeño, confirmación para validar la entrada, TP rápido porque el recorrido está limitado por el piso del range.",
    lessons: {
      intermediate: "Un range tiene un R/R intrínsecamente limitado. El TP ambicioso no tiene sentido, se apunta al piso del range.",
      advanced:     "Range = entorno de fade. Confirmación + TP rápido = porcentaje de win más alto, RR < 2.",
      beginner:     "En el techo de un range, se vende pequeño. Sin gran TP porque el precio se mueve en una caja.",
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
    optimalExplain: "Range = arbitraje entre piso y techo. Confirmación + TP rápido porque el recorrido está acotado.",
    lessons: {
      intermediate: "El BUY del piso apunta al techo, no más. El TP rápido se pega al techo.",
      advanced:     "Mismos principios que el SELL del techo, confirmación + TP ajustado para maximizar el % de win.",
      beginner:     "Range = se apunta al otro lado, sin más. Sin ambición.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fake_breakout_short",
    title: "Falso breakout : SELL después de la trampa",
    chartShape: "fakeout_above",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "El precio pinchó sobre la resistencia y luego cerró debajo. Trampa clásica.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Después de un fakeout, se espera la confirmación (vela que valida el regreso bajo la resistencia). Stop sobre el pico del fakeout, TP equilibrado hasta el próximo soporte.",
    lessons: {
      intermediate: "Fakeout = señal de entrada pero con confirmación. Sin confirmación, el retest puede hacer un 2do sweep.",
      advanced:     "Stop sobre el wick del fakeout, esa es la VERDADERA invalidación. No dentro de la zona de la trampa.",
      beginner:     "Tras una trampa visible, se espera la continuación. Sin FOMO.",
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
    context: "El precio acaba de barrer la liquidity bajo el low previo y cerró por encima.",
    optimal: { entry: "aggressive", stop: "logical", tp: "balanced" },
    optimalExplain: "Sweep = señal de reversión inmediata. Aggressive justificada porque la confirmación ya la da el sweep. Stop bajo el low del sweep.",
    lessons: {
      intermediate: "Pattern ICT clásico: el sweep ES la confirmación. Entrar agresivamente, stop bajo el sweep.",
      advanced:     "Aggressive justificada por el pattern, no por la impaciencia. Stop bajo el low del sweep (la nueva invalidación).",
      beginner:     "Una mecha grande que barre un low y luego sube = señal de BUY clara.",
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
    optimalExplain: "FVG = zona de demanda institucional. La confirmación valida la reacción. Stop bajo el bottom del FVG, TP ambicioso porque HTF alineado + zona fresh.",
    lessons: {
      intermediate: "El FVG actúa como zona de demanda en el retest. La confirmación preserva el edge sin perder el move.",
      advanced:     "FVG alcista + HTF alineado + primer retest = setup A+. R/R 3:1+ apuntado.",
      beginner:     "El FVG = imán de precio. Confirmación = vela verde que defiende la zona.",
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
    optimalExplain: "Ruptura sin fuerza = edge reducido. Confirmación obligatoria antes de entrar. TP rápido porque la continuación es incierta.",
    lessons: {
      intermediate: "Ruptura débil = trade degradado. Confirmación + TP ajustado = adaptación a la señal débil.",
      advanced:     "Estadística de una ruptura débil: ~35% de continuation. El TP ambicioso es matemáticamente perdedor.",
      beginner:     "Si a la ruptura le falta body, se toma chico y se espera confirmación.",
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
    optimalExplain: "Pullback profundo = riesgo de breakdown estructural. La confirmación preserva el edge. Aggressive sería chasing, deep_pullback sería FOMO sobre una zona dudosa.",
    lessons: {
      advanced:     "Pullback > 60% del impulso = el pattern está fatigado. Confirmación obligatoria + TP moderado.",
      intermediate: "Cuanto más profundo el pullback, más crítica se vuelve la confirmación. Aggressive aquí = ruleta rusa.",
      beginner:     "Un pullback demasiado profundo puede romper la tendencia. Se espera que la estructura se reconfirme.",
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
    optimalExplain: "Volatilidad elevada = el ruido está amplificado. Stop estándar se barre. El 'wide stop' se vuelve el stop LÓGICO. TP equilibrado porque el movimiento potencial también es extendido.",
    lessons: {
      advanced:     "Stop ATR-ajustado. En vol elevada, el 'wide stop' no es amplio, es justo el adaptado.",
      intermediate: "El stop debe adaptarse a la volatilidad del momento, no a un estándar fijo.",
      beginner:     "Cuando el mercado se mueve fuerte, el stop debe respirar. Si no, salta por nada.",
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
    optimalExplain: "Contra HTF = proba desfavorable. Confirmación obligatoria + TP rápido para asegurar lo que se pueda. Sin ambición contra la tendencia mayor.",
    lessons: {
      advanced:     "Tradear contra HTF = aceptar una proba 30-40%. El TP rápido captura el edge antes del reversal.",
      intermediate: "Setup contra tendencia = defensivo. Confirmación + salida rápida minimizan la exposición.",
      beginner:     "Si tradeas contra la tendencia, tomas chico y sales rápido. Nunca ambicioso.",
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
  if (result.qualityMatch === 3 && result.outcome === "tp_hit") return { label: "Setup perfecto",      color: "emerald" };
  if (result.qualityMatch >= 2  && result.outcome === "tp_hit") return { label: "Setup sólido",        color: "emerald" };
  if (result.outcome === "tp_hit")                              return { label: "Trade ganador",       color: "emerald" };
  if (result.outcome === "no_fill")                             return { label: "Trade no completado", color: "amber"   };
  if (result.outcome === "open")                                return { label: "Trade en curso",      color: "amber"   };
  if (result.qualityMatch >= 2)                                 return { label: "Buen plan, mal mercado", color: "amber" };
  return { label: "Setup fallido", color: "red" };
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Principiante",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Estructura clara, decisiones relativamente obvias, entiende invalidación y RR.",
  },
  intermediate: {
    label:       "Intermedio",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Varias decisiones plausibles: seguridad vs rendimiento, confirmación vs RR.",
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
  if (score >= 500)              return "Construcción sólida";
  if (score >= 200)              return "Plan correcto";
  if (score >= 0)                return "Aún por estructurar";
  return "Plan desordenado";
}

// Re-export FR para comparar si fuese necesario.
export { FR_TEMPLATES as BUILD_TRADE_TEMPLATES_FR };
