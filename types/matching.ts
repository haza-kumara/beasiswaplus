export type ScholarshipMatch = {
  scholarshipId: string
  title: string
  matchScore: number
  reasons: string[]
  missingDocuments: string[]
  deadline: string | null
  applicationUrl: string | null
}

export type MatchProfile = {
  university: string | null
  study_program: string | null
  semester: number | null
  gpa: number | null
  monthly_household_income: number | null
  first_generation: boolean
  orphan_status: boolean
}