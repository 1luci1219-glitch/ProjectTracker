import { differenceInCalendarDays, parseISO } from "date-fns";
import type {
  ClarificationStatus,
  FmAction,
  FmAddendum,
  FmDosar,
  FmDosarStatus,
  PnrrClarification,
  Priority,
  Project,
  TransmissionStatus
} from "@/lib/types";

export const priorityOrder: Record<Priority, number> = {
  Ridicată: 0,
  Medie: 1,
  Scăzută: 2
};

export function daysRemaining(deadline: string) {
  return differenceInCalendarDays(parseISO(deadline), new Date());
}

export function isClarificationAnswered(item: PnrrClarification) {
  return item.isAnswerSent || item.status === "Răspuns trimis" || item.status === "Închis" || item.status === "răspuns primit" || item.status === "închis";
}

export function clarificationUrgency(item: PnrrClarification) {
  if (isClarificationAnswered(item)) return "answered";
  const days = daysRemaining(item.responseDeadline);
  if (days < 0) return "overdue";
  if (days <= 2) return "urgent";
  if (days <= 5) return "soon";
  return "normal";
}

export function pendingTransmission(status: TransmissionStatus) {
  return status !== "Transmis" && status !== "Acceptat" && status !== "transmis" && status !== "aprobat" && status !== "N/A";
}

export function dosarUploaded(status: FmDosarStatus) {
  return status === "Încărcat";
}

export function dosarPending(status: FmDosarStatus) {
  return status !== "Încărcat" && status !== "N/A";
}

export function dosarTone(status: FmDosarStatus): "success" | "warning" | "neutral" | "blue" {
  if (status === "Încărcat") return "success";
  if (status === "În lucru") return "warning";
  if (status === "N/A") return "blue";
  return "neutral";
}

export function projectCompany(project: Project, companies: Array<{ id: string; name: string }>) {
  return companies.find((company) => company.id === project.companyId)?.name ?? "Beneficiar necunoscut";
}

export function summarizePnrr(clarifications: PnrrClarification[], projects: Project[]) {
  const active = projects.filter((project) => project.programmeType === "pnrr");
  const unanswered = clarifications.filter((item) => !isClarificationAnswered(item));
  const urgent = unanswered.filter((item) => clarificationUrgency(item) === "urgent");
  const overdue = unanswered.filter((item) => clarificationUrgency(item) === "overdue");

  return {
    projects: active.length,
    clarifications: clarifications.length,
    unanswered: unanswered.length,
    urgent: urgent.length,
    overdue: overdue.length,
    dueInTwoDays: urgent.length
  };
}

export function summarizeFm(
  actions: FmAction[],
  addenda: FmAddendum[],
  projects: Project[],
  dosare: FmDosar[]
) {
  const fmProjects = projects.filter((p) => p.programmeType === "fm");

  const projectsWithIncompleteDosare = fmProjects.filter((p) => {
    const pd = dosare.filter((d) => d.projectId === p.id);
    return pd.some((d) => dosarPending(d.status));
  }).length;

  const pendingCereri = actions.filter(
    (a) => (a.actionType === "CR1" || a.actionType === "Cerere prefinanțare" || a.actionType === "CR Finală") &&
      pendingTransmission(a.transmittedStatus)
  ).length;

  const pendingAddenda = addenda.filter(
    (item) => item.requiresAddendum && pendingTransmission(item.platformStatus)
  ).length;

  return {
    projects: fmProjects.length,
    projectsWithIncompleteDosare,
    pendingCereri,
    requiredAddenda: addenda.filter((item) => item.requiresAddendum).length,
    pendingAddenda
  };
}

export function displayStatus(status: ClarificationStatus | TransmissionStatus) {
  return status;
}
