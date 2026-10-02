"use client";

import React, { useState } from "react";
import { useNavigation } from "@/context/NavigationContext";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/PageHeader/PageHeader";
import styles from "./ScholarshipDetailPage.module.css";

const I = {
  dollar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  file: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  circle: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>,
  fileIcon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  bookmark: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  bookmarkFilled: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  send: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>,
};

export default function ScholarshipDetailPage() {
  const { pageData } = useNavigation();
  const { addToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);

  const s = (pageData.scholarship as {
    id: string; title: string; provider: string; match: number;
    deadline: string; amount: string; tags: string[]; color: string;
  }) ?? {
    id: "1", title: "Beasiswa Bank Indonesia 2026", provider: "Bank Indonesia",
    match: 95, deadline: "30 Nov 2026", amount: "Rp 12.000.000/tahun",
    tags: ["1st Gen", "Ekonomi Mikro"], color: "blue",
  };

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      addToast("Lamaran berhasil dikirim! Status: Dalam Review", "success");
    }, 1500);
  };

  const handleSave = () => {
    setSaved((p) => !p);
    addToast(saved ? "Dihapus dari simpanan" : "Beasiswa disimpan", saved ? "info" : "success");
  };

  const infoCards = [
    { icon: I.dollar, label: "Nilai", value: s.amount },
    { icon: I.calendar, label: "Deadline", value: s.deadline },
    { icon: I.file, label: "Dokumen", value: "4 berkas" },
    { icon: I.users, label: "Pelamar", value: "1.2k+" },
  ];

  const requirements = [
    { text: "IPK minimal 3.0", met: true },
    { text: "Mahasiswa aktif semester 3+", met: true },
    { text: "Pendapatan keluarga < Rp 3.000.000/bulan", met: true },
    { text: "Belum menerima beasiswa lain", met: false },
    { text: "Surat rekomendasi dosen", met: true },
  ];

  const documents = [
    { name: "Kartu Keluarga", status: "ready" },
    { name: "SKTM", status: "ready" },
    { name: "Transkrip Nilai", status: "ready" },
    { name: "Surat Rekomendasi", status: "missing" },
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
              <span className={styles.matchSub}>Prioritas mahasiswa 1st gen dengan pendapatan rendah</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        {infoCards.map((c) => (
          <div key={c.label} className={styles.infoCard}>
            <span className={styles.infoIcon}>{c.icon}</span>
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
              <span className={styles.reqIcon}>{req.met ? I.check : I.circle}</span>
              <span>{req.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Dokumen dari Vault</h3>
        <p className={styles.sectionSub}>Dokumen yang sudah tersimpan di vault akan otomatis terlampir.</p>
        <div className={styles.docList}>
          {documents.map((doc) => (
            <div key={doc.name} className={styles.docItem}>
              <div className={styles.docIcon}>{I.fileIcon}</div>
              <span className={styles.docName}>{doc.name}</span>
              <span className={`${styles.docStatus} ${doc.status === "ready" ? styles.docReady : styles.docMissing}`}>
                {doc.status === "ready" ? "Siap" : "Belum ada"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Kriteria Target</h3>
        <div className={styles.tagRow}>
          {s.tags.map((tag) => (<span key={tag} className={styles.tag}>{tag}</span>))}
          <span className={styles.tag}>Need-Based</span>
          <span className={styles.tag}>Reguler</span>
        </div>
      </section>

      <div className={styles.applyBar}>
        <button className={`${styles.saveBookmark} ${saved ? styles.savedActive : ""}`} onClick={handleSave} id="btn-save-scholarship" aria-label="Simpan beasiswa">
          {saved ? I.bookmarkFilled : I.bookmark}
        </button>
        <button className={styles.applyBtn} onClick={handleApply} disabled={applying} id="btn-apply-scholarship">
          {applying ? <span className={styles.spinner} /> : <>{I.send} Ajukan Sekarang</>}
        </button>
      </div>

      <div style={{ height: "calc(var(--bottom-nav-height) + 80px)" }} />
    </div>
  );
}
