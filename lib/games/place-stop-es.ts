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
import type { MarketCtx } from "./candle-realism";
export { withAssetPrices } from "./place-stop";

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
    context: "Tendencia alcista, el precio corrige en la zona de demand. Entraste al rebote.",
    shortContext: "Pullback BUY en un uptrend.",
    lessons: {
      beginner:     "El stop lógico se coloca más bien DETRÁS del swing low, con margen: dentro, queda en el ruido; demasiado lejos, degrada el R/R.",
      intermediate: "El ruido del pullback suele retestear el low antes de la continuación. Aquí, un margen detrás del low protege contra ese sweep clásico.",
      advanced:     "Aquí, el stop lógico cumple 3 condiciones: detrás del low, fuera del ruido del mercado (más allá de la volatilidad del día, medida por el ATR, la amplitud media de una jornada), y un R/R de al menos 2. Es el único de los tres que las cumple todas.",
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
    context: "Tendencia bajista, el precio rebota en una zona de supply. Entraste en corto.",
    shortContext: "Pullback SELL en un downtrend.",
    lessons: {
      beginner:     "El stop lógico se coloca más bien POR ENCIMA del swing high, con margen: por debajo, queda expuesto; demasiado lejos, degrada el R/R.",
      intermediate: "El rebote puede retestear su high antes de caer. Pegar el stop al high te expone aquí claramente a un stop hunt.",
      advanced:     "Un stop que cubre la mecha del high, con un margen a la medida de la volatilidad del día (ATR, la amplitud media de una jornada), es una opción lógica. Justo en el nivel, puede quedar atrapado; demasiado lejos, degrada el R/R.",
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
      beginner:     "Un stop bajo el soporte, con un margen realista, tiene sentido. Justo en el soporte, puede ser barrido por la caza de liquidity.",
      intermediate: "Un soporte HTF suele atraer un test profundo antes de la reacción real. Aquí, el margen protege contra esa stop hunt.",
      advanced:     "Una distancia de 1 a 1,5 veces la amplitud media de una jornada (ATR) bajo el nivel suele ser una buena referencia. Más corto, el stop queda en el ruido; más lejos, inmoviliza capital.",
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
      beginner:     "Un stop sobre la mecha más alta, con margen, es una opción lógica. Pegarse al nivel te expone claramente a un stop hunt.",
      intermediate: "Los retests de resistencia HTF suelen ser engañosos. Aquí, un margen detrás de la mecha es muy recomendable.",
      advanced:     "Aquí, la mecha del rechazo más una amplitud media de una jornada (1 ATR) dibuja una zona limpia. Pegarse a la mecha expone al 2º test; demasiado lejos, el R/R se degrada.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lectura",
  },
  {
    id: "fakeout_above_resistance",
    title: "Fakeout : short tras rechazo",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "El precio pinchó sobre la resistencia y luego cerró debajo. Vendes la trampa.",
    shortContext: "SELL tras fakeout.",
    lessons: {
      intermediate: "Un stop sobre el PICO del fakeout (más que dentro) es una opción lógica: aquí, el pico marca la invalidación real de la trampa.",
      advanced:     "Un stop POR ENCIMA del high de la mecha, con un margen a la medida de la volatilidad del día (ATR, la amplitud media de una jornada), tiene sentido. Pegarse al high expone al retest del fakeout; dentro de la trampa, el stop sale caro.",
      beginner:     "Aquí, el stop funciona mejor si cubre la mecha del fakeout. Un stop colocado en la zona de la trampa tiene muchas probabilidades de ser tocado.",
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
    context: "El precio acaba de barrer la liquidity bajo el último mínimo y luego dio media vuelta.",
    shortContext: "BUY tras sweep low.",
    lessons: {
      intermediate: "Un stop bajo el LOW del sweep, más que en la zona que acaba de ser tomada, es una opción lógica. Aquí, el sweep pasa a ser la nueva invalidación.",
      advanced:     "Un stop bajo la mecha del sweep, con margen, tiene sentido. Justo en el low del sweep, un retest es probable; dentro de la zona de liquidity, la trampa es completa.",
      beginner:     "Aquí, el mercado acaba de pinchar una zona: tu stop tiene más probabilidades de aguantar BAJO esa zona que dentro.",
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
      intermediate: "Un stop bajo el BAJO del FVG es una opción lógica. Dentro del FVG, queda expuesto a un retest profundo; demasiado lejos, el R/R se vuelve frágil.",
      advanced:     "Aquí, el FVG sirve de zona de invalidación. Un stop a una amplitud media de una jornada (1 ATR) bajo su bajo tiene sentido: más ajustado, queda en el ruido; más lejos, inmoviliza capital.",
      beginner:     "Aquí, el FVG es tu zona de compra. El stop tiene más probabilidades de aguantar BAJO la zona que dentro.",
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
      advanced:     "En volatilidad alta, el stop 'normal' suele quedarse demasiado ajustado. Duplicar el margen tiene sentido: lo que parece un stop amplio es aquí el stop LÓGICO.",
      intermediate: "La volatilidad amplía el ruido normal. Aquí, un stop 'estándar' corre el riesgo de quedarse demasiado ajustado.",
      beginner:     "Cuanto más fuerte se mueve el mercado, más espacio necesita tu stop para respirar.",
    },
    difficulties: ["advanced"],
    tag: "volatilidad",
  },
  {
    id: "equal_lows_trap",
    title: "Doble suelo aparente — la liquidity atrapada",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Dos lows casi iguales con unos pips de diferencia. El patrón parece un doble suelo. Pero esta simetría atrae la liquidity retail.",
    shortContext: "Doble suelo aparente",
    lessons: {
      beginner:     "Dos lows casi iguales forman un doble suelo evidente para muchos traders. Un stop con margen bajo la zona suele aguantar mejor que uno justo dentro.",
      intermediate: "Cuando 2 lows son casi iguales, crean una zona de liquidity visible para todos, a menudo visitada antes de un giro. Un SL debajo, con margen anti-sweep, es una opción lógica.",
      advanced:     "Los equal lows suelen formar una reserva de liquidity. Aquí, la invalidación real está más bien varias amplitudes medias de una jornada más abajo (varios ATR), después del sweep, que justo bajo los lows.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "round_number_sweep",
    title: "Nivel psicológico — la zona que todos ven",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio flota justo encima de un nivel psicológico mayor (nivel psicológico). Todos los retails tienen su SL justo debajo de este nivel.",
    shortContext: "Debajo de nivel psicológico",
    lessons: {
      beginner:     "Los niveles psicológicos (1.1000, 100 000…) atraen muchos SL. Colocar tu stop más lejos, en lugar de justo debajo, es una opción lógica.",
      intermediate: "Los niveles psicológicos son niveles psicológicos donde se concentra la liquidity: muchos traders colocan ahí sus SL y TP. Estos niveles suelen ser barridos.",
      advanced:     "1.1000, 4 300, 100 000… estos niveles atraen los stops. Un SL justo debajo tiene muchas probabilidades de ser cazado. Un SL más lejos, o no operar, son dos opciones lógicas.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "asia_high_sweep",
    title: "máximo de la sesión asiática — sweep predecible en la apertura de Londres",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Sesión asiática terminada, range bien definido. Apertura de Londres en 10 minutos. Vendes el high del range Asia.",
    shortContext: "Antes de la apertura de Londres",
    lessons: {
      beginner:     "El máximo de la sesión asiática suele ser barrido en la apertura de Londres. Aquí, un SL por encima del sweep esperado aguanta mejor que uno justo en el high.",
      intermediate: "El máximo de la sesión asiática suele ser barrido en la apertura de Londres. Vender con un stop justo en el high, sin anticipar este sweep, te expone claramente a una salida prematura.",
      advanced:     "El sweep del máximo de la sesión asiática es una mecánica de mercado bien conocida. Un SL por encima del sweep esperado, más que por encima del high, es aquí una opción lógica.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "order_block_respect",
    title: "Order Block — más allá del swing low",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Entras BUY en un Order Block alcista identificado. Un swing low reciente está visible justo encima del bottom del OB.",
    shortContext: "Order Block alcista",
    lessons: {
      beginner:     "La invalidación de un Order Block está más bien bajo su bajo que bajo el swing low reciente. Aquí, el SL funciona mejor si lo tiene en cuenta.",
      intermediate: "El bajo del Order Block define aquí la invalidación del concepto, más que el último swing. Un SL bajo el bajo del OB, con margen, tiene sentido.",
      advanced:     "La invalidación de un Order Block está más bien bajo su bajo que bajo el último swing low. Confundir ambos puede sacarte en la mecha de mitigación cuando el setup sigue siendo válido.",
    },
    difficulties: ["advanced"],
    tag: "lectura",
  },
  {
    id: "prev_day_low_trap",
    title: "Previous Day Low — la liquidity diaria",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio se acerca al Previous Day Low. La zona es conocida por todos los participantes institucionales. Preparas tu BUY.",
    shortContext: "Cerca del PDL",
    lessons: {
      beginner:     "El PDL (Previous Day Low) suele ser una zona de stop hunt. Un SL bajo el PDL, con margen, aguanta mejor que uno justo debajo.",
      intermediate: "El PDL (Previous Day Low) es un nivel de liquidity diario, a menudo objetivo de los stop hunts. Un SL justo debajo tiene muchas probabilidades de ser capturado.",
      advanced:     "El PDL forma parte de los niveles clave, junto con PDH, PWL, PWH y PML. Un SL colocado a 0-5 pips más allá de uno de ellos tiene bastantes probabilidades de ser cazado antes del movimiento real.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "news_vol_expansion",
    title: "Volatilidad doblada (ATR): el stop loss estándar queda demasiado ajustado",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Hoy, el mercado se mueve el doble de su promedio de los últimos 20 días (ATR, la amplitud media de una jornada). Volatilidad excepcional después del FOMC. Tomas tu setup habitual con tu margen de stop loss estándar.",
    shortContext: "El mercado se mueve el doble de lo habitual (ATR, la amplitud media de una jornada)",
    lessons: {
      beginner:     "Cuando la volatilidad se dispara (FOMC, NFP), un SL 'normal' suele quedarse demasiado ajustado. Ampliar el margen según la volatilidad del día (ATR, la amplitud media de una jornada) es una opción lógica.",
      intermediate: "Un día en que el mercado se mueve el doble de lo habitual (ATR, la amplitud media de una jornada), el SL 'estándar' queda en la práctica demasiado ajustado. Aquí, un margen ajustado a la volatilidad real evita una salida muy probable.",
      advanced:     "El tamaño del SL no es un número fijo de pips: sigue más bien la volatilidad del día (ATR, la amplitud media de una jornada). Cuando el ATR se duplica, duplicar el margen tiene sentido; si no, tu SL queda demasiado ajustado.",
    },
    difficulties: ["advanced"],
    tag: "volatilidad",
  },
  {
    id: "htf_invalidation",
    title: "Invalidación HTF — SL H1 no es suficiente",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Setup BUY en H1. Pero el último Higher Low H4 está bastante más bajo. La estructura HTF sigue alcista mientras este HL H4 aguante.",
    shortContext: "Sesgo H4 más profundo",
    lessons: {
      beginner:     "Cuando el setup está en H1 pero el sesgo HTF en H4, tu SL funciona mejor respetando el HL H4 que el swing H1.",
      intermediate: "El SL se coloca más bien a la escala del timeframe de invalidación que del timeframe de entrada. Aquí (setup H1, sesgo H4), un SL bajo el HL H4 es una opción lógica.",
      advanced:     "El SL funciona mejor colocado a la escala del setup. Aquí (setup H1, sesgo H4), un SL al menos bajo el HL H4 pertinente tiene sentido; si no, una fluctuación H1 normal puede sacarte antes del movimiento real.",
    },
    difficulties: ["advanced"],
    tag: "lectura",
  },
  {
    id: "multi_swing_low",
    title: "Dos swing lows cercanos — ¿debajo de cuál?",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Identificas 2 swing lows recientes separados de unos pips. El segundo es más bajo. ¿Cuál respetar para el SL?",
    shortContext: "2 swing lows cercanos",
    lessons: {
      beginner:     "Cuando 2 swing lows están cerca, un SL que respete el MÁS BAJO es una opción lógica: el 1º suele ser barrido antes de la ruptura real.",
      intermediate: "Cuando 2 swing lows están cerca, la estructura solo queda realmente invalidada si se rompe el MÁS BAJO. Un SL bajo el primero puede ser tocado en una fluctuación normal.",
      advanced:     "En una secuencia de lows, mientras el más bajo aguante, la estructura alcista sigue intacta. Un SL bajo el 1er swing ignora aquí esta mecánica.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "estructura",
  },
  {
    id: "fakeout_then_retest",
    title: "Fakeout ya ocurrido — SL más allá del wick, no del swing",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Fakeout en resistencia ya visible: mecha que rompe, luego vuelve abajo. Entras SELL ahora. ¿Dónde colocar el SL?",
    shortContext: "Fakeout resistencia ya ocurrido",
    lessons: {
      beginner:     "Cuando un fakeout ya es visible, el verdadero high a invalidar es más bien la mecha que el techo del cuerpo.",
      intermediate: "El retest natural después de un fakeout suele ir a buscar la mecha. Un SL sobre la mecha, con margen, aguanta mejor que uno sobre el cuerpo.",
      advanced:     "Cuando ya ha habido un fakeout, el verdadero high a invalidar es más bien la punta de la mecha que el swing high del cuerpo. Un SL bajo la mecha puede ser tocado en el retest natural.",
    },
    difficulties: ["advanced"],
    tag: "trampa",
  },
  {
    id: "tight_consolidation",
    title: "Range estrecho — el arbitraje tamaño SL vs R/R",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Range estrecho: amplitud baja, precio atrapado entre soporte y resistencia cercanos. Quieres entrar BUY en el soporte. El R/R será malo con un SL estándar.",
    shortContext: "Range estrecho",
    lessons: {
      beginner:     "En un range estrecho, esperar una ruptura o reducir tu tamaño de posición son dos opciones lógicas. Con un SL estándar, el R/R se vuelve débil.",
      intermediate: "En un range estrecho, un SL estándar degrada el R/R, y un SL demasiado corto puede ser tocado. Una opción lógica: esperar una expansión, o reducir el tamaño del lote.",
      advanced:     "En un range estrecho, el equilibrio entre SL y R/R exige un compromiso sobre el tamaño. Esperar una expansión, o aceptar un R/R por debajo de 1:2 compensado por la tasa de acierto: te toca decidir.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "estructura",
  },
  // V2.2 — escenarios donde "wide" se vuelve la respuesta correcta
  {
    id: "extreme_volatility_buy",
    title: "Volatilidad extrema — SL estándar barrido",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Hoy, el mercado se mueve el triple de su promedio de los últimos 20 días (ATR, la amplitud media de una jornada). Mercado en modo expansión violenta. Tomas tu setup BUY clásico. El SL 'estándar' no aguantará.",
    shortContext: "El mercado se mueve el triple de lo habitual (ATR, la amplitud media de una jornada): expansión violenta",
    lessons: {
      beginner:     "En volatilidad extrema, tu SL 'normal' suele quedarse demasiado ajustado. Un margen proporcional a la volatilidad del día (ATR, la amplitud media de una jornada) es una opción lógica.",
      intermediate: "Cuando el mercado se mueve el triple de lo habitual (ATR, la amplitud media de una jornada), un SL estándar suele quedar inadaptado. Adaptar el margen o pasar de turno son dos opciones lógicas.",
      advanced:     "Cuando la volatilidad del día se triplica (ATR, la amplitud media de una jornada), un SL estándar de 1,2 veces el ATR queda en realidad demasiado ajustado. Es mejor adaptar el SL a la volatilidad del día que a un número fijo de pips. En volatilidad extrema, un SL de 3-4 veces el ATR, o no operar, tienen sentido.",
    },
    difficulties: ["advanced"],
    tag: "volatilidad",
  },
  {
    id: "extreme_volatility_sell",
    title: "Volatilidad extrema — SL estándar barrido (SELL)",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "Hoy, el mercado se mueve el triple de su promedio de los últimos 20 días (ATR, la amplitud media de una jornada). Mercado en expansión violenta. Vendes un rechazo. El SL 'estándar' sobre la mecha no aguantará.",
    shortContext: "El mercado se mueve el triple de lo habitual (ATR, la amplitud media de una jornada): short en volatilidad extrema",
    lessons: {
      beginner:     "En volatilidad extrema, tu SL 'normal' suele quedarse demasiado ajustado, también en SELL. Un margen proporcional a la volatilidad del día (ATR, la amplitud media de una jornada) es una opción lógica.",
      intermediate: "Cuando el mercado se mueve el triple de lo habitual (ATR, la amplitud media de una jornada), un SL estándar sobre el high suele quedar inadaptado. Adaptar el margen o pasar de turno son dos opciones lógicas.",
      advanced:     "En SELL también, el SL sigue más bien la volatilidad del día (ATR, la amplitud media de una jornada) que un margen fijo. Con un ATR triplicado, triplicar el margen, o no operar, tienen sentido.",
    },
    difficulties: ["advanced"],
    tag: "volatilidad",
  },
  {
    id: "news_imminent_wide",
    title: "News en 5 min — SL estándar quemado",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "NFP en 5 minutos. Quieres entrar ahora en este setup BUY. La amplitud esperada es x2-3 de lo normal. SL estándar = stop out garantizado.",
    shortContext: "NFP inminente",
    lessons: {
      beginner:     "Antes de una news mayor, la amplitud de las velas puede duplicarse o triplicarse. Adaptar tu SL, o no tomar el trade, son dos opciones lógicas.",
      intermediate: "Una vela de news tres veces más amplia puede barrer tu SL 'estándar' antes de que tengas tiempo de reaccionar. Aquí, un margen amplio es muy recomendable.",
      advanced:     "Antes de una news mayor, la amplitud de las velas puede duplicarse o triplicarse. No operar, o adaptar tu SL en consecuencia, son dos opciones lógicas; un SL estándar corre el riesgo de ser arrastrado por el movimiento.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "liquidity_hunt_zone",
    title: "Zona de stop hunt institucional — aleja tu SL",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El swing low 'evidente' justo debajo de la entrada es en realidad una zona de liquidity institucional bien conocida. El SL puesto debajo = stop out garantizado. Hay que alejarse.",
    shortContext: "Zona de stop hunt conocida",
    lessons: {
      beginner:     "Los swing lows evidentes atraen muchos SL. Colocar tu SL bien más allá de la zona, o esperar después del sweep, son dos opciones lógicas.",
      intermediate: "Cuanto más 'evidente' parece una zona, más probable es que sea cazada. Un SL justo debajo tiene muchas probabilidades de ser capturado.",
      advanced:     "Los swing lows demasiado 'evidentes' son zonas de caza frecuentes. Un SL justo debajo tiene muchas probabilidades de ser capturado. Esperar a que termine la caza para entrar, o colocar tu SL bien más allá, tienen sentido.",
    },
    difficulties: ["advanced"],
    tag: "trampa",
  },
  {
    id: "multi_swing_deep",
    title: "Múltiples swing lows apilados — apunta al más bajo",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "3 swing lows visibles en las últimas 15 velas, cada uno más bajo que el anterior. SL bajo el 1º o el 2º = barrido. La invalidación real es bajo el 3º (el más bajo).",
    shortContext: "3 swings apilados",
    lessons: {
      beginner:     "Cuando 3 swing lows se alinean a la baja, la verdadera invalidación está más bien bajo el más bajo. Un SL bajo el 1º tiene muchas probabilidades de ser tocado.",
      intermediate: "Cuando varios swing lows se alinean, la invalidación estructural está más bien bajo el más bajo. Un SL bajo los demás puede ser tocado en una fluctuación normal.",
      advanced:     "Aquí, la secuencia de lower lows forma parte del pullback. El SL funciona mejor respetando la profundidad máxima esperada del pullback que deteniéndose en el 1er swing.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "estructura",
  },
  {
    id: "fakeout_zone_wide",
    title: "Zona con fakeouts recurrentes — SL amplio obligatorio",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Esta resistencia ya tuvo 2 fakeouts en las últimas horas. El mercado probablemente hará un 3º antes del movimiento real. SL ajustado = captura.",
    shortContext: "Resistencia con multi-fakeouts",
    lessons: {
      beginner:     "Una resistencia que ya ha rechazado con mechas suele producir otras. Un SL sobre la mecha máxima, más que sobre la anterior, es una opción lógica.",
      intermediate: "Los fakeouts repetidos suelen formar un patrón. Aquí, anticipar una amplitud mayor que la de las mechas anteriores tiene sentido.",
      advanced:     "Una zona que ya ha producido 2 fakeouts suele producir un 3º. El SL funciona mejor anticipando esa amplitud máxima que deteniéndose en las mechas anteriores.",
    },
    difficulties: ["advanced"],
    tag: "trampa",
  },
  {
    id: "weekly_open_volatility",
    title: "Lunes apertura — posible gap de fin de semana",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Lunes por la mañana, apertura de los mercados FX. Un gap de fin de semana es posible. El SL debe absorber esta amplitud excepcional.",
    shortContext: "Apertura lunes, posible gap",
    lessons: {
      beginner:     "La apertura del lunes puede crear un gap que barra un SL estándar. Un margen amplio, o ninguna posición antes de la apertura, son dos opciones lógicas.",
      intermediate: "Un gap de apertura el lunes puede alcanzar 1 a 2 veces la amplitud media de una jornada (ATR). Colocar tu SL más allá, o esperar a que el precio se estabilice, tienen sentido.",
      advanced:     "El gap de apertura del lunes puede ser brutal según la actualidad del fin de semana. Esperar a que la apertura se asiente, o colocar un SL amplio para absorber la amplitud, son dos opciones lógicas.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "key_level_magnet",
    title: "Nivel clave — el precio lo tocará",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Un nivel clave mayor (nivel psicológico, PDL, mínimo de la semana) es visible justo debajo de la entrada. El precio estadísticamente irá a probarlo. SL justo encima del nivel = captura.",
    shortContext: "Nivel clave debajo",
    lessons: {
      beginner:     "Los niveles psicológicos suelen atraer el precio como imanes. En lugar de justo encima, un SL bien más allá es una opción lógica.",
      intermediate: "Los niveles psicológicos suelen actuar como imanes: el precio los prueba con mucha frecuencia. Un SL justo encima tiene muchas probabilidades de ser barrido.",
      advanced:     "Para anticipar el test de un nivel clave, colocar el SL más allá de la amplitud probable del sweep, en lugar de justo encima del nivel, tiene sentido.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lectura",
  },
  // V2.3 — 5 espejos SELL para reequilibrar la distribución espacial
  {
    id: "news_imminent_wide_sell",
    title: "News en 5 min — SELL y SL estándar quemado",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "FOMC en 5 minutos. Tomas este SELL en EUR/USD. La amplitud esperada es x2-3 de lo normal. SL estándar = stop out garantizado.",
    shortContext: "FOMC inminente",
    lessons: {
      beginner:     "Antes de un FOMC, la amplitud de las velas puede duplicarse o triplicarse, y un SL estándar corre el riesgo de ser arrastrado. Adaptar el margen, o no operar, son dos opciones lógicas.",
      intermediate: "Una vela de impacto FOMC puede barrer tu SL 'estándar' sobre el high antes de que arranque el movimiento direccional.",
      advanced:     "Antes de un FOMC, la amplitud de las velas puede duplicarse o triplicarse. Un SL estándar de 1,2 veces la amplitud media de una jornada (ATR) puede ser barrido por el primer movimiento. No operar, o prever un SL de al menos 3 veces el ATR, tienen sentido.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "liquidity_hunt_zone_sell",
    title: "Zona de stop hunt SELL — aleja tu SL arriba",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "El swing high evidente justo encima de la entrada es en realidad una zona de liquidity institucional bien conocida. SL puesto encima = stop out garantizado.",
    shortContext: "Zona de stop hunt arriba",
    lessons: {
      beginner:     "Los swing highs evidentes atraen muchos SL. Colocar tu SL bien más allá de la zona, o esperar después del sweep, son dos opciones lógicas.",
      intermediate: "Cuanto más 'evidente' parece una zona, más probable es que sea cazada. Un SL justo encima del swing high tiene muchas probabilidades de ser capturado.",
      advanced:     "Los swing highs demasiado evidentes son zonas de caza frecuentes, y un SL justo encima tiene muchas probabilidades de ser capturado. Esperar la caza, o colocar tu SL bien más allá, tienen sentido.",
    },
    difficulties: ["advanced"],
    tag: "trampa",
  },
  {
    id: "multi_swing_high_deep",
    title: "Múltiples swing highs apilados — apunta al más alto",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "3 swing highs visibles en las últimas 15 velas, cada uno más alto que el anterior. SL encima del 1º o 2º = barrido. La invalidación real es encima del 3º.",
    shortContext: "3 swings apilados",
    lessons: {
      beginner:     "Cuando 3 swing highs se alinean al alza, la verdadera invalidación está más bien sobre el más alto. Un SL sobre el 1º tiene muchas probabilidades de ser tocado.",
      intermediate: "Cuando varios swing highs se alinean, la invalidación estructural está más bien sobre el más alto. Un SL sobre los demás puede ser tocado en una fluctuación normal.",
      advanced:     "Aquí, la secuencia de higher highs forma parte del pullback bajista. El SL funciona mejor respetando la profundidad máxima esperada del pullback.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "estructura",
  },
  {
    id: "weekly_open_volatility_sell",
    title: "Lunes apertura SELL — posible gap de fin de semana",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "Lunes por la mañana, apertura de los mercados FX. Un gap alcista de fin de semana es posible. El SL SELL debe absorber esta amplitud.",
    shortContext: "Apertura lunes, posible gap",
    lessons: {
      beginner:     "La apertura del lunes puede crear un gap alcista que barra un SL estándar. Un margen amplio, o ninguna posición antes de la apertura, son dos opciones lógicas.",
      intermediate: "Un gap de apertura el lunes puede alcanzar 1 a 2 veces la amplitud media de una jornada (ATR) al alza. Colocar tu SL de SELL más allá, o esperar a que el precio se estabilice, tienen sentido.",
      advanced:     "El gap de apertura del lunes puede ser brutal según la actualidad del fin de semana. Aquí, el SL del SELL funciona mejor si absorbe la amplitud del gap.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "key_level_magnet_sell",
    title: "Nivel clave arriba — el precio lo probará",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Un nivel clave mayor (nivel psicológico, PDH, máximo de la semana) es visible justo encima de la entrada. El precio estadísticamente irá a probarlo.",
    shortContext: "Nivel clave arriba",
    lessons: {
      beginner:     "Los niveles psicológicos suelen atraer el precio como imanes, también al alza. En lugar de justo debajo, un SL bien más allá es una opción lógica.",
      intermediate: "Los niveles psicológicos suelen actuar como imanes: el precio los prueba con mucha frecuencia. Un SL justo encima tiene muchas probabilidades de ser barrido.",
      advanced:     "Para anticipar el test de un nivel clave, colocar el SL más allá de la amplitud probable del sweep tiene sentido.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lectura",
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
  "Dernier creux":        "Último mínimo",
  "Dernier sommet":       "Último máximo",
  "Liquidité balayée":    "Liquidity barrida",
  "FVG haussier":         "FVG alcista",
  "Mèche du fakeout":         "Mecha del fakeout",
  // V2.1 — zones des nouveaux scénarios
  "Equal lows":           "Equal lows",
  "Niveau psychologique":         "Nivel psicológico",
  "Haut de la session asiatique":            "Máximo de la sesión asiática",
  "Order Block":          "Order Block",
  "PDL":                  "PDL",
  "HL H4":                "HL H4",
  "Swing low H1":         "Swing low H1",
  "Swing low 1":          "Swing low 1",
  "Swing low 2":          "Swing low 2",
  "Bas du range":         "Piso del rango",
  "Haut du range":        "Techo del rango",
  // V2.2
  "Swing low évident":    "Swing low evidente",
  "Zone de stop hunt":       "Zona de stop hunt",
  "Swing low 3":          "Swing low 3",
  "Fakeouts précédents":  "Fakeouts anteriores",
  "Niveau clé":    "Nivel clave",
  // V2.3 — miroirs SELL
  "Swing high évident":   "Swing high evidente",
  "Swing high 1":         "Swing high 1",
  "Swing high 2":         "Swing high 2",
  "Swing high 3":         "Swing high 3",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_ES[z.label] ?? z.label }));
}

// ─── Tabla de traducción de rationales ───────────────────────────────────────
// Las rationales se incrustan en el chart (no en los templates). Las del módulo
// FR son strings fijos; las traducimos por mapping de exact-match.

const TIGHT_RATIONALE_FR = "✗ Trop serré : ici, le stop est placé dans le bruit normal du marché. La 1re mèche de retest risque de le balayer avant que le trade aboutisse. C'est une erreur fréquente.";
const LOGICAL_RATIONALE_FR = "✓ Placement logique : derrière la vraie invalidation, avec une marge anti-bruit. Ici, il survit aux retests et laisse le trade capter la cassure structurelle si elle arrive.";
const WIDE_RATIONALE_FR = "≈ Il survit, mais dégrade le R/R. Ici, la distance est trop grande : le capital est mal utilisé, et le R/R baisse nettement par rapport au stop logique.";

const FAKEOUT_TIGHT_FR   = "✗ Ici, le stop est dans la zone du piège, là où la liquidité vient d'être ramassée. Le 2e test risque de le balayer.";
const FAKEOUT_LOGICAL_FR = "✓ Au-dessus du pic du fakeout, avec une marge. C'est ici la VRAIE invalidation du piège : si le prix repasse là, le scénario est probablement cassé.";

const SWEEP_TIGHT_FR   = "✗ Ici, le stop est DANS la zone du sweep, là où la liquidité vient d'être ramassée. Le retest risque de venir le chercher.";
const SWEEP_LOGICAL_FR = "✓ Sous la mèche du sweep, avec une marge. Ici, le low du sweep devient la nouvelle invalidation, à l'abri d'un 2e ramassage.";

const FVG_TIGHT_FR   = "✗ Ici, le stop est DANS le FVG, une zone où le marché peut revenir pour terminer sa mitigation. Il risque d'être pris dans la profondeur de la zone.";
const FVG_LOGICAL_FR = "✓ Sous le bas du FVG, avec une marge. Ici, un FVG entièrement traversé signerait une invalidation propre : c'est le placement structurel le plus cohérent.";

const HIGHVOL_TIGHT_FR   = "✗ Stop « standard », correct en volatilité normale, mais ici ce niveau se trouve dans le bruit. La 1re bougie de retest, ample à cause de la volatilité, risque de le balayer.";
const HIGHVOL_LOGICAL_FR = "✓ Stop élargi à la volatilité du marché. Ce qui ressemblerait à un stop large en temps normal est ici le stop LOGIQUE : il survit au bruit amplifié sans sacrifier le R/R (le TP est aussi plus loin).";
const HIGHVOL_WIDE_FR    = "≈ Il survit, mais même avec un TP étendu en volatilité élevée, le R/R descend ici sous 1,5. Le capital est mal utilisé.";

// V2.1 — rationales des nouveaux scénarios
const EQUAL_LOWS_TIGHT_FR_NEW   = "✗ Ici, le stop est DANS la zone de liquidité créée par les 2 equal lows. C'est le SL le plus évident, souvent ramassé avant la hausse.";
const EQUAL_LOWS_LOGICAL_FR_NEW = "✓ Sous la zone de sweep des 2 lows, avec une marge anti-mèche. Ici, c'est l'invalidation réelle du concept, à l'abri de la chasse à la liquidité.";
const ROUND_LIQUIDITY_FR_NEW    = "✗ Ici, le stop est pile sous le niveau psychologique, là où beaucoup de SL s'entassent. Ce niveau est très souvent balayé.";
const ROUND_LOGICAL_FR_NEW      = "✓ Sous le sweep attendu du niveau psychologique, avec une marge. Ici, le SL reste hors de la zone ciblée, et le setup reste valide après la chasse.";
const ASIA_LIQUIDITY_FR_NEW     = "✗ Ici, le stop est pile au-dessus du haut de la session asiatique, dans la zone que l'ouverture de Londres balaie souvent. C'est un piège fréquent de l'ouverture européenne.";
const ASIA_LOGICAL_FR_NEW       = "✓ Au-dessus du sweep attendu du haut de la session asiatique, avec une marge. Si le prix revient là après l'ouverture de Londres, le biais baissier est probablement faux.";
const OB_TIGHT_FR_NEW           = "✗ Ici, le stop est sous le swing low, mais au-dessus du bas de l'Order Block. Le swing risque d'être balayé alors que le concept OB reste valide.";
const OB_LOGICAL_FR_NEW         = "✓ Sous le bas de l'Order Block, avec une marge. Ici, c'est la VRAIE invalidation du concept : le swing low peut être balayé sans casser le setup.";
const PDL_LIQUIDITY_FR_NEW      = "✗ Ici, le stop est pile sous le PDL, un niveau quotidien très souvent visé par les stop hunts. Tu exposes ta position à ce stop hunt.";
const PDL_LOGICAL_FR_NEW        = "✓ Sous la zone de stop hunt du PDL, avec une marge. Le sweep attendu peut avoir lieu : ici, le SL reste hors de la zone ciblée.";
const NEWS_TIGHT_FR_NEW         = "✗ Stop « standard » calibré pour une volatilité normale, alors qu'ici le marché bouge deux fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée). Ce qui paraît raisonnable est en fait trop serré.";
const NEWS_LOGICAL_FR_NEW       = "✓ Marge calibrée sur la volatilité réelle du jour, doublée (ATR, l'amplitude moyenne d'une journée). Ce qui semblerait large en temps normal est ici le stop LOGIQUE : il survit au bruit amplifié.";
const NEWS_WIDE_FR_NEW          = "≈ Il survit largement, mais la marge est surestimée, même pour une volatilité doublée (ATR, l'amplitude moyenne d'une journée). Ici, le capital est sous-utilisé et le R/R plus faible qu'avec le stop logique.";
const HTF_TIGHT_FR_NEW          = "✗ Ici, le stop est sous le swing low H1, mais le biais H4 n'est pas cassé. Une fluctuation H1 normale risque de te sortir alors que le setup HTF reste valide.";
const HTF_LOGICAL_FR_NEW        = "✓ Sous le HL H4 pertinent, avec une marge. Ici, c'est la cassure du biais HTF qui invaliderait le setup, pas une simple fluctuation H1.";
const MULTI_TIGHT_FR_NEW        = "✗ Ici, le stop est sous le 1er swing low (le plus haut), alors que le swing low plus bas tient encore. La structure n'est pas cassée, et le retest du 2e low risque de te sortir.";
const MULTI_LOGICAL_FR_NEW      = "✓ Sous le PLUS BAS des 2 swing lows, avec une marge. C'est ici l'invalidation structurelle réelle : tant que ce niveau tient, la structure haussière reste intacte.";
const FAKE2_TIGHT_FR_NEW        = "✗ Ici, le stop est au-dessus du swing high du corps, mais sous la mèche du fakeout. Le retest naturel de la mèche risque de venir le chercher.";
const FAKE2_LOGICAL_FR_NEW      = "✓ Au-dessus de la mèche du fakeout, avec une marge. Ici, la pointe de la mèche est le vrai high à invalider, plutôt que le haut du corps.";
const TIGHTCONS_TIGHT_FR_NEW    = "✗ Ici, le stop est dans le range serré, en plein bruit de la consolidation. La 1re oscillation du range risque de le balayer.";
const TIGHTCONS_LOGICAL_FR_NEW  = "✓ Juste sous le bas du range, avec une marge. Le SL respecte ici la structure du range, mais le R/R reste limité par le haut : à arbitrer avec la taille de position.";
const TIGHTCONS_WIDE_FR_NEW     = "≈ SL très large, mais ici le haut du range rend le R/R très difficile. Sans expansion, le trade offre peu de marge de gain.";

// V2.2 — scénarios où "wide" est la bonne réponse
const EXTREME_VOL_TIGHT_FR_NEW   = "✗ Ici, le stop est dans le bruit immédiat. La 1re bougie de retest, ample à cause de la volatilité extrême, risque de le balayer très vite.";
const EXTREME_VOL_LTT_FR_NEW     = "✗ Stop « standard » calibré pour une volatilité normale. Avec une volatilité du jour triplée (ATR, l'amplitude moyenne d'une journée), ce niveau se trouve ici dans le bruit, et risque d'être balayé avant que le setup ait le temps de jouer.";
const EXTREME_VOL_WIDE_FR_NEW    = "✓ Marge calibrée sur la volatilité RÉELLE du jour (3 fois la normale). Ici, c'est le seul stop qui absorbe l'expansion sans casser le setup.";
const NEWS_IMM_TIGHT_FR_NEW      = "✗ Ici, le stop est dans le bruit immédiat. La bougie d'impact de la news risque de le balayer en quelques secondes.";
const NEWS_IMM_LTT_FR_NEW        = "✗ Stop « normal », peu adapté à l'amplitude d'une news. Une bougie d'impact (2 à 3 fois plus ample) risque ici de te sortir avant le vrai mouvement directionnel.";
const NEWS_IMM_WIDE_FR_NEW       = "✓ Marge assez large pour absorber l'amplitude de la news. Ici, c'est ce SL, ou pas de trade pendant la fenêtre de news.";
const LIQ_HUNT_TIGHT_FR_NEW      = "✗ Ici, le stop est dans le bruit immédiat. Le 1er retest risque de le balayer avant même la chasse principale.";
const LIQ_HUNT_LTT_FR_NEW        = "✗ Ici, le stop est sous un swing low évident, une zone de stop hunt fréquente. Le sweep prend très souvent ce niveau avant le vrai retournement.";
const LIQ_HUNT_WIDE_FR_NEW       = "✓ Sous la zone de stop hunt, avec une marge ample. Le sweep peut avoir lieu : ici, ton SL reste hors d'atteinte.";
const MULTI_DEEP_TIGHT_FR_NEW    = "✗ Ici, le stop est sous le 1er swing low (le plus haut). Le pullback structurel descend plus bas, et le SL reste dans le bruit du mouvement.";
const MULTI_DEEP_LTT_FR_NEW      = "✗ Ici, le stop est sous le 2e swing low. La séquence de lower lows se prolonge jusqu'au 3e : le stop risque d'être balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_FR_NEW     = "✓ Sous le 3e swing low (le plus bas), avec une marge. C'est ici la vraie invalidation structurelle de la séquence.";
const FAKEOUT_ZONE_TIGHT_FR_NEW  = "✗ Ici, le stop est dans le bruit immédiat : la moindre mèche de retest risque de le balayer.";
const FAKEOUT_ZONE_LTT_FR_NEW    = "✗ Ici, le stop est au-dessus des 2 fakeouts précédents, mais un 3e fakeout dépasse souvent cette amplitude. Il risque d'être balayé.";
const FAKEOUT_ZONE_WIDE_FR_NEW   = "✓ Au-dessus de l'amplitude maximale probable des fakeouts répétés. Ici, un 3e fakeout a peu de chances de te toucher.";
const WEEKLY_OPEN_TIGHT_FR_NEW   = "✗ Ici, le stop est dans le bruit immédiat. Le gap d'ouverture du lundi risque de le balayer dès la 1re bougie.";
const WEEKLY_OPEN_LTT_FR_NEW     = "✗ Stop « standard », peu adapté à un gap de weekend qui peut atteindre 2 à 3 fois l'amplitude normale d'une bougie.";
const WEEKLY_OPEN_WIDE_FR_NEW    = "✓ Marge large pour absorber l'amplitude du gap d'ouverture. Ici, tant que la structure tient, le SL tient aussi.";
const KEY_MAGNET_TIGHT_FR_NEW    = "✗ Ici, le stop est dans le bruit immédiat, et risque d'être balayé avant même que le niveau clé soit atteint.";
const KEY_MAGNET_LTT_FR_NEW      = "✗ Ici, le stop est juste au-dessus du niveau clé. Le test profond risque d'aller plus bas, et le sweep de prendre ce niveau.";
const KEY_MAGNET_WIDE_FR_NEW     = "✓ Au-delà de l'amplitude du test attendu sur le niveau clé. Le sweep peut toucher le niveau : ici, ton SL reste hors d'atteinte.";

// V2.3 — variantes SELL : reformulations directionnelles
const LIQ_HUNT_LTT_SELL_FR_NEW     = "✗ Ici, le stop est au-dessus d'un swing high évident, une zone de stop hunt fréquente. Le sweep prend très souvent ce niveau avant le vrai retournement.";
const LIQ_HUNT_WIDE_SELL_FR_NEW    = "✓ Au-dessus de la zone de stop hunt, avec une marge ample. Le sweep peut avoir lieu : ici, ton SL reste hors d'atteinte.";
const MULTI_DEEP_TIGHT_SELL_FR_NEW = "✗ Ici, le stop est au-dessus du 1er swing high (le plus bas). Le pullback structurel monte plus haut, et le SL reste dans le bruit du mouvement.";
const MULTI_DEEP_LTT_SELL_FR_NEW   = "✗ Ici, le stop est au-dessus du 2e swing high. La séquence de higher highs se prolonge jusqu'au 3e : le stop risque d'être balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_SELL_FR_NEW  = "✓ Au-dessus du 3e swing high (le plus haut), avec une marge. C'est ici la vraie invalidation structurelle de la séquence.";
const KEY_MAGNET_LTT_SELL_FR_NEW   = "✗ Ici, le stop est juste sous le niveau clé. Le test profond risque d'aller plus haut, et le sweep de prendre ce niveau.";
const KEY_MAGNET_WIDE_SELL_FR_NEW  = "✓ Au-delà de l'amplitude du test attendu vers le haut. Le sweep peut toucher le niveau clé : ici, ton SL reste hors d'atteinte.";

const RATIONALE_ES: Record<string, string> = {
  [TIGHT_RATIONALE_FR]:   "✗ Demasiado ajustado: aquí, el stop está en el ruido normal del mercado. La 1ª mecha de retest puede barrerlo antes de que el trade prospere. Es un error frecuente.",
  [LOGICAL_RATIONALE_FR]: "✓ Colocación lógica: detrás de la verdadera invalidación, con un margen anti-ruido. Aquí, sobrevive a los retests y permite al trade captar la ruptura estructural si llega.",
  [WIDE_RATIONALE_FR]:    "≈ Sobrevive, pero degrada el R/R. Aquí, la distancia es demasiado grande: el capital se usa mal, y el R/R baja claramente respecto al stop lógico.",
  [FAKEOUT_TIGHT_FR]:     "✗ Aquí, el stop está en la zona de la trampa, donde se acaba de recoger la liquidity. El 2º test puede barrerlo.",
  [FAKEOUT_LOGICAL_FR]:   "✓ Sobre el pico del fakeout, con margen. Aquí, es la VERDADERA invalidación de la trampa: si el precio vuelve ahí, el escenario probablemente está roto.",
  [SWEEP_TIGHT_FR]:       "✗ Aquí, el stop está DENTRO de la zona del sweep, donde se acaba de recoger la liquidity. El retest puede ir a buscarlo.",
  [SWEEP_LOGICAL_FR]:     "✓ Bajo la mecha del sweep, con margen. Aquí, el low del sweep pasa a ser la nueva invalidación, a salvo de una 2ª recogida.",
  [FVG_TIGHT_FR]:         "✗ Aquí, el stop está DENTRO del FVG, una zona a la que el mercado puede volver para terminar su mitigación. Puede quedar atrapado en la profundidad de la zona.",
  [FVG_LOGICAL_FR]:       "✓ Bajo el bajo del FVG, con margen. Aquí, un FVG atravesado por completo marcaría una invalidación limpia: es la colocación estructural más coherente.",
  [HIGHVOL_TIGHT_FR]:     "✗ Stop 'estándar', correcto en volatilidad normal, pero aquí este nivel está en el ruido. La 1ª vela de retest, amplia por la volatilidad, puede barrerlo.",
  [HIGHVOL_LOGICAL_FR]:   "✓ Stop ampliado a la volatilidad del mercado. Lo que parecería un stop amplio en condiciones normales es aquí el stop LÓGICO: sobrevive al ruido amplificado sin sacrificar el R/R (el TP también está más lejos).",
  [HIGHVOL_WIDE_FR]:      "≈ Sobrevive, pero incluso con un TP extendido en volatilidad alta, el R/R baja aquí de 1,5. El capital se usa mal.",
  // V2.1
  [EQUAL_LOWS_TIGHT_FR_NEW]:   "✗ Aquí, el stop está DENTRO de la zona de liquidity creada por los 2 equal lows. Es el SL más evidente, a menudo recogido antes de la subida.",
  [EQUAL_LOWS_LOGICAL_FR_NEW]: "✓ Bajo la zona de sweep de los 2 lows, con margen anti-mecha. Aquí, es la invalidación real del concepto, a salvo de la caza de liquidity.",
  [ROUND_LIQUIDITY_FR_NEW]:    "✗ Aquí, el stop está justo bajo el nivel psicológico, donde se amontonan muchos SL. Este nivel es barrido muy a menudo.",
  [ROUND_LOGICAL_FR_NEW]:      "✓ Bajo el sweep esperado del nivel psicológico, con margen. Aquí, el SL queda fuera de la zona objetivo, y el setup sigue siendo válido después de la caza.",
  [ASIA_LIQUIDITY_FR_NEW]:     "✗ Aquí, el stop está justo encima del máximo de la sesión asiática, en la zona que la apertura de Londres suele barrer. Es una trampa frecuente de la apertura europea.",
  [ASIA_LOGICAL_FR_NEW]:       "✓ Sobre el sweep esperado del máximo de la sesión asiática, con margen. Si el precio vuelve ahí después de la apertura de Londres, el sesgo bajista probablemente es erróneo.",
  [OB_TIGHT_FR_NEW]:           "✗ Aquí, el stop está bajo el swing low, pero encima del bajo del Order Block. El swing puede ser barrido mientras el concepto OB sigue siendo válido.",
  [OB_LOGICAL_FR_NEW]:         "✓ Bajo el bajo del Order Block, con margen. Aquí, es la VERDADERA invalidación del concepto: el swing low puede ser barrido sin romper el setup.",
  [PDL_LIQUIDITY_FR_NEW]:      "✗ Aquí, el stop está justo bajo el PDL, un nivel diario muy a menudo objetivo de los stop hunts. Expones tu posición a ese stop hunt.",
  [PDL_LOGICAL_FR_NEW]:        "✓ Bajo la zona de stop hunt del PDL, con margen. El sweep esperado puede ocurrir: aquí, el SL queda fuera de la zona objetivo.",
  [NEWS_TIGHT_FR_NEW]:         "✗ Stop 'estándar' calibrado para una volatilidad normal, cuando aquí el mercado se mueve el doble de lo habitual (ATR, la amplitud media de una jornada). Lo que parece razonable queda en realidad demasiado ajustado.",
  [NEWS_LOGICAL_FR_NEW]:       "✓ Margen calibrado sobre la volatilidad real del día, duplicada (ATR, la amplitud media de una jornada). Lo que parecería amplio en condiciones normales es aquí el stop LÓGICO: sobrevive al ruido amplificado.",
  [NEWS_WIDE_FR_NEW]:          "≈ Sobrevive con holgura, pero el margen está sobrestimado, incluso para una volatilidad duplicada (ATR, la amplitud media de una jornada). Aquí, el capital está infrautilizado y el R/R es más bajo que con el stop lógico.",
  [HTF_TIGHT_FR_NEW]:          "✗ Aquí, el stop está bajo el swing low H1, pero el sesgo H4 no está roto. Una fluctuación H1 normal puede sacarte mientras el setup HTF sigue siendo válido.",
  [HTF_LOGICAL_FR_NEW]:        "✓ Bajo el HL H4 pertinente, con margen. Aquí, es la ruptura del sesgo HTF la que invalidaría el setup, no una simple fluctuación H1.",
  [MULTI_TIGHT_FR_NEW]:        "✗ Aquí, el stop está bajo el 1er swing low (el más alto), mientras el swing low más bajo sigue aguantando. La estructura no está rota, y el retest del 2º low puede sacarte.",
  [MULTI_LOGICAL_FR_NEW]:      "✓ Bajo el MÁS BAJO de los 2 swing lows, con margen. Es aquí la invalidación estructural real: mientras este nivel aguante, la estructura alcista sigue intacta.",
  [FAKE2_TIGHT_FR_NEW]:        "✗ Aquí, el stop está sobre el swing high del cuerpo, pero debajo de la mecha del fakeout. El retest natural de la mecha puede ir a buscarlo.",
  [FAKE2_LOGICAL_FR_NEW]:      "✓ Sobre la mecha del fakeout, con margen. Aquí, la punta de la mecha es el verdadero high a invalidar, más que el techo del cuerpo.",
  [TIGHTCONS_TIGHT_FR_NEW]:    "✗ Aquí, el stop está dentro del range estrecho, en pleno ruido de la consolidación. La 1ª oscilación del range puede barrerlo.",
  [TIGHTCONS_LOGICAL_FR_NEW]:  "✓ Justo bajo el bajo del range, con margen. Aquí, el SL respeta la estructura del range, pero el R/R sigue limitado por el techo: a equilibrar con el tamaño de posición.",
  [TIGHTCONS_WIDE_FR_NEW]:     "≈ SL muy amplio, pero aquí el techo del range hace muy difícil el R/R. Sin expansión, el trade ofrece poco margen de ganancia.",
  // V2.2 — wide = bonne réponse
  [EXTREME_VOL_TIGHT_FR_NEW]:   "✗ Aquí, el stop está en el ruido inmediato. La 1ª vela de retest, amplia por la volatilidad extrema, puede barrerlo muy rápido.",
  [EXTREME_VOL_LTT_FR_NEW]:     "✗ Stop 'estándar' calibrado para una volatilidad normal. Con una volatilidad del día triplicada (ATR, la amplitud media de una jornada), este nivel queda aquí dentro del ruido y puede ser barrido antes de que el setup tenga tiempo de funcionar.",
  [EXTREME_VOL_WIDE_FR_NEW]:    "✓ Margen calibrado sobre la volatilidad REAL del día (3 veces la normal). Aquí, es el único stop que absorbe la expansión sin romper el setup.",
  [NEWS_IMM_TIGHT_FR_NEW]:      "✗ Aquí, el stop está en el ruido inmediato. La vela de impacto de la news puede barrerlo en segundos.",
  [NEWS_IMM_LTT_FR_NEW]:        "✗ Stop 'normal', poco adaptado a la amplitud de una news. Una vela de impacto (2 a 3 veces más amplia) puede sacarte aquí antes del verdadero movimiento direccional.",
  [NEWS_IMM_WIDE_FR_NEW]:       "✓ Margen lo bastante amplio para absorber la amplitud de la news. Aquí, es este SL, o ningún trade durante la ventana de news.",
  [LIQ_HUNT_TIGHT_FR_NEW]:      "✗ Aquí, el stop está en el ruido inmediato. El 1er retest puede barrerlo incluso antes de la caza principal.",
  [LIQ_HUNT_LTT_FR_NEW]:        "✗ Aquí, el stop está bajo un swing low evidente, una zona de stop hunt frecuente. El sweep toma muy a menudo este nivel antes del verdadero giro.",
  [LIQ_HUNT_WIDE_FR_NEW]:       "✓ Bajo la zona de stop hunt, con un margen amplio. El sweep puede ocurrir: aquí, tu SL queda fuera de alcance.",
  [MULTI_DEEP_TIGHT_FR_NEW]:    "✗ Aquí, el stop está bajo el 1er swing low (el más alto). El pullback estructural baja más, y el SL queda en el ruido del movimiento.",
  [MULTI_DEEP_LTT_FR_NEW]:      "✗ Aquí, el stop está bajo el 2º swing low. La secuencia de lower lows se prolonga hasta el 3º: el stop puede ser barrido antes de la invalidación real.",
  [MULTI_DEEP_WIDE_FR_NEW]:     "✓ Bajo el 3er swing low (el más bajo), con margen. Es aquí la verdadera invalidación estructural de la secuencia.",
  [FAKEOUT_ZONE_TIGHT_FR_NEW]:  "✗ Aquí, el stop está en el ruido inmediato: la menor mecha de retest puede barrerlo.",
  [FAKEOUT_ZONE_LTT_FR_NEW]:    "✗ Aquí, el stop está sobre los 2 fakeouts anteriores, pero un 3er fakeout suele superar esa amplitud. Puede ser barrido.",
  [FAKEOUT_ZONE_WIDE_FR_NEW]:   "✓ Sobre la amplitud máxima probable de los fakeouts repetidos. Aquí, un 3er fakeout tiene pocas probabilidades de alcanzarte.",
  [WEEKLY_OPEN_TIGHT_FR_NEW]:   "✗ Aquí, el stop está en el ruido inmediato. El gap de apertura del lunes puede barrerlo en la 1ª vela.",
  [WEEKLY_OPEN_LTT_FR_NEW]:     "✗ Stop 'estándar', poco adaptado a un gap de fin de semana que puede alcanzar 2 a 3 veces la amplitud normal de una vela.",
  [WEEKLY_OPEN_WIDE_FR_NEW]:    "✓ Margen amplio para absorber la amplitud del gap de apertura. Aquí, mientras la estructura aguante, el SL también.",
  [KEY_MAGNET_TIGHT_FR_NEW]:    "✗ Aquí, el stop está en el ruido inmediato y puede ser barrido incluso antes de que se alcance el nivel clave.",
  [KEY_MAGNET_LTT_FR_NEW]:      "✗ Aquí, el stop está justo encima del nivel clave. El test profundo puede ir más abajo, y el sweep tomar este nivel.",
  [KEY_MAGNET_WIDE_FR_NEW]:     "✓ Más allá de la amplitud del test esperado sobre el nivel clave. El sweep puede tocar el nivel: aquí, tu SL queda fuera de alcance.",
  // V2.3 — espejos SELL
  [LIQ_HUNT_LTT_SELL_FR_NEW]:     "✗ Aquí, el stop está encima de un swing high evidente, una zona de stop hunt frecuente. El sweep toma muy a menudo este nivel antes del verdadero giro.",
  [LIQ_HUNT_WIDE_SELL_FR_NEW]:    "✓ Encima de la zona de stop hunt, con un margen amplio. El sweep puede ocurrir: aquí, tu SL queda fuera de alcance.",
  [MULTI_DEEP_TIGHT_SELL_FR_NEW]: "✗ Aquí, el stop está encima del 1er swing high (el más bajo). El pullback estructural sube más, y el SL queda en el ruido del movimiento.",
  [MULTI_DEEP_LTT_SELL_FR_NEW]:   "✗ Aquí, el stop está encima del 2º swing high. La secuencia de higher highs se prolonga hasta el 3º: el stop puede ser barrido antes de la invalidación real.",
  [MULTI_DEEP_WIDE_SELL_FR_NEW]:  "✓ Encima del 3er swing high (el más alto), con margen. Es aquí la verdadera invalidación estructural de la secuencia.",
  [KEY_MAGNET_LTT_SELL_FR_NEW]:   "✗ Aquí, el stop está justo debajo del nivel clave. El test profundo puede ir más arriba, y el sweep tomar este nivel.",
  [KEY_MAGNET_WIDE_SELL_FR_NEW]:  "✓ Más allá de la amplitud del test esperado al alza. El sweep puede tocar el nivel clave: aquí, tu SL queda fuera de alcance.",
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
  ctx: MarketCtx = {},
): PlaceStopChart {
  const chart = buildPlaceStopChartFr(setup, seed, volatility, difficulty, ctx);
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
    description: "Volatilidad más sucia, varios stops plausibles, stop ajustado tentador.",
  },
  advanced: {
    label:       "Avanzado",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Mercado ambiguo, sweep parcial, arbitraje supervivencia / invalidación / R/R.",
  },
};

export function sessionVerdict(score: number, logicalCount: number, total: number): string {
  if (logicalCount >= total - 1) return "Stop sniper";
  if (score >= 70)               return "Buena protección";
  if (score >= 50)               return "Lectura sólida";
  if (score >= 30)               return "Por pulir";
  if (score >= 10)               return "Demasiado emocional";
  return "Le das tu SL al mercado";
}

// Re-export FR para comparar si fuese necesario.
export { FR_TEMPLATES as PLACE_STOP_TEMPLATES_FR };
