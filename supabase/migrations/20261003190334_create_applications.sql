create table public.applications (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  scholarship_id uuid not null references public.scholarships(id) on delete restrict,
  status         text not null default 'submitted'
                 check (status in ('draft','submitted','under_review','approved','rejected')),
  match_score    int check (match_score between 0 and 100),   -- snapshot saat mendaftar
  notes          text,                                        -- catatan admin
  submitted_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (user_id, scholarship_id)                            -- cegah daftar dua kali
);

create index idx_applications_user_status on public.applications (user_id, status);
create index idx_applications_scholarship on public.applications (scholarship_id);

create trigger trg_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

alter table public.applications enable row level security;

create policy "applications_select" on public.applications
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- User hanya boleh membuat pendaftarannya sendiri, dengan status awal
create policy "applications_insert_own" on public.applications
  for insert to authenticated
  with check (user_id = auth.uid() and status in ('draft','submitted'));

-- Hanya admin yang mengubah status
create policy "applications_update_admin" on public.applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- User boleh membatalkan selama belum diproses; admin boleh menghapus
create policy "applications_delete" on public.applications
  for delete to authenticated
  using ((user_id = auth.uid() and status in ('draft','submitted')) or public.is_admin());