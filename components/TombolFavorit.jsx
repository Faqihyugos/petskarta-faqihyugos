"use client";

import { useFavorit } from "@/context/FavoritContext";

export default function TombolFavorit({ id, nama, ukuran = "sedang" }) {
  const { isFavorit, toggleFavorit, sudahDimuat } = useFavorit();
  const aktif = sudahDimuat ? isFavorit(id) : false;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorit(id);
  };

  const ukuranKelas =
    ukuran === "kecil"
      ? "h-8 w-8 text-sm"
      : ukuran === "besar"
      ? "h-10 w-10 text-base"
      : "h-9 w-9 text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={aktif ? `Hapus ${nama} dari favorit` : `Tambahkan ${nama} ke favorit`}
      className={`inline-flex items-center justify-center rounded-full border transition-all ${ukuranKelas} ${
        aktif
          ? "border-bahaya/30 bg-bahaya/10 text-bahaya shadow-xs scale-105"
          : "border-garis bg-latar/90 text-teks-lembut hover:border-bahaya/40 hover:text-bahaya hover:scale-105 backdrop-blur-xs"
      }`}
      title={aktif ? "Tersimpan di Favorit" : "Simpan ke Favorit"}
    >
      <svg
        className={`h-4 w-4 transition-transform ${aktif ? "fill-bahaya text-bahaya" : "fill-none text-current"}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}

