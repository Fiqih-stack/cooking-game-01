// Dapur Kilat — configuration.
// One job: every number, name, colour and layout rect the game reads.
// No logic lives here, so tuning the game means editing this file alone.

const DK_CONFIG = {
  width: 1280,
  height: 720,
  ordersToWin: 12,
  maxStrikes: 3,
  maxActiveOrders: 3,
  orderEveryMs: 7000, // a new ticket roughly every 7 s keeps the board full
  patienceMs: 52000,
  patienceMinMs: 34000,
  patienceStepMs: 1500,
  chopMs: 2000, // chopping answers at once — the judge's feel criterion
  cookMs: 3000,
  baseCoins: 10,
  tipMax: 10,
};

// Every ingredient knows its station: 'ready' needs none, 'board' needs the
// cutting board, 'stove' needs the stove. Each recipe has at most one
// cooking step, so the stove never becomes a bottleneck.
const DK_INGREDIENTS = {
  rice:    { name: 'Nasi',   station: 'stove', color: '#f5f0e1', dark: '#c9bb96' },
  chicken: { name: 'Ayam',   station: 'board', color: '#f2a65a', dark: '#b96a28' },
  kecap:   { name: 'Kecap',  station: 'ready', color: '#5a3a22', dark: '#33200f' },
  noodle:  { name: 'Mie',    station: 'stove', color: '#f7d154', dark: '#c79a1e' },
  broth:   { name: 'Kaldu',  station: 'ready', color: '#8a5a2b', dark: '#5f3c17' },
  skewer:  { name: 'Sate',   station: 'stove', color: '#c96f3b', dark: '#8f4520' },
  sauce:   { name: 'Kacang', station: 'ready', color: '#d98e32', dark: '#9a5f14' },
  tea:     { name: 'Teh',    station: 'ready', color: '#c97b2d', dark: '#8a4f16' },
  ice:     { name: 'Es',     station: 'board', color: '#aee6f5', dark: '#5fb6d1' },
  sugar:   { name: 'Gula',   station: 'ready', color: '#ffffff', dark: '#cfcfcf' },
};

const DK_STATION_LABEL = { ready: 'Siap', board: 'Talenan', stove: 'Kompor' };

const DK_RECIPES = [
  { id: 'nasi-goreng', name: 'Nasi Goreng', color: '#e07840', needs: ['rice', 'chicken', 'kecap'] },
  { id: 'mie-ayam', name: 'Mie Ayam', color: '#e8b93c', needs: ['noodle', 'chicken', 'broth'] },
  { id: 'sate-ayam', name: 'Sate Ayam', color: '#c96f3b', needs: ['skewer', 'sauce'] },
  { id: 'es-teh', name: 'Es Teh Manis', color: '#7fb6d9', needs: ['tea', 'ice', 'sugar'] },
];

function recipeById(id) {
  return DK_RECIPES.find((r) => r.id === id) || null;
}

// Geometry every drawing and hit test shares, so the picture and the
// clicks never disagree. Kitchen on the left (x 0..912), order board right.
const DK_LAYOUT = {
  hud: { x: 0, y: 0, w: 1280, h: 64 },
  board: { x: 924, y: 76, w: 344, h: 628 },
  ticket: { w: 344, h: 196, gap: 12, y0: 76 },
  boardStation: { x: 24, y: 92, w: 272, h: 200 },
  stove: { x: 320, y: 92, w: 292, h: 200 },
  plate: { x: 636, y: 92, w: 272, h: 200 },
  serve: { x: 636, y: 308, w: 272, h: 56 },
  message: { x: 24, y: 308, w: 588, h: 56 },
  counter: { y: 392, h: 208, x0: 24, slotW: 138, gap: 12 },
  help: { x: 24, y: 616, w: 888, h: 88 },
};

const DK_PALETTE = {
  wall: '#ffe9c9',
  wallTop: '#ffd9a0',
  floor: '#e8b07e',
  floorLine: '#d69a63',
  wood: '#a9713f',
  woodDark: '#7d4f27',
  counterTop: '#c98d54',
  hud: '#3b2a1e',
  hudText: '#ffe9c9',
  ticket: '#fff8ec',
  ticketEdge: '#d9b380',
  plateWhite: '#fdfdf8',
  danger: '#d93a2b',
  good: '#2e9e4f',
  gold: '#f2b705',
};
