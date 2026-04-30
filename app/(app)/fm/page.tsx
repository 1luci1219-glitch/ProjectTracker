import Link from "next/link";
import { AlertCircle, ClipboardList, FolderOpen, Send } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { DeleteProjectButton } from "@/components/ui/project-crud";
import { getDataset } from "@/lib/data/repository";
import { dosarPending, summarizeFm } from "@/lib/domain";
import { shortText } from "@/lib/utils";

export default async function FmPage() {
  const { companies, fmActions, fmAddenda, fmDosare, projects } = await getDataset();
  const fmProjects = projects.filter((p) => p.programmeType === "fm");
  const summary = summarizeFm(fmActions, fmAddenda, projects, fmDosare);

  const rows = fmProjects.map((project) => {
    const company = companies.find((c) => c.id === project.companyId);
    const dosare = fmDosare.filter((d) => d.projectId === project.id);
    const actions = fmActions.filter((a) => a.projectId === project.id);
    const addendum = fmAddenda.find((a) => a.projectId === project.id);

    const uploaded = dosare.filter((d) => d.status === "Încărcat").length;
    const total = dosare.length;
    const hasIncompleteDosare = dosare.some((d) => dosarPending(d.status));
    const dosareTone = hasIncompleteDosare ? "warning" : total > 0 ? "success" : "neutral";

    const cr1 = actions.find((a) => a.actionType === "CR1");
    const pref = actions.find((a) => a.actionType === "Cerere prefinanțare");
    const crFinala = actions.find((a) => a.actionType === "CR Finală");

    const obs = dosare.find((d) => d.notes)?.notes ?? addendum?.notes ?? project.notes ?? "";

    return [
      <Link key="name" href={`/fm/${project.id}`} className="font-semibold text-[var(--ink)] hover:text-[var(--accent)] hover:underline">
        {company?.name ?? project.projectLabel}
      </Link>,
      total > 0
        ? <Badge key="dosare" tone={dosareTone}>{uploaded}/{total} dosare</Badge>
        : <Badge key="dosare" tone="neutral">—</Badge>,
      cr1
        ? <StatusBadge key="cr1" status={cr1.transmittedStatus} />
        : <Badge key="cr1" tone="neutral">—</Badge>,
      pref
        ? <StatusBadge key="pref" status={pref.transmittedStatus} />
        : <Badge key="pref" tone="neutral">—</Badge>,
      crFinala
        ? <StatusBadge key="crf" status={crFinala.transmittedStatus} />
        : <Badge key="crf" tone="blue">Nepusă</Badge>,
      addendum?.requiresAddendum
        ? <StatusBadge key="aa" status={addendum.platformStatus} />
        : <Badge key="aa" tone="neutral">—</Badge>,
      <span key="obs" className="text-[var(--muted)] text-xs">{shortText(obs)}</span>,
      <DeleteProjectButton key="del" projectId={project.id} />
    ];
  });

  return (
    <div>
      <SectionHeader
        eyebrow="Fondul de Modernizare"
        title="Situație proiecte FM"
        description="Monitorizare dosare de achiziții încărcate și cereri de transfer/rambursare transmise."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={ClipboardList} label="Proiecte FM" value={summary.projects} />
        <MetricCard
          icon={FolderOpen}
          label="Dosare incomplete"
          value={summary.projectsWithIncompleteDosare}
          tone={summary.projectsWithIncompleteDosare > 0 ? "warning" : "success"}
          detail="beneficiari cu dosare lipsă"
        />
        <MetricCard
          icon={Send}
          label="Cereri netransmise"
          value={summary.pendingCereri}
          tone={summary.pendingCereri > 0 ? "warning" : "success"}
          detail="CR1 / prefinanțare / finale"
        />
        <MetricCard
          icon={AlertCircle}
          label="AA neînceput"
          value={summary.pendingAddenda}
          tone={summary.pendingAddenda > 0 ? "danger" : "success"}
          detail={`din ${summary.requiredAddenda} necesare`}
        />
      </div>

      <section className="mt-6">
        <SectionHeader
          title="Lista proiectelor FM"
          description="Dosare = fișiere achiziții încărcate în MySMIS. CR1 / Pref. = cereri transmise."
        />
        <SimpleTable
          columns={["Beneficiar", "Dosare", "CR1", "Pref.", "CR Finală", "AA", "Observații", "Acțiuni"]}
          rows={rows}
        />
      </section>
    </div>
  );
}
