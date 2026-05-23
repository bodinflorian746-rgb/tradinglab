// Mini-juego BUY / SELL / NO TRADE — V2 (traducción ES LATAM).
//
// Espejo del módulo FR con strings de cara al usuario traducidas.
// La lógica, los tipos, las semillas y los valores numéricos se reexportan
// del módulo original.

import {
  type Difficulty,
  type GameChoice,
  type SetupKey,
  type Metric,
  type ScenarioTemplate,
  type ScenarioInstance,
  type ChoiceRationales,
  type DifficultyLessons,
  type BuySellChart,
  type ScoreResult,
  ROUNDS_PER_SESSION,
  SCENARIO_TEMPLATES as FR_TEMPLATES,
  buildChart as buildChartFr,
  generateScenarios as generateScenariosFr,
  scoreChoice,
  mulberry32,
} from "./buy-sell-no-trade";
import type { ChartZone } from "./shared";

// Reexports de tipos / utilidades
export type {
  Difficulty,
  GameChoice,
  SetupKey,
  Metric,
  ScenarioTemplate,
  ScenarioInstance,
  ChoiceRationales,
  DifficultyLessons,
  BuySellChart,
  ScoreResult,
};
export type {
  Asset,
  Session,
  Volatility,
  Spread,
  HtfBias,
  MacroContext,
  Candle,
  ChartZone,
  ZoneKind,
} from "./buy-sell-no-trade";

export { ROUNDS_PER_SESSION, scoreChoice, mulberry32 };

// ─── Tabla de traducción para etiquetas de zonas ─────────────────────────────

const ZONE_LABEL_ES: Record<string, string> = {
  "Résistance":           "Resistencia",
  "Support":              "Soporte",
  "Résistance HTF":       "Resistencia HTF",
  "Support HTF":          "Soporte HTF",
  "Zone de demande":      "Zona de demanda",
  "Zone d'offre":         "Zona de oferta",
  "Précédent low":        "Low previo",
  "Précédent high":       "High previo",
  "Liquidité au-dessus":  "Liquidez arriba",
  "Liquidité en-dessous": "Liquidez abajo",
  "Liquidité balayée":    "Liquidez barrida",
  "FVG haussier":         "FVG alcista",
  "Plafond range":        "Techo del rango",
  "Plancher range":       "Piso del rango",
  "Sweep haut":           "Sweep arriba",
  "Sweep bas":            "Sweep abajo",
  "Niveau secondaire":    "Nivel secundario",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_ES[z.label] ?? z.label }));
}

// Wrapper de buildChart que traduce las etiquetas de zonas.
export function buildChart(
  setup: SetupKey,
  seed: number,
  volatility: ScenarioInstance["volatility"] = "normale",
  difficulty: Difficulty = "intermediate",
): BuySellChart {
  const chart = buildChartFr(setup, seed, volatility, difficulty);
  return { ...chart, zones: translateZones(chart.zones) };
}

// ─── Templates ES ─────────────────────────────────────────────────────────────

export const SCENARIO_TEMPLATES_ES: ScenarioTemplate[] = [
  {
    id: "breakout_bullish_clean",
    title: "Breakout alcista limpio",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "El precio consolida bajo una resistencia mayor y acaba de romperla con una vela de fuerza.",
    rationales: {
      BUY: "✓ El HTF es alcista y el breakout está alineado. La resistencia se rompió con una vela de fuerza — es el escenario textbook de continuación. BUY es la lectura lógica del mercado.",
      SELL: "✗ Vender frente a un breakout alcista en HTF alcista = ponerte a contracorriente sin señal de reversión. Es un trade típicamente emocional.",
      NO_TRADE: "✗ El setup está completo: breakout, HTF alineado, contexto macro sin peligro. Pasar de turno aquí es perder el edge — no es disciplina.",
    },
    lessons: {
      beginner:     "Regla simple: un breakout en el sentido del HTF, sin peligro macro, es un trade. Sin más complicaciones.",
      intermediate: "Cuando HTF, estructura y contexto se alinean, el edge es estadístico. No operar esta config = dejar dinero sobre la mesa.",
      advanced:     "Los setups de alineación clean como este son raros. Cuando aparecen — full size, sin dudas.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lectura", "breakout", "alineación HTF"],
  },
  {
    id: "breakout_bearish_clean",
    title: "Breakout bajista limpio",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "El precio consolida sobre un soporte mayor y acaba de romperlo con una vela de fuerza.",
    rationales: {
      BUY: "✗ Comprar una ruptura de soporte en HTF bajista = peleas contra el mercado. No hay señal de reversión, solo aceleración bajista.",
      SELL: "✓ Breakdown limpio en el sentido del HTF bajista — momentum del lado vendedor. SELL es la lectura correcta.",
      NO_TRADE: "✗ HTF alineado + ruptura limpia + sin news: la config está completa. Pasar de turno aquí no es prudencia.",
    },
    lessons: {
      beginner:     "El espejo del breakout alcista: HTF bajista + soporte roto = SELL.",
      intermediate: "Estadística de continuación tras una ruptura limpia alineada con HTF: ~65-70%. Toma el trade.",
      advanced:     "Si el breakout es demasiado obvio, ojo con el retest. Pero con HTF alineado y estructura clara, full size, stop sobre el soporte roto.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lectura", "breakout", "alineación HTF"],
  },
  {
    id: "false_breakout_bullish",
    title: "Breakout alcista sospechoso",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "piege",
    context: "El precio acaba de romper sobre una resistencia — pero el HTF sigue bajista. La ruptura parece sospechosa.",
    rationales: {
      BUY: "✗ Sigues el breakout sin mirar el HTF. Una ruptura alcista en HTF bajista tiene 60-70% de probabilidad de ser una trampa de liquidity. Así es como cazan a los retails.",
      SELL: "✓ HTF bajista + breakout contra-tendencia = setup de fakeout. La liquidity arriba de la resistencia es el combustible de los shorts institucionales. SELL después de la trampa.",
      NO_TRADE: "≈ No es una catástrofe (esquivas la trampa), pero el HTF bajista + señal contra-tendencia dan un edge claro del lado SELL. Un trader confirmado lo toma.",
    },
    lessons: {
      beginner:     "Regla de oro: un breakout EN CONTRA del HTF casi siempre es una trampa. Si HTF bajista + breakout alcista → quédate fuera o busca el SELL.",
      intermediate: "La trampa clásica. Los institucionales crean la ruptura para absorber la liquidity de los stops shorts arriba de la resistencia, y luego empujan en el sentido del HTF.",
      advanced:     "No tienes confirmación del wick rejection aquí — decides ANTES. Si HTF + macro lo permiten, anticipar el fakeout es un edge mayor. Si no, NO TRADE.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["trampa", "fakeout", "liquidity"],
  },
  {
    id: "false_breakout_bearish",
    title: "Breakout bajista sospechoso",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "El precio acaba de romper bajo un soporte — pero el HTF sigue alcista. La ruptura parece una trampa.",
    rationales: {
      BUY: "✓ HTF alcista + breakout bajista contra-tendencia = trampa clásica. La liquidity bajo el soporte se recoge para preparar el movimiento alcista. BUY el regreso.",
      SELL: "✗ Vender en ruptura contra el HTF es unirte a los retails atrapados. Estadísticamente, estos fakeouts regresan en el sentido del HTF en 60-70% de los casos.",
      NO_TRADE: "≈ Evitas la pérdida pero te pierdes la oportunidad. El contra-pie del fakeout es un edge institucional.",
    },
    lessons: {
      beginner:     "Ruptura EN CONTRA del HTF = trampa sospechosa. Nunca vendas una ruptura bajista en un mercado alcista.",
      intermediate: "Stop hunt sobre los soportes = señal de reversión alcista si HTF alineado. El mercado acaba de recargar combustible para empujar al norte.",
      advanced:     "Decide ANTES del regreso del precio sobre el soporte. Si HTF + estructura alineados, BUY. Si dudas, NO TRADE.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["trampa", "fakeout", "liquidity"],
  },
  {
    id: "pullback_bullish_trend",
    title: "Pullback en tendencia alcista",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Tendencia alcista establecida, el precio corrige hacia una zona de demanda visible.",
    rationales: {
      BUY: "✓ Pullback dentro de una tendencia = oportunidad de compra a mejor precio. Te sumas a la tendencia en lugar de perseguirla. RR optimizado.",
      SELL: "✗ Vender en un uptrend es remar contra la corriente. Los pullbacks son oportunidades de compra, no de venta.",
      NO_TRADE: "≈ Conservador, pero la config está limpia. La disciplina es TOMAR los buenos trades, no esquivarlos todos.",
    },
    lessons: {
      beginner:     "Una tendencia se compra en los retrocesos. No al revés. Es el trade más rentable del mercado.",
      intermediate: "El pullback en el sentido del HTF, sobre una zona de demanda visible, es estadísticamente uno de los mejores setups disponibles.",
      advanced:     "Profundidad del pullback ≠ invalidación. Mientras el HTF aguante y la estructura no se rompa, el pullback es una oportunidad.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lectura", "pullback", "trend"],
  },
  {
    id: "pullback_bearish_trend",
    title: "Pullback en tendencia bajista",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Tendencia bajista establecida, el precio rebota hacia una zona de oferta.",
    rationales: {
      BUY: "✗ Comprar el rebote en un downtrend = buscar el fondo con pinza. Estadísticamente perdedor.",
      SELL: "✓ El rebote lleva al precio sobre una zona de oferta visible. Vender en el sentido del HTF bajista al mejor precio.",
      NO_TRADE: "≈ No está mal, pero el HTF y la zona están alineados. La disciplina es filtrar trades, no esquivarlos todos.",
    },
    lessons: {
      beginner:     "Tendencia bajista → se buscan los rebotes para vender. No se compra pensando que va a subir.",
      intermediate: "Pullback sobre zona de oferta en un downtrend = setup de alta probabilidad. No tomarlo es dejar el edge en la mesa.",
      advanced:     "Si la zona de oferta se retestea limpia y HTF intacto, el SELL es estadístico. Si la estructura se rompe durante el pullback, NO TRADE.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lectura", "pullback", "trend"],
  },
  {
    id: "rejection_resistance",
    title: "Test de resistencia mayor",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "El precio acaba de llegar a una resistencia mayor tras un rally. La zona ya rechazó varias veces.",
    rationales: {
      BUY: "✗ Comprar bajo una resistencia mayor en HTF bajista es esperar que EL nivel que rechaza siempre no rechace esta vez.",
      SELL: "✓ Zona defendida por los vendedores + HTF bajista = setup de reversión. SELL con stop sobre la zona.",
      NO_TRADE: "≈ Si esperas una confirmación extra, ok. Pero HTF + zona alineados normalmente alcanza.",
    },
    lessons: {
      beginner:     "Resistencia mayor + HTF bajista → SELL en el próximo test. El mercado te da dos razones para ir en el mismo sentido.",
      intermediate: "Las zonas HTF aguantan más que las zonas LTF. Estadística de rechazo en resistencia mayor HTF: 55-65% en el primer test.",
      advanced:     "Si la zona ya se testeó 3+ veces, ojo con la ruptura (cada test debilita el nivel). En 1-2 tests en el sentido del HTF, full size.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lectura", "rechazo", "resistencia"],
  },
  {
    id: "bounce_support",
    title: "Test de soporte mayor",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "El precio acaba de llegar a un soporte mayor tras una corrección. La zona ya aguantó varias veces.",
    rationales: {
      BUY: "✓ Soporte mayor + HTF alcista = zona de compra. Los compradores defienden el nivel, el contexto está alineado. BUY con stop bajo la zona.",
      SELL: "✗ Vender bajo un soporte mayor defendido en HTF alcista es posicionarte contra el edge. A evitar.",
      NO_TRADE: "≈ No está mal esperar confirmación, pero el HTF + zona normalmente dan la señal.",
    },
    lessons: {
      beginner:     "Soporte mayor + HTF alcista → BUY. Simétrico al rechazo de resistencia.",
      intermediate: "Las zonas HTF aguantan más de lo que se rompen (en el primer test). Es la asimetría la que crea el edge.",
      advanced:     "Opera los soportes HTF testeados 1-2 veces como máximo. Más allá, el nivel se debilita y el break-and-retest pasa a ser el escenario probable.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lectura", "soporte", "rebote"],
  },
  {
    id: "liquidity_sweep_reversal",
    title: "Sweep de liquidity",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "El precio acaba de barrer la liquidity bajo el low previo con un wick grande, y cerró arriba.",
    rationales: {
      BUY: "✓ El sweep tomó la liquidity de los shorts atrapados. Ahora el institucional tiene combustible para empujar al alza. BUY el giro.",
      SELL: "✗ Vender DESPUÉS del sweep es vender exactamente donde el institucional compra. Te unes a los retails atrapados.",
      NO_TRADE: "≈ Si no tienes confirmación post-sweep, NO TRADE es defensivo. Pero el wick + close arriba del nivel = señal válida.",
    },
    lessons: {
      beginner:     "Un wick grande que barre una zona y se gira = reversión probable. No vendas el piso, cómpralo.",
      intermediate: "Pattern ICT clásico: toma de liquidity antes de continuación HTF. El sweep es el disparador de entrada.",
      advanced:     "Espera la confirmación post-sweep (close sobre el nivel roto + estructura alcista). Sin confirmación, anticipar = riesgo mayor.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["trampa", "liquidity", "sweep"],
  },
  {
    id: "fvg_reaction",
    title: "FVG alcista retesteado",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Un FVG alcista quedó tras el impulso. El precio vuelve a testearlo por primera vez.",
    rationales: {
      BUY: "✓ FVG alcista + HTF alineado + primer retest = zona de demanda institucional. Setup clásico ICT.",
      SELL: "✗ Vender un FVG alcista no invalidado es ponerte contra la zona que los institucionales protegen.",
      NO_TRADE: "≈ Si dudas de la mitigation, esperar la reacción es válido. Pero HTF alineado + zona fresh = edge.",
    },
    lessons: {
      beginner:     "El FVG actúa como imán de precio y luego como zona de demanda en el retest. Si HTF alineado → BUY.",
      intermediate: "Una zona totalmente llenada no necesariamente queda invalidada. La reacción en el retest es la señal real. Si hay reacción + HTF alineado → BUY.",
      advanced:     "Distingue: mitigation parcial (zona fresh) → BUY de alta proba. Mitigation profunda (>75%) + pérdida de reacción → NO TRADE o reversión.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["lectura", "FVG", "imbalance"],
  },
  {
    id: "trade_before_news",
    title: "News macro inminente",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "dangereux",
    metric: "discipline",
    context: "Una news macro mayor (NFP / FOMC / CPI) se espera en menos de 30 minutos. El order book está nervioso.",
    rationales: {
      BUY: "✗ Operar 30 min antes de un NFP = tirar tu edge a la basura. Spread x3-x5, slippage masivo, tu stop salta sin importar la dirección. Ningún setup te salva.",
      SELL: "✗ Mismo problema: el sentido no cuenta, son la VOLATILIDAD y el SPREAD los que te destruyen. Tu TP es válido pero tu stop va a explotar.",
      NO_TRADE: "✓ Decisión pro. Sin trade = sin pérdida. La news pasa, el mercado recupera estructura, vuelves en 1h sobre un gráfico legible.",
    },
    lessons: {
      beginner:     "Regla absoluta: nada de trades en los 30 min antes Y 15 min después de una news mayor. Sin excepciones.",
      intermediate: "El spread puede triplicarse, tu SL salta por bid-ask, y la estadística del setup ya no aplica a un mercado ilíquido. La espera es el trade.",
      advanced:     "Aun teniendo una opinión sobre el resultado de la news, la volatilidad de ejecución es tu enemigo. Si DEBES operar, position size /3 y stop x2. Si no, NO TRADE.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["disciplina", "macro", "news"],
  },
  {
    id: "range_no_opp",
    title: "Range sin señal",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "El precio oscila en medio de un range, sin test de zona ni catalizador visible.",
    rationales: {
      BUY: "✗ Comprar en medio de un range = sin edge. Sin soporte testeado, sin señal, sin catalizador. Asumes el riesgo sin la razón.",
      SELL: "✗ Lo mismo del lado short: sin resistencia testeada, sin señal. Gambling puro.",
      NO_TRADE: "✓ El mercado te dice 'nada que ver aquí'. Los buenos trades llegarán en los bordes del range o en la ruptura. Paciencia.",
    },
    lessons: {
      beginner:     "Si no puedes explicar en 1 frase por qué existe el trade, no existe. NO TRADE.",
      intermediate: "Operar el medio de un range = pedir riesgo de 1R para 0.3R de reward. El range se opera en los bordes.",
      advanced:     "Disciplina > actividad. Un trader pro hará 2-5 trades por semana. No operar también es una decisión activa.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["disciplina", "range", "paciencia"],
  },
  // ─── V3 — setups realistas trampa mental ─────────────────────────────────────
  {
    id: "weak_breakout",
    title: "Ruptura sin convicción",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "El precio acaba de romper sobre la resistencia, pero a la vela de fuerza le falta body cruelmente.",
    shortContext: "Ruptura alcista — body muy débil.",
    rationales: {
      BUY: "✗ Persigues una ruptura débil. Sin vela de momentum nítida, la estadística de continuación cae a ~35%. Mal R/R esperado.",
      SELL: "✗ Vender una ruptura alcista sin señal de reversión = prematuro. No tienes ni reversal candle ni estructura bajista.",
      NO_TRADE: "✓ Una ruptura debe imponerse para ser operable. Sin vela de fuerza, se espera o un retest limpio o un follow-through claro. Paciencia.",
    },
    lessons: {
      beginner:     "Una vela grande que rompe una zona = señal. Una vela chica que rompe apenas = no es señal.",
      intermediate: "El mercado no te debe una señal limpia en cada ruptura. Si falta convicción, no tienes obligación de entrar.",
      advanced:     "Una ruptura sin body suele ser cebo de liquidity. Los institucionales crean estos breakouts débiles para atrapar a los retails impacientes. NO TRADE y observas.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["disciplina", "breakout", "momentum"],
  },
  {
    id: "fvg_overmitigated",
    title: "FVG casi invalidado",
    correctAnswer: "NO_TRADE",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "El FVG alcista se mitigó en 85%+ de su altura. La reacción se demora — los compradores ya no defienden la zona.",
    shortContext: "FVG mitigado al 85%+, sin reacción.",
    rationales: {
      BUY: "✗ Le rezas al rebote. Una mitigation profunda sin reacción = FVG muerto. Los compradores institucionales ya no defienden la zona.",
      SELL: "✗ Prematuro: aún sin ruptura estructural confirmada. Shorteas la esperanza, no una señal.",
      NO_TRADE: "✓ Edge insuficiente. Espera o un rechazo claro del fondo del FVG (BUY confirmado), o una ruptura estructural (SELL confirmado).",
    },
    lessons: {
      beginner:     "Si una zona tarda en reaccionar, pierde su edge. Mejor esperar la próxima.",
      intermediate: "Una zona profundamente mitigada pierde estadísticamente su edge. Si la reacción no llega en 2-3 velas, la zona está cocida.",
      advanced:     "FVG mitigado 80%+ sin reacción = caza la ruptura bajista para SELL. Pero sin la ruptura → NO TRADE.",
    },
    difficulties: ["advanced"],
    tags: ["lectura", "FVG", "mitigation"],
  },
  {
    id: "counter_trend_bounce",
    title: "Rebote local contra HTF",
    correctAnswer: "NO_TRADE",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "discipline",
    context: "HTF bajista nítido. El precio rebota localmente sobre un nivel secundario — pero la tendencia sigue en contra tuya.",
    shortContext: "Rebote local en un downtrend HTF.",
    rationales: {
      BUY: "✗ Operar contra la tendencia HTF apostando a un nivel secundario = jugar a 30-40% de proba. La estadística está en tu contra antes incluso de hacer click.",
      SELL: "✗ No es el momento: el rebote local no mostró signos de agotamiento. Si shorteas aquí, 2-3 velas verdes pueden sacarte antes de la reanudación.",
      NO_TRADE: "✓ Setup local válido PERO contra HTF = sin edge. Esperar el agotamiento del rebote Y una zona HTF clara para shortear.",
    },
    lessons: {
      beginner:     "HTF bajista = buscas los SELL, nunca los BUY contra la tendencia.",
      intermediate: "Un setup local nunca borra la tendencia HTF. Si el HTF dice no, no dices sí — aunque la zona local aguante.",
      advanced:     "Los rebotes en un downtrend son oportunidades de SHORT, no de BUY. Pero hay que esperar el timing — aquí muy temprano, sin wick de rechazo sobre resistencia HTF.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["disciplina", "HTF", "contra-tendencia"],
  },
  {
    id: "dirty_range_sweep",
    title: "Range con sweeps de los dos lados",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "El precio acaba de barrer la liquidity de los dos bordes del range. Ninguna dirección clara — la acumulación institucional es invisible.",
    shortContext: "Range con sweep de los dos bordes.",
    rationales: {
      BUY: "✗ Sin señal long. El sweep reciente del techo neutraliza la zona baja como soporte confiable. Sin edge.",
      SELL: "✗ Simétrico: el sweep reciente del piso neutraliza la zona alta. El mercado se limpió de los dos lados.",
      NO_TRADE: "✓ Range sucio = sin estructura explotable. Espera una ruptura confirmada O una acumulación reconocible.",
    },
    lessons: {
      intermediate: "Cuando un range hizo sweep de los dos lados sin dirección, esperas la salida. No negociable.",
      advanced:     "El doble sweep es acumulación institucional invisible. El buen trader espera la salida del range. Lo peor es jugar al ping-pong.",
      beginner:     "Si ves wicks grandes arriba Y abajo, y el precio está en el medio, NO TRADE.",
    },
    difficulties: ["advanced"],
    tags: ["disciplina", "range", "sweep"],
  },
  {
    id: "setup_toxic_execution",
    title: "Setup limpio, ejecución tóxica",
    correctAnswer: "NO_TRADE",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "discipline",
    context: "Setup técnico válido — pero el contexto de ejecución es desfavorable: spread alto, sesión muerta, volatilidad ausente. El R/R real se divide por 2.",
    shortContext: "Setup limpio, pero spread alto en sesión muerta.",
    rationales: {
      BUY: "✗ La señal es buena pero el contexto mata el R/R. Spread alto + sesión muerta = tu stop salta por bid-ask, tu TP queda inalcanzable. La técnica gana, la ejecución pierde.",
      SELL: "✗ Contra-HTF además del contexto de ejecución ya tóxico. Doble error: operas contra la tendencia Y en malas condiciones de liquidity.",
      NO_TRADE: "✓ Decisión pro. El mismo setup volverá a aparecer en sesión Londres o NY con un spread limpio. No pierdes nada esperando.",
    },
    lessons: {
      intermediate: "Un buen setup en malas condiciones de ejecución NO es un buen trade. Técnica Y ejecución deben estar alineadas.",
      advanced:     "Spread x3 + volumen muerto = tu R/R real dividido por 2 aunque el setup funcione. Un trader pro integra siempre la ejecución en su edge.",
      beginner:     "Revisa sesión + spread ANTES de hacer click. Un setup en heures mortes (horas muertas) suele equivaler a NO TRADE.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["disciplina", "execution", "spread"],
    metaOverride: {
      session:    "Heures mortes",
      volatility: "faible",
      spread:     "élevé",
    },
  },
];

// Alias canónico para que la página pueda importar SCENARIO_TEMPLATES igual que en FR.
export const SCENARIO_TEMPLATES = SCENARIO_TEMPLATES_ES;

// ─── generateScenarios ES ─────────────────────────────────────────────────────
// Re-uso de la lógica FR pero remapeando los campos de texto al template ES por id.
// Así, mismos seeds = mismos escenarios (mismos asset/session/etc).

export function generateScenarios(seed: number, difficulty: Difficulty = "intermediate"): ScenarioInstance[] {
  const frInstances = generateScenariosFr(seed, difficulty);
  // Tomamos del template ES por id, conservando los meta (asset/session/volatility/spread/seed/difficulty)
  return frInstances.map((inst) => {
    const esTpl = SCENARIO_TEMPLATES_ES.find((t) => t.id === inst.id);
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

// ─── DIFFICULTY_META ES ───────────────────────────────────────────────────────

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Principiante",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Señales claras, contexto guiado, pocas trampas. Para fijar las asociaciones.",
  },
  intermediate: {
    label:       "Intermedio",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Contexto ambiguo, fakeouts posibles, varias lecturas plausibles. Interpretación.",
  },
  advanced: {
    label:       "Avanzado",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Trampas, liquidity, sweeps, NO TRADE frecuente. Decisión antes de la confirmación final.",
  },
};

// Re-export FR_TEMPLATES bajo otro nombre por si algún consumidor quiere comparar.
export { FR_TEMPLATES as SCENARIO_TEMPLATES_FR };
