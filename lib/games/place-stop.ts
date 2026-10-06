// Mini-jeu V2 : "QUEL STOP VA SURVIVRE ?"
//
// Le joueur voit un graphique avec :
// - une entrée déjà placée
// - 3 stop loss proposés (A / B / C, ordonnés visuellement top→bottom)
//
// Il choisit le stop le plus logique selon la structure, la volatilité,
// le bruit du marché et le R/R.
//
// Après le choix, les bougies futures se révèlent et démontrent le verdict :
//   - tight     → généralement balayé par le 1er noise / sweep
//   - logical   → survit ET le trade va dans le bon sens
//   - wide      → survit mais le R/R est tué (capital mal utilisé)
//   - liquidity → placé pile dans une zone évidente de liquidité = piège

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  VOL_MULT, mulberry32, clamp, candle,
} from "./shared";
import { pickMarketContext, contextRule } from "./market-context";
import { realizeChart, type MarketCtx } from "./candle-realism";
import { assetPriceMap, mapCandle, mapDomain, mapZone } from "./price-scale";

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
const SESSIONS:      readonly Session[]    = ["Asie", "Londres", "New York", "Overlap", "Heures mortes"];

// ─── Templates ────────────────────────────────────────────────────────────────

export const PLACE_STOP_TEMPLATES: PlaceStopTemplate[] = [
  {
    id: "pullback_bull",
    title: "Pullback en tendance haussière",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tendance haussière, le prix corrige sur le support. Tu es entré au rebond.",
    shortContext: "Pullback BUY dans une tendance haussière.",
    lessons: {
      beginner:     "Le stop logique se place plutôt DERRIÈRE le swing low, avec une marge : dedans, il reste dans le bruit ; trop loin, il dégrade le R/R.",
      intermediate: "Pendant un pullback, le prix revient souvent tester le low avant la continuation. Ici, une marge derrière le low protège contre ce sweep classique.",
      advanced:     "Ici, le stop logique respecte 3 contraintes : derrière le low, hors du bruit du marché (au-delà de la volatilité du jour, mesurée par l'ATR, l'amplitude moyenne d'une journée), et un R/R d'au moins 2. C'est le seul des trois qui les remplit toutes.",
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
    context: "Tendance baissière, le prix rebondit sur une résistance. Tu es entré court.",
    shortContext: "Pullback SELL dans une tendance baissière.",
    lessons: {
      beginner:     "Le stop logique se place plutôt AU-DESSUS du swing high, avec une marge : en dessous, il reste exposé ; trop loin, il dégrade le R/R.",
      intermediate: "Le rebond peut retester son high avant de retomber. Coller le stop au high expose ici fortement à un stop hunt.",
      advanced:     "Un stop qui couvre la mèche du high, avec une marge à la mesure de la volatilité du jour (ATR, l'amplitude moyenne d'une journée), est une option logique. Pile au niveau, il risque d'être piégé ; trop loin, il dégrade le R/R.",
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
      beginner:     "Un stop sous le support, avec une marge réaliste, se défend. Pile sur le support, il risque d'être ramassé par la chasse à la liquidité.",
      intermediate: "Un support HTF attire souvent un test profond avant la vraie réaction. Ici, la marge protège contre ce stop hunt.",
      advanced:     "Une distance de 1 à 1,5 fois l'amplitude moyenne d'une journée (ATR) sous le niveau est souvent un bon repère. Plus court, le stop reste dans le bruit ; plus loin, il immobilise du capital.",
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
      beginner:     "Un stop au-dessus de la mèche la plus haute, avec une marge, est une option logique. Coller le niveau expose fortement à un stop hunt.",
      intermediate: "Les retests de résistance HTF sont souvent piégeux. Une marge derrière la mèche est ici fortement recommandée.",
      advanced:     "Ici, la mèche du rejet plus une amplitude moyenne d'une journée (1 ATR) dessine une zone propre. Coller la mèche expose au 2e test ; trop loin, le R/R se dégrade.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lecture",
  },
  {
    id: "fakeout_above_resistance",
    title: "Fakeout : short après rejet",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix a piqué au-dessus de la résistance puis a refermé sous. Tu vends (SELL) sur ce piège.",
    shortContext: "SELL après fakeout.",
    lessons: {
      intermediate: "Un stop au-dessus du PIC du fakeout (plutôt qu'à l'intérieur) est une option logique : ici, le pic marque l'invalidation réelle du piège.",
      advanced:     "Un stop AU-DESSUS du high de la mèche, avec une marge à la mesure de la volatilité du jour (ATR, l'amplitude moyenne d'une journée), se défend. Coller le high expose au retest du fakeout ; dans le piège, le stop coûte cher.",
      beginner:     "Ici, le stop gagne à couvrir la mèche du fakeout. Un stop placé dans la zone du piège risque fort d'être touché.",
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
    context: "Le prix vient de balayer la liquidité sous le plus bas précédent puis a fait demi-tour.",
    shortContext: "BUY après sweep low.",
    lessons: {
      intermediate: "Un stop sous le LOW du sweep, plutôt que dans la zone qui vient d'être prise, est une option logique. Ici, le sweep devient la nouvelle invalidation.",
      advanced:     "Un stop sous la mèche du sweep, avec une marge, se défend. Pile sur le low du sweep, un retest est probable ; dans la zone de liquidité, le piège est complet.",
      beginner:     "Ici, le marché vient de piquer une zone : ton stop a plus de chances de tenir SOUS cette zone que dedans.",
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
      intermediate: "Un stop sous le BAS du FVG est une option logique. Dans le FVG, il reste exposé à un retest profond ; trop loin, le R/R devient fragile.",
      advanced:     "Ici, le FVG sert de zone d'invalidation. Un stop environ une amplitude moyenne d'une journée (1 ATR) sous son bas se défend : plus serré, il reste dans le bruit ; plus loin, il immobilise du capital.",
      beginner:     "Ici, le FVG est ta zone d'achat. Le stop a plus de chances de tenir SOUS la zone que dedans.",
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
      advanced:     "En volatilité élevée, le stop « normal » devient souvent trop serré. Doubler la marge se défend : ce qui ressemble à un stop large est ici le stop LOGIQUE.",
      intermediate: "La volatilité élargit le bruit normal. Ici, un stop « standard » risque d'être trop serré.",
      beginner:     "Plus le marché bouge fort, plus ton stop a besoin d'espace pour respirer.",
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
      beginner:     "Deux lows presque égaux forment un double bottom évident pour beaucoup de traders. Un stop avec une marge sous la zone tient souvent mieux qu'un stop pile dedans.",
      intermediate: "Quand 2 lows sont presque égaux, ils créent une zone de liquidité visible par tous, souvent visitée avant un retournement. Un SL dessous, avec une marge anti-sweep, est une option logique.",
      advanced:     "Des equal lows forment souvent un réservoir de liquidité. Ici, l'invalidation réelle se situe plutôt plusieurs amplitudes moyennes d'une journée plus bas (plusieurs ATR), après le sweep, que juste sous les lows.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "round_number_sweep",
    title: "Niveau psychologique — la zone que tout le monde voit",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix flotte juste au-dessus d'un niveau psychologique majeur (niveau psychologique). Tous les retails ont leur SL pile sous ce niveau.",
    shortContext: "Sous niveau psychologique",
    lessons: {
      beginner:     "Les niveaux psychologiques (1.1000, 100 000…) attirent beaucoup de SL. Placer ton stop plus loin, plutôt que pile en dessous, est une option logique.",
      intermediate: "Les niveaux psychologiques sont des niveaux psychologiques où la liquidité se concentre : beaucoup de traders y placent SL et TP. Ces niveaux sont souvent balayés.",
      advanced:     "1.1000, 4 300, 100 000… ces niveaux attirent les stops. Un SL juste en dessous risque fort d'être chassé. Un SL plus loin, ou pas de trade, sont deux options logiques.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "asia_high_sweep",
    title: "haut de la session asiatique — sweep prévisible à l'ouverture London",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Session asiatique terminée, range bien défini. Ouverture de Londres dans 10 minutes. Tu vends (SELL) au haut du range asiatique.",
    shortContext: "Avant l'ouverture de Londres",
    lessons: {
      beginner:     "L'haut de la session asiatique est souvent balayé à l'ouverture de Londres. Ici, un SL au-dessus du sweep attendu tient mieux qu'un SL pile au high.",
      intermediate: "L'haut de la session asiatique est souvent balayé à l'ouverture de Londres. Vendre avec un stop pile au high, sans anticiper ce sweep, expose fortement à une sortie prématurée.",
      advanced:     "Le sweep du haut de la session asiatique est une mécanique de marché bien connue. Un SL au-dessus du sweep attendu, plutôt qu'au-dessus du high, est ici une option logique.",
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
    context: "Tu entres BUY sur un Order Block haussier identifié. Un swing low récent est visible juste au-dessus du bas du OB.",
    shortContext: "Order Block haussier",
    lessons: {
      beginner:     "L'invalidation d'un Order Block se situe plutôt sous son bas que sous le swing low récent. Ici, le SL gagne à en tenir compte.",
      intermediate: "Le bas de l'Order Block définit ici l'invalidation du concept, davantage que le dernier swing. Un SL sous le bas de l'OB, avec une marge, se défend.",
      advanced:     "L'invalidation d'un Order Block se situe plutôt sous son bas que sous le dernier swing low. Confondre les deux peut te sortir sur la mèche de mitigation alors que le setup reste valide.",
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
      beginner:     "Le PDL (Previous Day Low) est souvent une zone de stop hunt. Un SL sous le PDL, avec une marge, tient mieux qu'un SL pile en dessous.",
      intermediate: "Le PDL (Previous Day Low) est un niveau de liquidité quotidien, souvent visé par les stop hunts. Un SL pile en dessous risque fort d'être capturé.",
      advanced:     "Le PDL fait partie des niveaux clés, avec le PDH et les plus hauts et plus bas de la semaine ou du mois précédents. Un SL placé à moins de 5 pips au-delà de l'un d'eux a de fortes chances d'être chassé avant le vrai mouvement.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "news_vol_expansion",
    title: "Volatilité doublée (ATR) — le stop loss standard devient trop serré",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Aujourd'hui, le marché bouge deux fois plus que sa moyenne des 20 derniers jours (ATR, l'amplitude moyenne d'une journée). Volatilité exceptionnelle après le FOMC. Tu prends ton setup habituel avec ta marge de stop loss standard.",
    shortContext: "Le marché bouge 2 fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée)",
    lessons: {
      beginner:     "Quand la volatilité explose (FOMC, NFP), un SL « normal » devient souvent trop serré. Élargir la marge selon la volatilité du jour (ATR, l'amplitude moyenne d'une journée) est une option logique.",
      intermediate: "Un jour où le marché bouge deux fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée), le SL « standard » devient en pratique trop serré. Ici, une marge ajustée à la volatilité réelle évite une sortie très probable.",
      advanced:     "La taille du SL n'est pas un nombre fixe de pips : elle suit plutôt la volatilité du jour (ATR, l'amplitude moyenne d'une journée). Quand l'ATR double, doubler la marge se défend, sinon ton SL devient trop serré.",
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
    context: "Setup BUY en H1. Mais le dernier Higher Low H4 est nettement plus bas. La structure HTF reste haussière tant que ce HL H4 tient.",
    shortContext: "HL H4 nettement plus bas",
    lessons: {
      beginner:     "Quand le setup est en H1 mais le biais HTF en H4, ton SL gagne à respecter le HL H4 plutôt que le swing H1.",
      intermediate: "Le SL se place plutôt à l'échelle du timeframe d'invalidation que du timeframe d'entrée. Ici (setup H1, biais H4), un SL sous le HL H4 est une option logique.",
      advanced:     "Le SL gagne à être placé à l'échelle du setup. Ici (setup H1, biais H4), un SL au moins sous le HL H4 pertinent se défend ; sinon, une fluctuation H1 normale peut te sortir avant le vrai mouvement.",
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
      beginner:     "Quand 2 swing lows sont proches, un SL qui respecte le PLUS BAS est une option logique : le 1er est souvent balayé avant la vraie cassure.",
      intermediate: "Quand 2 swing lows sont proches, la structure n'est vraiment invalidée que si le PLUS BAS casse. Un SL sous le premier risque d'être touché sur une fluctuation normale.",
      advanced:     "Dans une séquence de lows, tant que le plus bas tient, la structure haussière reste intacte. Un SL sous le 1er swing ignore ici cette mécanique.",
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
      beginner:     "Quand un fakeout est déjà visible, le vrai high à invalider est plutôt la mèche que le haut du corps.",
      intermediate: "Le retest naturel après un fakeout va souvent chercher la mèche. Un SL au-dessus de la mèche, avec une marge, tient mieux qu'un SL au-dessus du corps.",
      advanced:     "Quand un fakeout a déjà eu lieu, le vrai high à invalider est plutôt la pointe de la mèche que le swing high du corps. Un SL sous la mèche risque d'être touché sur le retest naturel.",
    },
    difficulties: ["advanced"],
    tag: "piège",
  },
  {
    id: "tight_consolidation",
    title: "Range serré — l'arbitrage taille SL vs R/R",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Range serré : amplitude faible, prix coincé entre support et résistance proches. Tu veux entrer BUY au support. Le R/R sera mauvais avec un SL standard.",
    shortContext: "Range serré",
    lessons: {
      beginner:     "Dans un range serré, attendre une cassure ou réduire ta taille de position sont deux options logiques. Avec un SL standard, le R/R devient faible.",
      intermediate: "Dans un range serré, un SL standard dégrade le R/R, et un SL trop court risque d'être touché. Une option logique : attendre une expansion, ou réduire la taille de lot.",
      advanced:     "Dans un range étroit, l'arbitrage entre SL et R/R demande un compromis sur la taille. Attendre une expansion, ou accepter un R/R sous 1:2 compensé par le taux de réussite : à toi de trancher.",
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
    context: "Aujourd'hui, le marché bouge trois fois plus que sa moyenne des 20 derniers jours (ATR, l'amplitude moyenne d'une journée). Marché en mode expansion violente. Tu prends ton setup BUY classique. Le SL « standard » ne tiendra pas.",
    shortContext: "Le marché bouge 3 fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée) : expansion violente",
    lessons: {
      beginner:     "En volatilité extrême, ton SL « normal » devient souvent trop serré. Une marge proportionnelle à la volatilité du jour (ATR, l'amplitude moyenne d'une journée) est une option logique.",
      intermediate: "Quand le marché bouge trois fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée), un SL standard devient souvent inadapté. Adapter la marge ou passer ton tour sont deux options logiques.",
      advanced:     "Quand la volatilité du jour triple (ATR, l'amplitude moyenne d'une journée), un SL standard de 1,2 fois l'ATR devient en réalité trop serré. Mieux vaut adapter le SL à la volatilité du jour qu'à un nombre fixe de pips. En volatilité extrême, un SL de 3-4 fois l'ATR, ou pas de trade, se défendent.",
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
    context: "Aujourd'hui, le marché bouge trois fois plus que sa moyenne des 20 derniers jours (ATR, l'amplitude moyenne d'une journée). Marché en expansion violente. Tu vends (SELL) sur un rejet. Le SL « standard » au-dessus de la mèche ne tiendra pas.",
    shortContext: "Le marché bouge 3 fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée) : short en volatilité extrême",
    lessons: {
      beginner:     "En volatilité extrême, ton SL « normal » devient souvent trop serré, y compris en SELL. Une marge proportionnelle à la volatilité du jour (ATR, l'amplitude moyenne d'une journée) est une option logique.",
      intermediate: "Quand le marché bouge trois fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée), un SL standard au-dessus du high devient souvent inadapté. Adapter la marge ou passer ton tour sont deux options logiques.",
      advanced:     "En SELL aussi, le SL suit plutôt la volatilité du jour (ATR, l'amplitude moyenne d'une journée) qu'une marge fixe. Avec un ATR triplé, tripler la marge, ou ne pas trader, se défendent.",
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
    context: "NFP dans 5 minutes. Tu tiens absolument à entrer maintenant sur ce setup BUY. Le marché peut bouger 2 à 3 fois plus que d'habitude. Un SL standard a de fortes chances d'être touché.",
    shortContext: "NFP imminente",
    lessons: {
      beginner:     "Avant une news majeure, l'amplitude des bougies peut doubler ou tripler. Adapter ton SL, ou ne pas prendre le trade, sont deux options logiques.",
      intermediate: "Une bougie de news trois fois plus ample risque de balayer ton SL « standard » avant que tu aies le temps de réagir. Ici, une marge large est fortement recommandée.",
      advanced:     "Avant une news majeure, l'amplitude des bougies peut doubler ou tripler. Ne pas trader, ou adapter ton SL en conséquence, sont deux options logiques ; un SL standard risque d'être emporté par le mouvement.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "liquidity_hunt_zone",
    title: "Zone de stop hunt institutionnelle — éloigne ton SL",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le swing low 'évident' juste sous l'entrée est en réalité une zone de liquidité institutionnelle bien connue. Un SL placé juste dessous a de fortes chances d'être touché. Mieux vaut s'éloigner.",
    shortContext: "Zone de stop hunt connue",
    lessons: {
      beginner:     "Les swing lows évidents attirent beaucoup de SL. Placer ton SL bien au-delà de la zone, ou attendre après le sweep, sont deux options logiques.",
      intermediate: "Plus une zone paraît « évidente », plus elle risque d'être chassée. Un SL pile en dessous a de fortes chances d'être capturé.",
      advanced:     "Les swing lows trop « évidents » sont des zones de chasse fréquentes. Un SL pile en dessous a de fortes chances d'être capturé. Attendre que la chasse soit faite pour entrer, ou placer ton SL bien au-delà, se défendent.",
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
      beginner:     "Quand 3 swing lows s'alignent en descente, la vraie invalidation se situe plutôt sous le plus bas. Un SL sous le 1er risque fort d'être touché.",
      intermediate: "Quand plusieurs swing lows s'alignent, l'invalidation structurelle se situe plutôt sous le plus bas. Un SL sous les autres risque d'être touché sur une fluctuation normale.",
      advanced:     "Ici, la séquence de lower lows fait partie du pullback. Le SL gagne à respecter la profondeur maximale attendue du pullback plutôt qu'à s'arrêter au 1er swing.",
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
      beginner:     "Une résistance qui a déjà rejeté avec des mèches en produit souvent d'autres. Un SL au-dessus de la mèche maximale, plutôt que de la précédente, est une option logique.",
      intermediate: "Des fakeouts répétés forment souvent un schéma. Ici, anticiper une amplitude supérieure aux mèches précédentes se défend.",
      advanced:     "Une zone qui a déjà produit 2 fakeouts en produit souvent un 3e. Le SL gagne à anticiper cette amplitude maximale plutôt qu'à s'arrêter aux mèches précédentes.",
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
    context: "Lundi matin, ouverture du marché des devises (forex). Un gap de weekend est possible. Le SL doit absorber cette amplitude exceptionnelle.",
    shortContext: "Open lundi, gap possible",
    lessons: {
      beginner:     "L'ouverture du lundi peut créer un gap qui balaie un SL standard. Une marge large, ou pas de position avant l'ouverture, sont deux options logiques.",
      intermediate: "Un gap d'ouverture le lundi peut atteindre 1 à 2 fois l'amplitude moyenne d'une journée (ATR). Placer ton SL au-delà, ou attendre que le prix se stabilise, se défendent.",
      advanced:     "Le gap d'ouverture du lundi peut être brutal selon l'actualité du weekend. Attendre que l'ouverture soit digérée, ou placer un SL large pour absorber l'amplitude, sont deux options logiques.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "key_level_magnet",
    title: "Niveau clé — le prix va le toucher",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Un niveau clé majeur (niveau psychologique, PDL, plus bas de la semaine) est visible juste sous l'entrée. Le prix va statistiquement aller le tester. SL juste au-dessus du niveau = capture.",
    shortContext: "Niveau clé sous",
    lessons: {
      beginner:     "Les niveaux psychologiques attirent souvent le prix comme des aimants. Plutôt que pile au-dessus, un SL bien au-delà est une option logique.",
      intermediate: "Les niveaux psychologiques agissent souvent comme des aimants : le prix les teste très fréquemment. Un SL pile au-dessus risque fort d'être balayé.",
      advanced:     "Pour anticiper le test d'un niveau clé, placer le SL au-delà de l'amplitude probable du sweep, plutôt que juste au-dessus du niveau, se défend.",
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
    context: "FOMC dans 5 minutes. Tu prends ce SELL sur EUR/USD. Le marché peut bouger 2 à 3 fois plus que d'habitude. Un SL standard a de fortes chances d'être touché.",
    shortContext: "FOMC imminent",
    lessons: {
      beginner:     "Avant un FOMC, l'amplitude des bougies peut doubler ou tripler, et un SL standard risque d'être emporté. Adapter la marge, ou ne pas trader, sont deux options logiques.",
      intermediate: "Une bougie d'impact FOMC risque de balayer ton SL « standard » au-dessus du high avant que le mouvement directionnel ne démarre.",
      advanced:     "Avant un FOMC, l'amplitude des bougies peut doubler ou tripler. Un SL standard de 1,2 fois l'amplitude moyenne d'une journée (ATR) risque d'être balayé par le premier mouvement. Ne pas trader, ou prévoir un SL d'au moins 3 fois l'ATR, se défendent.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "liquidity_hunt_zone_sell",
    title: "Zone de stop hunt SELL — éloigne ton SL au-dessus",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le swing high évident juste au-dessus de l'entrée est en réalité une zone de liquidité institutionnelle bien connue. Un SL placé juste au-dessus a de fortes chances d'être touché.",
    shortContext: "Zone de stop hunt au-dessus",
    lessons: {
      beginner:     "Les swing highs évidents attirent beaucoup de SL. Placer ton SL bien au-delà de la zone, ou attendre après le sweep, sont deux options logiques.",
      intermediate: "Plus une zone paraît « évidente », plus elle risque d'être chassée. Un SL pile au-dessus du swing high a de fortes chances d'être capturé.",
      advanced:     "Les swing highs trop évidents sont des zones de chasse fréquentes, et un SL pile au-dessus a de fortes chances d'être capturé. Attendre la chasse, ou placer ton SL bien au-delà, se défendent.",
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
      beginner:     "Quand 3 swing highs s'alignent en montée, la vraie invalidation se situe plutôt au-dessus du plus haut. Un SL au-dessus du 1er risque fort d'être touché.",
      intermediate: "Quand plusieurs swing highs s'alignent, l'invalidation structurelle se situe plutôt au-dessus du plus haut. Un SL au-dessus des autres risque d'être touché sur une fluctuation normale.",
      advanced:     "Ici, la séquence de higher highs fait partie du pullback baissier. Le SL gagne à respecter la profondeur maximale attendue du pullback.",
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
    context: "Lundi matin, ouverture du marché des devises (forex). Un gap haussier weekend est possible. Le SL SELL doit absorber cette amplitude.",
    shortContext: "Open lundi, gap possible",
    lessons: {
      beginner:     "L'ouverture du lundi peut créer un gap haussier qui balaie un SL standard. Une marge large, ou pas de position avant l'ouverture, sont deux options logiques.",
      intermediate: "Un gap d'ouverture le lundi peut atteindre 1 à 2 fois l'amplitude moyenne d'une journée (ATR) vers le haut. Placer ton SL de SELL au-delà, ou attendre que le prix se stabilise, se défendent.",
      advanced:     "Le gap d'ouverture du lundi peut être brutal selon l'actualité du weekend. Ici, le SL du SELL gagne à absorber l'amplitude du gap.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "key_level_magnet_sell",
    title: "Niveau clé au-dessus — le prix va le tester",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Un niveau clé majeur (niveau psychologique, PDH, plus haut de la semaine) est visible juste au-dessus de l'entrée. Le prix va statistiquement aller le tester.",
    shortContext: "Niveau clé au-dessus",
    lessons: {
      beginner:     "Les niveaux psychologiques attirent souvent le prix comme des aimants, vers le haut aussi. Plutôt que pile en dessous, un SL bien au-delà est une option logique.",
      intermediate: "Les niveaux psychologiques agissent souvent comme des aimants : le prix les teste très fréquemment. Un SL pile au-dessus risque fort d'être balayé.",
      advanced:     "Pour anticiper le test d'un niveau clé, placer le SL au-delà de l'amplitude probable du sweep se défend.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lecture",
  },
];

// ─── Variations ───────────────────────────────────────────────────────────────

// Scénarios conservés dans le code mais retirés de la rotation (décision PO).
// tight_consolidation : ses textes annoncent un R/R < 1:2 pour le bon stop, ce
// qui contredit la règle « une bonne réponse n'a jamais un R/R faible ».
const DISABLED_SETUPS: ReadonlySet<PlaceStopSetupKey> = new Set<PlaceStopSetupKey>(["tight_consolidation"]);

export function generatePlaceStopScenarios(seed: number, difficulty: Difficulty = "intermediate"): PlaceStopInstance[] {
  const rng = mulberry32(seed);
  const pool = PLACE_STOP_TEMPLATES.filter((t) => t.difficulties.includes(difficulty) && !DISABLED_SETUPS.has(t.id));
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
      // Contexte cohérent : session, actif tradé dans la session, volatilité et spread de la session
      ...pickMarketContext(rng, { assets: ASSETS, sessions: SESSIONS }, contextRule("ps", candidate.id, isHighVol ? { volatility: "élevée" } : {})),
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
const TIGHT_RATIONALE = "✗ Trop serré : ici, le stop est placé dans le bruit normal du marché. La 1re mèche de retest risque de le balayer avant que le trade aboutisse. C'est une erreur fréquente.";
const LOGICAL_RATIONALE = "✓ Placement logique : derrière la vraie invalidation, avec une marge anti-bruit. Ici, il survit aux retests et laisse le trade capter la cassure structurelle si elle arrive.";
const WIDE_RATIONALE = "≈ Il survit, mais dégrade le R/R. Ici, la distance est trop grande : le capital est mal utilisé, et le R/R baisse nettement par rapport au stop logique.";

// Rationales spécifiques aux nouveaux scénarios (sweep / liquidity / multi-structure)
const EQUAL_LOWS_TIGHT_FR   = "✗ Ici, le stop est DANS la zone de liquidité créée par les 2 equal lows. C'est le SL le plus évident, souvent ramassé avant la hausse.";
const EQUAL_LOWS_LOGICAL_FR = "✓ Sous la zone de sweep des 2 lows, avec une marge anti-mèche. Ici, c'est l'invalidation réelle du concept, à l'abri de la chasse à la liquidité.";
const ROUND_LIQUIDITY_FR    = "✗ Ici, le stop est pile sous le niveau psychologique, là où beaucoup de SL s'entassent. Ce niveau est très souvent balayé.";
const ROUND_LOGICAL_FR      = "✓ Sous le sweep attendu du niveau psychologique, avec une marge. Ici, le SL reste hors de la zone ciblée, et le setup reste valide après la chasse.";
const ASIA_LIQUIDITY_FR     = "✗ Ici, le stop est pile au-dessus du haut de la session asiatique, dans la zone que l'ouverture de Londres balaie souvent. C'est un piège fréquent de l'ouverture européenne.";
const ASIA_LOGICAL_FR       = "✓ Au-dessus du sweep attendu du haut de la session asiatique, avec une marge. Si le prix revient là après l'ouverture de Londres, le biais baissier est probablement faux.";
const OB_TIGHT_FR           = "✗ Ici, le stop est sous le swing low, mais au-dessus du bas de l'Order Block. Le swing risque d'être balayé alors que le concept OB reste valide.";
const OB_LOGICAL_FR         = "✓ Sous le bas de l'Order Block, avec une marge. Ici, c'est la VRAIE invalidation du concept : le swing low peut être balayé sans casser le setup.";
const PDL_LIQUIDITY_FR      = "✗ Ici, le stop est pile sous le PDL, un niveau quotidien très souvent visé par les stop hunts. Tu exposes ta position à ce stop hunt.";
const PDL_LOGICAL_FR        = "✓ Sous la zone de stop hunt du PDL, avec une marge. Le sweep attendu peut avoir lieu : ici, le SL reste hors de la zone ciblée.";
const NEWS_TIGHT_FR         = "✗ Stop « standard » calibré pour une volatilité normale, alors qu'ici le marché bouge deux fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée). Ce qui paraît raisonnable est en fait trop serré.";
const NEWS_LOGICAL_FR       = "✓ Marge calibrée sur la volatilité réelle du jour, doublée (ATR, l'amplitude moyenne d'une journée). Ce qui semblerait large en temps normal est ici le stop LOGIQUE : il survit au bruit amplifié.";
const NEWS_WIDE_FR          = "≈ Il survit largement, mais la marge est surestimée, même pour une volatilité doublée (ATR, l'amplitude moyenne d'une journée). Ici, le capital est sous-utilisé et le R/R plus faible qu'avec le stop logique.";
const HTF_TIGHT_FR          = "✗ Ici, le stop est sous le swing low H1, mais le biais H4 n'est pas cassé. Une fluctuation H1 normale risque de te sortir alors que le setup HTF reste valide.";
const HTF_LOGICAL_FR        = "✓ Sous le HL H4 pertinent, avec une marge. Ici, c'est la cassure du biais HTF qui invaliderait le setup, pas une simple fluctuation H1.";
const MULTI_TIGHT_FR        = "✗ Ici, le stop est sous le 1er swing low (le plus haut), alors que le swing low plus bas tient encore. La structure n'est pas cassée, et le retest du 2e low risque de te sortir.";
const MULTI_LOGICAL_FR      = "✓ Sous le PLUS BAS des 2 swing lows, avec une marge. C'est ici l'invalidation structurelle réelle : tant que ce niveau tient, la structure haussière reste intacte.";
const FAKE2_TIGHT_FR        = "✗ Ici, le stop est au-dessus du swing high du corps, mais sous la mèche du fakeout. Le retest naturel de la mèche risque de venir le chercher.";
const FAKE2_LOGICAL_FR      = "✓ Au-dessus de la mèche du fakeout, avec une marge. Ici, la pointe de la mèche est le vrai high à invalider, plutôt que le haut du corps.";
const TIGHTCONS_TIGHT_FR    = "✗ Ici, le stop est dans le range serré, en plein bruit de la consolidation. La 1re oscillation du range risque de le balayer.";
const TIGHTCONS_LOGICAL_FR  = "✓ Juste sous le bas du range, avec une marge. Le SL respecte ici la structure du range, mais le R/R reste limité par le haut : à arbitrer avec la taille de position.";
const TIGHTCONS_WIDE_FR     = "≈ SL très large, mais ici le haut du range rend le R/R très difficile. Sans expansion, le trade offre peu de marge de gain.";

// V2.2 — rationales des 8 scénarios "wide = bonne réponse"
// LTT = "Logical Too Tight" : stop qui semble logique selon les règles normales,
// mais inadapté au contexte (vol extrême, news, chasse). Typé "tight" pour
// rester compatible avec le scoring existant (-50 comme un tight classique).
const EXTREME_VOL_TIGHT_FR   = "✗ Ici, le stop est dans le bruit immédiat. La 1re bougie de retest, ample à cause de la volatilité extrême, risque de le balayer très vite.";
const EXTREME_VOL_LTT_FR     = "✗ Stop « standard » calibré pour une volatilité normale. Avec une volatilité du jour triplée (ATR, l'amplitude moyenne d'une journée), ce niveau se trouve ici dans le bruit, et risque d'être balayé avant que le setup ait le temps de jouer.";
const EXTREME_VOL_WIDE_FR    = "✓ Marge calibrée sur la volatilité RÉELLE du jour (3 fois la normale). Ici, c'est le seul stop qui absorbe l'expansion sans casser le setup.";

const NEWS_IMM_TIGHT_FR      = "✗ Ici, le stop est dans le bruit immédiat. La bougie d'impact de la news risque de le balayer en quelques secondes.";
const NEWS_IMM_LTT_FR        = "✗ Stop « normal », peu adapté à l'amplitude d'une news. Une bougie d'impact (2 à 3 fois plus ample) risque ici de te sortir avant le vrai mouvement directionnel.";
const NEWS_IMM_WIDE_FR       = "✓ Marge assez large pour absorber l'amplitude de la news. Ici, c'est ce SL, ou pas de trade pendant la fenêtre de news.";

const LIQ_HUNT_TIGHT_FR      = "✗ Ici, le stop est dans le bruit immédiat. Le 1er retest risque de le balayer avant même la chasse principale.";
const LIQ_HUNT_LTT_FR        = "✗ Ici, le stop est sous un swing low évident, une zone de stop hunt fréquente. Le sweep prend très souvent ce niveau avant le vrai retournement.";
const LIQ_HUNT_WIDE_FR       = "✓ Sous la zone de stop hunt, avec une marge ample. Le sweep peut avoir lieu : ici, ton SL reste hors d'atteinte.";

const MULTI_DEEP_TIGHT_FR    = "✗ Ici, le stop est sous le 1er swing low (le plus haut). Le pullback structurel descend plus bas, et le SL reste dans le bruit du mouvement.";
const MULTI_DEEP_LTT_FR      = "✗ Ici, le stop est sous le 2e swing low. La séquence de lower lows se prolonge jusqu'au 3e : le stop risque d'être balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_FR     = "✓ Sous le 3e swing low (le plus bas), avec une marge. C'est ici la vraie invalidation structurelle de la séquence.";

const FAKEOUT_ZONE_TIGHT_FR  = "✗ Ici, le stop est dans le bruit immédiat : la moindre mèche de retest risque de le balayer.";
const FAKEOUT_ZONE_LTT_FR    = "✗ Ici, le stop est au-dessus des 2 fakeouts précédents, mais un 3e fakeout dépasse souvent cette amplitude. Il risque d'être balayé.";
const FAKEOUT_ZONE_WIDE_FR   = "✓ Au-dessus de l'amplitude maximale probable des fakeouts répétés. Ici, un 3e fakeout a peu de chances de te toucher.";

const WEEKLY_OPEN_TIGHT_FR   = "✗ Ici, le stop est dans le bruit immédiat. Le gap d'ouverture du lundi risque de le balayer dès la 1re bougie.";
const WEEKLY_OPEN_LTT_FR     = "✗ Stop « standard », peu adapté à un gap de weekend qui peut atteindre 2 à 3 fois l'amplitude normale d'une bougie.";
const WEEKLY_OPEN_WIDE_FR    = "✓ Marge large pour absorber l'amplitude du gap d'ouverture. Ici, tant que la structure tient, le SL tient aussi.";

const KEY_MAGNET_TIGHT_FR    = "✗ Ici, le stop est dans le bruit immédiat, et risque d'être balayé avant même que le niveau clé soit atteint.";
const KEY_MAGNET_LTT_FR      = "✗ Ici, le stop est juste au-dessus du niveau clé. Le test profond risque d'aller plus bas, et le sweep de prendre ce niveau.";
const KEY_MAGNET_WIDE_FR     = "✓ Au-delà de l'amplitude du test attendu sur le niveau clé. Le sweep peut toucher le niveau : ici, ton SL reste hors d'atteinte.";

// V2.3 — variantes SELL : reformulations directionnelles (au-dessus / swing high).
const LIQ_HUNT_LTT_SELL_FR     = "✗ Ici, le stop est au-dessus d'un swing high évident, une zone de stop hunt fréquente. Le sweep prend très souvent ce niveau avant le vrai retournement.";
const LIQ_HUNT_WIDE_SELL_FR    = "✓ Au-dessus de la zone de stop hunt, avec une marge ample. Le sweep peut avoir lieu : ici, ton SL reste hors d'atteinte.";
const MULTI_DEEP_TIGHT_SELL_FR = "✗ Ici, le stop est au-dessus du 1er swing high (le plus bas). Le pullback structurel monte plus haut, et le SL reste dans le bruit du mouvement.";
const MULTI_DEEP_LTT_SELL_FR   = "✗ Ici, le stop est au-dessus du 2e swing high. La séquence de higher highs se prolonge jusqu'au 3e : le stop risque d'être balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_SELL_FR  = "✓ Au-dessus du 3e swing high (le plus haut), avec une marge. C'est ici la vraie invalidation structurelle de la séquence.";
const KEY_MAGNET_LTT_SELL_FR   = "✗ Ici, le stop est juste sous le niveau clé. Le test profond risque d'aller plus haut, et le sweep de prendre ce niveau.";
const KEY_MAGNET_WIDE_SELL_FR  = "✓ Au-delà de l'amplitude du test attendu vers le haut. Le sweep peut toucher le niveau clé : ici, ton SL reste hors d'atteinte.";

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
    const k = candle(o, c, (0.2 + rng() * 0.2) * m, (0.7 + rng() * 0.3) * m);
    k.l = Math.min(k.l, S + 0.05); // « vient de rebondir sur le support » : la mèche entre dans la zone
    past.push(k);
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
    const k = candle(o, c, (0.7 + rng() * 0.3) * m, (0.2 + rng() * 0.2) * m);
    k.h = Math.max(k.h, R - 0.05); // « vient de rejeter la résistance avec mèches » : la mèche entre dans la zone
    past.push(k);
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
      { kind: "liquidity_high", y1: R + 0.15,           y2: fakeoutHigh,        label: "Mèche du fakeout" },
    ],
    entry,
    // TP étendu pour garantir RR_logical >= 2 sur ce setup où la structure
    // pousse logical loin de l'entry.
    tp: entry - Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "SELL",
    seed,
    tight:   { price: tightPrice,   rationale: "✗ Ici, le stop est dans la zone du piège, là où la liquidité vient d'être ramassée. Le 2e test risque de le balayer." },
    logical: { price: logicalPrice, rationale: "✓ Au-dessus du pic du fakeout, avec une marge. C'est ici la VRAIE invalidation du piège : si le prix repasse là, le scénario est probablement cassé." },
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
      { kind: "support",       y1: L - 0.1,        y2: L + 0.1,        label: "Plus bas précédent"     },
      { kind: "liquidity_low", y1: sweepLow,       y2: L - 0.15,       label: "Liquidité balayée" },
    ],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    seed,
    tight:   { price: tightPrice,   rationale: "✗ Ici, le stop est DANS la zone du sweep, là où la liquidité vient d'être ramassée. Le retest risque de venir le chercher." },
    logical: { price: logicalPrice, rationale: "✓ Sous la mèche du sweep, avec une marge. Ici, le low du sweep devient la nouvelle invalidation, à l'abri d'un 2e ramassage." },
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
  // Clôture au-dessus du plus bas de la mèche (OHLC valide) : dip dans le FVG puis reprise
  const retestClose = Math.max(fvgLow + 0.2 * m, dipLow + 0.15 * m);
  fut.push(explicitCandle(p, retestClose, p + (0.1 + rng() * 0.1) * m, dipLow));
  p = retestClose;
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
    tight:   { price: tightPrice,   rationale: "✗ Ici, le stop est DANS le FVG, une zone où le marché peut revenir pour terminer sa mitigation. Il risque d'être pris dans la profondeur de la zone." },
    logical: { price: logicalPrice, rationale: "✓ Sous le bas du FVG, avec une marge. Ici, un FVG entièrement traversé signerait une invalidation propre : c'est le placement structurel le plus cohérent." },
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
    tight:   { price: tightPrice,   rationale: "✗ Stop « standard », correct en volatilité normale, mais ici ce niveau se trouve dans le bruit. La 1re bougie de retest, ample à cause de la volatilité, risque de le balayer." },
    logical: { price: logicalPrice, rationale: "✓ Stop élargi à la volatilité du marché. Ce qui ressemblerait à un stop large en temps normal est ici le stop LOGIQUE : il survit au bruit amplifié sans sacrifier le R/R (le TP est aussi plus loin)." },
    wide:    { price: widePrice,    rationale: "≈ Il survit, mais même avec un TP étendu en volatilité élevée, le R/R descend ici sous 1,5. Le capital est mal utilisé." },
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
  // « Deux lows quasi égaux » : la mèche du 1er low s'arrête juste sous sa clôture
  past[past.length - 1].l = low1 - 0.03 * m;
  // Rebond
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    const k = candle(o, c, (0.2 + rng() * 0.18) * m, (0.15 + rng() * 0.15) * m);
    k.l = Math.max(k.l, low1 - 0.02 * m); // la remontée ne perce pas le 1er low
    past.push(k);
    p = c;
  }
  // 2e descente, touche un low quasi égal au 1er
  const low2Target = low1 + 0.1 * m;
  for (let i = 0; i < 4; i++) {
    const o = p;
    // La 2e descente reste au-dessus du 1er low, puis retombe à quelques pips de lui
    const c = i === 3 ? low2Target : Math.max(o - (0.3 + rng() * 0.3) * m, low1 + 0.15 * m);
    const k = candle(o, c, (0.13 + rng() * 0.13) * m, (0.18 + rng() * 0.2) * m);
    k.l = i === 3 ? low1 - 0.01 * m : Math.max(k.l, low1 + 0.05 * m);
    past.push(k);
    p = c;
  }
  // Rebond vers entry
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.25) * m;
    const k = candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.12) * m);
    k.l = Math.max(k.l, low1 + 0.02 * m); // le rebond ne revient pas sous les equal lows
    past.push(k);
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
  // Le niveau psychologique est 0.8m sous le prix courant
  const roundNumber = p - 0.8 * m;
  // Consolidation au-dessus du niveau psychologique
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
  // Future : sweep du niveau psychologique, puis rallye
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
    zones: [{ kind: "support", y1: roundNumber - 0.05 * m, y2: roundNumber + 0.05 * m, label: "Niveau psychologique" }],
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
    const k = candle(o, c, (0.12 + rng() * 0.12) * m, (0.12 + rng() * 0.12) * m);
    k.h = Math.min(k.h, asiaHigh + 0.04 * m); // le high du range Asia n'est pas dépassé avant London
    past.push(k);
    p = c;
  }
  // Approche finale vers le high (entry juste sous le high)
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (asiaHigh - 0.05 * m - o) * (0.5 + rng() * 0.3);
    const k = candle(o, c, (0.12 + rng() * 0.1) * m, (0.1 + rng() * 0.08) * m);
    k.h = Math.min(k.h, asiaHigh + 0.04 * m);
    past.push(k);
    p = c;
  }
  const entry = p;
  const liquidityPrice = asiaHigh + 0.1 * m;
  const logicalPrice   = asiaHigh + trapMarginFor(d, mode) * m + 0.4 * m;
  const widePrice      = entry + 2.8 * m + widePushFor(mode) * m;
  // Future : sweep d'haut de la session asiatique (1 bougie qui dépasse), puis drop
  const bumpHigh = asiaHigh + 0.4 * m;
  const bumpClose = asiaHigh - 0.4 * m;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, Math.min(p, bumpClose) - 0.15 * m));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.13) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  return finalizeStops({
    past, fut,
    zones: [{ kind: "resistance", y1: asiaHigh - 0.05 * m, y2: asiaHigh + 0.05 * m, label: "Haut de la session asiatique" }],
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
  // Le PDL n'a pas encore été touché : il se situe sous tous les lows du passé
  const PDL = Math.min(entry - 0.6 * m, Math.min(...past.map((k) => k.l)) - 0.08 * m);
  const liquidityPrice = PDL - 0.1 * m;
  const logicalPrice   = PDL - trapMarginFor(d, mode) * m - 0.5 * m;
  // Le stop large reste plus loin que le logique même si le PDL descend
  const widePrice      = Math.min(entry - 2.6 * m - widePushFor(mode) * m, logicalPrice - 0.8 * m);
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
      { kind: "liquidity_high", y1: swingHigh + 0.05 * m, y2: fakeoutWick,          label: "Mèche du fakeout" },
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
      { kind: "support",    y1: rangeLow - 0.04 * m,  y2: rangeLow + 0.04 * m,  label: "Bas du range" },
      { kind: "resistance", y1: rangeHigh - 0.04 * m, y2: rangeHigh + 0.04 * m, label: "Haut du range" },
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
      { kind: "liquidity_low", y1: dipLow - 0.05 * m,   y2: swingLow - 0.1 * m,  label: "Zone de stop hunt" },
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
  const fake1Close = R - 0.4 - rng() * 0.2;
  past.push({ o: p, c: fake1Close, h: fake1High, l: Math.min(p, fake1Close) - 0.15 * m });
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
  const fake2Close = R - 0.5 - rng() * 0.2;
  past.push({ o: p, c: fake2Close, h: fake2High, l: Math.min(p, fake2Close) - 0.15 * m });
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
  fut.push(explicitCandle(p, bumpClose, bumpHigh, Math.min(p, bumpClose) - 0.15 * m));
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
  // Construire un niveau clé visible à p - 0.7m approximativement
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
    zones: [{ kind: "support", y1: magnetLevel - 0.04 * m, y2: magnetLevel + 0.04 * m, label: "Niveau clé" }],
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
      { kind: "liquidity_high", y1: swingHigh + 0.1 * m,  y2: bumpHigh + 0.05 * m,  label: "Zone de stop hunt" },
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
    zones: [{ kind: "resistance", y1: magnetLevel - 0.04 * m, y2: magnetLevel + 0.04 * m, label: "Niveau clé" }],
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

/**
 * Graphique converti à l'échelle de prix de l'actif (au dernier moment, pour
 * l'affichage). Le scénario « niveau psychologique » tombe sur un vrai niveau psychologique.
 */
export function withAssetPrices(chart: PlaceStopChart, inst: { id: string; asset: Asset; seed: number }): PlaceStopChart {
  const roundZone = inst.id === "round_number_sweep" ? chart.zones[0] : undefined;
  const anchor = roundZone ? (roundZone.y1 + roundZone.y2) / 2 : chart.entry;
  const f = assetPriceMap(inst.asset, inst.seed, anchor, { round: !!roundZone });
  return {
    ...chart,
    past:   chart.past.map(mapCandle(f)),
    future: chart.future.map(mapCandle(f)),
    zones:  chart.zones.map(mapZone(f)),
    domain: mapDomain(f, chart.domain),
    entry:  f(chart.entry),
    tp:     chart.tp === null ? null : f(chart.tp),
    stops:  chart.stops.map((st) => ({ ...st, price: f(st.price) })),
  };
}

export function buildPlaceStopChart(
  setup: PlaceStopSetupKey,
  seed: number,
  volatility: Volatility,
  difficulty: Difficulty,
  ctx: MarketCtx = {},
): PlaceStopChart {
  const chart = rebalanceCorrectPosition(buildScenarioChart(setup, seed, volatility, difficulty), seed);
  const withTarget = setup === "tight_consolidation" ? chart : ensureCorrectStopRR(chart);
  // Passe de réalisme des bougies (niveaux clés : zones, entrée, TP, les 3 stops)
  // (passé : zones ; futur : aussi entrée, TP et stops, qui décident de l'issue)
  const zones = withTarget.zones.flatMap((z) => [z.y1, z.y2]);
  const outcome = [...(withTarget.tp !== null ? [withTarget.tp] : []), ...withTarget.stops.map((st) => st.price)];
  return keepPricesPositive(realizeChart(withTarget, { past: zones, future: [...zones, withTarget.entry, ...outcome] }, seed, { ...ctx, volatility }));
}

// Le bon stop ne doit jamais avoir un R/R faible : l'objectif (TP) est au moins
// à MIN_CORRECT_RR × la distance du bon stop. Exception : la consolidation
// serrée, dont les textes annoncent un R/R limité par le haut du range.
const MIN_CORRECT_RR = 2.2;

function ensureCorrectStopRR(chart: PlaceStopChart): PlaceStopChart {
  if (chart.tp === null) return chart;
  const correctType: StopType = chart.stops.some((s) => s.type === "logical") ? "logical" : "wide";
  const good = chart.stops.find((s) => s.type === correctType);
  if (!good) return chart;
  const dGood = Math.abs(chart.entry - good.price);
  const dTp = Math.abs(chart.tp - chart.entry);
  if (dTp >= MIN_CORRECT_RR * dGood) return chart;
  const tp = chart.entry + Math.sign(chart.tp - chart.entry) * MIN_CORRECT_RR * dGood;
  const span = chart.domain.max - chart.domain.min;
  return {
    ...chart,
    tp,
    domain: { min: Math.min(chart.domain.min, tp - span * 0.04), max: Math.max(chart.domain.max, tp + span * 0.04) },
  };
}

// Les prix sont affichés au joueur (boutons de stop) : un graphique qui passe
// sous 0 est décalé d'un nombre entier (distances, touches, R/R et chiffres
// ronds inchangés).
function keepPricesPositive(chart: PlaceStopChart): PlaceStopChart {
  const low = Math.min(
    ...chart.stops.map((s) => s.price),
    ...[...chart.past, ...chart.future].map((k) => k.l),
    ...chart.zones.map((z) => Math.min(z.y1, z.y2)),
    chart.entry,
    chart.tp ?? chart.entry,
  );
  if (low >= 0.5) return chart;
  const d = Math.ceil(1 - low);
  const k = (c: Candle): Candle => ({ o: c.o + d, h: c.h + d, l: c.l + d, c: c.c + d });
  return {
    ...chart,
    past:   chart.past.map(k),
    future: chart.future.map(k),
    zones:  chart.zones.map((z) => ({ ...z, y1: z.y1 + d, y2: z.y2 + d })),
    entry:  chart.entry + d,
    tp:     chart.tp === null ? null : chart.tp + d,
    stops:  chart.stops.map((s) => ({ ...s, price: s.price + d })),
    domain: { min: chart.domain.min + d, max: chart.domain.max + d },
  };
}

// ─── Anti-biais « le bon stop est toujours au milieu » ───────────────────────
// Les stops sont numérotés 1/2/3 par position (haut → bas). Dans les scénarios
// « serré / logique / large », le logique est toujours au milieu. Pour une part
// des rounds, on remplace le piège serré par un 2e stop trop loin : le logique
// devient le plus proche de l'entrée (en haut pour un BUY, en bas pour un SELL).
// Les deux stops trop loin survivent et dégradent le R/R, comme le dit leur
// rationale. Tirage décorrélé : aucun autre tirage du scénario ne change.
const FAR_VARIANT_SHARE = 0.45;

function rebalanceCorrectPosition(chart: PlaceStopChart, seed: number): PlaceStopChart {
  const correctType: StopType = chart.stops.some((s) => s.type === "logical") ? "logical" : "wide";
  const [top, mid, bot] = chart.stops; // déjà triés top → bas
  if (!mid || mid.type !== correctType) return chart;
  if (mulberry32((seed ^ 0x85EBCA6B) >>> 0)() >= FAR_VARIANT_SHARE) return chart;
  const buy = chart.direction === "BUY";
  const near = buy ? top : bot;   // piège le plus proche de l'entrée
  const far  = buy ? bot : top;   // stop trop loin
  if (near.type !== "tight" && near.type !== "liquidity") return chart;
  if (far.rationale.trim().startsWith("✗")) return chart;
  const dFar = Math.abs(far.price - chart.entry);
  const dMid = Math.abs(mid.price - chart.entry);
  const dWider = dFar + Math.max((dFar - dMid) * 0.6, dFar * 0.3);
  const wider = { price: buy ? chart.entry - dWider : chart.entry + dWider, type: far.type, rationale: far.rationale };
  const sorted = [
    wider,
    { price: mid.price, type: mid.type, rationale: mid.rationale },
    { price: far.price, type: far.type, rationale: far.rationale },
  ].sort((a, b) => b.price - a.price);
  const labels = shuffleSeeded(["A", "B", "C"] as StopId[], seed);
  const stops: StopOption[] = sorted.map((s, i) => ({ id: labels[i], ...s }));
  const lo = Math.min(chart.domain.min, wider.price);
  const hi = Math.max(chart.domain.max, wider.price);
  return {
    ...chart,
    stops,
    domain: { min: buy ? Math.min(lo, wider.price - (hi - lo) * 0.04) : lo, max: buy ? hi : Math.max(hi, wider.price + (hi - lo) * 0.04) },
  };
}

function buildScenarioChart(
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
  // Barème simple (décision PO) : bon stop +10, tout autre stop 0 (plus de points
  // partiels pour le stop trop large, plus de malus). La série n'ajoute rien.
  void currentStreak;
  return {
    points: isCorrect ? 10 : 0,
    streakBonus: 0,
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
    description: "Volatilité plus sale, plusieurs stops plausibles, stop serré tentant.",
  },
  advanced: {
    label:       "Avancé",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Marché ambigu, sweep partiel, arbitrage survie / invalidation / R/R.",
  },
};

export function sessionVerdict(score: number, logicalCount: number, total: number): string {
  if (logicalCount >= total - 1) return "Stop sniper";
  if (score >= 70)               return "Bonne protection";
  if (score >= 50)               return "Lecture solide";
  if (score >= 30)               return "À polir";
  if (score >= 10)               return "Trop émotionnel";
  return "Tu donnes ton SL au marché";
}
