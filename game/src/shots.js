// Dapur Kilat v2 — staged screenshots (?shot=start|play|serve|end).
// Each shot freezes time so the captured frame is stable.
import { game } from './main.js';
import { recipeById } from './config.js';
import { startDay } from './state.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) stageShot(shot);

function stageShot(name) {
  const s = game.state;
  s.frozen = true;
  s.shotTime = 1.6;
  if (name === 'start') {
    s.screen = 'title';
    return;
  }
  startDay(s);
  s.frozen = true;
  s.shotTime = 1.6;
  if (name === 'play') {
    // Mid-play: both stations busy, two ingredients plated, hand holds kecap.
    s.coins = 45;
    s.served = 4;
    s.combo = 2;
    s.bestCombo = 3;
    s.time = 20;
    s.orders = [
      { id: 3, recipe: recipeById('nasi-goreng'), patience: 34, patienceMax: 45 },
      { id: 4, recipe: recipeById('mie-ayam'), patience: 21, patienceMax: 40 },
      { id: 5, recipe: recipeById('sate-ayam'), patience: 13, patienceMax: 35 },
    ];
    s.nextOrderId = 6;
    s.stations.talenan = { ing: 'es', progress: 0.5, duration: 2.0, done: false };
    s.stations.kompor = { ing: 'mie', progress: 0.6, duration: 3.2, done: false };
    s.plate = ['nasi', 'ayam'];
    s.hand = { id: 'kecap', processed: true };
    game.input.mouse = { x: 590, y: 345 };
    s.message = 'Nasi Goreng hampir jadi!';
  } else if (name === 'serve') {
    s.coins = 80;
    s.served = 7;
    s.combo = 3;
    s.bestCombo = 4;
    s.time = 34;
    s.orders = [
      { id: 8, recipe: recipeById('nasi-goreng'), patience: 23, patienceMax: 45 },
      { id: 9, recipe: recipeById('es-teh'), patience: 34, patienceMax: 45 },
      { id: 10, recipe: recipeById('mie-ayam'), patience: 30, patienceMax: 40 },
    ];
    s.nextOrderId = 11;
    s.plate = ['nasi', 'ayam', 'kecap'];
    s.hand = null;
    s.message = 'Siap disajikan!';
    s.floats = [{ x: 880, y: 130, text: '+Rp 24', life: 1.2, max: 1.2 }];
  } else if (name === 'end') {
    s.coins = 210;
    s.served = 12;
    s.combo = 5;
    s.bestCombo = 5;
    s.time = 514;
    s.strikes = 1;
    s.screen = 'dayComplete';
  }
}
