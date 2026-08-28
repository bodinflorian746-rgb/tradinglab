-- ─── Programme de fidélité — groupes Telegram partenaires (Phase 1) ──────────
--
-- Socle technique multi-tenant. AUCUNE UI dans cette phase.
-- 4 tables : partner_groups, group_memberships, points_codes, points_ledger.
--
-- Principes de sécurité :
--   • RLS active sur les 4 tables.
--   • LECTURES : policies scopées (membre → ses lignes ; admin de groupe → son
--     groupe uniquement). Jamais de policy « select all ».
--   • ÉCRITURES : aucune policy INSERT/UPDATE/DELETE pour authenticated. Tout
--     passe par des Server Actions en service_role (phase 2). Le Super Admin
--     (ADMIN_EMAILS / isAdmin) agit lui aussi en service_role → bypass RLS.
--     Convention identique à access_codes / subscriptions.
--   • points_ledger est append-only : garanti par trigger (bloque UPDATE/DELETE
--     même en service_role), pas seulement par l'absence de policy.
--
-- Suppressions : aucun CASCADE sur l'historique. `on delete restrict` sur les
-- relations d'historique (group_id, user_id de points_ledger / memberships,
-- points_codes.used_by_user_id). Conséquence assumée : un auth.users avec
-- historique de points ne peut être hard-deleted sans traitement dédié (RGPD
-- à gérer plus tard). `created_by` → `set null` (on conserve la ligne).

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ─── 1. partner_groups ───────────────────────────────────────────────────────
create table public.partner_groups (
  id                 uuid        primary key default gen_random_uuid(),
  name               text        not null,
  slug               text        not null unique,
  telegram_reference text,
  status             text        not null default 'active'
                       check (status in ('active', 'suspended')),
  created_by         uuid        references auth.users(id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─── 2. group_memberships ────────────────────────────────────────────────────
-- Relie un utilisateur TradeScaleX à un groupe partenaire. Un user peut
-- appartenir à plusieurs groupes (unicité sur group_id + user_id seulement).
create table public.group_memberships (
  id         uuid        primary key default gen_random_uuid(),
  group_id   uuid        not null references public.partner_groups(id) on delete restrict,
  user_id    uuid        not null references auth.users(id)            on delete restrict,
  role       text        not null default 'member' check (role in ('admin', 'member')),
  status     text        not null default 'active' check (status in ('active', 'suspended')),
  joined_at  timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint group_memberships_group_user_unique unique (group_id, user_id)
);

create index group_memberships_group_id_idx on public.group_memberships (group_id);
create index group_memberships_user_id_idx  on public.group_memberships (user_id);

-- ─── 3. points_codes ─────────────────────────────────────────────────────────
-- Codes générés par les admins de groupe, envoyés manuellement sur Telegram.
-- Format PTS-XXXX-XXXX (préfixe distinct de access_codes → aucune collision).
-- points_value libre (> 0). Modèle status calqué sur access_codes + expired.
create table public.points_codes (
  code            text        primary key,
  group_id        uuid        not null references public.partner_groups(id) on delete restrict,
  points_value    integer     not null check (points_value > 0),
  status          text        not null default 'available'
                    check (status in ('available', 'used', 'revoked', 'expired')),
  created_by      uuid        references auth.users(id) on delete set null,
  used_by_user_id uuid        references auth.users(id) on delete restrict,
  used_at         timestamptz,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  -- Cohérence statut ↔ utilisation : un code 'used' DOIT avoir user + date ;
  -- tout autre statut (available / revoked / expired) NE DOIT PAS les avoir.
  constraint points_codes_used_consistency check (
    (status = 'used'  and used_by_user_id is not null and used_at is not null)
    or
    (status <> 'used' and used_by_user_id is null     and used_at is null)
  )
);

create index points_codes_group_id_idx on public.points_codes (group_id);
create index points_codes_status_idx   on public.points_codes (status);
create index points_codes_used_by_idx  on public.points_codes (used_by_user_id);

-- ─── 4. points_ledger ────────────────────────────────────────────────────────
-- SOURCE DE VÉRITÉ. Le solde n'est jamais stocké : il se calcule comme la somme
-- des opérations. Append-only (cf. trigger plus bas). Une correction crée une
-- NOUVELLE opération, elle ne modifie jamais une opération existante.
--
-- Signe : crédits > 0, dépenses/débits < 0. cancellation / correction = signe
-- libre (réversions / ajustements), mais montant toujours ≠ 0.
create table public.points_ledger (
  id          uuid        primary key default gen_random_uuid(),
  group_id    uuid        not null references public.partner_groups(id) on delete restrict,
  user_id     uuid        not null references auth.users(id)            on delete restrict,
  kind        text        not null check (kind in (
                'code_reward', 'tier_bonus', 'purchase',
                'manual_credit', 'manual_debit', 'cancellation', 'correction')),
  amount      integer     not null check (amount <> 0),
  points_code text        references public.points_codes(code) on delete restrict,
  reason      text,
  created_by  uuid        references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  constraint points_ledger_sign_check check (
    (kind in ('code_reward', 'tier_bonus', 'manual_credit') and amount > 0)
    or (kind in ('purchase', 'manual_debit') and amount < 0)
    or (kind in ('cancellation', 'correction'))
  )
);

create index points_ledger_group_id_idx   on public.points_ledger (group_id);
create index points_ledger_user_id_idx    on public.points_ledger (user_id);
create index points_ledger_created_at_idx on public.points_ledger (created_at);

-- ─── Triggers ────────────────────────────────────────────────────────────────

-- Fonction partagée set_updated_at(). Définie en `create or replace` pour rendre
-- CETTE migration auto-suffisante : la migration trading_journal (qui l'introduit
-- aussi) peut ne pas être appliquée sur la base. Idempotent → aucun conflit si
-- les deux migrations sont jouées.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- updated_at automatique sur partner_groups.
create trigger trg_partner_groups_updated_at
  before update on public.partner_groups
  for each row execute function public.set_updated_at();

-- Append-only fort : bloque toute UPDATE/DELETE sur points_ledger, y compris en
-- service_role (le RLS ne protège pas contre service_role). Une correction doit
-- passer par un nouvel INSERT.
create or replace function public.points_ledger_block_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'points_ledger is append-only: UPDATE/DELETE are not allowed';
end;
$$;

create trigger trg_points_ledger_append_only
  before update or delete on public.points_ledger
  for each row execute function public.points_ledger_block_mutation();

-- ─── Helpers d'autorisation (SECURITY DEFINER) ───────────────────────────────
-- Utilisés dans les policies RLS. SECURITY DEFINER + search_path vide → la
-- fonction s'exécute avec les droits du propriétaire et BYPASSE le RLS de
-- group_memberships : cela évite la récursion infinie quand une policy SUR
-- group_memberships appelle is_group_admin (qui lit group_memberships).
create or replace function public.is_group_member(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.group_memberships gm
    where gm.group_id = gid
      and gm.user_id  = auth.uid()
      and gm.status   = 'active'
  );
$$;

create or replace function public.is_group_admin(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.group_memberships gm
    where gm.group_id = gid
      and gm.user_id  = auth.uid()
      and gm.role     = 'admin'
      and gm.status   = 'active'
  );
$$;

revoke all on function public.is_group_member(uuid) from public, anon;
revoke all on function public.is_group_admin(uuid)  from public, anon;
grant execute on function public.is_group_member(uuid) to authenticated;
grant execute on function public.is_group_admin(uuid)  to authenticated;

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table public.partner_groups    enable row level security;
alter table public.group_memberships enable row level security;
alter table public.points_codes      enable row level security;
alter table public.points_ledger     enable row level security;

-- partner_groups : un membre actif voit son groupe (les admins sont membres).
create policy partner_groups_select on public.partner_groups
  for select to authenticated
  using (public.is_group_member(id));

-- group_memberships : chacun voit sa propre adhésion ; un admin voit toutes les
-- adhésions de SON groupe (et d'aucun autre).
create policy group_memberships_select on public.group_memberships
  for select to authenticated
  using (auth.uid() = user_id or public.is_group_admin(group_id));

-- points_codes : un admin voit les codes de son groupe ; un membre voit
-- uniquement le(s) code(s) qu'il a lui-même consommé(s).
create policy points_codes_select on public.points_codes
  for select to authenticated
  using (public.is_group_admin(group_id) or auth.uid() = used_by_user_id);

-- points_ledger : un membre voit ses propres opérations ; un admin voit toutes
-- les opérations de son groupe.
create policy points_ledger_select on public.points_ledger
  for select to authenticated
  using (auth.uid() = user_id or public.is_group_admin(group_id));

-- Aucune policy INSERT / UPDATE / DELETE pour anon / authenticated.
-- Les écritures sensibles passeront par des Server Actions en service_role
-- (phase 2), qui ré-autoriseront via les helpers server-only (lib/loyalty/access.ts).
