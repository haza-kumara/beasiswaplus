import Link from "next/link"
import type { ReactNode } from "react"
import { FontScope } from "@/components/shell/font-scope"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <FontScope className="flex min-h-screen flex-col items-center justify-center bg-[#F4F5F7] px-4 py-10 text-[15px] leading-relaxed text-[#0F1A2E]">
      <Link href="/" className="mb-8 text-xl font-semibold tracking-tight">
        Beasiswa<span className="text-[#2338D1]">Plus</span>
      </Link>
      <div className="w-full max-w-md rounded-lg border border-[#DCE1EA] bg-white p-6 sm:p-8">{children}</div>
    </FontScope>
  )
}
