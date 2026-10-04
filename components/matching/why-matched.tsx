import Link from "next/link"
import type { ScholarshipMatch } from "@/types/matching"

export function WhyMatched({ match }: { match: ScholarshipMatch }) {
  return (
    <section aria-labelledby="why-matched" className="rounded-lg border border-[#C9D0F6] bg-[#E8EBFB] p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="why-matched" className="text-base font-semibold">
          Kenapa beasiswa ini cocok untukmu
        </h2>
        <span className="text-3xl font-semibold tabular-nums text-[#2338D1]">{match.matchScore}%</span>
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        {match.reasons.map((r) => (
          <li key={r}>
            <span aria-hidden className="mr-2 text-[#0F7A5A]">✓</span>
            {r}
          </li>
        ))}
        {match.missingDocuments.map((d) => (
          <li key={d} className="text-[#9A5200]">
            <span aria-hidden className="mr-2">!</span>
            {d} belum ada di berkasmu.{" "}
            <Link href="/documents" className="font-medium underline">
              Unggah sekarang
            </Link>
          </li>
        ))}
        {match.reasons.length === 0 && match.missingDocuments.length === 0 && (
          <li>Beasiswa ini terbuka untuk semua mahasiswa.</li>
        )}
      </ul>
    </section>
  )
}
