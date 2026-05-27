-- ─── public.subscriptions ───────────────────────────────────────────────────
-- Miroir local de l'état Stripe Subscription par utilisateur.
-- Écriture serveur uniquement (webhook Stripe via service_role, bypass RLS).
-- Lecture client : RLS active, chaque user lit uniquement sa propre ligne.

create table public.subscriptions (
  id                      uuid        primary key default gen_random_uuid(),
  user_id                 uuid        not null unique references auth.users(id) on delete cascade,
  stripe_customer_id      text        unique,
  stripe_subscription_id  text        unique,
  stripe_price_id         text,
  status                  text,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean     not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Index utiles : lookups fréquents par user_id et filtres par status.
create index subscriptions_user_id_idx
  on public.subscriptions (user_id);

create index subscriptions_status_idx
  on public.subscriptions (status);

-- ─── Row Level Security ─────────────────────────────────────────────────────

alter table public.subscriptions enable row level security;

-- Policy SELECT : l'user authentifié lit uniquement sa propre subscription.
create policy "subscriptions_select_own"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Pas de policy INSERT / UPDATE / DELETE pour les clients (anon ou
-- authenticated). Le webhook Stripe écrira via service_role (qui bypass RLS).
-- Conséquence : depuis le browser / Server Actions avec la PUBLISHABLE_KEY,
-- aucun client ne peut créer / modifier / supprimer une ligne.
