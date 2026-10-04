import Link from "next/link"
import { Chip } from "@/components/ui/chip"
import { emergencyInfo } from "@/lib/format/status"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function EmergencyNote({ latestStatus }: { latestStatus?: string }) {
  const info = latestStatus ? emergencyInfo(latestStatus) : null
  return (
    <section aria-labelledby="emergency-title" className="border-l-2 border-[#B3261E] pl-4">
      <h2 id="emergency-title" className="text-base font-semibold">
        Terancam gagal registrasi atau putus kuliah?
      </h2>
      {info ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-[#5B6679]">
          Pengajuan bantuan terakhirmu: <Chip tone={info.tone}>{info.label}</Chip>
        </p>
      ) : (
        <p className="mt-2 text-sm text-[#5B6679]">Ajukan bantuan darurat dari kampus. Prosesnya tidak memakai biaya.</p>
      )}
      <Link href="/emergency" className="mt-3 inline-block text-sm font-medium text-[#B3261E] hover:underline">
        {info ? "Lihat pengajuan" : "Ajukan bantuan darurat"}
      </Link>
    </section>
  )
}
