# Cinematic Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `app/(app)/dashboard/page.tsx` with a cinematic, animated dashboard featuring multi-color status palette, animated charts, a 26×5 heatmap, "Atenție acum" panel, and activity timeline — per the 2026-05-01 design spec.

**Architecture:** Server component fetches data via `getDataset()` and computes derived metrics in a new `lib/dashboard-metrics.ts`. Pre-computed data is passed to client components (`"use client"`) which handle animations using framer-motion + custom CSS. Charts use recharts (dynamic import, ssr: false).

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v4, Supabase (existing), **+ framer-motion** (new), **+ recharts** (new). No test framework exists in this project — verification is `tsc --noEmit` + `next build` + visual check on Vercel preview deploy after push.

**Verification approach (instead of TDD):**
Every task ends with running `npx tsc --noEmit` and confirming no errors before commit. After Phase 4 (final task), run `npm run build` and verify Vercel preview.

**Spec reference:** `docs/superpowers/specs/2026-05-01-cinematic-dashboard-design.md`

---

## File Structure

### New files
| File | Responsibility |
|---|---|
| `lib/dashboard-metrics.ts` | Pure functions that compute dashboard data from `getDataset()` output |
| `lib/hooks/use-count-up.ts` | Client hook: animate a number from 0 to value |
| `lib/hooks/use-in-view.ts` | Client hook: detect when element enters viewport |
| `components/charts/sparkline.tsx` | Mini SVG line chart (no recharts, custom SVG) |
| `components/charts/donut-chart.tsx` | Animated donut wrapper around recharts PieChart |
| `components/charts/bar-chart.tsx` | Animated horizontal bar chart wrapper around recharts |
| `components/charts/line-chart.tsx` | Animated area-line chart wrapper around recharts |
| `components/dashboard/hero-header.tsx` | Mesh-gradient header w/ blobs + title shine + actions |
| `components/dashboard/hero-stat.tsx` | Animated metric card w/ count-up + sparkline + gradient border |
| `components/dashboard/heatmap.tsx` | 26×5 grid w/ stagger animation + tooltips |
| `components/dashboard/attention-panel.tsx` | Two-column "Atenție acum" |
| `components/dashboard/activity-timeline.tsx` | Vertical timeline of activity logs |

### Modified files
| File | Change |
|---|---|
| `package.json` | Add `framer-motion` + `recharts` deps |
| `app/globals.css` | Add color tokens (mint/amber/sky/rose/violet/cyan + soft/glow variants) + keyframe animations (blob, shine, gradient-border-rotate, pulse-rose) |
| `app/(app)/dashboard/page.tsx` | Complete rewrite — server component that wires all new components together |

### Untouched
FM pages, PNRR pages, repository, types, domain, supabase migrations, `components/ui/*`, `components/tables/*`.

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install framer-motion and recharts**

Run:
```bash
cd "C:/Users/tragp/Downloads/ProjectTracker/you-are-a-senior-full-stack"
npm install framer-motion@^11.18.0 recharts@^2.15.0
```

Expected: `package.json` and `package-lock.json` updated. No vulnerabilities errors.

- [ ] **Step 2: Verify install**

Run: `npx tsc --noEmit`
Expected: PASS (no errors)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion and recharts for dashboard"
```

---

## Task 2: Extend globals.css with color tokens and animations

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add new color tokens to `:root`**

In `app/globals.css`, find the `:root { ... }` block (lines 3-29). After the existing tokens but before the closing `}`, add:

```css
  /* Status-driven palette */
  --mint: #2dd4bf;
  --mint-soft: rgba(45, 212, 191, 0.15);
  --mint-glow: rgba(45, 212, 191, 0.45);
  --amber: #fbbf24;
  --amber-soft: rgba(251, 191, 36, 0.15);
  --amber-glow: rgba(251, 191, 36, 0.45);
  --sky: #60a5fa;
  --sky-soft: rgba(96, 165, 250, 0.15);
  --sky-glow: rgba(96, 165, 250, 0.45);
  --rose: #f472b6;
  --rose-soft: rgba(244, 114, 182, 0.15);
  --rose-glow: rgba(244, 114, 182, 0.45);
  --violet: #a78bfa;
  --violet-soft: rgba(167, 139, 250, 0.15);
  --violet-glow: rgba(167, 139, 250, 0.45);
  --cyan: #22d3ee;
  --cyan-soft: rgba(34, 211, 238, 0.15);
  --cyan-glow: rgba(34, 211, 238, 0.45);
```

- [ ] **Step 2: Append keyframe animations and utility classes at the end of the file**

Append to the bottom of `app/globals.css`:

```css
/* === Cinematic dashboard animations === */

@keyframes blob-float {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  33% { transform: translate3d(40px, -30px, 0) scale(1.1); }
  66% { transform: translate3d(-30px, 30px, 0) scale(0.95); }
}

@keyframes shine-sweep {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes border-rotate {
  to { --angle: 360deg; }
}

@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@keyframes pulse-rose {
  0%, 100% { box-shadow: 0 0 0 0 rgba(244, 114, 182, 0.55); }
  50% { box-shadow: 0 0 0 12px rgba(244, 114, 182, 0); }
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  pointer-events: none;
  will-change: transform;
}

.blob-violet { background: var(--violet); animation: blob-float 18s ease-in-out infinite; }
.blob-cyan { background: var(--cyan); animation: blob-float 22s ease-in-out infinite reverse; }
.blob-mint { background: var(--mint); animation: blob-float 26s ease-in-out infinite; }

.text-shine {
  background: linear-gradient(
    90deg,
    var(--ink) 0%,
    var(--ink) 40%,
    #ffffff 50%,
    var(--ink) 60%,
    var(--ink) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine-sweep 6s linear infinite;
}

.animated-border {
  position: relative;
  background: var(--panel);
  border-radius: var(--radius-lg);
}

.animated-border::before {
  content: "";
  position: absolute;
  inset: -1px;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(from var(--angle), transparent 0%, var(--accent) 25%, transparent 50%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: border-rotate 6s linear infinite;
  pointer-events: none;
}

.pulse-rose { animation: pulse-rose 2s ease-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .blob, .text-shine, .animated-border::before, .pulse-rose {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(css): add status palette and cinematic keyframe animations"
```

---

## Task 3: Create useCountUp hook

**Files:**
- Create: `lib/hooks/use-count-up.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/use-count-up.ts
git commit -m "feat(hooks): add useCountUp hook for animated number counters"
```

---

## Task 4: Create useInView hook

**Files:**
- Create: `lib/hooks/use-in-view.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/use-in-view.ts
git commit -m "feat(hooks): add useInView hook for scroll-triggered animations"
```

---

## Task 5: Create dashboard-metrics module

**Files:**
- Create: `lib/dashboard-metrics.ts`

- [ ] **Step 1: Write metrics helpers**

```ts
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
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add lib/dashboard-metrics.ts
git commit -m "feat(metrics): add dashboard-metrics module with all derived data helpers"
```

---

## Task 6: Create Sparkline component

**Files:**
- Create: `components/charts/sparkline.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

export function Sparkline({
  data,
  color = "var(--cyan)",
  width = 64,
  height = 24
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPath =
    `M0,${height} L` + points.replace(/,/g, ",").split(" ").join(" L") + ` L${width},${height} Z`;

  const id = `spark-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/charts/sparkline.tsx
git commit -m "feat(charts): add Sparkline SVG mini chart"
```

---

## Task 7: Create DonutChart component

**Files:**
- Create: `components/charts/donut-chart.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import dynamic from "next/dynamic";
import type { DonutSlice } from "@/lib/dashboard-metrics";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });

export function DonutChart({
  data,
  centerLabel,
  centerValue
}: {
  data: DonutSlice[];
  centerLabel?: string;
  centerValue?: string | number;
}) {
  if (!data.length) {
    return (
      <div className="grid h-[220px] place-items-center text-sm text-[var(--muted)]">Fără date</div>
    );
  }

  return (
    <div className="relative h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={60}
            outerRadius={88}
            paddingAngle={3}
            stroke="none"
            isAnimationActive
            animationDuration={800}
            animationBegin={0}
          >
            {data.map((slice) => (
              <Cell key={slice.label} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(10,16,30,0.95)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              color: "var(--foreground)"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue !== undefined) && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            {centerValue !== undefined && (
              <div className="text-3xl font-bold text-[var(--ink)]">{centerValue}</div>
            )}
            {centerLabel && (
              <div className="mt-1 text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                {centerLabel}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/charts/donut-chart.tsx
git commit -m "feat(charts): add animated DonutChart wrapping recharts PieChart"
```

---

## Task 8: Create BarChartHorizontal component

**Files:**
- Create: `components/charts/bar-chart.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import dynamic from "next/dynamic";
import type { Top10Row } from "@/lib/dashboard-metrics";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });

export function BarChartHorizontal({ data }: { data: Top10Row[] }) {
  if (!data.length) {
    return (
      <div className="grid h-[300px] place-items-center text-sm text-[var(--muted)]">Fără date</div>
    );
  }

  const chartData = data.map((row) => ({
    name: row.name.length > 22 ? row.name.slice(0, 22) + "…" : row.name,
    progress: row.uploaded,
    total: row.total
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--mint)" />
              <stop offset="100%" stopColor="var(--cyan)" />
            </linearGradient>
          </defs>
          <XAxis type="number" hide domain={[0, 5]} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            width={140}
            stroke="transparent"
          />
          <Tooltip
            contentStyle={{
              background: "rgba(10,16,30,0.95)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              color: "var(--foreground)"
            }}
            formatter={(value: number) => [`${value}/5 dosare`, "Progres"]}
          />
          <Bar
            dataKey="progress"
            fill="url(#barGrad)"
            radius={[0, 6, 6, 0]}
            isAnimationActive
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/charts/bar-chart.tsx
git commit -m "feat(charts): add animated horizontal BarChart for top beneficiaries"
```

---

## Task 9: Create LineChartArea component

**Files:**
- Create: `components/charts/line-chart.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import dynamic from "next/dynamic";
import type { WeeklyPoint } from "@/lib/dashboard-metrics";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });

export function LineChartArea({ data }: { data: WeeklyPoint[] }) {
  if (!data.length) {
    return (
      <div className="grid h-[260px] place-items-center text-sm text-[var(--muted)]">Fără date</div>
    );
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--violet)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(124,142,201,0.12)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted)", fontSize: 10 }}
            stroke="transparent"
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis
            tick={{ fill: "var(--muted)", fontSize: 10 }}
            stroke="transparent"
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(10,16,30,0.95)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              color: "var(--foreground)"
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--violet)"
            strokeWidth={2}
            fill="url(#areaGrad)"
            isAnimationActive
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/charts/line-chart.tsx
git commit -m "feat(charts): add animated area-line chart for weekly activity"
```

---

## Task 10: Create HeroHeader component

**Files:**
- Create: `components/dashboard/hero-header.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { Plus, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroHeader() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now
    ? now.toLocaleDateString("ro-RO", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    : "";
  const timeStr = now ? now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <section className="panel relative overflow-hidden p-7">
      <div className="blob blob-violet" style={{ top: "-80px", left: "-40px", width: "260px", height: "260px" }} />
      <div className="blob blob-cyan" style={{ top: "20%", right: "-60px", width: "240px", height: "240px" }} />
      <div className="blob blob-mint" style={{ bottom: "-100px", left: "30%", width: "300px", height: "300px" }} />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            EU Funds · Operations Hub
          </p>
          <h1 className="text-shine mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Operations Dashboard
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            <span className="capitalize">{dateStr}</span>
            {timeStr && <span className="ml-3 inline-flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-[var(--mint)]" /> {timeStr}</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="focus-ring motion-soft inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(12,20,36,0.85)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
            <Upload className="h-4 w-4" />
            Importă Excel
          </button>
          <button className="btn-accent focus-ring motion-soft inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
            <Plus className="h-4 w-4" />
            Adaugă proiect
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/hero-header.tsx
git commit -m "feat(dashboard): add HeroHeader with mesh blobs and shine title"
```

---

## Task 11: Create HeroStat component

**Files:**
- Create: `components/dashboard/hero-stat.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import type { LucideIcon } from "lucide-react";
import { Sparkline } from "@/components/charts/sparkline";
import { useCountUp } from "@/lib/hooks/use-count-up";
import { cn } from "@/lib/utils";

type Tone = "mint" | "amber" | "sky" | "rose" | "violet";

const toneStyles: Record<Tone, { color: string; soft: string; glow: string }> = {
  mint: { color: "var(--mint)", soft: "var(--mint-soft)", glow: "var(--mint-glow)" },
  amber: { color: "var(--amber)", soft: "var(--amber-soft)", glow: "var(--amber-glow)" },
  sky: { color: "var(--sky)", soft: "var(--sky-soft)", glow: "var(--sky-glow)" },
  rose: { color: "var(--rose)", soft: "var(--rose-soft)", glow: "var(--rose-glow)" },
  violet: { color: "var(--violet)", soft: "var(--violet-soft)", glow: "var(--violet-glow)" }
};

export function HeroStat({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  trend,
  suffix
}: {
  label: string;
  value: number;
  detail?: string;
  icon: LucideIcon;
  tone: Tone;
  trend?: number[];
  suffix?: string;
}) {
  const display = useCountUp(value);
  const t = toneStyles[tone];

  return (
    <div
      className={cn("motion-soft panel relative overflow-hidden p-5")}
      style={{
        borderColor: t.soft,
        boxShadow: `0 16px 40px ${t.soft}, inset 0 0 0 1px ${t.soft}`
      }}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full"
        style={{ background: t.glow, filter: "blur(48px)", opacity: 0.6 }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            {label}
          </p>
          <p className="mt-2 text-4xl font-black tracking-tight text-[var(--ink)]">
            {display}
            {suffix && <span className="ml-1 text-2xl font-semibold text-[var(--muted)]">{suffix}</span>}
          </p>
          {detail && <p className="mt-2 text-xs text-[var(--muted)]">{detail}</p>}
        </div>
        <div
          className="rounded-xl p-2.5"
          style={{
            background: t.soft,
            color: t.color,
            filter: `drop-shadow(0 0 12px ${t.glow})`
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && trend.length > 0 && (
        <div className="relative mt-4">
          <Sparkline data={trend} color={t.color} width={240} height={32} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/hero-stat.tsx
git commit -m "feat(dashboard): add HeroStat card with count-up sparkline and glow"
```

---

## Task 12: Create Heatmap component

**Files:**
- Create: `components/dashboard/heatmap.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HeatmapRow } from "@/lib/dashboard-metrics";
import type { FmDosarStatus } from "@/lib/types";

const COLORS: Record<FmDosarStatus | "Neprelucrat", string> = {
  "Încărcat": "var(--mint)",
  "În lucru": "var(--amber)",
  "Neprelucrat": "var(--sky)",
  "N/A": "rgba(124,142,201,0.25)"
};

const DOSAR_LABELS = ["Audit", "SF + Cons.", "Lucrări", "Publicit.", "Dirig."];

export function Heatmap({ rows }: { rows: HeatmapRow[] }) {
  const totalCells = rows.length * 5;
  const completeBenefs = rows.filter((r) => r.cells.every((c) => c.status === "Încărcat")).length;
  const incompleteBenefs = rows.length - completeBenefs;

  return (
    <div className="panel p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)]">Matrice dosare achiziții</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {rows.length} beneficiari × 5 dosare · {completeBenefs} compleți · {incompleteBenefs} cu lipsuri
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]">
          <Legend color="var(--mint)" label="Încărcat" />
          <Legend color="var(--amber)" label="În lucru" />
          <Legend color="var(--sky)" label="Neprelucrat" />
          <Legend color="rgba(124,142,201,0.25)" label="N/A" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid" style={{ gridTemplateColumns: "180px repeat(5, 1fr)" }}>
            <div />
            {DOSAR_LABELS.map((label) => (
              <div
                key={label}
                className="px-2 pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]"
              >
                {label}
              </div>
            ))}
            {rows.map((row, rowIdx) => (
              <Row key={row.projectId} row={row} rowIdx={rowIdx} totalCells={totalCells} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  row,
  rowIdx,
  totalCells
}: {
  row: HeatmapRow;
  rowIdx: number;
  totalCells: number;
}) {
  return (
    <>
      <Link
        href={`/fm/${row.projectId}`}
        className="motion-soft truncate py-1.5 pr-3 text-xs font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
        title={row.beneficiary}
      >
        {row.beneficiary}
      </Link>
      {row.cells.map((cell, colIdx) => {
        const idx = rowIdx * 5 + colIdx;
        const delay = Math.min((idx / totalCells) * 1.4, 1.4);
        return (
          <motion.div
            key={`${row.projectId}-${cell.dosarType}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.25, ease: "easeOut" }}
            className="group relative m-0.5 grid h-7 cursor-pointer place-items-center rounded-md"
            style={{ background: COLORS[cell.status] }}
            title={`${row.beneficiary} · ${cell.dosarType}: ${cell.status}${cell.notes ? "\n" + cell.notes : ""}`}
          >
            <Link href={`/fm/${row.projectId}`} className="absolute inset-0 rounded-md" />
          </motion.div>
        );
      })}
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/heatmap.tsx
git commit -m "feat(dashboard): add 26x5 Heatmap with stagger animation and tooltips"
```

---

## Task 13: Create AttentionPanel component

**Files:**
- Create: `components/dashboard/attention-panel.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, FolderOpen, ChevronRight } from "lucide-react";
import { Badge, PriorityBadge } from "@/components/ui/badge";
import type { ProblemRow, UrgentClarif } from "@/lib/dashboard-metrics";

export function AttentionPanel({
  problems,
  urgent
}: {
  problems: ProblemRow[];
  urgent: UrgentClarif[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Column
        icon={<FolderOpen className="h-4 w-4 text-[var(--amber)]" />}
        title="Dosare cu probleme"
        subtitle="Beneficiari cu fișiere lipsă"
      >
        {problems.length === 0 ? (
          <Empty text="Toate dosarele sunt complete." />
        ) : (
          problems.map((row, i) => (
            <motion.div
              key={row.projectId}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                href={`/fm/${row.projectId}`}
                className="motion-soft group block rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(13,24,43,0.6)] p-3 hover:border-[var(--amber)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--ink)]">{row.beneficiary}</p>
                    <p className="mt-1 flex flex-wrap gap-1.5 text-[10px]">
                      {row.missing.slice(0, 4).map((m) => (
                        <span
                          key={m}
                          className="inline-block rounded-full border border-[rgba(251,191,36,0.4)] bg-[var(--amber-soft)] px-2 py-0.5 text-[var(--amber)]"
                        >
                          {m}
                        </span>
                      ))}
                      {row.missing.length > 4 && (
                        <span className="text-[var(--muted)]">+{row.missing.length - 4}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="warning">
                      {row.uploaded}/{row.total}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </Column>

      <Column
        icon={<AlertTriangle className="h-4 w-4 text-[var(--rose)]" />}
        title="Cereri urgente PNRR"
        subtitle="Termene aproape sau depășite"
      >
        {urgent.length === 0 ? (
          <Empty text="Nicio clarificare urgentă." />
        ) : (
          urgent.map((c, i) => {
            const overdue = c.daysLeft < 0;
            const veryUrgent = c.daysLeft <= 1;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link
                  href={`/pnrr/${c.projectId}`}
                  className={`motion-soft group block rounded-[var(--radius-md)] border p-3 ${
                    overdue
                      ? "pulse-rose border-[rgba(244,114,182,0.55)] bg-[rgba(58,18,38,0.55)]"
                      : "border-[var(--line)] bg-[rgba(13,24,43,0.6)] hover:border-[var(--rose)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[var(--muted)]">{c.company}</p>
                      <p className="mt-1 truncate text-sm text-[var(--ink)]">{c.subject}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <PriorityBadge priority={c.priority} />
                        <Badge tone={veryUrgent ? "danger" : "warning"}>
                          {overdue
                            ? `Expirat ${Math.abs(c.daysLeft)}z`
                            : c.daysLeft === 0
                              ? "Astăzi"
                              : `${c.daysLeft} zile`}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </Column>
    </div>
  );
}

function Column({
  icon,
  title,
  subtitle,
  children
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg border border-[var(--line)] bg-[rgba(12,24,44,0.75)] p-2">{icon}</div>
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
          <p className="text-xs text-[var(--muted)]">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-[var(--muted)]">{text}</p>;
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/attention-panel.tsx
git commit -m "feat(dashboard): add AttentionPanel with FM problems and urgent PNRR"
```

---

## Task 14: Create ActivityTimeline component

**Files:**
- Create: `components/dashboard/activity-timeline.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { motion } from "framer-motion";
import { Activity, Building2, FileSpreadsheet } from "lucide-react";
import type { ActivityLog } from "@/lib/types";

type Entry = ActivityLog & { timeAgo: string };

export function ActivityTimeline({ entries }: { entries: Entry[] }) {
  if (!entries.length) {
    return (
      <div className="panel p-8 text-center text-sm text-[var(--muted)]">
        Nicio activitate înregistrată.
      </div>
    );
  }

  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg border border-[var(--line)] bg-[rgba(12,24,44,0.75)] p-2">
          <Activity className="h-4 w-4 text-[var(--cyan)]" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)]">Activitate recentă</h3>
          <p className="text-xs text-[var(--muted)]">Ultimele {entries.length} evenimente</p>
        </div>
      </div>

      <div className="relative space-y-3 pl-4">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-[var(--line)]" />
        {entries.map((entry, i) => {
          const isFm = entry.module === "fm";
          const tone = isFm ? "var(--mint)" : "var(--violet)";
          const Icon = isFm ? Building2 : FileSpreadsheet;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="relative"
            >
              <span
                className="absolute -left-4 top-1.5 grid h-4 w-4 place-items-center rounded-full border-2"
                style={{ borderColor: tone, background: "var(--background)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
              </span>
              <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(13,24,43,0.55)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" style={{ color: tone }} />
                    <span className="text-sm font-semibold text-[var(--ink)]">{entry.label}</span>
                  </div>
                  <span className="text-[10px] text-[var(--muted)]">{entry.timeAgo}</span>
                </div>
                {entry.description && (
                  <p className="mt-1.5 text-xs text-[var(--muted)]">{entry.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/activity-timeline.tsx
git commit -m "feat(dashboard): add ActivityTimeline with vertical staggered fade-in"
```

---

## Task 15: Rewrite dashboard page

**Files:**
- Modify: `app/(app)/dashboard/page.tsx` (complete rewrite)

- [ ] **Step 1: Replace file content**

Replace the **entire** content of `app/(app)/dashboard/page.tsx` with:

```tsx
import { Building2, FolderOpen, Send, AlertTriangle } from "lucide-react";
import { HeroHeader } from "@/components/dashboard/hero-header";
import { HeroStat } from "@/components/dashboard/hero-stat";
import { Heatmap } from "@/components/dashboard/heatmap";
import { AttentionPanel } from "@/components/dashboard/attention-panel";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarChartHorizontal } from "@/components/charts/bar-chart";
import { LineChartArea } from "@/components/charts/line-chart";
import { getDataset } from "@/lib/data/repository";
import {
  buildHeatmap,
  computeDosareDistribution,
  computeHeroStats,
  computePnrrStatusDistribution,
  computeTop10Beneficiari,
  computeWeeklyActivity,
  findIncompleteDosare,
  findUrgentClarifications,
  summarizeActivity
} from "@/lib/dashboard-metrics";

export default async function DashboardPage() {
  const data = await getDataset();
  const stats = computeHeroStats(data.projects, data.fmDosare, data.fmActions, data.pnrrClarifications);
  const dosareDist = computeDosareDistribution(data.fmDosare);
  const top10 = computeTop10Beneficiari(data.projects, data.fmDosare, data.companies);
  const weekly = computeWeeklyActivity(data.projects, data.fmDosare, data.fmActions, data.pnrrClarifications);
  const pnrrDist = computePnrrStatusDistribution(data.pnrrClarifications);
  const heatmap = buildHeatmap(data.projects, data.fmDosare, data.companies);
  const problems = findIncompleteDosare(data.projects, data.fmDosare, data.companies);
  const urgent = findUrgentClarifications(data.pnrrClarifications, data.projects, data.companies);
  const activity = summarizeActivity(data.activityLogs);

  const totalDosare = dosareDist.reduce((sum, s) => sum + s.value, 0);
  const uploadedDosare = dosareDist.find((s) => s.label === "Încărcat")?.value ?? 0;

  return (
    <div className="space-y-6">
      <HeroHeader />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HeroStat
          label="Proiecte FM"
          value={stats.fmProjects}
          icon={Building2}
          tone="mint"
          trend={stats.fmTrend}
          detail="active în implementare"
        />
        <HeroStat
          label="Dosare incomplete"
          value={stats.incompleteDosare}
          icon={FolderOpen}
          tone="amber"
          detail={`${stats.incompletePercent}% complet la nivel global`}
        />
        <HeroStat
          label="Cereri netransmise"
          value={stats.pendingCereri}
          icon={Send}
          tone="rose"
          detail="CR1 / prefinanțare / finale"
        />
        <HeroStat
          label="Clarificări urgente"
          value={stats.urgentClarifications}
          icon={AlertTriangle}
          tone="sky"
          detail={
            stats.mostUrgentDays === null
              ? "Nicio urgență"
              : stats.mostUrgentDays < 0
                ? `cea mai veche: ${Math.abs(stats.mostUrgentDays)}z întârziere`
                : `cea mai apropiată: ${stats.mostUrgentDays}z`
          }
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartPanel
          title="Status dosare achiziții"
          subtitle={`${uploadedDosare}/${totalDosare} încărcate`}
        >
          <DonutChart
            data={dosareDist}
            centerValue={totalDosare ? `${Math.round((uploadedDosare / totalDosare) * 100)}%` : "0%"}
            centerLabel="încărcate"
          />
        </ChartPanel>

        <ChartPanel title="Top 10 beneficiari după progres" subtitle="dosare de achiziții încărcate">
          <BarChartHorizontal data={top10} />
        </ChartPanel>

        <ChartPanel title="Activitate ultimele 14 zile" subtitle="actualizări proiecte + dosare + cereri + clarificări">
          <LineChartArea data={weekly} />
        </ChartPanel>

        <ChartPanel title="Status clarificări PNRR" subtitle={`${data.pnrrClarifications.length} total`}>
          <DonutChart
            data={pnrrDist}
            centerValue={data.pnrrClarifications.length}
            centerLabel="clarificări"
          />
        </ChartPanel>
      </section>

      <section>
        <Heatmap rows={heatmap} />
      </section>

      <section>
        <AttentionPanel problems={problems} urgent={urgent} />
      </section>

      <section>
        <ActivityTimeline entries={activity} />
      </section>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel p-5">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
        <p className="text-xs text-[var(--muted)]">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Verify production build**

Run: `npm run build`
Expected: Build succeeds. No SSR/hydration errors. Look for "Generating static pages" with no failures.

- [ ] **Step 4: Commit**

```bash
git add app/\(app\)/dashboard/page.tsx
git commit -m "feat(dashboard): rewrite dashboard with cinematic layout

- Hero header with mesh gradient blobs and shine title
- 4 animated stat cards with sparklines and count-up
- 4 charts (2 donuts, bar, area-line)
- 26x5 heatmap of dosare achizitii
- Atentie acum panel (FM problems + urgent PNRR)
- Activity timeline at bottom"
```

---

## Task 16: Push to GitHub and verify on Vercel

**Files:** none

- [ ] **Step 1: Push to remote**

Run:
```bash
git push origin master
```

Expected: All commits pushed to `https://github.com/1luci1219-glitch/ProjectTracker`

- [ ] **Step 2: Wait for Vercel auto-deploy**

Vercel watches the master branch. After push, deploy starts automatically. Wait ~2 min for production deploy.

- [ ] **Step 3: Visual verification on the live URL**

Open the Vercel production URL in a browser. On the `/dashboard` page, verify:

1. **Hero header**: blobs visible and floating, title has shine sweep, current date and time shown
2. **4 stat cards**: numbers count up from 0 on load, sparkline visible under FM Projects card, glow effect on icons
3. **4 charts**: all render, donuts have colored slices, bar chart has gradient bars, line chart has gradient area fill
4. **Heatmap**: 26 rows × 5 cells, cells appear in stagger wave from top-left
5. **Atenție acum**: two columns visible, hover on a row triggers chevron animation
6. **Activity timeline**: vertical line with dots, entries fade in
7. **No console errors** (open devtools)
8. **prefers-reduced-motion**: enable in OS settings, reload — animations should not run

- [ ] **Step 4: Final commit if any tweaks needed**

If visual check reveals an issue, fix it inline, run `npx tsc --noEmit`, commit, push.

If all looks good, no commit needed — task complete.

---

## Self-Review

**Spec coverage:**
- Hero Header → Task 10 ✓
- 4 Hero Stats with sparkline + count-up + glow → Task 11 + Task 6 + Task 3 ✓
- 4 Charts (2 donuts, bar, line) → Tasks 7-9 ✓
- 26×5 Heatmap with stagger → Task 12 ✓
- Atenție acum two-column → Task 13 ✓
- Activity Timeline → Task 14 ✓
- Color tokens (mint/amber/sky/rose/violet/cyan + soft + glow) → Task 2 ✓
- Animations (blob, shine, gradient-border, pulse-rose) → Task 2 ✓
- prefers-reduced-motion → Task 2 (CSS) + Task 3 (useCountUp) ✓
- framer-motion + recharts dependencies → Task 1 ✓
- Server component fetches data, passes to client components → Task 15 ✓
- Empty states for charts/heatmap → built into each chart component ✓

**Placeholder scan:** No "TBD", "TODO", "implement later" anywhere. Every step has actual code or commands.

**Type consistency:**
- `HeroStats`, `DonutSlice`, `Top10Row`, `WeeklyPoint`, `HeatmapCell`, `HeatmapRow`, `ProblemRow`, `UrgentClarif` types defined in Task 5, used consistently in Tasks 7-15.
- `Tone` type (mint/amber/sky/rose/violet) defined in Task 11 (HeroStat), values match color tokens added in Task 2.
- `relativeTimeRo` returns string, consumed as `timeAgo` field in Task 14.
- `ActivityLog` type re-exported from `@/lib/types` is used in Task 14 with extra `timeAgo` field added by `summarizeActivity`.

All consistent.
