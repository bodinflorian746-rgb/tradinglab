"use client";

// Sous-navigation d'un groupe (Master). Deux liens directs (Tableau de bord,
// Membres — ce dernier inclut désormais la recherche ET le crédit de points,
// cf. membres/page.tsx) + deux menus déroulants (Boutique, Configuration) qui
// regroupent les écrans plus rarement consultés. Avant cette refonte, le nav
// exposait 7 entrées de premier niveau à plat ; la fusion Membres/Créditer et
// le regroupement Boutique/Configuration ramènent ça à 4 points d'entrée.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";

type NavLeaf = { href: string; label: string };

function useIsActive() {
  const locale = useLocale();
  const pathname = usePathname() ?? "";
  return (href: string, exact?: boolean) => {
    const full = localizedHref(href, locale);
    return exact ? pathname === full : pathname.startsWith(full);
  };
}

function DirectLink({ href, label, exact }: { href: string; label: string; exact?: boolean }) {
  const locale = useLocale();
  const isActive = useIsActive();
  const active = isActive(href, exact);
  return (
    <Link
      href={localizedHref(href, locale)}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-emerald-500/15 text-emerald-400" : "text-zinc-400 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function NavGroup({ label, items }: { label: string; items: NavLeaf[] }) {
  const locale = useLocale();
  const isActive = useIsActive();
  const groupActive = items.some((it) => isActive(it.href));
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          groupActive ? "bg-emerald-500/15 text-emerald-400" : "text-zinc-400 hover:text-white"
        }`}
      >
        {label}
        <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 min-w-[200px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 py-1 shadow-lg shadow-black/40">
          {items.map((it) => {
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={localizedHref(it.href, locale)}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm transition-colors ${
                  active ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MasterNav({ groupId }: { groupId: string }) {
  const t = useDict("master");
  const base = `/master/${groupId}`;

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-1 border-b border-zinc-800 pb-3">
      <DirectLink href={base} label={t.nav.dashboard} exact />
      <DirectLink href={`${base}/membres`} label={t.nav.members} />
      <NavGroup
        label={t.nav.shopSection}
        items={[
          { href: `${base}/magasin`, label: t.nav.shop },
          { href: `${base}/commandes`, label: t.nav.orders },
        ]}
      />
      <NavGroup
        label={t.nav.configSection}
        items={[
          { href: `${base}/bareme`, label: t.nav.bareme },
          { href: `${base}/codes`, label: t.nav.codes },
          { href: `${base}/deblocage`, label: t.nav.unlock },
          { href: `${base}/operations`, label: t.nav.operations },
        ]}
      />
    </nav>
  );
}
