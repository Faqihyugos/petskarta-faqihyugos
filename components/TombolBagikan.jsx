"use client";

import { useState } from "react";

export default function TombolBagikan({ judul, deskripsi, url }) {
  const [tersalin, setTersalin] = useState(false);

  const handleBagikan = async () => {
    const targetUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData = {
      title: judul || "Petskarta",
      text: deskripsi ? `${judul} - ${deskripsi}` : judul,
      url: targetUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User aborted share or unsupported, fallback to clipboard
        if (err.name === "AbortError") return;
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(targetUrl);
        setTersalin(true);
        setTimeout(() => setTersalin(false), 2500);
      } catch {
        // Fallback prompt
        window.prompt("Salin tautan ini:", targetUrl);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleBagikan}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
        tersalin
          ? "border-utama bg-utama/10 text-utama"
          : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
      }`}
      title="Bagikan atau salin tautan"
    >
      <span>{tersalin ? "✓" : "🔗"}</span>
      <span>{tersalin ? "Tautan berhasil disalin!" : "Bagikan"}</span>
    </button>
  );
}

