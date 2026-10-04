import { Chip } from "@/components/ui/chip"
import { daysLeft } from "@/lib/format/scholarship"

export function DeadlineChip({ deadline }: { deadline: string | null }) {
  const days = daysLeft(deadline)
  if (days === null) return <Chip>Tanpa batas waktu</Chip>
  if (days < 0) return <Chip tone="danger">Sudah berakhir</Chip>
  if (days === 0) return <Chip tone="danger">Berakhir hari ini</Chip>
  if (days <= 7) return <Chip tone="warning">Sisa {days} hari</Chip>
  return <Chip tone="info">Sisa {days} hari</Chip>
}
