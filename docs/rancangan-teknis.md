# Rancangan Teknis: Platform Digital Petskarta

## 1. Alur Data & Arsitektur

```
Peramban Pengunjung / Admin
        |
        v
Next.js 16 di Vercel (Server Runtime)    <- Seluruh interaksi Supabase terjadi di sini
  - Server Component: Membaca katalog kelinci, paket layanan, direktori cabang, ulasan
  - Server Action: Memproses form booking, login admin, mutasi data, panggilan AI Gemini
  - proxy.js: Proteksi rute `/admin` dan verifikasi sesi
  - JSON-LD Injection: Schema markup PetStore & LocalBusiness untuk pemulihan SEO Google
        |
        v
Supabase
  - Database PostgreSQL: Tabel `produk` (Kelinci, Hotel, Grooming, Aksesoris) + RLS aktif
  - Supabase Auth: Otentikasi aman akun admin Petskarta
  - Supabase Storage: Penyimpanan foto kelinci & dokumentasi fasilitas kamar hotel
```

Peramban klien tidak pernah berhubungan langsung dengan endpoint Supabase. Kunci rahasia dan konfigurasi sensitif terisolasi penuh di lingkungan server Vercel.

---

## 2. Koneksi Supabase

| Koneksi | Kunci / Kredensial | Penggunaan di Sistem Petskarta |
| --- | --- | --- |
| **Koneksi Server Publik** | `SUPABASE_SECRET_KEY` | Membaca katalog kelinci siap adopsi, paket Bunny Hotel, ulasan publik, dan detail layanan (Server Component). Pengunjung tidak memerlukan sesi login, dan akses dibaca aman oleh server. |
| **Koneksi Sesi Admin** | `SUPABASE_PUBLISHABLE_KEY` + Cookie Sesi (`@supabase/ssr`) | Otentikasi admin, logout, ganti password, penambahan stok kelinci, pembaruan status kamar hotel, dan moderasi ulasan. |

Kunci rahasia (`SUPABASE_SECRET_KEY`) hanya digunakan di lingkungan server untuk membaca data publik. Segala aksi mutasi data yang mengubah database wajib menggunakan sesi admin terotentikasi sehingga aturan Row Level Security (RLS) senantiasa ditegakkan.

---

## 3. Struktur Folder

```
app/
  page.jsx                     Beranda Petskarta (Trust Signal 5.0, Hero, Katalog Layanan/Adopsi, Direktori Cabang)
  produk/[id]/page.jsx         Detail Kelinci Hias / Paket Bunny Hotel / Layanan Grooming (US-02)
  admin/
    login/page.jsx             Login Admin Petskarta (US-04)
    page.jsx                   Dashboard Ringkasan & Manajemen Katalog Admin (US-07, US-30)
    password/page.jsx          Ganti Password Admin (US-05)
    produk/baru/page.jsx       Tambah Kelinci / Layanan Baru (US-08)
    produk/[id]/ubah/page.jsx  Ubah Data Kelinci / Tarif Layanan (US-09)
components/                    Komponen UI konsisten (lihat DESIGN.md)
  Header.jsx                   Navigasi, brand identity Petskarta, dan tautan cepat cabang
  Footer.jsx                   Direktori dua cabang, kontak resmi, hak cipta sejak 2016
  KartuProduk.jsx              Kartu katalog kelinci & layanan dengan status ketersediaan
  TombolWhatsApp.jsx           Tombol pesan/booking dinamis terarah ke WhatsApp cabang
  TabelProduk.jsx              Tabel manajemen admin
  FormProduk.jsx               Form data kelinci/layanan
  NavAdmin.jsx                 Navigasi panel admin
lib/
  toko.js                      Data identitas resmi Petskarta, alamat dua cabang, & nomor WhatsApp cadangan
  data-contoh.js               Data contoh kelinci & layanan Petskarta sebelum koneksi database
  format.js                    Format rupiah dan utilitas penanggalan booking
docs/                          Dokumentasi teknis, PRD, dan panduan proyek
```

Berkas pendukung sistem:
```
lib/supabase/                  Utilitas inisialisasi koneksi Supabase server
app/admin/actions.js           Server Actions terproteksi untuk auth & mutasi data
proxy.js                       Proteksi rute `/admin` berbasis server proxy Next.js 16
```

---

## 4. Logika Smart Booking & WhatsApp Routing Multi-Cabang (US-03, US-12, US-43)

Petskarta memiliki dua cabang operasional dengan spesialisasi berbeda:
1. **Cabang Pondok Pinang (Jakarta Selatan):** Pusat adopsi kelinci hias (*Holland Lop*, *Netherland Dwarf*), Bunny Hotel, Grooming, dan Perlengkapan.
2. **Cabang Jatinegara (Jakarta Timur):** Khusus layanan *Bunny Hotel*, *Grooming*, dan pengobatan *Scabies Healer*.

### Format Tautan WhatsApp
Format URL: `https://wa.me/<nomorCabang>?text=<pesanTerformat>`

- `<nomorCabang>`: Nomor WhatsApp spesifik cabang yang dipilih pengunjung (format internasional tanpa tanda +, contoh `62812xxxx`).
- `<pesanTerformat>`: Teks otomatis yang disusun rapi dan di-encode menggunakan `encodeURIComponent`.

Contoh pesan otomatis untuk booking Bunny Hotel:
```text
Halo Admin Petskarta (Cabang Jatinegara),
Saya ingin melakukan reservasi Bunny Hotel:
- Paket: Paket Deluxe (AC + CCTV)
- Jadwal: 24 Maret 2026 s.d. 30 Maret 2026 (6 Hari)
- Jumlah Hewan: 1 Ekor Kelinci (Holland Lop)
- Catatan: Mohon alas foot rest plastik dan free rumput timothy.
Mohon info ketersediaan slot kamar. Terima kasih!
```

Contoh pesan otomatis untuk adopsi kelinci:
```text
Halo Admin Petskarta (Cabang Pondok Pinang),
Saya tertarik untuk mengadopsi kelinci:
- Ras: Holland Lop Broken Orange (Junior)
- Kode/ID: #101
- Harga: Rp 850.000
Apakah kelinci ini masih ready dan melayani pengiriman bergaransi?
```

---

## 5. Implementasi Local SEO & Structured Data (US-26, US-27)

Untuk mengatasi disinformasi status "Tutup Permanen" di Google Maps dan anomali GoFood, sistem menyematkan metadata terstruktur JSON-LD Schema.org di Server Component:
- Tipe Schema: `LocalBusiness` / `PetStore`
- Nama Usaha: `Petskarta - Spesialis Kelinci Hias & Bunny Hotel Jakarta`
- Berdiri Sejak: `2016`
- Rating Agregat: `5.0` bintang dari `178` ulasan
- Cabang Terdaftar:
  - Cabang Pondok Pinang: Jl. Pondok Pinang Raya No. 18, Kebayoran Lama, Jakarta Selatan
  - Cabang Jatinegara: Jakarta Timur (Khusus Hotel & Scabies Healer)
- Tautan Media Sosial Resmi: Instagram `@petskartaa`, `@petskarta.jatinegara`, `@katalogkelinci.petskarta`, TikTok `@petskarta.official`, Shopee Petskarta.

---

## 6. Pengaturan Akun Admin

Akun admin dibuat langsung melalui Supabase Dashboard Auth atau skrip generator admin, dan registrasi publik dinonaktifkan. Password bawaan wajib diganti pada pengujian pertama melalui halaman `/admin/password` (US-05).
