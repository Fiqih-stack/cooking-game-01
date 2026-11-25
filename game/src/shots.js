// Dapur Kilat v19 — preset state untuk 4 screenshot.
// Dipakai via ?shot=start|play|serve|end. Semua nilai eksplisit agar
// screenshot deterministik (tidak bergantung pada Math.random).
import { DISHES } from './config.js';

function baseMain(s) {
  s.screen = 'main';
  s.time = 0;
  s.coins = 0;
  s.served = 0;
  s.combo = 0;
  s.strikes = 0;
  s.patience = 45;
  s.orders = [];
  s.orderTimer = 0;
  s.hand = null;
  s.plate = [];
  s.prepared = {};
  s.stations = { talenan: null, kompor: null };
  s.message = '';
  s.messageT = 3;
  s.floatText = null;
  s.perfect = null;
  s.paused = false;
  s.rushActive = false;
  s.rushTimer = 0;
  s.rushNext = 30;
  s.specialDish = null;
  s.upg = { talenan: 0, kompor: 0 };
  s.coinFx = [];
  s.sparkles = [];
  s.breakdown = '';
}

export function applyShot(s, shot) {
  if (shot === 'start') {
    s.screen = 'title';
    s.time = 0;
    return;
  }
  if (shot === 'play') {
    baseMain(s);
    s.time = 20;
    s.coins = 45;
    s.served = 4;
    s.combo = 2;
    s.specialDish = 'nasgor';
    s.upg = { talenan: 1, kompor: 0 };
    // RUSH aktif.
    s.rushActive = true;
    s.rushTimer = 8;
    s.rushNext = 30;
    s.message = '⚡ RUSH! Pesanan datang lebih cepat, tip +Rp 2!';
    s.messageT = 3;
    // 3 order: nasgor spesial, miegoreng VIP, strawsquash urgent.
    s.orders = [
      { dish: 'nasgor', patience: 30, max: 45, vip: false, special: true, paket: null, freshT: 0 },
      { dish: 'miegoreng', patience: 38, max: 45, vip: true, special: false, paket: null, freshT: 0 },
      { dish: 'strawsquash', patience: 8, max: 45, vip: false, special: false, paket: null, freshT: 0 },
    ];
    // Piring: nasi + telur + kecap (nasgor sebagian).
    s.plate = ['nasi', 'telur', 'kecap'];
    s.prepared = {};
    s.hand = 'udang';
    s.stations = {
      talenan: { item: 'udang', t: 1.2, total: 1.4 },
      kompor: { item: 'nasi', t: 2.0, total: 3.2 },
    };
    return;
  }
  if (shot === 'serve') {
    baseMain(s);
    s.time = 34;
    s.coins = 80;
    s.served = 7;
    s.combo = 3;
    s.specialDish = 'lemonsquash';
    s.upg = { talenan: 1, kompor: 0 };
    s.rushActive = false;
    s.message = 'SEMPURNA! Spaghetti Bolognese disajikan! +Rp 27.';
    s.messageT = 3;
    // PAKET burger + esteh (18 + 11 + 5 = Rp 34).
    s.orders = [
      { dish: 'spaghetti', patience: 42, max: 45, vip: false, special: false, paket: null, freshT: 0 },
      { dish: 'burger', patience: 35, max: 45, vip: true, special: false, paket: null, freshT: 0 },
      { dish: 'burger', patience: 40, max: 45, vip: false, special: false, paket: ['burger', 'esteh'], freshT: 1.2 },
    ];
    // Piring: spaghetti lengkap.
    s.plate = ['spaghetti', 'daging', 'saus', 'keju'];
    s.prepared = {};
    s.hand = null;
    s.stations = { talenan: null, kompor: null };
    s.perfect = { text: 'SEMPURNA!', t: 1.5 };
    s.floatText = { text: '+Rp 27', t: 1.2 };
    s.breakdown = '17 dasar + 6 tip + 3 kombo + 3 SEMPURNA! = Rp 27';
    // v19 S3/S6: partikel koin + sparkle Cling terlihat di shot.
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i - 4) * 0.25;
      s.coinFx.push({
        x: 752 + (i - 4) * 14, y: 188 - i * 8,
        vx: Math.cos(a) * 200 - 80, vy: Math.sin(a) * 200,
        t: 0.6, life: 0.8,
      });
    }
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      s.sparkles.push({
        x: 752 + Math.cos(a) * (40 + (i % 3) * 18),
        y: 188 + Math.sin(a) * 30,
        r: 7 + (i % 3) * 3, rot: i * 0.6, vr: 1.5, t: 0.7, life: 0.9,
      });
    }
    return;
  }
  if (shot === 'end') {
    baseMain(s);
    s.screen = 'win';
    s.time = 514;
    s.coins = 210;
    s.served = 12;
    s.combo = 5;
    s.strikes = 1;
    s.specialDish = 'esteh';
    s.upg = { talenan: 2, kompor: 1 };
    s.message = 'Hari selesai! Total Rp 210.';
    s.orders = [
      { dish: 'esteh', patience: 45, max: 45, vip: false, special: true, paket: null, freshT: 0 },
      { dish: 'burger', patience: 45, max: 45, vip: false, special: false, paket: null, freshT: 0 },
      { dish: 'strawsquash', patience: 45, max: 45, vip: true, special: false, paket: null, freshT: 0 },
    ];
    return;
  }
}
