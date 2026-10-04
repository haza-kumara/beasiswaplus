import { requireUser } from "@/lib/auth/require-user"
import { listDocuments } from "@/lib/services/documents"
import type { DocumentListResponse } from "@/types/document"
import { PageTitle } from "@/components/ui/page-title"
import { DocumentManager } from "@/components/documents/document-manager"
import { DOC_SHORT } from "@/lib/format/documents"

export default async function DocumentsPage() {
  await requireUser()
  const { items, readiness } = (await listDocuments()) as DocumentListResponse

  return (
    <div className="max-w-3xl">
      <PageTitle
        title="Berkas"
        subtitle="Simpan dokumen persyaratan di satu tempat. File bersifat pribadi dan hanya bisa dibuka olehmu."
      />

      <div className="mb-8 flex items-baseline gap-4 border-b border-[#DCE1EA] pb-6">
        <span className="text-5xl font-semibold tracking-tight tabular-nums text-[#2338D1]">{readiness.percent}%</span>
        <p className="text-sm text-[#5B6679]">
          {readiness.missing.length === 0
            ? "Berkas dasarmu sudah lengkap."
            : `Kesiapan berkas. Masih kurang: ${readiness.missing.map((m) => DOC_SHORT[m] ?? m).join(", ")}.`}
        </p>
      </div>

      <DocumentManager items={items} />
      <p className="mt-4 text-xs text-[#5B6679]">Format PDF, JPG, atau PNG. Ukuran maksimal 5 MB per file.</p>
    </div>
  )
}
