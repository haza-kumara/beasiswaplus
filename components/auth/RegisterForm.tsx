"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nim: "",
    university: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.brandWrap}>
          <div className={styles.brandIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
            </svg>
          </div>
          <h1 className={styles.brandTitle}>BeasiswaPlus</h1>
          <p className={styles.brandSub}>Daftar akun mahasiswa baru</p>
        </div>

        <h2 className={styles.formTitle}>Buat Akun Baru</h2>
        <p className={styles.formSub}>Isi formulir untuk mulai mencari beasiswa yang cocok</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              placeholder="Contoh: Dina Ayu Pratiwi"
              className={styles.input}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Kampus / Pribadi</label>
            <input
              type="email"
              placeholder="dina@ui.ac.id"
              className={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Universitas / Perguruan Tinggi</label>
            <input
              type="text"
              placeholder="Universitas Indonesia"
              className={styles.input}
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>NIM / NPM</label>
            <input
              type="text"
              placeholder="2106123456"
              className={styles.input}
              value={formData.nim}
              onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Minimal 8 karakter"
              className={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Mendaftarkan..." : "Daftar Akun"}
          </button>
        </form>

        <p className={styles.footerLink}>
          Sudah punya akun? <Link href="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
