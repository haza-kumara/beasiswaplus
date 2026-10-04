"use client"

import { ActionButton } from "@/components/ui/action-button"

export function ErrorPanel({
  reset,
  message = "Data tidak bisa dimuat. Periksa koneksimu lalu coba lagi.",
}: {
  reset?: () => void
  message?: string
}) {
  return (
    <div role="alert" className="rounded-lg border border-[#F4C4BF] bg-[#FCE9E7] px-6 py-10 text-center">
      <h2 className="text-lg font-semibold text-[#B3261E]">Halaman gagal dimuat</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#7A1F1A]">{message}</p>
      {reset && (
        <div className="mt-5 flex justify-center">
          <ActionButton variant="secondary" onClick={reset}>
            Muat ulang
          </ActionButton>
        </div>
      )}
    </div>
  )
}
