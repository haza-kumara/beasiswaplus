import Link from "next/link"
import { buttonClass } from "@/components/ui/action-button"

export default function SignUpSuccessPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Cek emailmu</h1>
      <p className="text-sm text-[#5B6679]">
        Kami mengirim link konfirmasi ke emailmu. Klik link itu untuk mengaktifkan akun, lalu isi profilmu.
      </p>
      <p className="text-xs text-[#5B6679]">
        Belum ada email? Cek folder spam, atau kembali ke halaman masuk lalu minta kirim ulang.
      </p>
      <Link href="/auth/login" className={buttonClass("secondary", "w-full")}>Ke halaman masuk</Link>
    </div>
  )
}
