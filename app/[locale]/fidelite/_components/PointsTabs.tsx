"use client";

// Deux onglets pour l'espace membre d'UN groupe : "Gagner" (code PTS existant
// + liste des actions du barème + pseudo copiable — la clé qui permet à
// l'admin du groupe de retrouver le membre sur /master/[groupId]/membres) et
// "Dépenser" (le magasin existant, déplacé ici tel quel, logique d'achat
// inchangée). Rien ne part du site depuis cet onglet : aucun upload, aucun
// formulaire d'envoi, aucun bot Telegram — juste la consigne et le pseudo à
// coller dans le DM Telegram à l'admin.

import { useState } from "react";
import { useDict } from "@/app/components/LocaleProvider";
import { CopyButton } from "@/app/[locale]/master/_components/CopyButton";
import { ActivateForm } from "./ActivateForm";
import { MemberShop } from "./MemberShop";
import { CompletionBonusCard } from "./CompletionBonusCard";
import type { GroupPointRule, GroupShopItem } from "@/lib/loyalty/types";
import type { CompletionBonusStatus } from "@/lib/loyalty/member";

type Tab = "earn" | "spend";

export function PointsTabs({
  groupId,
  username,
  rules,
  rulesError,
  telegramLink,
  completionBonus,
  shopItems,
  shopBalance,
  shopLoadError,
  showActivateForm = false,
}: {
  groupId: string;
  username: string | null;
  rules: GroupPointRule[];
  rulesError?: string | null;
  telegramLink: string | null;
  completionBonus: CompletionBonusStatus | null;
  shopItems: GroupShopItem[];
  shopBalance: number;
  shopLoadError?: string | null;
  showActivateForm?: boolean;
}) {
  const t = useDict("fidelite");
  const [tab, setTab] = useState<Tab>("earn");

  // Segmented control : les deux options dans un même conteneur bordé,
  // largeur égale (flex-1), l'onglet actif nettement distingué (fond plein),
  // l'inactif visiblement cliquable (texte clair + hover, pas juste du gris
  // discret sur fond transparent — l'ancien style "bouton plein vs texte nu"
  // ne se lisait pas comme deux onglets d'un même contrôle).
  const tabCls = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
      active ? "bg-emerald-500 text-zinc-950" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
    }`;

  return (
    <div>
      <div role="tablist" className="mb-5 flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-1">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "earn"}
          onClick={() => setTab("earn")}
          className={tabCls(tab === "earn")}
        >
          {t.tabs.earn}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "spend"}
          onClick={() => setTab("spend")}
          className={tabCls(tab === "spend")}
        >
          {t.tabs.spend}
        </button>
      </div>

      {tab === "earn" ? (
        <div className="space-y-6">
          {showActivateForm && <ActivateForm />}

          {completionBonus && <CompletionBonusCard status={completionBonus} t={t.earn.completionBonus} />}

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-zinc-400">
              {t.earn.rulesTitle}
            </h3>
            <p className="mb-4 text-sm text-zinc-400">
              {t.earn.rulesHintBefore}
              {telegramLink ? (
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline decoration-emerald-400/40 underline-offset-2 hover:text-emerald-300"
                >
                  {t.earn.rulesHintTelegram}
                </a>
              ) : (
                t.earn.rulesHintTelegram
              )}
              {t.earn.rulesHintAfter}
            </p>

            {username && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {t.earn.pseudoLabel}
                  </p>
                  <p className="font-mono text-sm font-semibold text-emerald-400">{username}</p>
                </div>
                <CopyButton value={username} label={t.earn.copy} copiedLabel={t.earn.copied} />
              </div>
            )}

            {rules.length === 0 ? (
              <p
                className={`rounded-xl border px-4 py-3 text-sm ${
                  rulesError
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-zinc-800 bg-zinc-950/40 text-zinc-500"
                }`}
              >
                {rulesError ?? t.earn.rulesEmpty}
              </p>
            ) : (
              <ul className="space-y-2">
                {rules.map((rule) => (
                  <li
                    key={rule.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3"
                  >
                    <span className="text-sm text-zinc-200">{rule.label}</span>
                    <span className="text-sm font-semibold text-amber-400">+{rule.points}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">{t.shop.title}</h3>
          <MemberShop groupId={groupId} items={shopItems} balance={shopBalance} loadError={shopLoadError} />
        </div>
      )}
    </div>
  );
}
