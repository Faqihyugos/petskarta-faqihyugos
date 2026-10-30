import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Direktori Cabang Resmi & Hub Ekosistem - ${toko.nama}`,
  description:
    "Direktori resmi cabang Petskarta (Pondok Pinang & Jatinegara). Status aktif beroperasi, panduan rute Google Maps, serta akun media sosial dan marketplace resmi.",
};

export default function HalamanCabang() {
  const daftarCabang = toko.cabang || [];
  const sosmed = toko.mediaSosial || {};

  const daftarMediaSosial = [
    {
      nama: "Instagram Utama",
      handle: "@petskartaa",
      deskripsi: "Update adopsi kelinci hias, tips perawatan, dan testimoni",
      url: sosmed.instagramUtama || "https://instagram.com/petskartaa",
      label: "Buka Instagram",
      icon: "📸",
    },
    {
      nama: "Instagram Cabang Jatinegara",
      handle: "@petskarta.jatinegara",
      deskripsi: "Khusus informasi Bunny Hotel, penitipan, dan penanganan scabies",
      url: sosmed.instagramJatinegara || "https://instagram.com/petskarta.jatinegara",
      label: "Buka Instagram",
      icon: "🏨",
    },
    {
      nama: "Instagram Katalog Kelinci",
      handle: "@katalogkelinci.petskarta",
      deskripsi: "Koleksi foto dan video anakan kelinci siap adopsi terkini",
      url: sosmed.instagramKatalog || "https://instagram.com/katalogkelinci.petskarta",
      label: "Buka Katalog",
      icon: "🐰",
    },
    {
      nama: "TikTok Resmi",
      handle: "@petskarta.official",
      deskripsi: "Video tingkah lucu kelinci, edukasi pakan timothy, dan tutorial",
      url: sosmed.tiktok || "https://tiktok.com/@petskarta.official",
      label: "Tonton di TikTok",
      icon: "🎵",
    },
    {
      nama: "Shopee Official Shop",
      handle: "Petskarta Official",
      deskripsi: "Pemesanan rumput timothy, pakan, botol minum & perlengkapan kandang",
      url: sosmed.shopee || "https://shopee.co.id/petskarta",
      label: "Belanja di Shopee",
      icon: "🛍️",
    },
  ];

  return (
    <div className="flex flex-col py-8 sm:py-12">
      {/* Tombol Navigasi Kembali */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          &larr; Kembali ke Katalog Utama
        </Link>
      </div>

      {/* Header Halaman */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-utama/30 bg-utama/10 px-3 py-1 text-xs font-bold text-utama">
          <span>🏢</span>
          <span>Pusat Informasi Operasional</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Direktori Cabang Resmi &amp; Hub Ekosistem
        </h1>
        <p className="mt-2 max-w-2xl text-base text-teks-lembut">
          Temukan lokasi cabang resmi {toko.nama}, panduan rute navigasi Google Maps, jam operasional, serta tautan ke seluruh kanal digital resmi kami.
        </p>
      </header>

      {/* Banner Klarifikasi Status Google Maps */}
      <section
        aria-label="Klarifikasi Status Operasional"
        className="mb-10 rounded-2xl border border-utama/30 bg-utama/5 p-6 sm:p-7"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-utama opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-utama"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-utama">
                Status Operasional Resmi
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Seluruh Cabang Petskarta Aktif Beroperasi Setiap Hari
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-teks-lembut max-w-2xl">
              <strong>Pemberitahuan Penting:</strong> Menanggapi disinformasi status &ldquo;Tutup Permanen&rdquo; yang sempat keliru pada penanda Google Maps lama, kami tegaskan bahwa <strong>{toko.nama} melayani secara normal sejak {toko.sejak}</strong> di dua cabang resmi (Pondok Pinang dan Jatinegara) untuk adopsi kelinci hias, Bunny Hotel ber-AC, grooming, dan perawatan scabies.
            </p>
          </div>
          <div className="mt-2 flex shrink-0 items-center gap-3 rounded-xl border border-garis bg-latar px-4 py-3 shadow-xs">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-sm font-extrabold text-teks">Rating {toko.ratingGoogle} / 5.0</p>
              <p className="text-xs text-teks-lembut">{toko.totalUlasanGoogle}+ Ulasan Google Asli</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Cabang Resmi */}
      <section aria-labelledby="judul-cabang" className="mb-14">
        <div className="mb-6 flex flex-col gap-1">
          <h2 id="judul-cabang" className="text-2xl font-bold tracking-tight">
            Dua Cabang Resmi di Jakarta
          </h2>
          <p className="text-sm text-teks-lembut">
            Pilih cabang terdekat untuk kunjungan langsung, antar-jemput penitipan kelinci, atau konsultasi.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {daftarCabang.map((cabang, idx) => {
            const pesanWa = encodeURIComponent(
              `Halo Admin Petskarta (${cabang.nama}), saya ingin menanyakan jadwal kunjungan dan reservasi layanan.`
            );
            const waUrl = `https://wa.me/${cabang.nomorWhatsApp}?text=${pesanWa}`;

            return (
              <article
                key={cabang.id || idx}
                className="flex flex-col justify-between rounded-2xl border border-garis bg-latar p-6 shadow-xs hover:border-utama/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-utama/15 px-2.5 py-1 text-xs font-bold text-utama">
                      Cabang {idx + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-utama">
                      <span className="h-2 w-2 rounded-full bg-utama"></span>
                      Aktif Beroperasi
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold tracking-tight">
                    {cabang.nama}
                  </h3>

                  <div className="mt-4 flex flex-col gap-3 text-sm text-teks-lembut">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base select-none">📍</span>
                      <p className="text-teks">{cabang.alamat}</p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-base select-none">⏰</span>
                      <p>
                        <span className="font-medium text-teks">Jam Operasional:</span>{" "}
                        {toko.jamBuka}
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-base select-none">🐰</span>
                      <p>
                        <span className="font-medium text-teks">Fasilitas &amp; Layanan:</span>{" "}
                        {cabang.layanan}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 border-t border-garis pt-4 sm:flex-row">
                  <a
                    href={cabang.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-garis bg-permukaan px-4 py-2.5 text-xs font-bold text-teks hover:border-utama hover:text-utama transition-colors"
                  >
                    <span>🗺️</span>
                    <span>Buka Rute Google Maps</span>
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-utama px-4 py-2.5 text-xs font-bold text-white hover:bg-utama-gelap transition-colors"
                  >
                    <span>💬</span>
                    <span>Chat WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Hub Ekosistem Media Sosial & Marketplace Resmi */}
      <section aria-labelledby="judul-ekosistem">
        <div className="mb-6 flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-utama">
            <span>🌐</span>
            <span>Verifikasi Saluran Digital</span>
          </div>
          <h2 id="judul-ekosistem" className="text-2xl font-bold tracking-tight">
            Hub Ekosistem Media Sosial &amp; Toko Resmi
          </h2>
          <p className="text-sm text-teks-lembut">
            Pastikan Anda hanya bertransaksi dan mendapatkan informasi melalui akun resmi {toko.nama} di bawah ini untuk menghindari akun tiruan atau penipuan.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {daftarMediaSosial.map((med, index) => (
            <article
              key={index}
              className="flex flex-col justify-between rounded-xl border border-garis bg-permukaan/60 p-5 shadow-xs hover:border-utama/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{med.icon}</span>
                  <span className="rounded-md border border-garis bg-latar px-2 py-0.5 text-xs font-bold text-teks">
                    {med.handle}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold text-teks">{med.nama}</h3>
                <p className="mt-1 text-xs leading-relaxed text-teks-lembut">
                  {med.deskripsi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-garis">
                <a
                  href={med.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-garis bg-latar px-3 py-2 text-xs font-semibold text-teks hover:border-utama hover:text-utama transition-colors"
                >
                  <span>{med.label}</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

