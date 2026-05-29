-- ─── public.reset_email_confirmation(uid) ───────────────────────────────────
-- Remet email_confirmed_at à NULL pour un user donné.
--
-- POURQUOI : le parcours d'inscription utilise supabase.auth.signUp() (méthode
-- publique) car, avec "Confirm email" OFF, elle auto-confirme l'email ET ouvre
-- la session immédiatement. Mais auto-confirmer pose email_confirmed_at = now(),
-- ce qui déclencherait le trial 48h dès l'inscription (lib/auth/premium.ts).
-- On veut que le trial ne démarre qu'à l'ACTIVATION du code. On remet donc
-- email_confirmed_at à null juste après le signUp. La session déjà émise (JWT)
-- reste valide : l'utilisateur peut atteindre /activer-code.
--
-- L'API admin de GoTrue ne permet PAS de remettre email_confirmed_at à null
-- (le champ n'est pas modifiable via updateUserById). D'où cette fonction
-- SECURITY DEFINER qui écrit directement dans auth.users.
--
-- confirmed_at est une colonne GÉNÉRÉE (least(email_confirmed_at,
-- phone_confirmed_at)) : la mettre à null se fait automatiquement, ne PAS la
-- toucher.
--
-- Sécurité : SECURITY DEFINER (s'exécute avec les droits du propriétaire, qui
-- peut écrire auth.users), search_path vide, exécution réservée au service_role.

create or replace function public.reset_email_confirmation(uid uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update auth.users set email_confirmed_at = null where id = uid;
$$;

revoke all on function public.reset_email_confirmation(uuid) from public, anon, authenticated;
grant execute on function public.reset_email_confirmation(uuid) to service_role;
