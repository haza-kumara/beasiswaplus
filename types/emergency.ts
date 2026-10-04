export type EmergencyRequest = {
  id: string; user_id: string; description: string; amount_requested: number
  status: string; priority: string; admin_note: string | null
  created_at: string; updated_at: string
}
