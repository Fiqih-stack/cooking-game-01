// Dapur Kilat v12 — preset screenshot untuk dossier.
// ?shot=start|play|serve|end — tiap preset menyusun state yang menampilkan
// adegan berbeda: judul, bermain, piring siap saji, dan akhir hari.

import { DISHES } from './config.js';
import { spawnOrder, startGame } from './state.js';

const SHOTS = {
  // Layar judul: hero 4 hidangan.
  start(s) {
    s.screen = 'title';
  },
  // Tengah permainan: koin 45, saji 4/12, kombo x2, waktu 20, 3 order,
  // kedua stasiun sibuk, piring 2 bahan, tangan pegang kecap.
  play(s) {
    startGame(s);
    s.coins = 45;
    s.served = 4;
    s.combo = 2;
    s.time = 20;
    s.orders = [
      { dish: 'nasgor', patience: 30, max: 45 },
      { dish: 'spaghetti', patience: 22, max: 45 },
      { dish: 'burger', patience: 38, max: 45 },
    ];
    s.stations.talenan = { item: 'udang', t: 1.2, total: 2.0 };
    s.stations.kompor = { item: 'nasi', t: 2.0, total: 3.2 };
    s.plate = ['nasi', 'telur'];
    s.hand = 'kecap';
    s.message = 'Nasi Goreng hampir jadi — sajikan sebelum hangus!';
    s.messageT = 10;
  },
  // Piring lengkap siap saji: koin 80, saji 7/12, kombo x3, waktu 34,
  // float '+Rp 24'.
  serve(s) {
    startGame(s);
    s.coins = 80;
    s.served = 7;
    s.combo = 3;
    s.time = 34;
    s.orders = [
      { dish: 'spaghetti', patience: 28, max: 45 },
      { dish: 'burger', patience: 35, max: 45 },
      { dish: 'esteh', patience: 40, max: 45 },
    ];
    s.plate = ['spaghetti', 'daging', 'saus', 'keju'];
    s.floatText = { text: '+Rp 24', t: 1.2 };
    s.message = 'Spaghetti Bolognese siap! Sajikan sekarang.';
    s.messageT = 10;
  },
  // Akhir hari: koin 210, saji 12/12, kombo x5, waktu 514, 1 strike.
  end(s) {
    startGame(s);
    s.coins = 210;
    s.served = 12;
    s.combo = 5;
    s.time = 514;
    s.strikes = 1;
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
