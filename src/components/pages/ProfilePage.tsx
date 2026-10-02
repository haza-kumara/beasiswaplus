"use client";

import React, { useState } from "react";
import { useNavigation } from "@/context/NavigationContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/PageHeader/PageHeader";
import styles from "./ProfilePage.module.css";

/* ─── Icons ─── */
const I = {
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  folder: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
  clock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  help: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  info: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  shield: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--mint-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  chevron: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
};

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  route: "profile-data" | "profile-settings" | "profile-security";
  color: string;
}

const menuSections: { section: string; items: MenuItem[] }[] = [
  {
    section: "Akun",
    items: [
      { id: "data", icon: I.user, label: "Data Diri", sub: "Nama, NIM, jurusan, kontak", route: "profile-data", color: "blue" },
      { id: "security", icon: I.lock, label: "Keamanan Akun", sub: "Password, 2FA, perangkat", route: "profile-security", color: "lavender" },
      { id: "settings", icon: I.settings, label: "Pengaturan", sub: "Notifikasi, bahasa, tema", route: "profile-settings", color: "gray" },
    ],
  },
  {
    section: "Dokumen",
    items: [
      { id: "vault", icon: I.folder, label: "Document Vault", sub: "3 dari 5 dokumen lengkap", route: "profile-data", color: "mint" },
      { id: "history", icon: I.clock, label: "Riwayat Lamaran", sub: "2 aktif, 1 selesai", route: "profile-data", color: "amber" },
    ],
  },
  {
    section: "Lainnya",
    items: [
      { id: "help", icon: I.help, label: "Pusat Bantuan", sub: "FAQ & panduan penggunaan", route: "profile-data", color: "blue" },
      { id: "about", icon: I.info, label: "Tentang Aplikasi", sub: "v1.0.0 — BeasiswaPlus", route: "profile-data", color: "gray" },
    ],
  },
];

export default function ProfilePage() {
  const { navigate, currentPage } = useNavigation();
  const { addToast } = useToast();

  if (currentPage === "profile-data") return <ProfileData />;
  if (currentPage === "profile-settings") return <ProfileSettings />;
  if (currentPage === "profile-security") return <ProfileSecurity />;

  return (
    <div className={styles.page}>
      <div className={styles.profileCard}>
        <div className={styles.profileBg}><div className={styles.profileBgCircle} /></div>
        <div className={styles.profileContent}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}><span className={styles.avatarText}>DA</span></div>
            <span className={styles.verifiedDot} />
          </div>
          <h2 className={styles.profileName}>Dina Ayu</h2>
          <p className={styles.profileSub}>Teknik Informatika &middot; Semester 5</p>
          <p className={styles.profileUni}>Universitas Indonesia</p>
          <div className={styles.profileStats}>
            <div className={styles.profileStat}><span className={styles.profileStatNum}>3.45</span><span className={styles.profileStatLabel}>IPK</span></div>
            <div className={styles.profileStatDivider} />
            <div className={styles.profileStat}><span className={styles.profileStatNum}>95%</span><span className={styles.profileStatLabel}>Profil Lengkap</span></div>
            <div className={styles.profileStatDivider} />
            <div className={styles.profileStat}><span className={styles.profileStatNum}>3</span><span className={styles.profileStatLabel}>Dilamar</span></div>
          </div>
        </div>
      </div>

      <div className={styles.menuList}>
        {menuSections.map((sec) => (
          <div key={sec.section} className={styles.menuSection}>
            <p className={styles.menuSectionTitle}>{sec.section}</p>
            <div className={styles.menuGroup}>
              {sec.items.map((item) => (
                <button key={item.id} className={styles.menuItem} onClick={() => navigate(item.route)} id={`menu-${item.id}`}>
                  <div className={styles.menuIconWrap} data-color={item.color}>{item.icon}</div>
                  <div className={styles.menuText}>
                    <span className={styles.menuLabel}>{item.label}</span>
                    <span className={styles.menuSub}>{item.sub}</span>
                  </div>
                  {I.chevron}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.logoutWrap}>
        <button className={styles.logoutBtn} id="btn-logout" onClick={() => addToast("Anda telah keluar dari akun", "info")}>
          {I.logout} Keluar
        </button>
      </div>
      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
    </div>
  );
}

/* ─── Profile Data ─── */
function ProfileData() {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
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

  const update = (field: string, value: string | boolean) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast("Data diri berhasil disimpan", "success");
    }, 800);
  };

  return (
    <div className={styles.page}>
      <PageHeader title="Data Diri" showBack />
      <div className={styles.formWrap}>
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Informasi Pribadi</h3>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Nama Lengkap</label>
            <input className={styles.input} value={data.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>NIM</label>
            <input className={styles.input} value={data.nim} onChange={(e) => update("nim", e.target.value)} />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Jurusan</label>
              <input className={styles.input} value={data.major} onChange={(e) => update("major", e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Semester</label>
              <input className={styles.input} value={data.semester} onChange={(e) => update("semester", e.target.value)} />
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Universitas</label>
            <input className={styles.input} value={data.university} onChange={(e) => update("university", e.target.value)} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>IPK</label>
            <input className={styles.input} value={data.gpa} onChange={(e) => update("gpa", e.target.value)} />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Informasi Sosio-Ekonomi</h3>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Pendapatan Keluarga / Bulan</label>
            <select className={styles.select} value={data.income} onChange={(e) => update("income", e.target.value)}>
              <option value="low">Kurang dari Rp 1.500.000</option>
              <option value="mid-low">Rp 1.500.000 – Rp 3.000.000</option>
              <option value="mid">Rp 3.000.000 – Rp 5.000.000</option>
              <option value="high">Lebih dari Rp 5.000.000</option>
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Status Vulnerability</label>
            <div className={styles.checkList}>
              <label className={styles.checkRow}>
                <input type="checkbox" className={styles.checkbox} checked={data.firstGen} onChange={(e) => update("firstGen", e.target.checked)} />
                <span>First-Generation (1st Gen) Student</span>
              </label>
              <label className={styles.checkRow}>
                <input type="checkbox" className={styles.checkbox} checked={data.orphan} onChange={(e) => update("orphan", e.target.checked)} />
                <span>Yatim / Piatu</span>
              </label>
              <label className={styles.checkRow}>
                <input type="checkbox" className={styles.checkbox} checked={data.remote} onChange={(e) => update("remote", e.target.checked)} />
                <span>Daerah 3T (Tertinggal, Terdepan, Terluar)</span>
              </label>
            </div>
          </div>
        </div>

        <button className={styles.saveBtn} id="btn-save-profile" onClick={handleSave} disabled={saving}>
          {saving ? <span className={styles.spinner} /> : "Simpan Perubahan"}
        </button>
      </div>
      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
    </div>
  );
}

/* ─── Settings ─── */
function ProfileSettings() {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  const handleToggleNotif = () => { setNotifications((p) => !p); addToast(notifications ? "Notifikasi dimatikan" : "Notifikasi diaktifkan", "info"); };
  const handleToggleEmail = () => { setEmailNotif((p) => !p); addToast(emailNotif ? "Email notifikasi dimatikan" : "Email notifikasi diaktifkan", "info"); };
  const handleClearCache = () => { addToast("Cache berhasil dibersihkan", "success"); };

  return (
    <div className={styles.page}>
      <PageHeader title="Pengaturan" showBack />
      <div className={styles.settingsWrap}>
        <div className={styles.settingsGroup}>
          <p className={styles.settingsGroupTitle}>Tampilan</p>
          <div className={styles.settingsItem}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Mode Gelap</span>
              <span className={styles.settingsSub}>{theme === "dark" ? "Aktif" : "Nonaktif"}</span>
            </div>
            <button className={`${styles.toggle} ${theme === "dark" ? styles.toggleOn : ""}`} onClick={toggleTheme} role="switch" aria-checked={theme === "dark"} id="btn-dark-mode">
              <span className={styles.toggleThumb} />
            </button>
          </div>
          <div className={styles.settingsItem} onClick={() => addToast("Bahasa sudah Indonesia", "info")}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Bahasa</span>
              <span className={styles.settingsSub}>Bahasa Indonesia</span>
            </div>
            {I.chevron}
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <p className={styles.settingsGroupTitle}>Notifikasi</p>
          <div className={styles.settingsItem}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Push Notification</span>
              <span className={styles.settingsSub}>Notifikasi beasiswa baru dan update status</span>
            </div>
            <button className={`${styles.toggle} ${notifications ? styles.toggleOn : ""}`} onClick={handleToggleNotif} role="switch" aria-checked={notifications}>
              <span className={styles.toggleThumb} />
            </button>
          </div>
          <div className={styles.settingsItem}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Email Notification</span>
              <span className={styles.settingsSub}>Ringkasan mingguan via email</span>
            </div>
            <button className={`${styles.toggle} ${emailNotif ? styles.toggleOn : ""}`} onClick={handleToggleEmail} role="switch" aria-checked={emailNotif}>
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <p className={styles.settingsGroupTitle}>Data & Privasi</p>
          <div className={styles.settingsItem} onClick={handleClearCache}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Hapus Cache</span>
              <span className={styles.settingsSub}>Bersihkan data sementara</span>
            </div>
            {I.chevron}
          </div>
          <div className={styles.settingsItem} onClick={() => addToast("Membuka kebijakan privasi...", "info")}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Kebijakan Privasi</span>
              <span className={styles.settingsSub}>Baca kebijakan privasi kami</span>
            </div>
            {I.chevron}
          </div>
        </div>
      </div>
      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
    </div>
  );
}

/* ─── Security ─── */
function ProfileSecurity() {
  const { addToast } = useToast();
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className={styles.page}>
      <PageHeader title="Keamanan Akun" showBack />
      <div className={styles.securityWrap}>
        <div className={styles.securityCard}>
          <div className={styles.securityShield}>{I.shield}</div>
          <h3 className={styles.securityTitle}>Akun Aman</h3>
          <p className={styles.securitySub}>Keamanan akunmu dalam kondisi baik</p>
          <div className={styles.securityMeter}><div className={styles.securityMeterFill} style={{ width: twoFa ? "85%" : "60%" }} /></div>
          <span className={styles.securityPercent}>{twoFa ? "85" : "60"}% Secure</span>
        </div>

        <div className={styles.settingsGroup}>
          <div className={styles.settingsItem} onClick={() => addToast("Membuka halaman ubah password...", "info")}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Ubah Password</span>
              <span className={styles.settingsSub}>Terakhir diubah 30 hari lalu</span>
            </div>
            {I.chevron}
          </div>
          <div className={styles.settingsItem}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Two-Factor Auth (2FA)</span>
              <span className={`${styles.settingsSub} ${twoFa ? styles.statusActive : ""}`}>{twoFa ? "Aktif" : "Nonaktif"}</span>
            </div>
            <button className={`${styles.toggle} ${twoFa ? styles.toggleOn : ""}`} onClick={() => { setTwoFa((p) => !p); addToast(twoFa ? "2FA dinonaktifkan" : "2FA diaktifkan", twoFa ? "warning" : "success"); }} role="switch" aria-checked={twoFa}>
              <span className={styles.toggleThumb} />
            </button>
          </div>
          <div className={styles.settingsItem} onClick={() => addToast("2 perangkat terhubung", "info")}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Perangkat Aktif</span>
              <span className={styles.settingsSub}>2 perangkat terhubung</span>
            </div>
            {I.chevron}
          </div>
          <div className={styles.settingsItem} onClick={() => addToast("Riwayat login dimuat", "info")}>
            <div className={styles.settingsItemText}>
              <span className={styles.settingsLabel}>Riwayat Login</span>
              <span className={styles.settingsSub}>Lihat aktivitas masuk terbaru</span>
            </div>
            {I.chevron}
          </div>
        </div>
      </div>
      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
    </div>
  );
}
