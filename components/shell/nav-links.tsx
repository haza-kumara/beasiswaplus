"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scholarships", label: "Beasiswa" },
  { href: "/documents", label: "Berkas" },
  { href: "/applications", label: "Pendaftaran" },
  { href: "/profile", label: "Profil" },
]

export function NavLinks({ variant }: { variant: "top" | "bottom" }) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigasi utama"
      className={variant === "top" ? "flex items-center gap-6" : "grid grid-cols-5"}
    >
      {items.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        const cls =
          variant === "top"
            ? `border-b-2 py-4 text-sm font-medium transition-colors ${
                active
                  ? "border-[#2338D1] text-[#0F1A2E]"
                  : "border-transparent text-[#5B6679] hover:text-[#0F1A2E]"
              }`
            : `border-t-2 py-3 text-center text-[11px] font-medium ${
                active ? "border-[#2338D1] text-[#2338D1]" : "border-transparent text-[#5B6679]"
              }`
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cls}>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
