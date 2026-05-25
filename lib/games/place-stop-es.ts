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
      beginner:     "El stop lógico se coloca DETRÁS del swing low con un margen, jamás dentro (ruido), jamás demasiado lejos (RR arruinado).",
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
      beginner:     "El stop lógico se coloca SOBRE el swing high con margen, jamás debajo, jamás demasiado lejos.",
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
    title: "Falso breakout : short tras rechazo",
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
      beginner:     "El mercado acaba de pinchar una zona, tu stop debe estar BAJO esa zona, no dentro.",
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
      advanced:     "En vol elevada, el stop 'normal' se vuelve demasiado ajustado. El margen debe duplicarse, lo que parece un wide stop en realidad es el LÓGICO aquí.",
      intermediate: "La volatilidad amplía el ruido normal. Un stop 'estándar' probablemente está demasiado ajustado.",
      beginner:     "Cuanto más se mueve el mercado, más amplio debe ser tu stop para respirar.",
    },
    difficulties: ["advanced"],
    tag: "volatilidad",
  },
  {
    id: "equal_lows_trap",
    title: "Doble suelo aparente — la liquidez atrapada",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Dos lows casi iguales con unos pips de diferencia. El patrón parece un doble suelo. Pero esta simetría atrae la liquidez retail.",
    shortContext: "Doble suelo aparente",
    lessons: {
      beginner:     "2 lows casi iguales = doble suelo evidente para los retails. Stop con margen bajo la zona, no pegado dentro.",
      intermediate: "Cuando 2 lows son casi iguales, crean una zona de liquidez visible para todos. Los institucionales vienen a buscarla antes de reversar. SL debajo pero con margen anti-sweep.",
      advanced:     "Equal lows = doble suelo retail = liquidity pool institucional. La invalidación real no está bajo los lows, son varios ATR más abajo, después del sweep.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "round_number_sweep",
    title: "Número redondo — la zona que todos ven",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio flota justo encima de un nivel psicológico mayor (número redondo). Todos los retails tienen su SL justo debajo de este nivel.",
    shortContext: "Debajo de número redondo",
    lessons: {
      beginner:     "Los números redondos (1.1000, 100 000, etc.) atraen los SL retail. Coloca tu stop más lejos, nunca justo debajo.",
      intermediate: "Números redondos = niveles psicológicos = liquidez concentrada. Los retails colocan SL y TP en masa. Los algos los sweep sistemáticamente.",
      advanced:     "1.1000, 4 300, 100 000... estos niveles atraen los stops. Colocar el SL justo debajo = darle tu posición al algo. SL más lejos, o no operar.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "asia_high_sweep",
    title: "Asia high — sweep predecible en la apertura de Londres",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Sesión asiática terminada, range bien definido. Apertura de Londres en 10 minutos. Vendes el high del range Asia.",
    shortContext: "Antes de la apertura de Londres",
    lessons: {
      beginner:     "El Asia high suele ser sweep en la apertura de Londres. Tu SL debe estar sobre el sweep esperado, no pegado al high.",
      intermediate: "El Asia high es sweep en ~60% de las sesiones en la apertura de Londres. Vender pegado al high sin anticipar este sweep = stop out garantizado.",
      advanced:     "El sweep del Asia high es una mecánica de mercado institucional bien documentada. SL sobre el sweep esperado, no sobre el high.",
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
      beginner:     "La invalidación de un Order Block está bajo su bottom, no bajo el swing low reciente. Coloca el SL en consecuencia.",
      intermediate: "El bottom del Order Block define la invalidación del concepto, no el último swing. SL bajo el bottom del OB con margen.",
      advanced:     "La invalidación de un Order Block está bajo su bottom, no bajo el último swing low. Confundir los dos = stop out en la mecha de mitigation cuando el setup sigue válido.",
    },
    difficulties: ["advanced"],
    tag: "lectura",
  },
  {
    id: "prev_day_low_trap",
    title: "Previous Day Low — la liquidez diaria",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "El precio se acerca al Previous Day Low. La zona es conocida por todos los participantes institucionales. Preparas tu BUY.",
    shortContext: "Cerca del PDL",
    lessons: {
      beginner:     "PDL = Previous Day Low. Es una zona de caza institucional. SL bajo PDL con margen, no pegado debajo.",
      intermediate: "PDL = Previous Day Low = nivel de liquidez diario. Los algos lo usan como zona de caza. SL pegado debajo = capturado.",
      advanced:     "El PDL forma parte de los niveles institucionales mayores junto con PDH, PWL, PWH, PML. Cualquier SL colocado a 0-5 pips bajo uno de estos niveles tiene una probabilidad elevada de ser cazado antes del verdadero move.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trampa",
  },
  {
    id: "news_vol_expansion",
    title: "Volatilidad ATR doblada — SL estándar se vuelve tight",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "ATR del día a 2x el promedio de 20 días. Volatilidad excepcional después del FOMC. Tomas tu setup habitual con tu margen SL estándar.",
    shortContext: "ATR x2 vs normal",
    lessons: {
      beginner:     "Cuando la vol explota (FOMC, NFP), un SL 'normal' se vuelve tight. Amplía el margen al ATR del día.",
      intermediate: "En día de ATR doblado, el SL 'estándar' es en práctica tight. Margen ajustado a la vol real, sino stop out automático.",
      advanced:     "El tamaño del SL no es un número fijo en pips. Es un múltiplo del ATR del día. Cuando el ATR se dobla, el margen SL debe doblarse también, sino tu SL se vuelve estadísticamente tight.",
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
    shortContext: "Bias H4 más profundo",
    lessons: {
      beginner:     "Cuando el setup está en H1 pero el bias HTF en H4, tu SL debe respetar el HL H4, no el swing H1.",
      intermediate: "El SL debe estar a la escala del timeframe de invalidación, no del timeframe de entrada. Setup H1 + bias H4 = SL bajo HL H4.",
      advanced:     "El SL debe colocarse a la escala del setup. Setup H1 con bias H4 = SL al mínimo bajo el HL H4 pertinente. Sino la fluctuación normal H1 te saca antes del verdadero move.",
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
      beginner:     "Cuando 2 swing lows están cerca, respeta el MÁS BAJO para el SL. El 1ro será sweep antes de la ruptura real.",
      intermediate: "Cuando 2 swing lows están cerca, la invalidación estructural requiere que el MÁS BAJO sea roto. SL bajo el primero = stop out en fluctuación normal.",
      advanced:     "Sequence of lows: mientras el bottom más bajo aguante, la estructura alcista no está rota. SL bajo el 1er swing ignora esta mecánica de mercado.",
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
      beginner:     "Cuando un fakeout ya es visible, el verdadero high a invalidar es la mecha, no el techo del cuerpo.",
      intermediate: "El retest natural después de un fakeout va a buscar la mecha. SL sobre el wick + margen, no sobre el cuerpo.",
      advanced:     "Cuando un fakeout ya ocurrió, el verdadero high a invalidar es la punta de la mecha, no el swing high del cuerpo. SL bajo la mecha = stop out en el retest natural del wick.",
    },
    difficulties: ["advanced"],
    tag: "trampa",
  },
  {
    id: "tight_consolidation",
    title: "Range estrecho — el arbitraje tamaño SL vs RR",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Range estrecho: amplitud baja, precio atrapado entre soporte y resistencia cercanos. Quieres entrar BUY en el soporte. El RR será malo con un SL estándar.",
    shortContext: "Range estrecho",
    lessons: {
      beginner:     "En un range estrecho, o esperas una ruptura, o reduces tu tamaño de posición. SL estándar = RR pésimo.",
      intermediate: "Range estrecho + SL estándar = RR malo. Range estrecho + SL tight = stop out. La solución: esperar expansión, o reducir el tamaño de lote.",
      advanced:     "En un range estrecho, el arbitraje SL/RR se vuelve insoluble sin compromiso sobre el tamaño. O esperas expansión, o aceptas un RR < 1:2 y compensas con el winrate.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "estructura",
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
  // V2.1 — zones des nouveaux scénarios
  "Equal lows":           "Equal lows",
  "Chiffre rond":         "Número redondo",
  "Asia high":            "Asia high",
  "Order Block":          "Order Block",
  "PDL":                  "PDL",
  "HL H4":                "HL H4",
  "Swing low H1":         "Swing low H1",
  "Swing low 1":          "Swing low 1",
  "Swing low 2":          "Swing low 2",
  "Bottom range":         "Bottom range",
  "Top range":            "Top range",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_ES[z.label] ?? z.label }));
}

// ─── Tabla de traducción de rationales ───────────────────────────────────────
// Las rationales se incrustan en el chart (no en los templates). Las del módulo
// FR son strings fijos; las traducimos por mapping de exact-match.

const TIGHT_RATIONALE_FR = "✗ Trop serré, placé dans le bruit normal du marché. La 1re mèche de retest va le balayer avant que le trade aboutisse. C'est l'erreur retail classique.";
const LOGICAL_RATIONALE_FR = "✓ Placement logique, derrière la vraie invalidation, avec une marge anti-bruit. Survit aux retests, capture la cassure structurelle si elle arrive.";
const WIDE_RATIONALE_FR = "≈ Survit, mais détruit le RR. Distance trop grande = capital mal utilisé, ratio risque/rendement souvent < 1.";

const FAKEOUT_TIGHT_FR   = "✗ Stop dans la zone du piège, pile dans la zone que les institutionnels viennent d'utiliser pour ramasser la liquidité. Le 2e test va te balayer.";
const FAKEOUT_LOGICAL_FR = "✓ Au-dessus du pic du fakeout, avec marge. C'est la VRAIE invalidation du piège, si le prix repasse là, le scénario est cassé.";

const SWEEP_TIGHT_FR   = "✗ Stop DANS la zone du sweep, exactement là où les institutionnels viennent de ramasser la liquidité. Le retest va te chercher.";
const SWEEP_LOGICAL_FR = "✓ Sous la mèche du sweep, avec marge. Le low du sweep est la nouvelle invalidation, protégé contre un 2e ramassage.";

const FVG_TIGHT_FR   = "✗ Stop DANS le FVG, la zone est précisément celle où le marché peut retourner pour finir sa mitigation. Tu seras pris dans la profondeur de la zone.";
const FVG_LOGICAL_FR = "✓ Sous le bas du FVG avec marge. Le FVG entièrement traversé = invalidation propre. C'est le placement structurel correct.";

const HIGHVOL_TIGHT_FR   = "✗ Stop 'standard', qui serait OK en vol normale, mais en vol élevée ce niveau est dans le bruit. La 1re bougie de retest, large à cause de la vol, va te balayer.";
const HIGHVOL_LOGICAL_FR = "✓ Stop élargi à la volatilité du marché. Ce qui ressemble à un 'wide stop' en vol normale est en fait le LOGIQUE ici, il survit au noise amplifié sans tuer le RR (TP également plus loin).";
const HIGHVOL_WIDE_FR    = "≈ Survie garantie, mais même avec un TP étendu en vol élevée, le RR descend sous 1.5. Capital mal utilisé.";

// V2.1 — rationales des nouveaux scénarios
const EQUAL_LOWS_TIGHT_FR_NEW   = "✗ Stop DANS la zone de liquidité créée par les 2 equal lows. C'est le SL retail évident, les institutionnels le ramassent avant de partir en hausse.";
const EQUAL_LOWS_LOGICAL_FR_NEW = "✓ Sous la zone de sweep des 2 lows + marge anti-mèche. C'est l'invalidation réelle du concept, protégé contre la chasse à la liquidité retail.";
const ROUND_LIQUIDITY_FR_NEW    = "✗ Stop pile sous le chiffre rond, exactement là où tous les SL retail sont entassés. Les algos sweep ce niveau de façon systématique.";
const ROUND_LOGICAL_FR_NEW      = "✓ Sous le sweep attendu du chiffre rond + marge. Le SL est hors de la zone que les algos viennent ramasser, le setup reste valide après la chasse.";
const ASIA_LIQUIDITY_FR_NEW     = "✗ Stop pile au-dessus de l'Asia high, dans la zone que le London open va sweep. C'est le piège classique de l'ouverture européenne.";
const ASIA_LOGICAL_FR_NEW       = "✓ Au-dessus du sweep attendu de l'Asia high + marge. Si le prix revient là après l'ouverture London, c'est que le bias bearish est faux.";
const OB_TIGHT_FR_NEW           = "✗ Stop sous le swing low, mais au-dessus du bas du Order Block. Le swing va être sweep alors que le concept OB est encore valide.";
const OB_LOGICAL_FR_NEW         = "✓ Sous le bas du Order Block + marge. C'est la VRAIE invalidation du concept OB, le swing low peut être sweep sans que le setup soit cassé.";
const PDL_LIQUIDITY_FR_NEW      = "✗ Stop pile sous le PDL, niveau institutionnel quotidien chassé quasi systématiquement. Tu offres ta position aux algos.";
const PDL_LOGICAL_FR_NEW        = "✓ Sous la zone de chasse du PDL + marge. Le sweep attendu peut avoir lieu, le SL est hors de la zone d'embuscade institutionnelle.";
const NEWS_TIGHT_FR_NEW         = "✗ Stop 'standard' calibré pour vol normale, mais l'ATR du jour est doublé. Ce qui paraît raisonnable est en fait tight pour la vol réelle.";
const NEWS_LOGICAL_FR_NEW       = "✓ Marge calibrée sur la vol réelle du jour (ATR doublé). Ce qui semble large en vol normale est le LOGIQUE ici, survit au bruit amplifié.";
const NEWS_WIDE_FR_NEW          = "≈ Survit largement, mais marge surestimée même pour ATR doublé. Capital sous-utilisé, RR plus faible qu'avec logical.";
const HTF_TIGHT_FR_NEW          = "✗ Stop sous le swing low H1, mais le bias H4 n'est pas cassé. Une fluctuation H1 normale va te sortir alors que le setup HTF reste valide.";
const HTF_LOGICAL_FR_NEW        = "✓ Sous le HL H4 pertinent + marge. Le bias HTF doit être cassé pour invalider le setup, pas une simple fluctuation H1.";
const MULTI_TIGHT_FR_NEW        = "✗ Stop sous le 1er swing low (le plus haut), mais le swing low plus bas tient encore. La structure n'est pas cassée, tu seras stop sur le retest du 2e low.";
const MULTI_LOGICAL_FR_NEW      = "✓ Sous le PLUS BAS des 2 swing lows + marge. C'est l'invalidation structurelle réelle, tant que ce niveau tient la structure bullish est intacte.";
const FAKE2_TIGHT_FR_NEW        = "✗ Stop au-dessus du swing high du corps, mais sous la mèche du fakeout. Le retest naturel du wick va te chercher.";
const FAKE2_LOGICAL_FR_NEW      = "✓ Au-dessus de la mèche du fakeout + marge. La pointe du wick est le vrai high à invalider, pas le sommet du corps.";
const TIGHTCONS_TIGHT_FR_NEW    = "✗ Stop dans le range serré, dans le bruit normal de la consolidation. La 1re oscillation du range va le balayer.";
const TIGHTCONS_LOGICAL_FR_NEW  = "✓ Juste sous le bottom du range + marge. Le SL respecte la structure du range, mais le RR sera limité par le top, à arbitrer avec la taille de position.";
const TIGHTCONS_WIDE_FR_NEW     = "≈ SL très large, mais le RR est rendu impossible par le plafond du range. Sans expansion, le trade n'a pas de marge bénéfice.";

const RATIONALE_ES: Record<string, string> = {
  [TIGHT_RATIONALE_FR]:   "✗ Demasiado ajustado, colocado en el ruido normal del mercado. La 1ra mecha de retest lo va a barrer antes de que el trade prospere. Es el error retail clásico.",
  [LOGICAL_RATIONALE_FR]: "✓ Colocación lógica, detrás de la verdadera invalidación, con un margen anti-ruido. Sobrevive a los retests, captura la ruptura estructural si llega.",
  [WIDE_RATIONALE_FR]:    "≈ Sobrevive, pero destruye el RR. Distancia demasiado grande = capital mal utilizado, ratio riesgo/recompensa a menudo < 1.",
  [FAKEOUT_TIGHT_FR]:     "✗ Stop en la zona de la trampa, pile en la zona que los institucionales acaban de usar para recoger la liquidity. El 2do test te va a barrer.",
  [FAKEOUT_LOGICAL_FR]:   "✓ Sobre el pico del fakeout, con margen. Es la VERDADERA invalidación de la trampa, si el precio vuelve a pasar por ahí, el escenario está roto.",
  [SWEEP_TIGHT_FR]:       "✗ Stop DENTRO de la zona del sweep, exactamente donde los institucionales acaban de recoger la liquidity. El retest te va a buscar.",
  [SWEEP_LOGICAL_FR]:     "✓ Bajo la mecha del sweep, con margen. El low del sweep es la nueva invalidación, protegido contra una 2da recogida.",
  [FVG_TIGHT_FR]:         "✗ Stop DENTRO del FVG, la zona es precisamente la que el mercado puede regresar para terminar su mitigation. Quedarás atrapado en la profundidad de la zona.",
  [FVG_LOGICAL_FR]:       "✓ Bajo el bottom del FVG con margen. El FVG totalmente atravesado = invalidación limpia. Es la colocación estructural correcta.",
  [HIGHVOL_TIGHT_FR]:     "✗ Stop 'estándar', que estaría OK en vol normal, pero en vol elevada este nivel está dentro del ruido. La 1ra vela de retest, amplia por la vol, te va a barrer.",
  [HIGHVOL_LOGICAL_FR]:   "✓ Stop ampliado a la volatilidad del mercado. Lo que parece un 'wide stop' en vol normal en realidad es el LÓGICO aquí, sobrevive al noise amplificado sin matar el RR (TP también más lejos).",
  [HIGHVOL_WIDE_FR]:      "≈ Supervivencia garantizada, pero incluso con un TP extendido en vol elevada, el RR baja debajo de 1.5. Capital mal utilizado.",
  // V2.1
  [EQUAL_LOWS_TIGHT_FR_NEW]:   "✗ Stop DENTRO de la zona de liquidez creada por los 2 equal lows. Es el SL retail evidente, los institucionales lo recogen antes de subir.",
  [EQUAL_LOWS_LOGICAL_FR_NEW]: "✓ Bajo la zona de sweep de los 2 lows + margen anti-mecha. Es la invalidación real del concepto, protegido contra la caza de liquidez retail.",
  [ROUND_LIQUIDITY_FR_NEW]:    "✗ Stop justo bajo el número redondo, exactamente donde todos los SL retail están amontonados. Los algos sweep ese nivel de forma sistemática.",
  [ROUND_LOGICAL_FR_NEW]:      "✓ Bajo el sweep esperado del número redondo + margen. El SL está fuera de la zona que los algos vienen a recoger, el setup sigue válido después de la caza.",
  [ASIA_LIQUIDITY_FR_NEW]:     "✗ Stop justo encima del Asia high, en la zona que la apertura de Londres va a sweep. Es la trampa clásica de la apertura europea.",
  [ASIA_LOGICAL_FR_NEW]:       "✓ Sobre el sweep esperado del Asia high + margen. Si el precio vuelve ahí después de la apertura de Londres, es que el bias bajista es falso.",
  [OB_TIGHT_FR_NEW]:           "✗ Stop bajo el swing low, pero encima del bottom del Order Block. El swing será sweep mientras el concepto OB sigue válido.",
  [OB_LOGICAL_FR_NEW]:         "✓ Bajo el bottom del Order Block + margen. Es la VERDADERA invalidación del concepto OB, el swing low puede ser sweep sin que el setup esté roto.",
  [PDL_LIQUIDITY_FR_NEW]:      "✗ Stop justo bajo el PDL, nivel institucional diario cazado casi sistemáticamente. Le das tu posición a los algos.",
  [PDL_LOGICAL_FR_NEW]:        "✓ Bajo la zona de caza del PDL + margen. El sweep esperado puede ocurrir, el SL está fuera de la zona de emboscada institucional.",
  [NEWS_TIGHT_FR_NEW]:         "✗ Stop 'estándar' calibrado para vol normal, pero el ATR del día está doblado. Lo que parece razonable en realidad es tight para la vol real.",
  [NEWS_LOGICAL_FR_NEW]:       "✓ Margen calibrado sobre la vol real del día (ATR doblado). Lo que parece amplio en vol normal es el LÓGICO aquí, sobrevive al ruido amplificado.",
  [NEWS_WIDE_FR_NEW]:          "≈ Sobrevive ampliamente, pero margen sobreestimado incluso para ATR doblado. Capital subutilizado, RR más bajo que con logical.",
  [HTF_TIGHT_FR_NEW]:          "✗ Stop bajo el swing low H1, pero el bias H4 no está roto. Una fluctuación H1 normal te va a sacar mientras el setup HTF sigue válido.",
  [HTF_LOGICAL_FR_NEW]:        "✓ Bajo el HL H4 pertinente + margen. El bias HTF debe ser roto para invalidar el setup, no una simple fluctuación H1.",
  [MULTI_TIGHT_FR_NEW]:        "✗ Stop bajo el 1er swing low (el más alto), pero el swing low más bajo todavía aguanta. La estructura no está rota, te sacarán en el retest del 2do low.",
  [MULTI_LOGICAL_FR_NEW]:      "✓ Bajo el MÁS BAJO de los 2 swing lows + margen. Es la invalidación estructural real, mientras este nivel aguante la estructura alcista está intacta.",
  [FAKE2_TIGHT_FR_NEW]:        "✗ Stop sobre el swing high del cuerpo, pero debajo de la mecha del fakeout. El retest natural del wick te va a buscar.",
  [FAKE2_LOGICAL_FR_NEW]:      "✓ Sobre la mecha del fakeout + margen. La punta del wick es el verdadero high a invalidar, no el techo del cuerpo.",
  [TIGHTCONS_TIGHT_FR_NEW]:    "✗ Stop dentro del range estrecho, en el ruido normal de la consolidación. La 1ra oscilación del range lo va a barrer.",
  [TIGHTCONS_LOGICAL_FR_NEW]:  "✓ Justo bajo el bottom del range + margen. El SL respeta la estructura del range, pero el RR estará limitado por el top, a arbitrar con el tamaño de posición.",
  [TIGHTCONS_WIDE_FR_NEW]:     "≈ SL muy amplio, pero el RR es imposible por el techo del range. Sin expansión, el trade no tiene margen de beneficio.",
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
