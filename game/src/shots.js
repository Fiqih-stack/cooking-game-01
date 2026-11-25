// Dapur Kilat v11 — preset screenshot (?shot=start|play|serve|end).
// Setiap preset membangun satu state beku yang sama di setiap render,
// supaya screenshot deterministik dan mewakili permainan nyata.
import { startDay } from './state.js';

function setOrder(s, slot, dish, patience) {
  s.orders[slot] = { dish, patience, maxPatience: 45 };
}

// start: layar judul (state baru, screen 'title').
function shotStart(s) {
  return s;
}

// play: tengah main — koin 45, tersaji 4/12, kombo x2, waktu 20,
// 3 pesanan (Nasi Goreng, Spaghetti Bolognese, Burger),
// kedua stasiun sibuk (udang di talenan, spaghetti di kompor),
// piring 2 bahan Nasi Goreng (nasi + telur), tangan pegang kecap.
function shotPlay(s) {
  startDay(s);
  s.coins = 45;
  s.served = 4;
  s.combo = 2;
  s.elapsed = 20;
  setOrder(s, 0, 'nasgor', 30);
  setOrder(s, 1, 'spaghetti', 18);
  setOrder(s, 2, 'burger', 38);
  s.stations.talenan = { item: 'udang', t: 1.0, total: 2.0 };
  s.stations.kompor = { item: 'spaghetti', t: 1.6, total: 3.2 };
  s.plate = ['nasi', 'telur'];
  s.hand = { id: 'kecap', processed: true };
  s.counter = ['daging', 'saus', 'keju', 'roti', 'patty', 'selada'];
  s.message = 'Nasi Goreng hampir jadi — tambah kecap!';
  return s;
}

// serve: piring Nasi Goreng lengkap siap disajikan — koin 80,
// tersaji 7/12, kombo x3, waktu 34, float '+Rp 24'.
function shotServe(s) {
  startDay(s);
  s.coins = 80;
  s.served = 7;
  s.combo = 3;
  s.elapsed = 34;
  setOrder(s, 0, 'nasgor', 45);
  setOrder(s, 1, 'esteh', 32);
  setOrder(s, 2, 'burger', 12);
  s.stations.talenan = null;
  s.stations.kompor = null;
  s.plate = ['nasi', 'telur', 'kecap', 'udang'];
  s.hand = null;
  s.counter = ['roti', 'patty', 'keju', 'selada', 'teh', 'es'];
  s.floats = [{ text: '+Rp 24', x: 752, y: 150, t: 0 }];
  s.message = 'Nasi Goreng siap disajikan!';
  return s;
}

// end: hari selesai — koin 210, tersaji 12/12, kombo x5,
// waktu 514, 1 strike, layar 'win'.
function shotEnd(s) {
  startDay(s);
  s.coins = 210;
  s.served = 12;
  s.combo = 5;
  s.elapsed = 514;
  s.strikes = 1;
  s.screen = 'win';
  setOrder(s, 0, 'spaghetti', 27);
  setOrder(s, 1, 'spaghetti', 27);
  setOrder(s, 2, 'burger', 27);
  s.stations.talenan = null;
  s.stations.kompor = null;
  s.plate = [];
  s.hand = null;
  s.counter = ['spaghetti', 'daging', 'saus', 'keju', 'roti', 'patty'];
  s.message = 'Hari selesai — semua pesanan tersaji!';
  return s;
}

export function buildShot(s, name) {
  if (name === 'play') return shotPlay(s);
  if (name === 'serve') return shotServe(s);
  if (name === 'end') return shotEnd(s);
  return shotStart(s);
}
