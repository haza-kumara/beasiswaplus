"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import BottomNav from "@/components/ui/BottomNav";
import { scholarships } from "@/components/scholarship/scholarshipsData";
import styles from "./Dashboard.module.css";

const Icons = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  star: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>,
  dollar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  bookmark: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  bookmarkFilled: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  award: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
  wallet: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  globe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  building: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="6" x2="9.01" y2="6" /><line x1="15" y1="6" x2="15.01" y2="6" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /><line x1="9" y1="14" x2="9.01" y2="14" /><line x1="15" y1="14" x2="15.01" y2="14" /><line x1="9" y1="18" x2="15" y2="18" /></svg>,
  flask: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v7l5 8H4l5-8V3z" /><line x1="8" y1="3" x2="16" y2="3" /></svg>,
  bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  filter: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
};

const categories = [
  { icon: Icons.award, label: "Prestasi", count: 24 },
  { icon: Icons.wallet, label: "Need-Based", count: 38 },
  { icon: Icons.globe, label: "Daerah 3T", count: 15 },
  { icon: Icons.users, label: "1st Gen", count: 21 },
  { icon: Icons.building, label: "Korporat", count: 19 },
  { icon: Icons.flask, label: "Riset", count: 12 },
];

function MatchBadge({ match }: { match: number }) {
  const color = match >= 90 ? "var(--mint-500)" : match >= 75 ? "var(--blue-500)" : "var(--amber-400)";
  return (
    <span className={styles.matchBadge} style={{ "--match-color": color } as React.CSSProperties}>
      {Icons.star}
      {match}% Match
    </span>
  );
}

export default function DashboardView() {
  const router = useRouter();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let results = scholarships;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory) {
      results = results.filter((s) => s.category === activeCategory);
    }
    return results;
  }, [searchQuery, activeCategory]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        addToast("Beasiswa dihapus dari simpanan", "info");
      } else {
        next.add(id);
        addToast("Beasiswa disimpan", "success");
      }
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroDecor}><div className={styles.heroCircle1} /><div className={styles.heroCircle2} /></div>
        <div className={styles.heroContent}>
          <div className={styles.heroTopRow}>
            <div className={styles.greeting}>
              <p className={styles.greetingText}>Selamat datang kembali, Dina</p>
            </div>
            <button
              className={styles.notifBtn}
              onClick={() => addToast("Kamu memiliki 3 rekomendasi beasiswa baru", "info")}
              aria-label="Notifikasi"
            >
              {Icons.bell}
              <span className={styles.notifDot}>3</span>
            </button>
          </div>
          <h2 className={styles.heroTitle}>
            Temukan Beasiswa<br />
            <span className={styles.heroHighlight}>Yang Tepat Untukmu</span>
          </h2>
          <p className={styles.heroSub}>{scholarships.length} beasiswa aktif sesuai profil akademikmu</p>
        </div>
        <div className={styles.searchWrap}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>{Icons.search}</span>
            <input
              type="text"
              placeholder="Cari beasiswa, yayasan, atau kata kunci..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={() => setSearchQuery("")} aria-label="Hapus pencarian">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{scholarships.length}</span>
          <span className={styles.statLabel}>Beasiswa Cocok</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{savedIds.size}</span>
          <span className={styles.statLabel}>Disimpan</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>2</span>
          <span className={styles.statLabel}>Dalam Review</span>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Kategori</h3>
          {activeCategory && (
            <button className={styles.seeAll} onClick={() => setActiveCategory(null)}>
              Reset filter
            </button>
          )}
        </div>
        <div className={styles.catGrid}>
          {categories.map((cat) => (
            <button
              key={cat.label}
              className={`${styles.catCard} ${activeCategory === cat.label ? styles.catActive : ""}`}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
            >
              <span className={styles.catIcon}>{cat.icon}</span>
              <span className={styles.catLabel}>{cat.label}</span>
              <span className={styles.catCount}>{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            {activeCategory ? `Beasiswa ${activeCategory}` : "Rekomendasi Untukmu"}
            <span className={styles.resultCount}>{filtered.length} hasil</span>
          </h3>
          <button className={styles.filterBtn} onClick={() => addToast("Menampilkan rekomendasi terbaik", "info")}>
            {Icons.filter}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Tidak ada beasiswa yang cocok</p>
            <button className={styles.emptyBtn} onClick={() => { setSearchQuery(""); setActiveCategory(null); }}>
              Reset pencarian
            </button>
          </div>
        ) : (
          <div className={styles.scholarshipList}>
            {filtered.map((s) => (
              <div key={s.id} className={styles.scholarshipCard}>
                <div
                  className={styles.cardBody}
                  onClick={() => router.push(`/scholarships/${s.id}`)}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.providerAvatar} data-color={s.color}>{s.provider.charAt(0)}</div>
                    <div className={styles.cardMeta}>
                      <span className={styles.providerName}>{s.provider}</span>
                      <MatchBadge match={s.match} />
                    </div>
                  </div>
                  <h4 className={styles.cardTitle}>{s.title}</h4>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardAmount}>{Icons.dollar}{s.amount}</span>
                    <span className={styles.cardDeadline}>{Icons.clock}{s.deadline}</span>
                  </div>
                  <div className={styles.tagRow}>
                    {s.tags.map((tag) => (<span key={tag} className={styles.tag}>{tag}</span>))}
                  </div>
                </div>
                <button
                  className={`${styles.saveBtn} ${savedIds.has(s.id) ? styles.saved : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleSave(s.id); }}
                  aria-label="Simpan beasiswa"
                >
                  {savedIds.has(s.id) ? Icons.bookmarkFilled : Icons.bookmark}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ height: "calc(var(--bottom-nav-height) + 32px)" }} />
      <BottomNav />
    </div>
  );
}
