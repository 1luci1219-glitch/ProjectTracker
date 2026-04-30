"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeToken } from "@/lib/utils";

function required(value: FormDataEntryValue | null, message: string) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error(message);
  return text;
}

export async function createProjectAction(formData: FormData) {
  const module = required(formData.get("module"), "Modul invalid") as "fm" | "pnrr";
  const companyName = required(formData.get("companyName"), "Completează UAT / companie");
  const projectLabel = required(formData.get("projectLabel"), "Completează eticheta proiectului");
  const projectName = String(formData.get("projectName") ?? projectLabel).trim() || projectLabel;
  const rueCode = String(formData.get("rueCode") ?? "").trim() || null;
  const componentRaw = String(formData.get("component") ?? "").trim();
  const component = componentRaw === "A" || componentRaw === "B" ? componentRaw : null;
  const callCode = String(formData.get("callCode") ?? "").trim() || null;

  const supabase = await createClient();

  const { data: existingCompanies, error: companySelectError } = await supabase
    .from("companies")
    .select("id, name")
    .limit(200);

  if (companySelectError) throw companySelectError;

  const normalized = normalizeToken(companyName);
  const found = (existingCompanies ?? []).find((item) => normalizeToken(item.name) === normalized);

  let companyId = found?.id;
  if (!companyId) {
    const { data: insertedCompany, error: companyInsertError } = await supabase
      .from("companies")
      .insert({ name: companyName })
      .select("id")
      .single();
    if (companyInsertError) throw companyInsertError;
    companyId = insertedCompany.id;
  }

  const { error: projectInsertError } = await supabase.from("projects").insert({
    company_id: companyId,
    programme_type: module,
    project_name: projectName,
    project_label: projectLabel,
    rue_code: module === "pnrr" ? rueCode : null,
    component: module === "pnrr" ? component : null,
    call_code: module === "pnrr" ? callCode : null,
    general_status: "Activ"
  });

  if (projectInsertError) throw projectInsertError;

  revalidatePath("/dashboard");
  revalidatePath("/fm");
  revalidatePath("/pnrr");
}

export async function deleteProjectAction(formData: FormData) {
  const projectId = required(formData.get("projectId"), "Lipsește proiectul");
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw error;

  revalidatePath("/dashboard");
  revalidatePath("/fm");
  revalidatePath("/pnrr");
}
