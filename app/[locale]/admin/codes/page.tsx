// Page admin des codes d'accès. Réservée aux admins (liste ADMIN_EMAILS,
// fallback ADMIN_EMAIL). Tout visiteur non-admin reçoit un 404 (notFound) :
// la page n'existe pas pour lui, on ne révèle même pas son existence.
//
// Lecture des codes via service role (RLS verrouillé sur access_codes).

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { isAdmin } from "@/lib/auth/admin";
import { CodesAdmin, type AdminCode } from "./CodesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminCodesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;

  // ─── Guard admin ──────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    notFound();
  }

  // ─── Fetch codes (service role) ─────────────────────────────────────────────
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("access_codes")
    .select("code, status, type, used_by_user_id, used_at, created_at")
    .order("created_at", { ascending: false });

  const codes: AdminCode[] = error || !data ? [] : (data as AdminCode[]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
            Admin
          </p>
          <h1 className="text-3xl font-bold">Codes d'accès</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Connecté en tant que {user.email}.
          </p>
        </div>

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Erreur de lecture des codes : {error.message}
          </p>
        )}

        <CodesAdmin codes={codes} locale={locale} />
      </div>
    </main>
  );
}
