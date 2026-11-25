// Dapur Kilat v11 — loop utama + render DPR + mode screenshot.
// Mode biasa: requestAnimationFrame, dt dijepit, input aktif.
// Mode ?shot=start|play|serve|end: bangun preset dari shots.js, render sekali
// dengan waktu dibekukan (untuk screenshot yang deterministik).
import { W, H } from './config.js';
import { createState, tick } from './state.js';
import { attachInput } from './input.js';
import { draw } from './render.js';
import { buildShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function setupCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function main() {
  setupCanvas();
  window.addEventListener('resize', setupCanvas);
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const s = createState();
  const input = attachInput(canvas, s);
  if (shot) {
    // Mode screenshot: preset beku, render sekali, tanpa loop.
    buildShot(s, shot);
    draw(ctx, s, input.mouse, 0);
    document.title = `Dapur Kilat — shot ${shot}`;
    return;
  }
  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    tick(s, dt);
    draw(ctx, s, input.mouse, now / 1000);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

main();
