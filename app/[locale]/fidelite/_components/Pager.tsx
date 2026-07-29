"use client";

// Pagination client de l'historique (Membre) — ne mute que la query param
// "hpage" de l'URL. Le rendu des données reste côté serveur.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDict } from "@/app/components/LocaleProvider";

export function Pager({ page, totalPages }: { page: number; totalPages: number }) {
  const t = useDict("fidelite");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (totalPages <= 1) return null;

  function go(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("hpage", String(next));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      <button
        type="button"
        onClick={() => go(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition-colors hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.pager.prev}
      </button>
      <span className="text-zinc-500">
        {t.pager.page.replace("{p}", String(page)).replace("{t}", String(totalPages))}
      </span>
      <button
        type="button"
        onClick={() => go(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition-colors hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.pager.next}
      </button>
    </div>
  );
}
