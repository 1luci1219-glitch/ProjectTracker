import Link from "next/link";
import { AlertTriangle, FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section";
import { deleteProjectAction, updateProjectAction } from "@/lib/data/mutations";
import { getDataset } from "@/lib/data/repository";
import { clarificationUrgency, isClarificationAnswered } from "@/lib/domain";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PnrrPage() {
  const { companies, pnrrClarifications, projects } = await getDataset();
  const pnrrProjects = projects.filter((project) => project.programmeType === "pnrr");

  return (
    <div>
      <SectionHeader
        eyebrow="PNRR / REPowerEU"
        title="Proiecte"
        description="Fiecare proiect are pagină separată pentru clarificări, filtre și acțiuni CRUD."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pnrrProjects.map((project) => {
          const company = companies.find((item) => item.id === project.companyId);
          const clarifications = pnrrClarifications.filter((item) => item.projectId === project.id);
          const open = clarifications.filter((item) => !isClarificationAnswered(item));
          const urgent = open.filter((item) => ["urgent", "overdue"].includes(clarificationUrgency(item))).length;
          const answered = clarifications.filter(isClarificationAnswered).length;
          const progress = clarifications.length ? Math.round((answered / clarifications.length) * 100) : 0;

          return (
            <article key={project.id} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-[var(--ink)]">{company?.name ?? project.projectLabel}</p>
                  <p className="mt-1 truncate text-sm text-[var(--muted)]">{project.projectLabel}</p>
                </div>
                <Badge tone={urgent > 0 ? "danger" : open.length > 0 ? "warning" : "success"}>{urgent > 0 ? "urgent" : open.length > 0 ? "open" : "ok"}</Badge>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Stat label="Clarificări" value={clarifications.length} />
                <Stat label="Deschise" value={open.length} />
                <Stat label="Progres" value={`${progress}%`} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Badge tone="blue">{project.rueCode ?? "Fără RUE"}</Badge>
                {project.component ? <Badge tone={project.component === "A" ? "blue" : "dark"}>Componenta {project.component}</Badge> : null}
                {urgent > 0 ? <Badge tone="danger"><AlertTriangle className="mr-1 h-3 w-3" />{urgent} urgent</Badge> : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/pnrr/${project.id}`} className="tool-button focus-ring">
                  <FileText className="h-4 w-4" />
                  Clarificări
                </Link>
                <details className="inline-editor flex-1">
                  <summary>Editează proiect</summary>
                  <form action={updateProjectAction} className="mt-3 grid gap-3">
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="companyId" value={project.companyId} />
                    <input type="hidden" name="module" value="pnrr" />
                    <input name="companyName" defaultValue={company?.name ?? ""} className="form-field focus-ring" required />
                    <input name="projectLabel" defaultValue={project.projectLabel} className="form-field focus-ring" required />
                    <input name="projectName" defaultValue={project.projectName} className="form-field focus-ring" />
                    <input name="rueCode" defaultValue={project.rueCode ?? ""} className="form-field focus-ring" placeholder="RUE / cod" />
                    <input name="callCode" defaultValue={project.callCode ?? ""} className="form-field focus-ring" placeholder="Cod apel" />
                    <select name="component" defaultValue={project.component ?? ""} className="form-field focus-ring">
                      <option value="">Componentă</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                    </select>
                    <select name="generalStatus" defaultValue={project.generalStatus} className="form-field focus-ring">
                      <option>Activ</option>
                      <option>În implementare</option>
                      <option>Monitorizare</option>
                      <option>Închis</option>
                    </select>
                    <textarea name="notes" defaultValue={project.notes ?? ""} className="form-field focus-ring" placeholder="Observații" />
                    <button className="btn-accent focus-ring px-4 py-2 text-sm">Salvează</button>
                  </form>
                </details>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="module" value="pnrr" />
                  <button className="danger-button focus-ring" title="Șterge proiect">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
              <p className="mt-4 text-xs text-[var(--muted)]">Actualizat: {formatDate(project.updatedAt.slice(0, 10))}</p>
            </article>
          );
        })}
      </div>
      {pnrrProjects.length === 0 ? (
        <div className="panel p-5 text-sm text-[var(--muted)]">Nu există proiecte PNRR în baza de date.</div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel-soft p-3">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}
