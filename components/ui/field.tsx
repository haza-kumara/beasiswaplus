import type { ReactNode } from "react"

export const inputClass =
  "w-full rounded-md border border-[#C5CCDA] bg-white px-3 py-2.5 text-sm text-[#0F1A2E] placeholder:text-[#8A94A6] focus:border-[#2338D1] focus:outline-none focus:ring-1 focus:ring-[#2338D1]"

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#0F1A2E]">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[#5B6679]">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-[#B3261E]">
          {error}
        </p>
      )}
    </div>
  )
}
