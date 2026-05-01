"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DonutSlice } from "@/lib/dashboard-metrics";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer as ComponentType<any>),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("recharts").then((m) => m.PieChart as ComponentType<any>),
  { ssr: false }
);
const Pie = dynamic(
  () => import("recharts").then((m) => m.Pie as unknown as ComponentType<any>),
  { ssr: false }
);
const Cell = dynamic(
  () => import("recharts").then((m) => m.Cell as ComponentType<any>),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip as ComponentType<any>),
  { ssr: false }
);

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
