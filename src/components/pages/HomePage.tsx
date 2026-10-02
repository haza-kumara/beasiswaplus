"use client";

import React, { useState, useMemo } from "react";
import { useNavigation } from "@/context/NavigationContext";
import { useToast } from "@/context/ToastContext";
import styles from "./HomePage.module.css";

/* ─── Icons ─── */
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
  chevronRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>,
};

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  match: number;
  deadline: string;
  amount: string;
  tags: string[];
  color: "blue" | "lavender" | "mint" | "peach";
  category: string;
}

export const scholarships: Scholarship[] = [
  { id: "1", title: "Beasiswa Bank Indonesia 2026", provider: "Bank Indonesia", match: 95, deadline: "30 Nov 2026", amount: "Rp 12.000.000/tahun", tags: ["1st Gen", "Ekonomi Mikro"], color: "blue", category: "Need-Based" },
  { id: "2", title: "Beasiswa Tanoto Foundation", provider: "Tanoto Foundation", match: 88, deadline: "15 Des 2026", amount: "Rp 7.500.000/semester", tags: ["Daerah 3T", "IPK ≥ 3.0"], color: "lavender", category: "Need-Based" },
  { id: "3", title: "CSR Telkom Scholarship", provider: "PT Telkom Indonesia", match: 82, deadline: "20 Jan 2027", amount: "Rp 5.000.000/semester", tags: ["STEM", "Ekonomi Lemah"], color: "mint", category: "Korporat" },
  { id: "4", title: "Beasiswa Djarum Plus", provider: "Djarum Foundation", match: 76, deadline: "28 Feb 2027", amount: "Rp 10.000.000/tahun", tags: ["Prestasi", "Aktif Organisasi"], color: "peach", category: "Prestasi" },
  { id: "5", title: "Beasiswa LPDP Reguler", provider: "Kementerian Keuangan", match: 71, deadline: "30 Mar 2027", amount: "Full Funded", tags: ["S2/S3", "Penelitian"], color: "blue", category: "Riset" },
  { id: "6", title: "Beasiswa Unggulan Kemendikbud", provider: "Kemendikbudristek", match: 68, deadline: "15 Apr 2027", amount: "Rp 8.000.000/semester", tags: ["Prestasi Akademik"], color: "lavender", category: "Prestasi" },
  { id: "7", title: "Beasiswa Yayasan Cinta Anak Bangsa", provider: "YCAB Foundation", match: 84, deadline: "10 Nov 2026", amount: "Rp 6.000.000/tahun", tags: ["1st Gen", "Yatim/Piatu"], color: "mint", category: "1st Gen" },
  { id: "8", title: "Beasiswa Kaltim Cemerlang", provider: "Pemprov Kaltim", match: 73, deadline: "05 Des 2026", amount: "Rp 4.000.000/semester", tags: ["Daerah 3T", "Domisili Kaltim"], color: "peach", category: "Daerah 3T" },
];

const categories = [
  { icon: "award", label: "Prestasi", count: 24 },
  { icon: "wallet", label: "Need-Based", count: 38 },
  { icon: "globe", label: "Daerah 3T", count: 15 },
  { icon: "users", label: "1st Gen", count: 21 },
  { icon: "building", label: "Korporat", count: 19 },
  { icon: "flask", label: "Riset", count: 12 },
];

const catIconMap: Record<string, React.ReactNode> = {
  award: Icons.award,
  wallet: Icons.wallet,
  globe: Icons.globe,
  users: Icons.users,
  building: Icons.building,
  flask: Icons.flask,
};

function MatchBadge({ match }: { match: number }) {
  const color = match >= 90 ? "var(--mint-500)" : match >= 75 ? "var(--blue-500)" : "var(--amber-400)";
  return (
    <span className={styles.matchBadge} style={{ "--match-color": color } as React.CSSProperties}>
      {Icons.star}
      {match}% Match
    </span>
  );
}

export default function HomePage() {
  const { navigate } = useNavigation();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [notifCount] = useState(3);

  const filteredScholarships = useMemo(() => {
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

  const handleCategoryClick = (label: string) => {
    setActiveCategory((prev) => (prev === label ? null : label));
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroDecor}><div className={styles.heroCircle1} /><div className={styles.heroCircle2} /></div>
        <div className={styles.heroContent}>
          <div className={styles.heroTopRow}>
            <div className={styles.greeting}>
              <p className={styles.greetingText}>Selamat sore, Dina</p>
            </div>
            <button
              className={styles.notifBtn}
              onClick={() => addToast(`Kamu punya ${notifCount} notifikasi baru`, "info")}
              aria-label="Notifikasi"
              id="btn-notifications"
            >
              {Icons.bell}
              {notifCount > 0 && <span className={styles.notifDot}>{notifCount}</span>}
            </button>
          </div>
          <h2 className={styles.heroTitle}>
            Temukan Beasiswa<br />
            <span className={styles.heroHighlight}>Yang Tepat Untukmu</span>
          </h2>
          <p className={styles.heroSub}>{scholarships.length} beasiswa tersedia sesuai profilmu</p>
        </div>
        <div className={styles.searchWrap}>
          <div className={styles.searchBox} id="search-scholarships">
            <span className={styles.searchIcon}>{Icons.search}</span>
            <input
              type="text"
              placeholder="Cari beasiswa, yayasan, atau kategori..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Categories */}
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
              onClick={() => handleCategoryClick(cat.label)}
            >
              <span className={styles.catIcon}>{catIconMap[cat.icon]}</span>
              <span className={styles.catLabel}>{cat.label}</span>
              <span className={styles.catCount}>{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Scholarship List */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            {activeCategory ? `Beasiswa ${activeCategory}` : "Rekomendasi Untukmu"}
            <span className={styles.resultCount}>{filteredScholarships.length} hasil</span>
          </h3>
          <button className={styles.filterBtn} onClick={() => addToast("Filter diterapkan", "info")} id="btn-filter">
            {Icons.filter}
          </button>
        </div>

        {filteredScholarships.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            <p className={styles.emptyText}>Tidak ada beasiswa ditemukan</p>
            <button className={styles.emptyBtn} onClick={() => { setSearchQuery(""); setActiveCategory(null); }}>
              Reset pencarian
            </button>
          </div>
        ) : (
          <div className={`${styles.scholarshipList} stagger-children`}>
            {filteredScholarships.map((s) => (
              <div key={s.id} className={styles.scholarshipCard} id={`scholarship-${s.id}`}>
                <button className={styles.cardBody} onClick={() => navigate("scholarship-detail", { scholarship: s })}>
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
                </button>
                <button
                  className={`${styles.saveBtn} ${savedIds.has(s.id) ? styles.saved : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleSave(s.id); }}
                  aria-label={savedIds.has(s.id) ? "Hapus dari simpanan" : "Simpan beasiswa"}
                >
                  {savedIds.has(s.id) ? Icons.bookmarkFilled : Icons.bookmark}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ height: "calc(var(--bottom-nav-height) + 24px)" }} />
    </div>
  );
}
