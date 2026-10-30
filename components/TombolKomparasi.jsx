"use client";

import { useKomparasi } from "@/context/KomparasiContext";

export default function TombolKomparasi({ produk }) {
  const { isKomparasi, tambahKomparasi } = useKomparasi();
  const aktif = isKomparasi(produk.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        tambahKomparasi(produk);
      }}
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
        aktif
          ? "border-utama bg-utama text-white"
          : "border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
      }`}
      title={aktif ? "Keluarkan dari komparasi" : "Bandingkan kelinci/layanan ini"}
    >
      <span>⚖️</span>
      <span>{aktif ? "Dibandingkan" : "Bandingkan"}</span>
    </button>
  );
}

