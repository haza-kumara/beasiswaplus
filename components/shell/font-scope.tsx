import type { ReactNode } from "react"
import { bpFont } from "@/lib/fonts"

/** Menerapkan font tanpa perlu mengubah app/layout.tsx. */
export function FontScope({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`${bpFont.variable} ${className}`}
      style={{ fontFamily: "var(--font-bp), ui-sans-serif, system-ui, sans-serif" }}
    >
      {children}
    </div>
  )
}
