import React from "react";
import styles from "./landing.module.css";

const benefits = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mint-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-9" />
        <path d="M12 13a5 5 0 0 0 5-5c0-4-5-6-5-6s-5 2-5 6a5 5 0 0 0 5 5z" />
      </svg>
    ),
    title: "Prioritas Mahasiswa 1st Gen",
    description: "Perhatian khusus bagi generasi pertama di keluarga yang menempuh pendidikan tinggi.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Fokus Wilayah 3T",
    description: "Koneksi beasiswa khusus bagi mahasiswa dari daerah tertinggal, terdepan, dan terluar.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Penyaluran Langsung & Transparan",
    description: "Dana darurat disalurkan langsung ke universitas resmi untuk menjaga akuntabilitas.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Verifikasi Cepat 24 Jam",
    description: "Validasi kebutuhan mendesak dilakukan secara sigap oleh tim terpercaya.",
  },
];

export default function Benefits() {
  return (
    <div className={styles.benefitsSection}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Komitmen Inklusivitas</h2>
        <p className={styles.sectionSub}>Membuka akses seluas-luasnya bagi mereka yang paling membutuhkan</p>
        <div className={styles.benefitGrid}>
          {benefits.map((b) => (
            <div key={b.title} className={styles.benefitCard}>
              <h3>
                <span style={{ display: "inline-flex", alignItems: "center" }}>{b.icon}</span>
                {b.title}
              </h3>
              <p>{b.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
