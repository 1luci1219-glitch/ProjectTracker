# Cinematic Dashboard — Design Spec

**Date:** 2026-05-01
**Author:** brainstorm session with user (Lucian)
**Status:** Approved by user, ready for implementation plan

## Goal

Replace the current dashboard (`app/(app)/dashboard/page.tsx`) with a modern, animated, cinematic dashboard that surfaces operational status at a glance for both FM (Fondul de Modernizare) and PNRR (REPowerEU) modules.

The current dashboard is described by the user as "too simple, not modern, not animated enough." This redesign addresses that.

## Direction (decided during brainstorm)

- **Style:** Modern fintech/SaaS, dark theme (Linear/Vercel/Stripe inspired)
- **Animation level:** Maximum cinematic — gradient borders, glow effects, mesh gradient backgrounds with floating blobs, scroll-triggered animations
- **Charts:** Standard set (4 charts)
- **Color system:** Multi-color per category (status-driven palette)
- **Layout:** Hybrid — hero stats + charts + heatmap + "atenție acum" + activity feed

## Color System

Status-driven palette, each color tied to a meaning:

| Token | Hex | Used for |
|---|---|---|
| `success` (mint) | `#2dd4bf` | "Încărcat", "Transmis", "Răspuns trimis", completed |
| `pending` (amber) | `#fbbf24` | "În lucru", in progress |
| `idle` (sky) | `#60a5fa` | "Neprelucrat", informational, neutral data |
| `danger` (rose) | `#f472b6` | Urgent, overdue, "Netransmis" critical |
| `brand-violet` | `#a78bfa` | Brand accents, headers |
| `brand-cyan` | `#22d3ee` | Brand accents, secondary highlights |

Each color also gets a `-soft` variant (alpha 0.15-0.20) for backgrounds and a `-glow` variant for shadow/filter effects.

## Layout (top to bottom)

### 1. Hero Header
- Mesh gradient background with **3 floating blobs** (violet, cyan, mint), animated via CSS keyframes (slow translate + scale)
- Title: "Operations Hub" with periodic shine effect (gradient sweeping across text)
- Subtitle: current date + time + Supabase connection status badge
- Quick actions row: "Adaugă proiect" (primary), "Importă Excel" (secondary)

### 2. Hero Stats — 4 cards
A single row of 4 metric cards. Each card:
- **Animated gradient border** that subtly pulses (conic-gradient + rotate keyframe)
- **Count-up animation** on numeric value at mount (~600ms ease-out)
- **Sparkline** (mini SVG line chart) showing 7-day trend in the corner
- **Icon with glow** (drop-shadow filter matching the card's color)
- **Hover lift** with shadow expansion (~200ms)

Cards:
1. **Proiecte FM** — color: mint — sparkline = activity over week
2. **Dosare incomplete** — color: amber — % progres beneath value
3. **Cereri netransmise** — color: rose — count of pending CR1+pref+CR Finală
4. **Clarificări urgente** — color: sky — countdown to most urgent deadline

### 3. Charts Grid (2 × 2)
Each chart in a panel with subtle gradient border. All charts animate on mount (line draws from 0, donut sweeps from 12 o'clock, bars rise from 0).

1. **Donut — Status dosare achiziții**
   Slices: Încărcat / În lucru / Neprelucrat (mint / amber / sky). Center shows total + % uploaded.

2. **Bar chart — Top 10 beneficiari după progres**
   Horizontal bars, gradient fill (mint → cyan), labeled with beneficiary name + uploaded/total ratio.

3. **Line chart — Activitate săptămânală**
   Last 14 days of `updatedAt` events across all entities. Gradient area fill below line. Smooth curve.

4. **Donut — Clarificări PNRR pe status**
   Slices: Răspuns trimis / În lucru / În așteptare / Închis (mint / amber / sky / brand-violet). Center shows total clarifications.

### 4. Heatmap — 26 × 5 matrix
Grid of 26 rows (FM beneficiaries) × 5 columns (the 5 dosar types). Each cell:
- Colored by status (mint = Încărcat, amber = În lucru, sky = Neprelucrat, transparent border = N/A)
- **Stagger animation** at mount — wave from left to right, ~30ms delay per cell
- **Hover** = tooltip with beneficiary name + dosar type + status + notes excerpt; cell glows
- **Click** = navigate to `/fm/[id]`

Above the grid: legend + summary line ("18/26 beneficiari complet, 8 cu dosare lipsă").

### 5. "Atenție acum" — 2 columns

**Left column: Dosare cu probleme**
- List of FM projects with at least one missing dosar
- Sorted by severity (fewest uploaded first)
- Each row: beneficiary name, "X/5 dosare" badge (amber), list of missing dosar types as small chips, CTA "Vezi proiect →"
- **Slide-in stagger** at scroll-into-view

**Right column: Cereri urgente PNRR**
- List of PNRR clarifications with deadline ≤ 5 days or overdue
- Each row: company, truncated subject, **live countdown** ("X zile" — rose if < 2, amber if < 5), priority badge, CTA
- **Pulse animation** on overdue items (rose glow)

### 6. Activity Feed (timeline)
- Placement: full-width section at the bottom of the page (below Atenție acum). Not a sticky right rail — keeps the page linear and the charts/heatmap full-width.
- Vertical timeline with dotted line + colored dots
- Each entry: icon (matching module color), label, description, relative timestamp ("acum 2h")
- **Fade-in stagger** at mount
- Source: `activityLogs` from `getDataset()`
- Limit: 30 most recent entries (already enforced by repository)

## Components — to be created

| Component | Purpose | Path |
|---|---|---|
| `HeroHeader` | Mesh gradient header with title + actions | `components/dashboard/hero-header.tsx` |
| `HeroStat` | Single animated metric card with sparkline | `components/dashboard/hero-stat.tsx` |
| `Sparkline` | Mini SVG line chart for stat cards | `components/charts/sparkline.tsx` |
| `DonutChart` | Animated SVG donut | `components/charts/donut-chart.tsx` |
| `BarChartHorizontal` | Animated horizontal bars | `components/charts/bar-chart.tsx` |
| `LineChartArea` | Line chart with gradient area fill | `components/charts/line-chart.tsx` |
| `Heatmap` | 26 × 5 grid of dosar status | `components/dashboard/heatmap.tsx` |
| `AttentionPanel` | Two-column "Atenție acum" section | `components/dashboard/attention-panel.tsx` |
| `ActivityTimeline` | Vertical timeline of activity logs | `components/dashboard/activity-timeline.tsx` |
| `useCountUp` | Hook for count-up animation | `lib/hooks/use-count-up.ts` |
| `useInView` | Hook for scroll-triggered animations | `lib/hooks/use-in-view.ts` |

## Components — to be modified

- `app/(app)/dashboard/page.tsx` — completely rewritten
- `app/globals.css` — add animations (blob, shine, gradient-border-rotate, pulse-rose), color tokens (mint, amber, sky, rose, violet, cyan with -soft and -glow variants)

## Components — to be left alone

- `app/(app)/fm/page.tsx` and detail page
- `app/(app)/pnrr/page.tsx` and detail page
- `lib/data/repository.ts`, `lib/types.ts`, `lib/domain.ts`
- Supabase migrations
- Existing `components/ui/badge.tsx`, `components/tables/simple-table.tsx`

## Tech Choices

- **Framer Motion** for orchestrating staggered enter animations and scroll-triggered fade-ins. New dependency: `framer-motion` (~50kb gzipped).
- **Recharts** for charts. Existing: `@tanstack/react-table` (different — for tables only). New dependency: `recharts` (~95kb gzipped).
- **No new dependencies for**: count-up (custom hook ~20 lines), mesh blobs (pure CSS), gradient borders (pure CSS), sparkline (custom SVG ~30 lines).

## Data Flow

Dashboard is a server component that calls `getDataset()` (already exists). All derived metrics are computed server-side from the dataset:

```ts
// pseudo-code
const data = await getDataset();
const heroStats = computeHeroStats(data);          // 4 numbers + 7-day trends
const dosareDistribution = computeDosareStatus(data.fmDosare);
const top10Beneficiari = computeTop10(data.projects, data.fmDosare);
const weeklyActivity = computeWeeklyActivity(data); // last 14 days from updatedAt
const pnrrStatus = computePnrrStatus(data.pnrrClarifications);
const heatmapMatrix = buildHeatmap(data.projects, data.fmDosare);
const dosareWithProblems = findIncomplete(data.projects, data.fmDosare);
const urgentClarifications = findUrgent(data.pnrrClarifications);
```

These helpers live in a new `lib/dashboard-metrics.ts` module (to keep `domain.ts` focused on cross-page primitives).

Client components (with `"use client"`) handle animations: `HeroStat`, `Sparkline`, all charts, `Heatmap`, `AttentionPanel` items, `ActivityTimeline`. Server component passes pre-computed data as props.

## Animation Performance Budget

- Hero blobs: 3 elements, GPU-accelerated transforms only (`translate3d`, `scale`), no repaint
- Heatmap stagger: 130 cells × 30ms = ~4s total wave; cap at 1.5s by chunking (10 cells per frame)
- Sparklines: SVG, no canvas; static once drawn
- Charts: animate once on mount, no continuous animation
- Pulse on overdue: only items currently overdue (typically ≤ 5)
- Mesh gradient: CSS only, no JS

Target: 60fps on a mid-range laptop. If perf issues arise, first cut: disable mesh blob animation on `prefers-reduced-motion` and below 1024px viewport.

## Accessibility

- All animations honor `prefers-reduced-motion: reduce` — disable mesh blobs, count-up (jump to final), stagger (all appear at once), pulse
- All interactive elements (heatmap cells, attention items, activity entries) reachable by keyboard with visible focus ring
- Charts have a `aria-label` summary; data also rendered as a `<table>` visually hidden for screen readers
- Color is never the sole signal — every status badge also has a label

## Out of Scope (explicitly)

- Real-time updates / websockets — activity feed is fetched on page load only
- User customization (drag/drop cards, hide sections, theme switcher)
- Light theme — dark only for v1
- Dashboard for individual user (per-user filtered view) — shows global view
- Export dashboard to PDF
- Mobile-first redesign — responsive but desktop is primary target

## Success Criteria

1. Dashboard loads in < 2s on Vercel cold start
2. All animations run at 60fps on a 2020+ laptop
3. User confirms it feels "modern and animated" (subjective acceptance)
4. No TypeScript errors, no console errors
5. Existing FM/PNRR pages are not regressed
6. `prefers-reduced-motion` respected

## Open Questions / Risks

- **Recharts SSR**: Recharts renders only on client. Wrap chart components in dynamic imports with `ssr: false` to avoid hydration issues.
- **Bundle size**: Adding framer-motion + recharts adds ~145kb gzipped. Acceptable for a dashboard but worth monitoring.
- **Empty state**: If user has zero data (and demo fallback isn't triggered), every chart and heatmap should have a graceful empty state. Not designed in detail here — addressed during implementation.
