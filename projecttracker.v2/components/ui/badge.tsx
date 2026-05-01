import type { ClarificationStatus, FmDosarStatus, Priority, TransmissionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const toneMap = {
  neutral: "border-[var(--line)] bg-[rgba(124,142,201,0.16)] text-[var(--foreground)]",
  success: "border-[rgba(45,207,153,0.42)] bg-[var(--success-soft)] text-[#9bffd8]",
  warning: "border-[rgba(255,183,74,0.42)] bg-[var(--warning-soft)] text-[#ffd28b]",
  danger: "border-[rgba(255,108,146,0.42)] bg-[var(--danger-soft)] text-[#ffb7cb]",
  blue: "border-[rgba(108,167,255,0.4)] bg-[var(--blue-soft)] text-[#bdd8ff]",
  dark: "border-[rgba(126,107,255,0.42)] bg-[rgba(126,107,255,0.2)] text-[#d4cbff]"
};

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneMap;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function DosarBadge({ status }: { status: FmDosarStatus }) {
  const tone = status === "Încărcat" ? "success" : status === "În lucru" ? "warning" : status === "N/A" ? "blue" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone = priority === "Ridicată" ? "danger" : priority === "Medie" ? "warning" : "success";
  return <Badge tone={tone}>{priority}</Badge>;
}

export function StatusBadge({ status }: { status: ClarificationStatus | TransmissionStatus }) {
  const tone =
    status === "Transmis" ||
    status === "Acceptat" ||
    status === "transmis" ||
    status === "aprobat" ||
    status === "Răspuns trimis" ||
    status === "Închis" ||
    status === "răspuns primit" ||
    status === "închis"
      ? "success"
      : status === "În lucru" || status === "draft" || status === "trimis"
        ? "warning"
        : status === "Netransmis" || status === "În așteptare"
          ? "neutral"
          : status === "respins"
            ? "danger"
            : "blue";
  return <Badge tone={tone}>{status}</Badge>;
}
