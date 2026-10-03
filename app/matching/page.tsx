import { createClient } from "@/lib/supabase/server";
import { getMatchesForUser } from "@/lib/services/matching";
import { MatchCard } from "@/components/match-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MatchingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Cek profil sudah diisi belum
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, gpa, monthly_household_income")
    .eq("id", user.id)
    .maybeSingle();

  const profileIncomplete = !profile?.gpa || !profile?.monthly_household_income;

  let matches = null;
  let error = null;

  if (!profileIncomplete) {
    try {
      matches = await getMatchesForUser();
    } catch (e) {
      error = e instanceof Error ? e.message : "Terjadi kesalahan.";
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Beasiswa yang Cocok Untukmu</h1>
        <p className="text-muted-foreground mt-1">
          Diurutkan berdasarkan kesesuaian profil dan deadline terdekat.
        </p>
      </div>

      {profileIncomplete && (
        <div className="rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-950 p-4 flex flex-col gap-3">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Profil belum lengkap — isi dulu agar sistem bisa mencocokkan beasiswamu.
          </p>
          <Button asChild size="sm" className="w-fit">
            <Link href="/profile">Lengkapi Profil</Link>
          </Button>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-400 bg-red-50 dark:bg-red-950 p-4">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {matches && matches.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          <p>Tidak ada beasiswa yang cocok saat ini.</p>
          <p className="text-sm mt-1">Coba perbarui profilmu atau cek kembali nanti.</p>
        </div>
      )}

      {matches && matches.length > 0 && (
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <MatchCard key={match.scholarshipId} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
