import Link from "next/link"
import { notFound } from "next/navigation"
import { requireUser } from "@/lib/auth/require-user"
import { getScholarshipById, ServiceError } from "@/lib/services/scholarships"
import { getMatchesForUser } from "@/lib/services/matching"
import { listMyApplications } from "@/lib/services/applications"
import type { ScholarshipMatch } from "@/types/matching"
import type { Application } from "@/types/application"
import { DeadlineChip } from "@/components/ui/deadline-chip"
import { RequirementList } from "@/components/scholarships/requirement-list"
import { ApplyPanel } from "@/components/scholarships/apply-panel"
import { WhyMatched } from "@/components/matching/why-matched"
import { formatDate } from "@/lib/format/scholarship"

export default async function ScholarshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser()
  const { id } = await params

  let scholarship
  try {
    scholarship = await getScholarshipById(id)
  } catch (e) {
    if (e instanceof ServiceError && e.status === 404) notFound()
    throw e
  }

  const [matchRes, appsRes] = await Promise.allSettled([getMatchesForUser(), listMyApplications()])

  let match: ScholarshipMatch | undefined
  let profileMissing = false
  if (matchRes.status === "fulfilled") {
    match = matchRes.value.find((m: ScholarshipMatch) => m.scholarshipId === id)
  } else if (matchRes.reason instanceof ServiceError && matchRes.reason.status === 404) {
    profileMissing = true
  }

  const apps: Application[] =
    appsRes.status === "fulfilled" ? ((appsRes.value as { items: Application[] }).items ?? []) : []
  const mine = apps.find((a) => a.scholarship_id === id)

  const expired = scholarship.deadline ? new Date(scholarship.deadline) < new Date() : false

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
      <article>
        <Link href="/scholarships" className="text-sm text-[#5B6679] hover:text-[#0F1A2E]">
          Kembali ke daftar beasiswa
        </Link>

        <header className="mt-5">
          <p className="text-[15px] text-[#5B6679]">{scholarship.provider}</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{scholarship.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#5B6679]">
            <DeadlineChip deadline={scholarship.deadline} />
            <span>Batas pendaftaran: {formatDate(scholarship.deadline)}</span>
          </div>
        </header>

        {match && <div className="mt-8"><WhyMatched match={match} /></div>}

        {scholarship.description && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">Tentang beasiswa</h2>
            <p className="mt-2 max-w-prose whitespace-pre-line text-[#3B4658]">{scholarship.description}</p>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-2 text-lg font-semibold">Persyaratan</h2>
          <RequirementList requirements={scholarship.scholarship_requirements} />
        </section>
      </article>

      <aside className="lg:pt-[52px]">
        <ApplyPanel
          scholarshipId={scholarship.id}
          applicationUrl={scholarship.application_url}
          expired={expired}
          profileMissing={profileMissing}
          eligible={Boolean(match)}
          missingDocuments={match?.missingDocuments ?? []}
          application={mine ? { id: mine.id, status: mine.status } : undefined}
        />
      </aside>
    </div>
  )
}
