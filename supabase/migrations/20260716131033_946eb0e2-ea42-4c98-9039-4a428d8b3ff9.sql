
create policy "public read media" on storage.objects for select to anon, authenticated
  using (bucket_id in ('media','repository'));
create policy "editors upload media" on storage.objects for insert to authenticated
  with check (bucket_id in ('media','repository') and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor')));
create policy "editors update media" on storage.objects for update to authenticated
  using (bucket_id in ('media','repository') and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor')));
create policy "editors delete media" on storage.objects for delete to authenticated
  using (bucket_id in ('media','repository') and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor')));
