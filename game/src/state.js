// Dapur Kilat v18 — state & logika game.
// Alur: ambil bahan di meja -> olah di stasiun (talenan/kompor) atau
// langsung ke piring (bahan 'siap') -> rakit di piring -> sajikan.
// v18: C2 Jam Sibuk RUSH! (order cepat + tip +2); C3 Menu Spesial (+Rp 2).
// v17: 7 hidangan (Mie Goreng Spesial baru); bonus "SEMPURNA!" (v14)
// dipertahankan; S1 Pesanan VIP (tiket emas, 2x harga dasar).
// PENTING (pelajaran v12): s.prepared mencatat bahan yang sudah lewat
// stasiun — hanya bahan 'siap' ATAU yang ada di s.prepared boleh ditaruh
// di piring. Tanpa ini, bahan matang ditolak dari piring (bug v12).

import { DISHES, INGREDIENTS, RULES, STATIONS } from './config.js';

export function createState(opts = {}) {
  const s = {
    screen: 'title', // 'title' | 'main' | 'win' | 'over'
    time: 0,
    coins: 0,
    served: 0,
    combo: 0,
    strikes: 0,
    patience: RULES.patienceStart,
    orders: [], // { dish, patience, max, vip, special }
    orderTimer: 0,
    hand: null, // id bahan di tangan
    plate: [], // id bahan yang sudah diolah, di piring
    prepared: {}, // id bahan yang sudah lewat stasiun & siap ditaruh (true)
    stations: { talenan: null, kompor: null }, // { item, t, total } | null
    message: '',
    messageT: 0,
    floatText: null, // { text, t }
    perfect: null, // { text: 'SEMPURNA!', t } — saji sempurna terakhir
    paused: false,
    orderQueue: opts.orderQueue ? [...opts.orderQueue] : null,
    orderIdx: 0,
    // v18 C2: Jam Sibuk RUSH!
    rushActive: false, // sedang RUSH?
    rushTimer: 0, // hitung mundur durasi RUSH saat aktif
    rushNext: RULES.rushEvery, // hitung mundur menuju RUSH berikutnya
    // v18 C3: Menu Spesial Hari Ini (dipilih acak di startGame).
    specialDish: null,
  };
  return s;
}

function nextDish(s) {
  if (s.orderQueue) {
    const d = s.orderQueue[s.orderIdx % s.orderQueue.length];
    s.orderIdx++;
    return d;
  }
  const keys = Object.keys(DISHES);
  return keys[Math.floor(Math.random() * keys.length)];
}

// Harga yang tampil di tiket & dipakai sebagai dasar bayaran serve:
// harga dasar, +2 bila order SPESIAL (v18 C3), digandakan bila VIP (v17 S1).
// VIP spesial = (base + 2) * 2.
export function orderPrice(order) {
  const dish = DISHES[order.dish];
  let p = dish.base;
  if (order.special) p += RULES.specialBonus;
  return p * (order.vip ? RULES.vipMultiplier : 1);
}

export function spawnOrder(s) {
  if (s.orders.length >= RULES.ordersMax) return false;
  const dish = nextDish(s);
  // v17 S1: 25% peluang jadi Pesanan VIP (tiket emas, bayar 2x).
  const vip = Math.random() < RULES.vipChance;
  // v18 C3: order spesial bila hidangannya = spesial hari ini.
  const special = dish === s.specialDish;
  s.orders.push({ dish, patience: s.patience, max: s.patience, vip, special });
  return true;
}

export function startGame(s) {
  s.screen = 'main';
  s.time = 0;
  s.coins = 0;
  s.served = 0;
  s.combo = 0;
  s.strikes = 0;
  s.patience = RULES.patienceStart;
  s.orders = [];
  s.orderTimer = 0;
  s.hand = null;
  s.plate = [];
  s.prepared = {};
  s.stations = { talenan: null, kompor: null };
  s.message = 'Selamat pagi! Sajikan 12 pesanan hari ini.';
  s.messageT = 3;
  s.floatText = null;
  s.perfect = null;
  s.paused = false;
  // v18 C2: reset Jam Sibuk. C3: pilih Menu Spesial Hari Ini (acak).
  s.rushActive = false;
  s.rushTimer = 0;
  s.rushNext = RULES.rushEvery;
  const keys = Object.keys(DISHES);
  s.specialDish = keys[Math.floor(Math.random() * keys.length)];
  spawnOrder(s);
  spawnOrder(s);
  spawnOrder(s);
}

// Ambil bahan dari meja. Tolak bila tangan penuh, bahan tidak dikenal,
// atau bahan sudah ada di piring (soft-lock fix).
export function pickIngredient(s, id) {
  if (s.screen !== 'main' || s.paused) return false;
  if (s.hand) { setMessage(s, 'Tangan penuh! Taruh dulu bahan yang dipegang.'); return false; }
  if (!INGREDIENTS[id]) { setMessage(s, 'Bahan tidak dikenal.'); return false; }
  if (s.plate.includes(id)) { setMessage(s, 'Bahan itu sudah ada di piring.'); return false; }
  s.hand = id;
  return true;
}

// Pakai stasiun: mulai olah (bila kosong & tangan pegang bahan mentah),
// atau ambil hasil (bila selesai). Bahan 'siap' tidak bisa masuk stasiun.
export function useStation(s, name) {
  if (s.screen !== 'main' || s.paused) return false;
  const st = s.stations[name];
  if (st) {
    // Ambil hasil bila selesai.
    if (st.t >= st.total) {
      if (s.hand) { setMessage(s, 'Tangan penuh!'); return false; }
      s.hand = st.item;
      s.prepared[st.item] = true; // sudah diolah, boleh ditaruh di piring
      s.stations[name] = null;
      return true;
    }
    setMessage(s, 'Masih diolah, tunggu sebentar…');
    return false;
  }
  // Mulai olah.
  if (!s.hand) { setMessage(s, 'Ambil bahan dulu dari meja.'); return false; }
  const ing = INGREDIENTS[s.hand];
  if (!ing) return false;
  if (ing.station === 'siap') { setMessage(s, ing.label + ' sudah siap, langsung taruh di piring.'); return false; }
  if (ing.station !== name) {
    setMessage(s, ing.label + ' diolah di ' + STATIONS[ing.station].name + ', bukan di ' + STATIONS[name].name + '.');
    return false;
  }
  s.stations[name] = { item: s.hand, t: 0, total: STATIONS[name].time };
  s.hand = null;
  return true;
}

// Taruh bahan yang dipegang ke piring. Hanya bahan yang sudah diolah
// (atau 'siap') yang boleh ditaruh; bahan mentah ditolak.
export function placeOnPlate(s) {
  if (s.screen !== 'main' || s.paused) return false;
  if (!s.hand) { setMessage(s, 'Tidak ada bahan di tangan.'); return false; }
  const ing = INGREDIENTS[s.hand];
  if (!ing) return false;
  // Bahan mentah (butuh stasiun, belum diolah) tidak boleh langsung ke piring.
  // Boleh ditaruh bila 'siap' ATAU sudah lewat stasiun (ada di s.prepared).
  if (ing.station !== 'siap' && !s.prepared[s.hand]) {
    setMessage(s, ing.label + ' mentah! Olah dulu di ' + STATIONS[ing.station].name + '.');
    return false;
  }
  if (s.plate.includes(s.hand)) { setMessage(s, 'Bahan itu sudah ada di piring.'); return false; }
  delete s.prepared[s.hand];
  s.plate.push(s.hand);
  s.hand = null;
  return true;
}

// Cari order yang cocok dengan isi piring (semua bahan hidangan ada).
export function findMatchingOrder(s) {
  for (let i = 0; i < s.orders.length; i++) {
    const dish = DISHES[s.orders[i].dish];
    if (dish.ingredients.length !== s.plate.length) continue;
    if (dish.ingredients.every((id) => s.plate.includes(id))) return i;
  }
  return -1;
}

// Sajikan: orderIdx -1 = cari otomatis; >=0 = tiket tertentu.
// v14: saji SEMPURNA bila kesabaran >75% — bonus +Rp 3 + teks "SEMPURNA!".
// v17 S1: order VIP membayar 2x harga dasar (effectiveBase).
// v18 C2: tip +2 saat RUSH aktif. C3: effectiveBase sudah termasuk +2 spesial.
export function serve(s, orderIdx = -1) {
  if (s.screen !== 'main' || s.paused) return false;
  if (s.plate.length === 0) { setMessage(s, 'Piring kosong! Rakit hidangan dulu.'); return false; }
  let idx = orderIdx;
  if (idx < 0) idx = findMatchingOrder(s);
  if (idx < 0 || idx >= s.orders.length) {
    setMessage(s, 'Tidak ada pesanan yang cocok dengan isi piring.');
    return false;
  }
  const order = s.orders[idx];
  const dish = DISHES[order.dish];
  // Harga: effectiveBase (2x bila VIP, +2 bila SPESIAL) + tip kecepatan
  // (+2 bila RUSH) + bonus kombo + bonus SEMPURNA!
  const effectiveBase = orderPrice(order);
  const frac = Math.max(0, order.patience / order.max);
  const tip = Math.round(RULES.tipMax * frac) + (s.rushActive ? RULES.rushTipBonus : 0);
  const comboBonus = Math.round(effectiveBase * Math.min(RULES.comboMax, s.combo * RULES.comboStep));
  const isPerfect = frac > RULES.perfectThreshold;
  const perfectBonus = isPerfect ? RULES.perfectBonus : 0;
  const total = effectiveBase + tip + comboBonus + perfectBonus;
  s.coins += total;
  s.served += 1;
  s.combo += 1;
  s.floatText = { text: '+Rp ' + total, t: 1.2 };
  s.perfect = isPerfect ? { text: 'SEMPURNA!', t: 1.5 } : null;
  s.orders.splice(idx, 1);
  s.plate = [];
  s.prepared = {};
  s.patience = Math.max(RULES.patienceMin, s.patience - RULES.patienceStep);
  const vipPrefix = order.vip ? 'VIP! ' : '';
  const rushPrefix = s.rushActive ? 'RUSH! ' : '';
  setMessage(s, isPerfect
    ? 'SEMPURNA! ' + vipPrefix + rushPrefix + dish.label + ' disajikan! +Rp ' + total + '.'
    : vipPrefix + rushPrefix + dish.label + ' disajikan! +Rp ' + total + '.');
  if (s.served >= RULES.servesToWin) {
    s.screen = 'win';
    setMessage(s, 'Hari selesai! Total Rp ' + s.coins + '.');
  }
  return true;
}

export function setMessage(s, text) {
  s.message = text;
  s.messageT = 3;
}

export function tick(s, dt) {
  if (s.screen !== 'main' || s.paused) return;
  s.time += dt;
  if (s.messageT > 0) s.messageT -= dt;
  if (s.floatText) {
    s.floatText.t -= dt;
    if (s.floatText.t <= 0) s.floatText = null;
  }
  if (s.perfect) {
    s.perfect.t -= dt;
    if (s.perfect.t <= 0) s.perfect = null;
  }
  // v18 C2: Jam Sibuk RUSH! — mesin waktu: hitung mundur menuju RUSH,
  // lalu hitung mundur durasi RUSH, lalu kembali menunggu RUSH berikutnya.
  if (s.rushActive) {
    s.rushTimer -= dt;
    if (s.rushTimer <= 0) {
      s.rushActive = false;
      s.rushNext = RULES.rushEvery;
      setMessage(s, 'Jam sibuk selesai. Tarik napas, koki!');
    }
  } else {
    s.rushNext -= dt;
    if (s.rushNext <= 0) {
      s.rushActive = true;
      s.rushTimer = RULES.rushDuration;
      setMessage(s, '⚡ RUSH! Pesanan datang lebih cepat, tip +Rp 2!');
    }
  }
  // Stasiun berjalan.
  for (const name of ['talenan', 'kompor']) {
    const st = s.stations[name];
    if (st && st.t < st.total) st.t = Math.min(st.total, st.t + dt);
  }
  // Kesabaran order berkurang; hangus -> strike.
  for (let i = s.orders.length - 1; i >= 0; i--) {
    s.orders[i].patience -= dt;
    if (s.orders[i].patience <= 0) {
      const dish = DISHES[s.orders[i].dish];
      s.orders.splice(i, 1);
      s.strikes += 1;
      s.combo = 0;
      setMessage(s, dish.label + ' hangus! Strike ' + s.strikes + '/' + RULES.strikesMax + '.');
      if (s.strikes >= RULES.strikesMax) {
        s.screen = 'over';
        setMessage(s, 'Shift berakhir. Total Rp ' + s.coins + '.');
        return;
      }
    }
  }
  // Order baru setelah slot kosong — lebih cepat saat RUSH (v18 C2).
  if (s.orders.length < RULES.ordersMax) {
    s.orderTimer += dt;
    const gap = s.rushActive ? RULES.rushOrderGap : RULES.orderGap;
    if (s.orderTimer >= gap) {
      s.orderTimer = 0;
      spawnOrder(s);
    }
  } else {
    s.orderTimer = 0;
  }
}
