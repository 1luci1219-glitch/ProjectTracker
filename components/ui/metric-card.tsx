import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "default"
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  tone?: "default" | "danger" | "warning" | "success";
}) {
  return (
    <div
      className={cn(
        "motion-soft panel p-4",
        tone === "danger" && "border-[rgba(255,108,146,0.45)] bg-[linear-gradient(180deg,rgba(56,20,36,0.82),rgba(23,11,18,0.88))]",
        tone === "warning" && "border-[rgba(255,183,74,0.45)] bg-[linear-gradient(180deg,rgba(56,39,20,0.82),rgba(24,16,8,0.88))]",
        tone === "success" && "border-[rgba(45,207,153,0.45)] bg-[linear-gradient(180deg,rgba(16,48,38,0.82),rgba(8,21,17,0.88))]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">{value}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[rgba(12,24,44,0.75)] p-2 text-[var(--accent)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {detail ? <p className="mt-3 text-sm text-[var(--muted)]">{detail}</p> : null}
    </div>
  );
}
