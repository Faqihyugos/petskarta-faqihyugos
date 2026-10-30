"use client";

import Tombol from "@/components/Tombol";

// K-9: Error handling aman tanpa membocorkan stack trace atau detail internal server
export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-permukaan border border-garis text-4xl shadow-xs">
        🐰⚠️
      </div>

      <span className="mt-5 rounded-full border border-garis bg-permukaan px-3 py-1 text-xs font-bold text-teks-lembut">
        Pemberitahuan Sistem
      </span>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl text-teks">
        Terjadi Kendala pada Halaman Ini
      </h1>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-teks-lembut">
        Mohon maaf atas ketidaknyamanannya. Silakan coba muat ulang halaman atau kembali ke katalog utama.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap transition-colors"
        >
          Coba Lagi
        </button>
        <Tombol href="/" varian="garis">
          Kembali ke Katalog
        </Tombol>
      </div>
    </div>
  );
}

