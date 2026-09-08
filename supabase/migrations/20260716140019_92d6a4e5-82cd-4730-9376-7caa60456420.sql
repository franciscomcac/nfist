
-- Storage policies for media + repository buckets
-- Admins and editors can upload/replace/delete; everyone (including anon) can read via signed URLs

drop policy if exists "admins upload media" on storage.objects;
drop policy if exists "admins update media" on storage.objects;
drop policy if exists "admins delete media" on storage.objects;
drop policy if exists "authenticated read media" on storage.objects;
drop policy if exists "public read media" on storage.objects;

create policy "admins upload media"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('media','repository')
  and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'))
);

create policy "admins update media"
on storage.objects for update to authenticated
using (
  bucket_id in ('media','repository')
  and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'))
)
with check (
  bucket_id in ('media','repository')
  and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'))
);

create policy "admins delete media"
on storage.objects for delete to authenticated
using (
  bucket_id in ('media','repository')
  and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'))
);

-- allow signed URL creation from any authenticated admin/editor,
-- and allow anon to read via signed URLs (signed URLs bypass this, but keep read open for authenticated preview)
create policy "authenticated read media"
on storage.objects for select to authenticated
using (bucket_id in ('media','repository'));
