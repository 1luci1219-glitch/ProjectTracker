import Link from "next/link";
import { AlertTriangle, Building2, Clock3, FolderKanban } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { clarificationUrgency, isClarificationAnswered, pendingTransmission, summarizeFm, summarizePnrr } from "@/lib/domain";
import { getDataset } from "@/lib/data/repository";

export default async function GeneralDashboardPage() {
  const { companies, fmActions, fmAddenda, fmDosare, pnrrClarifications, projects } = await getDataset();
  const pnrr = summarizePnrr(pnrrClarifications, projects);
  const fm = summarizeFm(fmActions, fmAddenda, projects, fmDosare);
  const activeProjects = projects.filter((project) => project.generalStatus !== "Închis").length;

  const projectHealthRows = projects.map((project) => {
    const company = companies.find((candidate) => candidate.id === project.companyId);
    if (project.programmeType === "fm") {
      const actions = fmActions.filter((item) => item.projectId === project.id);
      const completedActions = actions.filter((item) => !pendingTransmission(item.transmittedStatus)).length;
      const progress = actions.length ? Math.round((completedActions / actions.length) * 100) : 0;
      const addendum = fmAddenda.find((item) => item.projectId === project.id);
      const risk = addendum && pendingTransmission(addendum.platformStatus) ? "Atenție" : "Stabil";
      return [
        company?.name ?? "Necunoscut",
        <Link key="project" href={`/fm/${project.id}`} className="font-semibold text-[var(--ink)] hover:text-[var(--accent)]">{project.projectLabel}</Link>,
        "FM",
        `${progress}%`,
        <Badge key="risk" tone={risk === "Atenție" ? "warning" : "success"}>{risk}</Badge>,
        <Badge key="status" tone={project.generalStatus === "Închis" ? "success" : "neutral"}>{project.generalStatus}</Badge>
      ];
    }

    const clarifications = pnrrClarifications.filter((item) => item.projectId === project.id);
    const answered = clarifications.filter(isClarificationAnswered).length;
    const progress = clarifications.length ? Math.round((answered / clarifications.length) * 100) : 0;
    const urgent = clarifications.filter((item) => ["urgent", "overdue"].includes(clarificationUrgency(item))).length;
    return [
      company?.name ?? "Necunoscut",
      <Link key="project" href={`/pnrr/${project.id}`} className="font-semibold text-[var(--ink)] hover:text-[var(--accent)]">{project.projectLabel}</Link>,
      "PNRR",
      `${progress}%`,
      <Badge key="risk" tone={urgent > 0 ? "danger" : "success"}>{urgent > 0 ? "Urgent" : "Stabil"}</Badge>,
      <Badge key="status" tone={project.generalStatus === "Închis" ? "success" : "neutral"}>{project.generalStatus}</Badge>
    ];
  });

  return (
    <div>
      <SectionHeader
        eyebrow="Privire de ansamblu"
        title="Dashboard general"
        description="Situația agregată pentru clarificări PNRR / REPowerEU și operațiuni MySMIS din Fondul de Modernizare."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={FolderKanban} label="Proiecte active" value={activeProjects} detail="PNRR + FM" />
        <MetricCard icon={Building2} label="Proiecte FM" value={fm.projects} detail="În implementare" />
        <MetricCard icon={Clock3} label="Clarificări nerezolvate" value={pnrr.unanswered} detail="Răspuns netransmis" />
        <MetricCard icon={AlertTriangle} label="AA FM restante" value={fm.pendingAddenda} tone="warning" detail="Necesită acțiune" />
      </div>

      <section className="mt-6">
        <SectionHeader title="Health proiecte" description="Vedere rapidă pe UAT, modul și progres operațional." />
        <SimpleTable columns={["UAT", "Proiect", "Modul", "Progres", "Risc", "Status"]} rows={projectHealthRows} />
      </section>
    </div>
  );
}
