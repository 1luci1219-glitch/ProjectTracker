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
