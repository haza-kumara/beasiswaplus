import Link from "next/link"
import { buttonClass } from "@/components/ui/action-button"

export function Pagination({
  page, pageSize, total, search,
}: { page: number; pageSize: number; total: number; search?: string }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const href = (p: number) => {
    const qs = new URLSearchParams()
    if (search) qs.set("search", search)
    if (p > 1) qs.set("page", String(p))
    const s = qs.toString()
    return s ? `/scholarships?${s}` : "/scholarships"
  }

  return (
    <nav aria-label="Halaman" className="mt-8 flex items-center justify-between">
      {page > 1 ? <Link href={href(page - 1)} className={buttonClass("secondary")}>Sebelumnya</Link> : <span />}
      <span className="text-sm text-[#5B6679]">Halaman {page} dari {totalPages}</span>
      {page < totalPages ? <Link href={href(page + 1)} className={buttonClass("secondary")}>Berikutnya</Link> : <span />}
    </nav>
  )
}
