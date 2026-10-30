"use client";

import { useActionState } from "react";
import { simpanBannerAction, simpanKontakCabangAction } from "@/app/actions/pengaturan";

export default function FormPengaturanAdmin({ pengaturan }) {
  const [stateBanner, formActionBanner, isPendingBanner] = useActionState(
    simpanBannerAction,
    null
  );
  const [stateKontak, formActionKontak, isPendingKontak] = useActionState(
    simpanKontakCabangAction,
    null
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Form Banner Pengumuman (US-42) */}
      <section className="rounded-2xl border border-garis bg-latar p-6 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight">
          Banner Pengumuman Libur / Kuota Hotel
        </h2>
        <p className="mt-1 text-xs text-teks-lembut">
          Banner ini akan tampil mencolok di bagian paling atas seluruh halaman publik website.
        </p>

        <form action={formActionBanner} className="mt-5 flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="bannerAktif"
              defaultChecked={pengaturan.bannerAktif}
              className="h-4 w-4 rounded border-garis text-utama focus:ring-utama"
            />
            <span className="text-sm font-bold text-teks">
              Aktifkan Banner Pengumuman di Atas Website
            </span>
          </label>

          <div>
            <label htmlFor="bannerTeks" className="block text-xs font-bold text-teks mb-1">
              Teks Pengumuman *
            </label>
            <textarea
              id="bannerTeks"
              name="bannerTeks"
              rows={2}
              defaultValue={pengaturan.bannerTeks}
              placeholder="Contoh: 📢 Pemberitahuan: Petskarta Buka Normal & Reservasi Bunny Hotel Lebaran Tersisa 5 Kamar!"
              className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label htmlFor="bannerLink" className="block text-xs font-bold text-teks mb-1">
              Tautan Tujuan (Opsional)
            </label>
            <input
              id="bannerLink"
              type="text"
              name="bannerLink"
              defaultValue={pengaturan.bannerLink}
              placeholder="/cabang"
              className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>

          {stateBanner && (
            <div
              className={`rounded-xl p-3 text-xs font-semibold ${
                stateBanner.sukses
                  ? "bg-utama/15 text-utama border border-utama/30"
                  : "bg-bahaya/15 text-bahaya border border-bahaya/30"
              }`}
            >
              {stateBanner.pesan}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPendingBanner}
              className="rounded-lg bg-utama px-5 py-2.5 text-xs font-bold text-white hover:bg-utama-gelap disabled:opacity-50"
            >
              {isPendingBanner ? "Menyimpan..." : "Simpan Pengaturan Banner"}
            </button>
          </div>
        </form>
      </section>

      {/* Form Kontak & Multi-Cabang (US-43) */}
      <section className="rounded-2xl border border-garis bg-latar p-6 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight">
          Pengaturan Kontak WhatsApp Multi-Cabang
        </h2>
        <p className="mt-1 text-xs text-teks-lembut">
          Perbarui nomor WhatsApp cabang Pondok Pinang dan Jatinegara tanpa perlu mengubah kode sumber.
        </p>

        <form action={formActionKontak} className="mt-5 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="waCabang1" className="block text-xs font-bold text-teks mb-1">
                WhatsApp Cabang 1 - Pondok Pinang *
              </label>
              <input
                id="waCabang1"
                type="text"
                name="waCabang1"
                required
                defaultValue={pengaturan.nomorWaCabang1}
                placeholder="6281299992016"
                className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
              />
              <span className="text-[11px] text-teks-lembut">Format: 628xxxxxxxxxx</span>
            </div>

            <div>
              <label htmlFor="waCabang2" className="block text-xs font-bold text-teks mb-1">
                WhatsApp Cabang 2 - Jatinegara *
              </label>
              <input
                id="waCabang2"
                type="text"
                name="waCabang2"
                required
                defaultValue={pengaturan.nomorWaCabang2}
                placeholder="6281388882016"
                className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
              />
              <span className="text-[11px] text-teks-lembut">Format: 628xxxxxxxxxx</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="namaBisnis" className="block text-xs font-bold text-teks mb-1">
                Nama Bisnis
              </label>
              <input
                id="namaBisnis"
                type="text"
                name="namaBisnis"
                defaultValue={pengaturan.namaBisnis}
                className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="jamBuka" className="block text-xs font-bold text-teks mb-1">
                Jam Operasional
              </label>
              <input
                id="jamBuka"
                type="text"
                name="jamBuka"
                defaultValue={pengaturan.jamBuka}
                className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="alamat" className="block text-xs font-bold text-teks mb-1">
              Ringkasan Alamat Toko
            </label>
            <input
              id="alamat"
              type="text"
              name="alamat"
              defaultValue={pengaturan.alamat}
              className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>

          {stateKontak && (
            <div
              className={`rounded-xl p-3 text-xs font-semibold ${
                stateKontak.sukses
                  ? "bg-utama/15 text-utama border border-utama/30"
                  : "bg-bahaya/15 text-bahaya border border-bahaya/30"
              }`}
            >
              {stateKontak.pesan}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPendingKontak}
              className="rounded-lg bg-utama px-5 py-2.5 text-xs font-bold text-white hover:bg-utama-gelap disabled:opacity-50"
            >
              {isPendingKontak ? "Menyimpan..." : "Simpan Kontak Cabang"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

