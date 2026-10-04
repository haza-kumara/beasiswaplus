import { redirect } from "next/navigation"
import { requireUser } from "@/lib/auth/require-user"
import { getMatchesForUser } from "@/lib/services/matching"
import { listDocuments } from "@/lib/services/documents"
import { listMyApplications } from "@/lib/services/applications"
import { listMyEmergencyRequests } from "@/lib/services/emergency"
import { ServiceError } from "@/lib/services/scholarships"
import type { ScholarshipMatch } from "@/types/matching"
import type { Application } from "@/types/application"
import type { DocumentListResponse } from "@/types/document"
import type { EmergencyRequest } from "@/types/emergency"
import { PageTitle } from "@/components/ui/page-title"
import { EmptyState } from "@/components/ui/empty-state"
import { ActionLink } from "@/components/ui/action-button"
import { DeadlineRail } from "@/components/dashboard/deadline-rail"
import { ReadinessStrip } from "@/components/dashboard/readiness-strip"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { EmergencyNote } from "@/components/dashboard/emergency-note"
import { MatchRow } from "@/components/matching/match-row"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default async function DashboardPage() {
  await requireUser()

  const [matchesRes, docsRes, appsRes, emergencyRes] = await Promise.allSettled([
    getMatchesForUser(),
    listDocuments(),
    listMyApplications(),
    listMyEmergencyRequests(),
  ])

  let matches: ScholarshipMatch[] = []
  let profileMissing = false
  if (matchesRes.status === "fulfilled") {
    matches = matchesRes.value
  } else {
    const e = matchesRes.reason
    if (e instanceof ServiceError && e.status === 401) redirect("/auth/login")
    if (e instanceof ServiceError && e.status === 404) profileMissing = true
    else throw e
  }

  // Panel samping tidak boleh menjatuhkan seluruh dashboard jika salah satu gagal.
  const docs = docsRes.status === "fulfilled" ? (docsRes.value as DocumentListResponse) : null
  const apps: Application[] =
    appsRes.status === "fulfilled" ? ((appsRes.value as { items: Application[] }).items ?? []) : []
  const emergencies: EmergencyRequest[] =
    emergencyRes.status === "fulfilled" ? ((emergencyRes.value as { items: EmergencyRequest[] }).items ?? []) : []

  const appliedBy = new Map(apps.map((a) => [a.scholarship_id, a.status]))
  const railItems = matches.map((m) => ({ id: m.scholarshipId, title: m.title, score: m.matchScore, deadline: m.deadline }))

  return (
    <div className="text-3xl font-bold text-gray-900 dark:text-white">
      <div>
        <PageTitle
          title="Beasiswa untukmu"
          subtitle={
            matches.length > 0
              ? `${matches.length} beasiswa cocok dengan profilmu. Yang paling cocok ada di atas.`
              : undefined
          }
        />

        {profileMissing ? (
          <EmptyState
            title="Lengkapi profilmu dulu"
            description="Kecocokan dihitung dari IPK, semester, pendapatan keluarga, dan statusmu."
            action={<ActionLink href="/profile">Isi profil</ActionLink>}
          />
        ) : matches.length === 0 ? (
          <EmptyState
            title="Belum ada beasiswa yang cocok"
            description="Profilmu belum memenuhi syarat wajib beasiswa yang tersedia. Periksa kembali datamu atau lihat semua beasiswa."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <ActionLink href="/profile" variant="secondary">Periksa profil</ActionLink>
                <ActionLink href="/scholarships">Lihat semua beasiswa</ActionLink>
              </div>
            }
          />
        ) : (
          <>
            <section aria-labelledby="rail-title" className="mb-10">
              <h2 id="rail-title" className="text-base font-semibold">Garis waktu pendaftaran</h2>
              <p className="mb-2 mt-1 text-sm text-[#5B6679]">
                Lingkaran besar berarti lebih cocok. Warna oranye berarti sisa waktu 7 hari atau kurang.
              </p>
              <DeadlineRail items={railItems} />
            </section>

            <ul className="divide-y divide-[#DCE1EA] border-y border-[#DCE1EA]">
              {matches.map((m) => (
                <MatchRow key={m.scholarshipId} match={m} appliedStatus={appliedBy.get(m.scholarshipId)} />
              ))}
            </ul>
          </>
        )}
      </div>

      <aside className="space-y-10 lg:pt-[88px]">
        <ReadinessStrip percent={docs?.readiness.percent ?? 0} owned={(docs?.items ?? []).map((d) => d.document_type)} />
        <RecentApplications items={apps} />
        <EmergencyNote latestStatus={emergencies[0]?.status} />
      </aside>
    </div>
  )
}
