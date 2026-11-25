// Dapur Kilat v11 — input keyboard + mouse (tanpa logika game).
// Klik: kartu bahan -> ambil; stasiun -> olah/ambil hasil; piring -> taruh;
// tombol SAJIKAN / tiket -> sajikan; tombol judul -> mulai; kartu akhir -> main lagi.
// Tombol: 1-6 pilih bahan, Spasi sajikan, R ulangi, P jeda.
// Tab disembunyikan -> auto-pause.
import { LAYOUT } from './config.js';
import {
  pickIngredient, useStation, placeOnPlate, serve,
  startDay, restartDay, togglePause,
} from './state.js';

export function pointInRect(x, y, r) {
  return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
}

// Rect kartu bahan ke-i (6 kartu dalam LAYOUT.kartu).
export function cardRectAt(i) {
  const k = LAYOUT.kartu;
  const w = (k.w - (6 - 1) * k.gap) / 6;
  return { x: k.x + i * (w + k.gap), y: k.y, w, h: k.h };
}

// Rect tiket ke-i (3 tiket dalam LAYOUT.papan).
export function ticketRectAt(i) {
  const t = LAYOUT.tiket;
  return { x: t.x, y: t.y + i * (t.h + t.gap), w: t.w, h: t.h };
}

// Arahkan satu klik (koordinat canvas 1280x720) ke aksi state.
export function handleClick(s, x, y) {
  if (s.screen === 'title') {
    if (pointInRect(x, y, LAYOUT.tombolJudul)) startDay(s);
    return;
  }
  if (s.screen === 'win' || s.screen === 'over') {
    if (pointInRect(x, y, LAYOUT.kartuAkhir)) restartDay(s);
    return;
  }
  if (s.screen !== 'main') return;
  // Tombol SAJIKAN.
  if (pointInRect(x, y, LAYOUT.sajikan)) {
    serve(s, -1);
    return;
  }
  // Stasiun talenan / kompor.
  if (pointInRect(x, y, LAYOUT.talenan)) {
    useStation(s, 'talenan');
    return;
  }
  if (pointInRect(x, y, LAYOUT.kompor)) {
    useStation(s, 'kompor');
    return;
  }
  // Piring (taruh bahan dari tangan).
  if (pointInRect(x, y, LAYOUT.piring)) {
    placeOnPlate(s);
    return;
  }
  // Tiket pesanan (sajikan ke slot itu bila piring cocok).
  for (let i = 0; i < 3; i++) {
    if (pointInRect(x, y, ticketRectAt(i))) {
      serve(s, i);
      return;
    }
  }
  // Kartu bahan di meja.
  for (let i = 0; i < 6; i++) {
    if (pointInRect(x, y, cardRectAt(i))) {
      const id = s.counter[i];
      if (id) pickIngredient(s, id);
      return;
    }
  }
}

// Arahkan satu tombol keyboard ke aksi state.
export function handleKey(s, key) {
  if (key === 'p' || key === 'P') {
    togglePause(s);
    return;
  }
  if (key === 'r' || key === 'R') {
    if (s.screen === 'main' || s.screen === 'win' || s.screen === 'over') restartDay(s);
    return;
  }
  if (s.screen !== 'main' || s.paused) return;
  if (key === ' ') {
    serve(s, -1);
    return;
  }
  const n = parseInt(key, 10);
  if (n >= 1 && n <= 6) {
    const id = s.counter[n - 1];
    if (id) pickIngredient(s, id);
  }
}

// Pasang listener DOM ke canvas; kembalikan objek mouse (untuk badge tangan).
export function attachInput(canvas, s) {
  const mouse = { x: 0, y: 0, inside: false };
  function toGame(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (1280 / r.width),
      y: (e.clientY - r.top) * (720 / r.height),
    };
  }
  canvas.addEventListener('mousemove', (e) => {
    const p = toGame(e);
    mouse.x = p.x;
    mouse.y = p.y;
    mouse.inside = true;
  });
  canvas.addEventListener('mouseleave', () => { mouse.inside = false; });
  canvas.addEventListener('click', (e) => {
    const p = toGame(e);
    handleClick(s, p.x, p.y);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ') e.preventDefault();
    handleKey(s, e.key);
  });
  // Auto-pause saat tab disembunyikan.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && s.screen === 'main' && !s.paused) togglePause(s);
  });
  return { mouse };
}
