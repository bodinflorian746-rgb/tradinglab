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
  VOL_MULT, mulberry32, pick, clamp, candle, chartDomain,
} from "./shared";

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
    context: "Le prix consolide sous une résistance majeure puis vient de la casser avec une bougie de force.",
    rationales: {
      BUY: "✓ Le HTF est haussier et le breakout est aligné. La résistance vient d'être franchie avec une bougie de force — c'est le scénario textbook de continuation. BUY est la suite logique du marché.",
      SELL: "✗ Vendre face à un breakout haussier sur HTF haussier = se placer à contre-courant sans signal de retournement. C'est typiquement un trade émotionnel.",
      NO_TRADE: "✗ Le setup est complet : breakout, HTF aligné, contexte macro sans danger. Passer son tour ici, c'est rater l'edge — pas de la discipline.",
    },
    lessons: {
      beginner:     "Règle simple : un breakout dans le sens du HTF, sans danger macro, c'est un trade. Pas plus compliqué.",
      intermediate: "Quand le HTF, la structure et le contexte s'alignent, l'edge est statistique. Ne pas trader cette config = laisser de l'argent sur la table.",
      advanced:     "Setups d'alignement clean comme celui-ci sont rares. Quand ils arrivent — taille pleine, pas de doute.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lecture", "breakout", "alignement HTF"],
  },
  {
    id: "breakout_bearish_clean",
    title: "Cassure baissière nette",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix consolide au-dessus d'un support majeur puis vient de le casser avec une bougie de force.",
    rationales: {
      BUY: "✗ Acheter sur une cassure de support en HTF baissier = combat le marché. Pas de signal de retournement, juste une accélération baissière.",
      SELL: "✓ Breakdown propre dans le sens du HTF baissier — momentum côté vendeur. SELL est la lecture juste.",
      NO_TRADE: "✗ HTF aligné + cassure propre + pas de news : la config est complète. Passer son tour ici n'est pas de la prudence.",
    },
    lessons: {
      beginner:     "Le miroir du breakout haussier : HTF baissier + support cassé = SELL.",
      intermediate: "Statistique de continuation après une cassure propre alignée HTF : ~65-70%. Prendre la trade.",
      advanced:     "Si le breakout est trop évident, méfie-toi du retest. Mais sur HTF aligné et structure claire, taille pleine, stop au-dessus du support cassé.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["lecture", "breakout", "alignement HTF"],
  },
  {
    id: "false_breakout_bullish",
    title: "Cassure haussière suspecte",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix vient de casser au-dessus d'une résistance — mais le HTF reste baissier. La cassure paraît suspecte.",
    rationales: {
      BUY: "✗ Tu suis le breakout sans regarder le HTF. Une cassure haussière en HTF baissier a 60-70% de chances d'être un piège à liquidité. C'est comme ça que les retails se font ramasser.",
      SELL: "✓ HTF baissier + breakout contre-tendance = setup de fakeout. La liquidité au-dessus de la résistance est le carburant des shorts institutionnels. SELL après le piège.",
      NO_TRADE: "≈ Pas une catastrophe (tu évites le piège), mais le HTF bearish + signal contre-tendance donnent un edge clair côté SELL. Un confirmé prend.",
    },
    lessons: {
      beginner:     "Règle d'or : un breakout CONTRE le HTF est presque toujours un piège. Si HTF baissier + breakout haussier → reste à l'écart ou cherche le SELL.",
      intermediate: "Le piège classique. Les institutionnels créent la cassure pour aspirer la liquidité des stops shorts au-dessus de la résistance, puis poussent dans le sens du HTF.",
      advanced:     "Tu n'as pas la confirmation du wick rejection ici — tu décides AVANT. Si HTF + macro le permettent, anticiper le fakeout est une edge majeure. Sinon NO TRADE.",
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
    context: "Le prix vient de casser sous un support — mais le HTF reste haussier. La cassure semble piégée.",
    rationales: {
      BUY: "✓ HTF haussier + breakout baissier contre-tendance = piège classique. La liquidité sous le support est ramassée pour préparer le mouvement haussier. BUY le retour.",
      SELL: "✗ Vendre sur cassure contre le HTF, c'est rejoindre les retails piégés. Statistiquement, ces fakeouts retournent dans le sens du HTF dans 60-70% des cas.",
      NO_TRADE: "≈ Évite la perte, mais rate l'opportunité. Le contre-pied du fakeout est une edge institutionnelle.",
    },
    lessons: {
      beginner:     "Cassure CONTRE le HTF = piège suspect. Ne vend jamais une cassure baissière dans un marché haussier.",
      intermediate: "Stop hunt sur les supports = signal de retournement haussier si HTF aligné. Le marché vient de récupérer du carburant pour pousser au nord.",
      advanced:     "Décide AVANT le retour de prix au-dessus du support. Si HTF + structure alignés, BUY. Si doute, NO TRADE.",
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
    context: "Tendance haussière établie, le prix corrige vers une zone de demande visible.",
    rationales: {
      BUY: "✓ Pullback dans une tendance = opportunité d'achat à meilleur prix. Tu rejoinz la tendance au lieu de la chasser. RR optimisé.",
      SELL: "✗ Vendre dans un uptrend, c'est ramer contre le courant. Les pullbacks sont des opportunités d'achat, pas de vente.",
      NO_TRADE: "≈ Conservateur, mais la config est propre. La discipline c'est de PRENDRE les bons trades, pas tous les éviter.",
    },
    lessons: {
      beginner:     "Une tendance, on l'achète dans les replis. Pas l'inverse. C'est le trade le plus rentable du marché.",
      intermediate: "Le pullback dans le sens du HTF, sur une zone de demande visible, est statistiquement l'un des meilleurs setups disponibles.",
      advanced:     "Profondeur du pullback ≠ invalidation. Tant que le HTF tient et la structure n'est pas cassée, le pullback est une opportunité.",
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
    context: "Tendance baissière établie, le prix rebondit vers une zone d'offre.",
    rationales: {
      BUY: "✗ Acheter le rebond dans un downtrend = chercher le bottom à la pince. Statistiquement perdant.",
      SELL: "✓ Le rebond ramène le prix sur une zone d'offre visible. Vendre dans le sens du HTF baissier au meilleur prix.",
      NO_TRADE: "≈ Pas faux, mais le HTF et la zone sont alignés. La discipline c'est de filtrer les trades, pas de tout éviter.",
    },
    lessons: {
      beginner:     "Tendance baissière → on cherche les rebonds pour vendre. On n'achète pas en pensant que ça va remonter.",
      intermediate: "Pullback sur zone d'offre dans un downtrend = setup haute probabilité. Ne pas le prendre c'est laisser l'edge.",
      advanced:     "Si la zone d'offre est cleanly retestée et HTF intact, le SELL est statistique. Si la structure se casse pendant le pullback, NO TRADE.",
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
    context: "Le prix vient d'arriver sur une résistance majeure après un rally. La zone a déjà rejeté plusieurs fois.",
    rationales: {
      BUY: "✗ Acheter sous une résistance majeure dans un HTF baissier, c'est espérer que LE niveau qui rejette à chaque fois ne rejettera pas cette fois.",
      SELL: "✓ Zone défendue par les vendeurs + HTF baissier = setup de retournement. SELL avec stop au-dessus de la zone.",
      NO_TRADE: "≈ Si tu attends une confirmation supplémentaire, ok. Mais HTF + zone alignés c'est généralement suffisant.",
    },
    lessons: {
      beginner:     "Résistance majeure + HTF baissier → SELL au prochain test. Le marché te donne deux raisons d'aller dans le même sens.",
      intermediate: "Les zones HTF retiennent plus que les zones LTF. Statistique de rejet sur résistance majeure HTF : 55-65% au premier test.",
      advanced:     "Si la zone a déjà été testée 3+ fois, méfie-toi de la cassure (chaque test affaiblit le niveau). À 1-2 tests dans le sens du HTF, taille pleine.",
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
      BUY: "✓ Support majeur + HTF haussier = zone d'achat. Les acheteurs défendent le niveau, le contexte est aligné. BUY avec stop sous la zone.",
      SELL: "✗ Vendre sous un support majeur défendu dans un HTF haussier, c'est se positionner contre l'edge. À éviter.",
      NO_TRADE: "≈ Pas faux d'attendre confirmation, mais le HTF + zone donnent généralement le signal.",
    },
    lessons: {
      beginner:     "Support majeur + HTF haussier → BUY. Symétrique du rejet de résistance.",
      intermediate: "Les zones HTF tiennent plus souvent qu'elles ne cassent (au premier test). C'est l'asymétrie qui crée l'edge.",
      advanced:     "Trade les supports HTF testés 1-2 fois max. Au-delà, le niveau s'affaiblit et le break-and-retest devient le scénario probable.",
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
    context: "Le prix vient de balayer la liquidité sous le précédent low avec une grosse mèche, puis a refermé au-dessus.",
    rationales: {
      BUY: "✓ Le sweep a pris la liquidité des shorts piégés. Maintenant l'institutionnel a son carburant pour pousser à la hausse. BUY le retournement.",
      SELL: "✗ Vendre APRÈS le sweep, c'est vendre exactement là où l'institutionnel achète. Tu rejoinz les retails piégés.",
      NO_TRADE: "≈ Si tu n'as pas confirmation post-sweep, NO TRADE est défensif. Mais la mèche + close au-dessus = signal valable.",
    },
    lessons: {
      beginner:     "Une grosse mèche qui balaie une zone puis retourne = retournement probable. Ne pas vendre le bas, l'acheter.",
      intermediate: "Pattern ICT classique : prise de liquidité avant continuation HTF. Le sweep est le déclencheur d'entrée.",
      advanced:     "Attend la confirmation post-sweep (close au-dessus du niveau cassé + structure haussière). Sans confirmation, anticipation = risque accru.",
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
      BUY: "✓ FVG haussier + HTF aligné + premier retest = zone de demande institutionnelle. Setup classique ICT.",
      SELL: "✗ Vendre sur un FVG haussier non-invalidé, c'est se placer contre la zone que les institutionnels protègent.",
      NO_TRADE: "≈ Si tu doutes de la mitigation, attendre la réaction est valide. Mais HTF aligné + zone fresh = edge.",
    },
    lessons: {
      beginner:     "Le FVG agit comme un aimant à prix puis comme une zone de demande au retest. Si HTF aligné → BUY.",
      intermediate: "Une zone totalement remplie n'est pas forcément invalidée. La réaction au retest est le vrai signal. Si réaction présente + HTF aligné → BUY.",
      advanced:     "Différencie : mitigation partielle (zone fresh) → BUY haute proba. Mitigation profonde (>75%) + perte de réaction → NO TRADE ou retournement.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["lecture", "FVG", "imbalance"],
  },
  {
    id: "trade_before_news",
    title: "News macro imminente",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "dangereux",
    metric: "discipline",
    context: "Une news macro majeure (NFP / FOMC / CPI) est attendue dans moins de 30 minutes. Le carnet est nerveux.",
    rationales: {
      BUY: "✗ Trader 30 min avant un NFP = jeter ton edge à la poubelle. Spread x3-x5, slippage massif, ton stop saute peu importe la direction. Aucun setup ne te sauve.",
      SELL: "✗ Même problème : le sens ne compte pas, c'est la VOLATILITÉ et le SPREAD qui te détruisent. Ton TP est valide mais ton stop sera explosé.",
      NO_TRADE: "✓ Décision pro. Pas de trade = pas de perte. La news passe, le marché retrouve sa structure, tu reviens dans 1h sur un graphique lisible.",
    },
    lessons: {
      beginner:     "Règle absolue : pas de trade dans les 30 min avant ET 15 min après une news majeure. Aucune exception.",
      intermediate: "Le spread peut tripler, ton SL saute par bid-ask, et la statistique du setup ne s'applique plus à un marché illiquide. L'attente est le trade.",
      advanced:     "Même si tu as un avis sur le résultat de la news, la volatilité d'exécution est ton ennemi. Si tu DOIS trader, c'est position size /3 et stop x2. Sinon NO TRADE.",
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
      BUY: "✗ Acheter au milieu d'un range = aucun edge. Pas de support testé, pas de signal, pas de catalyseur. Tu prends le risque sans la raison.",
      SELL: "✗ Idem côté short : pas de résistance testée, pas de signal. Gambling pur.",
      NO_TRADE: "✓ Le marché te dit 'rien à voir'. Les bons trades viendront aux bornes du range ou à la cassure. Patience.",
    },
    lessons: {
      beginner:     "Si tu ne peux pas expliquer en 1 phrase pourquoi le trade existe, il n'existe pas. NO TRADE.",
      intermediate: "Trader le milieu d'un range = appel d'aller chercher 1R risque pour 0.3R reward. Le range se trade aux bornes.",
      advanced:     "Discipline > activité. Un trader pro tradera 2-5 trades par semaine. Ne pas trader est aussi une décision pleine.",
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
    context: "Le prix vient de casser au-dessus de la résistance, mais la bougie de force manque cruellement de body.",
    shortContext: "Cassure haussière — body très faible.",
    rationales: {
      BUY: "✗ Tu chases une cassure faible. Sans bougie de momentum nette, la statistique de continuation chute à ~35%. Mauvais R/R espéré.",
      SELL: "✗ Vendre une cassure haussière sans signal de retournement = prématuré. Tu n'as ni reversal candle ni structure baissière.",
      NO_TRADE: "✓ Une cassure doit s'imposer pour être tradable. Sans bougie de force, on attend soit un retest propre, soit un follow-through clair. Patience.",
    },
    lessons: {
      beginner:     "Une grande bougie qui casse une zone = signal. Une petite bougie qui casse à peine = pas un signal.",
      intermediate: "Le marché ne te doit pas un signal propre à chaque cassure. Si la conviction manque, tu n'es pas obligé d'y aller.",
      advanced:     "Une cassure sans body est souvent un appât à liquidité. Les institutionnels créent ces breakouts faibles pour piéger les retails impatients. NO TRADE puis observation.",
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
    context: "Le FVG haussier a été mitigé sur 85%+ de sa hauteur. La réaction tarde — les acheteurs ne défendent plus la zone.",
    shortContext: "FVG mitigé à 85%+, pas de réaction.",
    rationales: {
      BUY: "✗ Tu pries pour le rebond. Une mitigation profonde sans réaction = FVG mort. Les acheteurs institutionnels ne défendent plus la zone.",
      SELL: "✗ Prématuré : pas de cassure structurelle confirmée encore. Tu shortes l'espoir, pas un signal.",
      NO_TRADE: "✓ Edge insuffisant. Attendre soit un rejet clair du bas du FVG (BUY confirmé), soit une cassure structurelle (SELL confirmé).",
    },
    lessons: {
      beginner:     "Si une zone tarde à réagir, elle perd son edge. Mieux vaut attendre la prochaine.",
      intermediate: "Une zone profondément mitigée perd statistiquement son edge. Si la réaction n'arrive pas dans les 2-3 bougies, la zone est cuite.",
      advanced:     "FVG mitigé 80%+ sans réaction = traque la cassure baissière pour SELL. Mais sans la cassure → NO TRADE.",
    },
    difficulties: ["advanced"],
    tags: ["lecture", "FVG", "mitigation"],
  },
  {
    id: "counter_trend_bounce",
    title: "Rebond local contre HTF",
    correctAnswer: "NO_TRADE",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "discipline",
    context: "HTF baissier net. Le prix rebondit localement sur un niveau secondaire — mais la tendance reste contre toi.",
    shortContext: "Rebond local dans un downtrend HTF.",
    rationales: {
      BUY: "✗ Trader contre la tendance HTF en pariant sur un niveau secondaire = jouer à 30-40% de proba. La statistique va contre toi avant même que tu cliques.",
      SELL: "✗ Pas le bon moment : le rebond local n'a pas montré de signe d'épuisement. Si tu shortes ici, 2-3 bougies vertes peuvent te sortir avant la reprise.",
      NO_TRADE: "✓ Setup local valide MAIS contre HTF = pas d'edge. Attendre l'épuisement du rebond ET une zone HTF claire pour shorter.",
    },
    lessons: {
      beginner:     "HTF baissier = tu cherches les SELL, jamais les BUY contre la tendance.",
      intermediate: "Un setup local n'efface jamais la tendance HTF. Si HTF dit non, tu ne dis pas oui — même si la zone locale tient.",
      advanced:     "Les rebonds dans un downtrend sont des opportunités de SHORT, pas de BUY. Mais attendre le timing — ici trop tôt, pas de wick de rejet sur résistance HTF.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["discipline", "HTF", "contre-tendance"],
  },
  {
    id: "dirty_range_sweep",
    title: "Range avec sweeps des deux côtés",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "Le prix vient de balayer les liquidités des deux bords du range. Aucune direction claire — l'accumulation institutionnelle est invisible.",
    shortContext: "Range avec sweep des deux bords.",
    rationales: {
      BUY: "✗ Pas de signal long. Le sweep récent du haut neutralise la zone basse comme support fiable. Pas d'edge.",
      SELL: "✗ Symétrique : le sweep récent du bas neutralise la zone haute. Le marché s'est nettoyé des deux côtés.",
      NO_TRADE: "✓ Range sale = pas de structure exploitable. Attendre une cassure confirmée OU une accumulation reconnaissable.",
    },
    lessons: {
      intermediate: "Quand un range a fait du sweep des deux côtés sans direction, attendre la sortie. Pas négociable.",
      advanced:     "Le double-sweep est de l'accumulation institutionnelle invisible. Le bon trader attend la sortie du range. La pire chose est de jouer le ping-pong.",
      beginner:     "Si tu vois des grosses mèches en haut ET en bas, et que le prix est au milieu, NO TRADE.",
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
    context: "Setup technique valide — mais le contexte d'exécution est défavorable : spread élevé, session morte, volatilité absente. Le R/R réel est divisé par 2.",
    shortContext: "Setup propre, mais spread élevé en session morte.",
    rationales: {
      BUY: "✗ Le signal est bon mais le contexte tue le R/R. Spread élevé + session morte = ton stop saute par bid-ask, ton TP devient inatteignable. La technique gagne, l'exécution perd.",
      SELL: "✗ À contre-HTF en plus du contexte d'exécution déjà toxique. Double erreur : tu trades contre la tendance ET en mauvaises conditions de liquidité.",
      NO_TRADE: "✓ Décision pro. Le même setup repassera en session Londres ou NY avec un spread propre. Tu ne perds rien à attendre.",
    },
    lessons: {
      intermediate: "Un beau setup en mauvaises conditions d'exécution n'est PAS un beau trade. Technique ET exécution doivent être alignées.",
      advanced:     "Spread x3 + volume mort = ton vrai R/R divisé par 2 même si le setup marche. Un trader pro intègre toujours l'exécution dans son edge.",
      beginner:     "Vérifie session + spread AVANT de cliquer. Un setup en heures mortes vaut souvent NO TRADE.",
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
const VOLATILITIES: readonly Volatility[] = ["faible", "normale", "élevée"];
const SPREADS: readonly Spread[] = ["faible", "élevé"];

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
      asset:      ov.asset      ?? pick(ASSETS, rng),
      session:    ov.session    ?? pick(SESSIONS, rng),
      volatility: ov.volatility ?? (candidate.macroContext === "dangereux" ? "élevée" : pick(VOLATILITIES, rng)),
      spread:     ov.spread     ?? (candidate.macroContext === "dangereux" ? "élevé"  : pick(SPREADS, rng)),
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
//   advanced     → trigger plus subtil, peut être ambigu (vrai/faux breakout
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
  const bC = R + (1.0 + rng() * 0.7) * m * bodyAmp(d);
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
  const bC = S - (1.0 + rng() * 0.7) * m * bodyAmp(d);
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
      { kind: "support",        y1: demandLow,         y2: demandHigh,         label: "Zone de demande" },
      { kind: "liquidity_high", y1: peak - 0.15,       y2: peak + 0.15,        label: "Précédent high"   },
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
      { kind: "resistance",    y1: offerLow,          y2: offerHigh,         label: "Zone d'offre" },
      { kind: "liquidity_low", y1: bottom - 0.15,     y2: bottom + 0.15,     label: "Précédent low" },
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
    past.push(candle(o, c, (1.0 + rng() * 0.4) * m * wickK, (0.2 + rng() * 0.2) * m));
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
    zones: [{ kind: "resistance", y1: R - 0.2, y2: R + 0.2, label: "Résistance HTF" }],
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
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (1.0 + rng() * 0.4) * m * wickK));
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
    zones: [{ kind: "support", y1: S - 0.2, y2: S + 0.2, label: "Support HTF" }],
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
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.8 * m, L + 0.5, L + 1.6);
    past.push(candle(o, c, (0.25 + rng() * 0.22) * m, (0.25 + rng() * 0.22) * m));
    p = c;
  }
  // Trigger : sweep candle (longue mèche basse) — module par difficulté
  const sO = p;
  const wickDown = (1.1 + rng() * 0.5) * m * wickAmp(d);
  const sC = d === "beginner"
    ? L + 0.4 + rng() * 0.3   // beginner : close clairement au-dessus du low
    : L + 0.15 + rng() * 0.25; // inter/adv : close juste au-dessus
  past.push({ o: sO, c: sC, h: sO + 0.2, l: L - wickDown });
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
      { kind: "support",       y1: L - 0.15,             y2: L + 0.15,             label: "Précédent low"     },
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
  const gapBottom = p + 0.25;
  const gO = p;
  const gC = p + (2.0 + rng() * 0.4) * m;
  past.push(candle(gO, gC, (0.3 + rng() * 0.2) * m, 0.12));
  p = gC;
  const gapTop = gO + 0.05;
  // 2 candles d'impulsion au-dessus du FVG
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // Pullback dans le FVG — profondeur variable par difficulté
  const pullbackTarget = d === "beginner"
    ? gapTop - 0.1                  // beginner : pullback peu profond (FVG fresh)
  : d === "intermediate"
    ? (gapBottom + gapTop) / 2      // intermediate : pullback à mi-FVG
    : gapBottom + 0.05;             // advanced : mitigation profonde (frôle le bas)
  const steps = d === "beginner" ? 3 : 4;
  for (let i = 0; i < steps; i++) {
    const o = p;
    const c = clamp(o - (0.3 + rng() * 0.3) * m, pullbackTarget, p + 0.2);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
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
    zones: [{ kind: "fvg", y1: gapBottom, y2: gapTop, label: "FVG haussier" }],
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
    let c = o + drift;
    c = clamp(c, S + 0.4, R - 0.4);
    past.push(candle(o, c, (0.25 + rng() * 0.28) * m, (0.25 + rng() * 0.28) * m));
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
      { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Plafond range"  },
      { kind: "support",    y1: S - 0.15, y2: S + 0.15, label: "Plancher range" },
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
    const c = clamp(o + (rng() - 0.45) * 0.6 * m, R - 1.1, R - 0.3);
    past.push(candle(o, c, (0.22 + rng() * 0.18) * m, (0.22 + rng() * 0.18) * m));
    p = c;
  }
  // Trigger : breakout TRÈS FAIBLE (juste au-dessus, body minuscule)
  const bO = p;
  const bC = R + 0.12 + rng() * 0.18;
  past.push(candle(bO, bC, (0.3 + rng() * 0.2) * m, 0.18));
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
  // Future : continue d'osciller (range sale, pas d'edge).
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
  const swH = { o: p, c: R - 0.7 - rng() * 0.3, h: R + 1.0 * m + rng() * 0.3, l: p - 0.15 };
  past.push(swH); p = swH.c;
  // 3 oscillations
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.55) * 1.2 * m, S + 0.5, R - 0.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  // Sweep du bas (mèche descend sous S, close inside)
  const swL = { o: p, c: S + 0.7 + rng() * 0.3, h: p + 0.15, l: S - 1.0 * m - rng() * 0.3 };
  past.push(swL); p = swL.c;
  // 3 oscillations, derniers candles ramenant au milieu
  for (let i = 0; i < 3; i++) {
    const o = p;
    const drift = (mid - o) * 0.4 + (rng() - 0.5) * 0.9 * m;
    const c = clamp(o + drift, S + 0.5, R - 0.5);
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
      { kind: "resistance",     y1: R - 0.15,         y2: R + 0.15,         label: "Plafond range"  },
      { kind: "support",        y1: S - 0.15,         y2: S + 0.15,         label: "Plancher range" },
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
      { kind: "support", y1: pullbackLow - 0.35 * m, y2: pullbackLow + 0.2 * m, label: "Zone de demande" },
    ],
  });
}

// ─── Build chart depuis un setup ──────────────────────────────────────────────

export function buildChart(
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

export function scoreChoice(choice: GameChoice, correct: GameChoice, currentStreak: number): ScoreResult {
  if (choice === correct) {
    const base = correct === "NO_TRADE" ? 120 : 100;
    const streakBonus = currentStreak >= 2 ? 30 : 0;
    return { correct: true, points: base + streakBonus, streakBonus };
  }
  if (correct === "NO_TRADE") {
    return { correct: false, points: -100, streakBonus: 0 };
  }
  return { correct: false, points: -50, streakBonus: 0 };
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
    description: "Contexte ambigu, fakeouts possibles, plusieurs lectures plausibles. Interprétation.",
  },
  advanced: {
    label:       "Avancé",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Pièges, liquidité, sweeps, NO TRADE fréquent. Décision avant confirmation finale.",
  },
};
