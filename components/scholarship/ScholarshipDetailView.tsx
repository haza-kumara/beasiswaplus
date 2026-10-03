"use client";

import React, { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import PageHeader from "@/components/ui/PageHeader";
import { scholarships } from "./scholarshipsData";
import styles from "./ScholarshipDetail.module.css";

const Icons = {
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  circle: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  file: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  bookmarkFilled: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  bookmark: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

export default function ScholarshipDetailView({ id }: { id?: string }) {
  const { addToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);

  const s = scholarships.find((item) => item.id === id) ?? scholarships[0];

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      addToast("Lamaran berhasil dikirim! Status: Dalam Review", "success");
    }, 1200);
  };

  const handleSave = () => {
    setSaved((p) => !p);
    addToast(saved ? "Dihapus dari simpanan" : "Beasiswa disimpan", saved ? "info" : "success");
  };

  const infoCards = [
    { label: "Nilai Bantuan", value: s.amount },
    { label: "Batas Akhir", value: s.deadline },
    { label: "Dokumen", value: "4 berkas" },
    { label: "Peminat", value: "1.2k+ pelamar" },
  ];

  const requirements = s.requirements ?? [
    { text: "IPK minimal 3.0", met: true },
    { text: "Mahasiswa aktif semester 3+", met: true },
    { text: "Pendapatan keluarga < Rp 3.000.000/bulan", met: true },
    { text: "Surat rekomendasi dosen wali", met: true },
  ];

  const documents = s.documents ?? [
    { name: "Kartu Keluarga", status: "ready" as const },
    { name: "SKTM dari Kelurahan", status: "ready" as const },
    { name: "Transkrip Nilai Akademik", status: "ready" as const },
    { name: "Surat Rekomendasi Dosen", status: "missing" as const },
  ];

  return (
    <div className={styles.page}>
      <PageHeader title="Detail Beasiswa" showBack />

      <div className={styles.hero} data-color={s.color}>
        <div className={styles.heroDecor} />
        <div className={styles.heroContent}>
          <div className={styles.providerBadge}>
            <span className={styles.providerAvatar}>{s.provider.charAt(0)}</span>
            <span>{s.provider}</span>
          </div>
          <h2 className={styles.title}>{s.title}</h2>
          <div className={styles.matchRow}>
            <div className={styles.matchCircle}>
              <svg viewBox="0 0 36 36" className={styles.matchRing}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${s.match}, 100`} strokeLinecap="round" />
              </svg>
              <span className={styles.matchVal}>{s.match}%</span>
            </div>
            <div className={styles.matchInfo}>
              <span className={styles.matchTitle}>Tingkat Kecocokan</span>
              <span className={styles.matchSub}>Prioritas mahasiswa need-based & 1st gen</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        {infoCards.map((c) => (
          <div key={c.label} className={styles.infoCard}>
            <span className={styles.infoLabel}>{c.label}</span>
            <span className={styles.infoValue}>{c.value}</span>
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Persyaratan</h3>
        <div className={styles.reqList}>
          {requirements.map((req) => (
            <div key={req.text} className={`${styles.reqItem} ${req.met ? styles.reqMet : styles.reqUnmet}`}>
              <span className={styles.reqIcon}>{req.met ? Icons.check : Icons.circle}</span>
              <span>{req.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Dokumen dari Vault</h3>
        <p className={styles.sectionSub}>Dokumen yang sudah tersimpan di vault otomatis terlampir saat pengajuan.</p>
        <div className={styles.docList}>
          {documents.map((doc) => (
            <div key={doc.name} className={styles.docItem}>
              <div className={styles.docIcon}>{Icons.file}</div>
              <span className={styles.docName}>{doc.name}</span>
              <span className={`${styles.docStatus} ${doc.status === "ready" ? styles.docReady : styles.docMissing}`}>
                {doc.status === "ready" ? "Siap" : "Belum Ada"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Kriteria Target</h3>
        <div className={styles.tagRow}>
          {s.tags.map((tag) => (<span key={tag} className={styles.tag}>{tag}</span>))}
          <span className={styles.tag}>{s.category}</span>
        </div>
      </section>

      <div className={styles.applyBar}>
        <button
          className={`${styles.saveBookmark} ${saved ? styles.savedActive : ""}`}
          onClick={handleSave}
          aria-label="Simpan beasiswa"
        >
          {saved ? Icons.bookmarkFilled : Icons.bookmark}
        </button>
        <button className={styles.applyBtn} onClick={handleApply} disabled={applying}>
          {applying ? "Mengirimkan..." : "Ajukan Sekarang"}
        </button>
      </div>

      <div style={{ height: "90px" }} />
    </div>
  );
}
