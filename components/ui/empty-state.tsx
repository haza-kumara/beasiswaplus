import type { ReactNode } from "react"

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-lg border border-dashed border-[#C5CCDA] px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-[#0F1A2E]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#5B6679]">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
