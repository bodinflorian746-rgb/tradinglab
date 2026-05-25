// Mini-jeu #3 : "TROUVE L'ERREUR"
//
// Le joueur voit un setup/trade/contexte et identifie l'erreur principale
// parmi 4 choix. Pédagogie centrée sur les erreurs retail réelles :
// technique, psychologique, exécution, RR, timing, HTF, liquidité, discipline.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  VOL_MULT, mulberry32, pick, clamp, candle,
} from "./shared";

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
  range_middle:                "Trade dans range sale",
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
const VOLATILITIES: readonly Volatility[] = ["faible", "normale", "élevée"];
const SPREADS:      readonly Spread[]     = ["faible", "élevé"];

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
    explanation: "La résistance HTF testée plusieurs fois a tenu à chaque test. BUY juste en-dessous = entrée à la pire location possible. Le ratio R/R devient atroce car le TP est limité par la résistance immédiate.",
    lessons: {
      beginner:     "On n'achète pas sous une résistance qui rejette à chaque test. On attend une cassure ou un retournement.",
      intermediate: "Location > pattern. Même un setup techniquement bon devient mauvais si l'entry est dans une zone hostile.",
      advanced:     "La résistance HTF avec 3+ touches est une zone d'offre institutionnelle. L'edge est de SHORT le retest, pas de BUY le pullback dedans.",
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
    explanation: "Le support HTF a tenu à chaque test. SELL juste au-dessus = entrée à la pire location. Le TP est limité par le support immédiat → R/R catastrophique.",
    lessons: {
      beginner:     "On ne vend pas au-dessus d'un support qui rebondit. On attend la cassure du support OU le rebond sur résistance.",
      intermediate: "Location > pattern. Vendre dans une zone de demande HTF, c'est se placer contre l'edge.",
      advanced:     "Le support HTF avec 3+ rebonds est une zone de demande institutionnelle. Edge = BUY le rebond, pas SELL le pullback dedans.",
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
    explanation: "Les rebonds en downtrend sont des opportunités de SHORT, pas de BUY. Statistiquement, prendre des longs contre HTF a un taux de réussite de 30-40%, l'edge est inversé.",
    lessons: {
      beginner:     "HTF baissier = on cherche les SELL. Jamais les BUY.",
      intermediate: "Un setup local n'efface pas la tendance HTF. Si HTF dit non, tu ne dis pas oui.",
      advanced:     "Trader contre HTF = jouer à 30-40% de proba. Aucun setup local ne peut compenser cet écart statistique.",
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
    explanation: "Trader 30 min avant une news majeure = spread x3-x5, slippage massif, stop sauté par bid-ask. La technique du setup ne compte plus, seule la volatilité d'exécution te tue.",
    lessons: {
      beginner:     "Pas de trade dans les 30 min avant ET 15 min après une news majeure. Règle absolue.",
      intermediate: "Le spread peut tripler, ton SL saute par bid-ask. La statistique du setup ne s'applique plus à un marché illiquide.",
      advanced:     "Même avec une vue forte sur la news, l'exécution est ton ennemi. Position size /3 et stop x2, ou NO TRADE.",
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
    explanation: "Le swing low va presque toujours être retesté avant la continuation. Un stop au-dessus du low = balayé par le bruit normal du retest. Le trade serait bon avec un stop sous le swing low.",
    lessons: {
      beginner:     "Un stop se place DERRIÈRE l'invalidation avec marge, jamais dedans, jamais au-dessus.",
      intermediate: "Le retest du low est statistiquement présent dans 70%+ des pullbacks. La marge anti-bruit est obligatoire.",
      advanced:     "Sans marge ATR derrière la structure, ton stop sert d'aimant à liquidité. Les institutionnels ramassent ces niveaux.",
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
    explanation: "Au milieu d'un range : pas de zone testée, pas de signal, pas de catalyseur. Le R/R est dégueulasse (TP < risque). Le range se trade aux bornes ou à la cassure.",
    lessons: {
      beginner:     "Pas de signal = pas de trade. Si tu ne peux pas expliquer pourquoi en 1 phrase, c'est NO TRADE.",
      intermediate: "Le milieu de range = appel à risquer 1R pour 0.3R reward. Mathématiquement perdant.",
      advanced:     "Discipline > activité. Forcer le trade au milieu = donner du carburant aux market makers.",
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
    explanation: "Le swing high est une cible institutionnelle évidente, c'est là qu'est la liquidité des shorts piégés. Stop placé pile à cet endroit = aimant à sweep. Marge obligatoire au-dessus.",
    lessons: {
      intermediate: "Les swings highs/lows sont des zones de chasse à liquidité. Coller ton stop dessus = se faire chasser.",
      advanced:     "L'institutionnel CIBLE ces niveaux pour ramasser le carburant. Le stop logique va au-delà de la zone de liquidité, pas dedans.",
      beginner:     "Ton stop ne va jamais pile sur un swing évident. Toujours derrière la zone avec marge.",
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
    explanation: "R/R inférieur à 1 = même en gagnant 60% des trades, ton expectancy est négative. Un setup valide avec un mauvais R/R reste un mauvais trade.",
    lessons: {
      intermediate: "L'expectancy d'un setup = (proba_win × reward) - (proba_loss × risk). Si R/R < 1, il faut un win rate > 60% juste pour break-even.",
      advanced:     "Le R/R minimum acceptable est 2:1 pour absorber les frais et les périodes de drawdown. Sous ce seuil, l'edge statistique disparaît.",
      beginner:     "Si tu risques 100€ pour gagner 50€, tu perds à long terme même en gagnant souvent.",
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
    context: "Tu prends ce BUY sur la cassure de résistance. La bougie de force est minuscule.",
    correctMistake: "no_confirmation",
    decoyMistakes: ["buy_in_resistance", "bad_rr", "fomo_after_pump"],
    explanation: "Une cassure sans bougie de momentum (body petit, juste au-dessus de R) a un taux de continuation de ~35%. C'est souvent un appât à liquidité institutionnelle.",
    lessons: {
      intermediate: "Cassure faible = piège. Attendre soit un follow-through clair, soit un retest qui tient.",
      advanced:     "Les institutionnels créent des breakouts faibles pour aspirer les stops shorts au-dessus de R, puis poussent dans le sens HTF.",
      beginner:     "Un vrai breakout = bougie de force visible. Sinon, attends.",
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
    context: "Tu prends ce BUY sur XAU/USD. Capital du compte : 500€. Taille de position choisie : lot qui expose 250€ si le SL est touché. Le setup technique est correct.",
    correctMistake: "oversized_position",
    decoyMistakes: ["stop_too_tight", "volatility_ignored", "bad_rr"],
    explanation: "Risquer 50% du capital sur un seul trade est suicidaire. Une seule perte coupe le compte en deux. Et pour revenir à 500€, il faudra ensuite faire +100% sur le capital restant.",
    lessons: {
      advanced:     "La grille de risque pro : 0,5 à 2% du capital par trade selon la taille du compte. Au-delà de 5%, ce n'est plus du trading, c'est du gambling.",
      intermediate: "La taille de position est la variable n°1 du money management. Un setup correct + un lot trop gros = compte mort. La règle : sur 500€, jamais plus de 5% par trade (donc 25€ max de risque).",
      beginner:     "La grille de référence : 5% max sur un compte de 200-500€, 3% sur 500-1000€, 2% sur 1000-5000€. Le levier de ton broker n'a aucune importance, ce qui compte c'est combien tu perds en euros si ton SL est touché.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Risque par trade : 50% du capital",
    showLines: "buy_entry",
  },
  {
    id: "bad_spread",
    title: "Trade en session morte avec spread x4",
    category: "execution",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu prends ce BUY à 3h du matin (heures mortes). Spread quadruplé.",
    correctMistake: "bad_spread",
    decoyMistakes: ["bad_timing", "volatility_ignored", "trade_against_htf"],
    explanation: "Spread x4 + session illiquide = R/R réel divisé par 2 même si le setup marche. Le stop saute par bid-ask, le TP devient inatteignable.",
    lessons: {
      advanced:     "Un trader pro intègre toujours l'exécution dans son edge. Spread x3+ et volume mort → NO TRADE.",
      intermediate: "Le R/R papier ≠ R/R réel. Le spread mange ton edge.",
      beginner:     "Vérifie session + spread avant de cliquer. Heures mortes = NO TRADE.",
    },
    difficulties: ["advanced"],
    extraInfo: "Spread x4",
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
    explanation: "En vol élevée, le bruit normal est 2-3x plus large. Un stop 'normal' est dans le bruit amplifié → balayé avant que le trade aboutisse.",
    lessons: {
      advanced:     "Le stop doit s'adapter à l'ATR du moment, pas à une distance fixe. En vol élevée, élargi le stop ET le TP proportionnellement.",
      intermediate: "Volatilité doublée = stop doublé. Sinon ton stop devient un piège.",
      beginner:     "Plus le marché bouge fort, plus ton stop doit respirer.",
    },
    difficulties: ["intermediate", "advanced"],
    metaOverride: { volatility: "élevée" },
    showLines: "buy_with_tight_stop",
  },
  {
    id: "fomo_after_pump",
    title: "BUY après un pump de 5%",
    category: "psychologique",
    chartShape: "fast_rally",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de pomper 5% en 3 bougies. Tu BUY maintenant pour ne pas rater.",
    correctMistake: "fomo_after_pump",
    decoyMistakes: ["bad_rr", "trade_against_htf", "no_confirmation"],
    explanation: "Acheter le sommet d'un pump = exactement ce que les institutionnels attendent. Le R/R est terrible (TP loin / stop court), le retracement est probable à court terme.",
    lessons: {
      intermediate: "Les pumps verticaux retracent statistiquement 38-61%. BUY au sommet = vendre au creux.",
      advanced:     "Le FOMO = signal contre-trend. L'edge est d'ATTENDRE le retracement, pas de chaser.",
      beginner:     "Si tu prends un trade parce que 'tu vas rater', c'est précisément le moment de NE PAS le prendre.",
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
    explanation: "Le setup peut être valide, mais ta décision n'est pas guidée par l'analyse, elle est guidée par l'envie de récupérer les pertes. C'est le piège émotionnel #1 du retail.",
    lessons: {
      intermediate: "Après 2 stops, pause obligatoire (15-30 min). Le cerveau en perte de capital prend des décisions biaisées.",
      advanced:     "Le revenge trade a un win rate ~10 points en-dessous de la moyenne du même trader. La pause restaure l'objectivité.",
      beginner:     "Si tu trades pour 'récupérer', tu ne trades plus, tu paries.",
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
    context: "Le prix vient de balayer la liquidité sous le précédent low avec une grosse mèche. Tu SELL maintenant.",
    correctMistake: "sweep_ignored",
    decoyMistakes: ["trade_against_htf", "bad_rr", "stop_too_tight"],
    explanation: "Le sweep vient d'avoir lieu, c'est le signal de retournement haussier. SELL ici = vendre au creux que l'institutionnel vient de créer pour racheter. La direction est inversée.",
    lessons: {
      advanced:     "Pattern ICT classique : sweep = prise de liquidité avant continuation HTF. L'edge est de BUY le retournement, pas de SELL.",
      intermediate: "Une grosse mèche qui balaie un niveau puis retourne = signal de reversal probable. Lecture inversée.",
      beginner:     "Ne vends pas un creux qui vient d'être 'mangé' par une mèche. Cherche le rebond.",
    },
    difficulties: ["advanced"],
    showLines: "sell_entry",
  },
  {
    id: "mitigation_misread",
    title: "BUY sur FVG bouffé à 85%",
    category: "liquidite",
    chartShape: "fvg_deep_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tu BUY sur ce FVG haussier. Le pullback a mitigé 85%+ de la zone sans réaction visible.",
    correctMistake: "mitigation_misread",
    decoyMistakes: ["bad_rr", "stop_too_tight", "trade_against_htf"],
    explanation: "Une mitigation profonde sans réaction = FVG mort. Les acheteurs institutionnels ne défendent plus la zone. BUY ici = espérer la prière, pas suivre un signal.",
    lessons: {
      advanced:     "FVG > 75% mitigé sans réaction visible = la zone perd son edge statistique. Soit attendre cassure pour SELL, soit NO TRADE.",
      intermediate: "Une zone profondément testée perd son pouvoir. Le 1er ou 2e test = edge ; le test profond = zone fatiguée.",
      beginner:     "Si une zone tarde à réagir, elle perd sa puissance. Mieux vaut attendre la prochaine.",
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
    explanation: "Sur une news majeure (NFP, FOMC, CPI), le spread peut s'élargir x5 à x10, et le prix peut faire un mouvement instantané qui saute le SL. La règle pro : diviser la taille de lot par 2 ou 3 dans les 30 minutes autour d'une news rouge, ou ne pas trader du tout.",
    lessons: {
      advanced:     "Les algos institutionnels coupent leur exposition avant les news pour la même raison : la price action devient binaire et imprévisible. Garder une taille normale = parier sur l'aléatoire.",
      intermediate: "Une news majeure peut faire bouger une paire de 50-100 pips en 1 seconde. Ton SL devient théorique car le slippage te fait sortir 20-30 pips plus loin. Réduire la taille protège ton compte.",
      beginner:     "Avant un NFP, un FOMC, ou un CPI : tu divises ton lot par 2 ou 3, ou tu attends que la news passe. Le marché va trembler, tes stops ne tiendront pas comme d'habitude.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Taille de lot identique à un trade normal",
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
    explanation: "Sur FOMC + Powell, XAU peut faire 50-100$ d'amplitude en quelques minutes. Ton SL standard sera traversé en slippage. Soit tu coupes la position avant l'annonce, soit tu réduis le lot, soit tu places un SL très large pour absorber la vol.",
    lessons: {
      advanced:     "Le risk management institutionnel impose de neutraliser l'exposition avant tout événement à pricing power. Sur Powell, même les bons setups sont à la merci d'une phrase mal interprétée.",
      intermediate: "Une position laissée à découvert pendant un événement macro = pari binaire. Le setup technique perd toute valeur face à un titre fort. Soit tu sors, soit tu acceptes de gambler.",
      beginner:     "Avant un FOMC ou une conférence de banque centrale : tu fermes ta position, ou tu la réduis fortement. Le marché va bouger plus que tes calculs techniques le prévoient.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Position non gérée à l'approche de l'événement",
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
    context: "ATR journalier sur XAU/USD à 80$ contre 35$ habituellement (volatilité x2,3). Tu prends ce SELL avec ta taille de lot habituelle et ton SL standard de 30$.",
    correctMistake: "size_not_adapted_to_vol",
    decoyMistakes: ["stop_too_tight", "oversized_position", "bad_rr"],
    explanation: "Quand la volatilité double, ton risque effectif double aussi à taille de lot constante. Un SL de 30$ qui tenait sur un ATR de 35$ va sauter facilement sur un ATR de 80$. Adapter la taille à la vol = principe de base du risk management.",
    lessons: {
      advanced:     "La position sizing dynamique se calcule sur l'ATR : taille = (capital × risque%) / (ATR × multiplicateur SL). Quand l'ATR double, la taille doit être divisée par 2 pour conserver le même risque.",
      intermediate: "Les bons traders ajustent leur lot selon la volatilité du jour. Un ATR 2x supérieur à la normale = lot divisé par 2 ou SL doublé. Sinon le risque réel devient hors contrôle.",
      beginner:     "Quand le marché bouge plus que d'habitude, tu réduis ta taille de lot. Sinon ton stop saute trop facilement. La règle : taille adaptée à la volatilité, pas au feeling.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "ATR x2,3 vs moyenne, lot inchangé",
    showLines: "sell_entry",
  },
  {
    id: "weekend_gap_exposure",
    title: "Position FX ouverte avant weekend",
    category: "timing",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Vendredi 22h45, fermeture du forex dans 15 minutes. Tu ouvres un BUY sur EUR/USD avec ta taille de lot habituelle. Le setup est valide.",
    correctMistake: "weekend_gap_exposure",
    decoyMistakes: ["stop_too_tight", "oversized_position", "trade_before_news"],
    explanation: "Le weekend, les marchés FX sont fermés mais le monde continue. Une news géopolitique majeure (déclaration banque centrale, conflit, élection) peut créer un gap à l'ouverture du dimanche qui saute ton SL de 50 à 200 pips. Le slippage weekend est non négociable.",
    lessons: {
      advanced:     "Les hedge funds sortent généralement leurs positions FX directionnelles avant le close du vendredi, ou se hedgent via options. Garder une exposition naked sur le weekend = pari sur l'actualité géopolitique.",
      intermediate: "Avant un weekend, deux options : sortir tes positions, ou réduire fortement la taille. Le gap d'ouverture dimanche peut être brutal et ton SL ne te protège pas pendant la fermeture.",
      beginner:     "Le vendredi soir : tu fermes tes positions ou tu réduis leur taille. Pendant le weekend, le marché est fermé mais le monde bouge. Lundi matin, le prix peut sauter directement à l'autre bout de ton stop.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Position laissée ouverte sur le weekend",
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
      asset:      ov.asset      ?? pick(ASSETS, rng),
      session:    ov.session    ?? pick(SESSIONS, rng),
      volatility: ov.volatility ?? (cand.macroContext === "dangereux" ? "élevée" : pick(VOLATILITIES, rng)),
      spread:     ov.spread     ?? (cand.macroContext === "dangereux" ? "élevé"  : pick(SPREADS, rng)),
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
    past.push(candle(o, c, (0.6 + rng() * 0.3) * m, (0.2 + rng() * 0.2) * m));
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
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.6 + rng() * 0.3) * m));
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
    let c = o + drift;
    c = clamp(c, S + 0.4, R - 0.4);
    past.push(candle(o, c, (0.2 + rng() * 0.22) * m, (0.2 + rng() * 0.22) * m));
    p = c;
  }
  const entry = p;
  return { chart: finishChart(past, [], [
    { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Plafond range" },
    { kind: "support",    y1: S - 0.15, y2: S + 0.15, label: "Plancher range" },
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
    const c = clamp(o + (rng() - 0.5) * 0.6 * m, R - 1.1, R - 0.3);
    past.push(candle(o, c, (0.22 + rng() * 0.18) * m, (0.22 + rng() * 0.18) * m));
    p = c;
  }
  // Weak breakout candle (body petit, juste au-dessus de R)
  past.push(candle(p, R + 0.12 + rng() * 0.18, (0.3 + rng() * 0.2) * m, 0.18));
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
    { kind: "support",       y1: L - 0.1,    y2: L + 0.1,    label: "Précédent low"     },
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
    const c = Math.max(target, o - (0.32 + rng() * 0.28) * m);
    past.push(candle(o, c, (0.12 + rng() * 0.1) * m, (0.18 + rng() * 0.18) * m));
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

export function buildScenarioChart(template: MistakeTemplate, seed: number, vol: Volatility): ScenarioChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[vol];
  switch (template.chartShape) {
    case "uptrend_pullback": {
      const r = shUptrendPullback(rng, m);
      const ch = r.chart;
      if (template.showLines === "buy_with_tight_stop") {
        ch.entry = r.entry;
        ch.stop = r.swingLow + 0.05 * m;  // pile au-dessus du swing low = tight
        ch.tp = r.entry + (r.entry - ch.stop) * 2.2;
      } else if (template.showLines === "buy_with_bad_rr") {
        ch.entry = r.entry;
        ch.stop = r.swingLow - 0.5 * m;  // stop logique
        ch.tp = r.entry + (r.entry - ch.stop) * 0.6;  // TP très proche = bad RR
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
        ch.stop = r.swingHigh + 0.05 * m;  // pile au-dessus du swing high (liquidité)
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

export function scoreMistakeChoice(picked: MistakeId, correct: MistakeId, currentStreak: number): MistakeScoreResult {
  if (picked === correct) {
    const base = 100;
    const streakBonus = currentStreak >= 2 ? 30 : 0;
    return { correct: true, points: base + streakBonus, streakBonus };
  }
  return { correct: false, points: -30, streakBonus: 0 };
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
  if (score >= 700)              return "Solide";
  if (score >= 300)              return "À polir";
  if (score >= 0)                return "Encore du chemin";
  return "Beaucoup à apprendre";
}
