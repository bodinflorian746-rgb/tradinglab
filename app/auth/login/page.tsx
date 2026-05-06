"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function frenchError(msg: string): string {
  if (msg.includes("Invalid login credentials"))
    return "Email ou mot de passe incorrect.";
  if (msg.includes("Email not confirmed"))
    return "Confirme ton email avant de te connecter.";
  if (msg.includes("Too many requests"))
    return "Trop de tentatives. Réessaie dans quelques minutes.";
  return msg;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(frenchError(error.message));
      setLoading(false);
    } else {
      router.push(from);
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">

        {/* En-tête */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
            Mon espace
          </p>
          <h1 className="text-2xl font-bold mb-1">Connexion</h1>
          <p className="text-zinc-400 text-sm">
            Accède à ton parcours d'apprentissage.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-zinc-400" htmlFor="password">
                Mot de passe
              </label>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400 shrink-0">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] text-zinc-950 font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/signup"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}
