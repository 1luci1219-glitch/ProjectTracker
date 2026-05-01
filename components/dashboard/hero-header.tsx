"use client";

import { Plus, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroHeader() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now
    ? now.toLocaleDateString("ro-RO", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    : "";
  const timeStr = now ? now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <section className="panel relative overflow-hidden p-7">
      <div className="blob blob-violet" style={{ top: "-80px", left: "-40px", width: "260px", height: "260px" }} />
      <div className="blob blob-cyan" style={{ top: "20%", right: "-60px", width: "240px", height: "240px" }} />
      <div className="blob blob-mint" style={{ bottom: "-100px", left: "30%", width: "300px", height: "300px" }} />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            EU Funds · Operations Hub
          </p>
          <h1 className="text-shine mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Operations Dashboard
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            <span className="capitalize">{dateStr}</span>
            {timeStr && <span className="ml-3 inline-flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-[var(--mint)]" /> {timeStr}</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="focus-ring motion-soft inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(12,20,36,0.85)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
            <Upload className="h-4 w-4" />
            Importă Excel
          </button>
          <button className="btn-accent focus-ring motion-soft inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
            <Plus className="h-4 w-4" />
            Adaugă proiect
          </button>
        </div>
      </div>
    </section>
  );
}
