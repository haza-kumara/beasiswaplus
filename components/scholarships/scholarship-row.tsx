import Link from "next/link"
import type { Scholarship } from "@/types/scholarship"
import { DeadlineChip } from "@/components/ui/deadline-chip"
import { Chip } from "@/components/ui/chip"
import { applicationInfo } from "@/lib/format/status"
import { describeRequirement } from "@/lib/format/scholarship"

export function ScholarshipRow({
  scholarship: s,
  score,
  appliedStatus,
}: {
  scholarship: Scholarship
  score?: number
  appliedStatus?: string
}) {
  const reqs = s.scholarship_requirements ?? []
  const shown = reqs.slice(0, 3)
  const rest = reqs.length - shown.length

  return (
    <li className="relative grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-8">
      <div className="min-w-0">
        <p className="text-sm text-[#5B6679]">{s.provider}</p>
        <h2 className="mt-0.5 text-lg font-semibold leading-snug">
          <Link
            href={`/scholarships/${s.id}`}
            className="after:absolute after:inset-0 hover:text-[#2338D1] focus-visible:outline-none focus-visible:underline"
          >
            {s.title}
          </Link>
        </h2>
        {s.description && <p className="mt-1.5 line-clamp-2 text-sm text-[#5B6679]">{s.description}</p>}
        {shown.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {shown.map((r) => (
              <li key={r.id}>
                <Chip>{describeRequirement(r)}</Chip>
              </li>
            ))}
            {rest > 0 && (
              <li>
                <Chip>+{rest} syarat lain</Chip>
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-start gap-2 sm:flex-col sm:items-end">
        <DeadlineChip deadline={s.deadline} />
        {typeof score === "number" && <Chip tone="info">Cocok {score}%</Chip>}
        {appliedStatus && (
          <Chip tone={applicationInfo(appliedStatus).tone}>{applicationInfo(appliedStatus).label}</Chip>
        )}
      </div>
    </li>
  )
}
