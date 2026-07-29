-- ─── Tests SQL du programme de fidélité (contraintes + isolation RLS) ────────
--
-- EXÉCUTION : à jouer APRÈS la migration 20260721120000_create_loyalty_program.
-- Fonctionne dans le SQL Editor Supabase OU via psql. Tout est encapsulé dans
-- une transaction begin/rollback → AUCUNE donnée n'est persistée (rollback final).
--
--   • SQL Editor : coller ce fichier entier, exécuter. Le rollback ne fire PAS
--     le trigger append-only (aucun DELETE réel n'est émis). Les `raise notice`
--     s'affichent dans l'onglet "Messages"/logs.
--   • psql      : psql "$DATABASE_URL" -f supabase/tests/loyalty_rls.test.sql
--
-- ⚠️ On NE crée PAS de faux auth.users : on référence 4 utilisateurs RÉELS via
-- les UUID ci-dessous. Remplace-les au besoin par des UUID retournés par :
--     select id, email from auth.users order by created_at desc;
--
--   admin_a  = 80fee2d1-0f4a-44f9-923a-850f4e560a47  (rst_...@example.com)
--   member_a = 072e57c1-540c-4a0e-8097-d4925d522b8a  (e2e_...@example.com)
--   admin_b  = 769f65c0-6c67-44fa-a5e8-4708e0d5743e  (c6b_...@example.com)
--   member_b = d234bd26-d685-477a-9e96-35855057e033  (c3_...@example.com)
--
-- Groupes de test : UUID dédiés (distincts d'éventuelles données de démo).

begin;

-- Setup (exécuté en tant que postgres/owner → RLS bypass pour l'amorçage).
insert into public.partner_groups (id, name, slug, created_by) values
  ('c0000000-0000-4000-8000-0000000000a1', 'TEST Groupe A', 'test-groupe-a', '80fee2d1-0f4a-44f9-923a-850f4e560a47'),
  ('c0000000-0000-4000-8000-0000000000b2', 'TEST Groupe B', 'test-groupe-b', '769f65c0-6c67-44fa-a5e8-4708e0d5743e');

insert into public.group_memberships (group_id, user_id, role) values
  ('c0000000-0000-4000-8000-0000000000a1', '80fee2d1-0f4a-44f9-923a-850f4e560a47', 'admin'),
  ('c0000000-0000-4000-8000-0000000000a1', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'member'),
  ('c0000000-0000-4000-8000-0000000000b2', '769f65c0-6c67-44fa-a5e8-4708e0d5743e', 'admin'),
  ('c0000000-0000-4000-8000-0000000000b2', 'd234bd26-d685-477a-9e96-35855057e033', 'member');

-- Un code disponible par groupe (pour les tests d'isolation / écriture, phase 3).
insert into public.points_codes (code, group_id, points_value) values
  ('PTS-TESTA-0001', 'c0000000-0000-4000-8000-0000000000a1', 10),
  ('PTS-TESTB-0001', 'c0000000-0000-4000-8000-0000000000b2', 20);

-- ─── 1. Unicité d'une adhésion (group_id + user_id) ──────────────────────────
do $$
begin
  begin
    insert into public.group_memberships (group_id, user_id, role)
    values ('c0000000-0000-4000-8000-0000000000a1', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'admin');
    raise exception 'FAIL: doublon (group_id,user_id) accepté';
  exception when unique_violation then
    raise notice 'OK 1: unicité adhésion respectée';
  end;
end $$;

-- Un même user peut appartenir à plusieurs groupes (aucun échec attendu).
insert into public.group_memberships (group_id, user_id, role)
values ('c0000000-0000-4000-8000-0000000000b2', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'member');
do $$ begin raise notice 'OK 1bis: multi-groupes autorisé'; end $$;

-- ─── 2. points_value > 0 ─────────────────────────────────────────────────────
do $$
begin
  begin
    insert into public.points_codes (code, group_id, points_value)
    values ('PTS-TEST-ZERO', 'c0000000-0000-4000-8000-0000000000a1', 0);
    raise exception 'FAIL: points_value = 0 accepté';
  exception when check_violation then raise notice 'OK 2a: points_value=0 refusé'; end;
  begin
    insert into public.points_codes (code, group_id, points_value)
    values ('PTS-TEST-NEG', 'c0000000-0000-4000-8000-0000000000a1', -5);
    raise exception 'FAIL: points_value négatif accepté';
  exception when check_violation then raise notice 'OK 2b: points_value<0 refusé'; end;
end $$;

-- ─── 3. Cohérence statut ↔ utilisation ───────────────────────────────────────
do $$
begin
  begin
    insert into public.points_codes (code, group_id, points_value, status, used_by_user_id, used_at)
    values ('PTS-TEST-AVL', 'c0000000-0000-4000-8000-0000000000a1', 10, 'available',
            '072e57c1-540c-4a0e-8097-d4925d522b8a', now());
    raise exception 'FAIL: available avec utilisateur accepté';
  exception when check_violation then raise notice 'OK 3a: available sans user imposé'; end;
  begin
    insert into public.points_codes (code, group_id, points_value, status)
    values ('PTS-TEST-USED', 'c0000000-0000-4000-8000-0000000000a1', 10, 'used');
    raise exception 'FAIL: used sans user/date accepté';
  exception when check_violation then raise notice 'OK 3b: used exige user+date'; end;
end $$;

-- ─── 4. points_ledger : signe + non-zéro + append-only ───────────────────────
insert into public.points_ledger (group_id, user_id, kind, amount)
values ('c0000000-0000-4000-8000-0000000000a1', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'code_reward', 50);

do $$
begin
  begin
    insert into public.points_ledger (group_id, user_id, kind, amount)
    values ('c0000000-0000-4000-8000-0000000000a1', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'code_reward', -5);
    raise exception 'FAIL: crédit négatif accepté';
  exception when check_violation then raise notice 'OK 4a: crédit doit être positif'; end;
  begin
    insert into public.points_ledger (group_id, user_id, kind, amount)
    values ('c0000000-0000-4000-8000-0000000000a1', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'purchase', 5);
    raise exception 'FAIL: débit positif accepté';
  exception when check_violation then raise notice 'OK 4b: débit doit être négatif'; end;
  begin
    insert into public.points_ledger (group_id, user_id, kind, amount)
    values ('c0000000-0000-4000-8000-0000000000a1', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'correction', 0);
    raise exception 'FAIL: montant 0 accepté';
  exception when check_violation then raise notice 'OK 4c: montant 0 refusé'; end;
  -- append-only : UPDATE et DELETE bloqués par trigger
  begin
    update public.points_ledger set amount = 999
      where group_id = 'c0000000-0000-4000-8000-0000000000a1';
    raise exception 'FAIL: UPDATE du ledger accepté';
  exception when others then raise notice 'OK 4d: UPDATE ledger bloqué (%)', sqlerrm; end;
  begin
    delete from public.points_ledger
      where group_id = 'c0000000-0000-4000-8000-0000000000a1';
    raise exception 'FAIL: DELETE du ledger accepté';
  exception when others then raise notice 'OK 4e: DELETE ledger bloqué (%)', sqlerrm; end;
end $$;

-- ─── 5. Calcul solde + total gagné à partir du ledger ────────────────────────
insert into public.points_ledger (group_id, user_id, kind, amount) values
  ('c0000000-0000-4000-8000-0000000000a1', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'tier_bonus', 25),
  ('c0000000-0000-4000-8000-0000000000a1', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'purchase', -30);
do $$
declare bal integer; earned integer;
begin
  select coalesce(sum(amount),0) into bal
    from public.points_ledger
    where user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a'
      and group_id = 'c0000000-0000-4000-8000-0000000000a1';
  select coalesce(sum(amount),0) into earned
    from public.points_ledger
    where user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a'
      and group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and amount > 0 and kind not in ('purchase','manual_debit');
  if bal <> 45 then raise exception 'FAIL: solde attendu 45, obtenu %', bal; end if;
  if earned <> 75 then raise exception 'FAIL: gagné attendu 75, obtenu %', earned; end if;
  raise notice 'OK 5: solde=45, gagné=75';
end $$;

-- ─── 6. Isolation RLS ────────────────────────────────────────────────────────
set local role authenticated;

-- Membre A : ne voit QUE ses opérations, aucune d'un autre user.
set local request.jwt.claims = '{"sub":"072e57c1-540c-4a0e-8097-d4925d522b8a","role":"authenticated"}';
do $$
declare n_foreign integer; n_self integer;
begin
  select count(*) into n_foreign from public.points_ledger
    where user_id <> '072e57c1-540c-4a0e-8097-d4925d522b8a';
  if n_foreign <> 0 then raise exception 'FAIL: membre A voit des opérations d''autrui (%)', n_foreign; end if;
  select count(*) into n_self from public.points_ledger;
  if n_self = 0 then raise exception 'FAIL: membre A ne voit pas ses propres opérations'; end if;
  raise notice 'OK 6a: membre A isolé (self=%, foreign=0)', n_self;
end $$;

-- Admin B : ne voit QUE le groupe B, jamais le groupe A.
set local request.jwt.claims = '{"sub":"769f65c0-6c67-44fa-a5e8-4708e0d5743e","role":"authenticated"}';
do $$
declare n_group_a integer; sees_a boolean;
begin
  select count(*) into n_group_a from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1';
  if n_group_a <> 0 then raise exception 'FAIL: admin B voit le ledger du groupe A (%)', n_group_a; end if;
  select exists(select 1 from public.partner_groups
    where id = 'c0000000-0000-4000-8000-0000000000a1') into sees_a;
  if sees_a then raise exception 'FAIL: admin B voit le groupe A'; end if;
  raise notice 'OK 6b: admin B isolé du groupe A';
end $$;

-- ─── 7. Group Admin (phase 3) : isolation des codes + écritures refusées ─────
-- Admin A voit les codes de SON groupe, pas ceux du groupe B.
set local request.jwt.claims = '{"sub":"80fee2d1-0f4a-44f9-923a-850f4e560a47","role":"authenticated"}';
do $$
declare n_a integer; n_b integer;
begin
  select count(*) into n_a from public.points_codes
    where group_id = 'c0000000-0000-4000-8000-0000000000a1';
  select count(*) into n_b from public.points_codes
    where group_id = 'c0000000-0000-4000-8000-0000000000b2';
  if n_a = 0 then raise exception 'FAIL: admin A ne voit pas les codes de son groupe'; end if;
  if n_b <> 0 then raise exception 'FAIL: admin A voit les codes du groupe B (%)', n_b; end if;
  raise notice 'OK 7a: codes isolés (A=%, B=0)', n_a;
end $$;

-- Écritures interdites pour authenticated (aucune policy INSERT/UPDATE) :
-- l'espace Master écrit UNIQUEMENT via des Server Actions en service_role.
do $$
begin
  -- INSERT → violation RLS (aucune policy with check).
  begin
    insert into public.points_codes (code, group_id, points_value)
    values ('PTS-HACK-0001', 'c0000000-0000-4000-8000-0000000000a1', 5);
    raise exception 'FAIL: INSERT points_codes autorisé pour authenticated';
  exception
    when insufficient_privilege then raise notice 'OK 7b: INSERT points_codes refusé';
    when others then raise notice 'OK 7b: INSERT points_codes refusé (%)', sqlerrm;
  end;
  -- UPDATE → aucune policy : 0 ligne visible pour modification, le code reste inchangé.
  update public.points_codes set status = 'revoked' where code = 'PTS-TESTA-0001';
  if exists (select 1 from public.points_codes
             where code = 'PTS-TESTA-0001' and status = 'revoked') then
    raise exception 'FAIL: UPDATE points_codes a modifié le code';
  end if;
  raise notice 'OK 7c: UPDATE points_codes sans effet (aucune policy)';
end $$;

reset role;

-- ─── 8. RPC activate_points_code (phase 4, espace Membre) ───────────────────
-- Utilisateur de test : d234bd26 (déjà membre du groupe B, PAS du groupe A) —
-- sert à vérifier l'auto-join sur le groupe A lors de l'activation.
insert into public.points_codes (code, group_id, points_value) values
  ('PTS-RPCTEST-01', 'c0000000-0000-4000-8000-0000000000a1', 30);
insert into public.points_codes (code, group_id, points_value, expires_at) values
  ('PTS-RPCTEST-EXP', 'c0000000-0000-4000-8000-0000000000a1', 15, now() - interval '1 day');

-- 8a. Seul service_role peut appeler la RPC : authenticated doit être refusé.
set local role authenticated;
set local request.jwt.claims = '{"sub":"d234bd26-d685-477a-9e96-35855057e033","role":"authenticated"}';
do $$
begin
  begin
    perform * from public.activate_points_code('PTS-RPCTEST-01', 'd234bd26-d685-477a-9e96-35855057e033');
    raise exception 'FAIL: authenticated a pu appeler activate_points_code';
  exception
    when insufficient_privilege then raise notice 'OK 8a: RPC refusée pour authenticated';
    when others then raise notice 'OK 8a: RPC refusée pour authenticated (%)', sqlerrm;
  end;
end $$;
reset role;

-- 8b. Activation réussie : consomme le code, crédite, auto-join du groupe A.
do $$
declare r record;
begin
  select * into r from public.activate_points_code(
    'PTS-RPCTEST-01', 'd234bd26-d685-477a-9e96-35855057e033');
  if r.result <> 'ok' then raise exception 'FAIL: résultat attendu ok, obtenu %', r.result; end if;
  if r.credited_points <> 30 then raise exception 'FAIL: credited_points attendu 30, obtenu %', r.credited_points; end if;
  if r.result_group_id <> 'c0000000-0000-4000-8000-0000000000a1' then
    raise exception 'FAIL: group_id inattendu %', r.result_group_id;
  end if;
  raise notice 'OK 8b: activation réussie (+% pts, groupe %)', r.credited_points, r.result_group_id;
end $$;

-- 8c. Effets de bord vérifiés : code consommé, adhésion créée, ledger crédité.
do $$
declare n_membership integer; n_ledger integer; c_status text; c_used uuid;
begin
  select status, used_by_user_id into c_status, c_used
    from public.points_codes where code = 'PTS-RPCTEST-01';
  if c_status <> 'used' or c_used <> 'd234bd26-d685-477a-9e96-35855057e033' then
    raise exception 'FAIL: code non marqué used/used_by correctement (status=%, used_by=%)', c_status, c_used;
  end if;

  select count(*) into n_membership from public.group_memberships
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033'
      and role = 'member' and status = 'active';
  if n_membership <> 1 then raise exception 'FAIL: auto-join absent ou dupliqué (%)', n_membership; end if;

  select count(*) into n_ledger from public.points_ledger
    where points_code = 'PTS-RPCTEST-01' and kind = 'code_reward' and amount = 30
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033';
  if n_ledger <> 1 then raise exception 'FAIL: crédit ledger absent ou dupliqué (%)', n_ledger; end if;

  raise notice 'OK 8c: code consommé + auto-join + crédit ledger cohérents';
end $$;

-- 8d. Double activation du même code → already_used, AUCUN double crédit.
do $$
declare r record; n_ledger integer;
begin
  select * into r from public.activate_points_code(
    'PTS-RPCTEST-01', 'd234bd26-d685-477a-9e96-35855057e033');
  if r.result <> 'already_used' then raise exception 'FAIL: attendu already_used, obtenu %', r.result; end if;
  select count(*) into n_ledger from public.points_ledger where points_code = 'PTS-RPCTEST-01';
  if n_ledger <> 1 then raise exception 'FAIL: double crédit détecté (%)', n_ledger; end if;
  raise notice 'OK 8d: double activation refusée, aucun double crédit';
end $$;

-- 8e. Code expiré → expired, statut figé côté points_codes.
do $$
declare r record; c_status text;
begin
  select * into r from public.activate_points_code(
    'PTS-RPCTEST-EXP', 'd234bd26-d685-477a-9e96-35855057e033');
  if r.result <> 'expired' then raise exception 'FAIL: attendu expired, obtenu %', r.result; end if;
  select status into c_status from public.points_codes where code = 'PTS-RPCTEST-EXP';
  if c_status <> 'expired' then raise exception 'FAIL: statut non figé à expired (%)', c_status; end if;
  raise notice 'OK 8e: code expiré détecté et figé';
end $$;

-- 8f. Code inconnu → not_found.
do $$
declare r record;
begin
  select * into r from public.activate_points_code(
    'PTS-DOES-NOT-EXIST', 'd234bd26-d685-477a-9e96-35855057e033');
  if r.result <> 'not_found' then raise exception 'FAIL: attendu not_found, obtenu %', r.result; end if;
  raise notice 'OK 8f: code inconnu → not_found';
end $$;

-- ─── 9. Groupe suspendu : blocage total, y compris pour un membre déjà présent
-- Groupe C dédié, status='suspended' dès la création, avec member_a déjà
-- membre actif (le cas exact visé par la règle : "même les membres déjà
-- présents" doivent être bloqués).
insert into public.partner_groups (id, name, slug, status, created_by) values
  ('c0000000-0000-4000-8000-0000000000c3', 'TEST Groupe C (suspendu)', 'test-groupe-c', 'suspended',
   '80fee2d1-0f4a-44f9-923a-850f4e560a47');
insert into public.group_memberships (group_id, user_id, role, status) values
  ('c0000000-0000-4000-8000-0000000000c3', '072e57c1-540c-4a0e-8097-d4925d522b8a', 'member', 'active');
insert into public.points_codes (code, group_id, points_value) values
  ('PTS-RPCTEST-SUSP', 'c0000000-0000-4000-8000-0000000000c3', 20);

do $$
declare r record; c_status text; n_ledger integer;
begin
  select * into r from public.activate_points_code(
    'PTS-RPCTEST-SUSP', '072e57c1-540c-4a0e-8097-d4925d522b8a');
  if r.result <> 'group_suspended' then
    raise exception 'FAIL: attendu group_suspended, obtenu %', r.result;
  end if;
  if r.credited_points is not null then
    raise exception 'FAIL: credited_points devrait être null, obtenu %', r.credited_points;
  end if;

  -- Le code ne doit PAS avoir été consommé : toujours 'available'.
  select status into c_status from public.points_codes where code = 'PTS-RPCTEST-SUSP';
  if c_status <> 'available' then
    raise exception 'FAIL: code consommé malgré groupe suspendu (status=%)', c_status;
  end if;

  -- Aucun crédit ne doit avoir été inséré dans le ledger.
  select count(*) into n_ledger from public.points_ledger where points_code = 'PTS-RPCTEST-SUSP';
  if n_ledger <> 0 then raise exception 'FAIL: crédit inséré malgré groupe suspendu (%)', n_ledger; end if;

  raise notice 'OK 9: activation refusée sur groupe suspendu (code intact, aucun crédit)';
end $$;

-- ─── 10. RPC join_group_by_reference_code (extension magasin + rattachement) ─
-- Groupe D (actif, dédié aux tests de rattachement) + Groupe E (suspendu).
insert into public.partner_groups (id, name, slug, status, created_by) values
  ('c0000000-0000-4000-8000-0000000000d4', 'TEST Groupe D', 'test-groupe-d', 'active',
   '80fee2d1-0f4a-44f9-923a-850f4e560a47'),
  ('c0000000-0000-4000-8000-0000000000e5', 'TEST Groupe E (suspendu)', 'test-groupe-e', 'suspended',
   '80fee2d1-0f4a-44f9-923a-850f4e560a47');

-- reference_code vit dans partner_group_settings (pas de FK physique vers
-- partner_groups — cf. 20260724120000, réécriture post-incident SQLSTATE
-- XX001). Insérée manuellement ici car ces groupes de test sont créés par
-- INSERT direct, pas via create_group_with_admins.
insert into public.partner_group_settings (group_id, reference_code) values
  ('c0000000-0000-4000-8000-0000000000d4', 'GRP-TEST-000D'),
  ('c0000000-0000-4000-8000-0000000000e5', 'GRP-TEST-000E');

-- 10a. Seul service_role peut appeler la RPC : authenticated doit être refusé.
set local role authenticated;
set local request.jwt.claims = '{"sub":"072e57c1-540c-4a0e-8097-d4925d522b8a","role":"authenticated"}';
do $$
declare v_ref text;
begin
  select reference_code into v_ref from public.partner_group_settings
    where group_id ='c0000000-0000-4000-8000-0000000000d4';
  begin
    perform * from public.join_group_by_reference_code(v_ref, '072e57c1-540c-4a0e-8097-d4925d522b8a');
    raise exception 'FAIL: authenticated a pu appeler join_group_by_reference_code';
  exception
    when insufficient_privilege then raise notice 'OK 10a: RPC refusée pour authenticated';
    when others then raise notice 'OK 10a: RPC refusée pour authenticated (%)', sqlerrm;
  end;
end $$;
reset role;

-- 10b. Rattachement neuf : rôle toujours 'member', jamais 'admin'.
do $$
declare v_ref text; r record; n integer;
begin
  select reference_code into v_ref from public.partner_group_settings
    where group_id ='c0000000-0000-4000-8000-0000000000d4';
  select * into r from public.join_group_by_reference_code(v_ref, '072e57c1-540c-4a0e-8097-d4925d522b8a');
  if r.result <> 'ok' then raise exception 'FAIL: attendu ok, obtenu %', r.result; end if;

  select count(*) into n from public.group_memberships
    where group_id = 'c0000000-0000-4000-8000-0000000000d4'
      and user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a'
      and role = 'member' and status = 'active';
  if n <> 1 then raise exception 'FAIL: adhésion neuve absente/incorrecte (%)', n; end if;
  raise notice 'OK 10b: rattachement neuf, rôle member';
end $$;

-- 10c. Réactivation : une adhésion 'admin' suspendue redevient active SANS
-- jamais perdre ni gagner de droits (le rôle n'est jamais touché par la RPC).
insert into public.group_memberships (group_id, user_id, role, status) values
  ('c0000000-0000-4000-8000-0000000000d4', '769f65c0-6c67-44fa-a5e8-4708e0d5743e', 'admin', 'suspended');
do $$
declare v_ref text; r record; v_role text; v_status text;
begin
  select reference_code into v_ref from public.partner_group_settings
    where group_id ='c0000000-0000-4000-8000-0000000000d4';
  select * into r from public.join_group_by_reference_code(v_ref, '769f65c0-6c67-44fa-a5e8-4708e0d5743e');
  if r.result <> 'ok' then raise exception 'FAIL: attendu ok, obtenu %', r.result; end if;

  select role, status into v_role, v_status from public.group_memberships
    where group_id = 'c0000000-0000-4000-8000-0000000000d4'
      and user_id = '769f65c0-6c67-44fa-a5e8-4708e0d5743e';
  if v_status <> 'active' then raise exception 'FAIL: statut non réactivé (%)', v_status; end if;
  if v_role <> 'admin' then raise exception 'FAIL: rôle altéré lors de la réactivation (%)', v_role; end if;
  raise notice 'OK 10c: réactivation sans altération du rôle (admin conservé)';
end $$;

-- 10d. Déjà membre actif → already_member (idempotent, pas de doublon).
do $$
declare v_ref text; r record; n integer;
begin
  select reference_code into v_ref from public.partner_group_settings
    where group_id ='c0000000-0000-4000-8000-0000000000d4';
  select * into r from public.join_group_by_reference_code(v_ref, '072e57c1-540c-4a0e-8097-d4925d522b8a');
  if r.result <> 'already_member' then raise exception 'FAIL: attendu already_member, obtenu %', r.result; end if;
  select count(*) into n from public.group_memberships
    where group_id = 'c0000000-0000-4000-8000-0000000000d4'
      and user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a';
  if n <> 1 then raise exception 'FAIL: doublon d''adhésion créé (%)', n; end if;
  raise notice 'OK 10d: already_member, aucun doublon';
end $$;

-- 10e. Groupe suspendu → refus, aucune adhésion créée.
do $$
declare v_ref text; r record; n integer;
begin
  select reference_code into v_ref from public.partner_group_settings
    where group_id ='c0000000-0000-4000-8000-0000000000e5';
  select * into r from public.join_group_by_reference_code(v_ref, 'd234bd26-d685-477a-9e96-35855057e033');
  if r.result <> 'group_suspended' then raise exception 'FAIL: attendu group_suspended, obtenu %', r.result; end if;
  select count(*) into n from public.group_memberships
    where group_id = 'c0000000-0000-4000-8000-0000000000e5'
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033';
  if n <> 0 then raise exception 'FAIL: adhésion créée malgré groupe suspendu (%)', n; end if;
  raise notice 'OK 10e: rattachement refusé sur groupe suspendu';
end $$;

-- 10f. Code de référence inconnu → not_found.
do $$
declare r record;
begin
  select * into r from public.join_group_by_reference_code(
    'GRP-DOES-NOT-EXIST', 'd234bd26-d685-477a-9e96-35855057e033');
  if r.result <> 'not_found' then raise exception 'FAIL: attendu not_found, obtenu %', r.result; end if;
  raise notice 'OK 10f: code de référence inconnu → not_found';
end $$;

-- ─── 11. RPC purchase_shop_item (magasin par groupe) ─────────────────────────
-- Articles de test : 2 actifs + 1 inactif dans le groupe A, 1 actif dans le
-- groupe C (suspendu, member_a y est déjà membre actif — cf. section 9),
-- 1 actif dans le groupe D (admin_a n'y est PAS membre).
insert into public.group_shop_items (id, group_id, name, item_type, price_points, status) values
  ('d0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-0000000000a1', 'Article Test', 'product', 40, 'active'),
  ('d0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-0000000000a1', 'Article Trop Cher', 'reward', 999, 'active'),
  ('d0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-0000000000a1', 'Article Inactif', 'product', 10, 'inactive'),
  ('d0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-0000000000c3', 'Article Groupe Suspendu', 'product', 5, 'active'),
  ('d0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-0000000000d4', 'Article Groupe D', 'product', 1, 'active');

-- 11a. Seul service_role peut appeler la RPC.
set local role authenticated;
set local request.jwt.claims = '{"sub":"072e57c1-540c-4a0e-8097-d4925d522b8a","role":"authenticated"}';
do $$
begin
  begin
    perform * from public.purchase_shop_item(
      'd0000000-0000-4000-8000-000000000001', '072e57c1-540c-4a0e-8097-d4925d522b8a', gen_random_uuid());
    raise exception 'FAIL: authenticated a pu appeler purchase_shop_item';
  exception
    when insufficient_privilege then raise notice 'OK 11a: RPC refusée pour authenticated';
    when others then raise notice 'OK 11a: RPC refusée pour authenticated (%)', sqlerrm;
  end;
end $$;
reset role;

-- 11b. Achat réussi : débite le ledger (kind='purchase'), crée l'achat avec le
-- prix figé au moment de la transaction. member_a a un solde de 45 (section 5).
do $$
declare r record; n_ledger integer; n_purchase integer; bal integer;
begin
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000001', '072e57c1-540c-4a0e-8097-d4925d522b8a', gen_random_uuid());
  if r.result <> 'ok' then raise exception 'FAIL: attendu ok, obtenu %', r.result; end if;
  if r.result_price_paid <> 40 then raise exception 'FAIL: prix payé attendu 40, obtenu %', r.result_price_paid; end if;

  select count(*) into n_ledger from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a'
      and kind = 'purchase' and amount = -40;
  if n_ledger <> 1 then raise exception 'FAIL: débit ledger absent ou incorrect (%)', n_ledger; end if;

  select count(*) into n_purchase from public.group_shop_purchases
    where item_id = 'd0000000-0000-4000-8000-000000000001'
      and user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a' and price_paid = 40;
  if n_purchase <> 1 then raise exception 'FAIL: ligne d''achat absente ou incorrecte (%)', n_purchase; end if;

  select coalesce(sum(amount),0) into bal from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a';
  if bal <> 5 then raise exception 'FAIL: solde attendu 5 après achat, obtenu %', bal; end if;

  raise notice 'OK 11b: achat débité (-40), ligne d''achat créée, solde=5';
end $$;

-- 11c. Prix figé : une modification ultérieure du prix par le gestionnaire ne
-- doit JAMAIS altérer le prix déjà payé dans l'historique.
update public.group_shop_items set price_points = 9999
  where id = 'd0000000-0000-4000-8000-000000000001';
do $$
declare v_price_paid integer;
begin
  select price_paid into v_price_paid from public.group_shop_purchases
    where item_id = 'd0000000-0000-4000-8000-000000000001'
      and user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a';
  if v_price_paid <> 40 then
    raise exception 'FAIL: prix payé historique altéré (%), attendu 40', v_price_paid;
  end if;
  raise notice 'OK 11c: prix payé figé à 40 malgré la modification du prix courant';
end $$;

-- 11d. Solde insuffisant → refus, aucun débit, aucun achat créé (couvre aussi
-- la répétition d'une requête : retenter le même achat après un solde épuisé
-- échoue systématiquement, sans jamais laisser passer un double débit).
do $$
declare r record; n_ledger integer;
begin
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000002', '072e57c1-540c-4a0e-8097-d4925d522b8a', gen_random_uuid());
  if r.result <> 'insufficient_balance' then
    raise exception 'FAIL: attendu insufficient_balance, obtenu %', r.result;
  end if;

  -- Répétition avec une clé DIFFÉRENTE (nouvelle tentative volontaire, pas un
  -- rejeu) : doit être réévaluée normalement et échouer pour la même raison
  -- métier (solde toujours insuffisant), sans jamais laisser passer un débit.
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000001', '072e57c1-540c-4a0e-8097-d4925d522b8a', gen_random_uuid());
  if r.result <> 'insufficient_balance' then
    raise exception 'FAIL: retenter le même achat aurait dû échouer (%)', r.result;
  end if;

  -- 2 attendu, pas 1 : la section 5 a déjà planté une ligne kind='purchase'
  -- (amount=-30) pour tester le calcul de solde, avant même le premier achat
  -- RPC réel de la section 11b (amount=-40). Ce test vérifie qu'AUCUNE ligne
  -- supplémentaire n'est apparue depuis 11b — pas que la table est vierge.
  select count(*) into n_ledger from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a' and kind = 'purchase';
  if n_ledger <> 2 then raise exception 'FAIL: débit(s) supplémentaire(s) détecté(s) (%, attendu 2)', n_ledger; end if;
  raise notice 'OK 11d: solde insuffisant refusé, aucun double débit même en répétant la requête';
end $$;

-- 11e. Article inactif → refus.
do $$
declare r record;
begin
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000003', '072e57c1-540c-4a0e-8097-d4925d522b8a', gen_random_uuid());
  if r.result <> 'item_inactive' then raise exception 'FAIL: attendu item_inactive, obtenu %', r.result; end if;
  raise notice 'OK 11e: article inactif refusé';
end $$;

-- 11f. Groupe suspendu → refus (member_a est pourtant déjà membre actif du
-- groupe C, cf. section 9 : la suspension prime sur l'adhésion).
do $$
declare r record;
begin
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000004', '072e57c1-540c-4a0e-8097-d4925d522b8a', gen_random_uuid());
  if r.result <> 'group_suspended' then raise exception 'FAIL: attendu group_suspended, obtenu %', r.result; end if;
  raise notice 'OK 11f: achat refusé sur groupe suspendu';
end $$;

-- 11g. Non membre du groupe → refus (admin_a n'a jamais rejoint le groupe D).
do $$
declare r record;
begin
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000005', '80fee2d1-0f4a-44f9-923a-850f4e560a47', gen_random_uuid());
  if r.result <> 'not_member' then raise exception 'FAIL: attendu not_member, obtenu %', r.result; end if;
  raise notice 'OK 11g: achat refusé pour un non-membre';
end $$;

-- 11h. Article inconnu → not_found.
do $$
declare r record;
begin
  select * into r from public.purchase_shop_item(
    '00000000-0000-4000-8000-000000000000', '072e57c1-540c-4a0e-8097-d4925d522b8a', gen_random_uuid());
  if r.result <> 'not_found' then raise exception 'FAIL: attendu not_found, obtenu %', r.result; end if;
  raise notice 'OK 11h: article inconnu → not_found';
end $$;

-- ─── 12. Isolation RLS : group_shop_items / group_shop_purchases ─────────────
set local role authenticated;

-- 12a. Membre : ne voit que les articles ACTIFS de son groupe (jamais les
-- inactifs, réservés au gestionnaire).
set local request.jwt.claims = '{"sub":"072e57c1-540c-4a0e-8097-d4925d522b8a","role":"authenticated"}';
do $$
declare n_inactive integer; n_active integer;
begin
  select count(*) into n_inactive from public.group_shop_items
    where group_id = 'c0000000-0000-4000-8000-0000000000a1' and status = 'inactive';
  if n_inactive <> 0 then raise exception 'FAIL: membre voit un article inactif (%)', n_inactive; end if;
  select count(*) into n_active from public.group_shop_items
    where group_id = 'c0000000-0000-4000-8000-0000000000a1' and status = 'active';
  if n_active = 0 then raise exception 'FAIL: membre ne voit aucun article actif de son groupe'; end if;
  raise notice 'OK 12a: membre isolé (actifs=%, inactifs=0)', n_active;
end $$;

-- 12b. Gestionnaire : voit TOUS les statuts de son propre groupe.
set local request.jwt.claims = '{"sub":"80fee2d1-0f4a-44f9-923a-850f4e560a47","role":"authenticated"}';
do $$
declare n_all integer;
begin
  select count(*) into n_all from public.group_shop_items
    where group_id = 'c0000000-0000-4000-8000-0000000000a1';
  if n_all <> 3 then raise exception 'FAIL: gestionnaire attend 3 articles (actifs+inactif), obtenu %', n_all; end if;
  raise notice 'OK 12b: gestionnaire voit tous les statuts de son groupe (%)', n_all;
end $$;

-- 12c. Isolation inter-groupes : admin B (jamais admin/membre du groupe A) ne
-- voit aucun article du groupe A, même actif.
set local request.jwt.claims = '{"sub":"769f65c0-6c67-44fa-a5e8-4708e0d5743e","role":"authenticated"}';
do $$
declare n_a integer;
begin
  select count(*) into n_a from public.group_shop_items
    where group_id = 'c0000000-0000-4000-8000-0000000000a1';
  if n_a <> 0 then raise exception 'FAIL: admin B voit les articles du groupe A (%)', n_a; end if;
  raise notice 'OK 12c: isolation inter-groupes respectée (articles)';
end $$;

-- 12d. Achats : l'acheteur voit son propre achat ; un autre membre du MÊME
-- groupe (non acheteur, non admin) n'y a pas accès.
set local request.jwt.claims = '{"sub":"072e57c1-540c-4a0e-8097-d4925d522b8a","role":"authenticated"}';
do $$
declare n_own integer;
begin
  select count(*) into n_own from public.group_shop_purchases
    where item_id = 'd0000000-0000-4000-8000-000000000001'
      and user_id = '072e57c1-540c-4a0e-8097-d4925d522b8a';
  if n_own <> 1 then raise exception 'FAIL: acheteur ne voit pas son propre achat (%)', n_own; end if;
  raise notice 'OK 12d: acheteur voit son propre achat';
end $$;

-- member_b a été auto-rattaché au groupe A lors de l'activation (section 8) :
-- membre du groupe, mais n'a rien acheté et n'est pas admin → 0 visible.
set local request.jwt.claims = '{"sub":"d234bd26-d685-477a-9e96-35855057e033","role":"authenticated"}';
do $$
declare n_foreign integer;
begin
  select count(*) into n_foreign from public.group_shop_purchases
    where group_id = 'c0000000-0000-4000-8000-0000000000a1';
  if n_foreign <> 0 then raise exception 'FAIL: membre non acheteur voit les achats d''autrui (%)', n_foreign; end if;
  raise notice 'OK 12e: membre non acheteur isolé des achats d''autrui';
end $$;

-- 12f. Gestionnaire : voit tous les achats de son groupe (y compris ceux d'un
-- autre membre que lui-même).
set local request.jwt.claims = '{"sub":"80fee2d1-0f4a-44f9-923a-850f4e560a47","role":"authenticated"}';
do $$
declare n_admin_view integer;
begin
  select count(*) into n_admin_view from public.group_shop_purchases
    where group_id = 'c0000000-0000-4000-8000-0000000000a1';
  if n_admin_view <> 1 then raise exception 'FAIL: gestionnaire attend 1 achat visible, obtenu %', n_admin_view; end if;
  raise notice 'OK 12f: gestionnaire voit les achats de son groupe';
end $$;

reset role;

-- ─── 13. Idempotence réelle de purchase_shop_item (idempotency_key) ──────────
-- member_b (déjà membre actif du groupe A depuis la section 8, solde de 30
-- points issus de l'activation PTS-RPCTEST-01, jamais utilisé pour un achat
-- avant ce point) : terrain propre, indépendant du solde de member_a épuisé
-- en section 11.
insert into public.group_shop_items (id, group_id, name, item_type, price_points, status) values
  ('d0000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-0000000000a1', 'Article Idempotence I', 'product', 10, 'active'),
  ('d0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-0000000000a1', 'Article Idempotence J', 'product', 10, 'active'),
  ('d0000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-0000000000a1', 'Article Idempotence K', 'product', 15, 'active');

-- 13a. Deux appels avec la MÊME clé (tentative rejouée : double clic, requête
-- répétée) → un seul débit, un seul achat. Le 2e appel renvoie
-- 'already_processed' avec exactement le même purchase_id et le même prix.
do $$
declare
  v_key uuid := 'f0000000-0000-4000-8000-000000000001';
  r1 record; r2 record; n_ledger integer; n_purchase integer; bal integer;
begin
  select * into r1 from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000006', 'd234bd26-d685-477a-9e96-35855057e033', v_key);
  if r1.result <> 'ok' then raise exception 'FAIL: 1er appel attendu ok, obtenu %', r1.result; end if;
  if r1.result_price_paid <> 10 then raise exception 'FAIL: prix payé attendu 10, obtenu %', r1.result_price_paid; end if;

  select * into r2 from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000006', 'd234bd26-d685-477a-9e96-35855057e033', v_key);
  if r2.result <> 'already_processed' then
    raise exception 'FAIL: 2e appel (même clé) attendu already_processed, obtenu %', r2.result;
  end if;
  if r2.result_purchase_id <> r1.result_purchase_id then
    raise exception 'FAIL: 2e appel renvoie un purchase_id différent (% vs %)', r2.result_purchase_id, r1.result_purchase_id;
  end if;
  if r2.result_price_paid <> r1.result_price_paid then
    raise exception 'FAIL: 2e appel renvoie un prix différent (% vs %)', r2.result_price_paid, r1.result_price_paid;
  end if;

  select count(*) into n_ledger from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033'
      and kind = 'purchase' and amount = -10;
  if n_ledger <> 1 then raise exception 'FAIL: débit dupliqué malgré la même clé (%)', n_ledger; end if;

  select count(*) into n_purchase from public.group_shop_purchases
    where user_id = 'd234bd26-d685-477a-9e96-35855057e033' and idempotency_key = v_key;
  if n_purchase <> 1 then raise exception 'FAIL: achat dupliqué malgré la même clé (%)', n_purchase; end if;

  select coalesce(sum(amount),0) into bal from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033';
  if bal <> 20 then raise exception 'FAIL: solde attendu 20 (30-10, un seul débit), obtenu %', bal; end if;

  raise notice 'OK 13a: même clé rejouée → un seul débit, un seul achat, solde=20';
end $$;

-- 13a2. La MÊME clé réutilisée pour un article DIFFÉRENT (item J au lieu de
-- l'item I acheté en 13a) doit être REJETÉE explicitement ('idempotency_key_reused'),
-- jamais traitée comme un succès pour le nouvel article ni confondue avec
-- l'achat existant de l'item I. Aucun débit, aucune ligne d'achat pour J.
do $$
declare
  v_key uuid := 'f0000000-0000-4000-8000-000000000001'; -- déjà utilisée en 13a pour l'item I
  r record; n_ledger_total integer; n_purchase_j integer; bal integer;
begin
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000007', 'd234bd26-d685-477a-9e96-35855057e033', v_key);
  if r.result <> 'idempotency_key_reused' then
    raise exception 'FAIL: attendu idempotency_key_reused, obtenu %', r.result;
  end if;
  if r.result_purchase_id is not null or r.result_price_paid is not null then
    raise exception 'FAIL: idempotency_key_reused doit renvoyer des champs vides (id=%, prix=%)',
      r.result_purchase_id, r.result_price_paid;
  end if;

  select count(*) into n_purchase_j from public.group_shop_purchases
    where item_id = 'd0000000-0000-4000-8000-000000000007';
  if n_purchase_j <> 0 then raise exception 'FAIL: achat créé pour J malgré le rejet (%)', n_purchase_j; end if;

  select count(*) into n_ledger_total from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033' and kind = 'purchase';
  if n_ledger_total <> 1 then raise exception 'FAIL: débit(s) inattendu(s) (%)', n_ledger_total; end if;

  select coalesce(sum(amount),0) into bal from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033';
  if bal <> 20 then raise exception 'FAIL: solde attendu inchangé à 20, obtenu %', bal; end if;

  raise notice 'OK 13a2: clé réutilisée pour un autre article → rejet explicite, aucun débit, solde inchangé=20';
end $$;

-- 13b. Deux achats VOLONTAIRES avec deux clés DIFFÉRENTES → les deux sont
-- autorisés tant que le solde suffit (ce n'est pas le rôle de la clé
-- d'idempotence de bloquer des achats distincts légitimes).
do $$
declare r1 record; r2 record; n_purchase integer; bal integer;
begin
  select * into r1 from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000007', 'd234bd26-d685-477a-9e96-35855057e033',
    'f0000000-0000-4000-8000-000000000002');
  if r1.result <> 'ok' then raise exception 'FAIL: 1er achat (clé A) attendu ok, obtenu %', r1.result; end if;

  select * into r2 from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000007', 'd234bd26-d685-477a-9e96-35855057e033',
    'f0000000-0000-4000-8000-000000000003');
  if r2.result <> 'ok' then raise exception 'FAIL: 2e achat (clé B) attendu ok, obtenu %', r2.result; end if;
  if r2.result_purchase_id = r1.result_purchase_id then
    raise exception 'FAIL: deux clés différentes ont produit le même achat';
  end if;

  select count(*) into n_purchase from public.group_shop_purchases
    where item_id = 'd0000000-0000-4000-8000-000000000007'
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033';
  if n_purchase <> 2 then raise exception 'FAIL: attendu 2 achats distincts, obtenu %', n_purchase; end if;

  select coalesce(sum(amount),0) into bal from public.points_ledger
    where group_id = 'c0000000-0000-4000-8000-0000000000a1'
      and user_id = 'd234bd26-d685-477a-9e96-35855057e033';
  if bal <> 0 then raise exception 'FAIL: solde attendu 0 (20-10-10), obtenu %', bal; end if;

  raise notice 'OK 13b: deux clés différentes → deux achats distincts autorisés, solde=0';
end $$;

-- 13c. Nouvel achat (clé différente, donc pas un rejeu) refusé pour solde
-- insuffisant — le solde est désormais à 0.
do $$
declare r record; n_purchase integer;
begin
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000008', 'd234bd26-d685-477a-9e96-35855057e033',
    'f0000000-0000-4000-8000-000000000004');
  if r.result <> 'insufficient_balance' then
    raise exception 'FAIL: attendu insufficient_balance, obtenu %', r.result;
  end if;

  select count(*) into n_purchase from public.group_shop_purchases
    where item_id = 'd0000000-0000-4000-8000-000000000008';
  if n_purchase <> 0 then raise exception 'FAIL: achat créé malgré solde insuffisant (%)', n_purchase; end if;

  raise notice 'OK 13c: nouvel achat (clé différente) refusé pour solde insuffisant';
end $$;

-- ─── 14. Ordre des vérifications : pas de fuite d'info à un non-membre ───────
-- admin_b (admin du groupe B uniquement — jamais membre ni admin des groupes
-- A ou C) sonde un article inactif du groupe A et un article d'un groupe
-- suspendu (C) auxquels il n'a AUCUN lien. Dans les deux cas il doit obtenir
-- 'not_member' — jamais 'item_inactive' ni 'group_suspended', qui révéleraient
-- l'état interne d'un groupe auquel il n'appartient pas.
do $$
declare r record;
begin
  -- Article INACTIF du groupe A (d...0003, section 11) : admin_b n'est pas
  -- membre du groupe A.
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000003', '769f65c0-6c67-44fa-a5e8-4708e0d5743e', gen_random_uuid());
  if r.result <> 'not_member' then
    raise exception 'FAIL: non-membre sur article inactif attendu not_member, obtenu % (fuite d''info ?)', r.result;
  end if;

  -- Article du groupe C (suspendu, d...0004, section 11) : admin_b n'est pas
  -- membre du groupe C.
  select * into r from public.purchase_shop_item(
    'd0000000-0000-4000-8000-000000000004', '769f65c0-6c67-44fa-a5e8-4708e0d5743e', gen_random_uuid());
  if r.result <> 'not_member' then
    raise exception 'FAIL: non-membre sur groupe suspendu attendu not_member, obtenu % (fuite d''info ?)', r.result;
  end if;

  raise notice 'OK 14: aucune fuite du statut article/groupe à un non-membre (not_member dans les deux cas)';
end $$;

rollback; -- aucun effet de bord : tout est annulé.
