"use client";

import React, { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import PageHeader from "@/components/ui/PageHeader";
import BottomNav from "@/components/ui/BottomNav";

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

export default function EmergencyPage() {
  const { addToast } = useToast();
  const [cases, setCases] = useState(initialCases);
  const [isApplying, setIsApplying] = useState(false);
  const [donateId, setDonateId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const handleDonate = (id: string) => {
    const val = parseInt(amount.replace(/\D/g, ""), 10);
    if (!val || val <= 0) {
      addToast("Masukkan jumlah donasi yang valid", "error");
      return;
    }
    setCases((prev) =>
      prev.map((c) => c.id === id ? { ...c, raised: Math.min(c.raised + val, c.target) } : c)
    );
    addToast(`Donasi sebesar ${formatRupiah(val)} berhasil dikirim!`, "success");
    setDonateId(null);
    setAmount("");
  };

  return (
    <div style={{ maxWidth: "var(--max-content-width)", margin: "0 auto", animation: "fadeIn 0.3s var(--ease-out)" }}>
      <PageHeader title="Bantuan Darurat" subtitle="Emergency Grant Mahasiswa" />

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{
          padding: "16px", background: "var(--rose-50)", borderRadius: "16px",
          border: "1px solid var(--rose-200)", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--rose-500)" }}>Butuh Bantuan Mendesak?</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Verifikasi cepat 24 jam untuk kendala biaya UKT atau bencana</p>
          </div>
          <button
            onClick={() => setIsApplying(!isApplying)}
            style={{
              padding: "10px 16px", borderRadius: "10px", background: "var(--rose-500)",
              color: "white", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap"
            }}
          >
            {isApplying ? "Tutup Form" : "Ajukan Bantuan"}
          </button>
        </div>

        {isApplying && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addToast("Permohonan bantuan berhasil diajukan! Validasi dalam 24 jam.", "success");
              setIsApplying(false);
            }}
            style={{
              padding: "20px", background: "var(--bg-card)", borderRadius: "16px",
              border: "1px solid var(--border-light)", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column", gap: "12px"
            }}
          >
            <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>Formulir Bantuan Darurat</h4>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Jenis Kebutuhan</label>
              <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-default)", marginTop: "4px" }} required>
                <option value="ukt">Biaya Tunggakan UKT / SPP</option>
                <option value="disaster">Musibah Bencana Alam</option>
                <option value="family">Kehilangan Tulang Punggung Keluarga</option>
                <option value="medical">Biaya Pengobatan Darurat</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Jumlah Dana Dibutuhkan (Rp)</label>
              <input type="number" placeholder="Contoh: 3000000" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-default)", marginTop: "4px" }} required />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Ceritakan Situasi Mendesak Anda</label>
              <textarea rows={3} placeholder="Jelaskan kendala Anda..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-default)", marginTop: "4px" }} required />
            </div>
            <button type="submit" style={{ padding: "12px", borderRadius: "8px", background: "var(--rose-500)", color: "white", fontWeight: 700, cursor: "pointer" }}>
              Kirim Permohonan
            </button>
          </form>
        )}

        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Kasus Aktif Mahasiswa</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {cases.map((c) => {
            const pct = Math.round((c.raised / c.target) * 100);
            return (
              <div
                key={c.id}
                style={{
                  padding: "16px", background: "var(--bg-card)", borderRadius: "16px",
                  border: "1px solid var(--border-light)", boxShadow: "var(--shadow-card)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{
                    fontSize: "0.6875rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                    background: c.urgency === "Kritis" ? "var(--rose-100)" : "var(--amber-100)",
                    color: c.urgency === "Kritis" ? "var(--rose-500)" : "var(--amber-400)"
                  }}>
                    {c.urgency}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{c.daysLeft} hari lagi</span>
                </div>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "4px" }}>{c.title}</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "12px" }}>{c.student} &middot; {c.faculty}</p>

                <div style={{ height: "6px", background: "var(--gray-100)", borderRadius: "999px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "var(--blue-500)", borderRadius: "999px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "12px" }}>
                  <span style={{ fontWeight: 700, color: "var(--blue-600)" }}>{formatRupiah(c.raised)}</span>
                  <span style={{ color: "var(--text-tertiary)" }}>Target {formatRupiah(c.target)}</span>
                </div>

                {donateId === c.id ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="number"
                      placeholder="Nominal donasi (Rp)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ flex: 1, padding: "8px", border: "1px solid var(--border-default)", borderRadius: "8px" }}
                    />
                    <button onClick={() => handleDonate(c.id)} style={{ padding: "8px 16px", borderRadius: "8px", background: "var(--mint-500)", color: "white", fontWeight: 700 }}>
                      Kirim
                    </button>
                    <button onClick={() => setDonateId(null)} aria-label="Batal" style={{ padding: "8px 10px", borderRadius: "8px", background: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDonateId(c.id)}
                    style={{
                      width: "100%", padding: "10px", borderRadius: "8px", background: "var(--blue-50)",
                      color: "var(--blue-600)", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer"
                    }}
                  >
                    Bantu Donasi
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
      <BottomNav />
    </div>
  );
}
