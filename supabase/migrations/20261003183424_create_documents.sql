create table public.documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('ktm','kk','sktm','ktp','transcript')),
  file_name     text not null,
  file_path     text not null unique,
  mime_type     text not null check (mime_type in ('application/pdf','image/jpeg','image/png')),
  file_size     integer not null check (file_size > 0 and file_size <= 5242880),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, document_type)      -- satu dokumen aktif per jenis; upload ulang = mengganti
);

create trigger trg_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

alter table public.documents enable row level security;

create policy "documents_own_select" on public.documents
  for select to authenticated using (user_id = auth.uid());
create policy "documents_own_insert" on public.documents
  for insert to authenticated with check (user_id = auth.uid());
create policy "documents_own_update" on public.documents
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "documents_own_delete" on public.documents
  for delete to authenticated using (user_id = auth.uid());

-- Bucket private, batas 5 MB, hanya PDF/JPG/PNG
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 5242880,
        array['application/pdf','image/jpeg','image/png'])
on conflict (id) do nothing;

-- Konvensi path: <user_id>/<jenis>/<uuid>.<ext>  → folder pertama harus id user
create policy "documents_storage_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "documents_storage_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "documents_storage_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "documents_storage_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);