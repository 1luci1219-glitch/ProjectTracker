import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Badge, DosarBadge, StatusBadge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section";
import {
  createFmDosarAction,
  createFmRequestAction,
  deleteFmDosarAction,
  deleteFmRequestAction,
  updateFmDosarAction,
  updateFmRequestAction
} from "@/lib/data/mutations";
import { getDataset } from "@/lib/data/repository";
import type { FmActionType, FmDosarStatus, FmDosarType, TransmissionStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const dosarTypes: FmDosarType[] = ["Audit financiar", "SF + Consultanță", "Lucrări (CEF)", "Publicitate", "Dirigenție de șantier"];
const dosarStatuses: FmDosarStatus[] = ["Neprelucrat", "În lucru", "Încărcat", "N/A"];
const requestTypes: FmActionType[] = ["CR1", "Prefinanțare", "CR2", "CR3"];
const requestStatuses: TransmissionStatus[] = ["draft", "transmis", "aprobat", "respins"];
const requestOrder = new Map(requestTypes.map((type, index) => [type, index]));

export default async function FmDetailPage({ params }: { params: { id: string } }) {
  const { companies, fmActions, fmDosare, projects } = await getDataset();
  const project = projects.find((item) => item.id === params.id && item.programmeType === "fm");
  if (!project) notFound();

  const company = companies.find((item) => item.id === project.companyId);
  const dosare = fmDosare.filter((item) => item.projectId === project.id);
  const cereri = fmActions
    .filter((item) => item.projectId === project.id)
    .slice()
    .sort((a, b) => (requestOrder.get(a.actionType) ?? 99) - (requestOrder.get(b.actionType) ?? 99) || (a.dateSent ?? "").localeCompare(b.dateSent ?? ""));

  return (
    <div>
      <Link href="/fm" className="tool-button focus-ring mb-5">
        <ArrowLeft className="h-4 w-4" />
        Înapoi la beneficiari
      </Link>

      <SectionHeader
        eyebrow="Detaliu beneficiar FM"
        title={company?.name ?? project.projectLabel}
        description={`${project.projectLabel} · ${project.generalStatus}`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard label="Dosare" value={dosare.length} />
        <InfoCard label="Cereri" value={cereri.length} />
        <InfoCard label="Ultima actualizare" value={formatDate(project.updatedAt.slice(0, 10))} />
      </div>

      <section className="panel mt-6 p-5">
        <SectionHeader title="Dosare" description="Status fișiere / documente încărcate pentru beneficiar." />
        <form action={createFmDosarAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_0.7fr_1fr_auto]">
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="companyId" value={project.companyId} />
          <select name="dosarType" className="form-field focus-ring" required>
            {dosarTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
          <select name="status" className="form-field focus-ring" defaultValue="Neprelucrat">
            {dosarStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <input name="notes" className="form-field focus-ring" placeholder="Observații" />
          <button className="btn-accent focus-ring inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            Adaugă dosar
          </button>
        </form>

        <div className="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)]">
          <div className="hidden grid-cols-[1fr_0.55fr_1fr_0.9fr] gap-3 border-b border-[var(--line)] bg-[rgba(13,24,43,0.86)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)] md:grid">
            <span>Tip dosar</span>
            <span>Status</span>
            <span>Observații</span>
            <span>Acțiuni</span>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {dosare.map((item) => (
              <div key={item.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_0.55fr_1fr_0.9fr] md:items-center">
                <p className="font-semibold text-[var(--ink)]">{item.dosarType}</p>
                <DosarBadge status={item.status} />
                <p className="text-sm text-[var(--muted)]">{item.notes ?? "—"}</p>
                <div className="flex flex-wrap gap-2">
                  <details className="inline-editor flex-1">
                    <summary>Editează</summary>
                    <form action={updateFmDosarAction} className="mt-3 grid gap-2">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="projectId" value={project.id} />
                      <select name="dosarType" defaultValue={item.dosarType} className="form-field focus-ring">
                        {dosarTypes.map((type) => <option key={type}>{type}</option>)}
                      </select>
                      <select name="status" defaultValue={item.status} className="form-field focus-ring">
                        {dosarStatuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                      <textarea name="notes" defaultValue={item.notes ?? ""} className="form-field focus-ring" placeholder="Observații" />
                      <button className="btn-accent focus-ring px-4 py-2 text-sm">Salvează</button>
                    </form>
                  </details>
                  <form action={deleteFmDosarAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="projectId" value={project.id} />
                    <button className="danger-button focus-ring" title="Șterge dosar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
        {dosare.length === 0 ? <Empty text="Nu există dosare pentru acest beneficiar." /> : null}
      </section>

      <section className="panel mt-6 p-5">
        <SectionHeader title="Cereri de rambursare" description="Ordine: CR1, Prefinanțare, CR2, CR3. Poți adăuga mai multe cereri per beneficiar." />
        <form action={createFmRequestAction} className="mt-4 grid gap-3 md:grid-cols-[0.7fr_0.7fr_0.7fr_1fr_auto]">
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="companyId" value={project.companyId} />
          <select name="actionType" className="form-field focus-ring" required>
            {requestTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
          <select name="status" className="form-field focus-ring" defaultValue="draft">
            {requestStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <input type="date" name="dateSent" className="form-field focus-ring" />
          <input name="notes" className="form-field focus-ring" placeholder="Observații" />
          <button className="btn-accent focus-ring inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            Adaugă cerere
          </button>
        </form>

        <div className="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)]">
          <div className="hidden grid-cols-[0.55fr_0.55fr_0.55fr_1fr_0.9fr] gap-3 border-b border-[var(--line)] bg-[rgba(13,24,43,0.86)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)] md:grid">
            <span>Tip</span>
            <span>Status</span>
            <span>Data</span>
            <span>Observații</span>
            <span>Acțiuni</span>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {cereri.map((item) => (
              <div key={item.id} className="grid gap-3 px-4 py-4 md:grid-cols-[0.55fr_0.55fr_0.55fr_1fr_0.9fr] md:items-center">
                <p className="font-semibold text-[var(--ink)]">{item.actionType}</p>
                <StatusBadge status={item.transmittedStatus} />
                <p className="text-sm text-[var(--muted)]">{formatDate(item.dateSent)}</p>
                <p className="text-sm text-[var(--muted)]">{item.notes ?? "—"}</p>
                <div className="flex flex-wrap gap-2">
                  <details className="inline-editor flex-1">
                    <summary>Editează</summary>
                    <form action={updateFmRequestAction} className="mt-3 grid gap-2">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="projectId" value={project.id} />
                      <select name="actionType" defaultValue={item.actionType} className="form-field focus-ring">
                        {requestTypes.map((type) => <option key={type}>{type}</option>)}
                      </select>
                      <select name="status" defaultValue={item.transmittedStatus} className="form-field focus-ring">
                        {requestStatuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                      <input type="date" name="dateSent" defaultValue={item.dateSent ?? ""} className="form-field focus-ring" />
                      <textarea name="notes" defaultValue={item.notes ?? ""} className="form-field focus-ring" placeholder="Observații" />
                      <button className="btn-accent focus-ring px-4 py-2 text-sm">Salvează</button>
                    </form>
                  </details>
                  <form action={deleteFmRequestAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="projectId" value={project.id} />
                    <button className="danger-button focus-ring" title="Șterge cerere">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
        {cereri.length === 0 ? <Empty text="Nu există cereri pentru acest beneficiar." /> : null}
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">{text}</div>;
}
