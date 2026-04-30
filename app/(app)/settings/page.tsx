import { Database, KeyRound, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/section";

export default function SettingsPage() {
  return (
    <div>
      <SectionHeader
        eyebrow="Setări"
        title="Configurare aplicație"
        description="Loc pentru conexiunea Supabase, politici de acces și parametri operaționali."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { icon: KeyRound, title: "Supabase", body: "Configurează URL-ul proiectului și cheia publică în variabilele de mediu." },
          { icon: ShieldCheck, title: "Acces intern", body: "RLS permite utilizatorilor autentificați să lucreze cu datele proprii sau ale organizației." },
          { icon: Database, title: "Date proiecte", body: "Datele FM și PNRR sunt gestionate direct din baza de date, fără modul de import în aplicație." }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <section key={item.title} className="panel p-5">
              <Icon className="h-6 w-6 text-[var(--accent)]" />
              <h2 className="mt-4 font-semibold text-[var(--ink)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
