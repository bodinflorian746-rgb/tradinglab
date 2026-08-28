-- ─── RPC d'activation d'un code de points (Phase 4 — espace Membre) ──────────
--
-- Rend ATOMIQUE {consommer le code + auto-join du groupe + créditer le ledger}
-- en une seule transaction Postgres. Nécessaire car un membre qui active un
-- code doit :
--   1. consommer le code (available → used) ;
--   2. rejoindre automatiquement le groupe si ce n'est pas déjà fait
--      (group_memberships, role='member', status='active') ;
--   3. créditer le registre (points_ledger, kind='code_reward').
-- Sans transaction, un échec partiel pourrait consommer un code sans créditer
-- de points — inacceptable pour une opération de points.
--
-- Convention de sécurité : SECURITY DEFINER + search_path vide (comme
-- set_email_confirmed_at_now dans 20260530120000_email_confirmed_at_helpers.sql),
-- p_user_id passé explicitement (pas auth.uid()) car la fonction est appelée
-- depuis une Server Action en service_role (qui a déjà vérifié la session via
-- supabase.auth.getUser()) — pas directement depuis le client. Exécution
-- réservée au service_role, révoquée pour public/anon/authenticated.
--
-- Verrouillage : `select ... for update` sur la ligne du code avant toute
-- vérification/écriture → élimine toute course (double activation concurrente
-- du même code impossible, la seconde transaction attend puis constate
-- status <> 'available').

create or replace function public.activate_points_code(p_code text, p_user_id uuid)
returns table (result text, credited_points integer, result_group_id uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code public.points_codes%rowtype;
  v_now  timestamptz := now();
begin
  select * into v_code from public.points_codes where code = p_code for update;

  if v_code.code is null then
    return query select 'not_found'::text, null::integer, null::uuid;
    return;
  end if;

  if v_code.status <> 'available' then
    return query select 'already_used'::text, null::integer, v_code.group_id;
    return;
  end if;

  if v_code.expires_at is not null and v_code.expires_at < v_now then
    -- Expiration paresseuse : on fige le statut au premier constat.
    update public.points_codes set status = 'expired' where code = p_code;
    return query select 'expired'::text, null::integer, v_code.group_id;
    return;
  end if;

  -- Consommation (la ligne est verrouillée depuis le SELECT FOR UPDATE ci-dessus :
  -- aucune concurrence possible ici, le WHERE status='available' est une
  -- ceinture de sécurité défensive).
  update public.points_codes
     set status = 'used', used_by_user_id = p_user_id, used_at = v_now
   where code = p_code and status = 'available';

  -- Auto-join : le membre rejoint le groupe s'il n'y appartient pas déjà.
  -- Ne rétrograde ni ne modifie une adhésion existante (admin conservé admin).
  insert into public.group_memberships (group_id, user_id, role, status)
  values (v_code.group_id, p_user_id, 'member', 'active')
  on conflict (group_id, user_id) do nothing;

  -- Crédit du registre — source de vérité, jamais un solde stocké.
  insert into public.points_ledger (group_id, user_id, kind, amount, points_code, reason, created_by)
  values (v_code.group_id, p_user_id, 'code_reward', v_code.points_value, p_code, 'Activation de code', p_user_id);

  return query select 'ok'::text, v_code.points_value, v_code.group_id;
end;
$$;

revoke all on function public.activate_points_code(text, uuid) from public, anon, authenticated;
grant execute on function public.activate_points_code(text, uuid) to service_role;
