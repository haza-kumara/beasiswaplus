import Link from "next/link"
import type { Application } from "@/types/application"
import { Chip } from "@/components/ui/chip"
import { applicationInfo } from "@/lib/format/status"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function RecentApplications({ items }: { items: Application[] }) {
  return (
    <section aria-labelledby="recent-title">
      <h2 id="recent-title" className="text-base font-semibold">
        Pendaftaran terakhir
      </h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-[#5B6679]">Kamu belum mendaftar beasiswa apa pun.</p>
      ) : (
        <ul className="mt-3 divide-y divide-[#DCE1EA] border-y border-[#DCE1EA]">
          {items.slice(0, 3).map((a) => {
            const info = applicationInfo(a.status)
            return (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 truncate text-sm">{a.scholarships?.title ?? "Beasiswa"}</span>
                <Chip tone={info.tone}>{info.label}</Chip>
              </li>
            )
          })}
        </ul>
      )}
      <Link href="/applications" className="mt-3 inline-block text-sm font-medium text-[#2338D1] hover:underline">
        Semua pendaftaran
      </Link>
    </section>
  )
}
