// Mini-jeu BUY / SELL / NO TRADE — V2.
//
// Changements clés V2 :
// - 3 difficultés (beginner / intermediate / advanced) qui modulent la clarté
//   visuelle du déclencheur + le pool de templates disponibles.
// - Chart V2 = past + future séparés. Le past s'arrête PILE au moment de
//   décision. Les bougies futures sont révélées après le choix (anim côté UI).
//   → le graphique ne révèle plus la réponse avant le clic.
// - Rationales par choix : pourquoi BUY / SELL / NO TRADE étaient bons ou mauvais.
// - Lessons adaptées au niveau (ton différent par difficulté).
//
// Garde les acquis V1 : seedé, scoring, métriques, structure rounds.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone, type ChartData, type ZoneKind,
  VOL_MULT, mulberry32, clamp, candle, chartDomain,
} from "./shared";
import { pickMarketContext, contextRule } from "./market-context";
import { realizeChart, type MarketCtx } from "./candle-realism";
import { assetPriceMap, mapCandle, mapDomain, mapZone } from "./price-scale";

export type { Asset, Session, Volatility, Spread, HtfBias, MacroContext };
export type { Candle, ChartZone, ChartData, ZoneKind };
export { mulberry32 };

// ─── Types spécifiques ────────────────────────────────────────────────────────

export type GameChoice = "BUY" | "SELL" | "NO_TRADE";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export type SetupKey =
  | "breakout_bullish_clean"
  | "breakout_bearish_clean"
  | "false_breakout_bullish"
  | "false_breakout_bearish"
  | "pullback_bullish_trend"
  | "pullback_bearish_trend"
  | "rejection_resistance"
  | "bounce_support"
  | "liquidity_sweep_reversal"
  | "fvg_reaction"
  | "trade_before_news"
  | "range_no_opp"
  // ─── V3 : ajouts pour rééquilibrer intermédiaire / avancé ───────────────────
  | "weak_breakout"          // cassure faible — NO TRADE (statistique pauvre)
  | "fvg_overmitigated"      // FVG bouffé à 85%+ sans réaction — NO TRADE
  | "counter_trend_bounce"   // rebond local contre HTF baissier — NO TRADE
  | "dirty_range_sweep"      // range avec sweeps des 2 côtés — NO TRADE
  | "setup_toxic_execution"; // setup propre mais spread/session toxiques — NO TRADE

export type Metric = "discipline" | "lecture" | "piege";

export interface ChoiceRationales {
  BUY:      string;
  SELL:     string;
  NO_TRADE: string;
}

export interface DifficultyLessons {
  beginner:     string;
  intermediate: string;
  advanced:     string;
}

export interface ScenarioTemplate {
  id:            SetupKey;
  title:         string;
  correctAnswer: GameChoice;
  htfBias:       HtfBias;
  macroContext:  MacroContext;
  metric:        Metric;
  context:       string;
  rationales:    ChoiceRationales;
  lessons:       DifficultyLessons;
  difficulties:  readonly Difficulty[];
  tags:          string[];
  // Optionnel : force certaines variables d'environnement pour que le scénario
  // soit cohérent (ex. spread élevé + session morte pour setup_toxic_execution).
  metaOverride?: {
    asset?:      Asset;
    session?:    Session;
    volatility?: Volatility;
    spread?:     Spread;
  };
  // Contexte court pour les niveaux intermédiaire/avancé (max 1 phrase).
  // Si non fourni, on prend la 1re phrase de `context`.
  shortContext?: string;
}

export interface ScenarioInstance extends ScenarioTemplate {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
  seed:       number;
  difficulty: Difficulty;
}

export interface BuySellChart {
  past:   Candle[];
  future: Candle[];
  zones:  ChartZone[];
  domain: { min: number; max: number };
}

export const ROUNDS_PER_SESSION = 10;

// ─── Templates ────────────────────────────────────────────────────────────────

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: "breakout_bullish_clean",
    title: "Cassure haussière nette",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix consolide sous une résistance majeure puis vient de la casser avec une bougie impulsive.",
    rationales: {
      BUY: "✓ Ici, l'UT supérieure est haussière et le breakout va dans son sens. La résistance vient d'être franchie avec une bougie impulsive : c'est un scénario de continuation typique. Dans ce cas, un BUY est la lecture la plus logique.",
      SELL: "✗ Vendre face à un breakout haussier, sur une UT supérieure haussière, revient ici à se placer à contre-courant sans signal de retournement. Ce type de trade est souvent émotionnel.",
      NO_TRADE: "✗ Ici, le setup coche les critères : breakout, UT supérieure alignée, contexte macro sans danger. Passer son tour dans ce cas ressemble plus à une occasion manquée qu'à de la discipline.",
    },
    lessons: {
      beginner:     "Repère simple : un breakout dans le sens de l'UT supérieure, sans danger macro, peut constituer un trade valable. Dans ce cas, pas besoin de chercher plus compliqué.",
      intermediate: "Quand l'UT supérieure, la structure et le contexte s'alignent, l'avantage devient statistique. Ce type de configuration peut mériter une place dans ton plan de trading.",
      advanced:     "Les setups d'alignement aussi propres sont plutôt rares. Quand ils se présentent, la taille se décide selon ton plan de gestion du risque, pas à l'instinct.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lecture", "breakout", "alignement de l'UT supérieure"],
  },
  {
    id: "breakout_bearish_clean",
    title: "Cassure baissière nette",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix consolide au-dessus d'un support majeur puis vient de le casser avec une bougie impulsive.",
    rationales: {
      BUY: "✗ Acheter une cassure de support sur une UT supérieure baissière revient ici à aller contre le marché. Aucun signal de retournement n'apparaît, seulement une accélération baissière.",
      SELL: "✓ Cassure propre dans le sens baissière de l'UT supérieure, avec un momentum côté vendeur. Ici, un SELL est la lecture la plus cohérente.",
      NO_TRADE: "✗ UT supérieure alignée, cassure propre, pas d'annonces : ici, la configuration semble complète. Passer son tour dans ce cas relève moins de la prudence que de l'hésitation.",
    },
    lessons: {
      beginner:     "Le miroir du breakout haussier : avec une UT supérieure baissière et un support cassé, un SELL reste cohérent avec le scénario, si ça correspond à ton plan.",
      intermediate: "Après une cassure propre alignée avec l'UT supérieure, la continuation est souvent le scénario majoritaire. Bon raisonnement : ce setup coche les critères. En conditions réelles, la décision finale dépend de ton plan.",
      advanced:     "Si le breakout paraît trop évident, méfie-toi du retest. Sur une UT supérieure alignée avec une structure claire, la taille suit ton plan de gestion du risque, et un stop au-dessus du support cassé est une option logique.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lecture", "breakout", "alignement de l'UT supérieure"],
  },
  {
    id: "false_breakout_bullish",
    title: "Cassure haussière suspecte",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix vient de casser au-dessus d'une résistance, mais l'UT supérieure reste baissière. La cassure paraît suspecte.",
    rationales: {
      BUY: "✗ Ici, tu suis le breakout sans regarder l'UT supérieure. Une cassure haussière sur une UT supérieure baissière peut souvent être un piège à liquidité : c'est un scénario où beaucoup de traders se font piéger.",
      SELL: "✓ Ici, UT supérieure baissière et breakout contre-tendance peuvent signaler un faux breakout. La liquidité au-dessus de la résistance sert souvent de carburant aux vendeurs. Un SELL après le piège se défend.",
      NO_TRADE: "≈ Pas une catastrophe (tu évites le piège), mais ici l'UT supérieure baissière et le signal contre-tendance donnent un avantage plutôt clair côté SELL. Un trader expérimenté pourrait le prendre.",
    },
    lessons: {
      beginner:     "Repère utile : un breakout CONTRE l'UT supérieure est souvent un piège. Dans ce cas (UT supérieure baissière, breakout haussier), rester à l'écart ou chercher le SELL sont deux options logiques.",
      intermediate: "Un piège classique : la cassure peut servir à aspirer la liquidité des stops placés au-dessus de la résistance, avant une reprise dans le sens de l'UT supérieure.",
      advanced:     "Ici, tu n'as pas encore la confirmation par la mèche de rejet : tu décides AVANT. Si l'UT supérieure et la macro le permettent, anticiper le faux breakout peut être un vrai avantage. Sinon, NO TRADE se défend.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["piège", "fakeout", "liquidité"],
  },
  {
    id: "false_breakout_bearish",
    title: "Cassure baissière suspecte",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix vient de casser sous un support, mais l'UT supérieure reste haussière. La cassure semble piégée.",
    rationales: {
      BUY: "✓ Ici, UT supérieure haussière et breakout baissier contre-tendance peuvent signaler un piège. La liquidité sous le support est souvent ramassée avant le mouvement haussier. Un BUY sur le retour se défend.",
      SELL: "✗ Vendre une cassure contre l'UT supérieure revient ici à rejoindre les vendeurs piégés. Ces faux breakouts repartent souvent dans le sens de l'UT supérieure.",
      NO_TRADE: "≈ Tu évites la perte, mais tu passes à côté de l'opportunité. Ici, jouer le contre-pied du faux breakout était une option logique.",
    },
    lessons: {
      beginner:     "Une cassure CONTRE l'UT supérieure peut être un piège. Vendre une cassure baissière dans un marché haussier reste, dans la plupart des cas, un pari risqué.",
      intermediate: "Ici, la chasse aux stops sous le support peut signaler un retournement haussier si l'UT supérieure est alignée, à confirmer avant d'agir. Le marché vient peut-être de récupérer du carburant pour monter.",
      advanced:     "Ici, tu décides AVANT le retour du prix au-dessus du support. Si l'UT supérieure et la structure sont alignés, un BUY se défend. En cas de doute, NO TRADE reste une option logique.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["piège", "fakeout", "liquidité"],
  },
  {
    id: "pullback_bullish_trend",
    title: "Pullback en tendance haussière",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Tendance haussière établie, le prix corrige vers un support visible.",
    rationales: {
      BUY: "✓ Ici, le pullback dans la tendance offre une opportunité d'achat à meilleur prix. Tu rejoins la tendance au lieu de la poursuivre, avec souvent un meilleur R/R.",
      SELL: "✗ Vendre dans une tendance haussière revient souvent à ramer contre le courant. Ici, le pullback ressemble plus à une opportunité d'achat qu'à un signal de vente.",
      NO_TRADE: "≈ Prudent, mais ici la configuration est propre. La discipline consiste aussi à prendre les bons trades, pas seulement à les éviter.",
    },
    lessons: {
      beginner:     "Dans une tendance haussière, les replis sont souvent les meilleurs moments pour acheter, plutôt que l'inverse. C'est l'un des trades les plus courants chez les traders de tendance.",
      intermediate: "Un pullback dans le sens de l'UT supérieure, sur un support visible, compte souvent parmi les setups les plus solides.",
      advanced:     "Un pullback profond n'invalide pas forcément le scénario. Tant que l'UT supérieure tient et que la structure n'est pas cassée, le pullback peut rester une opportunité.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lecture", "pullback", "trend"],
  },
  {
    id: "pullback_bearish_trend",
    title: "Pullback en tendance baissière",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Tendance baissière établie, le prix rebondit vers une résistance.",
    rationales: {
      BUY: "✗ Acheter le rebond dans une tendance baissière revient ici à chercher le point bas. Ce type de trade est souvent perdant.",
      SELL: "✓ Ici, le rebond ramène le prix sur une résistance visible. Vendre dans le sens baissière de l'UT supérieure, à un meilleur prix, est une option logique.",
      NO_TRADE: "≈ Pas faux, mais ici l'UT supérieure et la zone sont alignés. La discipline consiste à filtrer les trades, pas à tous les éviter.",
    },
    lessons: {
      beginner:     "En tendance baissière, on cherche plutôt les rebonds pour vendre. Acheter en espérant une remontée va souvent contre le marché.",
      intermediate: "Ici, un pullback sur une résistance dans une tendance baissière peut constituer un setup à bonne probabilité, à considérer selon ton plan de trading.",
      advanced:     "Si la résistance est retestée proprement et que l'UT supérieure reste intacte, le SELL se défend. Si la structure casse pendant le pullback, NO TRADE devient l'option logique.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lecture", "pullback", "trend"],
  },
  {
    id: "rejection_resistance",
    title: "Test de résistance majeure",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix vient d'arriver sur une résistance majeure après une forte hausse. La zone a déjà rejeté plusieurs fois.",
    rationales: {
      BUY: "✗ Acheter sous une résistance majeure, sur une UT supérieure baissière, revient ici à espérer que le niveau qui a rejeté le prix jusqu'ici ne le rejette pas cette fois.",
      SELL: "✓ Ici, une zone défendue par les vendeurs et une UT supérieure baissière peuvent signaler un retournement. Un SELL avec un stop au-dessus de la zone est une option logique.",
      NO_TRADE: "≈ Attendre une confirmation supplémentaire se comprend. Mais ici, une UT supérieure et une zone alignées suffisent souvent.",
    },
    lessons: {
      beginner:     "Résistance majeure et UT supérieure baissière : un SELL reste cohérent avec le scénario, si ça correspond à ton plan. Le marché te donne ici deux raisons d'aller dans le même sens.",
      intermediate: "Les zones de l'UT supérieure tiennent souvent mieux que les zones de l'UT inférieure. Au premier test d'une résistance majeure de l'UT supérieure, un rejet est fréquent, sans être systématique.",
      advanced:     "Si la zone a déjà été testée 3 fois ou plus, méfie-toi de la cassure (chaque test peut affaiblir le niveau). À 1 ou 2 tests dans le sens de l'UT supérieure, la taille dépend de ton plan de gestion du risque.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lecture", "rejet", "résistance"],
  },
  {
    id: "bounce_support",
    title: "Test de support majeur",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix vient d'arriver sur un support majeur après une correction. La zone a déjà tenu plusieurs fois.",
    rationales: {
      BUY: "✓ Ici, un support majeur et une UT supérieure haussière dessinent une zone d'achat. Les acheteurs défendent le niveau et le contexte est aligné. Un BUY avec un stop sous la zone est une option logique.",
      SELL: "✗ Vendre sous un support majeur défendu, sur une UT supérieure haussière, revient ici à se positionner contre l'avantage statistique. Dans ce cas, mieux vaut s'abstenir.",
      NO_TRADE: "≈ Attendre une confirmation n'est pas faux, mais ici l'UT supérieure et la zone donnent souvent déjà le signal.",
    },
    lessons: {
      beginner:     "Support majeur et UT supérieure haussière : un BUY reste cohérent avec le scénario, si ça correspond à ton plan. C'est le symétrique du rejet de résistance.",
      intermediate: "Au premier test, les zones de l'UT supérieure tiennent souvent plus qu'elles ne cassent. C'est cette asymétrie qui peut créer un avantage.",
      advanced:     "Les supports de l'UT supérieure testés 1 ou 2 fois sont souvent les plus fiables. Au-delà, le niveau peut s'affaiblir et le scénario cassure puis retest devient plus probable.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lecture", "support", "rebond"],
  },
  {
    id: "liquidity_sweep_reversal",
    title: "Sweep de liquidité",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix vient de balayer la liquidité sous le plus bas précédent avec une grosse mèche, puis a refermé au-dessus.",
    rationales: {
      BUY: "✓ Ici, le sweep a pris la liquidité des vendeurs piégés. Le marché dispose peut-être du carburant pour monter. Un BUY sur le retournement se défend.",
      SELL: "✗ Vendre APRÈS le sweep revient ici à vendre là où les gros acheteurs entrent souvent. Tu risques de rejoindre les vendeurs piégés.",
      NO_TRADE: "≈ Sans confirmation après le sweep, NO TRADE est une option défensive. Mais ici, la mèche et la clôture au-dessus du niveau forment déjà un signal crédible.",
    },
    lessons: {
      beginner:     "Une grosse mèche qui balaie une zone puis revient peut signaler un retournement probable. Dans ce cas, vendre le bas est rarement l'option logique ; l'acheter se défend.",
      intermediate: "Pattern ICT classique : prise de liquidité avant continuation de l'UT supérieure. Ici, le sweep est un argument fort en faveur d'une entrée, à confirmer selon ton plan.",
      advanced:     "Attendre la confirmation après le sweep (clôture au-dessus du niveau cassé, structure haussière) est souvent plus sûr. Sans confirmation, anticiper augmente le risque.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["piège", "liquidité", "sweep"],
  },
  {
    id: "fvg_reaction",
    title: "FVG haussier retesté",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Un FVG haussier laissé après l'impulsion. Le prix revient le tester pour la première fois.",
    rationales: {
      BUY: "✓ Ici, un FVG haussier, une UT supérieure alignée et un premier retest peuvent former un support solide. C'est un setup ICT classique.",
      SELL: "✗ Vendre sur un FVG haussier encore valide revient ici à se placer contre une zone que les acheteurs défendent souvent.",
      NO_TRADE: "≈ Si tu doutes de la mitigation, attendre la réaction se défend. Mais ici, une UT supérieure alignée et une zone encore intacte donnent un avantage.",
    },
    lessons: {
      beginner:     "Le FVG agit souvent comme un aimant pour le prix, puis comme un support au retest. Si l'UT supérieure est alignée, un BUY est une option logique.",
      intermediate: "Une zone entièrement remplie n'est pas forcément invalidée. Ici, c'est la réaction au retest qui compte. Avec une réaction visible et une UT supérieure alignée, un BUY se défend.",
      advanced:     "Fais la différence : une mitigation partielle (zone intacte) peut soutenir un BUY à bonne probabilité. Une mitigation profonde (plus de 75 %) sans réaction oriente plutôt vers NO TRADE ou un retournement.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["lecture", "FVG", "imbalance"],
  },
  {
    id: "trade_before_news",
    title: "Annonce macro imminente",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "dangereux",
    metric: "discipline",
    context: "Une annonce macro majeure (NFP / FOMC / CPI) est attendue dans moins de 30 minutes. Le marché est nerveux : les prix peuvent bondir à tout moment.",
    rationales: {
      BUY: "✗ Trader 30 min avant un NFP expose ici ton edge à un risque élevé : spread 3 à 5 fois plus large que d'habitude, slippage important, stop qui peut sauter quelle que soit la direction. Dans ce cas, le setup pèse peu.",
      SELL: "✗ Même problème : ici, le sens compte moins que la VOLATILITÉ et le SPREAD. Ton TP peut être valide, mais ton stop risque fort d'être dépassé.",
      NO_TRADE: "✓ Décision de pro. Sans trade, pas de perte. Une fois l'annonce passée, le marché retrouve souvent sa structure, et tu peux revenir dans 1h sur un graphique lisible.",
    },
    lessons: {
      beginner:     "Repère prudent : éviter de trader dans les 30 min avant et les 15 min après une annonce majeure. Beaucoup de traders en font une règle de leur plan.",
      intermediate: "Le spread peut tripler, ton SL peut sauter à cause du bid-ask, et les statistiques du setup s'appliquent mal à un marché illiquide. Ici, attendre est souvent le meilleur choix.",
      advanced:     "Même avec un avis sur le résultat de l'annonce, la volatilité d'exécution joue contre toi. Si tu tiens à trader, une option logique consiste à diviser la taille par 3 et doubler le stop. Sinon, NO TRADE.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["discipline", "macro", "news"],
  },
  {
    id: "range_no_opp",
    title: "Range sans signal",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "Le prix oscille au milieu d'un range, sans test de zone ni catalyseur visible.",
    rationales: {
      BUY: "✗ Acheter au milieu d'un range n'offre ici aucun avantage clair : pas de support testé, pas de signal, pas de catalyseur. Tu prends le risque sans vraie raison.",
      SELL: "✗ Même chose côté vente : pas de résistance testée, pas de signal. Dans ce cas, le trade ressemble surtout à un pari.",
      NO_TRADE: "✓ Ici, le marché n'offre rien de lisible. Les bons trades viendront plutôt aux bornes du range ou à la cassure. Patience.",
    },
    lessons: {
      beginner:     "Si tu ne peux pas expliquer en une phrase pourquoi le trade existe, il vaut souvent mieux ne pas le prendre. Ici, NO TRADE.",
      intermediate: "Trader le milieu d'un range revient souvent à risquer 1 pour gagner environ 0,3 (un R/R d'environ 1:0,3). Un range se trade plutôt à ses bornes.",
      advanced:     "La discipline compte plus que l'activité. Beaucoup de traders expérimentés filtrent fortement leurs entrées. Ne pas trader est aussi une décision à part entière.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["discipline", "range", "patience"],
  },
  // ─── V3 — setups réalistes piège mental ─────────────────────────────────────
  {
    id: "weak_breakout",
    title: "Cassure sans conviction",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "Le prix vient de casser au-dessus de la résistance, mais la bougie impulsive manque cruellement de body.",
    shortContext: "Cassure haussière, body très faible.",
    rationales: {
      BUY: "✗ Ici, tu poursuis une cassure faible. Sans bougie de momentum nette, la continuation devient nettement moins probable, et le R/R espéré se dégrade.",
      SELL: "✗ Vendre une cassure haussière sans signal de retournement paraît ici prématuré : il n'y a ni bougie de retournement ni structure baissière.",
      NO_TRADE: "✓ Une cassure gagne à s'imposer pour être tradable. Sans bougie impulsive, une option logique consiste à attendre un retest propre ou une continuation claire. Patience.",
    },
    lessons: {
      beginner:     "Une grande bougie qui casse une zone apporte une confirmation forte. Une petite bougie qui casse à peine reste une confirmation faible, souvent insuffisante pour agir.",
      intermediate: "Le marché ne donne pas un signal propre à chaque cassure. Si la conviction manque, rien ne t'oblige à y aller.",
      advanced:     "Une cassure sans corps sert souvent d'appât à liquidité : ces breakouts faibles piègent régulièrement les traders impatients. Ici, NO TRADE puis observation est une option logique.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["discipline", "breakout", "momentum"],
  },
  {
    id: "fvg_overmitigated",
    title: "FVG presque invalidé",
    correctAnswer: "NO_TRADE",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le FVG haussier a été mitigé sur plus de 85 % de sa hauteur. La réaction tarde, les acheteurs ne défendent plus la zone.",
    shortContext: "FVG mitigé à plus de 85 %, pas de réaction.",
    rationales: {
      BUY: "✗ Ici, tu mises sur un rebond qui ne vient pas. Une mitigation profonde sans réaction peut signaler un FVG épuisé : les acheteurs ne semblent plus défendre la zone.",
      SELL: "✗ Prématuré : aucune cassure structurelle n'est encore confirmée. Ici, tu vendrais une intuition plutôt qu'un signal.",
      NO_TRADE: "✓ Ici, l'avantage est insuffisant. Une option logique : attendre un rejet clair du bas du FVG (BUY confirmé) ou une cassure structurelle (SELL confirmé).",
    },
    lessons: {
      beginner:     "Si une zone tarde à réagir, elle perd souvent de sa valeur. Dans ce cas, mieux vaut attendre la suivante.",
      intermediate: "Une zone profondément mitigée perd souvent son avantage. Si la réaction n'arrive pas dans les 2-3 bougies, la zone peut être considérée comme épuisée.",
      advanced:     "Un FVG mitigé à plus de 80 % sans réaction peut orienter vers la recherche d'une cassure baissière pour un SELL. Sans cette cassure, NO TRADE reste l'option logique.",
    },
    difficulties: ["advanced"],
    tags: ["lecture", "FVG", "mitigation"],
  },
  {
    id: "counter_trend_bounce",
    title: "Rebond local contre l'UT supérieure",
    correctAnswer: "NO_TRADE",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "discipline",
    context: "UT supérieure baissière nette. Le prix rebondit localement sur un niveau secondaire, mais la tendance reste contre toi.",
    shortContext: "Rebond local dans une tendance baissière de l'UT supérieure.",
    rationales: {
      BUY: "✗ Trader contre la tendance de l'UT supérieure en misant sur un niveau secondaire revient ici à jouer une probabilité faible. Les statistiques jouent souvent contre toi avant même le clic.",
      SELL: "✗ Pas le bon moment : ici, le rebond local ne montre pas encore de signe d'épuisement. En vendant maintenant, 2-3 bougies vertes peuvent te sortir avant la reprise.",
      NO_TRADE: "✓ Le setup local tient, MAIS il va contre l'UT supérieure : ici, l'avantage manque. Une option logique consiste à attendre l'épuisement du rebond et une zone claire de l'UT supérieure pour vendre.",
    },
    lessons: {
      beginner:     "Avec une UT supérieure baissière, on cherche plutôt les SELL ; les BUY contre la tendance restent des paris risqués.",
      intermediate: "Un setup local n'efface pas la tendance de l'UT supérieure. Si l'UT supérieure va contre toi, il vaut souvent mieux s'abstenir, même si la zone locale tient.",
      advanced:     "Dans une tendance baissière, les rebonds offrent plutôt des opportunités de SELL que de BUY. Mais le timing compte : ici, c'est trop tôt, sans mèche de rejet sur une résistance de l'UT supérieure.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["discipline", "UT supérieure", "contre-tendance"],
  },
  {
    id: "dirty_range_sweep",
    title: "Range avec sweeps des deux côtés",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "Le prix vient de balayer les liquidités des deux bords du range. Aucune direction claire, l'accumulation institutionnelle est invisible.",
    shortContext: "Range avec sweep des deux bords.",
    rationales: {
      BUY: "✗ Pas de signal d'achat ici. Le sweep récent du haut rend la zone basse moins fiable comme support. L'avantage manque.",
      SELL: "✗ Symétrique : le sweep récent du bas rend la zone haute moins fiable. Ici, le marché a nettoyé la liquidité des deux côtés.",
      NO_TRADE: "✓ Ici, aucun biais directionnel ne se dégage, donc pas de structure exploitable. Une option logique : attendre une cassure confirmée ou une accumulation reconnaissable.",
    },
    lessons: {
      intermediate: "Quand un range a balayé les deux côtés sans direction, attendre la sortie est souvent la décision la plus sage.",
      advanced:     "Un double sweep peut traduire une accumulation discrète. Dans ce cas, attendre la sortie du range se défend ; jouer le ping-pong à l'intérieur est souvent coûteux.",
      beginner:     "Si tu vois de grosses mèches en haut ET en bas, avec un prix au milieu, NO TRADE est souvent l'option logique.",
    },
    difficulties: ["advanced"],
    tags: ["discipline", "range", "sweep"],
  },
  {
    id: "setup_toxic_execution",
    title: "Setup propre, exécution toxique",
    correctAnswer: "NO_TRADE",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "discipline",
    context: "Setup technique valide, mais le contexte d'exécution est défavorable : spread élevé, session morte, volatilité absente. Le R/R réel est divisé par 2.",
    shortContext: "Setup propre, mais spread élevé en session morte.",
    rationales: {
      BUY: "✗ Le signal est bon, mais ici le contexte dégrade le R/R : avec un spread élevé en session morte, ton stop peut sauter à cause du bid-ask et ton TP devient difficile à atteindre. La technique ne suffit pas.",
      SELL: "✗ Contre l'UT supérieure, en plus d'un contexte d'exécution déjà défavorable. Ici, deux erreurs se cumulent : aller contre la tendance ET trader dans une liquidité faible.",
      NO_TRADE: "✓ Décision de pro. Ce type de setup revient souvent en session Londres ou New York, avec un spread propre. Ici, tu ne perds rien à attendre.",
    },
    lessons: {
      intermediate: "Un beau setup dans de mauvaises conditions d'exécution ne fait pas forcément un beau trade. La technique ET l'exécution gagnent à être alignées.",
      advanced:     "Avec un spread 3 fois plus large que d'habitude et un volume faible, ton R/R réel peut être divisé par deux même si le setup fonctionne. Beaucoup de traders pros intègrent l'exécution dans leur edge.",
      beginner:     "Vérifie la session et le spread AVANT de cliquer. En heures mortes, un setup mérite souvent un NO TRADE.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["discipline", "execution", "spread"],
    metaOverride: {
      session:    "Heures mortes",
      volatility: "faible",
      spread:     "élevé",
    },
  },
];

// ─── Variations ───────────────────────────────────────────────────────────────

const ASSETS: readonly Asset[] = ["XAU/USD", "EUR/USD", "NASDAQ"];
const SESSIONS: readonly Session[] = ["Asie", "Londres", "New York"];

export function generateScenarios(seed: number, difficulty: Difficulty = "intermediate"): ScenarioInstance[] {
  const rng = mulberry32(seed);
  const pool = SCENARIO_TEMPLATES.filter((t) => t.difficulties.includes(difficulty));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Si le pool est plus petit que ROUNDS_PER_SESSION, on répète sans
  // refaire deux fois consécutivement le même setup.
  const out: ScenarioInstance[] = [];
  let lastId: SetupKey | null = null;
  for (let i = 0; i < ROUNDS_PER_SESSION; i++) {
    let candidate = shuffled[i % shuffled.length];
    if (candidate.id === lastId && shuffled.length > 1) {
      candidate = shuffled[(i + 1) % shuffled.length];
    }
    const ov = candidate.metaOverride ?? {};
    out.push({
      ...candidate,
      // Contexte cohérent : session, actif tradé dans la session, volatilité et spread de la session
      ...pickMarketContext(rng, { assets: ASSETS, sessions: SESSIONS }, contextRule("bsnt", candidate.id, {
        ...ov,
        ...(candidate.macroContext === "dangereux" ? { volatility: ov.volatility ?? "élevée", spread: ov.spread ?? "élevé" } : {}),
      })),
      seed:       (seed + i * 9973) >>> 0,
      difficulty,
    });
    lastId = candidate.id;
  }
  return out;
}

// ─── Chart generators V2 — past / future séparés ─────────────────────────────
//
// Convention : "past" = bougies visibles AVANT le choix.
//              "future" = bougies révélées APRÈS le choix.
// Le past s'arrête PILE au moment de décision, sans révéler la résolution.
//
// Difficulty :
//   beginner     → trigger candle plus volumineuse, hint de confirmation ajouté
//   intermediate → trigger normal, pas de hint
//   advanced     → trigger plus subtil, peut être ambigu (vrai/fakeout
//                  ont visuellement la même tête côté past — c'est HTF qui tranche)

interface RawScenario {
  past:   Candle[];
  future: Candle[];
  zones:  ChartZone[];
}

function finalize(raw: RawScenario): BuySellChart {
  const all = [...raw.past, ...raw.future];
  return { ...raw, domain: chartDomain(all, raw.zones) };
}

// Helpers d'amplitudes par niveau pour le trigger des breakouts / wicks.
// V3 : on durcit intermédiaire et avancé pour que les signaux soient
// significativement moins évidents qu'en débutant.
function bodyAmp(difficulty: Difficulty): number {
  return difficulty === "beginner" ? 1.5 : difficulty === "intermediate" ? 0.85 : 0.55;
}
function wickAmp(difficulty: Difficulty): number {
  return difficulty === "beginner" ? 1.6 : difficulty === "intermediate" ? 0.85 : 0.55;
}

// Médiane des corps : une « bougie impulsive » doit dépasser nettement les bougies précédentes.
function medianBody(candles: Candle[]): number {
  const b = candles.map((k) => Math.abs(k.c - k.o)).sort((x, y) => x - y);
  return b.length ? b[Math.floor(b.length / 2)] : 0;
}

function genBreakoutBull(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = 3 + rng() * 0.5;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.8) * m, 2, R - 1);
    past.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.2 * m, R - 1.6, R - 0.3);
    past.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  // Trigger : breakout candle (taille module par difficulté)
  const bO = p;
  // « Bougie impulsive » : corps ≥ 1,6× la médiane des corps précédents
  const bC = Math.max(R + (1.0 + rng() * 0.7) * m * bodyAmp(d), bO + 1.6 * medianBody(past));
  past.push(candle(bO, bC, (0.3 + rng() * 0.2) * m, 0.2));
  p = bC;
  // Beginner : 1 petite confirmation verte dans le past (rend l'evidence visible)
  if (d === "beginner") {
    const o = p; const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.1) * m));
    p = c;
  }
  // Future : follow-through
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.45 + rng() * 0.6) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  return finalize({
    past, future: fut,
    zones: [{ kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Résistance" }],
  });
}

function genBreakoutBear(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const S = 0;
  let p = 7 - rng() * 0.5;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.8) * m, S + 1, 8);
    past.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.2 * m, S + 0.3, S + 1.6);
    past.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  const bO = p;
  // « Bougie impulsive » : corps ≥ 1,6× la médiane des corps précédents
  const bC = Math.min(S - (1.0 + rng() * 0.7) * m * bodyAmp(d), bO - 1.6 * medianBody(past));
  past.push(candle(bO, bC, 0.2, (0.3 + rng() * 0.2) * m));
  p = bC;
  if (d === "beginner") {
    const o = p; const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.45 + rng() * 0.6) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  return finalize({
    past, future: fut,
    zones: [{ kind: "support", y1: S - 0.15, y2: S + 0.15, label: "Support" }],
  });
}

function genFalseBreakoutBull(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // Past = approche + consol + breakout candle qui clôt au-dessus (le user voit
  // une cassure haussière apparente). Mais HTF baissier → c'est un piège.
  // En beginner, on ajoute un wick haut visible (le rejet commence à se voir).
  // En intermediate, breakout d'apparence "propre" (clean body).
  // En advanced, breakout encore plus convaincant — seul le HTF distingue.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = 5 + rng() * 0.5;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.4 + rng() * 0.55) * m, 3.5, R - 0.5);
    past.push(candle(o, c, (0.22 + rng() * 0.22) * m, (0.22 + rng() * 0.22) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.0 * m, R - 1.4, R - 0.3);
    past.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  // Trigger candle : breakout au-dessus de la résistance
  const bO = p;
  const wickHigh =
    d === "beginner"     ? (1.1 + rng() * 0.4) * m
  : d === "intermediate" ? (0.5 + rng() * 0.3) * m
  :                        (0.25 + rng() * 0.2) * m;  // advanced : wick à peine visible
  const bC = d === "beginner"
    ? R + 0.2 + rng() * 0.2          // beginner : clôture juste au-dessus (rejet déjà en cours)
    : R + 0.5 + rng() * 0.4;          // inter/adv : clôture nettement au-dessus
  past.push({ o: bO, c: bC, h: bC + wickHigh, l: bO - 0.2 });
  p = bC;
  // Future : drop confirmant le piège
  // Premier candle : retour sous la résistance (commence le piège visible)
  const flop = candle(p, R - 0.4 - rng() * 0.3, 0.15, (0.4 + rng() * 0.3) * m);
  fut.push(flop); p = flop.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.7) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.22 + rng() * 0.3) * m));
    p = c;
  }
  return finalize({
    past, future: fut,
    zones: [
      { kind: "resistance",     y1: R - 0.15,        y2: R + 0.15,        label: "Résistance" },
      { kind: "liquidity_high", y1: R + 0.25,        y2: R + 1.4 * m,     label: "Liquidité au-dessus" },
    ],
  });
}

function genFalseBreakoutBear(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const S = 0;
  let p = 5 - rng() * 0.5;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o - (0.4 + rng() * 0.55) * m, S + 0.5, 6);
    past.push(candle(o, c, (0.22 + rng() * 0.22) * m, (0.22 + rng() * 0.22) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.0 * m, S + 0.3, S + 1.4);
    past.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  const bO = p;
  const wickLow =
    d === "beginner"     ? (1.1 + rng() * 0.4) * m
  : d === "intermediate" ? (0.5 + rng() * 0.3) * m
  :                        (0.25 + rng() * 0.2) * m;
  const bC = d === "beginner"
    ? S - 0.2 - rng() * 0.2
    : S - 0.5 - rng() * 0.4;
  past.push({ o: bO, c: bC, h: bO + 0.2, l: bC - wickLow });
  p = bC;
  const flop = candle(p, S + 0.4 + rng() * 0.3, (0.4 + rng() * 0.3) * m, 0.15);
  fut.push(flop); p = flop.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.7) * m;
    fut.push(candle(o, c, (0.22 + rng() * 0.3) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  return finalize({
    past, future: fut,
    zones: [
      { kind: "support",       y1: S - 0.15,       y2: S + 0.15,       label: "Support" },
      { kind: "liquidity_low", y1: S - 1.4 * m,    y2: S - 0.25,       label: "Liquidité en-dessous" },
    ],
  });
}

function genPullbackBull(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 1 + rng() * 0.5;
  // Trend up
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.55) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  const peak = p;
  // Pullback (4 candles rouges, plus profond en advanced)
  const depth = d === "advanced" ? 5 : 4;
  for (let i = 0; i < depth; i++) {
    const o = p;
    const c = o - (0.2 + rng() * 0.45) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  const pullbackLow = p;
  // Beginner : ajouter 1 small green confirmation au past
  if (d === "beginner") {
    const o = p; const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // Future : reprise
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.35 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const demandLow = pullbackLow - 0.4 * m;
  const demandHigh = pullbackLow + 0.2 * m;
  return finalize({
    past, future: fut,
    zones: [
      { kind: "support",        y1: demandLow,         y2: demandHigh,         label: "Support" },
      { kind: "liquidity_high", y1: peak - 0.15,       y2: peak + 0.15,        label: "Plus haut précédent"   },
    ],
  });
}

function genPullbackBear(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 9 - rng() * 0.5;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.55) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  const bottom = p;
  const depth = d === "advanced" ? 5 : 4;
  for (let i = 0; i < depth; i++) {
    const o = p;
    const c = o + (0.2 + rng() * 0.45) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const pullbackHigh = p;
  if (d === "beginner") {
    const o = p; const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.35 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  const offerLow = pullbackHigh - 0.2 * m;
  const offerHigh = pullbackHigh + 0.4 * m;
  return finalize({
    past, future: fut,
    zones: [
      { kind: "resistance",    y1: offerLow,          y2: offerHigh,         label: "Résistance" },
      { kind: "liquidity_low", y1: bottom - 0.15,     y2: bottom + 0.15,     label: "Plus bas précédent" },
    ],
  });
}

function genRejectionResistance(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = 4 + rng() * 0.5;
  // Rally vers la résistance
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.6) * m, 3, R - 0.3);
    past.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  // Test résistance : wicks (intensité selon difficulté)
  const tests = d === "beginner" ? 4 : d === "intermediate" ? 3 : 2;
  const wickK = wickAmp(d);
  for (let i = 0; i < tests; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.6) * 0.7 * m, R - 1.3, R - 0.4);
    const k = candle(o, c, (1.0 + rng() * 0.4) * m * wickK, (0.2 + rng() * 0.2) * m);
    // « La zone a déjà rejeté plusieurs fois » : la mèche entre toujours dans la zone
    k.h = Math.max(k.h, R - 0.15);
    past.push(k);
    p = c;
  }
  // Future : drop
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  return finalize({
    past, future: fut,
    zones: [{ kind: "resistance", y1: R - 0.2, y2: R + 0.2, label: "Résistance UT supérieure" }],
  });
}

function genBounceSupport(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const S = 0;
  let p = 6 - rng() * 0.5;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.6) * m, S + 0.3, 7);
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  const tests = d === "beginner" ? 4 : d === "intermediate" ? 3 : 2;
  const wickK = wickAmp(d);
  for (let i = 0; i < tests; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.4) * 0.7 * m, S + 0.4, S + 1.3);
    const k = candle(o, c, (0.2 + rng() * 0.2) * m, (1.0 + rng() * 0.4) * m * wickK);
    // « La zone a déjà tenu plusieurs fois » : la mèche entre toujours dans la zone
    k.l = Math.min(k.l, S + 0.15);
    past.push(k);
    p = c;
  }
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  return finalize({
    past, future: fut,
    zones: [{ kind: "support", y1: S - 0.2, y2: S + 0.2, label: "Support UT supérieure" }],
  });
}

function genLiquiditySweep(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // Past = consolidation + sweep candle visible (longue mèche basse, close au-dessus du low).
  // Le visuel du sweep est explicite (c'est la lecture du pattern qu'on enseigne).
  // Difficulté : beginner → wick + close très clairs. Advanced → wick plus discret,
  // décision se prend avant confirmation post-sweep.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const L = 1;
  let p = 4 + rng() * 0.4;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.3 + rng() * 0.5) * m, L + 0.4, 4.5);
    const k = candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.25) * m);
    k.l = Math.max(k.l, L - 0.12); // le plus bas précédent n'est pas balayé avant le sweep
    past.push(k);
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.8 * m, L + 0.5, L + 1.6);
    const k = candle(o, c, (0.25 + rng() * 0.22) * m, (0.25 + rng() * 0.22) * m);
    k.l = Math.max(k.l, L - 0.12); // le plus bas précédent n'est pas balayé avant le sweep
    past.push(k);
    p = c;
  }
  // Trigger : sweep candle (longue mèche basse) — module par difficulté
  const sO = p;
  const wickDown = (1.1 + rng() * 0.5) * m * wickAmp(d);
  const sC = d === "beginner"
    ? L + 0.4 + rng() * 0.3   // beginner : close clairement au-dessus du low
    : L + 0.15 + rng() * 0.25; // inter/adv : close juste au-dessus
  // « Grosse mèche » : la mèche basse est au moins 1,2× le corps
  past.push({ o: sO, c: sC, h: Math.max(sO, sC) + 0.2, l: Math.min(L - wickDown, Math.min(sO, sC) - 1.2 * Math.abs(sO - sC)) });
  p = sC;
  if (d === "beginner") {
    // 1 confirmation candle après sweep
    const o = p; const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.45 + rng() * 0.7) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  return finalize({
    past, future: fut,
    zones: [
      { kind: "support",       y1: L - 0.15,             y2: L + 0.15,             label: "Plus bas précédent"     },
      { kind: "liquidity_low", y1: L - 1.5 * m,          y2: L - 0.25,             label: "Liquidité balayée" },
    ],
  });
}

function genFvgReaction(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 2 + rng() * 0.4;
  // Base
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (rng() - 0.4) * 0.5 * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const gO = p;
  const gC = p + (2.0 + rng() * 0.4) * m;
  past.push(candle(gO, gC, (0.3 + rng() * 0.2) * m, 0.12));
  p = gC;
  // 2 candles d'impulsion au-dessus du FVG
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // FVG réel : entre le haut de la bougie 1 (avant l'impulsion) et le bas de la
  // bougie 3 (juste après). Le prix ne le touche pas avant le pullback final.
  const fvgLow = past[2].h;
  const fvgHigh = past[4].l;
  past[5].l = Math.max(past[5].l, fvgHigh + 0.05);
  // Pullback dans le FVG — profondeur variable par difficulté ; seule la
  // dernière bougie du pullback vient tester la zone (1er retest), sans la casser.
  const pullbackTarget = d === "beginner"
    ? fvgHigh - 0.15 * (fvgHigh - fvgLow)   // beginner : retest peu profond (FVG fresh)
  : d === "intermediate"
    ? (fvgLow + fvgHigh) / 2                // intermediate : retest à mi-FVG
    : fvgLow + 0.1 * (fvgHigh - fvgLow);    // advanced : mitigation profonde (frôle le bas)
  const steps = d === "beginner" ? 3 : 4;
  for (let i = 0; i < steps; i++) {
    const o = p;
    const lastStep = i === steps - 1;
    const drop = (0.3 + rng() * 0.3) * m;
    const c = lastStep ? pullbackTarget : Math.max(o - drop, fvgHigh + 0.1 * (steps - i));
    const k = candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m);
    k.l = lastStep ? Math.max(k.l, fvgLow + 0.02) : Math.max(k.l, fvgHigh + 0.03);
    past.push(k);
    p = c;
  }
  // Future : reprise
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  return finalize({
    past, future: fut,
    zones: [{ kind: "fvg", y1: fvgLow, y2: fvgHigh, label: "FVG haussier" }],
  });
}

function genTradeBeforeNews(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // Past = 14 candles serrées avant news (visuellement OK, mais le danger
  // vient du contexte macro affiché en HTML). Future = spike chaotique.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 4 + rng() * 0.5;
  for (let i = 0; i < 14; i++) {
    const tight = 1 - i / 26;
    const o = p;
    const c = o + (rng() - 0.5) * 0.9 * tight * m;
    past.push(candle(o, c, (0.2 + rng() * 0.22) * tight * m, (0.2 + rng() * 0.22) * tight * m));
    p = c;
  }
  // Future : spike puis crash (news classique)
  const spike = candle(p, p + 0.6 * m, (1.4 + rng() * 0.6) * m, (0.15 + rng() * 0.15) * m);
  fut.push(spike); p = spike.c;
  const crash = candle(p, p - 2.6 * m, (0.2 + rng() * 0.2) * m, (0.6 + rng() * 0.3) * m);
  fut.push(crash); p = crash.c;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (rng() - 0.3) * 1.2 * m;
    fut.push(candle(o, c, (0.5 + rng() * 0.3) * m, (0.5 + rng() * 0.3) * m));
    p = c;
  }
  // Pas de zones — le danger est macro, pas structurel
  // Référence d (used by signature)
  void d;
  return finalize({ past, future: fut, zones: [] });
}

function genRangeNoOpp(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // Past = oscillation dans range, dernière bougie au milieu.
  // Future = continuation oscillante (pas de signal).
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const S = 1;
  const R = 6;
  const mid = (S + R) / 2;
  let p = mid + (rng() - 0.5);
  // 14 candles dans le range
  for (let i = 0; i < 14; i++) {
    const o = p;
    const pull = (mid - o) * 0.25;
    const drift = pull + (rng() - 0.5) * 1.5 * m;
    // « Au milieu d'un range » : la dernière bougie finit dans le tiers central
    let c = i === 13 ? mid + (drift - pull) * 0.25 : o + drift;
    c = clamp(c, S + 0.4, R - 0.4);
    const k = candle(o, c, (0.25 + rng() * 0.28) * m, (0.25 + rng() * 0.28) * m);
    // « Sans test de zone » : les mèches restent à l'intérieur du range
    k.h = Math.min(k.h, R - 0.2);
    k.l = Math.max(k.l, S + 0.2);
    past.push(k);
    p = c;
  }
  // Future : continue à osciller
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.4 * m, S + 0.4, R - 0.4);
    fut.push(candle(o, c, (0.25 + rng() * 0.25) * m, (0.25 + rng() * 0.25) * m));
    p = c;
  }
  void d;
  return finalize({
    past, future: fut,
    zones: [
      { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Haut du range"  },
      { kind: "support",    y1: S - 0.15, y2: S + 0.15, label: "Bas du range" },
    ],
  });
}

// ─── V3 — 5 générateurs supplémentaires (NO TRADE oriented) ──────────────────

function genWeakBreakout(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // Cassure légère au-dessus de la résistance : body minuscule, juste au-dessus
  // du niveau. Future : stalle puis revient sous la résistance.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = 5.5 + rng() * 0.4;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.45) * m, 4, R - 0.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  // Consolidation serrée
  for (let i = 0; i < 4; i++) {
    const o = p;
    // La dernière bougie de consolidation clôt juste sous la résistance : la
    // cassure qui suit peut ainsi n'avoir qu'un corps minuscule (continuité).
    const c = i === 3
      ? R - 0.02 - rng() * 0.08
      : clamp(o + (rng() - 0.45) * 0.6 * m, R - 1.1, R - 0.3);
    past.push(candle(o, c, (0.22 + rng() * 0.18) * m, (0.22 + rng() * 0.18) * m));
    p = c;
  }
  // Trigger : breakout TRÈS FAIBLE (clôture juste au-dessus de la zone, body
  // minuscule, mèches qui dominent la bougie)
  const bO = p;
  const bC = R + 0.18 + rng() * 0.12;
  const bBody = bC - bO;
  past.push(candle(bO, bC, Math.max((0.3 + rng() * 0.2) * m, 1.6 * bBody), Math.max(0.18, 0.3 * bBody)));
  p = bC;
  // Future : stalle puis retombe sous R (NO TRADE était la bonne décision)
  const stall = candle(p, p - 0.06, (0.18 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m);
  fut.push(stall); p = stall.c;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.28 + rng() * 0.42) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.13) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  void d;
  return finalize({
    past, future: fut,
    zones: [{ kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Résistance" }],
  });
}

function genFvgOvermitigated(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // FVG haussier laissé par une impulse, puis pullback profond qui descend
  // jusqu'au BAS du FVG (mitigation 85%+). Pas de réaction visible — le past
  // finit sur 1-2 candles indécises au fond du FVG. Future : cassure baissière.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 2 + rng() * 0.4;
  // 3 base candles
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (rng() - 0.4) * 0.4 * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  // Bas du FVG = high de la dernière base candle
  const baseHigh = Math.max(...past.slice(-3).map((k) => k.h));
  // Impulse (crée la FVG)
  const iO = p;
  const iC = p + (2.0 + rng() * 0.3) * m;
  past.push(candle(iO, iC, (0.3 + rng() * 0.2) * m, 0.12));
  p = iC;
  // 2 candles au-dessus
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.25) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  // Haut du FVG = low de la candle juste après l'impulse
  const fvgLow  = baseHigh;
  const fvgHigh = past[past.length - 2].l;  // bottom of c3 (1st candle after impulse)
  // Pullback profond — close target ~10% au-dessus du bas (mitigation 85%+)
  const target = fvgLow + (fvgHigh - fvgLow) * 0.1;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = Math.max(target, o - (0.32 + rng() * 0.28) * m);
    past.push(candle(o, c, (0.12 + rng() * 0.1) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  // 2 candles indécises au fond du FVG (pas de réaction = piège mental).
  // On contraint le close à rester dans le bas du FVG (max = target + 5% du
  // FVG) pour que le past ne révèle pas un faux rebond.
  const indecMax = fvgLow + (fvgHigh - fvgLow) * 0.15;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.6) * 0.18 * m, target - 0.05, indecMax);
    past.push(candle(o, c, (0.14 + rng() * 0.1) * m, (0.14 + rng() * 0.1) * m));
    p = c;
  }
  // Future : cassure baissière du FVG (NO TRADE est confirmée par les faits)
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.12) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  void d;
  return finalize({
    past, future: fut,
    zones: [{ kind: "fvg", y1: fvgLow, y2: fvgHigh, label: "FVG haussier" }],
  });
}

function genCounterTrendBounce(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // HTF baissier clairement visible (downtrend en début de past). Rebond local
  // faible sur un niveau secondaire. Future : continuation baissière.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 8.5 + rng() * 0.3;
  // 8 candles downtrend
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.12 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const minorLevel = p;
  // 2 candles de rebond faible
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.2 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // 2 candles indécises
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (rng() - 0.45) * 0.4 * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  // Future : continue down
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.32 + rng() * 0.42) * m;
    fut.push(candle(o, c, (0.12 + rng() * 0.12) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  void d;
  return finalize({
    past, future: fut,
    zones: [{ kind: "support", y1: minorLevel - 0.1, y2: minorLevel + 0.1, label: "Niveau secondaire" }],
  });
}

function genDirtyRangeSweep(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // Range avec un sweep du haut + un sweep du bas, dernière candle au milieu.
  // Future : continue d'osciller (pas de biais directionnel, pas d'edge).
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const S = 1;
  const R = 6;
  const mid = (S + R) / 2;
  let p = mid;
  // 4 oscillations
  for (let i = 0; i < 4; i++) {
    const o = p;
    const drift = (rng() - 0.5) * 1.4 * m + (mid - o) * 0.2;
    const c = clamp(o + drift, S + 0.5, R - 0.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  // Sweep du haut (mèche dépasse R, close inside)
  const swHc = R - 0.7 - rng() * 0.3;
  const swH = { o: p, c: swHc, h: R + 1.0 * m + rng() * 0.3, l: Math.min(p, swHc) - 0.15 };
  past.push(swH); p = swH.c;
  // 3 oscillations
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.55) * 1.2 * m, S + 0.5, R - 0.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  // Sweep du bas (mèche descend sous S, close inside)
  const swLc = S + 0.7 + rng() * 0.3;
  const swL = { o: p, c: swLc, h: Math.max(p, swLc) + 0.15, l: S - 1.0 * m - rng() * 0.3 };
  past.push(swL); p = swL.c;
  // 3 oscillations, derniers candles ramenant au milieu
  for (let i = 0; i < 3; i++) {
    const o = p;
    const drift = (mid - o) * 0.4 + (rng() - 0.5) * 0.9 * m;
    // « Prix au milieu » : la dernière bougie revient dans le tiers central
    const c = i === 2 ? mid + (drift - (mid - o) * 0.4) * 0.3 : clamp(o + drift, S + 0.5, R - 0.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  // Future : continue à osciller
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.2 * m, S + 0.5, R - 0.5);
    fut.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  void d;
  return finalize({
    past, future: fut,
    zones: [
      { kind: "resistance",     y1: R - 0.15,         y2: R + 0.15,         label: "Haut du range"  },
      { kind: "support",        y1: S - 0.15,         y2: S + 0.15,         label: "Bas du range" },
      { kind: "liquidity_high", y1: R + 0.15,         y2: R + 1.0 * m,      label: "Sweep haut"     },
      { kind: "liquidity_low",  y1: S - 1.0 * m,      y2: S - 0.15,         label: "Sweep bas"      },
    ],
  });
}

function genToxicExecution(rng: () => number, m: number, d: Difficulty): BuySellChart {
  // Setup techniquement valide (pullback bull). Le past s'arrête juste après
  // le pullback (sans confirmation de reprise). Future : rallye (le setup
  // technique fonctionne). Le piège est dans le contexte d'exécution
  // (spread élevé + session morte) qui rend le R/R réel < 1 même si le
  // setup marche.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.12 + rng() * 0.14) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.2 + rng() * 0.32) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const pullbackLow = p;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.42) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.13 + rng() * 0.13) * m));
    p = c;
  }
  void d;
  return finalize({
    past, future: fut,
    zones: [
      { kind: "support", y1: pullbackLow - 0.35 * m, y2: pullbackLow + 0.2 * m, label: "Support" },
    ],
  });
}

// ─── Build chart depuis un setup ──────────────────────────────────────────────

/** Graphique converti à l'échelle de prix de l'actif (au dernier moment, pour l'affichage). */
export function withAssetPrices(chart: BuySellChart, inst: { asset: Asset; seed: number }): BuySellChart {
  const f = assetPriceMap(inst.asset, inst.seed, chart.past[chart.past.length - 1].c);
  return {
    ...chart,
    past:   chart.past.map(mapCandle(f)),
    future: chart.future.map(mapCandle(f)),
    zones:  chart.zones.map(mapZone(f)),
    domain: mapDomain(f, chart.domain),
  };
}

/** Graphique du scénario, avec la passe de réalisme des bougies (niveaux clés : les zones). */
export function buildChart(
  setup: SetupKey,
  seed: number,
  volatility: Volatility = "normale",
  difficulty: Difficulty = "intermediate",
  ctx: MarketCtx = {},
): BuySellChart {
  const ch = buildChartRaw(setup, seed, volatility, difficulty);
  const calm = setup === "trade_before_news";
  return realizeChart(ch, ch.zones.flatMap((z) => [z.y1, z.y2]), seed, { ...ctx, volatility, calmPast: calm, preNews: calm });
}

/** Graphique brut du scénario, avant la passe de réalisme (audits). */
export function buildChartRaw(
  setup: SetupKey,
  seed: number,
  volatility: Volatility = "normale",
  difficulty: Difficulty = "intermediate",
): BuySellChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[volatility];
  switch (setup) {
    case "breakout_bullish_clean":     return genBreakoutBull(rng, m, difficulty);
    case "breakout_bearish_clean":     return genBreakoutBear(rng, m, difficulty);
    case "false_breakout_bullish":     return genFalseBreakoutBull(rng, m, difficulty);
    case "false_breakout_bearish":     return genFalseBreakoutBear(rng, m, difficulty);
    case "pullback_bullish_trend":     return genPullbackBull(rng, m, difficulty);
    case "pullback_bearish_trend":     return genPullbackBear(rng, m, difficulty);
    case "rejection_resistance":       return genRejectionResistance(rng, m, difficulty);
    case "bounce_support":             return genBounceSupport(rng, m, difficulty);
    case "liquidity_sweep_reversal":   return genLiquiditySweep(rng, m, difficulty);
    case "fvg_reaction":               return genFvgReaction(rng, m, difficulty);
    case "trade_before_news":          return genTradeBeforeNews(rng, m, difficulty);
    case "range_no_opp":               return genRangeNoOpp(rng, m, difficulty);
    case "weak_breakout":              return genWeakBreakout(rng, m, difficulty);
    case "fvg_overmitigated":          return genFvgOvermitigated(rng, m, difficulty);
    case "counter_trend_bounce":       return genCounterTrendBounce(rng, m, difficulty);
    case "dirty_range_sweep":          return genDirtyRangeSweep(rng, m, difficulty);
    case "setup_toxic_execution":      return genToxicExecution(rng, m, difficulty);
  }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoreResult {
  correct:      boolean;
  points:       number;
  streakBonus:  number;
}

// Barème simple (décision PO) : bonne réponse +10, mauvaise 0, sans bonus ni malus.
export const POINTS_PER_CORRECT = 10;

// `currentStreak` est conservé dans la signature pour les appelants, sans effet sur les points.
export function scoreChoice(choice: GameChoice, correct: GameChoice, currentStreak: number): ScoreResult {
  void currentStreak;
  const ok = choice === correct;
  return { correct: ok, points: ok ? POINTS_PER_CORRECT : 0, streakBonus: 0 };
}

// ─── QA helpers exposés (utiles pour tests Playwright et auto-vérification) ──

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Débutant",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Signaux clairs, contexte guidé, peu de pièges. Pour acquérir les associations.",
  },
  intermediate: {
    label:       "Intermédiaire",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Contexte ambigu, faux breakouts possibles, plusieurs lectures plausibles. Interprétation.",
  },
  advanced: {
    label:       "Avancé",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Pièges, liquidité, sweeps, NO TRADE fréquent. Décision avant confirmation finale.",
  },
};
