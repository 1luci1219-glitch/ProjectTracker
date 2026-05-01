import Link from "next/link";
import { Building2, FolderOpen, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section";
import { createProjectAction, deleteProjectAction, updateProjectAction } from "@/lib/data/mutations";
import { getDataset } from "@/lib/data/repository";
import { dosarPending } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function FmPage() {
  const { companies, fmActions, fmDosare, projects } = await getDataset();
  const fmProjects = projects.filter((project) => project.programmeType === "fm");

  return (
    <div>
      <SectionHeader
        eyebrow="Fondul de Modernizare"
        title="Beneficiari"
        description="Listă internă de beneficiari FM. Fiecare beneficiar are dosare și cereri editabile."
      />

      <section className="panel p-5">
        <SectionHeader title="Adaugă beneficiar" description="Creează un beneficiar FM nou în baza de date." />
        <form action={createProjectAction} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input type="hidden" name="module" value="fm" />
          <label className="form-label">
            Beneficiar
            <input name="companyName" className="form-field focus-ring" placeholder="Nume beneficiar" required />
          </label>
          <label className="form-label">
            Etichetă proiect
            <input name="projectLabel" className="form-field focus-ring" placeholder="Ex. FM1" required />
          </label>
          <label className="form-label">
            Nume proiect
            <input name="projectName" className="form-field focus-ring" placeholder="Opțional" />
          </label>
          <label className="form-label xl:col-span-1">
            Observații
            <input name="notes" className="form-field focus-ring" placeholder="Opțional" />
          </label>
          <button className="btn-accent focus-ring inline-flex items-center justify-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            Adaugă
          </button>
        </form>
      </section>

      <section className="mt-6">
        <SectionHeader title="Listă beneficiari" description="Accesează un beneficiar pentru CRUD pe dosare și cereri." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fmProjects.map((project) => {
            const company = companies.find((item) => item.id === project.companyId);
            const dosare = fmDosare.filter((item) => item.projectId === project.id);
            const cereri = fmActions.filter((item) => item.projectId === project.id);
            const incomplete = dosare.filter((item) => dosarPending(item.status)).length;
            const statusTone = incomplete > 0 ? "warning" : project.generalStatus === "Închis" ? "success" : "blue";

            return (
              <article key={project.id} className="panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-[var(--ink)]">{company?.name ?? project.projectLabel}</p>
                    <p className="mt-1 truncate text-sm text-[var(--muted)]">{project.projectLabel}</p>
                  </div>
                  <Badge tone={statusTone}>{project.generalStatus}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="panel-soft p-3">
                    <div className="flex items-center gap-2 text-[var(--accent)]">
                      <FolderOpen className="h-4 w-4" />
                      <span className="text-sm font-semibold">Dosare</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{dosare.length}</p>
                  </div>
                  <div className="panel-soft p-3">
                    <div className="flex items-center gap-2 text-[var(--accent)]">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm font-semibold">Cereri</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{cereri.length}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/fm/${project.id}`} className="tool-button focus-ring">Deschide</Link>
                  <details className="inline-editor flex-1">
                    <summary>Editează</summary>
                    <form action={updateProjectAction} className="mt-3 grid gap-3">
                      <input type="hidden" name="projectId" value={project.id} />
                      <input type="hidden" name="companyId" value={project.companyId} />
                      <input type="hidden" name="module" value="fm" />
                      <input name="companyName" defaultValue={company?.name ?? ""} className="form-field focus-ring" required />
                      <input name="projectLabel" defaultValue={project.projectLabel} className="form-field focus-ring" required />
                      <input name="projectName" defaultValue={project.projectName} className="form-field focus-ring" />
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
                    <input type="hidden" name="module" value="fm" />
                    <button className="danger-button focus-ring" title="Șterge beneficiar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
        {fmProjects.length === 0 ? (
          <div className="panel mt-4 p-5 text-sm text-[var(--muted)]">Nu există beneficiari FM în baza de date.</div>
        ) : null}
      </section>
    </div>
  );
}
