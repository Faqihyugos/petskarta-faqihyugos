"use client";

import { useState, useActionState } from "react";
import { simpanSistemWhiteLabelAction } from "@/app/actions/sistem";
import { PRESET_TEMA } from "@/lib/tema-presets";

export default function FormSistemWhiteLabel({ pengaturan }) {
  const [state, formAction, isPending] = useActionState(
    simpanSistemWhiteLabelAction,
    null
  );

  const [namaBisnis, setNamaBisnis] = useState(
    pengaturan.namaBisnis || "Petskarta"
  );
  const [tagline, setTagline] = useState(
    pengaturan.tagline ||
      "Spesialis layanan dan katalog produk UMKM terpercaya."
  );
  const [logoEmoji, setLogoEmoji] = useState(pengaturan.logoEmoji || "🐰");
  const [logoUrl, setLogoUrl] = useState(pengaturan.logoUrl || "");
  const [teksFooter, setTeksFooter] = useState(
    pengaturan.teksFooter ||
      "Melayani pelanggan dengan standar kualitas dan kepercayaan terpercaya."
  );

  const [temaPreset, setTemaPreset] = useState(
    pengaturan.temaPreset || "emerald"
  );
  const [warnaUtama, setWarnaUtama] = useState(
    pengaturan.warnaUtama || "#1f6b4f"
  );
  const [warnaUtamaGelap, setWarnaUtamaGelap] = useState(
    pengaturan.warnaUtamaGelap || "#154d39"
  );
  const [warnaHarga, setWarnaHarga] = useState(
    pengaturan.warnaHarga || "#7a4e09"
  );
  const [warnaHargaLatar, setWarnaHargaLatar] = useState(
    pengaturan.warnaHargaLatar || "#fbefd8"
  );

  const pilihPreset = (id) => {
    const preset = PRESET_TEMA[id];
    if (!preset) return;
    setTemaPreset(id);
    setWarnaUtama(preset.warnaUtama);
    setWarnaUtamaGelap(preset.warnaUtamaGelap);
    setWarnaHarga(preset.warnaHarga);
    setWarnaHargaLatar(preset.warnaHargaLatar);
    if (!logoUrl) {
      setLogoEmoji(preset.emoji);
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {/* 1. Live Preview Interaktif */}
      <section className="rounded-3xl border border-garis bg-permukaan/60 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-garis bg-latar px-3 py-1 text-xs font-bold text-teks">
              <span>👁️</span>
              <span>Live Preview Branding &amp; Tema</span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-teks">
              Pratinjau Tampilan Saat Ini
            </h2>
          </div>
          <span className="text-xs font-semibold text-teks-lembut">
            Preset: <strong className="capitalize">{temaPreset}</strong>
          </span>
        </div>

        {/* Mini Preview Window */}
        <div className="overflow-hidden rounded-2xl border border-garis bg-latar shadow-sm">
          {/* Header Preview */}
          <div className="flex items-center justify-between border-b border-garis px-4 py-3 bg-latar">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{logoEmoji}</span>
              <span
                className="text-base font-extrabold tracking-tight"
                style={{ color: warnaUtama }}
              >
                {namaBisnis || "Nama Bisnis Anda"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-1 text-xs font-bold text-white shadow-xs transition-colors"
                style={{ backgroundColor: warnaUtama }}
              >
                Pesan Sekarang
              </button>
            </div>
          </div>

          {/* Hero & Card Preview */}
          <div className="p-5">
            <h3 className="text-xl font-extrabold text-teks">
              {namaBisnis || "Nama Bisnis Anda"}
            </h3>
            <p className="mt-1 text-xs text-teks-lembut">{tagline}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-garis p-3 flex flex-col gap-2 bg-permukaan/30">
                <span className="text-xs font-bold text-teks">
                  Contoh Kartu Produk
                </span>
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-md px-2 py-0.5 text-xs font-bold"
                    style={{
                      color: warnaHarga,
                      backgroundColor: warnaHargaLatar,
                    }}
                  >
                    Rp 150.000
                  </span>
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: warnaUtama }}
                  >
                    Best Seller
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pemilihan Preset Tema Warna */}
      <section className="rounded-2xl border border-garis bg-latar p-6 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight">
          Pilihan Preset Tema Warna
        </h2>
        <p className="mt-1 text-xs text-teks-lembut">
          Pilih salah satu palet tema siap pakai yang sesuai dengan identitas industri bisnis Anda.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(PRESET_TEMA).map((preset) => {
            const aktif = temaPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => pilihPreset(preset.id)}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  aktif
                    ? "border-utama ring-2 ring-utama/30 bg-permukaan/60 shadow-xs"
                    : "border-garis bg-latar hover:border-garis/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{preset.emoji}</span>
                    {aktif && (
                      <span className="rounded-full bg-utama px-2 py-0.5 text-[10px] font-bold text-white">
                        Aktif
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-teks">
                    {preset.nama}
                  </h3>
                  <p className="text-[11px] text-teks-lembut">
                    {preset.industri}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-garis/60">
                  <div
                    className="h-5 w-5 rounded-full border border-garis"
                    style={{ backgroundColor: preset.warnaUtama }}
                    title={`Utama: ${preset.warnaUtama}`}
                  />
                  <div
                    className="h-5 w-5 rounded-full border border-garis"
                    style={{ backgroundColor: preset.warnaUtamaGelap }}
                    title={`Utama Gelap: ${preset.warnaUtamaGelap}`}
                  />
                  <div
                    className="h-5 w-5 rounded-full border border-garis"
                    style={{ backgroundColor: preset.warnaHarga }}
                    title={`Aksen/Harga: ${preset.warnaHarga}`}
                  />
                  <div
                    className="h-5 w-5 rounded-full border border-garis"
                    style={{ backgroundColor: preset.warnaHargaLatar }}
                    title={`Latar Harga: ${preset.warnaHargaLatar}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Penyesuaian Warna Kustom (Color Picker) */}
      <section className="rounded-2xl border border-garis bg-latar p-6 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight">
          Penyesuaian Warna Kustom (Color Picker)
        </h2>
        <p className="mt-1 text-xs text-teks-lembut">
          Sesuaikan kode warna heksadesimal jika brand Anda memiliki pedoman warna (*brand guidelines*) khusus.
        </p>

        <input type="hidden" name="temaPreset" value={temaPreset} />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Warna Utama */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-teks">
              Warna Utama (Tombol &amp; Teks Brand)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={warnaUtama}
                onChange={(e) => {
                  setWarnaUtama(e.target.value);
                  setTemaPreset("custom");
                }}
                className="h-9 w-10 cursor-pointer rounded-lg border border-garis bg-transparent p-1"
              />
              <input
                type="text"
                name="warnaUtama"
                value={warnaUtama}
                onChange={(e) => {
                  setWarnaUtama(e.target.value);
                  setTemaPreset("custom");
                }}
                className="flex-1 rounded-xl border border-garis bg-latar px-3 py-2 text-xs font-mono text-teks uppercase"
              />
            </div>
          </div>

          {/* Warna Utama Hover */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-teks">
              Warna Hover / Gelap
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={warnaUtamaGelap}
                onChange={(e) => {
                  setWarnaUtamaGelap(e.target.value);
                  setTemaPreset("custom");
                }}
                className="h-9 w-10 cursor-pointer rounded-lg border border-garis bg-transparent p-1"
              />
              <input
                type="text"
                name="warnaUtamaGelap"
                value={warnaUtamaGelap}
                onChange={(e) => {
                  setWarnaUtamaGelap(e.target.value);
                  setTemaPreset("custom");
                }}
                className="flex-1 rounded-xl border border-garis bg-latar px-3 py-2 text-xs font-mono text-teks uppercase"
              />
            </div>
          </div>

          {/* Warna Aksen / Harga */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-teks">
              Warna Aksen / Harga
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={warnaHarga}
                onChange={(e) => {
                  setWarnaHarga(e.target.value);
                  setTemaPreset("custom");
                }}
                className="h-9 w-10 cursor-pointer rounded-lg border border-garis bg-transparent p-1"
              />
              <input
                type="text"
                name="warnaHarga"
                value={warnaHarga}
                onChange={(e) => {
                  setWarnaHarga(e.target.value);
                  setTemaPreset("custom");
                }}
                className="flex-1 rounded-xl border border-garis bg-latar px-3 py-2 text-xs font-mono text-teks uppercase"
              />
            </div>
          </div>

          {/* Warna Latar Harga */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-teks">
              Latar Label Harga
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={warnaHargaLatar}
                onChange={(e) => {
                  setWarnaHargaLatar(e.target.value);
                  setTemaPreset("custom");
                }}
                className="h-9 w-10 cursor-pointer rounded-lg border border-garis bg-transparent p-1"
              />
              <input
                type="text"
                name="warnaHargaLatar"
                value={warnaHargaLatar}
                onChange={(e) => {
                  setWarnaHargaLatar(e.target.value);
                  setTemaPreset("custom");
                }}
                className="flex-1 rounded-xl border border-garis bg-latar px-3 py-2 text-xs font-mono text-teks uppercase"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pengaturan Identitas Bisnis (White-Label) */}
      <section className="rounded-2xl border border-garis bg-latar p-6 shadow-xs">
        <h2 className="text-xl font-bold tracking-tight">
          Identitas Bisnis &amp; White-Label Branding
        </h2>
        <p className="mt-1 text-xs text-teks-lembut">
          Ubah nama toko, slogan, dan logo brand agar website tampil profesional sesuai bisnis Anda.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="namaBisnis" className="block text-xs font-bold text-teks mb-1">
              Nama Bisnis / Toko *
            </label>
            <input
              id="namaBisnis"
              type="text"
              name="namaBisnis"
              required
              value={namaBisnis}
              onChange={(e) => setNamaBisnis(e.target.value)}
              placeholder="Contoh: Kopi Nusantara, Petskarta, Butik Anggun..."
              className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="logoEmoji" className="block text-xs font-bold text-teks mb-1">
              Logo / Ikon Emoji Brand
            </label>
            <div className="flex items-center gap-2">
              <input
                id="logoEmoji"
                type="text"
                name="logoEmoji"
                value={logoEmoji}
                onChange={(e) => setLogoEmoji(e.target.value)}
                placeholder="🐰 atau ☕"
                className="w-20 rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-center text-lg text-teks focus:border-utama focus:outline-none"
              />
              <span className="text-xs text-teks-lembut">
                Ketik emoji brand Anda (misal 🐰, ☕, 🌸, 💎, ⚡, 🍔, 🍰)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="tagline" className="block text-xs font-bold text-teks mb-1">
            Slogan / Tagline Bisnis
          </label>
          <textarea
            id="tagline"
            name="tagline"
            rows={2}
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Jelaskan spesialisasi dan keunggulan bisnis Anda..."
            className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
          ></textarea>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="logoUrl" className="block text-xs font-bold text-teks mb-1">
              URL Gambar Logo Kustom (Opsional)
            </label>
            <input
              id="logoUrl"
              type="text"
              name="logoUrl"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://... atau biarkan kosong untuk pakai emoji"
              className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="teksFooter" className="block text-xs font-bold text-teks mb-1">
              Keterangan Hak Cipta / Footer
            </label>
            <input
              id="teksFooter"
              type="text"
              name="teksFooter"
              value={teksFooter}
              onChange={(e) => setTeksFooter(e.target.value)}
              placeholder="Contoh: Hak cipta 2026. Melayani pelanggan se-Indonesia."
              className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Notifikasi Status */}
      {state && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold ${
            state.sukses
              ? "bg-utama/15 text-utama border border-utama/30"
              : "bg-bahaya/15 text-bahaya border border-bahaya/30"
          }`}
        >
          {state.pesan}
        </div>
      )}

      {/* Tombol Simpan */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: warnaUtama }}
        >
          {isPending ? "Menerapkan Konfigurasi..." : "💾 Simpan Sistem & Tema"}
        </button>
      </div>
    </form>
  );
}

