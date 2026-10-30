# PRD: Platform Digital & Smart Booking Petskarta

## 1. Tujuan Produk

Membangun platform digital terpusat (*official web portal*) untuk **Petskarta** (UMKM spesialis kelinci hias & hewan kecil berdiri sejak 2016 di Jakarta) yang memulihkan kehadiran digital (*digital presence*), mematahkan disinformasi status "Tutup Permanen" di Google Maps, menyatukan informasi dua cabang (Pondok Pinang dan Jatinegara), serta memfasilitasi reservasi adopsi kelinci dan booking *Bunny Hotel* / *Grooming* / *Scabies Healer* langsung terarah ke nomor WhatsApp admin cabang terkait.

## 2. Pengguna & Kebutuhan

| Pengguna | Karakteristik & Kebutuhan |
| --- | --- |
| **Calon Adopter Kelinci** | Mencari kelinci ras murni (*Holland Lop*, *Netherland Dwarf*) yang terjamin sehat, bergaransi pengiriman (se-Jawa & luar pulau), dan ingin berkonsultasi perawatannya via WhatsApp. |
| **Pemilik Hewan (*Pet Parent*)** | Memerlukan penitipan terpercaya (*Bunny Hotel*) saat liburan/mudik dengan fasilitas ber-AC, CCTV, *free* rumput *timothy*, alas *foot rest*, serta layanan perawatan spesialis (*Scabies Healer* & *Grooming*). |
| **Admin Cabang Pondok Pinang (Jaksel)** | Mengelola adopsi kelinci hias, reservasi hotel, grooming, dan perlengkapan; menerima pesanan WhatsApp yang spesifik cabang Jaksel. |
| **Admin Cabang Jatinegara (Jaktim)** | Mengelola kamar penitipan hotel, antrean grooming dan penanganan scabies; menerima booking WhatsApp khusus cabang Jaktim. |
| **Super Admin / Pemilik Petskarta** | Mengontrol seluruh katalog, memperbarui harga/status kamar, memantau analitik pemesanan, dan memperbarui informasi operasional toko. |

## 3. Ruang Lingkup Fitur

### Wajib (Jalur Offline)

| Fitur | User Story | Deskripsi Singkat |
| --- | --- | --- |
| Katalog Terpadu Petskarta dari Database | US-01 | Menampilkan adopsi kelinci hias, paket Bunny Hotel, grooming, dan pakan/perlengkapan dari database Supabase. |
| Halaman Detail Adopsi & Layanan | US-02 | Informasi mendalam spesifikasi kelinci (ras, usia, garansi kirim) atau fasilitas layanan (AC, CCTV, pakan timothy). |
| Pesan & Booking via WhatsApp Multi-Cabang | US-03 | Pesan otomatis terformat rapi yang memuat nama layanan/kelinci, harga, serta diarahkan ke WhatsApp cabang terkait. |
| Login Admin Petskarta | US-04 | Masuk aman dengan email & password admin via Supabase Auth di sisi server. |
| Ganti Password Admin | US-05 | Mengganti password admin bawaan demi keamanan operasional toko. |
| Proteksi Halaman Admin & Server Action | US-06 | Memastikan seluruh rute `/admin` dan Server Action perubahan data terproteksi sesi autentikasi. |

### Bonus (Jalur Offline & Kebutuhan Spesifik Petskarta)

| Fitur | User Story | Deskripsi Singkat |
| --- | --- | --- |
| Manajemen Daftar Produk & Layanan | US-07 | Melihat semua item kelinci dan layanan di dashboard admin. |
| Tambah Kelinci / Layanan Baru | US-08 | Menambahkan stok kelinci adopsi atau paket hotel baru. |
| Ubah Data Kelinci / Layanan | US-09 | Memperbarui tarif, foto, deskripsi, atau kategori. |
| Hapus Item | US-10 | Menghapus item dari database dengan konfirmasi aman. |
| Filter Kategori & Pencarian Cepat | US-11 | Filter berdasarkan Kelinci Hias, Bunny Hotel, Grooming/Scabies, dan Aksesoris. |
| Form Booking Interaktif & Varian Layanan | US-12 | Pilihan cabang (Pondok Pinang vs Jatinegara), tanggal check-in/out hotel, atau request pakan/kandang. |
| PWA Petskarta di Layar HP | US-13 | Akses cepat bagi pelanggan loyal untuk instal web di layar smartphone. |
| Generator Deskripsi AI (Gemini API) | US-14 | Otomasi pembuatan deskripsi karakter ras kelinci atau keunggulan fasilitas hotel. |

*Catatan: Pada jalur online, US-07 sampai US-14 bersifat wajib bersama fitur lanjutan US-15 sampai US-50.*

### Fitur Kunci Lanjutan Khusus Petskarta

- **Pemulihan SERP & SEO Lokal (US-26, US-27):** Schema markup `LocalBusiness` / `PetStore` dan direktori dua cabang aktif untuk menekan disinformasi "Tutup Permanen" di Google dan anomali GoFood.
- **Trust Center & Google Review 5.0 (US-38, US-39):** Integrasi penampil ulasan bintang 5 Google (178+ ulasan) dan testimoni pelanggan untuk membangun kredibilitas instan.
- **Direktori Multi-Cabang & Ekosistem Hub (US-22):** Klarifikasi status buka di Pondok Pinang & Jatinegara lengkap dengan tautan peta interaktif, Instagram (`@petskartaa`, `@petskarta.jatinegara`, `@katalogkelinci.petskarta`), TikTok, dan Shopee.
- **Kalkulator & Form Reservasi Hotel Liburan (US-42, US-48):** Manajemen lonjakan penitipan hewan musim mudik/Lebaran dengan banner pengumuman kuota dan varian paket kamar.
- **AI Consultation Assistant (US-50):** Asisten tanya-jawab perawatan kelinci pemula, pakan yang aman, gejala scabies, dan panduan fasilitas hotel.

## 4. Di Luar Ruang Lingkup

- Payment gateway perbankan otomatis (transaksi tetap diverifikasi langsung oleh admin via WhatsApp).
- Registrasi akun publik untuk pengunjung (pengunjung langsung memesan tanpa registrasi akun).
- Registrasi akun admin dari antarmuka publik (admin dibuat langsung di dashboard Supabase / skrip aman).

## 5. Kriteria Keberhasilan

1. **Pemulihan Kredibilitas Google:** Pengunjung web langsung melihat status resmi "Aktif Beroperasi Sejak 2016" dan rating 5.0 dari 178 ulasan Google Maps, mematahkan misinformasi tutup permanen.
2. **Efisiensi Alur Reservasi:** Pengunjung dapat memilih kelinci atau memesan kamar Bunny Hotel beserta cabang tujuan dalam maksimal 3 klik hingga pesan WhatsApp siap kirim.
3. **Pemisahan Trafik Cabang Akurat:** Pesanan untuk cabang Jatinegara dan Pondok Pinang terkirim ke admin WhatsApp masing-masing cabang tanpa tertukar.
4. **Keamanan Data & Sistem:** Data katalog dan akses admin terlindungi RLS Supabase dan tidak ada kredensial bocor ke client.

## 6. Batasan Teknis

- **Framework:** Next.js 16 (App Router), JavaScript murni, Tailwind CSS 4.
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security aktif).
- **Deployment:** Vercel (paket gratis).
- **Akses Data:** Server-only Supabase access (`SUPABASE_SECRET_KEY` untuk server reading, `@supabase/ssr` + cookie untuk sesi admin).
- **Kolom Tabel `produk`:** Wajib mematuhi struktur standar: `id`, `nama`, `harga`, `deskripsi`, `foto_url`, `kategori`, `created_at`.
