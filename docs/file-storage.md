# File Storage dan Full-stack

Arduino Indonesia Hub sekarang menggunakan scaffold **web-db-user** berbasis React, tRPC, Express, Drizzle, Manus OAuth, dan storage S3 bawaan. Byte file tidak disimpan di database. Database hanya menyimpan metadata dan referensi `storageKey` serta `url`.

## Arsitektur

| Bagian | Implementasi | Tanggung jawab |
|---|---|---|
| Frontend | `FileStorageUploader.tsx` | Memilih file, memvalidasi batas 10 MB, mengirim payload ke tRPC, dan menampilkan file milik pengguna |
| API | `server/routers.ts` | Melindungi upload/list dengan `protectedProcedure`, memvalidasi MIME, ukuran, konteks, dan nama file |
| Storage | `server/storage.ts` | Mengirim byte ke S3 melalui `storagePut()` dan menghasilkan path `/manus-storage/...` |
| Database | `drizzle/schema.ts` + `server/db.ts` | Menyimpan metadata pada tabel `stored_files` |
| Auth | Manus OAuth + `useAuth()` | Menentukan pemilik file melalui `ctx.user.id` |

## Alur Upload

Pengguna masuk melalui Manus OAuth dari tombol **Masuk sebagai builder** pada halaman `/projects`. Setelah autentikasi aktif, uploader membaca file sebagai base64 di browser dan memanggil `files.upload` melalui tRPC. Server memeriksa konteks file, MIME type, ukuran maksimum, dan kesesuaian ukuran byte. Server kemudian memanggil `storagePut()` dengan key berbentuk `{userId}-files/{context}/{filename}`. Hanya metadata dan URL hasil storage yang disimpan pada database.

Daftar file dipanggil melalui `files.listMine`, sehingga pengguna hanya melihat metadata file miliknya sendiri. Link unduh memakai `url` bawaan `/manus-storage/{key}` dan dibuka pada tab baru. Penghapusan objek tidak diimplementasikan karena storage layer bawaan tidak mengekspos helper delete; file yang tidak lagi direferensikan dapat diperlakukan sebagai objek yatim dan perlu kebijakan cleanup terpisah jika nanti dibutuhkan.

## Aturan File

Uploader menerima gambar PNG/JPEG/WebP, PDF, teks, dan file sketch/header/C++ Arduino. Ukuran maksimum adalah **10 MB per file**. Konteks yang tersedia adalah `build-log`, `project`, `schematic`, dan `sketch`. Nama file dibersihkan di server sebelum menjadi bagian dari storage key, sedangkan `originalName` tetap dipertahankan untuk tampilan pengguna.

Untuk production dengan file besar atau unggahan berulang, pertimbangkan mengganti payload base64 tRPC dengan alur multipart langsung ke server atau presigned upload flow. Implementasi saat ini sengaja sederhana dan typed end-to-end untuk file artefak edukasi berukuran kecil.

## Schema dan Migration

Metadata disimpan dalam tabel `stored_files` dengan kolom `ownerId`, `originalName`, `storageKey`, `url`, `mimeType`, `sizeBytes`, `context`, dan `createdAt`. Migration pertama tersedia pada `drizzle/0000_nervous_brother_voodoo.sql` dan sudah diterapkan melalui database project. Jika schema berubah, jalankan `pnpm drizzle-kit generate`, tinjau SQL yang dihasilkan, lalu terapkan migration memakai alur database project.

## Environment dan Deployment

Tidak diperlukan secret storage tambahan. Scaffold memakai `BUILT_IN_FORGE_API_URL` dan `BUILT_IN_FORGE_API_KEY` yang sudah diinjeksi platform untuk storage helper, serta `DATABASE_URL` dan secret OAuth yang sudah disediakan full-stack scaffold. Jangan menambahkan `.env` ke repository atau meng-hardcode credentials. Sebelum checkpoint/deployment, jalankan `pnpm test`, `pnpm check`, dan `pnpm build`.

## Contoh Integrasi Lanjutan

Untuk mengaitkan file dengan entitas tutorial atau proyek tertentu, tambahkan kolom `entityId` dan `entityType` atau tabel relasi terpisah. Pertahankan `ownerId` sebagai kontrol kepemilikan. Jika asset tutorial harus publik, buat procedure public yang hanya mengembalikan metadata dan URL file yang memang telah dipublikasikan; jangan mengekspos daftar private file pengguna.
