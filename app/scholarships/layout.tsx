import type { ReactNode } from "react"
import { AppFrame } from "@/components/shell/app-frame"
import { DashboardHeader } from "@/components/dashboard/header"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0d161f] text-[#0F1A2E] dark:text-[#e6eef5] transition-colors duration-300">
      <DashboardHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}

<div className="bg-white dark:bg-[#142130] border border-[#DCE1EA] dark:border-[#243649]">
  {/* Isi konten beasiswa */}
</div>
