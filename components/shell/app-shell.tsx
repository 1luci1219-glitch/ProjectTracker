"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, FileSpreadsheet, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/fm", label: "Fondul de Modernizare", icon: Building2 },
  { href: "/pnrr", label: "PNRR", icon: FileSpreadsheet },
  { href: "/dashboard", label: "Dashboard general", icon: BarChart3 },
  { href: "/settings", label: "Setări", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(5,8,18,0.76)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-3.5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-sm font-bold text-[#050812] shadow-[0_12px_26px_rgba(71,127,255,0.42)]">
              EU
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-[var(--ink)]">EU Funds Operations Hub</p>
              <p className="mt-1 text-xs text-[var(--muted)]">MySMIS, clarificări, termene operaționale</p>
            </div>
          </Link>

          <nav className="rounded-full border border-[var(--line)] bg-[rgba(15,23,42,0.75)] p-1 shadow-[0_14px_34px_rgba(2,8,26,0.5)]">
            <div className="flex items-center gap-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "focus-ring motion-soft inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-[var(--muted)]",
                      active && "border border-[var(--line)] bg-[linear-gradient(130deg,rgba(79,215,255,0.17),rgba(126,107,255,0.18))] text-[var(--ink)]",
                      !active && "hover:bg-[rgba(124,142,201,0.14)] hover:text-[var(--ink)]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <Link
            href="/login"
            className="focus-ring motion-soft inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(12,20,36,0.8)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            <LogOut className="h-4 w-4" />
            Ieșire
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] px-5 py-7">{children}</main>
    </div>
  );
}
