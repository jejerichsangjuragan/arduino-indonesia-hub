# Full-stack dan File Storage Integration

- [x] Upgrade proyek web-static menjadi web-db-user/full-stack.
- [x] Membaca README scaffold full-stack dan dokumentasi File Storage yang tersedia.
- [x] Menentukan model metadata file untuk tutorial, proyek komunitas, skematik, dan sketch.
- [x] Menentukan validasi tipe, ukuran, nama file, serta aturan akses upload.
- [x] Menambahkan server route atau helper resmi untuk upload dan signed/public URL.
- [x] Menambahkan UI upload File Storage pada alur build log komunitas.
- [x] Menampilkan daftar file dan aksi unduh/pratinjau pada halaman yang relevan.
- [x] Menjalankan typecheck, build, dan pengujian alur frontend.
- [x] Menyimpan checkpoint final dan mendokumentasikan konfigurasi lanjutan.
- [x] Tambahkan dokumentasi konfigurasi lanjutan untuk File Storage, auth, migration, batas file, dan deployment.
- [x] Simpan checkpoint baru setelah integrasi full-stack dan File Storage selesai tervalidasi.

# Admin Moderation Dashboard

- [x] Menambahkan model proyek komunitas dengan status pending, approved, atau rejected.
- [x] Menambahkan metadata pengirim, catatan moderator, dan waktu moderasi.
- [x] Menambahkan procedure admin untuk daftar antrean, detail proyek, dan perubahan status.
- [x] Menambahkan route dashboard admin dengan role guard.
- [x] Menambahkan UI filter antrean, detail file, serta aksi approve/reject.
- [x] Menambahkan tampilan publik yang hanya menampilkan proyek approved.
- [x] Menambahkan test untuk proteksi admin dan transisi status moderasi.
- [x] Menjalankan migration, test, typecheck, build, screenshot, dan checkpoint final.

# Moderation Completion Gaps

- [x] Mengimplementasikan query dan tampilan file pendukung per proyek pada panel moderasi.
- [x] Mengubah halaman publik proyek agar mengambil data approved-only dari tRPC.
- [x] Menambahkan test mutation moderasi untuk status, catatan, waktu, dan moderator.
- [x] Menyimpan checkpoint final setelah seluruh gap moderasi tervalidasi.

# Moderation Follow-up Gaps

- [x] Menghubungkan FileStorageUploader ke projectId setelah proyek dibuat atau dipilih.
- [x] Menyamakan selected project dan evidence query sejak state awal dashboard.
- [x] Menambahkan test service status nyata yang memverifikasi approve/reject dan metadata moderator.
- [x] Menambahkan test projects.moderate jalur rejected dengan assertion metadata moderator.
- [x] Menambahkan test service asli updateCommunityProjectStatus tanpa mock database logic.
- [x] Menambahkan test integration-style untuk updateCommunityProjectStatus yang menjalankan executor aktual tanpa mock chain utama.
