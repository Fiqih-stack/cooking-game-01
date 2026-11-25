// Dapur Kilat v23 — input (mouse + keyboard).
// Klik: bahan di meja (18 kartu, 2 baris x 9), stasiun, piring,
// tombol SAJIKAN, tiket, tombol judul, tombol upgrade (v19 S1),
// tombol speaker (v20 S1, bisukan), tombol Buang (v23 R1, kosongkan
// piring — dicek SEBELUM piring karena tombol ada di dalam panel PIRING).
// Tombol 1-9: baris 1 counter. Tombol A,S,D,F,G,H,J,K,L: baris 2 counter.
// Spasi: sajikan. R: restart. P: jeda. M: bisukan suara.
// v20: setiap gestur memanggil sound.ensureAudio() (AudioContext butuh
// gestur pengguna; tanpa ini musik/sfx tidak berbunyi).

import { COUNTER, counterCardRect } from './config.js';
import { buyUpgrade, clearPlate, pickIngredient, placeOnPlate, serve, startGame, useStation } from './state.js';
import { ensureAudio, setMuted } from './sound.js';

// Tombol baris 2 counter (berurutan dengan COUNTER[9..17]).
const ROW2_KEYS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];

export function setupInput(canvas, s, layout) {
  canvas.addEventListener('click', (e) => {
    ensureAudio();
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (canvas.width / r.width);
    const y = (e.clientY - r.top) * (canvas.height / r.height);
    handleClick(s, x, y, layout);
  });

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    ensureAudio();
    const k = e.key.toLowerCase();
    if (k === 'm') {
      s.muted = !s.muted;
      setMuted(s.muted);
      return;
    }
    if (k === 'p') {
      if (s.screen === 'main') s.paused = !s.paused;
      return;
    }
    if (k === 'r') {
      if (s.screen !== 'title') startGame(s);
      return;
    }
    if (s.screen === 'title') {
      if (k === 'enter' || k === ' ') startGame(s);
      return;
    }
    if (s.screen !== 'main' || s.paused) return;
    if (k === ' ') {
      e.preventDefault();
      serve(s, -1);
      return;
    }
    // Baris 1 counter: tombol 1-9.
    const n = parseInt(k, 10);
    if (n >= 1 && n <= 9) {
      const id = COUNTER[n - 1];
      if (id) pickIngredient(s, id);
      return;
    }
    // Baris 2 counter: tombol A,S,D,F,G,H,J,K,L.
    const row2 = ROW2_KEYS.indexOf(k);
    if (row2 >= 0) {
      const id = COUNTER[9 + row2];
      if (id) pickIngredient(s, id);
    }
  });

  // Auto-pause saat tab disembunyikan.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && s.screen === 'main' && !s.paused) s.paused = true;
  });
}

function inside(x, y, box) {
  return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
}

function handleClick(s, x, y, L) {
  if (s.screen === 'title') {
    if (inside(x, y, L.tombolJudul)) startGame(s);
    return;
  }
  if (s.screen === 'win' || s.screen === 'over') {
    // Klik kartu akhir = main lagi.
    if (inside(x, y, L.kartuAkhir)) startGame(s);
    return;
  }
  if (s.screen !== 'main' || s.paused) return;

  // v20 S1: tombol speaker (bisukan) di pojok kanan header.
  if (inside(x, y, L.tombolSpeaker)) {
    s.muted = !s.muted;
    setMuted(s.muted);
    return;
  }
  // v19 S1: tombol upgrade stasiun di footer.
  if (inside(x, y, L.tombolUpgrade.talenan)) { buyUpgrade(s, 'talenan'); return; }
  if (inside(x, y, L.tombolUpgrade.kompor)) { buyUpgrade(s, 'kompor'); return; }
  // Tombol SAJIKAN.
  if (inside(x, y, L.sajikan)) { serve(s, -1); return; }
  // Stasiun.
  if (inside(x, y, L.talenan)) { useStation(s, 'talenan'); return; }
  if (inside(x, y, L.kompor)) { useStation(s, 'kompor'); return; }
  // v23 R1: tombol Buang (kosongkan piring) — dicek SEBELUM piring
  // karena tombol ada di dalam area panel PIRING.
  if (inside(x, y, L.tombolBuang)) { clearPlate(s); return; }
  // Piring.
  if (inside(x, y, L.piring)) { placeOnPlate(s); return; }
  // Tiket pesanan (klik = sajikan tiket itu).
  for (let i = 0; i < s.orders.length; i++) {
    const t = {
      x: L.tiket.x,
      y: L.tiket.y + i * (L.tiket.h + L.tiket.gap),
      w: L.tiket.w,
      h: L.tiket.h,
    };
    if (inside(x, y, t)) { serve(s, i); return; }
  }
  // Kartu bahan di meja (18 kartu, 2 baris x 9) — grid yang sama
  // dengan render.js via counterCardRect (pelajaran v15).
  for (let i = 0; i < COUNTER.length; i++) {
    const card = counterCardRect(L, i);
    if (inside(x, y, card)) {
      pickIngredient(s, COUNTER[i]);
      return;
    }
  }
}
