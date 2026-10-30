"use client";

import { useState } from "react";

export default function GaleriProduk({ fotoUrl, nama }) {
  // Parse foto_url: bisa berisi satu URL atau beberapa URL (dipisahkan koma atau baris baru)
  const daftarFoto = (fotoUrl || "/produk/kelinci.svg")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const [fotoAktif, setFotoAktif] = useState(daftarFoto[0] || "/produk/kelinci.svg");

  return (
    <div className="flex flex-col gap-3">
      {/* Foto Pratinjau Utama */}
      <div className="overflow-hidden rounded-2xl border border-garis bg-permukaan">
        <img
          src={fotoAktif}
          alt={nama || "Foto produk"}
          className="aspect-square w-full object-cover transition duration-300"
        />
      </div>

      {/* Thumbnail Galeri Interaktif (Hanya tampil jika ada lebih dari 1 foto) */}
      {daftarFoto.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {daftarFoto.map((foto, idx) => {
            const aktif = fotoAktif === foto;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setFotoAktif(foto)}
                aria-label={`Lihat foto ${idx + 1}`}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  aktif
                    ? "border-utama ring-2 ring-utama/20"
                    : "border-garis opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={foto}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

