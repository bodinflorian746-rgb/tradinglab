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
export { withAssetPrices } from "./find-the-mistake";

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
  stop_too_tight:              "Stop demasiado ajustado",
  stop_in_liquidity:           "Stop en liquidity",
  trade_against_htf:           "Trade contra HTF",
  trade_before_news:           "Trade antes de news",
  buy_in_resistance:           "Compra dentro de resistencia",
  sell_in_support:             "Venta dentro de soporte",
  bad_rr:                      "Ratio R/R malo",
  no_confirmation:             "Breakout sin confirmación",
  oversized_position:          "Exposición excesiva",
  bad_spread:                  "Spread ignorado",
  volatility_ignored:          "Volatilidad ignorada",
  fomo_after_pump:             "Entrada FOMO",
  revenge_trade:               "Revenge trade",
  range_middle:                "Trade en range sucio",
  sweep_ignored:               "Liquidity ignorada",
  mitigation_misread:          "Mitigation mal leída",
  bad_timing:                  "Mal timing",
  ignored_zone:                "Zona HTF ignorada",
  risk_not_reduced_news:       "Riesgo no reducido antes de news",
  position_held_through_event: "Posición no gestionada antes del evento",
  size_not_adapted_to_vol:     "Tamaño no adaptado a la volatilidad",
  weekend_gap_exposure:        "Exposición fin de semana no reducida",
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
    explanation: "Aquí, la resistencia HTF testeada varias veces aguantó en cada test. Un BUY justo debajo sitúa la entrada en el peor sitio: el TP queda limitado por la resistencia inmediata y el R/R se vuelve muy desfavorable.",
    lessons: {
      beginner:     "Comprar bajo una resistencia que rechaza en cada test rara vez es buena idea. Esperar una ruptura o una reversión suele ser más lógico.",
      intermediate: "La ubicación suele contar más que el pattern. Incluso un setup técnicamente bueno puede volverse malo si la entrada está en una zona hostil.",
      advanced:     "Una resistencia HTF tocada 3 veces o más puede señalar una zona de oferta sólida. Aquí, la ventaja está más bien en un SELL en el retest que en un BUY en el pullback.",
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
    explanation: "Aquí, el soporte HTF aguantó en cada test. Un SELL justo encima sitúa la entrada en el peor sitio: el TP queda limitado por el soporte inmediato y el R/R se vuelve muy desfavorable.",
    lessons: {
      beginner:     "Vender sobre un soporte que rebota rara vez es buena idea. Esperar la ruptura del soporte, o un rebote en resistencia, suele ser más lógico.",
      intermediate: "La ubicación suele contar más que el pattern. Vender en una zona de demanda HTF supone aquí ponerse contra la ventaja.",
      advanced:     "Un soporte HTF con 3 rebotes o más puede señalar una zona de demanda sólida. Aquí, la ventaja está más bien en un BUY en el rebote que en un SELL.",
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
    explanation: "En una tendencia bajista, los rebotes ofrecen más bien oportunidades de SELL que de BUY. Comprar contra el HTF suele funcionar menos de la mitad de las veces: la ventaja se invierte.",
    lessons: {
      beginner:     "Con HTF bajista, se buscan más bien SELL, no BUY.",
      intermediate: "Un setup local no borra la tendencia HTF. Si el HTF va en tu contra, suele ser mejor abstenerse.",
      advanced:     "Operar contra el HTF suele suponer jugar una probabilidad desfavorable. Un setup local rara vez compensa esa brecha estadística.",
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
    explanation: "Operar 30 min antes de una news mayor expone a un spread x3 a x5, a un slippage importante y a un stop que puede saltar por el bid-ask. Aquí, la técnica del setup pesa poco frente a la volatilidad de ejecución.",
    lessons: {
      beginner:     "Referencia prudente: evitar operar en los 30 min antes y los 15 min después de una news mayor. Muchos traders lo convierten en una regla de su plan.",
      intermediate: "El spread puede triplicarse y tu SL puede saltar por el bid-ask. Las estadísticas del setup se aplican mal a un mercado ilíquido.",
      advanced:     "Aun con una opinión firme sobre la news, la ejecución juega en tu contra. Una opción lógica: dividir el tamaño por 3 y duplicar el stop, o NO TRADE.",
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
    explanation: "El swing low se retestea muy a menudo antes de la continuación. Aquí, un stop sobre el low corre el riesgo de ser barrido por el ruido normal del retest. El trade aguantaría mejor con un stop bajo el swing low.",
    lessons: {
      beginner:     "Un stop se coloca más bien DETRÁS de la invalidación, con margen: colocarlo dentro o encima lo expone al ruido.",
      intermediate: "El retest del low aparece en una gran mayoría de los pullbacks. Por eso, un margen anti-ruido es muy recomendable.",
      advanced:     "Sin margen ATR detrás de la estructura, tu stop puede atraer liquidez. Estos niveles suelen ser el objetivo antes del movimiento real.",
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
    explanation: "Aquí, en medio del range: sin zona testeada, sin señal, sin catalizador. El R/R es malo (TP menor que el riesgo). Un range se opera más bien en sus bordes o en la ruptura.",
    lessons: {
      beginner:     "Sin señal, al trade le falta una razón de ser. Si no puedes explicarlo en una frase, NO TRADE suele ser la opción lógica.",
      intermediate: "El medio de un range suele suponer arriesgar 1R para unos 0,3R de ganancia. A la larga, esa cuenta juega en tu contra.",
      advanced:     "La disciplina cuenta más que la actividad. Forzar un trade en medio del range suele beneficiar a otros participantes, no a ti.",
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
    explanation: "El swing high es un objetivo evidente: ahí suele estar la liquidez de los vendedores atrapados. Aquí, un stop colocado justo encima puede atraer un sweep. Un margen por encima es una opción lógica.",
    lessons: {
      intermediate: "Los swing highs y lows suelen ser zonas de caza de liquidez. Pegar tu stop a ellos aumenta el riesgo de que te saquen.",
      advanced:     "Estos niveles suelen ser el objetivo para recoger liquidez. Un stop lógico se coloca más bien más allá de la zona de liquidez, no dentro.",
      beginner:     "Evita colocar tu stop justo sobre un swing evidente. Detrás de la zona, con margen, suele aguantar mejor.",
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
    explanation: "Con un R/R inferior a 1, incluso un 60 % de trades ganadores puede dejar una esperanza negativa. Un setup válido con un mal R/R sigue siendo aquí un trade discutible.",
    lessons: {
      intermediate: "La esperanza de un setup se calcula así: (proba de ganancia × ganancia) - (proba de pérdida × riesgo). Si el R/R está por debajo de 1, hace falta más de un 60 % de aciertos solo para quedar en equilibrio.",
      advanced:     "Muchos traders buscan un R/R de al menos 2:1 para absorber comisiones y períodos de drawdown. Por debajo de ese umbral, la ventaja estadística se reduce rápido.",
      beginner:     "Si arriesgas 100 € para ganar 50 €, te arriesgas a perder a largo plazo, aunque ganes a menudo.",
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
    explanation: "Una ruptura sin vela de momentum (cuerpo pequeño, justo sobre la resistencia) continúa bastante menos a menudo. Suele servir de cebo de liquidez.",
    lessons: {
      intermediate: "Una ruptura débil puede ser una trampa. Una opción lógica: esperar una continuación clara o un retest que aguante.",
      advanced:     "Los breakouts débiles suelen servir para absorber los stops situados sobre la resistencia, antes de un regreso en el sentido del HTF.",
      beginner:     "Un breakout real suele venir con una vela de fuerza visible. Si no, esperar tiene sentido.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "oversized_position",
    title: "Posición demasiado grande para la cuenta",
    category: "execution",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tomas este BUY en XAU/USD. Capital de la cuenta: 500€. Tamaño de posición elegido: lote que expone 250€ si se toca el SL. El setup técnico es correcto.",
    correctMistake: "oversized_position",
    decoyMistakes: ["stop_too_tight", "volatility_ignored", "bad_rr"],
    explanation: "Arriesgar el 50% del capital en una sola operación es extremadamente peligroso. Una sola pérdida corta la cuenta a la mitad, y para volver a 500€ habría que hacer después +100% sobre el capital restante.",
    lessons: {
      advanced:     "Referencia habitual entre pros: 0,5 a 2 % del capital por operación según el tamaño de la cuenta. Más allá del 5 %, uno se aleja del trading y se acerca a la apuesta.",
      intermediate: "El tamaño de posición es una variable clave del money management. Un setup correcto con un lote demasiado grande puede bastar para vaciar una cuenta. Referencia prudente: con 500€, no más del 5 % por operación (es decir, 25€ de riesgo).",
      beginner:     "Tabla de referencia: 5 % máx. en una cuenta de 200-500€, 3 % en 500-1000€, 2 % en 1000-5000€. El apalancamiento de tu broker importa poco; lo que cuenta es cuánto pierdes en euros si tocan tu SL.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Riesgo por operación: 50% del capital",
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
    explanation: "Con un spread x4 y una sesión ilíquida, el R/R real puede dividirse por dos aunque el setup funcione. Aquí, el stop puede saltar por el bid-ask y el TP se vuelve difícil de alcanzar.",
    lessons: {
      advanced:     "Muchos traders pro integran la ejecución en su edge. Con un spread x3 o más y poco volumen, NO TRADE suele ser la opción lógica.",
      intermediate: "El R/R en papel puede diferir del R/R real: aquí, el spread se come parte de tu ventaja.",
      beginner:     "Revisa la sesión y el spread antes de hacer click. En horas muertas, NO TRADE suele ser la opción lógica.",
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
    decoyMistakes: ["stop_too_tight", "bad_rr", "oversized_position"],
    explanation: "En volatilidad alta, el ruido normal puede ser 2 o 3 veces más amplio. Aquí, un stop 'normal' queda dentro de ese ruido amplificado y corre el riesgo de ser barrido antes de que el trade prospere.",
    lessons: {
      advanced:     "El stop funciona mejor si se adapta al ATR del momento en lugar de a una distancia fija. En volatilidad alta, ampliar el stop Y el TP proporcionalmente es una opción lógica.",
      intermediate: "Si la volatilidad se duplica, suele hacer falta un stop dos veces más amplio. Si no, tu stop puede convertirse en una trampa.",
      beginner:     "Cuanto más fuerte se mueve el mercado, más espacio necesita tu stop.",
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
    explanation: "Comprar el techo de un pump suele suponer entrar donde otros recogen beneficios. Aquí, el R/R es malo (TP lejano, stop corto) y un retroceso es probable a corto plazo.",
    lessons: {
      intermediate: "Los pumps verticales suelen retroceder buena parte del movimiento (del 38 al 61 %). Un BUY en el techo puede acabar rápido en pérdida.",
      advanced:     "El FOMO puede señalar un exceso. Aquí, la ventaja está más bien en ESPERAR el retroceso que en perseguir el precio.",
      beginner:     "Si tomas un trade por miedo a 'perdértelo', suele ser el momento de NO tomarlo.",
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
    explanation: "El setup puede ser válido, pero aquí tu decisión parece guiada por las ganas de recuperar pérdidas más que por el análisis. Es una de las trampas emocionales más frecuentes.",
    lessons: {
      intermediate: "Tras 2 stops, una pausa (15-30 min) es una opción lógica. Bajo el peso de las pérdidas, las decisiones tienden a estar sesgadas.",
      advanced:     "Los trades de revancha suelen salir peor que la media del mismo trader. Una pausa ayuda a recuperar la objetividad.",
      beginner:     "Si operas para 'recuperar', te arriesgas a apostar en lugar de operar.",
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
    explanation: "Aquí, el sweep acaba de producirse y puede señalar una reversión alcista. Un SELL supone vender el suelo que los compradores acaban de usar para entrar: la lectura parece invertida.",
    lessons: {
      advanced:     "Pattern ICT clásico: el sweep toma la liquidez antes de la continuación HTF. Aquí, un BUY en el giro tiene más sentido que un SELL.",
      intermediate: "Una mecha grande que barre un nivel y vuelve puede señalar una reversión probable. Aquí, vender supone leer el gráfico al revés.",
      beginner:     "Evita vender un suelo que acaba de ser 'comido' por una mecha. Buscar el rebote suele ser más lógico.",
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
    explanation: "Aquí, una mitigación profunda sin reacción puede señalar un FVG agotado: los compradores ya no parecen defender la zona. Un BUY supondría esperar más que seguir una señal.",
    lessons: {
      advanced:     "Un FVG mitigado más del 75 % sin reacción visible suele perder su ventaja. Dos opciones lógicas: esperar una ruptura para un SELL, o NO TRADE.",
      intermediate: "Una zona testeada en profundidad suele perder fuerza. El 1er y 2º test ofrecen en general más ventaja que un test profundo.",
      beginner:     "Si una zona tarda en reaccionar, suele perder fuerza. En este caso, mejor esperar la siguiente.",
    },
    difficulties: ["advanced"],
    showLines: "buy_entry",
  },
  {
    id: "risk_not_reduced_news",
    title: "Lote habitual antes de news mayor",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "14h20. NFP en 10 minutos. Entras en BUY en EUR/USD con tu tamaño de lote habitual. El setup técnico es correcto.",
    correctMistake: "risk_not_reduced_news",
    decoyMistakes: ["stop_too_tight", "oversized_position", "bad_rr"],
    explanation: "En una news mayor (NFP, FOMC, CPI), el spread puede ampliarse x5 a x10, y un movimiento instantáneo puede saltar el SL. Una práctica habitual: dividir el tamaño del lote por 2 o 3 en los 30 minutos alrededor de una news roja, o no operar.",
    lessons: {
      advanced:     "Muchos actores reducen su exposición antes de las news por esta razón: la price action puede volverse binaria e impredecible. Mantener un tamaño normal supone entonces apostar al azar.",
      intermediate: "Una news mayor puede mover un par 50-100 pips en un segundo. Tu SL se vuelve teórico si el slippage te saca 20-30 pips más lejos. Reducir el tamaño protege tu cuenta.",
      beginner:     "Antes de un NFP, un FOMC o un CPI, una opción lógica: dividir tu lote por 2 o 3, o esperar a que pase la news. El mercado puede agitarse y tus stops podrían no aguantar como de costumbre.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "NFP a las 14h30 · lote 1,00",
    showLines: "buy_entry",
  },
  {
    id: "position_held_through_event",
    title: "Posición dejada abierta durante FOMC",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Tienes un BUY abierto en XAU/USD desde las 19h55. FOMC en 5 minutos (anuncio + conferencia Powell durante 1h). Decides dejarlo correr con tu lote y tu SL habituales.",
    correctMistake: "position_held_through_event",
    decoyMistakes: ["stop_too_tight", "oversized_position", "trade_before_news"],
    explanation: "En un FOMC seguido de la conferencia de Powell, XAU puede moverse 50-100$ en pocos minutos. Tu SL estándar puede ser atravesado con slippage. Cerrar la posición, reducir el lote o ampliar mucho el SL son tres opciones lógicas.",
    lessons: {
      advanced:     "Los gestores de riesgo suelen reducir la exposición antes de un evento capaz de mover los precios. Durante Powell, incluso un buen setup puede ser barrido por una frase mal interpretada.",
      intermediate: "Una posición abierta durante un evento macro se convierte en una apuesta binaria. Frente a un titular fuerte, el setup técnico pesa poco. Salir, o aceptar ese riesgo a conciencia: te toca decidir según tu plan.",
      beginner:     "Antes de un FOMC o una conferencia de banco central, cerrar tu posición o reducirla mucho son dos opciones lógicas. El mercado puede moverse mucho más de lo que prevén tus cálculos técnicos.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "FOMC a las 20h00 · BUY abierto desde las 19h55",
    showLines: "buy_entry",
  },
  {
    id: "size_not_adapted_to_vol",
    title: "Lote habitual en volatilidad duplicada",
    category: "execution",
    chartShape: "high_vol_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "ATR diario en XAU/USD a 80$ contra 35$ habitualmente (volatilidad x2,3). Tomas este SELL con tu tamaño de lote habitual y tu SL estándar de 30$.",
    correctMistake: "size_not_adapted_to_vol",
    decoyMistakes: ["stop_too_tight", "oversized_position", "bad_rr"],
    explanation: "Cuando la volatilidad se duplica, tu riesgo efectivo también se duplica si el tamaño del lote no cambia. Un SL de 30$ que aguantaba con un ATR de 35$ puede saltar fácilmente con un ATR de 80$. Adaptar el tamaño a la volatilidad es un principio básico del risk management.",
    lessons: {
      advanced:     "El position sizing dinámico se calcula sobre el ATR: tamaño ≈ (capital × riesgo %) / (ATR × multiplicador SL). Cuando el ATR se duplica, dividir el tamaño por 2 permite conservar el mismo riesgo.",
      intermediate: "Muchos traders ajustan su lote a la volatilidad del día. Con un ATR dos veces superior a lo normal, dividir el lote por 2 o duplicar el SL son dos opciones. Si no, el riesgo real puede escaparse de tu control.",
      beginner:     "Cuando el mercado se mueve más de lo habitual, reducir tu tamaño de lote es una opción lógica. Si no, tu stop puede saltar con demasiada facilidad. La idea: un tamaño adaptado a la volatilidad, no a la intuición.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "ATR 80 $ (media 35 $) · lote 1,00 · SL 30 $",
    showLines: "sell_entry",
  },
  {
    id: "weekend_gap_exposure",
    title: "Posición FX abierta antes del fin de semana",
    category: "timing",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Viernes 22h45, cierre del forex en 15 minutos. Abres un BUY en EUR/USD con tu tamaño de lote habitual. El setup es válido.",
    correctMistake: "weekend_gap_exposure",
    decoyMistakes: ["stop_too_tight", "oversized_position", "trade_before_news"],
    explanation: "El fin de semana, los mercados FX están cerrados, pero la actualidad sigue. Una news geopolítica mayor (declaración de banco central, conflicto, elección) puede crear un gap en la apertura del domingo y saltar tu SL de 50 a 200 pips. El slippage del fin de semana escapa a tu control.",
    lessons: {
      advanced:     "Muchos fondos reducen sus posiciones FX direccionales antes del cierre del viernes, o se cubren con opciones. Mantener una exposición sin cobertura durante el fin de semana supone apostar por la actualidad geopolítica.",
      intermediate: "Antes de un fin de semana, dos opciones lógicas: salir de tus posiciones o reducir mucho el tamaño. El gap de apertura del domingo puede ser brutal, y tu SL no te protege mientras el mercado está cerrado.",
      beginner:     "El viernes por la noche, cerrar tus posiciones o reducir su tamaño es una opción lógica. Durante el fin de semana, el mercado está cerrado pero el mundo se mueve. El lunes por la mañana, el precio puede saltar directamente al otro lado de tu stop.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Viernes 22h45 · cierre del forex a las 23h00",
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
