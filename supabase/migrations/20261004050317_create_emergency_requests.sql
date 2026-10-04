create table public.emergency_requests (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  description      text not null check (char_length(description) between 20 and 2000),
  amount_requested bigint not null check (amount_requested between 50000 and 100000000),
  status           text not null default 'submitted'
                   check (status in ('submitted','in_review','approved','rejected')),
  priority         text not null default 'medium'
                   check (priority in ('medium','high')),
  admin_note       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_emergency_user on public.emergency_requests (user_id, created_at desc);
create index idx_emergency_queue on public.emergency_requests (status, priority, created_at);

-- Satu pengajuan terbuka per user
create unique index uniq_open_emergency_per_user
  on public.emergency_requests (user_id) where status in ('submitted','in_review');

create trigger trg_emergency_updated_at
  before update on public.emergency_requests
  for each row execute function public.set_updated_at();

-- Status dan prioritas ditentukan DATABASE, bukan input user.
create or replace function public.emergency_set_defaults()
returns trigger language plpgsql security definer set search_path = public as $$
declare p record;
begin
  select orphan_status, monthly_household_income into p
  from public.profiles where id = new.user_id;

  new.status := 'submitted';
  new.admin_note := null;
  new.priority := case
    when coalesce(p.orphan_status, false) then 'high'
    when coalesce(p.monthly_household_income, 9223372036854775807) <= 1500000 then 'high'
    else 'medium'
  end;
  return new;
end $$;

create trigger trg_emergency_defaults
  before insert on public.emergency_requests
  for each row execute function public.emergency_set_defaults();

alter table public.emergency_requests enable row level security;

create policy "emergency_select" on public.emergency_requests
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "emergency_insert_own" on public.emergency_requests
  for insert to authenticated with check (user_id = auth.uid());
create policy "emergency_update_admin" on public.emergency_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());