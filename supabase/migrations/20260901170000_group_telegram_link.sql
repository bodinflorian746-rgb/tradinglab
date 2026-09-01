-- ─── Lien Telegram cliquable du groupe (visible des membres) ────────────────
--
-- Contexte : l'onglet "Gagner" de /fidelite invite le membre à envoyer sa
-- contribution "sur Telegram" — ce mot doit devenir un lien cliquable vers le
-- groupe/canal Telegram, quand l'admin en a renseigné un.
--
-- POURQUOI UNE NOUVELLE TABLE (PAS UNE COLONNE SUR partner_groups NI SUR LE
-- CHAMP telegram_reference EXISTANT) :
--
--   1. partner_groups est en INTERDICTION PERMANENTE de toute opération
--      structurelle (ALTER TABLE, backfill, contrainte...) depuis l'incident
--      SQLSTATE XX001 (cf. migration 20260724120000, qui a introduit
--      partner_group_settings précisément pour cette raison). Toute nouvelle
--      donnée par groupe va dans une table indépendante — même stratégie que
--      reference_code, group_point_rules, group_completion_bonus.
--
--   2. Le champ existant `partner_groups.telegram_reference` (formulaire
--      TelegramEditForm, placeholder "@handle ou lien Telegram") est un texte
--      libre SANS garantie de forme : il peut contenir un handle Telegram, un
--      lien complet, une note ("Groupe privé, demander à l'admin"), ou tout
--      autre texte descriptif. Le RENDRE cliquable tel quel produirait des
--      liens morts ou incorrects pour tout admin ayant saisi autre chose
--      qu'une URL. Un champ DÉDIÉ, validé à l'écriture (doit être un handle
--      Telegram valide ou une URL https://t.me/…), garantit qu'une valeur non
--      nulle est TOUJOURS un lien exploitable — c'est la condition posée par
--      la mission ("si aucun lien n'est renseigné, la phrase reste en texte
--      simple, sans lien mort"). telegram_reference n'est PAS modifié ni
--      supprimé : les deux champs coexistent, à des fins différentes (note
--      libre pour l'admin vs lien cliquable pour les membres).
--
--   3. RLS : contrairement à partner_group_settings (lecture réservée aux
--      ADMINS du groupe, is_group_admin — reference_code ne doit pas fuiter
--      aux simples membres), ce nouveau champ doit être lisible par TOUT
--      membre actif (is_group_member) pour s'afficher dans l'onglet "Gagner".
--      Ajouter une policy is_group_member sur partner_group_settings
--      exposerait reference_code à tous les membres par la même occasion (RLS
--      filtre des LIGNES, pas des colonnes ; deux policies SELECT permissives
--      sur la même table s'additionnent en OR) — effet de bord non demandé
--      par cette mission. Une table séparée, dédiée à ce seul champ, évite
--      complètement le problème.
--
-- Écriture : Server Action service_role (authorizeGroupWrite, même garde que
-- updateGroupTelegramAction pour telegram_reference — cohérence avec son
-- voisin dans app/[locale]/master/actions.ts), aucune policy d'écriture ici.

begin;

create table public.group_telegram_link (
  group_id      uuid        primary key,
  telegram_link text,
  updated_at    timestamptz not null default now()
);

-- set_updated_at() définie en `create or replace` par 20260721120000 (déjà
-- rejouée plusieurs fois dans cette branche) — non redéfinie ici.
create trigger trg_group_telegram_link_updated_at
  before update on public.group_telegram_link
  for each row execute function public.set_updated_at();

alter table public.group_telegram_link enable row level security;

create policy group_telegram_link_select on public.group_telegram_link
  for select to authenticated
  using (public.is_group_member(group_id));

-- Aucune policy INSERT/UPDATE/DELETE pour authenticated : toute écriture
-- passe par service_role (updateGroupTelegramLinkAction, qui re-vérifie
-- authorizeGroupWrite à chaque appel).

commit;
