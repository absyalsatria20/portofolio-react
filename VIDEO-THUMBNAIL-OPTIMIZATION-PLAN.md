# Rencana Optimasi Thumbnail Video

Status: Rencana saja — belum dieksekusi

## Tujuan

Mengurangi waktu tampil kartu video, mencegah kartu putih/hitam saat scroll, dan menghemat bandwidth dengan tidak memuat file `.mp4` untuk thumbnail.

## Masalah Saat Ini

`src/components/Portfolio.jsx` memakai elemen `<video>` langsung sebagai thumbnail:

```jsx
<video
  src={`${item.src}#t=${item.thumbTime || '0.1'}`}
  preload="metadata"
  muted
  playsInline
/>
```

Browser tetap perlu membuka file video, membaca metadata, dan mencari frame berdasarkan `#t`. Ini dapat membuat kartu lambat muncul atau kosong sementara.

## Rencana Perubahan

1. Buat URL poster Cloudinary dari URL video.
   - Poster berupa frame JPG/WebP ringan.
   - Frame memakai nilai `thumbTime` jika tersedia.
   - Tidak perlu upload thumbnail manual jika transformasi URL Cloudinary dapat digunakan.

2. Ganti thumbnail video pada kartu portfolio dari `<video>` menjadi `<img>`.
   - Kartu hanya memuat poster ringan.
   - Tambahkan `loading` dan `decoding` sesuai hasil pengujian.
   - Pertahankan ikon play di atas poster.

3. Ganti thumbnail video pada mode edit layout dari `<video>` menjadi `<img>`.
   - Drag-and-drop tidak lagi memicu request metadata video.

4. Pertahankan video asli hanya pada modal preview.
   - Video dirender ketika user membuka kartu.
   - Modal tetap memakai `controls`, `autoPlay`, dan `playsInline`.
   - Video dibongkar ketika modal ditutup.

5. Tambahkan fallback poster jika URL Cloudinary tidak dapat dikonversi.
   - Fallback dapat berupa URL video asli atau placeholder lokal.
   - Perlu dipilih sebelum implementasi.

## Urutan Eksekusi

1. Uji format URL poster Cloudinary memakai URL video yang sudah tersimpan.
2. Pastikan URL Cloudinary video memiliki format transformasi yang dapat menghasilkan frame gambar.
3. Tambahkan fungsi pembuat poster URL.
4. Ubah thumbnail pada `PortfolioCard`.
5. Ubah thumbnail pada `SortableEditItem`.
6. Biarkan modal tetap memakai video asli.
7. Jalankan lint dan build.
8. Tes manual:
   - First visit.
   - Refresh.
   - Scroll turun-naik berulang.
   - Filter graphic/motion/all.
   - Buka dan tutup modal video.
   - Mode edit layout.

## Risiko dan Catatan

- URL poster harus diuji pada setiap variasi URL Cloudinary yang sudah ada.
- Beberapa video mungkin gagal menghasilkan poster jika format atau transformasinya tidak didukung.
- Poster baru tidak mengubah file video asli di Cloudinary.
- Modal tetap mengunduh video saat dibuka.
- Jangan mengubah kode aktif sebelum ada perintah eksekusi.

## File yang Kemungkinan Diubah Saat Eksekusi

- `src/components/Portfolio.jsx`

## File yang Tidak Perlu Diubah

- Laravel backend
- Database Aiven
- Cloudinary upload flow
- API routes
- `localStorage` project cache
