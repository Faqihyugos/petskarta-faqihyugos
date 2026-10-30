"use client";

import { useEffect, useState } from "react";

export default function ToggleTema() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const tersimpan = localStorage.getItem("petskarta_theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const aktifDark = tersimpan === "dark" || (!tersimpan && prefersDark);
      
      setIsDark(aktifDark);
      if (aktifDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // Abaikan jika localStorage diblokir
    } finally {
      setMounted(true);
    }
  }, []);

  const handleToggle = () => {
    const baru = !isDark;
    setIsDark(baru);
    try {
      if (baru) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("petskarta_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("petskarta_theme", "light");
      }
    } catch {
      // Abaikan error penyimpanan
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="h-8 w-8 rounded-lg border border-garis bg-latar text-sm text-teks-lembut opacity-50"
        aria-label="Memuat tema..."
        disabled
      >
        🌓
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-latar text-base transition-colors hover:border-utama hover:text-utama"
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

