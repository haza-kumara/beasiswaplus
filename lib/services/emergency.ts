import { getSessionUser } from "@/lib/services/session"
import { ServiceError } from "@/lib/services/scholarships"
import { createEmergencySchema, updateEmergencySchema } from "@/lib/validations/emergency"

export async function createEmergencyRequest(input: unknown) {
  const body = createEmergencySchema.parse(input)
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase.from("emergency_requests").insert({
    user_id: user.id,
    description: body.description,
    amount_requested: body.amountRequested,
  }).select().single()

  if (error) {
    if (error.code === "23505") throw new ServiceError(409, "Kamu masih punya pengajuan yang sedang diproses")
    throw new ServiceError(400, error.message)
  }
  return data
}

export async function listMyEmergencyRequests() {
  const { supabase, user } = await getSessionUser()
  const { data, error } = await supabase.from("emergency_requests")
    .select("*").eq("user_id", user.id).order("created_at", { ascending: false })
  if (error) throw new ServiceError(500, error.message)
  return { items: data ?? [] }
}

export async function getEmergencyRequestById(id: string) {
  const { supabase } = await getSessionUser()
  const { data, error } = await supabase.from("emergency_requests").select("*").eq("id", id).maybeSingle()
  if (error) throw new ServiceError(500, error.message)
  if (!data) throw new ServiceError(404, "Pengajuan tidak ditemukan")
  return data
}

// Antrian admin: prioritas tinggi dulu, lalu yang paling lama menunggu
export async function listEmergencyQueue() {
  const { supabase, user } = await getSessionUser()
  if (user.app_metadata?.role !== "admin") throw new ServiceError(403, "Hanya admin")
  const { data, error } = await supabase.from("emergency_requests").select("*")
    .in("status", ["submitted", "in_review"])
    .order("priority", { ascending: true })   // 'high' < 'medium' secara alfabet
    .order("created_at", { ascending: true })
  if (error) throw new ServiceError(500, error.message)
  return { items: data ?? [] }
}

export async function updateEmergencyStatus(id: string, input: unknown) {
  const body = updateEmergencySchema.parse(input)
  const { supabase } = await getSessionUser()
  const { data, error } = await supabase.from("emergency_requests")
    .update({ status: body.status, admin_note: body.adminNote ?? null })
    .eq("id", id).select().maybeSingle()
  if (error) throw new ServiceError(400, error.message)
  if (!data) throw new ServiceError(404, "Pengajuan tidak ditemukan atau kamu bukan admin")
  return data
}