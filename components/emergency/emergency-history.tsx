import type { EmergencyRequest } from "@/types/emergency"
import { Chip } from "@/components/ui/chip"
import { emergencyInfo, priorityLabel } from "@/lib/format/status"
import { formatDate, formatRupiah } from "@/lib/format/scholarship"

export function EmergencyHistory({ items }: { items: EmergencyRequest[] }) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby="history-title" className="mt-12">
      <h2 id="history-title" className="mb-2 text-lg font-semibold">Riwayat pengajuan</h2>
      <ul className="divide-y divide-[#DCE1EA] border-y border-[#DCE1EA]">
        {items.map((r) => {
          const info = emergencyInfo(r.status)
          return (
            <li key={r.id} className="py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xl font-semibold tabular-nums">{formatRupiah(r.amount_requested)}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone={r.priority === "high" ? "warning" : "neutral"}>{priorityLabel(r.priority)}</Chip>
                  <Chip tone={info.tone}>{info.label}</Chip>
                </div>
              </div>
              <p className="mt-1 text-sm text-[#5B6679]">Diajukan {formatDate(r.created_at)}</p>
              <p className="mt-3 max-w-prose text-sm text-[#3B4658]">{r.description}</p>
              {r.admin_note && (
                <p className="mt-3 max-w-prose border-l-2 border-[#C5CCDA] pl-3 text-sm text-[#3B4658]">
                  <span className="font-medium">Catatan petugas:</span> {r.admin_note}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
