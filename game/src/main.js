// Dapur Kilat v2 — wiring: game loop, screens, clicks and keys.
import { LAYOUT, cardRect, ticketRect, plateSlots } from './config.js';
import {
  createGame, startDay, tickState, pickIngredient, clickStation,
  clickPlate, tryServe, matchingOrder, counterIngredients,
} from './state.js';
import { createInput } from './input.js';
import { setupCanvas, drawGame, inRect } from './render.js';

const canvas = document.getElementById('game');
const ctx = setupCanvas(canvas);
const input = createInput(canvas);

export const game = {
  state: createGame(),
  input,
  canvas,
  ctx,
};

// Which plated ingredient (if any) sits under point p?
function plateHit(state, p) {
  const cx = LAYOUT.plate.x;
  const cy = LAYOUT.plate.y;
  const slots = plateSlots(state.plate.length, cx, cy, LAYOUT.plate.r - 26);
  for (let i = 0; i < slots.length; i++) {
    const dx = p.x - slots[i].x;
    const dy = p.y - slots[i].y;
    if (dx * dx + dy * dy <= 26 * 26) return i;
  }
  return -1;
}

function handleClick(p) {
  const state = game.state;
  if (state.screen === 'title') {
    startDay(state);
    return;
  }
  if (state.screen === 'dayComplete' || state.screen === 'gameOver') {
    startDay(state);
    return;
  }
  if (state.screen === 'paused') {
    state.screen = 'playing';
    return;
  }
  if (state.screen !== 'playing') return;

  if (inRect(p, LAYOUT.serve)) {
    tryServe(state);
    return;
  }
  if (inRect(p, LAYOUT.stations.talenan)) {
    clickStation(state, 'talenan');
    return;
  }
  if (inRect(p, LAYOUT.stations.kompor)) {
    clickStation(state, 'kompor');
    return;
  }
  if (inRect(p, LAYOUT.stations.piring)) {
    if (state.hand) clickPlate(state, -1);
    else {
      const idx = plateHit(state, p);
      if (idx >= 0) clickPlate(state, idx);
    }
    return;
  }
  for (let i = 0; i < 3; i++) {
    if (inRect(p, ticketRect(i))) {
      const order = state.orders[i];
      const m = matchingOrder(state);
      if (order && m && m.id === order.id) tryServe(state);
      else state.message = 'Piring belum cocok dengan pesanan ini — lengkapi dulu.';
      return;
    }
  }
  const slots = counterIngredients(state);
  for (let i = 0; i < 6; i++) {
    if (inRect(p, cardRect(i))) {
      pickIngredient(state, slots[i]);
      return;
    }
  }
}

function handleKey(key) {
  const state = game.state;
  if (key === 'Enter') {
    if (state.screen === 'title' || state.screen === 'dayComplete' || state.screen === 'gameOver') {
      startDay(state);
    }
    return;
  }
  if (key === 'p') {
    if (state.screen === 'playing') state.screen = 'paused';
    else if (state.screen === 'paused') state.screen = 'playing';
    return;
  }
  if (key === 'r') {
    if (state.screen !== 'title') startDay(state);
    return;
  }
  if (state.screen !== 'playing') return;
  if (key === ' ') {
    tryServe(state);
    return;
  }
  if (key >= '1' && key <= '6') {
    const slots = counterIngredients(state);
    pickIngredient(state, slots[Number(key) - 1]);
  }
}

function hoverPointer() {
  const state = game.state;
  const p = input.mouse;
  let hot = false;
  if (state.screen !== 'playing') {
    hot = true;
  } else {
    hot = inRect(p, LAYOUT.serve)
      || inRect(p, LAYOUT.stations.talenan)
      || inRect(p, LAYOUT.stations.kompor)
      || inRect(p, LAYOUT.stations.piring)
      || [0, 1, 2].some((i) => inRect(p, ticketRect(i)))
      || [0, 1, 2, 3, 4, 5].some((i) => inRect(p, cardRect(i)));
  }
  canvas.style.cursor = hot ? 'pointer' : 'default';
}

// Auto-pause when the tab is hidden, so the shift never runs away.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state.screen === 'playing') game.state.screen = 'paused';
});

let last = 0;
function frame(ts) {
  const t = ts / 1000;
  const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016);
  last = ts;
  let click;
  while ((click = input.consumeClick())) handleClick(click);
  let key;
  while ((key = input.consumeKey())) handleKey(key);
  tickState(game.state, dt);
  hoverPointer();
  drawGame(ctx, game.state, input, t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
