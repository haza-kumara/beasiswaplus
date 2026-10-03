"use client";

import React, { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import PageHeader from "@/components/ui/PageHeader";
import BottomNav from "@/components/ui/BottomNav";

interface Doc {
  id: string;
  name: string;
  category: string;
  status: "verified" | "pending" | "missing";
  updatedAt?: string;
}

const initialDocs: Doc[] = [
  { id: "1", name: "Kartu Keluarga (KK)", category: "Kependudukan", status: "verified", updatedAt: "12 Sep 2026" },
  { id: "2", name: "Surat Keterangan Tidak Mampu (SKTM)", category: "Sosial Ekonomi", status: "verified", updatedAt: "15 Sep 2026" },
  { id: "3", name: "Transkrip Nilai Akademik Resmi", category: "Akademik", status: "verified", updatedAt: "28 Sep 2026" },
  { id: "4", name: "Surat Rekomendasi Dosen Wali", category: "Akademik", status: "pending", updatedAt: "01 Okt 2026" },
  { id: "5", name: "Bukti Rekening Listrik / PBB", category: "Sosial Ekonomi", status: "missing" },
];

export default function DocumentsPage() {
  const { addToast } = useToast();
  const [docs, setDocs] = useState<Doc[]>(initialDocs);

  const handleUpload = (docId: string) => {
    setDocs((prev) =>
      prev.map((d) => d.id === docId ? { ...d, status: "pending", updatedAt: "Baru saja" } : d)
    );
    addToast("Dokumen berhasil diunggah ke vault", "success");
  };

  return (
    <div style={{ maxWidth: "var(--max-content-width)", margin: "0 auto", animation: "fadeIn 0.3s var(--ease-out)" }}>
      <PageHeader title="Document Vault" subtitle="Penyimpanan Berkas Terenkripsi" showBack />

      <div style={{ padding: "16px" }}>
        <div style={{
          padding: "16px", borderRadius: "16px", background: "var(--blue-50)",
          border: "1px solid var(--blue-200)", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "flex-start"
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px", background: "var(--blue-100)",
            color: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--blue-700)" }}>Aman & Sekali Unggah</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--blue-600)", lineHeight: 1.4 }}>
              Dokumen tersimpan di cloud vault Anda secara aman. Setiap melamar beasiswa, dokumen akan otomatis dilampirkan tanpa upload ulang.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {docs.map((doc) => (
            <div
              key={doc.id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px", background: "var(--bg-card)", borderRadius: "12px",
                border: "1px solid var(--border-light)", boxShadow: "var(--shadow-card)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "8px", background: "var(--blue-50)",
                  color: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>{doc.name}</h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                    {doc.category} &middot; {doc.updatedAt ? `Update: ${doc.updatedAt}` : "Belum diunggah"}
                  </p>
                </div>
              </div>

              <div>
                {doc.status === "verified" && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "4px 10px", borderRadius: "999px", background: "var(--mint-100)", color: "var(--mint-500)" }}>
                    Terverifikasi
                  </span>
                )}
                {doc.status === "pending" && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "4px 10px", borderRadius: "999px", background: "var(--amber-100)", color: "var(--amber-400)" }}>
                    Menunggu Verifikasi
                  </span>
                )}
                {doc.status === "missing" && (
                  <button
                    onClick={() => handleUpload(doc.id)}
                    style={{
                      fontSize: "0.75rem", fontWeight: 700, padding: "6px 12px", borderRadius: "8px",
                      background: "var(--blue-500)", color: "white", cursor: "pointer"
                    }}
                  >
                    Unggah
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
      <BottomNav />
    </div>
  );
}
