# Panduan Aplikasi Kamila Mart

**Nama Platform:** Kamila Mart
**Deskripsi:** Platform manajemen operasional mart terintegrasi untuk memantau transaksi, stok barang secara otomatis, dan pembagian keuntungan yang transparan.

## 🌐 Halaman Aplikasi
- **Tampilan Pembeli:** [https://kamilamart.vercel.app](https://kamilamart.vercel.app)
- **Halaman Login:** [https://kamilamart.vercel.app/login](https://kamilamart.vercel.app/login)
- **Tampilan Dashboard:** [https://kamilamart.vercel.app/dashboard](https://kamilamart.vercel.app/dashboard)

---

## 🚀 Fitur Utama Dashboard

### 1. Ringkasan Dashboard
Melihat performa toko secara keseluruhan dalam satu tampilan cepat.

### 2. Transaksi (Daily Monitoring)
- **Manajemen Pesanan:** Melihat daftar transaksi harian yang masuk.
- **Filter Pintar:** Menyaring data berdasarkan bulan dan tahun untuk keperluan audit.
- **Status Real-time:** Memperbarui status pembayaran ("Sukses/Menunggu") dan pengiriman ("Dikirim/Sampai") secara instan.
- **Catatan Internal:** Menambahkan catatan khusus pada setiap transaksi yang tersimpan secara otomatis.
- **Ekspor CSV:** Mengunduh laporan transaksi per periode ke dalam format Excel/CSV.

### 3. Produk & Manajemen Stok
- **Stok Otomatis:** Jumlah stok produk akan berkurang secara otomatis setiap kali ada pesanan baru.
- **Proteksi Penjualan:** Produk yang stoknya mencapai 0 (nol) akan otomatis ditandai "Stok Habis" dan tidak bisa dipesan oleh pembeli.
- **Katalog Produk:** Menambah, mengubah, atau menghapus produk tanpa perlu unggah gambar (fokus pada data teks).

### 4. Laporan Keuntungan (Profit Sharing)
- **Perhitungan Otomatis:** Sistem menghitung keuntungan bersih setiap bulan.
- **Formula Dinamis:** Admin dapat menentukan persentase bagi hasil (contoh: Marbot 60%, Internal 40%).
- **Tracking Settlement:** Mencatat apakah bagi hasil bulan tersebut sudah diproses atau masih menunggu, lengkap dengan catatan admin.

### 5. Manajemen Keuangan
Melihat rekap total omzet dan statistik keuangan dari bulan ke bulan.

### 6. Pengaturan Pengguna (Hak Akses)
- **Multi-user:** Menambah akun admin baru dengan kredensial unik.
- **Hak Akses Moduler:** Admin utama dapat menentukan modul mana saja yang bisa diakses oleh setiap staf (misal: staf gudang hanya bisa akses Produk, staf kasir hanya bisa akses Transaksi).

### 7. Pengaturan Toko
Mengatur profil mart, nomor WhatsApp admin, serta detail rekening bank untuk metode pembayaran transfer.

---

## 🛒 Fitur Halaman Pemesanan (Customer)
- **Antarmuka Responsif:** Belanja nyaman melalui HP maupun Desktop.
- **WhatsApp Integration:** Tombol cepat untuk menghubungi admin mart.
- **Metode Pembayaran:** Pilihan Bayar di Tempat (COD) atau Transfer Bank dengan detail instruksi otomatis.
- **Real-time Availability:** Pembeli tidak bisa memesan barang melebihi stok yang tersedia.
