// Dapur Kilat v11 — logika game (tanpa DOM).
// Alur: ambil bahan -> olah di stasiun -> taruh di piring -> sajikan.
// Menu dibaca dari config.js, jadi logika ini tidak terikat pada hidangan tertentu.
import { DISHES, DISH_IDS, ECONOMY, INGREDIENTS, PANTRY } from './config.js';

// Kesabaran pesanan: 45 dtk awal, -1,5 dtk per pesanan tersaji, min 25 dtk.
export function patienceFor(served) {
  return Math.max(
    ECONOMY.patienceMin,
    ECONOMY.patienceStart - served * ECONOMY.patienceStep,
  );
}

export function createState(opts = {}) {
  return {
    screen: 'title',
    paused: false,
    coins: 0,
    served: 0,
    strikes: 0,
    combo: 0,
    elapsed: 0,
    orders: [null, null, null],
    spawnTimers: [0, 0, 0],
    counter: [],
    stations: { talenan: null, kompor: null },
    plate: [],
    hand: null,
    message: '',
    floats: [],
    orderQueue: opts.orderQueue ? [...opts.orderQueue] : null,
  };
}

// Pilih hidangan berikutnya: dari antrean (untuk tes/shot) atau acak.
function nextDish(s) {
  if (s.orderQueue && s.orderQueue.length > 0) return s.orderQueue.shift();
  return DISH_IDS[Math.floor(Math.random() * DISH_IDS.length)];
}

export function spawnOrder(s, slot) {
  const dish = nextDish(s);
  s.orders[slot] = {
    dish,
    patience: patienceFor(s.served),
    maxPatience: patienceFor(s.served),
  };
}

// Meja: bahan pesanan aktif (paling mendesak dulu) + pantry sampai 6 kartu.
export function refreshCounter(s) {
  const need = [];
  const ordered = [...s.orders]
    .filter(Boolean)
    .sort((a, b) => a.patience - b.patience);
  for (const o of ordered) {
    for (const id of DISHES[o.dish].ingredients) {
      if (!need.includes(id) && !s.plate.includes(id)) need.push(id);
    }
  }
  for (const id of PANTRY) {
    if (need.length >= 6) break;
    if (!need.includes(id)) need.push(id);
  }
  s.counter = need.slice(0, 6);
}

export function startDay(s) {
  s.screen = 'main';
  s.paused = false;
  s.coins = 0;
  s.served = 0;
  s.strikes = 0;
  s.combo = 0;
  s.elapsed = 0;
  s.orders = [null, null, null];
  s.spawnTimers = [0, 0, 0];
  s.stations = { talenan: null, kompor: null };
  s.plate = [];
  s.hand = null;
  s.floats = [];
  s.message = 'Hari dimulai — sajikan 12 pesanan!';
  for (let i = 0; i < 3; i++) spawnOrder(s, i);
  refreshCounter(s);
}

export function restartDay(s) {
  startDay(s);
}

export function togglePause(s) {
  if (s.screen !== 'main') return;
  s.paused = !s.paused;
  s.message = s.paused ? 'Jeda — tekan P untuk lanjut.' : '';
}

// Ambil bahan dari meja ke tangan.
export function pickIngredient(s, id) {
  if (s.screen !== 'main' || s.paused) return { ok: false, msg: 'Tidak bisa mengambil sekarang.' };
  if (!INGREDIENTS[id]) return { ok: false, msg: 'Bahan tidak dikenal.' };
  if (s.hand) return { ok: false, msg: 'Tangan sudah penuh.' };
  // Perbaikan soft-lock v6/v7/v8/v9/v10: bahan yang sudah ada di piring tidak bisa diambil lagi.
  if (s.plate.includes(id)) return { ok: false, msg: 'Bahan sudah ada di piring.' };
  const idx = s.counter.indexOf(id);
  if (idx < 0) return { ok: false, msg: 'Bahan tidak ada di meja.' };
  s.counter.splice(idx, 1);
  const ing = INGREDIENTS[id];
  s.hand = { id, processed: ing.station === 'siap' };
  s.message = ing.station === 'siap'
    ? `${ing.name} siap dipakai — taruh di piring.`
    : `${ing.name} di tangan — olah di ${ing.station === 'talenan' ? 'talenan' : 'kompor'}.`;
  return { ok: true };
}

// Pakai stasiun: mulai olah (tangan berisi bahan mentah) atau ambil hasil olahan.
export function useStation(s, station) {
  if (s.screen !== 'main' || s.paused) return { ok: false, msg: 'Tidak bisa memakai stasiun sekarang.' };
  if (station !== 'talenan' && station !== 'kompor') return { ok: false, msg: 'Stasiun tidak dikenal.' };
  const st = s.stations[station];
  // Ambil hasil olahan yang sudah selesai.
  if (!s.hand) {
    if (!st) return { ok: false, msg: 'Stasiun kosong.' };
    if (st.t < st.total) return { ok: false, msg: 'Masih diolah — tunggu sebentar.' };
    // Perbaikan soft-lock: hasil olahan yang sudah ada di piring tidak bisa diambil.
    if (s.plate.includes(st.item)) return { ok: false, msg: 'Bahan sudah ada di piring.' };
    s.hand = { id: st.item, processed: true };
    s.stations[station] = null;
    s.message = `${INGREDIENTS[st.item].name} sudah diolah — taruh di piring.`;
    return { ok: true };
  }
  // Mulai olah bahan mentah di tangan.
  const ing = INGREDIENTS[s.hand.id];
  if (s.hand.processed) return { ok: false, msg: 'Bahan sudah siap — taruh di piring.' };
  if (ing.station !== station) {
    return { ok: false, msg: `${ing.name} diolah di ${ing.station === 'talenan' ? 'talenan' : 'kompor'}, bukan ${station}.` };
  }
  if (st) return { ok: false, msg: 'Stasiun sedang dipakai.' };
  const total = station === 'talenan' ? ECONOMY.chopTime : ECONOMY.cookTime;
  s.stations[station] = { item: s.hand.id, t: 0, total };
  s.hand = null;
  s.message = `${ing.name} sedang diolah di ${station}…`;
  return { ok: true };
}

// Taruh bahan olahan dari tangan ke piring.
export function placeOnPlate(s) {
  if (s.screen !== 'main' || s.paused) return { ok: false, msg: 'Tidak bisa menaruh sekarang.' };
  if (!s.hand) return { ok: false, msg: 'Tangan kosong.' };
  if (!s.hand.processed) return { ok: false, msg: 'Bahan mentah — olah dulu sebelum ditaruh.' };
  if (s.plate.includes(s.hand.id)) return { ok: false, msg: 'Bahan sudah ada di piring.' };
  s.plate.push(s.hand.id);
  const name = INGREDIENTS[s.hand.id].name;
  s.hand = null;
  s.message = `${name} sudah di piring.`;
  return { ok: true };
}

function dishForPlate(plate) {
  for (const id of DISH_IDS) {
    const need = DISHES[id].ingredients;
    if (need.length === plate.length && need.every((x) => plate.includes(x))) return id;
  }
  return null;
}

// Hidangan yang cocok dengan isi piring saat ini (null bila belum lengkap).
export function plateDish(s) {
  return dishForPlate(s.plate);
}

// Sajikan piring ke pesanan yang cocok (atau slot tertentu).
export function serve(s, slot = -1) {
  if (s.screen !== 'main' || s.paused) return { ok: false, msg: 'Tidak bisa menyajikan sekarang.' };
  const dish = dishForPlate(s.plate);
  if (!dish) return { ok: false, msg: 'Piring belum lengkap.' };
  let target = slot;
  if (target < 0) {
    target = s.orders.findIndex((o) => o && o.dish === dish);
  }
  if (target < 0 || !s.orders[target] || s.orders[target].dish !== dish) {
    return { ok: false, msg: 'Tidak ada pesanan yang cocok.' };
  }
  const order = s.orders[target];
  const base = DISHES[dish].base;
  const speedBonus = Math.max(0, Math.min(ECONOMY.tipMax, Math.floor(order.patience / 8)));
  const comboBonus = Math.round(base * Math.min(ECONOMY.comboMax, s.combo * ECONOMY.comboStep));
  const price = base + speedBonus + comboBonus;
  s.coins += price;
  s.served += 1;
  s.combo += 1;
  s.orders[target] = null;
  s.spawnTimers[target] = ECONOMY.orderDelay;
  s.plate = [];
  s.floats.push({ text: `+Rp ${price}`, x: 752, y: 150, t: 0 });
  s.message = `${DISHES[dish].name} tersaji! +Rp ${price}`;
  refreshCounter(s);
  if (s.served >= ECONOMY.servesToWin) {
    s.screen = 'win';
    s.message = 'Hari selesai — semua pesanan tersaji!';
  }
  return { ok: true, price };
}

// Majukan waktu: olahan di stasiun, pesanan baru, kesabaran, float.
export function tick(s, dt) {
  if (s.screen !== 'main' || s.paused) return;
  if (!(dt > 0)) return;
  s.elapsed += dt;
  // Stasiun mengolah.
  for (const key of ['talenan', 'kompor']) {
    const st = s.stations[key];
    if (st && st.t < st.total) st.t = Math.min(st.total, st.t + dt);
  }
  // Pesanan baru setelah slot kosong.
  for (let i = 0; i < 3; i++) {
    if (!s.orders[i] && s.spawnTimers[i] > 0) {
      s.spawnTimers[i] -= dt;
      if (s.spawnTimers[i] <= 0) {
        spawnOrder(s, i);
        refreshCounter(s);
      }
    }
  }
  // Kesabaran pesanan berkurang; hangus = strike.
  for (let i = 0; i < 3; i++) {
    const o = s.orders[i];
    if (!o) continue;
    o.patience -= dt;
    if (o.patience <= 0) {
      s.orders[i] = null;
      s.spawnTimers[i] = ECONOMY.orderDelay;
      s.strikes += 1;
      s.combo = 0;
      s.message = `Pesanan ${DISHES[o.dish].name} hangus! (${s.strikes}/${ECONOMY.strikesMax})`;
      refreshCounter(s);
      if (s.strikes >= ECONOMY.strikesMax) {
        s.screen = 'over';
        s.message = 'Shift berakhir — terlalu banyak pesanan hangus.';
      }
    }
  }
  // Float "+Rp" melayang lalu hilang.
  s.floats = s.floats.filter((f) => {
    f.t += dt;
    f.y -= 28 * dt;
    return f.t < 1.2;
  });
}
