"use client";

// Formulaire d'activation d'un code de points (Membre). Appelle la Server
// Action activatePointsCodeAction → RPC atomique (consommation + auto-join +
// crédit). Affiche le message localisé correspondant au résultat.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { activatePointsCodeAction } from "@/app/[locale]/fidelite/actions";

export function ActivateForm() {
  const t = useDict("fidelite");
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await activatePointsCodeAction({ locale, code });
      if (res.ok) {
        setMsg({ ok: true, text: t.activate.success.replace("{n}", String(res.creditedPoints)) });
        setCode("");
        router.refresh();
      } else {
        const map = t.activate.errors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? t.activate.errors.db });
      }
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-1 text-lg font-bold">{t.activate.title}</h2>
      <p className="mb-5 text-sm text-zinc-400">{t.activate.hint}</p>

      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.activate.placeholder}
            disabled={pending}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 font-mono text-sm uppercase tracking-wider focus:border-emerald-500 focus:outline-none disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={pending || !code.trim()}
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t.activate.submitting : t.activate.submit}
        </button>
      </form>

      {msg && (
        <p className={`mt-4 text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`} role="status">
          {msg.text}
        </p>
      )}
    </section>
  );
}
