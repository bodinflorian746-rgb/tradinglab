-- ─── Extension : code de référence par groupe + magasin par groupe ───────────
--
-- RÉÉCRITURE (même version/nom de fichier, contenu différent) — la version
-- initiale de cette migration a échoué en production sur
--   ALTER TABLE public.partner_groups ADD COLUMN reference_code ... DEFAULT ...
-- avec SQLSTATE XX001 (could not read blocks..., erreur de stockage). La
-- transaction a été intégralement annulée (aucun objet partiel). Diagnostic :
-- table saine en lecture (API répond normalement), mais l'écriture
-- structurelle (ALTER TABLE avec DEFAULT calculé pour les lignes existantes)
-- a déclenché une erreur de lecture bas niveau sur ce projet précis.
--
-- STRATÉGIE DE CETTE RÉÉCRITURE : ne plus JAMAIS effectuer d'opération
-- structurelle sur public.partner_groups. Interdiction absolue et permanente
-- dans cette migration (et les suivantes) sur cette table : ALTER TABLE,
-- UPDATE, backfill, CREATE INDEX, contrainte/clé étrangère nouvelle, REINDEX,
-- VACUUM, DROP. Seuls des SELECT simples restent utilisés (déjà confirmés
-- sains via l'API en production).
--
-- Le code de référence devient une table INDÉPENDANTE, partner_group_settings
-- (group_id uuid PRIMARY KEY, SANS clé étrangère physique vers partner_groups
-- — l'existence du groupe est vérifiée par un SELECT explicite dans chaque
-- RPC, jamais par une contrainte FK). Nouvelle table = CREATE TABLE, aucune
-- ligne existante à réécrire, aucun risque de rejouer l'incident.
--
-- 1. partner_group_settings — group_id (PK, pas de FK), reference_code
--    (unique, permanent, réutilisable, jamais consommé), généré par défaut.
-- 2. group_shop_items / group_shop_purchases — group_id est un uuid SIMPLE,
--    SANS clé étrangère physique vers partner_groups (même principe que
--    partner_group_settings). L'existence et le statut du groupe sont
--    vérifiés par SELECT explicite dans les RPC ; l'autorisation passe par
--    group_memberships (is_group_admin/is_group_member), inchangés.
-- 3. join_group_by_reference_code(code, user_id) — cherche le groupe via
--    partner_group_settings, puis lit son statut par un SELECT simple sur
--    partner_groups (aucune jointure physique, aucune contrainte).
-- 4. purchase_shop_item(item_id, user_id, idempotency_key) — inchangé dans
--    sa logique (déjà un SELECT simple sur partner_groups pour le statut,
--    jamais une contrainte physique).
--
-- TRANSACTION : BEGIN/COMMIT explicites — si l'outil enveloppe déjà le
-- fichier dans sa propre transaction, ce BEGIN imbriqué est un no-op sans
-- risque côté Postgres (avertissement, pas d'erreur).

begin;

-- ─── 1. partner_group_settings — table indépendante, aucune FK physique ──────
-- group_id n'est PAS une clé étrangère vers partner_groups : c'est un choix
-- délibéré (cf. en-tête). L'existence du groupe référencé est garantie par le
-- code applicatif (create_group_with_admins l'insère dans la même opération
-- logique que le groupe) et par le backfill ci-dessous pour les groupes déjà
-- existants ; elle n'est jamais imposée par une contrainte physique.
create table public.partner_group_settings (
  group_id       uuid        primary key,
  reference_code text        not null unique,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_partner_group_settings_updated_at
  before update on public.partner_group_settings
  for each row execute function public.set_updated_at();

-- ─── 2. Générateur de code de référence ──────────────────────────────────────
-- Unicité vérifiée contre partner_group_settings (plus contre partner_groups,
-- qui n'a plus cette colonne). Aucun accès à partner_groups ici.
create or replace function public.generate_group_reference_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- sans caractères ambigus, même alphabet que les autres codes
  candidate text;
  seg text;
  i int;
begin
  loop
    seg := '';
    for i in 1..8 loop
      seg := seg || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
      if i = 4 then seg := seg || '-'; end if;
    end loop;
    candidate := 'GRP-' || seg;
    exit when not exists (select 1 from public.partner_group_settings where reference_code = candidate);
  end loop;
  return candidate;
end;
$$;

revoke all on function public.generate_group_reference_code() from public, anon, authenticated;
grant execute on function public.generate_group_reference_code() to service_role;

alter table public.partner_group_settings
  alter column reference_code set default public.generate_group_reference_code();

-- Backfill : SELECT en lecture seule sur partner_groups (aucune écriture sur
-- cette table), écriture uniquement dans la nouvelle table
-- partner_group_settings. Couvre les groupes créés AVANT cette migration
-- (programme de fidélité Phase 1-4, déjà en production).
insert into public.partner_group_settings (group_id, reference_code)
select pg.id, public.generate_group_reference_code()
from public.partner_groups pg
where not exists (
  select 1 from public.partner_group_settings s where s.group_id = pg.id
);

alter table public.partner_group_settings enable row level security;

create policy partner_group_settings_select on public.partner_group_settings
  for select to authenticated
  using (public.is_group_admin(group_id));

-- ─── 3. group_shop_items ──────────────────────────────────────────────────────
-- group_id : uuid SIMPLE, sans clé étrangère physique vers partner_groups
-- (cf. en-tête). price_points >= 0 : un article gratuit (0 point) est une
-- décision produit valide pour un admin de groupe — purchase_shop_item traite
-- ce cas sans écrire de ligne points_ledger (la contrainte amount <> 0
-- l'interdirait). stock NULL = illimité (jamais vérifié ni décrémenté par
-- purchase_shop_item). image_url : optionnelle, aucune validation de format
-- côté base.
create table public.group_shop_items (
  id           uuid        primary key default gen_random_uuid(),
  group_id     uuid        not null,
  name         text        not null,
  description  text,
  item_type    text        not null check (item_type in ('product', 'reward')),
  price_points integer     not null check (price_points >= 0),
  image_url    text,
  stock        integer     check (stock is null or stock >= 0),
  status       text        not null default 'active' check (status in ('active', 'inactive')),
  created_by   uuid        references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index group_shop_items_group_id_idx on public.group_shop_items (group_id);
create index group_shop_items_status_idx   on public.group_shop_items (status);

create trigger trg_group_shop_items_updated_at
  before update on public.group_shop_items
  for each row execute function public.set_updated_at();

-- ─── 4. group_shop_purchases ──────────────────────────────────────────────────
-- group_id / item_id : uuid simples. item_id n'a pas non plus de FK physique
-- vers group_shop_items (cohérence avec le choix ci-dessus) — l'intégrité est
-- garantie par purchase_shop_item, seule fonction autorisée à écrire ici.
--
-- idempotency_key : fournie par l'appelant (générée côté formulaire à chaque
-- nouvelle tentative d'achat, réutilisée si cette même tentative est rejouée).
-- La contrainte unique (user_id, idempotency_key) est la garantie EN BASE
-- qu'une tentative rejouée ne peut jamais produire un second achat.
create table public.group_shop_purchases (
  id               uuid        primary key default gen_random_uuid(),
  group_id         uuid        not null,
  item_id          uuid        not null,
  user_id          uuid        not null references auth.users(id) on delete restrict,
  price_paid       integer     not null check (price_paid >= 0), -- figé au moment de l'achat (0 = article gratuit), indépendant du prix courant de l'article
  idempotency_key  uuid        not null,
  created_at       timestamptz not null default now(),
  constraint group_shop_purchases_user_idempotency_key unique (user_id, idempotency_key)
);

create index group_shop_purchases_group_id_idx on public.group_shop_purchases (group_id);
create index group_shop_purchases_user_id_idx  on public.group_shop_purchases (user_id);
create index group_shop_purchases_item_id_idx  on public.group_shop_purchases (item_id);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
alter table public.group_shop_items     enable row level security;
alter table public.group_shop_purchases enable row level security;

create policy group_shop_items_select on public.group_shop_items
  for select to authenticated
  using (
    public.is_group_admin(group_id)
    or (status = 'active' and public.is_group_member(group_id))
  );

create policy group_shop_purchases_select on public.group_shop_purchases
  for select to authenticated
  using (auth.uid() = user_id or public.is_group_admin(group_id));

-- Aucune policy INSERT / UPDATE / DELETE pour authenticated : toute écriture
-- passe par les RPC ci-dessous (service_role), même convention que points_codes.

-- ─── 5. Rattachement par code de référence (idempotent, atomique) ────────────
-- Cherche le groupe via partner_group_settings (plus via partner_groups.
-- reference_code, qui n'existe plus), puis lit son statut par un SELECT
-- simple sur partner_groups — aucune jointure physique, aucune contrainte.
create or replace function public.join_group_by_reference_code(p_reference_code text, p_user_id uuid)
returns table (result text, result_group_id uuid, result_group_name text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_settings   public.partner_group_settings%rowtype;
  v_group      public.partner_groups%rowtype;
  v_membership public.group_memberships%rowtype;
begin
  select * into v_settings from public.partner_group_settings where reference_code = p_reference_code;
  if v_settings.group_id is null then
    return query select 'not_found'::text, null::uuid, null::text;
    return;
  end if;

  select * into v_group from public.partner_groups where id = v_settings.group_id;
  if v_group.id is null then
    -- Réglage orphelin (groupe absent malgré un reference_code existant) :
    -- ne peut structurellement pas arriver via le flux applicatif normal
    -- (aucune suppression de groupe n'est exposée), mais sans FK physique la
    -- garantie n'est pas imposée par la base — traité comme not_found, jamais
    -- comme une erreur qui exposerait l'incohérence à l'appelant.
    return query select 'not_found'::text, null::uuid, null::text;
    return;
  end if;

  if v_group.status <> 'active' then
    return query select 'group_suspended'::text, v_group.id, v_group.name;
    return;
  end if;

  select * into v_membership from public.group_memberships
    where group_id = v_group.id and user_id = p_user_id
    for update;

  if v_membership.id is not null then
    if v_membership.status = 'active' then
      return query select 'already_member'::text, v_group.id, v_group.name;
      return;
    end if;
    -- Réactivation : seul `status` est modifié, le `role` existant (member ou
    -- admin) n'est JAMAIS altéré — préserve les droits du gestionnaire.
    update public.group_memberships set status = 'active' where id = v_membership.id;
    return query select 'ok'::text, v_group.id, v_group.name;
    return;
  end if;

  -- Nouvelle adhésion : toujours role='member', jamais 'admin'.
  begin
    insert into public.group_memberships (group_id, user_id, role, status)
    values (v_group.id, p_user_id, 'member', 'active');
  exception when unique_violation then
    -- Course concurrente (double clic / requête répétée) : déjà créée entre-temps.
    return query select 'already_member'::text, v_group.id, v_group.name;
    return;
  end;

  return query select 'ok'::text, v_group.id, v_group.name;
end;
$$;

revoke all on function public.join_group_by_reference_code(text, uuid) from public, anon, authenticated;
grant execute on function public.join_group_by_reference_code(text, uuid) to service_role;

-- ─── 6. Achat d'un article (atomique, idempotent, verrouillé par utilisateur)
-- Logique inchangée par rapport à la version initiale (déjà un SELECT simple
-- sur partner_groups pour le statut, group_shop_items pour l'article — jamais
-- une contrainte physique). Seule différence : group_shop_items.group_id et
-- group_shop_purchases.item_id/group_id ne sont plus des clés étrangères
-- physiques (cf. en-tête), sans impact sur cette logique métier.
--
-- pg_advisory_xact_lock sérialise les achats concurrents d'un même utilisateur
-- (double clic, requête répétée) : la 2e transaction attend que la 1re commite
-- puis relit un état à jour. Le verrou est automatiquement libéré à la fin de
-- la transaction (xact = scope de la RPC).
--
-- IDEMPOTENCE (p_idempotency_key) : le verrou ci-dessus sérialise les appels,
-- mais NE SUFFIT PAS à empêcher un double achat métier — si le solde permet
-- deux achats, deux appels successifs légitimement distincts réussiraient tous
-- les deux. p_idempotency_key distingue une tentative REJOUÉE (même clé, MÊME
-- article : ne doit produire qu'un seul débit) d'un nouvel achat volontaire
-- (clé différente : traité normalement). Une clé déjà utilisée mais pour un
-- AUTRE article ('idempotency_key_reused') est un mésusage explicitement
-- rejeté — jamais traité comme un succès pour le nouvel article, jamais
-- confondu avec l'achat existant d'un article différent.
--
-- ORDRE DES VÉRIFICATIONS : l'appartenance active au groupe est vérifiée
-- AVANT le statut du groupe et de l'article. Un appelant sans lien avec ce
-- groupe n'apprend donc jamais si le groupe est suspendu ni si l'article est
-- actif — seulement que l'identifiant existe ou non (uuid non énumérable).
--
-- ARTICLE GRATUIT (price_points = 0) : aucun solde n'est exigé (le contrôle
-- de solde est sauté explicitement), et AUCUNE ligne points_ledger n'est
-- insérée — la contrainte points_ledger.amount <> 0 (et
-- points_ledger_sign_check, qui exige amount < 0 pour 'purchase') interdit
-- structurellement un débit de 0. L'achat reste néanmoins tracé dans
-- group_shop_purchases avec price_paid = 0 (contrainte price_paid >= 0).
--
-- STOCK (NULL = illimité, jamais vérifié ni touché) : décrémenté par un
-- UPDATE atomique avec garde `stock > 0` dans le WHERE — c'est cette garde,
-- pas le verrou par utilisateur, qui empêche deux acheteurs DIFFÉRENTS de
-- dépasser le stock disponible : la ligne est verrouillée par la première
-- UPDATE, la seconde attend, relit le stock déjà décrémenté, et échoue
-- proprement (`not found`) si épuisé. Le verrou pg_advisory_xact_lock reste
-- nécessaire pour l'idempotence par utilisateur, mais ne protège pas seul
-- contre la concurrence inter-utilisateurs sur le stock.
create or replace function public.purchase_shop_item(
  p_item_id uuid, p_user_id uuid, p_idempotency_key uuid
)
returns table (result text, result_purchase_id uuid, result_price_paid integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item           public.group_shop_items%rowtype;
  v_group_status   text;
  v_member_status  text;
  v_balance        integer;
  v_purchase_id    uuid;
  v_existing       public.group_shop_purchases%rowtype;
  v_stock_taken    boolean := false;
begin
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select * into v_existing from public.group_shop_purchases
    where user_id = p_user_id and idempotency_key = p_idempotency_key;
  if v_existing.id is not null then
    if v_existing.item_id = p_item_id then
      return query select 'already_processed'::text, v_existing.id, v_existing.price_paid;
    else
      return query select 'idempotency_key_reused'::text, null::uuid, null::integer;
    end if;
    return;
  end if;

  select * into v_item from public.group_shop_items where id = p_item_id;
  if v_item.id is null then
    return query select 'not_found'::text, null::uuid, null::integer;
    return;
  end if;

  select status into v_member_status from public.group_memberships
    where group_id = v_item.group_id and user_id = p_user_id;
  if v_member_status is distinct from 'active' then
    return query select 'not_member'::text, null::uuid, null::integer;
    return;
  end if;

  select status into v_group_status from public.partner_groups where id = v_item.group_id;
  if v_group_status is distinct from 'active' then
    return query select 'group_suspended'::text, null::uuid, null::integer;
    return;
  end if;

  if v_item.status <> 'active' then
    return query select 'item_inactive'::text, null::uuid, null::integer;
    return;
  end if;

  if v_item.price_points > 0 then
    select coalesce(sum(amount), 0) into v_balance from public.points_ledger
      where group_id = v_item.group_id and user_id = p_user_id;
    if v_balance < v_item.price_points then
      return query select 'insufficient_balance'::text, null::uuid, null::integer;
      return;
    end if;
  end if;

  if v_item.stock is not null then
    update public.group_shop_items
       set stock = stock - 1
     where id = p_item_id and stock > 0;
    if not found then
      return query select 'out_of_stock'::text, null::uuid, null::integer;
      return;
    end if;
    v_stock_taken := true;
  end if;

  begin
    insert into public.group_shop_purchases (group_id, item_id, user_id, price_paid, idempotency_key)
    values (v_item.group_id, p_item_id, p_user_id, v_item.price_points, p_idempotency_key)
    returning id into v_purchase_id;
  exception when unique_violation then
    if v_stock_taken then
      update public.group_shop_items set stock = stock + 1 where id = p_item_id;
    end if;
    select * into v_existing from public.group_shop_purchases
      where user_id = p_user_id and idempotency_key = p_idempotency_key;
    if v_existing.item_id = p_item_id then
      return query select 'already_processed'::text, v_existing.id, v_existing.price_paid;
    else
      return query select 'idempotency_key_reused'::text, null::uuid, null::integer;
    end if;
    return;
  end;

  if v_item.price_points > 0 then
    insert into public.points_ledger (group_id, user_id, kind, amount, reason, created_by)
    values (v_item.group_id, p_user_id, 'purchase', -v_item.price_points,
            'Achat : ' || v_item.name, p_user_id);
  end if;

  return query select 'ok'::text, v_purchase_id, v_item.price_points;
end;
$$;

revoke all on function public.purchase_shop_item(uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.purchase_shop_item(uuid, uuid, uuid) to service_role;

commit;
