import type { ReactNode } from "react"
import type { Tone } from "@/lib/format/status"

const tones: Record<Tone, string> = {
  neutral: "border-[#DCE1EA] bg-white text-[#5B6679]",
  info: "border-[#C9D0F6] bg-[#E8EBFB] text-[#2338D1]",
  success: "border-[#BFE3D1] bg-[#E3F4EC] text-[#0F7A5A]",
  warning: "border-[#F3D5A6] bg-[#FDF1E1] text-[#9A5200]",
  danger: "border-[#F4C4BF] bg-[#FCE9E7] text-[#B3261E]",
}

export function Chip({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
