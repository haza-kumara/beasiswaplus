import Link from "next/link"
import type { ReactNode } from "react"
import { FontScope } from "@/components/shell/font-scope"
import { NavLinks } from "@/components/shell/nav-links"
import { SignOutButton } from "@/components/shell/sign-out-button"

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <FontScope className="min-h-screen bg-[#F4F5F7] pb-16 text-[15px] leading-relaxed text-[#0F1A2E] md:pb-0">
      <header className="sticky top-0 z-30 border-b border-[#DCE1EA] bg-[#F4F5F7]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            Beasiswa<span className="text-[#2338D1]">Plus</span>
          </Link>
          <div className="hidden md:block">
            <NavLinks variant="top" />
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#B3261E] hover:bg-[#FCE9E7]"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#B3261E]" />
              Darurat
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DCE1EA] bg-[#F4F5F7]/95 backdrop-blur md:hidden">
        <NavLinks variant="bottom" />
      </div>
    </FontScope>
  )
}
