import { applicationInfo } from "@/lib/format/status"

const STEPS = ["Disiapkan", "Terkirim", "Ditinjau", "Keputusan"]

export function StatusTrack({ status }: { status: string }) {
  const info = applicationInfo(status)
  return (
    <ol className="grid grid-cols-4 gap-1.5" aria-label={`Tahap saat ini: ${info.label}`}>
      {STEPS.map((label, i) => {
        const done = i <= info.phase
        const final = i === 3 && info.phase === 3
        const color = final
          ? info.tone === "danger" ? "bg-[#B3261E]" : "bg-[#0F7A5A]"
          : done ? "bg-[#2338D1]" : "bg-[#DCE1EA]"
        return (
          <li key={label}>
            <div className={`h-1.5 rounded-full ${color}`} />
            <span className={`mt-1.5 block text-xs ${done ? "font-medium text-[#0F1A2E]" : "text-[#8A94A6]"}`}>
              {final ? info.label : label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
