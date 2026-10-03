"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  rightAction,
  transparent = false,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={`${styles.header} ${transparent ? styles.transparent : ""}`}
      id="page-header"
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          {showBack && (
            <button
              className={styles.backBtn}
              onClick={() => router.back()}
              aria-label="Kembali"
              id="btn-back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className={styles.titles}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        {rightAction && <div className={styles.right}>{rightAction}</div>}
      </div>
    </header>
  );
}
