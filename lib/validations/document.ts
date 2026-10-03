import { z } from "zod"

export const DOCUMENT_TYPES = ["ktm", "kk", "sktm", "ktp", "transcript"] as const
export const READINESS_BASELINE = ["ktm", "kk", "sktm", "transcript"] as const
export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"] as const

export const uploadSchema = z.object({
  type: z.enum(DOCUMENT_TYPES),
  file: z.instanceof(File)
    .refine((f) => f.size > 0 && f.size <= MAX_FILE_SIZE, "Ukuran file maksimal 5 MB")
    .refine((f) => (ALLOWED_MIME as readonly string[]).includes(f.type), "Format harus PDF, JPG, atau PNG"),
})