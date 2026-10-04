import type { ReactNode } from "react"

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1 max-w-lg text-[15px] text-[#5B6679]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
