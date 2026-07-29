"use client";

// Formulaire de rattachement à un groupe via son code de référence (Membre).
// Appelle la Server Action joinGroupByReferenceCodeAction → RPC atomique et
// idempotente (join_group_by_reference_code). Toujours rôle "member".

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { joinGroupByReferenceCodeAction } from "@/app/[locale]/fidelite/actions";

export function JoinGroupForm() {
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
      const res = await joinGroupByReferenceCodeAction({ locale, code });
      if (res.ok) {
        setMsg({ ok: true, text: t.join.success.replace("{name}", res.groupName) });
        setCode("");
        router.refresh();
      } else {
        const map = t.join.errors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? t.join.errors.db });
      }
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-1 text-lg font-bold">{t.join.title}</h2>
      <p className="mb-5 text-sm text-zinc-400">{t.join.hint}</p>

      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.join.placeholder}
            disabled={pending}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 font-mono text-sm uppercase tracking-wider focus:border-emerald-500 focus:outline-none disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={pending || !code.trim()}
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t.join.submitting : t.join.submit}
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
