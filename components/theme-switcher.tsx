// components/ui/theme-switcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-24 h-8 animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>;

  return (
    <select 
      value={theme} 
      onChange={(e) => setTheme(e.target.value)}
      className="bg-transparent border border-[#DCE1EA] dark:border-[#243649] text-[#5B6679] dark:text-gray-300 rounded px-2 py-1 outline-none focus:border-[#2338D1] dark:focus:border-teal-500 cursor-pointer text-sm"
    >
      <option value="system">💻 System</option>
      <option value="dark">🌙 Dark</option>
      <option value="light">☀️ Light</option>
    </select>
  );
}