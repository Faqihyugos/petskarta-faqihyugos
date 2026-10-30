# Katalog UMKM + Order WhatsApp

Template workshop vibe coding Creative Hub App Talent (CHAT) 2026. Repo ini berisi tampilan aplikasi katalog UMKM; tugasmu merangkainya menjadi sistem utuh dengan bantuan AI: database, login admin, keamanan, dan pemesanan lewat WhatsApp.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fandixurniawan%2Fkatalog-umkm&project-name=katalog-umkm&repository-name=katalog-umkm)

## Langkah awal

1. **Salin repo ke akun GitHub-mu.** Klik tombol **Deploy with Vercel** di atas. Vercel akan membuat repo baru di akun GitHub-mu dan langsung men-deploy-nya. Setelah selesai, buka link Vercel-mu: katalog tampil dengan data contoh.
2. **Buat proyek Supabase.** Masuk ke [supabase.com](https://supabase.com) dengan akun GitHub, lalu buat proyek baru. Simpan password database di tempat aman.
3. **Siapkan database.** Di Supabase, buka **SQL Editor**, tempel seluruh isi `docs/schema.sql`, lalu klik **Run**. Tabel `produk` beserta data awal akan terbentuk.
4. **Siapkan akun admin.** Ikuti panduan akun admin yang dibagikan mentor. Setelah itu matikan pendaftaran akun baru di **Authentication > Sign In / Providers**.
5. **Isi environment variable di Vercel.** Buka proyekmu di Vercel > **Settings > Environment Variables**, lalu isi tiga variabel dari `.env.example`. Nilainya ada di Supabase > **Project Settings > API**. Setelah itu lakukan **Redeploy**.
6. **Clone repo ke laptop.**

   ```bash
   git clone https://github.com/<akunmu>/<nama-repo>.git
   cd <nama-repo>
   npm install
   ```

7. **Buat file `.env.local`.** Salin `.env.example` menjadi `.env.local`, lalu isi dengan nilai yang sama seperti di Vercel.
8. **Jalankan di laptop.**

   ```bash
   npm run dev
   ```

   Buka `http://localhost:3000`.

## Alur kerja

Kerjakan satu user story setiap kali, lalu simpan dan kirim perubahan:

```bash
git add .
git commit -m "US-01: katalog dari database"
git push
```

Setiap `git push`, Vercel otomatis men-deploy versi terbaru. Cek hasilnya di link Vercel-mu.

Urutan yang disarankan: US-01, US-02, US-03, US-04, US-05, US-06, lalu fitur bonus. Daftar lengkap ada di `docs/user-stories.md`.

## Isi repo

| File atau folder | Isi |
| --- | --- |
| `AGENTS.md` | Aturan untuk AI agent, dibaca sebelum setiap prompt |
| `DESIGN.md` | Panduan warna, huruf, dan komponen |
| `PROMPTS.md` | Jurnal prompt, wajib diisi |
| `docs/` | Problem statement, PRD, user story, rancangan teknis, skema database, checklist |
| `lib/toko.js` | Nama toko, nomor WhatsApp, alamat, jam buka |
| `app/` | Halaman aplikasi |
| `components/` | Komponen tampilan |

## Menyesuaikan dengan usahamu

- Identitas toko: ubah `lib/toko.js`.
- Warna: ubah bagian `@theme` di `app/globals.css` (lihat `DESIGN.md`).
- Produk: ubah langsung di Supabase > **Table Editor > produk**.

## Aturan penting

- Jangan menyimpan kunci atau password di kode, dan jangan push file `.env.local`.
- Jangan memberi awalan `NEXT_PUBLIC_` pada environment variable.
- Isi `PROMPTS.md` setiap menyelesaikan fitur.

## Sebelum mengumpulkan

1. Jalankan semua poin di `docs/checklist-keamanan.md` dan `docs/checklist-pengujian.md` pada link Vercel.
2. Lengkapi bagian di bawah ini.
3. Push perubahan terakhir sebelum batas waktu.

## Tentang aplikasi ini

- **Nama usaha:** Petskarta (Katalog Terpadu Adopsi Kelinci Hias, Bunny Hotel, Grooming & Perlengkapan Hewan Kecil Jakarta)
- **Pembuat:** Faqih Yugo (@faqihyugos)
- **Link aplikasi:** https://petskarta-faqihyugos.vercel.app
- **Fitur bonus yang dikerjakan:**
  - **US-07 sampai US-52 (Seluruh 46 Fitur Bonus Selesai Lengkap):**
    - Manajemen Katalog Admin Lengkap (US-07, US-08, US-09, US-10, US-31, US-32, US-33, US-34, US-51)
    - Pengalaman Pengunjung Interaktif: Filter Kategori & Pencarian Instan (US-11), Booking Interaktif Multi-Cabang (US-12), Sorting Server-Side (US-15), Paginasi Efisien (US-16), Rekomendasi Starter Kit (US-17), Galeri Multi-Foto (US-18), Status Stok Real-Time (US-19), Promo & Badge Diskon (US-20)
    - Multi-Item WhatsApp Shopping Cart (US-21)
    - Direktori 2 Cabang Resmi Aktif & Hub Medsos (US-22)
    - Web Share & Salin Tautan (US-23), Wishlist Lokal (US-24), Dark Mode Ramah Mata (US-25)
    - Optimasi SEO Dinamis & Open Graph (US-26), Schema JSON-LD LocalBusiness & Sitemap XML (US-27), Custom 404 & Skeleton Loading (US-28)
    - PWA Siap Pasang Layar Ponsel (US-13) & Unggah Foto ke Supabase Storage (US-29)
    - Generator AI Konten & Asisten Konsultasi Perawatan Kelinci Google Gemini (US-14, US-50)
    - Dasbor Analitik, Pelacakan Minat Booking WhatsApp, & Produk Populer (US-30, US-40, US-41)
    - Ekspor & Impor Massal CSV Katalog (US-35, US-46)
    - Histori Terakhir Dilihat (US-36) & Komparasi Spesifikasi Kelinci 2 Kolom (US-37)
    - Trust Center Google Reviews 5.0, Form Ulasan Autentik & Panel Moderasi Admin (US-38, US-39)
    - Banner Pengumuman Musim Libur / Slot Mudik Lebaran (US-42)
    - Pengaturan Multi-Cabang & Kontak WhatsApp Dinamis dari Admin (US-43)
    - Manajemen Staf Admin Cabang (US-44) & Audit Trail Kronologis 50 Aktivitas (US-45)
    - Urutan Prioritas Katalog (US-47) & Varian Paket Layanan Kamar/Grooming (US-48)
    - Halaman Dinamis Khusus per Kategori `/kategori/[slug]` (US-49)
    - Tampilan Katalog Admin Tanpa Paginasi & Produk Terbaru Paling Atas (US-51)
    - Sistem White-Label & Manajemen Tema Multi-Bisnis Dinamis (US-52)
  - **Keamanan Lanjutan (K-6 sampai K-13):**
    - K-6 Header Keamanan Lengkap (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff)
    - K-7 Bersih dari `dangerouslySetInnerHTML` & `eval` berbahaya
    - K-8 Rute `/admin` terlindungi dari pengindeksan mesin pencari (`X-Robots-Tag: noindex, nofollow`, `robots.txt`)
    - K-9 Halaman error aman tanpa membocorkan stack trace internal
    - K-10 Dependensi bersih tanpa kerentanan kritis (`npm audit` 0 vulnerability)
    - K-11 Content-Security-Policy (CSP) ketat
    - K-12 Rate limiting pada percobaan login admin dan pengiriman formulir publik
    - K-13 Kode bersih tanpa `console.log` data sensitif atau kredensial rahasia
