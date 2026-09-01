-- ─── Bonus de complétion (un seul par groupe, cycle ancré sur l'adhésion) ────
--
-- Contexte : un admin de groupe choisit un sous-ensemble d'actions de son
-- barème (group_point_rules) + un montant de bonus. Le membre crédité au
-- moins une fois pour CHACUNE des actions de l'ensemble, dans SON cycle en
-- cours, reçoit le bonus automatiquement, une seule fois par cycle.
--
-- CYCLE = fenêtre glissante de 30 jours ANCRÉE SUR group_memberships.joined_at
-- (l'adhésion du membre au groupe), PAS le mois calendaire. Un mois calendaire
-- est injuste : un membre qui rejoint le 29 du mois n'aurait que 2 jours pour
-- compléter ses actions et découvrirait le système par un échec. Avec un
-- cycle ancré sur l'adhésion, cycle 0 = [joinedAt, joinedAt+30j), cycle 1 =
-- [+30j, +60j), etc. — chaque membre a donc SA PROPRE fenêtre de 30 jours
-- pleins, dès son premier jour. Cf. lib/loyalty/completion-bonus.ts
-- #membershipCycleWindow (même calcul appliqué côté application).
--
-- Le versement s'écrit dans points_ledger comme n'importe quel crédit manuel
-- (kind='manual_credit', déjà autorisé par points_ledger_sign_check — AUCUNE
-- modification de la contrainte CHECK sur kind), distingué des crédits
-- d'action normaux par un rule_slug technique dédié ('__completion_bonus__')
-- qui ne peut jamais entrer en collision avec un slug de règle réel :
-- deriveRuleSlug() (lib/loyalty/master-validation.ts) retire systématiquement
-- les underscores en bord de chaîne, donc aucun label admin ne peut jamais
-- dériver vers un slug commençant par "__".
--
-- DÉCISIONS PRODUIT / TECHNIQUES :
--
--   1. Table de liaison (group_completion_bonus_rules) plutôt qu'un tableau
--      rule_slugs text[] sur group_completion_bonus. Justification :
--        - cohérent avec le reste du schéma (group_memberships, points_codes,
--          group_point_rules...), qui n'utilise nulle part de colonne array —
--          pas de précédent à introduire pour ce seul besoin ;
--        - une jointure/EXISTS classique pour "ce slug fait-il partie de
--          l'ensemble ?" est plus simple à écrire et à indexer qu'un ANY() sur
--          tableau, et plus ergonomique côté supabase-js (delete+insert de
--          lignes vs. manipulation d'un array côté client) ;
--        - permet d'ajouter facilement une métadonnée par règle du set plus
--          tard (ex. date d'ajout) sans migration de structure.
--      Chaque ligne référence la règle par SLUG (texte), jamais par l'id uuid
--      de group_point_rules — même convention que points_ledger.rule_slug
--      (migration 20260828130000) : le slug reste l'identité stable d'une
--      action même si la règle est renommée, désactivée, voire supprimée
--      ensuite. bonus_id → group_completion_bonus(id) EST une FK physique
--      classique (relation locale entre deux tables de cette même migration).
--
--   2. "Si l'admin modifie l'ensemble après versement : le bonus reste
--      acquis." — garanti gratuitement par l'append-only de points_ledger
--      (trigger trg_points_ledger_append_only, migration 20260721120000) :
--      une ligne de bonus déjà insérée n'est jamais ni modifiée ni supprimée,
--      quoi que l'admin change ensuite dans group_completion_bonus_rules.
--
--   3. Idempotence stricte ("jamais deux bonus pour le même membre le même
--      cycle, même en cas de double clic ou de crédit supplémentaire après
--      complétion") : NE PEUT PAS reposer uniquement sur un check-then-insert
--      applicatif (fenêtre de course), ET ne peut PAS non plus être une
--      expression d'index sur points_ledger.created_at seul (contrairement à
--      un mois calendaire UTC, le début d'un cycle dépend de
--      group_memberships.joined_at — une donnée qui vit dans une AUTRE table
--      et peut changer, cf. décision 4). La solution : deux colonnes ajoutées
--      à points_ledger, calculées et écrites par l'application AU MOMENT du
--      versement (jamais recalculées après coup) :
--        - completion_bonus_membership_id : l'id de la ligne group_memberships
--          active au moment du versement (PAS de FK physique — cf. décision 4,
--          une ligne group_memberships peut être supprimée par un départ de
--          groupe sans que l'historique du ledger n'en soit affecté).
--        - completion_bonus_cycle : le numéro de cycle (0, 1, 2...) au moment
--          du versement.
--      Un INDEX UNIQUE PARTIEL sur (completion_bonus_membership_id,
--      completion_bonus_cycle), restreint aux lignes de bonus
--      (kind='manual_credit' AND rule_slug='__completion_bonus__'), garantit
--      qu'un seul bonus par (membership, cycle) peut jamais être inséré, même
--      sous course concurrente. Toute tentative de second INSERT pour le même
--      couple échoue en 23505 — l'appelant (lib/loyalty/completion-bonus.ts +
--      membres/actions.ts) traite ce code comme "déjà versé", jamais comme
--      une erreur. Contrairement à une expression sur date_trunc(created_at),
--      cet index porte sur des colonnes ORDINAIRES (pas d'expression) : plus
--      simple, et correct par construction puisque la donnée est figée à
--      l'écriture plutôt que recalculée depuis une source externe mutable.
--
--   4. "Si un membre quitte puis rejoint le groupe, sa date d'adhésion
--      change" — CONFIRMÉ et TRAITÉ. leaveGroupAction (compte/actions.ts)
--      SUPPRIME la ligne group_memberships (pas un simple statut suspendu).
--      Un rejoin passe par join_group_by_reference_code (migration
--      20260724120000) : si aucune ligne n'existe pour (group_id, user_id),
--      il en crée une NOUVELLE avec un NOUVEL id ET un joined_at = now()
--      fraîchement défini par défaut — la ligne group_memberships d'origine
--      étant supprimée, l'ancien id ne réapparaît jamais. Un membre qui quitte
--      puis rejoint reprend donc logiquement à cycle 0 : c'est le comportement
--      ATTENDU (une nouvelle adhésion), pas un cas à corriger.
--      La conséquence pour l'idempotence : si on n'avait indexé QUE le numéro
--      de cycle (sans l'id d'adhésion), un membre qui a déjà touché son bonus
--      de "cycle 0" lors d'un premier passage, puis quitte et rejoint (nouveau
--      cycle 0 pour la nouvelle adhésion), se retrouverait bloqué par une
--      collision d'index avec SA PROPRE ancienne ligne de bonus — alors que
--      c'est un cycle légitimement différent. C'est exactement pour cette
--      raison que l'unicité porte sur (completion_bonus_membership_id,
--      completion_bonus_cycle) et NON sur (group_id, user_id, cycle) seul :
--      chaque adhésion (même group_id + user_id) a un membership_id distinct,
--      donc chaque "cycle 0" d'une adhésion différente est un couple distinct
--      dans l'index, sans collision possible.
--      NB : une réactivation SANS suppression (admin qui repasse un membre de
--      'suspended' à 'active' via un autre flux, migration 20260724120000
--      lignes ~230-245) NE touche PAS joined_at — le cycle continue sans
--      interruption dans ce cas, ce qui est également le comportement voulu
--      (ce n'est pas un départ volontaire du membre).
--
-- Aucune opération structurelle sur partner_groups (aucune écriture dessus) —
-- même prudence que toutes les migrations depuis l'incident SQLSTATE XX001.

begin;

-- ─── 1. group_completion_bonus ────────────────────────────────────────────────
-- Un seul enregistrement par groupe : unicité sur group_id. group_id SANS FK
-- physique vers partner_groups (cf. incident XX001 ci-dessus) — existence et
-- rôle admin vérifiés par le code applicatif (canManageGroup /
-- authorizeGroupWrite), jamais par une contrainte physique ici.
create table public.group_completion_bonus (
  id          uuid        primary key default gen_random_uuid(),
  group_id    uuid        not null unique,
  points      integer     not null check (points > 0),
  is_active   boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- set_updated_at() définie en `create or replace` par 20260721120000 (déjà
-- rejouée par 20260828130000 dans cette même branche) — non redéfinie ici.
create trigger trg_group_completion_bonus_updated_at
  before update on public.group_completion_bonus
  for each row execute function public.set_updated_at();

-- ─── 2. group_completion_bonus_rules ──────────────────────────────────────────
-- Composition de l'ensemble : un slug de group_point_rules par ligne (cf.
-- décision 1). FK LOCALE vers group_completion_bonus(id) — relation entre
-- deux tables de cette même migration, `on delete cascade` : supprimer un
-- bonus (cas théorique, l'admin ne fait que le désactiver en pratique) purge
-- proprement sa composition, sans jamais toucher points_ledger.
create table public.group_completion_bonus_rules (
  id          uuid        primary key default gen_random_uuid(),
  bonus_id    uuid        not null references public.group_completion_bonus(id) on delete cascade,
  rule_slug   text        not null,
  created_at  timestamptz not null default now(),
  constraint group_completion_bonus_rules_unique unique (bonus_id, rule_slug)
);

create index group_completion_bonus_rules_bonus_id_idx
  on public.group_completion_bonus_rules (bonus_id);

-- ─── 3. Idempotence : un seul bonus par (adhésion, cycle) ────────────────────
-- Cf. décisions 3 et 4 ci-dessus. Colonnes ordinaires (pas d'expression),
-- écrites une seule fois à l'insertion du bonus, jamais recalculées. Pas de
-- FK physique sur completion_bonus_membership_id : une ligne group_memberships
-- peut être supprimée (départ de groupe) sans que l'historique du ledger n'en
-- soit affecté — même principe que rule_slug (pas de FK vers group_point_rules).
alter table public.points_ledger
  add column completion_bonus_membership_id uuid,
  add column completion_bonus_cycle         integer,
  add constraint points_ledger_completion_bonus_fields_consistency check (
    (completion_bonus_membership_id is null) = (completion_bonus_cycle is null)
  );

create unique index group_completion_bonus_once_per_cycle_idx
  on public.points_ledger (completion_bonus_membership_id, completion_bonus_cycle)
  where kind = 'manual_credit' and rule_slug = '__completion_bonus__';

-- ─── 4. RLS ───────────────────────────────────────────────────────────────────
-- Lecture : tout membre actif du groupe (is_group_member, 20260721120000) —
-- même convention que group_point_rules_select. AUCUNE policy
-- INSERT/UPDATE/DELETE pour authenticated sur les deux tables : toute
-- écriture passe par service_role (Server Action Master, qui re-vérifie
-- authorizeGroupWrite à chaque appel).
alter table public.group_completion_bonus       enable row level security;
alter table public.group_completion_bonus_rules enable row level security;

create policy group_completion_bonus_select on public.group_completion_bonus
  for select to authenticated
  using (public.is_group_member(group_id));

-- group_completion_bonus_rules n'a pas de colonne group_id directe : la
-- policy passe par le bonus parent (join implicite via EXISTS), même
-- principe que points_codes_select (jointure logique, pas physique).
create policy group_completion_bonus_rules_select on public.group_completion_bonus_rules
  for select to authenticated
  using (
    exists (
      select 1
      from public.group_completion_bonus b
      where b.id = group_completion_bonus_rules.bonus_id
        and public.is_group_member(b.group_id)
    )
  );

commit;
