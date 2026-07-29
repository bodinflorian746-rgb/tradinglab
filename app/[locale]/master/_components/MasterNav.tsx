"use client";

// Sous-navigation d'un groupe (Master). Liens vers tableau de bord / codes /
// membres / opérations, avec surlignage de la section active.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";

export function MasterNav({ groupId }: { groupId: string }) {
  const t = useDict("master");
  const locale = useLocale();
  const pathname = usePathname() ?? "";
  const base = `/master/${groupId}`;

  const items: { href: string; label: string; exact?: boolean }[] = [
    { href: base, label: t.nav.dashboard, exact: true },
    { href: `${base}/codes`, label: t.nav.codes },
    { href: `${base}/deblocage`, label: t.nav.unlock },
    { href: `${base}/magasin`, label: t.nav.shop },
    { href: `${base}/membres`, label: t.nav.members },
    { href: `${base}/operations`, label: t.nav.operations },
  ];

  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
      {items.map((it) => {
        const full = localizedHref(it.href, locale);
        const active = it.exact ? pathname === full : pathname.startsWith(full);
        return (
          <Link
            key={it.href}
            href={full}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-emerald-500/15 text-emerald-400"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
