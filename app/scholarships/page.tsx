import { requireUser } from "@/lib/auth/require-user"
import { getScholarships } from "@/lib/services/scholarships"
import { getMatchesForUser } from "@/lib/services/matching"
import { listMyApplications } from "@/lib/services/applications"
import type { Application } from "@/types/application"
import { PageTitle } from "@/components/ui/page-title"
import { EmptyState } from "@/components/ui/empty-state"
import { ActionLink } from "@/components/ui/action-button"
import { ScholarshipRow } from "@/components/scholarships/scholarship-row"
import { SearchBar } from "@/components/scholarships/search-bar"
import { Pagination } from "@/components/scholarships/pagination"

const PAGE_SIZE = 8

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  await requireUser()

  const sp = await searchParams
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1)
  // Karakter ini dipakai sintaks filter PostgREST (.or) dan bisa merusak query.
  const search = sp.search?.replace(/[,()%*\\]/g, " ").trim() || undefined

  const [listRes, matchRes, appsRes] = await Promise.allSettled([
    getScholarships({ page, pageSize: PAGE_SIZE, search }),
    getMatchesForUser(),
    listMyApplications(),
  ])
  if (listRes.status === "rejected") throw listRes.reason
  const { items, total } = listRes.value

  // Skor dan status pendaftaran hanyalah tambahan: kegagalannya tidak boleh merusak daftar.
  const scores = new Map(
    matchRes.status === "fulfilled" ? matchRes.value.map((m) => [m.scholarshipId, m.matchScore] as const) : [],
  )
  const apps: Application[] =
    appsRes.status === "fulfilled" ? ((appsRes.value as { items: Application[] }).items ?? []) : []
  const applied = new Map(apps.map((a) => [a.scholarship_id, a.status]))

  return (
    <>
      <PageTitle title="Beasiswa" subtitle={total > 0 ? `${total} beasiswa aktif tersedia.` : undefined} />
      <SearchBar defaultValue={search} />

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada beasiswa aktif"}
            description={search ? "Coba kata kunci yang lebih umum, misalnya nama penyelenggara." : "Beasiswa akan muncul di sini setelah ditambahkan."}
            action={search ? <ActionLink href="/scholarships" variant="secondary">Hapus pencarian</ActionLink> : undefined}
          />
        </div>
      ) : (
        <ul className="text-3xl font-bold text-gray-900 dark:text-white">
          {items.map((s) => (
            <ScholarshipRow key={s.id} scholarship={s} score={scores.get(s.id)} appliedStatus={applied.get(s.id)} />
          ))}
        </ul>
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} search={search} />
    </>
  )
}
