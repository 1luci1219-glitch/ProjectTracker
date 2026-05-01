import { differenceInCalendarDays, parseISO, subDays } from "date-fns";
import type {
  ActivityLog,
  Company,
  FmAction,
  FmAddendum,
  FmDosar,
  FmDosarType,
  PnrrClarification,
  Project
} from "@/lib/types";
import {
  clarificationUrgency,
  dosarPending,
  isClarificationAnswered,
  pendingTransmission
} from "@/lib/domain";

const DOSAR_TYPES: FmDosarType[] = [
  "Audit financiar",
  "SF + Consultanță",
  "Lucrări (CEF)",
  "Publicitate",
  "Dirigenție de șantier"
];

export type HeroStats = {
  fmProjects: number;
  fmTrend: number[];
  incompleteDosare: number;
  incompletePercent: number;
  pendingCereri: number;
  urgentClarifications: number;
  mostUrgentDays: number | null;
};

export function computeHeroStats(
  projects: Project[],
  fmDosare: FmDosar[],
  fmActions: FmAction[],
  pnrrClarifications: PnrrClarification[]
): HeroStats {
  const fm = projects.filter((p) => p.programmeType === "fm");
  const incomplete = fm.filter((p) =>
    fmDosare.filter((d) => d.projectId === p.id).some((d) => dosarPending(d.status))
  ).length;

  const cereri = fmActions.filter(
    (a) =>
      (a.actionType === "CR1" || a.actionType === "Cerere prefinanțare" || a.actionType === "CR Finală") &&
      pendingTransmission(a.transmittedStatus)
  ).length;

  const urgent = pnrrClarifications.filter(
    (c) => !isClarificationAnswered(c) && ["urgent", "overdue"].includes(clarificationUrgency(c))
  );

  const days = urgent.length
    ? Math.min(...urgent.map((c) => Math.max(differenceInCalendarDays(parseISO(c.responseDeadline), new Date()), -99)))
    : null;

  // Synthetic 7-day trend = count of items updated each day in last 7 days
  const fmTrend = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i);
    return fm.filter((p) => parseISO(p.updatedAt).toDateString() === day.toDateString()).length;
  });

  return {
    fmProjects: fm.length,
    fmTrend,
    incompleteDosare: incomplete,
    incompletePercent: fm.length ? Math.round(((fm.length - incomplete) / fm.length) * 100) : 0,
    pendingCereri: cereri,
    urgentClarifications: urgent.length,
    mostUrgentDays: days
  };
}

export type DonutSlice = { label: string; value: number; color: string };

export function computeDosareDistribution(fmDosare: FmDosar[]): DonutSlice[] {
  const counts = { Încărcat: 0, "În lucru": 0, Neprelucrat: 0, "N/A": 0 };
  fmDosare.forEach((d) => {
    counts[d.status] = (counts[d.status] ?? 0) + 1;
  });
  return [
    { label: "Încărcat", value: counts["Încărcat"], color: "var(--mint)" },
    { label: "În lucru", value: counts["În lucru"], color: "var(--amber)" },
    { label: "Neprelucrat", value: counts["Neprelucrat"], color: "var(--sky)" },
    { label: "N/A", value: counts["N/A"], color: "var(--violet)" }
  ].filter((s) => s.value > 0);
}

export function computePnrrStatusDistribution(clarifications: PnrrClarification[]): DonutSlice[] {
  const counts: Record<string, number> = {};
  clarifications.forEach((c) => {
    counts[c.status] = (counts[c.status] ?? 0) + 1;
  });
  const colors: Record<string, string> = {
    "Răspuns trimis": "var(--mint)",
    "În lucru": "var(--amber)",
    "În așteptare": "var(--sky)",
    Închis: "var(--violet)"
  };
  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
    color: colors[label] ?? "var(--cyan)"
  }));
}

export type Top10Row = { name: string; uploaded: number; total: number; projectId: string };

export function computeTop10Beneficiari(
  projects: Project[],
  fmDosare: FmDosar[],
  companies: Company[]
): Top10Row[] {
  return projects
    .filter((p) => p.programmeType === "fm")
    .map((p) => {
      const dosare = fmDosare.filter((d) => d.projectId === p.id);
      const uploaded = dosare.filter((d) => d.status === "Încărcat").length;
      const company = companies.find((c) => c.id === p.companyId);
      return {
        projectId: p.id,
        name: company?.name ?? p.projectLabel,
        uploaded,
        total: dosare.length || DOSAR_TYPES.length
      };
    })
    .sort((a, b) => b.uploaded - a.uploaded)
    .slice(0, 10);
}

export type WeeklyPoint = { date: string; count: number };

export function computeWeeklyActivity(
  projects: Project[],
  fmDosare: FmDosar[],
  fmActions: FmAction[],
  pnrrClarifications: PnrrClarification[]
): WeeklyPoint[] {
  const days = 14;
  return Array.from({ length: days }, (_, i) => {
    const day = subDays(new Date(), days - 1 - i);
    const key = day.toDateString();
    const count =
      projects.filter((p) => parseISO(p.updatedAt).toDateString() === key).length +
      fmDosare.filter((d) => parseISO(d.updatedAt).toDateString() === key).length +
      fmActions.filter((a) => parseISO(a.updatedAt).toDateString() === key).length +
      pnrrClarifications.filter((c) => parseISO(c.updatedAt).toDateString() === key).length;
    return { date: day.toISOString().slice(0, 10), count };
  });
}

export type HeatmapCell = {
  projectId: string;
  beneficiary: string;
  dosarType: FmDosarType;
  status: FmDosar["status"] | "Neprelucrat";
  notes?: string;
};

export type HeatmapRow = { projectId: string; beneficiary: string; cells: HeatmapCell[] };

export function buildHeatmap(
  projects: Project[],
  fmDosare: FmDosar[],
  companies: Company[]
): HeatmapRow[] {
  return projects
    .filter((p) => p.programmeType === "fm")
    .map((p) => {
      const company = companies.find((c) => c.id === p.companyId);
      const beneficiary = company?.name ?? p.projectLabel;
      const cells: HeatmapCell[] = DOSAR_TYPES.map((dosarType) => {
        const dosar = fmDosare.find((d) => d.projectId === p.id && d.dosarType === dosarType);
        return {
          projectId: p.id,
          beneficiary,
          dosarType,
          status: dosar?.status ?? "Neprelucrat",
          notes: dosar?.notes
        };
      });
      return { projectId: p.id, beneficiary, cells };
    });
}

export type ProblemRow = {
  projectId: string;
  beneficiary: string;
  uploaded: number;
  total: number;
  missing: FmDosarType[];
};

export function findIncompleteDosare(
  projects: Project[],
  fmDosare: FmDosar[],
  companies: Company[]
): ProblemRow[] {
  return projects
    .filter((p) => p.programmeType === "fm")
    .map((p) => {
      const dosare = fmDosare.filter((d) => d.projectId === p.id);
      const uploaded = dosare.filter((d) => d.status === "Încărcat").length;
      const total = dosare.length || DOSAR_TYPES.length;
      const missing = dosare.filter((d) => dosarPending(d.status)).map((d) => d.dosarType);
      const company = companies.find((c) => c.id === p.companyId);
      return {
        projectId: p.id,
        beneficiary: company?.name ?? p.projectLabel,
        uploaded,
        total,
        missing
      };
    })
    .filter((row) => row.missing.length > 0)
    .sort((a, b) => a.uploaded - b.uploaded)
    .slice(0, 8);
}

export type UrgentClarif = {
  id: string;
  projectId: string;
  company: string;
  subject: string;
  daysLeft: number;
  priority: PnrrClarification["priority"];
};

export function findUrgentClarifications(
  clarifications: PnrrClarification[],
  projects: Project[],
  companies: Company[]
): UrgentClarif[] {
  return clarifications
    .filter((c) => !isClarificationAnswered(c))
    .map((c) => {
      const project = projects.find((p) => p.id === c.projectId);
      const company = companies.find((co) => co.id === c.companyId);
      return {
        id: c.id,
        projectId: c.projectId,
        company: company?.name ?? project?.projectLabel ?? "—",
        subject: c.subject,
        daysLeft: differenceInCalendarDays(parseISO(c.responseDeadline), new Date()),
        priority: c.priority
      };
    })
    .filter((c) => c.daysLeft <= 5)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 8);
}

export function relativeTimeRo(iso: string): string {
  const then = parseISO(iso);
  const minutes = Math.round((Date.now() - then.getTime()) / 60_000);
  if (minutes < 1) return "acum";
  if (minutes < 60) return `acum ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `acum ${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `acum ${days} zile`;
  return then.toLocaleDateString("ro-RO");
}

export function summarizeActivity(logs: ActivityLog[]) {
  return logs.slice(0, 30).map((log) => ({
    ...log,
    timeAgo: relativeTimeRo(log.createdAt)
  }));
}

// FmAddendum is part of dataset shape but not yet consumed by metrics — re-export the type for callers.
export type { FmAddendum };
