"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

/* ─── Navigation types ─── */
export type NavTab = "home" | "emergency" | "chat" | "profile";
export type PageRoute =
  | "home"
  | "scholarship-detail"
  | "emergency"
  | "emergency-form"
  | "chat"
  | "chat-recommend"
  | "chat-help"
  | "profile"
  | "profile-data"
  | "profile-settings"
  | "profile-security";

interface NavigationState {
  activeTab: NavTab;
  currentPage: PageRoute;
  pageData: Record<string, unknown>;
  history: PageRoute[];
}

interface NavigationContextValue extends NavigationState {
  navigate: (page: PageRoute, data?: Record<string, unknown>) => void;
  setTab: (tab: NavTab) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const tabPageMap: Record<NavTab, PageRoute> = {
  home: "home",
  emergency: "emergency",
  chat: "chat",
  profile: "profile",
};

const pageTabMap: Record<PageRoute, NavTab> = {
  home: "home",
  "scholarship-detail": "home",
  emergency: "emergency",
  "emergency-form": "emergency",
  chat: "chat",
  "chat-recommend": "chat",
  "chat-help": "chat",
  profile: "profile",
  "profile-data": "profile",
  "profile-settings": "profile",
  "profile-security": "profile",
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    activeTab: "home",
    currentPage: "home",
    pageData: {},
    history: ["home"],
  });

  const navigate = useCallback((page: PageRoute, data?: Record<string, unknown>) => {
    setState((prev) => ({
      activeTab: pageTabMap[page],
      currentPage: page,
      pageData: data ?? {},
      history: [...prev.history, page],
    }));
  }, []);

  const setTab = useCallback((tab: NavTab) => {
    const page = tabPageMap[tab];
    setState({
      activeTab: tab,
      currentPage: page,
      pageData: {},
      history: [page],
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.history.length <= 1) return prev;
      const newHistory = prev.history.slice(0, -1);
      const prevPage = newHistory[newHistory.length - 1];
      return {
        activeTab: pageTabMap[prevPage],
        currentPage: prevPage,
        pageData: {},
        history: newHistory,
      };
    });
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        navigate,
        setTab,
        goBack,
        canGoBack: state.history.length > 1,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be inside NavigationProvider");
  return ctx;
}
