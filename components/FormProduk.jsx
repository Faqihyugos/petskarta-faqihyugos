"use client";

import { useState, useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { generateDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, isPending] = useActionState(
    action || (async () => null),
    null
  );

  // Deteksi status awal jika tersimpan di produk.status atau di dalam deskripsi tag
  const initialStatus =
    produk.status ||
    (produk.deskripsi?.includes("[STATUS:PENUH]")
      ? "penuh"
      : produk.deskripsi?.includes("[STATUS:TERADOPSI]")
      ? "teradopsi"
      : "tersedia");

  const matchCoret = produk.deskripsi?.match(/\[(CORET|HARGA_ASLI):([0-9.]+)\]/i);
  const initialHargaCoret = matchCoret ? matchCoret[2].replace(/\./g, "") : "";

  const matchBadge = produk.deskripsi?.match(/\[BADGE:([^\]]+)\]/i);
  const initialBadge = matchBadge ? matchBadge[1].trim() : "";

  const cleanInitialDeskripsi = (produk.deskripsi || "")
    .replace(/\[STATUS:(PENUH|TERADOPSI|HABIS)\]/gi, "")
    .replace(/\[(CORET|HARGA_ASLI):[0-9.]+\]/gi, "")
    .replace(/\[BADGE:[^\]]+\]/gi, "")
    .trim();

  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(cleanInitialDeskripsi);
  const [status, setStatus] = useState(initialStatus);
  const [hargaCoret, setHargaCoret] = useState(initialHargaCoret);
  const [badge, setBadge] = useState(initialBadge);
  const [loadingAI, setLoadingAI] = useState(false);
  const [pesanAI, setPesanAI] = useState(null);

  const handleGenerateAI = async () => {
    if (!nama.trim()) {
      setPesanAI("Isi nama produk terlebih dahulu.");
      return;
    }

    setLoadingAI(true);
    setPesanAI(null);
    try {
      const res = await generateDeskripsiAI({ nama, kategori });
      if (res?.error) {
        setPesanAI(res.error);
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
      }
    } catch {
      setPesanAI("Gagal membuat deskripsi dengan AI.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm font-medium text-bahaya">
          {state.error}
        </div>
      )}

      {produk.id && <input type="hidden" name="id" defaultValue={produk.id} />}

      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Harga Jual / Promo (Rp)"
          name="harga"
          type="number"
          min="0"
          defaultValue={produk.harga}
          required
        />
        <Input
          label="Harga Coret / Asli (Opsional)"
          name="harga_coret"
          type="number"
          min="0"
          placeholder="Contoh: 120000"
          value={hargaCoret}
          onChange={(e) => setHargaCoret(e.target.value)}
        />
      </div>

      {/* Badge Promo & Kepercayaan (US-20) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-teks">
          Badge Promo &amp; Kepercayaan (US-20)
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={
              [
                "",
                "Promo Mudik Lebaran",
                "Fasilitas AC & CCTV",
                "Garansi Bebas Scabies",
                "Best Seller",
              ].includes(badge)
                ? badge
                : "custom"
            }
            onChange={(e) => {
              if (e.target.value !== "custom") {
                setBadge(e.target.value);
              }
            }}
            className="rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
          >
            <option value="">(Otomatis berdasarkan kategori)</option>
            <option value="Promo Mudik Lebaran">Promo Mudik Lebaran</option>
            <option value="Fasilitas AC & CCTV">Fasilitas AC &amp; CCTV</option>
            <option value="Garansi Bebas Scabies">Garansi Bebas Scabies</option>
            <option value="Best Seller">Best Seller</option>
            <option value="custom">Kustom / Lainnya...</option>
          </select>
          <input
            type="text"
            name="badge"
            placeholder="Tulis badge khusus..."
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="flex-1 rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>
      </div>
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <div className="flex flex-col gap-1.5">
        <Input
          label="Link foto (Mendukung multi-foto)"
          name="foto_url"
          placeholder="https://... atau pisahkan beberapa URL dengan koma (,)"
          defaultValue={produk.foto_url}
        />
        <p className="text-xs text-teks-lembut">
          Untuk galeri foto (US-18), Anda dapat memasukkan lebih dari satu URL foto yang dipisahkan tanda koma (,).
        </p>
      </div>

      {/* Status Ketersediaan - US-19 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-teks">
          Status Ketersediaan
        </label>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
        >
          <option value="tersedia">Tersedia (Ready Adopsi / Kamar Tersedia)</option>
          <option value="teradopsi">Sudah Teradopsi (Kelinci)</option>
          <option value="penuh">Kamar Penuh (Hotel &amp; Daycare)</option>
        </select>
        <p className="text-xs text-teks-lembut">
          Item dengan status &quot;Sudah Teradopsi&quot; atau &quot;Kamar Penuh&quot; otomatis menampilkan badge status dan tombol WhatsApp beralih ke daftar tunggu.
        </p>
      </div>

      {/* Deskripsi & Tombol Bantuan AI (Gemini) - US-14 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-teks">Deskripsi</label>
          <button
            type="button"
            disabled={loadingAI}
            onClick={handleGenerateAI}
            className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-permukaan px-2.5 py-1 text-xs font-semibold text-utama transition hover:border-utama hover:bg-latar disabled:opacity-50"
          >
            <svg
              className="h-3.5 w-3.5 text-utama"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {loadingAI ? "Membuat dengan AI..." : "Buat dengan AI (Gemini)"}
          </button>
        </div>

        {pesanAI && (
          <p className="text-xs font-medium text-bahaya">{pesanAI}</p>
        )}

        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Deskripsi karakteristik kelinci atau rincian layanan..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
