-- ─── Helpers SECURITY DEFINER pour positionner auth.users.email_confirmed_at ─
--
-- POURQUOI : l'API admin GoTrue (updateUserById) ne permet pas de modifier
-- librement email_confirmed_at — email_confirm:true ne fait rien si la valeur
-- est déjà set, et il n'y a aucun moyen documenté de la remettre à null/passé.
-- Pour piloter le trial 48h (qui se base sur email_confirmed_at + 48h via
-- lib/auth/premium.ts) sans casser le login (signInWithPassword refuse les users
-- avec email_confirmed_at = null), on a besoin de :
--
--   1) set_email_confirmed_at_far_past(uid) — backdate à 1970-01-01 au signup :
--      • signInWithPassword fonctionne (champ non-null)
--      • premium.ts considère le trial expiré (paywall affiché)
--   2) set_email_confirmed_at_now(uid) — force = now() à l'activation du code :
--      • démarre le trial 48h via premium.ts
--      • force la mise à jour même si la valeur était déjà set (au backdate)
--
-- confirmed_at est une colonne GÉNÉRÉE par PostgreSQL
-- (least(email_confirmed_at, phone_confirmed_at)) — pas besoin de la toucher.
--
-- Sécurité : SECURITY DEFINER (s'exécute avec les droits du propriétaire, qui
-- peut écrire auth.users), search_path vide, exécution réservée au service_role.

create or replace function public.set_email_confirmed_at_far_past(uid uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update auth.users
     set email_confirmed_at = '1970-01-01T00:00:00Z'::timestamptz
   where id = uid;
$$;

revoke all on function public.set_email_confirmed_at_far_past(uuid) from public, anon, authenticated;
grant execute on function public.set_email_confirmed_at_far_past(uuid) to service_role;


create or replace function public.set_email_confirmed_at_now(uid uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update auth.users
     set email_confirmed_at = now()
   where id = uid;
$$;

revoke all on function public.set_email_confirmed_at_now(uuid) from public, anon, authenticated;
grant execute on function public.set_email_confirmed_at_now(uuid) to service_role;
