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
  VOL_MULT, mulberry32, clamp, candle, bullImpulse3, chartDomain, levelTouches, markPrevLow, rangeLegs, srGuards, withRoleChanges, naturalFuture,
} from "./shared";
import { withTracedZones, keepSwingTips } from "./zone-trace";
import type { NotionId } from "./notions";
import { BSNT_NEW } from "./bsnt-scenarios";
import { mirrorCandles, mirrorZones } from "./scenes";
import { breakStrayLevels } from "./stray-levels";
import { pickMarketContext, contextRule } from "./market-context";
import { pickRotation, type RotationHistory } from "./rotation";
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
  | "setup_toxic_execution"  // setup propre mais spread/session toxiques — NO TRADE
  // Scénarios construits sur les scènes partagées (lib/games/bsnt-scenarios.ts)
  | (string & {});

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
  // Pédagogie (lib/games/notions.ts) : notions utilisées, piège (intermédiaire), conflit (avancé)
  notions?:  readonly NotionId[];
  trap?:     string;
  conflict?: string;
  // Scénarios construits sur les scènes partagées : graphique et affirmations vérifiées
  build?:    (rng: () => number, m: number, d: Difficulty) => RawScenario;
  claims?:   Record<string, (ch: { past: Candle[]; future: Candle[]; zones: ChartZone[] }) => string | null>;
  /** Variante de sens d'un scénario existant : contrôlée par les affirmations de l'original, graphique renversé */
  mirrorOf?: SetupKey;
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

// ─── Variantes des scénarios existants (sens et issue) ───────────────────────
// Bâties sur les générateurs ci-dessous : `mirrorOf` = même graphique renversé, contrôlé par les
// affirmations du scénario d'origine (scripts/audit-jeux/coherence-bsnt.ts) ; textes propres.

const MIRROR_AXIS = 10;
const mirrorRaw = (r: RawScenario): RawScenario => ({ past: mirrorCandles(r.past, MIRROR_AXIS), future: mirrorCandles(r.future, MIRROR_AXIS), zones: mirrorZones(r.zones, MIRROR_AXIS) });
const oneLesson = (text: string) => ({ beginner: text, intermediate: text, advanced: text });

/** Pullback haussier dont la dernière bougie clôture sous l'ancienne résistance devenue support */
function genPullbackBroken(rng: () => number, m: number): RawScenario {
  // (tendance moins haute : l'impulsion n'écrase pas le reste du graphique)
  const t = trendRetest(rng, m, true, 4, 1.7);
  const past = t.past;
  let p = t.p;
  const c = t.lo - (0.3 + rng() * 0.15) * m;
  past.push({ o: p, c, h: p + (0.04 + rng() * 0.05) * m, l: c - (0.05 + rng() * 0.06) * m });
  p = c;
  const fut: Candle[] = [];
  for (let i = 0; i < 5; i++) { const o = p; const cc = o - (0.3 + rng() * 0.4) * m; fut.push(candle(o, cc, (0.1 + rng() * 0.15) * m, (0.12 + rng() * 0.18) * m)); p = cc; }
  return {
    past, future: fut,
    zones: [
      { kind: "support", y1: t.lo, y2: t.hi, label: "Support" },
      { kind: "liquidity_high", y1: t.peak - 0.15, y2: t.peak + 0.15, label: "Plus haut précédent" },
    ],
  };
}

const EXISTING_VARIANTS: ScenarioTemplate[] = [
  {
    id: "int_breakout_faible_baissier", title: "Breakout baissier faible", correctAnswer: "NO_TRADE", htfBias: "bearish", macroContext: "normal", metric: "piege",
    context: "UT supérieure baissière. Le prix vient de passer sous le support, mais la bougie de breakout n'a presque pas de corps.",
    shortContext: "Breakout du support sans corps.",
    rationales: {
      BUY: "✗ Le support vient d'être passé, dans le sens d'une UT supérieure baissière : acheter ici n'a pas d'argument.",
      SELL: "≈ L'UT supérieure plaide pour la vente, mais un breakout presque sans corps est souvent repris. Vendre maintenant, c'est parier sur une bougie qui ne montre pas de vendeurs décidés.",
      NO_TRADE: "✓ Un breakout se confirme par une clôture franche. Ici, la bougie n'a presque pas de corps : attendre une vraie clôture sous le support, ou un retest, est la décision logique.",
    },
    lessons: oneLesson("Un breakout valable clôture franchement au-delà du niveau, avec du corps. Une bougie de breakout sans corps, même dans le sens de l'UT supérieure, ne suffit pas (leçon Intermédiaire 6)."),
    notions: ["breakout", "zones_cles", "bougie"], trap: "La clôture sous le support, dans le sens de l'UT supérieure, ressemble à un breakout, mais la bougie n'a presque pas de corps.",
    difficulties: ["intermediate"], tags: ["breakout", "piège"], mirrorOf: "weak_breakout",
    build: (rng, m, d) => mirrorRaw(genWeakBreakout(rng, m, d)),
  },
  {
    id: "int_pullback_casse", title: "Pullback qui casse le support", correctAnswer: "NO_TRADE", htfBias: "bullish", macroContext: "normal", metric: "piege",
    context: "Tendance haussière : le prix corrige vers l'ancienne résistance, cassée, qui servait de support. La dernière bougie clôture nettement sous ce support.",
    shortContext: "Le pullback clôture sous le support.",
    rationales: {
      BUY: "✗ C'était l'endroit idéal pour acheter le pullback, mais la clôture sous le support invalide le scénario : l'ancienne résistance ne joue plus son rôle.",
      SELL: "≈ La structure haussière vient d'être abîmée, mais vendre contre une UT supérieure haussière, sur une seule clôture, reste un pari.",
      NO_TRADE: "✓ Le pullback devait tenir sur l'ancienne résistance. La clôture dessous casse le scénario d'achat sans offrir un vrai scénario de vente : attendre est la décision logique.",
    },
    lessons: oneLesson("Un pullback s'achète tant que le niveau tient. Une clôture sous l'ancienne résistance devenue support invalide le scénario : on ne force pas l'achat (leçons Intermédiaire 3 et 4)."),
    notions: ["pullback", "changement_role", "tendance"], trap: "Le prix revient sur l'ancienne résistance, l'endroit idéal du pullback, mais la dernière bougie clôture dessous.",
    difficulties: ["intermediate"], tags: ["pullback", "support cassé"],
    build: (rng, m) => genPullbackBroken(rng, m),
    claims: {
      "tendance haussière établie (plus haut précédent au-dessus du support)": (ch) => { const s = ch.zones.find((z) => z.kind === "support")!; const pk = ch.zones.find((z) => z.label === "Plus haut précédent")!; return Math.min(pk.y1, pk.y2) > Math.max(s.y1, s.y2) + 1 ? null : "pas de tendance au-dessus du support"; },
      "dernière bougie : clôture sous le support": (ch) => { const s = ch.zones.find((z) => z.kind === "support")!; const k = ch.past[ch.past.length - 1]; return k.c < Math.min(s.y1, s.y2) ? null : "la dernière bougie ne clôture pas sous le support"; },
    },
  },
  {
    id: "adv_sweep_haut", title: "Sweep du plus haut", correctAnswer: "SELL", htfBias: "bearish", macroContext: "normal", metric: "piege",
    context: "Le prix vient de balayer la liquidité au-dessus du plus haut précédent avec une grosse mèche, puis a refermé en dessous.",
    shortContext: "Sweep du plus haut, clôture revenue dessous.",
    rationales: {
      BUY: "✗ Acheter APRÈS le sweep revient à acheter là où les gros vendeurs entrent souvent : la mèche a pris les stops des vendeurs, la clôture est revenue sous le niveau.",
      SELL: "✓ Le sweep a pris la liquidité au-dessus du plus haut, puis le prix est revenu dessous, dans le sens d'une UT supérieure baissière. Un SELL, stop au-dessus de la mèche, se défend.",
      NO_TRADE: "≈ Sans confirmation, attendre reste défensif. Mais la mèche et la clôture sous le niveau forment déjà un signal crédible.",
    },
    lessons: oneLesson("Une grosse mèche qui balaie le plus haut précédent puis revient dessous prend la liquidité des acheteurs piégés. Dans le sens de l'UT supérieure, c'est un signal de retournement crédible (leçon Avancé 1)."),
    notions: ["sweep", "liquidite", "multi_ut"], conflict: "Mèche contre clôture : la mèche au-dessus du plus haut ressemble à un breakout haussier, la clôture revenue dessous dit l'inverse.",
    difficulties: ["advanced"], tags: ["sweep", "liquidité"], mirrorOf: "liquidity_sweep_reversal",
    build: (rng, m, d) => mirrorRaw(genLiquiditySweep(rng, m, d)),
  },
  {
    id: "adv_fvg_baissier", title: "Réaction sur un FVG baissier", correctAnswer: "SELL", htfBias: "bearish", macroContext: "normal", metric: "lecture",
    context: "Un FVG baissier a été laissé par l'impulsion. Le prix remonte le tester pour la première fois.",
    shortContext: "Premier test d'un FVG baissier.",
    rationales: {
      BUY: "✗ Acheter le rebond vers le FVG, contre une UT supérieure baissière, revient à acheter là où les vendeurs ont laissé un déséquilibre à défendre.",
      SELL: "✓ Premier retour dans un FVG baissier, dans le sens de l'UT supérieure : les vendeurs y reviennent souvent. Un SELL, stop au-dessus du FVG, se défend.",
      NO_TRADE: "≈ Attendre une réaction se comprend, mais un premier test du FVG dans le sens de l'UT supérieure est déjà le scénario de la leçon 2.",
    },
    lessons: oneLesson("Un FVG pas encore testé, dans le sens de l'UT supérieure, est une zone de continuation probable : on vend son premier retest, stop au-delà de la zone (leçon Avancé 2)."),
    notions: ["fvg", "multi_ut", "pullback"], conflict: "Le rebond vers le FVG ressemble à un début de retournement ; l'UT supérieure baissière et le déséquilibre pas encore testé disent continuation.",
    difficulties: ["advanced"], tags: ["FVG", "continuation"], mirrorOf: "fvg_reaction",
    build: (rng, m, d) => mirrorRaw(genFvgReaction(rng, m, d)),
  },
];

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: "breakout_bullish_clean",
    title: "Breakout haussier net",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix consolide sous une résistance puis vient de la casser avec une bougie de displacement.",
    rationales: {
      BUY: "✓ Ici, l'UT supérieure est haussière et le breakout va dans son sens. La résistance vient d'être franchie avec une bougie de displacement : c'est un scénario de continuation typique. Dans ce cas, un BUY est la lecture la plus logique.",
      SELL: "✗ Vendre face à un breakout haussier, sur une UT supérieure haussière, revient ici à se placer à contre-courant sans signal de retournement. Ce type de trade est souvent émotionnel.",
      NO_TRADE: "✗ Ici, le setup coche les critères : breakout, UT supérieure alignée, contexte macro sans danger. Passer son tour dans ce cas ressemble plus à une occasion manquée qu'à de la discipline.",
    },
    lessons: {
      beginner:     "Repère simple : un breakout dans le sens de l'UT supérieure, sans danger macro, peut constituer un trade valable. Dans ce cas, pas besoin de chercher plus compliqué.",
      intermediate: "Quand l'UT supérieure, la structure et le contexte s'alignent, l'avantage devient statistique. Ce type de setup peut mériter une place dans ton plan de trading.",
      advanced:     "Les setups d'alignement aussi propres sont plutôt rares. Quand ils se présentent, la taille se décide selon ton plan de gestion du risque, pas à l'instinct.",
    },
    notions: ["breakout", "multi_ut", "support_resistance"],
    trap: "Les deux rejets passés sous la résistance font croire à un niveau qui tient : la clôture franche au-dessus les annule.",
    difficulties: ["intermediate"],
    tags: ["lecture", "breakout", "alignement de l'UT supérieure"],
  },
  {
    id: "breakout_bearish_clean",
    title: "Breakout baissier net",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix consolide au-dessus d'un support puis vient de le casser avec une bougie de displacement.",
    rationales: {
      BUY: "✗ Acheter un breakout de support sur une UT supérieure baissière revient ici à aller contre le marché. Aucun signal de retournement n'apparaît, seulement une accélération baissière.",
      SELL: "✓ Breakout propre dans le sens baissier de l'UT supérieure, avec un momentum côté vendeur. Ici, un SELL est la lecture la plus cohérente.",
      NO_TRADE: "✗ UT supérieure alignée, breakout propre, pas de news : ici, le setup semble complet. Passer son tour dans ce cas relève moins de la prudence que de l'hésitation.",
    },
    lessons: {
      beginner:     "Le miroir du breakout haussier : avec une UT supérieure baissière et un support cassé, un SELL reste cohérent avec le scénario, si ça correspond à ton plan.",
      intermediate: "Après un breakout propre aligné avec l'UT supérieure, la continuation est souvent le scénario majoritaire. Bon raisonnement : ce setup coche les critères. En conditions réelles, la décision finale dépend de ton plan.",
      advanced:     "Si le breakout paraît trop évident, méfie-toi du retest. Sur une UT supérieure alignée avec une structure claire, la taille suit ton plan de gestion du risque, et un stop au-dessus du support cassé est une option logique.",
    },
    notions: ["breakout", "multi_ut", "support_resistance"],
    trap: "Les deux rebonds passés sur le support font croire à un niveau qui tient : la clôture franche en dessous les annule.",
    difficulties: ["intermediate"],
    tags: ["lecture", "breakout", "alignement de l'UT supérieure"],
  },
  {
    id: "false_breakout_bullish",
    title: "Breakout haussier suspect",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix vient de clôturer juste au-dessus d'une résistance, mais la bougie laisse une longue mèche haute dans la liquidité, et l'UT supérieure reste baissière.",
    rationales: {
      BUY: "✗ Ici, tu suis le breakout sans regarder l'UT supérieure. Un breakout haussier sur une UT supérieure baissière peut souvent être un piège à liquidité : c'est un scénario où beaucoup de traders se font piéger.",
      SELL: "✓ Ici, UT supérieure baissière et breakout contre-tendance peuvent signaler un faux breakout. La liquidité au-dessus de la résistance sert souvent de carburant aux vendeurs. Un SELL après le piège se défend.",
      NO_TRADE: "≈ Pas une catastrophe (tu évites le piège), mais ici l'UT supérieure baissière et le signal contre-tendance donnent un avantage plutôt clair côté SELL. Un trader expérimenté pourrait le prendre.",
    },
    lessons: {
      beginner:     "Repère utile : un breakout CONTRE l'UT supérieure est souvent un piège. Dans ce cas (UT supérieure baissière, breakout haussier), rester à l'écart ou chercher le SELL sont deux options logiques.",
      intermediate: "Un piège classique : le breakout peut servir à aspirer la liquidité des stops placés au-dessus de la résistance, avant une reprise dans le sens de l'UT supérieure.",
      advanced:     "Ici, tu n'as pas encore la confirmation par la mèche de rejet : tu décides AVANT. Si l'UT supérieure et la macro le permettent, anticiper le faux breakout peut être un vrai avantage. Sinon, NO TRADE se défend.",
    },
    notions: ["faux_breakout", "multi_ut", "support_resistance"],
    conflict: "La clôture au-dessus de la résistance ressemble à un breakout ; la longue mèche dans la liquidité et l'UT supérieure baissière disent piège.",
    difficulties: ["advanced"],
    tags: ["piège", "fakeout", "liquidité"],
  },
  {
    id: "false_breakout_bearish",
    title: "Breakout baissier suspect",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix vient de clôturer juste sous un support, mais la bougie laisse une longue mèche basse dans la liquidité, et l'UT supérieure reste haussière.",
    rationales: {
      BUY: "✓ Ici, UT supérieure haussière et breakout baissier contre-tendance peuvent signaler un piège. La liquidité sous le support est souvent ramassée avant le mouvement haussier. Un BUY sur le retour se défend.",
      SELL: "✗ Vendre un breakout contre l'UT supérieure revient ici à rejoindre les vendeurs piégés. Ces faux breakouts repartent souvent dans le sens de l'UT supérieure.",
      NO_TRADE: "≈ Tu évites la perte, mais tu passes à côté de l'opportunité. Ici, jouer le contre-pied du faux breakout était une option logique.",
    },
    lessons: {
      beginner:     "Un breakout CONTRE l'UT supérieure peut être un piège. Vendre un breakout baissier dans un marché haussier reste, dans la plupart des cas, un pari risqué.",
      intermediate: "Ici, la chasse aux stops sous le support peut signaler un retournement haussier si l'UT supérieure est alignée, à confirmer avant d'agir. Le marché vient peut-être de récupérer du carburant pour monter.",
      advanced:     "Ici, tu décides AVANT le retour du prix au-dessus du support. Si l'UT supérieure et la structure sont alignés, un BUY se défend. En cas de doute, NO TRADE reste une option logique.",
    },
    notions: ["faux_breakout", "multi_ut", "support_resistance"],
    conflict: "La clôture sous le support ressemble à un breakout ; la longue mèche dans la liquidité et l'UT supérieure haussière disent piège.",
    difficulties: ["advanced"],
    tags: ["piège", "fakeout", "liquidité"],
  },
  {
    id: "pullback_bullish_trend",
    title: "Pullback en tendance haussière",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Tendance haussière établie, le prix corrige vers une ancienne résistance, cassée, qui sert maintenant de support.",
    rationales: {
      BUY: "✓ Ici, le pullback dans la tendance offre une opportunité d'achat à meilleur prix. Tu rejoins la tendance au lieu de la poursuivre, avec souvent un meilleur R/R.",
      SELL: "✗ Vendre dans une tendance haussière revient souvent à ramer contre le courant. Ici, le pullback ressemble plus à une opportunité d'achat qu'à un signal de vente.",
      NO_TRADE: "≈ Prudent, mais ici le setup est propre. La discipline consiste aussi à prendre les bons trades, pas seulement à les éviter.",
    },
    lessons: {
      beginner:     "Dans une tendance haussière, les replis sont souvent les meilleurs moments pour acheter, plutôt que l'inverse. C'est l'un des trades les plus courants chez les traders de tendance.",
      intermediate: "Un pullback dans le sens de l'UT supérieure, sur une ancienne résistance devenue support, compte souvent parmi les setups les plus solides.",
      advanced:     "Un pullback profond n'invalide pas forcément le scénario. Tant que l'UT supérieure tient et que la structure n'est pas cassée, le pullback peut rester une opportunité.",
    },
    notions: ["pullback", "changement_role", "tendance"],
    trap: "Les bougies rouges de la correction font croire à un retournement, alors que la structure reste haussière.",
    difficulties: ["intermediate"],
    tags: ["lecture", "pullback", "trend"],
  },
  {
    id: "pullback_bearish_trend",
    title: "Pullback en tendance baissière",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Tendance baissière établie, le prix rebondit vers un ancien support, cassé, qui sert maintenant de résistance.",
    rationales: {
      BUY: "✗ Acheter le rebond dans une tendance baissière revient ici à chercher le plus bas. Ce type de trade est souvent perdant.",
      SELL: "✓ Ici, le rebond ramène le prix sur cet ancien support devenu résistance. Vendre dans le sens baissière de l'UT supérieure, à un meilleur prix, est une option logique.",
      NO_TRADE: "≈ Pas faux, mais ici l'UT supérieure et la zone sont alignés. La discipline consiste à filtrer les trades, pas à tous les éviter.",
    },
    lessons: {
      beginner:     "En tendance baissière, on cherche plutôt les rebonds pour vendre. Acheter en espérant une remontée va souvent contre le marché.",
      intermediate: "Ici, un pullback sur une résistance dans une tendance baissière peut constituer un setup à bonne probabilité, à considérer selon ton plan de trading.",
      advanced:     "Si l'ancien support est retesté proprement par en dessous et que l'UT supérieure reste intacte, le SELL se défend. Si la structure casse pendant le pullback, NO TRADE devient l'option logique.",
    },
    notions: ["pullback", "changement_role", "tendance"],
    trap: "Les bougies vertes du rebond font croire à un retournement, alors que la structure reste baissière.",
    difficulties: ["intermediate"],
    tags: ["lecture", "pullback", "trend"],
  },
  {
    id: "rejection_resistance",
    title: "Test d'une résistance de l'UT supérieure",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix vient d'arriver sur une résistance de l'UT supérieure après une forte hausse. La zone a déjà rejeté plusieurs fois.",
    rationales: {
      BUY: "✗ Acheter sous une résistance de l'UT supérieure, sur une UT supérieure baissière, revient ici à espérer que le niveau qui a rejeté le prix jusqu'ici ne le rejette pas cette fois.",
      SELL: "✓ Ici, une zone défendue par les vendeurs et une UT supérieure baissière peuvent signaler un retournement. Un SELL avec un stop au-dessus de la zone est une option logique.",
      NO_TRADE: "≈ Attendre une confirmation supplémentaire se comprend. Mais ici, une UT supérieure et une zone alignées suffisent souvent.",
    },
    lessons: {
      beginner:     "Résistance de l'UT supérieure et UT supérieure baissière : un SELL reste cohérent avec le scénario, si ça correspond à ton plan. Le marché te donne ici deux raisons d'aller dans le même sens.",
      intermediate: "Les zones de l'UT supérieure tiennent souvent mieux que les zones de l'UT inférieure. Au premier test d'une résistance de l'UT supérieure, un rejet est fréquent, sans être systématique.",
      advanced:     "Si la zone a déjà été testée 3 fois ou plus, méfie-toi du breakout (chaque test peut affaiblir le niveau). À 1 ou 2 tests dans le sens de l'UT supérieure, la taille dépend de ton plan de gestion du risque.",
    },
    notions: ["zones_cles", "multi_ut", "support_resistance"],
    trap: "La forte hausse qui précède pousse à acheter, sous une résistance de l'UT supérieure qui a déjà rejeté le prix.",
    difficulties: ["intermediate"],
    tags: ["lecture", "rejet", "résistance"],
  },
  {
    id: "bounce_support",
    title: "Test d'un support de l'UT supérieure",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix revient sur un support de l'UT supérieure après une correction. La zone a déjà tenu plusieurs fois.",
    rationales: {
      BUY: "✓ Ici, un support de l'UT supérieure et une UT supérieure haussière dessinent une zone d'achat. Les acheteurs défendent le niveau et le contexte est aligné. Un BUY avec un stop sous la zone est une option logique.",
      SELL: "✗ Vendre sur un support de l'UT supérieure défendu, sur une UT supérieure haussière, revient ici à se positionner contre l'avantage statistique. Dans ce cas, mieux vaut s'abstenir.",
      NO_TRADE: "≈ Attendre une confirmation n'est pas faux, mais ici l'UT supérieure et la zone donnent souvent déjà le signal.",
    },
    lessons: {
      beginner:     "Support de l'UT supérieure et UT supérieure haussière : un BUY reste cohérent avec le scénario, si ça correspond à ton plan. C'est le symétrique du rejet de résistance.",
      intermediate: "Au premier test, les zones de l'UT supérieure tiennent souvent plus qu'elles ne cassent. C'est cette asymétrie qui peut créer un avantage.",
      advanced:     "Les supports de l'UT supérieure testés 1 ou 2 fois sont souvent les plus fiables. Au-delà, le niveau peut s'affaiblir et le scénario breakout puis retest devient plus probable.",
    },
    notions: ["zones_cles", "multi_ut", "support_resistance"],
    trap: "La correction qui précède pousse à vendre, sur un support de l'UT supérieure qui a déjà tenu.",
    difficulties: ["intermediate"],
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
    notions: ["sweep", "liquidite", "multi_ut"],
    conflict: "Mèche contre clôture : la mèche sous le plus bas précédent ressemble à un breakout baissier, la clôture revenue au-dessus dit l'inverse.",
    difficulties: ["advanced"],
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
    notions: ["fvg", "multi_ut", "pullback"],
    conflict: "Le repli vers le FVG ressemble à un début de retournement ; l'UT supérieure haussière et le déséquilibre pas encore testé disent continuation.",
    difficulties: ["advanced"],
    tags: ["lecture", "FVG", "imbalance"],
  },
  {
    id: "trade_before_news",
    title: "News macro imminente",
    correctAnswer: "NO_TRADE",
    htfBias: "bullish",
    macroContext: "dangereux",
    metric: "discipline",
    context: "L'UT supérieure est haussière et le repli vient de reprendre : le setup d'achat paraît propre. Mais une news macro majeure (NFP / FOMC / CPI) est attendue dans moins de 30 minutes.",
    shortContext: "Setup d'achat propre, news majeure dans moins de 30 minutes.",
    rationales: {
      BUY: "✗ Le setup est propre et dans le sens de l'UT supérieure, mais trader 30 min avant un NFP expose ici ton edge à un risque élevé : spread 3 à 5 fois plus large que d'habitude, slippage important, stop qui peut sauter quelle que soit la direction. Dans ce cas, le setup pèse peu.",
      SELL: "✗ Même problème : ici, le sens compte moins que la VOLATILITÉ et le SPREAD. Ton TP peut être valide, mais ton stop risque fort d'être dépassé.",
      NO_TRADE: "✓ Décision de pro. Sans trade, pas de perte. Une fois la news passée, le marché retrouve souvent sa structure, et tu peux revenir dans 1h sur un graphique lisible.",
    },
    lessons: {
      beginner:     "Repère prudent : éviter de trader dans les 30 min avant et les 15 min après une news majeure. Beaucoup de traders en font une règle de leur plan.",
      intermediate: "Le spread peut tripler, ton SL peut sauter à cause du bid-ask, et les statistiques du setup s'appliquent mal à un marché illiquide. Ici, attendre est souvent le meilleur choix.",
      advanced:     "Même avec un avis sur le résultat de la news, la volatilité d'exécution joue contre toi. Si tu tiens à trader, une option logique consiste à diviser la taille par 3 et doubler le stop. Sinon, NO TRADE.",
    },
    notions: ["news", "killzones"],
    conflict: "Un setup technique propre contre une news majeure dans moins de 30 minutes.",
    difficulties: ["advanced"],
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
      NO_TRADE: "✓ Ici, le marché n'offre rien de lisible. Les bons trades viendront plutôt aux bornes du range ou au breakout. Patience.",
    },
    lessons: {
      beginner:     "Si tu ne peux pas expliquer en une phrase pourquoi le trade existe, il vaut souvent mieux ne pas le prendre. Ici, NO TRADE.",
      intermediate: "Trader le milieu d'un range revient souvent à risquer 1 pour gagner environ 0,3 (un R/R d'environ 1:0,3). Un range se trade plutôt à ses bornes.",
      advanced:     "La discipline compte plus que l'activité. Beaucoup de traders expérimentés filtrent fortement leurs entrées. Ne pas trader est aussi une décision à part entière.",
    },
    notions: ["range", "zones_cles"],
    trap: "Les bornes du range attirent l'œil, mais le prix est au milieu, loin de chacune.",
    difficulties: ["intermediate"],
    tags: ["discipline", "range", "patience"],
  },
  // ─── V3 — setups réalistes piège mental ─────────────────────────────────────
  {
    id: "weak_breakout",
    title: "Breakout sans conviction",
    correctAnswer: "NO_TRADE",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "discipline",
    context: "UT supérieure haussière. Le prix vient de casser au-dessus de la résistance, mais la bougie de breakout a très peu de corps.",
    shortContext: "Breakout dans le sens de l'UT supérieure, corps très faible.",
    rationales: {
      BUY: "✗ Ici, tu poursuis un breakout faible. Sans bougie de momentum nette, la continuation devient nettement moins probable, et le R/R espéré se dégrade.",
      SELL: "✗ Vendre un breakout haussier sans signal de retournement paraît ici prématuré : il n'y a ni bougie de retournement ni structure baissière.",
      NO_TRADE: "✓ Même dans le sens de l'UT supérieure, un breakout gagne à s'imposer pour être tradable. Sans bougie de displacement, une option logique consiste à attendre un retest propre ou une continuation claire. Patience.",
    },
    lessons: {
      beginner:     "Une grande bougie qui casse une zone apporte une confirmation forte. Une petite bougie qui casse à peine reste une confirmation faible, souvent insuffisante pour agir.",
      intermediate: "Le marché ne donne pas un signal propre à chaque breakout. Si la conviction manque, rien ne t'oblige à y aller.",
      advanced:     "Un breakout sans corps sert souvent d'appât à liquidité : ces breakouts faibles piègent régulièrement les traders impatients. Ici, NO TRADE puis observation est une option logique.",
    },
    notions: ["breakout", "zones_cles", "bougie"],
    trap: "La clôture au-dessus de la résistance ressemble à un breakout, mais la bougie n'a presque pas de corps.",
    difficulties: ["intermediate"],
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
      advanced:     "Un FVG mitigé à plus de 80 % sans réaction peut orienter vers la recherche d'un breakout baissier pour un SELL. Sans ce breakout, NO TRADE reste l'option logique.",
    },
    notions: ["fvg", "multi_ut"],
    conflict: "UT supérieure haussière et FVG haussier, mais la zone est presque entièrement comblée sans réaction : elle ne défend plus.",
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
    context: "UT supérieure baissière nette. Le prix rebondit localement sur un support, mais la tendance reste contre toi.",
    shortContext: "Rebond local dans une tendance baissière de l'UT supérieure.",
    rationales: {
      BUY: "✗ Trader contre la tendance de l'UT supérieure en misant sur ce support local revient ici à jouer une probabilité faible. Les statistiques jouent souvent contre toi avant même le clic.",
      SELL: "✗ Pas le bon moment : ici, le rebond local ne montre pas encore de signe d'épuisement. En vendant maintenant, 2-3 bougies vertes peuvent te sortir avant la reprise.",
      NO_TRADE: "✓ Le setup local tient, MAIS il va contre l'UT supérieure : ici, l'avantage manque. Une option logique consiste à attendre l'épuisement du rebond et une zone claire de l'UT supérieure pour vendre.",
    },
    lessons: {
      beginner:     "Avec une UT supérieure baissière, on cherche plutôt les SELL ; les BUY contre la tendance restent des paris risqués.",
      intermediate: "Un setup local n'efface pas la tendance de l'UT supérieure. Si l'UT supérieure va contre toi, il vaut souvent mieux s'abstenir, même si la zone locale tient.",
      advanced:     "Dans une tendance baissière, les rebonds offrent plutôt des opportunités de SELL que de BUY. Mais le timing compte : ici, c'est trop tôt, aucune mèche de rejet ne montre encore les vendeurs.",
    },
    notions: ["multi_ut", "pullback", "support_resistance"],
    trap: "Le rebond local sur le support ressemble à un achat, contre une UT supérieure baissière.",
    difficulties: ["intermediate"],
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
      NO_TRADE: "✓ Ici, aucun biais directionnel ne se dégage, donc pas de structure exploitable. Une option logique : attendre un breakout confirmé ou une accumulation reconnaissable.",
    },
    lessons: {
      intermediate: "Quand un range a balayé les deux côtés sans direction, attendre la sortie est souvent la décision la plus sage.",
      advanced:     "Un double sweep peut traduire une accumulation discrète. Dans ce cas, attendre la sortie du range se défend ; jouer le ping-pong à l'intérieur est souvent coûteux.",
      beginner:     "Si tu vois de grosses mèches en haut ET en bas, avec un prix au milieu, NO TRADE est souvent l'option logique.",
    },
    notions: ["sweep", "range", "liquidite"],
    conflict: "Deux sweeps opposés (haut puis bas du range) : chaque côté a été piégé, aucune direction ne domine.",
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
    notions: ["killzones", "spread", "pullback"],
    conflict: "Un pullback technique valide contre une exécution toxique : spread élevé, heures creuses, volatilité absente.",
    difficulties: ["advanced"],
    tags: ["discipline", "execution", "spread"],
    metaOverride: {
      session:    "Heures mortes",
      volatility: "faible",
      spread:     "élevé",
    },
  },
  // Scénarios construits sur les scènes partagées
  ...EXISTING_VARIANTS,
  ...(BSNT_NEW as ScenarioTemplate[]),
];

// ─── Variations ───────────────────────────────────────────────────────────────

const ASSETS: readonly Asset[] = ["XAU/USD", "EUR/USD", "NASDAQ"];
const SESSIONS: readonly Session[] = ["Asie", "Londres", "New York"];

/** Scénarios du niveau (rotation, historique local). */
export function scenarioPool(difficulty: Difficulty) {
  return SCENARIO_TEMPLATES.filter((t) => t.difficulties.includes(difficulty));
}

export function generateScenarios(seed: number, difficulty: Difficulty = "intermediate", history?: RotationHistory): ScenarioInstance[] {
  const rng = mulberry32(seed);
  const pool = scenarioPool(difficulty);
  // Jamais deux fois le même scénario dans une partie ; d'une partie à l'autre,
  // les scénarios pas encore joués du niveau passent d'abord (lib/games/rotation.ts).
  const picked = pickRotation(pool, ROUNDS_PER_SESSION, rng, history);
  const out: ScenarioInstance[] = [];
  for (let i = 0; i < picked.length; i++) {
    const candidate = picked[i];
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
  // La résistance est prouvée : deux rejets avant la cassure
  const h = levelTouches(rng, R - (2.4 + rng() * 0.5) * m, R - 0.15, R + 0.15, "below", m);
  past.push(...h.candles);
  let p = h.p;
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
    zones: [{ kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Résistance cassée" }],
  });
}

function genBreakoutBear(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const S = 0;
  // Le support est prouvé : deux rebonds avant la cassure
  const h = levelTouches(rng, S + (2.4 + rng() * 0.5) * m, S - 0.15, S + 0.15, "above", m);
  past.push(...h.candles);
  let p = h.p;
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
    zones: [{ kind: "support", y1: S - 0.15, y2: S + 0.15, label: "Support cassé" }],
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
  // La résistance est prouvée : deux rejets avant la fausse cassure
  const h = levelTouches(rng, R - (2.4 + rng() * 0.5) * m, R - 0.15, R + 0.15, "below", m);
  past.push(...h.candles);
  let p = h.p;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.0 * m, R - 1.4, R - 0.3);
    past.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  // approche jusque sous la résistance : la bougie de cassure garde un corps plus court que sa mèche
  if (p < R - 0.55 * m) { const c = R - (0.3 + rng() * 0.15) * m; past.push(candle(p, c, (0.1 + rng() * 0.1) * m, (0.15 + rng() * 0.15) * m)); p = c; }
  // Trigger candle : breakout au-dessus de la résistance
  const bO = p;
  // Scénario Avancé : clôture juste au-dessus de la résistance, longue mèche haute dans la liquidité
  // (le conflit se lit : clôture de breakout contre mèche de rejet, et UT supérieure baissière)
  void d;
  const wickHigh = (0.95 + rng() * 0.3) * m;
  const bC = R + 0.27 + rng() * 0.12;
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
  // Le support est prouvé : deux rebonds avant la fausse cassure
  const h = levelTouches(rng, S + (2.4 + rng() * 0.5) * m, S - 0.15, S + 0.15, "above", m);
  past.push(...h.candles);
  let p = h.p;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.0 * m, S + 0.3, S + 1.4);
    past.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  if (p > S + 0.55 * m) { const c = S + (0.3 + rng() * 0.15) * m; past.push(candle(p, c, (0.15 + rng() * 0.15) * m, (0.1 + rng() * 0.1) * m)); p = c; }
  const bO = p;
  // (miroir du faux breakout haussier : clôture juste sous le support, longue mèche basse dans la liquidité)
  const wickLow = (0.95 + rng() * 0.3) * m;
  const bC = S - 0.27 - rng() * 0.12;
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

// Pullback en tendance sur un niveau prouvé (règle PO) : une ancienne résistance (ou un
// ancien support en tendance baissière) rejette deux fois, cède, la tendance repart, puis
// le pullback revient la tester par l'autre côté : c'est le support (la résistance)
// affiché. La dernière bougie du pullback entre dans la bande et clôture juste au-delà.
function trendRetest(rng: () => number, m: number, up: boolean, depth: number, rise = 2.6): { past: Candle[]; p: number; peak: number; lo: number; hi: number } {
  const s = up ? 1 : -1;
  const past: Candle[] = [];
  const push = (c: number, wWith: number, wAgainst: number) => {
    past.push(up ? candle(p, c, wWith, wAgainst) : candle(p, c, wAgainst, wWith));
    p = c;
  };
  let p = up ? 1 + rng() * 0.5 : 9 - rng() * 0.5;
  for (let i = 0; i < 2; i++) push(p + s * (0.5 + rng() * 0.55) * m, (0.2 + rng() * 0.25) * m, (0.15 + rng() * 0.18) * m);
  // Ancien niveau, rejeté deux fois
  const lvl = p + s * (2.0 + rng() * 0.4) * m;
  const lo = up ? lvl - 0.3 * m : lvl - 0.2 * m, hi = up ? lvl + 0.2 * m : lvl + 0.3 * m;
  const h = levelTouches(rng, p, lo, hi, up ? "below" : "above", m);
  past.push(...h.candles); p = h.p;
  // Cassure, puis tendance jusqu'au plus haut (plus bas)
  const top = (up ? hi : lo) + s * (rise + rng() * 0.6) * m;
  while (s * (top - p) > 0) push(p + s * (0.55 + rng() * 0.5) * m, (0.2 + rng() * 0.25) * m, (0.15 + rng() * 0.18) * m);
  const peak = p;
  // Pullback : `depth` bougies, la dernière entre dans la bande et clôture juste au-delà
  const target = up ? hi + (0.05 + rng() * 0.1) * m : lo - (0.05 + rng() * 0.1) * m;
  const tip = up ? hi - (0.2 + rng() * 0.4) * (hi - lo) : lo + (0.2 + rng() * 0.4) * (hi - lo);
  for (let i = 0; i < depth; i++) {
    const last = i === depth - 1;
    const c = last ? target : p - s * (Math.abs(p - target) / (depth - i)) * (0.8 + rng() * 0.3);
    push(c, (0.15 + rng() * 0.15) * m, last ? Math.abs(c - tip) : (0.12 + rng() * 0.12) * m);
  }
  return { past, p, peak, lo, hi };
}

function genPullbackBull(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const fut: Candle[] = [];
  // Pullback (4 bougies rouges, 5 en avancé) sur l'ancienne résistance devenue support
  const depth = d === "advanced" ? 5 : 4;
  const t = trendRetest(rng, m, true, depth);
  const past = t.past, peak = t.peak;
  let p = t.p;
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
  return finalize({
    past, future: fut,
    zones: [
      { kind: "support",        y1: t.lo,              y2: t.hi,               label: "Support" },
      { kind: "liquidity_high", y1: peak - 0.15,       y2: peak + 0.15,        label: "Plus haut précédent"   },
    ],
  });
}

function genPullbackBear(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const fut: Candle[] = [];
  // Rebond (4 bougies vertes, 5 en avancé) sur l'ancien support devenu résistance
  const depth = d === "advanced" ? 5 : 4;
  const t = trendRetest(rng, m, false, depth);
  const past = t.past, bottom = t.peak;
  let p = t.p;
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
  return finalize({
    past, future: fut,
    zones: [
      { kind: "resistance",    y1: t.lo,              y2: t.hi,              label: "Résistance" },
      { kind: "liquidity_low", y1: bottom - 0.15,     y2: bottom + 0.15,     label: "Plus bas précédent" },
    ],
  });
}

function genRejectionResistance(rng: () => number, m: number, d: Difficulty): BuySellChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  // La résistance a déjà rejeté deux fois (preuve), puis le prix y remonte
  const h = levelTouches(rng, R - (2.4 + rng() * 0.5) * m, R - 0.2, R + 0.2, "below", m);
  past.push(...h.candles);
  let p = h.p;
  while (p < R - 1.4 * m) {
    const o = p;
    const c = Math.min(o + (0.5 + rng() * 0.4) * m, R - 0.9 * m);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // Test résistance : wicks (intensité selon difficulté)
  const tests = d === "beginner" ? 4 : d === "intermediate" ? 3 : 2;
  for (let i = 0; i < tests; i++) {
    // Entre deux tests, une bougie ordinaire sous la zone : pas de série de mèches géantes
    if (i > 0) {
      const o = p;
      const c = clamp(o + (rng() - 0.55) * 0.4 * m, R - 1.4, R - 0.6);
      const k = candle(o, c, (0.08 + rng() * 0.1) * m, (0.08 + rng() * 0.1) * m);
      k.h = Math.min(k.h, R - 0.5);
      past.push(k);
      p = c;
    }
    // Test : corps réel (au moins 0,3 pas) et mèche de rejet qui entre dans la zone, sans la traverser
    const o = p;
    let c = clamp(o + (rng() - 0.6) * 0.7 * m, R - 1.3, R - 0.4);
    if (Math.abs(c - o) < 0.3 * m) c = o + (o > R - 0.85 ? -0.3 : 0.3) * m;
    const k = candle(o, c, 0, (0.08 + rng() * 0.1) * m);
    // « La zone a déjà rejeté plusieurs fois » : la mèche entre toujours dans la zone
    k.h = R - 0.1 + rng() * 0.2;
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
  // Le support a déjà tenu deux fois (preuve), puis le prix y redescend
  const h = levelTouches(rng, S + (2.4 + rng() * 0.5) * m, S - 0.2, S + 0.2, "above", m);
  past.push(...h.candles);
  let p = h.p;
  while (p > S + 1.4 * m) {
    const o = p;
    const c = Math.max(o - (0.5 + rng() * 0.4) * m, S + 0.9 * m);
    past.push(candle(o, c, (0.12 + rng() * 0.12) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const tests = d === "beginner" ? 4 : d === "intermediate" ? 3 : 2;
  for (let i = 0; i < tests; i++) {
    // Entre deux tests, une bougie ordinaire au-dessus de la zone : pas de série de mèches géantes
    if (i > 0) {
      const o = p;
      const c = clamp(o + (rng() - 0.45) * 0.4 * m, S + 0.6, S + 1.4);
      const k = candle(o, c, (0.08 + rng() * 0.1) * m, (0.08 + rng() * 0.1) * m);
      k.l = Math.max(k.l, S + 0.5);
      past.push(k);
      p = c;
    }
    // Test : corps réel (au moins 0,3 pas) et mèche de rejet qui entre dans la zone, sans la traverser
    const o = p;
    let c = clamp(o + (rng() - 0.4) * 0.7 * m, S + 0.4, S + 1.3);
    if (Math.abs(c - o) < 0.3 * m) c = o + (o < S + 0.85 ? 0.3 : -0.3) * m;
    const k = candle(o, c, (0.08 + rng() * 0.1) * m, 0);
    // « La zone a déjà tenu plusieurs fois » : la mèche entre toujours dans la zone
    k.l = S - 0.1 + rng() * 0.2;
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
    // les clôtures restent nettement au-dessus du plus bas précédent (le prix en est reparti)
    const c = clamp(o + (rng() - 0.5) * 0.8 * m, L + Math.max(0.5, 0.8 * m), L + 1.7 * Math.max(1, m));
    const k = candle(o, c, (0.25 + rng() * 0.22) * m, (0.25 + rng() * 0.22) * m);
    k.l = Math.max(k.l, L - 0.12); // le plus bas précédent n'est pas balayé avant le sweep
    past.push(k);
    p = c;
  }
  // Le « plus bas précédent » : le creux de la consolidation touche le niveau L (sinon le plus bas
  // visible d'avant le sweep pouvait être au-dessus de la clôture du sweep)
  markPrevLow(past, L, m);
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
  // Impulsion en 3 bougies : FVG réel entre la mèche haute de la 1re et la mèche basse de la
  // 3e, un petit vide proportionné aux bougies voisines (plus une bougie géante)
  const imp = bullImpulse3(rng, m, p, past);
  p = imp.p;
  const fvgLow = imp.fvgLow;
  const fvgHigh = imp.fvgHigh;
  // 2 candles de continuation au-dessus du FVG : le prix ne le touche pas avant le pullback final
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    const k = candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m);
    k.l = Math.max(k.l, fvgHigh + 0.05 * m);
    past.push(k);
    p = c;
  }
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
  // Setup technique propre dans le sens de l'UT supérieure haussière : hausse, repli, reprise (bougies
  // de plus en plus serrées avant la news)
  let p = 4 + rng() * 0.5;
  const path = [0.32, 0.26, -0.12, 0.3, 0.24, 0.18, -0.16, -0.14, -0.1, 0.12, 0.14, 0.1, 0.08, 0.07];
  for (let i = 0; i < 14; i++) {
    const tight = 1 - i / 26;
    const o = p;
    const c = o + (path[i] + (rng() - 0.5) * 0.08) * m;
    past.push(candle(o, c, (0.1 + rng() * 0.12) * tight * m, (0.1 + rng() * 0.12) * tight * m));
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
  // 12 bougies : le range se lit à ses bornes, touchées deux fois chacune (rangeLegs) ; puis 4 bougies
  // qui ramènent le prix au milieu, loin des bornes (« sans test de zone » en cours)
  const legs = rangeLegs(rng, p, S, R, 4, 3, m, rng() < 0.5);
  past.push(...legs.candles);
  p = legs.p;
  for (let i = 0; i < 4; i++) {
    const o = p;
    // « Au milieu d'un range » : la dernière bougie finit dans le tiers central (la 1re, qui part
    // de la borne, peut encore la frôler : les 3 dernières en restent loin)
    const c = i === 3 ? mid + (rng() - 0.5) * 0.4 : clamp(mid + (o - mid) * 0.2 + (rng() - 0.5) * 0.3, S + 1.4, R - 1.4);
    const k = candle(o, c, (0.2 + rng() * 0.25) * m, (0.2 + rng() * 0.25) * m);
    k.h = Math.min(k.h, R - 1); k.l = Math.max(k.l, S + 1);
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
  // La résistance est prouvée : deux rejets avant la consolidation
  const h = levelTouches(rng, R - (2.4 + rng() * 0.5) * m, R - 0.15, R + 0.15, "below", m);
  past.push(...h.candles);
  let p = h.p;
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
  // Impulsion en 3 bougies (crée le FVG) : un petit vide proportionné aux bougies voisines
  const imp = bullImpulse3(rng, m, p, past);
  p = imp.p;
  const fvgLow  = imp.fvgLow;
  const fvgHigh = imp.fvgHigh;
  // 2 candles au-dessus, sans rentrer dans le FVG
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.25) * m;
    const k = candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m);
    k.l = Math.max(k.l, fvgHigh + 0.04 * m);
    past.push(k);
    p = c;
  }
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
  const indecMax = fvgLow + (fvgHigh - fvgLow) * 0.1;  // FVG proportionné : marge resserrée au fond
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
  // faible sur un support local. Future : continuation baissière.
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
  // Support prouvé : touché deux fois par-dessus ; la 2e réaction est le rebond local
  const minorLevel = p - (2.4 + rng() * 0.5) * m;
  const touches = levelTouches(rng, p, minorLevel - 0.1, minorLevel + 0.1, "above", m, 2);
  past.push(...touches.candles);
  p = touches.p;
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
    zones: [{ kind: "support", y1: minorLevel - 0.1, y2: minorLevel + 0.1, label: "Support" }],
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
  // Le range se lit à ses bornes : une jambe monte toucher le haut (pointe de mèche sur le bord de la
  // zone, gardée par la passe de réalisme) avant le sweep du haut, une autre descend toucher le bas
  // avant le sweep du bas. Avant : retour au milieu, les bornes jamais testées et les bougies de sweep
  // énormes à côté d'un range resserré.
  const leg = (n: number, up: boolean) => {
    const target = up ? R - 0.3 : S + 0.3;
    for (let i = 0; i < n; i++) {
      const o = p;
      const c = clamp(i === n - 1 ? target + (rng() - 0.5) * 0.1 : o + (target - o) * (0.25 + rng() * 0.45), S + 0.25, R - 0.25);
      const k = candle(o, c, (0.2 + rng() * 0.25) * m, (0.2 + rng() * 0.25) * m);
      k.h = Math.min(k.h, R - 0.16); k.l = Math.max(k.l, S + 0.16);
      if (i === n - 1) { if (up) k.h = R - 0.1; else k.l = S + 0.1; }
      past.push(k);
      p = c;
    }
  };
  // 6 oscillations : haut touché, bas touché, haut touché (2 touches du haut avant son sweep)
  leg(2, true);
  leg(2, false);
  leg(2, true);
  // Sweep du haut (mèche dépasse R, close inside)
  const swHc = R - 0.7 - rng() * 0.3;
  const swH = { o: p, c: swHc, h: R + 1.0 * m + rng() * 0.3, l: Math.min(p, swHc) - 0.15 };
  past.push(swH); p = swH.c;
  // 3 oscillations : le prix redescend toucher le bas du range
  leg(3, false);
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
  const fut: Candle[] = [];
  // Pullback sur l'ancienne résistance devenue support (niveau prouvé)
  const t = trendRetest(rng, m, true, 4);
  const past = t.past;
  let p = t.p;
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
      { kind: "support", y1: t.lo, y2: t.hi, label: "Support" },
    ],
  });
}

// ─── Build chart depuis un setup ──────────────────────────────────────────────

/** Graphique converti à l'échelle de prix de l'actif (au dernier moment, pour l'affichage). */
/**
 * Niveau avancé : les zones perdent leurs qualificatifs (« UT supérieure », « majeure »,
 * « haussier ») pour que le joueur lise le marché plutôt que les noms. Un support reste
 * « Support » et une résistance « Résistance » : on ne les renomme jamais. Un nom cité par
 * l'énoncé ou l'explication (`texts`) reste affiché tel quel : même nom partout.
 */
export function maskZonesForDifficulty(zones: BuySellChart["zones"], d: Difficulty, locale: string | undefined, texts: readonly string[] = []): BuySellChart["zones"] {
  if (d !== "advanced") return zones;
  const said = texts.join(" ").toLowerCase();
  const cited = (label: string) => { const l = label.toLowerCase(); return said.includes(l) || said.includes(l.replace(/ (ut supérieure|ut superior|htf)$/, " de l'ut supérieure")); };
  return zones.map((z) => {
    if (cited(z.label)) return z;
    // Changement de rôle : il fait partie de la preuve du niveau, il reste dit en avancé aussi
    if (z.flip) return z;
    // Seuls les supports / résistances et les FVG / liquidités deviennent génériques : un plus bas
    // précédent, un swing, un range gardent leur nom (« Support » sur un creux jamais touché
    // présentait un niveau non prouvé)
    const sr = /^(support|soporte|r[ée]sistance|resistencia|resistance)/i.test(z.label);
    const liq = /^(liquidit|liquidez|sweep|barrido)/i.test(z.label);
    if (!sr && !liq && z.kind !== "fvg") return z;
    const generic = locale === "es"
      ? (z.kind === "support"        ? "Soporte"
       : z.kind === "resistance"     ? "Resistencia"
       : z.kind === "fvg"            ? "Desequilibrio"
       :                                "Liquidez")
      : locale === "en"
      ? (z.kind === "support"        ? "Support"
       : z.kind === "resistance"     ? "Resistance"
       : z.kind === "fvg"            ? "Imbalance"
       :                                "Liquidity")
      : (z.kind === "support"        ? "Support"
       : z.kind === "resistance"     ? "Résistance"
       : z.kind === "fvg"            ? "FVG"
       :                                "Liquidité");
    return { ...z, label: generic };
  });
}

/** Textes affichés d'un scénario (énoncé, explications, leçon) : les noms qu'ils citent restent sur le graphique */
export function scenarioTexts(t: { context: string; shortContext?: string; rationales: ChoiceRationales; lessons: DifficultyLessons }, d: Difficulty): string[] {
  return [t.context, t.shortContext ?? "", t.rationales.BUY, t.rationales.SELL, t.rationales.NO_TRADE, t.lessons[d]];
}

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
  // Alignements fortuits cassés : aucun niveau visible sans zone (lib/games/stray-levels.ts)
  // (swing désigné : sa pointe reste l'extrême de ses voisines, avant et après le tracé)
  return keepSwingTips(breakStrayLevels(withRoleChanges(withTracedZones(keepSwingTips(realizeChart(ch, [...ch.zones.flatMap((z) => [z.y1, z.y2]), ...srGuards(ch.zones, VOL_MULT[volatility], ch.past)], seed, { ...ctx, volatility, calmPast: calm, preNews: calm }))))));
}

/** Graphique brut du scénario, avant la passe de réalisme (audits). */
export function buildChartRaw(
  setup: SetupKey,
  seed: number,
  volatility: Volatility = "normale",
  difficulty: Difficulty = "intermediate",
): BuySellChart {
  // suite naturelle : pas d'escalier (série de bougies de même couleur aux corps identiques)
  const ch = buildChartRaw0(setup, seed, volatility, difficulty);
  return { ...ch, future: naturalFuture(ch.future, mulberry32((seed ^ 0x27D4EB2F) >>> 0), VOL_MULT[volatility]) };
}
function buildChartRaw0(
  setup: SetupKey,
  seed: number,
  volatility: Volatility,
  difficulty: Difficulty,
): BuySellChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[volatility];
  const tpl = SCENARIO_TEMPLATES.find((t) => t.id === setup);
  if (tpl?.build) return finalize(tpl.build(rng, m, difficulty));
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
    default: throw new Error(`Buy/Sell : scénario inconnu « ${setup} »`);
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
