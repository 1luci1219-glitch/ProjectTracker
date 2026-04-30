# EU Funds Operations Hub

Aplicație internă pentru consultant de fonduri europene, structurată separat pentru:

- **Fondul de Modernizare**: operațiuni MySMIS, acte adiționale, cereri de rambursare și prefinanțare.
- **PNRR / REPowerEU**: solicitări de clarificări legate de proiect, RUE, componentă, termen și status.

## Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Supabase Auth + Postgres
- Zod-ready data contracts
- React Hook Form-ready forms
- TanStack Table-ready table layer
- Supabase DB-first workflow

## Rulare locală

```bash
npm install
npm run dev
```

Deschide `http://localhost:3000`.

## Variabile de mediu

Copiază `.env.example` în `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

Dacă proiectul folosește cheia anon legacy, poți seta:

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
```

## Supabase

1. Creează proiect Supabase.
2. Activează Email provider în Authentication.
3. Rulează `supabase/migrations/001_init.sql` în SQL Editor.
4. Creează un utilizator.
5. Rulează seed-ul inițial din fișierele Excel (vezi secțiunea Seed).

Schema include:

- `profiles`
- `companies`
- `projects`
- `pnrr_clarifications`
- `fm_actions`
- `fm_addenda`
- `project_notes`
- `activity_logs`

RLS este activ pentru toate tabelele operaționale.

## Seed date inițiale din Excel

Aplicația nu mai folosește modul de import în UI. Datele FM + PNRR se încarcă o singură dată în DB.

1. Configurează variabilele:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Rulează:

```bash
npm run seed:xlsx -- "C:/Users/tragp/Downloads/FM_Evidenta.xlsx" "C:/Users/tragp/Downloads/Evidenta Solicitari REPowerEU.xlsx"
```

Scriptul adaugă/actualizează companii și proiecte în tabelele Supabase.

## Deploy Vercel

1. Creează repository GitHub `ProjectTracker`.
2. Urcă codul.
3. Importă repository-ul în Vercel.
4. Setează variabilele Supabase în Vercel Project Settings.
5. Deploy.

## Decizii de produs

- FM și PNRR sunt module separate în navigație și în model.
- Proiectele folosesc un model comun, dar entitățile operaționale sunt separate.
- Toate proiectele FM au `requires_addendum = true`, motiv implicit `Actualizare TVA 19% -> 21%`.
- `zile rămase`, `urgent`, `scadent` și `expirat` sunt valori derivate în frontend.
- Statusurile stocate sunt curate, fără emoji. Iconografia aparține doar UI-ului.
