create table if not exists public.proof_app_settings (
  id text primary key default 'default',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.proof_app_settings enable row level security;

drop policy if exists "Allow public read proof settings" on public.proof_app_settings;
drop policy if exists "Allow public insert proof settings" on public.proof_app_settings;
drop policy if exists "Allow public update proof settings" on public.proof_app_settings;

create policy "Allow public read proof settings"
on public.proof_app_settings
for select
to anon
using (true);

create policy "Allow public insert proof settings"
on public.proof_app_settings
for insert
to anon
with check (true);

create policy "Allow public update proof settings"
on public.proof_app_settings
for update
to anon
using (true)
with check (true);
