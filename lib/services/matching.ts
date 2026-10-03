import { createClient } from "@/lib/supabase/server"
import { ServiceError } from "@/lib/services/scholarships"
import { checkEligibility } from "@/lib/matching/eligibility"
import { computeScore } from "@/lib/matching/scoring"
import { buildReasons, findMissingDocuments } from "@/lib/matching/explanation"
import type { ScholarshipMatch } from "@/types/matching"
import type { Scholarship } from "@/types/scholarship"

export async function getMatchesForUser(): Promise<ScholarshipMatch[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new ServiceError(401, "Unauthorized")

  const { data: profile, error: profileError } = await supabase
    .from("profiles").select("*").eq("id", user.id).maybeSingle()
  if (profileError) throw new ServiceError(500, profileError.message)
  if (!profile) throw new ServiceError(404, "Profile belum diisi")

  const { data: scholarships, error } = await supabase
    .from("scholarships")
    .select("*, scholarship_requirements(*)")
    .eq("is_active", true)
  if (error) throw new ServiceError(500, error.message)

  // Tabel documents milik feat/be-document; kalau belum ada, anggap kosong
  const docs = await supabase.from("documents").select("document_type").eq("user_id", user.id)
  const owned = docs.error ? [] : (docs.data ?? []).map(d => d.document_type as string)

  const matches: ScholarshipMatch[] = []
  for (const s of (scholarships ?? []) as Scholarship[]) {
    const eligibility = checkEligibility(profile, s)
    if (!eligibility.eligible) continue

    matches.push({
      scholarshipId: s.id,
      title: s.title,
      matchScore: computeScore(eligibility.results),
      reasons: buildReasons(eligibility.results),
      missingDocuments: findMissingDocuments(s, owned),
      deadline: s.deadline,
      applicationUrl: s.application_url,
    })
  }

  // Skor tertinggi dulu; kalau sama, deadline terdekat dulu
  return matches.sort((a, b) =>
    b.matchScore - a.matchScore ||
    new Date(a.deadline ?? "9999-12-31").getTime() - new Date(b.deadline ?? "9999-12-31").getTime(),
  )
}