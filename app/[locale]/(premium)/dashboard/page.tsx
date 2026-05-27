import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/[locale]/auth/actions";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest mb-2">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold mb-6">Bienvenue</h1>

          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-5 mb-6">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
              Connecté en tant que
            </p>
            <p className="text-base font-semibold text-white break-all">{user.email}</p>
          </div>

          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Se déconnecter
            </button>
          </form>

          <p className="text-sm text-zinc-500 mt-6 text-center">
            <Link
              href={`/${locale}`}
              className="hover:text-zinc-300 underline underline-offset-4"
            >
              Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
