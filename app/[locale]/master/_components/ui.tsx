// Petits composants UI SERVEUR (pas de hooks) réutilisés par les pages Master.

import type { ReactNode } from "react";

export function Tile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "emerald" | "red" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-400"
      : tone === "red"
        ? "text-red-400"
        : tone === "amber"
          ? "text-amber-400"
          : "text-white";
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

export function TableShell({
  head,
  children,
  isEmpty,
  empty,
  emptyColspan,
}: {
  head: string[];
  children: ReactNode;
  isEmpty: boolean;
  empty: string;
  emptyColspan: number;
}) {
  return (
    <section className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={emptyColspan} className="px-4 py-8 text-center text-zinc-500">
                {empty}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </section>
  );
}

export function SuspendedNotice({ text }: { text: string }) {
  return (
    <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
      {text}
    </p>
  );
}
