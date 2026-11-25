# Dapur Kilat — v19

Game memasak cepat: ambil bahan, olah di talenan & kompor, rakit di piring,
sajikan sebelum pesanan hangus. Sajikan 12 pesanan untuk menyelesaikan hari.
3 pesanan hangus = shift berakhir.

## Cara main

- Klik kartu bahan (atau tombol 1-9, A-L) untuk mengambil bahan.
- Bahan mentah diolah di Talenan (2 dtk) atau Kompor (3,2 dtk); bahan "Siap
  pakai" langsung ke piring.
- Klik stasiun untuk mulai olah / ambil hasil. Klik Piring untuk taruh bahan.
- Klik SAJIKAN (atau Spasi) untuk menyajikan hidangan yang cocok.
- Klik tiket pesanan untuk menyajikan tiket itu langsung.
- R: ulang hari. P: jeda.

## Fitur v19

- **Toko Upgrade Stasiun** — pakai koin untuk percepat Talenan (2,0→1,4→1,0
  dtk) dan Kompor (3,2→2,3→1,7 dtk). Tombol ada di footer.
- **Pesanan Paket** — kadang satu tiket minta 2 hidangan sekaligus (bonus
  Rp 5). Harga = jumlah dasar + bonus.
- **Partikel koin + rincian bayaran** — koin terbang ke header saat saji;
  rincian (dasar + tip + kombo + SEMPURNA!) tampil di bawah pesan.
- **Koki + latar dapur hidup** — karakter koki di layar judul & akhir,
  jendela dan rak toples di latar.
- **RUSH tiap 30 detik** — jam sibuk: pesanan lebih cepat, tip +Rp 2.
- **Efek Cling** — kilau bintang emas saat pesanan selesai; pesanan baru
  berdenyut emas (fresh) selama 1,5 detik.

## Fitur yang dipertahankan

- 7 hidangan, 18 bahan. Pesanan VIP (tiket emas, bayar 2x). Menu Spesial
  Hari Ini (+Rp 2, pil emas SPESIAL). Urgensi: tiket berdenyut merah bila
  kesabaran < 10 dtk. Bonus SEMPURNA! (+Rp 3 bila kesabaran > 75%).
  Kilau emas bila kombo >= 3. Preview hidangan jadi di setiap tiket.

## Menu (7 hidangan)

- Nasi Goreng Udang Rp 19 — nasi + telur + kecap + udang
- Spaghetti Bolognese Rp 17 — spaghetti + daging + saus tomat + keju
- Mie Goreng Spesial Rp 16 — spaghetti + telur + kecap + selada
- Burger Rp 18 — roti + patty + keju + selada (+ kentang goreng visual)
- Es Teh Manis Rp 11 — teh + es + gula
- Ice Strawberry Squash Rp 15 — stroberi + soda + es + gula
- Lemon Squash Mint Rp 14 — lemon + mint + soda + es

## Teknologi

- Canvas 2D, tanpa dependensi. Semua gambar digambar dengan kode.
- `game/src/` — config, state, input, render, main, shots.
- `main.ts` — entrypoint: menyalin game + screenshot ke /output dan
  menulis dossier.json via `vendor/makefun-game.ts`.

Dibuat untuk bounty make.fun "Make the best cooking game".

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Fiqih-stack/cooking-game-01/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Fiqih-stack/cooking-game-01/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

Dibangun untuk bounty [Make the best cooking game](https://make.fun/bounty/best-cooking-game-20261125-0137) di make.fun. Coba buat game kamu sendiri di [make.fun](https://make.fun/?ref=6sc35azz).
