"use client";

import { useKeranjang } from "@/context/KeranjangContext";

export default function TombolKeranjangHeader() {
  const { totalItem, bukaDrawer } = useKeranjang();

  return (
    <button
      type="button"
      onClick={bukaDrawer}
      aria-label={`Buka keranjang belanja (${totalItem} item)`}
      className="relative flex items-center gap-1.5 rounded-full border border-garis bg-permukaan px-3 py-1.5 text-xs font-bold text-teks transition hover:border-utama hover:bg-latar"
    >
      <svg
        className="h-4 w-4 text-utama"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span>Keranjang</span>
      {totalItem > 0 && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-utama px-1 text-[11px] font-extrabold text-white">
          {totalItem}
        </span>
      )}
    </button>
  );
}

