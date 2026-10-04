import Link from "next/link"
import { DOC_SHORT } from "@/lib/format/documents"
import { ThemeSwitcher } from "@/components/theme-switcher"

const BASELINE = ["ktm", "kk", "sktm", "transcript"]

export function ReadinessStrip({
  percent,
  owned,
}: {
  percent: number
  owned: string[]
}) {
  return (
    <section aria-labelledby="readiness-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="readiness-title" className="text-base font-semibold">
          Kesiapan berkas
        </h2>
        <span className="text-2xl font-semibold tabular-nums">{percent}%</span>
      </div>
      <ul className="mt-3 grid grid-cols-4 gap-1.5">
        {BASELINE.map((t) => {
          const has = owned.includes(t)
          return (
            <li
              key={t}
              className={`rounded-md border px-1 py-2 text-center text-xs font-medium ${
                has
                  ? "border-[#BFE3D1] bg-[#E3F4EC] text-[#0F7A5A]"
                  : "border-dashed border-[#C5CCDA] text-[#5B6679]"
              }`}
            >
              <span className="sr-only">{has ? "Sudah ada: " : "Belum ada: "}</span>
              {DOC_SHORT[t]}
            </li>
          )
        })}
      </ul>
      <Link href="/documents" className="mt-3 inline-block text-sm font-medium text-[#2338D1] hover:underline">
        Kelola berkas
      </Link>
    </section>
  )
}
