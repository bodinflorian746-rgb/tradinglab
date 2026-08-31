-- ─── Correctif : les 3 actions système démarrent INACTIVES ───────────────────
--
-- Jusqu'ici (20260828130000 et 20260901090000), les 3 actions système
-- (Témoignage écrit, Témoignage vidéo, Parrainage) étaient semées avec
-- is_active = true : elles apparaissaient immédiatement dans l'onglet
-- "Gagner" d'un membre et parmi les boutons de crédit de l'écran Membres,
-- sans qu'aucun admin de groupe n'ait rien décidé. Un admin doit d'abord
-- activer lui-même les actions qu'il souhaite proposer, depuis l'écran
-- Barème — comportement déjà correct côté lecture (cf. [2] ci-dessous),
-- seule la valeur SEMÉE était fausse.
--
-- Trois correctifs, dans cette seule migration :
--   1. create_group_with_admins sème désormais les 3 actions système avec
--      is_active = false (au lieu de true).
--   2. Rattrapage identique à celui de 20260901090000 (mêmes 3 slugs,
--      `on conflict (group_id, slug) do nothing`), pour tout groupe qui
--      n'a toujours aucune de ces règles — ré-écrit ici avec
--      is_active = false, au cas où cette migration serait appliquée sans
--      que 20260901090000 l'ait été.
--   3. NOUVEAU — repasse à is_active = false les règles is_system = true
--      DÉJÀ semées (par 20260828130000 ou 20260901090000) avec
--      is_active = true, à UNE EXCEPTION PRÈS : une règle déjà référencée
--      par au moins une ligne points_ledger.rule_slug (donc déjà utilisée
--      pour créditer un membre) n'est JAMAIS touchée — la désactiver
--      rétroactivement ferait disparaître une action qu'un membre a déjà
--      vue fonctionner, sans bénéfice. Ne touche jamais une règle
--      is_system = false (créées librement par un admin de groupe).
--
-- [2] VÉRIFICATION CODE (aucune modification nécessaire, déjà correct) :
--   • lib/loyalty/member.ts#listActiveGroupPointRules (onglet "Gagner" de
--     /fidelite) : .eq("is_active", true) — confirmé.
--   • app/[locale]/master/[groupId]/membres/page.tsx#listActiveRules
--     (boutons de crédit de l'écran Membres) : .eq("is_active", true) —
--     confirmé.
--   • lib/loyalty/master.ts#listGroupPointRules (écran Barème admin) :
--     AUCUN filtre is_active — volontaire, c'est l'écran où l'admin voit
--     et active ses règles inactives. Confirmé, comportement attendu.
--
-- N'ALTÈRE AUCUNE TABLE, CONTRAINTE NI POLICY EXISTANTE. Seule la fonction
-- create_group_with_admins est redéfinie (CREATE OR REPLACE, signature
-- inchangée).

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
  -- SON BARÈME PAR DÉFAUT (inactif — nouveau ici), puis une adhésion admin
  -- active par utilisateur résolu.
  insert into public.partner_groups (name, slug, created_by)
  values (p_name, p_slug, p_created_by)
  returning id into v_group_id;

  insert into public.partner_group_settings (group_id, reference_code)
  values (v_group_id, public.generate_group_reference_code());

  -- CHANGÉ : is_active = false (au lieu de true dans 20260901090000) — un
  -- admin doit activer lui-même les actions qu'il souhaite proposer.
  insert into public.group_point_rules (group_id, slug, label, points, is_active, is_system, sort_order)
  values
    (v_group_id, 'testimonial_written', 'Témoignage écrit', 10, false, true, 1),
    (v_group_id, 'testimonial_video',   'Témoignage vidéo', 30, false, true, 2),
    (v_group_id, 'referral',            'Parrainage',       20, false, true, 3)
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

-- Rattrapage (identique en principe à 20260901090000, is_active = false ici)
-- : tout groupe auquel il manque une ou plusieurs des 3 actions système
-- reçoit celles qui manquent, inactives. Idempotent (on conflict do nothing).
insert into public.group_point_rules (group_id, slug, label, points, is_active, is_system, sort_order)
select pg.id, r.slug, r.label, r.points, false, true, r.sort_order
from public.partner_groups pg
cross join (values
  ('testimonial_written', 'Témoignage écrit', 10, 1),
  ('testimonial_video',   'Témoignage vidéo', 30, 2),
  ('referral',            'Parrainage',       20, 3)
) as r(slug, label, points, sort_order)
on conflict (group_id, slug) do nothing;

-- NOUVEAU : repasse à is_active = false les règles système déjà semées
-- ACTIVES par une exécution antérieure de 20260828130000 ou 20260901090000,
-- SAUF celles déjà référencées par au moins un crédit (points_ledger.rule_slug
-- du même groupe) — celles-là gardent leur état actuel, quel qu'il soit.
-- `and is_active = true` évite une écriture (et un bump inutile de
-- updated_at) sur une ligne déjà inactive.
update public.group_point_rules gpr
set is_active = false
where gpr.is_system = true
  and gpr.is_active = true
  and not exists (
    select 1
    from public.points_ledger pl
    where pl.group_id = gpr.group_id
      and pl.rule_slug = gpr.slug
  );

commit;
