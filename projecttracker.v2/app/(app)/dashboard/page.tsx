import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Clock3, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section";
import { getDataset } from "@/lib/data/repository";
import { clarificationUrgency, daysRemaining, dosarPending, isClarificationAnswered, pendingTransmission } from "@/lib/domain";
import { formatDate, shortText } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { activityLogs, companies, fmActions, fmAddenda, fmDosare, pnrrClarifications, projects } = await getDataset();
  const companyById = new Map(companies.map((company) => [company.id, company.name]));
  const projectById = new Map(projects.map((project) => [project.id, project]));

  const openClarifications = pnrrClarifications.filter((item) => !isClarificationAnswered(item));
  const urgent = openClarifications.filter((item) => ["urgent", "overdue"].includes(clarificationUrgency(item)));
  const pendingFmActions = fmActions.filter((item) => pendingTransmission(item.transmittedStatus));
  const pendingAddenda = fmAddenda.filter((item) => item.requiresAddendum && pendingTransmission(item.platformStatus));
  const pendingDosare = fmDosare.filter((item) => dosarPending(item.status));

  const tasks = [
    ...urgent.map((item) => ({
      id: item.id,
      href: `/pnrr/${item.projectId}`,
      title: item.subject,
      context: projectById.get(item.projectId)?.projectLabel ?? companyById.get(item.companyId) ?? "PNRR",
      status: item.status,
      date: item.responseDeadline,
      tone: daysRemaining(item.responseDeadline) < 0 ? "danger" as const : "warning" as const
    })),
    ...pendingFmActions.map((item) => ({
      id: item.id,
      href: `/fm/${item.projectId}`,
      title: item.actionType,
      context: projectById.get(item.projectId)?.projectLabel ?? companyById.get(item.companyId) ?? "FM",
      status: item.transmittedStatus,
      date: item.dateSent ?? null,
      tone: "warning" as const
    })),
    ...pendingAddenda.map((item) => ({
      id: item.id,
      href: `/fm/${item.projectId}`,
      title: "Act adițional pending",
      context: projectById.get(item.projectId)?.projectLabel ?? companyById.get(item.companyId) ?? "FM",
      status: item.platformStatus,
      date: item.dateSent ?? null,
      tone: "danger" as const
    })),
    ...pendingDosare.map((item) => ({
      id: item.id,
      href: `/fm/${item.projectId}`,
      title: item.dosarType,
      context: projectById.get(item.projectId)?.projectLabel ?? companyById.get(item.companyId) ?? "FM",
      status: item.status,
      date: item.updatedAt.slice(0, 10),
      tone: "warning" as const
    }))
  ].slice(0, 14);

  const deadlines = openClarifications
    .slice()
    .sort((a, b) => a.responseDeadline.localeCompare(b.responseDeadline))
    .slice(0, 8);

  return (
    <div>
      <SectionHeader
        eyebrow="Dashboard"
        title="Acțiuni operaționale"
        description="Doar elementele care trebuie urmărite: task-uri, termene, urgente și activitate recentă."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <QuickMetric icon={ListChecks} label="Task-uri deschise" value={tasks.length} />
        <QuickMetric icon={AlertTriangle} label="Urgente / overdue" value={urgent.length} tone={urgent.length > 0 ? "danger" : "success"} />
        <QuickMetric icon={Clock3} label="Deadline-uri PNRR" value={deadlines.length} tone={deadlines.length > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="panel p-5">
          <SectionHeader title="Tasks & actions needed" description="Coada de lucru pentru echipă." />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {tasks.map((task) => (
              <Link key={task.id} href={task.href} className="motion-soft rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(13,24,43,0.72)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--ink)]">{task.title}</p>
                    <p className="mt-1 truncate text-sm text-[var(--muted)]">{task.context}</p>
                  </div>
                  <Badge tone={task.tone}>{task.status}</Badge>
                </div>
                <p className="mt-3 text-xs text-[var(--muted)]">{task.date ? formatDate(task.date) : "Fără dată"}</p>
              </Link>
            ))}
            {tasks.length === 0 ? <EmptyPanel text="Nu există task-uri deschise." /> : null}
          </div>
        </section>

        <section className="panel p-5">
          <SectionHeader title="Upcoming deadlines" description="Clarificări PNRR sortate după data limită." />
          <div className="mt-4 space-y-3">
            {deadlines.map((item) => {
              const days = daysRemaining(item.responseDeadline);
              return (
                <Link key={item.id} href={`/pnrr/${item.projectId}`} className="block rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(13,24,43,0.72)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[var(--ink)]">{item.subject}</p>
                      <p className="mt-1 truncate text-sm text-[var(--muted)]">{projectById.get(item.projectId)?.projectLabel ?? companyById.get(item.companyId)}</p>
                    </div>
                    <Badge tone={days < 0 ? "danger" : days <= 2 ? "warning" : "blue"}>{days < 0 ? `${Math.abs(days)} zile întârziere` : `${days} zile`}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-[var(--muted)]">Limită: {formatDate(item.responseDeadline)}</p>
                </Link>
              );
            })}
            {deadlines.length === 0 ? <EmptyPanel text="Nu există deadline-uri deschise." /> : null}
          </div>
        </section>
      </div>

      <section className="panel mt-6 p-5">
        <SectionHeader title="Recent activity" description="Ultimele modificări salvate în aplicație." />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {activityLogs.slice(0, 9).map((item) => (
            <div key={item.id} className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(13,24,43,0.72)] p-4">
              <div className="flex items-center justify-between gap-3">
                <Badge tone={item.module === "fm" ? "blue" : "dark"}>{item.module.toUpperCase()}</Badge>
                <span className="text-xs text-[var(--muted)]">{formatDate(item.createdAt.slice(0, 10))}</span>
              </div>
              <p className="mt-3 font-semibold text-[var(--ink)]">{item.label}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{shortText(item.description, 120)}</p>
            </div>
          ))}
          {activityLogs.length === 0 ? <EmptyPanel text="Nu există activitate recentă." /> : null}
        </div>
      </section>
    </div>
  );
}

function QuickMetric({ icon: Icon, label, value, tone = "blue" }: { icon: LucideIcon; label: string; value: number; tone?: "blue" | "danger" | "warning" | "success" }) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">{value}</p>
        </div>
        <span className="rounded-xl border border-[var(--line)] bg-[rgba(12,24,44,0.75)] p-2 text-[var(--accent)]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3"><Badge tone={tone}>live</Badge></div>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">{text}</div>;
}
