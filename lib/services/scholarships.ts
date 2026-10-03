// lib/services/scholarships.ts
import * as repo from "@/lib/repositories/scholarships"
import {
  createScholarshipSchema, updateScholarshipSchema, listQuerySchema,
} from "@/lib/validations/scholarship"

export class ServiceError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

export async function getScholarships(input: unknown) {
  const query = listQuerySchema.parse(input)
  const { data, count, error } = await repo.findMany(query)
  if (error) throw new ServiceError(500, error.message)
  return { items: data ?? [], total: count ?? 0, ...query }
}

export async function getScholarshipById(id: string) {
  const { data, error } = await repo.findById(id)
  if (error) throw new ServiceError(500, error.message)
  if (!data) throw new ServiceError(404, "Beasiswa tidak ditemukan")
  return data
}

export async function createScholarship(input: unknown) {
  const { requirements, ...base } = createScholarshipSchema.parse(input)
  const { data, error } = await repo.insertScholarship(base)
  if (error) throw new ServiceError(error.code === "42501" ? 403 : 400, error.message)

  const r = await repo.replaceRequirements(data.id, requirements)
  if (r.error) {
    await repo.deleteScholarshipRow(data.id) // rollback sederhana
    throw new ServiceError(400, r.error.message)
  }
  return getScholarshipById(data.id)
}

export async function updateScholarship(id: string, input: unknown) {
  const { requirements, ...base } = updateScholarshipSchema.parse(input)
  if (Object.keys(base).length) {
    const { data, error } = await repo.updateScholarshipRow(id, base)
    if (error) throw new ServiceError(400, error.message)
    if (!data) throw new ServiceError(404, "Beasiswa tidak ditemukan atau bukan admin")
  }
  if (requirements) {
    const r = await repo.replaceRequirements(id, requirements)
    if (r.error) throw new ServiceError(400, r.error.message)
  }
  return getScholarshipById(id)
}

export async function deleteScholarship(id: string) {
  const { data, error } = await repo.deleteScholarshipRow(id)
  if (error) throw new ServiceError(400, error.message)
  if (!data) throw new ServiceError(404, "Beasiswa tidak ditemukan atau bukan admin")
  return { id: data.id }
}