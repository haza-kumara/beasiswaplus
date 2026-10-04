"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ActionButton } from "@/components/ui/action-button"

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function signOut() {
    setLoading(true)
    await createClient().auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <ActionButton variant="ghost" onClick={signOut} disabled={loading} className="!px-3 !py-1.5">
      {loading ? "Keluar..." : "Keluar"}
    </ActionButton>
  )
}
