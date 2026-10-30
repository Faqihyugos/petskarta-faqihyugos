import { formatRupiah } from "@/lib/format";

export default function DashboardAnalitikAdmin({ analitik }) {
  if (!analitik) return null;

  const {
    totalProduk,
    jumlahPerKategori = {},
    totalKlikBooking = 0,
    top5Layanan = [],
    klikPerCabang = {},
  } = analitik;

  return (
    <div className="flex flex-col gap-6">
      {/* Kartu Ringkasan Statistik (US-30) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-garis bg-latar p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Total Katalog Aktif
          </p>
          <p className="mt-2 text-3xl font-extrabold text-teks">{totalProduk}</p>
          <p className="mt-1 text-xs text-teks-lembut">Kelinci, Hotel &amp; Layanan</p>
        </div>

        <div className="rounded-2xl border border-garis bg-latar p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Total Minat Booking WA
          </p>
          <p className="mt-2 text-3xl font-extrabold text-utama">
            {totalKlikBooking}
          </p>
          <p className="mt-1 text-xs text-teks-lembut">Klik Pemesanan Terlacak</p>
        </div>

        <div className="rounded-2xl border border-garis bg-latar p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Trafik Cabang Pondok Pinang
          </p>
          <p className="mt-2 text-3xl font-extrabold text-teks">
            {klikPerCabang["Pondok Pinang"] || 0}
          </p>
          <p className="mt-1 text-xs text-teks-lembut">Adopsi, Grooming &amp; Hotel Jaksel</p>
        </div>

        <div className="rounded-2xl border border-garis bg-latar p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
            Trafik Cabang Jatinegara
          </p>
          <p className="mt-2 text-3xl font-extrabold text-teks">
            {klikPerCabang["Jatinegara"] || 0}
          </p>
          <p className="mt-1 text-xs text-teks-lembut">Hotel Lebaran &amp; Scabies Healer Jaktim</p>
        </div>
      </div>

      {/* Rincian Jumlah per Kategori & Top 5 Layanan (US-30 & US-41) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Rincian Stok per Kategori */}
        <div className="rounded-2xl border border-garis bg-latar p-5 shadow-xs">
          <h2 className="text-base font-bold text-teks">
            Jumlah Item per Kategori
          </h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {Object.keys(jumlahPerKategori).length === 0 ? (
              <p className="text-xs text-teks-lembut italic">Belum ada data kategori.</p>
            ) : (
              Object.entries(jumlahPerKategori).map(([kategori, jumlah]) => (
                <div
                  key={kategori}
                  className="flex items-center justify-between rounded-lg bg-permukaan/70 px-3.5 py-2 text-xs"
                >
                  <span className="font-semibold text-teks">{kategori}</span>
                  <span className="font-extrabold text-utama">{jumlah} item</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top 5 Layanan Terpopuler (US-41) */}
        <div className="rounded-2xl border border-garis bg-latar p-5 shadow-xs">
          <h2 className="text-base font-bold text-teks">
            Top 5 Layanan Paling Banyak Diminati (Klik WA)
          </h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {top5Layanan.length === 0 ? (
              <div className="rounded-xl border border-dashed border-garis p-6 text-center text-xs text-teks-lembut">
                Belum ada data klik booking. Klik tombol WhatsApp di katalog akan mencatat tren di sini.
              </div>
            ) : (
              top5Layanan.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-permukaan/70 px-3.5 py-2 text-xs"
                >
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-utama/15 text-[10px] font-bold text-utama">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-teks truncate">
                      {item.nama}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-md bg-utama/10 px-2 py-0.5 font-bold text-utama">
                    {item.total} klik
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

