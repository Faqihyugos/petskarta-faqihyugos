"use client";

import { useState, useActionState } from "react";
import { kirimUlasanAction } from "@/app/actions/ulasan";

export default function TrustCenter({ ulasanList = [], ratingGoogle = "5.0", totalGoogle = 178 }) {
  const [bukaForm, setBukaForm] = useState(false);
  const [bintangPilihan, setBintangPilihan] = useState(5);

  const [state, formAction, isPending] = useActionState(kirimUlasanAction, null);

  // Kalkulasi rata-rata rating secara dinamis (US-38)
  const totalItem = ulasanList.length;
  const totalSkor = ulasanList.reduce((acc, cur) => acc + (cur.rating || 5), 0);
  const rataRata = totalItem > 0 ? (totalSkor / totalItem).toFixed(1) : ratingGoogle;

  return (
    <section
      aria-labelledby="judul-trust-center"
      className="my-12 rounded-3xl border border-garis bg-permukaan/60 p-6 sm:p-10 shadow-xs"
    >
      {/* Header & Lencana Google 5.0 */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-utama/30 bg-utama/10 px-3 py-1 text-xs font-bold text-utama">
            <span>🛡️</span>
            <span>Trust Center &amp; Kredibilitas Petskarta</span>
          </div>
          <h2
            id="judul-trust-center"
            className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            Google Reviews 5.0 Bintang Sempurna
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-teks-lembut">
            Bukti nyata kepuasan ratusan adopter dan pemilik kelinci di Jakarta sejak 2016. Seluruh layanan Bunny Hotel ber-AC, pengiriman luar kota bergaransi, dan penanganan scabies terbukti aman.
          </p>
        </div>

        {/* Lencana Skor Rating */}
        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-garis bg-latar p-5 shadow-xs">
          <div className="text-center">
            <span className="text-4xl font-extrabold text-teks">{rataRata}</span>
            <div className="mt-1 flex items-center justify-center text-amber-500">
              {"★".repeat(5)}
            </div>
            <p className="mt-1 text-[11px] font-bold text-teks-lembut">
              {totalGoogle}+ Ulasan Google
            </p>
          </div>
          <div className="h-12 w-px bg-garis"></div>
          <button
            type="button"
            onClick={() => setBukaForm(!bukaForm)}
            className="rounded-xl bg-utama px-4 py-2.5 text-xs font-bold text-white hover:bg-utama-gelap transition-colors shadow-xs"
          >
            {bukaForm ? "Tutup Form" : "✍️ Beri Ulasan"}
          </button>
        </div>
      </div>

      {/* Form Tambah Ulasan Interaktif (US-38) */}
      {bukaForm && (
        <div className="mt-8 rounded-2xl border border-garis bg-latar p-6 shadow-sm">
          <h3 className="text-lg font-bold">Bagikan Pengalaman Anda di Petskarta</h3>
          <p className="mt-1 text-xs text-teks-lembut">
            Ulasan Anda sangat berarti untuk membantu calon adopter lain dan menjaga komitmen kualitas kami.
          </p>

          <form action={formAction} className="mt-4 flex flex-col gap-4">
            {/* Honeypot field (anti-spam) */}
            <input
              type="text"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            <div>
              <label className="block text-xs font-bold text-teks mb-1">
                Bintang Penilaian
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setBintangPilihan(star)}
                    className="text-2xl transition hover:scale-110"
                  >
                    <span
                      className={
                        star <= bintangPilihan ? "text-amber-500" : "text-gray-300 dark:text-gray-600"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
                <span className="text-xs font-bold text-teks ml-2">
                  {bintangPilihan} dari 5 Bintang
                </span>
                <input type="hidden" name="rating" value={bintangPilihan} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nama-ulasan" className="block text-xs font-bold text-teks mb-1">
                  Nama Anda *
                </label>
                <input
                  id="nama-ulasan"
                  type="text"
                  name="nama"
                  required
                  placeholder="Contoh: Sarah A. (Jakarta Selatan)"
                  className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="isi-ulasan" className="block text-xs font-bold text-teks mb-1">
                Ulasan / Pengalaman Anda *
              </label>
              <textarea
                id="isi-ulasan"
                name="komentar"
                required
                rows={3}
                placeholder="Ceritakan pengalaman adopsi kelinci, kondisi kamar hotel ber-AC, atau hasil perawatan scabies..."
                className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
              ></textarea>
            </div>

            {state && (
              <div
                className={`rounded-xl p-3 text-xs font-semibold ${
                  state.sukses
                    ? "bg-utama/15 text-utama border border-utama/30"
                    : "bg-bahaya/15 text-bahaya border border-bahaya/30"
                }`}
              >
                {state.pesan}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBukaForm(false)}
                className="rounded-lg border border-garis px-4 py-2 text-xs font-semibold text-teks-lembut hover:text-teks"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-utama px-5 py-2 text-xs font-bold text-white hover:bg-utama-gelap disabled:opacity-50"
              >
                {isPending ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Kutipan Testimoni Nyata */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ulasanList.slice(0, 4).map((item, idx) => (
          <article
            key={item.id || idx}
            className="flex flex-col justify-between rounded-2xl border border-garis bg-latar p-5 shadow-2xs hover:border-utama/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <div className="flex text-amber-500 text-xs">
                  {"★".repeat(item.rating || 5)}
                </div>
                <span className="rounded-md bg-permukaan px-2 py-0.5 text-[10px] font-semibold text-teks-lembut">
                  {item.sumber || "Google Reviews"}
                </span>
              </div>

              <blockquote className="mt-3 text-xs leading-relaxed text-teks-lembut italic line-clamp-4">
                &ldquo;{item.komentar}&rdquo;
              </blockquote>
            </div>

            <div className="mt-4 pt-3 border-t border-garis/60">
              <p className="font-bold text-xs text-teks truncate">{item.nama}</p>
              {item.layanan && (
                <p className="text-[10px] text-utama font-semibold truncate">
                  {item.layanan}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

