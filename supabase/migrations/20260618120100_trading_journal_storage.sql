-- Bucket privé pour les captures de trades du Journal IA.
-- Convention de chemin : <user_id>/<uuid>.<ext>  →  la 1re sous-dossier = uid.
-- Les policies isolent chaque utilisateur dans son propre dossier.

insert into storage.buckets (id, name, public)
values ('trade-screenshots', 'trade-screenshots', false)
on conflict (id) do nothing;

-- SELECT : lecture de ses propres objets (les URLs signées sont générées côté serveur)
create policy "tje_screens_select_own" on storage.objects
  for select using (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- INSERT : upload uniquement dans son dossier
create policy "tje_screens_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE : modifier uniquement ses objets
create policy "tje_screens_update_own" on storage.objects
  for update using (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE : supprimer uniquement ses objets
create policy "tje_screens_delete_own" on storage.objects
  for delete using (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
