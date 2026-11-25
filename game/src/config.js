// Dapur Kilat v19 — konfigurasi game.
// Menu: 7 hidangan (6 dari v15 + Mie Goreng Spesial v17).
// Ayam HILANG total. Nasi Goreng Udang, Spaghetti Bolognese,
// Burger (+ kentang goreng sebagai pendamping visual), Es Teh Manis,
// Ice Strawberry Squash, Lemon Squash Mint, Mie Goreng Spesial.
// v19 (6 butir): S1 Toko Upgrade Stasiun (koin berguna); S2 Pesanan
// Paket (1 tiket, 2 hidangan); S3 partikel koin + rincian bayaran;
// S4 koki + latar dapur hidup; S5 RUSH tiap 30 dtk; S6 efek Cling
// mengkilau (pesanan selesai + pesanan baru fresh).
// Dipertahankan v18: VIP (2x), urgensi <10 dtk, preview tiket,
// counter 2x9 (18 bahan), SEMPURNA!, SPESIAL (+Rp 2), kilau kombo >= 3.

export const W = 1280;
export const H = 720;

export const STATIONS = {
  talenan: { name: 'TALENAN', time: 2.0 },
  kompor: { name: 'KOMPOR', time: 3.2 },
};

// Waktu olah per level upgrade (S1): Lv0 -> Lv1 -> Lv2.
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
  orderGap: 2.5, // detik: order baru setelah slot kosong
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
  vipChance: 0.25, // v17 S1: peluang order baru jadi VIP (tiket emas)
  vipMultiplier: 2, // v17 S1: VIP membayar 2x harga dasar
  urgentSeconds: 10, // v17 S2: kesabaran <10 dtk = denyut merah
  rushEvery: 30, // v19 S5: detik antar periode RUSH (v18: 45)
  rushDuration: 12, // v18 C2: durasi RUSH (detik)
  rushTipBonus: 2, // v18 C2: tip tambahan per saji saat RUSH
  rushOrderGap: 1.2, // v18 C2: gap spawn order saat RUSH (detik)
  specialBonus: 2, // v18 C3: harga tambahan hidangan SPESIAL (Rp)
  comboGlowAt: 3, // v18 C4: kombo >= 3 -> kilau emas di piring + teks emas
  paketChance: 0.15, // v19 S2: peluang order baru jadi PAKET (2 hidangan)
  paketBonus: 5, // v19 S2: bonus Rp pesanan paket (di atas jumlah dasar)
  freshSeconds: 1.5, // v19 S6: durasi kilau "fresh" order baru (detik)
  coinFxCount: 10, // v19 S3: jumlah partikel koin saat saji
  clingCount: 12, // v19 S6: jumlah sparkle Cling saat saji
};

// Layout (v15: kartu jadi 2 baris x 9 kolom; sisanya tetap v11-v14).
// v19: footer dirombak jadi toko upgrade (S1).
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
  kartuAkhir: { x: 360, y: 190, w: 560, h: 320 },
  // v19 S1: tombol upgrade di footer.
  tombolUpgrade: {
    talenan: { x: 12, y: 634, w: 280, h: 40 },
    kompor: { x: 300, y: 634, w: 280, h: 40 },
  },
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
