"use client";

import { useState } from "react";
import { useKeranjang } from "@/context/KeranjangContext";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function DrawerKeranjang() {
  const {
    items,
    isDrawerBuka,
    tutupDrawer,
    tambahItem,
    kurangItem,
    hapusItem,
    kosongkanKeranjang,
    totalItem,
    totalBiaya,
  } = useKeranjang();

  const cabangList = toko.cabang || [];
  const [cabangId, setCabangId] = useState(cabangList[0]?.id || "pondok-pinang");
  const [catatan, setCatatan] = useState("");

  if (!isDrawerBuka) return null;

  const cabangTerpilih =
    cabangList.find((c) => c.id === cabangId) || cabangList[0];
  const nomorWA = cabangTerpilih?.nomorWhatsApp || toko.nomorWhatsApp;
  const namaCabang = cabangTerpilih?.nama || toko.nama;

  const handleCheckoutWA = () => {
    if (items.length === 0) return;

    let rincianItem = items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.nama} (x${it.qty}) - ${formatRupiah(it.harga * it.qty)}`
      )
      .join("\n");

    const pesan =
      `Halo Admin Petskarta (${namaCabang}),\n` +
      `Saya ingin memesan beberapa item dari keranjang katalog Petskarta:\n\n` +
      `${rincianItem}\n` +
      `-----------------------------------\n` +
      `Total Estimasi: ${formatRupiah(totalBiaya)}\n` +
      `Cabang Pengambilan/Tujuan: ${namaCabang}\n` +
      `Catatan Khusus: ${catatan.trim() || "-"}\n\n` +
      `Mohon konfirmasi ketersediaan stok/slot dan langkah pembayarannya. Terima kasih!`;

    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={tutupDrawer}
        aria-hidden="true"
      />

      {/* Panel Drawer */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-latar shadow-2xl transition">
        {/* Header Drawer */}
        <div className="flex items-center justify-between border-b border-garis px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-bold text-teks">
              Keranjang Pemesanan ({totalItem})
            </h2>
          </div>
          <button
            type="button"
            onClick={tutupDrawer}
            className="rounded-lg p-1 text-teks-lembut hover:bg-permukaan hover:text-teks"
            aria-label="Tutup keranjang"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Konten / Daftar Item */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="text-5xl">🐰</span>
              <p className="mt-3 text-base font-bold text-teks">
                Keranjang Anda masih kosong
              </p>
              <p className="mt-1 text-sm text-teks-lembut">
                Pilih kelinci hias, starter kit, atau paket hotel favorit Anda
                dari katalog.
              </p>
              <button
                type="button"
                onClick={tutupDrawer}
                className="mt-5 rounded-xl bg-utama px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-utama/90"
              >
                Lihat Katalog Petskarta
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-garis bg-permukaan p-3"
                >
                  <img
                    src={item.foto_url}
                    alt={item.nama}
                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <p className="text-[11px] text-teks-lembut">
                          {item.kategori}
                        </p>
                        <h4 className="text-sm font-semibold leading-tight text-teks">
                          {item.nama}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => hapusItem(item.id)}
                        className="text-teks-lembut hover:text-bahaya"
                        title="Hapus item"
                        aria-label="Hapus item"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs font-bold text-harga">
                        {formatRupiah(item.harga * item.qty)}
                      </p>
                      {/* Kontrol Kuantitas */}
                      <div className="flex items-center rounded-lg border border-garis bg-latar">
                        <button
                          type="button"
                          onClick={() => kurangItem(item.id)}
                          className="px-2 py-0.5 text-xs font-bold text-teks hover:bg-permukaan"
                          aria-label="Kurangi jumlah"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-teks">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => tambahItem(item, 1)}
                          className="px-2 py-0.5 text-xs font-bold text-teks hover:bg-permukaan"
                          aria-label="Tambah jumlah"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Opsi Pengosongan Keranjang */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={kosongkanKeranjang}
                  className="text-xs text-teks-lembut hover:text-bahaya hover:underline"
                >
                  Kosongkan semua keranjang
                </button>
              </div>

              {/* Formulir Cabang & Catatan Pesanan */}
              <div className="mt-2 flex flex-col gap-3 border-t border-garis pt-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-teks">
                    Pilih Cabang Tujuan
                  </label>
                  <select
                    value={cabangId}
                    onChange={(e) => setCabangId(e.target.value)}
                    className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-xs text-teks focus:border-utama focus:outline-none"
                  >
                    {cabangList.map((cb) => (
                      <option key={cb.id} value={cb.id}>
                        {cb.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-teks">
                    Catatan Kebutuhan Khusus (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Titip hotel mulai H-2 Lebaran, pilihkan starter kit warna hijau..."
                    className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-xs text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Drawer / Checkout WhatsApp */}
        {items.length > 0 && (
          <div className="border-t border-garis bg-permukaan p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-teks-lembut">
                Total Estimasi ({totalItem} item):
              </span>
              <span className="text-lg font-extrabold text-harga">
                {formatRupiah(totalBiaya)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckoutWA}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#20ba59] active:scale-[0.99]"
            >
              <svg
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.477-.15-.678.15-.2.301-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.235-.245-.587-.494-.508-.678-.517l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.511 1.079 2.912 1.23 3.113c.15.201 2.123 3.242 5.143 4.547.719.311 1.28.497 1.718.636.722.23 1.378.198 1.897.12.578-.088 1.78-.728 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.126-.277-.201-.578-.352z" />
              </svg>
              Pesan Semua via WhatsApp
            </button>
            <p className="mt-2 text-center text-[11px] text-teks-lembut">
              Rincian pesanan langsung tersusun rapi di WhatsApp Admin {namaCabang}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

