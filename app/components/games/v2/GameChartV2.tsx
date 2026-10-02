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
};

export function V2Candle({ o, h, l, c, x, width, toY, index, dim = "anim", still = false, prevClose }: V2CandleProps) {
  // Toujours verte ou rouge : sans corps, la couleur suit la clôture précédente
  const up = c > o || (c === o && (prevClose === undefined || c >= prevClose));
  const body = up ? "var(--v2-bull)" : "var(--v2-bear)";
  const wick = up ? "var(--v2-bull-wick)" : "var(--v2-bear-wick)";
  const yTop = toY(Math.max(o, c));
  const yBot = toY(Math.min(o, c));
  const dimClass = dim === "anim" ? "v2-dim" : dim === "now" ? "v2-dim--now" : undefined;

  return (
    <g className={dimClass}>
      <g className={still ? "v2-candle v2-candle--static" : "v2-candle"} style={cssVars({ "--i": index })}>
        <line x1={x} x2={x} y1={toY(h)} y2={toY(l)} stroke={wick} strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <rect x={x - width / 2} y={yTop} width={width} height={Math.max(yBot - yTop, 3)} rx={3} fill={body} />
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
   * Garde les bougies à pleine opacité en état question (pas d'estompage au
   * « spot »). Utile quand le joueur doit lire les bougies elles-mêmes.
   */
  keepCandlesBright?: boolean;
  /** Élément marqué en rouge au verdict (ex. l'erreur de « Trouve l'erreur »). */
  mark?: GameChartMark;
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

export function GameChartV2({ data, overlay, mode: modeProp, pin, keepCandlesBright, mark, reserve, tpOffscale, preview, inlineLabels, labeledZones, emphasis, glideScale, children }: GameChartV2Props) {
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
  const zones = data.zones;
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
  const tpTagLabel = tpArrow === "up" ? "TP ↑" : tpArrow === "down" ? "TP ↓" : null;
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
  // En ligne : une marge à droite de la largeur de la plus grande petite étiquette
  const tagColW = inline
    ? (tagLabels.length ? Math.max(...tagLabels.map(inlineTagW)) + 10 : 0)
    : colLabels.length ? Math.max(...colLabels.map((l) => textWidth(l, 12) + 16)) + 18 : 0;
  const slot = W > 0 ? (W - 2 * padX - tagColW) / nSlots : 0;
  const xOf = (i: number) => padX + slot * (i + 0.5);
  // Plafond relatif au pas : les bougies ne se touchent jamais, même nombreuses
  const bodyW = Math.min(clamp(slot * 0.6, 8, 30), slot * 0.78);

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

  const fsPill = desktop ? DESKTOP_PILL_PX : clamp(W * 0.036, 13, 17);
  const pillH = fsPill + 12;
  const bottomPad = hero && !columnMode && !inline ? pillH + 16 : 14; // la pastille héros vit sous la zone
  // Réserve juste ce qu'il faut pour que la pastille « ton choix » ne
  // recouvre aucune bougie de son coin.
  const topPadBase = !pin || H <= 0 ? 14 : scaled.reduce((acc, k, i) => {
    if (xOf(i) - bodyW / 2 > PIN_BOX.right) return acc;
    const f = (max - k.h) / range;
    return f < 1 ? Math.max(acc, (PIN_BOX.bottom - f * (H - bottomPad)) / (1 - f)) : acc;
  }, 14);
  // Verdict en bandeau (élément marqué) : sa hauteur est réservée en haut
  const topPad = mark && mode === "verdict" ? Math.max(topPadBase, 76) : topPadBase;

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
    const pillW = hero ? textWidth(hero.label, fsPill) + fsPill * 1.3 : 0;
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
    type InlineTag = { key: string; label: string; color: string; y: number; w: number; x: number; dim: boolean; hit: boolean };
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
      const slotX = (y: number, w: number) => {
        let x = lineX1 - w;
        for (let guard = 0; guard < 8; guard++) {
          const block = inlineTags.find((t) => Math.abs(t.y - y) < INLINE_TAG_H + INLINE_TAG_GAP
            && x < t.x + t.w + INLINE_TAG_GAP && x + w + INLINE_TAG_GAP > t.x);
          if (!block) return x >= minX ? x : null;
          x = block.x - INLINE_TAG_GAP - w;
        }
        return null;
      };
      // Étiquettes de lignes d'abord (elles restent sur leur ligne), puis zones
      const onLine = (k: string) => !k.startsWith("zone") && (k !== "markTag" || mark?.kind === "line");
      const placeOrder = [...specs].sort((a, b) => Number(onLine(b.key)) - Number(onLine(a.key)) || toY(a.price) - toY(b.price));
      for (const s of placeOrder) {
        const w = inlineTagW(s.label);
        const y0 = clamp(toY(s.price), INLINE_TAG_H / 2 + 1, H - INLINE_TAG_H / 2 - 1);
        let y = y0;
        let x = slotX(y0, w);
        for (let k = 1; x === null && k <= 6; k++) for (const dir of [1, -1]) {
          const yy = y0 + dir * k * (INLINE_TAG_H + INLINE_TAG_GAP);
          if (yy < INLINE_TAG_H / 2 + 1 || yy > H - INLINE_TAG_H / 2 - 1) continue;
          const xx = slotX(yy, w);
          if (xx !== null) { x = xx; y = yy; break; }
        }
        inlineTags.push({ key: s.key, label: s.label, color: s.color, y, w, x: x ?? Math.max(minX, lineX1 - w), dim: dimmed(s.key), hit: !!s.hit });
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
          if (question) return <V2Candle key={i} {...k} prevClose={visible[i - 1]?.c} x={xOf(i)} width={bodyW} toY={toY} index={i} dim={keepCandlesBright ? "full" : "anim"} />;
          if (mode === "reveal" && isFuture) {
            // Montée par la page toutes les 420ms : apparaît à son arrivée
            return <V2Candle key={i} {...k} prevClose={visible[i - 1]?.c} x={xOf(i)} width={bodyW} toY={toY} index={0} dim="full" />;
          }
          return <V2Candle key={i} {...k} prevClose={visible[i - 1]?.c} x={xOf(i)} width={bodyW} toY={toY} index={0} dim="now" still />;
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
          const fs = 13;
          const pw = textWidth(mark.label, fs) + 20;
          const ph = 26;
          let body: ReactNode = null;
          let top = 0;      // bord haut de l'élément marqué
          let bottom = 0;   // bord bas de l'élément marqué
          let pillX = lineX1 - pw;
          let pillY = 0;
          if (mark.kind === "line") {
            top = bottom = toY(mark.price);
            body = <line x1={padX} x2={lineX1} y1={top} y2={top} stroke={RED} strokeWidth={3.5} filter="url(#v2-line-glow)" strokeLinecap="round" />;
          } else if (mark.kind === "zone" && zones[mark.index]) {
            const r = zoneRect(zones[mark.index]);
            top = r.y; bottom = r.y + r.h;
            body = <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill="rgba(239,68,68,0.22)" stroke={RED} strokeWidth={3} filter="url(#v2-hero-glow)" />;
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
          else pillY = bottom + 8 + ph <= H - 4 ? bottom + 8 : top - 8 - ph; // sous l'élément, sinon au-dessus
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
            <rect x={lineX1 - pillW} y={heroBox.y + heroBox.h + 6} width={pillW} height={pillH} rx={pillH / 2} fill={HERO_GRADIENT[hero.kind]} />
            <text x={lineX1 - pillW / 2} y={heroBox.y + heroBox.h + 6 + pillH / 2 + fsPill * 0.35} textAnchor="middle"
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
