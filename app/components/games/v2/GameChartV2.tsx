"use client";

// Graphique des jeux — charte v2 (rendu validé dans /design-lab).
// Même API que MiniChart (data / overlay / height), plus trois props
// optionnelles : mode (question / reveal / verdict), pin (choix du joueur) et
// children (calque superposé, ex. le verdict).
//
// - Géométrie calculée en pixels réels sur la taille du cadre (ResizeObserver).
// - Traits ≥ 2px, zone héros (1re zone) remplie + glow + pastille.
// - Couleur = mouvement : close > open → vert, close < open → rouge,
//   close = open (doji) → neutre.
// - Révélation : bougies du passé une à une au chargement (420ms), puis
//   chaque bougie future montée par la page apparaît avec la même animation.
// Doit être rendu sous un ancêtre .tsx-v2 (app/styles/tsx-v2.css).

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Candle, ChartData, ChartZone, ZoneKind } from "@/lib/games/shared";
import type { MiniChartOverlay } from "@/app/components/games/MiniChart";
import { candleBody } from "@/app/components/games/candle-geometry";

// ─── Outils partagés (réutilisés par ui.tsx et les autres jeux v2) ──────────

export function cssVars(vars: Record<string, string | number>): CSSProperties {
  return vars as CSSProperties;
}

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Largeur approximative d'un libellé (Space Grotesk / Inter gras). */
export const textWidth = (s: string, fontPx: number) => s.length * fontPx * 0.6;

/** Lance les animations quand le bloc entre dans l'écran ; replay() les rejoue. */
export function usePlayOnView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [playing, setPlaying] = useState(false);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || playing) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [playing, threshold, runKey]);

  const replay = useCallback(() => {
    setRunKey((k) => k + 1);
    setPlaying(false);
  }, []);

  return { ref, playing, runKey, replay };
}

/** Taille réelle d'un cadre : le SVG dessine en pixels CSS. */
export function useBoxSize<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => (Math.abs(s.w - width) < 0.5 && Math.abs(s.h - height) < 0.5 ? s : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, ...size };
}

const DESKTOP_QUERY = "(min-width: 1024px)";
/** Taille de la pastille héros sur desktop (≥ 1024px). */
export const DESKTOP_PILL_PX = 13;

export function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(DESKTOP_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

// ─── Bougie ──────────────────────────────────────────────────────────────────

type V2CandleProps = Candle & {
  x: number;
  width: number;
  toY: (price: number) => number;
  index: number;
  /** "anim" : révélée puis estompée au --spot ; "now" : déjà estompée ; "full" : pleine opacité */
  dim?: "anim" | "now" | "full";
  /** true : visible d'emblée (pas d'animation d'apparition) */
  still?: boolean;
  /** Clôture précédente : couleur d'une bougie sans corps (jamais de bougie neutre) */
  prevClose?: number;
  /** Jeux : mèche au plus un tiers du corps (1 à 3 px) ; sinon 3 px (rendu des leçons inchangé) */
  thinWick?: boolean;
};

export function V2Candle({ o, h, l, c, x, width, toY, index, dim = "anim", still = false, prevClose, thinWick = false }: V2CandleProps) {
  // Toujours verte ou rouge : sans corps, la couleur suit la clôture précédente
  const up = c > o || (c === o && (prevClose === undefined || c >= prevClose));
  const body = up ? "var(--v2-bull)" : "var(--v2-bear)";
  const wick = up ? "var(--v2-bull-wick)" : "var(--v2-bear-wick)";
  // Corps exact entre ouverture et clôture (barre fine centrée pour un doji)
  const bodyBox = candleBody(o, c, toY);
  const dimClass = dim === "anim" ? "v2-dim" : dim === "now" ? "v2-dim--now" : undefined;

  return (
    <g className={dimClass}>
      <g className={still ? "v2-candle v2-candle--static" : "v2-candle"} style={cssVars({ "--i": index })}>
        {/* Jeux : mèche toujours nettement plus fine que le corps, au plus un tiers de sa largeur (1 à 3 px) */}
        <line x1={x} x2={x} y1={toY(h)} y2={toY(l)} stroke={wick} strokeWidth={thinWick ? Math.max(1, Math.min(3, width / 3)) : 3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <rect x={x - width / 2} y={bodyBox.y} width={width} height={bodyBox.h} rx={Math.min(3, bodyBox.h / 2)} fill={body} />
      </g>
    </g>
  );
}

// ─── Graphique ──────────────────────────────────────────────────────────────

export type GameChartMode = "question" | "reveal" | "verdict";

/** Marquage de verdict : une ligne de prix, une zone ou un point (dernière bougie). */
export type GameChartMark =
  | { kind: "line"; price: number; label: string }
  | { kind: "zone"; index: number; label: string }
  | { kind: "point"; price: number; label: string };

export interface GameChartV2Props {
  data: ChartData;
  overlay?: MiniChartOverlay;
  /** Compatibilité MiniChart : ignoré, la hauteur vient de la charte v2. */
  height?: number;
  /** Déduit de l'overlay si absent : question tant qu'aucune bougie future n'est révélée. */
  mode?: GameChartMode;
  /** Choix du joueur, épinglé en haut à gauche (reveal / verdict). */
  pin?: { label: string; sub?: string; color: string };
  /**
   * Sans effet : les bougies ne sont plus jamais estompées avant la réponse (gardé pour
   * les appels existants).
   */
  keepCandlesBright?: boolean;
  /** Élément marqué en rouge au verdict (ex. l'erreur de « Trouve l'erreur »). */
  mark?: GameChartMark;
  /**
   * Verdict en bandeau en bas du cadre (VerdictOverlay compact, `bottom`), quand le haut est pris
   * par la pastille « ton choix » (Place ton Stop) : sa hauteur est réservée en bas, aucune bougie,
   * ligne ni étiquette dessous (l'entrée et les stops restent lisibles).
   */
  verdictBanner?: "bottom";
  /**
   * Prix et libellés à venir, réservés d'avance dans l'échelle et la colonne
   * d'étiquettes : le cadrage ne bouge pas quand les lignes affichées changent
   * (ex. les étapes de « Build the Trade »).
   */
  reserve?: { prices?: number[]; labels?: string[] };
  /**
   * Objectif (overlay.tp) très au-delà des bougies et des stops : tracé au bord
   * du graphique avec une étiquette « TP ↑ / ↓ », hors échelle, pour ne pas
   * écraser les bougies.
   */
  tpOffscale?: boolean;
  /**
   * Aperçu (hub des jeux) : cadre bas (.v2-chart--preview), révélation
   * accélérée, et marquage affiché dès l'état question, avec le héros.
   */
  preview?: boolean;
  /**
   * Étiquettes posées sur leur ligne : petites pastilles au bord droit, sans
   * trait de liaison (décalées vers la gauche si deux niveaux sont trop
   * proches) ; les zones sont nommées sur le graphique (plus de pastille sous
   * la zone). Une ligne sans libellé est un trait discret (niveau d'une autre
   * étape). Lignes et étiquettes portent data-line / data-label-for (audit).
   */
  inlineLabels?: boolean;
  /** Zones nommées sur le graphique (inlineLabels) : indices ; toutes par défaut. */
  labeledZones?: number[];
  /** Ligne mise en avant (clé « stop{i} » ou « cand{i} ») : les autres candidates s'estompent. */
  emphasis?: string | null;
  /** Échelle animée aussi d'un état question à l'autre (ex. étapes de Build the Trade). */
  glideScale?: boolean;
  /** Calque superposé au graphique (ex. VerdictOverlay). */
  children?: ReactNode;
}

const STEP_MS = 420;
/** Rythme de révélation des aperçus : quelques bougies, révélées en ~1 s */
const PREVIEW_STEP_MS = 100;
/**
 * Durée du glissement au clic (cadrage « passé » → « passé + futur »). La page
 * attend cette durée avant de révéler la 1re bougie future.
 */
export const V2_GLIDE_MS = 500;
/**
 * Délai avant la 1re bougie future : la transition CSS démarre une image après
 * le clic ; la marge garantit que la révélation commence APRÈS le glissement.
 */
export const V2_REVEAL_DELAY_MS = V2_GLIDE_MS + 80;
const GLIDE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"; // ease-out
/** Emplacements laissés libres à droite en état question (la suite du prix) */
const QUESTION_SPARE_SLOTS = 3;
/** Emprise de la pastille « ton choix » (HTML, coin haut gauche) en px */
const PIN_BOX = { right: 224, bottom: 54 };
/** Bas du bandeau du verdict (élément marqué, VerdictOverlay compact, en haut du cadre) en px :
 *  12 + 8 + 32 + 8 en mobile ; padding de 16 px sur ordinateur (tsx-v2.css, ≥ 1024 px) */
const BANNER_BOTTOM = { mobile: 64, desktop: 82 };
/** Hauteur réservée en bas du cadre au verdict en bandeau du bas, en px : 12 + bandeau + 14, la
 *  demi-pastille d'une ligne posée au bas de l'échelle (stop) comprise ; bandeau en mobile : titre
 *  sur 2 lignes au plus (16 px), 8 + 38 + 8 ; sur ordinateur : une ligne, 32 + 2 × 16,4 */
const BANNER_BOTTOM_ROOM = { mobile: 80, desktop: 92 };

const ZONE_COLOR: Record<ZoneKind, { stroke: string; fill: string; dashed: boolean }> = {
  support:        { stroke: "var(--v2-bull)", fill: "rgba(16,185,129,0.18)", dashed: true },
  resistance:     { stroke: "var(--v2-bear)", fill: "rgba(239,68,68,0.18)",  dashed: true },
  fvg:            { stroke: "var(--v2-zone)", fill: "rgba(245,158,11,0.18)", dashed: false },
  liquidity_low:  { stroke: "var(--v2-zone)", fill: "rgba(245,158,11,0.12)", dashed: true },
  liquidity_high: { stroke: "var(--v2-zone)", fill: "rgba(245,158,11,0.12)", dashed: true },
};
const HERO_GRADIENT: Record<ZoneKind, string> = {
  support: "#10b981",
  resistance: "#ef4444",
  fvg: "#f59e0b",
  liquidity_low: "#f59e0b",
  liquidity_high: "#f59e0b",
};

/** Début horizontal d'une zone FVG : la bougie d'impulsion dont le corps couvre toute la zone. */
function fvgStartIndex(candles: Candle[], z: ChartZone): number {
  const lo = Math.min(z.y1, z.y2);
  const hi = Math.max(z.y1, z.y2);
  const i = candles.findIndex((k) => Math.min(k.o, k.c) <= lo && Math.max(k.o, k.c) >= hi);
  return i < 0 ? 0 : i;
}

/** Étiquette en ligne : hauteur, corps de texte, écart minimal entre deux pastilles */
const INLINE_TAG_H = 20;
const INLINE_TAG_FS = 12;
const INLINE_TAG_GAP = 4;
const inlineTagW = (label: string) => textWidth(label, INLINE_TAG_FS) + 14;
/** Repères du changement de rôle : rayon d'un anneau de touche, écart à la pointe de la mèche (px) */
const FLIP_R = 3, FLIP_GAP = 4;
/** Largeur de graphique (px) en dessous de laquelle la marge d'étiquettes ne sert qu'aux lignes */
const NARROW_CHART_W = 480;
/** Écart maximal (px) entre une étiquette de ligne empilée et sa ligne : la ligne la traverse toujours */
const PACK_SHIFT = INLINE_TAG_H / 2 - 2;
/** Écart vertical (px) entre deux étiquettes empilées : leur contour sombre les sépare */
const PACK_GAP = 1;
/** Étiquette de l'erreur marquée (point, zone) : demi-pas verticaux explorés pour lui trouver une place */
const MARK_TAG_STEPS = 40;

export function GameChartV2({ data, overlay, mode: modeProp, pin, mark, verdictBanner, reserve, tpOffscale, preview, inlineLabels, labeledZones, emphasis, glideScale, children }: GameChartV2Props) {
  const inline = !!inlineLabels;
  const { ref: sizeRef, w: W, h: H } = useBoxSize<HTMLDivElement>();
  const { ref: playRef, playing } = usePlayOnView<HTMLDivElement>(0.4);
  const desktop = useIsDesktop();

  const all = data.candles;
  const sep = overlay?.separatorIndex;
  const revealed = overlay?.visibleFutureCount ?? 0;
  const mode: GameChartMode = modeProp ?? (sep !== undefined && revealed > 0 ? "reveal" : "question");
  const question = mode === "question";
  const visibleCount = sep === undefined ? all.length : question ? sep : Math.min(all.length, sep + revealed);
  const visible = all.slice(0, visibleCount);
  // Graphique étroit (téléphone) : libellé court d'une zone quand il existe (même idée, ex.
  // « Résistance → support » pour « Ancienne résistance → support »)
  const zones = W > 0 && W < NARROW_CHART_W ? data.zones.map((z) => (z.short ? { ...z, label: z.short } : z)) : data.zones;
  // Place occupée par les repères du changement de rôle au-dessus / au-dessous d'une bougie (px) :
  // les étiquettes ne les recouvrent pas
  const flipExt = new Map<number, { up: number; down: number }>();
  for (const z of zones) if (z.flip) {
    const up = z.flip.was === "resistance";
    for (const i of z.flip.touches) flipExt.set(i, up ? { up: FLIP_GAP + 2 * FLIP_R + 1, down: 0 } : { up: 0, down: FLIP_GAP + 2 * FLIP_R + 1 });
    if (z.flip.breakAt >= 0) flipExt.set(z.flip.breakAt, up ? { up: FLIP_GAP + 8, down: 0 } : { up: 0, down: FLIP_GAP + 8 });
  }
  const ext = (i: number) => flipExt.get(i) ?? { up: 0, down: 0 };
  const hero = question ? zones[0] : undefined;
  const stepMs = preview ? PREVIEW_STEP_MS : STEP_MS;
  const spotMs = question ? visibleCount * stepMs + 250 : 0;
  // Marquage : au verdict dans les jeux ; dès la question dans un aperçu
  const showMark = !!mark && (mode === "verdict" || !!preview);

  // Les bougies du passé rejouent leur apparition à chaque nouveau scénario
  const roundKey = `${all.length}:${all[0]?.o ?? 0}:${all[0]?.c ?? 0}`;
  // 1er affichage des étiquettes en ligne d'un round : elles arrivent avec la
  // zone héros (au « spot ») ; ensuite (étape, révélation) : fondu rapide
  const introLabels = useRef<{ round: string; key: string } | null>(null);

  // ─── Géométrie (pixels réels) ───
  // Question : cadrage sur le passé. Révélation / verdict : cadrage « passé +
  // futur » dès le clic (l'échelle ne bouge plus pendant la révélation).
  const scaled = question ? visible : all;
  const padX = clamp(W * 0.02, 8, 16);
  const nSlots = question && sep !== undefined ? sep + QUESTION_SPARE_SLOTS : all.length;
  // Colonne des étiquettes de lignes (bord droit) : réservée hors de la zone
  // des bougies, pour qu'aucune bougie ne passe sous une étiquette.
  // Objectif hors échelle : ramené au bord, signalé par une flèche
  const tpRaw = overlay?.tp?.price;
  const baseVals = scaled.flatMap((k) => [k.h, k.l])
    .concat(data.zones.flatMap((z) => [z.y1, z.y2]), [overlay?.entry?.price, overlay?.stop?.price].filter((p): p is number => p !== undefined), (overlay?.stops ?? []).map((s) => s.price));
  const bMin = Math.min(...baseVals), bMax = Math.max(...baseVals), bSpan = bMax - bMin || 1;
  const tpArrow = !tpOffscale || tpRaw === undefined ? null : tpRaw > bMax + 0.35 * bSpan ? "up" : tpRaw < bMin - 0.35 * bSpan ? "down" : null;
  const tpShown = tpArrow === "up" ? bMax + 0.12 * bSpan : tpArrow === "down" ? bMin - 0.12 * bSpan : tpRaw;
  // (dans l'échelle, l'objectif garde son étiquette « TP » : une ligne n'est jamais muette)
  const tpTagLabel = tpArrow === "up" ? "TP ↑" : tpArrow === "down" ? "TP ↓" : tpOffscale && tpRaw !== undefined ? "TP" : null;
  // Zones nommées sur le graphique (étiquettes en ligne)
  const zoneLabelIdx = inline ? (labeledZones ?? zones.map((_, i) => i)).filter((i) => zones[i]) : [];
  const lineLabels = [
    ...(tpTagLabel ? [tpTagLabel] : []),
    ...(inline && overlay?.entry?.label ? [overlay.entry.label] : []),
    ...(overlay?.stops ?? []).flatMap((st) => (st.label ? [st.label] : [])),
    ...(overlay?.candidateLines ?? []).map((c) => c.label),
  ];
  // Quand cette colonne existe, la pastille héros et celle du marquage y sont
  // rangées aussi : elles profitent de l'écartement et ne recouvrent aucune bougie.
  const columnMode = !inline && lineLabels.length > 0;
  const markPrice = !mark ? undefined
    : mark.kind === "zone" ? (zones[mark.index] ? (zones[mark.index].y1 + zones[mark.index].y2) / 2 : undefined)
    : mark.price;
  const tagLabels = inline
    ? [...lineLabels, ...zoneLabelIdx.map((i) => zones[i].label), ...(mark && showMark ? [mark.label] : [])]
    : [
      ...lineLabels,
      ...(columnMode && hero ? [hero.label] : []),
      ...(columnMode && mark && showMark && markPrice !== undefined ? [mark.label] : []),
    ];
  const colLabels = reserve?.labels ? [...tagLabels, ...reserve.labels] : tagLabels;
  // Échelle des prix calée sur les données, les zones et les lignes
  const prices = scaled.flatMap((k) => [k.h, k.l])
    .concat(zones.flatMap((z) => [z.y1, z.y2]))
    .concat(
      [overlay?.entry?.price, tpShown, overlay?.stop?.price].filter((p): p is number => p !== undefined),
      (overlay?.stops ?? []).map((s) => s.price),
      (overlay?.candidateLines ?? []).map((c) => c.price),
      reserve?.prices ?? [],
    );
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 1;
  const range = max - min || 1;

  // En ligne : une marge à droite de la largeur de la plus grande petite étiquette. Graphique
  // étroit (téléphone) : la marge n'est réservée qu'aux étiquettes de lignes (courtes, elles
  // restent au bord sur leur ligne) si celles des zones et de l'erreur trouvent chacune, dans ce
  // cadrage, une place sans bougie près de leur niveau ; sinon la marge prenait jusqu'à la
  // moitié de la largeur et les bougies devenaient des traits (corps de 2 à 4 px).
  // Étiquette de zone sans place libre près d'une zone qui touche le haut (ou le bas) du cadre :
  // une bande lui est réservée au-dessus (ou au-dessous) des bougies.
  const fullColW = tagLabels.length ? Math.max(...tagLabels.map(inlineTagW)) + 10 : 0;
  const lineColW = lineLabels.length ? Math.max(...lineLabels.map(inlineTagW)) + 10 : 0;
  const LABEL_BAND = INLINE_TAG_H + 8;
  // Verdict en bandeau (élément marqué) : hauteur réservée en haut, 12 px sous le bandeau
  const bannerBottom = mark && mode === "verdict" ? (desktop ? BANNER_BOTTOM.desktop : BANNER_BOTTOM.mobile) : 0;
  // Verdict en bandeau du bas : hauteur réservée en bas du cadre
  const bannerRoom = verdictBanner === "bottom" && mode === "verdict" ? (desktop ? BANNER_BOTTOM_ROOM.desktop : BANNER_BOTTOM_ROOM.mobile) : 0;
  // Pastille « ton choix » (coin haut gauche, à sa largeur) et bandeau du verdict (élément
  // marqué) : aucune étiquette dessous, elle y serait cachée
  const pinRight = pin ? Math.min(PIN_BOX.right, 12 + 24 + 8 + 6 + textWidth(pin.sub ? `${pin.label} ${pin.sub}` : pin.label, 15)) : 0;
  const uiBoxes = [
    ...(pin ? [{ x1: 0, x2: pinRight, y1: 0, y2: PIN_BOX.bottom }] : []),
    ...(mark && mode === "verdict" ? [{ x1: 0, x2: W, y1: 0, y2: bannerBottom }] : []),
    ...(bannerRoom ? [{ x1: 0, x2: W, y1: H - bannerRoom + 12, y2: H }] : []),
  ];
  const floating = !inline ? [] : [
    ...zoneLabelIdx.filter((i) => !(mark && showMark && mark.kind === "zone" && mark.index === i)).map((i) => ({ label: zones[i].label, price: (zones[i].y1 + zones[i].y2) / 2, line: false, isMark: false, zone: [Math.min(zones[i].y1, zones[i].y2), Math.max(zones[i].y1, zones[i].y2)] as [number, number] })),
    ...(mark && showMark && markPrice !== undefined ? [{ label: mark.label, price: markPrice, line: mark.kind === "line", isMark: true, zone: undefined }] : []),
  ];
  // Étiquettes de lignes (TP, entrée, stops, candidats) : prix de leur ligne
  const linePills: [string, number][] = !inline ? [] : [
    ...(tpTagLabel && tpShown !== undefined ? [[tpTagLabel, tpShown] as [string, number]] : []),
    ...(overlay?.entry?.label ? [[overlay.entry.label, overlay.entry.price] as [string, number]] : []),
    ...(overlay?.stops ?? []).flatMap((st) => (st.label ? [[st.label, st.price] as [string, number]] : [])),
    ...(overlay?.candidateLines ?? []).map((c) => [c.label, c.price] as [string, number]),
  ];
  // Cadrage approché pour une marge d'étiquettes et des bandes données (sans la pastille « ton
  // choix ») : échelle des prix et obstacles (bougies, pastille, bandeau). Marge de 3 px autour
  // des bougies, comme au placement réel : une marge plus prudente déplaçait une étiquette et
  // libérait à tort la place d'une autre.
  const frame = (colW: number, bandTop: number, bandBottom: number) => {
    const sl = (W - 2 * padX - colW) / nSlots, bw = Math.min(clamp(sl * 0.6, 8, 30), sl * 0.78);
    // Marge haute de la pastille « ton choix » (même calcul que topPadBase, dans ce cadrage) : sans
    // elle, les niveaux simulés étaient décalés et une place libre trouvée ici n'existait pas au rendu
    const pinTop = !pin || H <= 0 ? 14 : scaled.reduce((acc, k, i) => {
      if (padX + sl * (i + 0.5) - bw / 2 > PIN_BOX.right) return acc;
      const f = (max - k.h) / range;
      return f < 1 ? Math.max(acc, (PIN_BOX.bottom - f * (H - 14)) / (1 - f)) : acc;
    }, 14);
    const tp = (bannerBottom ? Math.max(pinTop, bannerBottom + 12) : pinTop) + bandTop, bp = Math.max(14, bannerRoom) + bandBottom;
    const ty = (p: number) => tp + ((max - p) / range) * (H - tp - bp);
    const boxes = visible.map((k, i) => ({ x1: padX + sl * (i + 0.5) - bw / 2 - 3, x2: padX + sl * (i + 0.5) + bw / 2 + 3, y1: ty(k.h) - 3 - ext(i).up, y2: ty(k.l) + 3 + ext(i).down }));
    boxes.push(...uiBoxes);
    return { ty, boxes };
  };
  // Étiquettes de lignes sans place (ni bougie ni autre étiquette) à la hauteur de leur ligne :
  // posées comme au placement réel, la plus longue d'abord, au bord droit puis vers la gauche,
  // à au plus PACK_SHIFT px de leur ligne. Lignes très proches (stops et entrée à quelques
  // pixels) : leurs étiquettes, côte à côte, glissaient sur les bougies faute de marge.
  const lineMisfits = (colW: number, bandTop: number, bandBottom: number) => {
    if (!linePills.length || W <= 0 || H <= 0) return [];
    const { ty, boxes } = frame(colW, bandTop, bandBottom);
    const shifts = [0, 2, -2, 4, -4, 6, -6, 8, -8].filter((d) => Math.abs(d) <= PACK_SHIFT);
    return [...linePills].sort((a, b) => inlineTagW(b[0]) - inlineTagW(a[0])).filter(([label, price]) => {
      const w = inlineTagW(label);
      for (const d of shifts) {
        const y = ty(price) + d;
        if (y < INLINE_TAG_H / 2 + 1 || y > H - INLINE_TAG_H / 2 - 1) continue;
        for (let x = W - padX - w; x >= 2; x -= 2) if (!boxes.some((c) => x < c.x2 && x + w > c.x1 && y - INLINE_TAG_H / 2 < c.y2 && y + INLINE_TAG_H / 2 > c.y1)) {
          boxes.push({ x1: x - INLINE_TAG_GAP, x2: x + w + INLINE_TAG_GAP, y1: y - INLINE_TAG_H / 2 - PACK_GAP, y2: y + INLINE_TAG_H / 2 + PACK_GAP });
          return false;
        }
      }
      return true;
    });
  };
  // Étiquettes flottantes sans place libre (ni bougie ni étiquette de ligne) dans un cadrage donné
  const misfits = (colW: number, bandTop: number, bandBottom: number) => {
    if (!floating.length || W <= 0 || H <= 0) return [];
    const { ty, boxes } = frame(colW, bandTop, bandBottom);
    // les étiquettes de lignes, posées d'abord au bord droit sur leur ligne, sont aussi des obstacles ;
    // empilées si leurs lignes sont proches, elles s'en écartent d'au plus PACK_SHIFT px
    for (const [l, p] of linePills) boxes.push({ x1: W - padX - inlineTagW(l) - INLINE_TAG_GAP, x2: W, y1: ty(p) - INLINE_TAG_H / 2 - 2 - PACK_SHIFT, y2: ty(p) + INLINE_TAG_H / 2 + 2 + PACK_SHIFT });
    // Posées une à une dans l'ordre du placement réel (celle de l'erreur sur sa ligne d'abord, puis
    // la plus longue) : chacune devient un obstacle pour les suivantes
    return [...floating].sort((a, b) => Number(b.line) - Number(a.line) || inlineTagW(b.label) - inlineTagW(a.label)).filter(({ label, price, line, isMark, zone }) => {
      const w = inlineTagW(label);
      // zone : d'abord les places qui touchent la zone (comme au placement réel)
      const touch: number[] = [];
      if (zone) { const reach = INLINE_TAG_H / 2 + 8, y0 = ty(price); for (let yy = ty(zone[1]) - reach; yy <= ty(zone[0]) + reach; yy += 2) touch.push(yy - y0); touch.sort((a, b) => Math.abs(a) - Math.abs(b)); }
      // une étiquette de zone qui ne touche pas sa zone compte comme sans place : la marge
      // s'élargit (ou une bande s'ouvre) pour qu'elle reste à côté de ce qu'elle nomme
      const shifts = line ? [0, 2, -2, 4, -4, 6, -6, 8, -8] : zone ? [0, ...touch] : [0, ...Array.from({ length: isMark ? MARK_TAG_STEPS : 6 }, (_, k) => k + 1).flatMap((k) => [k, -k].map((d) => d * (INLINE_TAG_H + INLINE_TAG_GAP) / 2))];
      for (const d of shifts) {
        const y = ty(price) + d;
        if (y < INLINE_TAG_H / 2 + 1 || y > H - INLINE_TAG_H / 2 - 1) continue;
        for (let x = W - padX - w; x >= 2; x -= 2) if (!boxes.some((c) => x < c.x2 && x + w > c.x1 && y - INLINE_TAG_H / 2 < c.y2 && y + INLINE_TAG_H / 2 > c.y1)) {
          // étiquette de ligne : toute la plage où l'empilement peut la poser, autour de sa ligne
          const yc = line ? ty(price) : y, pad = line ? PACK_SHIFT : 0;
          boxes.push({ x1: x - INLINE_TAG_GAP, x2: x + w + INLINE_TAG_GAP, y1: yc - INLINE_TAG_H / 2 - 1 - pad, y2: yc + INLINE_TAG_H / 2 + 1 + pad });
          return false;
        }
      }
      return true;
    });
  };
  // Bandes demandées par les étiquettes sans place : zone au bord du cadre, ou erreur marquée sur
  // un point ou une zone (côté le plus proche ; elle peut s'éloigner de sa marque, de même couleur)
  const bandSide = (x: { price: number; line: boolean; isMark: boolean }) => x.line ? null
    : x.isMark ? (x.price >= (min + max) / 2 ? "top" : "bottom")
    : x.price >= max - 0.2 * range ? "top" : x.price <= min + 0.2 * range ? "bottom" : null;
  const bandsFor = (m: { price: number; line: boolean; isMark: boolean }[]) => ({
    top: m.some((x) => bandSide(x) === "top") ? LABEL_BAND : 0,
    bottom: m.some((x) => bandSide(x) === "bottom") ? LABEL_BAND : 0,
  });
  // Marge élargie, d'une étiquette à la fois, tant qu'une étiquette de ligne n'a pas de place
  const widened = (l: { col: number; top: number; bottom: number }) => {
    let col = l.col;
    for (let k = 0; k < linePills.length; k++) {
      const m = lineMisfits(col, l.top, l.bottom);
      if (!m.length || col + 10 > W / 2) break;
      col += Math.max(...m.map(([label]) => inlineTagW(label))) + INLINE_TAG_GAP;
    }
    return { ...l, col };
  };
  const labelLayout = (() => {
    if (!inline) return { col: 0, top: 0, bottom: 0 };
    if (W > 0 && W < NARROW_CHART_W && lineColW < fullColW) {
      const m = misfits(lineColW, 0, 0);
      if (!m.length) return widened({ col: lineColW, top: 0, bottom: 0 });
      const b = bandsFor(m);
      if ((b.top || b.bottom) && !misfits(lineColW, b.top, b.bottom).length) return widened({ col: lineColW, ...b });
    }
    return widened({ col: fullColW, ...bandsFor(misfits(fullColW, 0, 0)) });
  })();
  const tagColW = inline
    ? labelLayout.col
    : colLabels.length ? Math.max(...colLabels.map((l) => textWidth(l, 12) + 16)) + 18 : 0;
  const slot = W > 0 ? (W - 2 * padX - tagColW) / nSlots : 0;
  const xOf = (i: number) => padX + slot * (i + 0.5);
  // Plafond relatif au pas : les bougies ne se touchent jamais, même nombreuses
  const bodyW = Math.min(clamp(slot * 0.6, 8, 30), slot * 0.78);

  const fsPill = desktop ? DESKTOP_PILL_PX : clamp(W * 0.036, 13, 17);
  const pillH = fsPill + 12;
  const pillW0 = (label: string) => textWidth(label, fsPill) + fsPill * 1.3;
  const bottomPad0 = hero && !columnMode && !inline ? pillH + 16 : Math.max(14, bannerRoom); // la pastille héros vit sous la zone ; le verdict en bandeau du bas aussi
  // Réserve juste ce qu'il faut pour que la pastille « ton choix » ne
  // recouvre aucune bougie de son coin.
  const topPadBase = !pin || H <= 0 ? 14 : scaled.reduce((acc, k, i) => {
    if (xOf(i) - bodyW / 2 > PIN_BOX.right) return acc;
    const f = (max - k.h) / range;
    return f < 1 ? Math.max(acc, (PIN_BOX.bottom - f * (H - bottomPad0)) / (1 - f)) : acc;
  }, 14);
  // Aperçus (hors étiquettes en ligne) : la pastille de la zone héros et celle du marquage vont
  // sous leur élément, à droite. Si elle y couvrirait des bougies et que l'élément touche le
  // haut du cadre, une marge haute lui est réservée pour qu'elle passe au-dessus.
  const MARK_FS = 13, MARK_PH = 26;
  const roomTop = (el: number[] | null, pw: number, ph: number, gap: number) => {
    if (!el || W <= 0 || H <= 0) return 0;
    const y0 = (p: number) => topPadBase + ((max - p) / range) * (H - topPadBase - bottomPad0);
    const x1 = W - padX - pw, py = y0(Math.min(...el)) + gap;
    const below = py + ph <= H - 4 && !visible.some((k, i) => xOf(i) + bodyW / 2 + 2 > x1 && y0(k.h) - 2 < py + ph && y0(k.l) + 2 > py);
    return !below && y0(Math.max(...el)) - gap - ph < 4 ? ph + gap + 8 : 0;
  };
  const heroRoom = hero && !columnMode && !inline ? roomTop([hero.y1, hero.y2], pillW0(hero.label), pillH, 6) : 0;
  // Pastille héros passée au-dessus : la marge basse qui lui était réservée est rendue au graphique
  const bottomPad = (heroRoom > 0 ? 14 : bottomPad0) + labelLayout.bottom;
  const pillRoom = columnMode || inline ? 0 : Math.max(
    heroRoom,
    preview && mark && mark.kind !== "point" ? roomTop(mark.kind === "line" ? [mark.price] : zones[mark.index] ? [zones[mark.index].y1, zones[mark.index].y2] : null, textWidth(mark.label, MARK_FS) + 20, MARK_PH, 8) : 0,
  );
  // Verdict en bandeau (élément marqué) : sa hauteur est réservée en haut
  const topPad = (bannerBottom ? Math.max(topPadBase, bannerBottom + 12) : Math.max(topPadBase, pillRoom)) + labelLayout.top;

  // ─── Glissement au clic (FLIP) ───
  // Le tracé est rendu directement dans son nouveau cadrage ; avant l'affichage,
  // on lui applique la transformation qui le ramène à l'ancien cadrage, puis on
  // la relâche en ease-out. Seul le passage question → révélation glisse.
  const geo = useMemo(
    () => (W > 0 && H > 0 ? { mode, W, H, padX, slot, min, max, top: topPad, bottom: bottomPad } : null),
    [mode, W, H, padX, slot, min, max, topPad, bottomPad],
  );
  const plotRef = useRef<SVGGElement | null>(null);
  const prevGeo = useRef<typeof geo>(null);
  useLayoutEffect(() => {
    const prev = prevGeo.current;
    prevGeo.current = geo;
    const el = plotRef.current;
    if (!geo || !prev || !el) return;
    // Question → révélation ; et, avec glideScale, d'une étape question à l'autre
    // quand l'échelle change (même cadre)
    const stepGlide = !!glideScale && prev.mode === "question" && geo.mode === "question"
      && (prev.min !== geo.min || prev.max !== geo.max || prev.top !== geo.top || prev.slot !== geo.slot);
    if (prev.W !== geo.W || prev.H !== geo.H) return;
    if (!stepGlide && (prev.mode !== "question" || geo.mode === "question")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const kPrev = (prev.H - prev.top - prev.bottom) / (prev.max - prev.min || 1);
    const kNext = (geo.H - geo.top - geo.bottom) / (geo.max - geo.min || 1);
    const sx = prev.slot / geo.slot;
    const tx = prev.padX - sx * geo.padX;
    const sy = kPrev / kNext;
    const ty = prev.top + (prev.max - geo.max) * kPrev - sy * geo.top;
    el.style.transition = "none";
    el.style.transform = `matrix(${sx}, 0, 0, ${sy}, ${tx}, ${ty})`;
    void el.getBoundingClientRect();
    // Pas d'annulation au démontage : le relâchement doit toujours avoir lieu
    requestAnimationFrame(() => {
      el.style.transition = `transform ${V2_GLIDE_MS}ms ${GLIDE_EASE}`;
      el.style.transform = "none";
    });
  }, [geo, glideScale]);

  let svg: ReactNode = null;
  if (W > 0 && H > 0) {
    const toY = (p: number) => topPad + ((max - p) / range) * (H - topPad - bottomPad);
    const lineX1 = W - padX;
    const splitX = sep !== undefined ? padX + slot * sep : null;

    const zoneRect = (z: ChartZone) => {
      const top = toY(Math.max(z.y1, z.y2));
      const h = Math.max(toY(Math.min(z.y1, z.y2)) - top, 6);
      const x0 = z.kind === "fvg" ? xOf(fvgStartIndex(all, z)) - slot / 2 : padX;
      return { x: x0, y: top, w: lineX1 - x0, h };
    };

    const heroBox = hero ? zoneRect(hero) : null;
    const pillW = hero ? pillW0(hero.label) : 0;
    // Sous la zone héros, sinon au-dessus : du côté où la pastille ne couvre aucune bougie
    const heroPillY = (() => {
      if (!heroBox) return 0;
      const x1 = lineX1 - pillW;
      const onCandle = (y: number) => visible.some((k, i) => xOf(i) + bodyW / 2 + 2 > x1 && toY(k.h) - 2 < y + pillH && toY(k.l) + 2 > y);
      const sides = [heroBox.y + heroBox.h + 6, heroBox.y - 6 - pillH].filter((y) => y >= 2 && y + pillH <= H - 2);
      return sides.find((y) => !onCandle(y)) ?? heroBox.y + heroBox.h + 6;
    })();
    // Pastille héros : à droite, sauf si des étiquettes de lignes occupent cette colonne

    // Lignes de trade (entrée / TP / stop / stops / candidats), style v2
    const hLine = (key: string, price: number, color: string, opts: { dashed?: boolean; width?: number; opacity?: number; x2?: number; discreet?: boolean } = {}) => (
      <line key={key} data-line={key} data-discreet={opts.discreet ? "" : undefined}
        x1={padX} x2={opts.x2 ?? lineX1} y1={toY(price)} y2={toY(price)} stroke={color}
        strokeWidth={opts.width ?? 2} strokeDasharray={opts.dashed ? "6 5" : undefined} opacity={opts.opacity ?? 1} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    );
    // Étiquettes des lignes (stops, candidats) : placées au bord droit, puis
    // écartées verticalement pour ne JAMAIS se chevaucher, même quand deux
    // niveaux sont très proches. Un trait relie l'étiquette décalée à sa ligne.
    const TAG_FS = 12;
    const TAG_H = 22;
    const TAG_GAP = 4;
    const tagSpecs = [
      ...(tpTagLabel && tpShown !== undefined ? [{ key: "tpTag", price: tpShown, label: tpTagLabel, color: "#10b981", hit: false }] : []),
      ...(overlay?.stops ?? []).flatMap((s, i) => (s.label ? [{ key: `stopTag${i}`, price: s.price, label: s.label, color: s.hit ? "#fb923c" : s.color, hit: !!s.hit }] : [])),
      ...(overlay?.candidateLines ?? []).map((c, i) => ({ key: `candTag${i}`, price: c.price, label: c.label, color: c.color, hit: false })),
      ...(columnMode && hero ? [{ key: "heroTag", price: (hero.y1 + hero.y2) / 2, label: hero.label, color: HERO_GRADIENT[hero.kind], hit: false }] : []),
      ...(columnMode && mark && showMark && markPrice !== undefined ? [{ key: "markTag", price: markPrice, label: mark.label, color: "#f87171", hit: false }] : []),
    ].map((t) => ({ ...t, lineY: toY(t.price), y: toY(t.price), w: textWidth(t.label, TAG_FS) + 16 }));
    const tagW = tagSpecs.length ? Math.max(...tagSpecs.map((t) => t.w)) : 0;
    const sortedTags = [...tagSpecs].sort((a, b) => a.lineY - b.lineY);
    for (let i = 1; i < sortedTags.length; i++) {
      sortedTags[i].y = Math.max(sortedTags[i].y, sortedTags[i - 1].y + TAG_H + TAG_GAP);
    }
    // Si le bas déborde, on remonte la pile (toujours sans chevauchement)
    const maxY = H - TAG_H / 2 - 2;
    for (let i = sortedTags.length - 1; i >= 0; i--) {
      const cap = i === sortedTags.length - 1 ? maxY : sortedTags[i + 1].y - TAG_H - TAG_GAP;
      sortedTags[i].y = Math.min(sortedTags[i].y, cap);
    }
    const tagX = lineX1 - tagW; // colonne des étiquettes, alignées à droite
    // En ligne : les lignes vont jusqu'au bord, l'étiquette est posée dessus
    const lineEnd = inline ? lineX1 : tagSpecs.length ? tagX - 8 : lineX1;
    // Aperçu en état question : le marquage apparaît avec le héros (v2-late)
    const markClass = mode === "verdict" ? "v2-mark" : "v2-late";

    // ─── Étiquettes en ligne (inlineLabels) ───
    // Une famille = les lignes candidates d'une même étape (stop{i} / cand{i}) :
    // la ligne mise en avant reste vive, les autres s'estompent.
    const family = (k: string) => k.replace(/\d+$/, "");
    const dimmed = (k: string) => !!emphasis && family(k) === family(emphasis) && k !== emphasis;
    type InlineTag = { key: string; label: string; color: string; y: number; w: number; x: number; dim: boolean; hit: boolean; lineY?: number };
    const inlineTags: InlineTag[] = [];
    if (inline) {
      // Au verdict, l'étiquette de l'erreur remplace celle de l'élément marqué
      const markedLine = showMark && mark?.kind === "line" ? mark.price : undefined;
      const marked = (p: number) => markedLine !== undefined && Math.abs(toY(p) - toY(markedLine)) < 1;
      const specs: { key: string; price: number; label: string; color: string; hit?: boolean }[] = [];
      if (tpTagLabel && tpShown !== undefined) specs.push({ key: "tp", price: tpShown, label: tpTagLabel, color: "#10b981" });
      if (overlay?.entry?.label && !marked(overlay.entry.price)) specs.push({ key: "entry", price: overlay.entry.price, label: overlay.entry.label, color: "#3b82f6" });
      (overlay?.stops ?? []).forEach((s, i) => {
        if (s.label && !marked(s.price)) specs.push({ key: `stop${i}`, price: s.price, label: s.label, color: s.hit ? "#fb923c" : s.color, hit: !!s.hit });
      });
      (overlay?.candidateLines ?? []).forEach((c, i) => {
        if (!marked(c.price)) specs.push({ key: `cand${i}`, price: c.price, label: c.label, color: c.color });
      });
      zoneLabelIdx.forEach((i) => {
        if (showMark && mark?.kind === "zone" && mark.index === i) return;
        const z = zones[i];
        specs.push({ key: `zone${i}`, price: (z.y1 + z.y2) / 2, label: z.label, color: HERO_GRADIENT[z.kind] });
      });
      if (mark && showMark && markPrice !== undefined) specs.push({ key: "markTag", price: markPrice, label: mark.label, color: "#f87171" });
      // Au bord droit, sur la ligne ; si une pastille déjà posée gêne, glisse à sa
      // gauche. Sans place à gauche (étiquette longue), décale d'un cran vers le
      // haut ou le bas, jamais hors du graphique.
      const minX = 2;
      // Tolérance des comparaisons : une pastille posée exactement à gauche d'une autre
      // (x = t.x - gap - w) ne doit pas compter comme un chevauchement à cause d'un
      // arrondi (540.64 + 129.2 + 4 = 673.8400000000001 > 673.84), sinon elle quittait sa ligne.
      const EPS = 0.01;
      // (glisse aussi à gauche des bougies : une pastille posée sur une bougie cache le prix)
      const slotX = (y: number, w: number) => {
        let x = lineX1 - w;
        for (let guard = 0; guard < 40; guard++) {
          if (x < minX) return null;
          const block = inlineTags.find((t) => Math.abs(t.y - y) < INLINE_TAG_H + INLINE_TAG_GAP - EPS
            && x < t.x + t.w + INLINE_TAG_GAP - EPS && x + w + INLINE_TAG_GAP > t.x + EPS);
          if (block) { x = block.x - INLINE_TAG_GAP - w; continue; }
          const box = [...candleBoxes, ...uiBoxes].find((c) => x < c.x2 && x + w > c.x1 && y - INLINE_TAG_H / 2 < c.y2 && y + INLINE_TAG_H / 2 > c.y1);
          if (box) { x = box.x1 - w - 1; continue; }
          return x;
        }
        return null;
      };
      // Bougies affichées (corps et mèche, marge de 3 px) : une pastille posée dessus cache le prix ;
      // pastille « ton choix » et bandeau du verdict : elle y serait cachée
      const candleBoxes = visible.map((k, i) => ({ x1: xOf(i) - bodyW / 2 - 3, x2: xOf(i) + bodyW / 2 + 3, y1: toY(k.h) - 3 - ext(i).up, y2: toY(k.l) + 3 + ext(i).down }));
      const free = (x: number, y: number, w: number) =>
        !inlineTags.some((t) => Math.abs(t.y - y) < INLINE_TAG_H + PACK_GAP - EPS && x < t.x + t.w + INLINE_TAG_GAP - EPS && x + w + INLINE_TAG_GAP > t.x + EPS)
        && ![...candleBoxes, ...uiBoxes].some((c) => x < c.x2 && x + w > c.x1 && y - INLINE_TAG_H / 2 < c.y2 && y + INLINE_TAG_H / 2 > c.y1);
      // Première place libre en partant du bord droit, le long de la hauteur y (ni pastille ni bougie)
      const clearX = (y: number, w: number) => {
        for (let x = lineX1 - w; x >= minX; x -= 2) if (free(x, y, w)) return x;
        return null;
      };
      // Étiquettes de lignes d'abord (elles restent sur leur ligne), puis zones
      const onLine = (k: string) => !k.startsWith("zone") && (k !== "markTag" || mark?.kind === "line");
      // Lignes d'abord, et la plus longue étiquette d'abord : les courtes (TP, Entrée) trouvent
      // leur place dans les trous, la longue (libellé de l'erreur) garde le bord libre
      const placeOrder = [...specs].sort((a, b) => Number(onLine(b.key)) - Number(onLine(a.key)) || inlineTagW(b.label) - inlineTagW(a.label) || toY(a.price) - toY(b.price));
      // Lignes rapprochées (moins d'une hauteur de pastille) : leurs pastilles sont empilées
      // au bord droit, centrées sur le groupe, chacune décalée d'au plus 8 px pour rester
      // traversée par sa ligne ; sinon elles glissaient à gauche, sur les bougies.
      const STEP = INLINE_TAG_H + PACK_GAP, MAX_SHIFT = PACK_SHIFT;
      const packed = new Map<string, number>();
      const ls = placeOrder.filter((s) => onLine(s.key)).map((s) => ({ k: s.key, l: toY(s.price) })).sort((a, b) => a.l - b.l);
      // Groupes : on fusionne deux groupes voisins tant que leurs piles se recouvrent ; chaque
      // pile est recentrée (écart maximal minimal entre une pastille et sa ligne). Une fusion
      // qui éloignerait une pastille de sa ligne est refusée : ces pastilles se rangent alors
      // côte à côte, à la première place libre le long de leur ligne.
      type Pile = { m: { k: string; l: number }[]; top: number };
      const recenter = (g: Pile) => {
        const dev = g.m.map((x, q) => q * STEP - x.l);
        g.top = -(Math.max(...dev) + Math.min(...dev)) / 2;
      };
      const valid = (g: Pile) => g.m.every((x, q) => Math.abs(g.top + q * STEP - x.l) <= MAX_SHIFT);
      let piles: Pile[] = ls.map((x) => ({ m: [x], top: x.l }));
      // Les lignes les plus proches d'abord : ce sont elles qui ne peuvent pas se partager la place
      for (let merged = true; merged;) {
        merged = false;
        let pick: { q: number; g: Pile; d: number } | null = null;
        for (let q = 0; q + 1 < piles.length; q++) {
          const a = piles[q], b = piles[q + 1];
          if (a.top + (a.m.length - 1) * STEP + STEP <= b.top + EPS) continue;
          const g: Pile = { m: [...a.m, ...b.m], top: 0 };
          recenter(g);
          const d = b.m[0].l - a.m[a.m.length - 1].l;
          if (valid(g) && (!pick || d < pick.d)) pick = { q, g, d };
        }
        if (pick) {
          piles = [...piles.slice(0, pick.q), pick.g, ...piles.slice(pick.q + 2)];
          merged = true;
        }
      }
      for (const g of piles) {
        if (g.m.length < 2 || !valid(g)) continue;
        g.m.forEach((x, q) => packed.set(x.k, clamp(g.top + q * STEP, INLINE_TAG_H / 2 + 1, H - INLINE_TAG_H / 2 - 1)));
      }
      for (const s of placeOrder) {
        const w = inlineTagW(s.label);
        const y0 = clamp(packed.get(s.key) ?? toY(s.price), INLINE_TAG_H / 2 + 1, H - INLINE_TAG_H / 2 - 1);
        let y = y0;
        // Sur sa ligne, à la première place sans bougie ni pastille ; une zone peut aussi
        // monter ou descendre d'un cran pour trouver cette place
        let x = clearX(y0, w);
        // Ligne : petit décalage vertical (la ligne traverse toujours la pastille)
        if (x === null && onLine(s.key)) for (const d of [2, -2, 4, -4, 6, -6, 8, -8]) {
          const yy = toY(s.price) + d;
          if (Math.abs(d) > MAX_SHIFT || yy < INLINE_TAG_H / 2 + 1 || yy > H - INLINE_TAG_H / 2 - 1) continue;
          const xx = clearX(yy, w);
          if (xx !== null) { x = xx; y = yy; break; }
        }
        // Zone : d'abord une place qui touche la zone (bord à au plus 8 px de
        // ses bords), la plus proche de son milieu ; sinon l'étiquette s'éloignait au-delà d'un
        // niveau voisin (« Liquidité balayée » au-dessus du « Plus bas précédent »)
        if (x === null && s.key.startsWith("zone")) {
          const z = zones[+s.key.slice(4)];
          const reach = INLINE_TAG_H / 2 + 8, zt = toY(Math.max(z.y1, z.y2)) - reach, zb = toY(Math.min(z.y1, z.y2)) + reach;
          // puis, faute de place contre la zone, la place libre la plus proche d'elle (jamais à l'autre
          // bout du graphique, à côté d'un autre niveau : « Swing high 1 » près du Swing high 3)
          const far = 6 * (INLINE_TAG_H + INLINE_TAG_GAP), gap = (yy: number) => (yy < zt ? zt - yy : yy > zb ? yy - zb : 0);
          const cands: number[] = [];
          for (let yy = zt - far; yy <= zb + far; yy += 2) cands.push(yy);
          // jamais plus près d'une autre zone étiquetée que de la sienne : plus loin, mais sans
          // ambiguïté (« Swing low 1 » posé au niveau du Swing low 2 inversait l'ordre lu)
          const others = zoneLabelIdx.filter((j) => j !== +s.key.slice(4)).map((j) => [toY(Math.max(zones[j].y1, zones[j].y2)), toY(Math.min(zones[j].y1, zones[j].y2))]);
          const own = [toY(Math.max(z.y1, z.y2)), toY(Math.min(z.y1, z.y2))];
          const dist = (yy: number, [t, b]: number[]) => (yy < t ? t - yy : yy > b ? yy - b : 0);
          const amb = (yy: number) => Number(others.some((o) => dist(yy, o) < dist(yy, own)));
          cands.sort((a, b) => amb(a) - amb(b) || gap(a) - gap(b) || Math.abs(a - y0) - Math.abs(b - y0));
          const inFrame = (yy: number) => yy >= INLINE_TAG_H / 2 + 1 && yy <= H - INLINE_TAG_H / 2 - 1;
          // Contre la zone mais entre deux pastilles de lignes du bord droit (stops, entrée) trop
          // proches : elles s'écartent, chacune d'au plus MAX_SHIFT de sa ligne (toujours traversée
          // par elle), pour lui faire la place ; sinon « Swing high 1 » passait sous « Entrée »
          const squeeze = (yy: number) => {
            const xx = lineX1 - w;
            const blocks = inlineTags.filter((t) => Math.abs(t.y - yy) < INLINE_TAG_H + PACK_GAP - EPS && xx < t.x + t.w + INLINE_TAG_GAP - EPS && xx + w + INLINE_TAG_GAP > t.x + EPS);
            if (!blocks.length || blocks.some((t) => t.lineY === undefined)) return null;
            const moved = blocks.map((t) => ({ t, y: t.y < yy ? yy - INLINE_TAG_H - PACK_GAP : yy + INLINE_TAG_H + PACK_GAP }));
            const rest = inlineTags.filter((t) => !blocks.includes(t));
            const clear = (bx: number, by: number, bw: number, others: { x: number; y: number; w: number }[]) => inFrame(by)
              && !others.some((o) => Math.abs(o.y - by) < INLINE_TAG_H + PACK_GAP - EPS && bx < o.x + o.w + INLINE_TAG_GAP - EPS && bx + bw + INLINE_TAG_GAP > o.x + EPS)
              && ![...candleBoxes, ...uiBoxes].some((c) => bx < c.x2 && bx + bw > c.x1 && by - INLINE_TAG_H / 2 < c.y2 && by + INLINE_TAG_H / 2 > c.y1);
            if (!clear(xx, yy, w, rest)) return null;
            for (const m of moved) {
              if (Math.abs(m.y - m.t.lineY!) > MAX_SHIFT) return null;
              const others = [...rest, { x: xx, y: yy, w }, ...moved.filter((o) => o !== m).map((o) => ({ x: o.t.x, y: o.y, w: o.t.w }))];
              if (!clear(m.t.x, m.y, m.t.w, others)) return null;
            }
            for (const m of moved) m.t.y = m.y;
            return xx;
          };
          let squeezed = false;
          for (const yy of cands) {
            if (!inFrame(yy)) continue;
            if (!squeezed && gap(yy) > 0) {
              squeezed = true;
              for (const sy of cands) { if (gap(sy) > 0) break; if (!inFrame(sy)) continue; const sx = squeeze(sy); if (sx !== null) { x = sx; y = sy; break; } }
              if (x !== null) break;
            }
            const xx = clearX(yy, w);
            if (xx !== null) { x = xx; y = yy; break; }
          }
        }
        if (x === null && !onLine(s.key)) for (let k = 1; x === null && k <= (s.key === "markTag" ? MARK_TAG_STEPS : 6); k++) for (const dir of [1, -1]) {
          const yy = y0 + dir * k * (INLINE_TAG_H + INLINE_TAG_GAP) / 2;
          if (yy < INLINE_TAG_H / 2 + 1 || yy > H - INLINE_TAG_H / 2 - 1) continue;
          const xx = clearX(yy, w);
          if (xx !== null) { x = xx; y = yy; break; }
        }
        if (x === null) x = slotX(y0, w);
        for (let k = 1; x === null && k <= 6; k++) for (const dir of [1, -1]) {
          const yy = y0 + dir * k * (INLINE_TAG_H + INLINE_TAG_GAP);
          if (yy < INLINE_TAG_H / 2 + 1 || yy > H - INLINE_TAG_H / 2 - 1) continue;
          const xx = slotX(yy, w);
          if (xx !== null) { x = xx; y = yy; break; }
        }
        inlineTags.push({ key: s.key, label: s.label, color: s.color, y, w, x: x ?? Math.max(minX, lineX1 - w), dim: dimmed(s.key), hit: !!s.hit, lineY: onLine(s.key) ? toY(s.price) : undefined });
      }
    }
    const inlineTag = (t: InlineTag) => (
      <g key={t.key} data-label-for={t.key} className={t.key === "markTag" ? markClass : undefined} opacity={t.dim ? 0.35 : 1}>
        <rect x={t.x} y={t.y - INLINE_TAG_H / 2} width={t.w} height={INLINE_TAG_H} rx={INLINE_TAG_H / 2} fill={t.color}
          stroke={t.hit ? "#fff7ed" : "rgba(4,6,10,0.9)"} strokeWidth={t.hit ? 2 : 1.5} />
        <text x={t.x + t.w / 2} y={t.y + INLINE_TAG_FS * 0.36} textAnchor="middle" fontSize={INLINE_TAG_FS} fontWeight={700} fill="#04060a" className="v2-display">
          {t.label}
        </text>
      </g>
    );
    // Les étiquettes en ligne réapparaissent (fondu) quand le cadrage change
    const labelsKey = `${mode}:${min}:${max}:${topPad}`;
    if (introLabels.current?.round !== roundKey) introLabels.current = { round: roundKey, key: labelsKey };
    const labelsDelay = question && introLabels.current.key === labelsKey ? spotMs + 350 : 260;
    const tag = (t: (typeof tagSpecs)[number]) => (
      <g key={t.key} className={t.key === "markTag" ? markClass : undefined}>
        {Math.abs(t.y - t.lineY) > 0.5 && (
          <line x1={lineEnd} y1={t.lineY} x2={tagX} y2={t.y} stroke={t.color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        )}
        <rect x={tagX} y={t.y - TAG_H / 2} width={tagW} height={TAG_H} rx={TAG_H / 2} fill={t.color}
          stroke={t.hit ? "#fff7ed" : "none"} strokeWidth={t.hit ? 2 : 0} vectorEffect="non-scaling-stroke" />
        <text x={tagX + tagW / 2} y={t.y + TAG_FS * 0.36} textAnchor="middle" fontSize={TAG_FS} fontWeight={700} fill="#04060a" className="v2-display">
          {t.label}
        </text>
      </g>
    );

    // Stop touché : 1re bougie révélée qui atteint le niveau (mis en évidence)
    const hitPoint = (price: number) => {
      if (sep === undefined || !overlay?.entry) return null;
      const buy = overlay.entry.direction === "BUY";
      for (let i = sep; i < visible.length; i++) {
        const k = visible[i];
        if (buy ? k.l <= price : k.h >= price) return { x: xOf(i), y: toY(price) };
      }
      return null;
    };

    svg = (
      <svg
        key={roundKey}
        className="v2-svg absolute inset-0"
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={zones[0] ? `${zones[0].label} — ${visible.length} bougies` : `${visible.length} bougies`}
        style={cssVars({ "--spot": `${spotMs}ms`, "--v2-candle-step": `${stepMs}ms` })}
      >
        <defs>
          {hero && (
            <linearGradient id="v2-hero-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={HERO_GRADIENT[hero.kind]} stopOpacity="0.5" />
              <stop offset="100%" stopColor={HERO_GRADIENT[hero.kind]} stopOpacity="0.2" />
            </linearGradient>
          )}
          <filter id="v2-hero-glow" x="-10%" y="-80%" width="120%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Lueur d'une ligne : région en unités utilisateur (tout le graphique).
              Une ligne horizontale a une boîte de hauteur nulle : en unités de
              boîte (objectBoundingBox), la région du filtre serait vide et
              Chrome ne dessinerait pas la ligne. */}
          <filter id="v2-line-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tracé (zones, lignes, bougies) : c'est ce groupe qui glisse au clic */}
        <g ref={plotRef} className="v2-plot" style={{ transformOrigin: "0 0", transformBox: "view-box" }}>

        {/* Zones : la 1re est le héros en état question, le reste est estompé */}
        {zones.map((z, i) => {
          const r = zoneRect(z);
          const style = ZONE_COLOR[z.kind];
          if (hero && i === 0) {
            return (
              <g key={`z${i}`} className="v2-hero" data-zone={i}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6}
                  fill="url(#v2-hero-fill)" stroke={style.stroke} strokeWidth={3} filter="url(#v2-hero-glow)" vectorEffect="non-scaling-stroke" />
              </g>
            );
          }
          return (
            <g key={`z${i}`} data-zone={i} className={question ? "v2-dim" : "v2-dim--now"}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill={style.fill} stroke={style.stroke}
                strokeWidth={3} strokeDasharray={style.dashed ? "6 5" : undefined} vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}

        {/* Zone marquée au verdict (erreur) : derrière les bougies, transparente */}
        {mark && showMark && mark.kind === "zone" && zones[mark.index] && (() => {
          const r = zoneRect(zones[mark.index]);
          return (
            <g className={markClass} data-mark-zone="">
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill="rgba(239,68,68,0.16)" stroke="#f87171" strokeWidth={3} vectorEffect="non-scaling-stroke" />
            </g>
          );
        })()}

        {/* Séparation passé / futur */}
        {!question && splitX !== null && (
          <line x1={splitX} x2={splitX} y1={pin && splitX < PIN_BOX.right ? PIN_BOX.bottom : topPad - 6} y2={H - bottomPad + 4}
            stroke="#ffffff" strokeOpacity={0.35} strokeWidth={3} strokeDasharray="5 7" vectorEffect="non-scaling-stroke" />
        )}

        {/* Lignes de trade */}
        {overlay?.entry && hLine("entry", overlay.entry.price, "var(--v2-entry)", { opacity: overlay.dimEntryTp ? 0.55 : 1, dashed: overlay.dimEntryTp })}
        {overlay?.tp && tpShown !== undefined && hLine("tp", tpShown, "var(--v2-bull)", { dashed: true, opacity: overlay.dimEntryTp ? 0.55 : 1, x2: tpTagLabel ? lineEnd : undefined })}
        {overlay?.stop && hLine("stop", overlay.stop.price, overlay.stop.hit ? "#fb923c" : "var(--v2-bear)", { dashed: true, width: 2.5 })}
        {overlay?.candidateLines?.map((c, i) => hLine(`cand${i}`, c.price, c.color, {
          dashed: true, opacity: dimmed(`cand${i}`) ? 0.3 : 0.85, width: emphasis === `cand${i}` ? 3 : 2, x2: lineEnd,
        }))}
        {overlay?.stops?.map((s, i) => (inline && !s.label
          // Niveau d'une autre étape : trait discret, sans étiquette
          ? hLine(`stop${i}`, s.price, s.color, { dashed: true, width: 1.5, opacity: 0.45, discreet: true })
          : hLine(`stop${i}`, s.price, s.hit ? "#fb923c" : s.color, {
            dashed: s.dashed !== false && !s.hit, width: s.hit || s.selected || emphasis === `stop${i}` ? 3 : 2,
            opacity: dimmed(`stop${i}`) ? 0.3 : 1, x2: s.label ? lineEnd : lineX1,
          })))}

        {/* Bougies */}
        {visible.map((k, i) => {
          const isFuture = sep !== undefined && i >= sep;
          // Avant la réponse, les bougies restent nettes, aux couleurs de la charte (plus d'estompage
          // quand la zone s'allume : la zone est derrière elles et se voit à travers)
          if (question) return <V2Candle key={i} {...k} prevClose={visible[i - 1]?.c} x={xOf(i)} width={bodyW} toY={toY} thinWick index={i} dim="full" />;
          if (mode === "reveal" && isFuture) {
            // Montée par la page toutes les 420ms : apparaît à son arrivée
            return <V2Candle key={i} {...k} prevClose={visible[i - 1]?.c} x={xOf(i)} width={bodyW} toY={toY} thinWick index={0} dim="full" />;
          }
          return <V2Candle key={i} {...k} prevClose={visible[i - 1]?.c} x={xOf(i)} width={bodyW} toY={toY} thinWick index={0} dim="now" still />;
        })}

        {/* Changement de rôle : touches du côté de l'ancien rôle (anneaux à la pointe de la mèche) et
            cassure (triangle dans le sens de la cassure), discrets, à l'écart des bougies */}
        {zones.map((z, zi) => {
          if (!z.flip) return null;
          const f = z.flip, up = f.was === "resistance";
          const oldColor = up ? "var(--v2-bear)" : "var(--v2-bull)", newColor = up ? "var(--v2-bull)" : "var(--v2-bear)";
          const past = sep ?? visible.length;
          return (
            <g key={`flip${zi}`} data-flip={zi} className={question ? undefined : "v2-dim--now"}>
              {f.touches.filter((i) => i < Math.min(past, visible.length)).map((i) => {
                const k = visible[i];
                const y = up ? toY(k.h) - FLIP_GAP - FLIP_R : toY(k.l) + FLIP_GAP + FLIP_R;
                return <circle key={i} data-flip-touch={i} cx={xOf(i)} cy={y} r={FLIP_R} fill="none" stroke={oldColor} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />;
              })}
              {f.breakAt >= 0 && f.breakAt < Math.min(past, visible.length) && (() => {
                const k = visible[f.breakAt], x = xOf(f.breakAt);
                const tip = up ? toY(k.h) - FLIP_GAP - 7 : toY(k.l) + FLIP_GAP + 7, d = up ? 5 : -5;
                return <path data-flip-break={f.breakAt} d={`M${x} ${tip}L${x - 4} ${tip + d}L${x + 4} ${tip + d}Z`} fill={newColor} />;
              })()}
            </g>
          );
        })}

        {/* Impact : le stop touché est marqué à la bougie qui l'atteint */}
        {overlay?.stops?.map((s, i) => {
          const hp = s.hit ? hitPoint(s.price) : null;
          if (!hp) return null;
          return (
            <g key={`hit${i}`} className="v2-hit">
              <circle cx={hp.x} cy={hp.y} r={11} fill="rgba(251,146,60,0.22)" stroke="#fb923c" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
              <path d={`M${hp.x - 4.5} ${hp.y - 4.5}l9 9M${hp.x + 4.5} ${hp.y - 4.5}l-9 9`} stroke="#fff7ed" strokeWidth={2.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}

        {/* Étiquettes des lignes (au-dessus des bougies) */}
        {!inline && tagSpecs.map(tag)}
        </g>

        {/* Marquage de verdict : l'élément fautif en rouge, avec son libellé */}
        {mark && showMark && (() => {
          const RED = "#f87171";
          const fs = MARK_FS;
          const pw = textWidth(mark.label, fs) + 20;
          const ph = MARK_PH;
          let body: ReactNode = null;
          let top = 0;      // bord haut de l'élément marqué
          let bottom = 0;   // bord bas de l'élément marqué
          let pillX = lineX1 - pw;
          let pillY = 0;
          if (mark.kind === "line") {
            top = bottom = toY(mark.price);
            body = <line x1={padX} x2={lineX1} y1={top} y2={top} stroke={RED} strokeWidth={3.5} filter="url(#v2-line-glow)" strokeLinecap="round" />;
          } else if (mark.kind === "zone" && zones[mark.index]) {
            // Zone marquée : dessinée derrière les bougies (calque des zones) ; ici, seulement sa pastille
            const r = zoneRect(zones[mark.index]);
            top = r.y; bottom = r.y + r.h;
          } else if (mark.kind === "point") {
            const cx = xOf(visible.length - 1);
            top = bottom = toY(mark.price);
            // Centrée sous le point, sans empiéter sur la colonne des étiquettes
            pillX = Math.max(padX, Math.min(cx - pw / 2, (tagSpecs.length ? tagX - 8 : lineX1) - pw));
            body = (
              <>
                <circle cx={cx} cy={top} r={15} fill="rgba(239,68,68,0.2)" stroke={RED} strokeWidth={3} filter="url(#v2-hero-glow)" />
                <path d={`M${cx - 5} ${top - 5}l10 10M${cx + 5} ${top - 5}l-10 10`} stroke="#fef2f2" strokeWidth={2.5} strokeLinecap="round" />
              </>
            );
          }
          if (mark.kind === "point") pillY = top + 22 + ph <= H - 4 ? top + 22 : top - 22 - ph;
          else {
            // Sous l'élément, sinon au-dessus ; et du côté où elle ne couvre aucune bougie
            const onCandle = (y: number) => visible.some((k, i) => xOf(i) + bodyW / 2 + 2 > pillX && xOf(i) - bodyW / 2 - 2 < pillX + pw && toY(k.h) - 2 < y + ph && toY(k.l) + 2 > y);
            const sides = [bottom + 8, top - 8 - ph].filter((y) => y >= 2 && y + ph <= H - 4);
            pillY = sides.find((y) => !onCandle(y)) ?? sides[0] ?? top - 8 - ph;
          }
          return (
            <g className={markClass}>
              {body}
              {!columnMode && !inline && (
                <>
                  <rect x={pillX} y={pillY} width={pw} height={ph} rx={ph / 2} fill={RED} />
                  <text x={pillX + pw / 2} y={pillY + ph / 2 + fs * 0.36} textAnchor="middle" fontSize={fs} fontWeight={700} fill="#1f0707" className="v2-display">{mark.label}</text>
                </>
              )}
            </g>
          );
        })()}

        {/* Pastille du héros, accrochée sous la zone, à droite */}
        {/* Étiquettes en ligne : hors du tracé (pas déformées par le glissement),
            elles réapparaissent en fondu une fois le cadrage posé */}
        {inline && (
          <g key={labelsKey} className="v2-labels" style={cssVars({ "--labels-delay": `${labelsDelay}ms` })}>
            {inlineTags.map(inlineTag)}
          </g>
        )}

        {hero && heroBox && !columnMode && !inline && (
          <g className="v2-hero-label">
            <rect x={lineX1 - pillW} y={heroPillY} width={pillW} height={pillH} rx={pillH / 2} fill={HERO_GRADIENT[hero.kind]} />
            <text x={lineX1 - pillW / 2} y={heroPillY + pillH / 2 + fsPill * 0.35} textAnchor="middle"
              fontSize={fsPill} fontWeight={700} fill="#1c1206" className="v2-display">
              {hero.label}
            </text>
          </g>
        )}
      </svg>
    );
  }

  return (
    <div ref={playRef} className={playing ? "is-playing" : undefined}>
      <div
        ref={sizeRef}
        /* Même hauteur de cadre dans tous les états : aucun saut au clic */
        className={`v2-chart ${preview ? "v2-chart--preview" : "v2-chart--question"} v2-well overflow-hidden`}
      >
        {svg}

        {/* Choix du joueur épinglé sur le graphique */}
        {pin && (
          <div className="v2-pin absolute left-3 top-3 z-10">
            <span
              className="v2-display v2-pin-tag inline-flex items-center gap-2 rounded-full px-3 py-1 font-bold"
              style={{ color: pin.color, background: "rgba(4,6,10,0.85)", boxShadow: `inset 0 0 0 2px ${pin.color}, 0 0 24px -4px ${pin.color}` }}
            >
              {pin.label}
              {pin.sub && <span className="font-medium text-[color:var(--v2-text-2)]">{pin.sub}</span>}
            </span>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
