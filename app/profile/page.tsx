"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";
import PageHeader from "@/components/ui/PageHeader";
import BottomNav from "@/components/ui/BottomNav";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { addToast } = useToast();
  const [tab, setTab] = useState<"view" | "edit">("view");
  const [data, setData] = useState({
    name: "Dina Ayu Pratiwi",
    nim: "2106123456",
    major: "Teknik Informatika",
    semester: "5",
    university: "Universitas Indonesia",
    gpa: "3.45",
    income: "low",
    firstGen: true,
    orphan: false,
    remote: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Data profil berhasil diperbarui", "success");
    setTab("view");
  };

  return (
    <div className={styles.page}>
      <PageHeader title="Profil Saya" />

      {tab === "view" ? (
        <>
          <div className={styles.profileCard}>
            <div className={styles.profileBg}><div className={styles.profileBgCircle} /></div>
            <div className={styles.profileContent}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatar}><span className={styles.avatarText}>DA</span></div>
                <span className={styles.verifiedDot} />
              </div>
              <h2 className={styles.profileName}>{data.name}</h2>
              <p className={styles.profileSub}>{data.major} &middot; Semester {data.semester}</p>
              <p className={styles.profileUni}>{data.university}</p>
              <div className={styles.profileStats}>
                <div className={styles.profileStat}><span className={styles.profileStatNum}>{data.gpa}</span><span className={styles.profileStatLabel}>IPK</span></div>
                <div className={styles.profileStatDivider} />
                <div className={styles.profileStat}><span className={styles.profileStatNum}>95%</span><span className={styles.profileStatLabel}>Profil Lengkap</span></div>
                <div className={styles.profileStatDivider} />
                <div className={styles.profileStat}><span className={styles.profileStatNum}>3</span><span className={styles.profileStatLabel}>Dilamar</span></div>
              </div>
            </div>
          </div>

          <div className={styles.menuList}>
            <div className={styles.menuGroup}>
              <button className={styles.menuItem} onClick={() => setTab("edit")}>
                <div className={styles.menuIconWrap} data-color="blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className={styles.menuText}>
                  <span className={styles.menuLabel}>Edit Data Diri</span>
                  <span className={styles.menuSub}>NIM, jurusan, kondisi sosio-ekonomi</span>
                </div>
                <span style={{ color: "var(--text-tertiary)" }}>›</span>
              </button>
              <Link href="/documents" className={styles.menuItem}>
                <div className={styles.menuIconWrap} data-color="mint">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className={styles.menuText}>
                  <span className={styles.menuLabel}>Document Vault</span>
                  <span className={styles.menuSub}>Kelola KK, SKTM, transkrip nilai</span>
                </div>
                <span style={{ color: "var(--text-tertiary)" }}>›</span>
              </Link>
              <Link href="/applications" className={styles.menuItem}>
                <div className={styles.menuIconWrap} data-color="amber">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </div>
                <div className={styles.menuText}>
                  <span className={styles.menuLabel}>Riwayat Lamaran</span>
                  <span className={styles.menuSub}>2 aktif dalam review, 1 selesai</span>
                </div>
                <span style={{ color: "var(--text-tertiary)" }}>›</span>
              </Link>
            </div>
          </div>

          <div className={styles.logoutWrap}>
            <button className={styles.logoutBtn} onClick={() => addToast("Anda telah keluar dari akun", "info")}>
              Keluar dari Akun
            </button>
          </div>
        </>
      ) : (
        <form className={styles.formWrap} onSubmit={handleSave}>
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Informasi Akademik</h3>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nama Lengkap</label>
              <input className={styles.input} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>NIM</label>
                <input className={styles.input} value={data.nim} onChange={(e) => setData({ ...data, nim: e.target.value })} required />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>IPK Terakhir</label>
                <input className={styles.input} value={data.gpa} onChange={(e) => setData({ ...data, gpa: e.target.value })} required />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Program Studi</label>
                <input className={styles.input} value={data.major} onChange={(e) => setData({ ...data, major: e.target.value })} required />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Semester</label>
                <input className={styles.input} value={data.semester} onChange={(e) => setData({ ...data, semester: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Kondisi Sosio-Ekonomi</h3>
            <div className={styles.checkList}>
              <label className={styles.checkRow}>
                <input type="checkbox" checked={data.firstGen} onChange={(e) => setData({ ...data, firstGen: e.target.checked })} />
                <span>Mahasiswa First-Generation (1st Gen)</span>
              </label>
              <label className={styles.checkRow}>
                <input type="checkbox" checked={data.remote} onChange={(e) => setData({ ...data, remote: e.target.checked })} />
                <span>Berasal dari Daerah 3T (Tertinggal, Terdepan, Terluar)</span>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" className={styles.logoutBtn} onClick={() => setTab("view")}>Batal</button>
            <button type="submit" className={styles.saveBtn} style={{ marginTop: 0 }}>Simpan</button>
          </div>
        </form>
      )}

      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
      <BottomNav />
    </div>
  );
}
