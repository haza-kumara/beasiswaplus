import { z } from "zod"

export const createEmergencySchema = z.object({
  description: z.string().trim().min(20, "Jelaskan kondisimu minimal 20 karakter").max(2000),
  amountRequested: z.number().int().min(50_000).max(100_000_000),
})
export const updateEmergencySchema = z.object({
  status: z.enum(["in_review", "approved", "rejected"]),
  adminNote: z.string().max(1000).optional(),
})