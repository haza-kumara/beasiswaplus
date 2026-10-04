import Link from "next/link"
import { requireUser } from "@/lib/auth/require-user"
import { listMyEmergencyRequests } from "@/lib/services/emergency"
import type { EmergencyRequest } from "@/types/emergency"
import { PageTitle } from "@/components/ui/page-title"
import { EmergencyForm } from "@/components/emergency/emergency-form"
import { EmergencyHistory } from "@/components/emergency/emergency-history"
import { Chip } from "@/components/ui/chip"
import { emergencyInfo } from "@/lib/format/status"

export default async function EmergencyPage() {
  await requireUser()
  const { items } = (await listMyEmergencyRequests()) as { items: EmergencyRequest[] }
  const open = items.find((r) => emergencyInfo(r.status).open)

  return (
    <div className="max-w-3xl">
      <PageTitle
        title="Bantuan darurat"
        subtitle="Ajukan jika kamu terancam gagal registrasi atau putus kuliah. Pengajuan ditinjau oleh petugas kampus."
      />

      {open ? (
        <div className="rounded-lg border border-[#F3D5A6] bg-[#FDF1E1] p-5">
          <p className="flex flex-wrap items-center gap-2 font-medium">
            Pengajuanmu sedang diproses <Chip tone={emergencyInfo(open.status).tone}>{emergencyInfo(open.status).label}</Chip>
          </p>
          <p className="mt-2 text-sm text-[#5B4A2A]">
            Satu pengajuan diproses dalam satu waktu. Kamu bisa mengajukan lagi setelah keputusan keluar.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 max-w-xl text-sm text-[#5B6679]">
            Siapkan dokumen pendukung di{" "}
            <Link href="/documents" className="font-medium text-[#2338D1] hover:underline">Berkas</Link>{" "}
            agar petugas bisa memverifikasi lebih cepat.
          </p>
          <EmergencyForm />
        </>
      )}

      <EmergencyHistory items={items} />
    </div>
  )
}
