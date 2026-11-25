// Dapur Kilat v18 — preset screenshot untuk dossier.
// ?shot=start|play|serve|end — tiap preset menyusun state yang menampilkan
// adegan berbeda: judul, bermain, piring siap saji, dan akhir hari.
// v18: preset play menampilkan RUSH aktif (header oranye + "⚡ RUSH!") +
// Nasi Goreng SPESIAL (Rp 21) + Mie Goreng VIP + Strawberry Squash URGENT;
// preset serve menampilkan Lemon Squash SPESIAL + kilau emas kombo x3;
// preset end menampilkan Es Teh SPESIAL.

import { DISHES } from './config.js';
import { spawnOrder, startGame } from './state.js';

const SHOTS = {
  // Layar judul: hero 7 hidangan.
  start(s) {
    s.screen = 'title';
  },
  // Tengah permainan + RUSH: koin 45, saji 4/12, kombo x2, waktu 20,
  // 3 order (nasgor SPESIAL + MIE GORENG VIP + strawberry squash URGENT 8 dtk),
  // kedua stasiun sibuk, piring 3 bahan (nasi+telur+kecap), tangan udang.
  // Header oranye + "⚡ RUSH!" (jam sibuk aktif).
  play(s) {
    startGame(s);
    s.coins = 45;
    s.served = 4;
    s.combo = 2;
    s.time = 20;
    s.specialDish = 'nasgor';
    s.rushActive = true;
    s.rushTimer = 12;
    s.orders = [
      { dish: 'nasgor', patience: 30, max: 45, vip: false, special: true },
      { dish: 'miegoreng', patience: 38, max: 45, vip: true, special: false },
      { dish: 'strawsquash', patience: 8, max: 45, vip: false, special: false },
    ];
    s.stations.talenan = { item: 'udang', t: 1.2, total: 2.0 };
    s.stations.kompor = { item: 'nasi', t: 2.0, total: 3.2 };
    s.plate = ['nasi', 'telur', 'kecap'];
    s.hand = 'udang';
    s.message = '⚡ RUSH! Pesanan datang lebih cepat, tip +Rp 2!';
    s.messageT = 10;
  },
  // Piring lengkap siap saji + SEMPURNA!: koin 80, saji 7/12, kombo x3,
  // waktu 34, float '+Rp 27' (24 + bonus SEMPURNA! 3), teks "SEMPURNA!".
  // Order: spaghetti (saus natural) + BURGER VIP + lemon squash SPESIAL.
  // Kombo x3 -> kilau emas di panel PIRING + teks kombo emas (v18 C4).
  serve(s) {
    startGame(s);
    s.coins = 80;
    s.served = 7;
    s.combo = 3;
    s.time = 34;
    s.specialDish = 'lemonsquash';
    s.rushActive = false;
    s.orders = [
      { dish: 'spaghetti', patience: 42, max: 45, vip: false, special: false },
      { dish: 'burger', patience: 35, max: 45, vip: true, special: false },
      { dish: 'lemonsquash', patience: 40, max: 45, vip: false, special: true },
    ];
    s.plate = ['spaghetti', 'daging', 'saus', 'keju'];
    s.floatText = { text: '+Rp 27', t: 1.2 };
    s.perfect = { text: 'SEMPURNA!', t: 1.5 };
    s.message = 'SEMPURNA! Spaghetti Bolognese disajikan! +Rp 27.';
    s.messageT = 10;
  },
  // Akhir hari: koin 210, saji 12/12, kombo x5, waktu 514, 1 strike.
  // Es Teh SPESIAL + Strawberry Squash VIP di papan.
  end(s) {
    startGame(s);
    s.coins = 210;
    s.served = 12;
    s.combo = 5;
    s.time = 514;
    s.strikes = 1;
    s.specialDish = 'esteh';
    s.rushActive = false;
    s.orders = [
      { dish: 'esteh', patience: 45, max: 45, vip: false, special: true },
      { dish: 'burger', patience: 45, max: 45, vip: false, special: false },
      { dish: 'strawsquash', patience: 45, max: 45, vip: true, special: false },
    ];
    s.screen = 'win';
    s.message = 'Hari selesai! Total Rp 210.';
    s.messageT = 10;
  },
};

export function hasShot(name) {
  return Object.prototype.hasOwnProperty.call(SHOTS, name);
}

export function applyShot(s, name) {
  SHOTS[name](s);
}
