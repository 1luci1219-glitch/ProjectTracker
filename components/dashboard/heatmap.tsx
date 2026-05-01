"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HeatmapRow } from "@/lib/dashboard-metrics";
import type { FmDosarStatus } from "@/lib/types";

const COLORS: Record<FmDosarStatus | "Neprelucrat", string> = {
  "Încărcat": "var(--mint)",
  "În lucru": "var(--amber)",
  "Neprelucrat": "var(--sky)",
  "N/A": "rgba(124,142,201,0.25)"
};

const DOSAR_LABELS = ["Audit", "SF + Cons.", "Lucrări", "Publicit.", "Dirig."];

export function Heatmap({ rows }: { rows: HeatmapRow[] }) {
  const totalCells = rows.length * 5;
  const completeBenefs = rows.filter((r) => r.cells.every((c) => c.status === "Încărcat")).length;
  const incompleteBenefs = rows.length - completeBenefs;

  return (
    <div className="panel p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)]">Matrice dosare achiziții</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {rows.length} beneficiari × 5 dosare · {completeBenefs} compleți · {incompleteBenefs} cu lipsuri
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]">
          <Legend color="var(--mint)" label="Încărcat" />
          <Legend color="var(--amber)" label="În lucru" />
          <Legend color="var(--sky)" label="Neprelucrat" />
          <Legend color="rgba(124,142,201,0.25)" label="N/A" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid" style={{ gridTemplateColumns: "180px repeat(5, 1fr)" }}>
            <div />
            {DOSAR_LABELS.map((label) => (
              <div
                key={label}
                className="px-2 pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]"
              >
                {label}
              </div>
            ))}
            {rows.map((row, rowIdx) => (
              <Row key={row.projectId} row={row} rowIdx={rowIdx} totalCells={totalCells} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  row,
  rowIdx,
  totalCells
}: {
  row: HeatmapRow;
  rowIdx: number;
  totalCells: number;
}) {
  return (
    <>
      <Link
        href={`/fm/${row.projectId}`}
        className="motion-soft truncate py-1.5 pr-3 text-xs font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
        title={row.beneficiary}
      >
        {row.beneficiary}
      </Link>
      {row.cells.map((cell, colIdx) => {
        const idx = rowIdx * 5 + colIdx;
        const delay = Math.min((idx / totalCells) * 1.4, 1.4);
        return (
          <motion.div
            key={`${row.projectId}-${cell.dosarType}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.25, ease: "easeOut" }}
            className="group relative m-0.5 grid h-7 cursor-pointer place-items-center rounded-md"
            style={{ background: COLORS[cell.status] }}
            title={`${row.beneficiary} · ${cell.dosarType}: ${cell.status}${cell.notes ? "\n" + cell.notes : ""}`}
          >
            <Link href={`/fm/${row.projectId}`} className="absolute inset-0 rounded-md" />
          </motion.div>
        );
      })}
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}
