import Link from "next/link";
import styles from "./landing.module.css";

export default function CTA() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaCard}>
        <h2>Siap Raih Peluang Beasiswamu?</h2>
        <p>
          Bergabunglah sekarang bersama ribuan mahasiswa di seluruh Indonesia.
          Daftar gratis dan temukan beasiswa yang sesuai dengan potensimu hari ini.
        </p>
        <Link href="/register" className={styles.ctaBtn}>
          Daftar Akun Sekarang — Gratis
        </Link>
      </div>
    </section>
  );
}
