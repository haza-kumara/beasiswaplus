import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

/** Dipakai di server component: arahkan ke login jika belum ada sesi. */
export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  return user
}
