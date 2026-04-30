import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="panel w-full max-w-md p-7">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--line)] bg-[linear-gradient(130deg,var(--accent),var(--accent-strong))] text-[#060b15]">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--ink)]">Autentificare</h1>
            <p className="text-sm text-[var(--muted)]">Conectare Supabase email/parolă</p>
          </div>
        </div>
        <form className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">Email</span>
            <input className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.8)] px-3 py-2 text-[var(--foreground)] outline-none" placeholder="consultant@firma.ro" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">Parolă</span>
            <input type="password" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(8,16,31,0.8)] px-3 py-2 text-[var(--foreground)] outline-none" placeholder="••••••••" />
          </label>
          <Link href="/dashboard" className="btn-accent focus-ring block px-4 py-2.5 text-center text-sm">
            Intră în aplicație
          </Link>
        </form>
        <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
          În preview local, butonul intră în modul demo. După configurarea variabilelor Supabase, acțiunea se leagă la autentificare reală.
        </p>
      </section>
    </main>
  );
}
