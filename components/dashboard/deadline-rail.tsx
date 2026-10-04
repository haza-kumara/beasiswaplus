import Link from "next/link"
import { daysLeft } from "@/lib/format/scholarship"
import { ThemeSwitcher } from "@/components/theme-switcher"

export type RailItem = { id: string; title: string; score: number; deadline: string | null }

const LANE = 54

/**
 * Garis waktu: posisi horizontal = sisa hari ke deadline,
 * ukuran lingkaran = skor kecocokan, oranye = sisa 7 hari atau kurang.
 */
export function DeadlineRail({ items, interactive = true }: { items: RailItem[]; interactive?: boolean }) {
  const dated = items
    .map((i) => ({ ...i, days: daysLeft(i.deadline) }))
    .filter((i): i is RailItem & { days: number } => i.days !== null && i.days >= 0)
    .sort((a, b) => a.days - b.days)

  if (dated.length === 0) return null

  const span = Math.min(56, Math.max(14, Math.ceil(dated[dated.length - 1].days / 7) * 7))
  const ticks = Array.from({ length: span / 7 + 1 }, (_, i) => i * 7)

  // Tempatkan penanda ke lajur pertama yang cukup longgar agar tidak bertumpuk.
  const lastPct: number[] = []
  const placed = dated.map((i) => {
    const pct = (Math.min(i.days, span) / span) * 100
    let lane = lastPct.findIndex((p) => pct - p >= 9)
    if (lane === -1) lane = lastPct.length < 4 ? lastPct.length : lastPct.indexOf(Math.min(...lastPct))
    lastPct[lane] = pct
    return { ...i, pct, lane }
  })
  const lanes = Math.max(...placed.map((p) => p.lane)) + 1
  const axisTop = lanes * LANE + 4

  return (
    <div className="overflow-x-auto">
      <div className="relative mx-8 min-w-[560px]" style={{ height: axisTop + 32 }}>
        {placed.map((p) => {
          const size = 30 + Math.round((Math.min(p.score, 100) / 100) * 18)
          const urgent = p.days <= 7
          const label = `${p.title}, kecocokan ${p.score} persen, sisa ${p.days} hari`
          const cls = `absolute flex -translate-x-1/2 items-center justify-center rounded-full text-sm font-semibold tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1A2E] focus-visible:ring-offset-2 ${
            urgent ? "bg-[#B45309]" : "bg-[#2338D1]"
          }`
          const style = { left: `${p.pct}%`, top: p.lane * LANE + (48 - size) / 2, width: size, height: size }
          return interactive ? (
            <Link key={p.id} href={`/scholarships/${p.id}`} aria-label={label} title={label} className={cls} style={style}>
              {p.score}
            </Link>
          ) : (
            <span key={p.id} title={label} className={cls} style={style}>
              {p.score}
            </span>
          )
        })}

        <div className="absolute inset-x-0 border-t border-[#C5CCDA]" style={{ top: axisTop }} />
        {ticks.map((t) => (
          <span key={t}>
            <span
              aria-hidden
              className="absolute h-2 border-l border-[#C5CCDA]"
              style={{ left: `${(t / span) * 100}%`, top: axisTop }}
            />
            <span
              className="absolute -translate-x-1/2 text-xs text-[#5B6679]"
              style={{ left: `${(t / span) * 100}%`, top: axisTop + 12 }}
            >
              {t === 0 ? "Hari ini" : `${t} hari`}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
