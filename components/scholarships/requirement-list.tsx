import type { ScholarshipRequirement } from "@/types/scholarship"
import { Chip } from "@/components/ui/chip"
import { describeRequirement } from "@/lib/format/scholarship"

export function RequirementList({ requirements }: { requirements: ScholarshipRequirement[] }) {
  if (requirements.length === 0) {
    return <p className="text-sm text-[#5B6679]">Beasiswa ini tidak mencantumkan syarat khusus.</p>
  }
  return (
    <ul className="divide-y divide-[#DCE1EA] border-y border-[#DCE1EA]">
      {requirements.map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
          <span>{describeRequirement(r)}</span>
          <Chip tone={r.is_required ? "info" : "neutral"}>{r.is_required ? "Wajib" : "Nilai tambah"}</Chip>
        </li>
      ))}
    </ul>
  )
}
