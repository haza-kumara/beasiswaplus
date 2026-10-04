"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ActionButton } from "@/components/ui/action-button"
import { Field, inputClass } from "@/components/ui/field"
import { ThemeSwitcher } from "../theme-switcher"

export type ProfileValues = {
  full_name: string
  university: string
  study_program: string
  semester: string
  gpa: string
  monthly_household_income: string
  household_size: string
  first_generation: boolean
  orphan_status: boolean
}

type Errors = Partial<Record<keyof ProfileValues, string>>

const toNum = (v: string) => (v.trim() === "" ? null : Number(v))
const toText = (v: string) => (v.trim() === "" ? null : v.trim())

function validate(v: ProfileValues): Errors {
  const e: Errors = {}
  if (!v.full_name.trim()) e.full_name = "Nama lengkap wajib diisi."
  const semester = toNum(v.semester)
  if (semester !== null && (!Number.isInteger(semester) || semester < 1 || semester > 14))
    e.semester = "Isi semester antara 1 sampai 14."
  const gpa = toNum(v.gpa)
  if (gpa !== null && (Number.isNaN(gpa) || gpa < 0 || gpa > 4)) e.gpa = "IPK harus antara 0 dan 4."
  const income = toNum(v.monthly_household_income)
  if (income !== null && (Number.isNaN(income) || income < 0)) e.monthly_household_income = "Pendapatan tidak boleh negatif."
  const size = toNum(v.household_size)
  if (size !== null && (!Number.isInteger(size) || size < 1)) e.household_size = "Jumlah anggota keluarga minimal 1."
  return e
}

function ToggleRow({
  id, label, hint, checked, onChange,
}: { id: string; label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-md border border-[#C5CCDA] bg-white p-3 hover:border-[#0F1A2E]">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-[#2338D1]" />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-[#5B6679]">{hint}</span>
      </span>
    </label>
  )
}

export function ProfileForm({ userId, initial }: { userId: string; initial: ProfileValues }) {
  const [v, setV] = useState<ProfileValues>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)

  const set = <K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) => {
    setV((p) => ({ ...p, [key]: value }))
    if (status === "saved") setStatus("idle")
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate(v)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus("saving")
    setMessage(null)
    const { error } = await createClient().from("profiles").upsert({
      id: userId,
      full_name: v.full_name.trim(),
      university: toText(v.university),
      study_program: toText(v.study_program),
      semester: toNum(v.semester),
      gpa: toNum(v.gpa),
      monthly_household_income: toNum(v.monthly_household_income),
      household_size: toNum(v.household_size),
      first_generation: v.first_generation,
      orphan_status: v.orphan_status,
    })
    if (error) {
      setStatus("error")
      setMessage(error.message)
      return
    }
    setStatus("saved")
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-10" noValidate>
      <fieldset className="space-y-5">
        <legend className="mb-3 text-lg font-semibold">Data diri</legend>
        <Field label="Nama lengkap" htmlFor="full_name" error={errors.full_name}>
          <input id="full_name" value={v.full_name} onChange={(e) => set("full_name", e.target.value)} className={inputClass} autoComplete="name" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Universitas" htmlFor="university">
            <input id="university" value={v.university} onChange={(e) => set("university", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Program studi" htmlFor="study_program">
            <input id="study_program" value={v.study_program} onChange={(e) => set("study_program", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-3 text-lg font-semibold">Akademik</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Semester saat ini" htmlFor="semester" error={errors.semester}>
            <input id="semester" type="number" inputMode="numeric" min={1} max={14} value={v.semester} onChange={(e) => set("semester", e.target.value)} className={inputClass} />
          </Field>
          <Field label="IPK" htmlFor="gpa" hint="Skala 4.00, contoh 3.50" error={errors.gpa}>
            <input id="gpa" type="number" inputMode="decimal" step="0.01" min={0} max={4} value={v.gpa} onChange={(e) => set("gpa", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-3 text-lg font-semibold">Kondisi keluarga</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Pendapatan keluarga per bulan (Rp)" htmlFor="income" error={errors.monthly_household_income}>
            <input id="income" type="number" inputMode="numeric" min={0} value={v.monthly_household_income} onChange={(e) => set("monthly_household_income", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Jumlah anggota keluarga" htmlFor="size" error={errors.household_size}>
            <input id="size" type="number" inputMode="numeric" min={1} value={v.household_size} onChange={(e) => set("household_size", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <ToggleRow id="first_generation" label="Mahasiswa first-generation" hint="Kamu anggota keluarga pertama yang kuliah." checked={v.first_generation} onChange={(c) => set("first_generation", c)} />
        <ToggleRow id="orphan_status" label="Yatim atau piatu" hint="Salah satu atau kedua orang tua telah meninggal." checked={v.orphan_status} onChange={(c) => set("orphan_status", c)} />
      </fieldset>

      {status === "error" && (
        <p role="alert" className="rounded-md border border-[#F4C4BF] bg-[#FCE9E7] px-3 py-2 text-sm text-[#B3261E]">
          Profil belum tersimpan: {message}
        </p>
      )}
      {status === "saved" && (
        <p role="status" className="rounded-md border border-[#BFE3D1] bg-[#E3F4EC] px-3 py-2 text-sm text-[#0F7A5A]">
          Profil tersimpan.{" "}
          <Link href="/dashboard" className="font-semibold underline">Lihat beasiswa yang cocok</Link>
        </p>
      )}

      <ActionButton type="submit" disabled={status === "saving"} className="w-full sm:w-auto">
        {status === "saving" ? "Menyimpan..." : "Simpan profil"}
      </ActionButton>
    </form>
  )
}
