import { getSessionUser } from "@/lib/services/session"
import { ServiceError } from "@/lib/services/scholarships"
import { checkEligibility } from "@/lib/matching/eligibility"
import { computeScore } from "@/lib/matching/scoring"
import { findMissingDocuments } from "@/lib/matching/explanation"
import { createApplicationSchema, updateStatusSchema } from "@/lib/validations/application"
import type { Scholarship } from "@/types/scholarship"

const withScholarship = "*, scholarships(id, title, provider, deadline, application_url)"

export async function createApplication(input: unknown) {
  const { scholarshipId } = createApplicationSchema.parse(input)
  const { supabase, user } = await getSessionUser()

  const [profileRes, scholarshipRes, docsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("scholarships").select("*, scholarship_requirements(*)").eq("id", scholarshipId).maybeSingle(),
    supabase.from("documents").select("document_type").eq("user_id", user.id),
  ])
  if (!profileRes.data) throw new ServiceError(404, "Profile belum diisi")
  if (!scholarshipRes.data) throw new ServiceError(404, "Beasiswa tidak ditemukan")

  const scholarship = scholarshipRes.data as Scholarship
  const eligibility = checkEligibility(profileRes.data, scholarship)
  if (!eligibility.eligible) {
    const reason =
      eligibility.blockedReason === "deadline_passed" ? "Pendaftaran sudah ditutup"
      : eligibility.blockedReason === "inactive" ? "Beasiswa tidak aktif"
      : "Profilmu belum memenuhi syarat wajib beasiswa ini"
    throw new ServiceError(422, reason)
  }

  const owned = (docsRes.data ?? []).map((d) => d.document_type as string)
  const missing = findMissingDocuments(scholarship, owned)
  if (missing.length > 0) throw new ServiceError(422, `Dokumen belum lengkap: ${missing.join(", ")}`)

  const { data, error } = await supabase.from("applications").insert({
    user_id: user.id,
    scholarship_id: scholarshipId,
    status: "submitted",
    match_score: computeScore(eligibility.results),
    submitted_at: new Date().toISOString(),
  }).select(withScholarship).single()

  if (error) {
    if (error.code === "23505") throw new ServiceError(409, "Kamu sudah mendaftar beasiswa ini")
    throw new ServiceError(400, error.message)
  }
  return data
}

export async function listMyApplications() {
  const { supabase, user } = await getSessionUser()
  const { data, error } = await supabase.from("applications")
    .select(withScholarship).eq("user_id", user.id).order("created_at", { ascending: false })
  if (error) throw new ServiceError(500, error.message)
  return { items: data ?? [] }
}

export async function getApplicationById(id: string) {
  const { supabase } = await getSessionUser()
  const { data, error } = await supabase.from("applications").select(withScholarship).eq("id", id).maybeSingle()
  if (error) throw new ServiceError(500, error.message)
  if (!data) throw new ServiceError(404, "Pendaftaran tidak ditemukan")
  return data
}

export async function withdrawApplication(id: string) {
  const { supabase } = await getSessionUser()
  const { data, error } = await supabase.from("applications").delete().eq("id", id).select("id").maybeSingle()
  if (error) throw new ServiceError(400, error.message)
  if (!data) throw new ServiceError(404, "Pendaftaran tidak ditemukan atau sudah diproses")
  return data
}

export async function updateApplicationStatus(id: string, input: unknown) {
  const body = updateStatusSchema.parse(input)
  const { supabase } = await getSessionUser()
  const { data, error } = await supabase.from("applications")
    .update(body).eq("id", id).select(withScholarship).maybeSingle()
  if (error) throw new ServiceError(400, error.message)
  if (!data) throw new ServiceError(404, "Pendaftaran tidak ditemukan atau kamu bukan admin")
  return data
}