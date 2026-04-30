import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function pick(row, aliases) {
  const entries = Object.entries(row);
  for (const alias of aliases) {
    const hit = entries.find(([key]) => normalize(key) === normalize(alias));
    if (hit && String(hit[1] ?? "").trim()) {
      return String(hit[1]).trim();
    }
  }
  return "";
}

function parseSheetRows(filePath) {
  const workbook = XLSX.readFile(filePath);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Setează NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY înainte de seed.");
  }

  const fmPath = process.argv[2] ?? "C:/Users/tragp/Downloads/FM_Evidenta.xlsx";
  const pnrrPath = process.argv[3] ?? "C:/Users/tragp/Downloads/Evidenta Solicitari REPowerEU.xlsx";

  if (!fs.existsSync(fmPath) || !fs.existsSync(pnrrPath)) {
    throw new Error(`Fișier lipsă. FM: ${fmPath} | PNRR: ${pnrrPath}`);
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const fmRows = parseSheetRows(fmPath);
  const pnrrRows = parseSheetRows(pnrrPath);

  const { data: companiesData, error: companiesError } = await supabase.from("companies").select("id, name");
  if (companiesError) throw companiesError;

  const companyByName = new Map((companiesData ?? []).map((c) => [normalize(c.name), c.id]));

  async function ensureCompany(nameRaw) {
    const companyName = nameRaw || "UAT necompletat";
    const key = normalize(companyName);
    if (companyByName.has(key)) return companyByName.get(key);
    const { data, error } = await supabase.from("companies").insert({ name: companyName }).select("id").single();
    if (error) throw error;
    companyByName.set(key, data.id);
    return data.id;
  }

  const insertProjects = [];

  for (const row of fmRows) {
    const companyName = pick(row, ["beneficiar", "uat", "companie", "nume beneficiar"]);
    const projectLabel = pick(row, ["proiect", "project_label", "denumire proiect", "project"]);
    if (!projectLabel) continue;
    const companyId = await ensureCompany(companyName);
    insertProjects.push({
      company_id: companyId,
      programme_type: "fm",
      project_name: projectLabel,
      project_label: projectLabel,
      general_status: "Activ"
    });
  }

  for (const row of pnrrRows) {
    const companyName = pick(row, ["beneficiar", "uat", "companie", "nume beneficiar"]);
    const projectLabel = pick(row, ["proiect", "project_label", "denumire proiect", "project"]);
    if (!projectLabel) continue;
    const companyId = await ensureCompany(companyName);
    const rueCode = pick(row, ["rue", "rue_code", "cod rue"]);
    const component = pick(row, ["componenta", "component"]);
    insertProjects.push({
      company_id: companyId,
      programme_type: "pnrr",
      project_name: projectLabel,
      project_label: projectLabel,
      rue_code: rueCode || null,
      component: component === "A" || component === "B" ? component : null,
      general_status: "Activ"
    });
  }

  const { data: existingProjects, error: existingError } = await supabase
    .from("projects")
    .select("id, company_id, programme_type, project_label");
  if (existingError) throw existingError;

  const existingSet = new Set(
    (existingProjects ?? []).map((p) => `${p.company_id}|${p.programme_type}|${normalize(p.project_label)}`)
  );
  const deduped = insertProjects.filter(
    (item) => !existingSet.has(`${item.company_id}|${item.programme_type}|${normalize(item.project_label)}`)
  );

  if (deduped.length) {
    const { error: insertError } = await supabase.from("projects").insert(deduped);
    if (insertError) throw insertError;
  }

  console.log(`Seed completed. Added ${deduped.length} projects from:`);
  console.log(`- ${path.basename(fmPath)} (${fmRows.length} rows scanned)`);
  console.log(`- ${path.basename(pnrrPath)} (${pnrrRows.length} rows scanned)`);
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
