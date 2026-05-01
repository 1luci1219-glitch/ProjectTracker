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
