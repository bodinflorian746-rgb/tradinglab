-- ─── Bonus mensuel de complétion (un seul par groupe) ────────────────────────
--
-- Contexte : un admin de groupe choisit un sous-ensemble d'actions de son
-- barème (group_point_rules) + un montant de bonus. Le membre crédité au
-- moins une fois pour CHACUNE des actions de l'ensemble, dans le mois
-- calendaire en cours, reçoit le bonus automatiquement, une seule fois par
-- mois. Le versement s'écrit dans points_ledger comme n'importe quel crédit
-- manuel (kind='manual_credit', déjà autorisé par points_ledger_sign_check —
-- AUCUNE modification de la contrainte CHECK sur kind, cf. entête ci-dessous),
-- distingué des crédits d'action normaux par un rule_slug technique dédié
-- ('__completion_bonus__') qui ne peut jamais entrer en collision avec un
-- slug de règle réel : deriveRuleSlug() (lib/loyalty/master-validation.ts)
-- retire systématiquement les underscores en bord de chaîne, donc aucun label
-- admin ne peut jamais dériver vers un slug commençant par "__".
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
--      ensuite. Une règle supprimée dont le slug reste dans l'ensemble ne
--      peut simplement plus jamais être (re)créditée → cette action de
--      l'ensemble ne sera plus jamais validée, sans erreur ni orphelin
--      bloquant (pas de FK physique vers group_point_rules, même principe que
--      partout ailleurs dans ce schéma depuis l'incident SQLSTATE XX001 sur
--      les group_id — mais bonus_id → group_completion_bonus(id) EST une FK
--      physique classique : relation locale entre DEUX tables créées dans
--      cette même migration, hors du périmètre de cet incident).
--
--   2. "Si l'admin modifie l'ensemble après versement : le bonus reste
--      acquis." — garanti gratuitement par l'append-only de points_ledger
--      (trigger trg_points_ledger_append_only, migration 20260721120000) :
--      une ligne de bonus déjà insérée n'est jamais ni modifiée ni supprimée,
--      quoi que l'admin change ensuite dans group_completion_bonus_rules.
--      Aucune logique supplémentaire nécessaire ici.
--
--   3. Idempotence stricte ("jamais deux bonus pour le même membre le même
--      mois, même en cas de double clic ou de crédit supplémentaire après
--      complétion") : NE PEUT PAS reposer uniquement sur un
--      check-then-insert applicatif (fenêtre de course). Garantie ici par un
--      INDEX UNIQUE PARTIEL sur points_ledger, portant sur (group_id,
--      user_id, mois UTC du crédit), restreint aux lignes de bonus
--      (kind='manual_credit' AND rule_slug='__completion_bonus__'). Toute
--      tentative de second INSERT le même mois échoue en 23505 — l'appelant
--      (lib/loyalty/completion-bonus.ts) traite ce code comme "déjà versé",
--      jamais comme une erreur.
--      `date_trunc('month', created_at at time zone 'UTC')` est IMMUTABLE
--      (contrairement à date_trunc(text, timestamptz) seul, qui dépend du
--      fuseau de session et est seulement STABLE) : `at time zone 'UTC'`
--      convertit d'abord vers un timestamp SANS fuseau à zone fixe (littéral
--      constant → immutable), puis date_trunc(text, timestamp) est lui-même
--      immutable. Expression valide en index.
--
--   4. Mois calendaire UTC (pas de fuseau spécifique type Europe/Paris) :
--      AUCUNE convention de fuseau horaire n'existe ailleurs dans le projet
--      (vérifié avant d'écrire cette migration — aucun `timeZone` explicite
--      dans les quelques Intl.DateTimeFormat existants, aucune librairie de
--      date type dayjs/date-fns/luxon). points_ledger.created_at est
--      timestamptz, `now()` Postgres et `Date.now()` sont tous deux ancrés en
--      UTC en interne : le mois UTC est donc le choix qui reste cohérent avec
--      l'absence de fuseau explicite ailleurs, plutôt que d'en introduire un
--      nouveau rien que pour cette fonctionnalité. Cf. lib/loyalty/
--      completion-bonus.ts#utcMonthRange (même frontière utilisée côté
--      application pour le filtre gte/lt sur created_at).
--
-- Aucune opération structurelle sur partner_groups ni points_ledger au-delà
-- de l'ajout de cet index (aucune colonne ajoutée : rule_slug/rule_label
-- existent déjà depuis 20260828130000) — même prudence que toutes les
-- migrations depuis l'incident SQLSTATE XX001.

begin;

-- ─── 1. group_completion_bonus ────────────────────────────────────────────────
-- Un seul enregistrement par groupe : unicité sur group_id (pas de clé
-- primaire composite, un simple UNIQUE suffit, même style que
-- group_point_rules_group_slug_unique). group_id SANS FK physique vers
-- partner_groups (cf. décision 1 ci-dessus) — existence et rôle admin
-- vérifiés par le code applicatif (canManageGroup / authorizeGroupWrite),
-- jamais par une contrainte physique ici.
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

-- ─── 3. Idempotence : un seul bonus par (groupe, membre, mois UTC) ───────────
-- Cf. décision 3 ci-dessus pour la justification de l'expression IMMUTABLE.
create unique index group_completion_bonus_once_per_month_idx
  on public.points_ledger (group_id, user_id, (date_trunc('month', created_at at time zone 'UTC')))
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
