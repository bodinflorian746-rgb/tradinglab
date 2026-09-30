// Mini-jeu #4 : "BUILD THE TRADE"
//
// Le joueur construit un setup complet en 3 étapes :
//   1. Entrée (agressive / confirmation / pullback profond)
//   2. Stop loss (serré / logique / large)
//   3. Take profit (rapide / équilibré / ambitieux)
// Puis le marché révèle les futures candles, et le moteur évalue le trade.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  VOL_MULT, mulberry32, clamp, candle,
} from "./shared";
import { pickMarketContext, contextRule } from "./market-context";
import { realizeChart } from "./candle-realism";
import { assetPriceMap, mapCandle, mapDomain, mapZone } from "./price-scale";

export type { Asset, Session, Volatility, Spread, HtfBias, MacroContext, Candle, ChartZone };

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type TradeDirection = "BUY" | "SELL";

export type EntryType = "aggressive" | "confirmation" | "deep_pullback";
export type StopType  = "tight" | "logical" | "wide";
export type TpType    = "fast" | "balanced" | "ambitious";

export const ENTRY_LABELS: Record<EntryType, string> = {
  aggressive:    "Agressive",
  confirmation:  "Confirmation",
  deep_pullback: "Pullback profond",
};
export const STOP_LABELS: Record<StopType, string> = {
  tight:   "Serré",
  logical: "Logique",
  wide:    "Large",
};
export const TP_LABELS: Record<TpType, string> = {
  fast:      "Rapide",
  balanced:  "Équilibré",
  ambitious: "Ambitieux",
};

export type ChartShape =
  | "uptrend_pullback"
  | "downtrend_pullback"
  | "breakout_up"
  | "breakout_down"
  | "bounce_support"
  | "rejection_resistance"
  | "range_oscillation"
  | "fakeout_above"
  | "sweep_low_reversal"
  | "fvg_continuation"
  | "deep_pullback_risky"
  | "high_vol_pullback"
  | "weak_breakout"
  | "counter_trend_local";

export interface DifficultyLessons {
  beginner:     string;
  intermediate: string;
  advanced:     string;
}

export interface BuildTradeTemplate {
  id:             string;
  title:          string;
  chartShape:     ChartShape;
  direction:      TradeDirection;
  htfBias:        HtfBias;
  macroContext:   MacroContext;
  context:        string;
  optimal:        { entry: EntryType; stop: StopType; tp: TpType };
  optimalExplain: string;
  lessons:        DifficultyLessons;
  difficulties:   readonly Difficulty[];
}

export interface BuildTradeInstance extends BuildTradeTemplate {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
  seed:       number;
  difficulty: Difficulty;
}

export interface BuildTradeChart {
  past:      Candle[];
  future:    Candle[];
  zones:     ChartZone[];
  domain:    { min: number; max: number };
  direction: TradeDirection;
  // 3 options par catégorie. Pour l'entrée :
  //   - aggressive   = au prix actuel (entry market)
  //   - confirmation = au-dessus (BUY) ou en dessous (SELL) du current (après une bougie de confirmation)
  //   - deep_pullback = un retour plus profond avant l'entry
  entries: Record<EntryType, number>;
  stops:   Record<StopType,  number>;
  tps:     Record<TpType,    number>;
  // Prix actuel = dernier close du past (pour l'entry market)
  currentPrice: number;
}

export const ROUNDS_PER_SESSION = 8;

const ASSETS:       readonly Asset[]      = ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"];
const SESSIONS:     readonly Session[]    = ["Londres", "New York", "Overlap", "Heures mortes"];

// ─── Templates (15) ───────────────────────────────────────────────────────────

export const BUILD_TRADE_TEMPLATES: BuildTradeTemplate[] = [
  {
    id: "trend_continuation_bull",
    title: "Continuation de tendance haussière",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tendance haussière nette. Le prix vient de finir un pullback.",
    optimal: { entry: "deep_pullback", stop: "logical", tp: "ambitious" },
    optimalExplain: "Ici, la tendance HTF est claire : chercher le meilleur prix (pullback profond) se défend, avec un stop derrière la structure et un objectif large dans le sens du momentum.",
    lessons: {
      beginner:     "Sur un setup dans le sens du HTF, chercher le meilleur prix et viser large est une option logique. Ici, la patience peut payer.",
      intermediate: "Le pullback profond améliore souvent le R/R. Associé à un stop derrière la structure, il offre ici le meilleur avantage.",
      advanced:     "Une continuation de tendance alignée avec le HTF peut offrir un setup à haute probabilité, avec un R/R de 3:1 ou plus. La taille se décide selon ton plan de risk management ; un TP ambitieux se justifie ici par le momentum probable.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "trend_continuation_bear",
    title: "Continuation de tendance baissière",
    chartShape: "downtrend_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tendance baissière nette. Le prix vient de finir un rebond.",
    optimal: { entry: "deep_pullback", stop: "logical", tp: "ambitious" },
    optimalExplain: "Ici, avec un HTF baissier et un rebond qui s'essouffle, une entrée au meilleur prix se défend, avec un stop au-dessus du swing high et un TP ambitieux dans le sens du momentum.",
    lessons: {
      beginner:     "Tendance baissière et rebond qui s'essouffle : un SELL reste cohérent avec le scénario, si ça correspond à ton plan, au meilleur prix possible avec un TP large.",
      intermediate: "Ici, le rebond profond donne souvent le meilleur R/R. Un stop au-dessus de la structure permet d'absorber le bruit.",
      advanced:     "C'est le symétrique de la continuation haussière. Un R/R de 3:1 ou plus reste un objectif logique ici.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "breakout_bull_clean",
    title: "Cassure haussière nette",
    chartShape: "breakout_up",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de casser une résistance HTF avec une bougie de force.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "Ici, le breakout aligné avec le HTF peut signaler un momentum immédiat. Attendre un pullback profond risque de faire rater le mouvement. Une entrée agressive, un stop sous le niveau cassé et un TP ambitieux forment une option logique.",
    lessons: {
      beginner:     "Sur un breakout aligné avec le HTF, la fenêtre d'entrée est souvent courte : le marché n'attend pas le retardataire. À toi de juger selon ton plan si tu embarques.",
      intermediate: "Sur un breakout fort, attendre un pullback profond peut faire rater le mouvement. Dans ce cas, une entrée agressive se défend.",
      advanced:     "Un breakout HTF avec une bougie de force apporte une confirmation forte. Le pullback peut être léger, voire absent : à intégrer dans ton plan.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "breakout_bear_clean",
    title: "Cassure baissière nette",
    chartShape: "breakout_down",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix vient de casser un support HTF avec une bougie de force.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "Ici, la cassure alignée avec le HTF peut signaler un momentum vendeur. Une entrée rapide avec un stop au-dessus du support cassé est une option logique.",
    lessons: {
      beginner:     "Cassure du support avec un HTF baissier : un SELL reste cohérent avec le scénario, si ça correspond à ton plan de trading.",
      intermediate: "Un stop juste au-dessus du niveau cassé (devenu résistance) est une option logique. Ici, le momentum peut justifier une entrée agressive.",
      advanced:     "C'est le miroir du breakout haussier. Un stop technique au-dessus du support cassé, avec une marge, se défend.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "bounce_support_clean",
    title: "Rebond sur support majeur",
    chartShape: "bounce_support",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de rebondir sur un support HTF avec une mèche claire.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Sur un support testé, attendre la confirmation du rebond avant d'entrer se défend. Un stop sous le support et un TP équilibré sont ici logiques, car la résistance suivante limite la course.",
    lessons: {
      beginner:     "Sur un support, attendre la bougie verte de confirmation est souvent plus sûr qu'une entrée à l'aveugle.",
      intermediate: "La confirmation peut valider la zone. Ici, le TP équilibré tient compte de la résistance suivante.",
      advanced:     "Sur un support HTF testé 2 ou 3 fois, la confirmation aide à préserver l'avantage. Un R/R autour de 2 à 2,5:1 est courant dans ce cas.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "rejection_resistance_clean",
    title: "Rejet sur résistance majeure",
    chartShape: "rejection_resistance",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix vient de rejeter une résistance HTF avec une mèche.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Sur une résistance testée, attendre la confirmation du rejet avant d'entrer se défend. Un stop au-dessus du high et un TP équilibré (le support suivant) sont ici logiques.",
    lessons: {
      beginner:     "Sur une résistance, attendre la bougie rouge de confirmation est une option prudente. Le rejet gagne à s'imposer.",
      intermediate: "Ici, la confirmation prend la forme d'une bougie de rejet visible. Sans elle, le retest peut se prolonger.",
      advanced:     "C'est le miroir du rebond sur support. Un stop au-dessus du high, avec une marge ATR, est une option logique.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "range_top_short",
    title: "SELL au plafond du range",
    chartShape: "range_oscillation",
    direction: "SELL",
    htfBias: "range",
    macroContext: "normal",
    context: "Le prix arrive au plafond d'un range serré. Tu cherches le SELL.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Dans un range, l'avantage reste limité : une confirmation aide à valider l'entrée, et un TP rapide se défend, car la borne basse du range limite la course.",
    lessons: {
      intermediate: "Un range offre souvent un R/R limité. Ici, un TP ambitieux a peu de sens ; viser le plancher du range est plus logique.",
      advanced:     "Un range se prête plutôt au contre-mouvement. Une confirmation et un TP rapide augmentent souvent le taux de réussite, avec un R/R qui reste sous 2.",
      beginner:     "Au plafond d'un range, un objectif modeste est souvent plus réaliste : le prix évolue dans une boîte.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "range_bottom_long",
    title: "BUY au plancher du range",
    chartShape: "range_oscillation",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Le prix arrive au plancher d'un range serré. Tu cherches le BUY.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Ici, le range se joue entre plancher et plafond. Une confirmation et un TP rapide se défendent, car la course est limitée.",
    lessons: {
      intermediate: "Un BUY au plancher vise plutôt le plafond, pas au-delà. Ici, le TP rapide se place près du plafond.",
      advanced:     "Mêmes principes que le SELL au plafond : une confirmation et un TP serré aident souvent à augmenter le taux de réussite.",
      beginner:     "Dans un range, viser l'autre borne est souvent suffisant. Ici, un objectif modeste se défend.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fake_breakout_short",
    title: "Faux breakout : SELL après le piège",
    chartShape: "fakeout_above",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix a piqué au-dessus de la résistance puis refermé en dessous. Piège classique.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Après un fakeout, attendre la confirmation (une bougie qui valide le retour sous la résistance) se défend. Un stop au-dessus du pic du fakeout et un TP équilibré jusqu'au support suivant sont ici logiques.",
    lessons: {
      intermediate: "Un fakeout peut offrir un signal d'entrée, de préférence avec confirmation. Sans elle, le retest peut provoquer un 2e sweep.",
      advanced:     "Un stop au-dessus de la mèche du fakeout correspond ici à la vraie invalidation, plutôt que dans la zone du piège.",
      beginner:     "Après un piège visible, attendre la suite est souvent plus sage que d'agir par FOMO.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "sweep_reversal_bull",
    title: "Sweep de liquidité + retournement",
    chartShape: "sweep_low_reversal",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de balayer la liquidité sous le précédent low puis a refermé au-dessus.",
    optimal: { entry: "aggressive", stop: "logical", tp: "balanced" },
    optimalExplain: "Ici, le sweep peut signaler un retournement. Dans ce cas précis, une entrée agressive se défend, car le sweep sert déjà de première confirmation. Un stop sous le low du sweep est une option logique.",
    lessons: {
      intermediate: "Pattern ICT classique : ici, le sweep est un argument fort en faveur d'une entrée, à confirmer selon ton plan. Un stop sous le sweep est une option logique.",
      advanced:     "Ici, une entrée agressive se justifie par le pattern, pas par l'impatience. Un stop sous le low du sweep (la nouvelle invalidation) est une option logique.",
      beginner:     "Une grosse mèche qui balaie un low puis remonte peut apporter une confirmation forte pour un BUY.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fvg_continuation_bull",
    title: "Réaction sur FVG haussier",
    chartShape: "fvg_continuation",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix revient tester un FVG haussier. La réaction est en cours.",
    optimal: { entry: "confirmation", stop: "logical", tp: "ambitious" },
    optimalExplain: "Ici, le FVG peut servir de zone de demande, et la confirmation valide la réaction. Un stop sous le bas du FVG et un TP ambitieux se défendent, car le HTF est aligné et la zone encore intacte.",
    lessons: {
      intermediate: "Le FVG agit souvent comme zone de demande au retest. Ici, la confirmation préserve l'avantage sans rater le mouvement.",
      advanced:     "FVG haussier, HTF aligné et premier retest : un setup de premier choix. Un R/R de 3:1 ou plus est ici logique.",
      beginner:     "Le FVG attire souvent le prix. Ici, la confirmation prend la forme d'une bougie verte qui défend la zone.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "weak_breakout_setup",
    title: "Cassure faible : édge réduit",
    chartShape: "weak_breakout",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Le prix vient de casser au-dessus de la résistance, mais la bougie est petite et hésitante.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Ici, la cassure manque de force, et l'avantage est réduit. Attendre une confirmation avant d'entrer se défend, avec un TP rapide car la continuation reste incertaine.",
    lessons: {
      intermediate: "Une cassure faible dégrade le trade. Une confirmation et un TP serré permettent ici de s'adapter à un signal faible.",
      advanced:     "Une cassure faible continue nettement moins souvent qu'une cassure franche. Dans ce cas, un TP ambitieux a peu de chances d'être atteint.",
      beginner:     "Si la cassure manque de corps, viser petit et attendre une confirmation est une option logique.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "deep_pullback_risky",
    title: "Pullback très profond : risque de breakdown",
    chartShape: "deep_pullback_risky",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le pullback est devenu très profond. Plus de 60% de l'impulsion précédente est retracée.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Ici, le pullback profond peut annoncer une cassure de structure. La confirmation préserve l'avantage : une entrée agressive reviendrait à courir après le prix, et un pullback profond à parier sur une zone douteuse.",
    lessons: {
      advanced:     "Un pullback de plus de 60 % de l'impulsion peut signaler un pattern fatigué. Ici, une confirmation et un TP modéré sont une option logique.",
      intermediate: "Plus le pullback est profond, plus la confirmation compte. Ici, une entrée agressive serait très risquée.",
      beginner:     "Un pullback trop profond peut casser la tendance. Attendre que la structure se reconfirme est ici une option logique.",
    },
    difficulties: ["advanced"],
  },
  {
    id: "high_vol_setup",
    title: "Setup en volatilité élevée",
    chartShape: "high_vol_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Volatilité élevée. Les bougies sont larges, les wicks profondes.",
    optimal: { entry: "confirmation", stop: "wide", tp: "balanced" },
    optimalExplain: "En volatilité élevée, le bruit est amplifié et un stop standard risque d'être balayé. Ici, le « stop large » devient le stop LOGIQUE. Un TP équilibré se défend, car le mouvement potentiel est aussi plus étendu.",
    lessons: {
      advanced:     "Un stop ajusté à l'ATR est une option logique. En volatilité élevée, le « stop large » n'est pas excessif : il est simplement adapté.",
      intermediate: "Le stop gagne à s'adapter à la volatilité du moment plutôt qu'à une distance fixe.",
      beginner:     "Quand le marché bouge fort, le stop a besoin d'espace. Sinon, il risque de sauter pour rien.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "counter_trend_local",
    title: "Setup local contre HTF : défensif",
    chartShape: "counter_trend_local",
    direction: "BUY",
    htfBias: "bearish",
    macroContext: "normal",
    context: "HTF baissier. Un setup BUY apparaît localement (LTF), risqué mais tradable.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Contre le HTF, la probabilité est souvent défavorable. Ici, une confirmation et un TP rapide permettent de sécuriser ce qui peut l'être ; viser loin contre la tendance majeure se défend mal.",
    lessons: {
      advanced:     "Trader contre le HTF revient souvent à accepter une probabilité défavorable. Ici, le TP rapide capte l'avantage avant un éventuel retournement.",
      intermediate: "Un setup contre-tendance appelle plutôt une approche défensive. Une confirmation et une sortie rapide limitent ici l'exposition.",
      beginner:     "Si tu trades contre la tendance, viser petit et sortir vite est souvent l'option la plus prudente.",
    },
    difficulties: ["advanced"],
  },
];

// ─── Generate scenarios ───────────────────────────────────────────────────────

export function generateBuildTradeScenarios(seed: number, difficulty: Difficulty): BuildTradeInstance[] {
  const rng = mulberry32(seed);
  const pool = BUILD_TRADE_TEMPLATES.filter((t) => t.difficulties.includes(difficulty));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const out: BuildTradeInstance[] = [];
  let lastId: string | null = null;
  for (let i = 0; i < ROUNDS_PER_SESSION; i++) {
    let cand = shuffled[i % shuffled.length];
    if (cand.id === lastId && shuffled.length > 1) {
      cand = shuffled[(i + 1) % shuffled.length];
    }
    out.push({
      ...cand,
      // Contexte cohérent : session, actif tradé dans la session, volatilité et spread de la session
      ...pickMarketContext(rng, { assets: ASSETS, sessions: SESSIONS }, contextRule("btt", cand.id, cand.chartShape === "high_vol_pullback" ? { volatility: "élevée" } : {})),
      seed:       (seed + i * 9973) >>> 0,
      difficulty,
    });
    lastId = cand.id;
  }
  return out;
}

// ─── Chart generators ────────────────────────────────────────────────────────

interface ShapeOutput {
  past: Candle[];
  future: Candle[];
  zones: ChartZone[];
  // reversal : niveau où le prix se retourne (contre-tendance locale), le TP
  // rapide se place juste avant. bound : borne opposée d'un range, le TP rapide
  // se place juste avant (R/R < 2). fastR : distance du TP rapide en R.
  // wideM : distance du stop large au swing, en ATR (1,2 par défaut).
  ref: { swingLow: number; swingHigh: number; entryRef: number; reversal?: number; bound?: number; fastR?: number; wideM?: number };
}

function finalize(past: Candle[], future: Candle[], zones: ChartZone[], extras: number[]): { domain: { min: number; max: number } } {
  const all = [...past, ...future];
  const vals: number[] = [...extras];
  for (const k of all) { vals.push(k.h, k.l); }
  for (const z of zones) { vals.push(z.y1, z.y2); }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;
  return { domain: { min: min - pad, max: max + pad } };
}

// Nombre de bougies de la suite révélée (au maximum : la révélation s'arrête
// dès que le TP ou le stop du joueur est touché)
export const FUTURE_LENGTH = 15;

type Continuation =
  | { kind: "target"; dir: 1 | -1; target: number; fade: boolean }
  | { kind: "drift"; dir: 1 | -1 }
  | { kind: "range"; S: number; R: number; dir: 1 | -1; target: number };

// Prolonge la suite jusqu'à FUTURE_LENGTH bougies. « target » : avance vers le
// niveau visé (chaque pas couvre au moins la part restante, il est donc atteint
// au plus tard à la dernière bougie), puis poursuit mollement (ou s'essouffle
// si fade). « range » : va toucher le niveau visé (près de la borne opposée,
// par une mèche si besoin), puis oscille dans le range.
function extendFuture(fut: Candle[], rng: () => number, m: number, mode: Continuation): void {
  let p = fut[fut.length - 1].c;
  let reached = mode.kind === "drift"
    || fut.some((k) => (mode.dir > 0 ? k.h >= mode.target : k.l <= mode.target));
  while (fut.length < FUTURE_LENGTH) {
    const o = p;
    const left = FUTURE_LENGTH - fut.length;
    let c: number;
    if (mode.kind === "range" && !reached) {
      const need = Math.max(0, (mode.target - o) * mode.dir);
      c = clamp(o + mode.dir * Math.max(need / left, 0.3 * m) * (1 + rng() * 0.4), mode.S + 0.4, mode.R - 0.4);
    } else if (mode.kind === "range") {
      const mid = (mode.S + mode.R) / 2;
      c = clamp(o + (mid - o) * 0.3 + (rng() - 0.5) * 0.8 * m, mode.S + 0.4, mode.R - 0.4);
    } else if (mode.kind === "target" && !reached) {
      const need = Math.max(0, (mode.target - o) * mode.dir);
      c = o + mode.dir * Math.max(need / left, 0.3 * m) * (1 + rng() * 0.4);
    } else if (mode.kind === "target" && mode.fade) {
      c = o - mode.dir * (0.1 + rng() * 0.25) * m;
    } else {
      c = o + mode.dir * (0.1 + rng() * 0.3) * m;
    }
    const k = candle(o, c, (0.12 + rng() * 0.15) * m, (0.12 + rng() * 0.15) * m);
    if (mode.kind === "range") {
      // près de la borne : la mèche va chercher le niveau visé
      if (!reached && Math.abs(c - mode.target) < 0.6 * m) {
        if (mode.dir > 0) k.h = Math.max(k.h, mode.target + 0.02); else k.l = Math.min(k.l, mode.target - 0.02);
      }
      inRange(k, mode.S, mode.R);
    }
    fut.push(k);
    p = c;
    if (mode.kind !== "drift") reached ||= mode.dir > 0 ? k.h >= mode.target : k.l <= mode.target;
  }
}

function medianBody(candles: Candle[]): number {
  const b = candles.map((k) => Math.abs(k.c - k.o)).sort((x, y) => x - y);
  return b[Math.floor(b.length / 2)];
}

// 1. Uptrend + pullback (BUY)
function shapeUptrendPullback(rng: () => number, m: number): ShapeOutput {
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
  const entryRef = p;
  // Future : dip vers swingLow (touche deep_pullback) puis rallye qui touche balanced + ambitious
  const fut: Candle[] = [];
  // 1er future : dip qui descend juste au-dessus du swingLow (= deep_pullback level)
  const dipLow = swingLow + 0.05 * m;
  fut.push({ o: p, c: swingLow + 0.4 * m, h: Math.max(p, swingLow + 0.4 * m) + 0.1 * m, l: dipLow });
  p = swingLow + 0.4 * m;
  // 2e : bougie verte de confirmation (= confirmation level)
  fut.push(candle(p, p + 0.5 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p += 0.5 * m;
  // Rallye qui touche balanced TP puis ambitious
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: swingLow - 0.04, y2: swingLow + 0.04, label: "Swing low" },
  ], ref: { swingLow, swingHigh, entryRef } };
}

// 2. Downtrend + pullback (SELL)
function shapeDowntrendPullback(rng: () => number, m: number): ShapeOutput {
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
  const entryRef = p;
  const fut: Candle[] = [];
  const bumpHigh = swingHigh - 0.05 * m;
  fut.push({ o: p, c: swingHigh - 0.4 * m, h: bumpHigh, l: Math.min(p, swingHigh - 0.4 * m) - 0.1 * m });
  p = swingHigh - 0.4 * m;
  fut.push(candle(p, p - 0.5 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.5 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: swingHigh - 0.04, y2: swingHigh + 0.04, label: "Swing high" },
  ], ref: { swingLow, swingHigh, entryRef } };
}

// 3. Breakout up
function shapeBreakoutUp(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const R = 10;
  let p = 5 + rng() * 0.4;
  // approach
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (0.4 + rng() * 0.4) * m, 4, R - 1);
    past.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // consol
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.8 * m, R - 1.3, R - 0.3);
    const k = candle(o, c, (0.25 + rng() * 0.2) * m, (0.25 + rng() * 0.2) * m);
    k.h = Math.min(k.h, R + 0.05); // la résistance tient jusqu'à la cassure
    past.push(k);
    p = c;
  }
  // breakout candle : corps d'au moins 2× le corps médian (« bougie de force »)
  const forceBody = 2.05 * medianBody(past);
  past.push(candle(p, Math.max(R + (1.0 + rng() * 0.4) * m, p + forceBody), (0.3 + rng() * 0.2) * m, 0.15));
  p = past[past.length - 1].c;
  const entryRef = p;
  // Future : pullback léger (touche confirmation), pas de deep_pullback, puis rallye
  const fut: Candle[] = [];
  fut.push(candle(p, p - 0.2 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.2 * m;
  // Rallye
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance cassée" },
  ], ref: { swingLow: R - 0.5, swingHigh: R + 1, entryRef } };
}

// 4. Breakout down (mirror)
function shapeBreakoutDown(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const S = 1;
  let p = 6 - rng() * 0.4;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.4 + rng() * 0.4) * m, S + 1, 7);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.8 * m, S + 0.3, S + 1.3);
    const k = candle(o, c, (0.25 + rng() * 0.2) * m, (0.25 + rng() * 0.2) * m);
    k.l = Math.max(k.l, S - 0.05); // le support tient jusqu'à la cassure
    past.push(k);
    p = c;
  }
  const forceBody = 2.05 * medianBody(past);
  past.push(candle(p, Math.min(S - (1.0 + rng() * 0.4) * m, p - forceBody), 0.15, (0.3 + rng() * 0.2) * m));
  p = past[past.length - 1].c;
  const entryRef = p;
  const fut: Candle[] = [];
  fut.push(candle(p, p + 0.2 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p += 0.2 * m;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support cassé" },
  ], ref: { swingLow: S - 1, swingHigh: S + 0.5, entryRef } };
}

// 5. Bounce on support (BUY)
function shapeBounceSupport(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const S = 1;
  let p = 5 + rng() * 0.4;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.5) * m, S + 0.4, 6);
    const k = candle(o, c, (0.15 + rng() * 0.18) * m, (0.18 + rng() * 0.25) * m);
    k.l = Math.max(k.l, S - 0.05); // le support tient
    past.push(k);
    p = c;
  }
  // 3 bougies testant support avec mèches (sans le percer), les 2 dernières le
  // touchent ; la dernière avec une mèche au moins aussi longue que son corps (« mèche claire »)
  for (let i = 0; i < 3; i++) {
    const o = p;
    let c = clamp(o + (rng() - 0.3) * 0.6 * m, S + 0.4, S + 1.3);
    const wU = (0.2 + rng() * 0.2) * m;
    let l = Math.max(Math.min(o, c) - (0.7 + rng() * 0.3) * m, S - 0.05);
    if (i >= 1) l = Math.min(l, S + 0.05); // support « testé 2-3 fois »
    if (i === 2) c = c > o ? Math.min(c, 2 * o - l) : Math.max(c, (o + l) / 2);
    past.push({ o, c, h: Math.max(o, c) + wU, l });
    p = c;
  }
  const entryRef = p;
  const fut: Candle[] = [];
  // 1 dip vers le support (deep_pullback fillable)
  fut.push({ o: p, c: S + 0.5 * m, h: Math.max(p, S + 0.5 * m) + 0.1 * m, l: S + 0.05 * m });
  p = S + 0.5 * m;
  // Confirmation candle (green)
  fut.push(candle(p, p + 0.4 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p += 0.4 * m;
  // Rallye
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.35) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support HTF" },
  ], ref: { swingLow: S, swingHigh: entryRef + 4 * m, entryRef } };
}

// 6. Rejection on resistance (SELL)
function shapeRejectionResistance(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const R = 10;
  let p = 5 - rng() * 0.4;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.5) * m, 4, R - 0.4);
    const k = candle(o, c, (0.18 + rng() * 0.25) * m, (0.15 + rng() * 0.18) * m);
    k.h = Math.min(k.h, R + 0.05); // la résistance tient
    past.push(k);
    p = c;
  }
  // 3 bougies testant la résistance (sans la percer), les 2 dernières la
  // touchent ; la dernière avec une mèche de rejet au moins aussi longue que son corps
  for (let i = 0; i < 3; i++) {
    const o = p;
    let c = clamp(o + (rng() - 0.7) * 0.6 * m, R - 1.3, R - 0.4);
    let h = Math.min(Math.max(o, c) + (0.7 + rng() * 0.3) * m, R + 0.05);
    const wD = (0.2 + rng() * 0.2) * m;
    if (i >= 1) h = Math.max(h, R - 0.05); // résistance testée plusieurs fois
    if (i === 2) c = c < o ? Math.max(c, 2 * o - h) : Math.min(c, (o + h) / 2);
    past.push({ o, c, h, l: Math.min(o, c) - wD });
    p = c;
  }
  const entryRef = p;
  const fut: Candle[] = [];
  fut.push({ o: p, c: R - 0.5 * m, h: R - 0.05 * m, l: Math.min(p, R - 0.5 * m) - 0.1 * m });
  p = R - 0.5 * m;
  fut.push(candle(p, p - 0.4 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.4 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.35) * m;
    fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance HTF" },
  ], ref: { swingLow: entryRef - 4 * m, swingHigh: R, entryRef } };
}

// Mèches contenues dans les zones du range (bornes ± 0,1)
function inRange(k: Candle, S: number, R: number): Candle {
  k.h = Math.min(k.h, R + 0.1);
  k.l = Math.max(k.l, S - 0.1);
  return k;
}

// 7. Range oscillation
function shapeRangeOscillation(rng: () => number, m: number, direction: TradeDirection): ShapeOutput {
  const past: Candle[] = [];
  const S = 2;
  const R = 6;
  const mid = (S + R) / 2;
  let p = mid + (rng() - 0.5);
  // 12 candles d'oscillation
  for (let i = 0; i < 12; i++) {
    const o = p;
    const drift = (mid - o) * 0.25 + (rng() - 0.5) * 1.2 * m;
    const c = clamp(o + drift, S + 0.4, R - 0.4);
    past.push(inRange(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.2) * m), S, R));
    p = c;
  }
  // 2 candles approchant la borne ciblée : la dernière clôture dans le tiers
  // de range côté borne (« le prix arrive au plafond / plancher »)
  for (let i = 0; i < 2; i++) {
    const o = p;
    let c: number;
    const step = (0.3 + rng() * 0.3) * m;
    if (direction === "SELL") {
      c = clamp(o + step, S + 0.4, R - 0.3);
      // la dernière clôture colle au plafond (R - 0,3 à R - 0,45) : l'objectif,
      // le plancher, reste à au moins 1,5 R de l'entrée
      c = i === 0 ? clamp(Math.max(c, (o + R - 0.35) / 2), S + 0.4, R - 0.3) : R - 0.3 - 0.15 * (step / m - 0.3) / 0.3;
    } else {
      c = clamp(o - step, S + 0.3, R - 0.4);
      c = i === 0 ? clamp(Math.min(c, (o + S + 0.35) / 2), S + 0.3, R - 0.4) : S + 0.3 + 0.15 * (step / m - 0.3) / 0.3;
    }
    past.push(inRange(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.2) * m), S, R));
    p = c;
  }
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : oscillation jusqu'à l'autre borne
  if (direction === "SELL") {
    // 1 bump test résistance puis drop vers support
    fut.push({ o: p, c: R - 0.5 * m, h: R - 0.05 * m, l: Math.min(p, R - 0.5 * m) - 0.1 * m });
    p = R - 0.5 * m;
    fut.push(inRange(candle(p, p - 0.5 * m, 0.1, (0.2 + rng() * 0.15) * m), S, R));
    p -= 0.5 * m;
    for (let i = 0; i < 5; i++) {
      const o = p;
      const c = clamp(o - (0.4 + rng() * 0.3) * m, S + 0.4, R);
      fut.push(inRange(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m), S, R));
      p = c;
    }
  } else {
    fut.push({ o: p, c: S + 0.5 * m, h: Math.max(p, S + 0.5 * m) + 0.1 * m, l: S + 0.05 * m });
    p = S + 0.5 * m;
    fut.push(inRange(candle(p, p + 0.5 * m, (0.2 + rng() * 0.15) * m, 0.1), S, R));
    p += 0.5 * m;
    for (let i = 0; i < 5; i++) {
      const o = p;
      const c = clamp(o + (0.4 + rng() * 0.3) * m, S, R - 0.4);
      fut.push(inRange(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m), S, R));
      p = c;
    }
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Plafond range" },
    { kind: "support",    y1: S - 0.15, y2: S + 0.15, label: "Plancher range" },
  ], ref: { swingLow: S, swingHigh: R, entryRef, bound: direction === "SELL" ? S + 0.15 : R - 0.15 } };
}

// 8. Fakeout above (SELL after trap)
function shapeFakeoutAbove(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const R = 10;
  let p = 6 + rng() * 0.3;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, 5, R - 0.5);
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  // Fakeout candle
  const fakeoutHigh = R + 1.2 * m + rng() * 0.3;
  const fakeoutClose = R - 0.5 - rng() * 0.2;
  past.push({ o: p, c: fakeoutClose, h: fakeoutHigh, l: Math.min(p, fakeoutClose) - 0.15 });
  p = past[past.length - 1].c;
  // 2 candles confirmant
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.25 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.2 + rng() * 0.22) * m));
    p = c;
  }
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : 1 bump léger qui retest R sans atteindre fakeoutHigh, puis drop
  fut.push({ o: p, c: R - 0.6 * m, h: R - 0.05 * m, l: Math.min(p, R - 0.6 * m) - 0.15 });
  p = R - 0.6 * m;
  fut.push(candle(p, p - 0.4 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.4 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance",     y1: R - 0.1, y2: R + 0.1, label: "Résistance" },
    { kind: "liquidity_high", y1: R + 0.15, y2: fakeoutHigh, label: "Wick fakeout" },
  ], ref: { swingLow: entryRef - 4 * m, swingHigh: fakeoutHigh, entryRef } };
}

// 9. Sweep low + reversal (BUY)
function shapeSweepLowReversal(rng: () => number, m: number): ShapeOutput {
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
  // Le « précédent low » : le creux de la consolidation touche le niveau L
  const consol = past.slice(-3);
  const prevLow = consol.reduce((a, k) => (k.l < a.l ? k : a));
  prevLow.l = Math.min(prevLow.l, L + 0.02);
  // Sweep candle
  const sweepLow = L - 1.2 * m - rng() * 0.3;
  past.push({ o: p, c: L + 0.4 + rng() * 0.2, h: p + 0.15, l: sweepLow });
  p = past[past.length - 1].c;
  // 1 confirmation
  past.push(candle(p, p + (0.3 + rng() * 0.3) * m, (0.2 + rng() * 0.18) * m, 0.1));
  p = past[past.length - 1].c;
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : continuation haussière
  for (let i = 0; i < 7; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support",       y1: L - 0.1,    y2: L + 0.1,    label: "Précédent low"     },
    { kind: "liquidity_low", y1: sweepLow,   y2: L - 0.15,   label: "Liquidité balayée" },
  ], ref: { swingLow: sweepLow, swingHigh: entryRef + 4 * m, entryRef } };
}

// 10. FVG continuation (BUY)
function shapeFvgContinuation(rng: () => number, m: number): ShapeOutput {
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
  // Pullback dans le FVG
  const target = (fvgLow + fvgHigh) / 2;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = Math.max(target, o - (0.3 + rng() * 0.3) * m);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  // 1 candle de réaction
  past.push(candle(p, p + 0.25 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p = past[past.length - 1].c;
  const entryRef = p;
  const fut: Candle[] = [];
  // Dip léger qui touche le FVG sans le mitiger entièrement (~25-50% max), puis rallye
  fut.push({ o: p, c: target + 0.1 * m, h: p + 0.1 * m, l: Math.min(fvgLow + 0.75 * m, target + 0.05 * m) });
  p = target + 0.1 * m;
  fut.push(candle(p, p + 0.4 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p += 0.4 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "fvg", y1: fvgLow, y2: fvgHigh, label: "FVG haussier" },
  ], ref: { swingLow: fvgLow, swingHigh: entryRef + 4 * m, entryRef } };
}

// 11. Deep pullback risky (BUY context but pullback too deep)
function shapeDeepPullbackRisky(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  const peak = p;
  // Pullback profond — 6 bougies rouges, retracement ~65%
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.45) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  // « Plus de 60% de l'impulsion retracée » sans la retracer entièrement :
  // on met à l'échelle les corps du pullback (mèches conservées).
  const impulse = peak - past[0].o;
  const ratio = (peak - p) / impulse;
  const target = ratio < 0.62 ? 0.62 + 0.1 * (ratio / 0.62) : ratio > 0.88 ? 0.88 : ratio;
  if (target !== ratio) {
    const f = target / ratio;
    let q = peak;
    for (const k of past.slice(8)) {
      const wU = k.h - Math.max(k.o, k.c), wD = Math.min(k.o, k.c) - k.l;
      const c = q - (k.o - k.c) * f;
      k.o = q; k.c = c; k.h = q + wU; k.l = c - wD;
      q = c;
    }
    p = q;
  }
  const swingLow = Math.min(...past.slice(-7).map((k) => k.l));
  const topHigh = Math.max(...past.map((k) => k.h));
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : 1 candle indécise puis recovery (mais initiale faible)
  fut.push(candle(p, p + 0.15 * m, (0.2 + rng() * 0.15) * m, (0.15 + rng() * 0.15) * m));
  p += 0.15 * m;
  fut.push(candle(p, p + 0.3 * m, (0.2 + rng() * 0.15) * m, 0.12));
  p += 0.3 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.35 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support",        y1: swingLow - 0.04,    y2: swingLow + 0.04,    label: "Zone douteuse" },
    { kind: "liquidity_high", y1: topHigh - 0.05,      y2: topHigh + 0.05,     label: "Précédent high" },
  ], ref: { swingLow, swingHigh: peak, entryRef } };
}

// 12. High volatility pullback
function shapeHighVolPullback(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const effM = m * 1.6;
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
  const entryRef = p;
  const fut: Candle[] = [];
  // Dip large (vol élevée) qui balaie le swingLow jusque sous le stop logique
  // (« le stop standard se fait balayer ») mais reste au-dessus du wide
  fut.push({
    o: p,
    c: swingLow + 0.6 * effM,
    h: p + (0.3 + rng() * 0.2) * effM,
    l: swingLow - 0.55 * effM,
  });
  p = swingLow + 0.6 * effM;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.4) * effM;
    fut.push(candle(o, c, (0.3 + rng() * 0.2) * effM, (0.15 + rng() * 0.15) * effM));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: swingLow - 0.05, y2: swingLow + 0.05, label: "Swing low" },
  ], ref: { swingLow, swingHigh: entryRef + 4 * effM, entryRef, wideM: 0.95 } };
}

// 13. Weak breakout
function shapeWeakBreakout(rng: () => number, m: number): ShapeOutput {
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
    const d = rng() - 0.5;
    // La dernière bougie de consolidation clôture juste sous la résistance :
    // la cassure qui suit est « petite et hésitante »
    const c = i === 3 ? R - 0.05 - 0.05 * (d + 0.5) : clamp(o + d * 0.5 * m, R - 1.1, R - 0.3);
    const k = candle(o, c, (0.22 + rng() * 0.18) * m, (0.22 + rng() * 0.18) * m);
    k.h = Math.min(k.h, R + 0.05);
    past.push(k);
    p = c;
  }
  // Weak breakout candle : petit corps, mèche haute d'au moins 1,6× le corps
  const weakClose = R + 0.15 + rng() * 0.2;
  past.push(candle(p, weakClose, Math.max((0.3 + rng() * 0.2) * m, 1.6 * (weakClose - p)), 0.15));
  p = past[past.length - 1].c;
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : rallye modéré (fast TP atteint, balanced parfois, ambitious rarement)
  fut.push(candle(p, p - 0.15 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.15 * m;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.3) * m;  // momentum mou
    fut.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance" },
  ], ref: { swingLow: R - 0.5, swingHigh: R + 0.5, entryRef, fastR: 1.6 } };
}

// 14. Counter-trend local (BUY against HTF bearish)
function shapeCounterTrendLocal(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  let p = 8 + rng() * 0.3;
  // Downtrend HTF
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.4) * m;
    past.push(candle(o, c, (0.12 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const minorLevel = p;
  // 4 candles rebond local
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const entryRef = p;
  // Structure de confirmation : les 2 dernières bougies du rebond local. Le
  // stop logique se place dessous (swingLow - marge, cf. formule des stops).
  const structLow = Math.min(past[past.length - 1].l, past[past.length - 2].l);
  const conf = entryRef + 0.5 * m;              // entrée « confirmation »
  const risk = conf - (structLow - 0.4 * m);    // jusqu'au stop logique
  const fut: Candle[] = [];
  // Future : rebond jusqu'au niveau de retournement puis échec (continuation baissière)
  fut.push(candle(p, p - 0.15 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.15 * m;
  // Le sommet du rebond est assez haut pour que le TP rapide, placé juste
  // avant, vaille 1,7 R depuis l'entrée confirmation
  const rebound = [0, 1].map(() => ({ s: (0.25 + rng() * 0.25) * m, wU: (0.18 + rng() * 0.15) * m, wD: (0.13 + rng() * 0.13) * m }));
  const topLevel = conf + 1.7 * risk + 0.1 * m;
  const kr = Math.max(1, (topLevel - rebound[1].wU - p) / (rebound[0].s + rebound[1].s));
  for (const r of rebound) {
    const o = p;
    const c = o + r.s * kr;
    fut.push(candle(o, c, r.wU, r.wD));
    p = c;
  }
  // Sommet du rebond : mèche de rejet, c'est le niveau de retournement
  const top = fut[fut.length - 1];
  top.h = Math.max(top.h, entryRef + 0.9 * m);
  // Puis échec : le prix repasse sous le point d'entrée
  const fail = [0, 1, 2, 3].map(() => ({ s: (0.35 + rng() * 0.35) * m, wU: (0.13 + rng() * 0.13) * m, wD: (0.2 + rng() * 0.2) * m }));
  const kf = Math.max(1, (p - (entryRef - 0.3 * m)) / fail.reduce((a, f) => a + f.s, 0));
  for (const f of fail) {
    const o = p;
    const c = o - f.s * kf;
    const k = candle(o, c, f.wU, f.wD);
    k.h = Math.min(k.h, top.h - 0.02 * m); // l'échec ne dépasse pas le sommet
    fut.push(k);
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: minorLevel - 0.08, y2: minorLevel + 0.08, label: "Niveau secondaire" },
  ], ref: { swingLow: structLow, swingHigh: entryRef + 1.5 * m, entryRef, reversal: top.h } };
}

// ─── Dispatch + entries/stops/tps ────────────────────────────────────────────

/** Graphique converti à l'échelle de prix de l'actif (au dernier moment, pour l'affichage). */
export function withAssetPrices(chart: BuildTradeChart, inst: { asset: Asset; seed: number }): BuildTradeChart {
  const f = assetPriceMap(inst.asset, inst.seed, chart.currentPrice);
  const map = <T extends string>(r: Record<T, number>) =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, f(v as number)])) as Record<T, number>;
  return {
    ...chart,
    past:    chart.past.map(mapCandle(f)),
    future:  chart.future.map(mapCandle(f)),
    zones:   chart.zones.map(mapZone(f)),
    domain:  mapDomain(f, chart.domain),
    entries: map(chart.entries),
    stops:   map(chart.stops),
    tps:     map(chart.tps),
    currentPrice: f(chart.currentPrice),
  };
}

/** Graphique du scénario, avec la passe de réalisme des bougies (niveaux clés : zones, entrées, stops, TP). */
export function buildBuildTradeChart(template: BuildTradeTemplate, seed: number, vol: Volatility): BuildTradeChart {
  const ch = buildBuildTradeChartRaw(template, seed, vol);
  // (passé : zones ; futur : aussi entrées, stops et TP, qui décident de l'issue)
  const zones = ch.zones.flatMap((z) => [z.y1, z.y2]);
  const plan = [...Object.values(ch.entries), ...Object.values(ch.stops), ...Object.values(ch.tps)];
  return realizeChart(ch, { past: zones, future: [...zones, ...plan] }, seed);
}

/** Graphique brut du scénario, avant la passe de réalisme (audits). */
export function buildBuildTradeChartRaw(template: BuildTradeTemplate, seed: number, vol: Volatility): BuildTradeChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[vol];
  let shape: ShapeOutput;
  switch (template.chartShape) {
    case "uptrend_pullback":     shape = shapeUptrendPullback(rng, m); break;
    case "downtrend_pullback":   shape = shapeDowntrendPullback(rng, m); break;
    case "breakout_up":          shape = shapeBreakoutUp(rng, m); break;
    case "breakout_down":        shape = shapeBreakoutDown(rng, m); break;
    case "bounce_support":       shape = shapeBounceSupport(rng, m); break;
    case "rejection_resistance": shape = shapeRejectionResistance(rng, m); break;
    case "range_oscillation":    shape = shapeRangeOscillation(rng, m, template.direction); break;
    case "fakeout_above":        shape = shapeFakeoutAbove(rng, m); break;
    case "sweep_low_reversal":   shape = shapeSweepLowReversal(rng, m); break;
    case "fvg_continuation":     shape = shapeFvgContinuation(rng, m); break;
    case "deep_pullback_risky":  shape = shapeDeepPullbackRisky(rng, m); break;
    case "high_vol_pullback":    shape = shapeHighVolPullback(rng, m); break;
    case "weak_breakout":        shape = shapeWeakBreakout(rng, m); break;
    case "counter_trend_local":  shape = shapeCounterTrendLocal(rng, m); break;
  }
  const { swingLow, swingHigh, entryRef } = shape.ref;
  const direction = template.direction;
  const effM = template.chartShape === "high_vol_pullback" ? m * 1.6 : m;
  // Calcul des 3 entries
  const entries = direction === "BUY"
    ? {
        aggressive:    entryRef,
        confirmation:  entryRef + 0.5 * effM,
        deep_pullback: Math.max(swingLow + 0.1 * effM, entryRef - 0.7 * effM),
      }
    : {
        aggressive:    entryRef,
        confirmation:  entryRef - 0.5 * effM,
        deep_pullback: Math.min(swingHigh - 0.1 * effM, entryRef + 0.7 * effM),
      };
  // Stops (depuis le swing logique). Le serré reste au-delà de l'entrée
  // « pullback profond » (qui peut être plafonnée au même niveau que lui).
  const stops = direction === "BUY"
    ? {
        tight:   Math.min(swingLow + 0.1 * effM, entries.deep_pullback - 0.1 * effM),
        logical: swingLow - 0.4 * effM,
        wide:    swingLow - (shape.ref.wideM ?? 1.2) * effM,
      }
    : {
        tight:   Math.max(swingHigh - 0.1 * effM, entries.deep_pullback + 0.1 * effM),
        logical: swingHigh + 0.4 * effM,
        wide:    swingHigh + (shape.ref.wideM ?? 1.2) * effM,
      };
  // TPs (depuis entry, multiples de risque)
  // On utilise l'entry "confirmation" comme référence pour le risque
  const ref = direction === "BUY" ? entries.confirmation : entries.confirmation;
  const refRisk = Math.abs(ref - stops.logical);
  // TP rapide : juste avant le niveau de retournement ou la borne opposée du
  // range quand le scénario en a un, sinon à fastR (1 par défaut) × le risque
  const dir = direction === "BUY" ? 1 : -1;
  let fast = ref + dir * refRisk * (shape.ref.fastR ?? 1.0);
  if (shape.ref.reversal !== undefined) fast = shape.ref.reversal - dir * 0.1 * effM;
  if (shape.ref.bound !== undefined) fast = ref + dir * Math.min(Math.abs(shape.ref.bound - ref) - 0.05 * effM, 1.9 * refRisk);
  const fastBuy = fast;
  const fastSell = fast;
  const tps = direction === "BUY"
    ? {
        fast:      fastBuy,
        balanced:  ref + refRisk * 2.2,
        ambitious: ref + refRisk * 3.8,
      }
    : {
        fast:      fastSell,
        balanced:  ref - refRisk * 2.2,
        ambitious: ref - refRisk * 3.8,
      };
  // Suite prolongée jusqu'à FUTURE_LENGTH bougies, tirage séparé (le début de
  // la suite ne change pas) : le marché va au bout du plan optimal au lieu de
  // s'arrêter en cours de route.
  const shapeKind = template.chartShape;
  extendFuture(shape.future, mulberry32((seed ^ 0xC2B2AE35) >>> 0), effM,
    shapeKind === "range_oscillation"
      ? { kind: "range", S: swingLow, R: swingHigh, dir: direction === "BUY" ? 1 : -1, target: tps[template.optimal.tp] }
    : shapeKind === "counter_trend_local" ? { kind: "drift", dir: -1 }  // l'échec du rebond se poursuit
    : {
        kind:   "target",
        dir:    direction === "BUY" ? 1 : -1,
        target: tps[template.optimal.tp] + (direction === "BUY" ? 0.15 : -0.15) * effM,
        fade:   shapeKind === "weak_breakout", // cassure faible : pas de continuation après le TP
      });
  const { domain } = finalize(shape.past, shape.future, shape.zones, [
    ...Object.values(entries), ...Object.values(stops), ...Object.values(tps),
  ]);
  return keepPricesPositive({
    past:    shape.past,
    future:  shape.future,
    zones:   shape.zones,
    domain,
    direction,
    entries,
    stops,
    tps,
    currentPrice: entryRef,
  });
}

// Les prix sont affichés au joueur (boutons, étiquettes) : un graphique qui
// passe sous 0 est décalé d'un nombre entier (distances, R/R et issues inchangés).
function keepPricesPositive(ch: BuildTradeChart): BuildTradeChart {
  const low = Math.min(
    ...Object.values(ch.entries), ...Object.values(ch.stops), ...Object.values(ch.tps),
    ...[...ch.past, ...ch.future].map((k) => k.l),
    ...ch.zones.map((z) => Math.min(z.y1, z.y2)),
  );
  if (low >= 0.5) return ch;
  const d = Math.ceil(1 - low);
  const k = (c: Candle): Candle => ({ o: c.o + d, h: c.h + d, l: c.l + d, c: c.c + d });
  const add = <T extends string>(r: Record<T, number>) =>
    Object.fromEntries(Object.entries(r).map(([key, v]) => [key, (v as number) + d])) as Record<T, number>;
  return {
    ...ch,
    past:    ch.past.map(k),
    future:  ch.future.map(k),
    zones:   ch.zones.map((z) => ({ ...z, y1: z.y1 + d, y2: z.y2 + d })),
    domain:  { min: ch.domain.min + d, max: ch.domain.max + d },
    entries: add(ch.entries),
    stops:   add(ch.stops),
    tps:     add(ch.tps),
    currentPrice: ch.currentPrice + d,
  };
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export interface ChoiceSet {
  entry: EntryType;
  stop:  StopType;
  tp:    TpType;
}

export type Outcome = "tp_hit" | "sl_hit" | "no_fill" | "open";

export interface BuildTradeResult {
  outcome:      Outcome;
  entryFilled:  boolean;
  entryIdx:     number | null;
  slHit:        boolean;
  slIdx:        number | null;
  tpHit:        boolean;
  tpIdx:        number | null;
  rr:           number;       // R/R réalisé (0 si pas de hit)
  maxDrawdown:  number;       // drawdown max absolu après entry
  // Score breakdown
  qualityMatch:  number;      // 0-3 (combien correspondent à optimal)
  qualityPoints: number;
  outcomePoints: number;
  points:        number;      // total
  streakBonus:   number;
}

function findEntryFillIndex(entry: number, direction: TradeDirection, future: Candle[]): number | null {
  for (let i = 0; i < future.length; i++) {
    const k = future[i];
    // BUY entry fills si low <= entry (price came down to entry)
    // SELL entry fills si high >= entry
    if (direction === "BUY"  && k.l <= entry && k.h >= entry) return i;
    if (direction === "SELL" && k.h >= entry && k.l <= entry) return i;
  }
  return null;
}

function findStopHitIndex(stop: number, direction: TradeDirection, future: Candle[], startIdx: number): number | null {
  for (let i = startIdx; i < future.length; i++) {
    const k = future[i];
    if (direction === "BUY"  && k.l <= stop) return i;
    if (direction === "SELL" && k.h >= stop) return i;
  }
  return null;
}

function findTpHitIndex(tp: number, direction: TradeDirection, future: Candle[], startIdx: number): number | null {
  for (let i = startIdx; i < future.length; i++) {
    const k = future[i];
    if (direction === "BUY"  && k.h >= tp) return i;
    if (direction === "SELL" && k.l <= tp) return i;
  }
  return null;
}

function maxDrawdownAfterEntry(entry: number, direction: TradeDirection, future: Candle[], startIdx: number, endIdx: number): number {
  let worst = entry;
  for (let i = startIdx; i <= endIdx && i < future.length; i++) {
    const k = future[i];
    if (direction === "BUY")  worst = Math.min(worst, k.l);
    if (direction === "SELL") worst = Math.max(worst, k.h);
  }
  return Math.abs(entry - worst);
}

export function evaluateTrade(
  picks:    ChoiceSet,
  chart:    BuildTradeChart,
  optimal:  ChoiceSet,
  currentStreak: number,
): BuildTradeResult {
  const entry = chart.entries[picks.entry];
  const stop  = chart.stops[picks.stop];
  const tp    = chart.tps[picks.tp];
  const direction = chart.direction;
  const future = chart.future;

  // Entry fill
  let entryIdx = findEntryFillIndex(entry, direction, future);
  // Pour aggressive, l'entry est à entryRef = dernier close du past = touché immédiatement
  // → on considère que la position s'ouvre dès la 1re bougie future
  if (picks.entry === "aggressive") entryIdx = 0;
  const entryFilled = entryIdx !== null;

  let outcome: Outcome = "no_fill";
  let slIdx: number | null = null;
  let tpIdx: number | null = null;
  let slHit = false;
  let tpHit = false;
  let rr = 0;
  let drawdown = 0;

  if (entryFilled) {
    slIdx = findStopHitIndex(stop, direction, future, entryIdx!);
    tpIdx = findTpHitIndex(tp, direction, future, entryIdx!);
    // Lequel arrive en premier ?
    if (tpIdx !== null && (slIdx === null || tpIdx < slIdx)) {
      tpHit = true;
      outcome = "tp_hit";
      rr = Math.abs(tp - entry) / Math.max(0.001, Math.abs(entry - stop));
      drawdown = maxDrawdownAfterEntry(entry, direction, future, entryIdx!, tpIdx);
    } else if (slIdx !== null) {
      slHit = true;
      outcome = "sl_hit";
      drawdown = maxDrawdownAfterEntry(entry, direction, future, entryIdx!, slIdx);
    } else {
      outcome = "open";
      drawdown = maxDrawdownAfterEntry(entry, direction, future, entryIdx!, future.length - 1);
    }
  }

  // Score
  let qualityMatch = 0;
  if (picks.entry === optimal.entry) qualityMatch++;
  if (picks.stop  === optimal.stop)  qualityMatch++;
  if (picks.tp    === optimal.tp)    qualityMatch++;
  const qualityPoints = qualityMatch === 3 ? 60 : qualityMatch === 2 ? 30 : qualityMatch === 1 ? 0 : -20;

  let outcomePoints = 0;
  if (outcome === "tp_hit") {
    outcomePoints = 30 + Math.max(0, Math.round((rr - 1) * 20));
  } else if (outcome === "sl_hit") {
    outcomePoints = -30;
  } else if (outcome === "open") {
    outcomePoints = 5;
  } else {
    // no_fill
    outcomePoints = 10;
  }

  const basePoints = qualityPoints + outcomePoints;
  const streakBonus = qualityMatch === 3 && outcome === "tp_hit" && currentStreak >= 2 ? 30 : 0;

  return {
    outcome,
    entryFilled,
    entryIdx,
    slHit,
    slIdx,
    tpHit,
    tpIdx,
    rr,
    maxDrawdown:  drawdown,
    qualityMatch,
    qualityPoints,
    outcomePoints,
    points:       basePoints + streakBonus,
    streakBonus,
  };
}

// ─── Verdicts ────────────────────────────────────────────────────────────────

export function setupVerdict(result: BuildTradeResult): { label: string; color: "emerald" | "amber" | "red" } {
  if (result.qualityMatch === 3 && result.outcome === "tp_hit") return { label: "Setup parfait",     color: "emerald" };
  if (result.qualityMatch >= 2  && result.outcome === "tp_hit") return { label: "Setup solide",      color: "emerald" };
  // 0 ou 1 critère sur 3 : trade gagnant, mais le plan reste faible (ambre)
  if (result.outcome === "tp_hit")                              return { label: "Gagnant, mais plan faible", color: "amber" };
  if (result.outcome === "no_fill")                             return { label: "Trade non rempli",  color: "amber"   };
  if (result.outcome === "open")                                return { label: "Trade en cours",    color: "amber"   };
  if (result.qualityMatch >= 2)                                 return { label: "Bon plan, mauvais marché", color: "amber" };
  return { label: "Setup raté", color: "red" };
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Débutant",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Structure claire, choix relativement évidents, comprends invalidation et RR.",
  },
  intermediate: {
    label:       "Intermédiaire",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Plusieurs choix plausibles : sécurité vs rendement, confirmation vs RR.",
  },
  advanced: {
    label:       "Avancé",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Contexte ambigu, aucun setup parfait. Choix du moins mauvais scénario.",
  },
};

export function sessionVerdict(score: number, perfectCount: number, total: number): string {
  if (perfectCount >= total - 1) return "Trader architecte";
  if (score >= 500)              return "Construction solide";
  if (score >= 200)              return "Plan correct";
  if (score >= 0)                return "Encore à structurer";
  return "Plan désordonné";
}
