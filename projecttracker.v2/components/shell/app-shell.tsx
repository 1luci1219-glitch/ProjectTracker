"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/fm", label: "Fondul de Modernizare", icon: Building2 },
  { href: "/pnrr", label: "PNRR", icon: FileSpreadsheet }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(5,8,18,0.76)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-3.5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/logo.png" alt="ProjectTracker Logo" width={40} height={40} className="rounded-xl" priority />
            <div>
              <p className="text-sm font-semibold leading-none text-[var(--ink)]">ProjectTracker</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Instrument intern pentru FM și PNRR</p>
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

          <div className="hidden rounded-full border border-[var(--line)] bg-[rgba(12,20,36,0.8)] px-3.5 py-2 text-sm font-semibold text-[var(--muted)] lg:block">
            2-3 utilizatori interni
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] px-5 py-7">{children}</main>
    </div>
  );
}
