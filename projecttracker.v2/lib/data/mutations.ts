"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ClarificationStatus, FmActionType, FmDosarStatus, FmDosarType, Priority, ProgrammeType, TransmissionStatus } from "@/lib/types";
import { normalizeToken } from "@/lib/utils";

const projectPaths = ["/", "/dashboard", "/fm", "/pnrr"];

function required(value: FormDataEntryValue | null, message: string) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error(message);
  return text;
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function revalidateProject(projectId?: string | null) {
  for (const path of projectPaths) revalidatePath(path);
  if (projectId) {
    revalidatePath(`/fm/${projectId}`);
    revalidatePath(`/pnrr/${projectId}`);
  }
}

async function logActivity({
  module,
  entityType,
  entityId,
  label,
  description
}: {
  module: ProgrammeType;
  entityType: string;
  entityId?: string | null;
  label: string;
  description?: string | null;
}) {
  const supabase = await createClient();
  await supabase.from("activity_logs").insert({
    module,
    entity_type: entityType,
    entity_id: entityId ?? null,
    label,
    description: description ?? null
  });
}

async function ensureCompany(companyName: string) {
  const supabase = await createClient();
  const { data: existingCompanies, error: companySelectError } = await supabase
    .from("companies")
    .select("id, name")
    .limit(500);

  if (companySelectError) throw companySelectError;

  const normalized = normalizeToken(companyName);
  const found = (existingCompanies ?? []).find((item) => normalizeToken(item.name) === normalized);
  if (found) return found.id;

  const { data: insertedCompany, error: companyInsertError } = await supabase
    .from("companies")
    .insert({ name: companyName })
    .select("id")
    .single();
  if (companyInsertError) throw companyInsertError;
  return insertedCompany.id;
}

export async function createProjectAction(formData: FormData) {
  const module = required(formData.get("module"), "Modul invalid") as ProgrammeType;
  const companyName = required(formData.get("companyName"), "Completează beneficiar / companie");
  const projectLabel = required(formData.get("projectLabel"), "Completează eticheta proiectului");
  const projectName = optional(formData.get("projectName")) ?? projectLabel;
  const rueCode = optional(formData.get("rueCode"));
  const componentRaw = optional(formData.get("component"));
  const component = componentRaw === "A" || componentRaw === "B" ? componentRaw : null;
  const callCode = optional(formData.get("callCode"));
  const notes = optional(formData.get("notes"));
  const companyId = await ensureCompany(companyName);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      company_id: companyId,
      programme_type: module,
      project_name: projectName,
      project_label: projectLabel,
      rue_code: module === "pnrr" ? rueCode : null,
      component: module === "pnrr" ? component : null,
      call_code: module === "pnrr" ? callCode : null,
      general_status: "Activ",
      notes
    })
    .select("id")
    .single();

  if (error) throw error;
  await logActivity({ module, entityType: "project", entityId: data.id, label: "Proiect creat", description: projectLabel });
  revalidateProject(data.id);
}

export async function updateProjectAction(formData: FormData) {
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const companyId = required(formData.get("companyId"), "Lipsește beneficiarul");
  const module = required(formData.get("module"), "Modul invalid") as ProgrammeType;
  const companyName = required(formData.get("companyName"), "Completează beneficiar / companie");
  const projectLabel = required(formData.get("projectLabel"), "Completează eticheta proiectului");
  const projectName = optional(formData.get("projectName")) ?? projectLabel;
  const generalStatus = required(formData.get("generalStatus"), "Completează statusul");
  const supabase = await createClient();

  const { error: companyError } = await supabase.from("companies").update({ name: companyName }).eq("id", companyId);
  if (companyError) throw companyError;

  const { error } = await supabase
    .from("projects")
    .update({
      project_name: projectName,
      project_label: projectLabel,
      rue_code: module === "pnrr" ? optional(formData.get("rueCode")) : null,
      component: module === "pnrr" ? optional(formData.get("component")) : null,
      call_code: module === "pnrr" ? optional(formData.get("callCode")) : null,
      general_status: generalStatus,
      notes: optional(formData.get("notes"))
    })
    .eq("id", projectId);

  if (error) throw error;
  await logActivity({ module, entityType: "project", entityId: projectId, label: "Proiect actualizat", description: projectLabel });
  revalidateProject(projectId);
}

export async function deleteProjectAction(formData: FormData) {
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const module = required(formData.get("module"), "Modul invalid") as ProgrammeType;
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw error;

  await logActivity({ module, entityType: "project", entityId: projectId, label: "Proiect șters" });
  revalidateProject(projectId);
}

export async function createFmDosarAction(formData: FormData) {
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const companyId = required(formData.get("companyId"), "Lipsește beneficiarul");
  const dosarType = required(formData.get("dosarType"), "Completează tipul dosarului") as FmDosarType;
  const status = required(formData.get("status"), "Completează statusul") as FmDosarStatus;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fm_dosare")
    .insert({ project_id: projectId, company_id: companyId, dosar_type: dosarType, status, notes: optional(formData.get("notes")) })
    .select("id")
    .single();
  if (error) throw error;

  await logActivity({ module: "fm", entityType: "fm_dosar", entityId: data.id, label: "Dosar FM adăugat", description: dosarType });
  revalidateProject(projectId);
}

export async function updateFmDosarAction(formData: FormData) {
  const id = required(formData.get("id"), "Lipsește dosarul");
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const dosarType = required(formData.get("dosarType"), "Completează tipul dosarului") as FmDosarType;
  const status = required(formData.get("status"), "Completează statusul") as FmDosarStatus;
  const supabase = await createClient();

  const { error } = await supabase
    .from("fm_dosare")
    .update({ dosar_type: dosarType, status, notes: optional(formData.get("notes")) })
    .eq("id", id);
  if (error) throw error;

  await logActivity({ module: "fm", entityType: "fm_dosar", entityId: id, label: "Dosar FM actualizat", description: dosarType });
  revalidateProject(projectId);
}

export async function deleteFmDosarAction(formData: FormData) {
  const id = required(formData.get("id"), "Lipsește dosarul");
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const supabase = await createClient();

  const { error } = await supabase.from("fm_dosare").delete().eq("id", id);
  if (error) throw error;

  await logActivity({ module: "fm", entityType: "fm_dosar", entityId: id, label: "Dosar FM șters" });
  revalidateProject(projectId);
}

export async function createFmRequestAction(formData: FormData) {
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const companyId = required(formData.get("companyId"), "Lipsește beneficiarul");
  const actionType = required(formData.get("actionType"), "Completează tipul cererii") as FmActionType;
  const status = required(formData.get("status"), "Completează statusul") as TransmissionStatus;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fm_actions")
    .insert({
      project_id: projectId,
      company_id: companyId,
      action_type: actionType,
      label: actionType,
      transmitted_status: status,
      date_sent: optional(formData.get("dateSent")),
      notes: optional(formData.get("notes"))
    })
    .select("id")
    .single();
  if (error) throw error;

  await logActivity({ module: "fm", entityType: "fm_request", entityId: data.id, label: "Cerere FM adăugată", description: actionType });
  revalidateProject(projectId);
}

export async function updateFmRequestAction(formData: FormData) {
  const id = required(formData.get("id"), "Lipsește cererea");
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const actionType = required(formData.get("actionType"), "Completează tipul cererii") as FmActionType;
  const status = required(formData.get("status"), "Completează statusul") as TransmissionStatus;
  const supabase = await createClient();

  const { error } = await supabase
    .from("fm_actions")
    .update({
      action_type: actionType,
      label: actionType,
      transmitted_status: status,
      date_sent: optional(formData.get("dateSent")),
      notes: optional(formData.get("notes"))
    })
    .eq("id", id);
  if (error) throw error;

  await logActivity({ module: "fm", entityType: "fm_request", entityId: id, label: "Cerere FM actualizată", description: actionType });
  revalidateProject(projectId);
}

export async function deleteFmRequestAction(formData: FormData) {
  const id = required(formData.get("id"), "Lipsește cererea");
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const supabase = await createClient();

  const { error } = await supabase.from("fm_actions").delete().eq("id", id);
  if (error) throw error;

  await logActivity({ module: "fm", entityType: "fm_request", entityId: id, label: "Cerere FM ștearsă" });
  revalidateProject(projectId);
}

export async function createPnrrClarificationAction(formData: FormData) {
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const companyId = required(formData.get("companyId"), "Lipsește beneficiarul");
  const subject = required(formData.get("subject"), "Completează descrierea");
  const status = required(formData.get("status"), "Completează statusul") as ClarificationStatus;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pnrr_clarifications")
    .insert({
      project_id: projectId,
      company_id: companyId,
      subject,
      request_type: required(formData.get("requestType"), "Completează tipul"),
      priority: required(formData.get("priority"), "Completează prioritatea") as Priority,
      date_received: required(formData.get("dateReceived"), "Completează data primirii"),
      response_deadline: required(formData.get("responseDeadline"), "Completează data limită"),
      status,
      date_sent: optional(formData.get("dateSent")),
      is_answer_sent: status === "răspuns primit" || status === "închis",
      responsible: optional(formData.get("responsible")),
      notes: optional(formData.get("notes"))
    })
    .select("id")
    .single();
  if (error) throw error;

  await logActivity({ module: "pnrr", entityType: "clarification", entityId: data.id, label: "Clarificare adăugată", description: subject });
  revalidateProject(projectId);
}

export async function updatePnrrClarificationAction(formData: FormData) {
  const id = required(formData.get("id"), "Lipsește clarificarea");
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const subject = required(formData.get("subject"), "Completează descrierea");
  const status = required(formData.get("status"), "Completează statusul") as ClarificationStatus;
  const supabase = await createClient();

  const { error } = await supabase
    .from("pnrr_clarifications")
    .update({
      subject,
      request_type: required(formData.get("requestType"), "Completează tipul"),
      priority: required(formData.get("priority"), "Completează prioritatea") as Priority,
      date_received: required(formData.get("dateReceived"), "Completează data primirii"),
      response_deadline: required(formData.get("responseDeadline"), "Completează data limită"),
      status,
      date_sent: optional(formData.get("dateSent")),
      is_answer_sent: status === "răspuns primit" || status === "închis",
      responsible: optional(formData.get("responsible")),
      notes: optional(formData.get("notes"))
    })
    .eq("id", id);
  if (error) throw error;

  await logActivity({ module: "pnrr", entityType: "clarification", entityId: id, label: "Clarificare actualizată", description: subject });
  revalidateProject(projectId);
}

export async function deletePnrrClarificationAction(formData: FormData) {
  const id = required(formData.get("id"), "Lipsește clarificarea");
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const supabase = await createClient();

  const { error } = await supabase.from("pnrr_clarifications").delete().eq("id", id);
  if (error) throw error;

  await logActivity({ module: "pnrr", entityType: "clarification", entityId: id, label: "Clarificare ștearsă" });
  revalidateProject(projectId);
}
