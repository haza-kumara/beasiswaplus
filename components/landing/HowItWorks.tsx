import styles from "./landing.module.css";

const steps = [
  {
    num: "1",
    title: "Lengkapi Profil",
    description: "Isi data akademik, program studi, dan kondisi sosio-ekonomi dalam waktu kurang dari 3 menit.",
  },
  {
    num: "2",
    title: "Dapatkan Rekomendasi",
    description: "Sistem mencocokkan profilmu dan menyajikan daftar beasiswa berperingkat kecocokan tertinggi.",
  },
  {
    num: "3",
    title: "Kelola Dokumen",
    description: "Unggah dokumen pendukung ke Document Vault agar otomatis terlampir di setiap pendaftaran.",
  },
  {
    num: "4",
    title: "Ajukan & Pantau",
    description: "Kirim permohonan dengan satu ketukan dan pantau status seleksi secara transparan.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Cara Kerja BeasiswaPlus</h2>
      <p className={styles.sectionSub}>Empat langkah mudah menuju beasiswa pendidikanmu</p>
      <div className={styles.stepsGrid}>
        {steps.map((s) => (
          <div key={s.num} className={styles.stepCard}>
            <div className={styles.stepNumber}>{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
