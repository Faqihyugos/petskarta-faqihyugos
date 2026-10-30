# Rencana & Spesifikasi: US-52 Sistem White-Label & Manajemen Tema Multi-Bisnis

Dokumen ini menjabarkan spesifikasi dan panduan teknis fitur **Sistem White-Label & Kustomisasi Tema** di panel admin, sehingga platform katalog ini dapat digunakan (*re-brandable*) secara fleksibel oleh bisnis lain (UMKM kuliner, fashion, jasa, klinik, pet shop, dll.).

---

## 1. Tujuan Fitur

Menghadirkan menu baru **"Sistem & Tema"** (`/admin/sistem`) di dalam dashboard admin yang memungkinkan pemilik bisnis atau pembeli lisensi software (white-label) untuk:
1. **Mengubah Identitas Bisnis (White-Label)**:
   - Nama Toko / Bisnis
   - Tagline / Slogan Bisnis
   - Logo / Ikon Brand (Emoji atau URL Logo)
   - Teks Footer & Hak Cipta
   - Kategori Industri Usaha
2. **Kustomisasi Tema Warna Dinamis (Multi-Palette System)**:
   - Memilih 6 Preset Tema Siap Pakai (Emerald UMKM, Royal Sapphire Tech/Jasa, Warm Amber Cafe/Bakery, Coral Blossom Beauty/Pet, Amethyst Luxury, Slate Modern).
   - Opsi Warna Kustom (*Color Picker*): Warna Utama (`--color-utama`), Warna Hover (`--color-utama-gelap`), dan Warna Harga/Aksen (`--color-harga`).
   - *Live Preview Card* interaktif saat admin memilih tema sebelum disimpan.
3. **Penerapan Real-Time Tanpa Rebuild**:
   - Injeksi CSS variables dinamis langsung pada tag `<style>` di root dokumen `<head>` sehingga seluruh tombol, badge, header, dan kartu produk langsung berubah warna secara instan.
   - Sinkronisasi nama bisnis dan slogan ke Header, Footer, Hero katalog, dan Title metadata.

---

## 2. Rincian User Story (US-52)

### US-52 Sistem White-Label & Manajemen Tema Multi-Bisnis

Sebagai pemilik platform atau calon pembeli sistem, saya ingin memiliki menu khusus di panel admin untuk mengubah identitas branding bisnis (nama toko, slogan, logo/ikon, footer) dan mengganti skema warna tema secara dinamis, supaya platform ini dapat langsung digunakan untuk berbagai macam jenis usaha lain tanpa perlu mengubah kode sumber.

Bernilai 15 poin.

Kriteria selesai:
- Tersedia menu "Sistem & Tema" di navigasi panel admin (`/admin/sistem`). (3 poin)
- Admin dapat memperbarui nama bisnis, slogan, logo/emoji brand, dan teks hak cipta footer. (4 poin)
- Admin dapat memilih preset warna siap pakai (6 palet tema) atau memilih warna kustom menggunakan color picker dengan live preview interaktif. (4 poin)
- Seluruh perubahan tema dan branding tersimpan di server dan diterapkan secara real-time ke seluruh halaman publik dan admin melalui injeksi CSS variables. (4 poin)

