-- ─── Extension : codes de déblocage de compte scopés par groupe ──────────────
--
-- N'AJOUTE QUE des colonnes NULLABLES + une policy de lecture + une valeur
-- supplémentaire sur la contrainte de type existante. Ne modifie, ne supprime
-- et ne réécrit AUCUNE ligne existante de access_codes : les codes déjà
-- générés par le Super Admin (console /admin/codes) gardent group_id = null
-- et duration_days = null, et restent invisibles pour tout admin de groupe
-- (policy ci-dessous). Aucune donnée existante n'est modifiée.
--
-- group_id nullable car access_codes est un système préexistant, plus large
-- que le programme de fidélité (inscription gated / accès premium) : un code
-- global (Super Admin, sans groupe) reste possible et continue de fonctionner
-- à l'identique.
--
-- type 'duration' : nouvelle valeur, en plus de trial|broker|lifetime déjà
-- existants (jamais retirés). Un admin de groupe choisit librement entre
-- 'lifetime' (réutilise tel quel le mécanisme lifetime déjà existant, aucune
-- date d'expiration effective) et 'duration' (durée en jours choisie par
-- l'admin, cf. duration_days) — jamais 'trial'/'broker', réservés au Super
-- Admin. Aucune limite métier de quantité, de durée, ou de protection de la
-- monétisation n'est imposée pour les codes de groupe.
--
-- Écriture : toujours réservée à service_role (aucune policy INSERT/UPDATE/
-- DELETE pour authenticated, cohérent avec l'existant) — la génération et la
-- révocation par un admin de groupe passent par des Server Actions dans
-- app/[locale]/master/actions.ts, qui ré-autorisent via authorizeGroupWrite
-- (même garde que pour les codes de points).
--
-- TRANSACTION : BEGIN/COMMIT explicites — voir la même remarque en tête de
-- 20260724120000_group_reference_code_and_shop.sql.
--
-- COHÉRENCE type/duration_days : access_codes_duration_consistency impose que
-- duration_days soit renseigné (et > 0) SI ET SEULEMENT SI type = 'duration'.
-- Vérifié contre les données réelles avant écriture de cette migration : les
-- 60 lignes actuelles (trial:23, lifetime:36, broker:1) ont toutes
-- type <> 'duration' et auront duration_days = NULL après l'ADD COLUMN (pas
-- de DEFAULT) — la branche `type <> 'duration' and duration_days is null` de
-- la contrainte les couvre toutes sans exception.

begin;

-- group_id : uuid SIMPLE, SANS clé étrangère physique vers partner_groups.
-- Interdiction permanente (cf. en-tête de 20260724120000, incident SQLSTATE
-- XX001) : ajouter une FK ici obligerait Postgres à verrouiller/valider
-- partner_groups, exactement le risque à éviter. L'existence et le statut du
-- groupe sont vérifiés par un SELECT explicite côté application
-- (authorizeGroupWrite, lib/loyalty/access.ts), jamais par une contrainte.
alter table public.access_codes
  add column group_id uuid;

alter table public.access_codes
  add column duration_days integer;

alter table public.access_codes
  add constraint access_codes_duration_consistency check (
    (type = 'duration' and duration_days is not null and duration_days > 0)
    or
    (type <> 'duration' and duration_days is null)
  );

alter table public.access_codes
  drop constraint access_codes_type_check;
alter table public.access_codes
  add constraint access_codes_type_check check (type in ('trial', 'broker', 'lifetime', 'duration'));

create index access_codes_group_id_idx on public.access_codes (group_id);

-- Un admin de groupe voit UNIQUEMENT les codes de SON groupe. Les codes
-- globaux (group_id is null) ne remontent JAMAIS via cette policy — seul
-- service_role (console Super Admin /admin/codes) les lit.
create policy access_codes_group_admin_select on public.access_codes
  for select to authenticated
  using (group_id is not null and public.is_group_admin(group_id));

commit;
