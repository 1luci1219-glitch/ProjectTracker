alter table public.pnrr_clarifications
  drop constraint if exists pnrr_clarifications_status_check;

alter table public.pnrr_clarifications
  add constraint pnrr_clarifications_status_check
  check (status in (
    'draft',
    'trimis',
    'răspuns primit',
    'închis',
    'În așteptare',
    'În lucru',
    'Răspuns trimis',
    'Închis'
  ));

alter table public.fm_actions
  drop constraint if exists fm_actions_transmitted_status_check;

alter table public.fm_actions
  add constraint fm_actions_transmitted_status_check
  check (transmitted_status in (
    'draft',
    'transmis',
    'aprobat',
    'respins',
    'Netransmis',
    'În lucru',
    'Transmis',
    'Acceptat',
    'N/A'
  ));

alter table public.fm_addenda
  drop constraint if exists fm_addenda_budget_change_needed_check,
  drop constraint if exists fm_addenda_procurement_plan_change_needed_check,
  drop constraint if exists fm_addenda_activities_term_change_needed_check,
  drop constraint if exists fm_addenda_documents_prepared_check,
  drop constraint if exists fm_addenda_platform_status_check;

alter table public.fm_addenda
  add constraint fm_addenda_budget_change_needed_check check (budget_change_needed in ('draft','transmis','aprobat','respins','Netransmis','În lucru','Transmis','Acceptat','N/A')),
  add constraint fm_addenda_procurement_plan_change_needed_check check (procurement_plan_change_needed in ('draft','transmis','aprobat','respins','Netransmis','În lucru','Transmis','Acceptat','N/A')),
  add constraint fm_addenda_activities_term_change_needed_check check (activities_term_change_needed in ('draft','transmis','aprobat','respins','Netransmis','În lucru','Transmis','Acceptat','N/A')),
  add constraint fm_addenda_documents_prepared_check check (documents_prepared in ('draft','transmis','aprobat','respins','Netransmis','În lucru','Transmis','Acceptat','N/A')),
  add constraint fm_addenda_platform_status_check check (platform_status in ('draft','transmis','aprobat','respins','Netransmis','În lucru','Transmis','Acceptat','N/A'));
