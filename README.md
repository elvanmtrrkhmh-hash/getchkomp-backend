# Project E-Commerce Backend (Laravel)

Project backend ini dibangun menggunakan **Laravel 13** dan **Inertia.js** (dengan **React**). Proyek ini difokuskan sebagai platform e-commerce yang modern, terintegrasi dengan fitur blog, manajemen keranjang/checkout, serta payment gateway.

## 🌟 Fitur Utama

- **Autentikasi & Manajemen Akun:** Menggunakan Laravel Fortify untuk menangani alur registrasi, login, manajemen profil, dan keamanan akun.
- **Katalog Produk & Keranjang:** Mendukung pengelolaan produk, keranjang belanja (cart), dan pemilihan varian spesifikasi produk sebelum checkout.
- **Integrasi Pembayaran (Xendit):** Terintegrasi secara langsung dengan **Xendit Payment Gateway** untuk memproses pembuatan pesanan dan transaksi otomatis saat proses checkout.
- **Sistem Blog & Artikel:** Manajemen artikel (CMS) dengan fitur label dinamis seperti kategori dan tag, yang otomatis disinkronisasikan menggunakan mekanisme *firstOrCreate*.
- **API Responsif:** Menyediakan API terstruktur untuk integrasi beranda yang dinamis (Hero section, Featured Products, Blog Section, Testimonial, dll).
- **Type-Safe Routing Frontend:** Menggunakan Laravel Wayfinder untuk menghasilkan fungsi rute Laravel yang dapat digunakan secara *type-safe* oleh klien React.

## 🛠️ Tech Stack & Dependencies

- **Core:** Laravel 13 (PHP 8.3)
- **Frontend Stack:** Inertia.js v3, React v19, Tailwind CSS v4, Vite
- **Autentikasi:** Laravel Fortify, Laravel Sanctum
- **Payment Gateway:** Xendit PHP Client (`xendit/xendit-php`)
- **Testing:** Pest PHP
- **Tools Tambahan:** Laravel Pint (Formatting), Laravel Wayfinder

## 🚀 Cara Menjalankan Proyek (Local Development)

Ikuti langkah-langkah di bawah ini untuk mengatur dan menjalankan proyek di environment lokal Anda:

1. **Install dependensi PHP & JavaScript**
   ```bash
   composer install
   npm install
   ```

2. **Konfigurasi Environment**
   Salin file konfigurasi `.env` dan atur variabel kredensial (Database, Xendit API Keys, dll).
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Migrasi Database**
   Jalankan migrasi database (beserta *seeder* jika ada) untuk menyiapkan tabel yang dibutuhkan.
   ```bash
   php artisan migrate
   ```

4. **Jalankan Development Server**
   Proyek ini menggunakan script gabungan yang akan menjalankan server PHP, antrian (*queue*), dan Vite secara bersamaan.
   ```bash
   composer run dev
   ```

---
*Dokumentasi ini otomatis di-generate berdasarkan struktur `composer.json` dan arsitektur fitur pada proyek.*
