"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { UserDocument } from "@/types/document"
import { apiRequest } from "@/lib/api/client"
import { buttonClass, ActionButton } from "@/components/ui/action-button"
import { Chip } from "@/components/ui/chip"
import { DOC_HINT, DOC_LABEL, DOC_TYPES, formatBytes } from "@/lib/format/documents"
import { formatDate } from "@/lib/format/scholarship"

const MAX = 5 * 1024 * 1024
const ALLOWED = ["application/pdf", "image/jpeg", "image/png"]

export function DocumentManager({ items }: { items: UserDocument[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setError = (key: string, msg: string | null) =>
    setErrors((prev) => {
      const next = { ...prev }
      if (msg) next[key] = msg
      else delete next[key]
      return next
    })

  async function upload(type: string, file: File) {
    setError(type, null)
    if (file.size > MAX) return setError(type, "Ukuran file maksimal 5 MB.")
    if (!ALLOWED.includes(file.type)) return setError(type, "Format harus PDF, JPG, atau PNG.")

    setBusy(type)
    const fd = new FormData()
    fd.append("type", type)
    fd.append("file", file)
    const res = await apiRequest("/api/documents", { method: "POST", body: fd })
    setBusy(null)
    if (!res.ok) return setError(type, res.error)
    router.refresh()
  }

  async function view(type: string, id: string) {
    setError(type, null)
    // Buka tab dulu agar tidak diblokir popup blocker, lalu isi alamatnya.
    const tab = window.open("about:blank", "_blank")
    const res = await apiRequest<{ url: string }>(`/api/documents/${id}`)
    if (!res.ok) {
      tab?.close()
      return setError(type, res.error)
    }
    if (tab) tab.location.href = res.data.url
  }

  async function remove(type: string, id: string) {
    if (!window.confirm(`Hapus ${DOC_LABEL[type]}? File akan dihapus permanen.`)) return
    setError(type, null)
    setBusy(type)
    const res = await apiRequest(`/api/documents/${id}`, { method: "DELETE" })
    setBusy(null)
    if (!res.ok) return setError(type, res.error)
    router.refresh()
  }

  return (
    <ul className="divide-y divide-[#DCE1EA] border-y border-[#DCE1EA]">
      {DOC_TYPES.map((type) => {
        const doc = items.find((d) => d.document_type === type)
        const isBusy = busy === type
        return (
          <li key={type} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold">{DOC_LABEL[type]}</h2>
                {doc ? <Chip tone="success">Tersimpan</Chip> : <Chip>Belum ada</Chip>}
              </div>
              {doc ? (
                <p className="mt-1 truncate text-sm text-[#5B6679]">
                  {doc.file_name}, {formatBytes(doc.file_size)}, diunggah {formatDate(doc.created_at)}
                </p>
              ) : (
                <p className="mt-1 text-sm text-[#5B6679]">{DOC_HINT[type]}</p>
              )}
              {errors[type] && (
                <p role="alert" className="mt-2 text-sm text-[#B3261E]">{errors[type]}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {doc && (
                <>
                  <ActionButton variant="secondary" onClick={() => view(type, doc.id)} disabled={isBusy}>
                    Lihat
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => remove(type, doc.id)} disabled={isBusy}>
                    Hapus
                  </ActionButton>
                </>
              )}
              <label className={`${buttonClass(doc ? "ghost" : "primary")} cursor-pointer focus-within:ring-2 focus-within:ring-[#2338D1] ${isBusy ? "pointer-events-none opacity-50" : ""}`}>
                {isBusy ? "Memproses..." : doc ? "Ganti file" : "Unggah"}
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  className="sr-only"
                  disabled={isBusy}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    e.target.value = ""
                    if (f) void upload(type, f)
                  }}
                />
              </label>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
