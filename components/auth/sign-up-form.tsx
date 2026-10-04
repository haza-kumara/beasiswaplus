"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ActionButton } from "@/components/ui/action-button"
import { Field, inputClass } from "@/components/ui/field"

export function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeat, setRepeat] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) return setError("Password minimal 8 karakter.")
    if (password !== repeat) return setError("Konfirmasi password tidak sama.")

    setLoading(true)
    const { data, error } = await createClient().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/profile` },
    })
    setLoading(false)
    if (error) return setError(error.message)

    if (data.session) {
      router.push("/profile")
      router.refresh()
    } else {
      router.push("/auth/sign-up-success")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Buat akun</h1>
        <p className="mt-1 text-sm text-[#5B6679]">Daftar gratis, isi profilmu, lalu lihat beasiswa yang cocok.</p>
      </div>

      <Field label="Email" htmlFor="email">
        <input id="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="nama@kampus.ac.id" />
      </Field>
      <Field label="Password" htmlFor="password" hint="Minimal 8 karakter.">
        <input id="password" type="password" autoComplete="new-password" required value={password}
          onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Ulangi password" htmlFor="repeat">
        <input id="repeat" type="password" autoComplete="new-password" required value={repeat}
          onChange={(e) => setRepeat(e.target.value)} className={inputClass} />
      </Field>

      {error && (
        <p role="alert" className="rounded-md border border-[#F4C4BF] bg-[#FCE9E7] px-3 py-2 text-sm text-[#B3261E]">{error}</p>
      )}

      <ActionButton type="submit" disabled={loading || !email || !password || !repeat} className="w-full">
        {loading ? "Membuat akun..." : "Buat akun"}
      </ActionButton>

      <p className="text-center text-sm text-[#5B6679]">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="font-medium text-[#2338D1] hover:underline">Masuk</Link>
      </p>
    </form>
  )
}
