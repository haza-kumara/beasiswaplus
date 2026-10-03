import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href="/" className="font-semibold">
              BeasiswaPlus
            </Link>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-2xl p-5 text-center">
          <h1 className="text-4xl font-bold">
            Temukan Beasiswa yang Tepat Untukmu
          </h1>
          <p className="text-muted-foreground text-lg">
            BeasiswaPlus mencocokkan profilmu dengan beasiswa yang paling sesuai
            secara otomatis — berdasarkan IPK, penghasilan, dan latar belakangmu.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/matching">Lihat Beasiswa Cocok</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/profile">Lengkapi Profil</Link>
            </Button>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
