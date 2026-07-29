-- ─── Extension : création de groupe + attribution d'admin par e-mail ─────────
--
-- N'AJOUTE QUE deux fonctions SECURITY DEFINER nouvelles. Ne modifie, ne
-- supprime et ne réécrit AUCUNE table, contrainte, policy ou donnée
-- existante. N'effectue AUCUNE opération structurelle sur partner_groups
-- (INSERT de nouvelles lignes uniquement, jamais ALTER/UPDATE/index/FK).
-- create_group_with_admins écrit aussi une ligne partner_group_settings
-- (reference_code, cf. 20260724120000) pour chaque groupe créé.
--
-- 1. get_user_id_by_email(email) — résout un compte TradeScaleX existant par
--    son adresse e-mail. Nécessaire car l'API admin GoTrue ne propose pas de
--    lookup par e-mail ; même pattern déjà établi dans ce repo pour accéder à
--    auth.users (cf. reset_email_confirmation, set_email_confirmed_at_now).
-- 2. create_group_with_admins(name, slug, admin_emails[], created_by) — crée
--    un groupe, avec ou SANS administrateur. Si admin_emails est fourni et
--    non vide, tous les e-mails sont normalisés, dédoublonnés et résolus en
--    comptes existants AVANT la moindre écriture : si UN SEUL e-mail non vide
--    ne correspond à aucun compte, RIEN n'est créé (ni le groupe, ni aucune
--    adhésion). Un Super Admin peut donc créer un groupe vide et rattacher
--    des administrateurs plus tard via une autre action.
--
-- Sécurité : SECURITY DEFINER, search_path vide, exécution réservée au
-- service_role (jamais authenticated/anon) — mêmes garanties que les autres
-- RPC sensibles de ce fichier de migrations.
--
-- TRANSACTION : BEGIN/COMMIT explicites — voir la même remarque en tête de
-- 20260724120000_group_reference_code_and_shop.sql.

begin;

create or replace function public.get_user_id_by_email(p_email text)
returns uuid
language sql
security definer
set search_path = ''
stable
as $$
  select id from auth.users where lower(email) = lower(trim(p_email)) limit 1;
$$;

revoke all on function public.get_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.get_user_id_by_email(text) to service_role;

-- p_admin_emails accepte NULL, un tableau vide, ou un tableau avec un ou
-- plusieurs e-mails. NULL et vide ont exactement le même effet : le groupe
-- est créé sans aucune adhésion admin (le Super Admin en attribue plus tard
-- via addGroupAdminByEmailAction, cf. app/[locale]/admin/loyalty/actions.ts).
create or replace function public.create_group_with_admins(
  p_name text, p_slug text, p_admin_emails text[], p_created_by uuid
)
returns table (result text, result_group_id uuid, result_missing_email text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group_id uuid;
  v_email    text;
  v_norm     text;
  v_uid      uuid;
  v_uids     uuid[] := '{}';
  v_seen     text[] := '{}';
begin
  -- 1. Normalise, dédoublonne et résout TOUS les e-mails AVANT toute
  -- écriture (atomicité "tout ou rien"). Une liste NULL ou vide (y compris
  -- ne contenant que des chaînes vides une fois nettoyées) saute directement
  -- à l'étape 2 avec v_uids toujours vide : le groupe est créé sans admin.
  if p_admin_emails is not null then
    foreach v_email in array p_admin_emails loop
      v_norm := lower(trim(v_email));
      if v_norm = '' then
        continue; -- ligne vide tolérée, ignorée
      end if;
      if v_norm = any(v_seen) then
        continue; -- doublon déjà résolu (même e-mail fourni plusieurs fois), ignoré
      end if;
      v_seen := array_append(v_seen, v_norm);

      select id into v_uid from auth.users where lower(email) = v_norm limit 1;
      if v_uid is null then
        -- Un seul e-mail non résolu → aucune écriture, ni groupe ni adhésion.
        return query select 'email_not_found'::text, null::uuid, v_email;
        return;
      end if;
      v_uids := array_append(v_uids, v_uid);
    end loop;
  end if;

  -- 2. Écriture : le groupe (toujours), sa ligne partner_group_settings
  -- (reference_code — cf. 20260724120000, plus une colonne de
  -- partner_groups), puis une adhésion admin active par utilisateur résolu
  -- (aucune si v_uids est vide — un groupe sans admin est un état valide).
  -- role toujours 'admin' ici — c'est exactement l'objet de cette RPC.
  insert into public.partner_groups (name, slug, created_by)
  values (p_name, p_slug, p_created_by)
  returning id into v_group_id;

  insert into public.partner_group_settings (group_id, reference_code)
  values (v_group_id, public.generate_group_reference_code());

  foreach v_uid in array v_uids loop
    insert into public.group_memberships (group_id, user_id, role, status)
    values (v_group_id, v_uid, 'admin', 'active')
    on conflict (group_id, user_id) do update set role = 'admin', status = 'active';
  end loop;

  return query select 'ok'::text, v_group_id, null::text;
end;
$$;

revoke all on function public.create_group_with_admins(text, text, text[], uuid) from public, anon, authenticated;
grant execute on function public.create_group_with_admins(text, text, text[], uuid) to service_role;

commit;
