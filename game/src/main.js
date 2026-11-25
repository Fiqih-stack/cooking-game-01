// Dapur Kilat v19 — main (loop game + wiring).
import { createState, tick } from './state.js';
import { render } from './render.js';
import { setupInput } from './input.js';
import { LAYOUT } from './config.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const s = createState();

// Shot preset via query (?shot=start|play|serve|end) untuk screenshot.
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  applyShot(s, shot);
}

setupInput(canvas, s, LAYOUT);

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!s.paused) tick(s, dt);
  render(ctx, s);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
