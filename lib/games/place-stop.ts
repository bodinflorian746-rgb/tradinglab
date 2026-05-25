// Mini-jeu V2 : "QUEL STOP VA SURVIVRE ?"
//
// Le joueur voit un graphique avec :
// - une entrée déjà placée
// - 3 stop loss proposés (A / B / C, ordonnés visuellement top→bottom)
//
// Il choisit le stop le plus logique selon la structure, la volatilité,
// le bruit du marché et le RR.
//
// Après le choix, les bougies futures se révèlent et démontrent le verdict :
//   - tight     → généralement balayé par le 1er noise / sweep
//   - logical   → survit ET le trade va dans le bon sens
//   - wide      → survit mais le RR est tué (capital mal utilisé)
//   - liquidity → placé pile dans une zone évidente de liquidité = piège

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  VOL_MULT, mulberry32, pick, clamp, candle,
} from "./shared";

export type { Asset, Session, Volatility, Spread, HtfBias, MacroContext };
export type { Candle, ChartZone };

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type TradeDirection = "BUY" | "SELL";

export type PlaceStopSetupKey =
  | "pullback_bull"
  | "pullback_bear"
  | "bounce_support"
  | "rejection_resistance"
  | "fakeout_above_resistance"
  | "sweep_low_reversal"
  | "fvg_continuation"
  | "high_vol_pullback"
  | "equal_lows_trap"
  | "round_number_sweep"
  | "asia_high_sweep"
  | "order_block_respect"
  | "prev_day_low_trap"
  | "news_vol_expansion"
  | "htf_invalidation"
  | "multi_swing_low"
  | "fakeout_then_retest"
  | "tight_consolidation";

export type StopType = "tight" | "logical" | "wide" | "liquidity";
export type StopId = "A" | "B" | "C";

export interface StopOption {
  id:        StopId;
  price:     number;
  type:      StopType;
  rationale: string;
}

export interface DifficultyLessons {
  beginner:     string;
  intermediate: string;
  advanced:     string;
}

export interface PlaceStopTemplate {
  id:            PlaceStopSetupKey;
  title:         string;
  direction:     TradeDirection;
  htfBias:       HtfBias;
  macroContext:  MacroContext;
  context:       string;
  shortContext?: string;
  lessons:       DifficultyLessons;
  difficulties:  readonly Difficulty[];
  tag:           string;
}

export interface PlaceStopInstance extends PlaceStopTemplate {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
  seed:       number;
  difficulty: Difficulty;
}

export interface PlaceStopChart {
  past:      Candle[];
  future:    Candle[];
  zones:     ChartZone[];
  domain:    { min: number; max: number };
  entry:     number;
  tp:        number | null;
  direction: TradeDirection;
  stops:     StopOption[];   // 3 stops, ordonnés visuellement top→bottom (A en haut)
}

export const ROUNDS_PER_SESSION = 10;

const ASSETS:        readonly Asset[]      = ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"];
const SESSIONS:      readonly Session[]    = ["Londres", "New York", "Overlap", "Heures mortes"];
const VOLATILITIES:  readonly Volatility[] = ["faible", "normale", "élevée"];
const SPREADS:       readonly Spread[]     = ["faible", "élevé"];

// ─── Templates ────────────────────────────────────────────────────────────────

export const PLACE_STOP_TEMPLATES: PlaceStopTemplate[] = [
  {
    id: "pullback_bull",
    title: "Pullback en tendance haussière",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tendance haussière, le prix corrige sur la zone de demande. Tu es entré au rebond.",
    shortContext: "Pullback BUY dans un uptrend.",
    lessons: {
      beginner:     "Le stop logique se place DERRIÈRE le swing low avec une marge, jamais dedans (bruit), jamais trop loin (RR ruiné).",
      intermediate: "Le bruit du pullback va souvent retester le low avant la continuation. La marge derrière le low protège contre ce sweep classique.",
      advanced:     "Le stop logique respecte 3 contraintes : derrière le low, hors du bruit ATR, et préserve un RR >= 2. C'est le seul qui satisfait les 3.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "pullback_bear",
    title: "Pullback en tendance baissière",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tendance baissière, le prix rebondit sur une zone d'offre. Tu es entré court.",
    shortContext: "Pullback SELL dans un downtrend.",
    lessons: {
      beginner:     "Le stop logique se place AU-DESSUS du swing high avec marge, jamais en dessous, jamais trop loin.",
      intermediate: "Le rebond peut retester son high avant de retomber. Coller le high = stop hunt assuré.",
      advanced:     "Stop = couvre la mèche du high + marge ATR. Un stop pile au niveau est piégé, un stop trop loin tue le RR.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "bounce_support",
    title: "Rebond sur support majeur",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de rebondir sur un support majeur HTF.",
    shortContext: "BUY sur support HTF.",
    lessons: {
      beginner:     "Stop sous le support avec marge réaliste. Pile sur le support = ramassage de liquidité institutionnelle.",
      intermediate: "Le support HTF attire souvent un test profond avant la vraie réaction. La marge protège ce stop hunt.",
      advanced:     "Distance optimale = 1.0 à 1.5x ATR sous le niveau. Plus court = noise, plus loin = capital mort.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lecture",
  },
  {
    id: "rejection_resistance",
    title: "Rejet sur résistance majeure",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix vient de rejeter une résistance majeure HTF avec mèches.",
    shortContext: "SELL sur résistance HTF.",
    lessons: {
      beginner:     "Stop au-dessus de la mèche la plus haute, avec marge. Coller le niveau = stop hunt assuré.",
      intermediate: "Les retests de résistance HTF sont souvent piégeux. Marge derrière la mèche = obligatoire.",
      advanced:     "La mèche du rejet + 1 ATR = zone propre. Coller la mèche = exposé au 2e test, trop loin = RR cassé.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lecture",
  },
  {
    id: "fakeout_above_resistance",
    title: "Faux breakout : short après rejet",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix a piqué au-dessus de la résistance puis a refermé sous. Tu shortes le piège.",
    shortContext: "SELL après fakeout.",
    lessons: {
      intermediate: "Stop au-dessus du PIC du fakeout (jamais à l'intérieur). Le pic est l'invalidation réelle du piège.",
      advanced:     "Stop AU-DESSUS du wick high + ATR margin. Coller le high = retest du fakeout te dégage. Dans le piège = -100.",
      beginner:     "Le stop doit couvrir la mèche du faux breakout. Tout stop placé dans la zone du piège = perdu.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "sweep_low_reversal",
    title: "Sweep de liquidité puis retournement",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de balayer la liquidité sous le précédent low puis a fait demi-tour.",
    shortContext: "BUY après sweep low.",
    lessons: {
      intermediate: "Stop sous le LOW du sweep, jamais dans la zone qui vient d'être prise. Le sweep est la nouvelle invalidation.",
      advanced:     "Stop = sous la mèche du sweep + marge. Pile sur le sweep low = retest probable, dans la zone liquidité = piège total.",
      beginner:     "Le marché vient de piquer une zone, ton stop doit être SOUS cette zone, pas dedans.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "fvg_continuation",
    title: "Réaction sur FVG haussier",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Un FVG haussier laissé après l'impulsion. Le prix le retest et commence à réagir.",
    shortContext: "BUY au retest du FVG.",
    lessons: {
      intermediate: "Stop sous le BAS du FVG. Dans le FVG = exposé à un re-test profond, trop loin = RR fragile.",
      advanced:     "Le FVG est la zone d'invalidation. Stop = bas du FVG - 1 ATR. Plus serré que ça = noise, plus loin = capital mort.",
      beginner:     "Le FVG est ta zone d'achat. Le stop va SOUS la zone, pas dedans.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "lecture",
  },
  {
    id: "high_vol_pullback",
    title: "Pullback en volatilité élevée",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Pullback dans un marché à volatilité élevée. Les bougies sont larges, les wicks profondes.",
    shortContext: "BUY pullback, vol élevée.",
    lessons: {
      advanced:     "En vol élevée, le stop 'normal' devient trop serré. La marge doit être doublée, ce qui ressemble à un wide stop est en fait le LOGIQUE ici.",
      intermediate: "La volatilité élargit le bruit normal. Un stop 'standard' est probablement trop serré.",
      beginner:     "Plus le marché bouge fort, plus ton stop doit être large pour respirer.",
    },
    difficulties: ["advanced"],
    tag: "volatilité",
  },
  {
    id: "equal_lows_trap",
    title: "Double bottom apparent — la liquidité piégée",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Deux lows quasi égaux à quelques pips près. Le pattern ressemble à un double bottom. Mais cette symétrie attire la liquidité retail.",
    shortContext: "Double bottom apparent",
    lessons: {
      beginner:     "2 lows quasi égaux = double bottom évident pour les retails. Stop avec marge sous la zone, pas pile dedans.",
      intermediate: "Quand 2 lows sont quasi égaux, ils créent une zone de liquidité visible par tous. Les institutionnels viennent la chercher avant de reverser. SL sous mais avec marge anti-sweep.",
      advanced:     "Equal lows = double bottom retail = liquidity pool institutionnel. L'invalidation réelle n'est pas sous les lows, c'est plusieurs ATR en dessous, après le sweep.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "round_number_sweep",
    title: "Chiffre rond — la zone que tout le monde voit",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix flotte juste au-dessus d'un niveau psychologique majeur (chiffre rond). Tous les retails ont leur SL pile sous ce niveau.",
    shortContext: "Sous chiffre rond",
    lessons: {
      beginner:     "Les chiffres ronds (1.1000, 100 000, etc.) attirent les SL retail. Place ton stop plus loin, jamais pile sous.",
      intermediate: "Chiffres ronds = niveaux psychologiques = liquidité concentrée. Les retails y placent SL et TP en masse. Les algos les sweep systématiquement.",
      advanced:     "1.1000, 4 300, 100 000... ces niveaux attirent les stops. Placer son SL juste sous = donner sa position à l'algo. SL plus loin, ou pas de trade.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "asia_high_sweep",
    title: "Asia high — sweep prévisible à l'ouverture London",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Session asiatique terminée, range bien défini. London open dans 10 minutes. Tu shortes le high du range Asia.",
    shortContext: "Avant London open",
    lessons: {
      beginner:     "L'Asia high est souvent sweep à l'ouverture London. Ton SL doit être au-dessus du sweep attendu, pas pile au high.",
      intermediate: "L'Asia high est sweep dans ~60% des sessions à l'ouverture London. Shorter pile au high sans anticiper ce sweep = stop out garanti.",
      advanced:     "Le sweep d'Asia high est une mécanique de marché institutionnelle bien documentée. SL au-dessus du sweep attendu, pas au-dessus du high.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "order_block_respect",
    title: "Order Block — au-delà du swing low",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu entres BUY sur un Order Block bullish identifié. Un swing low récent est visible juste au-dessus du bas du OB.",
    shortContext: "Order Block bullish",
    lessons: {
      beginner:     "L'invalidation d'un Order Block est sous son bas, pas sous le swing low récent. Place le SL en conséquence.",
      intermediate: "Le bas du Order Block définit l'invalidation du concept, pas le dernier swing. SL sous le bas du OB avec marge.",
      advanced:     "L'invalidation d'un Order Block est sous son bas, pas sous le dernier swing low. Confondre les deux = stop out sur la mèche de mitigation alors que le setup est encore valide.",
    },
    difficulties: ["advanced"],
    tag: "lecture",
  },
  {
    id: "prev_day_low_trap",
    title: "Previous Day Low — la liquidité quotidienne",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix s'approche du Previous Day Low. La zone est connue de tous les participants institutionnels. Tu prépares ton BUY.",
    shortContext: "Près du PDL",
    lessons: {
      beginner:     "PDL = Previous Day Low. C'est une zone de chasse institutionnelle. SL sous PDL avec marge, pas pile en dessous.",
      intermediate: "PDL = Previous Day Low = niveau de liquidité quotidien. Les algos l'utilisent comme zone de chasse. SL placé pile sous = capturé.",
      advanced:     "Le PDL fait partie des niveaux institutionnels majeurs avec PDH, PWL, PWH, PML. Tout SL placé à 0-5 pips sous un de ces niveaux a une probabilité élevée de chasse avant la vraie move.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "news_vol_expansion",
    title: "Volatilité ATR doublée — SL standard devient tight",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "ATR du jour à 2x la moyenne sur 20 jours. Volatilité exceptionnelle après FOMC. Tu prends ton setup habituel avec ta marge SL standard.",
    shortContext: "ATR x2 vs normale",
    lessons: {
      beginner:     "Quand la vol explose (FOMC, NFP), un SL 'normal' devient tight. Élargis la marge à l'ATR du jour.",
      intermediate: "Sur jour à ATR doublé, le SL 'standard' est en pratique tight. Marge ajustée à la vol réelle, sinon stop out automatique.",
      advanced:     "La taille du SL n'est pas un nombre fixe en pips. C'est un multiple de l'ATR du jour. Quand l'ATR double, la marge SL doit doubler aussi, sinon ton SL devient statistiquement tight.",
    },
    difficulties: ["advanced"],
    tag: "volatilité",
  },
  {
    id: "htf_invalidation",
    title: "Invalidation HTF — SL H1 ne suffit pas",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Setup BUY en H1. Mais le dernier Higher Low H4 est nettement plus bas. La structure HTF reste bullish tant que ce HL H4 tient.",
    shortContext: "Bias H4 plus profond",
    lessons: {
      beginner:     "Quand le setup est en H1 mais le bias HTF en H4, ton SL doit respecter le HL H4, pas le swing H1.",
      intermediate: "Le SL doit être à l'échelle du timeframe d'invalidation, pas du timeframe d'entrée. Setup H1 + bias H4 = SL sous HL H4.",
      advanced:     "Le SL doit être placé à l'échelle du setup. Setup H1 avec bias H4 = SL au minimum sous le HL H4 pertinent. Sinon la fluctuation normale H1 te sort avant le vrai move.",
    },
    difficulties: ["advanced"],
    tag: "lecture",
  },
  {
    id: "multi_swing_low",
    title: "Deux swing lows proches — sous lequel ?",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu identifies 2 swing lows récents séparés de quelques pips. Le second est plus bas. Lequel respecter pour le SL ?",
    shortContext: "2 swing lows proches",
    lessons: {
      beginner:     "Quand 2 swing lows sont proches, respecte le PLUS BAS pour le SL. Le 1er sera sweep avant la cassure réelle.",
      intermediate: "Quand 2 swing lows sont proches, l'invalidation structurelle nécessite que le PLUS BAS soit cassé. SL sous le premier = stop out sur fluctuation normale.",
      advanced:     "Sequence of lows : tant que le bottom le plus bas tient, la structure bullish n'est pas cassée. SL sous le 1er swing ignore cette mécanique de marché.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "fakeout_then_retest",
    title: "Fakeout déjà eu — SL au-delà du wick, pas du swing",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Fakeout sur résistance déjà visible : mèche qui casse, puis retour sous. Tu entres SELL maintenant. Où placer le SL ?",
    shortContext: "Fakeout résistance déjà fait",
    lessons: {
      beginner:     "Quand un fakeout est déjà visible, le vrai high à invalider est la mèche, pas le sommet du corps.",
      intermediate: "Le retest naturel après fakeout va chercher la mèche. SL au-dessus du wick + marge, pas au-dessus du corps.",
      advanced:     "Quand un fakeout a déjà eu lieu, le vrai high à invalider est la pointe de la mèche, pas le swing high du corps. SL sous la mèche = stop out sur le retest naturel du wick.",
    },
    difficulties: ["advanced"],
    tag: "piège",
  },
  {
    id: "tight_consolidation",
    title: "Range serré — l'arbitrage taille SL vs RR",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Range serré : amplitude faible, prix coincé entre support et résistance proches. Tu veux entrer BUY au support. Le RR sera mauvais avec un SL standard.",
    shortContext: "Range serré",
    lessons: {
      beginner:     "Dans un range serré, soit tu attends une cassure, soit tu réduis ta taille de position. SL standard = RR pourri.",
      intermediate: "Range serré + SL standard = RR mauvais. Range serré + SL tight = stop out. La solution : attendre expansion, ou réduire la taille de lot.",
      advanced:     "Dans un range étroit, l'arbitrage SL/RR devient insoluble sans compromis sur la taille. Soit tu attends expansion, soit tu acceptes un RR < 1:2 et tu compenses par le winrate.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "structure",
  },
];

// ─── Variations ───────────────────────────────────────────────────────────────

export function generatePlaceStopScenarios(seed: number, difficulty: Difficulty = "intermediate"): PlaceStopInstance[] {
  const rng = mulberry32(seed);
  const pool = PLACE_STOP_TEMPLATES.filter((t) => t.difficulties.includes(difficulty));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const out: PlaceStopInstance[] = [];
  let lastId: PlaceStopSetupKey | null = null;
  for (let i = 0; i < ROUNDS_PER_SESSION; i++) {
    let candidate = shuffled[i % shuffled.length];
    if (candidate.id === lastId && shuffled.length > 1) {
      candidate = shuffled[(i + 1) % shuffled.length];
    }
    const isHighVol = candidate.id === "high_vol_pullback";
    out.push({
      ...candidate,
      asset:      pick(ASSETS, rng),
      session:    pick(SESSIONS, rng),
      volatility: isHighVol ? "élevée" : pick(VOLATILITIES, rng),
      spread:     pick(SPREADS, rng),
      seed:       (seed + i * 9973) >>> 0,
      difficulty,
    });
    lastId = candidate.id;
  }
  return out;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface RawScenario {
  past:      Candle[];
  fut:       Candle[];
  zones:     ChartZone[];
  entry:     number;
  tp:        number | null;
  direction: TradeDirection;
  // Stops par TYPE (avant mapping vers A/B/C)
  tight:     { price: number; rationale: string };
  logical:   { price: number; rationale: string };
  wide:      { price: number; rationale: string };
}

function finalize(raw: RawScenario): PlaceStopChart {
  // Mapping A/B/C par ordre VISUEL top→bottom (prix décroissant).
  // Pour BUY (stops sous entry) : A = stop le plus haut = tight ; C = wide.
  // Pour SELL (stops au-dessus) : A = wide (plus haut) ; C = tight.
  const sorted = [
    { price: raw.tight.price,   type: "tight"   as StopType, rationale: raw.tight.rationale   },
    { price: raw.logical.price, type: "logical" as StopType, rationale: raw.logical.rationale },
    { price: raw.wide.price,    type: "wide"    as StopType, rationale: raw.wide.rationale    },
  ].sort((a, b) => b.price - a.price); // top→bottom (price desc)

  const stops: StopOption[] = sorted.map((s, i) => ({
    id:        (["A", "B", "C"] as StopId[])[i],
    price:     s.price,
    type:      s.type,
    rationale: s.rationale,
  }));

  // Domain
  const all = [...raw.past, ...raw.fut];
  const vals: number[] = [raw.entry, raw.tp ?? raw.entry, ...stops.map((s) => s.price)];
  for (const k of all) { vals.push(k.h, k.l); }
  for (const z of raw.zones) { vals.push(z.y1, z.y2); }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;

  return {
    past: raw.past,
    future: raw.fut,
    zones: raw.zones,
    entry: raw.entry,
    tp: raw.tp,
    direction: raw.direction,
    stops,
    domain: { min: min - pad, max: max + pad },
  };
}

// ─── Difficulty knobs sur les distances des stops (depuis l'entry) ───────────
// Convention : distances POSITIVES depuis entry. Pour un BUY, le stop est à
// entry - distance ; pour un SELL, à entry + distance.
//
// Contraintes :
//   - tight < logical < wide (toujours)
//   - logical-tight > 0.5 et wide-logical > 0.8 → garantit que le dip/bump
//     du future peut balayer tight sans toucher logical/wide
//   - Avec TP à entry ± 3.5*m, on vise :
//     - RR_logical (= 3.5/logical) >= 2.5
//     - RR_wide (= 3.5/wide) <= 1.7 → wide >= 2.06
function spread(difficulty: Difficulty): { tight: number; logical: number; wide: number } {
  if (difficulty === "beginner")     return { tight: 0.4, logical: 1.2, wide: 3.0 };
  if (difficulty === "intermediate") return { tight: 0.3, logical: 1.0, wide: 2.6 };
  /* advanced */                     return { tight: 0.2, logical: 0.85, wide: 2.3 };
}

// Marge anti-mèche pour les scénarios pièges (sweep, fakeout, FVG, equal lows,
// round number, PDL, etc.). Plus la difficulté monte, plus la marge "logique"
// se rapproche du wick = arbitrage plus serré entre survie et capital.
function trapMargin(difficulty: Difficulty): number {
  if (difficulty === "beginner")     return 0.5;
  if (difficulty === "intermediate") return 0.35;
  /* advanced */                     return 0.2;
}

// Construit un candle avec low et high explicites (utilisé pour les dips/bumps
// du future où on veut contrôler précisément l'amplitude).
function explicitCandle(o: number, c: number, h: number, l: number): Candle {
  return { o, c, h, l };
}

// ─── Rationales communs ──────────────────────────────────────────────────────
// Réutilisables — chaque scenario les personnalise légèrement.
const TIGHT_RATIONALE = "✗ Trop serré, placé dans le bruit normal du marché. La 1re mèche de retest va le balayer avant que le trade aboutisse. C'est l'erreur retail classique.";
const LOGICAL_RATIONALE = "✓ Placement logique, derrière la vraie invalidation, avec une marge anti-bruit. Survit aux retests, capture la cassure structurelle si elle arrive.";
const WIDE_RATIONALE = "≈ Survit, mais détruit le RR. Distance trop grande = capital mal utilisé, ratio risque/rendement souvent < 1.";

// Rationales spécifiques aux nouveaux scénarios (sweep / liquidity / multi-structure)
const EQUAL_LOWS_TIGHT_FR   = "✗ Stop DANS la zone de liquidité créée par les 2 equal lows. C'est le SL retail évident, les institutionnels le ramassent avant de partir en hausse.";
const EQUAL_LOWS_LOGICAL_FR = "✓ Sous la zone de sweep des 2 lows + marge anti-mèche. C'est l'invalidation réelle du concept, protégé contre la chasse à la liquidité retail.";
const ROUND_LIQUIDITY_FR    = "✗ Stop pile sous le chiffre rond, exactement là où tous les SL retail sont entassés. Les algos sweep ce niveau de façon systématique.";
const ROUND_LOGICAL_FR      = "✓ Sous le sweep attendu du chiffre rond + marge. Le SL est hors de la zone que les algos viennent ramasser, le setup reste valide après la chasse.";
const ASIA_LIQUIDITY_FR     = "✗ Stop pile au-dessus de l'Asia high, dans la zone que le London open va sweep. C'est le piège classique de l'ouverture européenne.";
const ASIA_LOGICAL_FR       = "✓ Au-dessus du sweep attendu de l'Asia high + marge. Si le prix revient là après l'ouverture London, c'est que le bias bearish est faux.";
const OB_TIGHT_FR           = "✗ Stop sous le swing low, mais au-dessus du bas du Order Block. Le swing va être sweep alors que le concept OB est encore valide.";
const OB_LOGICAL_FR         = "✓ Sous le bas du Order Block + marge. C'est la VRAIE invalidation du concept OB, le swing low peut être sweep sans que le setup soit cassé.";
const PDL_LIQUIDITY_FR      = "✗ Stop pile sous le PDL, niveau institutionnel quotidien chassé quasi systématiquement. Tu offres ta position aux algos.";
const PDL_LOGICAL_FR        = "✓ Sous la zone de chasse du PDL + marge. Le sweep attendu peut avoir lieu, le SL est hors de la zone d'embuscade institutionnelle.";
const NEWS_TIGHT_FR         = "✗ Stop 'standard' calibré pour vol normale, mais l'ATR du jour est doublé. Ce qui paraît raisonnable est en fait tight pour la vol réelle.";
const NEWS_LOGICAL_FR       = "✓ Marge calibrée sur la vol réelle du jour (ATR doublé). Ce qui semble large en vol normale est le LOGIQUE ici, survit au bruit amplifié.";
const NEWS_WIDE_FR          = "≈ Survit largement, mais marge surestimée même pour ATR doublé. Capital sous-utilisé, RR plus faible qu'avec logical.";
const HTF_TIGHT_FR          = "✗ Stop sous le swing low H1, mais le bias H4 n'est pas cassé. Une fluctuation H1 normale va te sortir alors que le setup HTF reste valide.";
const HTF_LOGICAL_FR        = "✓ Sous le HL H4 pertinent + marge. Le bias HTF doit être cassé pour invalider le setup, pas une simple fluctuation H1.";
const MULTI_TIGHT_FR        = "✗ Stop sous le 1er swing low (le plus haut), mais le swing low plus bas tient encore. La structure n'est pas cassée, tu seras stop sur le retest du 2e low.";
const MULTI_LOGICAL_FR      = "✓ Sous le PLUS BAS des 2 swing lows + marge. C'est l'invalidation structurelle réelle, tant que ce niveau tient la structure bullish est intacte.";
const FAKE2_TIGHT_FR        = "✗ Stop au-dessus du swing high du corps, mais sous la mèche du fakeout. Le retest naturel du wick va te chercher.";
const FAKE2_LOGICAL_FR      = "✓ Au-dessus de la mèche du fakeout + marge. La pointe du wick est le vrai high à invalider, pas le sommet du corps.";
const TIGHTCONS_TIGHT_FR    = "✗ Stop dans le range serré, dans le bruit normal de la consolidation. La 1re oscillation du range va le balayer.";
const TIGHTCONS_LOGICAL_FR  = "✓ Juste sous le bottom du range + marge. Le SL respecte la structure du range, mais le RR sera limité par le top, à arbitrer avec la taille de position.";
const TIGHTCONS_WIDE_FR     = "≈ SL très large, mais le RR est rendu impossible par le plafond du range. Sans expansion, le trade n'a pas de marge bénéfice.";

// Variante de finalize() acceptant un tableau générique de stops typés (utilisée
// par les nouveaux scénarios qui exposent un stop "liquidity" en plus de
// tight/logical/wide). Mapping A/B/C par ordre visuel (prix décroissant) identique.
function finalizeStops(raw: {
  past:      Candle[];
  fut:       Candle[];
  zones:     ChartZone[];
  entry:     number;
  tp:        number | null;
  direction: TradeDirection;
  stops:     Array<{ type: StopType; price: number; rationale: string }>;
}): PlaceStopChart {
  const sorted = [...raw.stops].sort((a, b) => b.price - a.price);
  const stops: StopOption[] = sorted.map((s, i) => ({
    id:        (["A", "B", "C"] as StopId[])[i],
    price:     s.price,
    type:      s.type,
    rationale: s.rationale,
  }));
  const all = [...raw.past, ...raw.fut];
  const vals: number[] = [raw.entry, raw.tp ?? raw.entry, ...stops.map((s) => s.price)];
  for (const k of all) { vals.push(k.h, k.l); }
  for (const z of raw.zones) { vals.push(z.y1, z.y2); }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;
  return {
    past: raw.past,
    future: raw.fut,
    zones: raw.zones,
    entry: raw.entry,
    tp: raw.tp,
    direction: raw.direction,
    stops,
    domain: { min: min - pad, max: max + pad },
  };
}

// ─── 8 générateurs ────────────────────────────────────────────────────────────

// Helper : construit le future "sweep + recovery" pour un BUY.
// Le 1er candle du future est un dip qui sweep tight (au-dessous du niveau
// tight) sans toucher logical. Les bougies suivantes rallient.
function buildBuyFuture(rng: () => number, m: number, entry: number, sp: ReturnType<typeof spread>, fut: Candle[]): number {
  const dipLow = entry - sp.tight * m - 0.1 * m;  // sweep tight, ne touche pas logical
  let p = entry;
  const dipClose = entry - sp.tight * m + 0.15 * m;  // close au-dessus du tight
  fut.push(explicitCandle(p, dipClose, p + (0.1 + rng() * 0.1) * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.45 + rng() * 0.55) * m;
    const wU = (0.18 + rng() * 0.18) * m;
    const wD = (0.13 + rng() * 0.13) * m;
    fut.push(explicitCandle(o, c, Math.max(o, c) + wU, Math.min(o, c) - wD));
    p = c;
  }
  return p;
}

// Symétrique pour SELL.
function buildSellFuture(rng: () => number, m: number, entry: number, sp: ReturnType<typeof spread>, fut: Candle[]): number {
  const bumpHigh = entry + sp.tight * m + 0.1 * m;
  const bumpClose = entry + sp.tight * m - 0.15 * m;
  let p = entry;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, p - (0.1 + rng() * 0.1) * m));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.45 + rng() * 0.55) * m;
    const wU = (0.13 + rng() * 0.13) * m;
    const wD = (0.18 + rng() * 0.18) * m;
    fut.push(explicitCandle(o, c, Math.max(o, c) + wU, Math.min(o, c) - wD));
    p = c;
  }
  return p;
}

function scnPullbackBull(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.25 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const swingLow = Math.min(...past.slice(-5).map((k) => k.l));
  const entry = p;
  const sp = spread(d);
  buildBuyFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: swingLow - 0.04, y2: swingLow + 0.04, label: "Swing low" }],
    entry,
    tp: entry + 3.5 * m,
    direction: "BUY",
    tight:   { price: entry - sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry - sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry - sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnPullbackBear(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 10 - rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const swingHigh = Math.max(...past.slice(-5).map((k) => k.h));
  const entry = p;
  const sp = spread(d);
  buildSellFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "resistance", y1: swingHigh - 0.04, y2: swingHigh + 0.04, label: "Swing high" }],
    entry,
    tp: entry - 3.5 * m,
    direction: "SELL",
    tight:   { price: entry + sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry + sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry + sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnBounceSupport(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const S = 1;
  let p = 5 + rng() * 0.4;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.5) * m, S + 0.4, 6);
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.3) * 0.6 * m, S + 0.4, S + 1.3);
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.7 + rng() * 0.3) * m));
    p = c;
  }
  const entry = p;
  const sp = spread(d);
  buildBuyFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support HTF" }],
    entry,
    tp: entry + 3.5 * m,
    direction: "BUY",
    tight:   { price: entry - sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry - sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry - sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnRejectionResistance(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = 5 - rng() * 0.4;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.5) * m, 4, R - 0.4);
    past.push(candle(o, c, (0.18 + rng() * 0.25) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.7) * 0.6 * m, R - 1.3, R - 0.4);
    past.push(candle(o, c, (0.7 + rng() * 0.3) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const entry = p;
  const sp = spread(d);
  buildSellFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance HTF" }],
    entry,
    tp: entry - 3.5 * m,
    direction: "SELL",
    tight:   { price: entry + sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry + sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry + sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnFakeoutAboveResistance(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  // Pour ce scénario, la structure du piège (fakeout au-dessus de R) impose
  // des positions spécifiques :
  //   - tight = DANS le wick du fakeout (entre R et fakeoutHigh)
  //   - logical = juste au-dessus du fakeoutHigh
  //   - wide = bien au-dessus de fakeoutHigh
  // On dimensionne pour que future = drop confirmant le piège (mais 1er
  // candle du futur fait un petit retest pour balayer tight uniquement).
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = 6 + rng() * 0.3;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, 5, R - 0.5);
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  // Fakeout (la zone du piège = wick au-dessus de R)
  const fakeoutHigh = R + 1.4 * m + rng() * 0.4;
  past.push({ o: p, c: R - 0.4 - rng() * 0.3, h: fakeoutHigh, l: p - 0.2 });
  p = past[past.length - 1].c;
  // 2 candles confirmant
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.2 + rng() * 0.22) * m));
    p = c;
  }
  const entry = p;
  // Positions des stops (distances depuis entry, en respectant le piège)
  const tightPrice   = R + (fakeoutHigh - R) * 0.4;   // DANS la zone du piège
  const logicalPrice = fakeoutHigh + trapMargin(d) * m;  // au-dessus du wick, marge selon difficulté
  const widePrice    = fakeoutHigh + 2.0 * m;         // bien au-dessus
  // Future : 1er candle = retest qui rebondit dans la zone tight (sweep tight)
  // sans dépasser logical, puis drop violent.
  const retestHigh = tightPrice + 0.15 * m;
  fut.push(explicitCandle(p, R - 0.5 * m, retestHigh, p - 0.2 * m));
  p = R - 0.5 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.6) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }
  return finalize({
    past, fut,
    zones: [
      { kind: "resistance",     y1: R - 0.1,            y2: R + 0.1,            label: "Résistance" },
      { kind: "liquidity_high", y1: R + 0.15,           y2: fakeoutHigh,        label: "Wick fakeout" },
    ],
    entry,
    // TP étendu pour garantir RR_logical >= 2 sur ce setup où la structure
    // pousse logical loin de l'entry.
    tp: entry - Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "SELL",
    tight:   { price: tightPrice,   rationale: "✗ Stop dans la zone du piège, pile dans la zone que les institutionnels viennent d'utiliser pour ramasser la liquidité. Le 2e test va te balayer." },
    logical: { price: logicalPrice, rationale: "✓ Au-dessus du pic du fakeout, avec marge. C'est la VRAIE invalidation du piège, si le prix repasse là, le scénario est cassé." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnSweepLowReversal(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  // tight = DANS la zone du sweep (entre sweepLow et L)
  // logical = sous la mèche du sweep + marge
  // wide = bien plus bas
  // future : 1er candle retest qui dip dans la zone sweep (sweep tight) sans
  //   atteindre logical, puis rallye.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const L = 1;
  let p = 4 + rng() * 0.3;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.3 + rng() * 0.4) * m, L + 0.5, 4.5);
    past.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.6 * m, L + 0.5, L + 1.5);
    past.push(candle(o, c, (0.22 + rng() * 0.2) * m, (0.22 + rng() * 0.2) * m));
    p = c;
  }
  const sweepLow = L - 1.2 * m - rng() * 0.3;
  past.push({ o: p, c: L + 0.4 + rng() * 0.3, h: p + 0.2, l: sweepLow });
  p = past[past.length - 1].c;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const entry = p;
  const tightPrice   = L - (L - sweepLow) * 0.4;
  const logicalPrice = sweepLow - trapMargin(d) * m;  // sous mèche sweep, marge selon difficulté
  const widePrice    = sweepLow - 1.8 * m;
  // Future : retest qui dip dans la zone du sweep (touch tight) sans
  //   atteindre logical, puis rallye
  const retestLow = tightPrice - 0.15 * m;
  fut.push(explicitCandle(p, L + 0.5 * m, p + 0.2 * m, retestLow));
  p = L + 0.5 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.22) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  return finalize({
    past, fut,
    zones: [
      { kind: "support",       y1: L - 0.1,        y2: L + 0.1,        label: "Précédent low"     },
      { kind: "liquidity_low", y1: sweepLow,       y2: L - 0.15,       label: "Liquidité balayée" },
    ],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    tight:   { price: tightPrice,   rationale: "✗ Stop DANS la zone du sweep, exactement là où les institutionnels viennent de ramasser la liquidité. Le retest va te chercher." },
    logical: { price: logicalPrice, rationale: "✓ Sous la mèche du sweep, avec marge. Le low du sweep est la nouvelle invalidation, protégé contre un 2e ramassage." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnFvgContinuation(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  // tight = DANS le FVG (zone exposée à mitigation profonde)
  // logical = sous le bas du FVG
  // wide = bien plus bas
  // future : 1er candle dip qui traverse partiellement le FVG (touch tight)
  //   sans aller en dessous, puis rallye.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 2 + rng() * 0.3;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (rng() - 0.4) * 0.4 * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const baseHigh = Math.max(...past.slice(-3).map((k) => k.h));
  past.push(candle(p, p + (2.0 + rng() * 0.3) * m, (0.3 + rng() * 0.2) * m, 0.12));
  p = past[past.length - 1].c;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.25) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const fvgLow = baseHigh;
  const fvgHigh = past[past.length - 2].l;
  // Pullback dans le FVG (mitigation partielle)
  const target = (fvgLow + fvgHigh) / 2;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = Math.max(target, o - (0.3 + rng() * 0.3) * m);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  // Réaction visible
  past.push(candle(p, p + 0.2 * m, (0.2 + rng() * 0.15) * m, (0.15 + rng() * 0.15) * m));
  p = past[past.length - 1].c;
  const entry = p;
  const tightPrice   = fvgLow + (fvgHigh - fvgLow) * 0.3;
  const logicalPrice = fvgLow - trapMargin(d) * m;  // sous bas FVG, marge selon difficulté
  const widePrice    = fvgLow - 2.0 * m;
  // Future : dip qui descend juste dans la zone tight (touch tight, pas logical)
  const dipLow = tightPrice - 0.1 * m;
  fut.push(explicitCandle(p, fvgLow + 0.2 * m, p + (0.1 + rng() * 0.1) * m, dipLow));
  p = fvgLow + 0.2 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.22) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  return finalize({
    past, fut,
    zones: [{ kind: "fvg", y1: fvgLow, y2: fvgHigh, label: "FVG haussier" }],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    tight:   { price: tightPrice,   rationale: "✗ Stop DANS le FVG, la zone est précisément celle où le marché peut retourner pour finir sa mitigation. Tu seras pris dans la profondeur de la zone." },
    logical: { price: logicalPrice, rationale: "✓ Sous le bas du FVG avec marge. Le FVG entièrement traversé = invalidation propre. C'est le placement structurel correct." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnHighVolPullback(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  // Vol élevée : tous les écarts sont multipliés par volMult. Le tight devient
  // particulièrement trompeur (taille "normale" mais dans le bruit amplifié).
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const volMult = 1.6;
  const effM = m * volMult;
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.6) * effM;
    past.push(candle(o, c, (0.4 + rng() * 0.3) * effM, (0.3 + rng() * 0.25) * effM));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * effM;
    past.push(candle(o, c, (0.3 + rng() * 0.25) * effM, (0.4 + rng() * 0.3) * effM));
    p = c;
  }
  const swingLow = Math.min(...past.slice(-5).map((k) => k.l));
  const entry = p;
  // En vol élevée, le tight "normal" (~0.5m) est dans le bruit, le logical
  // doit être doublé (~1.5m), le wide encore plus loin.
  const tightDist   = 0.5 * effM;
  const logicalDist = 1.5 * effM;
  const wideDist    = 3.5 * effM;
  const tightPrice   = entry - tightDist;
  const logicalPrice = entry - logicalDist;
  const widePrice    = entry - wideDist;
  // Future : dip large (vol élevée) qui sweep tight sans toucher logical
  const dipLow = tightPrice - 0.15 * effM;
  const dipClose = entry - tightDist * 0.6;
  fut.push(explicitCandle(p, dipClose, p + (0.2 + rng() * 0.15) * effM, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * effM;
    fut.push(candle(o, c, (0.3 + rng() * 0.25) * effM, (0.2 + rng() * 0.2) * effM));
    p = c;
  }
  void d;
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: swingLow - 0.05, y2: swingLow + 0.05, label: "Swing low" }],
    entry,
    tp: entry + 3.5 * effM,  // TP élargi aussi (proportionnel à la vol)
    direction: "BUY",
    tight:   { price: tightPrice,   rationale: "✗ Stop 'standard', qui serait OK en vol normale, mais en vol élevée ce niveau est dans le bruit. La 1re bougie de retest, large à cause de la vol, va te balayer." },
    logical: { price: logicalPrice, rationale: "✓ Stop élargi à la volatilité du marché. Ce qui ressemble à un 'wide stop' en vol normale est en fait le LOGIQUE ici, il survit au noise amplifié sans tuer le RR (TP également plus loin)." },
    wide:    { price: widePrice,    rationale: "≈ Survie garantie, mais même avec un TP étendu en vol élevée, le RR descend sous 1.5. Capital mal utilisé." },
  });
}

// ─── Nouveaux scénarios (V2.1) ───────────────────────────────────────────────

function scnEqualLowsTrap(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Descente vers le 1er low
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  const low1 = p;
  // Rebond
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // 2e descente, touche un low quasi égal au 1er
  const low2Target = low1 + 0.1 * m;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = i === 3 ? low2Target : o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.13) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  // Rebond vers entry
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.25) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  const entry = p;
  const equalLow = low1;
  const tightPrice   = equalLow - 0.1 * m;
  const logicalPrice = equalLow - trapMargin(d) * m - 0.3 * m;
  const widePrice    = entry - 2.5 * m;
  // Future : sweep des equal lows (touche tight), puis rallye
  const dipLow = tightPrice - 0.15 * m;
  const dipClose = equalLow + 0.2 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.15 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.13 + rng() * 0.13) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [{ kind: "liquidity_low", y1: equalLow - 0.1 * m, y2: equalLow + 0.15 * m, label: "Equal lows" }],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    stops: [
      { type: "tight",   price: tightPrice,   rationale: EQUAL_LOWS_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: EQUAL_LOWS_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnRoundNumberSweep(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Approche
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (rng() - 0.3) * 0.5 * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  // Le chiffre rond est 0.8m sous le prix courant
  const roundNumber = p - 0.8 * m;
  // Consolidation au-dessus du chiffre rond
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.4 * m, roundNumber + 0.5 * m, roundNumber + 1.4 * m);
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const entry = p;
  const liquidityPrice = roundNumber - 0.1 * m;
  const logicalPrice   = roundNumber - trapMargin(d) * m - 0.4 * m;
  const widePrice      = entry - 2.5 * m;
  // Future : sweep du chiffre rond, puis rallye
  const dipLow = liquidityPrice - 0.15 * m;
  const dipClose = roundNumber + 0.3 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.12 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.13 + rng() * 0.13) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [{ kind: "support", y1: roundNumber - 0.05 * m, y2: roundNumber + 0.05 * m, label: "Chiffre rond" }],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    stops: [
      { type: "liquidity", price: liquidityPrice, rationale: ROUND_LIQUIDITY_FR },
      { type: "logical",   price: logicalPrice,   rationale: ROUND_LOGICAL_FR },
      { type: "wide",      price: widePrice,      rationale: WIDE_RATIONALE },
    ],
  });
}

function scnAsiaHighSweep(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const asiaLow = 5;
  const asiaHigh = asiaLow + 1.2 * m;
  let p = asiaLow + 0.6 * m;
  // Range Asia : oscillation entre les bornes
  for (let i = 0; i < 10; i++) {
    const o = p;
    const target = i % 2 === 0 ? asiaHigh - 0.1 * m : asiaLow + 0.2 * m;
    const c = o + (target - o) * (0.5 + rng() * 0.3);
    past.push(candle(o, c, (0.12 + rng() * 0.12) * m, (0.12 + rng() * 0.12) * m));
    p = c;
  }
  // Approche finale vers le high (entry juste sous le high)
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (asiaHigh - 0.05 * m - o) * (0.5 + rng() * 0.3);
    past.push(candle(o, c, (0.12 + rng() * 0.1) * m, (0.1 + rng() * 0.08) * m));
    p = c;
  }
  const entry = p;
  const liquidityPrice = asiaHigh + 0.1 * m;
  const logicalPrice   = asiaHigh + trapMargin(d) * m + 0.4 * m;
  const widePrice      = entry + 2.8 * m;
  // Future : sweep d'Asia high (1 bougie qui dépasse), puis drop
  const bumpHigh = asiaHigh + 0.4 * m;
  const bumpClose = asiaHigh - 0.4 * m;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, p - 0.15 * m));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.13) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [{ kind: "resistance", y1: asiaHigh - 0.05 * m, y2: asiaHigh + 0.05 * m, label: "Asia high" }],
    entry,
    tp: entry - Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "SELL",
    stops: [
      { type: "liquidity", price: liquidityPrice, rationale: ASIA_LIQUIDITY_FR },
      { type: "logical",   price: logicalPrice,   rationale: ASIA_LOGICAL_FR },
      { type: "wide",      price: widePrice,      rationale: WIDE_RATIONALE },
    ],
  });
}

function scnOrderBlockRespect(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 3 + rng() * 0.3;
  // 2 bougies d'accumulation
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.2 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  // Order Block bearish (1 bougie baissière avant l'impulsion)
  const obOpen = p;
  const obClose = obOpen - (0.8 + rng() * 0.2) * m;
  past.push(candle(obOpen, obClose, (0.12 + rng() * 0.1) * m, (0.18 + rng() * 0.15) * m));
  const OBlow = past[past.length - 1].l;
  p = obClose;
  // Impulsion haussière
  const impulseEnd = p + (3.0 + rng() * 0.5) * m;
  past.push(candle(p, impulseEnd, (0.2 + rng() * 0.15) * m, (0.15 + rng() * 0.1) * m));
  p = impulseEnd;
  // Continuation
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  // Pullback vers swing low (au-dessus du OB)
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const swingLow = p;
  // Rebond léger vers entry
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.2 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.12 + rng() * 0.1) * m));
    p = c;
  }
  const entry = p;
  const tightPrice   = swingLow - 0.1 * m;
  const logicalPrice = OBlow - trapMargin(d) * m - 0.3 * m;
  const widePrice    = OBlow - 2.5 * m;
  // Future : sweep du swing low (pas du OB), puis rallye
  const dipLow = tightPrice - 0.15 * m;
  const dipClose = swingLow + 0.2 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.15 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [{ kind: "fvg", y1: OBlow, y2: OBlow + 0.4 * m, label: "Order Block" }],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    stops: [
      { type: "tight",   price: tightPrice,   rationale: OB_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: OB_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnPrevDayLowTrap(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Quelques bougies oscillantes
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (rng() - 0.5) * 0.5 * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  // Quelques bougies de range plus serré (le prix flotte au-dessus du PDL implicite)
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (rng() - 0.5) * 0.35 * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.2 + rng() * 0.15) * m));
    p = c;
  }
  const entry = p;
  const PDL = entry - 0.6 * m;
  const liquidityPrice = PDL - 0.1 * m;
  const logicalPrice   = PDL - trapMargin(d) * m - 0.5 * m;
  const widePrice      = entry - 2.6 * m;
  // Future : sweep du PDL (mèche descend de 0.4m sous PDL), puis rallye
  const dipLow = PDL - 0.4 * m;
  const dipClose = PDL + 0.3 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.13 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [{ kind: "support", y1: PDL - 0.05 * m, y2: PDL + 0.05 * m, label: "PDL" }],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    stops: [
      { type: "liquidity", price: liquidityPrice, rationale: PDL_LIQUIDITY_FR },
      { type: "logical",   price: logicalPrice,   rationale: PDL_LOGICAL_FR },
      { type: "wide",      price: widePrice,      rationale: WIDE_RATIONALE },
    ],
  });
}

function scnNewsVolExpansion(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  void d;  // distances fixées par la vol amplifiée, indépendantes de la difficulté
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const volMult = 2.0;
  const effM = m * volMult;
  let p = 5 + rng() * 0.3;
  // Tendance haussière à amplitude doublée
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.6) * effM;
    past.push(candle(o, c, (0.35 + rng() * 0.3) * effM, (0.28 + rng() * 0.25) * effM));
    p = c;
  }
  // Pullback à vol amplifiée
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * effM;
    past.push(candle(o, c, (0.25 + rng() * 0.2) * effM, (0.35 + rng() * 0.3) * effM));
    p = c;
  }
  const entry = p;
  // Stops en unités de m (NON-effM) pour démontrer le piège du SL "standard"
  const tightPrice   = entry - 1.2 * m;
  const logicalPrice = entry - 2.2 * m;
  const widePrice    = entry - 3.5 * m;
  // Future : dip large (vol amplifiée) qui sweep le SL standard, puis rallye
  const dipLow = tightPrice - 0.5 * m;
  const dipClose = entry - 0.6 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.25 * effM, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * effM;
    fut.push(candle(o, c, (0.25 + rng() * 0.22) * effM, (0.2 + rng() * 0.18) * effM));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [],
    entry,
    tp: entry + 4.5 * m,
    direction: "BUY",
    stops: [
      { type: "tight",   price: tightPrice,   rationale: NEWS_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: NEWS_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: NEWS_WIDE_FR },
    ],
  });
}

function scnHtfInvalidation(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 4 + rng() * 0.3;
  // Trend haussière initiale
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.4) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  // Drop profond marquant le H4 low
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.4) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  const H4low = p;
  // Reprise haussière
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.35 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  // Pullback H1 (marque le swing low H1, plus haut que H4low)
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.25) * m;
    past.push(candle(o, c, (0.12 + rng() * 0.1) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const H1low = p;
  // Léger rebond vers entry
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.2 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.12 + rng() * 0.1) * m));
    p = c;
  }
  const entry = p;
  const tightPrice   = H1low - 0.2 * m;
  const logicalPrice = H4low - trapMargin(d) * m - 0.4 * m;
  const widePrice    = H4low - 2.0 * m;
  // Future : sweep du swing low H1 (pas H4low), reverse haussier
  const dipLow = tightPrice - 0.2 * m;
  const dipClose = H1low + 0.3 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.15 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [
      { kind: "support", y1: H4low - 0.05 * m, y2: H4low + 0.05 * m, label: "HL H4" },
      { kind: "support", y1: H1low - 0.05 * m, y2: H1low + 0.05 * m, label: "Swing low H1" },
    ],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    stops: [
      { type: "tight",   price: tightPrice,   rationale: HTF_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: HTF_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnMultiSwingLow(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 4 + rng() * 0.3;
  // Tendance haussière
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  // Drop vers swing low #1
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const swing1 = p;
  // Rebond léger
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.2 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.12) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  // Drop plus profond vers swing low #2 (plus bas)
  const swing2Target = swing1 - 0.4 * m;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = i === 2 ? swing2Target : o - (0.25 + rng() * 0.25) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const swing2 = swing2Target;
  // Rebond vers entry (au-dessus des 2 swings)
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  const entry = p;
  const tightPrice   = swing1 - 0.1 * m;
  const logicalPrice = swing2 - trapMargin(d) * m - 0.3 * m;
  const widePrice    = swing2 - 2.0 * m;
  // Future : sweep du swing1 (pas du swing2)
  const dipLow = swing1 - 0.2 * m;  // sous swing1, au-dessus de swing2
  const dipClose = swing1 + 0.3 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.13 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [
      { kind: "support", y1: swing1 - 0.04 * m, y2: swing1 + 0.04 * m, label: "Swing low 1" },
      { kind: "support", y1: swing2 - 0.04 * m, y2: swing2 + 0.04 * m, label: "Swing low 2" },
    ],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    stops: [
      { type: "tight",   price: tightPrice,   rationale: MULTI_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: MULTI_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnFakeoutThenRetest(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Tendance haussière vers la résistance
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.35 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  const swingHigh = p + 0.3 * m;
  const fakeoutWick = swingHigh + 0.5 * m;
  // Bougie fakeout : pierce au-dessus du swingHigh, close en dessous
  past.push({ o: p, c: swingHigh - 0.3 * m, h: fakeoutWick, l: p - 0.2 * m });
  p = swingHigh - 0.3 * m;
  // 2 bougies baissières de confirmation
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const entry = p;
  const tightPrice   = swingHigh + 0.2 * m;
  const logicalPrice = fakeoutWick + trapMargin(d) * m + 0.4 * m;
  const widePrice    = fakeoutWick + 2.0 * m;
  // Future : retest qui sweep swingHigh (mais pas fakeoutWick), puis drop
  const bumpHigh = swingHigh + (fakeoutWick - swingHigh) * 0.5;
  const bumpClose = swingHigh - 0.4 * m;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, p - 0.15 * m));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [
      { kind: "resistance",     y1: swingHigh - 0.05 * m, y2: swingHigh + 0.05 * m, label: "Swing high" },
      { kind: "liquidity_high", y1: swingHigh + 0.05 * m, y2: fakeoutWick,          label: "Wick fakeout" },
    ],
    entry,
    tp: entry - Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "SELL",
    stops: [
      { type: "tight",   price: tightPrice,   rationale: FAKE2_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: FAKE2_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnTightConsolidation(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const rangeLow = 5;
  const rangeHigh = rangeLow + 1.2 * m;
  let p = rangeLow + 0.6 * m;
  // 12 bougies oscillant dans le range serré
  for (let i = 0; i < 12; i++) {
    const o = p;
    const target = i % 2 === 0 ? rangeHigh - 0.1 * m : rangeLow + 0.15 * m;
    const c = o + (target - o) * (0.5 + rng() * 0.3);
    past.push(candle(o, c, (0.1 + rng() * 0.08) * m, (0.1 + rng() * 0.08) * m));
    p = c;
  }
  // 2 bougies amenant entry vers le bottom du range
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = clamp(o + (-0.3 + rng() * 0.2) * m, rangeLow + 0.05 * m, rangeLow + 0.5 * m);
    past.push(candle(o, c, (0.1 + rng() * 0.08) * m, (0.12 + rng() * 0.08) * m));
    p = c;
  }
  const entry = p;
  const tightPrice   = entry - 0.5 * m;
  const logicalPrice = entry - 1.0 * m - trapMargin(d) * m;
  const widePrice    = entry - 2.0 * m;
  // Future : sweep du SL tight, reverse haussier limité par le top du range
  const dipLow = tightPrice - 0.2 * m;
  const dipClose = entry - 0.1 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.1 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.3) * m, rangeLow, rangeHigh + 0.5 * m);
    fut.push(candle(o, c, (0.12 + rng() * 0.1) * m, (0.1 + rng() * 0.08) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [
      { kind: "support",    y1: rangeLow - 0.04 * m,  y2: rangeLow + 0.04 * m,  label: "Bottom range" },
      { kind: "resistance", y1: rangeHigh - 0.04 * m, y2: rangeHigh + 0.04 * m, label: "Top range" },
    ],
    entry,
    tp: entry + Math.max(2.0 * m, Math.abs(entry - logicalPrice) * 1.8),
    direction: "BUY",
    stops: [
      { type: "tight",   price: tightPrice,   rationale: TIGHTCONS_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: TIGHTCONS_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: TIGHTCONS_WIDE_FR },
    ],
  });
}

// ─── Build chart ──────────────────────────────────────────────────────────────

export function buildPlaceStopChart(
  setup: PlaceStopSetupKey,
  seed: number,
  volatility: Volatility,
  difficulty: Difficulty,
): PlaceStopChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[volatility];
  switch (setup) {
    case "pullback_bull":             return scnPullbackBull(rng, m, difficulty);
    case "pullback_bear":             return scnPullbackBear(rng, m, difficulty);
    case "bounce_support":            return scnBounceSupport(rng, m, difficulty);
    case "rejection_resistance":      return scnRejectionResistance(rng, m, difficulty);
    case "fakeout_above_resistance":  return scnFakeoutAboveResistance(rng, m, difficulty);
    case "sweep_low_reversal":        return scnSweepLowReversal(rng, m, difficulty);
    case "fvg_continuation":          return scnFvgContinuation(rng, m, difficulty);
    case "high_vol_pullback":         return scnHighVolPullback(rng, m, difficulty);
    case "equal_lows_trap":           return scnEqualLowsTrap(rng, m, difficulty);
    case "round_number_sweep":        return scnRoundNumberSweep(rng, m, difficulty);
    case "asia_high_sweep":           return scnAsiaHighSweep(rng, m, difficulty);
    case "order_block_respect":       return scnOrderBlockRespect(rng, m, difficulty);
    case "prev_day_low_trap":         return scnPrevDayLowTrap(rng, m, difficulty);
    case "news_vol_expansion":        return scnNewsVolExpansion(rng, m, difficulty);
    case "htf_invalidation":          return scnHtfInvalidation(rng, m, difficulty);
    case "multi_swing_low":           return scnMultiSwingLow(rng, m, difficulty);
    case "fakeout_then_retest":       return scnFakeoutThenRetest(rng, m, difficulty);
    case "tight_consolidation":       return scnTightConsolidation(rng, m, difficulty);
  }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoreResult {
  points:      number;
  streakBonus: number;
  type:        StopType;
  correct:     boolean;
  // Stop hit during reveal (par id de stop)
  hitMap:      Record<StopId, number | null>;  // null si survécu, sinon index de la candle
}

function isHit(stop: number, direction: TradeDirection, future: Candle[]): number | null {
  for (let i = 0; i < future.length; i++) {
    const k = future[i];
    if (direction === "BUY"  && k.l <= stop) return i;
    if (direction === "SELL" && k.h >= stop) return i;
  }
  return null;
}

export function computeHits(chart: PlaceStopChart): Record<StopId, number | null> {
  const out: Record<StopId, number | null> = { A: null, B: null, C: null };
  for (const s of chart.stops) {
    out[s.id] = isHit(s.price, chart.direction, chart.future);
  }
  return out;
}

export function scoreStopChoice(chosenId: StopId, chart: PlaceStopChart, currentStreak: number): ScoreResult {
  const chosen = chart.stops.find((s) => s.id === chosenId)!;
  const hitMap = computeHits(chart);
  let points = 0;
  let streakBonus = 0;
  switch (chosen.type) {
    case "logical":   points = 100; if (currentStreak >= 2) streakBonus = 30; break;
    case "wide":      points = 30; break;
    case "tight":     points = -50; break;
    case "liquidity": points = -100; break;
  }
  return {
    points: points + streakBonus,
    streakBonus,
    type: chosen.type,
    correct: chosen.type === "logical",
    hitMap,
  };
}

// ─── Verdicts ─────────────────────────────────────────────────────────────────

export const STOP_TYPE_META: Record<StopType, { label: string; color: "emerald" | "amber" | "red" }> = {
  logical:   { label: "Stop logique",     color: "emerald" },
  wide:      { label: "Stop trop large",  color: "amber"   },
  tight:     { label: "Stop trop serré",  color: "red"     },
  liquidity: { label: "Stop en liquidité", color: "red"    },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Débutant",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Structure claire, stop logique évident, sweep très visible.",
  },
  intermediate: {
    label:       "Intermédiaire",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Volatilité plus sale, plusieurs stops plausibles, tight stop tentant.",
  },
  advanced: {
    label:       "Avancé",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Marché ambigu, sweep partiel, arbitrage survie / invalidation / RR.",
  },
};

export function sessionVerdict(score: number, logicalCount: number, total: number): string {
  if (logicalCount >= total - 1) return "Stop sniper";
  if (score >= 700)              return "Bonne protection";
  if (score >= 300)              return "Lecture solide";
  if (score >= 0)                return "À polir";
  if (score >= -200)             return "Trop émotionnel";
  return "Tu donnes ton SL au marché";
}
