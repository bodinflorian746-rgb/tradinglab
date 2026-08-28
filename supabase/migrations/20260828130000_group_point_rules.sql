-- ─── Barème de points par groupe + traçabilité au ledger ─────────────────────
--
-- Contexte (Sprint 1 "affilié crédite une contribution") : un membre poste sa
-- contribution sur Telegram avec son pseudo du site. L'affilié cherche ce
-- pseudo/e-mail sur le site et clique un bouton de type de contribution. Rien
-- n'est envoyé ni stocké côté membre (pas d'upload, pas de formulaire, pas de
-- boîte de réception) : l'affilié constate la contribution lui-même et crédite.
--
-- DÉCISIONS PRODUIT (actées avant écriture, cf. échange précédent) :
--   1. Pas de colonne credited_by : points_ledger.created_by (déjà existante,
--      20260721120000_create_loyalty_program.sql) suffit — la Server Action
--      la renseigne avec l'id de l'admin qui crédite.
--   2. kind reste dans la liste fermée existante : un crédit de contribution
--      s'écrit avec kind='manual_credit' (déjà autorisé par
--      points_ledger_sign_check, amount > 0). Aucune modification de la
--      contrainte CHECK sur kind.
--   3. Actions LIBRES plutôt qu'un enum fermé : group_point_rules a un slug
--      texte (pas un type Postgres enum), avec is_system pour distinguer les
--      3 règles semées par défaut d'éventuelles règles futures ajoutées par un
--      admin (écran d'édition = Sprint 2, hors périmètre ici), et sort_order
--      pour un ordre d'affichage stable indépendant de l'ordre de création.
--
-- Aucune opération structurelle sur partner_groups (SELECT simple pour le
-- seed uniquement) — même règle que toutes les migrations depuis l'incident
-- SQLSTATE XX001 (cf. 20260724120000_group_reference_code_and_shop.sql).

begin;

-- ─── 1. group_point_rules ─────────────────────────────────────────────────────
-- group_id : uuid simple, SANS clé étrangère physique vers partner_groups
-- (même principe que partner_group_settings / group_shop_items depuis
-- l'incident SQLSTATE XX001). L'existence et le rôle admin du groupe sont
-- vérifiés par le code applicatif (canManageGroup), jamais par une contrainte
-- physique ici.
create table public.group_point_rules (
  id          uuid        primary key default gen_random_uuid(),
  group_id    uuid        not null,
  slug        text        not null,
  label       text        not null,
  points      integer     not null check (points > 0),
  is_active   boolean     not null default true,
  is_system   boolean     not null default false,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint group_point_rules_group_slug_unique unique (group_id, slug)
);

create index group_point_rules_group_id_idx on public.group_point_rules (group_id);

-- set_updated_at() définie en `create or replace` par 20260721120000 (rejouée
-- dans cette même branche via le commit précédent) — non redéfinie ici pour
-- éviter une 3e définition inutile de la même fonction.
create trigger trg_group_point_rules_updated_at
  before update on public.group_point_rules
  for each row execute function public.set_updated_at();

-- ─── 2. RLS ───────────────────────────────────────────────────────────────────
-- Lecture : tout membre actif du groupe (is_group_member, définie par
-- 20260721120000). AUCUNE policy INSERT/UPDATE/DELETE pour authenticated :
-- même convention que points_codes / group_shop_items / profiles — toute
-- écriture passe par service_role (Server Actions qui re-vérifient
-- canManageGroup / authorizeGroupWrite). L'écran d'édition du barème
-- (Sprint 2) suivra ce même principe, aucune policy d'écriture à ajouter
-- alors.
alter table public.group_point_rules enable row level security;

create policy group_point_rules_select on public.group_point_rules
  for select to authenticated
  using (public.is_group_member(group_id));

-- ─── 3. points_ledger : traçabilité figée du libellé au moment du crédit ─────
-- rule_slug / rule_label : copiés depuis group_point_rules AU MOMENT DE
-- L'INSERT (jamais relus depuis group_point_rules après coup) — si l'affilié
-- renomme ou désactive la règle plus tard (Sprint 2), l'historique du ledger
-- reste lisible tel qu'il était au moment du crédit. Nullables : les lignes
-- de ledger préexistantes (code_reward, purchase, ...) n'ont pas de règle
-- associée. Pas de FK physique vers group_point_rules, même principe que le
-- reste de ce schéma (points_code → points_codes est la seule FK historique
-- sur cette table, antérieure à l'incident XX001).
alter table public.points_ledger
  add column rule_slug  text,
  add column rule_label text;

-- ─── 4. Seed : 3 règles par défaut pour chaque groupe existant ───────────────
-- is_system = true : règles livrées par défaut, distinctes d'une règle
-- personnalisée qu'un admin créerait plus tard (Sprint 2). SELECT en lecture
-- seule sur partner_groups (aucune écriture dessus). on conflict : idempotent
-- si cette migration est rejouée ou si un groupe a déjà ces slugs.
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
