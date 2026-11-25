// Super Kitchen v28 — state & logika game.
// Alur: ambil bahan di meja -> olah di stasiun (talenan/kompor) atau
// langsung ke piring (bahan 'siap') -> rakit di piring -> sajikan.
// v28: TEMA PETIR — logo petir di judul (X1), tombol MULAI (X2),
// tombol SAJIKAN saat RUSH (X3). Semua di render.js; logika SAMA
// seperti v27 (tidak ada perubahan state).
// v27: RENAME Dapur Kilat -> Super Kitchen; W1 Stasiun terisi di
// preset play; W2 Tombol SAJIKAN hitungan bahan.
// v26: V1 Tiket cocok hijau; V2 Ikon stasiun + banner berlatar;
// V3 Efek HANGUS! (s.strikeFlash).
// v25: U1 Buang merah + pil Musik (render); U2 wajah tiket naik 60px
// + mulai 15px di atas + ikon tangan saat RUSH (render); U3 banner
// LEVEL naik (s.levelUp).
// v24: T1 footer 2 baris; T2 "♪" judul + RUSH SAJIKAN; T3 efek Buang
// (s.clearFx) + wajah tiket saat disajikan (s.servedTicket).
// v23: R1 Tombol Buang (clearPlate) + R2 konfeti menang (s.endT);
// R3 hiasan judul + R4 indikator musik (render saja).
// v22: Q1 countdown RUSH + progress level; Q2 pelanggan yang disajikan
// (s.servedCustomers); Q3 placeholder papan + ikon tangan; Q4 koin
// berdenyut (s.coinPulse).
// v21: P1 statistik akhir; P2 progress bar; P3 dekorasi; P4 batas
// PAKET (maks 1 di papan); P5 perbaiki overlap harga/SEMPURNA.
// v20: S1 antrean sfx (suara); S2 pelanggan di order; S3 Level 1-3;
// S4 kartu menu judul (render saja).
// v19: S1 Toko Upgrade Stasiun; S2 Pesanan Paket (2 hidangan, 1 tiket);
// S3 partikel koin + rincian bayaran; S5 RUSH tiap 30 dtk;
// S6 efek Cling (kilau saat saji + order baru fresh).
// v18: RUSH, SPESIAL (+Rp 2), kilau kombo >= 3.
// v17: 7 hidangan; bonus "SEMPURNA!" (v14); Pesanan VIP (2x).
// PENTING (pelajaran v12): s.prepared mencatat bahan yang sudah lewat
// stasiun — hanya bahan 'siap' ATAU yang ada di s.prepared boleh ditaruh
// di piring. Tanpa ini, bahan matang ditolak dari piring (bug v12).

import { CUSTOMERS, DISHES, INGREDIENTS, RULES, STATIONS, UPGRADE_COSTS, UPGRADE_MAX, UPGRADE_TIMES } from './config.js';

export function createState(opts = {}) {
  const s = {
    screen: 'title', // 'title' | 'main' | 'win' | 'over'
    time: 0,
    coins: 0,
    served: 0,
    combo: 0,
    strikes: 0,
    patience: RULES.patienceStart,
    orders: [], // { dish, patience, max, vip, special, paket, freshT, customer }
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
    // v19 S1: level upgrade stasiun (0..2).
    upg: { talenan: 0, kompor: 0 },
    // v19 S3: partikel koin yang terbang saat saji.
    coinFx: [], // { x, y, vx, vy, t, life }
    // v19 S6: sparkle Cling saat saji.
    sparkles: [], // { x, y, r, rot, vr, t, life }
    // v19 S3: rincian bayaran saji terakhir.
    breakdown: '',
    // v20 S1: antrean nama suara (main.js menguras & memainkan).
    sfx: [], // contoh: 'pick', 'serve', 'perfect', 'strike', 'rush', 'levelUp'
    // v20 S1: bisukan suara/musik.
    muted: false,
    // v20 S3: level tantangan (1..3).
    level: 1,
    // v20 S2: wajah pelanggan yang baru disajikan (tampil di panel PIRING).
    servedFace: null, // { customer, t }
    // v21 P1: statistik hari (tampil di layar akhir).
    stats: { perfect: 0, vip: 0, paket: 0, bestCombo: 0, rushServes: 0 },
    // v22 Q2: pelanggan yang sudah disajikan (indeks 0..5, urut saji).
    servedCustomers: [],
    // v22 Q4: denyut koin di header saat saji (detik, 0 = tidak berdenyut).
    coinPulse: 0,
    // v23 R2: timer layar akhir (detik) — untuk animasi konfeti menang.
    endT: 0,
    // v24 T3: partikel abu-abu saat Buang + wajah tiket yang disajikan.
    clearFx: [], // { x, y, vx, vy, r, t, life }
    servedTicket: null, // { customer, y, t } — wajah naik & memudar di papan
    // v25 U3: banner "LEVEL n!" di tengah layar saat level naik.
    levelUp: null, // { text, t }
    // v26 V3: efek "HANGUS!" merah saat pesanan hangus.
    strikeFlash: null, // { text, t }
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

// v20 S3: level dari jumlah saji (naik tiap 4 saji). 1..3.
export function levelFor(served) {
  return Math.min(3, Math.floor(served / RULES.levelServes) + 1);
}

// v22 Q1: teks progress level — "Lv {n} ({served%4}/4)" untuk level
// 1-2; "Lv 3 MAX" untuk level 3.
export function levelLabel(s) {
  const lv = levelFor(s.served);
  if (lv >= 3) return 'Lv 3 MAX';
  return 'Lv ' + lv + ' (' + (s.served % RULES.levelServes) + '/' + RULES.levelServes + ')';
}

// v20 S3: peluang & gap menurut level saat ini (index = level-1).
export function levelPaketChance(s) {
  return RULES.levelPaket[levelFor(s.served) - 1];
}
export function levelVipChance(s) {
  return RULES.levelVip[levelFor(s.served) - 1];
}
export function levelOrderGap(s) {
  return RULES.levelGap[levelFor(s.served) - 1];
}

// Dorong nama suara ke antrean (main.js yang memainkan).
export function pushSfx(s, name) {
  if (s.sfx) s.sfx.push(name);
}

// v19 S1: waktu olah stasiun menurut level upgrade.
export function stationTime(s, name) {
  const lv = s.upg ? s.upg[name] : 0;
  return UPGRADE_TIMES[name][Math.min(lv, UPGRADE_MAX)];
}

// v19 S1: beli upgrade stasiun. Kembalikan true bila berhasil.
export function buyUpgrade(s, name) {
  if (s.screen !== 'main' || s.paused) return false;
  const lv = s.upg[name];
  if (lv >= UPGRADE_MAX) { setMessage(s, STATIONS[name].name + ' sudah maksimal (Lv' + UPGRADE_MAX + ').'); return false; }
  const cost = UPGRADE_COSTS[name][lv];
  if (s.coins < cost) { setMessage(s, 'Koin kurang! ' + STATIONS[name].name + ' Lv' + (lv + 1) + ' butuh Rp ' + cost + '.'); return false; }
  s.coins -= cost;
  s.upg[name] = lv + 1;
  pushSfx(s, 'coin');
  setMessage(s, '⚡ ' + STATIONS[name].name + ' naik ke Lv' + (lv + 1) + '! Masak lebih cepat (' + UPGRADE_TIMES[name][lv + 1] + ' dtk).');
  return true;
}

// v24 T3: spawn partikel abu-abu (puff) di tengah piring saat Buang.
function spawnClearFx(s) {
  const cx = 752, cy = 188;
  for (let i = 0; i < RULES.clearFxCount; i++) {
    const a = (i / RULES.clearFxCount) * Math.PI * 2 + Math.random() * 0.5;
    const sp = 40 + Math.random() * 60;
    s.clearFx.push({
      x: cx + (Math.random() - 0.5) * 30,
      y: cy + (Math.random() - 0.5) * 15,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 30,
      r: 4 + Math.random() * 3,
      t: 0.7, life: 0.7,
    });
  }
}

// v23 R1: kosongkan piring (tombol Buang). Kembalikan true bila ada
// yang dibuang. Mengosongkan plate + prepared; tangan TIDAK disentuh
// (bahan di tangan tetap di tangan). v24 T3: spawn partikel abu-abu.
export function clearPlate(s) {
  if (s.screen !== 'main' || s.paused) return false;
  if (s.plate.length === 0) return false;
  s.plate = [];
  s.prepared = {};
  spawnClearFx(s);
  pushSfx(s, 'click');
  setMessage(s, 'Piring dikosongkan.');
  return true;
}

// Daftar bahan yang wajib ada di piring untuk order ini.
// Paket: union (unik) bahan kedua hidangan.
export function requiredIngredients(order) {
  if (order.paket) {
    const seen = {};
    const out = [];
    for (const d of order.paket) {
      for (const id of DISHES[d].ingredients) {
        if (!seen[id]) { seen[id] = true; out.push(id); }
      }
    }
    return out;
  }
  return DISHES[order.dish].ingredients;
}

// Harga yang tampil di tiket & dipakai sebagai dasar bayaran serve.
// v19 S2 paket: jumlah dasar kedua hidangan + bonus paket; SPESIAL +2
// bila salah satu hidangan paket = spesial hari ini (sekali saja);
// VIP menggandakan total.
export function orderPrice(order) {
  let p;
  if (order.paket) {
    p = DISHES[order.paket[0]].base + DISHES[order.paket[1]].base + RULES.paketBonus;
  } else {
    p = DISHES[order.dish].base;
  }
  if (order.special) p += RULES.specialBonus;
  return p * (order.vip ? RULES.vipMultiplier : 1);
}

// v20 S2: pelanggan acak (0..5) untuk order baru.
function randomCustomer() {
  return Math.floor(Math.random() * CUSTOMERS.length);
}

export function spawnOrder(s) {
  if (s.orders.length >= RULES.ordersMax) return false;
  // v21 P4: maks 1 PAKET di papan — selalu ada hidangan tunggal yang
  // bisa disajikan (papan penuh PAKET = piring 1 hidangan tak cocok).
  const hasPaket = s.orders.some((o) => o.paket);
  // v19 S2 + v20 S3: peluang PAKET menurut level.
  let paket = null;
  let dish;
  if (!hasPaket && Math.random() < levelPaketChance(s)) {
    const keys = Object.keys(DISHES);
    const a = keys[Math.floor(Math.random() * keys.length)];
    let b = keys[Math.floor(Math.random() * keys.length)];
    let guard = 0;
    while (b === a && guard < 20) { b = keys[Math.floor(Math.random() * keys.length)]; guard++; }
    paket = [a, b];
    dish = a;
  } else {
    dish = nextDish(s);
  }
  // v17 S1 + v20 S3: peluang VIP menurut level.
  const vip = Math.random() < levelVipChance(s);
  // v18 C3: order spesial bila hidangannya = spesial hari ini
  // (paket: bila salah satu hidangannya spesial).
  const special = paket
    ? (paket[0] === s.specialDish || paket[1] === s.specialDish)
    : (dish === s.specialDish);
  // v19 S6: order baru fresh (kilau emas) selama freshSeconds.
  // v20 S2: pelanggan acak.
  s.orders.push({ dish, patience: s.patience, max: s.patience, vip, special, paket, freshT: RULES.freshSeconds, customer: randomCustomer() });
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
  // v19: reset upgrade, partikel, sparkle, rincian.
  s.upg = { talenan: 0, kompor: 0 };
  s.coinFx = [];
  s.sparkles = [];
  s.breakdown = '';
  // v20: reset sfx, level, wajah saji.
  s.sfx = [];
  s.level = 1;
  s.servedFace = null;
  // v21 P1: reset statistik hari.
  s.stats = { perfect: 0, vip: 0, paket: 0, bestCombo: 0, rushServes: 0 };
  // v22 Q2/Q4: reset pelanggan yang disajikan & denyut koin.
  s.servedCustomers = [];
  s.coinPulse = 0;
  // v23 R2: reset timer layar akhir.
  s.endT = 0;
  // v24 T3: reset efek Buang & wajah tiket.
  s.clearFx = [];
  s.servedTicket = null;
  // v25 U3: reset banner LEVEL.
  s.levelUp = null;
  // v26 V3: reset efek HANGUS!.
  s.strikeFlash = null;
  pushSfx(s, 'click');
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
  pushSfx(s, 'pick');
  return true;
}

// Pakai stasiun: mulai olah (bila kosong & tangan pegang bahan mentah),
// atau ambil hasil (bila selesai). Bahan 'siap' tidak bisa masuk stasiun.
// v19 S1: total waktu olah = stationTime (menurut level upgrade).
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
      pushSfx(s, 'stationDone');
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
  s.stations[name] = { item: s.hand, t: 0, total: stationTime(s, name) };
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
  pushSfx(s, 'place');
  return true;
}

// Cari order yang cocok dengan isi piring (semua bahan wajib ada).
export function findMatchingOrder(s) {
  for (let i = 0; i < s.orders.length; i++) {
    const req = requiredIngredients(s.orders[i]);
    if (req.length !== s.plate.length) continue;
    if (req.every((id) => s.plate.includes(id))) return i;
  }
  return -1;
}

// v19 S3: spawn partikel koin (terbang ke header) + S6 sparkle Cling.
function spawnServeFx(s) {
  const cx = 752, cy = 188;
  for (let i = 0; i < RULES.coinFxCount; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const sp = 260 + Math.random() * 220;
    s.coinFx.push({
      x: cx + (Math.random() - 0.5) * 40,
      y: cy + (Math.random() - 0.5) * 20,
      vx: Math.cos(a) * sp - 120,
      vy: Math.sin(a) * sp,
      t: 0.8, life: 0.8,
    });
  }
  for (let i = 0; i < RULES.clingCount; i++) {
    const a = (i / RULES.clingCount) * Math.PI * 2 + Math.random() * 0.5;
    const r = 30 + Math.random() * 70;
    s.sparkles.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r * 0.7,
      r: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 3,
      t: 0.9, life: 0.9,
    });
  }
}

// Sajikan: orderIdx -1 = cari otomatis; >=0 = tiket tertentu.
// v14: saji SEMPURNA bila kesabaran >75% — bonus +Rp 3 + teks "SEMPURNA!".
// v17 S1: order VIP membayar 2x harga dasar (effectiveBase).
// v18 C2: tip +2 saat RUSH aktif. C3: effectiveBase sudah termasuk +2 spesial.
// v19 S2: paket membayar jumlah dasar + bonus paket. S3: rincian bayaran.
// v20 S3: naik level tiap 4 saji. S2: wajah pelanggan senang saat saji.
// v21 P1: catat statistik hari (perfect/vip/paket/bestCombo/rushServes).
// v22 Q2: catat pelanggan yang disajikan. Q4: denyut koin di header.
// v24 T3: catat servedTicket (wajah naik & memudar di papan).
// v25 U3: banner "LEVEL n!" saat level naik.
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
  // Harga: effectiveBase (2x bila VIP, +2 bila SPESIAL, paket = jumlah+5)
  // + tip kecepatan (+2 bila RUSH) + bonus kombo + bonus SEMPURNA!
  const effectiveBase = orderPrice(order);
  const frac = Math.max(0, order.patience / order.max);
  const tip = Math.round(RULES.tipMax * frac) + (s.rushActive ? RULES.rushTipBonus : 0);
  const comboBonus = Math.round(effectiveBase * Math.min(RULES.comboMax, s.combo * RULES.comboStep));
  const isPerfect = frac > RULES.perfectThreshold;
  const perfectBonus = isPerfect ? RULES.perfectBonus : 0;
  const total = effectiveBase + tip + comboBonus + perfectBonus;
  s.coins += total;
  const levelBefore = levelFor(s.served);
  s.served += 1;
  s.combo += 1;
  // v21 P1: statistik hari.
  if (isPerfect) s.stats.perfect += 1;
  if (order.vip) s.stats.vip += 1;
  if (order.paket) s.stats.paket += 1;
  if (s.rushActive) s.stats.rushServes += 1;
  s.stats.bestCombo = Math.max(s.stats.bestCombo, s.combo);
  // v22 Q2: pelanggan yang disajikan (untuk baris wajah di layar akhir).
  s.servedCustomers.push(order.customer);
  // v22 Q4: denyut koin di header.
  s.coinPulse = RULES.coinPulseSeconds;
  s.floatText = { text: '+Rp ' + total, t: 1.2 };
  s.perfect = isPerfect ? { text: 'SEMPURNA!', t: 1.5 } : null;
  // v20 S2: wajah pelanggan senang di panel PIRING.
  s.servedFace = { customer: order.customer, t: 1.2 };
  // v24 T3: wajah pelanggan senang naik & memudar di posisi tiket.
  s.servedTicket = { customer: order.customer, y: 88 + idx * (196 + 12), t: RULES.servedTicketSeconds };
  // v20 S1: suara saji (SEMPURNA! beda nadanya).
  pushSfx(s, isPerfect ? 'perfect' : 'serve');
  // v20 S3: naik level tiap 4 saji.
  const levelAfter = levelFor(s.served);
  s.level = levelAfter;
  // v25 U3: banner "LEVEL n!" saat level naik.
  if (levelAfter > levelBefore) {
    s.levelUp = { text: 'LEVEL ' + levelAfter + '!', t: RULES.levelUpSeconds };
  }
  // v19 S3: rincian bayaran (hanya bagian yang > 0).
  const parts = [effectiveBase + ' dasar'];
  if (tip > 0) parts.push(tip + ' tip' + (s.rushActive ? ' (RUSH +2)' : ''));
  if (comboBonus > 0) parts.push(comboBonus + ' kombo');
  if (perfectBonus > 0) parts.push(perfectBonus + ' SEMPURNA!');
  s.breakdown = parts.join(' + ') + ' = Rp ' + total + (order.vip ? ' (VIP x2)' : '') + (order.paket ? ' (PAKET)' : '');
  s.orders.splice(idx, 1);
  s.plate = [];
  s.prepared = {};
  s.patience = Math.max(RULES.patienceMin, s.patience - RULES.patienceStep);
  const vipPrefix = order.vip ? 'VIP! ' : '';
  const rushPrefix = s.rushActive ? 'RUSH! ' : '';
  const paketLabel = order.paket ? 'PAKET ' : '';
  if (levelAfter > levelBefore) {
    pushSfx(s, 'levelUp');
    setMessage(s, 'Level ' + levelAfter + '! Pesanan makin cepat, paket & VIP makin sering!');
  } else {
    setMessage(s, isPerfect
      ? 'SEMPURNA! ' + vipPrefix + rushPrefix + paketLabel + dish.label + ' disajikan! +Rp ' + total + '.'
      : vipPrefix + rushPrefix + paketLabel + dish.label + ' disajikan! +Rp ' + total + '.');
  }
  // v19 S3 + S6: partikel koin + sparkle Cling.
  spawnServeFx(s);
  if (s.served >= RULES.servesToWin) {
    s.screen = 'win';
    pushSfx(s, 'win');
    setMessage(s, 'Hari selesai! Total Rp ' + s.coins + '.');
  }
  return true;
}

export function setMessage(s, text) {
  s.message = text;
  s.messageT = 3;
}

export function tick(s, dt) {
  // v23 R2: timer layar akhir maju saat win/over (untuk konfeti).
  if (s.screen === 'win' || s.screen === 'over') {
    s.endT += dt;
    return;
  }
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
  // v20 S2: wajah saji memudar.
  if (s.servedFace) {
    s.servedFace.t -= dt;
    if (s.servedFace.t <= 0) s.servedFace = null;
  }
  // v24 T3: wajah tiket memudar.
  if (s.servedTicket) {
    s.servedTicket.t -= dt;
    if (s.servedTicket.t <= 0) s.servedTicket = null;
  }
  // v25 U3: banner LEVEL memudar.
  if (s.levelUp) {
    s.levelUp.t -= dt;
    if (s.levelUp.t <= 0) s.levelUp = null;
  }
  // v26 V3: efek HANGUS! memudar.
  if (s.strikeFlash) {
    s.strikeFlash.t -= dt;
    if (s.strikeFlash.t <= 0) s.strikeFlash = null;
  }
  // v22 Q4: denyut koin berkurang.
  if (s.coinPulse > 0) s.coinPulse = Math.max(0, s.coinPulse - dt);
  // v19 S3/S6: partikel koin + sparkle Cling bergerak & memudar.
  for (let i = s.coinFx.length - 1; i >= 0; i--) {
    const p = s.coinFx[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 160 * dt;
    p.t -= dt;
    if (p.t <= 0) s.coinFx.splice(i, 1);
  }
  for (let i = s.sparkles.length - 1; i >= 0; i--) {
    const p = s.sparkles[i];
    p.rot += p.vr * dt;
    p.t -= dt;
    if (p.t <= 0) s.sparkles.splice(i, 1);
  }
  // v24 T3: partikel abu-abu Buang bergerak & memudar.
  for (let i = s.clearFx.length - 1; i >= 0; i--) {
    const p = s.clearFx[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 60 * dt;
    p.t -= dt;
    if (p.t <= 0) s.clearFx.splice(i, 1);
  }
  // v19 S6: kilau fresh order baru berkurang.
  for (const o of s.orders) {
    if (o.freshT > 0) o.freshT = Math.max(0, o.freshT - dt);
  }
  // v18 C2: Jam Sibuk RUSH! — mesin waktu: hitung mundur menuju RUSH,
  // lalu hitung mundur durasi RUSH, lalu kembali menunggu RUSH berikutnya.
  // v19 S5: rushEvery 30 dtk.
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
      pushSfx(s, 'rush');
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
      // v26 V3: efek "HANGUS!" merah di tengah layar.
      s.strikeFlash = { text: 'HANGUS!', t: RULES.strikeFlashSeconds };
      pushSfx(s, 'strike');
      setMessage(s, dish.label + ' hangus! Strike ' + s.strikes + '/' + RULES.strikesMax + '.');
      if (s.strikes >= RULES.strikesMax) {
        s.screen = 'over';
        pushSfx(s, 'over');
        setMessage(s, 'Shift berakhir. Total Rp ' + s.coins + '.');
        return;
      }
    }
  }
  // Order baru setelah slot kosong — lebih cepat saat RUSH (v18 C2),
  // dan makin cepat tiap level (v20 S3).
  if (s.orders.length < RULES.ordersMax) {
    s.orderTimer += dt;
    const gap = s.rushActive ? RULES.rushOrderGap : levelOrderGap(s);
    if (s.orderTimer >= gap) {
      s.orderTimer = 0;
      spawnOrder(s);
    }
  } else {
    s.orderTimer = 0;
  }
}
