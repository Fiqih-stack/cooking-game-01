// Super Kitchen v28 — main (loop game + wiring).
// v20: kuras antrean s.sfx tiap frame (mainkan suara) + kelola musik latar.
import { createState, tick } from './state.js';
import { render } from './render.js';
import { setupInput } from './input.js';
import { LAYOUT } from './config.js';
import { applyShot } from './shots.js';
import { playSfx, setMuted, updateMusic } from './sound.js';

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
  // v20 S1: kuras antrean suara + sinkron bisu + musik latar.
  setMuted(s.muted);
  if (s.sfx && s.sfx.length > 0) {
    for (const name of s.sfx) playSfx(name);
    s.sfx.length = 0;
  }
  updateMusic(s.screen === 'main' && !s.paused && !s.muted);
  render(ctx, s);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
