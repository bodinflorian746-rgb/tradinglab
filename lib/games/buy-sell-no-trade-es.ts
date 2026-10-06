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
import type { MarketCtx } from "./candle-realism";
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
export { withAssetPrices } from "./buy-sell-no-trade";

export { ROUNDS_PER_SESSION, scoreChoice, mulberry32 };

// ─── Tabla de traducción para etiquetas de zonas ─────────────────────────────

const ZONE_LABEL_ES: Record<string, string> = {
  "Résistance":           "Resistencia",
  "Support":              "Soporte",
  "Résistance HTF":       "Resistencia HTF",
  "Support HTF":          "Soporte HTF",
  "Plus bas précédent":        "Mínimo anterior",
  "Plus haut précédent":       "Máximo anterior",
  "Liquidité au-dessus":  "Liquidity arriba",
  "Liquidité en-dessous": "Liquidity abajo",
  "Liquidité balayée":    "Liquidity barrida",
  "FVG haussier":         "FVG alcista",
  "Haut du range":        "Techo del rango",
  "Bas du range":       "Piso del rango",
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
  ctx: MarketCtx = {},
): BuySellChart {
  const chart = buildChartFr(setup, seed, volatility, difficulty, ctx);
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
    context: "El precio consolida bajo una resistencia mayor y acaba de romperla con una vela impulsiva.",
    rationales: {
      BUY: "✓ Aquí, el HTF es alcista y el breakout va en su sentido. La resistencia acaba de romperse con una vela impulsiva: es un escenario de continuación típico. En este caso, un BUY es la lectura más lógica.",
      SELL: "✗ Vender frente a un breakout alcista, con HTF alcista, aquí supone ir a contracorriente sin señal de reversión. Este tipo de trade suele ser emocional.",
      NO_TRADE: "✗ Aquí, el setup cumple los criterios: breakout, HTF alineado, contexto macro sin peligro. Pasar de turno en este caso se parece más a una oportunidad perdida que a disciplina.",
    },
    lessons: {
      beginner:     "Referencia simple: un breakout en el sentido del HTF, sin peligro macro, puede ser un trade válido. En este caso, no hace falta complicarlo más.",
      intermediate: "Cuando HTF, estructura y contexto se alinean, la ventaja se vuelve estadística. Este tipo de configuración puede merecer un lugar en tu plan de trading.",
      advanced:     "Los setups de alineación tan limpios son más bien raros. Cuando aparecen, el tamaño se decide según tu plan de risk management, no por instinto.",
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
    context: "El precio consolida sobre un soporte mayor y acaba de romperlo con una vela impulsiva.",
    rationales: {
      BUY: "✗ Comprar una ruptura de soporte con HTF bajista supone aquí ir contra el mercado. No aparece ninguna señal de reversión, solo una aceleración bajista.",
      SELL: "✓ Ruptura limpia en el sentido del HTF bajista, con momentum del lado vendedor. Aquí, un SELL es la lectura más coherente.",
      NO_TRADE: "✗ HTF alineado, ruptura limpia, sin news: aquí, la configuración parece completa. Pasar de turno en este caso es menos prudencia que duda.",
    },
    lessons: {
      beginner:     "El espejo del breakout alcista: con HTF bajista y un soporte roto, un SELL sigue siendo coherente con el escenario, si encaja con tu plan.",
      intermediate: "Tras una ruptura limpia alineada con el HTF, la continuación suele ser el escenario más probable. Buen razonamiento: este setup cumple los criterios. En condiciones reales, la decisión final depende de tu plan.",
      advanced:     "Si el breakout parece demasiado obvio, ojo con el retest. Con HTF alineado y estructura clara, el tamaño sigue tu plan de risk management, y un stop sobre el soporte roto es una opción lógica.",
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
    context: "El precio acaba de romper sobre una resistencia, pero el HTF sigue bajista. La ruptura parece sospechosa.",
    rationales: {
      BUY: "✗ Aquí, sigues el breakout sin mirar el HTF. Una ruptura alcista con HTF bajista puede ser a menudo una trampa de liquidity: un escenario donde muchos traders quedan atrapados.",
      SELL: "✓ Aquí, HTF bajista y breakout contra la tendencia pueden señalar un fakeout. La liquidity sobre la resistencia suele alimentar a los vendedores. Un SELL después de la trampa tiene sentido.",
      NO_TRADE: "≈ No es una catástrofe (evitas la trampa), pero aquí el HTF bajista y la señal contra la tendencia dan una ventaja bastante clara del lado SELL. Un trader con experiencia podría tomarlo.",
    },
    lessons: {
      beginner:     "Referencia útil: un breakout EN CONTRA del HTF suele ser una trampa. En este caso (HTF bajista, breakout alcista), quedarse fuera o buscar el SELL son dos opciones lógicas.",
      intermediate: "Una trampa clásica: la ruptura puede servir para absorber la liquidity de los stops situados sobre la resistencia, antes de un regreso en el sentido del HTF.",
      advanced:     "Aquí, aún no tienes la confirmación de la mecha de rechazo: decides ANTES. Si el HTF y la macro lo permiten, anticipar el fakeout puede ser una ventaja real. Si no, NO TRADE tiene sentido.",
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
    context: "El precio acaba de romper bajo un soporte, pero el HTF sigue alcista. La ruptura parece una trampa.",
    rationales: {
      BUY: "✓ Aquí, HTF alcista y breakout bajista contra la tendencia pueden señalar una trampa. La liquidity bajo el soporte suele recogerse antes del movimiento alcista. Un BUY en el regreso tiene sentido.",
      SELL: "✗ Vender una ruptura contra el HTF supone aquí unirse a los vendedores atrapados. Estos fakeouts suelen volver en el sentido del HTF.",
      NO_TRADE: "≈ Evitas la pérdida, pero dejas pasar la oportunidad. Aquí, jugar a la contra del fakeout era una opción lógica.",
    },
    lessons: {
      beginner:     "Una ruptura EN CONTRA del HTF puede ser una trampa. Vender una ruptura bajista en un mercado alcista sigue siendo, en la mayoría de los casos, una apuesta arriesgada.",
      intermediate: "Aquí, el stop hunt bajo el soporte puede señalar una reversión alcista si el HTF está alineado, a confirmar antes de actuar. Puede que el mercado acabe de recargar combustible para subir.",
      advanced:     "Aquí, decides ANTES de que el precio vuelva sobre el soporte. Si HTF y estructura están alineados, un BUY tiene sentido. Si dudas, NO TRADE sigue siendo una opción lógica.",
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
    context: "Tendencia alcista establecida, el precio corrige hacia un soporte visible.",
    rationales: {
      BUY: "✓ Aquí, el pullback dentro de la tendencia ofrece una oportunidad de compra a mejor precio. Te sumas a la tendencia en lugar de perseguirla, a menudo con un mejor R/R.",
      SELL: "✗ Vender en una tendencia alcista suele ser remar contra la corriente. Aquí, el pullback se parece más a una oportunidad de compra que a una señal de venta.",
      NO_TRADE: "≈ Prudente, pero aquí la configuración está limpia. La disciplina también consiste en tomar los buenos trades, no solo en evitarlos.",
    },
    lessons: {
      beginner:     "En una tendencia alcista, los retrocesos suelen ser los mejores momentos para comprar, más que al revés. Es uno de los trades más habituales entre los traders de tendencia.",
      intermediate: "Un pullback en el sentido del HTF, sobre un soporte visible, suele estar entre los setups más sólidos.",
      advanced:     "Un pullback profundo no invalida necesariamente el escenario. Mientras el HTF aguante y la estructura no se rompa, el pullback puede seguir siendo una oportunidad.",
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
    context: "Tendencia bajista establecida, el precio rebota hacia una resistencia.",
    rationales: {
      BUY: "✗ Comprar el rebote en una tendencia bajista supone aquí intentar adivinar el suelo. Este tipo de trade suele ser perdedor.",
      SELL: "✓ Aquí, el rebote devuelve el precio a una resistencia visible. Vender en el sentido del HTF bajista, a mejor precio, es una opción lógica.",
      NO_TRADE: "≈ No está mal, pero aquí el HTF y la zona están alineados. La disciplina consiste en filtrar los trades, no en evitarlos todos.",
    },
    lessons: {
      beginner:     "En tendencia bajista, se buscan más bien los rebotes para vender. Comprar esperando una subida suele ir contra el mercado.",
      intermediate: "Aquí, un pullback sobre una resistencia en tendencia bajista puede ser un setup de buena probabilidad, a evaluar según tu plan de trading.",
      advanced:     "Si la resistencia se retestea limpiamente y el HTF sigue intacto, el SELL tiene sentido. Si la estructura se rompe durante el pullback, NO TRADE pasa a ser la opción lógica.",
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
    context: "El precio acaba de llegar a una resistencia mayor tras una fuerte subida. La zona ya rechazó varias veces.",
    rationales: {
      BUY: "✗ Comprar bajo una resistencia mayor, con HTF bajista, supone aquí esperar que el nivel que ha rechazado el precio hasta ahora no lo rechace esta vez.",
      SELL: "✓ Aquí, una zona defendida por los vendedores y un HTF bajista pueden señalar una reversión. Un SELL con stop sobre la zona es una opción lógica.",
      NO_TRADE: "≈ Esperar una confirmación extra se entiende. Pero aquí, un HTF y una zona alineados suelen bastar.",
    },
    lessons: {
      beginner:     "Resistencia mayor y HTF bajista: un SELL sigue siendo coherente con el escenario, si encaja con tu plan. Aquí el mercado te da dos razones para ir en el mismo sentido.",
      intermediate: "Las zonas HTF suelen aguantar mejor que las zonas LTF. En el primer test de una resistencia mayor HTF, el rechazo es frecuente, aunque no sistemático.",
      advanced:     "Si la zona ya se ha testeado 3 veces o más, ojo con la ruptura (cada test puede debilitar el nivel). Con 1 o 2 tests en el sentido del HTF, el tamaño depende de tu plan de risk management.",
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
      BUY: "✓ Aquí, un soporte mayor y un HTF alcista dibujan una zona de compra. Los compradores defienden el nivel y el contexto está alineado. Un BUY con stop bajo la zona es una opción lógica.",
      SELL: "✗ Vender bajo un soporte mayor defendido, con HTF alcista, supone aquí posicionarse contra la ventaja estadística. En este caso, mejor abstenerse.",
      NO_TRADE: "≈ Esperar confirmación no está mal, pero aquí el HTF y la zona suelen dar ya la señal.",
    },
    lessons: {
      beginner:     "Soporte mayor y HTF alcista: un BUY sigue siendo coherente con el escenario, si encaja con tu plan. Es el simétrico del rechazo de resistencia.",
      intermediate: "En el primer test, las zonas HTF suelen aguantar más de lo que se rompen. Esa asimetría es la que puede crear una ventaja.",
      advanced:     "Los soportes HTF testeados 1 o 2 veces suelen ser los más fiables. Más allá, el nivel puede debilitarse y el escenario ruptura y retest se vuelve más probable.",
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
    context: "El precio acaba de barrer la liquidity bajo el mínimo anterior con un wick grande, y cerró arriba.",
    rationales: {
      BUY: "✓ Aquí, el sweep tomó la liquidity de los vendedores atrapados. Puede que el mercado tenga ahora combustible para subir. Un BUY en el giro tiene sentido.",
      SELL: "✗ Vender DESPUÉS del sweep supone aquí vender donde los grandes compradores suelen entrar. Te arriesgas a unirte a los vendedores atrapados.",
      NO_TRADE: "≈ Sin confirmación después del sweep, NO TRADE es una opción defensiva. Pero aquí, la mecha y el cierre sobre el nivel ya forman una señal creíble.",
    },
    lessons: {
      beginner:     "Una mecha grande que barre una zona y vuelve puede señalar una reversión probable. En este caso, vender el suelo rara vez es la opción lógica; comprarlo tiene sentido.",
      intermediate: "Pattern ICT clásico: toma de liquidity antes de la continuación HTF. Aquí, el sweep es un argumento fuerte a favor de una entrada, a confirmar según tu plan.",
      advanced:     "Esperar la confirmación después del sweep (cierre sobre el nivel roto, estructura alcista) suele ser más seguro. Sin confirmación, anticiparse aumenta el riesgo.",
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
      BUY: "✓ Aquí, un FVG alcista, un HTF alineado y un primer retest pueden formar un soporte sólido. Es un setup ICT clásico.",
      SELL: "✗ Vender sobre un FVG alcista aún válido supone aquí ponerse contra una zona que los compradores suelen defender.",
      NO_TRADE: "≈ Si dudas de la mitigación, esperar la reacción tiene sentido. Pero aquí, un HTF alineado y una zona aún intacta dan una ventaja.",
    },
    lessons: {
      beginner:     "El FVG suele actuar como imán para el precio y luego como soporte en el retest. Si el HTF está alineado, un BUY es una opción lógica.",
      intermediate: "Una zona totalmente llenada no queda necesariamente invalidada. Aquí, lo que cuenta es la reacción en el retest. Con una reacción visible y un HTF alineado, un BUY tiene sentido.",
      advanced:     "Distingue: una mitigación parcial (zona intacta) puede sostener un BUY de buena probabilidad. Una mitigación profunda (más del 75 %) sin reacción apunta más bien a NO TRADE o a una reversión.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["lectura", "FVG", "desequilibrio"],
  },
  {
    id: "trade_before_news",
    title: "News macro inminente",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "dangereux",
    metric: "discipline",
    context: "Una news macro mayor (NFP / FOMC / CPI) se espera en menos de 30 minutos. El mercado está nervioso: los precios pueden saltar en cualquier momento.",
    rationales: {
      BUY: "✗ Operar 30 min antes de un NFP expone aquí tu edge a un riesgo alto: spread de 3 a 5 veces más amplio de lo habitual, slippage importante, un stop que puede saltar sea cual sea la dirección. En este caso, el setup pesa poco.",
      SELL: "✗ Mismo problema: aquí, el sentido cuenta menos que la VOLATILIDAD y el SPREAD. Tu TP puede ser válido, pero es probable que tu stop salte.",
      NO_TRADE: "✓ Decisión de pro. Sin trade, no hay pérdida. Una vez pasada la news, el mercado suele recuperar su estructura, y puedes volver en 1h a un gráfico legible.",
    },
    lessons: {
      beginner:     "Referencia prudente: evitar operar en los 30 min antes y los 15 min después de una news mayor. Muchos traders lo convierten en una regla de su plan.",
      intermediate: "El spread puede triplicarse, tu SL puede saltar por el bid-ask, y las estadísticas del setup se aplican mal a un mercado ilíquido. Aquí, esperar suele ser la mejor opción.",
      advanced:     "Aun con una opinión sobre el resultado de la news, la volatilidad de ejecución juega en tu contra. Si insistes en operar, una opción lógica es dividir el tamaño por 3 y duplicar el stop. Si no, NO TRADE.",
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
      BUY: "✗ Comprar en medio de un range no ofrece aquí ninguna ventaja clara: sin soporte testeado, sin señal, sin catalizador. Asumes el riesgo sin una razón real.",
      SELL: "✗ Lo mismo del lado vendedor: sin resistencia testeada, sin señal. En este caso, el trade se parece sobre todo a una apuesta.",
      NO_TRADE: "✓ Aquí, el mercado no ofrece nada legible. Los buenos trades llegarán más bien en los bordes del range o en la ruptura. Paciencia.",
    },
    lessons: {
      beginner:     "Si no puedes explicar en una frase por qué existe el trade, suele ser mejor no tomarlo. Aquí, NO TRADE.",
      intermediate: "Operar el medio de un range suele suponer arriesgar 1 para ganar unos 0,3 (un R/R de aprox. 1:0,3). Un range se opera más bien en sus bordes.",
      advanced:     "La disciplina cuenta más que la actividad. Muchos traders con experiencia filtran mucho sus entradas. No operar también es una decisión en sí misma.",
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
    context: "El precio acaba de romper sobre la resistencia, pero a la vela impulsiva le falta body cruelmente.",
    shortContext: "Ruptura alcista, body muy débil.",
    rationales: {
      BUY: "✗ Aquí, persigues una ruptura débil. Sin una vela de momentum nítida, la continuación se vuelve mucho menos probable y el R/R esperado se degrada.",
      SELL: "✗ Vender una ruptura alcista sin señal de reversión parece aquí prematuro: no hay ni vela de reversión ni estructura bajista.",
      NO_TRADE: "✓ Una ruptura es más operable cuando se impone. Sin vela impulsiva, una opción lógica es esperar un retest limpio o una continuación clara. Paciencia.",
    },
    lessons: {
      beginner:     "Una vela grande que rompe una zona aporta una confirmación fuerte. Una vela pequeña que apenas rompe sigue siendo una confirmación débil, a menudo insuficiente para actuar.",
      intermediate: "El mercado no da una señal limpia en cada ruptura. Si falta convicción, nada te obliga a entrar.",
      advanced:     "Una ruptura sin cuerpo suele servir de cebo de liquidity: estos breakouts débiles atrapan a menudo a los traders impacientes. Aquí, NO TRADE y observar es una opción lógica.",
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
    context: "El FVG alcista se mitigó en más del 85 % de su altura. La reacción se demora, los compradores ya no defienden la zona.",
    shortContext: "FVG mitigado en más del 85 %, sin reacción.",
    rationales: {
      BUY: "✗ Aquí, apuestas por un rebote que no llega. Una mitigación profunda sin reacción puede señalar un FVG agotado: los compradores ya no parecen defender la zona.",
      SELL: "✗ Prematuro: aún no hay ninguna ruptura estructural confirmada. Aquí, venderías una intuición más que una señal.",
      NO_TRADE: "✓ Aquí, la ventaja es insuficiente. Una opción lógica: esperar un rechazo claro del bajo del FVG (BUY confirmado) o una ruptura estructural (SELL confirmado).",
    },
    lessons: {
      beginner:     "Si una zona tarda en reaccionar, suele perder valor. En este caso, mejor esperar la siguiente.",
      intermediate: "Una zona profundamente mitigada suele perder su ventaja. Si la reacción no llega en 2-3 velas, la zona puede considerarse agotada.",
      advanced:     "Un FVG mitigado más del 80 % sin reacción puede orientar a buscar una ruptura bajista para un SELL. Sin esa ruptura, NO TRADE sigue siendo la opción lógica.",
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
    context: "HTF bajista nítido. El precio rebota localmente sobre un nivel secundario, pero la tendencia sigue en contra tuya.",
    shortContext: "Rebote local en una tendencia bajista HTF.",
    rationales: {
      BUY: "✗ Operar contra la tendencia HTF apostando por un nivel secundario supone aquí jugar una probabilidad baja. Las estadísticas suelen ir en tu contra antes incluso del click.",
      SELL: "✗ No es el momento: aquí, el rebote local aún no muestra signos de agotamiento. Si vendes ahora, 2-3 velas verdes pueden sacarte antes de la reanudación.",
      NO_TRADE: "✓ El setup local se sostiene, PERO va contra el HTF: aquí falta la ventaja. Una opción lógica es esperar el agotamiento del rebote y una zona HTF clara para vender.",
    },
    lessons: {
      beginner:     "Con HTF bajista, se buscan más bien los SELL; los BUY contra la tendencia siguen siendo apuestas arriesgadas.",
      intermediate: "Un setup local no borra la tendencia HTF. Si el HTF va en tu contra, suele ser mejor abstenerse, aunque la zona local aguante.",
      advanced:     "En una tendencia bajista, los rebotes ofrecen más bien oportunidades de SELL que de BUY. Pero el timing cuenta: aquí es demasiado pronto, sin mecha de rechazo sobre una resistencia HTF.",
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
    context: "El precio acaba de barrer la liquidity de los dos bordes del range. Ninguna dirección clara, la acumulación institucional es invisible.",
    shortContext: "Range con sweep de los dos bordes.",
    rationales: {
      BUY: "✗ Aquí no hay señal de compra. El sweep reciente del techo hace que la zona baja sea menos fiable como soporte. Falta la ventaja.",
      SELL: "✗ Simétrico: el sweep reciente del suelo hace que la zona alta sea menos fiable. Aquí, el mercado ha limpiado la liquidity de los dos lados.",
      NO_TRADE: "✓ Aquí no se aprecia ningún sesgo direccional, así que no hay estructura aprovechable. Una opción lógica: esperar una ruptura confirmada o una acumulación reconocible.",
    },
    lessons: {
      intermediate: "Cuando un range ha barrido los dos lados sin dirección, esperar la salida suele ser la decisión más sensata.",
      advanced:     "Un doble sweep puede reflejar una acumulación discreta. En este caso, esperar la salida del range tiene sentido; jugar al ping-pong dentro suele salir caro.",
      beginner:     "Si ves mechas grandes arriba Y abajo, con el precio en el medio, NO TRADE suele ser la opción lógica.",
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
    context: "Setup técnico válido, pero el contexto de ejecución es desfavorable: spread alto, sesión muerta, volatilidad ausente. El R/R real se divide por 2.",
    shortContext: "Setup limpio, pero spread alto en sesión muerta.",
    rationales: {
      BUY: "✗ La señal es buena, pero aquí el contexto degrada el R/R: con un spread alto en sesión muerta, tu stop puede saltar por el bid-ask y tu TP se vuelve difícil de alcanzar. La técnica no basta.",
      SELL: "✗ Contra el HTF, además de un contexto de ejecución ya desfavorable. Aquí se suman dos errores: ir contra la tendencia Y operar con poca liquidity.",
      NO_TRADE: "✓ Decisión de pro. Este tipo de setup suele volver en la sesión de Londres o de Nueva York, con un spread limpio. Aquí, no pierdes nada esperando.",
    },
    lessons: {
      intermediate: "Un buen setup en malas condiciones de ejecución no es necesariamente un buen trade. La técnica Y la ejecución funcionan mejor alineadas.",
      advanced:     "Con un spread 3 veces más amplio de lo habitual y poco volumen, tu R/R real puede dividirse por dos aunque el setup funcione. Muchos traders pro integran la ejecución en su edge.",
      beginner:     "Revisa la sesión y el spread ANTES de hacer click. En horas muertas, un setup suele merecer un NO TRADE.",
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
