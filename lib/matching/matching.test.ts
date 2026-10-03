import { describe, it, expect } from "vitest"
import { checkEligibility } from "./eligibility"
import { computeScore } from "./scoring"
import type { Scholarship } from "../../types/scholarship"

const req = (type: string, operator: string, value: string, is_required = true) =>
  ({ id: type, scholarship_id: "s", requirement_type: type, operator, value, is_required })

const yayasanX = {
  id: "s", title: "Yayasan X", provider: "X", description: null, application_url: null,
  min_gpa: null, max_income: 1499999, deadline: null, is_active: true,
  created_at: "", updated_at: "",
  scholarship_requirements: [req("orphan_status", "=", "true"), req("household_income", "<", "1500000")],
} as Scholarship

const profile = {
  university: null, study_program: null, semester: 3, gpa: 3.5,
  monthly_household_income: 1_000_000, first_generation: true, orphan_status: true,
}

describe("matching", () => {
  it("eligible & skor ~87 untuk yatim berpendapatan 1 juta", () => {
    const r = checkEligibility(profile, yayasanX)
    expect(r.eligible).toBe(true)
    expect(computeScore(r.results)).toBe(87)
  })
  it("tidak eligible jika bukan yatim/piatu", () => {
    expect(checkEligibility({ ...profile, orphan_status: false }, yayasanX).eligible).toBe(false)
  })
  it("tidak eligible jika pendapatan terlalu tinggi", () => {
    expect(checkEligibility({ ...profile, monthly_household_income: 2_000_000 }, yayasanX).eligible).toBe(false)
  })
  it("tidak eligible jika data profil kosong untuk syarat wajib", () => {
    expect(checkEligibility({ ...profile, monthly_household_income: null }, yayasanX).eligible).toBe(false)
  })
  it("tidak eligible jika deadline lewat", () => {
    const expired = { ...yayasanX, deadline: "2020-01-01T00:00:00Z" }
    expect(checkEligibility(profile, expired).blockedReason).toBe("deadline_passed")
  })
})