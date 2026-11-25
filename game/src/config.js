// Super Kitchen v28 — konfigurasi game.
// Menu: 7 hidangan (6 dari v15 + Mie Goreng Spesial v17).
// Ayam HILANG total. Nasi Goreng Udang, Spaghetti Bolognese,
// Burger (+ kentang goreng sebagai pendamping visual), Es Teh Manis,
// Ice Strawberry Squash, Lemon Squash Mint, Mie Goreng Spesial.
// v28: TEMA PETIR — logo petir di judul (X1), tombol MULAI (X2),
// tombol SAJIKAN saat RUSH (X3).
// v27: RENAME Dapur Kilat -> Super Kitchen; W1 Stasiun terisi di
// preset play; W2 Tombol SAJIKAN hitungan bahan.
// v26: V1 Tiket cocok hijau; V2 Ikon stasiun + banner berlatar;
// V3 Efek HANGUS!.
// Dipertahankan v25: Buang merah + pil Musik; wajah tiket 60px +
// tangan saat RUSH; banner LEVEL.
// v24: footer 2 baris; "♪" judul; RUSH di SAJIKAN; efek Buang;
// wajah tiket.
// v23: Tombol Buang + bersihkan "Di tangan"; RUSH di papan + konfeti
// menang; hiasan judul; indikator musik header.
// v22: countdown RUSH + progress level, wajah akhir, placeholder
// papan + ikon tangan, keycap + koin berdenyut.
// v21: statistik akhir, progress bar, dekorasi dapur, batas PAKET,
// perbaiki overlap harga/SEMPURNA.
// v20: suara & musik, wajah pelanggan, level 1-3, kartu menu judul.
// v19: upgrade, PAKET, koin, koki, RUSH 30, Cling.
// v18: VIP, urgensi, preview, SPESIAL, kilau kombo. v17: 7 hidangan,
// SEMPURNA!, VIP.

export const W = 1280;
export const H = 720;

export const STATIONS = {
  talenan: { name: 'TALENAN', time: 2.0 },
  kompor: { name: 'KOMPOR', time: 3.2 },
};

// Waktu olah per level upgrade (S1 v19): Lv0 -> Lv1 -> Lv2.
export const UPGRADE_TIMES = {
  talenan: [2.0, 1.4, 1.0],
  kompor: [3.2, 2.3, 1.7],
};
// Biaya upgrade per level saat ini (index = level sekarang): Lv0->1, Lv1->2.
export const UPGRADE_COSTS = {
  talenan: [25, 40],
  kompor: [35, 55],
};
export const UPGRADE_MAX = 2;

// Bahan: id -> { label, station: 'talenan' | 'kompor' | 'siap', color }.
// 'siap' = langsung bisa ditaruh di piring tanpa diolah.
export const INGREDIENTS = {
  nasi: { label: 'Nasi', station: 'kompor', color: '#f2e6c8' },
  telur: { label: 'Telur', station: 'kompor', color: '#ffe066' },
  kecap: { label: 'Kecap', station: 'siap', color: '#5a2c12' },
  udang: { label: 'Udang', station: 'talenan', color: '#f28b6d' },
  spaghetti: { label: 'Spaghetti', station: 'kompor', color: '#f2c94c' },
  daging: { label: 'Daging', station: 'talenan', color: '#c0392b' },
  saus: { label: 'Saus Tomat', station: 'siap', color: '#c93a1e' },
  keju: { label: 'Keju', station: 'siap', color: '#fff6e0' },
  roti: { label: 'Roti', station: 'siap', color: '#e8b96a' },
  patty: { label: 'Patty', station: 'kompor', color: '#8a5a3b' },
  selada: { label: 'Selada', station: 'talenan', color: '#3e9b4f' },
  teh: { label: 'Teh', station: 'siap', color: '#a85a2a' },
  es: { label: 'Es', station: 'talenan', color: '#bfe8ff' },
  gula: { label: 'Gula', station: 'siap', color: '#ffffff' },
  stroberi: { label: 'Stroberi', station: 'talenan', color: '#e83e6b' },
  soda: { label: 'Soda', station: 'siap', color: '#bfe8ff' },
  lemon: { label: 'Lemon', station: 'talenan', color: '#f2d95c' },
  mint: { label: 'Mint', station: 'siap', color: '#2a9a3a' },
};

// Hidangan: id -> { label, ingredients: [id...], base }.
// base = harga dasar (Rp). Urutan bahan = urutan ikon di tiket & piring.
// Mie Goreng Spesial (v17): tanpa bahan baru — spaghetti+telur+kecap+selada.
export const DISHES = {
  nasgor: { label: 'Nasi Goreng', ingredients: ['nasi', 'telur', 'kecap', 'udang'], base: 19 },
  spaghetti: { label: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'daging', 'saus', 'keju'], base: 17 },
  miegoreng: { label: 'Mie Goreng Spesial', ingredients: ['spaghetti', 'telur', 'kecap', 'selada'], base: 16 },
  burger: { label: 'Burger', ingredients: ['roti', 'patty', 'keju', 'selada'], base: 18 },
  esteh: { label: 'Es Teh Manis', ingredients: ['teh', 'es', 'gula'], base: 11 },
  strawsquash: { label: 'Strawberry Squash', ingredients: ['stroberi', 'soda', 'es', 'gula'], base: 15 },
  lemonsquash: { label: 'Lemon Squash Mint', ingredients: ['lemon', 'mint', 'soda', 'es'], base: 14 },
};

// v20 S2: 6 pelanggan (wajah di tiket). skin = warna kulit, hair = warna
// rambut, style: 'pendek' | 'panjang' | 'ikal' | 'topi' | 'bando' | 'pita'.
export const CUSTOMERS = [
  { skin: '#f2c9a0', hair: '#5a3a1e', style: 'pendek' },
  { skin: '#e8b88a', hair: '#2b2118', style: 'panjang' },
  { skin: '#f7d7b0', hair: '#e83e6b', style: 'pita' },
  { skin: '#c98a5a', hair: '#1a1a1a', style: 'topi' },
  { skin: '#f2c9a0', hair: '#e8a33a', style: 'ikal' },
  { skin: '#e8b88a', hair: '#3e9b4f', style: 'bando' },
];

// Urutan bahan di meja (counter), 2 baris x 9 kartu.
// 6 pertama dipertahankan (nasi, telur, udang, spaghetti, daging, patty)
// agar tombol 1-6 tidak berubah dari v1-v14.
export const COUNTER = [
  'nasi', 'telur', 'udang', 'spaghetti', 'daging', 'patty', 'selada', 'es', 'stroberi',
  'kecap', 'saus', 'keju', 'roti', 'teh', 'gula', 'soda', 'lemon', 'mint',
];

// Label tombol keyboard per kartu counter: baris 1 = 1-9, baris 2 = A-L.
export const KEY_LABELS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
];

export const RULES = {
  ordersMax: 3, // tiket di papan
  orderGap: 2.5, // detik: order baru setelah slot kosong (Lv1; lihat levelGap)
  patienceStart: 45, // detik
  patienceStep: 1.5, // detik berkurang tiap saji
  patienceMin: 25, // detik
  strikesMax: 3, // hangus -> shift over
  servesToWin: 12, // saji -> hari selesai
  tipMax: 6, // Rp tip tercepat
  comboStep: 0.10, // +10% per langkah kombo
  comboMax: 0.50, // maks +50%
  perfectThreshold: 0.75, // saji dengan kesabaran >75% = SEMPURNA!
  perfectBonus: 3, // Rp bonus saji sempurna
  vipChance: 0.25, // v17 S1: peluang order baru jadi VIP (Lv1; lihat levelVip)
  vipMultiplier: 2, // v17 S1: VIP membayar 2x harga dasar
  urgentSeconds: 10, // v17 S2: kesabaran <10 dtk = denyut merah
  rushEvery: 30, // v19 S5: detik antar periode RUSH (v18: 45)
  rushDuration: 12, // v18 C2: durasi RUSH (detik)
  rushTipBonus: 2, // v18 C2: tip tambahan per saji saat RUSH
  rushOrderGap: 1.2, // v18 C2: gap spawn order saat RUSH (detik)
  specialBonus: 2, // v18 C3: harga tambahan hidangan SPESIAL (Rp)
  comboGlowAt: 3, // v18 C4: kombo >= 3 -> kilau emas di piring + teks emas
  paketChance: 0.15, // v19 S2: peluang order baru jadi PAKET (Lv1; lihat levelPaket)
  paketBonus: 5, // v19 S2: bonus Rp pesanan paket (di atas jumlah dasar)
  freshSeconds: 1.5, // v19 S6: durasi kilau "fresh" order baru (detik)
  coinFxCount: 10, // v19 S3: jumlah partikel koin saat saji
  clingCount: 12, // v19 S6: jumlah sparkle Cling saat saji
  // v20 S3: tabel per level (index = level-1). Level = floor(saji/4)+1.
  levelGap: [2.5, 2.0, 1.5], // gap spawn order per level
  levelPaket: [0.15, 0.20, 0.25], // peluang PAKET per level
  levelVip: [0.25, 0.30, 0.35], // peluang VIP per level
  levelServes: 4, // saji per level (naik level tiap 4 saji)
  // v22 Q4: durasi denyut koin di header saat saji (detik).
  coinPulseSeconds: 0.6,
  // v23 R2: jumlah potong konfeti di layar akhir menang.
  confettiCount: 40,
  // v24 T3: jumlah partikel abu-abu saat Buang + durasi wajah tiket.
  clearFxCount: 6, // partikel abu-abu saat Buang
  servedTicketSeconds: 1.2, // durasi wajah tiket naik & memudar
  // v25 U2: wajah tiket naik 60px + mulai 15px di atas posisi wajah.
  servedTicketRise: 60, // px naik selama servedTicketSeconds
  servedTicketStartOffset: 15, // px di atas posisi wajah saat muncul
  // v25 U3: durasi banner "LEVEL n!" di tengah layar.
  levelUpSeconds: 1.5, // detik
  // v26 V3: durasi efek "HANGUS!" saat pesanan hangus.
  strikeFlashSeconds: 1.0, // detik
};

// Layout (v15: kartu jadi 2 baris x 9 kolom; sisanya tetap v11-v14).
// v19: footer dirombak jadi toko upgrade (S1).
// v20: tombol speaker di header (S1); kartu menu judul (S4).
// v21: kartu akhir diperbesar untuk statistik (P1).
// v22: kartu akhir diperbesar lagi untuk baris wajah (Q2).
// v23: tombol Buang di panel PIRING (R1).
// v25: pil "♪ Musik" di judul (U1).
export const LAYOUT = {
  header: { x: 0, y: 0, w: 1280, h: 64 },
  talenan: { x: 12, y: 76, w: 280, h: 220 },
  kompor: { x: 304, y: 76, w: 280, h: 220 },
  piring: { x: 596, y: 76, w: 312, h: 220 },
  plateCenter: { x: 752, y: 188, r: 70 },
  pesan: { x: 12, y: 308, w: 572, h: 48 },
  sajikan: { x: 596, y: 308, w: 312, h: 48 },
  kartu: { x: 12, y: 368, w: 896, h: 232, gap: 8, cols: 9, rows: 2 },
  footer: { x: 12, y: 612, w: 896, h: 96 },
  papan: { x: 920, y: 76, w: 348, h: 632 },
  tiket: { x: 932, y: 88, w: 324, h: 196, gap: 12 },
  tombolJudul: { x: 440, y: 520, w: 400, h: 64 },
  // v22 Q2: kartu akhir 600x460 untuk baris wajah.
  kartuAkhir: { x: 340, y: 130, w: 600, h: 460 },
  // v19 S1: tombol upgrade di footer.
  tombolUpgrade: {
    talenan: { x: 12, y: 634, w: 280, h: 40 },
    kompor: { x: 300, y: 634, w: 280, h: 40 },
  },
  // v20 S1: tombol speaker (bisukan) di pojok kanan header.
  tombolSpeaker: { x: 1228, y: 14, w: 36, h: 36 },
  // v20 S4: kartu menu layar judul (7 kartu, 160x150, gap 12, x awal 44).
  kartuMenu: { x: 44, y: 285, w: 160, h: 150, gap: 12 },
  // v23 R1: tombol Buang di panel PIRING (bawah-tengah).
  tombolBuang: { x: 702, y: 260, w: 100, h: 28 },
  // v25 U1: pil "♪ Musik" di kanan tombol MULAI (layar judul).
  pilMusik: { x: 852, y: 536, w: 110, h: 32 },
};

// Kotak kartu counter ke-i (0..17) — dipakai render.js (gambar) dan
// input.js (klik) supaya grid TIDAK bisa divergen (pelajaran v15).
export function counterCardRect(L, i) {
  const cols = L.kartu.cols;
  const rows = L.kartu.rows;
  const gap = L.kartu.gap;
  const cw = (L.kartu.w - (cols - 1) * gap) / cols;
  const ch = (L.kartu.h - (rows - 1) * gap) / rows;
  const col = i % cols;
  const row = Math.floor(i / cols);
  return {
    x: L.kartu.x + col * (cw + gap),
    y: L.kartu.y + row * (ch + gap),
    w: cw,
    h: ch,
  };
}
