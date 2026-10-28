// Blocs de texte des leçons de formation (Débutant 11, Intermédiaire 10 à 12, Avancé 13 à 15) : mêmes
// sections, encadrés, plans et erreurs que les leçons Avancé 10 à 12, réunis ici au lieu d'être recopiés
// dans chaque page.

import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}

export function P({ children, last }: { children: ReactNode; last?: boolean }) {
  return <p className={`text-zinc-300 leading-relaxed text-sm${last ? "" : " mb-4"}`}>{children}</p>;
}

/** Encadré gris : « Dans cette leçon », « Exemple », « Attention »… (intitulé en blanc) */
export function Note({ label, children, last }: { label: string; children: ReactNode; last?: boolean }) {
  return (
    <div className={`bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3${last ? "" : " mb-4"}`}>
      <p className="text-sm text-zinc-400 leading-relaxed">
        <span className="text-white font-medium">{label} :</span>{" "}{children}
      </p>
    </div>
  );
}

/** Liste de notions : intitulé et détail */
export function Items({ items }: { items: { label: string; detail: ReactNode }[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((r) => (
        <div key={r.label} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
          <div>
            <p className="text-sm font-medium text-white">{r.label}</p>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{r.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Plan de trade (ou tableau de valeurs) : lignes « intitulé : valeur » */
export function Plan({ title = "Le plan", rows, last }: { title?: string; rows: [string, ReactNode][]; last?: boolean }) {
  return (
    <div className={`bg-zinc-800/50 rounded-xl p-4${last ? "" : " mb-4"}`}>
      <p className="text-sm font-semibold text-white mb-2">{title}</p>
      <ul className="space-y-1 text-sm text-zinc-300">
        {rows.map(([k, v]) => <li key={k}>- {k} : {v}</li>)}
      </ul>
    </div>
  );
}

/** « Réalité du retail » : la taille de position au lot près, faisable ou non avec 1 à 2 % de risque */
export function Retail({ children }: { children: ReactNode }) {
  return (
    <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
      <div className="flex items-center gap-2 mb-2">
        <span>💰</span>
        <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
      </div>
      <p className="text-base text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}

/** Lien vers une autre leçon, dans le texte */
export function L({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="text-amber-400 hover:text-amber-300 underline underline-offset-2">{children}</Link>;
}

/** Les erreurs à éviter, suivies d'un paragraphe de conclusion */
export function Mistakes({ items, children }: { items: { label: string; detail: string }[]; children?: ReactNode }) {
  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">Les erreurs à éviter</h2>
      <div className="space-y-2.5">
        {items.map((r) => (
          <div key={r.label} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400 shrink-0 mt-0.5">
              <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <p className="text-sm font-medium text-white">{r.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{r.detail}</p>
            </div>
          </div>
        ))}
      </div>
      {children && <p className="text-zinc-300 leading-relaxed text-sm mt-4">{children}</p>}
    </section>
  );
}

/** Séparateur « Révision » avant les points à retenir et le quiz */
export function Revision() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-px bg-zinc-800" />
      <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  );
}

/** Graphique(s) entre deux sections */
export function Charts({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}
