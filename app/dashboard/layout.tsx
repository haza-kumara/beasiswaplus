// app/dashboard/layout.tsx
import { ThemeSwitcher } from "@/components/theme-switcher"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0d161f] text-[#0F1A2E] dark:text-[#e6eef5] transition-colors duration-300">
      <header className="border-b border-[#DCE1EA] dark:border-[#243649] bg-white dark:bg-[#142130]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold tracking-tight text-[#0F1A2E] dark:text-white">
              Beasiswa<span className="text-[#2338D1] dark:text-teal-400">Plus</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className="text-[#0F1A2E] dark:text-white">Dashboard</Link>
              <Link href="/scholarships" className="text-[#5B6679] dark:text-gray-400 hover:text-black dark:hover:text-white">Beasiswa</Link>
              <Link href="/documents" className="text-[#5B6679] dark:text-gray-400 hover:text-black dark:hover:text-white">Berkas</Link>
              <Link href="/pendaftaran" className="text-[#5B6679] dark:text-gray-400 hover:text-black dark:hover:text-white">Pendaftaran</Link>
              <Link href="/profile" className="text-[#5B6679] dark:text-gray-400 hover:text-black dark:hover:text-white">Profile</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/emergency" className="text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-red-600 dark:bg-red-400 animate-pulse"></span>
              Darurat
            </Link>
            
            <ThemeSwitcher />

            <Link href="app/auth/login" className="text-[#5B6679] dark:text-gray-400 hover:text-black dark:hover:text-white">
              Keluar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}