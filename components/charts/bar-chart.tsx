"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Top10Row } from "@/lib/dashboard-metrics";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer as ComponentType<any>),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("recharts").then((m) => m.BarChart as ComponentType<any>),
  { ssr: false }
);
const Bar = dynamic(
  () => import("recharts").then((m) => m.Bar as unknown as ComponentType<any>),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((m) => m.XAxis as ComponentType<any>),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => m.YAxis as ComponentType<any>),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip as ComponentType<any>),
  { ssr: false }
);

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
            formatter={(value: string | number) => [`${value}/5 dosare`, "Progres"]}
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
