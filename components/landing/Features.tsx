import styles from "./landing.module.css";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    color: "blue",
    title: "AI Matching",
    description: "Algoritma cerdas mencocokkan profil akademik, latar belakang ekonomi, dan preferensimu dengan beasiswa yang paling pas.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    color: "rose",
    title: "Bantuan Darurat",
    description: "Akses dana darurat dengan validasi cepat 24 jam untuk mahasiswa yang menghadapi kendala biaya UKT atau musibah.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "mint",
    title: "Document Vault",
    description: "Simpan dokumen (KK, SKTM, transkrip) sekali saja secara terenkripsi, gunakan berulang kali di semua lamaran beasiswa.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "lavender",
    title: "AI Assistant",
    description: "Konsultasikan peluang beasiswa, rekomendasi persiapan berkas, dan tips lolos seleksi bersama asisten AI 24/7.",
  },
];

export default function Features() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Fitur Unggulan BeasiswaPlus</h2>
      <p className={styles.sectionSub}>Semua yang kamu butuhkan untuk meraih beasiswa impian</p>
      <div className={styles.featureGrid}>
        {features.map((f) => (
          <div key={f.title} className={styles.featureCard}>
            <div className={styles.featureIcon} data-color={f.color}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
