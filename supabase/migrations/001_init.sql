create extension if not exists pgcrypto;

create type public.programme_type as enum ('fm', 'pnrr');
create type public.pnrr_component as enum ('A', 'B');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  organization_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  fiscal_code text,
  county text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  programme_type public.programme_type not null,
  project_name text not null,
  project_label text not null,
  rue_code text,
  component public.pnrr_component,
  call_code text,
  general_status text not null default 'Activ',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pnrr_clarifications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  subject text not null,
  request_type text not null check (request_type in ('Solicitare documente', 'Cerere transfer', 'Contestație', 'Altul')),
  priority text not null check (priority in ('Ridicată', 'Medie', 'Scăzută')),
  date_received date not null,
  response_deadline date not null,
  status text not null default 'În așteptare' check (status in ('În așteptare', 'În lucru', 'Răspuns trimis', 'Închis')),
  date_sent date,
  is_answer_sent boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fm_actions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  action_type text not null,
  label text not null,
  transmitted_status text not null default 'Netransmis' check (transmitted_status in ('Netransmis', 'În lucru', 'Transmis', 'Acceptat', 'N/A')),
  date_sent date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fm_addenda (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  requires_addendum boolean not null default true,
  reason text not null default 'Actualizare TVA 19% -> 21%',
  budget_change_needed text not null default 'Netransmis',
  procurement_plan_change_needed text not null default 'Netransmis',
  activities_term_change_needed text not null default 'Netransmis',
  documents_prepared text not null default 'Netransmis',
  platform_status text not null default 'Netransmis',
  date_sent date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid default auth.uid() references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.import_batches (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  module public.programme_type not null,
  source_filename text not null,
  status text not null default 'preview',
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  imported_rows integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  row_number integer not null,
  raw_data jsonb not null,
  mapped_data jsonb,
  is_valid boolean not null default false,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  module public.programme_type not null,
  entity_type text not null,
  entity_id uuid,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

create index companies_owner_id_idx on public.companies(owner_id);
create index projects_company_id_idx on public.projects(company_id);
create index projects_programme_type_idx on public.projects(programme_type);
create index pnrr_clarifications_deadline_idx on public.pnrr_clarifications(response_deadline);
create index pnrr_clarifications_project_idx on public.pnrr_clarifications(project_id);
create index fm_actions_project_idx on public.fm_actions(project_id);
create index fm_addenda_project_idx on public.fm_addenda(project_id);
create index activity_logs_owner_created_idx on public.activity_logs(owner_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger companies_updated_at before update on public.companies for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger pnrr_clarifications_updated_at before update on public.pnrr_clarifications for each row execute function public.set_updated_at();
create trigger fm_actions_updated_at before update on public.fm_actions for each row execute function public.set_updated_at();
create trigger fm_addenda_updated_at before update on public.fm_addenda for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.projects enable row level security;
alter table public.pnrr_clarifications enable row level security;
alter table public.fm_actions enable row level security;
alter table public.fm_addenda enable row level security;
alter table public.project_notes enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_rows enable row level security;
alter table public.activity_logs enable row level security;

create policy "Users manage own profile" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Users manage own companies" on public.companies for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Users manage own projects" on public.projects for all to authenticated
using (exists (select 1 from public.companies c where c.id = projects.company_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.companies c where c.id = projects.company_id and c.owner_id = auth.uid()));

create policy "Users manage own pnrr clarifications" on public.pnrr_clarifications for all to authenticated
using (exists (select 1 from public.companies c where c.id = pnrr_clarifications.company_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.companies c where c.id = pnrr_clarifications.company_id and c.owner_id = auth.uid()));

create policy "Users manage own fm actions" on public.fm_actions for all to authenticated
using (exists (select 1 from public.companies c where c.id = fm_actions.company_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.companies c where c.id = fm_actions.company_id and c.owner_id = auth.uid()));

create policy "Users manage own fm addenda" on public.fm_addenda for all to authenticated
using (exists (select 1 from public.companies c where c.id = fm_addenda.company_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.companies c where c.id = fm_addenda.company_id and c.owner_id = auth.uid()));

create policy "Users manage notes for own projects" on public.project_notes for all to authenticated
using (exists (
  select 1 from public.projects p join public.companies c on c.id = p.company_id
  where p.id = project_notes.project_id and c.owner_id = auth.uid()
))
with check (exists (
  select 1 from public.projects p join public.companies c on c.id = p.company_id
  where p.id = project_notes.project_id and c.owner_id = auth.uid()
));

create policy "Users manage own import batches" on public.import_batches for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Users manage own import rows" on public.import_rows for all to authenticated
using (exists (select 1 from public.import_batches b where b.id = import_rows.batch_id and b.owner_id = auth.uid()))
with check (exists (select 1 from public.import_batches b where b.id = import_rows.batch_id and b.owner_id = auth.uid()));

create policy "Users manage own activity logs" on public.activity_logs for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
