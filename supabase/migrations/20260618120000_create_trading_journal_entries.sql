-- Journal de trading IA — table principale + RLS.
-- Chaque utilisateur ne voit/insère/modifie/supprime QUE ses propres trades.
-- Aligné sur les conventions des migrations existantes (subscriptions, access_codes).

create extension if not exists pgcrypto; -- gen_random_uuid()

create table if not exists public.trading_journal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,

  -- ── Essentiel (obligatoires) ──
  asset       text not null,
  direction   text not null check (direction in ('buy','sell')),
  timeframe   text not null check (timeframe in ('M1','M5','M15','M30','H1','H4','D1','W1')),
  trade_type  text not null check (trade_type in ('scalp','intraday','swing')),
  result      text not null check (result in ('win','loss','break_even','open')),
  trade_date  timestamptz not null,

  -- ── Analyse du setup ──
  platform     text check (platform in ('tradingview','mt4','mt5','ctrader','other')),
  setup        text check (setup in (
                 'order_block','fair_value_gap','liquidity_sweep','breakout','retest',
                 'support_resistance','trend_following','reversal','news_macro','other')),
  market_trend text check (market_trend in ('bullish','bearish','range','uncertain')),
  session      text check (session in ('asia','london','new_york','other')),
  entry_reason text,
  exit_reason  text,

  -- ── Gestion du risque ──
  account_capital numeric,
  entry_price     numeric,
  stop_loss       numeric,
  take_profit     numeric,
  risk_percent    numeric,
  risk_amount     numeric,
  r_multiple      numeric,
  fees            numeric,

  -- ── Psychologie (clés canoniques, lisibles par l'IA) ──
  followed_plan     text check (followed_plan in ('yes','partial','no')),
  emotion_before    text check (emotion_before in (
                      'calm','confident','stressed','impatient','fomo','euphoric','tired','frustrated')),
  emotion_during    text check (emotion_during in (
                      'calm','stressed','hesitant','impatient','confident','frustrated')),
  emotion_after     text check (emotion_after in (
                      'satisfied','frustrated','relieved','angry','neutral','motivated')),
  perceived_mistake text check (perceived_mistake in (
                      'entry_too_early','entry_too_late','bad_stop','tp_too_close','out_of_plan',
                      'revenge_trading','overtrading','fomo','exit_too_early','none','other')),

  -- ── Notes & capture ──
  user_comment   text,
  -- Chemin de l'objet dans le bucket privé 'trade-screenshots' (ex: <uid>/<uuid>.png).
  -- L'URL signée est générée à la lecture côté serveur (cf. lib/journal/queries.ts).
  screenshot_url text,

  -- ── Analyse IA (V2 branchée, cf. lib/journal/ai.ts) ──
  -- Le schéma JSON renvoyé par le modèle est {summary, strengths[], mistakes[],
  -- behavioral_advice, score} — PAS de champ "recommendations" (retiré
  -- volontairement : un champ nommé "recommandation" invite le modèle vers un
  -- avis directionnel, cf. commentaire dans lib/journal/ai.ts). Mapping vers
  -- les colonnes ci-dessous :
  --   ai_summary   ← summary
  --   ai_feedback  ← behavioral_advice  (nom de colonne hérité du schéma V1)
  --   ai_mistakes  ← mistakes[]
  --   ai_score     ← score
  --   ai_strengths ← strengths[]
  ai_status    text not null default 'pending'
                check (ai_status in ('pending','analyzed','failed','skipped')),
  ai_summary   text,
  ai_feedback  text,
  ai_mistakes  jsonb,   -- liste de strings
  ai_score     int check (ai_score between 0 and 100),
  ai_strengths jsonb,   -- liste de strings

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists trading_journal_entries_user_date_idx
  on public.trading_journal_entries (user_id, trade_date desc);

-- updated_at automatique
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_trading_journal_updated_at on public.trading_journal_entries;
create trigger trg_trading_journal_updated_at
  before update on public.trading_journal_entries
  for each row execute function public.set_updated_at();

-- ── Row Level Security ──
alter table public.trading_journal_entries enable row level security;

create policy "tje_select_own" on public.trading_journal_entries
  for select using (auth.uid() = user_id);

create policy "tje_insert_own" on public.trading_journal_entries
  for insert with check (auth.uid() = user_id);

create policy "tje_update_own" on public.trading_journal_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tje_delete_own" on public.trading_journal_entries
  for delete using (auth.uid() = user_id);
