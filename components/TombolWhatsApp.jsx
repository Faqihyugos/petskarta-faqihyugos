"use client";

import { useState, useMemo } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import { cekKetersediaan } from "@/lib/ketersediaan";

export default function TombolWhatsApp({ produk }) {
  if (!produk) return null;

  const isHotel = produk.kategori?.toLowerCase().includes("hotel");
  const cabangList = toko.cabang || [];
  const { tersedia, label, labelTombol } = cekKetersediaan(produk);

  // Default cabang: Jatinegara untuk hotel/scabies, atau Pondok Pinang untuk adopsi
  const defaultCabangId =
    cabangList.find((c) =>
      produk.kategori?.toLowerCase().includes("hotel")
        ? c.id === "jatinegara"
        : c.id === "pondok-pinang"
    )?.id || cabangList[0]?.id;

  const [cabangId, setCabangId] = useState(defaultCabangId);
  const [tanggal, setTanggal] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [catatan, setCatatan] = useState("");

  const cabangTerpilih =
    cabangList.find((c) => c.id === cabangId) || cabangList[0];
  const nomorWhatsApp = cabangTerpilih?.nomorWhatsApp || toko.nomorWhatsApp;
  const namaCabang = cabangTerpilih?.nama || toko.nama;

  const pesanWhatsApp = useMemo(() => {
    const hargaFormatted = formatRupiah(produk.harga);

    // US-19: Format pesan daftar tunggu jika status penuh/teradopsi
    if (!tersedia) {
      return (
        `Halo Admin Petskarta (${namaCabang}),\n` +
        `Saya tertarik dengan: ${produk.nama} (${hargaFormatted}).\n` +
        `Karena statusnya saat ini [${label}], saya ingin berkonsultasi untuk masuk ke daftar tunggu (waiting list) apabila tersedia slot/jadwal berikutnya.\n` +
        `- Rencana/Jadwal: ${tanggal || "Menyesuaikan"}\n` +
        `- Catatan Kebutuhan Khusus: ${catatan.trim() || "-"}\n` +
        `Mohon info lebih lanjut. Terima kasih!`
      );
    }

    if (isHotel) {
      const jadwalStr =
        tanggal && tanggalSelesai
          ? `${tanggal} s.d. ${tanggalSelesai}`
          : tanggal || "Sesuai konfirmasi";
      return (
        `Halo Admin Petskarta (${namaCabang}),\n` +
        `Saya ingin melakukan reservasi Bunny Hotel:\n` +
        `- Paket: ${produk.nama} (${hargaFormatted})\n` +
        `- Jadwal: ${jadwalStr}\n` +
        `- Catatan Kebutuhan Khusus: ${catatan.trim() || "-"}\n` +
        `Mohon info ketersediaan slot kamar. Terima kasih!`
      );
    }

    const isAdopsi = produk.kategori?.toLowerCase().includes("kelinci");
    if (isAdopsi) {
      return (
        `Halo Admin Petskarta (${namaCabang}),\n` +
        `Saya tertarik untuk mengadopsi kelinci:\n` +
        `- Ras/Nama: ${produk.nama}\n` +
        `- Harga: ${hargaFormatted}\n` +
        `- Rencana/Jadwal: ${tanggal || "Segera"}\n` +
        `- Catatan Kebutuhan Khusus: ${catatan.trim() || "-"}\n` +
        `Apakah masih ready dan melayani pengiriman bergaransi? Terima kasih!`
      );
    }

    return (
      `Halo Admin Petskarta (${namaCabang}),\n` +
      `Saya ingin memesan / reservasi:\n` +
      `- Layanan: ${produk.nama} (${hargaFormatted})\n` +
      `- Jadwal: ${tanggal || "Sesuai konfirmasi"}\n` +
      `- Catatan Kebutuhan Khusus: ${catatan.trim() || "-"}\n` +
      `Mohon info jadwal dan ketersediaan. Terima kasih!`
    );
  }, [produk, namaCabang, isHotel, tersedia, label, tanggal, tanggalSelesai, catatan]);

  const urlWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(
    pesanWhatsApp
  )}`;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan/50 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
          Form Pemesanan & Reservasi
        </h3>
        {!tersedia && (
          <span className="rounded-md bg-bahaya px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            {label}
          </span>
        )}
      </div>

      {!tersedia && (
        <div className="rounded-xl border border-garis bg-permukaan p-3 text-xs font-medium text-teks-lembut">
          Item ini berstatus <strong className="text-bahaya">{label}</strong>. Tombol pemesanan dialihkan ke konsultasi daftar tunggu (waiting list).
        </div>
      )}

      {/* Pilihan Cabang */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-teks">
          Pilih Cabang Tujuan
        </label>
        <select
          value={cabangId}
          onChange={(e) => setCabangId(e.target.value)}
          className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
        >
          {cabangList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nama}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-teks-lembut">
          {cabangTerpilih?.layanan}
        </p>
      </div>

      {/* Tanggal / Jadwal */}
      {isHotel ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-teks">
              Tanggal Check-in
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-teks">
              Tanggal Check-out
            </label>
            <input
              type="date"
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-teks">
            Rencana Tanggal / Jadwal Kunjungan
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
          />
        </div>
      )}

      {/* Catatan Khusus */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-teks">
          Catatan Kebutuhan Khusus Hewan (Opsional)
        </label>
        <textarea
          rows={2}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Contoh: Sedang pengobatan jamur, alergi pakan tertentu, atau permintaan fasilitas..."
          className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      {/* Tombol WhatsApp */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white shadow-sm transition ${
          !tersedia
            ? "bg-teks hover:bg-teks/90"
            : "bg-utama hover:bg-utama-gelap"
        }`}
      >
        <svg
          className="h-5 w-5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.894-.798-1.498-1.784-1.674-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.101-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.508-.678-.518-.176-.009-.377-.01-.578-.01-.2 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.113.15.2 2.123 3.242 5.143 4.547.718.311 1.279.497 1.716.636.721.23 1.377.197 1.895.12.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.304.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 21.785h-.002a9.78 9.78 0 01-4.982-1.365l-.357-.212-3.705.972.989-3.613-.232-.369a9.773 9.773 0 01-1.503-5.21c0-5.405 4.398-9.803 9.806-9.803a9.75 9.75 0 016.93 2.873 9.754 9.754 0 012.872 6.931c0 5.406-4.398 9.805-9.803 9.805zM12.04 0C5.4 0 0 5.4 0 12.042c0 2.122.554 4.194 1.606 6.015L0 24l6.104-1.602a11.98 11.98 0 005.936 1.558h.005c6.64 0 12.04-5.401 12.04-12.044 0-3.218-1.253-6.243-3.528-8.519C18.282 1.254 15.258 0 12.04 0z" />
        </svg>
        {labelTombol}
      </a>
    </div>
  );
}
