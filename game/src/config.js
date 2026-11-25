// Dapur Kilat v12 — konfigurasi game.
// Menu: ayam HILANG total. Nasi Goreng Udang, Spaghetti Bolognese,
// Burger (+ kentang goreng sebagai pendamping visual), Es Teh Manis.
// v12: nasi goreng — nasi HARUS terlihat (telur + udang kecil, di pinggir);
// spaghetti — helai DITUMPUK rapat tanpa rongga.

export const W = 1280;
export const H = 720;

export const STATIONS = {
  talenan: { name: 'TALENAN', time: 2.0 },
  kompor: { name: 'KOMPOR', time: 3.2 },
};

// Bahan: id -> { label, station: 'talenan' | 'kompor' | 'siap', color, draw }.
// 'siap' = langsung bisa ditaruh di piring tanpa diolah.
export const INGREDIENTS = {
  nasi: { label: 'Nasi', station: 'kompor', color: '#f2e6c8' },
  telur: { label: 'Telur', station: 'kompor', color: '#ffe066' },
  kecap: { label: 'Kecap', station: 'siap', color: '#5a2c12' },
  udang: { label: 'Udang', station: 'talenan', color: '#f28b6d' },
  spaghetti: { label: 'Spaghetti', station: 'kompor', color: '#f2c94c' },
  daging: { label: 'Daging', station: 'talenan', color: '#c96a5a' },
  saus: { label: 'Saus Tomat', station: 'siap', color: '#c93a1e' },
  keju: { label: 'Keju', station: 'siap', color: '#fff6e0' },
  roti: { label: 'Roti', station: 'siap', color: '#e8b96a' },
  patty: { label: 'Patty', station: 'kompor', color: '#8a5a3b' },
  selada: { label: 'Selada', station: 'talenan', color: '#3e9b4f' },
  teh: { label: 'Teh', station: 'siap', color: '#a85a2a' },
  es: { label: 'Es', station: 'talenan', color: '#bfe8ff' },
  gula: { label: 'Gula', station: 'siap', color: '#ffffff' },
};

// Hidangan: id -> { label, ingredients: [id...], base }.
// base = harga dasar (Rp). Urutan bahan = urutan ikon di tiket & piring.
export const DISHES = {
  nasgor: { label: 'Nasi Goreng', ingredients: ['nasi', 'telur', 'kecap', 'udang'], base: 19 },
  spaghetti: { label: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'daging', 'saus', 'keju'], base: 17 },
  burger: { label: 'Burger', ingredients: ['roti', 'patty', 'keju', 'selada'], base: 18 },
  esteh: { label: 'Es Teh Manis', ingredients: ['teh', 'es', 'gula'], base: 11 },
};

// Urutan bahan di meja (counter), 6 kartu.
export const COUNTER = ['nasi', 'telur', 'udang', 'spaghetti', 'daging', 'patty'];

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
};

// Layout (tetap, v11).
export const LAYOUT = {
  header: { x: 0, y: 0, w: 1280, h: 64 },
  talenan: { x: 12, y: 76, w: 280, h: 220 },
  kompor: { x: 304, y: 76, w: 280, h: 220 },
  piring: { x: 596, y: 76, w: 312, h: 220 },
  plateCenter: { x: 752, y: 188, r: 70 },
  pesan: { x: 12, y: 308, w: 572, h: 48 },
  sajikan: { x: 596, y: 308, w: 312, h: 48 },
  kartu: { x: 12, y: 368, w: 896, h: 232, gap: 12 },
  footer: { x: 12, y: 612, w: 896, h: 96 },
  papan: { x: 920, y: 76, w: 348, h: 632 },
  tiket: { x: 932, y: 88, w: 324, h: 196, gap: 12 },
  tombolJudul: { x: 440, y: 520, w: 400, h: 64 },
  kartuAkhir: { x: 360, y: 190, w: 560, h: 320 },
};
