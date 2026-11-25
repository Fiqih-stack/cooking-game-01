// Dapur Kilat — state and rules.
// One job: orders, hand, stations, plate, coins and the day's progress.
// Drawing lives in render.js, input in input.js, the loop in main.js.

const DKState = {
  screen: 'title', // 'title' | 'playing' | 'paused' | 'complete' | 'gameover'
  time: 0, // ms since the shift started
  coins: 0,
  served: 0,
  strikes: 0,
  combo: 0,
  bestCombo: 0,
  orders: [], // { id, recipeId, patience, maxPatience }
  nextOrderId: 1,
  nextOrderIn: 0,
  hand: null, // { id, ready } — the one item being carried
  board: { busy: null, done: null }, // cutting board: { item, endsAt } / finished item
  stove: { busy: null, done: null }, // stove, same shape
  plate: [], // placed items: [{ id }] — every one of them ready
  message: '',
  messageAt: 0,
  frozen: false, // shot mode: the scene is set and time does not advance
};

function showMessage(text) {
  DKState.message = text;
  DKState.messageAt = DKState.time;
}

function resetGame() {
  DKState.screen = 'playing';
  DKState.time = 0;
  DKState.coins = 0;
  DKState.served = 0;
  DKState.strikes = 0;
  DKState.combo = 0;
  DKState.bestCombo = 0;
  DKState.orders = [];
  DKState.nextOrderId = 1;
  DKState.nextOrderIn = DK_CONFIG.orderEveryMs;
  DKState.hand = null;
  DKState.board = { busy: null, done: null };
  DKState.stove = { busy: null, done: null };
  DKState.plate = [];
  DKState.message = '';
  DKState.messageAt = 0;
  DKState.frozen = false;
  spawnOrder();
  spawnOrder();
}

function patienceForOrder() {
  const p = DK_CONFIG.patienceMs - DKState.served * DK_CONFIG.patienceStepMs;
  return Math.max(DK_CONFIG.patienceMinMs, p);
}

function spawnOrder() {
  if (DKState.orders.length >= DK_CONFIG.maxActiveOrders) return;
  const recipe = DK_RECIPES[Math.floor(Math.random() * DK_RECIPES.length)];
  const patience = patienceForOrder();
  DKState.orders.push({
    id: DKState.nextOrderId++,
    recipeId: recipe.id,
    patience,
    maxPatience: patience,
  });
}

// The counter shows the ingredients the active orders need, first seen
// first, at most six — the six number keys pick them in this order.
function currentCounterSlots() {
  const seen = [];
  for (const order of DKState.orders) {
    const recipe = recipeById(order.recipeId);
    for (const id of recipe.needs) {
      if (!seen.includes(id)) seen.push(id);
    }
  }
  return seen.slice(0, 6);
}

function pickIngredient(id) {
  if (DKState.screen !== 'playing' || DKState.hand !== null) return false;
  if (!currentCounterSlots().includes(id)) return false;
  const ing = DK_INGREDIENTS[id];
  DKState.hand = { id, ready: ing.station === 'ready' };
  return true;
}

function stationOf(kind) {
  return kind === 'board' ? DKState.board : DKState.stove;
}

function stationDuration(kind) {
  return kind === 'board' ? DK_CONFIG.chopMs : DK_CONFIG.cookMs;
}

// Click a station: start processing the carried item, or collect a
// finished one. Returns true when the click did something.
function clickStation(kind) {
  if (DKState.screen !== 'playing') return false;
  const station = stationOf(kind);
  if (station.done !== null && DKState.hand === null) {
    DKState.hand = station.done;
    station.done = null;
    return true;
  }
  if (station.busy !== null) {
    showMessage('Masih diproses — tunggu sebentar.');
    return false;
  }
  if (DKState.hand === null) return false;
  const ing = DK_INGREDIENTS[DKState.hand.id];
  if (ing.station !== kind || DKState.hand.ready) {
    showMessage('Bahan ini tidak butuh ' + (kind === 'board' ? 'talenan' : 'kompor') + '.');
    return false;
  }
  station.busy = { item: DKState.hand, endsAt: DKState.time + stationDuration(kind) };
  DKState.hand = null;
  return true;
}

// Click the plate: place a ready item on it, or take the last one back.
function clickPlate() {
  if (DKState.screen !== 'playing') return false;
  if (DKState.hand !== null) {
    if (!DKState.hand.ready) {
      showMessage('Olahan dulu bahannya sebelum ditaruh di piring.');
      return false;
    }
    DKState.plate.push({ id: DKState.hand.id });
    DKState.hand = null;
    return true;
  }
  if (DKState.plate.length > 0) {
    DKState.hand = DKState.plate.pop();
    return true;
  }
  return false;
}

function clearPlate() {
  if (DKState.screen !== 'playing' || DKState.plate.length === 0) return false;
  DKState.plate = [];
  showMessage('Piring dikosongkan.');
  return true;
}

// The first order whose recipe matches exactly what the plate holds.
function matchingOrder() {
  const plateIds = DKState.plate.map((p) => p.id).sort().join(',');
  for (const order of DKState.orders) {
    const recipe = recipeById(order.recipeId);
    if ([...recipe.needs].sort().join(',') === plateIds) return order;
  }
  return null;
}

function serveOrder(order) {
  if (DKState.screen !== 'playing' || order === null) return false;
  const recipe = recipeById(order.recipeId);
  const left = order.patience / order.maxPatience;
  const tip = Math.round(DK_CONFIG.tipMax * left) + Math.min(DKState.combo, 5) * 2;
  const earned = DK_CONFIG.baseCoins + tip;
  DKState.coins += earned;
  DKState.served += 1;
  DKState.combo += 1;
  DKState.bestCombo = Math.max(DKState.bestCombo, DKState.combo);
  DKState.orders = DKState.orders.filter((o) => o.id !== order.id);
  DKState.plate = [];
  // A replacement ticket arrives within 3 s, so the board stays full.
  DKState.nextOrderIn = Math.min(DKState.nextOrderIn, 3000);
  showMessage(recipe.name + ' tersaji! +' + earned + ' koin.');
  if (DKState.served >= DK_CONFIG.ordersToWin) {
    DKState.screen = 'complete';
  }
  return true;
}

function serveFirstMatch() {
  return serveOrder(matchingOrder());
}

function failOrder(order) {
  DKState.orders = DKState.orders.filter((o) => o.id !== order.id);
  DKState.strikes += 1;
  DKState.combo = 0;
  showMessage('Pesanan hangus! Pelanggan pergi.');
  if (DKState.strikes >= DK_CONFIG.maxStrikes) {
    DKState.screen = 'gameover';
  }
}

// Advance timers, stations, order spawns and patience. dt is milliseconds.
function updateGame(dt) {
  if (DKState.screen !== 'playing' || DKState.frozen) return;
  DKState.time += dt;
  DKState.nextOrderIn -= dt;
  if (DKState.nextOrderIn <= 0) {
    spawnOrder();
    DKState.nextOrderIn = DK_CONFIG.orderEveryMs;
  }
  for (const station of [DKState.board, DKState.stove]) {
    if (station.busy !== null && DKState.time >= station.busy.endsAt) {
      station.done = { id: station.busy.item.id, ready: true };
      station.busy = null;
    }
  }
  const failed = [];
  for (const order of DKState.orders) {
    order.patience -= dt;
    if (order.patience <= 0) failed.push(order);
  }
  for (const order of failed) failOrder(order);
}
