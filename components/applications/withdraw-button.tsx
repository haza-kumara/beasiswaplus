"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api/client"
import { ActionButton } from "@/components/ui/action-button"

export function WithdrawButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function withdraw() {
    if (!window.confirm(`Batalkan pendaftaran "${title}"?`)) return
    setLoading(true)
    setError(null)
    const res = await apiRequest(`/api/applications/${id}`, { method: "DELETE" })
    setLoading(false)
    if (!res.ok) return setError(res.error)
    router.refresh()
  }

  return (
    <div>
      <ActionButton variant="danger" onClick={withdraw} disabled={loading} className="!px-3 !py-1.5">
        {loading ? "Membatalkan..." : "Batalkan"}
      </ActionButton>
      {error && <p role="alert" className="mt-1 text-xs text-[#B3261E]">{error}</p>}
    </div>
  )
}
