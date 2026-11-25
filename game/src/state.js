// Dapur Kilat v2 — pure game logic. No DOM, no canvas, no timers of its own.
// Every function here is testable in Node: state in, state out.

import { TIMINGS, DAY, INGREDIENTS, RECIPES } from './config.js';

export function createGame(rng = Math.random) {
  return {
    screen: 'title', // title | playing | paused | dayComplete | gameOver
    frozen: false, // staged screenshots freeze time
    shotTime: 0, // fixed clock for frozen frames (steam, pulses)
    time: 0, // elapsed shift time in seconds
    coins: 0,
    served: 0,
    strikes: 0,
    combo: 0,
    bestCombo: 0,
    orders: [], // { id, recipe, patience, patienceMax }
    nextOrderId: 1,
    refillTimer: 0,
    hand: null, // { id, processed } held in the hand, or null
    stations: { talenan: null, kompor: null }, // { ing, progress, duration, done }
    plate: [], // ingredient ids arranged on the plate
    message: 'Selamat datang di Dapur Kilat!',
    floats: [], // floating "+Rp" texts: { x, y, text, life, max }
    rng,
  };
}

export function startDay(state) {
  state.screen = 'playing';
  state.frozen = false;
  state.time = 0;
  state.coins = 0;
  state.served = 0;
  state.strikes = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.orders = [];
  state.nextOrderId = 1;
  state.refillTimer = 0;
  state.hand = null;
  state.stations = { talenan: null, kompor: null };
  state.plate = [];
  state.floats = [];
  state.message = 'Ambil bahan dari meja, olah, lalu sajikan!';
  for (let i = 0; i < DAY.maxActiveOrders; i++) spawnOrder(state);
}

export function spawnOrder(state) {
  const recipe = RECIPES[Math.floor(state.rng() * RECIPES.length)];
  const patienceMax = Math.max(
    TIMINGS.patienceMin,
    TIMINGS.patienceStart - state.served * TIMINGS.patienceStep,
  );
  state.orders.push({
    id: state.nextOrderId++,
    recipe,
    patience: patienceMax,
    patienceMax,
  });
}

export function tickState(state, dt) {
  if (state.screen !== 'playing' || state.frozen) return;
  state.time += dt;

  // Patience drains; an order that runs out is a strike.
  for (const order of [...state.orders]) {
    order.patience -= dt;
    if (order.patience <= 0) expireOrder(state, order);
  }

  // Stations finish their work.
  for (const key of ['talenan', 'kompor']) {
    const job = state.stations[key];
    if (job && !job.done) {
      job.progress += dt / job.duration;
      if (job.progress >= 1) {
        job.progress = 1;
        job.done = true;
      }
    }
  }

  // Refill empty order slots.
  if (state.orders.length < DAY.maxActiveOrders) {
    state.refillTimer += dt;
    if (state.refillTimer >= TIMINGS.orderRefill) {
      state.refillTimer = 0;
      spawnOrder(state);
    }
  }

  // Floating texts rise and fade.
  for (const f of state.floats) {
    f.life -= dt;
    f.y -= 22 * dt;
  }
  state.floats = state.floats.filter((f) => f.life > 0);
}

export function expireOrder(state, order) {
  state.orders = state.orders.filter((o) => o.id !== order.id);
  state.strikes += 1;
  state.combo = 0;
  state.message = `Pesanan #${order.id} ${order.recipe.name} hangus!`;
  if (state.strikes >= DAY.maxStrikes) {
    state.screen = 'gameOver';
    state.message = 'Shift berakhir — 3 pesanan hangus.';
  }
}

export function pickIngredient(state, ingId) {
  if (state.hand) {
    state.message = 'Tangan penuh — letakkan dulu bahan di tangan.';
    return false;
  }
  // Ready ('siap') ingredients are already processed; the rest need a station.
  state.hand = { id: ingId, processed: INGREDIENTS[ingId].station === 'siap' };
  return true;
}

// What the plate currently matches, if anything.
export function matchingOrder(state) {
  if (state.plate.length === 0) return null;
  const plateSet = [...state.plate].sort().join(',');
  for (const order of state.orders) {
    const need = [...order.recipe.ingredients].sort().join(',');
    if (plateSet === need) return order;
  }
  return null;
}

// The tip rewards a fast serve; the combo multiplier uses the streak BEFORE
// this serve (so the first serve of a streak pays at 1x, the next at 1.1x…).
export function orderEarned(state, order) {
  const tip = Math.round(DAY.tipMax * (order.patience / order.patienceMax));
  const mult = 1 + Math.min(state.combo * DAY.comboStep, DAY.comboCap);
  return Math.round((order.recipe.base + tip) * mult);
}

export function tryServe(state) {
  const order = matchingOrder(state);
  if (!order) {
    state.message = 'Piring belum cocok dengan pesanan mana pun.';
    return false;
  }
  const earned = orderEarned(state, order);
  state.coins += earned;
  state.served += 1;
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.orders = state.orders.filter((o) => o.id !== order.id);
  state.plate = [];
  state.floats.push({ x: 752, y: 210, text: `+Rp ${earned}`, life: 1.2, max: 1.2 });
  state.message = `Disajikan! +Rp ${earned} — ${order.recipe.name}.`;
  if (state.served >= DAY.ordersToServe) {
    state.screen = 'dayComplete';
    state.message = 'Semua 12 pesanan tersaji. Hari selesai!';
  }
  return true;
}

export function clickStation(state, stationId) {
  const job = state.stations[stationId];
  if (job) {
    if (!job.done) {
      state.message = 'Masih diproses — tunggu sebentar.';
      return false;
    }
    if (state.hand) {
      state.message = 'Tangan penuh — letakkan dulu bahan di tangan.';
      return false;
    }
    state.hand = { id: job.ing, processed: true };
    state.stations[stationId] = null;
    state.message = `${INGREDIENTS[job.ing].name} sudah siap!`;
    return true;
  }
  if (!state.hand) {
    state.message = 'Ambil bahan dulu dari meja.';
    return false;
  }
  if (state.hand.processed) {
    state.message = `${INGREDIENTS[state.hand.id].name} sudah siap — langsung taruh di piring.`;
    return false;
  }
  const ing = INGREDIENTS[state.hand.id];
  if (ing.station !== stationId) {
    if (ing.station === 'talenan') {
      state.message = `${ing.name} perlu dipotong di talenan.`;
    } else {
      state.message = `${ing.name} perlu dimasak di kompor.`;
    }
    return false;
  }
  state.stations[stationId] = {
    ing: state.hand.id,
    progress: 0,
    duration: TIMINGS[stationId],
    done: false,
  };
  state.hand = null;
  return true;
}

// Clicking the plate places the held ingredient, or picks one back up.
export function clickPlate(state, index = -1) {
  if (state.hand) {
    const ing = INGREDIENTS[state.hand.id];
    if (!state.hand.processed) {
      state.message = `${ing.name} masih mentah — olah dulu di ${ing.label.toLowerCase()}.`;
      return false;
    }
    if (state.plate.includes(state.hand.id)) {
      state.message = `${ing.name} sudah ada di piring.`;
      return false;
    }
    const needed = state.orders.some((o) => o.recipe.ingredients.includes(state.hand.id));
    if (!needed) {
      state.message = `Tidak ada pesanan yang butuh ${ing.name} sekarang.`;
      return false;
    }
    state.plate.push(state.hand.id);
    state.hand = null;
    const match = matchingOrder(state);
    if (match) state.message = `${match.recipe.name} hampir jadi!`;
    return true;
  }
  if (index >= 0 && index < state.plate.length) {
    // Plated ingredients are always processed, so they go back ready to place.
    state.hand = { id: state.plate[index], processed: true };
    state.plate.splice(index, 1);
    return true;
  }
  return false;
}

// The six counter cards: ingredients the active orders need first (most
// urgent order first), topped up from the pantry so the row is always full.
export function counterIngredients(state) {
  const urgent = [...state.orders].sort((a, b) => a.patience - b.patience);
  const list = [];
  for (const order of urgent) {
    for (const ing of order.recipe.ingredients) {
      if (!list.includes(ing)) list.push(ing);
    }
  }
  const pantry = ['nasi', 'ayam', 'kecap', 'mie', 'kaldu', 'sate', 'teh', 'es', 'gula', 'kacang'];
  for (const ing of pantry) {
    if (list.length >= 6) break;
    if (!list.includes(ing)) list.push(ing);
  }
  return list.slice(0, 6);
}
