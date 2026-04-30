import { createClient } from "@/lib/supabase/server";
import type { ActivityLog, Company, FmAction, FmAddendum, FmDosar, FmDosarStatus, FmDosarType, PnrrClarification, Project, ProjectNote } from "@/lib/types";
import * as demo from "@/lib/demo-data";

type DbCompany = {
  id: string;
  name: string;
  fiscal_code: string | null;
  county: string | null;
};

type DbProject = {
  id: string;
  company_id: string;
  programme_type: "fm" | "pnrr";
  project_name: string;
  project_label: string;
  rue_code: string | null;
  component: "A" | "B" | null;
  call_code: string | null;
  general_status: "Activ" | "În implementare" | "Monitorizare" | "Închis";
  notes: string | null;
  updated_at: string;
};

type DbPnrrClarification = {
  id: string;
  project_id: string;
  company_id: string;
  subject: string;
  request_type: "Solicitare documente" | "Cerere transfer" | "Contestație" | "Altul";
  priority: "Ridicată" | "Medie" | "Scăzută";
  date_received: string;
  response_deadline: string;
  status: "În așteptare" | "În lucru" | "Răspuns trimis" | "Închis";
  date_sent: string | null;
  is_answer_sent: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type DbFmAction = {
  id: string;
  project_id: string;
  company_id: string;
  action_type: string;
  label: string;
  transmitted_status: "Netransmis" | "În lucru" | "Transmis" | "Acceptat" | "N/A";
  date_sent: string | null;
  notes: string | null;
  updated_at: string;
};

type DbFmDosar = {
  id: string;
  project_id: string;
  company_id: string;
  dosar_type: string;
  status: string;
  notes: string | null;
  updated_at: string;
};

type DbFmAddendum = {
  id: string;
  project_id: string;
  company_id: string;
  requires_addendum: boolean;
  reason: string;
  budget_change_needed: "Netransmis" | "În lucru" | "Transmis" | "Acceptat" | "N/A";
  procurement_plan_change_needed: "Netransmis" | "În lucru" | "Transmis" | "Acceptat" | "N/A";
  activities_term_change_needed: "Netransmis" | "În lucru" | "Transmis" | "Acceptat" | "N/A";
  documents_prepared: "Netransmis" | "În lucru" | "Transmis" | "Acceptat" | "N/A";
  platform_status: "Netransmis" | "În lucru" | "Transmis" | "Acceptat" | "N/A";
  date_sent: string | null;
  notes: string | null;
  updated_at: string;
};

type DbProjectNote = {
  id: string;
  project_id: string;
  body: string;
  created_at: string;
};

type DbActivityLog = {
  id: string;
  module: "fm" | "pnrr";
  label: string;
  description: string | null;
  created_at: string;
};

function mapCompany(row: DbCompany): Company {
  return {
    id: row.id,
    name: row.name,
    fiscalCode: row.fiscal_code ?? undefined,
    county: row.county ?? undefined
  };
}

function mapProject(row: DbProject): Project {
  return {
    id: row.id,
    companyId: row.company_id,
    programmeType: row.programme_type,
    projectName: row.project_name,
    projectLabel: row.project_label,
    rueCode: row.rue_code ?? undefined,
    component: row.component,
    callCode: row.call_code ?? undefined,
    generalStatus: row.general_status,
    notes: row.notes ?? undefined,
    updatedAt: row.updated_at
  };
}

function mapPnrrClarification(row: DbPnrrClarification): PnrrClarification {
  return {
    id: row.id,
    projectId: row.project_id,
    companyId: row.company_id,
    subject: row.subject,
    requestType: row.request_type,
    priority: row.priority,
    dateReceived: row.date_received,
    responseDeadline: row.response_deadline,
    status: row.status,
    dateSent: row.date_sent,
    isAnswerSent: row.is_answer_sent,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapFmAction(row: DbFmAction): FmAction {
  return {
    id: row.id,
    projectId: row.project_id,
    companyId: row.company_id,
    actionType: row.action_type as FmAction["actionType"],
    label: row.label,
    transmittedStatus: row.transmitted_status,
    dateSent: row.date_sent,
    notes: row.notes ?? undefined,
    updatedAt: row.updated_at
  };
}

function mapFmAddendum(row: DbFmAddendum): FmAddendum {
  return {
    id: row.id,
    projectId: row.project_id,
    companyId: row.company_id,
    requiresAddendum: row.requires_addendum,
    reason: row.reason,
    budgetChangeNeeded: row.budget_change_needed,
    procurementPlanChangeNeeded: row.procurement_plan_change_needed,
    activitiesTermChangeNeeded: row.activities_term_change_needed,
    documentsPrepared: row.documents_prepared,
    platformStatus: row.platform_status,
    dateSent: row.date_sent,
    notes: row.notes ?? undefined,
    updatedAt: row.updated_at
  };
}

function mapFmDosar(row: DbFmDosar): FmDosar {
  return {
    id: row.id,
    projectId: row.project_id,
    companyId: row.company_id,
    dosarType: row.dosar_type as FmDosarType,
    status: row.status as FmDosarStatus,
    notes: row.notes ?? undefined,
    updatedAt: row.updated_at
  };
}

function mapProjectNote(row: DbProjectNote): ProjectNote {
  return {
    id: row.id,
    projectId: row.project_id,
    body: row.body,
    createdAt: row.created_at
  };
}

function mapActivityLog(row: DbActivityLog): ActivityLog {
  return {
    id: row.id,
    module: row.module,
    label: row.label,
    description: row.description ?? "",
    createdAt: row.created_at
  };
}

export async function getDataset() {
  try {
    const supabase = await createClient();

    const [companiesRes, projectsRes, pnrrRes, fmActionsRes, fmAddendaRes, notesRes, activityRes] = await Promise.all([
      supabase.from("companies").select("id, name, fiscal_code, county"),
      supabase
        .from("projects")
        .select("id, company_id, programme_type, project_name, project_label, rue_code, component, call_code, general_status, notes, updated_at"),
      supabase
        .from("pnrr_clarifications")
        .select("id, project_id, company_id, subject, request_type, priority, date_received, response_deadline, status, date_sent, is_answer_sent, notes, created_at, updated_at"),
      supabase
        .from("fm_actions")
        .select("id, project_id, company_id, action_type, label, transmitted_status, date_sent, notes, updated_at"),
      supabase
        .from("fm_addenda")
        .select("id, project_id, company_id, requires_addendum, reason, budget_change_needed, procurement_plan_change_needed, activities_term_change_needed, documents_prepared, platform_status, date_sent, notes, updated_at"),
      supabase.from("project_notes").select("id, project_id, body, created_at"),
      supabase.from("activity_logs").select("id, module, label, description, created_at").order("created_at", { ascending: false }).limit(30)
    ]);

    if (companiesRes.error) throw companiesRes.error;
    if (projectsRes.error) throw projectsRes.error;
    if (pnrrRes.error) throw pnrrRes.error;
    if (fmActionsRes.error) throw fmActionsRes.error;
    if (fmAddendaRes.error) throw fmAddendaRes.error;
    if (notesRes.error) throw notesRes.error;
    if (activityRes.error) throw activityRes.error;

    const fmDosareRes = await supabase
      .from("fm_dosare")
      .select("id, project_id, company_id, dosar_type, status, notes, updated_at");

    const companies = (companiesRes.data ?? []).map(mapCompany);
    const projects = (projectsRes.data ?? []).map(mapProject);

    if (projects.length === 0) {
      return {
        companies: demo.companies,
        projects: demo.projects,
        pnrrClarifications: demo.pnrrClarifications,
        fmActions: demo.fmActions,
        fmAddenda: demo.fmAddenda,
        fmDosare: demo.fmDosare,
        projectNotes: demo.projectNotes,
        activityLogs: demo.activityLogs
      };
    }

    return {
      companies,
      projects,
      pnrrClarifications: (pnrrRes.data ?? []).map(mapPnrrClarification),
      fmActions: (fmActionsRes.data ?? []).map(mapFmAction),
      fmAddenda: (fmAddendaRes.data ?? []).map(mapFmAddendum),
      fmDosare: (!fmDosareRes.error ? fmDosareRes.data ?? [] : []).map(mapFmDosar),
      projectNotes: (notesRes.data ?? []).map(mapProjectNote),
      activityLogs: (activityRes.data ?? []).map(mapActivityLog)
    };
  } catch (error) {
    console.error("Supabase dataset fallback:", error);
    return {
      companies: demo.companies,
      projects: demo.projects,
      pnrrClarifications: demo.pnrrClarifications,
      fmActions: demo.fmActions,
      fmAddenda: demo.fmAddenda,
      fmDosare: demo.fmDosare,
      projectNotes: demo.projectNotes,
      activityLogs: demo.activityLogs
    };
  }
}
