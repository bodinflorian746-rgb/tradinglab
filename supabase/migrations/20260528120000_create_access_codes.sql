-- ─── public.access_codes ────────────────────────────────────────────────────
-- Codes d'accès à usage unique pour l'inscription gated.
--
-- ⚠️ SOURCE DE VÉRITÉ = la table créée manuellement dans Supabase. Ce fichier
-- en est le miroir documentaire, idempotent (`if not exists`) : le rejouer
-- sur la base existante ne modifie rien, il documente juste la structure dans
-- le repo et réactive le RLS.
--
-- Clé primaire = code (pas d'id). Champ type (trial | broker | lifetime).
-- Modèle status (available | used | revoked). Contrainte de cohérence : un code
-- 'used' DOIT avoir used_by_user_id + used_at ; un code non-'used' DOIT les
-- avoir à null.
--
-- Accès SERVEUR uniquement via service_role (RLS activé, aucune policy client) :
-- ni génération ni énumération possibles depuis le navigateur.

create table if not exists public.access_codes (
  code            text        primary key,
  status          text        not null default 'available',
  type            text        not null default 'trial',
  used_by_user_id uuid        references auth.users(id) on delete set null,
  used_at         timestamptz,
  created_at      timestamptz not null default now(),
  expires_at      timestamptz,
  constraint access_codes_status_check
    check (status in ('available', 'used', 'revoked')),
  constraint access_codes_type_check
    check (type in ('trial', 'broker', 'lifetime')),
  constraint access_codes_used_consistency check (
    (status = 'used' and used_by_user_id is not null and used_at is not null)
    or
    (status <> 'used' and used_by_user_id is null and used_at is null)
  )
);

-- ─── Row Level Security ─────────────────────────────────────────────────────
-- Réactivation après désactivation manuelle de test. Aucune policy pour
-- anon / authenticated : tout accès passe par le service_role (qui bypass RLS).
-- Le signUp serveur et la page admin utilisent le service role.
alter table public.access_codes enable row level security;
