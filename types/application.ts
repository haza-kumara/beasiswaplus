export type ApplicationStatus =
  | "draft" | "submitted" | "under_review" | "approved" | "rejected"
  | "interested" | "preparing" | "ready" | "accepted"
export type Application = {
  id: string; user_id: string; scholarship_id: string
  status: ApplicationStatus | string; match_score: number | null
  notes: string | null; submitted_at: string | null
  created_at: string; updated_at: string
  scholarships: { id: string; title: string; provider: string; deadline: string | null; application_url: string | null }
}
