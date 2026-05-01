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
          icon={<Building2 className="h-5 w-5" />}
          tone="mint"
          trend={stats.fmTrend}
          detail="active în implementare"
        />
        <HeroStat
          label="Dosare incomplete"
          value={stats.incompleteDosare}
          icon={<FolderOpen className="h-5 w-5" />}
          tone="amber"
          detail={`${stats.incompletePercent}% complet la nivel global`}
        />
        <HeroStat
          label="Cereri netransmise"
          value={stats.pendingCereri}
          icon={<Send className="h-5 w-5" />}
          tone="rose"
          detail="CR1 / prefinanțare / finale"
        />
        <HeroStat
          label="Clarificări urgente"
          value={stats.urgentClarifications}
          icon={<AlertTriangle className="h-5 w-5" />}
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
