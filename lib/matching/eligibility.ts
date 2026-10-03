import type { MatchProfile } from "@/types/matching"
import type { Scholarship, ScholarshipRequirement } from "@/types/scholarship"

export type RequirementCategory =
  | "economic" | "first_generation" | "orphan" | "gpa"
  | "study_program" | "semester" | "other"

export type RequirementResult = {
  requirement: ScholarshipRequirement
  category: RequirementCategory
  status: "met" | "unmet" | "unknown"   // unknown = data profil kosong
  credit: number                        // 0..1
}

export type EligibilityResult = {
  eligible: boolean
  results: RequirementResult[]
  failed: RequirementResult[]
  blockedReason?: "inactive" | "deadline_passed"
}

const BOOLEAN_TYPES = new Set(["first_generation", "orphan_status"])
const NUMERIC_TYPES = new Set(["household_income", "gpa", "semester"])
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export function categoryOf(type: string): RequirementCategory {
  switch (type) {
    case "household_income": return "economic"
    case "first_generation": return "first_generation"
    case "orphan_status": return "orphan"
    case "gpa": return "gpa"
    case "study_program": return "study_program"
    case "semester": return "semester"
    default: return "other"
  }
}

function profileValue(p: MatchProfile, type: string): boolean | number | string | null {
  switch (type) {
    case "first_generation": return p.first_generation
    case "orphan_status": return p.orphan_status
    case "household_income": return p.monthly_household_income
    case "gpa": return p.gpa
    case "semester": return p.semester
    case "study_program": return p.study_program
    case "university": return p.university
    default: return null
  }
}

// Kredit parsial: makin jauh melampaui batas, makin tinggi (0.7 - 1.0)
function creditFor(type: string, op: string, actual: number, expected: number): number {
  if (type === "household_income" && (op === "<" || op === "<=") && expected > 0)
    return 0.7 + 0.3 * clamp01((expected - actual) / expected)
  if (type === "gpa" && (op === ">" || op === ">=") && expected < 4)
    return 0.7 + 0.3 * clamp01((actual - expected) / (4 - expected))
  return 1
}

export function evaluateRequirement(
  profile: MatchProfile,
  req: ScholarshipRequirement,
): RequirementResult {
  const type = req.requirement_type
  const category = categoryOf(type)
  const raw = profileValue(profile, type)

  if (raw === null || raw === undefined)
    return { requirement: req, category, status: "unknown", credit: 0 }

  const actual = typeof raw === "string" ? raw.trim().toLowerCase() : raw
  let met = false

  if (req.operator === "in") {
    const list = req.value.split(",").map(s => s.trim().toLowerCase())
    met = list.includes(String(actual))
  } else {
    const expected: boolean | number | string = BOOLEAN_TYPES.has(type)
      ? req.value.trim().toLowerCase() === "true"
      : NUMERIC_TYPES.has(type) ? Number(req.value)
      : req.value.trim().toLowerCase()

    switch (req.operator) {
      case "=":  met = actual === expected; break
      case "!=": met = actual !== expected; break
      case "<":  met = Number(actual) <  Number(expected); break
      case "<=": met = Number(actual) <= Number(expected); break
      case ">":  met = Number(actual) >  Number(expected); break
      case ">=": met = Number(actual) >= Number(expected); break
    }
  }

  const credit = met && NUMERIC_TYPES.has(type)
    ? creditFor(type, req.operator, Number(actual), Number(req.value))
    : met ? 1 : 0

  return { requirement: req, category, status: met ? "met" : "unmet", credit }
}

// min_gpa & max_income dianggap requirement implisit jika belum ada di tabel requirements
export function normalizeRequirements(s: Scholarship): ScholarshipRequirement[] {
  const reqs = [...s.scholarship_requirements]
  const has = (t: string) => reqs.some(r => r.requirement_type === t)
  if (s.min_gpa !== null && !has("gpa"))
    reqs.push({ id: `implicit-gpa-${s.id}`, scholarship_id: s.id,
      requirement_type: "gpa", operator: ">=", value: String(s.min_gpa), is_required: true })
  if (s.max_income !== null && !has("household_income"))
    reqs.push({ id: `implicit-income-${s.id}`, scholarship_id: s.id,
      requirement_type: "household_income", operator: "<=", value: String(s.max_income), is_required: true })
  return reqs
}

export function checkEligibility(
  profile: MatchProfile,
  scholarship: Scholarship,
  now: Date = new Date(),
): EligibilityResult {
  if (!scholarship.is_active)
    return { eligible: false, results: [], failed: [], blockedReason: "inactive" }
  if (scholarship.deadline && new Date(scholarship.deadline) < now)
    return { eligible: false, results: [], failed: [], blockedReason: "deadline_passed" }

  const results = normalizeRequirements(scholarship)
    .filter(r => r.requirement_type !== "required_document") // dokumen dicek terpisah
    .map(r => evaluateRequirement(profile, r))

  // Requirement wajib yang tidak met ATAU datanya kosong → tidak eligible
  const failed = results.filter(r => r.requirement.is_required && r.status !== "met")
  return { eligible: failed.length === 0, results, failed }
}