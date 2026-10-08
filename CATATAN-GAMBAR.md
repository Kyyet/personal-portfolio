FOLDER GAMBAR PROJECT
=====================
Taruh screenshot project di folder: public/projects/
(Folder ini kosong di repo — buat sendiri kalau belum ada.)

Folder public/ otomatis di-copy Vite ke dist/ saat build,
jadi file yang kamu taruh di sana bisa diakses dari /projects/nama-file.jpg

Nama file yang dipakai di index.html (lihat komentar "TEMPAT GAMBAR"):
- lensagram.jpg               -> card Lensagram
- muda-bangkit-mandiri.jpg    -> card Muda Bangkit Mandiri
- cerapproval.jpg             -> card Cerapproval
- hope.jpg                    -> card HOPE
- cuanfest.jpg                -> card CuanFest
- focus-plus.jpg              -> card Focus+

Cara pakai:
1. Simpan screenshot dengan nama persis seperti di atas (jpg/png/webp bebas,
   yang penting sesuaikan src di index.html).
2. Buka index.html, cari komentar TEMPAT GAMBAR, lalu ganti komentar itu
   menjadi tag gambar, contoh:

   <img class="project-media-img" src="/projects/cerapproval.jpg" alt="Screenshot Cerapproval" />

3. Tidak perlu ubah CSS apa pun — class .project-media-img sudah ada
   di src/style.css (object-fit: cover, rasio 16/10, zoom saat hover).

Tips:
- Rasio ideal 16:10 (misal 1600x1000 px) biar tidak kepotong.
- Kompres gambar (s.max.png / tinypng) supaya loading cepat.
- Selama gambar belum dimasukkan, card tetap menampilkan gradient
  tone-blue/tone-cyan/tone-accent + watermark sebagai placeholder.
