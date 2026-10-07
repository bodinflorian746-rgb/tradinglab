// Schémas « infographie » des leçons (sans prix) — charte v2, même cadre que
// LessonChart (figure .tsx-v2.lc, data-lesson-chart pour l'audit). Construits en
// HTML/CSS : lisibles sur mobile sans carte de remplacement, textes ≥ 12 px.
// Briques : Flow (étapes), Cards (cartes), Quadrant, Scale (échelle), Timeline
// (frise horaire), Bars (barres), Matrix (tableau coloré), Checklist.

import "@/app/styles/lesson-chart.css";
import type { CSSProperties, ReactNode } from "react";
import type { LCTone } from "./LessonChart";

const tone = (t?: LCTone) => (t ? ` ls-tone--${t}` : "");

export function LessonSchema({ id, title, caption, children }: { id: string; title?: string; caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="tsx-v2 lc" data-lesson-chart={id}>
      <div className="lc-card">
        {title && <figcaption className="lc-title">{title}</figcaption>}
        <div className="ls-body">{children}</div>
        {caption && <p className="lc-caption">{caption}</p>}
      </div>
    </figure>
  );
}

/** Signature de marché « DXY ↑ · Yields ↓ · Or ↑ » : un jeton par actif, retour à la ligne entre jetons. */
export function Sig({ s }: { s: string }) {
  return <span className="ls-sig">{s.split(" · ").map((t, i) => <span key={i}>{t}</span>)}</span>;
}

/** Sous-titre de section dans un schéma. */
export function SchemaHeading({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="lc-panel-head">
      <div className="lc-panel-title">{children}</div>
      {sub && <div className="lc-panel-sub">{sub}</div>}
    </div>
  );
}

export interface FlowStep { title: ReactNode; text?: ReactNode; tone?: LCTone; tag?: ReactNode }

/** Étapes reliées par des flèches : en ligne sur desktop, en colonne sur mobile. */
export function Flow({ steps, wrap }: { steps: FlowStep[]; /** plus de 4 étapes : retour à la ligne sur desktop */ wrap?: boolean }) {
  return (
    <ol className={`ls-flow${wrap ? " ls-flow--wrap" : ""}`} style={{ "--n": steps.length } as CSSProperties}>
      {steps.map((s, i) => (
        <li key={i} className="ls-flow-item">
          <div className={`ls-step${tone(s.tone)}`}>
            {s.tag && <span className="ls-tag">{s.tag}</span>}
            <div className="ls-step-title">{s.title}</div>
            {s.text && <div className="ls-step-text">{s.text}</div>}
          </div>
          {i < steps.length - 1 && <span className="ls-arrow" aria-hidden>→</span>}
        </li>
      ))}
    </ol>
  );
}

export interface CardItem { title: ReactNode; value?: ReactNode; text?: ReactNode; items?: ReactNode[]; tone?: LCTone; tag?: ReactNode }

/** Cartes en grille (2 à 4 colonnes sur desktop, 1 ou 2 sur mobile). */
export function Cards({ items, cols = 3, mobileCols = 1 }: { items: CardItem[]; cols?: 2 | 3 | 4; mobileCols?: 1 | 2 }) {
  return (
    <div className={`ls-cards ls-cards--${cols} ls-cards-m--${mobileCols}`}>
      {items.map((c, i) => (
        <div key={i} className={`ls-card${tone(c.tone)}`}>
          {c.tag && <span className="ls-tag">{c.tag}</span>}
          <div className="ls-card-title">{c.title}</div>
          {c.value !== undefined && <div className="ls-card-value">{c.value}</div>}
          {c.text && <div className="ls-card-text">{c.text}</div>}
          {c.items && c.items.length > 0 && (
            <ul className="ls-list">{c.items.map((it, k) => <li key={k}>{it}</li>)}</ul>
          )}
        </div>
      ))}
    </div>
  );
}

/** Quadrant 2 × 2 : axes nommés, cellules dans l'ordre haut-gauche, haut-droite, bas-gauche, bas-droite. */
export function Quadrant({ x, y, cells }: { x: [ReactNode, ReactNode]; y: [ReactNode, ReactNode]; cells: [CardItem, CardItem, CardItem, CardItem] }) {
  return (
    <div className="ls-quad">
      <div className="ls-quad-y ls-quad-y--top">↑ {y[0]}</div>
      <div className="ls-quad-grid">
        {cells.map((c, i) => (
          <div key={i} className={`ls-card${tone(c.tone)}`} data-cell={i}>
            <div className="ls-card-title">{c.title}</div>
            {c.value !== undefined && <div className="ls-card-sub">{typeof c.value === "string" ? <Sig s={c.value} /> : c.value}</div>}
            {c.text && <div className="ls-card-text">{c.text}</div>}
            {c.items && <ul className="ls-list ls-list--plain">{c.items.map((it, k) => <li key={k}>{it}</li>)}</ul>}
          </div>
        ))}
      </div>
      <div className="ls-quad-x"><span>← {x[0]}</span><span>{x[1]} →</span></div>
      <div className="ls-quad-y ls-quad-y--bottom">↓ {y[1]}</div>
    </div>
  );
}

export interface ScaleMark { pos: number; label: ReactNode; sub?: ReactNode; tone?: LCTone }

/** Échelle graduée de gauche à droite (pos 0-100), repères numérotés et légendés dessous. */
export function Scale({ left, right, marks, gradient = "linear-gradient(90deg, #10b981, #9ca0ab, #ef4444)" }: { left: ReactNode; right: ReactNode; marks: ScaleMark[]; gradient?: string }) {
  const sorted = [...marks].sort((a, b) => a.pos - b.pos);
  return (
    <div className="ls-scale">
      <div className="ls-scale-ends"><span>{left}</span><span>{right}</span></div>
      <div className="ls-scale-track" style={{ background: gradient }}>
        {sorted.map((m, i) => (
          <span key={i} className={`ls-scale-dot${tone(m.tone)}`} style={{ left: `${m.pos}%` }}>{i + 1}</span>
        ))}
      </div>
      <ol className="ls-scale-legend">
        {sorted.map((m, i) => (
          <li key={i}><span className={`ls-scale-num${tone(m.tone)}`}>{i + 1}</span><span><strong>{m.label}</strong>{m.sub && <> · {m.sub}</>}</span></li>
        ))}
      </ol>
    </div>
  );
}

export interface TimelineRow { label: ReactNode; from: number; to: number; tone?: LCTone; note?: ReactNode }

/** Frise horaire : une ligne par plage (heures de from à to, passage de minuit permis), graduations dessous. */
export function Timeline({ rows, start = 0, end = 24, ticks = [0, 6, 12, 18, 24], unit = "h", marks = [] }: {
  rows: TimelineRow[]; start?: number; end?: number; ticks?: number[]; unit?: string; marks?: { at: number; label: ReactNode; tone?: LCTone }[];
}) {
  const pct = (h: number) => ((h - start) / (end - start)) * 100;
  const parts = (r: TimelineRow) => (r.to >= r.from ? [[r.from, r.to]] : [[r.from, end], [start, r.to]]);
  return (
    <div className="ls-timeline">
      {rows.map((r, i) => (
        <div key={i} className="ls-tl-row">
          <div className="ls-tl-label"><strong>{r.label}</strong>{r.note && <span className="ls-tl-note"> · {r.note}</span>}</div>
          <div className="ls-tl-track">
            {parts(r).map(([a, b], k) => (
              <span key={k} className={`ls-tl-seg${tone(r.tone)}`} style={{ left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%` }} />
            ))}
            {marks.map((m, k) => <span key={`m${k}`} className={`ls-tl-mark${tone(m.tone)}`} style={{ left: `${pct(m.at)}%` }} />)}
          </div>
        </div>
      ))}
      <div className="ls-tl-ticks">
        {ticks.map((t) => <span key={t} style={{ left: `${pct(t)}%` }}>{t}{unit}</span>)}
      </div>
      {marks.length > 0 && (
        <ul className="ls-tl-marks">
          {marks.map((m, k) => <li key={k}><span className={`ls-tl-mark ls-tl-mark--static${tone(m.tone)}`} />{m.label}</li>)}
        </ul>
      )}
    </div>
  );
}

export interface BarItem { label: ReactNode; value: number; display: ReactNode; tone?: LCTone; note?: ReactNode }

/** Barres horizontales à l'échelle linéaire (0 → max). */
export function Bars({ items, max }: { items: BarItem[]; max?: number }) {
  const m = max ?? Math.max(...items.map((b) => b.value));
  return (
    <div className="ls-bars">
      {items.map((b, i) => (
        <div key={i} className="ls-bar-row" data-value={b.value}>
          <div className="ls-bar-label"><strong>{b.label}</strong>{b.note && <span className="ls-tl-note"> · {b.note}</span>}</div>
          <div className="ls-bar-track">
            <span className={`ls-bar${tone(b.tone)}`} style={{ width: `${(b.value / m) * 100}%` }} />
            <span className="ls-bar-value">{b.display}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Tableau à cellules colorées (corrélations, comparaisons). */
export function Matrix({ head, rows }: { head: ReactNode[]; rows: { label: ReactNode; cells: { text: ReactNode; tone?: LCTone }[] }[] }) {
  return (
    <div className="ls-matrix-wrap">
      <table className="ls-matrix">
        <thead><tr><th />{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <th>{r.label}</th>
              {r.cells.map((c, k) => <td key={k} className={tone(c.tone).trim()}>{c.text}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Liste de critères : ✓ validé, ✗ manquant, • neutre. */
export function Checklist({ items }: { items: { ok?: boolean; title: ReactNode; text?: ReactNode }[] }) {
  return (
    <ul className="ls-check">
      {items.map((it, i) => (
        <li key={i} className={it.ok === undefined ? "" : it.ok ? "ls-check--ok" : "ls-check--ko"}>
          <span className="ls-check-mark" aria-hidden>{it.ok === undefined ? "•" : it.ok ? "✓" : "✗"}</span>
          <span><strong>{it.title}</strong>{it.text && <span className="ls-check-text"> {it.text}</span>}</span>
        </li>
      ))}
    </ul>
  );
}
