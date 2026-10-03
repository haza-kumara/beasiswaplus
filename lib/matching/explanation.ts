import type { RequirementResult } from "./eligibility"
import type { Scholarship } from "@/types/scholarship"

const REASON_TEXT: Record<string, string> = {
  household_income: "Pendapatan keluarga sesuai",
  first_generation: "First-generation sesuai",
  orphan_status: "Status yatim/piatu sesuai",
  gpa: "IPK memenuhi",
  semester: "Semester memenuhi",
  study_program: "Program studi sesuai",
  university: "Universitas sesuai",
}

export function buildReasons(results: RequirementResult[]): string[] {
  return results
    .filter(r => r.status === "met")
    .map(r => REASON_TEXT[r.requirement.requirement_type])
    .filter((text): text is string => Boolean(text))
}

const DOC_LABEL: Record<string, string> = { ktm: "KTM", kk: "KK", sktm: "SKTM" }

// Aktif setelah ada requirement_type 'required_document' (lihat catatan di bawah)
export function findMissingDocuments(s: Scholarship, ownedTypes: string[]): string[] {
  const owned = new Set(ownedTypes.map(t => t.toLowerCase()))
  return s.scholarship_requirements
    .filter(r => r.requirement_type === "required_document")
    .map(r => r.value.toLowerCase())
    .filter(doc => !owned.has(doc))
    .map(doc => DOC_LABEL[doc] ?? doc.toUpperCase())
}