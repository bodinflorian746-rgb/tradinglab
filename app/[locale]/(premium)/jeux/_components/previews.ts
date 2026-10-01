// Aperçus des cartes du hub /jeux : quelques vraies bougies tirées du
// générateur de chaque jeu (graine fixe : même aperçu à chaque visite) et
// l'élément clé du jeu. Calculé côté serveur ; seules les données du
// graphique partent vers le client (GameChartV2).

import type { Locale } from "@/i18n/config";
import type { Candle, ChartData } from "@/lib/games/shared";
import type { MiniChartOverlay } from "@/app/components/games/MiniChart";
import type { GameChartMark } from "@/app/components/games/v2/GameChartV2";
import * as BsntFr from "@/lib/games/buy-sell-no-trade";
import * as BsntEs from "@/lib/games/buy-sell-no-trade-es";
import * as BsntEn from "@/lib/games/buy-sell-no-trade-en";
import * as PsFr from "@/lib/games/place-stop";
import * as PsEs from "@/lib/games/place-stop-es";
import * as PsEn from "@/lib/games/place-stop-en";
import * as FtmFr from "@/lib/games/find-the-mistake";
import * as FtmEs from "@/lib/games/find-the-mistake-es";
import * as FtmEn from "@/lib/games/find-the-mistake-en";
import * as BttFr from "@/lib/games/build-the-trade";
import * as BttEs from "@/lib/games/build-the-trade-es";
import * as BttEn from "@/lib/games/build-the-trade-en";

export interface GamePreview {
  data: ChartData;
  overlay?: MiniChartOverlay;
  mark?: GameChartMark;
  tpOffscale?: boolean;
  /** Bougies à pleine opacité : l'aperçu reste vivant (pas d'estompage au « spot ») */
  keepCandlesBright: true;
}

export type PreviewId = "buy-sell-no-trade" | "place-stop" | "find-the-mistake" | "build-the-trade";

/** Graine fixe de chaque aperçu (une par jeu : des graphiques bien distincts) */
const SEED = { bsnt: 20260615, ps: 20260616, ftm: 20260617, btt: 20260618 } as const;
const CTX = { asset: "EUR/USD", session: "Londres" } as const;
/** Bougies montrées par aperçu */
const N = 10;

// Couleurs des lignes, reprises des jeux
const STOP_COLORS = ["#ef4444", "#f59e0b", "#a78bfa"];  // Place ton Stop : Stop 1, 2, 3
const LINE = { entry: "#3b82f6", stop: "#ef4444", tp: "#10b981" };  // Build the Trade

const ENTRY_LABEL: Record<Locale, string> = { fr: "Entrée", es: "Entrada", en: "Entry" };

const pick = <T,>(locale: Locale, fr: T, es: T, en: T): T => (locale === "es" ? es : locale === "en" ? en : fr);

/** Les n dernières bougies, en gardant la bougie d'impulsion d'une zone FVG */
function lastCandles(candles: Candle[], n: number, keepIndex = candles.length - 1): Candle[] {
  const start = Math.max(0, Math.min(candles.length - n, keepIndex - 1));
  return candles.slice(start, start + n);
}

function buySellPreview(locale: Locale): GamePreview {
  const G = pick<Pick<typeof BsntFr, "buildChart">>(locale, BsntFr, BsntEs, BsntEn);
  const chart = G.buildChart("fvg_reaction", SEED.bsnt, "normale", "intermediate", CTX);
  const fvg = chart.zones.find((z) => z.kind === "fvg");
  const lo = fvg ? Math.min(fvg.y1, fvg.y2) : 0;
  const hi = fvg ? Math.max(fvg.y1, fvg.y2) : 0;
  const impulse = chart.past.findIndex((k) => Math.min(k.o, k.c) <= lo && Math.max(k.o, k.c) >= hi);
  return {
    data: { candles: lastCandles(chart.past, N, impulse < 0 ? undefined : impulse), zones: fvg ? [fvg] : [], domain: chart.domain },
    keepCandlesBright: true,
  };
}

function placeStopPreview(locale: Locale): GamePreview {
  const G = pick<Pick<typeof PsFr, "buildPlaceStopChart">>(locale, PsFr, PsEs, PsEn);
  const chart = G.buildPlaceStopChart("pullback_bull", SEED.ps, "normale", "intermediate", CTX);
  // Stop 1 = le plus haut, comme dans le jeu
  const stops = [...chart.stops].sort((a, b) => b.price - a.price);
  return {
    data: { candles: lastCandles(chart.past, N), zones: [], domain: chart.domain },
    overlay: {
      entry: { price: chart.entry, direction: chart.direction },
      tp: chart.tp !== null ? { price: chart.tp } : undefined,
      stops: stops.map((s, i) => ({ price: s.price, color: STOP_COLORS[i], dashed: true, label: `Stop ${i + 1}` })),
      dimEntryTp: true,
    },
    tpOffscale: true,
    keepCandlesBright: true,
  };
}

function findMistakePreview(locale: Locale): GamePreview {
  const G = pick<Pick<typeof FtmFr, "MISTAKE_TEMPLATES" | "MISTAKE_LABELS" | "buildScenarioChart">>(locale, FtmFr, FtmEs, FtmEn);
  const template = G.MISTAKE_TEMPLATES.find((t) => t.id === "stop_too_tight")!;
  const chart = G.buildScenarioChart(template, SEED.ftm, "normale", CTX);
  const entry = chart.entry ?? chart.past[chart.past.length - 1].c;
  return {
    data: { candles: lastCandles(chart.past, N), zones: [], domain: chart.domain },
    // Ligne du stop tracée par l'overlay : le marquage « line » n'est qu'une lueur
    overlay: { entry: { price: entry, direction: "BUY" }, stop: chart.stop !== undefined ? { price: chart.stop } : undefined },
    // L'erreur marquée, comme au verdict du jeu : le stop trop serré
    mark: chart.stop !== undefined
      ? { kind: "line", price: chart.stop, label: G.MISTAKE_LABELS.stop_too_tight }
      : { kind: "point", price: entry, label: G.MISTAKE_LABELS.stop_too_tight },
    keepCandlesBright: true,
  };
}

function buildTradePreview(locale: Locale): GamePreview {
  const G = pick<Pick<typeof BttFr, "BUILD_TRADE_TEMPLATES" | "buildBuildTradeChart">>(locale, BttFr, BttEs, BttEn);
  const template = G.BUILD_TRADE_TEMPLATES.find((t) => t.id === "trend_continuation_bull")!;
  const chart = G.buildBuildTradeChart(template, SEED.btt, "normale", CTX);
  const { entry, stop, tp } = template.optimal;
  return {
    data: { candles: lastCandles(chart.past, N), zones: [], domain: chart.domain },
    overlay: {
      stops: [
        { price: chart.tps[tp], color: LINE.tp, dashed: false, label: "TP" },
        { price: chart.entries[entry], color: LINE.entry, dashed: false, label: ENTRY_LABEL[locale] },
        { price: chart.stops[stop], color: LINE.stop, dashed: false, label: "Stop" },
      ],
    },
    keepCandlesBright: true,
  };
}

export function buildGamePreviews(locale: Locale): Record<PreviewId, GamePreview> {
  return {
    "buy-sell-no-trade": buySellPreview(locale),
    "place-stop": placeStopPreview(locale),
    "find-the-mistake": findMistakePreview(locale),
    "build-the-trade": buildTradePreview(locale),
  };
}
