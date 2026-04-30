create table public.fm_dosare (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  dosar_type text not null check (dosar_type in (
    'Audit financiar',
    'SF + Consultanță',
    'Lucrări (CEF)',
    'Publicitate',
    'Dirigenție de șantier'
  )),
  status text not null default 'Neprelucrat' check (status in ('Încărcat', 'În lucru', 'Neprelucrat', 'N/A')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index fm_dosare_project_idx on public.fm_dosare(project_id);

create trigger fm_dosare_updated_at before update on public.fm_dosare for each row execute function public.set_updated_at();

alter table public.fm_dosare enable row level security;

create policy "Users manage own fm dosare" on public.fm_dosare for all to authenticated
using (exists (select 1 from public.companies c where c.id = fm_dosare.company_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.companies c where c.id = fm_dosare.company_id and c.owner_id = auth.uid()));
