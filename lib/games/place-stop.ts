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
  | "tight_consolidation"
  | "extreme_volatility_buy"
  | "extreme_volatility_sell"
  | "news_imminent_wide"
  | "liquidity_hunt_zone"
  | "multi_swing_deep"
  | "fakeout_zone_wide"
  | "weekly_open_volatility"
  | "key_level_magnet"
  | "news_imminent_wide_sell"
  | "liquidity_hunt_zone_sell"
  | "multi_swing_high_deep"
  | "weekly_open_volatility_sell"
  | "key_level_magnet_sell";

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
  // ─── Scénarios où "wide" devient la bonne réponse (vol extrême, news, hunt) ──
  {
    id: "extreme_volatility_buy",
    title: "Volatilité extrême — SL standard balayé",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "ATR à 3x la moyenne sur 20 jours. Marché en mode expansion violente. Tu prends ton setup BUY classique. Le SL 'standard' ne tiendra pas.",
    shortContext: "ATR x3, expansion violente",
    lessons: {
      beginner:     "En vol extrême, ton SL 'normal' devient en pratique tight. Marge doit être proportionnelle à l'ATR du jour.",
      intermediate: "ATR triplé = SL standard inadapté. Soit tu adaptes la marge, soit tu passes ton tour.",
      advanced:     "Quand l'ATR triple par rapport à la normale, ton SL standard 1.2 × ATR devient en réalité un SL tight. La règle : adapter le SL à la volatilité du jour, pas à un nombre fixe en pips. En vol extrême, c'est SL 3-4 × ATR ou pas de trade.",
    },
    difficulties: ["advanced"],
    tag: "volatilité",
  },
  {
    id: "extreme_volatility_sell",
    title: "Volatilité extrême — SL standard balayé (SELL)",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "ATR à 3x la moyenne sur 20 jours. Marché en expansion violente. Tu shortes un rejet. Le SL 'standard' au-dessus du wick ne tiendra pas.",
    shortContext: "ATR x3, short en vol extrême",
    lessons: {
      beginner:     "En vol extrême, ton SL 'normal' devient en pratique tight, même côté SELL. Marge proportionnelle à l'ATR.",
      intermediate: "ATR triplé = SL standard au-dessus du high inadapté. Soit tu adaptes, soit tu passes.",
      advanced:     "En SELL aussi, la règle est : SL = multiple de l'ATR du jour, pas une marge fixe. ATR ×3 = marge ×3 ou pas de trade.",
    },
    difficulties: ["advanced"],
    tag: "volatilité",
  },
  {
    id: "news_imminent_wide",
    title: "News dans 5 min — SL standard cramé",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "NFP dans 5 minutes. Tu tiens absolument à entrer maintenant sur ce setup BUY. L'amplitude attendue est x2-3 de la normale. SL standard = stop out garanti.",
    shortContext: "NFP imminente",
    lessons: {
      beginner:     "Avant une news majeure, l'amplitude des bougies × 2-3. Adapte ton SL ou ne prends pas le trade.",
      intermediate: "Une bougie de news avec amplitude × 3 va balayer ton SL 'standard' avant que tu aies le temps de réagir. Marge large obligatoire.",
      advanced:     "Avant une news majeure, l'amplitude bougies × 2-3. Soit tu ne trades pas, soit tu adaptes ton SL en conséquence. Mettre un SL standard = donner ta position au mouvement de news.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "liquidity_hunt_zone",
    title: "Zone de chasse institutionnelle — éloigne ton SL",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le swing low 'évident' juste sous l'entrée est en réalité une zone de liquidité institutionnelle bien connue. Le SL placé sous = stop out garanti. Il faut s'éloigner.",
    shortContext: "Zone de chasse connue",
    lessons: {
      beginner:     "Les swing lows évidents attirent les SL retail. Mets ton SL bien au-delà de la zone, ou attends après le sweep.",
      intermediate: "Plus une zone est 'évidente', plus elle sera chassée. SL pile sous = capture institutionnelle.",
      advanced:     "Les swing lows trop 'évidents' sont des zones de chasse favorites. SL placé pile sous = capture institutionnelle. Soit tu attends que la chasse soit faite et tu rentres après, soit tu mets ton SL bien au-delà.",
    },
    difficulties: ["advanced"],
    tag: "piège",
  },
  {
    id: "multi_swing_deep",
    title: "Plusieurs swing lows empilés — vise le plus bas",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "3 swing lows visibles dans les dernières 15 bougies, chacun plus bas que le précédent. SL sous le 1er ou le 2e = balayé. La vraie invalidation est sous le 3e (le plus bas).",
    shortContext: "3 swings empilés",
    lessons: {
      beginner:     "Quand 3 swing lows sont alignés en descente, la vraie invalidation est sous le plus bas. SL sous le 1er = stop out garanti.",
      intermediate: "Quand plusieurs swing lows sont alignés, l'invalidation structurelle vraie est sous le plus bas. SL sous les autres = stop out sur fluctuation normale.",
      advanced:     "La séquence de lower lows en mode pullback fait partie du structural design. Le SL doit respecter la profondeur maximale du pullback attendu, pas s'arrêter au 1er swing.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "fakeout_zone_wide",
    title: "Zone à fakeouts récurrents — large SL obligatoire",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Cette résistance a déjà connu 2 fakeouts dans les dernières heures. Le marché va probablement en faire un 3e avant le vrai move. SL serré = capture.",
    shortContext: "Résistance multi-fakeouts",
    lessons: {
      beginner:     "Une résistance qui a déjà rejeté avec mèches va souvent en faire d'autres. SL au-dessus de la mèche maximale, pas du wick précédent.",
      intermediate: "Multi-fakeouts = pattern statistique. Anticipe une amplitude supérieure aux mèches précédentes.",
      advanced:     "Une zone qui a déjà fait 2 fakeouts va statistiquement en faire un 3e. Le SL doit anticiper cette amplitude maximale, pas s'arrêter aux mèches précédentes.",
    },
    difficulties: ["advanced"],
    tag: "piège",
  },
  {
    id: "weekly_open_volatility",
    title: "Lundi open — gap weekend possible",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Lundi matin, ouverture des marchés FX. Un gap de weekend est possible. Le SL doit absorber cette amplitude exceptionnelle.",
    shortContext: "Open lundi, gap possible",
    lessons: {
      beginner:     "L'ouverture lundi peut générer un gap. SL standard = balayé par le gap. Marge large ou pas de position pré-ouverture.",
      intermediate: "Un gap d'open lundi peut faire 1-2 × ATR. Mets ton SL au-delà ou attends la stabilisation.",
      advanced:     "Le gap d'ouverture lundi peut être brutal selon l'actualité du weekend. Soit tu attends que l'ouverture soit digérée, soit tu mets un SL large pour absorber l'amplitude.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "key_level_magnet",
    title: "Niveau magnétique — le prix va le toucher",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Un niveau psychologique majeur (round number, PDH/L, weekly high) est visible juste sous l'entrée. Le prix va statistiquement aller le tester. SL juste au-dessus du niveau = capture.",
    shortContext: "Niveau magnétique sous",
    lessons: {
      beginner:     "Les niveaux psychologiques attirent le prix comme des aimants. Ne place pas ton SL pile au-dessus, mets-le bien au-delà.",
      intermediate: "Les niveaux psychologiques sont des aimants. Le prix les teste presque systématiquement. SL placé pile au-dessus = sweep garanti.",
      advanced:     "Anticiper le test d'un niveau magnétique = placer le SL au-delà de l'amplitude prévisible du sweep, pas juste au-dessus du niveau.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lecture",
  },
  // ─── V2.3 : 5 miroirs SELL pour rééquilibrer la distribution spatiale ────────
  {
    id: "news_imminent_wide_sell",
    title: "News dans 5 min — SELL et SL standard cramé",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "FOMC dans 5 minutes. Tu prends ce SELL sur EUR/USD. L'amplitude attendue est x2-3 de la normale. SL standard = stop out garanti.",
    shortContext: "FOMC imminent",
    lessons: {
      beginner:     "Avant un FOMC, l'amplitude bougies × 2-3. SL standard cramé. Adapte la marge ou ne trade pas.",
      intermediate: "Une bougie d'impact FOMC va balayer ton SL 'standard' au-dessus du high avant que le mouvement directionnel se déclenche.",
      advanced:     "Avant un FOMC, amplitude bougies × 2-3. Le SL standard 1.2 × ATR sera balayé par le premier mouvement. Soit tu ne trades pas, soit tu utilises un SL minimum 3 × ATR.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "liquidity_hunt_zone_sell",
    title: "Zone de chasse SELL — éloigne ton SL au-dessus",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le swing high évident juste au-dessus de l'entrée est en réalité une zone de liquidité institutionnelle bien connue. SL placé au-dessus = stop out garanti.",
    shortContext: "Zone de chasse au-dessus",
    lessons: {
      beginner:     "Les swing highs évidents attirent les SL retail. Mets ton SL bien au-delà de la zone, ou attends après le sweep.",
      intermediate: "Plus une zone est 'évidente', plus elle sera chassée. SL pile au-dessus du swing high = capture institutionnelle.",
      advanced:     "Les swing highs trop évidents = zones de chasse. SL pile au-dessus = capture institutionnelle. Soit tu attends la chasse, soit tu mets ton SL bien au-delà.",
    },
    difficulties: ["advanced"],
    tag: "piège",
  },
  {
    id: "multi_swing_high_deep",
    title: "Plusieurs swing highs empilés — vise le plus haut",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "3 swing highs visibles dans les dernières 15 bougies, chacun plus haut que le précédent. SL au-dessus du 1er ou 2e = balayé. La vraie invalidation est au-dessus du 3e.",
    shortContext: "3 swings empilés",
    lessons: {
      beginner:     "Quand 3 swing highs sont alignés en montée, la vraie invalidation est au-dessus du plus haut. SL au-dessus du 1er = stop out garanti.",
      intermediate: "Quand plusieurs swing highs sont alignés, l'invalidation structurelle vraie est au-dessus du plus haut. SL au-dessus des autres = stop out sur fluctuation normale.",
      advanced:     "La séquence de higher highs en mode pullback bearish fait partie du structural design. Le SL doit respecter la profondeur maximale du pullback attendu.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "weekly_open_volatility_sell",
    title: "Lundi open SELL — gap weekend possible",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "Lundi matin, ouverture des marchés FX. Un gap haussier weekend est possible. Le SL SELL doit absorber cette amplitude.",
    shortContext: "Open lundi, gap possible",
    lessons: {
      beginner:     "L'ouverture lundi peut générer un gap haussier. SL standard = balayé. Marge large ou pas de position pré-ouverture.",
      intermediate: "Un gap d'open lundi peut faire 1-2 × ATR vers le haut. Mets ton SL SELL au-delà ou attends la stabilisation.",
      advanced:     "Le gap d'ouverture lundi peut être brutal selon l'actualité du weekend. SL SELL doit absorber l'amplitude du gap.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "key_level_magnet_sell",
    title: "Niveau magnétique au-dessus — le prix va le tester",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Un niveau psychologique majeur (round number, PDH, weekly high) est visible juste au-dessus de l'entrée. Le prix va statistiquement aller le tester.",
    shortContext: "Niveau magnétique au-dessus",
    lessons: {
      beginner:     "Les niveaux psychologiques attirent le prix comme des aimants, vers le haut aussi. Ne place pas ton SL pile sous, mets-le bien au-delà.",
      intermediate: "Les niveaux psychologiques sont des aimants. Le prix les teste systématiquement. SL pile au-dessus = sweep garanti.",
      advanced:     "Anticiper le test d'un niveau magnétique = placer le SL au-delà de l'amplitude prévisible du sweep.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lecture",
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
  seed:      number;  // pour shuffle déterministe des labels A/B/C
  // Stops par TYPE (avant mapping vers A/B/C)
  tight:     { price: number; rationale: string };
  logical:   { price: number; rationale: string };
  wide:      { price: number; rationale: string };
}

function finalize(raw: RawScenario): PlaceStopChart {
  // Tri visuel top→bot par prix décroissant (le chart reste lisible).
  const sorted = [
    { price: raw.tight.price,   type: "tight"   as StopType, rationale: raw.tight.rationale   },
    { price: raw.logical.price, type: "logical" as StopType, rationale: raw.logical.rationale },
    { price: raw.wide.price,    type: "wide"    as StopType, rationale: raw.wide.rationale    },
  ].sort((a, b) => b.price - a.price);

  // Label A/B/C shuffle par seed pour éviter le biais "logical = toujours B".
  const labels = shuffleSeeded(["A", "B", "C"] as StopId[], raw.seed);
  const stops: StopOption[] = sorted.map((s, i) => ({
    id:        labels[i],
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

// ─── Anti-biais "logical toujours au milieu" ─────────────────────────────────
// Le tri par prix met inévitablement logical en position 2/3 (entre tight et
// wide). On combine deux mécaniques pour casser ce pattern :
//   1) shuffle des labels A/B/C par seed (la lettre/couleur du bon stop varie)
//   2) variation des distances par round : logical_close (logical près de tight)
//      vs logical_far (logical près de wide, avec wide repoussé)

// Shuffle Fisher-Yates déterministe à partir d'un seed.
function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export type PlacementMode = "normal" | "logical_close" | "logical_far";

// Distribution cible : 40% normal / 30% logical_close / 30% logical_far.
function pickPlacementMode(seed: number): PlacementMode {
  const rng = mulberry32(seed);
  const r = rng();
  if (r < 0.4) return "normal";
  if (r < 0.7) return "logical_close";
  return "logical_far";
}

// Spread adapté pour les scénarios structurels (#1-4) selon le mode.
// Contraintes : tight reste dans le bruit, logical reste hors bruit, wide > logical.
function getSpread(difficulty: Difficulty, mode: PlacementMode): { tight: number; logical: number; wide: number } {
  const base = spread(difficulty);
  switch (mode) {
    case "normal":
      return base;
    case "logical_close":
      // logical juste au-delà de tight (+0.25). Le future touche tight via
      // dipLow = entry - sp.tight*m - 0.1*m, donc marge logical-dipLow = 0.15*m.
      return { tight: base.tight, logical: base.tight + 0.25, wide: base.wide };
    case "logical_far":
      // logical éloigné (-0.4 sous wide), wide repoussé (+0.5) pour rester
      // strictement plus loin que logical.
      return { tight: base.tight, logical: base.wide - 0.4, wide: base.wide + 0.5 };
  }
}

// Multiplicateur appliqué à trapMargin() pour les scénarios pièges.
// 0.5 rapproche logical du wick sans casser la marge anti-bruit.
// 1.5 l'éloigne, combiné à widePushFor() qui repousse wide.
function trapMarginFor(difficulty: Difficulty, mode: PlacementMode): number {
  const base = trapMargin(difficulty);
  switch (mode) {
    case "normal":         return base;
    case "logical_close":  return base * 0.5;
    case "logical_far":    return base * 1.5;
  }
}

// Décalage supplémentaire (en unités de m) à appliquer au stop "wide" en
// logical_far, pour qu'il reste strictement plus loin que logical éloigné.
// Sens (+ pour SELL, - pour BUY) appliqué par chaque scénario.
function widePushFor(mode: PlacementMode): number {
  return mode === "logical_far" ? 0.5 : 0;
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

// V2.2 — rationales des 8 scénarios "wide = bonne réponse"
// LTT = "Logical Too Tight" : stop qui semble logique selon les règles normales,
// mais inadapté au contexte (vol extrême, news, chasse). Typé "tight" pour
// rester compatible avec le scoring existant (-50 comme un tight classique).
const EXTREME_VOL_TIGHT_FR   = "✗ Stop dans le bruit immédiat. La 1re bougie de retest, large à cause de la vol extrême, va te balayer en quelques secondes.";
const EXTREME_VOL_LTT_FR     = "✗ Stop 'standard' calibré pour vol normale. Avec un ATR triplé, ce niveau est statistiquement dans le bruit. Tu seras balayé avant que le setup ait le temps de jouer.";
const EXTREME_VOL_WIDE_FR    = "✓ Marge calibrée sur la vol RÉELLE du jour (×3 vs normale). C'est le seul stop qui absorbe l'expansion sans casser le setup.";

const NEWS_IMM_TIGHT_FR      = "✗ Stop dans le bruit immédiat. La bougie d'impact news va le balayer en quelques secondes.";
const NEWS_IMM_LTT_FR        = "✗ Stop 'normal' inadapté à l'amplitude news. Une bougie d'impact (×2-3 amplitude) va te sortir avant le vrai move directionnel.";
const NEWS_IMM_WIDE_FR       = "✓ Marge assez large pour absorber l'amplitude news. Soit ce SL, soit pas de trade pendant la fenêtre news.";

const LIQ_HUNT_TIGHT_FR      = "✗ Stop dans le bruit immédiat. Balayé par le 1er retest avant même la chasse principale.";
const LIQ_HUNT_LTT_FR        = "✗ Stop sous un swing low évident = zone de chasse institutionnelle. Le sweep prend ce niveau systématiquement avant le vrai retournement.";
const LIQ_HUNT_WIDE_FR       = "✓ Sous la zone de chasse + marge ample. Le sweep peut avoir lieu, ton SL reste hors d'atteinte.";

const MULTI_DEEP_TIGHT_FR    = "✗ Stop sous le 1er swing low (le plus haut). Le pullback structurel descend plus bas, le SL est dans le bruit du déroulé.";
const MULTI_DEEP_LTT_FR      = "✗ Stop sous le 2e swing low. La séquence de lower lows continue jusqu'au 3e. Balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_FR     = "✓ Sous le 3e swing low (le plus bas) + marge. C'est la vraie invalidation structurelle de la séquence.";

const FAKEOUT_ZONE_TIGHT_FR  = "✗ Stop dans le bruit immédiat. Balayé par n'importe quelle mèche de retest.";
const FAKEOUT_ZONE_LTT_FR    = "✗ Stop au-dessus des 2 fakeouts précédents, mais le 3e fakeout va statistiquement dépasser cette amplitude. Balayé.";
const FAKEOUT_ZONE_WIDE_FR   = "✓ Au-dessus de l'amplitude maximale prévisible des fakeouts récurrents. Le 3e ne te touchera pas.";

const WEEKLY_OPEN_TIGHT_FR   = "✗ Stop dans le bruit immédiat. Le gap d'ouverture lundi le balaye à la 1re bougie.";
const WEEKLY_OPEN_LTT_FR     = "✗ Stop 'standard' inadapté à un gap weekend qui peut faire 2-3× l'amplitude normale d'une bougie.";
const WEEKLY_OPEN_WIDE_FR    = "✓ Marge large pour absorber l'amplitude du gap d'ouverture. La structure tient, le SL aussi.";

const KEY_MAGNET_TIGHT_FR    = "✗ Stop dans le bruit immédiat, balayé avant même que le niveau magnétique soit atteint.";
const KEY_MAGNET_LTT_FR      = "✗ Stop juste au-dessus du niveau magnétique. Mais le test profond va aller plus bas, le sweep prend ce niveau.";
const KEY_MAGNET_WIDE_FR     = "✓ Au-delà de l'amplitude du test attendu sur le niveau magnétique. Le sweep touche le niveau, ton SL reste hors d'atteinte.";

// V2.3 — variantes SELL : reformulations directionnelles (au-dessus / swing high).
const LIQ_HUNT_LTT_SELL_FR     = "✗ Stop au-dessus d'un swing high évident = zone de chasse institutionnelle. Le sweep prend ce niveau systématiquement avant le vrai retournement.";
const LIQ_HUNT_WIDE_SELL_FR    = "✓ Au-dessus de la zone de chasse + marge ample. Le sweep peut avoir lieu, ton SL reste hors d'atteinte.";
const MULTI_DEEP_TIGHT_SELL_FR = "✗ Stop au-dessus du 1er swing high (le plus bas). Le pullback structurel monte plus haut, le SL est dans le bruit du déroulé.";
const MULTI_DEEP_LTT_SELL_FR   = "✗ Stop au-dessus du 2e swing high. La séquence de higher highs continue jusqu'au 3e. Balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_SELL_FR  = "✓ Au-dessus du 3e swing high (le plus haut) + marge. C'est la vraie invalidation structurelle de la séquence.";
const KEY_MAGNET_LTT_SELL_FR   = "✗ Stop juste sous le niveau magnétique. Mais le test profond va aller plus haut, le sweep prend ce niveau.";
const KEY_MAGNET_WIDE_SELL_FR  = "✓ Au-delà de l'amplitude du test attendu vers le haut. Le sweep touche le niveau magnétique, ton SL reste hors d'atteinte.";

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
  seed:      number;  // pour shuffle des labels A/B/C
  stops:     Array<{ type: StopType; price: number; rationale: string }>;
}): PlaceStopChart {
  const sorted = [...raw.stops].sort((a, b) => b.price - a.price);
  const labels = shuffleSeeded(["A", "B", "C"] as StopId[], raw.seed);
  const stops: StopOption[] = sorted.map((s, i) => ({
    id:        labels[i],
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

function scnPullbackBull(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const sp = getSpread(d, mode);
  buildBuyFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: swingLow - 0.04, y2: swingLow + 0.04, label: "Swing low" }],
    entry,
    tp: entry + 3.5 * m,
    direction: "BUY",
    seed,
    tight:   { price: entry - sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry - sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry - sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnPullbackBear(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const sp = getSpread(d, mode);
  buildSellFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "resistance", y1: swingHigh - 0.04, y2: swingHigh + 0.04, label: "Swing high" }],
    entry,
    tp: entry - 3.5 * m,
    direction: "SELL",
    seed,
    tight:   { price: entry + sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry + sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry + sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnBounceSupport(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const sp = getSpread(d, mode);
  buildBuyFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support HTF" }],
    entry,
    tp: entry + 3.5 * m,
    direction: "BUY",
    seed,
    tight:   { price: entry - sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry - sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry - sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnRejectionResistance(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const sp = getSpread(d, mode);
  buildSellFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance HTF" }],
    entry,
    tp: entry - 3.5 * m,
    direction: "SELL",
    seed,
    tight:   { price: entry + sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry + sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry + sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnFakeoutAboveResistance(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = fakeoutHigh + trapMarginFor(d, mode) * m;  // au-dessus du wick, marge selon difficulté
  const widePrice    = fakeoutHigh + 2.0 * m + widePushFor(mode) * m;  // bien au-dessus, push si logical_far
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
    seed,
    tight:   { price: tightPrice,   rationale: "✗ Stop dans la zone du piège, pile dans la zone que les institutionnels viennent d'utiliser pour ramasser la liquidité. Le 2e test va te balayer." },
    logical: { price: logicalPrice, rationale: "✓ Au-dessus du pic du fakeout, avec marge. C'est la VRAIE invalidation du piège, si le prix repasse là, le scénario est cassé." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnSweepLowReversal(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = sweepLow - trapMarginFor(d, mode) * m;  // sous mèche sweep, marge selon difficulté
  const widePrice    = sweepLow - 1.8 * m - widePushFor(mode) * m;
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
    seed,
    tight:   { price: tightPrice,   rationale: "✗ Stop DANS la zone du sweep, exactement là où les institutionnels viennent de ramasser la liquidité. Le retest va te chercher." },
    logical: { price: logicalPrice, rationale: "✓ Sous la mèche du sweep, avec marge. Le low du sweep est la nouvelle invalidation, protégé contre un 2e ramassage." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnFvgContinuation(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = fvgLow - trapMarginFor(d, mode) * m;  // sous bas FVG, marge selon difficulté
  const widePrice    = fvgLow - 2.0 * m - widePushFor(mode) * m;
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
    seed,
    tight:   { price: tightPrice,   rationale: "✗ Stop DANS le FVG, la zone est précisément celle où le marché peut retourner pour finir sa mitigation. Tu seras pris dans la profondeur de la zone." },
    logical: { price: logicalPrice, rationale: "✓ Sous le bas du FVG avec marge. Le FVG entièrement traversé = invalidation propre. C'est le placement structurel correct." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnHighVolPullback(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  void d; void mode;  // distances vol-driven, mode non utilisé (label shuffle suffit)
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: swingLow - 0.05, y2: swingLow + 0.05, label: "Swing low" }],
    entry,
    tp: entry + 3.5 * effM,  // TP élargi aussi (proportionnel à la vol)
    direction: "BUY",
    seed,
    tight:   { price: tightPrice,   rationale: "✗ Stop 'standard', qui serait OK en vol normale, mais en vol élevée ce niveau est dans le bruit. La 1re bougie de retest, large à cause de la vol, va te balayer." },
    logical: { price: logicalPrice, rationale: "✓ Stop élargi à la volatilité du marché. Ce qui ressemble à un 'wide stop' en vol normale est en fait le LOGIQUE ici, il survit au noise amplifié sans tuer le RR (TP également plus loin)." },
    wide:    { price: widePrice,    rationale: "≈ Survie garantie, mais même avec un TP étendu en vol élevée, le RR descend sous 1.5. Capital mal utilisé." },
  });
}

// ─── Nouveaux scénarios (V2.1) ───────────────────────────────────────────────

function scnEqualLowsTrap(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = equalLow - trapMarginFor(d, mode) * m - 0.3 * m;
  const widePrice    = entry - 2.5 * m - widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "tight",   price: tightPrice,   rationale: EQUAL_LOWS_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: EQUAL_LOWS_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnRoundNumberSweep(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice   = roundNumber - trapMarginFor(d, mode) * m - 0.4 * m;
  const widePrice      = entry - 2.5 * m - widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "liquidity", price: liquidityPrice, rationale: ROUND_LIQUIDITY_FR },
      { type: "logical",   price: logicalPrice,   rationale: ROUND_LOGICAL_FR },
      { type: "wide",      price: widePrice,      rationale: WIDE_RATIONALE },
    ],
  });
}

function scnAsiaHighSweep(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice   = asiaHigh + trapMarginFor(d, mode) * m + 0.4 * m;
  const widePrice      = entry + 2.8 * m + widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "liquidity", price: liquidityPrice, rationale: ASIA_LIQUIDITY_FR },
      { type: "logical",   price: logicalPrice,   rationale: ASIA_LOGICAL_FR },
      { type: "wide",      price: widePrice,      rationale: WIDE_RATIONALE },
    ],
  });
}

function scnOrderBlockRespect(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = OBlow - trapMarginFor(d, mode) * m - 0.3 * m;
  const widePrice    = OBlow - 2.5 * m - widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "tight",   price: tightPrice,   rationale: OB_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: OB_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnPrevDayLowTrap(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice   = PDL - trapMarginFor(d, mode) * m - 0.5 * m;
  const widePrice      = entry - 2.6 * m - widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "liquidity", price: liquidityPrice, rationale: PDL_LIQUIDITY_FR },
      { type: "logical",   price: logicalPrice,   rationale: PDL_LOGICAL_FR },
      { type: "wide",      price: widePrice,      rationale: WIDE_RATIONALE },
    ],
  });
}

function scnNewsVolExpansion(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;  // distances fixées par la vol amplifiée, indépendantes de la difficulté/mode
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
    seed,
    stops: [
      { type: "tight",   price: tightPrice,   rationale: NEWS_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: NEWS_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: NEWS_WIDE_FR },
    ],
  });
}

function scnHtfInvalidation(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = H4low - trapMarginFor(d, mode) * m - 0.4 * m;
  const widePrice    = H4low - 2.0 * m - widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "tight",   price: tightPrice,   rationale: HTF_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: HTF_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnMultiSwingLow(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = swing2 - trapMarginFor(d, mode) * m - 0.3 * m;
  const widePrice    = swing2 - 2.0 * m - widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "tight",   price: tightPrice,   rationale: MULTI_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: MULTI_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnFakeoutThenRetest(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = fakeoutWick + trapMarginFor(d, mode) * m + 0.4 * m;
  const widePrice    = fakeoutWick + 2.0 * m + widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "tight",   price: tightPrice,   rationale: FAKE2_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: FAKE2_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: WIDE_RATIONALE },
    ],
  });
}

function scnTightConsolidation(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
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
  const logicalPrice = entry - 1.0 * m - trapMarginFor(d, mode) * m;
  const widePrice    = entry - 2.0 * m - widePushFor(mode) * m;
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
    seed,
    stops: [
      { type: "tight",   price: tightPrice,   rationale: TIGHTCONS_TIGHT_FR },
      { type: "logical", price: logicalPrice, rationale: TIGHTCONS_LOGICAL_FR },
      { type: "wide",    price: widePrice,    rationale: TIGHTCONS_WIDE_FR },
    ],
  });
}

// ─── V2.2 : scénarios où "wide" devient la bonne réponse ────────────────────
// Pas de stop typé "logical" dans ces scénarios. scoreStopChoice() détecte
// l'absence de "logical" et bascule automatiquement sur "wide" comme correct.
// Les stops typés "tight" jouent deux rôles : (1) bruit immédiat, (2) "logical
// too tight" (SL standard inadapté). Tous deux balayés par le future.

function scnExtremeVolatilityBuy(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;  // distances calibrées par la vol forcée
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const effM = m * 3.0;
  let p = 5 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.6) * effM;
    past.push(candle(o, c, (0.35 + rng() * 0.3) * effM, (0.28 + rng() * 0.25) * effM));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * effM;
    past.push(candle(o, c, (0.25 + rng() * 0.2) * effM, (0.35 + rng() * 0.3) * effM));
    p = c;
  }
  const entry = p;
  // Stops en unités de m (NON-effM) : c'est ça le piège
  const tightPrice = entry - 0.4 * m;
  const lttPrice   = entry - 1.2 * m;  // SL "standard" inadapté à la vol ×3
  const widePrice  = entry - 3.5 * m;  // BONNE RÉPONSE
  // Future : 1 dip large qui balaye tight ET ltt, mais pas wide
  const dipLow = entry - 2.2 * m;
  const dipClose = entry - 0.3 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.3 * effM, dipLow));
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
    tp: entry + 5.0 * m,
    direction: "BUY",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: EXTREME_VOL_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: EXTREME_VOL_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: EXTREME_VOL_WIDE_FR },
    ],
  });
}

function scnExtremeVolatilitySell(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const effM = m * 3.0;
  let p = 10 - rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.6) * effM;
    past.push(candle(o, c, (0.28 + rng() * 0.25) * effM, (0.35 + rng() * 0.3) * effM));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * effM;
    past.push(candle(o, c, (0.35 + rng() * 0.3) * effM, (0.25 + rng() * 0.2) * effM));
    p = c;
  }
  const entry = p;
  const tightPrice = entry + 0.4 * m;
  const lttPrice   = entry + 1.2 * m;
  const widePrice  = entry + 3.5 * m;
  // Future : 1 bump large qui touche tight + ltt, pas wide
  const bumpHigh = entry + 2.2 * m;
  const bumpClose = entry + 0.3 * m;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, p - 0.3 * effM));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * effM;
    fut.push(candle(o, c, (0.2 + rng() * 0.18) * effM, (0.25 + rng() * 0.22) * effM));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [],
    entry,
    tp: entry - 5.0 * m,
    direction: "SELL",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: EXTREME_VOL_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: EXTREME_VOL_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: EXTREME_VOL_WIDE_FR },
    ],
  });
}

function scnNewsImminentWide(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Pré-news : structure calme avec léger uptrend
  for (let i = 0; i < 10; i++) {
    const o = p;
    const c = o + (rng() - 0.35) * 0.4 * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.2 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.1 + rng() * 0.08) * m));
    p = c;
  }
  const entry = p;
  const tightPrice = entry - 0.4 * m;
  const lttPrice   = entry - 1.2 * m;
  const widePrice  = entry - 3.8 * m;
  // Future : 1 bougie d'impact news (amplitude ×3) qui balaye tight et ltt
  const newsLow = entry - 2.4 * m;
  const newsClose = entry + 0.5 * m;  // recovery au-dessus d'entry
  fut.push(explicitCandle(p, newsClose, entry + 0.7 * m, newsLow));
  p = newsClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [],
    entry,
    tp: entry + 5.0 * m,
    direction: "BUY",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: NEWS_IMM_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: NEWS_IMM_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: NEWS_IMM_WIDE_FR },
    ],
  });
}

function scnLiquidityHuntZone(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Tendance haussière puis pullback marqué vers swing low "évident"
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  const swingLow = p;
  // Rebond léger qui amène à entry, swingLow visible à entry - 0.9m environ
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.18 + rng() * 0.15) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const entry = p;
  const tightPrice = entry - 0.5 * m;
  const lttPrice   = swingLow - 0.3 * m;  // sous le swing low évident
  const widePrice  = entry - 2.5 * m;
  // Future : sweep profond du swing — dipLow calibré sur swingLow pour garantir
  // qu'il dépasse lttPrice même quand entry-swingLow varie avec le RNG.
  const dipLow = swingLow - 0.6 * m;
  const dipClose = swingLow + 0.3 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.15 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.45 + rng() * 0.45) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [
      { kind: "support",       y1: swingLow - 0.05 * m, y2: swingLow + 0.05 * m, label: "Swing low évident" },
      { kind: "liquidity_low", y1: dipLow - 0.05 * m,   y2: swingLow - 0.1 * m,  label: "Zone de chasse" },
    ],
    entry,
    tp: entry + 4.5 * m,
    direction: "BUY",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: LIQ_HUNT_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: LIQ_HUNT_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: LIQ_HUNT_WIDE_FR },
    ],
  });
}

function scnMultiSwingDeep(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Construire 3 swing lows alignés en descente
  // Initiale : montée
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  const peak = p;
  // Drop vers swing1 (~ peak - 0.8m)
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const swing1 = p;
  // Petit rebond
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.15 + rng() * 0.15) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.12 + rng() * 0.1) * m));
    p = c;
  }
  // Drop vers swing2 (plus bas que swing1)
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.35 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const swing2 = p;
  // Petit rebond
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.18 + rng() * 0.12) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.12 + rng() * 0.1) * m));
    p = c;
  }
  // Drop vers swing3 (plus bas que swing2)
  const swing3Target = swing2 - 0.6 * m;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = i === 1 ? swing3Target : o - (0.25 + rng() * 0.15) * m;
    past.push(candle(o, c, (0.12 + rng() * 0.1) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const swing3 = swing3Target;
  // Rebond vers entry (au-dessus de swing1)
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const entry = p;
  void peak;
  // Stops : tight sous swing1, ltt sous swing2, wide sous swing3
  const tightPrice = swing1 - 0.1 * m;
  const lttPrice   = swing2 - 0.3 * m;
  const widePrice  = swing3 - 0.3 * m;
  // Future : sweep entre swing2 et swing3 — calibré pour dépasser lttPrice
  // (swing2 - 0.3m) sans atteindre widePrice (swing3 - 0.3m = swing2 - 0.9m).
  const dipLow = swing2 - 0.45 * m;
  const dipClose = swing2 + 0.3 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.13 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.45 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [
      { kind: "support", y1: swing1 - 0.04 * m, y2: swing1 + 0.04 * m, label: "Swing low 1" },
      { kind: "support", y1: swing2 - 0.04 * m, y2: swing2 + 0.04 * m, label: "Swing low 2" },
      { kind: "support", y1: swing3 - 0.04 * m, y2: swing3 + 0.04 * m, label: "Swing low 3" },
    ],
    entry,
    tp: entry + 4.5 * m,
    direction: "BUY",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: MULTI_DEEP_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: MULTI_DEEP_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: MULTI_DEEP_WIDE_FR },
    ],
  });
}

function scnFakeoutZoneWide(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = R - 2 - rng() * 0.3;
  // Approche vers R
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.3) * m, R - 2, R - 0.4);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  // 1er fakeout
  const fake1High = R + 0.4 * m + rng() * 0.1;
  past.push({ o: p, c: R - 0.4 - rng() * 0.2, h: fake1High, l: p - 0.15 * m });
  p = past[past.length - 1].c;
  // Petit retour vers R
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = clamp(o + (0.25 + rng() * 0.2) * m, R - 1.2, R - 0.4);
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  // 2e fakeout
  const fake2High = R + 0.5 * m + rng() * 0.15;
  past.push({ o: p, c: R - 0.5 - rng() * 0.2, h: fake2High, l: p - 0.15 * m });
  p = past[past.length - 1].c;
  // Quelques bougies de consolidation sous R
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.4) * 0.4 * m, R - 1.0, R - 0.3);
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const entry = p;
  const tightPrice = R + 0.2 * m;
  const lttPrice   = R + 0.6 * m;  // au-dessus des fakeouts précédents, sera balayé par le 3e
  const widePrice  = R + 2.5 * m;  // BONNE RÉPONSE
  // Future : 3e fakeout (amplitude supérieure aux précédents), puis drop
  const bumpHigh = R + 0.9 * m;  // dépasse ltt (0.6m) mais pas wide (2.5m)
  const bumpClose = R - 0.5 * m;
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
      { kind: "resistance",     y1: R - 0.05 * m, y2: R + 0.05 * m,    label: "Résistance" },
      { kind: "liquidity_high", y1: R + 0.1 * m,  y2: Math.max(fake1High, fake2High), label: "Fakeouts précédents" },
    ],
    entry,
    tp: entry - 5.0 * m,
    direction: "SELL",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: FAKEOUT_ZONE_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: FAKEOUT_ZONE_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: FAKEOUT_ZONE_WIDE_FR },
    ],
  });
}

function scnWeeklyOpenVolatility(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Pré-weekend : structure calme avec léger uptrend
  for (let i = 0; i < 12; i++) {
    const o = p;
    const c = o + (0.15 + rng() * 0.25) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const entry = p;
  const tightPrice = entry - 0.4 * m;
  const lttPrice   = entry - 1.2 * m;
  const widePrice  = entry - 2.8 * m;
  // Future : gap d'ouverture qui descend ~1.6m, puis rebond
  const gapLow = entry - 1.6 * m;
  const gapClose = entry - 0.4 * m;  // récupération partielle
  fut.push(explicitCandle(p, gapClose, p + 0.1 * m, gapLow));
  p = gapClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [],
    entry,
    tp: entry + 4.5 * m,
    direction: "BUY",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: WEEKLY_OPEN_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: WEEKLY_OPEN_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: WEEKLY_OPEN_WIDE_FR },
    ],
  });
}

function scnKeyLevelMagnet(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Construire un niveau magnétique visible à p - 0.7m approximativement
  for (let i = 0; i < 12; i++) {
    const o = p;
    const c = o + (rng() - 0.4) * 0.4 * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  const entry = p;
  const magnetLevel = entry - 0.7 * m;
  const tightPrice  = entry - 0.4 * m;
  const lttPrice    = magnetLevel - 0.2 * m;  // juste sous le magnet, dans la zone de test
  const widePrice   = magnetLevel - 1.0 * m;  // BONNE RÉPONSE, sous l'amplitude du test
  // Future : test profond du magnet (mèche jusqu'à entry - 1.5m), puis rebond
  const dipLow = entry - 1.5 * m;
  const dipClose = magnetLevel + 0.2 * m;
  fut.push(explicitCandle(p, dipClose, p + 0.1 * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [{ kind: "support", y1: magnetLevel - 0.04 * m, y2: magnetLevel + 0.04 * m, label: "Niveau magnétique" }],
    entry,
    tp: entry + 4.0 * m,
    direction: "BUY",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: KEY_MAGNET_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: KEY_MAGNET_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: KEY_MAGNET_WIDE_FR },
    ],
  });
}

// ─── V2.3 : 5 miroirs SELL des scénarios "wide = bonne réponse" ─────────────
// Placent le stop correct au TOP visuel (wide à plus haut prix pour SELL)
// pour rééquilibrer la distribution spatiale des bonnes réponses.

function scnNewsImminentWideSell(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 10 - rng() * 0.3;
  // Pré-news : structure calme avec léger downtrend
  for (let i = 0; i < 10; i++) {
    const o = p;
    const c = o - (rng() - 0.35) * 0.4 * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.2 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.1 + rng() * 0.08) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const entry = p;
  const tightPrice = entry + 0.4 * m;
  const lttPrice   = entry + 1.2 * m;
  const widePrice  = entry + 3.8 * m;
  // Future : 1 bougie d'impact news vers le haut, balaye tight + LTT, pas wide
  const newsHigh = entry + 2.4 * m;
  const newsClose = entry - 0.5 * m;  // recovery sous l'entry
  fut.push(explicitCandle(p, newsClose, newsHigh, entry - 0.7 * m));
  p = newsClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [],
    entry,
    tp: entry - 5.0 * m,
    direction: "SELL",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: NEWS_IMM_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: NEWS_IMM_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: NEWS_IMM_WIDE_FR },
    ],
  });
}

function scnLiquidityHuntZoneSell(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 5 + rng() * 0.3;
  // Tendance baissière puis rebond marqué vers swing high "évident"
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  const swingHigh = p;
  // Repli léger qui amène à entry, swingHigh visible à entry + 0.9m environ
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.18 + rng() * 0.15) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  const entry = p;
  const tightPrice = entry + 0.5 * m;
  const lttPrice   = swingHigh + 0.3 * m;  // au-dessus du swing high évident
  const widePrice  = entry + 2.5 * m;
  // Future : sweep profond du swing — bumpHigh calibré sur swingHigh
  const bumpHigh = swingHigh + 0.6 * m;
  const bumpClose = swingHigh - 0.3 * m;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, p - 0.15 * m));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.45 + rng() * 0.45) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.2 + rng() * 0.15) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [
      { kind: "resistance",     y1: swingHigh - 0.05 * m, y2: swingHigh + 0.05 * m, label: "Swing high évident" },
      { kind: "liquidity_high", y1: swingHigh + 0.1 * m,  y2: bumpHigh + 0.05 * m,  label: "Zone de chasse" },
    ],
    entry,
    tp: entry - 4.5 * m,
    direction: "SELL",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: LIQ_HUNT_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: LIQ_HUNT_LTT_SELL_FR },
      { type: "wide",  price: widePrice,  rationale: LIQ_HUNT_WIDE_SELL_FR },
    ],
  });
}

function scnMultiSwingHighDeep(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 10 - rng() * 0.3;
  // Initiale : descente
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const trough = p;
  // Rebond vers swing1 (~ trough + 0.8m)
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const swing1 = p;
  // Petit repli
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.15 + rng() * 0.15) * m;
    past.push(candle(o, c, (0.12 + rng() * 0.1) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  // Rebond vers swing2 (plus haut que swing1)
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.35 + rng() * 0.2) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const swing2 = p;
  // Petit repli
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.18 + rng() * 0.12) * m;
    past.push(candle(o, c, (0.12 + rng() * 0.1) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  // Montée vers swing3 (plus haut que swing2)
  const swing3Target = swing2 + 0.6 * m;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = i === 1 ? swing3Target : o + (0.25 + rng() * 0.15) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.12 + rng() * 0.1) * m));
    p = c;
  }
  const swing3 = swing3Target;
  // Repli vers entry (sous swing1)
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  const entry = p;
  void trough;
  // Stops : tight au-dessus de swing1, ltt au-dessus de swing2, wide au-dessus de swing3
  const tightPrice = swing1 + 0.1 * m;
  const lttPrice   = swing2 + 0.3 * m;
  const widePrice  = swing3 + 0.3 * m;
  // Future : sweep entre swing2 et swing3 (touche tight + ltt, pas wide)
  const bumpHigh = swing2 + 0.45 * m;
  const bumpClose = swing2 - 0.3 * m;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, p - 0.13 * m));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.45 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [
      { kind: "resistance", y1: swing1 - 0.04 * m, y2: swing1 + 0.04 * m, label: "Swing high 1" },
      { kind: "resistance", y1: swing2 - 0.04 * m, y2: swing2 + 0.04 * m, label: "Swing high 2" },
      { kind: "resistance", y1: swing3 - 0.04 * m, y2: swing3 + 0.04 * m, label: "Swing high 3" },
    ],
    entry,
    tp: entry - 4.5 * m,
    direction: "SELL",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: MULTI_DEEP_TIGHT_SELL_FR },
      { type: "tight", price: lttPrice,   rationale: MULTI_DEEP_LTT_SELL_FR },
      { type: "wide",  price: widePrice,  rationale: MULTI_DEEP_WIDE_SELL_FR },
    ],
  });
}

function scnWeeklyOpenVolatilitySell(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 10 - rng() * 0.3;
  // Pré-weekend : structure calme avec léger downtrend
  for (let i = 0; i < 12; i++) {
    const o = p;
    const c = o - (0.15 + rng() * 0.25) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  const entry = p;
  const tightPrice = entry + 0.4 * m;
  const lttPrice   = entry + 1.2 * m;
  const widePrice  = entry + 2.8 * m;
  // Future : gap haussier ~1.6m, puis reverse baissier
  const gapHigh = entry + 1.6 * m;
  const gapClose = entry + 0.4 * m;
  fut.push(explicitCandle(p, gapClose, gapHigh, p - 0.1 * m));
  p = gapClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [],
    entry,
    tp: entry - 4.5 * m,
    direction: "SELL",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: WEEKLY_OPEN_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: WEEKLY_OPEN_LTT_FR },
      { type: "wide",  price: widePrice,  rationale: WEEKLY_OPEN_WIDE_FR },
    ],
  });
}

function scnKeyLevelMagnetSell(rng: () => number, m: number, d: Difficulty, mode: PlacementMode, seed: number): PlaceStopChart {
  void d; void mode;
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 10 - rng() * 0.3;
  // Structure neutre avec léger downtrend
  for (let i = 0; i < 12; i++) {
    const o = p;
    const c = o + (rng() - 0.6) * 0.4 * m;
    past.push(candle(o, c, (0.15 + rng() * 0.12) * m, (0.15 + rng() * 0.12) * m));
    p = c;
  }
  const entry = p;
  const magnetLevel = entry + 0.7 * m;
  const tightPrice  = entry + 0.4 * m;
  const lttPrice    = magnetLevel + 0.2 * m;  // juste au-dessus du magnet, zone de test
  const widePrice   = magnetLevel + 1.0 * m;  // BONNE RÉPONSE
  // Future : test profond du magnet (bumpHigh à entry + 1.5m), puis reverse
  const bumpHigh = entry + 1.5 * m;
  const bumpClose = magnetLevel - 0.2 * m;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, p - 0.1 * m));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.1) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [{ kind: "resistance", y1: magnetLevel - 0.04 * m, y2: magnetLevel + 0.04 * m, label: "Niveau magnétique" }],
    entry,
    tp: entry - 4.0 * m,
    direction: "SELL",
    seed,
    stops: [
      { type: "tight", price: tightPrice, rationale: KEY_MAGNET_TIGHT_FR },
      { type: "tight", price: lttPrice,   rationale: KEY_MAGNET_LTT_SELL_FR },
      { type: "wide",  price: widePrice,  rationale: KEY_MAGNET_WIDE_SELL_FR },
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
  // Mode de placement dérivé d'un seed décorrélé (constante 2^32 / φ) pour
  // que la distribution des modes soit indépendante de la trajectoire du chart.
  const mode = pickPlacementMode((seed ^ 0x9E3779B9) >>> 0);
  const m = VOL_MULT[volatility];
  switch (setup) {
    case "pullback_bull":             return scnPullbackBull(rng, m, difficulty, mode, seed);
    case "pullback_bear":             return scnPullbackBear(rng, m, difficulty, mode, seed);
    case "bounce_support":            return scnBounceSupport(rng, m, difficulty, mode, seed);
    case "rejection_resistance":      return scnRejectionResistance(rng, m, difficulty, mode, seed);
    case "fakeout_above_resistance":  return scnFakeoutAboveResistance(rng, m, difficulty, mode, seed);
    case "sweep_low_reversal":        return scnSweepLowReversal(rng, m, difficulty, mode, seed);
    case "fvg_continuation":          return scnFvgContinuation(rng, m, difficulty, mode, seed);
    case "high_vol_pullback":         return scnHighVolPullback(rng, m, difficulty, mode, seed);
    case "equal_lows_trap":           return scnEqualLowsTrap(rng, m, difficulty, mode, seed);
    case "round_number_sweep":        return scnRoundNumberSweep(rng, m, difficulty, mode, seed);
    case "asia_high_sweep":           return scnAsiaHighSweep(rng, m, difficulty, mode, seed);
    case "order_block_respect":       return scnOrderBlockRespect(rng, m, difficulty, mode, seed);
    case "prev_day_low_trap":         return scnPrevDayLowTrap(rng, m, difficulty, mode, seed);
    case "news_vol_expansion":        return scnNewsVolExpansion(rng, m, difficulty, mode, seed);
    case "htf_invalidation":          return scnHtfInvalidation(rng, m, difficulty, mode, seed);
    case "multi_swing_low":           return scnMultiSwingLow(rng, m, difficulty, mode, seed);
    case "fakeout_then_retest":       return scnFakeoutThenRetest(rng, m, difficulty, mode, seed);
    case "tight_consolidation":       return scnTightConsolidation(rng, m, difficulty, mode, seed);
    case "extreme_volatility_buy":    return scnExtremeVolatilityBuy(rng, m, difficulty, mode, seed);
    case "extreme_volatility_sell":   return scnExtremeVolatilitySell(rng, m, difficulty, mode, seed);
    case "news_imminent_wide":        return scnNewsImminentWide(rng, m, difficulty, mode, seed);
    case "liquidity_hunt_zone":       return scnLiquidityHuntZone(rng, m, difficulty, mode, seed);
    case "multi_swing_deep":          return scnMultiSwingDeep(rng, m, difficulty, mode, seed);
    case "fakeout_zone_wide":         return scnFakeoutZoneWide(rng, m, difficulty, mode, seed);
    case "weekly_open_volatility":    return scnWeeklyOpenVolatility(rng, m, difficulty, mode, seed);
    case "key_level_magnet":          return scnKeyLevelMagnet(rng, m, difficulty, mode, seed);
    case "news_imminent_wide_sell":   return scnNewsImminentWideSell(rng, m, difficulty, mode, seed);
    case "liquidity_hunt_zone_sell":  return scnLiquidityHuntZoneSell(rng, m, difficulty, mode, seed);
    case "multi_swing_high_deep":     return scnMultiSwingHighDeep(rng, m, difficulty, mode, seed);
    case "weekly_open_volatility_sell": return scnWeeklyOpenVolatilitySell(rng, m, difficulty, mode, seed);
    case "key_level_magnet_sell":     return scnKeyLevelMagnetSell(rng, m, difficulty, mode, seed);
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
  // Détection du type "correct" : classique (logical présent) ou inversé (wide = bonne réponse).
  // Dans les scénarios de vol extrême / news / chasse de liquidité, aucun "logical" n'existe
  // dans le tableau de stops et c'est "wide" qui devient la bonne réponse.
  const hasLogical = chart.stops.some((s) => s.type === "logical");
  const correctType: StopType = hasLogical ? "logical" : "wide";
  const isCorrect = chosen.type === correctType;
  let points = 0;
  let streakBonus = 0;
  if (isCorrect) {
    points = 100;
    if (currentStreak >= 2) streakBonus = 30;
  } else {
    switch (chosen.type) {
      case "wide":      points = 30; break;   // classique : survit mais RR cassé
      case "liquidity": points = -100; break;
      case "tight":     points = -50; break;  // inclut les "logical_too_tight" (mêmes -50)
      case "logical":   points = 100; break;  // dead-code : si "logical" existe, c'est le correctType
    }
  }
  return {
    points: points + streakBonus,
    streakBonus,
    type: chosen.type,
    correct: isCorrect,
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
