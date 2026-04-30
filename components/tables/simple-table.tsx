import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function SimpleTable({
  columns,
  rows,
  className
}: {
  columns: string[];
  rows: React.ReactNode[][];
  className?: string;
}) {
  return (
    <div className={cn("panel overflow-hidden", className)}>
      <div className="table-scroll overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[rgba(18,31,56,0.95)] text-xs uppercase tracking-[0.09em] text-[var(--muted)]">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap border-b border-[var(--line)] px-4 py-3.5 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    {column}
                    <ChevronDown className="h-3.5 w-3.5 opacity-45" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[var(--line)] last:border-0 hover:bg-[rgba(124,142,201,0.08)]">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="max-w-[360px] px-4 py-3 align-top text-[var(--foreground)]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
