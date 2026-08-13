# Arduino Indonesia Hub — Arah Desain

## Tiga Pendekatan Awal

### Tema Name: Bengkel Kelas Terbuka
**Very Brief Intro:** Nuansa studio maker yang hangat, modular, dan penuh penanda teknis; terasa seperti meja kerja bersama yang mengubah rasa ingin tahu menjadi prototipe nyata.
**Probability:** 0.07

### Tema Name: Sirkuit Editorial
**Very Brief Intro:** Sistem editorial modern dengan tipografi tegas, bidang warna cyan, dan komposisi asimetris seperti majalah teknologi yang dikurasi komunitas.
**Probability:** 0.04

### Tema Name: Neon Lab Malam
**Very Brief Intro:** Laboratorium digital berkontras tinggi dengan aksen glow dan panel gelap untuk menonjolkan eksperimen, data sensor, dan energi komunitas maker.
**Probability:** 0.02

## Pendekatan Terpilih: Sirkuit Editorial

### Design Movement
Neo-editorial technology: perpaduan desain editorial kontemporer, swiss grid yang sengaja dipatahkan, dan bahasa visual blueprint bengkel elektronik.

### Core Principles
1. **Belajar terlihat nyata:** materi edukasi divisualkan seperti lembar kerja yang bisa langsung dipraktikkan.
2. **Asimetri yang terarah:** hero, kartu, dan section memakai offset, garis ukur, serta ritme kolom yang menghindari tampilan template generik.
3. **Cyan sebagai sinyal:** warna teal Arduino menjadi penanda aksi, status, dan jalur navigasi; bukan sekadar dekorasi.
4. **Komunitas sebagai bukti:** proyek dan tutorial mendapat ruang visual setara dengan katalog komponen.

### Color Philosophy
Dasar off-white hangat memberi rasa kertas kerja dan ruang belajar; teal-cyan #00979D menjadi sinyal elektrik yang mengarahkan fokus; orange #F39C12 dipakai hemat sebagai penanda eksperimen, level, dan CTA penting. Mode gelap mengubah kertas menjadi graphite tetapi mempertahankan cyan sebagai jalur energi dan orange sebagai indikator interaksi.

### Layout Paradigm
Komposisi editorial berlapis: navigasi tipis di atas, hero dua kolom dengan panel visual miring, section dibuka oleh rail nomor dan label teknis, lalu konten mengalir dalam kartu-kartu dengan ukuran tidak seragam. Di mobile, rail berubah menjadi label horizontal dan semua konten mengikuti satu kolom dengan prioritas yang jelas.

### Signature Elements
- Garis sirkuit tipis dan titik koneksi yang muncul sebagai tekstur latar.
- Label teknis kecil dengan format `01 / START HERE`, `BUILD LOG`, atau `BOM READY`.
- Kartu proyek dengan aksen orange seperti stiker inspeksi bengkel.

### Interaction Philosophy
Interaksi harus terasa seperti menghubungkan modul: hover menggeser garis atau mengangkat kartu sedikit, filter terasa seperti memilih jalur eksperimen, dan CTA memberi umpan balik fisik singkat. Tidak ada animasi berlebihan; gerak dipakai untuk memperjelas hubungan dan status.

### Animation
Gunakan transisi 180–260ms dengan ease-out yang tajam. Kartu masuk dengan opacity dan translateY kecil, diberi stagger 40ms. Hover memakai translateY(-4px) dan perubahan border/shadow, bukan animasi layout. Modal dan drawer mulai dari scale 0.96, tidak pernah scale 0. Respect `prefers-reduced-motion` untuk menghilangkan entrance animation.

### Typography System
Gunakan **Plus Jakarta Sans** untuk body, navigasi, dan metadata; gunakan **Space Grotesk** untuk headline dan angka besar agar terasa teknis namun editorial. H1 memakai weight 700–800 dengan tracking -0.04em; body 16–18px dengan line-height longgar; label teknis 11–12px uppercase dengan tracking 0.14em.

### Brand Essence
**Platform belajar dan berbelanja robotika Arduino untuk pelajar, maker, pendidik, dan engineer Indonesia—berbeda karena tutorial, proyek komunitas, dan komponen dirancang sebagai satu perjalanan membangun.**
Personality: **penasaran, praktis, menggerakkan**.

### Brand Voice
Headline terdengar percaya diri dan mengundang eksperimen; CTA singkat dan berorientasi tindakan; microcopy jelas, tidak sok teknis, dan selalu memberi next step.

Contoh headline: “Dari kabel pertama sampai robot yang benar-benar bergerak.”
Contoh CTA: “Pilih eksperimenmu.”

### Wordmark & Logo
Logo berupa simbol jejak PCB berbentuk huruf A abstrak: dua jalur teal yang bertemu pada titik koneksi orange, tanpa teks di dalam mark. Wordmark memakai Space Grotesk bold dengan potongan kecil pada huruf `A` sebagai gema jalur sirkuit.

### Signature Brand Color
**Arduino Signal Teal — #00979D**, warna ownable yang berfungsi sebagai jalur energi, penanda aksi, dan identitas komunitas.

## Style Decisions

- Halaman interior harus memiliki editorial break yang terlihat melalui rail nomor, garis pengukuran diagonal, atau kolom intro yang tidak simetris.
- Kartu produk wajib menampilkan siluet komponen atau anotasi skematik; ikon paket generik tidak menjadi visual dominan.
- Tutorial menggunakan bahasa worksheet dan code desk; proyek menggunakan build log dan bukti visual; toko menggunakan metadata BOM-ready.
- Motif sirkuit dipakai sebagai jalur navigasi dan anotasi, bukan hanya tekstur latar.
