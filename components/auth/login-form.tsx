"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ActionButton } from "@/components/ui/action-button"
import { Field, inputClass } from "@/components/ui/field"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [needsConfirm, setNeedsConfirm] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)
    setNeedsConfirm(false)

    const { error } = await createClient().auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      const m = error.message.toLowerCase()
      if (m.includes("email not confirmed")) {
        setError("Email belum dikonfirmasi. Buka inbox-mu lalu klik link konfirmasi.")
        setNeedsConfirm(true)
      } else if (m.includes("invalid login")) {
        setError("Email atau password salah.")
      } else {
        setError(error.message)
      }
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  async function resend() {
    const { error } = await createClient().auth.resend({ type: "signup", email })
    setInfo(error ? error.message : "Link konfirmasi sudah dikirim ulang.")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Masuk</h1>
        <p className="mt-1 text-sm text-[#5B6679]">Lanjutkan mencari beasiswa yang cocok untukmu.</p>
      </div>

      <Field label="Email" htmlFor="email">
        <input id="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="nama@kampus.ac.id" />
      </Field>
      <Field label="Password" htmlFor="password">
        <input id="password" type="password" autoComplete="current-password" required value={password}
          onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </Field>

      {error && (
        <p role="alert" className="rounded-md border border-[#F4C4BF] bg-[#FCE9E7] px-3 py-2 text-sm text-[#B3261E]">{error}</p>
      )}
      {info && (
        <p role="status" className="rounded-md border border-[#BFE3D1] bg-[#E3F4EC] px-3 py-2 text-sm text-[#0F7A5A]">{info}</p>
      )}
      {needsConfirm && (
        <ActionButton type="button" variant="secondary" onClick={resend} className="w-full">
          Kirim ulang link konfirmasi
        </ActionButton>
      )}

      <ActionButton type="submit" disabled={loading || !email || !password} className="w-full">
        {loading ? "Memeriksa..." : "Masuk"}
      </ActionButton>

      <div className="flex items-center justify-between text-sm">
        <Link href="/auth/forgot-password" className="text-[#5B6679] hover:text-[#0F1A2E]">Lupa password?</Link>
        <Link href="/auth/sign-up" className="font-medium text-[#2338D1] hover:underline">Buat akun</Link>
      </div>
    </form>
  )
}
