-- ─── Profil public : pseudo unique par utilisateur ───────────────────────────
--
-- CONTEXTE (cf. AUDIT_PSEUDO.md) : aucune table `profiles` n'existait avant
-- cette migration — l'identité affichée partout dans l'app était jusqu'ici
-- l'e-mail (session courante ou résolu via l'API admin GoTrue, cf.
-- lib/loyalty/orders.ts resolveUserEmails). Cette migration crée UNIQUEMENT
-- une table `profiles` indépendante et son alimentation automatique — aucune
-- UI, aucune Server Action, aucun changement d'affichage ne sont livrés ici.
--
-- PORTÉE / RISQUE : `public.profiles` est une table TOTALEMENT NOUVELLE, sans
-- aucun lien avec `public.partner_groups`. L'interdiction documentée dans
-- 20260724120000_group_reference_code_and_shop.sql (ALTER TABLE / UPDATE /
-- backfill / CREATE INDEX / contrainte nouvelle interdits sur partner_groups,
-- suite à l'incident SQLSTATE XX001) ne s'applique donc PAS ici — cette
-- migration ne touche, ne lit ni ne référence partner_groups d'aucune façon.
--
-- Le trigger AFTER INSERT ON auth.users est le mécanisme standard et
-- officiellement supporté par Supabase pour peupler un profil applicatif à
-- l'inscription (pattern indépendant de l'incident ci-dessus, qui concernait
-- un ALTER TABLE avec DEFAULT calculé sur une table préexistante volumineuse
-- — pas la création d'un trigger sur auth.users).
--
-- 1. public.profiles — id (PK, FK réelle vers auth.users, cascade), username,
--    created_at/updated_at. FK physique vers auth.users : pattern déjà établi
--    (subscriptions.user_id, trading_journal_entries.user_id,
--    group_shop_purchases.user_id) — aucune restriction connue sur ce type de
--    FK, contrairement au cas group_id/item_id des tables nées après
--    l'incident partner_groups (choix distinct, sans rapport).
-- 2. Contrainte de format sur username : ^[a-z0-9_]{3,20}$.
-- 3. Index unique sur username — unicité GLOBALE plateforme (pas par groupe).
-- 4. RLS : une seule policy, SELECT pour authenticated sur sa propre ligne.
--    Aucune policy INSERT/UPDATE/DELETE : toute écriture passe par
--    service_role, même convention que points_codes / group_shop_items.
-- 5. Deux fonctions utilitaires (derive_username_base, resolve_unique_username)
--    factorisent la dérivation username ← email : APPELÉES À L'IDENTIQUE par
--    le backfill (étape 5) et par handle_new_user() (étape 6) — la logique
--    n'est donc pas seulement « la même », c'est littéralement le même code
--    exécuté aux deux endroits (garantie plus forte qu'une simple duplication
--    recopiée, qui pourrait diverger avec le temps).
-- 6. Backfill de tous les auth.users existants, ordonné created_at puis id
--    (priorité du pseudo « propre » aux comptes les plus anciens en cas de
--    collision), on conflict (id) do nothing (idempotent si rejoué).
-- 7. handle_new_user() (security definer, search_path = public — cf. note
--    ci-dessous) + trigger AFTER INSERT ON auth.users.
--
-- NOTE search_path : le reste de ce schéma utilise systématiquement
-- `set search_path = ''` (accès entièrement qualifié `public.xxx`) pour les
-- fonctions SECURITY DEFINER sensibles. handle_new_user() déroge
-- explicitement à cette convention avec `set search_path = public` (choix
-- demandé pour cette fonction précisément) ; tous les appels à des objets
-- applicatifs y restent malgré tout qualifiés `public.xxx` par prudence.
--
-- TRANSACTION : BEGIN/COMMIT explicites, même convention que le reste du
-- dossier migrations.

begin;

-- ─── 1. Table public.profiles ────────────────────────────────────────────────
create table public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  username   text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 2. Contrainte de format ──────────────────────────────────────────────────
alter table public.profiles
  add constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$');

-- ─── 3. Unicité globale plateforme (pas par groupe) ──────────────────────────
create unique index profiles_username_idx on public.profiles (username);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─── 4. RLS ───────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy profiles_select on public.profiles
  for select to authenticated
  using (auth.uid() = id);

-- Aucune policy INSERT / UPDATE / DELETE pour authenticated : toute écriture
-- passe par service_role (backfill ci-dessous + handle_new_user() en
-- SECURITY DEFINER), même convention que points_codes / group_shop_items.

-- ─── 5. Dérivation du username ← email (fonctions partagées) ────────────────
-- derive_username_base : PURE, aucun accès table. Base = partie locale de
-- l'e-mail, minuscules, tout caractère hors [a-z0-9_] supprimé ; préfixée par
-- 'user' si le résultat fait moins de 3 caractères ; tronquée à 20 caractères
-- dans tous les cas (avant ou après préfixe).
create or replace function public.derive_username_base(p_email text)
returns text
language sql
immutable
as $$
  select left(
    case
      when length(regexp_replace(lower(split_part(coalesce(p_email, ''), '@', 1)), '[^a-z0-9_]', '', 'g')) < 3
        then 'user' || regexp_replace(lower(split_part(coalesce(p_email, ''), '@', 1)), '[^a-z0-9_]', '', 'g')
      else regexp_replace(lower(split_part(coalesce(p_email, ''), '@', 1)), '[^a-z0-9_]', '', 'g')
    end,
    20
  );
$$;

revoke all on function public.derive_username_base(text) from public, anon, authenticated;
grant execute on function public.derive_username_base(text) to service_role;

-- resolve_unique_username : lit public.profiles pour trouver un username
-- libre à partir d'une base déjà normalisée (3-20 caractères garantis par
-- derive_username_base). En cas de collision : suffixe numérique
-- incrémental, la base est tronquée pour que base+suffixe reste ≤ 20
-- caractères (jamais de dépassement de la contrainte de format).
-- Non SECURITY DEFINER (même choix que generate_group_reference_code dans
-- 20260724120000) : correct car les deux seuls appelants (handle_new_user,
-- SECURITY DEFINER, et le backfill ci-dessous, exécuté par le rôle de
-- migration) s'exécutent déjà dans un contexte qui contourne la RLS.
create or replace function public.resolve_unique_username(p_base text)
returns text
language plpgsql
as $$
declare
  v_candidate text := p_base;
  v_suffix    text;
  v_i         int := 0;
begin
  loop
    exit when not exists (select 1 from public.profiles where username = v_candidate);
    v_i := v_i + 1;
    v_suffix := v_i::text;
    v_candidate := left(p_base, 20 - length(v_suffix)) || v_suffix;
  end loop;
  return v_candidate;
end;
$$;

revoke all on function public.resolve_unique_username(text) from public, anon, authenticated;
grant execute on function public.resolve_unique_username(text) to service_role;

-- ─── 6. Backfill des utilisateurs existants ──────────────────────────────────
-- Ordonné created_at puis id : en cas de collision entre deux bases
-- identiques, c'est le compte le plus ANCIEN qui obtient le username sans
-- suffixe, les suivants (par created_at, puis par id à égalité) héritent du
-- suffixe incrémental. on conflict (id) do nothing : idempotent si cette
-- migration est rejouée (ne réécrit jamais un profil déjà backfillé).
do $$
declare
  r record;
  v_base     text;
  v_username text;
begin
  for r in
    select u.id, u.email
    from auth.users u
    where not exists (select 1 from public.profiles p where p.id = u.id)
    order by u.created_at asc, u.id asc
  loop
    v_base := public.derive_username_base(r.email);
    v_username := public.resolve_unique_username(v_base);
    insert into public.profiles (id, username)
    values (r.id, v_username)
    on conflict (id) do nothing;
  end loop;
end;
$$;

-- ─── 7. handle_new_user() + trigger ──────────────────────────────────────────
-- Applique EXACTEMENT la même logique que le backfill ci-dessus : mêmes deux
-- fonctions (derive_username_base, resolve_unique_username), mêmes règles,
-- pour le nouvel inscrit uniquement (pas de notion d'ordre ici, un seul
-- utilisateur).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base     text;
  v_username text;
begin
  v_base := public.derive_username_base(new.email);
  v_username := public.resolve_unique_username(v_base);
  insert into public.profiles (id, username) values (new.id, v_username);
  return new;
end;
$$;

create trigger trg_auth_users_create_profile
  after insert on auth.users
  for each row execute function public.handle_new_user();

commit;
