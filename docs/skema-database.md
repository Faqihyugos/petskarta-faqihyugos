# Skema Database Petskarta

## 1. Tabel Utama `produk`

Seluruh item kelinci hias siap adopsi, paket Bunny Hotel, layanan perawatan medis ringan (Scabies Healer), dan perlengkapan pakan disimpan pada tabel tunggal `produk` dengan skema baku sebagai berikut:

| Kolom | Tipe | Keterangan untuk Ekosistem Petskarta |
| --- | --- | --- |
| `id` | bigint | Nomor identifikasi unik item, digenerate otomatis |
| `nama` | text | Nama kelinci (misal: "Holland Lop Broken Orange Junior") atau paket layanan (misal: "Bunny Hotel Deluxe AC & CCTV"), wajib diisi |
| `harga` | integer | Biaya adopsi atau tarif per hari/paket dalam satuan Rupiah (tidak boleh bernilai negatif) |
| `deskripsi` | text | Rincian lengkap: usia/garansi/kesehatan untuk kelinci; fasilitas AC/CCTV/timothy hay untuk hotel; protokol pengobatan untuk scabies healer |
| `foto_url` | text | Tautan gambar atau path foto dokumentasi kelinci/fasilitas kamar |
| `kategori` | text | Kelompok layanan: `Kelinci Hias`, `Bunny Hotel`, `Grooming & Perawatan`, atau `Pakan & Aksesoris` |
| `created_at` | timestamptz | Waktu pencatatan item, terisi otomatis `now()` |

*Catatan: Nama-nama kolom di atas bersifat permanen dan tidak boleh diubah agar kompatibel dengan seluruh komponen UI dan Server Actions.*

---

## 2. Pemetaan Kategori Layanan Petskarta

Untuk menyajikan pengalaman pengguna yang kaya dan lebih dari sekadar landing page biasa, kolom `kategori` membagi katalog ke dalam 4 pilar bisnis Petskarta:

1. **`Kelinci Hias`**: Kelinci ras murni (*Holland Lop*, *Netherland Dwarf*) siap adopsi, lengkap dengan informasi kesehatan dan konsultasi gratis.
2. **`Bunny Hotel`**: Kamar penitipan kelinci dan guinea pig (ruangan ber-AC/kipas, alas foot rest plastik, free rumput timothy, pantauan CCTV, waktu bermain harian). Tarif berlaku per hari.
3. **`Grooming & Perawatan`**: Layanan grooming reguler, home grooming, serta pengobatan khusus kutu dan jamur (*Scabies Healer*).
4. **`Pakan & Aksesoris`**: Pakan serat tinggi (timothy hay), botol minum anti bocor, toilet kelinci, dan starter kit kandang ramah kaki kelinci.

---

## 3. Kebijakan Row Level Security (RLS)

Keamanan tabel `produk` dikunci ketat dengan Row Level Security:

| Siapa | Baca | Tambah | Ubah | Hapus |
| --- | --- | --- | --- | --- |
| **Publik (Tanpa Login)** | Ditolak Langsung | Ditolak | Ditolak | Ditolak |
| **Admin Terautentikasi** | Diizinkan | Diizinkan | Diizinkan | Diizinkan |

Pengunjung publik tetap dapat melihat katalog kelinci dan layanan di web karena data dibaca secara aman oleh Next.js Server Component menggunakan koneksi berkredensial server (`SUPABASE_SECRET_KEY`), bukan melalui peramban pengguna. Seluruh manipulasi data dari form admin wajib melalui otentikasi sesi admin `@supabase/ssr`.

---

## 4. Skrip Migrasi SQL

Skrip pembuatan tabel, pengaktifan RLS, kebijakan akses, dan data awal Petskarta tercatat lengkap di berkas `docs/schema.sql`.
