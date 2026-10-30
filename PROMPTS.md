# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## US-51 Tampilan Seluruh Katalog Admin & Produk Terbaru Paling Atas [SENDIRI]

**Prompt:**
Penyesuaian pada saat tambah produk: table katalog produk & layanan tidak pagination dan produk terbaru dimasukan paling atas. Masukkan ke US baru.

**Hasil:**
- Dibuat kriteria selesai untuk `US-51` di `docs/user-stories.md`.
- Mengubah kueri Supabase di `/admin` (`app/admin/page.jsx`) agar diurutkan berdasarkan produk terbaru terlebih dahulu (`created_at` DESC dan `id` DESC).
- Menghapus pemotongan paginasi (no pagination) pada tabel manajemen produk `components/TabelProduk.jsx` sehingga seluruh item langsung tampil dengan produk yang baru ditambahkan berada di baris paling atas.

**Perbaikan:**
- Memastikan fitur pencarian instan tetap bekerja menyaring seluruh katalog tanpa batas halaman.

## Penerapan Keamanan Lanjutan (K-6 sampai K-13) [SENDIRI]

**Prompt:**
Masukkan poin keamanan lanjutan:
- K-6 Header keamanan di aplikasi live
- K-7 Tanpa dangerouslySetInnerHTML atau eval berbahaya
- K-8 /admin tidak diindeks mesin pencari
- K-9 Error tidak membocorkan stack trace
- K-10 Dependensi tanpa kerentanan kritis
- K-11 Content-Security-Policy ketat
- K-12 Rate limit login atau form
- K-13 Tanpa console.log data sensitif

**Hasil:**
- `next.config.mjs` dan `proxy.js` dikonfigurasi dengan Header Keamanan lengkap (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy) dan Content-Security-Policy (CSP) ketat.
- Menghapus seluruh penggunaan `dangerouslySetInnerHTML` di aplikasi; script dark mode dipindahkan ke `public/theme.js` dan schema JSON-LD disematkan secara aman.
- Mencegah pengindeksan rute `/admin` melalui `robots.txt`, header `X-Robots-Tag: noindex, nofollow`, dan metadata layout admin.
- Membuat `app/error.jsx` yang aman tanpa menampilkan stack trace atau rincian error internal.
- Menambahkan rate limiter untuk percobaan login admin dan pengiriman form ulasan/tanya AI.
- Memastikan dependensi bebas kerentanan kritis (`npm audit` 0 vulnerability) dan tidak ada `console.log` data sensitif di seluruh codebase.

**Perbaikan:**
- Mengisi dan memperbarui `docs/checklist-keamanan.md` untuk seluruh poin K-6 sampai K-13.


