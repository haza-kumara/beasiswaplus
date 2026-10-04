import { createClient } from "@/lib/supabase/server"
import { ActionLink } from "@/components/ui/action-button"
import { FontScope } from "@/components/shell/font-scope"
import { DeadlineRail } from "@/components/dashboard/deadline-rail"
import { ThemeSwitcher } from "@/components/theme-switcher"
export const instant = false;

const features = [
  {
    title: "Cocok dengan kondisimu",
    text: "Isi profil sekali. Beasiswa diurutkan dari yang paling sesuai, dengan alasan yang bisa kamu baca.",
  },
  {
    title: "Tahu kapan harus bergerak",
    text: "Garis waktu menunjukkan beasiswa mana yang paling dekat batas waktunya.",
  },
  {
    title: "Berkas di satu tempat",
    text: "Simpan KTM, KK, dan SKTM. Kamu langsung tahu dokumen apa yang masih kurang.",
  },
]

function sampleDeadline(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString()
}

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const sample = [
    { id: "a", title: "Contoh beasiswa A", score: 94, deadline: sampleDeadline(4) },
    { id: "b", title: "Contoh beasiswa B", score: 87, deadline: sampleDeadline(11) },
    { id: "c", title: "Contoh beasiswa C", score: 76, deadline: sampleDeadline(19) },
    { id: "d", title: "Contoh beasiswa D", score: 81, deadline: sampleDeadline(26) },
  ]

  return (
    <FontScope className="min-h-screen bg-[#F4F5F7] dark:bg-[#0d161f] text-[15px] leading-relaxed text-[#0F1A2E] dark:text-[#e6eef5] transition-colors duration-300">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <span className="text-lg font-semibold tracking-tight text-[#0F1A2E] dark:text-white">
          Beasiswa<span className="text-[#2338D1] dark:text-teal-400">Plus</span>
        </span>
        <nav className="flex items-center gap-4">
          <ThemeSwitcher />
          
          <div className="flex items-center gap-1">
            {user ? (
              <ActionLink href="/dashboard">Buka dashboard</ActionLink>
            ) : (
              <>
                <ActionLink href="/auth/login" variant="ghost">Masuk</ActionLink>
                <ActionLink href="/auth/sign-up">Daftar</ActionLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="py-16 md:py-24">
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl text-[#0F1A2E] dark:text-white">
            Temukan beasiswa yang benar-benar bisa kamu dapatkan, dan kapan harus mendaftar.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#5B6679] dark:text-gray-400">
            BeasiswaPlus mencocokkan profil mahasiswa dengan syarat tiap beasiswa, lalu menjelaskan alasannya.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink href={user ? "/dashboard" : "/auth/sign-up"} className="px-6 py-3 border border-transparent dark:border-teal-800">
              {user ? "Lihat beasiswa untukku" : "Mulai cari beasiswa"}
            </ActionLink>
            <ActionLink href="/scholarships" variant="secondary" className="px-6 py-3 border border-[#DCE1EA] dark:border-[#243649] bg-white dark:bg-[#142130] text-[#0F1A2E] dark:text-gray-300">
              Lihat semua beasiswa
            </ActionLink>
          </div>

          <div className="mt-16 border-t border-[#DCE1EA] dark:border-[#243649] pt-6">
            <p className="text-sm text-[#5B6679] dark:text-gray-500">Contoh tampilan garis waktu di dashboard</p>
            <div className="mt-2">
              <DeadlineRail items={sample} interactive={false} />
            </div>
          </div>
        </section>

        <section className="border-t border-[#DCE1EA] dark:border-[#243649] py-14">
          <div className="grid gap-10 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}>
                <h2 className="text-lg font-semibold text-[#0F1A2E] dark:text-white">{f.title}</h2>
                <p className="mt-2 text-[#5B6679] dark:text-gray-400">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DCE1EA] dark:border-[#243649] py-8 text-center text-sm text-[#5B6679] dark:text-gray-500">
        BeasiswaPlus
      </footer>
    </FontScope>
  )
}