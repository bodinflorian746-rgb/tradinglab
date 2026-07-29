"use client";

// Formulaire de génération de codes (Master). Appelle la Server Action
// generatePointsCodesAction (service_role + gardes serveur). Désactivé si le
// groupe est suspendu (canWrite=false) — l'action re-vérifie de toute façon.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { generatePointsCodesAction } from "@/app/[locale]/master/actions";
import { CODE_COUNT_MAX, POINTS_VALUE_MAX } from "@/lib/loyalty/master-validation";

export function GenerateForm({
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
  const [value, setValue] = useState("10");
  const [expires, setExpires] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await generatePointsCodesAction({
        locale,
        groupId,
        count,
        pointsValue: value,
        expiresAt: expires || null,
      });
      if (res.ok) {
        setMsg({ ok: true, text: t.generate.success.replace("{n}", String(res.created)) });
        router.refresh();
      } else {
        const map = t.generate.errors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? t.generate.errors.db });
      }
    });
  }

  const inputCls =
    "rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50";

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-1 text-lg font-bold">{t.generate.title}</h2>
      <p className="mb-5 text-sm text-zinc-400">{t.generate.hint}</p>

      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="gen-count" className="mb-1.5 block text-xs font-medium text-zinc-400">
            {t.generate.count}
          </label>
          <input
            id="gen-count"
            type="number"
            min={1}
            max={CODE_COUNT_MAX}
            value={count}
            disabled={!canWrite || pending}
            onChange={(e) => setCount(e.target.value)}
            className={`${inputCls} w-24`}
          />
        </div>
        <div>
          <label htmlFor="gen-value" className="mb-1.5 block text-xs font-medium text-zinc-400">
            {t.generate.value}
          </label>
          <input
            id="gen-value"
            type="number"
            min={1}
            max={POINTS_VALUE_MAX}
            value={value}
            disabled={!canWrite || pending}
            onChange={(e) => setValue(e.target.value)}
            className={`${inputCls} w-28`}
          />
        </div>
        <div>
          <label htmlFor="gen-exp" className="mb-1.5 block text-xs font-medium text-zinc-400">
            {t.generate.expires}
          </label>
          <input
            id="gen-exp"
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
          {pending ? t.generate.submitting : t.generate.submit}
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
