# Problem Statement dan Sketsa: Petskarta

## 1. Problem Statement

**Petskarta** adalah bisnis *pet shop*, *breeder*, dan layanan perawatan hewan peliharaan spesialis kelinci hias (*Holland Lop*, *Netherland Dwarf*) serta hewan kecil (*guinea pig*) yang telah beroperasi sejak 2016 di Jakarta. Petskarta memiliki reputasi luring dan daring yang sangat tinggi (rating Google Reviews **5.0 dari 178+ ulasan**), fasilitas *Bunny Hotel* berstandar tinggi (ruangan ber-AC, pantauan CCTV, alas *foot rest* plastik, *free* rumput *timothy*, dan *daily playtime*), layanan *grooming* & pengobatan spesialis *Scabies Healer*, serta jangkauan adopsi kelinci hingga ke luar pulau.

Namun, kehadiran digital (*digital presence*) Petskarta di mesin pencari Google saat ini mengalami fragmentasi dan disinformasi kritis:
1. **Google Business Profile Ditandai "Tutup Permanen":** Profil bisnis utama di Google Maps salah menampilkan label merah "Tutup Permanen", menyebabkan calon pelanggan mengira toko sudah bangkrut padahal operasional aktif penuh.
2. **Ketiadaan Website Resmi Terpusat:** Tidak ada landing page / portal resmi berdomain sendiri. Calon pelanggan yang mencari di Google terlempar ke postingan media sosial acak atau marketplace.
3. **Fragmentasi Informasi Multi-Cabang:** Informasi antara cabang **Pondok Pinang (Jakarta Selatan)** dan cabang khusus **Jatinegara (Jakarta Timur)** tersebar di berbagai akun Instagram berbeda (`@petskartaa`, `@petskarta.jatinegara`, `@katalogkelinci.petskarta`), membuat pelanggan bingung mengenai layanan apa yang tersedia di cabang mana, serta ke nomor WhatsApp mana mereka harus memesan.
4. **Anomali Hasil Pencarian (GoFood Pastry):** Terdapat hasil pencarian bisnis pastry di GoFood dengan nama dan alamat mirip di Pondok Pinang yang membingungkan identitas brand Petskarta sebagai spesialis kelinci.
5. **Inefisiensi Alur Pemesanan:** Pelanggan menanyakan hal yang sama berulang kali (ketersediaan kelinci adopsi, ketersediaan kamar pet hotel menjelang libur Lebaran, tarif grooming) lewat chat WhatsApp manual tanpa format jelas.

**Pengguna:**
- **Calon Adopter & Pemilik Hewan (Pengunjung):** Mencari kelinci hias bersertifikat sehat/garansi pengiriman, membutuhkan tempat penitipan aman saat liburan/mudik, atau mencari perawatan grooming/scabies terpercaya di Jakarta.
- **Admin & Pemilik Petskarta (Cabang Pondok Pinang & Jatinegara):** Mengelola katalog kelinci siap adopsi, mengatur ketersediaan kamar hotel dan jadwal grooming, serta menerima pesanan WhatsApp yang sudah terstruktur sesuai cabang masing-masing.

**Dampak:**
Kehilangan calon pelanggan baru bernilai tinggi akibat persepsi toko tutup di Google, inefisiensi waktu admin membalas pertanyaan repetitif, serta risiko salah kirim pesanan antar cabang.

**Solusi yang Dibangun:**
Platform web resmi Petskarta yang berfungsi lebih dari sekadar landing page:
1. **Pusat Kepercayaan & Pemulihan SERP:** Menegaskan status bisnis aktif sejak 2016, menampilkan badge ulasan Google Bintang 5 (178 ulasan), dan menerapkan *Schema Markup* (`LocalBusiness` / `PetStore`) agar Google memprioritaskan profil resmi Petskarta.
2. **Katalog Terpadu Multi-Layanan:** Menampilkan kelinci siap adopsi, paket Bunny Hotel, layanan Grooming & Scabies Healer, serta perlengkapan kelinci/pakan yang terintegrasi ke marketplace Shopee.
3. **Smart Booking Generator & WhatsApp Routing:** Form pemesanan interaktif (pilih layanan, pilih cabang Pondok Pinang atau Jatinegara, pilih tanggal check-in/out hotel atau jadwal grooming) yang langsung memformat pesan WhatsApp otomatis ke nomor admin cabang yang bersangkutan.
4. **Panel Manajemen Admin:** Memungkinkan pemilik mengelola status adopsi kelinci, harga layanan, informasi cabang, dan memantau analitik permintaan layanan.

---

## 2. Sketsa Halaman

### A. Beranda & Portal Layanan (`/`)

```
+--------------------------------------------------------------------------+
| PETSKARTA                  [Adopsi] [Bunny Hotel] [Grooming] [Cabang]   |
+--------------------------------------------------------------------------+
| [TRUST BADGE: Buka Sejak 2016 | Google Rating 5.0 ★★★★★ (178 Ulasan)]    |
|                                                                          |
| SPESIALIS KELINCI HIAS & PET CARE JAKARTA                                |
| Adopsi Holland Lop & Netherland Dwarf, Bunny Hotel Ber-AC & CCTV,        |
| serta Perawatan Scabies Healer Terpercaya.                              |
|                                                                          |
| [ Booking Bunny Hotel ]      [ Lihat Kelinci Siap Adopsi ]               |
+--------------------------------------------------------------------------+
| KATEGORI LAYANAN & PRODUK:                                               |
| [ Semua ] [ Kelinci Hias ] [ Bunny Hotel ] [ Grooming ] [ Perlengkapan ] |
|                                                                          |
| +-----------------+  +-----------------+  +-----------------+           |
| | [Foto Kelinci]  |  | [Foto Fasilitas]|  | [Foto Treatment]|           |
| | Holland Lop Jr  |  | Bunny Hotel VIP |  | Scabies Healer  |           |
| | Rp 850.000      |  | Rp 65.000 /hari |  | Rp 120.000      |           |
| | [Tersedia]      |  | [AC + CCTV]     |  | [Garansi Tuntas]|           |
| | [Detail / Pesan]|  | [Pilih Kamar]   |  | [Jadwalkan]     |           |
| +-----------------+  +-----------------+  +-----------------+           |
+--------------------------------------------------------------------------+
| DIREKTORI CABANG RESMI (STATUS: AKTIF BUKA):                             |
| Cabang 1: Pondok Pinang (Jaksel)     Cabang 2: Jatinegara (Jaktim)       |
| Jl. Pondok Pinang Raya No. 18        Bunny Hotel, Grooming & Scabies     |
| [Buka di Google Maps]                [Buka di Google Maps]               |
+--------------------------------------------------------------------------+
| HUB RESMI: Instagram @petskartaa | Shopee Petskarta | Masuk Admin        |
+--------------------------------------------------------------------------+
```

### B. Detail Layanan / Adopsi (`/produk/[id]`)

```
+--------------------------------------------------------------------------+
| < Kembali ke Katalog Layanan                                             |
|                                                                          |
| +-------------------------+  Kategori: Kelinci Hias                      |
| |                         |  HOLLAND LOP BROKEN ORANGE (JUNIOR)         |
| |                         |  Rp 850.000                                 |
| |       [Foto Utama]      |  Status: Siap Adopsi                        |
| |                         |  Cabang: Pondok Pinang (Jaksel)             |
| +-------------------------+                                              |
| [Thumbnail 1] [Thumbnail 2]  Deskripsi & Spesifikasi:                    |
|                              - Usia 2,5 bulan, lincah, bulu tebal        |
|                              - Sudah diberi vitamin dan obat cacing      |
|                              - Melayani pengiriman luar kota/pulau       |
|                              ------------------------------------------- |
|                              FORM RESERVASI CEPAT VIA WHATSAPP:          |
|                              Pilih Cabang: (o) Pondok Pinang ( ) Jatinegara|
|                              Pesan Tambahan: [ Butuh kandang starter   ] |
|                              [ Pesan Adopsi via WhatsApp Cabang ]        |
+--------------------------------------------------------------------------+
```

### C. Direktori Cabang & Klarifikasi Buka (`/cabang` atau Bagian Beranda)

```
+--------------------------------------------------------------------------+
| DIREKTORI RESMI & VERIFIKASI OPERASIONAL PETSKARTA                       |
| Catatan: Petskarta tetap BUKA dan beroperasi melayani Anda setiap hari.   |
|                                                                          |
| [ CABANG PONDOK PINANG - JAKSEL ]    [ CABANG JATINEGARA - JAKTIM ]       |
| - Layanan: Adopsi, Hotel, Grooming   - Layanan: Khusus Hotel & Scabies   |
| - Alamat: Jl. Pondok Pinang Raya 18  - Alamat: Jatinegara, Jakarta Timur |
| - WhatsApp: 0812-xxxx-xxxx           - WhatsApp: 0813-xxxx-xxxx          |
| - [Petunjuk Arah Google Maps]        - [Petunjuk Arah Google Maps]       |
+--------------------------------------------------------------------------+
```

### D. Panel Admin Petskarta (`/admin`)

```
+--------------------------------------------------------------------------+
| PETSKARTA ADMIN | Produk & Layanan | Ganti Password | [Keluar]           |
+--------------------------------------------------------------------------+
| RINGKASAN:                                                               |
| Total Item: 24 | Kelinci Ready: 6 | Layanan Aktif: 12 | Klik Booking: 89 |
|                                                                          |
| DAFTAR LAYANAN & ADOPSI                  [ + Tambah Kelinci/Layanan ]    |
| Foto | Nama                      | Kategori     | Harga    | Aksi        |
| [img]| Holland Lop Broken Orange | Kelinci Hias | 850.000  | [Ubah][Hapus|
| [img]| Bunny Hotel Kamar VIP     | Bunny Hotel  | 65.000   | [Ubah][Hapus|
| [img]| Scabies Healer Care       | Perawatan    | 120.000  | [Ubah][Hapus|
+--------------------------------------------------------------------------+
```
