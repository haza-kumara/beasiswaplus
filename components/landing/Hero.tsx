import Link from "next/link";
import styles from "./landing.module.css";

export default function Hero() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
              </svg>
            </div>
            <span>BeasiswaPlus</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/login" className={styles.loginBtn}>Masuk</Link>
            <Link href="/register" className={styles.registerBtn}>Daftar</Link>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroDecor}>
          <div className={styles.heroCircle1} />
          <div className={styles.heroCircle2} />
          <div className={styles.heroCircle3} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
            </svg>
            Platform Beasiswa Mahasiswa Indonesia
          </span>
          <h1 className={styles.heroTitle}>
            Akses Beasiswa<br />
            <span className={styles.heroHighlight}>untuk Semua</span>
          </h1>
          <p className={styles.heroSub}>
            Platform beasiswa inklusif berbasis kebutuhan. Temukan beasiswa yang tepat,
            ajukan bantuan darurat, dan kelola dokumen aplikasi dengan mudah.
          </p>
          <div className={styles.heroCta}>
            <Link href="/register" className={styles.ctaPrimary}>Mulai Sekarang — Gratis</Link>
            <Link href="/dashboard" className={styles.ctaSecondary}>Jelajahi Beasiswa</Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>500+</span>
              <span className={styles.heroStatLabel}>Beasiswa Tersedia</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>10K+</span>
              <span className={styles.heroStatLabel}>Mahasiswa Terdaftar</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>95%</span>
              <span className={styles.heroStatLabel}>Akurasi Matching</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
