// Dapur Kilat v11 — konfigurasi game.
// Menu: ayam HILANG total. Nasi Goreng Udang, Spaghetti Bolognese,
// Burger (+ kentang goreng sebagai pendamping visual), Es Teh Manis.
// v11: spaghetti matang = sarang melingkar rapih;
// tomat+timun Nasi Goreng = melengkung mengikuti sisi nasi.
export const W = 1280;
export const H = 720;

export const COLORS = {
  wall: '#f3e9d2',
  wallLine: '#e3d3ae',
  wood: '#b98a56',
  woodDark: '#8a5f33',
  panel: '#fffaf0',
  panelBorder: '#c9a86a',
  ink: '#4a2c14',
  inkSoft: '#7a5a3a',
  gold: '#d9a441',
  green: '#3e9b4f',
  greenDark: '#2c7a3a',
  red: '#d94f3d',
  redDark: '#b23a2c',
  cream: '#fff6e0',
  ticket: '#fffdf6',
  ticketReady: '#e7f7e3',
  barBg: '#e8dcc0',
  barGood: '#58b368',
  barWarn: '#e8a33d',
  barBad: '#d94f3d',
};

export const ECONOMY = {
  chopTime: 2.0,
  cookTime: 3.2,
  patienceStart: 45,
  patienceStep: 1.5,
  patienceMin: 25,
  tipMax: 6,
  comboStep: 0.1,
  comboMax: 0.5,
  strikesMax: 3,
  servesToWin: 12,
  orderDelay: 2.5,
};

export const LAYOUT = {
  header: { x: 0, y: 0, w: 1280, h: 64 },
  talenan: { x: 12, y: 76, w: 280, h: 220 },
  kompor: { x: 304, y: 76, w: 280, h: 220 },
  piring: { x: 596, y: 76, w: 312, h: 220 },
  pesan: { x: 12, y: 308, w: 572, h: 48 },
  sajikan: { x: 596, y: 308, w: 312, h: 48 },
  kartu: { x: 12, y: 368, w: 896, h: 232, gap: 12 },
  footer: { x: 12, y: 612, w: 896, h: 96 },
  papan: { x: 920, y: 76, w: 348, h: 632 },
  tiket: { x: 932, y: 88, w: 324, h: 196, gap: 12 },
  plateCenter: { x: 752, y: 188 },
  plateR: 70,
  tombolJudul: { x: 440, y: 520, w: 400, h: 64 },
  kartuAkhir: { x: 360, y: 190, w: 560, h: 320 },
};

export const STATION_LABEL = {
  talenan: 'TALENAN',
  kompor: 'KOMPOR',
  siap: 'SIAP',
};

export const STATION_COLOR = {
  talenan: '#3e9b4f',
  kompor: '#d94f3d',
  siap: '#3b82c4',
};

// Bahan: station 'talenan' | 'kompor' | 'siap'.
// Stasiun seimbang: kompor nasi/telur/spaghetti/patty (4),
// talenan udang/daging/selada/es (4),
// siap kecap/saus/keju/roti/teh/gula (6).
// Kentang goreng BUKAN bahan — ia hiasan visual pendamping Burger saja.
export const INGREDIENTS = {
  nasi: { name: 'Nasi', station: 'kompor' },
  telur: { name: 'Telur', station: 'kompor' },
  kecap: { name: 'Kecap', station: 'siap' },
  udang: { name: 'Udang', station: 'talenan' },
  spaghetti: { name: 'Spaghetti', station: 'kompor' },
  daging: { name: 'Daging', station: 'talenan' },
  saus: { name: 'Saus Tomat', station: 'siap' },
  keju: { name: 'Keju', station: 'siap' },
  roti: { name: 'Roti', station: 'siap' },
  patty: { name: 'Patty', station: 'kompor' },
  selada: { name: 'Selada', station: 'talenan' },
  teh: { name: 'Teh', station: 'siap' },
  es: { name: 'Es', station: 'talenan' },
  gula: { name: 'Gula', station: 'siap' },
};

// Semua bahan pantry (dipakai mengisi meja sampai 6 kartu).
export const PANTRY = Object.keys(INGREDIENTS);

export const DISHES = {
  nasgor: {
    name: 'Nasi Goreng',
    ingredients: ['nasi', 'telur', 'kecap', 'udang'],
    base: 19,
  },
  spaghetti: {
    name: 'Spaghetti Bolognese',
    ingredients: ['spaghetti', 'daging', 'saus', 'keju'],
    base: 17,
  },
  burger: {
    name: 'Burger',
    ingredients: ['roti', 'patty', 'keju', 'selada'],
    base: 18,
  },
  esteh: {
    name: 'Es Teh Manis',
    ingredients: ['teh', 'es', 'gula'],
    base: 11,
  },
};

export const DISH_IDS = ['nasgor', 'spaghetti', 'burger', 'esteh'];
