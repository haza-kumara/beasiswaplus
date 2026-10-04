// components/dashboard/header.tsx
'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function DashboardHeader() {
  const pathname = usePathname()

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Beasiswa", href: "/scholarships" },
    { name: "Berkas", href: "/documents" },
    { name: "Pendaftaran", href: "/applications" },
    { name: "Profile", href: "/profile" },
  ]

  return (
    <header className="border-b border-[#DCE1EA] dark:border-[#243649] bg-white dark:bg-[#142130]">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-[#0F1A2E] dark:text-white">
            Beasiswa<span className="text-[#2338D1] dark:text-teal-400">Plus</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              // Cek apakah halaman saat ini sama dengan link href
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-[#0F1A2E] dark:text-white font-bold" // Putih/Tebal saat AKTIF
                      : "text-[#5B6679] dark:text-gray-400 hover:text-black dark:hover:text-white" // Kelabu saat TIDAK AKTIF
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/emergency" className="text-red-600 dark:text-red-400 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 dark:bg-red-400 animate-pulse"></span>
            Darurat
          </Link>
          
          <ThemeSwitcher />

          <Link href="/auth/login" className="text-[#5B6679] dark:text-gray-400 hover:text-black dark:hover:text-white">
            Keluar
          </Link>
        </div>
      </div>
    </header>
  )
}