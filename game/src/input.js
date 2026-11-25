// Dapur Kilat v2 — mouse + keyboard input. DOM only; no game logic here.
import { CANVAS_W, CANVAS_H } from './config.js';

export function createInput(canvas) {
  const input = {
    mouse: { x: -100, y: -100 },
    mouseDown: false,
    _clicks: [],
    _keys: [],
  };

  function toLocal(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * CANVAS_W) / r.width,
      y: ((e.clientY - r.top) * CANVAS_H) / r.height,
    };
  }

  canvas.addEventListener('pointermove', (e) => {
    input.mouse = toLocal(e);
  });
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    input.mouse = toLocal(e);
    input.mouseDown = true;
    input._clicks.push({ x: input.mouse.x, y: input.mouse.y });
  });
  window.addEventListener('pointerup', () => {
    input.mouseDown = false;
  });
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === ' ') e.preventDefault();
    input._keys.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  });

  input.consumeClick = () => input._clicks.shift() || null;
  input.consumeKey = () => input._keys.shift() || null;
  return input;
}
