import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section";
import {
  createPnrrClarificationAction,
  deletePnrrClarificationAction,
  updatePnrrClarificationAction
} from "@/lib/data/mutations";
import { getDataset } from "@/lib/data/repository";
import { clarificationUrgency, daysRemaining } from "@/lib/domain";
import type { ClarificationStatus, Priority } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const priorities: Priority[] = ["Ridicată", "Medie", "Scăzută"];
const statuses: ClarificationStatus[] = ["draft", "trimis", "răspuns primit", "închis"];
const requestTypes = ["Solicitare documente", "Cerere transfer", "Contestație", "Altul"];

export default async function PnrrDetailPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { filter?: string };
}) {
  const { companies, pnrrClarifications, projects } = await getDataset();
  const project = projects.find((item) => item.id === params.id && item.programmeType === "pnrr");
  if (!project) notFound();

  const company = companies.find((item) => item.id === project.companyId);
  const allClarifications = pnrrClarifications
    .filter((item) => item.projectId === project.id)
    .slice()
    .sort((a, b) => a.responseDeadline.localeCompare(b.responseDeadline));

  const activeFilter = searchParams?.filter ?? "all";
  const clarifications = allClarifications.filter((item) => {
    const urgency = clarificationUrgency(item);
    if (activeFilter === "urgent") return urgency === "urgent";
    if (activeFilter === "overdue") return urgency === "overdue";
    return true;
  });
  const urgent = allClarifications.filter((item) => clarificationUrgency(item) === "urgent").length;
  const overdue = allClarifications.filter((item) => clarificationUrgency(item) === "overdue").length;

  return (
    <div>
      <Link href="/pnrr" className="tool-button focus-ring mb-5">
        <ArrowLeft className="h-4 w-4" />
        Înapoi la proiecte
      </Link>

      <SectionHeader
        eyebrow="Proiect PNRR"
        title={`${company?.name ?? project.projectLabel} · ${project.rueCode ?? "fără RUE"}`}
        description={`${project.callCode ?? "Fără cod apel"} · Componenta ${project.component ?? "—"}`}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <InfoCard label="Clarificări" value={allClarifications.length} />
        <InfoCard label="Urgente" value={urgent} tone={urgent > 0 ? "warning" : "success"} />
        <InfoCard label="Overdue" value={overdue} tone={overdue > 0 ? "danger" : "success"} />
        <InfoCard label="Status proiect" value={project.generalStatus} />
      </div>

      <section className="panel mt-6 p-5">
        <SectionHeader title="Adaugă clarificare" description="Clarificarea este salvată în baza de date și apare imediat în listă după submit." />
        <form action={createPnrrClarificationAction} className="mt-4 grid gap-3 lg:grid-cols-4">
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="companyId" value={project.companyId} />
          <label className="form-label lg:col-span-2">
            Descriere
            <input name="subject" className="form-field focus-ring" required placeholder="Descriere clarificare" />
          </label>
          <label className="form-label">
            RUE / cod
            <input value={project.rueCode ?? ""} className="form-field" readOnly />
          </label>
          <label className="form-label">
            Tip
            <select name="requestType" className="form-field focus-ring">
              {requestTypes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="form-label">
            Data primire
            <input type="date" name="dateReceived" className="form-field focus-ring" required />
          </label>
          <label className="form-label">
            Data limită
            <input type="date" name="responseDeadline" className="form-field focus-ring" required />
          </label>
          <label className="form-label">
            Prioritate
            <select name="priority" className="form-field focus-ring" defaultValue="Medie">
              {priorities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="form-label">
            Status
            <select name="status" className="form-field focus-ring" defaultValue="draft">
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="form-label">
            Responsabil
            <input name="responsible" className="form-field focus-ring" placeholder="Nume" />
          </label>
          <label className="form-label lg:col-span-2">
            Observații
            <input name="notes" className="form-field focus-ring" placeholder="Observații interne" />
          </label>
          <button className="btn-accent focus-ring inline-flex items-center justify-center gap-2 px-4 py-2 text-sm lg:self-end">
            <Plus className="h-4 w-4" />
            Adaugă clarificare
          </button>
        </form>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeader title="Clarificări" description="Filtrele arată doar itemii urgenti sau depășiți." />
          <div className="flex flex-wrap gap-2">
            <FilterLink href={`/pnrr/${project.id}`} active={activeFilter === "all"}>Toate</FilterLink>
            <FilterLink href={`/pnrr/${project.id}?filter=urgent`} active={activeFilter === "urgent"}>Urgent</FilterLink>
            <FilterLink href={`/pnrr/${project.id}?filter=overdue`} active={activeFilter === "overdue"}>Overdue</FilterLink>
          </div>
        </div>

        <div className="space-y-3">
          {clarifications.map((item) => {
            const days = daysRemaining(item.responseDeadline);
            return (
              <article key={item.id} className="panel p-4">
                <div className="grid gap-4 xl:grid-cols-[1.2fr_0.75fr_0.7fr_0.7fr_0.55fr_0.7fr_0.8fr_1fr] xl:items-center">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--ink)]">{item.subject}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{project.rueCode ?? "Fără RUE"}</p>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{item.requestType}</p>
                  <PriorityBadge priority={item.priority} />
                  <p className="text-sm text-[var(--muted)]">{formatDate(item.dateReceived)}</p>
                  <Badge tone={days < 0 ? "danger" : days <= 2 ? "warning" : "blue"}>{days < 0 ? `${Math.abs(days)} întârziere` : `${days} zile`}</Badge>
                  <StatusBadge status={item.status} />
                  <p className="text-sm text-[var(--muted)]">{item.responsible || "—"}</p>
                  <p className="text-sm text-[var(--muted)]">{item.notes || "—"}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <details className="inline-editor flex-1">
                    <summary>Editează clarificare</summary>
                    <form action={updatePnrrClarificationAction} className="mt-3 grid gap-3 lg:grid-cols-4">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="projectId" value={project.id} />
                      <label className="form-label lg:col-span-2">
                        Descriere
                        <input name="subject" defaultValue={item.subject} className="form-field focus-ring" required />
                      </label>
                      <label className="form-label">
                        Tip
                        <select name="requestType" defaultValue={item.requestType} className="form-field focus-ring">
                          {requestTypes.map((value) => <option key={value}>{value}</option>)}
                        </select>
                      </label>
                      <label className="form-label">
                        Prioritate
                        <select name="priority" defaultValue={item.priority} className="form-field focus-ring">
                          {priorities.map((value) => <option key={value}>{value}</option>)}
                        </select>
                      </label>
                      <label className="form-label">
                        Data primire
                        <input type="date" name="dateReceived" defaultValue={item.dateReceived} className="form-field focus-ring" required />
                      </label>
                      <label className="form-label">
                        Data limită
                        <input type="date" name="responseDeadline" defaultValue={item.responseDeadline} className="form-field focus-ring" required />
                      </label>
                      <label className="form-label">
                        Status
                        <select name="status" defaultValue={item.status} className="form-field focus-ring">
                          {statuses.map((value) => <option key={value}>{value}</option>)}
                        </select>
                      </label>
                      <label className="form-label">
                        Data trimitere
                        <input type="date" name="dateSent" defaultValue={item.dateSent ?? ""} className="form-field focus-ring" />
                      </label>
                      <label className="form-label">
                        Responsabil
                        <input name="responsible" defaultValue={item.responsible ?? ""} className="form-field focus-ring" />
                      </label>
                      <label className="form-label lg:col-span-2">
                        Observații
                        <textarea name="notes" defaultValue={item.notes ?? ""} className="form-field focus-ring" />
                      </label>
                      <button className="btn-accent focus-ring px-4 py-2 text-sm lg:self-end">Salvează</button>
                    </form>
                  </details>
                  <form action={deletePnrrClarificationAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="projectId" value={project.id} />
                    <button className="danger-button focus-ring" title="Șterge clarificare">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
          {clarifications.length === 0 ? <Empty text="Nu există clarificări pentru filtrul selectat." /> : null}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value, tone = "blue" }: { label: string; value: string | number; tone?: "blue" | "warning" | "danger" | "success" }) {
  return (
    <div className="panel p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</p>
      <div className="mt-2">
        <Badge tone={tone}>{value}</Badge>
      </div>
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={active ? "btn-accent focus-ring px-4 py-2 text-sm" : "tool-button focus-ring"}>
      {children}
    </Link>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="panel p-5 text-sm text-[var(--muted)]">{text}</div>;
}
