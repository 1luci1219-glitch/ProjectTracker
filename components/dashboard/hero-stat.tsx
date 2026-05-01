"use client";

import type { ReactNode } from "react";
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
  icon,
  tone,
  trend,
  suffix
}: {
  label: string;
  value: number;
  detail?: string;
  icon: ReactNode;
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
          {icon}
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
