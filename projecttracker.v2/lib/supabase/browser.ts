import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase nu este configurat. Completează variabilele NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }

  return createBrowserClient(url, key);
}
