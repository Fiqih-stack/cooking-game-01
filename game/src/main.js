// Dapur Kilat v14 — loop utama & titik masuk.
// Render tiap frame; tick logika dengan delta waktu.

import { LAYOUT } from './config.js';
import { setupInput } from './input.js';
import { render } from './render.js';
import { applyShot, hasShot } from './shots.js';
import { createState, tick } from './state.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = createState();

// Preset screenshot (?shot=start|play|serve|end) untuk dossier.
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot && hasShot(shot)) applyShot(state, shot);

setupInput(canvas, state, LAYOUT);

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  tick(state, dt);
  render(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
