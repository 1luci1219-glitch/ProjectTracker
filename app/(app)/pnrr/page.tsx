import Link from "next/link";
import { AlertTriangle, Clock3, FileText, FolderKanban } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { AddProjectForm, DeleteProjectButton } from "@/components/ui/project-crud";
import { getDataset } from "@/lib/data/repository";
import { clarificationUrgency, isClarificationAnswered, summarizePnrr } from "@/lib/domain";
import { formatDate } from "@/lib/utils";

export default async function PnrrPage() {
  const { companies, pnrrClarifications, projects } = await getDataset();
  const pnrrProjects = projects.filter((project) => project.programmeType === "pnrr");
  const summary = summarizePnrr(pnrrClarifications, projects);

  const projectRows = pnrrProjects.map((project) => {
    const company = companies.find((item) => item.id === project.companyId);
    const clarifications = pnrrClarifications.filter((item) => item.projectId === project.id);
    const active = clarifications.filter((item) => item.status === "În lucru").length;
    const answered = clarifications.filter(isClarificationAnswered).length;
    const urgent = clarifications.filter((item) => ["urgent", "overdue"].includes(clarificationUrgency(item))).length;

    return [
      <Link key="company" href={`/pnrr/${project.id}`} className="font-semibold text-[var(--ink)] hover:text-[var(--accent)] hover:underline">
        {company?.name}
      </Link>,
      project.projectLabel,
      project.rueCode,
      project.component ? <Badge key="component" tone={project.component === "A" ? "blue" : "dark"}>Componenta {project.component}</Badge> : "—",
      <Badge key="progress" tone={clarifications.length ? (Math.round((answered / clarifications.length) * 100) >= 60 ? "success" : "warning") : "neutral"}>
        {clarifications.length ? `${Math.round((answered / clarifications.length) * 100)}%` : "0%"}
      </Badge>,
      urgent ? <Badge key="urgent" tone="danger">{urgent}</Badge> : <Badge key="urgent">0</Badge>,
      formatDate(project.updatedAt),
      <DeleteProjectButton key="delete" projectId={project.id} />
    ];
  });

  return (
    <div>
      <SectionHeader
        eyebrow="PNRR / REPowerEU"
        title="Situație proiecte PNRR"
        description="Vedere simplificată pe progresul clarificărilor și riscurile de termen."
      />

      <AddProjectForm module="pnrr" />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={FolderKanban} label="Proiecte PNRR" value={summary.projects} detail="8 RUE-uri" />
        <MetricCard icon={FileText} label="Clarificări" value={summary.clarifications} />
        <MetricCard icon={Clock3} label="Nerăspunse" value={summary.unanswered} tone="warning" />
        <MetricCard icon={AlertTriangle} label="Urgente + expirate" value={summary.dueInTwoDays + summary.overdue} tone="danger" />
      </div>

      <section className="mt-6">
        <SectionHeader title="Proiecte PNRR" description="Un singur tabel principal, orientat pe progres și risc." />
        <SimpleTable
          columns={["Companie", "Proiect", "RUE", "Componentă", "Progres", "Urgente", "Ultima actualizare", "Acțiuni"]}
          rows={projectRows}
        />
      </section>
    </div>
  );
}
