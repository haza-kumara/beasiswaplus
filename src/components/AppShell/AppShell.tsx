"use client";

import React from "react";
import { NavigationProvider, useNavigation } from "@/context/NavigationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import BottomNav from "@/components/BottomNav/BottomNav";
import HomePage from "@/components/pages/HomePage";
import ScholarshipDetailPage from "@/components/pages/ScholarshipDetailPage";
import EmergencyPage from "@/components/pages/EmergencyPage";
import ChatPage from "@/components/pages/ChatPage";
import ProfilePage from "@/components/pages/ProfilePage";
import styles from "./AppShell.module.css";

function PageRouter() {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "scholarship-detail":
        return <ScholarshipDetailPage />;
      case "emergency":
      case "emergency-form":
        return <EmergencyPage />;
      case "chat":
      case "chat-recommend":
      case "chat-help":
        return <ChatPage />;
      case "profile":
      case "profile-data":
      case "profile-settings":
      case "profile-security":
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={styles.pageContent} key={currentPage}>
      {renderPage()}
    </div>
  );
}

export default function AppShell() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NavigationProvider>
          <div className={styles.shell}>
            <div className={styles.desktopBrand}>
              <div className={styles.brandLogo}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
                </svg>
              </div>
              <div className={styles.brandText}>
                <span className={styles.brandName}>BeasiswaPlus</span>
                <span className={styles.brandSub}>Akses untuk Semua</span>
              </div>
            </div>
            <main className={styles.main}>
              <PageRouter />
            </main>
            <BottomNav />
          </div>
        </NavigationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
