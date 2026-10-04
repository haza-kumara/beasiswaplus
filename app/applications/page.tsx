import Link from "next/link"
import { requireUser } from "@/lib/auth/require-user"
import { listMyApplications } from "@/lib/services/applications"
import type { Application } from "@/types/application"
import { PageTitle } from "@/components/ui/page-title"
import { EmptyState } from "@/components/ui/empty-state"
import { ActionLink } from "@/components/ui/action-button"
import { Chip } from "@/components/ui/chip"
import { StatusTrack } from "@/components/applications/status-track"
import { WithdrawButton } from "@/components/applications/withdraw-button"
import { applicationInfo } from "@/lib/format/status"
import { formatDate } from "@/lib/format/scholarship"

export default async function ApplicationsPage() {
  await requireUser()
  const { items } = (await listMyApplications()) as { items: Application[] }

  return (
    <>
      <PageTitle
        title="Pendaftaran"
        subtitle={items.length > 0 ? "Pantau tahap setiap beasiswa yang sudah kamu daftar." : undefined}
      />

      {items.length === 0 ? (
        <EmptyState
          title="Belum ada pendaftaran"
          description="Pilih beasiswa yang cocok, lalu daftar dari halaman detailnya. Perkembangannya akan muncul di sini."
          action={<ActionLink href="/scholarships">Cari beasiswa</ActionLink>}
        />
      ) : (
        <ul className="divide-y divide-[#DCE1EA] border-y border-[#DCE1EA]">
          {items.map((a) => {
            const info = applicationInfo(a.status)
            const s = a.scholarships
            return (
              <li key={a.id} className="py-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-[#5B6679]">{s?.provider}</p>
                    <h2 className="text-lg font-semibold leading-snug">
                      <Link href={`/scholarships/${a.scholarship_id}`} className="hover:text-[#2338D1]">
                        {s?.title ?? "Beasiswa"}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-[#5B6679]">
                      Didaftarkan {formatDate(a.submitted_at ?? a.created_at)}
                      {typeof a.match_score === "number" && `, kecocokan ${a.match_score}%`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Chip tone={info.tone}>{info.label}</Chip>
                    {info.withdrawable && <WithdrawButton id={a.id} title={s?.title ?? "beasiswa ini"} />}
                  </div>
                </div>

                <div className="mt-4 max-w-xl">
                  <StatusTrack status={a.status} />
                </div>

                {a.notes && (
                  <p className="mt-4 max-w-xl border-l-2 border-[#C5CCDA] pl-3 text-sm text-[#3B4658]">
                    <span className="font-medium">Catatan petugas:</span> {a.notes}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
