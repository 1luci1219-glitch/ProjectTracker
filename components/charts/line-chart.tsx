"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { WeeklyPoint } from "@/lib/dashboard-metrics";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer as ComponentType<any>),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import("recharts").then((m) => m.AreaChart as ComponentType<any>),
  { ssr: false }
);
const Area = dynamic(
  () => import("recharts").then((m) => m.Area as unknown as ComponentType<any>),
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
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid as ComponentType<any>),
  { ssr: false }
);

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
