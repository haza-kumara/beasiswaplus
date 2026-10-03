// lib/repositories/scholarships.ts
import { createClient } from "@/lib/supabase/server"

export async function findMany({ page, pageSize, search }:
  { page: number; pageSize: number; search?: string }) {
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  let q = supabase
    .from("scholarships")
    .select("*, scholarship_requirements(*)", { count: "exact" })
    .eq("is_active", true)
    .order("deadline", { ascending: true, nullsFirst: false })
    .range(from, from + pageSize - 1)
  if (search) q = q.or(`title.ilike.%${search}%,provider.ilike.%${search}%`)
  return q
}

export async function findById(id: string) {
  const supabase = await createClient()
  return supabase.from("scholarships")
    .select("*, scholarship_requirements(*)")
    .eq("id", id).maybeSingle()
}

export async function insertScholarship(data: Record<string, unknown>) {
  const supabase = await createClient()
  return supabase.from("scholarships").insert(data).select().single()
}

export async function updateScholarshipRow(id: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  return supabase.from("scholarships").update(data).eq("id", id).select().maybeSingle()
}

export async function deleteScholarshipRow(id: string) {
  const supabase = await createClient()
  return supabase.from("scholarships").delete().eq("id", id).select("id").maybeSingle()
}

export async function replaceRequirements(scholarshipId: string, reqs: any[]) {
  const supabase = await createClient()
  const del = await supabase.from("scholarship_requirements")
    .delete().eq("scholarship_id", scholarshipId)
  if (del.error || reqs.length === 0) return del
  return supabase.from("scholarship_requirements")
    .insert(reqs.map(r => ({ ...r, scholarship_id: scholarshipId })))
}