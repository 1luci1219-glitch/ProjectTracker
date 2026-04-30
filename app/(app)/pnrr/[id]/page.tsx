import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/section";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { getDataset } from "@/lib/data/repository";
import { daysRemaining, isClarificationAnswered } from "@/lib/domain";
import { formatDate } from "@/lib/utils";

export default async function PnrrDetailPage({ params }: { params: { id: string } }) {
  const { companies, pnrrClarifications, projectNotes, projects } = await getDataset();
  const { id } = params;
  const project = projects.find((item) => item.id === id && item.programmeType === "pnrr");
  if (!project) notFound();

  const company = companies.find((item) => item.id === project.companyId);
  const clarifications = pnrrClarifications.filter((item) => item.projectId === project.id);
  const notes = projectNotes.filter((item) => item.projectId === project.id);

  return (
    <div>
      <SectionHeader
        eyebrow="Detaliu proiect PNRR"
        title={`${company?.name} · ${project.rueCode}`}
        description={`${project.callCode} · Componenta ${project.component ?? "—"}`}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Clarificări</p>
          <p className="mt-2 text-2xl font-semibold">{clarifications.length}</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Nerăspunse</p>
          <p className="mt-2 text-2xl font-semibold">{clarifications.filter((item) => !isClarificationAnswered(item)).length}</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Componentă</p>
          <div className="mt-2"><Badge tone={project.component === "A" ? "blue" : "dark"}>{project.component}</Badge></div>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">Ultima actualizare</p>
          <p className="mt-2 font-semibold">{formatDate(project.updatedAt)}</p>
        </div>
      </div>

      <section className="mt-6">
        <SectionHeader title="Clarificări" />
        <SimpleTable
          columns={["Subiect", "Tip", "Prioritate", "Primire", "Limită", "Zile", "Status", "Transmitere", "Observații"]}
          rows={clarifications.map((item) => [
            item.subject,
            item.requestType,
            <PriorityBadge key="priority" priority={item.priority} />,
            formatDate(item.dateReceived),
            formatDate(item.responseDeadline),
            isClarificationAnswered(item) ? "Răspuns" : daysRemaining(item.responseDeadline),
            <StatusBadge key="status" status={item.status} />,
            formatDate(item.dateSent),
            item.notes ?? "—"
          ])}
        />
      </section>

      <section className="panel mt-6 p-5">
        <SectionHeader title="Istoric / note" />
        <div className="space-y-3">
          {(notes.length ? notes : [{ id: "fallback", body: "Nu există note suplimentare pentru acest proiect.", createdAt: project.updatedAt }]).map((note) => (
            <div key={note.id} className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(13,24,43,0.75)] p-3 text-sm">
              <Badge>{formatDate(note.createdAt)}</Badge>
              <p className="mt-2 text-[var(--foreground)]">{note.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
