"use client";

import { useState } from "react";
import { useKeranjang } from "@/context/KeranjangContext";

export default function TombolTambahKeranjang({ produk, varian = "detail" }) {
  const { tambahItem, bukaDrawer } = useKeranjang();
  const [sudahDitambah, setSudahDitambah] = useState(false);

  const handleTambah = (e) => {
    e.preventDefault();
    e.stopPropagation();
    tambahItem(produk, 1);
    setSudahDitambah(true);
    setTimeout(() => {
      setSudahDitambah(false);
    }, 1500);
  };

  if (varian === "kartu") {
    return (
      <button
        type="button"
        onClick={handleTambah}
        title="Tambah ke keranjang"
        aria-label={`Tambah ${produk.nama} ke keranjang`}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
          sudahDitambah
            ? "border-utama bg-utama text-white shadow-xs"
            : "border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
        }`}
      >
        {sudahDitambah ? (
          <span className="text-xs font-bold">✓</span>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleTambah}
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition active:scale-[0.99] ${
          sudahDitambah
            ? "border-utama bg-utama text-white shadow-sm"
            : "border-garis bg-permukaan text-teks hover:border-utama hover:bg-latar"
        }`}
      >
        <span>
          {sudahDitambah ? "✓ Dimasukkan ke Keranjang" : "🛒 Tambah ke Keranjang"}
        </span>
      </button>
      <button
        type="button"
        onClick={() => {
          tambahItem(produk, 1);
          bukaDrawer();
        }}
        className="rounded-xl border border-garis bg-permukaan px-3 py-3 text-xs font-bold text-teks-lembut transition hover:border-utama hover:text-utama"
        title="Lihat Keranjang"
      >
        Lihat Keranjang
      </button>
    </div>
  );
}

