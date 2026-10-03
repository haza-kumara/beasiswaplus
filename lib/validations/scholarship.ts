// lib/validations/scholarship.ts
import { z } from "zod"

const REQUIREMENT_TYPES = [
  "first_generation","household_income","gpa","semester",
  "orphan_status","study_program","university",
] as const
const OPERATORS = ["=","!=","<","<=",">",">=","in"] as const

export const requirementSchema = z.object({
  requirement_type: z.enum(REQUIREMENT_TYPES),
  operator: z.enum(OPERATORS),
  value: z.string().min(1),
  is_required: z.boolean().default(true),
}).superRefine((r, ctx) => {
  const bool = ["first_generation","orphan_status"]
  const num  = ["household_income","gpa","semester"]
  if (bool.includes(r.requirement_type) && !["true","false"].includes(r.value))
    ctx.addIssue({ code: "custom", message: "value harus 'true' atau 'false'", path: ["value"] })
  if (num.includes(r.requirement_type) && Number.isNaN(Number(r.value)))
    ctx.addIssue({ code: "custom", message: "value harus angka", path: ["value"] })
})

export const scholarshipBaseSchema = z.object({
  title: z.string().min(3).max(200),
  provider: z.string().min(2).max(200),
  description: z.string().optional(),
  application_url: z.string().url().optional(),
  min_gpa: z.number().min(0).max(4).optional(),
  max_income: z.number().int().min(0).optional(),
  deadline: z.string().datetime().optional(),
  is_active: z.boolean().default(true),
})

export const createScholarshipSchema = scholarshipBaseSchema.extend({
  requirements: z.array(requirementSchema).default([]),
})
export const updateScholarshipSchema = scholarshipBaseSchema.partial().extend({
  requirements: z.array(requirementSchema).optional(), // jika ada → diganti total
})

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
})