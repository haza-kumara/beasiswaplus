import Link from "next/link";
import styles from "./landing.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
          </svg>
          <span>BeasiswaPlus</span>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/dashboard">Beranda</Link>
          <Link href="/scholarships">Beasiswa</Link>
          <Link href="/emergency">Bantuan Darurat</Link>
          <Link href="/applications">AI Chat</Link>
          <Link href="/login">Masuk</Link>
        </div>
        <p className={styles.footerText}>
          &copy; 2026 BeasiswaPlus. Akses Beasiswa untuk Semua.
        </p>
      </div>
    </footer>
  );
}
