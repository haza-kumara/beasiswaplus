"use client";

import React, { useState, useRef, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import BottomNav from "@/components/ui/BottomNav";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const AI_RESPONSES = [
  "Berdasarkan profilmu, berikut rekomendasi beasiswa terbaik:\n\n1. **Beasiswa Bank Indonesia** (95% Match) — Prioritas mahasiswa 1st gen.\n2. **Tanoto Foundation** (88% Match) — IPK ≥ 3.0 & Daerah 3T.\n3. **Telkom CSR** (82% Match) — Rumpun teknologi & STEM.\n\nMau saya bantu persiapkan dokumennya?",
  "Untuk melamar beasiswa tersebut, kamu butuh:\n• Kartu Keluarga (sudah di vault)\n• Transkrip Nilai IPK 3.45 (sudah di vault)\n• Surat Rekomendasi Dosen (perlu diunggah)\n\nSemua berkas di vault otomatis terlampir saat klik 'Ajukan'.",
];

export default function ApplicationsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: "Halo Dina! Saya Asisten AI BeasiswaPlus. Ada yang bisa saya bantu terkait pencarian beasiswa atau kelengkapan berkas lamaranmu?",
      time: "20:00",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim() || typing) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const respText = AI_RESPONSES[messages.length % AI_RESPONSES.length];
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: respText,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: "var(--max-content-width)", margin: "0 auto", display: "flex", flexDirection: "column", height: "100dvh" }}>
      <PageHeader title="Asisten AI & Lamaran" subtitle="Konsultasi Beasiswa Cerdas" />

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              background: m.role === "user" ? "linear-gradient(135deg, var(--blue-500), var(--blue-600))" : "var(--bg-card)",
              color: m.role === "user" ? "white" : "var(--text-primary)",
              padding: "12px 16px",
              borderRadius: "16px",
              border: m.role === "user" ? "none" : "1px solid var(--border-light)",
              boxShadow: "var(--shadow-card)",
              whiteSpace: "pre-line",
              fontSize: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            {m.text}
            <div style={{ fontSize: "0.625rem", opacity: 0.7, textAlign: "right", marginTop: "4px" }}>{m.time}</div>
          </div>
        ))}
        {typing && (
          <div style={{ alignSelf: "flex-start", padding: "12px 16px", background: "var(--bg-card)", borderRadius: "16px", fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>
            Asisten sedang mengetik...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "12px 16px", paddingBottom: "calc(var(--bottom-nav-height) + 16px)", background: "var(--bg-nav)", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ display: "flex", gap: "8px", background: "var(--bg-input)", borderRadius: "12px", border: "1.5px solid var(--border-default)", padding: "4px 8px" }}>
          <input
            type="text"
            placeholder="Tanyakan peluang beasiswa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{ flex: 1, padding: "8px", fontSize: "0.875rem", color: "var(--text-primary)" }}
          />
          <button
            onClick={handleSend}
            style={{ padding: "8px 16px", borderRadius: "8px", background: "var(--blue-500)", color: "white", fontWeight: 700, cursor: "pointer" }}
          >
            Kirim
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
