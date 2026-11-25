// Dapur Kilat v23 — preset screenshot (4 keadaan deterministik).
// main.js memanggil applyShot(s, name) via ?shot=name (v21: shots.js
// harus mengekspor makeShot DAN applyShot).
// v23: end menampilkan konfeti (endT 2.5); start menampilkan tagline;
// play menampilkan countdown RUSH + progress level; serve menampilkan
// ikon udang di header + tombol Buang (piring kosong -> tidak tampil).
// Judul: seperti v22 (kartu menu + keycap) + tagline v23.
// Main: seperti v22 (wajah pelanggan di tiket, Lv) + progres v21.

import { createState } from './state.js';

export const SHOTS = ['start', 'play', 'serve', 'end'];

export function makeShot(name) {
  const s = createState();
  s.screen = 'main';
  if (name === 'start') {
    s.screen = 'title';
    return s;
  }
  if (name === 'play') {
    s.coins = 54;
    s.served = 6;
    s.combo = 3;
    s.level = 2;
    // v22 Q1: RUSH aktif dengan sisa 8.4 dtk -> tampil "RUSH! 8 dtk";
    // served 6 -> level tampil "Lv 2 (2/4)".
    s.rushActive = true;
    s.rushTimer = 8.4;
    s.time = 42;
    // v22 Q3: tangan pegang udang -> ikon udang di header.
    s.hand = 'udang';
    s.orders = [
      { dish: 'nasgor', patience: 22, max: 42, vip: false, special: true, paket: null, freshT: 0, customer: 2 },
      { dish: 'burger', patience: 15, max: 40.5, vip: true, special: false, paket: null, freshT: 0, customer: 0 },
      { dish: 'esteh', patience: 8, max: 39, vip: false, special: false, paket: null, freshT: 0, customer: 4 },
    ];
    s.plate = ['nasi', 'telur', 'kecap', 'udang'];
    s.prepared = {};
    return s;
  }
  if (name === 'serve') {
    s.coins = 98;
    s.served = 7;
    s.combo = 4;
    s.level = 2;
    s.time = 62;
    s.orders = [
      { dish: 'spaghetti', patience: 20, max: 40.5, vip: false, special: true, paket: null, freshT: 0, customer: 1 },
      { dish: 'miegoreng', patience: 26, max: 39, vip: false, special: false, paket: null, freshT: 0, customer: 3 },
      { dish: 'lemonsquash', patience: 12, max: 37.5, vip: true, special: false, paket: null, freshT: 0, customer: 5 },
    ];
    s.plate = [];
    s.floatText = { text: '+Rp 29', t: 1.2 };
    s.perfect = { text: 'SEMPURNA!', t: 1.5 };
    s.breakdown = '19 dasar + 6 tip + 3 kombo = Rp 29';
    s.message = 'SEMPURNA! Nasi Goreng disajikan! +Rp 29.';
    s.servedFace = { customer: 2, t: 1.2 };
    // v22 Q3: tangan pegang udang (bahan berikutnya) -> ikon udang di
    // header (RUSH tidak aktif di shot ini).
    s.hand = 'udang';
    return s;
  }
  if (name === 'end') {
    s.screen = 'win';
    s.coins = 210;
    s.served = 12;
    s.time = 514;
    s.level = 3;
    s.stats = { perfect: 7, vip: 3, paket: 2, bestCombo: 5, rushServes: 2 };
    // v22 Q2: 12 pelanggan yang disajikan (baris wajah di layar akhir).
    s.servedCustomers = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5];
    // v23 R2: konfeti sudah jatuh (endT 2.5 dtk).
    s.endT = 2.5;
    return s;
  }
  return s;
}

export function applyShot(s, name) {
  const p = makeShot(name);
  for (const k of Object.keys(p)) s[k] = p[k];
}
