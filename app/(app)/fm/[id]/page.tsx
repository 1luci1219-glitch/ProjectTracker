import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/section";
import { Badge, DosarBadge, StatusBadge } from "@/components/ui/badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { getDataset } from "@/lib/data/repository";
import { formatDate } from "@/lib/utils";

export default async function FmDetailPage({ params }: { params: { id: string } }) {
  const { companies, fmActions, fmAddenda, fmDosare, projectNotes, projects } = await getDataset();
  const { id } = params;
  const project = projects.find((item) => item.id === id && item.programmeType === "fm");
  if (!project) notFound();

  const company = companies.find((item) => item.id === project.companyId);
  const dosare = fmDosare.filter((item) => item.projectId === project.id);
  const cereri = fmActions.filter((item) => item.projectId === project.id);
  const addendum = fmAddenda.find((item) => item.projectId === project.id);
  const notes = projectNotes.filter((item) => item.projectId === project.id);

  const uploaded = dosare.filter((d) => d.status === "Încărcat").length;

  return (
    <div>
      <SectionHeader
        eyebrow="Detaliu proiect FM"
        title={company?.name ?? project.projectLabel}
        description={project.notes}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Status</p>
          <p className="mt-2 font-semibold">{project.generalStatus}</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Dosare încărcate</p>
          <p className="mt-2 font-semibold">{uploaded}/{dosare.length}</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Act adițional</p>
          <div className="mt-2"><StatusBadge status={addendum?.platformStatus ?? "Netransmis"} /></div>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Actualizare</p>
          <p className="mt-2 font-semibold">{formatDate(project.updatedAt)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section>
          <SectionHeader title="Dosare de achiziții" description="Fișiere încărcate în MySMIS" />
          <SimpleTable
            columns={["Tip dosar", "Status", "Observații"]}
            rows={dosare.map((item) => [
              item.dosarType,
              <DosarBadge key="s" status={item.status} />,
              <span key="n" className="text-xs text-[var(--muted)]">{item.notes ?? "—"}</span>
            ])}
          />
        </section>
        <section>
          <SectionHeader title="Cereri transmise" description="Cereri rambursare și prefinanțare" />
          <SimpleTable
            columns={["Tip cerere", "Status", "Dată"]}
            rows={cereri.map((item) => [
              item.actionType,
              <StatusBadge key="s" status={item.transmittedStatus} />,
              formatDate(item.dateSent)
            ])}
          />
        </section>
      </div>

      {addendum && (
        <section className="mt-6">
          <SectionHeader title="Act adițional" description={addendum.reason} />
          <SimpleTable
            columns={["Componentă", "Status"]}
            rows={[
              ["Modificare buget", <StatusBadge key="b" status={addendum.budgetChangeNeeded} />],
              ["Modificare plan achiziții", <StatusBadge key="p" status={addendum.procurementPlanChangeNeeded} />],
              ["Modificare activități + termen", <StatusBadge key="a" status={addendum.activitiesTermChangeNeeded} />],
              ["Documente pregătite", <StatusBadge key="d" status={addendum.documentsPrepared} />],
              ["Status platformă", <StatusBadge key="s" status={addendum.platformStatus} />]
            ]}
          />
        </section>
      )}

      {notes.length > 0 && (
        <section className="panel mt-6 p-5">
          <SectionHeader title="Note" />
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(13,24,43,0.75)] p-3 text-sm">
                <Badge tone="neutral">{formatDate(note.createdAt)}</Badge>
                <p className="mt-2 text-[var(--foreground)]">{note.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
