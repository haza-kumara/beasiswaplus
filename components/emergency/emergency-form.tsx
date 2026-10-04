"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiRequest, jsonInit } from "@/lib/api/client"
import { ActionButton } from "@/components/ui/action-button"
import { Field, inputClass } from "@/components/ui/field"

const MIN_AMOUNT = 50_000
const MAX_AMOUNT = 100_000_000
const MIN_DESC = 20

export function EmergencyForm() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<{ amount?: string; description?: string }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(amount)
    const found: typeof errors = {}
    if (!amount || Number.isNaN(n) || !Number.isInteger(n)) found.amount = "Isi jumlah bantuan dengan angka bulat."
    else if (n < MIN_AMOUNT) found.amount = "Jumlah minimal Rp 50.000."
    else if (n > MAX_AMOUNT) found.amount = "Jumlah maksimal Rp 100.000.000."
    if (description.trim().length < MIN_DESC) found.description = `Jelaskan kondisimu minimal ${MIN_DESC} karakter.`
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setLoading(true)
    setError(null)
    const res = await apiRequest(
      "/api/emergency",
      jsonInit("POST", { description: description.trim(), amountRequested: n }),
    )
    setLoading(false)
    if (!res.ok) return setError(res.error)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5" noValidate>
      <Field label="Jumlah bantuan (Rp)" htmlFor="amount" error={errors.amount} hint="Antara Rp 50.000 dan Rp 100.000.000.">
        <input id="amount" type="number" inputMode="numeric" min={MIN_AMOUNT} max={MAX_AMOUNT} value={amount}
          onChange={(e) => setAmount(e.target.value)} className={inputClass} />
      </Field>

      <Field label="Alasan pengajuan" htmlFor="description" error={errors.description}
        hint={`Ceritakan situasimu dengan jujur dan singkat. ${description.trim().length} karakter.`}>
        <textarea id="description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)}
          className={inputClass} maxLength={2000}
          placeholder="Contoh: Orang tua saya terkena PHK dan UKT semester depan belum terbayar." />
      </Field>

      {error && (
        <p role="alert" className="rounded-md border border-[#F4C4BF] bg-[#FCE9E7] px-3 py-2 text-sm text-[#B3261E]">{error}</p>
      )}

      <ActionButton type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Ajukan bantuan"}
      </ActionButton>
    </form>
  )
}
