"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <p className={styles.brandSub}>Akses Beasiswa untuk Semua</p>
        </div>

        <h2 className={styles.formTitle}>Masuk ke Akun</h2>
        <p className={styles.formSub}>Gunakan email dan password terdaftar Anda</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.actionsRow}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>Ingat saya</span>
            </label>
            <a href="#" className={styles.forgotLink} onClick={(e) => { e.preventDefault(); alert("Silakan hubungi administrator untuk reset password."); }}>
              Lupa password?
            </a>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className={styles.footerLink}>
          Belum punya akun? <Link href="/register">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
