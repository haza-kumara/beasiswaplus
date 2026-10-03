// types/scholarship.ts

export type ScholarshipRequirement = {
  id: string
  scholarship_id: string
  requirement_type: string
  operator: string
  value: string
  is_required: boolean
}

export type Scholarship = {
  id: string
  title: string
  provider: string
  description: string | null
  application_url: string | null
  min_gpa: number | null
  max_income: number | null
  deadline: string | null          // ISO string, mis. "2026-10-08T05:00:00+00:00"
  is_active: boolean
  created_at: string
  updated_at: string
  scholarship_requirements: ScholarshipRequirement[]
}

// Bentuk respons GET /api/scholarships
export type ScholarshipListResponse = {
  items: Scholarship[]
  total: number
  page: number
  pageSize: number
}