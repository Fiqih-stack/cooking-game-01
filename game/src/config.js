// Dapur Kilat v2 — configuration: recipes, ingredients, timings, layout.
// Canvas 1280x720 (CSS pixels). Every drawing and hit test uses these numbers.

export const CANVAS_W = 1280;
export const CANVAS_H = 720;

export const TIMINGS = {
  talenan: 2.0, // seconds to chop on the cutting board
  kompor: 3.2, // seconds to cook on the stove
  orderRefill: 2.5, // seconds after a slot frees before a new order arrives
  patienceStart: 45, // seconds of patience for the first order
  patienceMin: 25, // patience never drops below this
  patienceStep: 1.5, // patience lost per order already served
};

export const DAY = {
  ordersToServe: 12,
  maxStrikes: 3,
  maxActiveOrders: 3,
  tipMax: 6, // fastest serve earns this many extra coins
  comboStep: 0.1, // each combo step adds 10% to the payout
  comboCap: 0.5, // combo bonus caps at +50%
};

// Every ingredient knows which station it needs, or 'siap' when it is ready.
export const INGREDIENTS = {
  nasi: { id: 'nasi', name: 'Nasi', station: 'kompor', label: 'Kompor' },
  ayam: { id: 'ayam', name: 'Ayam', station: 'talenan', label: 'Talenan' },
  kecap: { id: 'kecap', name: 'Kecap', station: 'siap', label: 'Siap' },
  mie: { id: 'mie', name: 'Mie', station: 'kompor', label: 'Kompor' },
  kaldu: { id: 'kaldu', name: 'Kaldu', station: 'siap', label: 'Siap' },
  sate: { id: 'sate', name: 'Sate', station: 'kompor', label: 'Kompor' },
  teh: { id: 'teh', name: 'Teh', station: 'siap', label: 'Siap' },
  es: { id: 'es', name: 'Es', station: 'talenan', label: 'Talenan' },
  gula: { id: 'gula', name: 'Gula', station: 'siap', label: 'Siap' },
  kacang: { id: 'kacang', name: 'Kacang', station: 'siap', label: 'Siap' },
};

export const RECIPES = [
  { id: 'nasi-goreng', name: 'Nasi Goreng', color: '#e07840', colorDark: '#b85a28', ingredients: ['nasi', 'ayam', 'kecap'], base: 16 },
  { id: 'mie-ayam', name: 'Mie Ayam', color: '#e8b93a', colorDark: '#c0921f', ingredients: ['mie', 'ayam', 'kaldu'], base: 15 },
  { id: 'sate-ayam', name: 'Sate Ayam', color: '#a85b32', colorDark: '#7e3f1e', ingredients: ['sate', 'kacang'], base: 13 },
  { id: 'es-teh', name: 'Es Teh Manis', color: '#7fb3d5', colorDark: '#4a7ea6', ingredients: ['teh', 'es', 'gula'], base: 11 },
];

export function recipeById(id) {
  return RECIPES.find((r) => r.id === id);
}

// Warm kitchen palette with depth: every big surface is a gradient.
export const COLORS = {
  wallTop: '#f9ead0',
  wallBottom: '#ecd3a4',
  woodTop: '#c08a4e',
  woodBottom: '#96682f',
  woodGrain: 'rgba(90, 50, 20, 0.10)',
  headerTop: '#4a2c17',
  headerBottom: '#2e1a0c',
  panelTop: '#fff9ea',
  panelBottom: '#f2dfb0',
  panelBorder: '#d9b96a',
  gold: '#d4a437',
  goldLight: '#f0c75e',
  ink: '#3a2415',
  inkDim: '#8a6d4b',
  cream: '#fff8e7',
  greenTop: '#58b368',
  greenBottom: '#3e8f4f',
  greenDark: '#2e6b3a',
  red: '#d94f3d',
  amber: '#e8a13a',
  plateRim: '#d4a437',
  garnish: '#58a05a',
};

// Fixed layout. Stations and board sit on the counter; cards below them.
export const LAYOUT = {
  header: { x: 0, y: 0, w: 1280, h: 64 },
  stations: {
    talenan: { x: 12, y: 76, w: 280, h: 220 },
    kompor: { x: 304, y: 76, w: 280, h: 220 },
    piring: { x: 596, y: 76, w: 312, h: 220 },
  },
  message: { x: 12, y: 308, w: 572, h: 48 },
  serve: { x: 596, y: 308, w: 312, h: 48 },
  cards: { x: 12, y: 368, w: 896, h: 232, gap: 12, count: 6 },
  footer: { x: 12, y: 612, w: 896, h: 96 },
  board: { x: 920, y: 76, w: 348, h: 632 },
  tickets: { x: 932, y: 88, w: 324, h: 196, gap: 12, count: 3 },
  plate: { x: 752, y: 188, r: 70 },
  titleButton: { x: 440, y: 520, w: 400, h: 64 },
  endCard: { x: 360, y: 190, w: 560, h: 320 },
};

// One of the six uniform ingredient cards (mise en place: same size, even gaps).
export function cardRect(i) {
  const c = LAYOUT.cards;
  const w = (c.w - (c.count - 1) * c.gap) / c.count;
  return { x: c.x + i * (w + c.gap), y: c.y, w, h: c.h };
}

export function ticketRect(i) {
  const t = LAYOUT.tickets;
  return { x: t.x, y: t.y + i * (t.h + t.gap), w: t.w, h: t.h };
}

// Symmetric fine-dining arrangement of n items on the plate, around its centre.
export function plateSlots(n, cx, cy, radius) {
  if (n <= 1) return [{ x: cx, y: cy }];
  if (n === 2) return [{ x: cx - radius * 0.45, y: cy }, { x: cx + radius * 0.45, y: cy }];
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    out.push({ x: cx + Math.cos(a) * radius * 0.45, y: cy + Math.sin(a) * radius * 0.45 });
  }
  return out;
}

export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
