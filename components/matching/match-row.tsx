import Link from "next/link"
import type { ScholarshipMatch } from "@/types/matching"
import { DeadlineChip } from "@/components/ui/deadline-chip"
import { Chip } from "@/components/ui/chip"
import { applicationInfo } from "@/lib/format/status"

export function MatchRow({ match, appliedStatus }: { match: ScholarshipMatch; appliedStatus?: string }) {
  return (
    <li className="relative grid gap-3 py-6 sm:grid-cols-[88px_1fr_auto] sm:items-start sm:gap-6">
      <div className="flex items-baseline gap-0.5 text-[#2338D1]" aria-label={`Kecocokan ${match.matchScore} persen`}>
        <span className="text-5xl font-semibold leading-none tracking-tight tabular-nums">{match.matchScore}</span>
        <span className="text-lg font-medium">%</span>
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-snug">
          <Link
            href={`/scholarships/${match.scholarshipId}`}
            className="after:absolute after:inset-0 hover:text-[#2338D1] focus-visible:outline-none focus-visible:underline"
          >
            {match.title}
          </Link>
        </h3>
        {(match.reasons.length > 0 || match.missingDocuments.length > 0) && (
          <ul className="mt-2 space-y-0.5 text-sm">
            {match.reasons.map((r) => (
              <li key={r} className="text-[#3B4658]">
                <span aria-hidden className="mr-2 text-[#0F7A5A]">✓</span>
                {r}
              </li>
            ))}
            {match.missingDocuments.map((d) => (
              <li key={d} className="text-[#9A5200]">
                <span aria-hidden className="mr-2">!</span>
                Lengkapi {d}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        <DeadlineChip deadline={match.deadline} />
        {appliedStatus && <Chip tone={applicationInfo(appliedStatus).tone}>{applicationInfo(appliedStatus).label}</Chip>}
      </div>
    </li>
  )
}
