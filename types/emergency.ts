export type EmergencyStatus = "submitted" | "in_review" | "approved" | "rejected"
export type EmergencyPriority = "medium" | "high"
export type EmergencyRequest = {
  id: string; user_id: string; description: string; amount_requested: number
  status: EmergencyStatus; priority: EmergencyPriority; admin_note: string | null
  created_at: string; updated_at: string
}