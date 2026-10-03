import { createClient } from "@/lib/supabase/server"
import { ServiceError } from "@/lib/services/scholarships"

export async function getSessionUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new ServiceError(401, "Unauthorized")
  return { supabase, user }
}