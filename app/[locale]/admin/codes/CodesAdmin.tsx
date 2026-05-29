"use client";

// UI admin des codes d'accès : génération (1 ou en lot) + liste + copie.
// Aligné sur la vraie table : clé = code, champ type (trial|broker|lifetime),
// pas de colonne note. La logique sensible (insert) est dans la Server Action
// generateCodes ; ce composant ne fait que l'orchestration UI + copy.

import { useActionState, useState } from "react";
import { generateCodes, type GenerateResult } from "./actions";

export type AdminCode = {
  code: string;
  status: string;
  type: string;
  used_by_user_id: string | null;
  used_at: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-400",
  used: "bg-zinc-700/40 text-zinc-400",
  revoked: "bg-red-500/15 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  available: "Libre",
  used: "Utilisé",
  revoked: "Révoqué",
};

const TYPE_LABELS: Record<string, string> = {
  trial: "Trial",
  broker: "Broker",
  lifetime: "Lifetime",
};

const TYPE_STYLES: Record<string, string> = {
  trial: "bg-blue-400/15 text-blue-400",
  broker: "bg-emerald-500/15 text-emerald-400",
  lifetime: "bg-amber-400/15 text-amber-400",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function CodesAdmin({ codes, locale }: { codes: AdminCode[]; locale: string }) {
  const [state, formAction, pending] = useActionState<GenerateResult | null, FormData>(
    async (_prev, formData) => generateCodes(formData),
    null,
  );
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1500);
    } catch {
      // clipboard indisponible (http non sécurisé) : on ignore silencieusement
    }
  }

  const total = codes.length;
  const available = codes.filter((c) => c.status === "available").length;
  const used = codes.filter((c) => c.status === "used").length;

  return (
    <div className="space-y-8">
      {/* Génération */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-1 text-lg font-bold">Générer des codes</h2>
        <p className="mb-5 text-sm text-zinc-400">
          1 code = 1 inscription. Format TSX-XXXX-XXXX.
        </p>

        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="locale" value={locale} />

          <div>
            <label htmlFor="count" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Nombre de codes
            </label>
            <input
              id="count"
              name="count"
              type="number"
              min={1}
              max={100}
              defaultValue={1}
              className="w-28 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="type" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Type
            </label>
            <select
              id="type"
              name="type"
              defaultValue="trial"
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="trial">Trial</option>
              <option value="broker">Broker</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Génération…" : "Générer"}
          </button>
        </form>

        {state && (
          <p
            className={`mt-4 text-sm ${state.ok ? "text-emerald-400" : "text-red-400"}`}
            role="status"
          >
            {state.ok
              ? `${state.created} code${state.created > 1 ? "s" : ""} généré${state.created > 1 ? "s" : ""}.`
              : `Erreur : ${state.error ?? "inconnue"}`}
          </p>
        )}
      </section>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-zinc-400">
          Total : <strong className="text-white">{total}</strong>
        </span>
        <span className="text-zinc-400">
          Libres : <strong className="text-emerald-400">{available}</strong>
        </span>
        <span className="text-zinc-400">
          Utilisés : <strong className="text-zinc-300">{used}</strong>
        </span>
      </div>

      {/* Liste */}
      <section className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Utilisé par</th>
              <th className="px-4 py-3 font-semibold">Créé le</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Aucun code pour l'instant. Génère ton premier code ci-dessus.
                </td>
              </tr>
            ) : (
              codes.map((c) => (
                <tr key={c.code} className="border-b border-zinc-800/60 last:border-0">
                  <td className="px-4 py-3 font-mono text-zinc-200">{c.code}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        STATUS_STYLES[c.status] ?? "bg-zinc-700/40 text-zinc-400"
                      }`}
                    >
                      {STATUS_LABELS[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        TYPE_STYLES[c.type] ?? "bg-zinc-700/40 text-zinc-400"
                      }`}
                    >
                      {TYPE_LABELS[c.type] ?? c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">
                    {c.used_by_user_id ? `${c.used_by_user_id.slice(0, 8)}…` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{formatDate(c.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => copy(c.code)}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
                    >
                      {copied === c.code ? "Copié ✓" : "Copier"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
