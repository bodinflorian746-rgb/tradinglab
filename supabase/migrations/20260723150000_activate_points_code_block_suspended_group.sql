-- ─── Règle métier : un groupe suspendu bloque TOUT accès membre ──────────────
--
-- Durcissement de activate_points_code (20260723120000) : un groupe suspendu
-- n'est plus accessible à AUCUN membre, y compris les membres déjà présents.
-- Auparavant, seules les écritures Master (génération/révocation, via
-- authorizeGroupWrite côté application) étaient bloquées pour un groupe
-- suspendu ; l'activation de code, elle, passait encore.
--
-- Nouveau comportement : si `partner_groups.status <> 'active'`, l'activation
-- est refusée (résultat explicite 'group_suspended'), AUCUNE écriture n'a
-- lieu : le code n'est pas consommé, aucun auto-join, aucun crédit ledger.
-- Ce contrôle est placé juste après la résolution du code (not_found) et
-- AVANT les vérifications already_used/expired : l'accès au groupe est le
-- verrou le plus fondamental, il prime sur l'état particulier du code.
--
-- CREATE OR REPLACE sur la même signature (text, uuid) : les GRANT/REVOKE
-- existants sont conservés, mais réaffirmés ci-dessous par prudence (même
-- convention que la migration d'origine).

create or replace function public.activate_points_code(p_code text, p_user_id uuid)
returns table (result text, credited_points integer, result_group_id uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code         public.points_codes%rowtype;
  v_group_status text;
  v_now          timestamptz := now();
begin
  select * into v_code from public.points_codes where code = p_code for update;

  if v_code.code is null then
    return query select 'not_found'::text, null::integer, null::uuid;
    return;
  end if;

  -- Verrou de groupe : un groupe suspendu bloque tout accès, quel que soit le
  -- statut du code (available / used / revoked / expired).
  select status into v_group_status from public.partner_groups where id = v_code.group_id;
  if v_group_status is distinct from 'active' then
    return query select 'group_suspended'::text, null::integer, v_code.group_id;
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
