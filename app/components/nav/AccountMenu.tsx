"use client";

// Menu compte — regroupe tous les liens liés au compte (Mon profil, Mon
// compte, Mes accès, Mes points) + les entrées à privilège (Admin — espace
// group admin, Administration) derrière un point d'entrée unique (avatar /
// e-mail), conformément à la navigation "premium minimaliste".
//
// Deux exports :
//   • AccountLinks — la liste pure des items (aucun positionnement). Utilisée
//     à la fois dans le dropdown desktop (AccountMenu) et inline dans le
//     panneau mobile de la Navbar — une seule source de vérité, pas de liens
//     dupliqués entre les deux rendus.
//   • AccountMenu  — déclencheur (avatar + e-mail tronqué) + panneau flottant
//     desktop, avec fermeture au clic extérieur / Échap.
//
// Déconnexion : le bouton appelle `onSignOut` (Server Action pilotée par un
// useTransition dans la Navbar), jamais un <form> HTML classique — un <form>
// à l'intérieur d'un panneau démonté au clic interromprait l'action en vol
// (cf. Navbar.tsx pour le détail de ce piège déjà rencontré côté mobile).

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDict } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/i18n/config";

function shortEmail(email: string | undefined): string {
  if (!email) return "";
  if (email.length <= 22) return email;
  const local = email.split("@")[0] ?? "";
  return `${local}@…`;
}

const itemCls =
  "block rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white";

export function AccountLinks({
  locale,
  isAdmin,
  isGroupAdmin,
  onNavigate,
  onSignOut,
  signingOut,
}: {
  locale: Locale;
  isAdmin: boolean;
  isGroupAdmin: boolean;
  onNavigate?: () => void;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  const t = useDict("nav");

  return (
    <div className="flex flex-col gap-0.5">
      <Link href={localizedHref("/profil-trader", locale)} onClick={onNavigate} className={itemCls}>
        {t.links.profile}
      </Link>
      <Link href={localizedHref("/compte", locale)} onClick={onNavigate} className={itemCls}>
        {t.account}
      </Link>
      <Link href={localizedHref("/pricing", locale)} onClick={onNavigate} className={itemCls}>
        {t.links.pricing}
      </Link>
      <Link href={localizedHref("/fidelite", locale)} onClick={onNavigate} className={itemCls}>
        {t.links.fidelite}
      </Link>

      {(isAdmin || isGroupAdmin) && (
        <>
          <div className="my-1 border-t border-zinc-800" />
          <Link
            href={localizedHref(isAdmin ? "/admin/loyalty" : "/master", locale)}
            onClick={onNavigate}
            className={itemCls}
          >
            {t.masterArea}
          </Link>
        </>
      )}

      <div className="my-1 border-t border-zinc-800" />
      <button
        type="button"
        onClick={onSignOut}
        disabled={signingOut}
        className="rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-60"
      >
        {t.signOut}
      </button>
    </div>
  );
}

export function AccountMenu({
  locale,
  email,
  isAdmin,
  isGroupAdmin,
  onSignOut,
  signingOut,
}: {
  locale: Locale;
  email: string | undefined;
  isAdmin: boolean;
  isGroupAdmin: boolean;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  const t = useDict("nav");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = (email?.trim()?.[0] ?? "?").toUpperCase();

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

  // Le panneau se ferme après déconnexion (démontage naturel une fois
  // `user` devenu null au re-render suivant) — pas besoin de le fermer ici.
  function handleSignOut() {
    setOpen(false);
    onSignOut();
  }

  return (
    <div ref={rootRef} className="relative hidden md:block">
      <button
        type="button"
        data-testid="nav-account-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.account} — ${email ?? ""}`}
        className="inline-flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-zinc-900"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-xs font-bold text-emerald-400">
          {initial}
        </span>
        <span className="max-w-[140px] truncate text-sm font-medium text-zinc-300" title={email}>
          {shortEmail(email)}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`shrink-0 text-zinc-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t.account}
          className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-xl shadow-black/40"
        >
          <AccountLinks
            locale={locale}
            isAdmin={isAdmin}
            isGroupAdmin={isGroupAdmin}
            onNavigate={() => setOpen(false)}
            onSignOut={handleSignOut}
            signingOut={signingOut}
          />
        </div>
      )}
    </div>
  );
}
