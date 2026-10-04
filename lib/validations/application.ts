import { z } from "zod"

export const createApplicationSchema = z.object({ scholarshipId: z.string().uuid() })
export const updateStatusSchema = z.object({
  status: z.enum(["under_review", "approved", "rejected"]),
  notes: z.string().max(1000).optional(),
})