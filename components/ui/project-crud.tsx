import { createProjectAction, deleteProjectAction } from "@/lib/data/mutations";

export function AddProjectForm({ module }: { module: "fm" | "pnrr" }) {
  return (
    <form action={createProjectAction} className="panel-soft grid gap-2 p-3 md:grid-cols-6">
      <input type="hidden" name="module" value={module} />
      <input name="companyName" placeholder="UAT / companie" className="focus-ring rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.8)] px-3 py-2 text-sm" />
      <input name="projectLabel" placeholder="Etichetă proiect" className="focus-ring rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.8)] px-3 py-2 text-sm" />
      <input name="projectName" placeholder="Nume proiect (opțional)" className="focus-ring rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.8)] px-3 py-2 text-sm" />
      {module === "pnrr" ? (
        <>
          <input name="rueCode" placeholder="RUE" className="focus-ring rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.8)] px-3 py-2 text-sm" />
          <select name="component" className="focus-ring rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.8)] px-3 py-2 text-sm">
            <option value="">Componentă</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </>
      ) : (
        <>
          <input disabled placeholder="RUE (doar PNRR)" className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.45)] px-3 py-2 text-sm text-[var(--muted)]" />
          <input disabled placeholder="Componentă (doar PNRR)" className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.45)] px-3 py-2 text-sm text-[var(--muted)]" />
        </>
      )}
      <button className="btn-accent focus-ring px-4 py-2 text-sm">Adaugă proiect</button>
    </form>
  );
}

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  return (
    <form action={deleteProjectAction}>
      <input type="hidden" name="projectId" value={projectId} />
      <button className="focus-ring rounded-full border border-[rgba(255,108,146,0.45)] bg-[rgba(255,108,146,0.14)] px-2.5 py-1 text-xs font-semibold text-[#ffc1d2]">
        Șterge
      </button>
    </form>
  );
}
