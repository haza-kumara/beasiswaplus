import type { RequirementCategory, RequirementResult } from "./eligibility"

export const WEIGHTS: Record<RequirementCategory, number> = {
  economic: 30,
  first_generation: 20,
  orphan: 15,
  gpa: 15,
  study_program: 10,
  semester: 5,
  other: 5,
}

export function computeScore(results: RequirementResult[]): number {
  const byCategory = new Map<RequirementCategory, number[]>()
  for (const r of results) {
    byCategory.set(r.category, [...(byCategory.get(r.category) ?? []), r.credit])
  }

  let earned = 0
  let possible = 0
  for (const [category, credits] of byCategory) {
    const avg = credits.reduce((a, b) => a + b, 0) / credits.length
    earned += WEIGHTS[category] * avg
    possible += WEIGHTS[category]
  }

  // Beasiswa tanpa syarat apa pun (terbuka untuk semua): skor netral
  if (possible === 0) return 50
  return Math.round((earned / possible) * 100)
}