// Mini-jeu #3 : "TROUVE L'ERREUR"
//
// Le joueur voit un setup/trade/contexte et identifie l'erreur principale
// parmi 4 choix. Pédagogie centrée sur les erreurs retail réelles :
// technique, psychologique, exécution, R/R, timing, HTF, liquidité, discipline.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  VOL_MULT, mulberry32, clamp, candle,
} from "./shared";
import { pickMarketContext, contextRule } from "./market-context";
import { realizeChart, type MarketCtx } from "./candle-realism";
import { anchorPrice, assetPriceMap, linearPriceMap, mapCandle, mapDomain, mapZone } from "./price-scale";

export type { Asset, Session, Volatility, Spread, HtfBias, MacroContext, Candle, ChartZone };

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type TradeDirection = "BUY" | "SELL" | null;

// Vocabulaire d'erreurs partagé (master list)
export type MistakeId =
  | "stop_too_tight"
  | "stop_in_liquidity"
  | "trade_against_htf"
  | "trade_before_news"
  | "buy_in_resistance"
  | "sell_in_support"
  | "bad_rr"
  | "no_confirmation"
  | "oversized_position"
  | "bad_spread"
  | "volatility_ignored"
  | "fomo_after_pump"
  | "revenge_trade"
  | "range_middle"
  | "sweep_ignored"
  | "mitigation_misread"
  | "bad_timing"
  | "ignored_zone"
  | "risk_not_reduced_news"
  | "position_held_through_event"
  | "size_not_adapted_to_vol"
  | "weekend_gap_exposure";

export const MISTAKE_LABELS: Record<MistakeId, string> = {
  stop_too_tight:              "Stop trop serré",
  stop_in_liquidity:           "Stop dans liquidité",
  trade_against_htf:           "Trade contre HTF",
  trade_before_news:           "Trade avant news",
  buy_in_resistance:           "Achat dans résistance",
  sell_in_support:             "Vente dans support",
  bad_rr:                      "Ratio R/R mauvais",
  no_confirmation:             "Breakout sans confirmation",
  oversized_position:          "Exposition excessive",
  bad_spread:                  "Spread ignoré",
  volatility_ignored:          "Volatilité ignorée",
  fomo_after_pump:             "Entrée FOMO",
  revenge_trade:               "Revenge trade",
  range_middle:                "Trade sans biais directionnel",
  sweep_ignored:               "Liquidité ignorée",
  mitigation_misread:          "Mitigation mal lue",
  bad_timing:                  "Mauvais timing",
  ignored_zone:                "Zone HTF ignorée",
  risk_not_reduced_news:       "Risque non réduit avant news",
  position_held_through_event: "Position non gérée avant événement",
  size_not_adapted_to_vol:     "Taille non adaptée à la volatilité",
  weekend_gap_exposure:        "Exposition weekend non réduite",
};

export type MistakeCategory =
  | "technique"
  | "psychologique"
  | "execution"
  | "rr"
  | "timing"
  | "liquidite"
  | "discipline";

export interface DifficultyLessons {
  beginner:     string;
  intermediate: string;
  advanced:     string;
}

export interface MistakeTemplate {
  id:            string;
  title:         string;
  category:      MistakeCategory;
  chartShape:    ChartShape;
  direction:     TradeDirection;
  htfBias:       HtfBias;
  macroContext:  MacroContext;
  context:       string;        // ~1 phrase de contexte
  // Choix : correct + 3 leurres (chacun est un MistakeId du vocab partagé).
  correctMistake: MistakeId;
  decoyMistakes:  readonly [MistakeId, MistakeId, MistakeId];
  explanation:   string;        // pourquoi correctMistake est l'erreur principale
  lessons:       DifficultyLessons;
  difficulties:  readonly Difficulty[];
  // Affichage optionnel sur le chart
  showLines?:    "buy_entry" | "sell_entry" | "buy_with_bad_rr" | "sell_with_bad_rr" | "buy_with_tight_stop" | "sell_with_liquidity_stop" | null;
  // Info contextuelle bonus (levier, etc.)
  extraInfo?:    string;
  // Force certains paramètres environnement
  metaOverride?: { asset?: Asset; session?: Session; volatility?: Volatility; spread?: Spread };
}

export interface MistakeInstance extends MistakeTemplate {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
  seed:       number;
  difficulty: Difficulty;
  // Ordre des choix shufflé par instance (pour éviter de mémoriser "le bon est en position 2")
  shuffledChoices: MistakeId[];
}

export type ChartShape =
  | "uptrend_pullback"
  | "downtrend_pullback"
  | "approach_resistance"
  | "approach_support"
  | "range_oscillation"
  | "fast_rally"
  | "fast_dump"
  | "weak_breakout"
  | "calm_before_news"
  | "sweep_low_done"
  | "fvg_deep_pullback"
  | "high_vol_pullback";

export interface ScenarioChart {
  past:    Candle[];
  future:  Candle[];
  zones:   ChartZone[];
  domain:  { min: number; max: number };
  entry?:  number;
  stop?:   number;
  tp?:     number;
}

export const ROUNDS_PER_SESSION = 10;

const ASSETS:       readonly Asset[]      = ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"];
const SESSIONS:     readonly Session[]    = ["Londres", "New York", "Overlap", "Heures mortes"];

// ─── Templates (16) ───────────────────────────────────────────────────────────

export const MISTAKE_TEMPLATES: MistakeTemplate[] = [
  {
    id: "buy_in_resistance",
    title: "BUY juste sous résistance HTF",
    category: "technique",
    chartShape: "approach_resistance",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Tu prends ce BUY pile sous une résistance HTF testée plusieurs fois.",
    correctMistake: "buy_in_resistance",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "Ici, la résistance HTF testée plusieurs fois a tenu à chaque test. Un BUY juste en dessous place l'entrée au pire endroit : le TP est limité par la résistance immédiate, et le R/R devient très défavorable.",
    lessons: {
      beginner:     "Acheter sous une résistance qui rejette à chaque test est rarement une bonne idée. Attendre une cassure ou un retournement est souvent plus logique.",
      intermediate: "L'emplacement compte souvent plus que le pattern. Même un setup techniquement bon peut devenir mauvais si l'entrée se situe dans une zone hostile.",
      advanced:     "Une résistance HTF touchée 3 fois ou plus est souvent une résistance solide. Ici, l'avantage se trouve plutôt dans un SELL sur le retest que dans un BUY sur le pullback.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "sell_in_support",
    title: "SELL juste au-dessus support HTF",
    category: "technique",
    chartShape: "approach_support",
    direction: "SELL",
    htfBias: "range",
    macroContext: "normal",
    context: "Tu prends ce SELL pile au-dessus d'un support HTF testé plusieurs fois.",
    correctMistake: "sell_in_support",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "Ici, le support HTF a tenu à chaque test. Un SELL juste au-dessus place l'entrée au pire endroit : le TP est limité par le support immédiat, et le R/R devient très défavorable.",
    lessons: {
      beginner:     "Vendre au-dessus d'un support qui rebondit est rarement une bonne idée. Attendre la cassure du support, ou un rebond sur résistance, est souvent plus logique.",
      intermediate: "L'emplacement compte souvent plus que le pattern. Vendre sur un support HTF revient ici à se placer contre l'avantage.",
      advanced:     "Un support HTF avec 3 rebonds ou plus est souvent un support solide. Ici, l'avantage se trouve plutôt dans un BUY sur le rebond que dans un SELL.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "sell_entry",
  },
  {
    id: "trade_against_htf",
    title: "BUY dans un downtrend HTF",
    category: "technique",
    chartShape: "downtrend_pullback",
    direction: "BUY",
    htfBias: "bearish",
    macroContext: "normal",
    context: "HTF clairement baissier. Tu prends ce BUY sur un rebond local.",
    correctMistake: "trade_against_htf",
    decoyMistakes: ["bad_timing", "no_confirmation", "fomo_after_pump"],
    explanation: "Dans une tendance baissière, les rebonds offrent plutôt des opportunités de SELL que de BUY. Prendre des achats contre le HTF réussit souvent moins d'une fois sur deux : l'avantage est inversé.",
    lessons: {
      beginner:     "Avec un HTF baissier, on cherche plutôt les SELL, pas les BUY.",
      intermediate: "Un setup local n'efface pas la tendance HTF. Si le HTF va contre toi, il vaut souvent mieux s'abstenir.",
      advanced:     "Trader contre le HTF revient souvent à jouer une probabilité défavorable. Un setup local compense rarement cet écart statistique.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "trade_before_news",
    title: "Trade ouvert juste avant news",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "range",
    macroContext: "dangereux",
    context: "News macro majeure (NFP) dans 18 minutes. Tu ouvres ce BUY maintenant.",
    correctMistake: "trade_before_news",
    decoyMistakes: ["bad_timing", "volatility_ignored", "no_confirmation"],
    explanation: "Trader 30 min avant une news majeure expose à un spread 3 à 5 fois plus large que d'habitude, à un slippage important et à un stop qui peut sauter à cause du bid-ask. Ici, la technique du setup pèse peu face à la volatilité d'exécution.",
    lessons: {
      beginner:     "Repère prudent : éviter de trader dans les 30 min avant et les 15 min après une news majeure. Beaucoup de traders en font une règle de leur plan.",
      intermediate: "Le spread peut tripler et ton SL peut sauter à cause du bid-ask. Les statistiques du setup s'appliquent mal à un marché illiquide.",
      advanced:     "Même avec un avis tranché sur la news, l'exécution joue contre toi. Une option logique : diviser la taille par 3 et doubler le stop, ou NO TRADE.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "stop_too_tight",
    title: "Stop juste au-dessus du swing low",
    category: "technique",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu prends ce BUY au pullback avec stop juste au-dessus du swing low.",
    correctMistake: "stop_too_tight",
    decoyMistakes: ["bad_rr", "trade_against_htf", "fomo_after_pump"],
    explanation: "Le swing low est très souvent retesté avant la continuation. Ici, un stop au-dessus du low risque d'être balayé par le bruit normal du retest. Le trade tiendrait mieux avec un stop sous le swing low.",
    lessons: {
      beginner:     "Un stop se place plutôt DERRIÈRE l'invalidation, avec une marge : le placer dedans ou au-dessus l'expose au bruit.",
      intermediate: "Le low est souvent retesté pendant un pullback, avant la continuation. Une marge anti-bruit derrière le low est donc une option logique.",
      advanced:     "Sans marge derrière la structure, à la mesure de la volatilité du jour (ATR, l'amplitude moyenne d'une journée), ton stop peut attirer la liquidité. Ces niveaux sont souvent visés avant la vraie direction.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_with_tight_stop",
  },
  {
    id: "range_middle",
    title: "Trade au milieu d'un range",
    category: "discipline",
    chartShape: "range_oscillation",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Le prix oscille dans un range. Tu prends ce BUY au milieu.",
    correctMistake: "range_middle",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "Ici, au milieu du range, pas de zone testée, pas de signal, pas de catalyseur. Le R/R est mauvais (TP plus petit que le risque). Un range se trade plutôt à ses bornes ou à la cassure.",
    lessons: {
      beginner:     "Sans signal, le trade manque de raison d'être. Si tu ne peux pas l'expliquer en une phrase, NO TRADE est souvent l'option logique.",
      intermediate: "Le milieu d'un range revient souvent à risquer 1 pour gagner environ 0,3 (un R/R d'environ 1:0,3). Sur la durée, ce calcul joue contre toi.",
      advanced:     "La discipline compte plus que l'activité. Forcer un trade au milieu du range profite souvent aux autres participants, pas à toi.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "stop_in_liquidity",
    title: "Stop juste au-dessus du swing high",
    category: "liquidite",
    chartShape: "downtrend_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tu prends ce SELL au rebond avec stop juste au-dessus du swing high.",
    correctMistake: "stop_in_liquidity",
    decoyMistakes: ["stop_too_tight", "bad_rr", "no_confirmation"],
    explanation: "Le swing high est une cible évidente : c'est souvent là que se trouve la liquidité des vendeurs piégés. Ici, un stop placé pile dessus risque d'attirer un sweep. Une marge au-dessus est une option logique.",
    lessons: {
      intermediate: "Les swing highs et lows sont souvent des zones de chasse à la liquidité. Coller ton stop dessus augmente le risque d'être sorti.",
      advanced:     "Ces niveaux sont souvent visés pour récupérer de la liquidité. Un stop logique se place plutôt au-delà de la zone de liquidité, pas dedans.",
      beginner:     "Évite de placer ton stop pile sur un swing évident. Derrière la zone, avec une marge, il tient souvent mieux.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "sell_with_liquidity_stop",
  },
  {
    id: "bad_rr",
    title: "Setup valide, TP trop proche",
    category: "rr",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Setup techniquement valide. Stop large, TP très proche.",
    correctMistake: "bad_rr",
    decoyMistakes: ["stop_too_tight", "trade_against_htf", "fomo_after_pump"],
    explanation: "Avec un R/R inférieur à 1, même 60 % de trades gagnants peuvent laisser une espérance négative. Un setup valide avec un mauvais R/R reste ici un trade discutable.",
    lessons: {
      intermediate: "L'espérance d'un setup se calcule ainsi : (proba de gain × gain) - (proba de perte × risque). Avec un R/R sous 1, il faut plus de 50 % de réussite pour atteindre l'équilibre, et 67 % pour un R/R de 0,5.",
      advanced:     "Beaucoup de traders visent un R/R d'au moins 1:2 : cela laisse de la marge pour les frais et les séries de pertes. Avec un R/R plus faible, il faut un taux de réussite plus élevé pour rester gagnant.",
      beginner:     "Si tu risques 100 € pour gagner 50 €, tu risques de perdre à long terme, même en gagnant souvent.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "buy_with_bad_rr",
  },
  {
    id: "weak_breakout",
    title: "BUY sur cassure faible",
    category: "technique",
    chartShape: "weak_breakout",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Tu prends ce BUY sur la cassure de résistance. La bougie impulsive est minuscule.",
    correctMistake: "no_confirmation",
    decoyMistakes: ["buy_in_resistance", "bad_rr", "fomo_after_pump"],
    explanation: "Une cassure sans bougie de momentum (petit corps, juste au-dessus de la résistance) continue nettement moins souvent. Elle sert souvent d'appât à liquidité.",
    lessons: {
      intermediate: "Une cassure faible peut être un piège. Une option logique : attendre une continuation claire ou un retest qui tient.",
      advanced:     "Les breakouts faibles servent souvent à aspirer les stops placés au-dessus de la résistance, avant une reprise dans le sens du HTF.",
      beginner:     "Un vrai breakout s'accompagne souvent d'une bougie impulsive visible. Sinon, attendre se défend.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "oversized_position",
    title: "Position trop grosse pour le compte",
    category: "execution",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu prends ce BUY sur XAU/USD. Capital du compte : 500 €. Taille de position choisie : un lot qui fait perdre 250 € si le SL est touché. Le setup technique est correct.",
    correctMistake: "oversized_position",
    decoyMistakes: ["stop_too_tight", "volatility_ignored", "bad_rr"],
    explanation: "Risquer 50 % du capital sur un seul trade est extrêmement dangereux. Une seule perte coupe le compte en deux, et pour revenir à 500 €, il faudrait ensuite gagner 100 % sur le capital restant.",
    lessons: {
      advanced:     "Repère courant chez les pros : 0,5 à 2 % du capital par trade selon la taille du compte. Au-delà de 5 %, on s'éloigne du trading pour se rapprocher du pari.",
      intermediate: "La taille de position est une variable clé du money management. Un setup correct avec un lot trop gros peut suffire à vider un compte. Le repère souvent cité est de 1 à 2 % du capital, même sur un petit compte.",
      beginner:     "Repère souvent cité : 1 à 2 % du capital par trade, quelle que soit la taille du compte (soit 5 à 10 € sur 500 €). Le levier de ton broker compte peu ; ce qui compte, c'est combien tu perds en euros si ton SL est touché.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Risque par trade : 50 % du capital",
    showLines: "buy_entry",
  },
  {
    id: "bad_spread",
    title: "Trade en session morte, spread 4 fois plus large",
    category: "execution",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu prends ce BUY à 3h du matin (heures mortes). Spread quadruplé.",
    correctMistake: "bad_spread",
    decoyMistakes: ["bad_timing", "volatility_ignored", "trade_against_htf"],
    explanation: "Avec un spread 4 fois plus large que d'habitude et une session illiquide, le R/R réel peut être divisé par deux même si le setup fonctionne. Ici, le stop peut sauter à cause du bid-ask, et le TP devient difficile à atteindre.",
    lessons: {
      advanced:     "Beaucoup de traders pros intègrent l'exécution dans leur edge. Avec un spread au moins 3 fois plus large que d'habitude et un volume faible, NO TRADE est souvent l'option logique.",
      intermediate: "Le R/R sur le papier peut différer du R/R réel : ici, le spread grignote ton avantage.",
      beginner:     "Vérifie la session et le spread avant de cliquer. En heures mortes, NO TRADE est souvent l'option logique.",
    },
    difficulties: ["advanced"],
    extraInfo: "Spread ×4",
    metaOverride: { session: "Heures mortes", spread: "élevé" },
    showLines: "buy_entry",
  },
  {
    id: "volatility_ignored",
    title: "Stop standard en vol explosive",
    category: "execution",
    chartShape: "high_vol_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Volatilité explosive sur BTC. Tu prends ce BUY avec un stop de taille standard.",
    correctMistake: "volatility_ignored",
    decoyMistakes: ["stop_too_tight", "bad_rr", "oversized_position"],
    explanation: "En volatilité élevée, le bruit normal peut être 2 à 3 fois plus large. Ici, un stop « normal » se retrouve dans ce bruit amplifié et risque d'être balayé avant que le trade aboutisse.",
    lessons: {
      advanced:     "Le stop gagne à s'adapter à la volatilité du moment (ATR, l'amplitude moyenne d'une journée) plutôt qu'à une distance fixe. En volatilité élevée, élargir le stop ET le TP proportionnellement est une option logique.",
      intermediate: "Si la volatilité double, un stop deux fois plus large est souvent nécessaire. Sinon, ton stop peut devenir un piège.",
      beginner:     "Plus le marché bouge fort, plus ton stop a besoin d'espace.",
    },
    difficulties: ["intermediate", "advanced"],
    metaOverride: { volatility: "élevée" },
    showLines: "buy_with_tight_stop",
  },
  {
    id: "fomo_after_pump",
    title: "BUY après une hausse de 5 % en 3 bougies",
    category: "psychologique",
    chartShape: "fast_rally",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de monter de 5 % en 3 bougies. Tu achètes (BUY) maintenant pour ne pas rater le mouvement.",
    correctMistake: "fomo_after_pump",
    decoyMistakes: ["bad_rr", "trade_against_htf", "no_confirmation"],
    explanation: "Acheter le sommet d'une hausse aussi rapide, c'est souvent entrer là où d'autres prennent leurs profits. Ici, le R/R est mauvais (TP lointain, stop court) et un retracement est probable à court terme.",
    lessons: {
      intermediate: "Les hausses verticales retracent souvent une bonne partie du mouvement (38 à 61 %). Un BUY au sommet peut vite se retrouver en perte.",
      advanced:     "Le FOMO peut signaler un excès. Ici, l'avantage consiste plutôt à ATTENDRE le retracement qu'à courir après le prix.",
      beginner:     "Si tu prends un trade par peur de « rater », c'est souvent le moment de NE PAS le prendre.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "revenge_trade",
    title: "Re-entrée immédiate après 2 stops",
    category: "psychologique",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu viens de prendre 2 stops d'affilée. Tu ré-entres immédiatement sur ce setup.",
    correctMistake: "revenge_trade",
    decoyMistakes: ["fomo_after_pump", "bad_timing", "stop_too_tight"],
    explanation: "Le setup peut être valide, mais ici ta décision semble guidée par l'envie de récupérer tes pertes plutôt que par l'analyse. C'est l'un des pièges émotionnels les plus fréquents.",
    lessons: {
      intermediate: "Après 2 stops, une pause (15-30 min) est une option logique. Sous le coup des pertes, les décisions ont tendance à être biaisées.",
      advanced:     "Les trades de revanche réussissent souvent moins bien que la moyenne du même trader. Une pause aide à retrouver de l'objectivité.",
      beginner:     "Si tu trades pour « récupérer », tu risques de parier plutôt que de trader.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "2 stops récents",
    showLines: "buy_entry",
  },
  {
    id: "sweep_ignored",
    title: "SELL juste avant un sweep low",
    category: "liquidite",
    chartShape: "sweep_low_done",
    direction: "SELL",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de balayer la liquidité sous le plus bas précédent avec une grosse mèche. Tu SELL maintenant.",
    correctMistake: "sweep_ignored",
    decoyMistakes: ["trade_against_htf", "bad_rr", "stop_too_tight"],
    explanation: "Ici, le sweep vient d'avoir lieu et peut signaler un retournement haussier. Un SELL revient à vendre le creux que les acheteurs viennent d'utiliser pour entrer : la lecture semble inversée.",
    lessons: {
      advanced:     "Pattern ICT classique : le sweep prend la liquidité avant la continuation HTF. Ici, un BUY sur le retournement se défend mieux qu'un SELL.",
      intermediate: "Une grosse mèche qui balaie un niveau puis revient peut signaler un retournement probable. Ici, vendre revient à lire le graphique à l'envers.",
      beginner:     "Évite de vendre un creux qui vient d'être « mangé » par une mèche. Chercher le rebond est souvent plus logique.",
    },
    difficulties: ["advanced"],
    showLines: "sell_entry",
  },
  {
    id: "mitigation_misread",
    title: "BUY sur un FVG mitigé à 85 %",
    category: "liquidite",
    chartShape: "fvg_deep_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu BUY sur ce FVG haussier. Le pullback a mitigé plus de 85 % de la zone sans réaction visible.",
    correctMistake: "mitigation_misread",
    decoyMistakes: ["bad_rr", "stop_too_tight", "trade_against_htf"],
    explanation: "Ici, une mitigation profonde sans réaction peut signaler un FVG épuisé : les acheteurs ne semblent plus défendre la zone. Un BUY reviendrait à espérer plutôt qu'à suivre un signal.",
    lessons: {
      advanced:     "Un FVG mitigé à plus de 75 % sans réaction visible perd souvent son avantage. Deux options logiques : attendre une cassure pour un SELL, ou NO TRADE.",
      intermediate: "Une zone testée en profondeur perd souvent de sa force. Les 1er et 2e tests offrent en général plus d'avantage qu'un test profond.",
      beginner:     "Si une zone tarde à réagir, elle perd souvent de sa force. Dans ce cas, mieux vaut attendre la suivante.",
    },
    difficulties: ["advanced"],
    showLines: "buy_entry",
  },
  {
    id: "risk_not_reduced_news",
    title: "Lot habituel avant news majeure",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "14h20. NFP dans 10 minutes. Tu entres en BUY sur EUR/USD avec ta taille de lot habituelle. Le setup technique est correct.",
    correctMistake: "risk_not_reduced_news",
    decoyMistakes: ["stop_too_tight", "oversized_position", "bad_rr"],
    explanation: "Sur une news majeure (NFP, FOMC, CPI), le spread peut s'élargir x5 à x10, et un mouvement instantané peut sauter le SL. Une pratique courante : diviser la taille de lot par 2 ou 3 dans les 30 minutes autour d'une news rouge, ou ne pas trader.",
    lessons: {
      advanced:     "Beaucoup d'acteurs réduisent leur exposition avant les news pour cette raison : la price action peut devenir binaire et imprévisible. Garder une taille normale revient alors à parier sur le hasard.",
      intermediate: "Une news majeure peut faire bouger une paire de plusieurs dizaines de pips en quelques secondes. Ton SL devient théorique si le slippage te fait sortir plusieurs pips plus loin. Réduire la taille protège ton compte.",
      beginner:     "Avant un NFP, un FOMC ou un CPI, une option logique : diviser ton lot par 2 ou 3, ou attendre que la news passe. Le marché peut s'agiter, et tes stops risquent de ne pas tenir comme d'habitude.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "NFP à 14h30 · lot 1,00",
    showLines: "buy_entry",
  },
  {
    id: "position_held_through_event",
    title: "Position laissée ouverte pendant FOMC",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Tu as un BUY ouvert sur XAU/USD depuis 19h55. FOMC dans 5 minutes (annonce + conférence Powell pendant 1h). Tu décides de laisser courir avec ton lot et ton SL habituels.",
    correctMistake: "position_held_through_event",
    decoyMistakes: ["stop_too_tight", "oversized_position", "trade_before_news"],
    explanation: "Sur un FOMC suivi de la conférence de Powell, l'or (XAU/USD) peut bouger de 50 à 100 $ en quelques minutes. Ton SL standard risque d'être traversé avec du slippage. Couper la position, réduire le lot ou élargir fortement le SL sont trois options logiques.",
    lessons: {
      advanced:     "Les gestionnaires de risque réduisent souvent l'exposition avant un événement capable de faire bouger les prix. Pendant Powell, même un bon setup peut être balayé par une phrase mal interprétée.",
      intermediate: "Une position laissée ouverte pendant un événement macro devient un pari binaire. Face à un titre fort, le setup technique pèse peu. Sortir, ou accepter consciemment ce risque : c'est à toi de trancher selon ton plan.",
      beginner:     "Avant un FOMC ou une conférence de banque centrale, fermer ta position ou la réduire fortement sont deux options logiques. Le marché peut bouger bien plus que tes calculs techniques ne le prévoient.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "FOMC à 20h00 · BUY ouvert depuis 19h55",
    showLines: "buy_entry",
  },
  {
    id: "size_not_adapted_to_vol",
    title: "Lot habituel en volatilité doublée",
    category: "execution",
    chartShape: "high_vol_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "En ce moment, l'or (XAU/USD) bouge en moyenne de 80 $ par jour (ATR, l'amplitude moyenne d'une journée), contre 35 $ d'habitude : la volatilité est multipliée par 2,3. Tu prends ce SELL avec ta taille de lot habituelle (1,00) et ton stop loss standard de 30 $.",
    correctMistake: "size_not_adapted_to_vol",
    decoyMistakes: ["stop_too_tight", "oversized_position", "bad_rr"],
    explanation: "Quand la volatilité double, ton risque effectif double aussi si la taille de lot reste la même. Un stop loss de 30 $ qui tenait quand l'or bougeait de 35 $ par jour peut sauter facilement quand il bouge de 80 $ (ATR). Adapter la taille à la volatilité est un principe de base du risk management.",
    lessons: {
      advanced:     "La taille de position peut se calculer sur la volatilité (ATR) : taille ≈ (capital × risque %) / (ATR × multiplicateur du stop loss). Quand l'ATR double, diviser la taille par 2 permet de conserver le même risque.",
      intermediate: "Beaucoup de traders ajustent leur lot à la volatilité du jour. Quand le marché bouge deux fois plus que d'habitude (ATR), diviser le lot par 2 ou doubler le stop loss sont deux options. Sinon, le risque réel peut échapper à ton contrôle.",
      beginner:     "Quand le marché bouge plus que d'habitude, réduire ta taille de lot est une option logique. Sinon, ton stop risque de sauter trop facilement. L'idée : une taille adaptée à la volatilité, pas au ressenti.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Volatilité ×2,3",
    showLines: "sell_entry",
  },
  {
    id: "weekend_gap_exposure",
    title: "Position forex ouverte avant le weekend",
    category: "timing",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Vendredi 22h45, fermeture du forex dans 15 minutes. Tu ouvres un BUY sur EUR/USD avec ta taille de lot habituelle. Le setup est valide.",
    correctMistake: "weekend_gap_exposure",
    decoyMistakes: ["stop_too_tight", "oversized_position", "trade_before_news"],
    explanation: "Le weekend, le marché des devises (forex) est fermé, mais l'actualité continue. Une news géopolitique majeure (déclaration de banque centrale, conflit, élection) peut créer un gap à l'ouverture du dimanche et sauter ton SL de plusieurs dizaines de pips, parfois bien plus. Le slippage du weekend échappe à ton contrôle.",
    lessons: {
      advanced:     "Certains fonds réduisent leurs positions directionnelles sur le forex avant la clôture du vendredi, ou se couvrent via des options. Garder une exposition non couverte sur le weekend revient à parier sur l'actualité géopolitique.",
      intermediate: "Avant un weekend, deux options logiques : sortir de tes positions, ou réduire fortement la taille. Le gap d'ouverture du dimanche peut être brutal, et ton SL ne te protège pas pendant la fermeture.",
      beginner:     "Le vendredi soir, fermer tes positions ou réduire leur taille est une option logique. Pendant le weekend, le marché est fermé mais le monde bouge. Lundi matin, le prix peut sauter directement de l'autre côté de ton stop.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Vendredi 22h45 · clôture forex à 23h00",
    showLines: "buy_entry",
  },
];

// ─── Génération scénarios ─────────────────────────────────────────────────────

export function generateMistakeScenarios(seed: number, difficulty: Difficulty): MistakeInstance[] {
  const rng = mulberry32(seed);
  const pool = MISTAKE_TEMPLATES.filter((t) => t.difficulties.includes(difficulty));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const out: MistakeInstance[] = [];
  let lastId: string | null = null;
  for (let i = 0; i < ROUNDS_PER_SESSION; i++) {
    let cand = shuffled[i % shuffled.length];
    if (cand.id === lastId && shuffled.length > 1) {
      cand = shuffled[(i + 1) % shuffled.length];
    }
    const ov = cand.metaOverride ?? {};
    // Shuffle des choix
    const allChoices: MistakeId[] = [cand.correctMistake, ...cand.decoyMistakes];
    for (let k = allChoices.length - 1; k > 0; k--) {
      const j = Math.floor(rng() * (k + 1));
      [allChoices[k], allChoices[j]] = [allChoices[j], allChoices[k]];
    }
    out.push({
      ...cand,
      // Contexte cohérent : session, actif tradé dans la session, volatilité et spread de la session
      ...pickMarketContext(rng, { assets: ASSETS, sessions: SESSIONS }, contextRule("ftm", cand.id, {
        ...ov,
        ...(cand.macroContext === "dangereux" ? { volatility: ov.volatility ?? "élevée", spread: ov.spread ?? "élevé" } : {}),
      })),
      seed:       (seed + i * 9973) >>> 0,
      difficulty,
      shuffledChoices: allChoices,
    });
    lastId = cand.id;
  }
  return out;
}

// ─── Chart generators ────────────────────────────────────────────────────────

function finishChart(past: Candle[], future: Candle[], zones: ChartZone[], extras: number[]): ScenarioChart {
  const all = [...past, ...future];
  const vals: number[] = [...extras];
  for (const k of all) { vals.push(k.h, k.l); }
  for (const z of zones) { vals.push(z.y1, z.y2); }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;
  return { past, future, zones, domain: { min: min - pad, max: max + pad } };
}

// 1. Uptrend + pullback (BUY-context)
function shUptrendPullback(rng: () => number, m: number): { chart: ScenarioChart; swingLow: number; swingHigh: number; entry: number } {
  const past: Candle[] = [];
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  const swingHigh = Math.max(...past.map((k) => k.h));
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.25 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const swingLow = Math.min(...past.slice(-5).map((k) => k.l));
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "support", y1: swingLow - 0.04, y2: swingLow + 0.04, label: "Swing low" },
  ], [entry]), swingLow, swingHigh, entry };
}

// 2. Downtrend + pullback (SELL-context)
function shDowntrendPullback(rng: () => number, m: number): { chart: ScenarioChart; swingHigh: number; swingLow: number; entry: number } {
  const past: Candle[] = [];
  let p = 10 - rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  const swingLow = Math.min(...past.map((k) => k.l));
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const swingHigh = Math.max(...past.slice(-5).map((k) => k.h));
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "resistance", y1: swingHigh - 0.04, y2: swingHigh + 0.04, label: "Swing high" },
  ], [entry]), swingHigh, swingLow, entry };
}

// 3. Approach to resistance (BUY into R = mistake)
function shApproachResistance(rng: () => number, m: number): { chart: ScenarioChart; R: number; entry: number } {
  const past: Candle[] = [];
  const R = 10;
  let p = 5 + rng() * 0.4;
  // 4 candles up
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.4) * m, 4, R - 1);
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // 4 candles testant R avec wicks (rejets passés)
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.5 * m, R - 1.2, R - 0.4);
    const k = candle(o, c, (0.6 + rng() * 0.3) * m, (0.2 + rng() * 0.2) * m);
    k.h = Math.max(k.h, R - 0.05); // « testée plusieurs fois » : la mèche entre dans la zone
    past.push(k);
    p = c;
  }
  // 2 dernières candles : prix re-approche R
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = clamp(o + (0.2 + rng() * 0.3) * m, R - 1.2, R - 0.3);
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.13 + rng() * 0.13) * m));
    p = c;
  }
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance HTF" },
  ], [entry]), R, entry };
}

// 4. Approach to support (SELL into S = mistake)
function shApproachSupport(rng: () => number, m: number): { chart: ScenarioChart; S: number; entry: number } {
  const past: Candle[] = [];
  const S = 1;
  let p = 6 - rng() * 0.4;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.4) * m, S + 1, 7);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.5 * m, S + 0.4, S + 1.2);
    const k = candle(o, c, (0.2 + rng() * 0.2) * m, (0.6 + rng() * 0.3) * m);
    k.l = Math.min(k.l, S + 0.05); // « testé plusieurs fois » : la mèche entre dans la zone
    past.push(k);
    p = c;
  }
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = clamp(o - (0.2 + rng() * 0.3) * m, S + 0.3, S + 1.2);
    past.push(candle(o, c, (0.13 + rng() * 0.13) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support HTF" },
  ], [entry]), S, entry };
}

// 5. Range with prices in middle
function shRangeOscillation(rng: () => number, m: number): { chart: ScenarioChart; entry: number } {
  const past: Candle[] = [];
  const S = 2;
  const R = 6;
  const mid = (S + R) / 2;
  let p = mid + (rng() - 0.5);
  for (let i = 0; i < 14; i++) {
    const o = p;
    const drift = (mid - o) * 0.25 + (rng() - 0.5) * 1.4 * m;
    // « Tu prends ce BUY au milieu » : la dernière bougie finit dans le tiers central
    let c = i === 13 ? mid + (drift - (mid - o) * 0.25) * 0.25 : o + drift;
    c = clamp(c, S + 0.4, R - 0.4);
    const k = candle(o, c, (0.2 + rng() * 0.22) * m, (0.2 + rng() * 0.22) * m);
    // Le prix « oscille dans un range » : les mèches restent dans ses bornes
    k.h = Math.min(k.h, R + 0.1);
    k.l = Math.max(k.l, S - 0.1);
    past.push(k);
    p = c;
  }
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Haut du range" },
    { kind: "support",    y1: S - 0.15, y2: S + 0.15, label: "Bas du range" },
  ], [entry]), entry };
}

// 6. Fast rally (FOMO setup)
function shFastRally(rng: () => number, m: number): { chart: ScenarioChart; entry: number } {
  const past: Candle[] = [];
  let p = 2 + rng() * 0.4;
  // 8 candles base lente
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (rng() - 0.3) * 0.4 * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  // 6 candles pump vertical
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.8 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.3 + rng() * 0.2) * m, 0.08));
    p = c;
  }
  const entry = p;  // entry au top du pump
  return { chart: finishChart(past, [], [], [entry]), entry };
}

// 7. Weak breakout
function shWeakBreakout(rng: () => number, m: number): { chart: ScenarioChart; R: number; entry: number } {
  const past: Candle[] = [];
  const R = 10;
  let p = 6 + rng() * 0.3;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, 5, R - 0.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    // La dernière bougie de consolidation clôt juste sous la résistance : la
    // cassure qui suit peut ainsi n'avoir qu'un corps minuscule (continuité).
    const c = i === 3
      ? R - 0.02 - rng() * 0.08
      : clamp(o + (rng() - 0.5) * 0.6 * m, R - 1.1, R - 0.3);
    past.push(candle(o, c, (0.22 + rng() * 0.18) * m, (0.22 + rng() * 0.18) * m));
    p = c;
  }
  // « La bougie impulsive est minuscule » : clôture juste au-dessus de la zone,
  // corps minuscule, mèches qui dominent la bougie
  const bC = R + 0.14 + rng() * 0.16;
  const bBody = bC - p;
  past.push(candle(p, bC, Math.max((0.3 + rng() * 0.2) * m, 1.6 * bBody), Math.max(0.18, 0.3 * bBody)));
  p = past[past.length - 1].c;
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance" },
  ], [entry]), R, entry };
}

// 8. Calm before news
function shCalmBeforeNews(rng: () => number, m: number): { chart: ScenarioChart; entry: number } {
  const past: Candle[] = [];
  let p = 4 + rng() * 0.4;
  for (let i = 0; i < 14; i++) {
    const tight = 1 - i / 28;
    const o = p;
    const c = o + (rng() - 0.5) * 0.7 * tight * m;
    past.push(candle(o, c, (0.18 + rng() * 0.18) * tight * m, (0.18 + rng() * 0.18) * tight * m));
    p = c;
  }
  const entry = p;
  return { chart: finishChart(past, [], [], [entry]), entry };
}

// 9. Sweep low just happened (BUY context, SELL = mistake)
function shSweepLowDone(rng: () => number, m: number): { chart: ScenarioChart; entry: number; sweepLow: number; L: number } {
  const past: Candle[] = [];
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
    const c = clamp(o + (rng() - 0.5) * 0.5 * m, L + 0.5, L + 1.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  // Sweep candle : longue mèche basse, close au-dessus
  const sweepLow = L - 1.3 * m - rng() * 0.3;
  past.push({ o: p, c: L + 0.4 + rng() * 0.3, h: p + 0.2, l: sweepLow });
  p = past[past.length - 1].c;
  // 1 confirmation
  past.push(candle(p, p + (0.3 + rng() * 0.3) * m, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
  p = past[past.length - 1].c;
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "support",       y1: L - 0.1,    y2: L + 0.1,    label: "Plus bas précédent"     },
    { kind: "liquidity_low", y1: sweepLow,   y2: L - 0.15,   label: "Liquidité balayée" },
  ], [entry]), entry, sweepLow, L };
}

// 10. FVG deep pullback
function shFvgDeepPullback(rng: () => number, m: number): { chart: ScenarioChart; entry: number; fvgLow: number; fvgHigh: number } {
  const past: Candle[] = [];
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
  // Deep pullback (85%+ mitigation)
  const target = fvgLow + (fvgHigh - fvgLow) * 0.12;
  for (let i = 0; i < 5; i++) {
    const o = p;
    // La dernière bougie du pullback finit au fond de la zone (pas de réaction)
    const c = i === 4 ? target : Math.max(target, o - (0.32 + rng() * 0.28) * m);
    const k = candle(o, c, (0.12 + rng() * 0.1) * m, (0.18 + rng() * 0.18) * m);
    // « Mitigé 85 %+ » sans casser le FVG : la mèche descend au fond de la zone
    if (i === 4) k.l = fvgLow + (fvgHigh - fvgLow) * 0.06;
    else k.l = Math.max(k.l, fvgLow + (fvgHigh - fvgLow) * 0.02);
    past.push(k);
    p = c;
  }
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "fvg", y1: fvgLow, y2: fvgHigh, label: "FVG haussier" },
  ], [entry]), entry, fvgLow, fvgHigh };
}

// 11. High vol pullback
function shHighVolPullback(rng: () => number, m: number): { chart: ScenarioChart; entry: number; swingLow: number } {
  const past: Candle[] = [];
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
  return { chart: finishChart(past, [], [], [entry]), entry, swingLow };
}

// ─── Build scenario chart (entry + dispatch) ─────────────────────────────────

/**
 * Graphique converti à l'échelle de prix de l'actif (au dernier moment, pour
 * l'affichage). « Pomper 5 % en 3 bougies » : l'échelle est calée pour que la
 * hausse des 3 dernières bougies vaille 5 %.
 */
export function withAssetPrices(chart: ScenarioChart, inst: { id: string; asset: Asset; seed: number }): ScenarioChart {
  const past = chart.past;
  let f = assetPriceMap(inst.asset, inst.seed, past[past.length - 1].c);
  if (inst.id === "fomo_after_pump" && past.length >= 4) {
    const from = past[past.length - 4].c, to = past[past.length - 1].c;
    const base = anchorPrice(inst.asset, inst.seed);
    f = linearPriceMap(from, base, (0.05 * base) / (to - from));
  }
  const g = (p: number | undefined) => (p === undefined ? undefined : f(p));
  return {
    ...chart,
    past:   past.map(mapCandle(f)),
    future: chart.future.map(mapCandle(f)),
    zones:  chart.zones.map(mapZone(f)),
    domain: mapDomain(f, chart.domain),
    entry:  g(chart.entry),
    stop:   g(chart.stop),
    tp:     g(chart.tp),
  };
}

/** Graphique du scénario, avec la passe de réalisme des bougies (niveaux clés : zones, entrée, stop, TP). */
export function buildScenarioChart(template: MistakeTemplate, seed: number, vol: Volatility, ctx: MarketCtx = {}): ScenarioChart {
  const ch = buildScenarioChartRaw(template, seed, vol);
  const zones = ch.zones.flatMap((z) => [z.y1, z.y2]);
  const lines = [ch.entry, ch.stop, ch.tp].filter((p): p is number => p !== undefined);
  const calm = template.chartShape === "calm_before_news";
  return realizeChart(ch, { past: zones, future: [...zones, ...lines] }, seed, { ...ctx, volatility: vol, calmPast: calm, preNews: calm });
}

/** Graphique brut du scénario, avant la passe de réalisme (audits). */
export function buildScenarioChartRaw(template: MistakeTemplate, seed: number, vol: Volatility): ScenarioChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[vol];
  switch (template.chartShape) {
    case "uptrend_pullback": {
      const r = shUptrendPullback(rng, m);
      const ch = r.chart;
      if (template.showLines === "buy_with_tight_stop") {
        ch.entry = r.entry;
        ch.stop = r.swingLow + Math.max(0.05 * m, 0.06);  // pile au-dessus du swing low (et de sa zone) = tight
        ch.tp = r.entry + (r.entry - ch.stop) * 2.2;
      } else if (template.showLines === "buy_with_bad_rr") {
        ch.entry = r.entry;
        ch.stop = r.swingLow - 0.5 * m;  // stop logique
        ch.tp = r.entry + (r.entry - ch.stop) * 0.6;  // TP très proche = bad R/R
      } else if (template.showLines === "buy_entry") {
        ch.entry = r.entry;
      }
      return ch;
    }
    case "downtrend_pullback": {
      const r = shDowntrendPullback(rng, m);
      const ch = r.chart;
      if (template.showLines === "sell_with_liquidity_stop") {
        ch.entry = r.entry;
        ch.stop = r.swingHigh + Math.max(0.05 * m, 0.06);  // pile au-dessus du swing high (liquidité)
        ch.tp = r.entry - (ch.stop - r.entry) * 2.2;
      } else if (template.showLines === "sell_with_bad_rr") {
        ch.entry = r.entry;
        ch.stop = r.swingHigh + 0.5 * m;
        ch.tp = r.entry - (ch.stop - r.entry) * 0.6;
      } else if (template.showLines === "sell_entry" || template.showLines === "buy_entry") {
        ch.entry = r.entry;
      }
      return ch;
    }
    case "approach_resistance": {
      const r = shApproachResistance(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "approach_support": {
      const r = shApproachSupport(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "range_oscillation": {
      const r = shRangeOscillation(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "fast_rally": {
      const r = shFastRally(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "fast_dump": {
      // Reuse downtrend with extended drop
      const r = shDowntrendPullback(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "weak_breakout": {
      const r = shWeakBreakout(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "calm_before_news": {
      const r = shCalmBeforeNews(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "sweep_low_done": {
      const r = shSweepLowDone(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "fvg_deep_pullback": {
      const r = shFvgDeepPullback(rng, m);
      const ch = r.chart;
      if (template.showLines) ch.entry = r.entry;
      return ch;
    }
    case "high_vol_pullback": {
      const r = shHighVolPullback(rng, m);
      const ch = r.chart;
      if (template.showLines === "buy_with_tight_stop") {
        ch.entry = r.entry;
        ch.stop = r.swingLow + 0.1 * m;  // "normal stop" qui est trop serré en vol élevée
        ch.tp = r.entry + 3 * m * 1.6;
      } else if (template.showLines) {
        ch.entry = r.entry;
      }
      return ch;
    }
  }
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export interface MistakeScoreResult {
  correct:     boolean;
  points:      number;
  streakBonus: number;
}

// Barème simple (décision PO) : bonne réponse +10, mauvaise 0, sans bonus ni malus.
export const POINTS_PER_CORRECT = 10;

export function scoreMistakeChoice(picked: MistakeId, correct: MistakeId, currentStreak: number): MistakeScoreResult {
  void currentStreak;
  const ok = picked === correct;
  return { correct: ok, points: ok ? POINTS_PER_CORRECT : 0, streakBonus: 0 };
}

// ─── Verdicts ────────────────────────────────────────────────────────────────

export const CATEGORY_META: Record<MistakeCategory, { label: string; dotClass: string; textClass: string }> = {
  technique:     { label: "Erreur technique",      dotClass: "bg-blue-400",    textClass: "text-blue-400"    },
  psychologique: { label: "Erreur psychologique",  dotClass: "bg-amber-400",   textClass: "text-amber-400"   },
  execution:     { label: "Erreur d'exécution",    dotClass: "bg-violet-400",  textClass: "text-violet-400"  },
  rr:            { label: "Erreur R/R",            dotClass: "bg-pink-400",    textClass: "text-pink-400"    },
  timing:        { label: "Erreur de timing",      dotClass: "bg-red-400",     textClass: "text-red-400"     },
  liquidite:     { label: "Erreur de liquidité",   dotClass: "bg-emerald-400", textClass: "text-emerald-400" },
  discipline:    { label: "Erreur de discipline",  dotClass: "bg-zinc-400",    textClass: "text-zinc-400"    },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Débutant",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Erreurs évidentes : contexte clair, pièges simples, pédagogie forte.",
  },
  intermediate: {
    label:       "Intermédiaire",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Plusieurs erreurs plausibles, contexte ambigu, nécessité d'interpréter.",
  },
  advanced: {
    label:       "Avancé",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Plusieurs réponses presque valables, nuance institutionnelle, doute réel.",
  },
};

export function sessionVerdict(score: number, correctCount: number, total: number): string {
  if (correctCount >= total - 1) return "Œil de lynx";
  if (score >= 70)               return "Solide";
  if (score >= 30)               return "À polir";
  if (score >= 10)               return "Encore du chemin";
  return "Beaucoup à apprendre";
}
