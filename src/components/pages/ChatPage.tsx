"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigation } from "@/context/NavigationContext";
import PageHeader from "@/components/PageHeader/PageHeader";
import styles from "./ChatPage.module.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const I = {
  mortarboard: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" /></svg>,
  smallMortarboard: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" /></svg>,
  sparkles: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m-7.07-2.93l.71-.71M18.36 5.64l.71-.71M3 12h1m16 0h1M5.64 5.64l-.71-.71m12.73 12.73l.71.71" /><circle cx="12" cy="12" r="4" /></svg>,
  lifebuoy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" /><line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /><line x1="4.93" y1="19.07" x2="9.17" y2="14.83" /></svg>,
  send: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  chevron: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>,
};

const AI_RESPONSES: Record<string, string[]> = {
  recommend: [
    "Berdasarkan profilmu, saya menemukan beberapa beasiswa yang sangat cocok:\n\n1. **Beasiswa Bank Indonesia** — 95% Match\nKhusus mahasiswa 1st gen dengan pendapatan keluarga rendah. Deadline: 30 Nov 2026.\n\n2. **Tanoto Foundation** — 88% Match\nPrioritas daerah 3T dan IPK >= 3.0. Deadline: 15 Des 2026.\n\n3. **YCAB Foundation** — 84% Match\nFokus pada mahasiswa yatim/piatu dan 1st gen.\n\nMau saya bantu persiapkan dokumen untuk salah satunya?",
    "Untuk beasiswa yang kamu tanyakan, berikut informasi lengkapnya:\n\n**Persyaratan Umum:**\n• IPK minimal 3.0\n• Mahasiswa aktif semester 3+\n• Surat rekomendasi dosen\n• SKTM dari kelurahan\n\n**Dokumen yang perlu disiapkan:**\n• Kartu Keluarga\n• Transkrip nilai\n• Surat keterangan aktif kuliah\n\nSemua dokumen ini bisa kamu simpan di Document Vault agar tidak perlu upload ulang.",
    "Tentu! Saya bisa bantu mencarikan beasiswa lain yang sesuai. Bisa ceritakan lebih detail tentang:\n\n• Jurusan dan semester saat ini\n• Kondisi finansial keluarga\n• Apakah kamu mahasiswa 1st gen?\n• Daerah asal\n\nInformasi ini akan membantu saya memberikan rekomendasi yang lebih akurat.",
  ],
  help: [
    "Saya mengerti situasimu. Berikut langkah yang bisa kamu ambil sekarang:\n\n1. **Ajukan Bantuan Darurat** melalui menu Darurat — validasi hanya 24 jam\n2. **Hubungi BEM** fakultasmu untuk pendampingan\n3. **Cek Document Vault** — pastikan dokumenmu sudah lengkap\n\nPerlu saya bantu isi formulir bantuan darurat?",
    "Untuk situasi darurat finansial, ada beberapa opsi yang tersedia:\n\n**Bantuan Internal Kampus:**\n• Dana darurat mahasiswa (proses 24 jam)\n• Keringanan UKT dari rektorat\n• Program cicilan dari bagian keuangan\n\n**Bantuan Eksternal:**\n• Crowdfunding melalui platform kami\n• Bantuan dari alumni network\n\nMana yang ingin kamu ketahui lebih lanjut?",
    "Baik, saya akan bantu kamu mengajukan bantuan. Beberapa hal yang perlu disiapkan:\n\n• Bukti situasi darurat (surat keterangan/foto)\n• Data keuangan keluarga terkini\n• Surat rekomendasi dari dosen wali\n\nKamu bisa langsung ke halaman Darurat untuk mengisi formulir, atau saya bisa pandu prosesnya di sini.",
  ],
};

const quickActions = [
  { id: "recommend", icon: I.sparkles, title: "Minta Rekomendasi", sub: "Temukan beasiswa paling cocok untukmu", route: "chat-recommend" as const },
  { id: "help", icon: I.lifebuoy, title: "Pertolongan", sub: "Bantuan segera untuk situasi darurat", route: "chat-help" as const },
];

const suggestions = [
  "Carikan beasiswa untuk mahasiswa teknik semester 5",
  "Bagaimana cara mengajukan bantuan darurat?",
  "Beasiswa apa yang cocok untuk mahasiswa 1st gen?",
  "Jelaskan cara kerja Document Vault",
];

export default function ChatPage() {
  const { navigate, currentPage } = useNavigation();

  if (currentPage === "chat-recommend" || currentPage === "chat-help") {
    return <ChatConversation mode={currentPage === "chat-recommend" ? "recommend" : "help"} />;
  }

  return (
    <div className={styles.page}>
      <PageHeader title="AI Assistant" subtitle="Powered by AI" />
      <div className={styles.welcome}>
        <div className={styles.aiAvatar}>
          <div className={styles.aiAvatarInner}>{I.mortarboard}</div>
          <span className={styles.aiPulse} />
        </div>
        <h2 className={styles.welcomeTitle}>Asisten Beasiswa</h2>
        <p className={styles.welcomeSub}>
          Saya bisa bantu carikan beasiswa yang cocok, menjawab pertanyaan, atau membantu situasi darurat.
        </p>
      </div>
      <div className={styles.actions}>
        {quickActions.map((a) => (
          <button key={a.id} className={styles.actionCard} onClick={() => navigate(a.route)} id={`btn-chat-${a.id}`}>
            <span className={styles.actionIcon}>{a.icon}</span>
            <div className={styles.actionText}>
              <span className={styles.actionTitle}>{a.title}</span>
              <span className={styles.actionSub}>{a.sub}</span>
            </div>
            {I.chevron}
          </button>
        ))}
      </div>
      <div className={styles.suggestSection}>
        <p className={styles.suggestLabel}>Atau coba tanyakan</p>
        <div className={styles.suggestList}>
          {suggestions.map((s) => (
            <button key={s} className={styles.suggestChip} onClick={() => navigate("chat-recommend")}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
    </div>
  );
}

/* ─── Chat Conversation ─── */
function ChatConversation({ mode }: { mode: "recommend" | "help" }) {
  const title = mode === "recommend" ? "Rekomendasi Beasiswa" : "Pertolongan Darurat";
  const initialMessages: Message[] = [
    {
      id: "1",
      role: "assistant",
      text: mode === "recommend"
        ? "Hai! Saya siap membantu mencari beasiswa yang paling cocok untukmu. Bisa ceritakan tentang jurusan, semester, dan kondisi finansialmu?"
        : "Saya mengerti kamu butuh pertolongan segera. Ceritakan situasimu, dan saya akan bantu menemukan solusi tercepat.",
      time: "20:00",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const responses = AI_RESPONSES[mode];
    const idx = responseIndex % responses.length;

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: responses[idx],
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiResponse]);
      setResponseIndex((prev) => prev + 1);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className={styles.chatPage}>
      <PageHeader title={title} showBack />
      <div className={styles.messageArea}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.messageBubble} ${msg.role === "user" ? styles.userBubble : styles.aiBubble}`}>
            {msg.role === "assistant" && (
              <div className={styles.aiMsgAvatar}>{I.smallMortarboard}</div>
            )}
            <div className={styles.msgContent}>
              <p className={styles.msgText}>{msg.text}</p>
              <span className={styles.msgTime}>{msg.time}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.messageBubble} ${styles.aiBubble}`}>
            <div className={styles.aiMsgAvatar}>{I.smallMortarboard}</div>
            <div className={styles.typingIndicator}>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputBar}>
        <div className={styles.chatInputWrap}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder="Tulis pesan..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            id="chat-input"
          />
          <button className={styles.sendBtn} onClick={handleSend} disabled={!inputValue.trim() || isTyping} id="btn-send-chat" aria-label="Kirim pesan">
            {I.send}
          </button>
        </div>
      </div>
    </div>
  );
}
