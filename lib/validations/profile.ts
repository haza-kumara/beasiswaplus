import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  university: z.string().min(2, "Universitas wajib diisi"),
  study_program: z.string().min(2, "Program studi wajib diisi"),
  semester: z.number().int().min(1).max(14),
  gpa: z.number().min(0).max(4),
  monthly_household_income: z.number().min(0),
  household_size: z.number().int().min(1),
  first_generation: z.boolean().default(false),
  orphan_status: z.boolean().default(false),
});

export type ProfileInput = z.infer<typeof profileSchema>;