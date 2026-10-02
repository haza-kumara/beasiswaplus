"use client";

import React, { useState } from "react";
import { useNavigation } from "@/context/NavigationContext";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/PageHeader/PageHeader";
import styles from "./EmergencyPage.module.css";

interface EmergencyCase {
  id: string;
  title: string;
  student: string;
  faculty: string;
  urgency: "Kritis" | "Darurat";
  raised: number;
  target: number;
  daysLeft: number;
  verified: boolean;
}

const initialCases: EmergencyCase[] = [
  { id: "e1", title: "Biaya Semester Mendesak", student: "Mahasiswa A", faculty: "Fakultas Teknik", urgency: "Kritis", raised: 3200000, target: 5000000, daysLeft: 3, verified: true },
  { id: "e2", title: "Kehilangan Orang Tua", student: "Mahasiswa B", faculty: "Fakultas Ekonomi", urgency: "Darurat", raised: 7500000, target: 10000000, daysLeft: 7, verified: true },
  { id: "e3", title: "Bencana Alam — Rumah Rusak", student: "Mahasiswa C", faculty: "FMIPA", urgency: "Darurat", raised: 1800000, target: 8000000, daysLeft: 14, verified: true },
];

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

/* ─── Icons ─── */
const I = {
  alert: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  user: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  heart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  info: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
  shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  upload: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="12" cy="12" r="10" fill="var(--blue-500)" /><polyline points="9 12 11.5 14.5 16 10" fill="none" stroke="white" strokeWidth="2.5" /></svg>,
  zap: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  chevron: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>,
};

export default function EmergencyPage() {
  const { navigate, currentPage } = useNavigation();
  const { addToast } = useToast();
  const [showInfo, setShowInfo] = useState(false);
  const [cases, setCases] = useState(initialCases);
  const [donatingId, setDonatingId] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState("");

  const handleDonate = (caseId: string) => {
    if (donatingId === caseId && donationAmount) {
      const amount = parseInt(donationAmount.replace(/\D/g, ""));
      if (amount > 0) {
        setCases((prev) =>
          prev.map((c) => c.id === caseId ? { ...c, raised: Math.min(c.raised + amount, c.target) } : c)
        );
        addToast(`Donasi ${formatRupiah(amount)} berhasil dikirim. Terima kasih!`, "success");
        setDonatingId(null);
        setDonationAmount("");
      } else {
        addToast("Masukkan jumlah yang valid", "error");
      }
    } else {
      setDonatingId(caseId);
    }
  };

  if (currentPage === "emergency-form") {
    return <EmergencyForm />;
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Bantuan Darurat"
        subtitle="Emergency Grant"
        rightAction={
          <button className={styles.infoBtn} onClick={() => setShowInfo(!showInfo)} aria-label="Info">
            {I.info}
          </button>
        }
      />

      {showInfo && (
        <div className={styles.infoBanner}>
          <div className={styles.infoBannerIcon}>{I.shield}</div>
          <div>
            <p className={styles.infoBannerTitle}>Keamanan & Transparansi</p>
            <p className={styles.infoBannerText}>
              Dana disalurkan langsung ke rekening UKT universitas, bukan ke rekening pribadi.
              Identitas mahasiswa penerima bersifat anonim untuk menjaga martabat.
            </p>
          </div>
          <button className={styles.infoBannerClose} onClick={() => setShowInfo(false)} aria-label="Tutup">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <section className={styles.actionSection}>
        <button className={styles.actionCard} onClick={() => navigate("emergency-form")} id="btn-emergency-apply">
          <div className={styles.actionIconWrap} data-variant="rose">{I.alert}</div>
          <div className={styles.actionText}>
            <span className={styles.actionTitle}>Ajukan Bantuan Darurat</span>
            <span className={styles.actionSub}>Isi formulir cepat untuk validasi 24 jam</span>
          </div>
          {I.chevron}
        </button>
        <button className={styles.actionCard} onClick={() => navigate("profile-data")} id="btn-emergency-data">
          <div className={styles.actionIconWrap} data-variant="blue">{I.user}</div>
          <div className={styles.actionText}>
            <span className={styles.actionTitle}>Isi Data Diri</span>
            <span className={styles.actionSub}>Lengkapi profil untuk verifikasi lebih cepat</span>
          </div>
          {I.chevron}
        </button>
      </section>

      {/* Cases */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Kasus Aktif</h3>
          <span className={styles.badge}>{cases.length} aktif</span>
        </div>
        <div className={`${styles.caseList} stagger-children`}>
          {cases.map((c) => {
            const progress = Math.round((c.raised / c.target) * 100);
            return (
              <div key={c.id} className={styles.caseCard}>
                <div className={styles.caseTop}>
                  <div className={styles.caseMeta}>
                    <span className={`${styles.urgencyBadge} ${c.urgency === "Kritis" ? styles.urgencyCritical : styles.urgencyUrgent}`}>
                      {c.urgency}
                    </span>
                    {c.verified && (<span className={styles.verifiedBadge}>{I.check} Terverifikasi</span>)}
                  </div>
                  <span className={styles.daysLeft}>{c.daysLeft} hari lagi</span>
                </div>
                <h4 className={styles.caseTitle}>{c.title}</h4>
                <p className={styles.caseInfo}>{c.student} &middot; {c.faculty}</p>
                <div className={styles.progressWrap}>
                  <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>
                  <div className={styles.progressMeta}>
                    <span className={styles.progressRaised}>{formatRupiah(c.raised)}</span>
                    <span className={styles.progressTarget}>dari {formatRupiah(c.target)}</span>
                  </div>
                </div>

                {donatingId === c.id ? (
                  <div className={styles.donateInputRow}>
                    <div className={styles.donateInputWrap}>
                      <span className={styles.donatePrefix}>Rp</span>
                      <input
                        type="text"
                        className={styles.donateInput}
                        placeholder="50.000"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <button className={styles.donateSendBtn} onClick={() => handleDonate(c.id)}>Kirim</button>
                    <button className={styles.donateCancelBtn} onClick={() => { setDonatingId(null); setDonationAmount(""); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                ) : (
                  <button className={styles.donateBtn} onClick={() => handleDonate(c.id)} id={`btn-donate-${c.id}`}>
                    {I.heart} Donasi
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
    </div>
  );
}

/* ─── Emergency Form ─── */
function EmergencyForm() {
  const { addToast } = useToast();
  const { goBack } = useNavigation();
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    description: "",
    anonymous: true,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      addToast(`${newFiles.length} file berhasil ditambahkan`, "success");
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) { addToast("Pilih jenis kedaruratan", "error"); return; }
    if (!formData.amount) { addToast("Masukkan jumlah bantuan", "error"); return; }
    if (!formData.description) { addToast("Ceritakan situasi Anda", "error"); return; }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast("Permohonan berhasil dikirim! Tim akan memvalidasi dalam 24 jam.", "success");
      goBack();
    }, 1500);
  };

  const isValid = formData.type && formData.amount && formData.description;

  return (
    <div className={styles.page}>
      <PageHeader title="Formulir Darurat" showBack />
      <div className={styles.formWrap}>
        <div className={styles.formBanner}>
          <span className={styles.formBannerIcon}>{I.zap}</span>
          <div>
            <p className={styles.formBannerTitle}>Validasi Cepat 24 Jam</p>
            <p className={styles.formBannerText}>Formulir ini akan divalidasi oleh admin kampus atau BEM dalam 24 jam.</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Jenis Kedaruratan <span className={styles.required}>*</span></label>
            <select className={styles.select} value={formData.type} onChange={(e) => updateField("type", e.target.value)}>
              <option value="">Pilih jenis...</option>
              <option value="ukt">UKT/SPP belum terbayar</option>
              <option value="breadwinner">Kehilangan pencari nafkah</option>
              <option value="disaster">Bencana alam</option>
              <option value="medical">Kebutuhan medis mendesak</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Jumlah Bantuan Dibutuhkan <span className={styles.required}>*</span></label>
            <div className={styles.inputWrap}>
              <span className={styles.inputPrefix}>Rp</span>
              <input type="text" placeholder="0" className={styles.input} value={formData.amount} onChange={(e) => updateField("amount", e.target.value)} />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Deskripsi Situasi <span className={styles.required}>*</span></label>
            <textarea
              className={styles.textarea}
              placeholder="Ceritakan situasi Anda secara singkat..."
              rows={4}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
            <span className={styles.charCount}>{formData.description.length}/500</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Dokumen Pendukung</label>
            <label className={styles.uploadArea} htmlFor="file-upload">
              {I.upload}
              <p className={styles.uploadText}>Tap untuk unggah file</p>
              <p className={styles.uploadHint}>PDF, JPG, PNG — Maks 5MB</p>
              <input type="file" id="file-upload" className={styles.fileInput} multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
            </label>
            {files.length > 0 && (
              <div className={styles.fileList}>
                {files.map((f, i) => (
                  <div key={i} className={styles.fileItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    <span className={styles.fileName}>{f.name}</span>
                    <button type="button" className={styles.fileRemove} onClick={() => removeFile(i)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.checkRow}>
              <input type="checkbox" className={styles.checkbox} checked={formData.anonymous} onChange={(e) => updateField("anonymous", e.target.checked)} />
              <span className={styles.checkText}>
                Saya bersedia identitas saya dirahasiakan dan dana disalurkan langsung ke rekening universitas.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!isValid || submitting}
            id="btn-submit-emergency"
          >
            {submitting ? (
              <span className={styles.spinner} />
            ) : (
              "Kirim Permohonan"
            )}
          </button>
        </form>
      </div>
      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
    </div>
  );
}
