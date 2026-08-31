-- ─── Correctif : barème par défaut absent sur les nouveaux groupes ───────────
--
-- Constat (recette Sprint 2) : create_group_with_admins (migration
-- 20260726090000) ne sème AUCUNE ligne group_point_rules. Seuls les groupes
-- qui existaient déjà au moment de la migration 20260828130000 ont reçu les
-- 3 actions système par défaut (via son backfill ponctuel, exécuté une seule
-- fois). Tout groupe créé depuis démarre avec un barème vide : aucun bouton
-- de crédit sur l'écran Membres, fonctionnalité inutilisable.
--
-- Deux correctifs, dans cette seule migration :
--   1. create_group_with_admins sème désormais les 3 actions système à la
--      création du groupe — même contenu que le backfill de 20260828130000
--      (Témoignage écrit 10, Témoignage vidéo 30, Parrainage 20,
--      is_system=true, sort_order 1/2/3).
--   2. Rattrapage identique à celui de 20260828130000, rejoué ici pour tout
--      groupe qui n'a toujours pas ces 3 slugs (couvre les groupes créés
--      entre les deux migrations). `on conflict (group_id, slug) do nothing`
--      rend l'opération idempotente : rejouable sans risque, y compris sur
--      un groupe qui a déjà (une partie de) son barème.
--
-- N'ALTÈRE AUCUNE TABLE, CONTRAINTE NI POLICY EXISTANTE. Seule la fonction
-- create_group_with_admins est redéfinie (CREATE OR REPLACE, signature
-- inchangée) ; le reste de son corps est repris à l'identique de
-- 20260726090000.

begin;

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
  -- écriture (atomicité "tout ou rien") — inchangé depuis 20260726090000.
  if p_admin_emails is not null then
    foreach v_email in array p_admin_emails loop
      v_norm := lower(trim(v_email));
      if v_norm = '' then
        continue;
      end if;
      if v_norm = any(v_seen) then
        continue;
      end if;
      v_seen := array_append(v_seen, v_norm);

      select id into v_uid from auth.users where lower(email) = v_norm limit 1;
      if v_uid is null then
        return query select 'email_not_found'::text, null::uuid, v_email;
        return;
      end if;
      v_uids := array_append(v_uids, v_uid);
    end loop;
  end if;

  -- 2. Écriture : le groupe, sa ligne partner_group_settings (reference_code),
  -- SON BARÈME PAR DÉFAUT (nouveau), puis une adhésion admin active par
  -- utilisateur résolu.
  insert into public.partner_groups (name, slug, created_by)
  values (p_name, p_slug, p_created_by)
  returning id into v_group_id;

  insert into public.partner_group_settings (group_id, reference_code)
  values (v_group_id, public.generate_group_reference_code());

  -- NOUVEAU : mêmes 3 actions système que le backfill de 20260828130000,
  -- pour que le barème ne soit jamais vide à la création d'un groupe.
  insert into public.group_point_rules (group_id, slug, label, points, is_system, sort_order)
  values
    (v_group_id, 'testimonial_written', 'Témoignage écrit', 10, true, 1),
    (v_group_id, 'testimonial_video',   'Témoignage vidéo', 30, true, 2),
    (v_group_id, 'referral',            'Parrainage',       20, true, 3)
  on conflict (group_id, slug) do nothing;

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

-- Rattrapage : tout groupe (créé avant OU après 20260828130000) auquel il
-- manque une ou plusieurs des 3 actions système reçoit celles qui manquent.
-- Identique dans son principe au backfill de 20260828130000 ; rejouable sans
-- risque (on conflict do nothing).
insert into public.group_point_rules (group_id, slug, label, points, is_system, sort_order)
select pg.id, r.slug, r.label, r.points, true, r.sort_order
from public.partner_groups pg
cross join (values
  ('testimonial_written', 'Témoignage écrit', 10, 1),
  ('testimonial_video',   'Témoignage vidéo', 30, 2),
  ('referral',            'Parrainage',       20, 3)
) as r(slug, label, points, sort_order)
on conflict (group_id, slug) do nothing;

commit;
