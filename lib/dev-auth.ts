// ─── Bypass d'authentification LOCAL (développement uniquement) ──────────────
//
// Permet, EN LOCAL SEULEMENT, d'accéder à toute l'interface sans se connecter :
// l'utilisateur est considéré comme un admin connecté et premium, pour tester
// /admin, /master, les pages premium, etc.
//
// ⚠️ DOUBLE VERROU — actif si et seulement si :
//     process.env.NODE_ENV === "development"   (posé UNIQUEMENT par `next dev`)
//   ET process.env.DEV_AUTH_BYPASS === "true"  (flag explicite)
//
// En production c'est STRICTEMENT IMPOSSIBLE : `next build` / `next start` et
// les plateformes (Vercel…) forcent NODE_ENV="production", donc la première
// condition est toujours fausse — même si DEV_AUTH_BYPASS était défini par
// erreur côté serveur. Server-only : jamais évalué ni exposé côté client
// (DEV_AUTH_BYPASS n'est pas préfixé NEXT_PUBLIC_).

import "server-only";
import type { User } from "@supabase/supabase-js";

/** true seulement en dev local avec le flag explicite. Sinon auth normale. */
export function isDevAuthBypass(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_AUTH_BYPASS === "true"
  );
}

/**
 * Utilisateur de développement mocké.
 *
 * L'id DOIT référencer une ligne RÉELLE de `auth.users` : plusieurs écritures
 * (ex. group_memberships.user_id, points_ledger.user_id) sont `NOT NULL` avec
 * une FK vers auth.users — un UUID purement fictif ferait échouer toute
 * activation de code ou action similaire en mode bypass (violation de FK).
 *
 * On réutilise donc un compte de test existant, déjà utilisé comme membre
 * dans le jeu de données de démo (supabase/demo/loyalty_demo_data.sql,
 * "Groupe A membre 1"), plutôt qu'inventer un UUID ou utiliser un compte réel
 * de production. Le champ `email` reste un email cosmétique de dev (aucune
 * logique ne dépend de sa valeur : isAdmin/isGroupAdmin sont court-circuités
 * par isDevAuthBypass() indépendamment de l'email).
 */
export const DEV_USER: User = {
  id: "072e57c1-540c-4a0e-8097-d4925d522b8a",
  aud: "authenticated",
  role: "authenticated",
  email: "dev@localhost",
  app_metadata: { provider: "dev", providers: ["dev"] },
  user_metadata: { dev_bypass: true },
  created_at: "2020-01-01T00:00:00.000Z",
} as User;
