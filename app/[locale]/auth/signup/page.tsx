"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";

function frenchError(msg: string): string {
  if (msg.includes("User already registered"))
    return "Un compte existe déjà avec cet email.";
  if (msg.includes("Password should be at least"))
    return "Le mot de passe doit contenir au moins 6 caractères.";
  if (msg.includes("Invalid email"))
    return "L'adresse email n'est pas valide.";
  if (msg.includes("Too many requests"))
    return "Trop de tentatives. Réessaie dans quelques minutes.";
  return msg;
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const locale = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(frenchError(error.message));
      setLoading(false);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-emerald-400">
              <path d="M3 10l4.5 4.5 9.5-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Vérifie ta boîte mail</h1>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Un lien de confirmation a été envoyé à{" "}
            <span className="text-white">{email}</span>. Clique dessus pour
            activer ton compte.
          </p>
          <Link
            href={localizedHref("/auth/login", locale)}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">

        {/* En-tête */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
            Mon espace
          </p>
          <h1 className="text-2xl font-bold mb-1">Créer un compte</h1>
          <p className="text-zinc-400 text-sm">
            Gratuit · Aucune carte requise · Accès immédiat.
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
            <label className="text-sm text-zinc-400 block mb-1.5" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
              placeholder="6 caractères minimum"
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
            {loading ? "Création…" : "Créer mon compte"}
          </button>

          <p className="text-center text-xs text-zinc-600 leading-relaxed">
            En créant un compte, tu acceptes nos conditions d'utilisation.
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          Déjà un compte ?{" "}
          <Link
            href={localizedHref("/auth/login", locale)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
