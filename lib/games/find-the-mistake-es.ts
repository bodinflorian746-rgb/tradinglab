// Mini-juego "FIND THE MISTAKE" (traducción ES LATAM).
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
  type MistakeId,
  type MistakeCategory,
  type DifficultyLessons,
  type MistakeTemplate,
  type MistakeInstance,
  type ChartShape,
  type ScenarioChart,
  type MistakeScoreResult,
  ROUNDS_PER_SESSION,
  MISTAKE_TEMPLATES as FR_TEMPLATES,
  generateMistakeScenarios as generateMistakeScenariosFr,
  buildScenarioChart as buildScenarioChartFr,
  scoreMistakeChoice,
} from "./find-the-mistake";

// ─── Reexports tipos / utilidades ────────────────────────────────────────────

export type {
  Asset, Session, Volatility, Spread, HtfBias, MacroContext,
  Candle, ChartZone,
  Difficulty,
  TradeDirection,
  MistakeId,
  MistakeCategory,
  DifficultyLessons,
  MistakeTemplate,
  MistakeInstance,
  ChartShape,
  ScenarioChart,
  MistakeScoreResult,
};

export { ROUNDS_PER_SESSION, scoreMistakeChoice };

// ─── Tabla de traducción para etiquetas de zonas ─────────────────────────────

const ZONE_LABEL_ES: Record<string, string> = {
  "Swing low":          "Swing low",
  "Swing high":         "Swing high",
  "Résistance HTF":     "Resistencia HTF",
  "Support HTF":        "Soporte HTF",
  "Résistance":         "Resistencia",
  "Support":            "Soporte",
  "Plafond range":      "Techo del rango",
  "Plancher range":     "Piso del rango",
  "Précédent low":      "Low previo",
  "Liquidité balayée":  "Liquidez barrida",
  "FVG haussier":       "FVG alcista",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_ES[z.label] ?? z.label }));
}

// Wrapper de buildScenarioChart que traduce las etiquetas de zonas.
export function buildScenarioChart(template: MistakeTemplate, seed: number, vol: Volatility): ScenarioChart {
  const chart = buildScenarioChartFr(template, seed, vol);
  return { ...chart, zones: translateZones(chart.zones) };
}

// ─── Etiquetas de errores ES ─────────────────────────────────────────────────

export const MISTAKE_LABELS: Record<MistakeId, string> = {
  stop_too_tight:        "Stop demasiado ajustado",
  stop_in_liquidity:     "Stop en liquidity",
  trade_against_htf:     "Trade contra HTF",
  trade_before_news:     "Trade antes de news",
  buy_in_resistance:     "Compra dentro de resistencia",
  sell_in_support:       "Venta dentro de soporte",
  bad_rr:                "Ratio R/R malo",
  no_confirmation:       "Breakout sin confirmación",
  over_leverage:         "Apalancamiento excesivo",
  bad_spread:            "Spread ignorado",
  volatility_ignored:    "Volatilidad ignorada",
  fomo_after_pump:       "Entrada FOMO",
  revenge_trade:         "Revenge trade",
  range_middle:          "Trade en range sucio",
  sweep_ignored:         "Liquidity ignorada",
  mitigation_misread:    "Mitigation mal leída",
  bad_timing:            "Mal timing",
  ignored_zone:          "Zona HTF ignorada",
};

// ─── Templates ES ─────────────────────────────────────────────────────────────

export const MISTAKE_TEMPLATES_ES: MistakeTemplate[] = [
  {
    id: "buy_in_resistance",
    title: "BUY justo bajo resistencia HTF",
    category: "technique",
    chartShape: "approach_resistance",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Tomas este BUY pegado bajo una resistencia HTF testeada varias veces.",
    correctMistake: "buy_in_resistance",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "La resistencia HTF testeada varias veces aguantó en cada test. BUY justo debajo = entrada en la peor location posible. El ratio R/R se vuelve atroz porque el TP está limitado por la resistencia inmediata.",
    lessons: {
      beginner:     "No se compra bajo una resistencia que rechaza en cada test. Se espera una ruptura o una reversión.",
      intermediate: "Location > pattern. Aún un setup técnicamente bueno se vuelve malo si la entry está en una zona hostil.",
      advanced:     "La resistencia HTF con 3+ toques es una zona de oferta institucional. El edge es SHORT al retest, no BUY al pullback dentro de ella.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "sell_in_support",
    title: "SELL justo sobre soporte HTF",
    category: "technique",
    chartShape: "approach_support",
    direction: "SELL",
    htfBias: "range",
    macroContext: "normal",
    context: "Tomas este SELL pegado sobre un soporte HTF testeado varias veces.",
    correctMistake: "sell_in_support",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "El soporte HTF aguantó en cada test. SELL justo encima = entrada en la peor location. El TP está limitado por el soporte inmediato → R/R catastrófico.",
    lessons: {
      beginner:     "No se vende sobre un soporte que rebota. Se espera la ruptura del soporte O el rebote en resistencia.",
      intermediate: "Location > pattern. Vender en una zona de demanda HTF es ponerte contra el edge.",
      advanced:     "El soporte HTF con 3+ rebotes es una zona de demanda institucional. Edge = BUY al rebote, no SELL al pullback dentro de ella.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "sell_entry",
  },
  {
    id: "trade_against_htf",
    title: "BUY en un downtrend HTF",
    category: "technique",
    chartShape: "downtrend_pullback",
    direction: "BUY",
    htfBias: "bearish",
    macroContext: "normal",
    context: "HTF claramente bajista. Tomas este BUY en un rebote local.",
    correctMistake: "trade_against_htf",
    decoyMistakes: ["bad_timing", "no_confirmation", "fomo_after_pump"],
    explanation: "Los rebotes en downtrend son oportunidades de SHORT, no de BUY. Estadísticamente, tomar longs contra HTF tiene una tasa de éxito del 30-40% — el edge está invertido.",
    lessons: {
      beginner:     "HTF bajista = se buscan SELL. Nunca BUY.",
      intermediate: "Un setup local no borra la tendencia HTF. Si HTF dice no, no dices sí.",
      advanced:     "Tradear contra HTF = jugar a 30-40% de proba. Ningún setup local puede compensar esa brecha estadística.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "trade_before_news",
    title: "Trade abierto justo antes de news",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "range",
    macroContext: "dangereux",
    context: "News macro mayor (NFP) en 18 minutos. Abres este BUY ahora.",
    correctMistake: "trade_before_news",
    decoyMistakes: ["bad_timing", "volatility_ignored", "no_confirmation"],
    explanation: "Tradear 30 min antes de una news mayor = spread x3-x5, slippage masivo, stop saltado por bid-ask. La técnica del setup ya no cuenta, solo la volatilidad de ejecución te mata.",
    lessons: {
      beginner:     "Nada de trades en los 30 min antes Y 15 min después de una news mayor. Regla absoluta.",
      intermediate: "El spread puede triplicarse, tu SL salta por bid-ask. La estadística del setup ya no se aplica a un mercado ilíquido.",
      advanced:     "Aun con una vista fuerte sobre la news, la ejecución es tu enemigo. Position size /3 y stop x2, o NO TRADE.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "stop_too_tight",
    title: "Stop justo sobre el swing low",
    category: "technique",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tomas este BUY en el pullback con stop justo sobre el swing low.",
    correctMistake: "stop_too_tight",
    decoyMistakes: ["bad_rr", "trade_against_htf", "fomo_after_pump"],
    explanation: "El swing low casi siempre va a ser retesteado antes de la continuación. Un stop sobre el low = barrido por el ruido normal del retest. El trade sería bueno con un stop bajo el swing low.",
    lessons: {
      beginner:     "Un stop se coloca DETRÁS de la invalidación con margen — nunca dentro, nunca encima.",
      intermediate: "El retest del low está estadísticamente presente en el 70%+ de los pullbacks. El margen anti-ruido es obligatorio.",
      advanced:     "Sin margen ATR detrás de la estructura, tu stop sirve de imán a la liquidity. Los institucionales recogen esos niveles.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_with_tight_stop",
  },
  {
    id: "range_middle",
    title: "Trade en medio de un range",
    category: "discipline",
    chartShape: "range_oscillation",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "El precio oscila en un range. Tomas este BUY en el medio.",
    correctMistake: "range_middle",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "En medio de un range: sin zona testeada, sin señal, sin catalizador. El R/R es horrible (TP < risk). El range se tradea en los bordes o en la ruptura.",
    lessons: {
      beginner:     "Sin señal = sin trade. Si no puedes explicar por qué en 1 frase, es NO TRADE.",
      intermediate: "El medio de un range = invitación a arriesgar 1R por 0.3R reward. Matemáticamente perdedor.",
      advanced:     "Disciplina > actividad. Forzar el trade en medio = darle combustible a los market makers.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "stop_in_liquidity",
    title: "Stop justo sobre el swing high",
    category: "liquidite",
    chartShape: "downtrend_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tomas este SELL en el rebote con stop justo sobre el swing high.",
    correctMistake: "stop_in_liquidity",
    decoyMistakes: ["stop_too_tight", "bad_rr", "no_confirmation"],
    explanation: "El swing high es un objetivo institucional evidente — ahí está la liquidity de los shorts atrapados. Stop colocado pile en ese lugar = imán para el sweep. Margen obligatorio por encima.",
    lessons: {
      intermediate: "Los swing highs/lows son zonas de caza de liquidity. Pegar tu stop ahí = que te cacen.",
      advanced:     "El institucional TARGETEA esos niveles para recoger el combustible. El stop lógico va más allá de la zona de liquidity, no dentro.",
      beginner:     "Tu stop jamás va pile en un swing evidente. Siempre detrás de la zona con margen.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "sell_with_liquidity_stop",
  },
  {
    id: "bad_rr",
    title: "Setup válido, TP demasiado cerca",
    category: "rr",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Setup técnicamente válido. Stop amplio, TP muy cerca.",
    correctMistake: "bad_rr",
    decoyMistakes: ["stop_too_tight", "trade_against_htf", "fomo_after_pump"],
    explanation: "R/R menor a 1 = aún ganando el 60% de los trades, tu expectancy es negativa. Un setup válido con mal R/R sigue siendo un mal trade.",
    lessons: {
      intermediate: "La expectancy de un setup = (proba_win × reward) - (proba_loss × risk). Si R/R < 1, hace falta un win rate > 60% solo para break-even.",
      advanced:     "El R/R mínimo aceptable es 2:1 para absorber comisiones y períodos de drawdown. Bajo ese umbral, el edge estadístico desaparece.",
      beginner:     "Si arriesgas 100 € para ganar 50 €, pierdes a largo plazo aún ganando seguido.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "buy_with_bad_rr",
  },
  {
    id: "weak_breakout",
    title: "BUY en ruptura débil",
    category: "technique",
    chartShape: "weak_breakout",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Tomas este BUY en la ruptura de resistencia. La vela de fuerza es minúscula.",
    correctMistake: "no_confirmation",
    decoyMistakes: ["buy_in_resistance", "bad_rr", "fomo_after_pump"],
    explanation: "Una ruptura sin vela de momentum (body pequeño, justo sobre R) tiene una tasa de continuation de ~35%. Suele ser un cebo de liquidity institucional.",
    lessons: {
      intermediate: "Ruptura débil = trampa. Esperar o un follow-through claro, o un retest que aguante.",
      advanced:     "Los institucionales crean breakouts débiles para aspirar los stops shorts sobre R, y luego empujan en el sentido HTF.",
      beginner:     "Un breakout real = vela de fuerza visible. Si no, espera.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "over_leverage",
    title: "Apalancamiento 50x en XAU/USD",
    category: "execution",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tomas este BUY en XAU/USD con 50x de apalancamiento. El setup es correcto.",
    correctMistake: "over_leverage",
    decoyMistakes: ["stop_too_tight", "volatility_ignored", "bad_rr"],
    explanation: "A 50x en XAU, un movimiento del 2% liquida la posición. La volatilidad natural de XAU es de 1-2% por día — la liquidación es estadísticamente casi garantizada en una sola sesión.",
    lessons: {
      advanced:     "Apalancamiento razonable XAU/forex: 5-10x máx. BTC: 3-5x. Más allá, juegas a la ruleta rusa con tu capital.",
      intermediate: "El apalancamiento NO cambia el edge del setup. Solo multiplica la varianza — y por ende los drawdowns.",
      beginner:     "50x = 2% de movimiento contrario y pierdes todo. La volatilidad natural de assets líquidos es de 1-2%/día. Estadísticamente es una liquidación.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Apalancamiento 50x",
    showLines: "buy_entry",
  },
  {
    id: "bad_spread",
    title: "Trade en sesión muerta con spread x4",
    category: "execution",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tomas este BUY a las 3 a.m. (horas muertas). Spread cuadruplicado.",
    correctMistake: "bad_spread",
    decoyMistakes: ["bad_timing", "volatility_ignored", "trade_against_htf"],
    explanation: "Spread x4 + sesión ilíquida = R/R real dividido por 2 aunque el setup funcione. El stop salta por bid-ask, el TP se vuelve inalcanzable.",
    lessons: {
      advanced:     "Un trader pro integra siempre la ejecución en su edge. Spread x3+ y volumen muerto → NO TRADE.",
      intermediate: "El R/R en papel ≠ R/R real. El spread se come tu edge.",
      beginner:     "Verifica sesión + spread antes de hacer click. Horas muertas = NO TRADE.",
    },
    difficulties: ["advanced"],
    extraInfo: "Spread x4",
    metaOverride: { session: "Heures mortes", spread: "élevé" },
    showLines: "buy_entry",
  },
  {
    id: "volatility_ignored",
    title: "Stop estándar en vol explosiva",
    category: "execution",
    chartShape: "high_vol_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Volatilidad explosiva en BTC. Tomas este BUY con un stop de tamaño estándar.",
    correctMistake: "volatility_ignored",
    decoyMistakes: ["stop_too_tight", "bad_rr", "over_leverage"],
    explanation: "En vol elevada, el ruido normal es 2-3x más amplio. Un stop 'normal' queda dentro del ruido amplificado → barrido antes de que el trade prospere.",
    lessons: {
      advanced:     "El stop debe adaptarse al ATR del momento, no a una distancia fija. En vol elevada, amplía el stop Y el TP proporcionalmente.",
      intermediate: "Volatilidad duplicada = stop duplicado. Si no, tu stop se vuelve una trampa.",
      beginner:     "Cuanto más se mueve el mercado, más debe respirar tu stop.",
    },
    difficulties: ["intermediate", "advanced"],
    metaOverride: { volatility: "élevée" },
    showLines: "buy_with_tight_stop",
  },
  {
    id: "fomo_after_pump",
    title: "BUY tras un pump del 5%",
    category: "psychologique",
    chartShape: "fast_rally",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio acaba de pumpear 5% en 3 velas. Compras ahora para no perdértelo.",
    correctMistake: "fomo_after_pump",
    decoyMistakes: ["bad_rr", "trade_against_htf", "no_confirmation"],
    explanation: "Comprar el tope de un pump = exactamente lo que los institucionales esperan. El R/R es terrible (TP lejos / stop corto), el retracement es probable a corto plazo.",
    lessons: {
      intermediate: "Los pumps verticales retracen estadísticamente 38-61%. BUY al tope = vender al fondo.",
      advanced:     "El FOMO = señal contra-trend. El edge es ESPERAR el retracement, no chasing.",
      beginner:     "Si tomas un trade porque 'lo vas a perder', es precisamente el momento de NO tomarlo.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "revenge_trade",
    title: "Re-entrada inmediata tras 2 stops",
    category: "psychologique",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Acabas de tomar 2 stops seguidos. Re-entras inmediatamente en este setup.",
    correctMistake: "revenge_trade",
    decoyMistakes: ["fomo_after_pump", "bad_timing", "stop_too_tight"],
    explanation: "El setup puede ser válido, pero tu decisión no la guía el análisis — la guían las ganas de recuperar las pérdidas. Es la trampa emocional #1 del retail.",
    lessons: {
      intermediate: "Tras 2 stops, pausa obligatoria (15-30 min). El cerebro en pérdida de capital toma decisiones sesgadas.",
      advanced:     "El revenge trade tiene un win rate ~10 puntos por debajo del promedio del mismo trader. La pausa restaura la objetividad.",
      beginner:     "Si tradeas para 'recuperar', ya no tradeas — apuestas.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "2 stops recientes",
    showLines: "buy_entry",
  },
  {
    id: "sweep_ignored",
    title: "SELL justo antes de un sweep low",
    category: "liquidite",
    chartShape: "sweep_low_done",
    direction: "SELL",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio acaba de barrer la liquidity bajo el low previo con una mecha grande. Vendes ahora.",
    correctMistake: "sweep_ignored",
    decoyMistakes: ["trade_against_htf", "bad_rr", "stop_too_tight"],
    explanation: "El sweep acaba de pasar — es la señal de reversión alcista. SELL aquí = vender en el fondo que el institucional acaba de crear para recomprar. La dirección está invertida.",
    lessons: {
      advanced:     "Pattern ICT clásico: sweep = toma de liquidity antes de continuation HTF. El edge es BUY al regreso, no SELL.",
      intermediate: "Una mecha grande que barre un nivel y luego se gira = señal de reversal probable. Lectura invertida.",
      beginner:     "No vendas un fondo que acaba de ser 'comido' por una mecha. Busca el rebote.",
    },
    difficulties: ["advanced"],
    showLines: "sell_entry",
  },
  {
    id: "mitigation_misread",
    title: "BUY en FVG comido al 85%",
    category: "liquidite",
    chartShape: "fvg_deep_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Compras en este FVG alcista. El pullback ha mitigado 85%+ de la zona sin reacción visible.",
    correctMistake: "mitigation_misread",
    decoyMistakes: ["bad_rr", "stop_too_tight", "trade_against_htf"],
    explanation: "Una mitigation profunda sin reacción = FVG muerto. Los compradores institucionales ya no defienden la zona. BUY aquí = rezarle a la oración, no seguir una señal.",
    lessons: {
      advanced:     "FVG > 75% mitigado sin reacción visible = la zona pierde su edge estadístico. O esperar ruptura para SELL, o NO TRADE.",
      intermediate: "Una zona profundamente testeada pierde su poder. El 1er o 2do test = edge; el test profundo = zona fatigada.",
      beginner:     "Si una zona tarda en reaccionar, pierde su potencia. Mejor esperar la próxima.",
    },
    difficulties: ["advanced"],
    showLines: "buy_entry",
  },
];

// Alias canónico para que la página pueda importar MISTAKE_TEMPLATES igual que en FR.
export const MISTAKE_TEMPLATES = MISTAKE_TEMPLATES_ES;

// ─── generateMistakeScenarios ES ─────────────────────────────────────────────
// Re-uso de la lógica FR pero remapeando los campos de texto al template ES por id.

export function generateMistakeScenarios(seed: number, difficulty: Difficulty): MistakeInstance[] {
  const frInstances = generateMistakeScenariosFr(seed, difficulty);
  return frInstances.map((inst) => {
    const esTpl = MISTAKE_TEMPLATES_ES.find((t) => t.id === inst.id);
    if (!esTpl) return inst;
    return {
      ...esTpl,
      asset:           inst.asset,
      session:         inst.session,
      volatility:      inst.volatility,
      spread:          inst.spread,
      seed:            inst.seed,
      difficulty:      inst.difficulty,
      shuffledChoices: inst.shuffledChoices,
    };
  });
}

// ─── Verdicts ES ─────────────────────────────────────────────────────────────

export const CATEGORY_META: Record<MistakeCategory, { label: string; dotClass: string; textClass: string }> = {
  technique:     { label: "Error técnico",          dotClass: "bg-blue-400",    textClass: "text-blue-400"    },
  psychologique: { label: "Error psicológico",      dotClass: "bg-amber-400",   textClass: "text-amber-400"   },
  execution:     { label: "Error de ejecución",     dotClass: "bg-violet-400",  textClass: "text-violet-400"  },
  rr:            { label: "Error de R/R",           dotClass: "bg-pink-400",    textClass: "text-pink-400"    },
  timing:        { label: "Error de timing",        dotClass: "bg-red-400",     textClass: "text-red-400"     },
  liquidite:     { label: "Error de liquidity",     dotClass: "bg-emerald-400", textClass: "text-emerald-400" },
  discipline:    { label: "Error de disciplina",    dotClass: "bg-zinc-400",    textClass: "text-zinc-400"    },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Principiante",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Errores evidentes: contexto claro, trampas simples, pedagogía fuerte.",
  },
  intermediate: {
    label:       "Intermedio",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Varios errores plausibles, contexto ambiguo, hay que interpretar.",
  },
  advanced: {
    label:       "Avanzado",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Varias respuestas casi válidas, matiz institucional, duda real.",
  },
};

export function sessionVerdict(score: number, correctCount: number, total: number): string {
  if (correctCount >= total - 1) return "Ojo de lince";
  if (score >= 700)              return "Sólido";
  if (score >= 300)              return "Por pulir";
  if (score >= 0)                return "Aún hay camino";
  return "Mucho que aprender";
}

// Re-export FR para comparar si fuese necesario.
export { FR_TEMPLATES as MISTAKE_TEMPLATES_FR };
