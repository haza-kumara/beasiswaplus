"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiRequest, jsonInit } from "@/lib/api/client"
import { ActionButton, buttonClass } from "@/components/ui/action-button"
import { Chip } from "@/components/ui/chip"
import { applicationInfo } from "@/lib/format/status"

type Props = {
  scholarshipId: string
  applicationUrl: string | null
  expired: boolean
  profileMissing: boolean
  eligible: boolean
  missingDocuments: string[]
  application?: { id: string; status: string }
}

export function ApplyPanel(p: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function apply() {
    setLoading(true)
    setError(null)
    const res = await apiRequest("/api/applications", jsonInit("POST", { scholarshipId: p.scholarshipId }))
    setLoading(false)
    if (!res.ok) return setError(res.error)
    router.refresh()
  }

  const external = p.applicationUrl && !p.expired && (
    <a href={p.applicationUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
      Buka situs penyelenggara
    </a>
  )

  let body: React.ReactNode
  if (p.application) {
    const info = applicationInfo(p.application.status)
    body = (
      <>
        <p className="flex items-center gap-2 text-sm">
          Status pendaftaranmu: <Chip tone={info.tone}>{info.label}</Chip>
        </p>
        <Link href="/applications" className={buttonClass("secondary")}>Lihat pendaftaranku</Link>
      </>
    )
  } else if (p.expired) {
    body = <p className="text-sm text-[#5B6679]">Pendaftaran beasiswa ini sudah ditutup.</p>
  } else if (p.profileMissing) {
    body = (
      <>
        <p className="text-sm text-[#5B6679]">Lengkapi profilmu dulu agar kami bisa memeriksa kelayakanmu.</p>
        <Link href="/profile" className={buttonClass("primary")}>Isi profil</Link>
      </>
    )
  } else if (!p.eligible) {
    body = (
      <p className="text-sm text-[#5B6679]">
        Profilmu belum memenuhi syarat wajib beasiswa ini, jadi pendaftaran lewat BeasiswaPlus belum bisa dilakukan.
      </p>
    )
  } else if (p.missingDocuments.length > 0) {
    body = (
      <>
        <p className="text-sm text-[#9A5200]">
          Dokumen yang masih kurang: {p.missingDocuments.join(", ")}.
        </p>
        <Link href="/documents" className={buttonClass("primary")}>Unggah berkas</Link>
      </>
    )
  } else {
    body = (
      <>
        <p className="text-sm text-[#5B6679]">
          Pendaftaranmu akan tercatat di BeasiswaPlus. Beberapa penyelenggara juga meminta kamu mengisi formulir di situs mereka.
        </p>
        <ActionButton onClick={apply} disabled={loading} className="px-6 py-3">
          {loading ? "Mendaftarkan..." : "Daftar sekarang"}
        </ActionButton>
      </>
    )
  }

  return (
    <section aria-labelledby="apply-title" className="rounded-lg border border-[#DCE1EA] bg-white p-5">
      <h2 id="apply-title" className="text-base font-semibold">Pendaftaran</h2>
      <div className="mt-3 flex flex-col items-start gap-3">
        {body}
        {external}
        {error && (
          <p role="alert" className="rounded-md border border-[#F4C4BF] bg-[#FCE9E7] px-3 py-2 text-sm text-[#B3261E]">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
