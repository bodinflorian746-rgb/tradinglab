// Aperçu d'une vraie leçon sur la home (FR, ES) : niveau, titre, texte réel de
// la leçon Avancé 3 « Order Blocks » et son schéma, redessiné dans la charte v2.
//
// Schéma : bougies continues (chaque bougie ouvre à la clôture de la
// précédente, construites ici à partir des seules clôtures) et dessinées avec la
// géométrie des jeux (candle-geometry.ts). Héros : la zone de l'Order Block et
// ses deux bougies (l'OB, puis la mitigation) ; le reste est estompé. Traits de
// 2 px au moins. Animation à l'arrivée dans l'écran, une seule fois
// ([data-reveal] → [data-revealed], home.css) ; mouvement réduit : tout est
// visible d'emblée.
import Link from "next/link";
import type { CSSProperties } from "react";
import { candleBody } from "@/app/components/games/candle-geometry";
import type { HomeLocale } from "./strings";
import { LESSON_PREVIEW_CANDLES, LESSON_PREVIEW_MITIGATION, LESSON_PREVIEW_OB, LESSON_PREVIEW_REACTION, type PreviewCandle } from "./lesson-preview-data";

const T = {
  fr: {
    eyebrow: "À quoi ressemble une leçon",
    level: "Trading · Avancé · Leçon 3",
    title: "Order Blocks",
    // Texte de la leçon (formations/avance/lecon3)
    lines: [
      "Un Order Block est la dernière bougie avant un mouvement impulsif institutionnel. C'est là que les institutions ont placé leurs ordres, et où le prix revient souvent les chercher.",
      "Quand le prix y revient et réagit, on dit que l'OB est « mitigé ».",
    ],
    ob: "OB",
    mitigation: "MITIGATION",
    reaction: "RÉACTION",
    aria: "Schéma : la dernière bougie baissière avant une forte hausse forme l'Order Block ; le prix revient dans la zone (mitigation), puis repart à la hausse (réaction).",
    cta: "Voir le parcours Trading",
    note: "Leçon complète pour les membres et pendant l'essai 48h.",
  },
  es: {
    eyebrow: "Así es una lección",
    level: "Trading · Avanzado · Lección 3",
    title: "Order Blocks",
    // Texto de la lección (formations/avance/lecon3, _content-es)
    lines: [
      "Un Order Block es la última vela antes de un movimiento impulsivo institucional. Ahí es donde las instituciones colocaron sus órdenes, y donde el precio suele volver a buscarlas.",
      "Cuando el precio regresa y reacciona, se dice que el OB está «mitigado».",
    ],
    ob: "OB",
    mitigation: "MITIGATION",
    reaction: "REACCIÓN",
    aria: "Esquema: la última vela bajista antes de una fuerte subida forma el Order Block; el precio vuelve a la zona (mitigation) y luego sube de nuevo (reacción).",
    cta: "Ver el recorrido Trading",
    note: "Lección completa para los miembros y durante la prueba de 48h.",
  },
} as const;

// ─── Données du schéma (bougies continues) ───
type K = PreviewCandle;
const CANDLES: K[] = LESSON_PREVIEW_CANDLES;
const OB = LESSON_PREVIEW_OB;
const MITIGATION = LESSON_PREVIEW_MITIGATION;
const REACTION = LESSON_PREVIEW_REACTION;
const ZONE = { top: CANDLES[OB].h, bottom: CANDLES[OB].l };

// ─── Géométrie (unités du viewBox ; traits en px réels via non-scaling-stroke) ───
const W = 420;
const H = 230;
const PAD_X = 12;
const PAD_TOP = 34;    // place de l'étiquette RÉACTION
const PAD_BOTTOM = 40; // place des étiquettes OB et MITIGATION
const SLOT = (W - 2 * PAD_X) / CANDLES.length;
const BODY_W = SLOT * 0.52;
const MIN = Math.min(...CANDLES.map((k) => k.l));
const MAX = Math.max(...CANDLES.map((k) => k.h));
const toY = (p: number) => PAD_TOP + ((MAX - p) / (MAX - MIN)) * (H - PAD_TOP - PAD_BOTTOM);
const xOf = (i: number) => PAD_X + SLOT * (i + 0.5);
const FS = 14;
const PILL_H = 24;
const pillW = (s: string) => s.length * FS * 0.62 + 20;

const css = (v: Record<string, string | number>) => v as CSSProperties;

function Pill({ x, y, label, color, delay }: { x: number; y: number; label: string; color: string; delay: number }) {
  const w = pillW(label);
  const left = Math.min(Math.max(x - w / 2, 2), W - w - 2);
  return (
    <g className="hv2-lp-label" style={css({ "--d": `${delay}ms` })}>
      <rect x={left} y={y} width={w} height={PILL_H} rx={PILL_H / 2} fill={color} />
      <text x={left + w / 2} y={y + PILL_H / 2 + FS * 0.36} textAnchor="middle" fontSize={FS} fontWeight={700} fill="#04060a" className="v2-display">
        {label}
      </text>
    </g>
  );
}

function ObChart({ t }: { t: (typeof T)[HomeLocale] }) {
  const step = 70; // ms entre deux bougies
  const zoneX = xOf(OB) - SLOT / 2;
  const hero = (i: number) => i === OB || i === MITIGATION;
  const zoneDelay = (OB + 1) * step;
  const labelsDelay = CANDLES.length * step + 200;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="hv2-lp-svg" role="img" aria-label={t.aria}>
      {/* Zone de l'Order Block (héros) */}
      <rect className="hv2-lp-zone" style={css({ "--d": `${zoneDelay}ms` })}
        x={zoneX} y={toY(ZONE.top)} width={W - PAD_X - zoneX} height={toY(ZONE.bottom) - toY(ZONE.top)}
        rx={6} fill="rgba(16,185,129,0.16)" stroke="#10b981" strokeWidth={2} vectorEffect="non-scaling-stroke" />
      {CANDLES.map((k, i) => {
        const up = k.c >= k.o;
        const b = candleBody(k.o, k.c, toY);
        return (
          <g key={i} className={`hv2-lp-candle${hero(i) ? " hv2-lp-candle--hero" : ""}`} style={css({ "--d": `${i * step}ms` })}>
            <line x1={xOf(i)} x2={xOf(i)} y1={toY(k.h)} y2={toY(k.l)} stroke={up ? "#059669" : "#b91c1c"} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <rect x={xOf(i) - BODY_W / 2} y={b.y} width={BODY_W} height={b.h} rx={Math.min(2, b.h / 2)} fill={up ? "#10b981" : "#ef4444"}
              stroke={hero(i) ? "#fbbf24" : "none"} strokeWidth={hero(i) ? 2 : 0} vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
      {/* Étiquettes : OB et MITIGATION sous leur bougie, RÉACTION au-dessus de la reprise */}
      <Pill x={xOf(OB)} y={toY(ZONE.bottom) + 8} label={t.ob} color="#fbbf24" delay={labelsDelay} />
      <Pill x={xOf(MITIGATION)} y={toY(ZONE.bottom) + 8} label={t.mitigation} color="#fbbf24" delay={labelsDelay + 120} />
      <Pill x={xOf(REACTION)} y={toY(Math.max(...CANDLES.slice(REACTION - 1, REACTION + 2).map((k) => k.h))) - PILL_H - 6} label={t.reaction} color="#34d399" delay={labelsDelay + 240} />
    </svg>
  );
}

export function LessonPreview({ locale, href }: { locale: HomeLocale; href: string }) {
  const t = T[locale];
  return (
    <div className="flex flex-col gap-4">
      <p className="v2-eyebrow">{t.eyebrow}</p>
      <article data-reveal className="hv2-lp v2-card">
        <div className="hv2-lp-text">
          <span className="v2-chip v2-chip--emerald self-start">{t.level}</span>
          <h3 className="v2-display text-[24px] font-bold leading-tight">{t.title}</h3>
          {t.lines.map((line, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-[color:var(--v2-text-2)]">{line}</p>
          ))}
        </div>
        <div className="hv2-lp-chart">
          <ObChart t={t} />
        </div>
        <div className="hv2-lp-cta">
          <Link href={href} className="hv2-link">
            {t.cta}
            <svg width="14" height="14" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p className="text-[13px] text-[color:var(--v2-text-3)]">{t.note}</p>
        </div>
      </article>
    </div>
  );
}
