"use client";

// Formulaire de génération de codes de déblocage de compte (Master). Appelle
// generateAccessCodesAction — le type est toujours 'lifetime' ou 'duration'
// côté serveur (jamais 'trial'/'broker', cf. actions.ts). Aucune limite
// métier de quantité ou de durée : uniquement des garde-fous techniques très
// larges (cf. lib/loyalty/master-validation.ts). Désactivé si groupe suspendu.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { generateAccessCodesAction } from "@/app/[locale]/master/actions";

export function AccessCodeGenerateForm({
  groupId,
  canWrite,
}: {
  groupId: string;
  canWrite: boolean;
}) {
  const t = useDict("master");
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [count, setCount] = useState("1");
  const [kind, setKind] = useState<"lifetime" | "duration">("lifetime");
  const [durationDays, setDurationDays] = useState("30");
  const [expires, setExpires] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await generateAccessCodesAction({
        locale,
        groupId,
        count,
        kind,
        durationDays: kind === "duration" ? durationDays : null,
        expiresAt: expires || null,
      });
      if (res.ok) {
        setMsg({ ok: true, text: t.unlock.generate.success.replace("{n}", String(res.created)) });
        router.refresh();
      } else {
        const map = t.unlock.generate.errors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? t.unlock.generate.errors.db });
      }
    });
  }

  const inputCls =
    "rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50";

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-1 text-lg font-bold">{t.unlock.generate.title}</h2>
      <p className="mb-5 text-sm text-zinc-400">{t.unlock.generate.hint}</p>

      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="unlock-count" className="mb-1.5 block text-xs font-medium text-zinc-400">
            {t.unlock.generate.count}
          </label>
          <input
            id="unlock-count"
            type="number"
            min={1}
            value={count}
            disabled={!canWrite || pending}
            onChange={(e) => setCount(e.target.value)}
            className={`${inputCls} w-24`}
          />
        </div>
        <div>
          <label htmlFor="unlock-kind" className="mb-1.5 block text-xs font-medium text-zinc-400">
            {t.unlock.generate.kindLabel}
          </label>
          <select
            id="unlock-kind"
            value={kind}
            disabled={!canWrite || pending}
            onChange={(e) => setKind(e.target.value as "lifetime" | "duration")}
            className={inputCls}
          >
            <option value="lifetime">{t.unlock.generate.kind.lifetime}</option>
            <option value="duration">{t.unlock.generate.kind.duration}</option>
          </select>
        </div>
        {kind === "duration" && (
          <div>
            <label htmlFor="unlock-duration" className="mb-1.5 block text-xs font-medium text-zinc-400">
              {t.unlock.generate.durationDays}
            </label>
            <input
              id="unlock-duration"
              type="number"
              min={1}
              value={durationDays}
              disabled={!canWrite || pending}
              onChange={(e) => setDurationDays(e.target.value)}
              className={`${inputCls} w-28`}
            />
          </div>
        )}
        <div>
          <label htmlFor="unlock-exp" className="mb-1.5 block text-xs font-medium text-zinc-400">
            {t.unlock.generate.expires}
          </label>
          <input
            id="unlock-exp"
            type="date"
            value={expires}
            disabled={!canWrite || pending}
            onChange={(e) => setExpires(e.target.value)}
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          disabled={!canWrite || pending}
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t.unlock.generate.submitting : t.unlock.generate.submit}
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
