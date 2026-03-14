create extension if not exists pgcrypto;

create table if not exists public.home_site_quiz_responses (
  id uuid primary key default gen_random_uuid(),
  favorite_site text not null,
  has_family_emergency_plan boolean not null,
  knows_barbados_emergency_numbers boolean not null,
  created_at timestamptz not null default now()
);

alter table public.home_site_quiz_responses enable row level security;

create policy "Allow anonymous insert home site quiz responses"
on public.home_site_quiz_responses
for insert
to anon, authenticated
with check (true);
