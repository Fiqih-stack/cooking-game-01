# Dapur Kilat

Game masak cepat: ambil bahan di meja, olah di TALENAN / KOMPOR,
rakit di PIRING, sajikan ke pelanggan sebelum kesabaran habis.
Sajikan 12 pesanan untuk menyelesaikan hari. 3 pesanan hangus =
shift berakhir.

![Dapur Kilat](https://play.make.fun/?competition=best-cooking-game-20261125-0137)
[![Make.fun Game](https://make.fun/badge.svg)](https://make.fun)
[![Play on make.fun](https://make.fun/play-badge.svg)](https://play.make.fun/?competition=best-cooking-game-20261125-0137)

## Cara Main

- **Klik bahan** di meja (atau tekan tombol 1-9 / A-L).
- Bahan mentah harus diolah dulu: **TALENAN** (udang, daging, selada,
  es, stroberi, lemon) atau **KOMPOR** (nasi, telur, spaghetti, patty).
- Bahan **SIAP** (kecap, saus, keju, roti, teh, gula, soda, mint)
  langsung bisa ditaruh di piring.
- Klik **PIRING** untuk taruh bahan yang dipegang, lalu klik
  **SAJIKAN** (atau klik tiket pesanan) saat isi piring cocok.
- **R**: mulai ulang. **P**: jeda. **M**: suara on/off.

## Menu (7 hidangan)

| Hidangan | Bahan | Harga |
| --- | --- | --- |
| Nasi Goreng | nasi + telur + kecap + udang | Rp 19 |
| Spaghetti Bolognese | spaghetti + daging + saus tomat + keju | Rp 17 |
| Mie Goreng Spesial | spaghetti + telur + kecap + selada | Rp 16 |
| Burger | roti + patty + keju + selada | Rp 18 |
| Es Teh Manis | teh + es + gula | Rp 11 |
| Ice Strawberry Squash | stroberi + soda + es + gula | Rp 15 |
| Lemon Squash Mint | lemon + mint + soda + es | Rp 14 |

## Aturan

- Kesabaran pesanan 45 detik, berkurang 1,5 detik tiap saji (min 25).
- Tip kecepatan: sampai +Rp 6 bila disajikan cepat.
- **SEMPURNA!** +Rp 3 bila disajikan dengan kesabaran di atas 75%.
- Kombo: +10% per saji beruntun (maks +50%); kombo >= 3 = kilau emas.
- **Pesanan VIP** (tiket emas, 25%): membayar 2x harga.
- **Jam Sibuk RUSH!** tiap 30 detik (12 detik): pesanan lebih cepat,
  tip +Rp 2.
- **Menu Spesial Hari Ini**: 1 hidangan acak, +Rp 2.
- **Pesanan Paket** (15%): 1 tiket 2 hidangan, +Rp 5.
- **Toko Upgrade**: percepat TALENAN / KOMPOR sampai Lv2 (pakai koin).
- **Level 1-3**: naik tiap 4 saji — pesanan makin cepat, paket & VIP
  makin sering.
- **Wajah pelanggan**: 6 karakter, mood dari kesabaran (senyum/cemas/
  marah); wajah senang muncul saat pesanan disajikan.
- **Suara & musik**: efek suara WebAudio + musik latar pentatonik
  (tombol speaker / M untuk bisu).
- **Layar akhir**: statistik hari lengkap (SEMPURNA!, VIP, Paket,
  kombo terbaik, level akhir, waktu) + baris wajah pelanggan yang
  dilayani.
- **Progress bar**: bar hijau di bawah header menunjukkan Saji x/12.
- **Countdown RUSH**: sisa detik RUSH tampil di header saat Jam Sibuk
  aktif; progress level "Lv 2 (2/4)" di header.
- **Placeholder papan**: slot pesanan kosong menampilkan
  "Menunggu pesanan…"; ikon bahan tampil di samping "Di tangan".
- **Tombol Buang**: kosongkan piring bila pesanan hangus / salah rakit (panel PIRING).
- **Efek RUSH di papan**: border oranye berdenyut di papan saat Jam Sibuk; **konfeti** jatuh di layar akhir menang.
- **Hiasan judul**: tagline + garis emas di antara kartu menu dan tombol MULAI.
- **Indikator musik**: not "♪" bergoyang di samping speaker saat musik berbunyi.
- **Keycap**: tombol R / P / M tampil sebagai pil tombol di layar
  judul; angka koin berdenyut emas saat baru disajikan.

## Teknologi

- Canvas 2D murni, tanpa aset eksternal (semua gambar digambar
  dengan kode).
- WebAudio untuk suara & musik (tanpa file audio).
- Node 22 + stdlib saja untuk harness (main.ts).

Dibuat untuk kompetisi make.fun "Make the best cooking game"
(best-cooking-game-20261125-0137). Referral: 6sc35azz.
